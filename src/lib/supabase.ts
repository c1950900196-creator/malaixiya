import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 验证 Supabase URL 格式
if (supabaseUrl && supabaseUrl.includes('/dashboard/')) {
  throw new Error(
    `❌ 错误的 Supabase URL 配置！\n` +
    `当前值: ${supabaseUrl}\n` +
    `这是 Dashboard URL，不是 API URL。\n` +
    `正确格式应该是: https://项目ID.supabase.co\n` +
    `请在 Vercel 中修改 NEXT_PUBLIC_SUPABASE_URL 环境变量`
  );
}

// 服务端使用 - 只有在环境变量存在时才创建客户端
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 客户端组件使用 - 单例模式，避免创建多个实例
let browserClient: ReturnType<typeof createClientComponentClient> | null = null;

export const createBrowserClient = () => {
  if (!browserClient) {
    browserClient = createClientComponentClient();
  }
  return browserClient;
};


