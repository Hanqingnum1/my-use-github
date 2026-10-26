// ================= 重要日期版块 =================
// 问题2：切换页面时，重置日历选中状态，恢复“今天”
(function () {
    if (typeof window.switchPage === 'function' && !window._importantSwitchWrapped) {
        window._importantSwitchWrapped = true;
        const _origSwitchPage = window.switchPage;
        window.switchPage = function (pageId) {
            if (pageId === 'page-important-dates') { selectedCalDate = null; }
            return _origSwitchPage.apply(this, arguments);
        };
    }
})();

// 问题4：计算生日/纪念日在指定年份的日期（解决日历不显示）
function getEventDateInYear(item, year) {
    if (item.type !== '生日' && item.type !== '纪念日') return item.date;
    if (item.type === '生日' && item.calendarType === '阴历' && item.lunarMonth && item.lunarDay) {
        try {
            const solar = Lunar.fromYmd(year, item.lunarMonth, item.lunarDay).getSolar();
            return `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`;
        } catch (e) { return null; }
    }
    const start = new Date(item.date); let m = start.getMonth() + 1, day = start.getDate();
    if (m === 2 && day === 29) {
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        if (!isLeap) { m = 3; day = 1; }
    }
    return `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getImportantDates() { return JSON.parse(localStorage.getItem('myImportantDates')) || []; }
function selectLevel(level) {
    selectedImportantLevel = level;
    document.querySelectorAll('.level-btn').forEach(b => b.classList.toggle('active', b.dataset.level === level));
}
function initLunarSelectors() {
    const mSelect = document.getElementById('lunar-month-select'); const dSelect = document.getElementById('lunar-day-select');
    if (!mSelect || !dSelect || mSelect.options.length > 0) return;
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    lunarMonths.forEach((m, i) => { const opt = document.createElement('option'); opt.value = i + 1; opt.textContent = m; mSelect.appendChild(opt); });
    for (let i = 1; i <= 30; i++) {
        const opt = document.createElement('option'); opt.value = i;
        const dayNames = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
        opt.textContent = dayNames[i-1]; dSelect.appendChild(opt);
    }
}
function selectImportantType(type) {
    selectedImportantType = type;
    document.querySelectorAll('#important-type-chips .chip').forEach(c => { c.classList.toggle('active', c.dataset.type === type); });
    document.getElementById('lunar-box').style.display = (type === '生日') ? 'block' : 'none';
    const eventBox = document.getElementById('event-input-box'); if (eventBox) eventBox.style.display = (type === '生日') ? 'none' : 'block';
    const levelBox = document.getElementById('level-selector-box'); if (levelBox) levelBox.style.display = (type === '普通') ? 'block' : 'none';
    updateDateBoxVisibility();
}
function selectCalendarType(cal) {
    selectedCalendarType = cal;
    document.querySelectorAll('#lunar-type-chips .chip').forEach(c => { c.classList.toggle('active', c.dataset.cal === cal); });
    updateDateBoxVisibility();
}
function updateDateBoxVisibility() {
    const isLunarBday = (selectedImportantType === '生日' && selectedCalendarType === '阴历');
    const solarBox = document.getElementById('solar-date-box'); const lunarBox = document.getElementById('lunar-date-box');
    if(solarBox) solarBox.style.display = isLunarBday ? 'none' : 'block'; if(lunarBox) lunarBox.style.display = isLunarBday ? 'block' : 'none';
    if (isLunarBday) initLunarSelectors();
}
function getNextOccurrenceDate(item) {
    if (item.type !== '生日' && item.type !== '纪念日') return item.date;
    const today = new Date(); today.setHours(0,0,0,0);
    if (item.type === '纪念日' || item.calendarType === '阳历') {
        const startDate = new Date(item.date); startDate.setHours(0,0,0,0);
        let target = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());
        if (target < today) { target = new Date(today.getFullYear() + 1, startDate.getMonth(), startDate.getDate()); }
        return `${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,'0')}-${String(target.getDate()).padStart(2,'0')}`;
    }
    if (item.type === '生日' && item.calendarType === '阴历' && item.lunarMonth && item.lunarDay) {
        try {
            let year = today.getFullYear(); let solar;
            try { solar = Lunar.fromYmd(year, item.lunarMonth, item.lunarDay).getSolar(); } catch(e) { return null; }
            let solarDate = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()); solarDate.setHours(0,0,0,0);
            if (solarDate < today) { try { solar = Lunar.fromYmd(year + 1, item.lunarMonth, item.lunarDay).getSolar(); } catch(e) { return null; } solarDate = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()); }
            return `${solarDate.getFullYear()}-${String(solarDate.getMonth()+1).padStart(2,'0')}-${String(solarDate.getDate()).padStart(2,'0')}`;
        } catch(e) { return null; }
    }
    return null;
}
function saveImportantDate() {
    const person = document.getElementById('important-person').value.trim(); let event = document.getElementById('important-event').value.trim();
    const isLunar = (selectedImportantType === '生日' && selectedCalendarType === '阴历'); let date = ''; let lunarMonth = null, lunarDay = null;
    if (isLunar) { lunarMonth = parseInt(document.getElementById('lunar-month-select').value); lunarDay = parseInt(document.getElementById('lunar-day-select').value); date = `${new Date().getFullYear()}-${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`; }
    else { date = document.getElementById('important-date').value; if (!date) { showToast(T('请填写日期！'), 'error'); return; } }
    if (selectedImportantType === '生日') { event = '生日'; }
    if (!event) { showToast(T('请填写事件！'), 'error'); return; }
    let dates = getImportantDates(); let finalLevel = selectedImportantLevel;
    if (selectedImportantType === '生日') finalLevel = '重要'; if (selectedImportantType === '纪念日') finalLevel = '非常重要';
    const newData = { person, date, event, level: finalLevel, type: selectedImportantType, calendarType: selectedCalendarType, lunarMonth, lunarDay };
    if (editingImportantId) { const idx = dates.findIndex(d => d.id === editingImportantId); if (idx !== -1) dates[idx] = { ...dates[idx], ...newData }; showToast(T('修改成功！')); }
    else { dates.push({ id: Date.now(), ...newData }); showToast(T('保存成功！')); }
    localStorage.setItem('myImportantDates', JSON.stringify(dates));
    editingImportantId = null; document.getElementById('important-person').value = ''; document.getElementById('important-date').value = ''; document.getElementById('important-event').value = '';
    selectLevel('提醒'); selectImportantType('普通'); switchPage('page-important-dates');
}
function showImportantDetail(id) {
    const item = getImportantDates().find(d => d.id === id); if (!item) return; currentImportantDetailId = id;
    const activePage = document.querySelector('.page.active')?.id; importantDetailSource = activePage === 'page-home' ? 'page-home' : 'important-dates';
    const today = new Date(); today.setHours(0, 0, 0, 0); const nextStr = getNextOccurrenceDate(item); const nextDate = new Date(nextStr); nextDate.setHours(0,0,0,0);
    const days = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    let dayText = days === 0 ? T('今天') : (days > 0 ? T('{n}天后', { n: days }) : T('已过去{n}天', { n: Math.abs(days) }));
    let typeLabel = ''; if (item.type === '生日') typeLabel = ' 🎂'; else if (item.type === '纪念日') typeLabel = ' 💖';
    let extraHtml = '';
    if (item.type === '纪念日') {
        const start = new Date(item.date); start.setHours(0,0,0,0); const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) { extraHtml = `<div class="important-card-date" style="margin-top:5px; color:#d98880; font-weight:bold;">💖 ${T('已相伴')} ${diffDays} ${T('天')}</div>`; }
    }
    // 判断是否是纪念日
    let albumHtml = '';
    if (item.type === '纪念日') {
        albumHtml = `
            <div class="card" style="margin-top: 16px; padding: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4 style="margin:0; font-size:15px;">📸 时光相册</h4>
                    <button onclick="uploadAnniversaryPhoto(${item.id})" style="background:var(--primary); color:#fff; border:none; padding:6px 12px; border-radius:8px; font-size:12px;">+ 上传照片</button>
                </div>
                <div id="anniversary-album-grid-${item.id}" class="album-timeline">
                    <div style="color:#999; font-size:12px;">加载中...</div>
                </div>
            </div>
        `;
    }
    // ... (下面的 innerHTML 赋值保持不变)

    document.getElementById('important-detail-content').innerHTML = `
        <div class="important-card level-${item.level}">
            <div class="important-card-header">
                <span class="important-card-name">${item.person ? `[${item.person}] ` : ''}${T(item.event)} ${typeLabel}</span>
                <span class="important-card-level">${T(item.level)}</span>
            </div>
            <div class="important-card-date" style="margin-top:10px;">📅 ${T('下次提醒')}：${nextStr} (${dayText})</div>
            ${extraHtml}
        </div>
        ${albumHtml}
    `;
    
    // 如果是纪念日，去数据库里读取照片并渲染
    if (item.type === '纪念日') {
        renderAnniversaryAlbum(item.id);
    }
    switchPage('page-important-detail');
}
function backFromImportantDetail() { if (typeof importantDetailSource !== 'undefined' && importantDetailSource === 'page-home') { switchPage('page-home'); } else { switchPage('page-important-dates'); } }
function editImportantDate() {
    const item = getImportantDates().find(d => d.id === currentImportantDetailId); if (!item) return;
    editingImportantId = item.id; document.getElementById('important-person').value = item.person || ''; document.getElementById('important-event').value = item.event;
    selectLevel(item.level); selectedImportantType = item.type || '普通'; selectedCalendarType = item.calendarType || '阳历'; selectImportantType(selectedImportantType); selectCalendarType(selectedCalendarType);
    if (selectedImportantType === '生日' && selectedCalendarType === '阴历' && item.lunarMonth) { document.getElementById('lunar-month-select').value = item.lunarMonth; document.getElementById('lunar-day-select').value = item.lunarDay; }
    else { document.getElementById('important-date').value = item.date; }
    switchPage('page-add-important');
}
function deleteImportantDate() { if (!currentImportantDetailId) return; if (!confirm(T('确定删除这个日期吗？'))) return; let dates = getImportantDates().filter(d => d.id !== currentImportantDetailId); localStorage.setItem('myImportantDates', JSON.stringify(dates)); currentImportantDetailId = null; showToast(T('已删除')); switchPage('page-important-dates'); }
function renderUpcomingDates() {
    const section = document.getElementById('upcoming-dates-section'); if (!section) return;
    const dates = getImportantDates(); const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = dates.map(d => { const nextStr = getNextOccurrenceDate(d); if (!nextStr) return null; const days = Math.ceil((new Date(nextStr) - today) / (1000 * 60 * 60 * 24)); return { ...d, days, nextStr }; }).filter(d => d !== null && d.days >= 0 && d.days <= 30).sort((a, b) => a.days - b.days);
    if (upcoming.length === 0) { section.innerHTML = ''; return; }
    let html = `<div class="card"><h3 style="margin-bottom:12px;">${T('马上要发生 👇')}</h3>`;
    upcoming.forEach(d => {
        let extraClass = '';
        if (d.type === '生日') extraClass = 'is-birthday';
        else if (d.type === '纪念日') extraClass = 'is-anniversary';
        extraClass += ` level-${d.level}`;
        let icon = d.type === '生日' ? '🎂' : (d.type === '纪念日' ? '💖' : '');
        html += `<div class="upcoming-card ${extraClass}" onclick="showImportantDetail(${d.id})"><div class="upcoming-info"><div class="upcoming-event">${d.person ? `[${d.person}] ` : ''}${icon} ${T(d.event)}</div><div class="upcoming-date">${d.nextStr} · ${T(d.level)}</div></div><div class="upcoming-days">${d.days}<small>${T('天后')}</small></div></div>`;
    });
    html += '</div>'; section.innerHTML = html;
}
function openCalendarPicker() { currentInputId = null; pickerMode = 'year-month'; pickerStep = 'year'; selectedYear = null; selectedMonth = null; selectedDay = null; document.getElementById('date-picker-modal').style.display = 'flex'; renderPickerBody(); }
function changeMonth(delta) { calMonth += delta; if (calMonth < 1) { calMonth = 12; calYear--; } else if (calMonth > 12) { calMonth = 1; calYear++; } selectedCalDate = null; document.getElementById('important-detail-card').style.display = 'none'; renderCalendar(); }
function toggleImportantView() { showImportantListView(); }
function showImportantListView() {
    const calHeader = document.getElementById('important-calendar-header'); const listHeader = document.getElementById('important-list-header'); const calView = document.getElementById('calendar-view'); const up7 = document.getElementById('upcoming-7days-card'); const listView = document.getElementById('important-list-view'); const filterBar = document.getElementById('important-filter-bar'); const searchBar = document.getElementById('important-search-bar');
    if (calHeader) calHeader.style.display = 'none'; if (listHeader) listHeader.style.display = 'flex'; if (calView) calView.style.display = 'none'; if (up7) up7.style.display = 'none'; if (listView) listView.style.display = 'block'; if (filterBar) filterBar.style.display = 'block'; if (searchBar) searchBar.style.display = 'none';
    importantViewMode = 'list'; renderImportantList();
}
function exitImportantList() { if (multiSelectMode.important) { exitMultiSelect('important'); } backToCalendar(); }
function renderCalendar() {
    const grid = document.getElementById('calendar-grid'); const title = document.getElementById('calendar-month-title'); title.innerText = T('{y}年{m}月', { y: calYear, m: calMonth });
    const firstDay = new Date(calYear, calMonth - 1, 1).getDay(); const daysInMonth = new Date(calYear, calMonth, 0).getDate(); const kw = importantSearchKeyword.toLowerCase();
    let dates = getImportantDates(); if (kw) dates = dates.filter(d => d.event.toLowerCase().includes(kw));
    let html = ''; for (let i = 0; i < firstDay; i++) html += '<div class="cal-cell empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`; const holiday = nationalHolidays[`${String(calMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`];
        const dayOfWeek = (firstDay + d - 1) % 7; const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        let lunarText = '', jieQiText = '';
        try { 
            if (typeof Lunar === 'undefined') {
                if (d === 1 && calMonth === 1) { // 每年1月1日弹一次，避免刷屏
                    if (typeof showToast === 'function') showToast('警告: 手机未加载 lunar.js', 'error');
                }
            } else {
                // 强制使用中午12点，避免部分手机WebView时区差异导致农历算错一天
                const lunar = Lunar.fromDate(new Date(calYear, calMonth - 1, d, 12, 0, 0)); 
                jieQiText = lunar.getJieQi() || ''; 
                lunarText = lunar.getDayInChinese() || ''; 
            }
        } catch (e) { 
            console.warn('农历计算错误:', e);
            if (d === 1) {
                if (typeof showToast === 'function') showToast('农历解析失败', 'error');
            }
        }
        const dayEvents = dates.filter(dt => getEventDateInYear(dt, calYear) === dateStr);
        const hasBirthday = dayEvents.some(ev => ev.type === '生日'); const hasAnniversary = dayEvents.some(ev => ev.type === '纪念日'); let cellExtraClass = '';
        if (hasBirthday) cellExtraClass += ' has-birthday'; if (hasAnniversary) cellExtraClass += ' has-anniversary';
        let eventsHtml = '';
        dayEvents.slice(0, 2).forEach(ev => {
            let bgColor = '#f9d5cf'; let extraClass = '';
            if (ev.type === '生日') { bgColor = '#f06292'; extraClass = 'is-birthday-event'; } else if (ev.type === '纪念日') { bgColor = '#ba68c8'; extraClass = 'is-anniversary-event'; }
            else if (ev.level === '重要') bgColor = '#e8a49b'; else if (ev.level === '非常重要') bgColor = '#c96a5a';
            eventsHtml += `<div class="cal-event-rect ${extraClass}" style="background:${bgColor}">${ev.type === '生日' ? '🎂' : (ev.type === '纪念日' ? '💖' : '')} ${T(ev.event)}</div>`;
        });
        const now = new Date(); const isToday = (calYear === now.getFullYear() && calMonth === (now.getMonth() + 1) && d === now.getDate());
        const isSelected = selectedCalDate === dateStr && !isToday;
        html += `<div class="cal-cell ${dayEvents.length > 0 ? 'has-event' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}${cellExtraClass}" data-date="${dateStr}"><span class="cal-day">${d}</span>${jieQiText ? `<span class="cal-holiday">${jieQiText}</span>` : (lunarText ? `<span class="cal-lunar">${lunarText}</span>` : '')}${holiday ? `<span class="cal-holiday">${T(holiday)}</span>` : ''}${isWeekend ? `<span class="cal-holiday" style="color:#f5b041;">${T('休')}</span>` : ''}${eventsHtml ? `<div class="cal-events">${eventsHtml}</div>` : ''}</div>`;
    }
    grid.innerHTML = html;
    document.querySelectorAll('#calendar-grid .cal-cell:not(.empty)').forEach(cell => {
        const dateStr = cell.dataset.date; if (!dateStr) return;
        let longPressFired = false; let touchMoved = false; let startX = 0, startY = 0; let lpT = null;
        const startPress = (e) => { if (e && e.cancelable) e.preventDefault(); longPressFired = false; touchMoved = false; const p = e.touches ? e.touches[0] : e; startX = p.clientX; startY = p.clientY; clearTimeout(lpT); lpT = setTimeout(() => { longPressFired = true; isLongPress = true; if (navigator.vibrate) navigator.vibrate(30); longPressNewDiary(dateStr); }, 550); };
        const movePress = (e) => { const p = e.touches ? e.touches[0] : e; if (Math.abs(p.clientX - startX) > 8 || Math.abs(p.clientY - startY) > 8) { touchMoved = true; clearTimeout(lpT); } };
        const endPress = () => { clearTimeout(lpT); if (!longPressFired && !touchMoved) { selectCalDay(dateStr); } if (longPressFired) { setTimeout(() => { isLongPress = false; }, 300); } };
        const cancelPress = () => { clearTimeout(lpT); };
        cell.addEventListener('touchstart', startPress, { passive: false }); cell.addEventListener('touchmove', movePress, { passive: true }); cell.addEventListener('touchend', endPress); cell.addEventListener('touchcancel', cancelPress);
        cell.addEventListener('mousedown', startPress); cell.addEventListener('mouseup', endPress); cell.addEventListener('mouseleave', cancelPress);
    });
    bindCalendarSwipe();
}
function renderUpcoming7Days() {
    const list = document.getElementById('upcoming-7days-list'); if (!list) return;
    const dates = getImportantDates(); const diaries = getDiaries(); const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekdayNames = ['日', '一', '二', '三', '四', '五', '六']; let html = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(today); d.setDate(today.getDate() + i); const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        let label = ''; let cls = '';
        if (i === 0) { label = T('今天'); cls = 'is-today'; } else if (i === 1) { label = T('明天'); } else if (i === 2) { label = T('后天'); } else { label = T('周' + weekdayNames[d.getDay()]); }
        const dayEvents = dates.filter(x => getNextOccurrenceDate(x) === dateStr); const dayDiaries = diaries.filter(x => x.date === dateStr);
        let contentHtml = '';
        if (dayEvents.length === 0 && dayDiaries.length === 0) { contentHtml = `<span class="day-empty">${T('暂无')}</span>`; }
        else {
            dayEvents.forEach(ev => {
                let dotColor = '#f9d5cf'; if (ev.level === '重要') dotColor = '#e8a49b'; else if (ev.level === '纪念') dotColor = '#c96a5a';
                const personPrefix = ev.person ? `[${ev.person}] ` : '';
                contentHtml += `<div class="day-event-line"><span class="day-dot" style="background:${dotColor};"></span><span>${personPrefix}${T(ev.event)}</span></div>`;
            });
            if (dayDiaries.length > 0) { contentHtml += `<div class="day-event-line"><span class="day-diary-icon">📔</span><span>${T('日记 {n} 篇', { n: dayDiaries.length })}</span></div>`; }
        }
        html += `<div class="day-row ${cls}"><div class="day-badge"><div class="day-badge-label">${label}</div><div class="day-badge-date">${d.getMonth() + 1}/${d.getDate()}</div></div><div class="day-content">${contentHtml}</div></div>`;
    }
    list.innerHTML = html;
}
function selectCalDay(dateStr) {
    const sel = window.getSelection && window.getSelection(); if (sel) sel.removeAllRanges(); if (isLongPress) { isLongPress = false; return; }
    const now = new Date(); const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; selectedCalDate = (dateStr === todayStr) ? null : dateStr; renderCalendar();
    const detail = document.getElementById('important-detail-card');
    const _selYear = parseInt(dateStr.slice(0, 4), 10);
    const dates = getImportantDates().filter(d => getEventDateInYear(d, _selYear) === dateStr); const diaries = getDiaries().filter(d => d.date === dateStr);
    const dayDiaries = diaries.filter(d => d.type === '日记'); const dayNotes = diaries.filter(d => d.type === '便签');
    if (dates.length === 0 && diaries.length === 0) { detail.style.display = 'none'; return; }
    let html = '';
    if (dates.length > 0) {
        html += `<div class="cal-detail-section">📌 ${T('重要事件')}</div>`;
        dates.forEach(d => { html += `<div class="important-card level-${d.level}" onclick="showImportantDetail(${d.id})"><div class="important-card-header"><span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${T(d.event)}</span><span class="important-card-level">${T(d.level)}</span></div><div class="important-card-date">${d.date}</div></div>`; });
    }
    if (dayDiaries.length > 0 || dayNotes.length > 0) {
        html += `<div class="cal-detail-section">📔 ${T('日记 / 便签')}</div>`; const both = dayDiaries.length > 0 && dayNotes.length > 0; html += `<div class="diary-overview-grid">`;
        if (dayDiaries.length > 0) { const preview = both ? '' : (dayDiaries[0].content || '').replace(/[□✓\n\r]/g, ' ').trim().slice(0, 40); html += `<div class="diary-overview-card diary ${both ? '' : 'full'}" onclick="openDiaryList('${dateStr}', '日记')"><div class="diary-overview-header">📔 ${T('日记')}</div><div class="diary-overview-count">${dayDiaries.length}<small>${T('篇')}</small></div>${preview ? `<div class="diary-overview-preview">${preview}</div>` : ''}</div>`; }
        if (dayNotes.length > 0) { const firstTitle = both ? '' : (dayNotes[0].title || (dayNotes[0].content || '').slice(0, 20)); html += `<div class="diary-overview-card note ${both ? '' : 'full'}" onclick="openDiaryList('${dateStr}', '便签')"><div class="diary-overview-header">📝 ${T('便签')}</div><div class="diary-overview-count">${dayNotes.length}<small>${T('篇')}</small></div>${firstTitle ? `<div class="diary-overview-preview">${firstTitle}</div>` : ''}</div>`; }
        html += `</div>`;
    }
    detail.innerHTML = html; detail.style.display = 'block';
    detail.querySelectorAll('.important-card').forEach(card => {
        const onclickAttr = card.getAttribute('onclick') || ''; const m = onclickAttr.match(/showImportantDetail\((\d+)\)/); if (!m) return; const id = parseInt(m[1]);
        bindLongPress(card, () => { const item = getImportantDates().find(d => d.id === id); if (!item) return; showConfirm(T('删除重要日期'), T('确定删除「{name}」吗？', { name: item.event }), () => { let dates2 = getImportantDates().filter(d => d.id !== id); localStorage.setItem('myImportantDates', JSON.stringify(dates2)); showToast(T('已删除')); renderUpcomingDates(); renderUpcoming7Days(); selectCalDay(dateStr); }); });
    });
}
function backToCalendar() {
    const calHeader = document.getElementById('important-calendar-header'); const listHeader = document.getElementById('important-list-header'); const calView = document.getElementById('calendar-view'); const up7 = document.getElementById('upcoming-7days-card'); const listView = document.getElementById('important-list-view'); const searchBar = document.getElementById('important-search-bar'); const filterBar = document.getElementById('important-filter-bar');
    if (calHeader) calHeader.style.display = 'flex'; if (listHeader) listHeader.style.display = 'none'; if (calView) calView.style.display = 'block'; if (up7) up7.style.display = 'block'; if (listView) listView.style.display = 'none'; if (searchBar) searchBar.style.display = 'none'; if (filterBar) filterBar.style.display = 'none';
    const si = document.getElementById('important-search-input'); if (si) si.value = ''; importantSearchKeyword = ''; importantViewMode = 'calendar'; renderCalendar();
}
function setImportantListFilter(f) { importantListFilter = f; document.querySelectorAll('#important-filter-chips .chip').forEach(c => { c.classList.toggle('active', c.dataset.filter === f); }); renderImportantList(); }
function toggleImportantSearch() { const bar = document.getElementById('important-search-bar'); bar.style.display = bar.style.display === 'none' ? 'block' : 'none'; if (bar.style.display === 'none') { importantSearchKeyword = ''; document.getElementById('important-search-input').value = ''; } else { setTimeout(() => document.getElementById('important-search-input').focus(), 100); } }
function toggleImportantMenu() { const m = document.getElementById('important-menu'); const o = document.getElementById('important-menu-overlay'); const isOpen = m.style.display !== 'none'; if (isOpen) { m.style.display = 'none'; if (o) o.style.display = 'none'; } else { m.style.display = 'block'; if (o) o.style.display = 'block'; } }
function closeImportantMenu() { const m = document.getElementById('important-menu'); const o = document.getElementById('important-menu-overlay'); if (m) m.style.display = 'none'; if (o) o.style.display = 'none'; }
function setImportantFilter(f) { importantFilter = f; updateImportantMenuButtons(); showImportantListView(); }
function setImportantTransition(t) { importantTransition = t; updateImportantMenuButtons(); showImportantListView(); }
function updateImportantMenuButtons() { document.querySelectorAll('#important-menu .filter-btn').forEach(btn => { btn.classList.remove('active'); if (btn.dataset.importantFilter && btn.dataset.importantFilter === importantFilter) btn.classList.add('active'); if (btn.dataset.importantTransition && btn.dataset.importantTransition === importantTransition) btn.classList.add('active'); }); }
function renderImportantList() {
    const container = document.getElementById('important-list-items'); if (!container) return;
    let dates = getImportantDates(); const kw = (importantSearchKeyword || '').toLowerCase().trim();
    if (kw) { dates = dates.filter(d => (d.event || '').toLowerCase().includes(kw) || (d.person || '').toLowerCase().includes(kw)); }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    dates = dates.map(d => { const nextStr = getNextOccurrenceDate(d); if (!nextStr) return null; return { ...d, nextStr, days: Math.ceil((new Date(nextStr) - today) / (1000 * 60 * 60 * 24)) }; }).filter(d => d !== null);
    if (importantListFilter === '生日') { dates = dates.filter(d => d.type === '生日'); } else if (importantListFilter === '纪念日') { dates = dates.filter(d => d.type === '纪念日'); } else if (importantListFilter === 'ongoing') { dates = dates.filter(d => d.type === '普通' && new Date(d.date) >= today); } else if (importantListFilter === 'ended') { dates = dates.filter(d => d.type === '普通' && new Date(d.date) < today); }
    dates.sort((a, b) => new Date(a.nextStr) - new Date(b.nextStr));
    if (dates.length === 0) { container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('暂无匹配的重要日期')}</p>`; return; }
    container.innerHTML = '';
    dates.forEach(d => {
        const isMulti = multiSelectMode.important; const isChecked = isMulti && multiSelectedIds.important.has(d.id);
        let dayText = d.days === 0 ? T('今天') : (d.days > 0 ? T('{n}天后', { n: d.days }) : T('已过去{n}天', { n: Math.abs(d.days) })); let icon = d.type === '生日' ? '🎂' : (d.type === '纪念日' ? '💖' : '');
        const div = document.createElement('div'); div.className = `important-card level-${d.level}`; if (isChecked) div.classList.add('multi-checked'); div.setAttribute('data-multi-id', `important-${d.id}`);
        const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';
        div.innerHTML = `${checkboxHtml}<div class="important-card-header"><span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${icon} ${T(d.event)}</span><span class="important-card-level">${T(d.level)}</span></div><div class="important-card-date">下次：${d.nextStr} · ${dayText}</div>`;
        if (isMulti) { div.onclick = () => toggleMultiSelected('important', d.id); }
        else { div.onclick = () => showImportantDetail(d.id); bindLongPress(div, () => { showConfirm(T('删除重要日期'), T('确定删除「{name}」吗？', { name: T(d.event) }), () => { let dates2 = getImportantDates().filter(x => x.id !== d.id); localStorage.setItem('myImportantDates', JSON.stringify(dates2)); showToast(T('已删除')); renderImportantList(); renderCalendar(); renderUpcomingDates(); }); }); }
        container.appendChild(div);
    });
}
// 问题5：月日历卡片左右滑动切换月份
let _calSwipeStartX = 0, _calSwipeStartY = 0, _calSwipeTracking = false, _calSwipeBound = false;
function bindCalendarSwipe() {
    if (_calSwipeBound) return;
    const el = document.getElementById('calendar-view');
    if (!el) return;
    _calSwipeBound = true;
    el.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const x = e.touches[0].clientX;
        if (x < 30 || x > window.innerWidth - 30) { _calSwipeTracking = false; return; }
        _calSwipeStartX = x; _calSwipeStartY = e.touches[0].clientY; _calSwipeTracking = true;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
        if (!_calSwipeTracking) return;
        _calSwipeTracking = false;
        const t = e.changedTouches[0];
        const dx = t.clientX - _calSwipeStartX; const dy = t.clientY - _calSwipeStartY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) changeMonth(1); else changeMonth(-1);
        }
    }, { passive: true });
}
// ================== 纪念日时光相册逻辑 ==================

// 渲染相册
async function renderAnniversaryAlbum(itemId) {
    const grid = document.getElementById(`anniversary-album-grid-${itemId}`);
    if (!grid) return;
    
    const item = getImportantDates().find(d => d.id === itemId);
    const photos = item.photos || [];
    
    if (photos.length === 0) {
        grid.innerHTML = `<div style="color:#999; font-size:12px; text-align:center; padding:10px;">还没有照片，点击上方按钮上传吧~</div>`;
        return;
    }
    
    // 按年份倒序排
    photos.sort((a, b) => b.year - a.year);
    grid.innerHTML = '';
    
    // 把 base64 取出来拼成数组，用于大图左右滑动
    window._currentAlbumPhotos = [];
    
    for (let p of photos) {
        const base64Img = await PhotoDB.getImage(p.key);
        if (base64Img) {
            window._currentAlbumPhotos.push({ year: p.year, img: base64Img, key: p.key });
            
            const div = document.createElement('div');
            div.className = 'album-item';
            div.innerHTML = `
                <div class="album-year">📅 ${p.year} 年</div>
                <div class="album-img-wrap">
                    <img src="${base64Img}">
                </div>
            `;
            
            // 点击查看大图
            div.querySelector('.album-img-wrap').onclick = (e) => {
                if (window._longPressFired) { window._longPressFired = false; return; }
                showFullScreenImage(base64Img, itemId, p.key, p.year);
            };
            
            grid.appendChild(div);
        }
    }
}

// ================== 全屏查看图片 (支持修改年份/删除) ==================
function showFullScreenImage(src, itemId, photoKey, currentYear) {
    let overlay = document.getElementById('global-image-preview');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-image-preview';
        
        const img = document.createElement('img');
        img.id = 'global-preview-img';
        
        const actions = document.createElement('div');
        actions.className = 'preview-actions';
        actions.innerHTML = `
            <button class="preview-btn" id="btn-edit-year">✏️ 修改年份</button>
            <button class="preview-btn" id="btn-del-photo" style="background:rgba(217, 83, 79, 0.6);">🗑️ 删除</button>
        `;
        
        overlay.appendChild(img);
        overlay.appendChild(actions);
        document.body.appendChild(overlay);
        
        // 点击黑色背景关闭
        overlay.onclick = (e) => {
            if (e.target === overlay || e.target.id === 'global-preview-img') {
                overlay.classList.remove('show');
            }
        };
    }
    
    const imgEl = document.getElementById('global-preview-img');
    imgEl.src = src;
    
    // 绑定修改年份
    document.getElementById('btn-edit-year').onclick = () => {
        showPrompt('修改年份', '请输入新的年份', String(currentYear), (newYearStr) => {
            const newYear = parseInt(newYearStr);
            if (isNaN(newYear)) { showToast('年份格式错误', 'error'); return; }
            
            let dates = getImportantDates();
            let item = dates.find(d => d.id === itemId);
            if (item) {
                let photo = item.photos.find(p => p.key === photoKey);
                if (photo) photo.year = newYear;
                localStorage.setItem('myImportantDates', JSON.stringify(dates));
                showToast('年份修改成功');
                overlay.classList.remove('show');
                renderAnniversaryAlbum(itemId); // 重新渲染
            }
        });
    };
    
    // 绑定删除
    document.getElementById('btn-del-photo').onclick = () => {
        showConfirm('删除照片', `确定要删除这张照片吗？`, async () => {
            overlay.classList.remove('show');
            await PhotoDB.deleteImage(photoKey);
            
            let dates = getImportantDates();
            let item = dates.find(d => d.id === itemId);
            if (item) {
                item.photos = item.photos.filter(p => p.key !== photoKey);
                localStorage.setItem('myImportantDates', JSON.stringify(dates));
                renderAnniversaryAlbum(itemId); // 重新渲染
                showToast('照片已删除');
            }
        });
    };
    
    overlay.classList.add('show');
}

// 上传照片
function uploadAnniversaryPhoto(itemId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // 调用 core.js 中写好的美化弹窗
        if (typeof showPrompt === 'function') {
            showPrompt('上传照片', '请输入照片对应的年份（如 2024）', String(new Date().getFullYear()), async (yearStr) => {
                if (!yearStr) return;
                await processAnniversaryPhoto(itemId, file, yearStr);
            });
        }
    };
    input.click();
}

// 抽取出来的保存逻辑
async function processAnniversaryPhoto(itemId, file, yearStr) {
    const year = parseInt(yearStr);
    if (isNaN(year)) { if(typeof showToast==='function') showToast('年份格式错误', 'error'); return; }
    
    if(typeof showToast==='function') showToast('正在保存原图...');
    
    try {
        const key = `anniv_${itemId}_${Date.now()}`;
        await PhotoDB.saveImage(key, file);
        
        let dates = getImportantDates();
        let idx = dates.findIndex(d => d.id === itemId);
        if (idx !== -1) {
            if (!dates[idx].photos) dates[idx].photos = [];
            dates[idx].photos.push({ year: year, key: key });
            localStorage.setItem('myImportantDates', JSON.stringify(dates));
            
            if(typeof showToast==='function') showToast('照片上传成功！');
            renderAnniversaryAlbum(itemId);
        }
    } catch (err) {
        console.error(err);
        if(typeof showToast==='function') showToast('保存失败，请重试', 'error');
    }
}