// ================= 书本版块 =================
function getBooks() { return JSON.parse(localStorage.getItem('myBooks')) || []; }
function saveBook(book) {
    let books = getBooks(); const idx = books.findIndex(b => b.id === book.id); book.updatedAt = Date.now(); if (book.isActive === undefined) book.isActive = false;
    if (idx !== -1) { book.isActive = books[idx].isActive || false; books[idx] = book; } else { books.push(book); }
    if (book.isActive) { books.forEach(b => { if (b.id !== book.id) b.isActive = false; }); }
    localStorage.setItem('myBooks', JSON.stringify(books)); renderBookProgress();
}
function renderBookProgress() {
    const container = document.getElementById('book-progress-section'); if (!container) return;
    const books = getBooks(); const activeBook = books.find(b => b.isActive);
    if (books.length === 0) { container.innerHTML = `<div class="card" onclick="switchPage('page-book-list')" style="cursor:pointer;"><h3 style="margin-bottom:10px;">${T('今天看书了嘛~ 📖')}</h3><p style="color:#999; font-size:14px;">${T('点击添加一本正在读的书')}</p></div>`; return; }
    if (!activeBook) { container.innerHTML = `<div class="card" onclick="switchPage('page-book-list')" style="cursor:pointer;"><h3 style="margin-bottom:10px;">${T('今天看书了嘛~ 📖')}</h3><p style="color:#999; font-size:14px;">${T('还没有选择要展示的书，去书本列表勾选')}</p></div>`; return; }
    const total = activeBook.totalPages || 1; const current = activeBook.currentPages || 0; const percent = Math.min(100, Math.round((current / total) * 100)); const estimated = parseFloat(activeBook.estimatedHours) || 0; const isDone = percent >= 100; const spent = isDone ? (activeBook.spentHours || 0) : computeSpentDaysValue(activeBook.startDate); const remaining = isDone ? 0 : Math.max(0, estimated - spent).toFixed(1);
    container.innerHTML = `<div class="card" onclick="showBookView(${activeBook.id})" style="cursor:pointer;"><h3 style="margin-bottom:10px;">${T('今天看书了嘛~ 📖')}</h3><div style="display:flex; justify-content:space-between; font-size:13px; color:#666; margin-bottom:6px;"><span>${activeBook.name}</span><span>${T('已用 {n} 天', { n: spent })} ${isDone ? T('（已读完）') : '/ ' + T('计划剩余 {n} 天', { n: remaining })}</span></div><div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${percent}%"></div><div class="progress-icon" style="left:${percent}%">📖</div></div><div style="text-align:right; font-size:12px; color:#999; margin-top:4px;">${T('{cur}/{total}页 ({percent}%)', { cur: current, total, percent })}</div></div>`;
}
function computeSpentDaysValue(startDate) {
    if (!startDate) return 0; const start = new Date(startDate); const today = new Date(); today.setHours(0, 0, 0, 0); start.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((today - start) / (1000 * 60 * 60 * 24)));
}
function showBookDetail(id) {
    const books = getBooks(); let book = null; if (id) book = books.find(b => b.id === id);
    if (!book) { book = { id: Date.now(), name: '', startDate: '', totalPages: 0, currentPages: 0, estimatedHours: 0, spentHours: 0, isActive: false }; }
    document.getElementById('book-name').value = book.name || ''; document.getElementById('book-start-date').value = book.startDate || ''; document.getElementById('book-total-pages').value = book.totalPages || ''; document.getElementById('book-current-pages').value = book.currentPages || ''; document.getElementById('book-estimated-hours').value = book.estimatedHours || '';
    const titleEl = document.getElementById('book-edit-title'); if (titleEl) titleEl.textContent = id ? T('编辑书本') : T('添加书本');
    computeSpentDays(book.startDate); document.getElementById('book-detail').dataset.bookId = book.id; switchPage('page-book-detail');
}
function computeSpentDays(startDate) { const el = document.getElementById('book-spent-hours'); if (!el) return; if (!startDate) { el.value = ''; return; } const days = computeSpentDaysValue(startDate); el.value = T('{n} 天', { n: days }); computedSpentDays = days; }
function saveBookDetail() {
    const id = parseInt(document.getElementById('book-detail').dataset.bookId); const startDate = document.getElementById('book-start-date').value;
    if (!startDate) { showToast(T('请选择开始阅读时间'), 'error'); return; }
    let books = getBooks(); const existing = books.find(b => b.id === id);
    const totalPages = parseInt(document.getElementById('book-total-pages').value) || 0; const currentPages = parseInt(document.getElementById('book-current-pages').value) || 0; const isDone = totalPages > 0 && currentPages >= totalPages;
    const book = { id: id || Date.now(), name: document.getElementById('book-name').value.trim(), startDate: startDate, totalPages: totalPages, currentPages: currentPages, estimatedHours: parseFloat(document.getElementById('book-estimated-hours').value) || 0, spentHours: (isDone && existing) ? (existing.spentHours || computeSpentDaysValue(startDate)) : computeSpentDaysValue(startDate), isActive: existing ? existing.isActive : false };
    if (!book.name) { showToast(T('请填写书名'), 'error'); return; }
    saveBook(book); showToast(T('保存成功！')); currentBookViewId = book.id; showBookView(book.id);
}
function cancelBookEdit() { const id = parseInt(document.getElementById('book-detail').dataset.bookId); if (id) { showBookView(id); } else { switchPage('page-book-list'); } }
function toggleBookSearchBar() { const w = document.getElementById('book-search-bar-wrapper'); w.style.display = w.style.display === 'none' ? 'block' : 'none'; if (w.style.display === 'block') { setTimeout(() => document.getElementById('book-search-input').focus(), 100); } }
function setBookFilterStatus(v) { bookFilterStatus = v; renderBookList(); }
function setBookSort(v) { bookSort = v; renderBookList(); }
function toggleBookSortDir() {
    bookSortDir = bookSortDir === 'desc' ? 'asc' : 'desc'; const btn = document.getElementById('book-sort-dir-btn');
    if (bookSortDir === 'desc') { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>'; }
    else { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'; }
    renderBookList();
}
function toggleBookViewMode() {
    bookView = bookView === 'list' ? 'tile' : 'list'; const btn = document.getElementById('book-view-toggle-btn');
    if (bookView === 'list') { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'; }
    else { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'; }
    renderBookList();
}
function renderBookList() {
    let books = getBooks(); const container = document.getElementById('book-list'); if (!container) return;
    const kw = (document.getElementById('book-search-input')?.value || '').toLowerCase().trim(); if (kw) books = books.filter(b => (b.name || '').toLowerCase().includes(kw));
    if (bookFilterStatus === 'reading') { books = books.filter(b => { const total = b.totalPages || 0; const cur = b.currentPages || 0; return !(total > 0 && cur >= total); }); }
    else if (bookFilterStatus === 'done') { books = books.filter(b => { const total = b.totalPages || 0; const cur = b.currentPages || 0; return total > 0 && cur >= total; }); }
    books.sort((a, b) => {
        let r = 0;
        if (bookSort === 'name') { r = (a.name || '').localeCompare(b.name || ''); }
        else if (bookSort === 'progress') { const pa = (a.totalPages ? (a.currentPages || 0) / a.totalPages : 0); const pb = (b.totalPages ? (b.currentPages || 0) / b.totalPages : 0); r = pb - pa; }
        else { r = (b.updatedAt || b.id || 0) - (a.updatedAt || a.id || 0); }
        return bookSortDir === 'asc' ? -r : r;
    });
    container.className = bookView === 'tile' ? 'items-list-tile' : 'items-list-list';
    if (books.length === 0) { container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('还没有添加书本，点右下角 + 添加')}</p>`; return; }
    container.innerHTML = '';
    books.forEach(book => {
        const isMulti = multiSelectMode.books; const isChecked = isMulti && multiSelectedIds.books.has(book.id);
        const total = book.totalPages || 0; const cur = book.currentPages || 0; const percent = total > 0 ? Math.min(100, Math.round((cur / total) * 100)) : 0; const isDone = percent >= 100 && total > 0; const spent = computeSpentDaysValue(book.startDate);
        const div = document.createElement('div'); div.className = bookView === 'tile' ? 'item-tile' : 'item-card-new'; div.style.position = 'relative';
        if (isChecked) div.classList.add('multi-checked'); div.setAttribute('data-multi-id', `books-${book.id}`);
        const checkBox = isMulti ? '' : `<div class="book-check ${book.isActive ? 'checked' : ''}" onclick="toggleBookActive(${book.id}, event)">${book.isActive ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}</div>`;
        const multiBox = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';
        if (bookView === 'tile') { div.innerHTML = `${multiBox}${checkBox}<div class="book-cover-tile">📖</div><div class="tile-name">${book.name}</div><div class="tile-tags"><span class="mini-tag" style="background:#f5ede3;color:#8B6F47;">${percent}%</span><span class="mini-tag" style="background:#f0f0f0;color:#666;">${isDone ? T('已读完') : T('已用 {n} 天', { n: spent })}</span></div>`; }
        else { div.innerHTML = `${multiBox}<div class="book-cover">📖</div><div class="item-info-new"><div class="item-name-new">${book.name}</div><div class="item-tag-row"><span class="mini-tag" style="background:#f5ede3;color:#8B6F47;">${T('进度 {n}%', { n: percent })}</span><span class="mini-tag" style="background:#f0f0f0;color:#666;">${isDone ? T('已读完') : T('已用 {n} 天', { n: spent })}</span><span class="mini-tag" style="background:#faf6f0;color:#6b5740;">${T('{cur}/{total} 页', { cur, total })}</span></div></div>${checkBox}`; }
        if (isMulti) { div.onclick = () => toggleMultiSelected('books', book.id); }
        else {
            div.addEventListener('click', (e) => { if (e.target.classList.contains('book-check') || e.target.closest('.book-check')) return; showBookView(book.id); });
            bindLongPress(div, () => { showConfirm(T('删除书本'), T('确定删除「{name}」吗？', { name: book.name }), () => { let books2 = getBooks().filter(b => b.id !== book.id); localStorage.setItem('myBooks', JSON.stringify(books2)); showToast(T('已删除')); renderBookList(); renderBookProgress(); }); });
        }
        container.appendChild(div);
    });
}
function toggleBookActive(id, event) {
    if (event) event.stopPropagation(); let books = getBooks(); const book = books.find(b => b.id === id); if (!book) return;
    const newActive = !book.isActive; books.forEach(b => b.isActive = false); book.isActive = newActive;
    localStorage.setItem('myBooks', JSON.stringify(books)); renderBookList(); renderBookProgress();
}
function showBookView(id) {
    const book = getBooks().find(b => b.id === id); if (!book) return; currentBookViewId = id;
    const total = book.totalPages || 0; const cur = book.currentPages || 0; const percent = total > 0 ? Math.min(100, Math.round((cur / total) * 100)) : 0; const isDone = percent >= 100 && total > 0; const spent = isDone ? (book.spentHours || 0) : computeSpentDaysValue(book.startDate);
    const radius = 46; const circumference = 2 * Math.PI * radius; const dash = (percent / 100) * circumference;
    const content = document.getElementById('book-view-content');
    content.innerHTML = `<div class="book-view-top-grid"><div class="book-hero-card"><div class="book-hero-cover">📖</div><div class="book-hero-title">${book.name}</div><div class="book-hero-sub">${isDone ? T('已读完') : T('阅读中')}</div></div><div class="book-ring-card"><svg class="book-progress-ring" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="${radius}" stroke="var(--divider)" stroke-width="10" fill="none"/><circle cx="60" cy="60" r="${radius}" stroke="#8B6F47" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference - dash}" transform="rotate(-90 60 60)"/></svg><div class="book-progress-text"><div class="book-progress-percent">${percent}%</div><div class="book-progress-pages">${cur}/${total}</div></div></div></div><div class="card book-view-card"><div class="book-view-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg><span>${T('时间信息')}</span></div><div class="book-view-row"><span>${T('开始阅读')}</span><span>${book.startDate || T('未记录')}</span></div><div class="book-view-row"><span>${T('预计用时')}</span><span>${T('{n} 天', { n: book.estimatedHours || 0 })}</span></div><div class="book-view-row"><span>${T('已用时')}</span><span>${T('{n} 天', { n: spent })}</span></div></div><div class="card book-view-card"><div class="book-view-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="20" x2="6" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="18" y1="20" x2="18" y2="14"/></svg><span>${T('阅读进度')}</span></div><div class="book-view-row"><span>${T('总页数')}</span><span>${T('{n} 页', { n: book.totalPages || 0 })}</span></div><div class="book-view-row"><span>${T('目前页数')}</span><span>${T('{n} 页', { n: book.currentPages || 0 })}</span></div><div class="book-view-row"><span>${T('状态')}</span><span>${isDone ? T('已读完') : T('阅读中')}</span></div></div>`;
    switchPage('page-book-view');
}
function editBookFromView() { if (currentBookViewId) showBookDetail(currentBookViewId); }
function deleteBook() { if (!currentBookViewId) return; if (!confirm(T('确定删除这本书吗？'))) return; let books = getBooks().filter(b => b.id !== currentBookViewId); localStorage.setItem('myBooks', JSON.stringify(books)); currentBookViewId = null; showToast(T('已删除')); switchPage('page-book-list'); }