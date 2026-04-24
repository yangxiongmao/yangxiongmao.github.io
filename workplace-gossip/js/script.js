// 行业标签字典，用于中文展示
const industryMap = {
    'internet': '互联网',
    'finance': '金融',
    'education': '教培/科研',
    'medical': '医疗/大健康',
    'auto': '汽车/新能源',
    'foreign': '外企/出海'
};

// 话题标签字典，用于中文展示与颜色
const topicMap = {
    'layoff': { label: '裁员预警', colorClass: 'badge-red' },
    'gossip': { label: '职场八卦', colorClass: 'badge-orange' },
    'hiring': { label: '急招内推', colorClass: 'badge-blue' },
    'fun': { label: '奇葩趣事', colorClass: 'badge-green' },
    'salary': { label: '薪资爆料', colorClass: 'badge-purple' }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // 初始化加载所有帖子
    loadPosts();

    // --- 0. 从 Supabase 拉取真实数据渲染 ---
    async function loadPosts() {
        const postListContainer = document.querySelector('.post-list');
        postListContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-sec);">正在从数据库加载最新吐槽... <i class="fas fa-spinner fa-spin"></i></div>';

        try {
            // 从 Supabase 读取帖子表数据，按创建时间倒序排列
            const { data: posts, error } = await supabaseClient
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!posts || posts.length === 0) {
                postListContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-sec);">目前还没有任何吐槽，快来发第一帖吧！</div>';
                return;
            }

            // 清空列表并重新渲染
            postListContainer.innerHTML = '';
            
            posts.forEach(post => {
                const topicInfo = topicMap[post.topic] || { label: '其它', colorClass: 'badge-gray' };
                const industryName = industryMap[post.industry] || '其它';
                
                // 处理时间格式 (转换为 XX分钟前 或 MM-DD)
                const postDate = new Date(post.created_at);
                const timeString = `${postDate.getMonth()+1}-${postDate.getDate()} ${postDate.getHours()}:${String(postDate.getMinutes()).padStart(2, '0')}`;

                let premiumHtml = '';
                if (post.is_premium) {
                    premiumHtml = `
                        <div class="pay-to-read">
                            <div class="pay-overlay"></div>
                            <div class="pay-box">
                                <i class="fas fa-lock"></i>
                                <span>支付 ￥${post.premium_price} 解锁完整爆料细节</span>
                                <button class="btn btn-pay" data-content="${encodeURIComponent(post.premium_content)}">立即支付查看</button>
                            </div>
                        </div>
                    `;
                }

                const postHtml = `
                    <div class="post-card" data-industry="${post.industry}" data-topic="${post.topic}">
                        <div class="post-header">
                            <div class="post-user">
                                <img src="${post.author_avatar}" alt="Avatar" class="avatar">
                                <div class="user-info">
                                    <span class="username">${post.author_name}</span>
                                    <span class="post-time">${timeString}</span>
                                </div>
                            </div>
                            <div class="post-tags">
                                <span class="badge ${topicInfo.colorClass}">${topicInfo.label}</span>
                                <span class="badge badge-gray">${industryName}</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <h2 class="post-title">${post.title}</h2>
                            <p class="post-text">${post.content}</p>
                            ${premiumHtml}
                        </div>
                        <div class="post-footer">
                            <button class="action-btn"><i class="far fa-thumbs-up"></i> ${post.likes_count}</button>
                            <button class="action-btn"><i class="far fa-comment"></i> ${post.comments_count}</button>
                            <button class="action-btn"><i class="fas fa-share"></i> 分享</button>
                        </div>
                    </div>
                `;
                
                // 直接插入 HTML
                postListContainer.insertAdjacentHTML('beforeend', postHtml);
            });

            // 重新绑定筛选和支付按钮事件（因为DOM被重新渲染了）
            bindActionEvents();

        } catch (err) {
            console.error('加载帖子失败:', err);
            postListContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-red);">加载失败，报错信息: ' + (err.message || err.toString()) + '</div>';
        }
    }

    // 将需要重新绑定的事件封装成函数
    function bindActionEvents() {
        // 点赞互动逻辑
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon && icon.classList.contains('fa-thumbs-up')) {
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        this.style.color = 'var(--primary)';
                        const currentNum = parseFloat(this.innerText);
                        if (!isNaN(currentNum)) {
                            this.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentNum + 1}`;
                        } else {
                            this.innerHTML = `<i class="fas fa-thumbs-up"></i> 已赞`;
                        }
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        this.style.color = 'var(--text-sec)';
                        const currentNum = parseFloat(this.innerText);
                        if (!isNaN(currentNum)) {
                            this.innerHTML = `<i class="far fa-thumbs-up"></i> ${currentNum - 1}`;
                        }
                    }
                }
            });
        });

        // 支付弹窗交互逻辑
        const payModal = document.getElementById('paymentModal');
        const payBtns = document.querySelectorAll('.btn-pay');
        
        payBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 将被点击按钮对应的隐藏内容暂存到弹窗属性上，以便支付后展示
                payModal.setAttribute('data-target-content', btn.getAttribute('data-content'));
                payModal.setAttribute('data-target-btn-class', e.target.className);
                // 这里简单粗暴记录一下是哪个卡片被点击了
                window.currentPayBtn = btn; 
                payModal.style.display = 'flex';
            });
        });
    }

    // --- 全局静态事件绑定 ---

    const payModal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
        payModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === payModal) {
            payModal.style.display = 'none';
        }
    });

    // 模拟支付点击 (只需要绑定一次)
    const payMethods = document.querySelectorAll('.pay-method-btn');
    payMethods.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.classList.contains('wechat') ? '微信' : '支付宝';
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 正在拉起${method}...`;
            
            setTimeout(() => {
                alert(`模拟演示：成功唤起${method}支付。\n\n实际项目中此处将调用后端接口。`);
                btn.innerHTML = method === '微信' ? '<i class="fab fa-weixin"></i> 微信支付' : '<i class="fab fa-alipay"></i> 支付宝';
                payModal.style.display = 'none';
                
                // 解锁内容
                if (window.currentPayBtn) {
                    const payBox = window.currentPayBtn.closest('.pay-to-read');
                    const premiumContent = decodeURIComponent(payModal.getAttribute('data-target-content'));
                    if (payBox) {
                        payBox.innerHTML = `<p style="color: var(--text-main); font-weight: bold; padding: 20px; background: #ECFDF5; border-radius: 8px;">✅ 已解锁：${premiumContent}</p>`;
                        payBox.style.marginTop = '0';
                        payBox.style.paddingTop = '0';
                    }
                }
            }, 1500);
        });
    });

    // 筛选逻辑 (只需绑定一次，靠修改 display 实现)
    const industryFilter = document.getElementById('industryFilter');
    const filterItems = industryFilter.querySelectorAll('li');
    
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            filterItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const filterValue = item.getAttribute('data-filter');
            
            const postCards = document.querySelectorAll('.post-card');
            postCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-industry') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const topicFilter = document.getElementById('topicFilter');
    const tags = topicFilter.querySelectorAll('.tag');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            const topicValue = tag.getAttribute('data-tag');
            
            const postCards = document.querySelectorAll('.post-card');
            postCards.forEach(card => {
                if (topicValue === 'all' || card.getAttribute('data-topic') === topicValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 5. 发布真实吐槽逻辑 (使用高级弹窗) ---
    
    const postModal = document.getElementById('postModal');
    const closePostModalBtn = document.getElementById('closePostModal');
    const quickPostBtn = document.querySelector('.quick-post button');
    const quickPostInput = document.querySelector('.quick-post input');
    const headerPostBtn = document.getElementById('postBtn');
    const mobilePostBtn = document.querySelector('.post-btn-mobile');
    const submitPostBtn = document.getElementById('submitPostBtn');

    // 打开弹窗的通用函数
    function openPostModal() {
        postModal.style.display = 'flex';
        // 如果输入框有字，自动填入弹窗里的详情内容
        if (quickPostInput && quickPostInput.value) {
            document.getElementById('postContentInput').value = quickPostInput.value;
            quickPostInput.value = ''; // 清空
        }
    }

    // 绑定多个入口打开弹窗
    quickPostBtn.addEventListener('click', openPostModal);
    if (quickPostInput) {
        quickPostInput.addEventListener('click', openPostModal);
    }
    if (headerPostBtn) {
        headerPostBtn.addEventListener('click', openPostModal);
    }
    if (mobilePostBtn) {
        mobilePostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPostModal();
        });
    }

    // 关闭弹窗
    closePostModalBtn.addEventListener('click', () => {
        postModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === postModal) {
            postModal.style.display = 'none';
        }
    });

    // 提交发布
    submitPostBtn.addEventListener('click', async () => {
        const title = document.getElementById('postTitleInput').value.trim();
        const industry = document.getElementById('postIndustrySelect').value;
        const topic = document.getElementById('postTopicSelect').value;
        const content = document.getElementById('postContentInput').value.trim();

        if (!title) {
            alert('标题不能为空哦！');
            return;
        }
        if (!content) {
            alert('多少写点吐槽内容吧！');
            return;
        }

        // 改变按钮状态为加载中
        const originalBtnText = submitPostBtn.innerHTML;
        submitPostBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在发布...';
        submitPostBtn.disabled = true;

        try {
            // 写入数据库
            const { data, error } = await supabaseClient
                .from('posts')
                .insert([
                    {
                        title: title,
                        content: content,
                        industry: industry,
                        topic: topic,
                        author_name: '新来的实习生', // 可以拓展为随机生成或者根据行业
                        author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random(),
                        is_premium: false
                    }
                ]);

            if (error) throw error;
            
            // 发布成功后的清理
            document.getElementById('postTitleInput').value = '';
            document.getElementById('postContentInput').value = '';
            postModal.style.display = 'none';
            alert('吐槽发布成功！');
            
            // 重新加载页面数据
            loadPosts();
        } catch (err) {
            console.error('发布失败:', err);
            alert('发布失败，请看控制台报错');
        } finally {
            // 恢复按钮状态
            submitPostBtn.innerHTML = originalBtnText;
            submitPostBtn.disabled = false;
        }
    });

});