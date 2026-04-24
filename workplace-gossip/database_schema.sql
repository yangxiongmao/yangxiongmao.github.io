-- 复制以下 SQL 语句到 Supabase 的 SQL Editor 中执行，以创建数据库表

-- 1. 创建帖子表 (posts)
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  industry VARCHAR(50) NOT NULL, -- 行业/赛道标签 (如 internet, finance)
  topic VARCHAR(50) NOT NULL, -- 话题标签 (如 layoff, gossip)
  author_name VARCHAR(100) DEFAULT '匿名瓜农', -- 帖子作者名称
  author_avatar VARCHAR(255) DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous',
  is_premium BOOLEAN DEFAULT false, -- 是否为付费帖子
  premium_price DECIMAL(10, 2) DEFAULT 0.00, -- 付费价格
  premium_content TEXT, -- 付费才能查看的内容
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0
);

-- 2. 插入一些测试数据
INSERT INTO posts (title, content, industry, topic, author_name, author_avatar, is_premium, premium_price, premium_content, likes_count, comments_count)
VALUES 
  ('🚨 某福报厂电商业务线即将开启新一轮“优化”', '刚刚开完内部对齐会，据说月底前要完成 15% 的人员盘点。重灾区主要在生鲜和社区团购业务。目前确定的 N+1 赔偿方案是...', 'internet', 'layoff', '某大厂 P8 员工', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', true, 1.99, '✅ 绝密内部消息：本次裁员涉及的 P8 级别以上主管名单为：张三、李四、王五... 赔偿统一按 N+3 发放，且免去了本月的竞业协议期。', 1200, 342),
  ('惊天大瓜！某头部券商投行部 MD 居然...', '今天整个陆家嘴都传疯了。平时西装革履的张总，竟然在周末的团建活动上，和刚刚入职两个月的实习生上演了一出“霸道总裁爱上我”的戏码。据说正室已经拿着聊天记录去公司闹了，目前 HR 正在紧急公关处理。太刺激了！', 'finance', 'gossip', '陆家嘴包打听', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', false, 0, null, 890, 560),
  ('🚀 某头部造车新势力，急招自动驾驶算法工程师！', '急急急！HC 充足，面试流程极快（一天内面完）。要求有 3 年以上 C++ 经验，熟悉 ROS。薪资 Open，最高可给到 80k + 期权。不卷，双休！', 'auto', 'hiring', 'HR 小姐姐', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', false, 0, null, 120, 45);

-- 3. 设置 Row Level Security (RLS) - 允许所有人读取数据
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "允许匿名用户读取帖子" ON posts FOR SELECT USING (true);
-- 允许匿名用户发布帖子（在真实商业项目中，这里需要加上用户登录验证）
CREATE POLICY "允许匿名用户发布帖子" ON posts FOR INSERT WITH CHECK (true);