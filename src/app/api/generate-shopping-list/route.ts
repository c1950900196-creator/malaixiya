import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：延长函数执行时间
export const maxDuration = 30; // 30秒

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // 豆包 API 配置
    const apiKey = process.env.DOUBAO_API_KEY || process.env.ARK_API_KEY;
    const apiEndpoint = process.env.DOUBAO_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    
    if (!apiKey) {
      console.error('❌ Doubao API not configured for shopping list!');
      return NextResponse.json(
        { 
          error: 'AI API not configured',
          message: '豆包 API 未配置。请在 Vercel 环境变量中设置 ARK_API_KEY 或 DOUBAO_API_KEY'
        },
        { status: 500 }
      );
    }
    
    console.log('🔧 Using Doubao endpoint for shopping list:', apiEndpoint);
    console.log('🔧 API Key length:', apiKey.length);
    
    // 调用豆包API（添加超时处理，与膳食计划API保持一致）
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时
      
      response = await fetch(apiEndpoint, {
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
              content: '你是购物清单专家。只返回JSON，无需解释。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 400, // 每次生成3个菜的食材
          thinking: { type: 'disabled' }, // 关闭深度思考
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error('❌ Network error calling Doubao for shopping list:', fetchError);
      
      // 检查是否是超时错误
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { 
            error: 'Timeout',
            message: '豆包 API 响应超时（超过60秒）。请检查网络连接或稍后重试。'
          },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Network error',
          message: `无法连接到豆包 API: ${fetchError.message}`
        },
        { status: 500 }
      );
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Doubao API error for shopping list:', response.status, errorText);
      console.error('🔍 Request URL:', apiEndpoint);
      console.error('🔍 API Key length:', apiKey.length);
      return NextResponse.json(
        { error: 'AI generation failed', details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // 解析JSON响应
    try {
      let result;
      let jsonString = '';
      
      // 尝试多种方式提取JSON
      if (content.includes('```json')) {
        // 从markdown代码块中提取
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      } else if (content.includes('```')) {
        // 从普通代码块中提取
        const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          jsonString = codeMatch[1];
        }
      } else {
        // 直接尝试找JSON对象
        const jsonMatch = content.match(/\{[\s\S]*"items"[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        } else {
          // 直接解析整个内容
          jsonString = content;
        }
      }
      
      // 清理 JSON 字符串：移除 trailing commas
      // 处理数组和对象中的 trailing comma: },  ] 或 },  } -> }, ] 或 }, }
      jsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');
      
      // 解析清理后的 JSON
      result = JSON.parse(jsonString);
      
      if (!result) {
        throw new Error('No valid JSON found in response');
      }
      
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content:', content.substring(0, 500)); // 只打印前500字符
      
      // 如果解析失败，尝试手动构造一个基本的购物清单
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response', 
          message: 'AI返回的格式无法解析，请重试',
          rawContent: content.substring(0, 200)
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Shopping list generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

