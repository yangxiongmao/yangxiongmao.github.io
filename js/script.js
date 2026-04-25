const subjectData = {
    chinese: {
        label: 'Chinese',
        title: '语文：从文本理解走向任务表达',
        summary: '阅读材料可能继续强调多文本整合、中华优秀传统文化、北京地域文化与现实议题，作文更重真实任务、对象意识和思辨表达。',
        signals: ['非连续文本与文学文本联读', '围绕北京文化、校园生活设计任务', '作文更强调情境、对象和观点层次'],
        actions: ['建立“材料观点-证据-表达效果”批注表', '每周练一次限时审题和作文提纲', '积累传统文化与现实议题的表达素材']
    },
    math: {
        label: 'Math',
        title: '数学：从套方法走向建模型',
        summary: '函数、几何、统计与实际问题的融合仍是重点，压轴题更可能考查分类讨论、过程解释和模型迁移。',
        signals: ['实际问题转化为方程、函数或几何模型', '图形运动、存在性与最值问题', '统计图表中的数据解释和判断'],
        actions: ['复盘“读题-设量-建式-解释”的完整链条', '把错题按模型类型归档', '训练书写关键推理步骤而不是只写答案']
    },
    english: {
        label: 'English',
        title: '英语：从语言知识走向真实沟通',
        summary: '阅读话题可能继续覆盖科技、文化、社会责任与青少年成长，写作关注语境回应、信息组织和表达得体。',
        signals: ['语篇推断、主旨概括和作者态度判断', '任务型阅读中的信息转述', '邮件、建议、活动介绍等真实写作任务'],
        actions: ['整理主题词、观点句和可迁移表达', '限时练习读后转述和概要表达', '写作前明确身份、对象、目的和语气']
    },
    physics: {
        label: 'Physics',
        title: '物理：从公式计算走向实验论证',
        summary: '实验探究、图像信息、生活情境解释会持续重要，重点是变量控制、证据推理和结论表达。',
        signals: ['教材实验的变式设计', '图像斜率、截距与物理意义解释', '生活科技情境中的现象分析'],
        actions: ['用“目的-变量-步骤-数据-结论”复盘实验', '训练图像转文字解释', '整理常见误差来源和改进方案']
    },
    chemistry: {
        label: 'Chemistry',
        title: '化学：从记性质走向证据推理',
        summary: '物质转化、实验现象解释、流程推断与绿色化学情境可能更受关注，宏观现象与微观本质要能互相解释。',
        signals: ['生活材料、环境治理和安全操作情境', '流程图中的物质转化推断', '实验现象、结论和反思评价结合'],
        actions: ['搭建核心物质的性质与转化网络', '练习用粒子观解释宏观现象', '答题时补充安全、环保和证据依据']
    },
    politics: {
        label: 'Morality and Law',
        title: '道法：从背观点走向价值判断',
        summary: '材料可能结合首都发展、法治生活、科技创新和青少年责任，考查观点辨析、依据提取和行动表达。',
        signals: ['北京城市治理、志愿服务、法治案例', '开放性建议类和评析类设问', '个人成长与国家发展同频表达'],
        actions: ['按“观点-材料依据-教材语言-行动”组织答案', '关注北京时政与青少年实践素材', '训练多角度但不堆砌的表达']
    },
    history: {
        label: 'History',
        title: '历史：从记年代走向时空解释',
        summary: '史料阅读、时间线建构、中外联系和历史解释仍会凸显，要求学生从材料证据中形成判断。',
        signals: ['图文史料、地图和时间轴综合', '比较不同阶段的发展变化', '历史事件与现实启示连接'],
        actions: ['用时间轴串联“背景-过程-影响”', '练习从史料出处和关键词判断信息', '整理北京历史文化相关素材']
    }
};

const stageData = {
    foundation: {
        title: '夯基建网：把碎片知识连成结构',
        text: '先完成课标核心概念、必备公式、重点文体、实验原理与史实线索的系统梳理，避免只按题型记套路。',
        items: ['每科建立“概念-方法-典型情境-易错提醒”四列表', '用思维导图串联跨章节知识', '基础题训练后必须口述解题依据']
    },
    scenario: {
        title: '情境突破：把知识放进真实任务',
        text: '集中训练长材料、图表、实验、开放设问和跨学科素材，提升从情境中提取条件并选择工具的能力。',
        items: ['每周完成一组长材料题并标注信息来源', '为大题写出审题路径和评分点', '把北京文化、科技、社会生活素材转化为学科表达']
    },
    simulation: {
        title: '综合演练：把会做变成稳定得分',
        text: '通过限时套卷、错题再变式和表达校准，提升时间分配、答案完整度和临场取舍能力。',
        items: ['按中考节奏完成整卷限时训练', '模拟阅卷标准给自己赋分', '复盘审题失误、计算失误和表达失分点']
    }
};

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');
const subjectTabs = document.querySelectorAll('.subject-tab');
const subjectLabel = document.querySelector('#subjectLabel');
const subjectTitle = document.querySelector('#subjectTitle');
const subjectSummary = document.querySelector('#subjectSummary');
const signalList = document.querySelector('#signalList');
const actionList = document.querySelector('#actionList');
const timelineItems = document.querySelectorAll('.timeline-item');
const stageTitle = document.querySelector('#stageTitle');
const stageText = document.querySelector('#stageText');
const stageList = document.querySelector('#stageList');
const ranges = document.querySelectorAll('input[type="range"][data-skill]');
const radarTip = document.querySelector('#radarTip');
const quiz = document.querySelector('#strategyQuiz');
const quizResult = document.querySelector('#quizResult');
const canvas = document.querySelector('#radarCanvas');
const ctx = canvas.getContext('2d');

