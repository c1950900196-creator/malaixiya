import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：延长函数执行时间
export const maxDuration = 60; // 60秒

// Helper function to clean JSON string by removing trailing commas
function cleanJsonString(jsonString: string): string {
  return jsonString.replace(/,(\s*[\]}])/g, '$1');
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile, restrictions } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // 构建给豆包的提示词 - 只生成膳食计划，不含购物清单
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join('、')}` : ''}）生成7天马来西亚膳食计划。

返回JSON格式：
{"plan":[{"day":"Monday","meals":{"breakfast":{"name_zh":"椰浆饭","name_en":"Nasi Lemak"},"lunch":{"name_zh":"炒粿条","name_en":"Char Kway Teow"},"dinner":{"name_zh":"肉骨茶","name_en":"Bak Kut Teh"}}},{"day":"Tuesday","meals":{"breakfast":{"name_zh":"咖椰吐司","name_en":"Kaya Toast"},"lunch":{"name_zh":"海南鸡饭","name_en":"Hainanese Chicken Rice"},"dinner":{"name_zh":"沙爹","name_en":"Satay"}}}]}

只返回7天计划，每天3餐。`;

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
          max_tokens: 1000,
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
        const jsonMatch = fullContent.match(/\{[\s\S]*"plan"[\s\S]*\}/);
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
      
      if (!result || !result.plan) {
        return NextResponse.json(
          { 
            error: 'AI 响应内容无效',
            message: 'AI 返回的膳食计划格式不正确，请重试'
          },
          { status: 502 }
        );
      }
      
      console.log('✅ Successfully parsed meal plan with', result.plan.length, 'days');
      console.log('🛒 Shopping list items:', result.shopping_list?.length || 0);
      
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
