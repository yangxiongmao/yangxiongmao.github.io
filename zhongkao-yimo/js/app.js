(function () {
  'use strict';

  const $district = document.getElementById('filterDistrict');
  const $subject  = document.getElementById('filterSubject');
  const $school   = document.getElementById('filterSchool');
  const $score    = document.getElementById('filterScore');
  const $reset    = document.getElementById('btnReset');
  const $tbody    = document.getElementById('scoreBody');
  const $count    = document.getElementById('countBadge');
  const $empty    = document.getElementById('emptyState');
  const $stats    = document.getElementById('statsOverview');
  const $analytics = document.getElementById('analyticsGrid');
  const $table    = document.getElementById('scoreTable');

  let currentSort = { key: 'total', dir: 'desc' };

  function init() {
    populateSchoolFilter();
    bindEvents();
    render();
  }

  function populateSchoolFilter() {
    const schools = [...new Set(STUDENTS.map(s => s.school))].sort();
    schools.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      $school.appendChild(opt);
    });
  }

  function bindEvents() {
    [$district, $subject, $score].forEach(el => el.addEventListener('change', render));
    $district.addEventListener('change', onDistrictChange);
    $school.addEventListener('change', render);
    $reset.addEventListener('click', resetFilters);

    $table.querySelectorAll('.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (currentSort.key === key) {
          currentSort.dir = currentSort.dir === 'desc' ? 'asc' : 'desc';
        } else {
          currentSort = { key, dir: 'desc' };
        }
        updateSortIcons();
        render();
      });
    });
  }

  function onDistrictChange() {
    const dist = $district.value;
    $school.innerHTML = '<option value="all">全部学校</option>';
    const schools = [...new Set(
      STUDENTS
        .filter(s => dist === 'all' || s.district === dist)
        .map(s => s.school)
    )].sort();
    schools.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      $school.appendChild(opt);
    });
  }

  function updateSortIcons() {
    $table.querySelectorAll('.sortable').forEach(th => {
      const icon = th.querySelector('i');
      if (th.dataset.sort === currentSort.key) {
        icon.className = currentSort.dir === 'desc'
          ? 'fas fa-sort-down'
          : 'fas fa-sort-up';
      } else {
        icon.className = 'fas fa-sort';
      }
    });
  }

  function resetFilters() {
    $district.value = 'all';
    $subject.value = 'all';
    $score.value = 'all';
    onDistrictChange();
    currentSort = { key: 'total', dir: 'desc' };
    updateSortIcons();
    render();
  }

  function getFiltered() {
    let list = [...STUDENTS];

    const dist = $district.value;
    if (dist !== 'all') list = list.filter(s => s.district === dist);

    const school = $school.value;
    if (school !== 'all') list = list.filter(s => s.school === school);

    const scoreMin = $score.value;
    const subject = $subject.value;
    if (scoreMin !== 'all') {
      const min = parseInt(scoreMin, 10);
      list = list.filter(s => {
        if (subject === 'math') return s.math >= min;
        if (subject === 'physics') return s.physics >= min;
        return s.math >= min || s.physics >= min;
      });
    }

    const sortKey = currentSort.key;
    const dir = currentSort.dir === 'desc' ? -1 : 1;
    list.sort((a, b) => {
      let va, vb;
      if (sortKey === 'total') {
        va = a.math + a.physics;
        vb = b.math + b.physics;
      } else if (sortKey === 'math') {
        va = a.math;
        vb = b.math;
      } else {
        va = a.physics;
        vb = b.physics;
      }
      return (va - vb) * dir;
    });

    return list;
  }

  function scoreClass(score, max) {
    const ratio = score / max;
    if (ratio >= 0.95) return 'score-high';
    if (ratio >= 0.90) return 'score-good';
    return 'score-normal';
  }

  function render() {
    const list = getFiltered();
    const subject = $subject.value;
    renderTable(list, subject);
    renderStats(list);
    renderAnalytics(list, subject);
  }

  function renderTable(list, subject) {
    const showMath = subject !== 'physics';
    const showPhysics = subject !== 'math';

    const mathTh = $table.querySelector('[data-sort="math"]');
    const physTh = $table.querySelector('[data-sort="physics"]');
    const totalTh = $table.querySelector('[data-sort="total"]');

    mathTh.parentElement.style.display = '';
    physTh.parentElement.style.display = '';

    if (!showMath) mathTh.closest('th') && (mathTh.style.display = 'none');
    if (!showPhysics) physTh.closest('th') && (physTh.style.display = 'none');

    mathTh.style.display = showMath ? '' : 'none';
    physTh.style.display = showPhysics ? '' : 'none';

    if (subject === 'math') {
      totalTh.textContent = '数学分';
    } else if (subject === 'physics') {
      totalTh.textContent = '物理分';
    } else {
      totalTh.innerHTML = '总分 <i class="fas fa-sort"></i>';
    }
    updateSortIcons();

    $tbody.innerHTML = '';
    if (list.length === 0) {
      $empty.style.display = 'block';
      $count.textContent = '共 0 人';
      return;
    }
    $empty.style.display = 'none';
    $count.textContent = `共 ${list.length} 人`;

    list.forEach((s, i) => {
      const rank = i + 1;
      const rankClass = rank <= 3 ? `rank-${rank}` : '';
      const distClass = DISTRICT_MAP[s.district] || '';
      const total = subject === 'math' ? s.math
        : subject === 'physics' ? s.physics
        : s.math + s.physics;

      let rankContent;
      if (rank <= 3) {
        rankContent = `<span class="rank-medal">${rank}</span>`;
      } else {
        rankContent = rank;
      }

      const mathTd = showMath
        ? `<td class="score-cell ${scoreClass(s.math, 100)}">${s.math}</td>`
        : '';
      const physTd = showPhysics
        ? `<td class="score-cell ${scoreClass(s.physics, 80)}">${s.physics}</td>`
        : '';

      const tr = document.createElement('tr');
      tr.className = rankClass;
      tr.innerHTML = `
        <td class="rank-cell">${rankContent}</td>
        <td class="name-cell">${s.name}</td>
        <td><span class="district-badge district-${distClass}">${s.district}</span></td>
        <td class="school-cell" title="${s.school}">${s.school}</td>
        <td>${s.grade}</td>
        ${mathTd}
        ${physTd}
        <td class="total-cell">${total}</td>
      `;
      $tbody.appendChild(tr);
    });
  }

  function renderStats(list) {
    const total = list.length;
    const math90 = list.filter(s => s.math >= 90).length;
    const avgMath = total ? (list.reduce((a, s) => a + s.math, 0) / total).toFixed(1) : 0;
    const avgPhysics = total ? (list.reduce((a, s) => a + s.physics, 0) / total).toFixed(1) : 0;

    $stats.innerHTML = `
      <div class="stat-card">
        <span class="stat-num">${total}</span>
        <span class="stat-label">上榜学员</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${math90}</span>
        <span class="stat-label">数学90+</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${avgMath}</span>
        <span class="stat-label">数学均分</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${avgPhysics}</span>
        <span class="stat-label">物理均分</span>
      </div>
    `;
  }

  function renderAnalytics(list, subject) {
    if (list.length === 0) {
      $analytics.innerHTML = '<p style="color:#999;text-align:center;grid-column:1/-1;">暂无数据</p>';
      return;
    }

    const mathScores = list.map(s => s.math);
    const physScores = list.map(s => s.physics);
    const maxMath = Math.max(...mathScores);
    const minMath = Math.min(...mathScores);
    const maxPhys = Math.max(...physScores);
    const minPhys = Math.min(...physScores);
    const math95 = list.filter(s => s.math >= 95).length;
    const phys75 = list.filter(s => s.physics >= 75).length;
    const haidianCount = list.filter(s => s.district === '海淀区').length;
    const xichengCount = list.filter(s => s.district === '西城区').length;

    $analytics.innerHTML = `
      <div class="analytics-card gold">
        <div class="a-icon">🏆</div>
        <span class="a-value">${maxMath}</span>
        <span class="a-label">数学最高分</span>
      </div>
      <div class="analytics-card red">
        <div class="a-icon">📊</div>
        <span class="a-value">${minMath}~${maxMath}</span>
        <span class="a-label">数学分数区间</span>
      </div>
      <div class="analytics-card blue">
        <div class="a-icon">⚡</div>
        <span class="a-value">${maxPhys}</span>
        <span class="a-label">物理最高分</span>
      </div>
      <div class="analytics-card green">
        <div class="a-icon">📈</div>
        <span class="a-value">${minPhys}~${maxPhys}</span>
        <span class="a-label">物理分数区间</span>
      </div>
      <div class="analytics-card gold">
        <div class="a-icon">🎯</div>
        <span class="a-value">${math95}</span>
        <span class="a-label">数学95+人数</span>
      </div>
      <div class="analytics-card blue">
        <div class="a-icon">🔬</div>
        <span class="a-value">${phys75}</span>
        <span class="a-label">物理75+人数</span>
      </div>
      <div class="analytics-card green">
        <div class="a-icon">🏫</div>
        <span class="a-value">${haidianCount}</span>
        <span class="a-label">海淀区学员</span>
      </div>
      <div class="analytics-card red">
        <div class="a-icon">🏫</div>
        <span class="a-value">${xichengCount}</span>
        <span class="a-label">西城区学员</span>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
