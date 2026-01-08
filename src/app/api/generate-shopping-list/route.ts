import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // 调用豆包API
    const response = await fetch(process.env.DOUBAO_API_ENDPOINT || '', {
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
            content: '你是马来西亚美食专家。请根据菜谱生成购物清单JSON，不要任何解释或额外文字，只返回纯JSON格式数据。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Doubao API error:', errorText);
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
      
      // 尝试多种方式提取JSON
      if (content.includes('```json')) {
        // 从markdown代码块中提取
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        }
      } else if (content.includes('```')) {
        // 从普通代码块中提取
        const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          result = JSON.parse(codeMatch[1]);
        }
      } else {
        // 直接尝试找JSON对象
        const jsonMatch = content.match(/\{[\s\S]*"items"[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          // 直接解析整个内容
          result = JSON.parse(content);
        }
      }
      
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

