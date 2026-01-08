import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userProfile, restrictions } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // 构建给豆包的提示词（简化版，不包含所有菜谱）
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}，预算：RM${userProfile.weekly_budget}/周${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join(', ')}` : ''}）生成7天马来西亚膳食计划。

要求：每天含早午晚餐，营养均衡，菜品多样，使用真实马来西亚美食名称。

返回JSON：
{
  "plan": [
    {"day": "Monday", "meals": {"breakfast": {"name_zh": "椰浆饭", "name_en": "Nasi Lemak"}, "lunch": {"name_zh": "炒粿条", "name_en": "Char Kway Teow"}, "dinner": {"name_zh": "肉骨茶", "name_en": "Bak Kut Teh"}}},
    ...其他6天
  ]
}`;

    console.log('📤 Calling Doubao API for meal plan generation...');
    
    // 检查豆包配置
    if (!process.env.DOUBAO_API_ENDPOINT || !process.env.DOUBAO_API_KEY) {
      console.error('❌ Doubao API not configured!');
      return NextResponse.json(
        { 
          error: 'AI API not configured',
          message: '豆包 API 未配置。请在 .env.local 中设置 DOUBAO_API_ENDPOINT 和 DOUBAO_API_KEY'
        },
        { status: 500 }
      );
    }
    
    console.log('🔧 Using Doubao endpoint:', process.env.DOUBAO_API_ENDPOINT);
    console.log('🔧 Using model:', process.env.DOUBAO_MODEL);
    
    // 调用豆包API，设置超时
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
      
      response = await fetch(process.env.DOUBAO_API_ENDPOINT, {
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
              content: '你是马来西亚营养师。仅返回JSON，不要解释。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1500,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error('❌ Network error calling Doubao:', fetchError);
      
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
      console.error('❌ Doubao API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'AI generation failed', details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('📥 Received response from Doubao');
    
    // 解析JSON响应
    try {
      let result;
      
      // 尝试多种方式提取JSON
      if (content.includes('```json')) {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        }
      } else if (content.includes('```')) {
        const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          result = JSON.parse(codeMatch[1]);
        }
      } else {
        const jsonMatch = content.match(/\{[\s\S]*"plan"[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = JSON.parse(content);
        }
      }
      
      if (!result || !result.plan) {
        throw new Error('No valid meal plan found in response');
      }
      
      console.log('✅ Successfully parsed meal plan with', result.plan.length, 'days');
      
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Content preview:', content.substring(0, 500));
      
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response', 
          message: 'AI返回的格式无法解析，请重试',
          rawContent: content.substring(0, 300)
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Meal plan generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

