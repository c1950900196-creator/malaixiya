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
    
    // 构建给豆包的提示词 - 只生成 1 天的膳食计划，不给示例让AI自己想
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join('、')}` : ''}）生成${dayName}的马来西亚膳食计划。

要求：选择3种不同的马来西亚特色菜作为早餐、午餐、晚餐。每天的菜品要有变化，不要重复。

返回JSON：{"day":"${dayName}","meals":{"breakfast":{"name_zh":"中文名","name_en":"英文名"},"lunch":{"name_zh":"中文名","name_en":"英文名"},"dinner":{"name_zh":"中文名","name_en":"英文名"}}}`;

    console.log('📤 Calling Doubao API for meal plan generation...');
    console.log('🔧 Prompt length:', prompt.length, 'characters');
    
    // 豆包 API 配置
    const apiKey = process.env.DOUBAO_API_KEY || process.env.ARK_API_KEY;
    const apiEndpoint = process.env.DOUBAO_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    
    if (!apiKey) {
      console.error('❌ Doubao API not configured!');
      return NextResponse.json(
        { 
          error: 'AI API 未配置',
          message: '豆包 API 未配置。请在 Vercel 环境变量中设置 ARK_API_KEY 或 DOUBAO_API_KEY'
        },
        { status: 500 }
      );
    }
    
    console.log('🔧 Using Doubao endpoint:', apiEndpoint);
    console.log('🔧 API Key length:', apiKey.length);
    
    // 调用豆包API，使用流式输出
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // 55秒超时
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'doubao-seed-1-6-flash-250828',
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
          thinking: { type: 'disabled' }, // 关闭深度思考
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
      
      // 修复多余的括号问题
      // 有时 AI 会返回多余的 }} 或 ]]
      jsonString = jsonString.trim();
      while (jsonString.endsWith('}}') && !jsonString.includes('{{')) {
        // 检查括号是否平衡
        const openCount = (jsonString.match(/\{/g) || []).length;
        const closeCount = (jsonString.match(/\}/g) || []).length;
        if (closeCount > openCount) {
          jsonString = jsonString.slice(0, -1);
        } else {
          break;
        }
      }
      
      // 解析清理后的 JSON
      let result;
      try {
        result = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('Content preview:', fullContent.substring(0, 500));
        
        // 尝试更激进的修复
        try {
          // 移除所有多余的结尾括号
          let fixedJson = jsonString;
          while (fixedJson.endsWith('}') || fixedJson.endsWith(']')) {
            const openBraces = (fixedJson.match(/\{/g) || []).length;
            const closeBraces = (fixedJson.match(/\}/g) || []).length;
            const openBrackets = (fixedJson.match(/\[/g) || []).length;
            const closeBrackets = (fixedJson.match(/\]/g) || []).length;
            
            if (closeBraces > openBraces) {
              fixedJson = fixedJson.slice(0, -1).trim();
            } else if (closeBrackets > openBrackets) {
              fixedJson = fixedJson.slice(0, -1).trim();
            } else {
              break;
            }
          }
          result = JSON.parse(fixedJson);
          console.log('✅ Fixed JSON successfully');
        } catch (e) {
          return NextResponse.json(
            { 
              error: 'AI 响应解析失败',
              message: 'AI 返回的数据格式不正确，请重试'
            },
            { status: 502 }
          );
        }
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
