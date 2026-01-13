import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 验证 Supabase URL 格式（只打印警告，不抛出错误）
if (supabaseUrl && supabaseUrl.includes('/dashboard/')) {
  console.error(
    `❌ 错误的 Supabase URL 配置！当前值: ${supabaseUrl}。` +
    `应该是 https://项目ID.supabase.co 格式`
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


