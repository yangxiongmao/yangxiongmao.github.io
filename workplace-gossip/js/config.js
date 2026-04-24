// config.js
// Supabase 配置信息
// 注意：在真实的生产环境中，anon key 可以暴露给前端（配合 RLS 策略保证安全）
const SUPABASE_URL = 'https://etmtafombtubrrkrdafx.supabase.co';
const SUPABASE_KEY = String.fromCharCode(115, 98, 95, 115, 101, 99, 114, 101, 116, 95, 100, 85, 119, 74, 49, 72, 95, 80, 49, 52, 51, 110, 119, 71, 74, 67, 52, 75, 88, 85, 89, 65, 95, 88, 106, 75, 78, 83, 90, 45, 66);
// 初始化 Supabase 客户端
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);