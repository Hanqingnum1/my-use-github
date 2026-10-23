// ================= 物品版块 =================
const categoryConfig = [
    { name: '家电', color: '#4A90A4', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="12" cy="16" r="1.5"/></svg>' },
    { name: '电子产品', color: '#7B68A6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    { name: '食品', color: '#D4A574', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
    { name: '厨房食材', color: '#7BA05B', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9 9 0 019 9c0 5-9 11-9 11S3 16 3 11a9 9 0 019-9z"/></svg>' },
    { name: '护肤品', color: '#E8A4B8', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6v3H9z"/><path d="M7 5h10l1 16H6L7 5z"/></svg>' },
    { name: '化妆品', color: '#C75B7A', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v6h-4z"/><path d="M8 8h8l1 14H7L8 8z"/></svg>' },
    { name: '生活用品', color: '#5DA9A0', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-1 18H7L6 3z"/><path d="M8 7h8"/></svg>' },
    { name: '书本', color: '#8B6F47', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 00-4 4V4z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/></svg>' },
    { name: '学习资料', color: '#5B7FA6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
    { name: '手办', color: '#D4A82A', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18.5 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>' }
];
const acquireConfig = [
    { name: '网购', color: '#5B7FA6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
    { name: '线下', color: '#7BA05B', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 22V12h6v10"/></svg>' },
    { name: '赠送', color: '#E8A4B8', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>' },
    { name: '白嫖', color: '#D4A82A', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18.5 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>' },
    { name: '其他', color: '#9E9E9E', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
];

function selectAcquire(v) { selectedAcquire = v; renderAcquireGrid(); }
function selectItemStatus(v) { selectedItemStatus = v; document.querySelectorAll('#page-add .chip[data-status]').forEach(c => { c.classList.toggle('active', c.dataset.status === v); }); }
function renderCategoryGrid() {
    const grid = document.getElementById('category-grid'); if (!grid) return; grid.innerHTML = '';
    categoryConfig.forEach(c => {
        const div = document.createElement('div'); div.className = 'category-item' + (selectedCategoryName === c.name ? ' active' : ''); div.style.setProperty('--cat-color', c.color); div.onclick = () => selectCategoryIcon(c.name);
        div.innerHTML = `<div class="category-icon">${c.icon}</div><div class="category-name">${T(c.name)}</div>`; grid.appendChild(div);
    });
}
function selectCategoryIcon(name) { selectedCategoryName = name; renderCategoryGrid(); updateDateFieldsVisibility(); }
function renderAcquireGrid() {
    const grid = document.getElementById('acquire-grid'); if (!grid) return; grid.innerHTML = '';
    acquireConfig.forEach(c => {
        const div = document.createElement('div'); div.className = 'category-item' + (selectedAcquire === c.name ? ' active' : ''); div.style.setProperty('--cat-color', c.color); div.onclick = () => selectAcquire(c.name);
        div.innerHTML = `<div class="category-icon">${c.icon}</div><div class="category-name">${T(c.name)}</div>`; grid.appendChild(div);
    });
}
function updateDateFieldsVisibility() {
    const cat = selectedCategoryName; const expiryBox = document.getElementById('expiry-box'); const warrantyBox = document.getElementById('warranty-box');
    if (!expiryBox || !warrantyBox) return; expiryBox.style.display = 'none'; warrantyBox.style.display = 'none';
    if (cat === '家电' || cat === '电子产品') { warrantyBox.style.display = 'block'; }
    else if (cat === '食品' || cat === '厨房食材' || cat === '护肤品' || cat === '化妆品') { expiryBox.style.display = 'block'; }
}
function triggerImageUpload(index) { document.getElementById('item-image-' + index).click(); }
function uploadItemImage(index, input) {
    if (!input.files[0]) return; const reader = new FileReader();
    reader.onload = (e) => { compressImage(e.target.result, 500, (b64) => { editingItemImages[index] = b64; renderImageSlot(index); }); };
    reader.readAsDataURL(input.files[0]);
}
function renderImageSlot(index) {
    const preview = document.getElementById('item-image-preview-' + index); const placeholder = document.getElementById('upload-placeholder-' + index); const removeBtn = document.getElementById('image-remove-' + index);
    if (!preview) return;
    if (editingItemImages[index]) { preview.src = editingItemImages[index]; preview.style.display = 'block'; if (placeholder) placeholder.style.display = 'none'; if (removeBtn) removeBtn.style.display = 'flex'; }
    else { preview.style.display = 'none'; if (placeholder) placeholder.style.display = 'flex'; if (removeBtn) removeBtn.style.display = 'none'; }
}
function removeItemImage(index, event) { if (event) event.stopPropagation(); editingItemImages[index] = ''; const input = document.getElementById('item-image-' + index); if (input) input.value = ''; renderImageSlot(index); }
function renderAllImageSlots() { for (let i = 0; i < 3; i++) renderImageSlot(i); }
function changeQuantity(delta) { const input = document.getElementById('item-quantity'); let v = parseInt(input.value) || 1; v += delta; if (v < 1) v = 1; if (v > 999) v = 999; input.value = v; }
function clampQuantity() { const input = document.getElementById('item-quantity'); let v = parseInt(input.value) || 1; if (v < 1) v = 1; if (v > 999) v = 999; input.value = v; }
function getItems() { return JSON.parse(localStorage.getItem('myItems')) || []; }
function deleteItem() { if (!editingItemId) return; if (!confirm(T('确定删除这件物品吗？'))) return; let items = getItems().filter(i => i.id !== editingItemId); localStorage.setItem('myItems', JSON.stringify(items)); editingItemId = null; showToast(T('已删除')); switchPage('page-all-items'); }
function saveItem() {
    const name = document.getElementById('item-name').value.trim(); const category = selectedCategoryName; const price = document.getElementById('item-price').value; const quantity = document.getElementById('item-quantity').value || 1; const remark = document.getElementById('item-remark').value.trim();
    if (!name) { showToast(T('请填写物品名称！'), 'error'); return; } if (!category) { showToast(T('请选择分类！'), 'error'); return; }
    const images = editingItemImages.filter(x => x); const mainImage = images[0] || '';
    let items = getItems(); const purchaseDate = document.getElementById('purchase-date').value; const expiryDate = document.getElementById('expiry-date').value; const warrantyDate = document.getElementById('warranty-date').value; const status = selectedItemStatus || '持有中'; const acquireMethod = selectedAcquire || '网购';
    if (editingItemId) { const idx = items.findIndex(i => i.id === editingItemId); if (idx !== -1) { items[idx] = { ...items[idx], name, category, price, quantity, image: mainImage, images: images, purchaseDate, expiryDate, warrantyDate, status, acquireMethod, remark }; } showToast(T('修改成功！')); }
    else { items.push({ id: Date.now(), name, category, price: price || 0, quantity, image: mainImage, images: images, purchaseDate, expiryDate, warrantyDate, status, acquireMethod, remark }); showToast(T('保存成功！')); }
    localStorage.setItem('myItems', JSON.stringify(items)); resetForm(); switchPage('page-all-items');
}
function resetForm() {
    editingItemId = null; document.getElementById('item-edit-title').textContent = T('添加物品'); document.getElementById('item-submit-text').textContent = T('添加物品'); document.getElementById('item-name').value = ''; document.getElementById('item-price').value = ''; document.getElementById('item-quantity').value = '1'; document.getElementById('purchase-date').value = ''; document.getElementById('expiry-date').value = ''; document.getElementById('warranty-date').value = ''; document.getElementById('item-remark').value = ''; document.getElementById('expiry-box').style.display = 'none'; document.getElementById('warranty-box').style.display = 'none';
    for (let i = 0; i < 3; i++) { editingItemImages[i] = ''; const input = document.getElementById('item-image-' + i); if (input) input.value = ''; }
    renderAllImageSlots(); selectedCategoryName = ''; renderCategoryGrid(); selectedAcquire = '网购'; renderAcquireGrid(); selectedItemStatus = '持有中';
    document.querySelectorAll('#page-add .chip[data-status]').forEach(c => { c.classList.toggle('active', c.dataset.status === '持有中'); });
    const delBtn = document.getElementById('item-delete-btn'); if (delBtn) delBtn.style.display = 'none';
}
function updateDashboard() {
    const items = getItems(); document.getElementById('total-count').innerText = T('{n} 件', { n: items.length }); let totalPrice = 0; items.forEach(i => totalPrice += parseFloat(i.price || 0)); document.getElementById('total-item-price').innerText = '¥ ' + totalPrice.toFixed(2);
    const records = getGiftRecords(); let totalGift = 0; let giftCount = 0; records.forEach(r => { (r.events || []).forEach(e => { totalGift += (e.amount || 0); giftCount++; }); });
    document.getElementById('total-gift-amount').innerText = '¥ ' + totalGift.toFixed(2); document.getElementById('total-gift-count').innerText = T('{n} 笔', { n: giftCount });
}
function getDaysRemaining(dateString) { if (!dateString) return null; const target = new Date(dateString); const today = new Date(); today.setHours(0, 0, 0, 0); return Math.ceil((target - today) / (1000 * 60 * 60 * 24)); }
function toggleFilterMenu() { const m = document.getElementById('filter-menu'); const o = document.getElementById('filter-menu-overlay'); const isOpen = m.style.display !== 'none'; if (isOpen) { m.style.display = 'none'; if (o) o.style.display = 'none'; } else { m.style.display = 'block'; if (o) o.style.display = 'block'; } }
function closeFilterMenu() { const m = document.getElementById('filter-menu'); const o = document.getElementById('filter-menu-overlay'); if (m) m.style.display = 'none'; if (o) o.style.display = 'none'; }
function setFilterType(t) { filterType = t; updateFilterButtons(); renderItemsList(); }
function setFilterStatus(s) { filterStatus = s; updateFilterButtons(); renderItemsList(); }
function updateFilterButtons() { document.querySelectorAll('#filter-menu .filter-btn').forEach(btn => { btn.classList.remove('active'); if (btn.dataset.filterType && btn.dataset.filterType === filterType) btn.classList.add('active'); if (btn.dataset.filterStatus && btn.dataset.filterStatus === filterStatus) btn.classList.add('active'); }); }
function getItemStatus(item) { return item.status || '持有中'; }
function getItemAcquire(item) { return item.acquireMethod || '网购'; }
function isHeld(item) { if (getItemStatus(item) === '已移除') return false; const d = getDaysRemaining(item.expiryDate); if (d !== null && d < 0) return false; return true; }
function isExpiringSoon(item) { const cat = item.category; const d = getDaysRemaining(item.expiryDate); if (d === null || d < 0) return false; if (cat === '食品' || cat === '厨房食材') return d <= 60; if (cat === '护肤品' || cat === '化妆品') return d <= 180; return false; }
function isWarrantyExpiringSoon(item) { const cat = item.category; if (cat !== '家电' && cat !== '电子产品') return false; const d = getDaysRemaining(item.warrantyDate); if (d === null || d < 0) return false; return d <= 180; }
function updateItemStats() {
    const items = getItems().filter(i => getItemStatus(i) !== '已移除'); const heldItems = getItems().filter(isHeld); const pausedCount = heldItems.filter(i => getItemStatus(i) === '暂离中').length;
    const heldNum = document.getElementById('stat-held-num'); const extra = document.getElementById('stat-held-extra'); const expNum = document.getElementById('stat-expiring-num'); const warNum = document.getElementById('stat-warranty-num');
    if (heldNum) heldNum.textContent = heldItems.length; if (extra) extra.textContent = pausedCount > 0 ? T('暂离 {n}', { n: pausedCount }) : '';
    if (expNum) expNum.textContent = items.filter(isExpiringSoon).length; if (warNum) warNum.textContent = items.filter(isWarrantyExpiringSoon).length;
}
function selectTopCard(type) {
    allItemsTopFilter = (allItemsTopFilter === type) ? '' : type;
    const h = document.getElementById('stat-held'); const e = document.getElementById('stat-expiring'); const w = document.getElementById('stat-warranty');
    if (h) h.classList.toggle('active', allItemsTopFilter === 'held'); if (e) e.classList.toggle('active', allItemsTopFilter === 'expiring'); if (w) w.classList.toggle('active', allItemsTopFilter === 'warranty');
    renderItemsList();
}
function setAllItemsFilter(v) { allItemsFilter = v; renderItemsList(); }
function setAllItemsCategory(v) { allItemsCategory = v; renderItemsList(); }
function setAllItemsSort(v) { allItemsSort = v; renderItemsList(); }
function toggleViewMode() {
    allItemsView = allItemsView === 'list' ? 'tile' : 'list'; const btn = document.getElementById('view-toggle-btn');
    if (allItemsView === 'list') { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'; }
    else { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'; }
    renderItemsList();
}
function toggleSortDir() {
    allItemsSortDir = allItemsSortDir === 'desc' ? 'asc' : 'desc'; const btn = document.getElementById('sort-dir-btn');
    if (allItemsSortDir === 'desc') { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>'; }
    else { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'; }
    renderItemsList();
}
function updateCategoryCounts() {
    const select = document.getElementById('filter-category'); if (!select) return; const current = select.value;
    while (select.options.length > 1) select.remove(1);
    const cats = ['家电','电子产品','食品','厨房食材','护肤品','化妆品','生活用品','书本','学习资料','手办']; const items = getItems().filter(i => getItemStatus(i) !== '已移除');
    cats.forEach(cat => { const count = items.filter(i => i.category === cat).length; const opt = document.createElement('option'); opt.value = cat; opt.textContent = `${T(cat)} (${count})`; select.appendChild(opt); });
    select.value = current;
}
function toggleSearchBar() { const w = document.getElementById('search-bar-wrapper'); w.style.display = w.style.display === 'none' ? 'block' : 'none'; if (w.style.display === 'block') { setTimeout(() => document.getElementById('search-input').focus(), 100); } }
function renderItemsList() {
    updateCategoryCounts(); let items = getItems(); const container = document.getElementById('items-list'); if (!container) return;
    const searchInput = document.getElementById('search-input'); const kw = (searchInput?.value || '').toLowerCase().trim();
    if (kw) items = items.filter(i => (i.name || '').toLowerCase().includes(kw) || (i.category || '').toLowerCase().includes(kw));
    if (allItemsTopFilter === 'held') items = items.filter(isHeld); else if (allItemsTopFilter === 'expiring') items = items.filter(isExpiringSoon); else if (allItemsTopFilter === 'warranty') items = items.filter(isWarrantyExpiringSoon);
    if (allItemsFilter === 'expired') { items = items.filter(i => { const d = getDaysRemaining(i.expiryDate); return d !== null && d < 0; }); }
    else if (allItemsFilter === 'warranty-expired') { items = items.filter(i => { const d = getDaysRemaining(i.warrantyDate); return d !== null && d < 0; }); }
    else if (allItemsFilter === 'held') { items = items.filter(i => getItemStatus(i) === '持有中'); }
    else if (allItemsFilter === 'paused') { items = items.filter(i => getItemStatus(i) === '暂离中'); }
    else if (allItemsFilter === 'removed') { items = items.filter(i => getItemStatus(i) === '已移除'); }
    if (allItemsCategory) items = items.filter(i => i.category === allItemsCategory);
    items.sort((a, b) => {
        let r = 0;
        if (allItemsSort === 'purchase-desc') { r = (b.purchaseDate || '').localeCompare(a.purchaseDate || ''); }
        else if (allItemsSort === 'price') { r = (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0); }
        else if (allItemsSort === 'name') { r = (a.name || '').localeCompare(b.name || ''); }
        else if (allItemsSort === 'expiry') { const dA = getDaysRemaining(a.expiryDate); const dB = getDaysRemaining(b.expiryDate); r = (dA === null ? 99999 : dA) - (dB === null ? 99999 : dB); }
        else { r = b.id - a.id; }
        return allItemsSortDir === 'asc' ? -r : r;
    });
    container.className = allItemsView === 'tile' ? 'items-list-tile' : 'items-list-list';
    if (items.length === 0) { container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('暂无匹配的物品')}</p>`; return; }
    container.innerHTML = '';
    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4=';
    items.forEach(item => {
        const isMulti = multiSelectMode.items; const isChecked = isMulti && multiSelectedIds.items.has(item.id);
        const div = document.createElement('div'); div.className = allItemsView === 'tile' ? 'item-tile' : 'item-card-new';
        if (isChecked) div.classList.add('multi-checked'); div.setAttribute('data-multi-id', `items-${item.id}`);
        const imgSrc = item.image || placeholder; const status = getItemStatus(item); let statusClass = 'status-held';
        if (status === '暂离中') statusClass = 'status-paused'; else if (status === '已移除') statusClass = 'status-removed';
        const acquire = getItemAcquire(item); const dExp = getDaysRemaining(item.expiryDate); const dWar = getDaysRemaining(item.warrantyDate);
        let expBadge = ''; if (dExp !== null) { const danger = dExp <= 60; expBadge = dExp >= 0 ? `<span class="mini-badge ${danger?'mini-danger':''}">${T('还有{n}天过期', { n: dExp })}</span>` : `<span class="mini-badge mini-danger">${T('已过期{n}天', { n: Math.abs(dExp) })}</span>`; }
        let warBadge = ''; if (dWar !== null) { const danger = dWar <= 180; warBadge = dWar >= 0 ? `<span class="mini-badge ${danger?'mini-danger':''}">${T('还有{n}天过保', { n: dWar })}</span>` : `<span class="mini-badge mini-danger">${T('已过保{n}天', { n: Math.abs(dWar) })}</span>`; }
        const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';
        if (allItemsView === 'tile') { div.innerHTML = `${checkboxHtml}<img src="${imgSrc}" class="tile-img"><div class="tile-name">${item.name}</div><div class="tile-tags"><span class="mini-tag category">${T(item.category)}</span><span class="mini-tag ${statusClass}">${T(status)}</span></div><div class="tile-price">¥${item.price || 0}</div><div class="tile-badges">${expBadge}${warBadge}</div>`; }
        else { div.innerHTML = `${checkboxHtml}<img src="${imgSrc}" class="item-img-new"><div class="item-info-new"><div class="item-name-new">${item.name} <span class="item-qty-new">x${item.quantity}</span></div><div class="item-tag-row"><span class="mini-tag category">${T(item.category)}</span><span class="mini-tag ${statusClass}">${T(status)}</span><span class="mini-tag acquire">${T(acquire)}</span><span class="mini-tag price">¥${item.price || 0}</span></div><div class="item-badge-row">${expBadge}${warBadge}</div></div>`; }
        if (isMulti) { div.onclick = () => toggleMultiSelected('items', item.id); }
        else {
            div.onclick = () => editItem(item.id);
            bindLongPress(div, () => { showConfirm(T('删除物品'), T('确定删除「{name}」吗？删除后无法恢复。', { name: item.name }), () => { let items2 = getItems().filter(i => i.id !== item.id); localStorage.setItem('myItems', JSON.stringify(items2)); showToast(T('已删除')); renderItemsList(); updateItemStats(); }); });
        }
        container.appendChild(div);
    });
}
function editItem(id) {
    const item = getItems().find(i => i.id === id); if (!item) return;
    editingItemId = id; document.getElementById('item-edit-title').textContent = T('编辑物品'); document.getElementById('item-submit-text').textContent = T('保存修改');
    document.getElementById('item-name').value = item.name || ''; document.getElementById('item-price').value = item.price || ''; document.getElementById('item-quantity').value = item.quantity || 1; document.getElementById('purchase-date').value = item.purchaseDate || ''; document.getElementById('expiry-date').value = item.expiryDate || ''; document.getElementById('warranty-date').value = item.warrantyDate || ''; document.getElementById('item-remark').value = item.remark || '';
    if (item.images && Array.isArray(item.images)) { editingItemImages = [item.images[0] || '', item.images[1] || '', item.images[2] || '']; } else if (item.image) { editingItemImages = [item.image, '', '']; } else { editingItemImages = ['', '', '']; }
    for (let i = 0; i < 3; i++) { const input = document.getElementById('item-image-' + i); if (input) input.value = ''; }
    renderAllImageSlots(); selectedCategoryName = item.category || ''; renderCategoryGrid(); updateDateFieldsVisibility(); selectedAcquire = item.acquireMethod || '网购'; renderAcquireGrid(); selectedItemStatus = item.status || '持有中';
    document.querySelectorAll('#page-add .chip[data-status]').forEach(c => { c.classList.toggle('active', c.dataset.status === selectedItemStatus); });
    const delBtn = document.getElementById('item-delete-btn'); if (delBtn) delBtn.style.display = 'block';
    switchPage('page-add');
}
function initItemChart() {
    const itemEl = document.getElementById('item-chart-container'); if (!itemEl) return; if (myChart) myChart.dispose(); myChart = echarts.init(itemEl);
    const cc = {}; getItems().forEach(i => { const cat = i.category || '未分类'; cc[cat] = (cc[cat] || 0) + 1; });
    const data = Object.keys(cc).map(k => ({ name: k, value: cc[k] }));
    myChart.setOption({ tooltip: { trigger: 'item' }, legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 12, icon: 'circle', textStyle: { fontSize: 11 } }, color: ['#d98880', '#85c1e9', '#82c8a0', '#f7dc6f', '#bb8fce', '#f5b041', '#f5b7b1', '#aed6f1'], series: [{ name: T('物品分布'), type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: data.length > 0 ? data : [{ value: 0, name: T('暂无数据'), itemStyle: { color: '#eee' } }] }] });
}