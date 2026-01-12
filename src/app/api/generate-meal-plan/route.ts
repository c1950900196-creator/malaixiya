import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：延长函数执行时间
export const maxDuration = 60; // 60秒

// Helper function to clean JSON string by removing trailing commas
function cleanJsonString(jsonString: string): string {
  return jsonString.replace(/,(\s*[\]}])/g, '$1');
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile, restrictions, day, dayIndex } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // 星期几的映射
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = day || dayNames[dayIndex] || 'Monday';
    
    // 马来西亚菜品列表，用于提示 AI 生成多样化的菜品
    const malaysianDishes = [
      '椰浆饭', '炒粿条', '肉骨茶', '海南鸡饭', '叻沙', '沙爹', '咖喱面',
      '福建面', '云吞面', '板面', '炒米粉', '印度煎饼', '咖椰吐司',
      '娘惹糕', '仁当牛肉', '亚参鱼', '咖喱鸡', '参巴虾', '酿豆腐'
    ];
    
    // 根据 dayIndex 选择不同的推荐菜品，确保每天不同
    const dayOffset = dayIndex || 0;
    const suggestedBreakfast = malaysianDishes[(dayOffset * 3) % malaysianDishes.length];
    const suggestedLunch = malaysianDishes[(dayOffset * 3 + 1) % malaysianDishes.length];
    const suggestedDinner = malaysianDishes[(dayOffset * 3 + 2) % malaysianDishes.length];
    
    // 构建给豆包的提示词 - 只生成 1 天的膳食计划
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join('、')}` : ''}）生成${dayName}的马来西亚膳食计划。

要求：每餐选择不同的马来西亚特色菜，建议参考：早餐${suggestedBreakfast}、午餐${suggestedLunch}、晚餐${suggestedDinner}，但可以选择其他菜品。

返回JSON格式：{"day":"${dayName}","meals":{"breakfast":{"name_zh":"菜名","name_en":"English Name"},"lunch":{"name_zh":"菜名","name_en":"English Name"},"dinner":{"name_zh":"菜名","name_en":"English Name"}}}

只返回JSON，不要解释。`;

    console.log('📤 Calling Doubao API for meal plan generation...');
    console.log('🔧 Prompt length:', prompt.length, 'characters');
    
    // 检查豆包配置
    if (!process.env.DOUBAO_API_ENDPOINT || !process.env.DOUBAO_API_KEY) {
      console.error('❌ Doubao API not configured!');
      return NextResponse.json(
        { 
          error: 'AI API 未配置',
          message: '豆包 API 未配置。请在环境变量中设置 DOUBAO_API_ENDPOINT 和 DOUBAO_API_KEY'
        },
        { status: 500 }
      );
    }
    
    console.log('🔧 Using Doubao endpoint:', process.env.DOUBAO_API_ENDPOINT);
    console.log('🔧 Using model:', process.env.DOUBAO_MODEL);
    
    // 调用豆包API，使用流式输出
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // 55秒超时
      
      const response = await fetch(process.env.DOUBAO_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.DOUBAO_MODEL || 'doubao-seed-1-6-lite-251015',
          messages: [
            {
              role: 'system',
              content: '你是营养师。只返回JSON，无需解释，无需markdown。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
          stream: true,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // 检查响应状态
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Doubao API error:', response.status, errorText);
        return NextResponse.json(
          { 
            error: 'AI 服务调用失败',
            message: `豆包 API 返回错误: ${response.status} - ${errorText.substring(0, 200)}`
          },
          { status: 502 }
        );
      }
      
      // 处理流式响应
      if (!response.body) {
        return NextResponse.json(
          { error: 'AI 服务响应异常', message: '无法获取流式响应' },
          { status: 502 }
        );
      }
      
      console.log('📡 Receiving streaming response from Doubao...');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              fullContent += content;
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
      console.log('✅ Stream complete, received', fullContent.length, 'characters');
      
      // 解析完整的 JSON 响应
      let jsonString = '';
      
      // 尝试多种方式提取JSON
      if (fullContent.includes('```json')) {
        const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      } else if (fullContent.includes('```')) {
        const codeMatch = fullContent.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          jsonString = codeMatch[1];
        }
      } else {
        // 匹配单天的数据格式 {"day":..., "meals":...}
        const jsonMatch = fullContent.match(/\{[\s\S]*"day"[\s\S]*"meals"[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        } else {
          jsonString = fullContent;
        }
      }
      
      // 清理 JSON 字符串：移除 trailing commas
      jsonString = cleanJsonString(jsonString);
      
      // 解析清理后的 JSON
      let result;
      try {
        result = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('Content preview:', fullContent.substring(0, 500));
        return NextResponse.json(
          { 
            error: 'AI 响应解析失败',
            message: 'AI 返回的数据格式不正确，请重试'
          },
          { status: 502 }
        );
      }
      
      if (!result || !result.meals) {
        return NextResponse.json(
          { 
            error: 'AI 响应内容无效',
            message: 'AI 返回的膳食计划格式不正确，请重试'
          },
          { status: 502 }
        );
      }
      
      console.log('✅ Successfully parsed meal plan for', result.day || 'unknown day');
      
      return NextResponse.json(result);
      
    } catch (fetchError: any) {
      console.error('❌ Network error calling Doubao:', fetchError);
      
      // 检查是否是超时错误
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { 
            error: 'AI 服务超时',
            message: 'AI 生成膳食计划超时，请稍后重试'
          },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'AI 服务网络错误',
          message: `无法连接到 AI 服务: ${fetchError.message}`
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('❌ Meal plan generation error:', error);
    return NextResponse.json(
      { error: '服务器内部错误', message: error.message },
      { status: 500 }
    );
  }
}
