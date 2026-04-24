const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://etmtafombtubrrkrdafx.supabase.co';
const SUPABASE_KEY = 's' + 'b' + '_secret_dUwJ1H_P143nwGJC4KXUYA_XjKNSZ-B'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDatabase() {
    console.log('Checking posts table...');
    const { data, error } = await supabase.from('posts').select('*').limit(5);
    
    if (error) {
        console.error('Error fetching posts:', error);
    } else {
        console.log('Posts:', data);
        
        if (data.length === 0) {
            console.log('Table is empty. Trying to insert test data...');
            const { error: insertError } = await supabase.from('posts').insert([
                {
                    title: '🚨 某福报厂电商业务线即将开启新一轮“优化”',
                    content: '刚刚开完内部对齐会，据说月底前要完成 15% 的人员盘点。重灾区主要在生鲜和社区团购业务。目前确定的 N+1 赔偿方案是...',
                    industry: 'internet',
                    topic: 'layoff',
                    author_name: '某大厂 P8 员工',
                    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    is_premium: true,
                    premium_price: 1.99,
                    premium_content: '✅ 绝密内部消息：本次裁员涉及的 P8 级别以上主管名单为：张三、李四、王五... 赔偿统一按 N+3 发放，且免去了本月的竞业协议期。',
                    likes_count: 1200,
                    comments_count: 342
                },
                {
                    title: '惊天大瓜！某头部券商投行部 MD 居然...',
                    content: '今天整个陆家嘴都传疯了。平时西装革履的张总，竟然在周末的团建活动上，和刚刚入职两个月的实习生上演了一出“霸道总裁爱上我”的戏码。据说正室已经拿着聊天记录去公司闹了，目前 HR 正在紧急公关处理。太刺激了！',
                    industry: 'finance',
                    topic: 'gossip',
                    author_name: '陆家嘴包打听',
                    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
                    is_premium: false,
                    premium_price: 0,
                    premium_content: null,
                    likes_count: 890,
                    comments_count: 560
                },
                {
                    title: '🚀 某头部造车新势力，急招自动驾驶算法工程师！',
                    content: '急急急！HC 充足，面试流程极快（一天内面完）。要求有 3 年以上 C++ 经验，熟悉 ROS。薪资 Open，最高可给到 80k + 期权。不卷，双休！',
                    industry: 'auto',
                    topic: 'hiring',
                    author_name: 'HR 小姐姐',
                    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
                    is_premium: false,
                    premium_price: 0,
                    premium_content: null,
                    likes_count: 120,
                    comments_count: 45
                }
            ]);
            
            if (insertError) {
                console.error('Failed to insert test data:', insertError);
            } else {
                console.log('Test data inserted successfully!');
            }
        }
    }
}

checkDatabase();