function setList(list, items) {
    list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function updateSubject(subjectId) {
    const data = subjectData[subjectId];
    if (!data) return;

    subjectLabel.textContent = data.label;
    subjectTitle.textContent = data.title;
    subjectSummary.textContent = data.summary;
    setList(signalList, data.signals);
    setList(actionList, data.actions);
}

function updateStage(stageId) {
    const data = stageData[stageId];
    if (!data) return;

    stageTitle.textContent = data.title;
    stageText.textContent = data.text;
    setList(stageList, data.items);
}

function drawRadar() {
    const labels = ['信息提取', '逻辑推理', '模型建构', '规范表达', '迁移应用'];
    const values = Array.from(ranges).map(range => Number(range.value));
    const size = canvas.width;
    const center = size / 2;
    const radius = 128;
    const angleStep = (Math.PI * 2) / values.length;

    ctx.clearRect(0, 0, size, size);
    ctx.lineWidth = 1;
    ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let level = 1; level <= 5; level += 1) {
        ctx.beginPath();
        values.forEach((_, index) => {
            const angle = -Math.PI / 2 + angleStep * index;
            const pointRadius = radius * (level / 5);
            const x = center + Math.cos(angle) * pointRadius;
            const y = center + Math.sin(angle) * pointRadius;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.strokeStyle = '#dbe7f3';
        ctx.stroke();
    }

    values.forEach((_, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#e6eef8';
        ctx.stroke();

        const labelX = center + Math.cos(angle) * (radius + 28);
        const labelY = center + Math.sin(angle) * (radius + 28);
        ctx.fillStyle = '#5a6b7d';
        ctx.fillText(labels[index], labelX, labelY);
    });

    ctx.beginPath();
    values.forEach((value, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const pointRadius = radius * (value / 5);
        const x = center + Math.cos(angle) * pointRadius;
        const y = center + Math.sin(angle) * pointRadius;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(35, 100, 210, 0.24)';
    ctx.strokeStyle = '#2364d2';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    values.forEach((value, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const pointRadius = radius * (value / 5);
        const x = center + Math.cos(angle) * pointRadius;
        const y = center + Math.sin(angle) * pointRadius;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#19a7ce';
        ctx.fill();
    });

    const min = Math.min(...values);
    const minIndex = values.indexOf(min);
    radarTip.textContent = min <= 2
        ? `当前最需要补强的是“${labels[minIndex]}”，建议用一道综合题完整写出审题、依据和表达过程。`
        : '当前画像较均衡，建议用真题材料训练“读题-建模-表达”的完整链条。';
}

function handleQuizSubmit(event) {
    event.preventDefault();
    const formData = new FormData(quiz);
    const answers = ['q1', 'q2', 'q3'];

    if (answers.some(name => !formData.has(name))) {
        quizResult.textContent = '请先完成三道题，再生成建议。';
        return;
    }

    const total = answers.reduce((sum, name) => sum + Number(formData.get(name)), 0);
    if (total <= 5) {
        quizResult.textContent = '建议先从基础概念和审题路径入手：每次做题都写出材料条件、关联知识点和答题依据。';
    } else if (total <= 7) {
        quizResult.textContent = '你的策略已有方向，下一步应增加长材料、实验探究和论证表达训练，减少只按题型记套路。';
    } else {
        quizResult.textContent = '你的策略与趋势匹配度较高，可重点训练压轴题拆解、开放题取舍和限时表达稳定性。';
    }
}

function toggleMenu() {
    const isOpen = navLinks.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('fa-bars', !isOpen);
    icon.classList.toggle('fa-times', isOpen);
}

menuBtn.addEventListener('click', toggleMenu);
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        const icon = menuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

subjectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        subjectTabs.forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        updateSubject(tab.dataset.subject);
    });
});

timelineItems.forEach(item => {
    item.addEventListener('click', () => {
        timelineItems.forEach(step => step.classList.remove('active'));
        item.classList.add('active');
        updateStage(item.dataset.stage);
    });
});

ranges.forEach(range => {
    range.addEventListener('input', drawRadar);
});

quiz.addEventListener('submit', handleQuizSubmit);

window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);
});

updateSubject('chinese');
updateStage('foundation');
drawRadar();
