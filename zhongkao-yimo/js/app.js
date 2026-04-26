(function () {
  'use strict';

  const STORAGE_KEY = 'zhongkao_yimo_2026';

  const $district  = document.getElementById('filterDistrict');
  const $subject   = document.getElementById('filterSubject');
  const $school    = document.getElementById('filterSchool');
  const $score     = document.getElementById('filterScore');
  const $reset     = document.getElementById('btnReset');
  const $tbody     = document.getElementById('scoreBody');
  const $count     = document.getElementById('countBadge');
  const $empty     = document.getElementById('emptyState');
  const $stats     = document.getElementById('statsOverview');
  const $analytics = document.getElementById('analyticsGrid');
  const $table     = document.getElementById('scoreTable');

  const $btnManage   = document.getElementById('btnManage');
  const $overlay     = document.getElementById('modalOverlay');
  const $modalClose  = document.getElementById('modalClose');
  const $btnAdd      = document.getElementById('btnAdd');
  const $btnExport   = document.getElementById('btnExport');
  const $fileImport  = document.getElementById('fileImport');
  const $btnRestore  = document.getElementById('btnRestore');
  const $formPanel   = document.getElementById('formPanel');
  const $formTitle   = document.getElementById('formTitle');
  const $form        = document.getElementById('studentForm');
  const $editId      = document.getElementById('editId');
  const $btnCancelForm = document.getElementById('btnCancelForm');
  const $manageBody  = document.getElementById('manageBody');
  const $toastBox    = document.getElementById('toastContainer');

  let students = [];
  let currentSort = { key: 'total', dir: 'desc' };

  /* ========== 初始化 ========== */
  function init() {
    loadData();
    populateSchoolFilter();
    bindEvents();
    render();
  }

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        students = JSON.parse(saved);
        return;
      }
    } catch (_) { /* ignore */ }
    students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    saveData();
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  /* ========== 工具函数 ========== */
  function toast(msg, type) {
    type = type || 'info';
    var el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    $toastBox.appendChild(el);
    setTimeout(function () { el.remove(); }, 3000);
  }

  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /* ========== 筛选/学校下拉联动 ========== */
  function populateSchoolFilter() {
    var dist = $district.value;
    $school.innerHTML = '<option value="all">\u5168\u90e8\u5b66\u6821</option>';
    var schools = [];
    var seen = {};
    students.forEach(function (s) {
      if (dist !== 'all' && s.district !== dist) return;
      if (!seen[s.school]) {
        seen[s.school] = true;
        schools.push(s.school);
      }
    });
    schools.sort();
    schools.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      $school.appendChild(opt);
    });
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    [$district, $subject, $score].forEach(function (el) { el.addEventListener('change', render); });
    $district.addEventListener('change', function () { populateSchoolFilter(); render(); });
    $school.addEventListener('change', render);
    $reset.addEventListener('click', resetFilters);

    $table.querySelectorAll('.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.dataset.sort;
        if (currentSort.key === key) {
          currentSort.dir = currentSort.dir === 'desc' ? 'asc' : 'desc';
        } else {
          currentSort = { key: key, dir: 'desc' };
        }
        updateSortIcons();
        render();
      });
    });

    $btnManage.addEventListener('click', openModal);
    $modalClose.addEventListener('click', closeModal);
    $overlay.addEventListener('click', function (e) { if (e.target === $overlay) closeModal(); });

    $btnAdd.addEventListener('click', showAddForm);
    $btnCancelForm.addEventListener('click', hideForm);
    $form.addEventListener('submit', onFormSubmit);

    $btnExport.addEventListener('click', exportJSON);
    $fileImport.addEventListener('change', importJSON);
    $btnRestore.addEventListener('click', restoreDefaults);
  }

  /* ========== 筛选/排序 ========== */
  function resetFilters() {
    $district.value = 'all';
    $subject.value = 'all';
    $score.value = 'all';
    populateSchoolFilter();
    currentSort = { key: 'total', dir: 'desc' };
    updateSortIcons();
    render();
  }

  function updateSortIcons() {
    $table.querySelectorAll('.sortable').forEach(function (th) {
      var icon = th.querySelector('i');
      if (th.dataset.sort === currentSort.key) {
        icon.className = currentSort.dir === 'desc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
      } else {
        icon.className = 'fas fa-sort';
      }
    });
  }

  function getFiltered() {
    var list = students.slice();
    var dist = $district.value;
    if (dist !== 'all') list = list.filter(function (s) { return s.district === dist; });
    var school = $school.value;
    if (school !== 'all') list = list.filter(function (s) { return s.school === school; });
    var scoreMin = $score.value;
    var subject = $subject.value;
    if (scoreMin !== 'all') {
      var min = parseInt(scoreMin, 10);
      list = list.filter(function (s) {
        if (subject === 'math') return s.math >= min;
        if (subject === 'physics') return s.physics >= min;
        return s.math >= min || s.physics >= min;
      });
    }
    var sortKey = currentSort.key;
    var dir = currentSort.dir === 'desc' ? -1 : 1;
    list.sort(function (a, b) {
      var va, vb;
      if (sortKey === 'total') { va = a.math + a.physics; vb = b.math + b.physics; }
      else if (sortKey === 'math') { va = a.math; vb = b.math; }
      else { va = a.physics; vb = b.physics; }
      return (va - vb) * dir;
    });
    return list;
  }

  /* ========== 渲染主表格 ========== */
  function scoreClass(score, max) {
    var ratio = score / max;
    if (ratio >= 0.95) return 'score-high';
    if (ratio >= 0.90) return 'score-good';
    return 'score-normal';
  }

  function render() {
    var list = getFiltered();
    var subject = $subject.value;
    renderTable(list, subject);
    renderStats(list);
    renderAnalytics(list);
  }

  function renderTable(list, subject) {
    var showMath = subject !== 'physics';
    var showPhysics = subject !== 'math';
    var mathTh = $table.querySelector('[data-sort="math"]');
    var physTh = $table.querySelector('[data-sort="physics"]');
    var totalTh = $table.querySelector('[data-sort="total"]');

    mathTh.style.display = showMath ? '' : 'none';
    physTh.style.display = showPhysics ? '' : 'none';

    if (subject === 'math') { totalTh.textContent = '\u6570\u5b66\u5206'; }
    else if (subject === 'physics') { totalTh.textContent = '\u7269\u7406\u5206'; }
    else { totalTh.innerHTML = '\u603b\u5206 <i class="fas fa-sort"></i>'; }
    updateSortIcons();

    $tbody.innerHTML = '';
    if (list.length === 0) {
      $empty.style.display = 'block';
      $count.textContent = '\u5171 0 \u4eba';
      return;
    }
    $empty.style.display = 'none';
    $count.textContent = '\u5171 ' + list.length + ' \u4eba';

    list.forEach(function (s, i) {
      var rank = i + 1;
      var rankClass = rank <= 3 ? 'rank-' + rank : '';
      var distClass = DISTRICT_MAP[s.district] || '';
      var total = subject === 'math' ? s.math : subject === 'physics' ? s.physics : s.math + s.physics;
      var rankContent = rank <= 3 ? '<span class="rank-medal">' + rank + '</span>' : rank;
      var mathTd = showMath ? '<td class="score-cell ' + scoreClass(s.math, 100) + '">' + s.math + '</td>' : '';
      var physTd = showPhysics ? '<td class="score-cell ' + scoreClass(s.physics, 80) + '">' + s.physics + '</td>' : '';

      var tr = document.createElement('tr');
      tr.className = rankClass;
      tr.innerHTML =
        '<td class="rank-cell">' + rankContent + '</td>' +
        '<td class="name-cell">' + s.name + '</td>' +
        '<td><span class="district-badge district-' + distClass + '">' + s.district + '</span></td>' +
        '<td class="school-cell" title="' + s.school + '">' + s.school + '</td>' +
        '<td>' + s.grade + '</td>' +
        mathTd + physTd +
        '<td class="total-cell">' + total + '</td>';
      $tbody.appendChild(tr);
    });
  }

  function renderStats(list) {
    var total = list.length;
    var math90 = list.filter(function (s) { return s.math >= 90; }).length;
    var avgMath = total ? (list.reduce(function (a, s) { return a + s.math; }, 0) / total).toFixed(1) : 0;
    var avgPhysics = total ? (list.reduce(function (a, s) { return a + s.physics; }, 0) / total).toFixed(1) : 0;

    $stats.innerHTML =
      '<div class="stat-card"><span class="stat-num">' + total + '</span><span class="stat-label">\u4e0a\u699c\u5b66\u5458</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + math90 + '</span><span class="stat-label">\u6570\u5b6690+</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + avgMath + '</span><span class="stat-label">\u6570\u5b66\u5747\u5206</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + avgPhysics + '</span><span class="stat-label">\u7269\u7406\u5747\u5206</span></div>';
  }

  function renderAnalytics(list) {
    if (list.length === 0) {
      $analytics.innerHTML = '<p style="color:#999;text-align:center;grid-column:1/-1;">\u6682\u65e0\u6570\u636e</p>';
      return;
    }
    var mathScores = list.map(function (s) { return s.math; });
    var physScores = list.map(function (s) { return s.physics; });
    var maxMath = Math.max.apply(null, mathScores), minMath = Math.min.apply(null, mathScores);
    var maxPhys = Math.max.apply(null, physScores), minPhys = Math.min.apply(null, physScores);
    var math95 = list.filter(function (s) { return s.math >= 95; }).length;
    var phys75 = list.filter(function (s) { return s.physics >= 75; }).length;
    var haidian = list.filter(function (s) { return s.district === '\u6d77\u6dc0\u533a'; }).length;
    var xicheng = list.filter(function (s) { return s.district === '\u897f\u57ce\u533a'; }).length;

    $analytics.innerHTML =
      '<div class="analytics-card gold"><div class="a-icon">\ud83c\udfc6</div><span class="a-value">' + maxMath + '</span><span class="a-label">\u6570\u5b66\u6700\u9ad8\u5206</span></div>' +
      '<div class="analytics-card red"><div class="a-icon">\ud83d\udcca</div><span class="a-value">' + minMath + '~' + maxMath + '</span><span class="a-label">\u6570\u5b66\u5206\u6570\u533a\u95f4</span></div>' +
      '<div class="analytics-card blue"><div class="a-icon">\u26a1</div><span class="a-value">' + maxPhys + '</span><span class="a-label">\u7269\u7406\u6700\u9ad8\u5206</span></div>' +
      '<div class="analytics-card green"><div class="a-icon">\ud83d\udcc8</div><span class="a-value">' + minPhys + '~' + maxPhys + '</span><span class="a-label">\u7269\u7406\u5206\u6570\u533a\u95f4</span></div>' +
      '<div class="analytics-card gold"><div class="a-icon">\ud83c\udfaf</div><span class="a-value">' + math95 + '</span><span class="a-label">\u6570\u5b6695+\u4eba\u6570</span></div>' +
      '<div class="analytics-card blue"><div class="a-icon">\ud83d\udd2c</div><span class="a-value">' + phys75 + '</span><span class="a-label">\u7269\u740675+\u4eba\u6570</span></div>' +
      '<div class="analytics-card green"><div class="a-icon">\ud83c\udfeb</div><span class="a-value">' + haidian + '</span><span class="a-label">\u6d77\u6dc0\u533a\u5b66\u5458</span></div>' +
      '<div class="analytics-card red"><div class="a-icon">\ud83c\udfeb</div><span class="a-value">' + xicheng + '</span><span class="a-label">\u897f\u57ce\u533a\u5b66\u5458</span></div>';
  }

  /* ========== 数据管理弹窗 ========== */
  function openModal() {
    $overlay.classList.add('active');
    hideForm();
    renderManageTable();
  }

  function closeModal() {
    $overlay.classList.remove('active');
    populateSchoolFilter();
    render();
  }

  function renderManageTable() {
    $manageBody.innerHTML = '';
    students.forEach(function (s) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + s.name + '</td>' +
        '<td>' + s.district + '</td>' +
        '<td>' + s.school + '</td>' +
        '<td>' + s.math + '</td>' +
        '<td>' + s.physics + '</td>' +
        '<td>' +
          '<button class="btn-edit" data-id="' + s.id + '"><i class="fas fa-pen"></i></button> ' +
          '<button class="btn-delete" data-id="' + s.id + '"><i class="fas fa-trash"></i></button>' +
        '</td>';
      $manageBody.appendChild(tr);
    });

    $manageBody.querySelectorAll('.btn-edit').forEach(function (btn) {
      btn.addEventListener('click', function () { editStudent(btn.dataset.id); });
    });
    $manageBody.querySelectorAll('.btn-delete').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteStudent(btn.dataset.id); });
    });
  }

  /* ========== 新增 / 编辑 ========== */
  function showAddForm() {
    $formTitle.textContent = '\u65b0\u589e\u5b66\u5458';
    $editId.value = '';
    $form.reset();
    document.getElementById('fGrade').value = '\u521d\u4e09';
    $formPanel.style.display = 'block';
    $formPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function editStudent(id) {
    var s = students.find(function (x) { return x.id === id; });
    if (!s) return;
    $formTitle.textContent = '\u7f16\u8f91\u5b66\u5458';
    $editId.value = id;
    document.getElementById('fName').value = s.name;
    document.getElementById('fDistrict').value = s.district;
    document.getElementById('fSchool').value = s.school;
    document.getElementById('fGrade').value = s.grade;
    document.getElementById('fMath').value = s.math;
    document.getElementById('fPhysics').value = s.physics;
    $formPanel.style.display = 'block';
    $formPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideForm() {
    $formPanel.style.display = 'none';
    $form.reset();
    $editId.value = '';
  }

  function onFormSubmit(e) {
    e.preventDefault();
    var data = {
      name: document.getElementById('fName').value.trim(),
      district: document.getElementById('fDistrict').value,
      school: document.getElementById('fSchool').value.trim(),
      grade: document.getElementById('fGrade').value.trim() || '\u521d\u4e09',
      math: parseInt(document.getElementById('fMath').value, 10),
      physics: parseInt(document.getElementById('fPhysics').value, 10),
    };

    var editId = $editId.value;
    if (editId) {
      var idx = students.findIndex(function (x) { return x.id === editId; });
      if (idx >= 0) {
        data.id = editId;
        students[idx] = data;
        toast('\u5b66\u5458\u4fe1\u606f\u5df2\u66f4\u65b0', 'success');
      }
    } else {
      data.id = genId();
      students.push(data);
      toast('\u65b0\u589e\u5b66\u5458\u6210\u529f', 'success');
    }

    saveData();
    hideForm();
    renderManageTable();
  }

  function deleteStudent(id) {
    if (!confirm('\u786e\u5b9a\u8981\u5220\u9664\u8be5\u5b66\u5458\u5417\uff1f')) return;
    students = students.filter(function (x) { return x.id !== id; });
    saveData();
    renderManageTable();
    toast('\u5df2\u5220\u9664', 'info');
  }

  /* ========== 导入 / 导出 / 恢复 ========== */
  function exportJSON() {
    var blob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '\u4e2d\u8003\u4e00\u6a21\u6210\u7ee9_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('\u6570\u636e\u5df2\u5bfc\u51fa', 'success');
  }

  function importJSON(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var arr = JSON.parse(ev.target.result);
        if (!Array.isArray(arr)) throw new Error('not array');
        arr.forEach(function (s) {
          if (!s.id) s.id = genId();
        });
        students = arr;
        saveData();
        renderManageTable();
        toast('\u5df2\u5bfc\u5165 ' + arr.length + ' \u6761\u6570\u636e', 'success');
      } catch (_) {
        toast('JSON \u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u6587\u4ef6', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function restoreDefaults() {
    if (!confirm('\u786e\u5b9a\u8981\u6062\u590d\u9ed8\u8ba4\u6570\u636e\u5417\uff1f\u5f53\u524d\u6570\u636e\u5c06\u88ab\u8986\u76d6\u3002')) return;
    students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    saveData();
    renderManageTable();
    toast('\u5df2\u6062\u590d\u9ed8\u8ba4\u6570\u636e', 'info');
  }

  /* ========== 启动 ========== */
  document.addEventListener('DOMContentLoaded', init);
})();
