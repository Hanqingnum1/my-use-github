// ================= 日记 / 便签版块 =================
const diaryTemplates = [
    { id: 'd1', name: '今日心情', icon: '😊', content: '【今天的心情】\n\n\n【今天发生的事】\n\n\n【最难忘的瞬间】\n\n' },
    { id: 'd2', name: '感恩日记', icon: '🙏', content: '【今天值得感恩的3件事】\n1. \n2. \n3. \n\n【我想感谢的人】\n\n' },
    { id: 'd3', name: '反思日记', icon: '🤔', content: '【今天学到了什么】\n\n\n【做得好的地方】\n\n\n【可以改进的地方】\n\n' },
    { id: 'd4', name: '旅行日记', icon: '✈️', content: '【去了哪里】\n\n【见了谁】\n\n【吃了什么】\n\n【感受】\n' },
    { id: 'd5', name: '自由记录', icon: '📖', content: '' }
];
const noteTemplates = [
    { id: 'n1', name: '待办清单', icon: '✅', content: '□ \n□ \n□ \n□ \n□ ' },
    { id: 'n2', name: '购物清单', icon: '🛒', content: '□ \n□ \n□ \n□ ' },
    { id: 'n3', name: '灵感记录', icon: '💡', content: '灵感来源：\n\n具体想法：\n\n' },
    { id: 'n4', name: '提醒事项', icon: '⏰', content: '别忘了：\n\n截止时间：\n\n' },
    { id: 'n5', name: '空白便签', icon: '📝', content: '' }
];
function getDiaries() { return JSON.parse(localStorage.getItem('myDiaries')) || []; }
function saveDiaries(list) { localStorage.setItem('myDiaries', JSON.stringify(list)); }
function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function openDiaryList(dateStr, type) { currentDiaryListDate = dateStr; currentDiaryListType = type; document.getElementById('diary-list-title').textContent = T(type); renderDiaryList(); switchPage('page-diary-list'); }
function renderDiaryList() {
    const container = document.getElementById('diary-list-content'); if (!container) return;
    const list = getDiaries().filter(d => d.date === currentDiaryListDate && d.type === currentDiaryListType).sort((a, b) => b.createdAt - a.createdAt);
    if (list.length === 0) { container.innerHTML = `<div class="diary-list-empty">${T('这一天还没有记录')}</div>`; return; }
    container.innerHTML = '';
    list.forEach(d => {
        const isMulti = multiSelectMode.diary; const isChecked = isMulti && multiSelectedIds.diary.has(d.id);
        const card = document.createElement('div'); card.className = 'diary-list-card' + (d.type === '便签' ? ' note' : '');
        if (isChecked) card.classList.add('multi-checked'); card.setAttribute('data-multi-id', `diary-${d.id}`);
        const icon = d.type === '日记' ? '📔' : '📝'; const time = new Date(d.createdAt); const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
        let preview = (d.content || '').replace(/^[□☑✓]\s*/gm, '').trim(); const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';
        card.innerHTML = `${checkboxHtml}<div class="diary-list-card-header"><span>${icon} ${T(d.type)}</span><span>${timeStr}</span></div>${d.title ? `<div class="diary-list-card-title">${escapeHtml(d.title)}</div>` : ''}${preview ? `<div class="diary-list-card-preview">${escapeHtml(preview)}</div>` : ''}`;
        if (isMulti) { card.onclick = () => toggleMultiSelected('diary', d.id); }
        else {
            card.onclick = () => showDiaryView(d.id);
            bindLongPress(card, () => { showConfirm(T('删除日记'), T('确定删除这条{type}吗？', { type: T(d.type) }), () => { const list2 = getDiaries().filter(x => x.id !== d.id); saveDiaries(list2); showToast(T('已删除')); renderDiaryList(); }); });
        }
        container.appendChild(card);
    });
}
function backToDiaryList() { switchPage('page-diary-list'); setTimeout(() => renderDiaryList(), 30); }
function showDiaryView(id) {
    const d = getDiaries().find(x => x.id === id); if (!d) return; currentDiaryViewId = id;
    const icon = d.type === '日记' ? '📔' : '📝'; const time = new Date(d.createdAt); const timeStr = `${time.getFullYear()}-${String(time.getMonth()+1).padStart(2,'0')}-${String(time.getDate()).padStart(2,'0')} ${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
    document.getElementById('diary-view-content').innerHTML = `<div class="card"><div class="diary-view-meta"><span>${icon} ${T(d.type)}</span><span>${timeStr}</span></div>${d.title ? `<div class="diary-view-title">${escapeHtml(d.title)}</div>` : ''}${renderDiaryViewBody(d)}</div>`;
    switchPage('page-diary-view');
}
function renderDiaryViewBody(d) {
    const content = d.content || ''; const lines = content.split('\n'); const hasTask = lines.some(l => /^[□☑✓]/.test(l));
    if (!hasTask) { return `<div class="diary-view-body">${escapeHtml(content)}</div>`; }
    let html = '';
    lines.forEach((line, idx) => {
        const m = line.match(/^([□☑✓])\s*(.*)$/);
        if (m) {
            const checked = m[1] !== '□'; const text = m[2] || '&nbsp;';
            html += `<div class="diary-task-item ${checked ? 'checked' : ''}" data-line="${idx}" onclick="toggleDiaryTask(${idx})"><div class="diary-task-box"></div><div class="diary-task-text">${m[2] ? escapeHtml(m[2]) : '&nbsp;'}</div></div>`;
        } else if (line.trim()) { html += `<div style="margin:6px 0; color:var(--text-sub); font-size:13px; white-space:pre-wrap;">${escapeHtml(line)}</div>`; }
    });
    return html;
}
function toggleDiaryTask(lineIndex) {
    const diaries = getDiaries(); const d = diaries.find(x => x.id === currentDiaryViewId); if (!d) return;
    const lines = (d.content || '').split('\n'); const line = lines[lineIndex]; if (!line) return;
    const m = line.match(/^([□☑✓])(\s*)(.*)$/); if (!m) return;
    const newMark = m[1] === '□' ? '☑' : '□'; lines[lineIndex] = newMark + m[2] + m[3]; d.content = lines.join('\n'); saveDiaries(diaries);
    const el = document.querySelector(`#diary-view-content .diary-task-item[data-line="${lineIndex}"]`); if (el) el.classList.toggle('checked', newMark === '☑');
}
function editDiaryFromView() { if (!currentDiaryViewId) return; editDiary(currentDiaryViewId); }
function deleteDiaryFromView() {
    if (!currentDiaryViewId) return; const d = getDiaries().find(x => x.id === currentDiaryViewId); if (!d) return;
    showConfirm(T('删除日记'), T('确定删除这条{type}吗？', { type: T(d.type) }), () => { let list = getDiaries().filter(x => x.id !== currentDiaryViewId); saveDiaries(list); showToast(T('已删除')); currentDiaryViewId = null; switchPage('page-diary-list'); setTimeout(() => renderDiaryList(), 30); });
}
function showTemplateModalFromList() {
    diaryEditSource = 'list'; currentDiaryType = currentDiaryListType; diaryPanelDate = currentDiaryListDate;
    document.getElementById('type-chip-diary').classList.toggle('active', currentDiaryType === '日记'); document.getElementById('type-chip-note').classList.toggle('active', currentDiaryType === '便签');
    renderTemplateGrid(); document.getElementById('template-modal').style.display = 'flex';
}
function longPressNewDiary(dateStr) {
    isLongPress = false; diaryPanelDate = dateStr; diaryEditSource = 'calendar'; currentDiaryType = '日记';
    document.getElementById('type-chip-diary').classList.add('active'); document.getElementById('type-chip-note').classList.remove('active');
    renderTemplateGrid(); document.getElementById('template-modal').style.display = 'flex';
}
function openDiaryPanel(dateStr) {
    diaryPanelDate = dateStr; const d = new Date(dateStr); const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('diary-panel-date').textContent = T('{y}年{m}月{day}日', { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() });
    document.getElementById('diary-panel-weekday').textContent = t('date.weekday.' + d.getDay()); renderDiaryPanel(dateStr);
    document.getElementById('diary-panel').classList.add('open'); document.getElementById('diary-panel-overlay').classList.add('open');
}
function closeDiaryPanel() { document.getElementById('diary-panel').classList.remove('open'); document.getElementById('diary-panel-overlay').classList.remove('open'); if (diaryPanelDate) selectCalDay(diaryPanelDate); }
function renderDiaryPanel(dateStr) {
    const body = document.getElementById('diary-panel-body'); const diaries = getDiaries().filter(d => d.date === dateStr);
    if (diaries.length === 0) { body.innerHTML = `<p style="text-align:center; color:#999; padding:40px 20px;">${T('这一天还没有记录')}<br><br>${T('点右上角')} <b style="color:#d98880;">+</b> ${T('添加日记或便签')}</p>`; return; }
    body.innerHTML = ''; diaries.sort((a, b) => b.createdAt - a.createdAt);
    diaries.forEach(d => {
        const card = document.createElement('div'); card.className = 'diary-card'; card.setAttribute('onclick', `editDiary(${d.id})`);
        const icon = d.type === '日记' ? '📔' : '📝'; const time = new Date(d.createdAt); const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
        card.innerHTML = `<div class="diary-card-header"><span class="diary-card-type">${icon} ${d.type === '日记' ? T('日记') : T('便签')}</span><span class="diary-card-time">${timeStr}</span></div>${d.title ? `<div class="diary-card-title">${d.title}</div>` : ''}<div class="diary-card-content">${(d.content || '').replace(/</g,'&lt;')}</div>`;
        bindLongPress(card, () => { showConfirm(T('删除日记'), T('确定删除这条{type}吗？', { type: T(d.type) }), () => { let diaries = getDiaries().filter(x => x.id !== d.id); saveDiaries(diaries); showToast(T('已删除')); renderDiaryPanel(dateStr); }); });
        body.appendChild(card);
    });
}
function showTemplateModal() {
    closeDiaryPanel(); diaryEditSource = 'panel'; currentDiaryType = '日记';
    document.getElementById('type-chip-diary').classList.add('active'); document.getElementById('type-chip-note').classList.remove('active');
    renderTemplateGrid(); document.getElementById('template-modal').style.display = 'flex';
}
function closeTemplateModal() { document.getElementById('template-modal').style.display = 'none'; }
function switchTemplateType(type) { currentDiaryType = type; document.getElementById('type-chip-diary').classList.toggle('active', type === '日记'); document.getElementById('type-chip-note').classList.toggle('active', type === '便签'); renderTemplateGrid(); }
function renderTemplateGrid() {
    const templates = currentDiaryType === '日记' ? diaryTemplates : noteTemplates; const grid = document.getElementById('template-grid'); grid.innerHTML = '';
    templates.forEach(tpl => { const div = document.createElement('div'); div.className = 'template-item'; div.setAttribute('onclick', `selectTemplate('${tpl.id}')`); div.innerHTML = `<div class="template-icon">${tpl.icon}</div><div class="template-name">${T(tpl.name)}</div>`; grid.appendChild(div); });
}
function selectTemplate(templateId) {
    const templates = currentDiaryType === '日记' ? diaryTemplates : noteTemplates; const t = templates.find(x => x.id === templateId); if (!t) return;
    editingDiaryId = null; currentDiaryTemplate = t.id; document.getElementById('diary-edit-title').textContent = currentDiaryType === '日记' ? T('写日记') : T('写便签');
    document.getElementById('diary-title-input').value = ''; document.getElementById('diary-content-input').value = t.content; document.getElementById('diary-delete-btn').style.display = 'none';
    closeTemplateModal(); document.getElementById('diary-panel').classList.remove('open'); document.getElementById('diary-panel-overlay').classList.remove('open');
    switchPage('page-diary-edit');
}
function editDiary(id) {
    const d = getDiaries().find(x => x.id === id); if (!d) return;
    const activePage = document.querySelector('.page.active')?.id; diaryEditSource = (activePage === 'page-diary-view' || activePage === 'page-diary-list') ? 'list' : 'panel';
    editingDiaryId = id; diaryPanelDate = d.date; currentDiaryType = d.type; document.getElementById('diary-edit-title').textContent = d.type === '日记' ? T('编辑日记') : T('编辑便签');
    document.getElementById('diary-title-input').value = d.title || ''; document.getElementById('diary-content-input').value = d.content || ''; document.getElementById('diary-delete-btn').style.display = 'block';
    document.getElementById('diary-panel').classList.remove('open'); document.getElementById('diary-panel-overlay').classList.remove('open');
    switchPage('page-diary-edit');
}
function saveDiary() {
    if (!diaryPanelDate) { showToast(T('日期错误'), 'error'); return; }
    const title = document.getElementById('diary-title-input').value.trim(); const content = document.getElementById('diary-content-input').value;
    if (!title && !content.trim()) { showToast(T('内容不能为空'), 'error'); return; }
    let diaries = getDiaries(); let savedId; const wasEditing = !!editingDiaryId;
    if (editingDiaryId) { savedId = editingDiaryId; const idx = diaries.findIndex(d => d.id === editingDiaryId); if (idx !== -1) diaries[idx] = { ...diaries[idx], title, content }; showToast(T('修改成功！')); }
    else { savedId = Date.now(); diaries.push({ id: savedId, date: diaryPanelDate, type: currentDiaryType, title, content, createdAt: Date.now() }); showToast(T('保存成功！')); }
    saveDiaries(diaries); editingDiaryId = null;
    if (diaryEditSource === 'list') { if (wasEditing) { showDiaryView(savedId); } else { currentDiaryListType = currentDiaryType; switchPage('page-diary-list'); setTimeout(() => renderDiaryList(), 30); } }
    else if (diaryEditSource === 'calendar') { switchPage('page-important-dates'); setTimeout(() => selectCalDay(diaryPanelDate), 100); }
    else { switchPage('page-important-dates'); setTimeout(() => openDiaryPanel(diaryPanelDate), 150); }
}
function cancelDiaryEdit() {
    const wasEditing = !!editingDiaryId; const editId = editingDiaryId; editingDiaryId = null;
    if (diaryEditSource === 'list') { if (wasEditing) { showDiaryView(editId); } else { switchPage('page-diary-list'); setTimeout(() => renderDiaryList(), 30); } }
    else if (diaryEditSource === 'calendar') { switchPage('page-important-dates'); setTimeout(() => selectCalDay(diaryPanelDate), 100); }
    else { switchPage('page-important-dates'); setTimeout(() => { if (diaryPanelDate) openDiaryPanel(diaryPanelDate); }, 150); }
}
function deleteDiary() {
    if (!editingDiaryId) return; if (!confirm(T('确定删除这条记录吗？'))) return;
    let diaries = getDiaries().filter(d => d.id !== editingDiaryId); saveDiaries(diaries); editingDiaryId = null;
    if (diaryEditSource === 'list') { currentDiaryViewId = null; switchPage('page-diary-list'); setTimeout(() => renderDiaryList(), 30); }
    else if (diaryEditSource === 'calendar') { switchPage('page-important-dates'); setTimeout(() => selectCalDay(diaryPanelDate), 100); }
    else { switchPage('page-important-dates'); setTimeout(() => openDiaryPanel(diaryPanelDate), 150); }
}