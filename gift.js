// ================= 随礼版块 =================
function selectEventChip(type) { document.getElementById('gift-event').value = type; document.querySelectorAll('#page-add-gift .chip').forEach(c => c.classList.toggle('active', c.dataset.type === type)); }
function selectGiftType(type) {
    selectedGiftType = type;
    document.querySelectorAll('#page-add-gift .chip[data-gift-type]').forEach(c => { c.classList.toggle('active', c.dataset.giftType === type); });
    document.querySelectorAll('#page-add-event .chip[data-gift-type]').forEach(c => { c.classList.toggle('active', c.dataset.giftType === type); });
}
function selectEventChip2(type) { document.getElementById('event-name').value = type; document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.toggle('active', c.dataset.type === type)); }
function selectGiftAmount(amount, context) {
    const pageId = context === 'gift' ? 'page-add-gift' : 'page-add-event'; const inputId = context === 'gift' ? 'gift-amount' : 'event-amount';
    const input = document.getElementById(inputId); const chips = document.querySelectorAll(`#${pageId} .amount-chips .chip`); chips.forEach(c => c.classList.remove('active'));
    if (amount === 'other') { input.style.display = 'block'; input.value = ''; input.focus(); chips.forEach(c => { if (c.dataset.amount === 'other') c.classList.add('active'); }); }
    else { input.style.display = 'none'; input.value = amount; chips.forEach(c => { if (c.dataset.amount == amount) c.classList.add('active'); }); }
}
function triggerGiftUpload(i) { document.getElementById('gift-image-' + i).click(); }
function uploadGiftPhoto(i, input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => { compressImage(e.target.result, 500, (b64) => { giftPhotos[i] = b64; renderGiftPhotoSlot(i); }); }; reader.readAsDataURL(input.files[0]); }
function renderGiftPhotoSlot(i) {
    const p = document.getElementById('gift-image-preview-' + i); const ph = document.getElementById('gift-upload-placeholder-' + i); const rb = document.getElementById('gift-image-remove-' + i); if (!p) return;
    if (giftPhotos[i]) { p.src = giftPhotos[i]; p.style.display='block'; if(ph) ph.style.display='none'; if(rb) rb.style.display='flex'; }
    else { p.style.display='none'; if(ph) ph.style.display='flex'; if(rb) rb.style.display='none'; }
}
function removeGiftPhoto(i, ev) { if (ev) ev.stopPropagation(); giftPhotos[i] = ''; const input = document.getElementById('gift-image-' + i); if (input) input.value = ''; renderGiftPhotoSlot(i); }
function triggerEventUpload(i) { document.getElementById('event-image-' + i).click(); }
function uploadEventPhoto(i, input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => { compressImage(e.target.result, 500, (b64) => { eventPhotos[i] = b64; renderEventPhotoSlot(i); }); }; reader.readAsDataURL(input.files[0]); }
function renderEventPhotoSlot(i) {
    const p = document.getElementById('event-image-preview-' + i); const ph = document.getElementById('event-upload-placeholder-' + i); const rb = document.getElementById('event-image-remove-' + i); if (!p) return;
    if (eventPhotos[i]) { p.src = eventPhotos[i]; p.style.display='block'; if(ph) ph.style.display='none'; if(rb) rb.style.display='flex'; }
    else { p.style.display='none'; if(ph) ph.style.display='flex'; if(rb) rb.style.display='none'; }
}
function removeEventPhoto(i, ev) { if (ev) ev.stopPropagation(); eventPhotos[i] = ''; const input = document.getElementById('event-image-' + i); if (input) input.value = ''; renderEventPhotoSlot(i); }
function initGiftChart() {
    const giftEl = document.getElementById('gift-chart-container'); if (!giftEl) return; if (myGiftChart) myGiftChart.dispose(); myGiftChart = echarts.init(giftEl);
    const cc = {}; getGiftRecords().forEach(r => (r.events || []).forEach(e => { const ev = e.event || '未分类'; cc[ev] = (cc[ev] || 0) + (e.amount || 0); }));
    const data = Object.keys(cc).map(k => ({ name: k, value: cc[k] }));
    myGiftChart.setOption({ tooltip: { trigger: 'item', formatter: '{b}: ¥{c}' }, legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 12, icon: 'circle', textStyle: { fontSize: 11 } }, color: ['#f5b7b1', '#f7dc6f', '#82c8a0', '#85c1e9', '#bb8fce', '#f5b041', '#d98880', '#aed6f1'], series: [{ name: T('随礼分布'), type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: data.length > 0 ? data : [{ value: 0, name: T('暂无数据'), itemStyle: { color: '#eee' } }] }] });
}
function getGiftRecords() { return JSON.parse(localStorage.getItem('myGiftRecords')) || []; }
function saveGiftPerson() {
    const person = document.getElementById('gift-person').value.trim(); const event = document.getElementById('gift-event').value.trim(); const amount = document.getElementById('gift-amount').value; const date = document.getElementById('gift-date').value; const location = document.getElementById('gift-location').value.trim(); const remark = document.getElementById('gift-remark').value.trim();
    if (!person || !event || !amount) { showToast(T('请填写随礼人、事件和金额！'), 'error'); return; }
    const photos = giftPhotos.filter(x => x); let records = getGiftRecords(); let existing = records.find(r => r.person === person);
    const newEvent = { id: Date.now(), event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || '' };
    if (existing) { if (!Array.isArray(existing.events)) existing.events = []; existing.events.push(newEvent); } else { records.push({ id: Date.now(), person, events: [newEvent] }); }
    localStorage.setItem('myGiftRecords', JSON.stringify(records)); showToast(T('保存成功！'));
    ['gift-person','gift-event','gift-date','gift-location','gift-remark'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('gift-amount').value = ''; document.getElementById('gift-amount').style.display = 'none';
    document.querySelectorAll('#page-add-gift .chip').forEach(c => c.classList.remove('active')); selectedGiftType = '随礼'; giftPhotos = ['', '', ''];
    for (let i = 0; i < 3; i++) { const inp = document.getElementById('gift-image-' + i); if (inp) inp.value = ''; renderGiftPhotoSlot(i); }
    switchPage('page-gift-record');
}
function updateGiftStats() {
    const records = getGiftRecords(); let giftCount = 0, giftAmount = 0, receiveCount = 0, receiveAmount = 0;
    records.forEach(r => { (r.events || []).forEach(e => { const t = e.type || '随礼'; if (t === '收礼') { receiveCount++; receiveAmount += (e.amount || 0); } else { giftCount++; giftAmount += (e.amount || 0); } }); });
    const gn = document.getElementById('stat-gift-num'); const ga = document.getElementById('stat-gift-amount'); const rn = document.getElementById('stat-receive-num'); const ra = document.getElementById('stat-receive-amount');
    if (gn) gn.textContent = giftCount; if (ga) ga.textContent = '¥' + giftAmount; if (rn) rn.textContent = receiveCount; if (ra) ra.textContent = '¥' + receiveAmount;
}
function updateGiftCategoryOptions() {
    const select = document.getElementById('gift-filter-category'); if (!select) return; const current = select.value;
    while (select.options.length > 1) select.remove(1);
    const records = getGiftRecords(); const categories = new Set();
    records.forEach(r => (r.events || []).forEach(e => { if (e.event) categories.add(e.event); }));
    Array.from(categories).sort().forEach(cat => { const opt = document.createElement('option'); opt.value = cat; opt.textContent = T(cat); select.appendChild(opt); });
    select.value = current;
}
function selectGiftTopCard(type) { giftTopFilter = (giftTopFilter === type) ? '' : type; const g = document.getElementById('stat-gift-card'); const r = document.getElementById('stat-receive-card'); if (g) g.classList.toggle('active', giftTopFilter === 'gift'); if (r) r.classList.toggle('active', giftTopFilter === 'receive'); renderGiftList(); }
function setGiftCategory(v) { giftCategoryFilter = v; renderGiftList(); }
function setGiftSort(v) { giftSort = v; renderGiftList(); }
function toggleGiftSortDir() {
    giftSortDir = giftSortDir === 'desc' ? 'asc' : 'desc'; const btn = document.getElementById('gift-sort-dir-btn');
    if (giftSortDir === 'desc') { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>'; }
    else { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'; }
    renderGiftList();
}
function toggleGiftViewMode() {
    giftView = giftView === 'list' ? 'tile' : 'list'; const btn = document.getElementById('gift-view-toggle-btn');
    if (giftView === 'list') { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'; }
    else { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'; }
    renderGiftList();
}
function toggleGiftSearchBar() { const w = document.getElementById('gift-search-bar-wrapper'); w.style.display = w.style.display === 'none' ? 'block' : 'none'; if (w.style.display === 'block') { setTimeout(() => document.getElementById('gift-search-input').focus(), 100); } }
function renderGiftList() {
    updateGiftStats(); updateGiftCategoryOptions(); const records = getGiftRecords(); const container = document.getElementById('gift-list'); if (!container) return;
    const searchInput = document.getElementById('gift-search-input'); const kw = (searchInput?.value || '').toLowerCase().trim();
    let processed = records.map(r => {
        const personMatch = !kw || (r.person || '').toLowerCase().includes(kw); let events = (r.events || []).slice();
        if (kw) { events = events.filter(e => (e.event || '').toLowerCase().includes(kw) || (e.remark || '').toLowerCase().includes(kw) || (e.location || '').toLowerCase().includes(kw)); }
        if (giftTopFilter === 'gift') events = events.filter(e => (e.type || '随礼') === '随礼'); else if (giftTopFilter === 'receive') events = events.filter(e => e.type === '收礼');
        if (giftCategoryFilter) events = events.filter(e => e.event === giftCategoryFilter);
        if (personMatch && kw && events.length === 0) { events = (r.events || []).filter(e => { if (giftTopFilter === 'gift' && (e.type || '随礼') !== '随礼') return false; if (giftTopFilter === 'receive' && e.type !== '收礼') return false; if (giftCategoryFilter && e.event !== giftCategoryFilter) return false; return true; }); }
        return { ...r, filteredEvents: events, personMatch };
    }).filter(r => r.filteredEvents.length > 0 || r.personMatch && kw);
    processed.sort((a, b) => {
        let r = 0;
        if (giftSort === 'amount') { const sa = a.filteredEvents.reduce((s, e) => s + (e.amount || 0), 0); const sb = b.filteredEvents.reduce((s, e) => s + (e.amount || 0), 0); r = sb - sa; }
        else if (giftSort === 'name') { r = (a.person || '').localeCompare(b.person || ''); }
        else if (giftSort === 'date') { const ta = Math.max(...a.filteredEvents.map(e => new Date(e.date || 0).getTime())); const tb = Math.max(...b.filteredEvents.map(e => new Date(e.date || 0).getTime())); r = tb - ta; }
        else { r = b.id - a.id; }
        return giftSortDir === 'asc' ? -r : r;
    });
    container.className = giftView === 'tile' ? 'items-list-tile' : 'items-list-list';
    if (processed.length === 0) { container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('暂无匹配的记录')}</p>`; return; }
    container.innerHTML = '';
    const giftColors = ['#fadbd8', '#f5b7b1', '#f1948a', '#e6b0aa']; const receiveColors = ['#d5f4e6', '#a9dfbf', '#7dcea0', '#a2d9ce'];
    processed.forEach(record => {
        const isMulti = multiSelectMode.gift; const isChecked = isMulti && multiSelectedIds.gift.has(record.id);
        let total = 0; record.filteredEvents.forEach(e => { if (e.type === '收礼') { total += (e.amount || 0); } else { total -= (e.amount || 0); } });
        const totalText = total > 0 ? `+¥${total}` : total < 0 ? `-¥${Math.abs(total)}` : `¥0`; const firstChar = (record.person || '?').charAt(0); const count = record.filteredEvents.length;
        let tagsHtml = ''; let redIdx = 0, greenIdx = 0;
        record.filteredEvents.slice(0, 6).forEach(ev => { let bg; if (ev.type === '收礼') { bg = receiveColors[greenIdx % receiveColors.length]; greenIdx++; } else { bg = giftColors[redIdx % giftColors.length]; redIdx++; } tagsHtml += `<span class="mini-tag" style="background:${bg};color:#333;">${T(ev.event)} ¥${ev.amount}</span>`; });
        if (record.filteredEvents.length > 6) { tagsHtml += `<span class="mini-tag" style="background:#eee;color:#888;">+${record.filteredEvents.length - 6}</span>`; }
        const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';
        const div = document.createElement('div'); div.setAttribute('data-multi-id', `gift-${record.id}`); if (isChecked) div.classList.add('multi-checked');
        if (giftView === 'tile') { div.className = 'item-tile'; div.innerHTML = `${checkboxHtml}<div class="gift-avatar-tile">${firstChar}</div><div class="tile-name">${record.person}</div><div class="tile-tags">${tagsHtml}</div><div class="tile-price">${totalText}</div>`; }
        else { div.className = 'item-card-new'; div.innerHTML = `${checkboxHtml}<div class="gift-avatar">${firstChar}</div><div class="item-info-new"><div class="item-name-new">${record.person} <span class="item-qty-new">${T('{n} 笔', { n: count })}</span></div><div class="item-tag-row">${tagsHtml}</div></div><div class="gift-total-new">${totalText}</div>`; }
        if (isMulti) { div.onclick = () => toggleMultiSelected('gift', record.id); }
        else {
            div.onclick = () => showGiftDetail(record.id);
            bindLongPress(div, () => { showConfirm(T('删除随礼记录'), T('确定删除「{name}」吗？他/她的所有随礼记录都会一起删除。', { name: record.person }), () => { let records2 = getGiftRecords().filter(r => r.id !== record.id); localStorage.setItem('myGiftRecords', JSON.stringify(records2)); showToast(T('已删除')); renderGiftList(); }); });
        }
        container.appendChild(div);
    });
}
function showGiftDetail(personId) { currentGiftPersonId = personId; const record = getGiftRecords().find(r => r.id === personId); if (!record) return; document.getElementById('detail-person-name').innerText = record.person; renderGiftEventList(); switchPage('page-gift-detail'); }
function deleteGiftPerson() { if (!currentGiftPersonId) return; if (!confirm(T('确定删除这个人吗？他/她的所有随礼记录都会一起删除。'))) return; let records = getGiftRecords().filter(r => r.id !== currentGiftPersonId); localStorage.setItem('myGiftRecords', JSON.stringify(records)); currentGiftPersonId = null; showToast(T('已删除')); switchPage('page-gift-record'); }
function renderGiftEventList() {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId); const container = document.getElementById('gift-event-list'); if (!record || !container) return; container.innerHTML = '';
    [...(record.events || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(ev => {
        const div = document.createElement('div'); div.className = 'event-card';
        const bgColor = ev.type === '收礼' ? '#d5f4e6' : '#fadbd8'; const borderColor = ev.type === '收礼' ? '#82c8a0' : '#d98880';
        div.style.background = bgColor; div.style.borderLeftColor = borderColor; div.style.cursor = 'pointer'; div.setAttribute('onclick', `showEventDetail(${ev.id})`);
        div.innerHTML = `<div class="event-header">${T(ev.event)} <span style="font-size:12px;color:#666;">(${T(ev.type || '随礼')})</span></div><div class="event-info">💰 ${T('礼金')}：¥${ev.amount}</div><div class="event-info">📅 ${T('时间')}：${ev.date || T('未记录')}</div><div class="event-info">📍 ${T('地点')}：${ev.location || T('未记录')}</div>`;
        bindLongPress(div, () => {
            showConfirm(T('删除事件'), T('确定删除「{name}」这条事件吗？', { name: ev.event }), () => {
                let records = getGiftRecords(); const rec = records.find(r => r.id === currentGiftPersonId); if (!rec) return;
                rec.events = (rec.events || []).filter(e => e.id !== ev.id);
                if (rec.events.length === 0) { records = records.filter(r => r.id !== currentGiftPersonId); localStorage.setItem('myGiftRecords', JSON.stringify(records)); currentGiftPersonId = null; showToast(T('已删除')); switchPage('page-gift-record'); }
                else { localStorage.setItem('myGiftRecords', JSON.stringify(records)); showToast(T('已删除')); renderGiftEventList(); }
            });
        });
        container.appendChild(div);
    });
}
function showEventDetail(eventId) {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId); if (!record) return; const ev = (record.events || []).find(e => e.id === eventId); if (!ev) return; currentEventId = eventId;
    const bgColor = ev.type === '收礼' ? '#d5f4e6' : '#fadbd8'; const borderColor = ev.type === '收礼' ? '#82c8a0' : '#d98880';
    document.getElementById('event-detail-content').innerHTML = `<div class="event-card" style="background:${bgColor}; border-left-color:${borderColor};"><div class="event-header">${T(ev.event)} <span style="font-size:12px;color:#666;">(${T(ev.type || '随礼')})</span></div><div class="event-info">👤 ${T('随礼人')}：${record.person}</div><div class="event-info">💰 ${T('礼金')}：¥${ev.amount}</div><div class="event-info">📅 ${T('时间')}：${ev.date || T('未记录')}</div><div class="event-info">📍 ${T('地点')}：${ev.location || T('未记录')}</div></div>`;
    switchPage('page-event-detail');
}
function editGiftEvent() {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId); if (!record) return; const ev = (record.events || []).find(e => e.id === currentEventId); if (!ev) return;
    editingEventId = ev.id; document.getElementById('event-name').value = ev.event || ''; document.getElementById('event-amount').value = ev.amount || ''; document.getElementById('event-date').value = ev.date || ''; document.getElementById('event-location').value = ev.location || ''; document.getElementById('event-remark').value = ev.remark || '';
    if (ev.photos && Array.isArray(ev.photos)) { eventPhotos = [ev.photos[0] || '', ev.photos[1] || '', ev.photos[2] || '']; } else if (ev.image) { eventPhotos = [ev.image, '', '']; } else { eventPhotos = ['', '', '']; }
    for (let i = 0; i < 3; i++) { const inp = document.getElementById('event-image-' + i); if (inp) inp.value = ''; renderEventPhotoSlot(i); }
    selectedGiftType = ev.type || '随礼';
    document.querySelectorAll('#page-add-event .chip[data-gift-type]').forEach(c => { c.classList.toggle('active', c.dataset.giftType === selectedGiftType); });
    document.querySelectorAll('#page-add-event .chip[data-type]').forEach(c => { c.classList.toggle('active', c.dataset.type === ev.event); });
    switchPage('page-add-event');
}
function showAddEventPage() {
    editingEventId = null; selectedGiftType = '随礼';
    ['event-name','event-amount','event-date','event-location','event-remark'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.remove('active')); eventPhotos = ['', '', ''];
    for (let i = 0; i < 3; i++) { const inp = document.getElementById('event-image-' + i); if (inp) inp.value = ''; renderEventPhotoSlot(i); }
    switchPage('page-add-event');
}
function saveGiftEvent() {
    const event = document.getElementById('event-name').value.trim(); const amount = document.getElementById('event-amount').value; const date = document.getElementById('event-date').value; const location = document.getElementById('event-location').value.trim(); const remark = document.getElementById('event-remark').value.trim();
    if (!event || !amount) { showToast(T('请填写事件和金额！'), 'error'); return; }
    let records = getGiftRecords(); const record = records.find(r => r.id === currentGiftPersonId); if (!record) return;
    const photos = eventPhotos.filter(x => x);
    if (!Array.isArray(record.events)) record.events = [];
    if (editingEventId) {
        const idx = record.events.findIndex(e => e.id === editingEventId);
        if (idx !== -1) { record.events[idx] = { ...record.events[idx], event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || record.events[idx].image }; }
        showToast(T('修改成功！')); editingEventId = null;
    } else {
        record.events.push({ id: Date.now(), event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || '' }); showToast(T('事件添加成功！'));
    }
    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    editingEventId = null; selectedGiftType = '随礼'; eventPhotos = ['', '', ''];
    ['event-name','event-amount','event-date','event-location','event-remark'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.remove('active'));
    for (let i = 0; i < 3; i++) { const inp = document.getElementById('event-image-' + i); if (inp) inp.value = ''; renderEventPhotoSlot(i); }
    renderGiftEventList(); switchPage('page-gift-detail');
}
function deleteGiftEvent() {
    if (!currentEventId || !currentGiftPersonId) return; if (!confirm(T('确定删除这条事件吗？'))) return;
    let records = getGiftRecords(); const record = records.find(r => r.id === currentGiftPersonId); if (!record) return;
    record.events = (record.events || []).filter(e => e.id !== currentEventId);
    if (record.events.length === 0) { records = records.filter(r => r.id !== currentGiftPersonId); }
    localStorage.setItem('myGiftRecords', JSON.stringify(records)); currentEventId = null; showToast(T('已删除'));
    if (records.find(r => r.id === currentGiftPersonId)) { renderGiftEventList(); switchPage('page-gift-detail'); }
    else { currentGiftPersonId = null; switchPage('page-gift-record'); }
}