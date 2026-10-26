// ================= 全局变量 =================
let multiSelectMode = { items: false, gift: false, important: false, diary: false, books: false };
let multiSelectedIds = { items: new Set(), gift: new Set(), important: new Set(), diary: new Set(), books: new Set() };
let currentInputId = null;
let selectedYear = null, selectedMonth = null, selectedDay = null;
let pickerStep = 'year';
let pickerMode = 'full';
let myChart = null, myGiftChart = null;
let editingItemId = null;
let currentGiftPersonId = null;
let filterType = 'all';
let filterStatus = 'all';
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth() + 1;
let importantViewMode = 'calendar';
let importantFilter = 'all';
let importantTransition = 'all';
let importantSearchKeyword = '';
let importantListFilter = 'all';
let selectedImportantLevel = '提醒';
let editingImportantId = null;
let selectedImportantType = '普通';
let selectedCalendarType = '阳历';
let currentImportantDetailId = null;
let importantDetailSource = null;
let selectedEventChipName = null;
let selectedGiftType = '随礼';
let currentEventId = null;
let editingEventId = null;
let patternPoints = [];
let patternSelected = [];
let patternDrawing = false;
let patternFirstAttempt = null;
let patternMode = 'set';
let cropTarget = 'wallpaper';
let cropImgSrc = null;
let cropImgNaturalW = 0;
let cropImgNaturalH = 0;
let cropImgDisplayW = 0;
let cropImgDisplayH = 0;
let cropImgX = 0;
let cropImgY = 0;
let cropDragging = false;
let cropStartX = 0;
let cropStartY = 0;
let diaryPanelDate = null;
let currentDiaryType = '日记';
let selectedCalDate = null;
let currentDiaryViewId = null;
let currentDiaryListType = '日记';
let currentDiaryListDate = null;
let diaryEditSource = 'panel';
let currentDiaryTemplate = null;
let editingDiaryId = null;
let isLongPress = false;
let longPressTimer = null;
let confirmCallback = null;
let itemLongPressTimer = null;
let itemLongPressFired = false;
let allItemsTopFilter = '';
let allItemsFilter = 'all';
let allItemsCategory = '';
let allItemsSort = 'default';
let allItemsView = 'list';
let selectedAcquire = '网购';
let selectedItemStatus = '持有中';
let allItemsSortDir = 'desc';
let editingItemImages = ['', '', ''];
let selectedCategoryName = '';
let giftPhotos = ['', '', ''];
let eventPhotos = ['', '', ''];
let giftTopFilter = '';
let giftCategoryFilter = '';
let giftSort = 'default';
let giftSortDir = 'desc';
let giftView = 'list';
let computedSpentDays = 0;
let bookFilterStatus = 'all';
let bookSort = 'default';
let bookSortDir = 'desc';
let bookView = 'list';
let currentBookViewId = null;
let iconSrcImage = null;
let selectedIconCells = [];
let promptCallback = null;
let alertCallback = null;
let unlockPatternDrawing = false;
let unlockPatternSelected = [];
let unlockPatternPoints = [];
let lockoutInterval = null;

const nationalHolidays = {
    '01-01': '元旦', '02-14': '情人节', '03-08': '妇女节', '03-12': '植树节',
    '04-01': '愚人节', '05-01': '劳动节', '05-04': '青年节', '06-01': '儿童节',
    '07-01': '建党节', '08-01': '建军节', '09-10': '教师节',
    '10-01': '国庆节', '12-24': '平安夜', '12-25': '圣诞节'
};

// ================= 多语言字典 (请将你代码里的 i18nData 和 I18N 整个复制到这里) =================
const i18nData = { /* 把你原代码里的 i18nData 全部复制过来 */ };
const I18N = { /* 把你原代码里的 I18N 全部复制过来 */ };
// -----------------------------------------------------------

function T(zh, params) {
    const lang = getTheme().lang || 'zh-CN';
    let text = zh;
    if (lang !== 'zh-CN' && I18N[lang] && I18N[lang][zh]) { text = I18N[lang][zh]; }
    if (params) { Object.keys(params).forEach(k => { text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), () => params[k]); }); }
    return text;
}
let __translating = false;
function translateDOM() {
    const lang = getTheme().lang || 'zh-CN';
    if (lang === 'zh-CN') return;
    const dict = I18N[lang];
    if (!dict || __translating) return;
    __translating = true;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const toTranslate = [];
    let n;
    while ((n = walker.nextNode())) {
        const p = n.parentElement;
        if (!p || p.tagName === 'SCRIPT' || p.tagName === 'STYLE' || !/[\u4e00-\u9fa5]/.test(n.textContent)) continue;
        toTranslate.push(n);
    }
    toTranslate.forEach(node => {
        const raw = node.textContent;
        const trimmed = raw.trim();
        if (dict[trimmed]) { node.textContent = raw.replace(trimmed, dict[trimmed]); }
    });
    document.querySelectorAll('[placeholder]').forEach(el => { const ph = el.placeholder; if (ph && /[\u4e00-\u9fa5]/.test(ph) && dict[ph]) el.placeholder = dict[ph]; });
    document.querySelectorAll('[title]').forEach(el => { const ti = el.title; if (ti && /[\u4e00-\u9fa5]/.test(ti) && dict[ti]) el.title = dict[ti]; });
    __translating = false;
}
function t(key, params) {
    const lang = getTheme().lang || 'zh-CN';
    let text = (i18nData[lang] && i18nData[lang][key]) || (i18nData['zh-CN'] && i18nData['zh-CN'][key]) || key;
    if (params) { Object.keys(params).forEach(k => { text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), () => params[k]); }); }
    return text;
}
function applyLanguage() {
    translateDOM();
    if (typeof renderBookProgress === 'function') renderBookProgress();
    if (typeof renderUpcomingDates === 'function') renderUpcomingDates();
    const activePage = document.querySelector('.page.active')?.id;
    if (activePage === 'page-home' && typeof updateDashboard === 'function') updateDashboard();
    if (activePage === 'page-all-items') { if (typeof updateItemStats === 'function') updateItemStats(); if (typeof renderItemsList === 'function') renderItemsList(); }
    if (activePage === 'page-gift-record' && typeof renderGiftList === 'function') renderGiftList();
    if (activePage === 'page-important-dates') { if (typeof renderCalendar === 'function') renderCalendar(); if (typeof renderUpcoming7Days === 'function') renderUpcoming7Days(); }
    if (activePage === 'page-book-list' && typeof renderBookList === 'function') renderBookList();
    const importantListView = document.getElementById('important-list-view');
    if (importantListView && importantListView.style.display === 'block' && typeof renderImportantList === 'function') renderImportantList();
    const diaryPanel = document.getElementById('diary-panel');
    if (diaryPanel && diaryPanel.classList.contains('open') && diaryPanelDate && typeof renderDiaryPanel === 'function') renderDiaryPanel(diaryPanelDate);
    translateDOM();
}

// ================= 页面切换 =================
function switchPage(pageId) {
    if (document.body.classList.contains('multi-select-mode')) {
        ['items', 'gift', 'important', 'diary', 'books'].forEach(t => { if (multiSelectMode[t]) exitMultiSelect(t); });
    }
    const mainPages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.display = mainPages.includes(pageId) ? 'flex' : 'none';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (!el) return;
    el.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if (pageId === 'page-home') {
        document.getElementById('nav-home').classList.add('active');
        updateDashboard(); renderUpcomingDates(); renderBookProgress();
    } else if (pageId === 'page-item-distribution') {
        document.getElementById('nav-all-items').classList.add('active'); setTimeout(initItemChart, 100);
    } else if (pageId === 'page-gift-distribution') {
        document.getElementById('nav-gift').classList.add('active'); setTimeout(initGiftChart, 100);
    } else if (pageId === 'page-all-items') {
        document.getElementById('nav-all-items').classList.add('active'); updateItemStats(); renderItemsList();
    } else if (pageId === 'page-gift-record') {
        document.getElementById('nav-gift').classList.add('active');
        giftTopFilter = ''; giftCategoryFilter = '';
        const gc = document.getElementById('stat-gift-card'); const rc = document.getElementById('stat-receive-card');
        if (gc) gc.classList.remove('active'); if (rc) rc.classList.remove('active');
        const sw = document.getElementById('gift-search-bar-wrapper'); const si = document.getElementById('gift-search-input');
        if (sw) sw.style.display = 'none'; if (si) si.value = '';
        renderGiftList();
    } else if (pageId === 'page-important-dates') {
        document.getElementById('nav-important').classList.add('active'); backToCalendar(); renderUpcoming7Days();
    } else if (pageId === 'page-book-list') {
        document.getElementById('nav-home').classList.add('active'); renderBookList();
    } else if (['page-add','page-add-gift','page-gift-detail','page-add-event','page-add-important','page-important-detail','page-profile','page-theme','page-backup','page-lock','page-about','page-event-detail','page-diary-edit','page-diary-list','page-diary-view','page-book-detail','page-book-view'].includes(pageId)) {
        document.getElementById('nav-home').classList.add('active');
    }
    const themeMap = { 'page-all-items': '#4A90A4', 'page-gift-record': '#C0392B', 'page-important-dates': '#7B68A6', 'page-book-list': '#8B6F47', 'page-book-view': '#8B6F47', 'page-book-detail': '#8B6F47' };
    const pageColor = themeMap[pageId] || 'var(--primary)';
    document.body.style.setProperty('--page-color', pageColor);
    document.body.style.setProperty('--nav-active-color', pageColor);
    window.scrollTo(0, 0);
    
    // 修复图表在隐藏状态下初始化导致空白的问题
    if (pageId === 'page-item-distribution' && typeof myChart !== 'undefined' && myChart) {
        setTimeout(() => myChart.resize(), 150);
    }
    if (pageId === 'page-gift-distribution' && typeof myGiftChart !== 'undefined' && myGiftChart) {
        setTimeout(() => myGiftChart.resize(), 150);
    }
}

// ================= 抽屉/主题/备份/应用锁等 (将原代码对应的函数全部粘贴在此) =================
function openDrawer() { document.getElementById('side-drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('open'); refreshDrawerInfo(); }
function closeDrawer() { document.getElementById('side-drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('open'); }
function openDrawerPage(pageId) {
    closeDrawer();
    setTimeout(() => { switchPage(pageId); if (pageId === 'page-profile') loadProfile(); if (pageId === 'page-theme') loadTheme(); if (pageId === 'page-lock') loadLockSettings(); if (pageId === 'page-backup') updateStorageUsage(); }, 250);
}
function refreshDrawerInfo() {
    const p = getProfile(); document.getElementById('drawer-name').textContent = p.nickname || T('未设置昵称'); document.getElementById('drawer-sign').textContent = p.sign || T('点击设置个性签名');
    const av = document.getElementById('drawer-avatar'); if (p.avatar) av.innerHTML = `<img src="${p.avatar}">`; else av.innerHTML = '👤';
}
function getProfile() { return JSON.parse(localStorage.getItem('myProfile')) || { nickname: '', sign: '', avatar: '' }; }
function saveProfile(p) { localStorage.setItem('myProfile', JSON.stringify(p)); refreshDrawerInfo(); }
function loadProfile() { const p = getProfile(); document.getElementById('profile-nickname-display').textContent = p.nickname || T('未设置昵称'); document.getElementById('profile-sign-display').textContent = p.sign || T('点击设置个性签名'); if (p.avatar) document.getElementById('profile-avatar-img').src = p.avatar; }
function uploadAvatar(input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => compressImage(e.target.result, 800, (b64) => { cropTarget = 'avatar'; cropImgSrc = b64; showCropWindow(); }); reader.readAsDataURL(input.files[0]); }
function editField(field) {
    const p = getProfile();
    if (field === 'nickname') { showPrompt(T('修改昵称'), p.nickname || '', (v) => { p.nickname = v.trim(); saveProfile(p); loadProfile(); }); }
    else { showPrompt(T('修改个性签名'), p.sign || '', (v) => { p.sign = v.trim(); saveProfile(p); loadProfile(); }); }
}
function getTheme() { return JSON.parse(localStorage.getItem('myTheme')) || { color: '#d98880', dark: false, wallpaper: '' }; }
function saveTheme(t) { localStorage.setItem('myTheme', JSON.stringify(t)); }
function applyTheme() {
    const t = getTheme(); document.documentElement.style.setProperty('--primary', t.color); document.body.classList.toggle('dark-mode', !!t.dark);
    if (t.wallpaper) { document.body.style.backgroundImage = `url(${t.wallpaper})`; document.body.style.backgroundSize = 'cover'; document.body.style.backgroundAttachment = 'fixed'; } else { document.body.style.backgroundImage = ''; }
}
function loadTheme() { const t = getTheme(); document.getElementById('setting-lang').value = t.lang || 'zh-CN'; document.getElementById('setting-startpage').value = t.startpage || 'home'; document.getElementById('dark-mode-toggle').checked = !!t.dark; }
function saveSetting(k, v) { 
    const theme = getTheme(); theme[k] = v; saveTheme(theme); 
    if (k === 'lang') { 
        if (typeof applyLanguage === 'function') applyLanguage(); 
        if (typeof loadTheme === 'function') loadTheme();
    } 
}
function setThemeColor(c) { const t = getTheme(); t.color = c; saveTheme(t); applyTheme(); }
function toggleDarkMode(on) { const t = getTheme(); t.dark = on; saveTheme(t); applyTheme(); }
function uploadWallpaper(input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => { compressImage(e.target.result, 1200, (b64) => { cropTarget = 'wallpaper'; cropImgSrc = b64; showCropWindow(); }); }; reader.readAsDataURL(input.files[0]); }
function showCropWindow() {
    const overlay = document.getElementById('crop-overlay'); const win = document.getElementById('wallpaper-crop-window'); const img = document.getElementById('wallpaper-crop-img'); const border = document.getElementById('crop-border');
    overlay.style.display = 'flex';
    if (cropTarget === 'avatar') { win.style.width = '240px'; win.style.height = '240px'; win.style.borderRadius = '50%'; if (border) border.style.borderRadius = '50%'; }
    else { win.style.width = '220px'; win.style.height = '390px'; win.style.borderRadius = '16px'; if (border) border.style.borderRadius = '16px'; }
    const tipEl = document.getElementById('crop-tip-text'); if (tipEl) tipEl.textContent = cropTarget === 'avatar' ? T('拖动图片选择头像区域（正方形）：') : T('拖动图片选择显示区域：');
    img.onload = () => {
        cropImgNaturalW = img.naturalWidth; cropImgNaturalH = img.naturalHeight; const winW = win.clientWidth; const winH = win.clientHeight;
        const scale = Math.max(winW / cropImgNaturalW, winH / cropImgNaturalH); cropImgDisplayW = cropImgNaturalW * scale; cropImgDisplayH = cropImgNaturalH * scale;
        img.style.width = cropImgDisplayW + 'px'; img.style.height = cropImgDisplayH + 'px';
        cropImgX = (winW - cropImgDisplayW) / 2; cropImgY = (winH - cropImgDisplayH) / 2; updateCropPosition(); bindCropDrag();
    };
    img.src = cropImgSrc;
}
function bindCropDrag() {
    const win = document.getElementById('wallpaper-crop-window');
    win.onmousedown = null; win.onmousemove = null; win.onmouseup = null; win.onmouseleave = null; win.ontouchstart = null; win.ontouchmove = null; win.ontouchend = null;
    const startDrag = (x, y) => { cropDragging = true; cropStartX = x - cropImgX; cropStartY = y - cropImgY; };
    const moveDrag = (x, y) => {
        if (!cropDragging) return; let newX = x - cropStartX; let newY = y - cropStartY; const winW = win.clientWidth; const winH = win.clientHeight;
        if (newX > 0) newX = 0; if (newY > 0) newY = 0; if (newX < winW - cropImgDisplayW) newX = winW - cropImgDisplayW; if (newY < winH - cropImgDisplayH) newY = winH - cropImgDisplayH;
        cropImgX = newX; cropImgY = newY; updateCropPosition();
    };
    const endDrag = () => { cropDragging = false; };
    win.onmousedown = (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); };
    win.onmousemove = (e) => { moveDrag(e.clientX, e.clientY); };
    win.onmouseup = endDrag; win.onmouseleave = endDrag;
    win.ontouchstart = (e) => { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY); };
    win.ontouchmove = (e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); };
    win.ontouchend = (e) => { e.preventDefault(); endDrag(); };
}
function updateCropPosition() { const img = document.getElementById('wallpaper-crop-img'); img.style.left = cropImgX + 'px'; img.style.top = cropImgY + 'px'; }
function confirmWallpaperCrop() {
    if (!cropImgSrc) return; const win = document.getElementById('wallpaper-crop-window'); const winW = win.clientWidth; const winH = win.clientHeight;
    let outW, outH; if (cropTarget === 'avatar') { outW = 200; outH = 200; } else { const outputScale = 2; const maxW = 800; const scale = Math.min(outputScale, maxW / winW); outW = Math.round(winW * scale); outH = Math.round(winH * scale); }
    const canvas = document.createElement('canvas'); canvas.width = outW; canvas.height = outH; const ctx = canvas.getContext('2d');
    const srcX = (-cropImgX) * (cropImgNaturalW / cropImgDisplayW); const srcY = (-cropImgY) * (cropImgNaturalH / cropImgDisplayH); const srcW = winW * (cropImgNaturalW / cropImgDisplayW); const srcH = winH * (cropImgNaturalH / cropImgDisplayH);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height); const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        if (cropTarget === 'avatar') { const p = getProfile(); p.avatar = croppedBase64; saveProfile(p); const avatarImg = document.getElementById('profile-avatar-img'); if (avatarImg) avatarImg.src = croppedBase64; showToast(T('头像已更新！')); }
        else { const t = getTheme(); t.wallpaper = croppedBase64; saveTheme(t); applyTheme(); showToast(T('壁纸已应用！')); }
        cropImgSrc = null; document.getElementById('crop-overlay').style.display = 'none';
    };
    img.src = cropImgSrc;
}
function cancelWallpaper() { cropImgSrc = null; document.getElementById('crop-overlay').style.display = 'none'; }
function clearWallpaper() { const t = getTheme(); t.wallpaper = ''; saveTheme(t); applyTheme(); }
function getCustomIcons() { return JSON.parse(localStorage.getItem('myCustomIcons')) || { src: '', cells: [] }; }
function saveCustomIcons(data) { localStorage.setItem('myCustomIcons', JSON.stringify(data)); }
function uploadIconImage(input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => compressImage(e.target.result, 600, (b64) => { iconSrcImage = b64; selectedIconCells = []; showIconSelector(); }); reader.readAsDataURL(input.files[0]); }
function showIconSelector() {
    document.getElementById('icon-selector-area').style.display = 'block'; document.getElementById('icon-source-img').src = iconSrcImage;
    const overlay = document.getElementById('icon-grid-overlay'); overlay.innerHTML = '';
    for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { const cell = document.createElement('div'); cell.className = 'icon-cell'; cell.style.left = (c * 25) + '%'; cell.style.top = (r * 25) + '%'; cell.style.width = '25%'; cell.style.height = '25%'; cell.dataset.row = r; cell.dataset.col = c; cell.onclick = () => toggleIconCell(r, c, cell); overlay.appendChild(cell); } }
    refreshIconSelection();
}
function toggleIconCell(r, c, cellEl) {
    const idx = selectedIconCells.findIndex(x => x.row === r && x.col === c);
    if (idx !== -1) { selectedIconCells.splice(idx, 1); selectedIconCells.forEach((item, i) => item.num = i + 1); }
    else { if (selectedIconCells.length >= 4) { showToast(T('最多选择 4 个区域'), 'error'); return; } selectedIconCells.push({ row: r, col: c, num: selectedIconCells.length + 1 }); }
    const data = { src: iconSrcImage, cells: selectedIconCells }; saveCustomIcons(data); applyCustomIcons(); refreshIconSelection();
}
function refreshIconSelection() {
    document.querySelectorAll('#icon-grid-overlay .icon-cell').forEach(cell => { cell.classList.remove('selected'); cell.removeAttribute('data-num'); });
    selectedIconCells.forEach(item => { const selector = `#icon-grid-overlay .icon-cell[data-row="${item.row}"][data-col="${item.col}"]`; const el = document.querySelector(selector); if (el) { el.classList.add('selected'); el.setAttribute('data-num', item.num); } });
    document.getElementById('icon-selected-count').textContent = selectedIconCells.length;
}
function applyCustomIcons() {
    const data = getCustomIcons(); const navKeys = ['home', 'items', 'gift', 'important'];
    const defaults = ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V9.5z"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'];
    navKeys.forEach((key, i) => {
        const el = document.getElementById('nav-icon-' + key); if (!el) return;
        el.style.backgroundImage = ''; el.style.backgroundSize = ''; el.style.backgroundPosition = ''; el.style.width = ''; el.style.height = ''; el.style.borderRadius = ''; el.innerHTML = '';
        const cell = data.cells[i];
        if (cell && data.src) { el.style.backgroundImage = `url(${data.src})`; el.style.backgroundSize = '400% 400%'; el.style.backgroundPosition = `${(cell.col / 3) * 100}% ${(cell.row / 3) * 100}%`; el.style.width = '22px'; el.style.height = '22px'; el.style.borderRadius = '5px'; }
        else { el.innerHTML = defaults[i]; }
    });
}
function clearCustomIcons() { if (!confirm(T('确定要重置自定义图标吗？'))) return; localStorage.removeItem('myCustomIcons'); iconSrcImage = null; selectedIconCells = []; document.getElementById('icon-selector-area').style.display = 'none'; applyCustomIcons(); }
function updateStorageUsage() { let total = 0; for (let k in localStorage) { if (localStorage.hasOwnProperty(k)) { total += new Blob([k + localStorage[k]]).size; } } document.getElementById('storage-usage').textContent = (total / 1024).toFixed(1) + ' KB'; }
// ================== 导出与导入逻辑重构 ==================

// 1. 生成可读的 CSV / TXT 文本
function generateReadableData() {
    const items = JSON.parse(localStorage.getItem('myItems') || '[]');
    const gifts = JSON.parse(localStorage.getItem('myGiftRecords') || '[]');
    const dates = JSON.parse(localStorage.getItem('myImportantDates') || '[]');
    const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');

    let text = `【我的生活 - 数据备份】\n导出时间：${new Date().toLocaleString()}\n\n`;

    text += `================== 物品记录 ==================\n`;
    text += `名称, 数量, 分类, 价格, 状态, 购买日期\n`;
    items.forEach(i => {
        text += `"${i.name || ''}", ${i.quantity || 1}, "${i.category || ''}", ${i.price || 0}, "${i.status || '持有中'}", "${i.purchaseDate || i.date || ''}"\n`;
    });
    text += `\n`;

    text += `================== 随礼记录 ==================\n`;
    text += `人员, 类型, 事件, 金额, 日期\n`;
    gifts.forEach(g => {
        text += `"${g.person || ''}", "${g.type || '随礼'}", "${g.event || ''}", ${g.amount || 0}, "${g.date || ''}"\n`;
    });
    text += `\n`;

    text += `================== 重要日期 ==================\n`;
    text += `人物, 事件, 日期, 类型, 重要程度\n`;
    dates.forEach(d => {
        text += `"${d.person || ''}", "${d.event || ''}", "${d.date || ''}", "${d.type || '普通'}", "${d.level || '提醒'}"\n`;
    });
    text += `\n`;

    text += `================== 阅读记录 ==================\n`;
    text += `书名, 总页数, 当前页数, 状态\n`;
    books.forEach(b => {
        text += `"${b.name || ''}", ${b.totalPages || 0}, ${b.currentPages || 0}, "${b.status || '在读'}"\n`;
    });
    text += `\n`;

    text += `================== 日记与便签 ==================\n`;
    text += `日期, 类型, 标题, 内容\n`;
    diaries.forEach(d => {
        // 清理内容里的换行符，防止破坏 CSV 格式
        const safeContent = (d.content || '').replace(/\n/g, ' ');
        text += `"${d.date || ''}", "${d.type || '日记'}", "${d.title || ''}", "${safeContent}"\n`;
    });

    return text;
}

// 1. 导出数据主弹窗 (支持导出照片)
async function exportData() {
    let overlay = document.getElementById('export-overlay');
    
    // 如果是第一次点击，需要等待读取照片
    if (typeof showToast === 'function') showToast('正在打包数据与照片...');
    
    // 读取所有照片数据
    let allPhotos = {};
    try {
        if (typeof PhotoDB !== 'undefined') {
            await PhotoDB.init();
            allPhotos = await new Promise((resolve) => {
                const transaction = PhotoDB.db.transaction([PhotoDB.storeName], 'readonly');
                const store = transaction.objectStore(PhotoDB.storeName);
                const request = store.getAllKeys();
                request.onsuccess = async (e) => {
                    const keys = e.target.result;
                    let photosData = {};
                    for (let key of keys) {
                        photosData[key] = await PhotoDB.getImage(key);
                    }
                    resolve(photosData);
                };
            });
        }
    } catch (e) { console.error("读取照片失败", e); }

    const data = { 
        items: JSON.parse(localStorage.getItem('myItems') || '[]'), 
        giftRecords: JSON.parse(localStorage.getItem('myGiftRecords') || '[]'), 
        importantDates: JSON.parse(localStorage.getItem('myImportantDates') || '[]'), 
        diaries: JSON.parse(localStorage.getItem('myDiaries') || '[]'), 
        books: JSON.parse(localStorage.getItem('myBooks') || '[]'), 
        customIcons: JSON.parse(localStorage.getItem('myCustomIcons') || '{}'), 
        lock: JSON.parse(localStorage.getItem('myLock') || '{}'), 
        profile: getProfile(), 
        theme: getTheme(),
        photos: allPhotos // 核心：把照片数据也放进去
    };

    const jsonStr = JSON.stringify(data);

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'export-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;flex-direction:column;padding:20px;box-sizing:border-box;';
        
        const title = document.createElement('div');
        title.innerText = '请长按下方文本框全选复制（含照片，文本较长）';
        title.style.cssText = 'color:white;font-size:15px;margin-bottom:10px;text-align:center;font-weight:bold;';
        
        const textarea = document.createElement('textarea');
        textarea.id = 'export-textarea';
        textarea.style.cssText = 'flex:1;width:100%;border-radius:12px;padding:12px;font-size:12px;font-family:monospace;resize:none;line-height:1.5;';
        
        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = 'display:flex;gap:10px;margin-top:15px;';
        
        const copyBtn = document.createElement('button');
        copyBtn.innerText = '一键复制';
        copyBtn.style.cssText = 'flex:1;padding:14px;background:var(--primary,#d98880);color:white;border:none;border-radius:12px;font-size:16px;font-weight:bold;';
        copyBtn.onclick = () => {
            const ta = document.getElementById('export-textarea');
            ta.select(); ta.setSelectionRange(0, 999999); document.execCommand('copy');
            if (typeof showToast === 'function') showToast('已复制到剪贴板！');
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭';
        closeBtn.style.cssText = 'flex:1;padding:14px;background:#555;color:white;border:none;border-radius:12px;font-size:16px;font-weight:bold;';
        closeBtn.onclick = () => { overlay.style.display = 'none'; };
        
        btnGroup.appendChild(copyBtn); btnGroup.appendChild(closeBtn);
        overlay.appendChild(title); overlay.appendChild(textarea); overlay.appendChild(btnGroup);
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
    document.getElementById('export-textarea').value = jsonStr;
}

// 2. 导入数据弹窗 (支持恢复照片)
function showImportModal() {
    let overlay = document.getElementById('import-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'import-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;flex-direction:column;padding:20px;box-sizing:border-box;';
        
        const title = document.createElement('div');
        title.innerText = '请将之前复制的 JSON 数据粘贴到下方：';
        title.style.cssText = 'color:white;font-size:15px;margin-bottom:10px;text-align:center;font-weight:bold;';
        
        const textarea = document.createElement('textarea');
        textarea.id = 'import-textarea';
        textarea.placeholder = '在此粘贴 JSON 代码...';
        textarea.style.cssText = 'flex:1;width:100%;border-radius:12px;padding:12px;font-size:12px;font-family:monospace;resize:none;line-height:1.5;';
        
        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = 'display:flex;gap:10px;margin-top:15px;';
        
        const importBtn = document.createElement('button');
        importBtn.innerText = '确认导入';
        importBtn.style.cssText = 'flex:1;padding:14px;background:var(--primary,#d98880);color:white;border:none;border-radius:12px;font-size:16px;font-weight:bold;';
        importBtn.onclick = async () => {
            const val = document.getElementById('import-textarea').value.trim();
            if (!val) return;
            try {
                const data = JSON.parse(val);
                showAlert(T('导入数据'), T('导入会覆盖当前数据，是否继续？'), async () => {
                    if (data.items) localStorage.setItem('myItems', JSON.stringify(data.items));
                    if (data.giftRecords) localStorage.setItem('myGiftRecords', JSON.stringify(data.giftRecords));
                    if (data.importantDates) localStorage.setItem('myImportantDates', JSON.stringify(data.importantDates));
                    if (data.diaries) localStorage.setItem('myDiaries', JSON.stringify(data.diaries));
                    if (data.books) localStorage.setItem('myBooks', JSON.stringify(data.books));
                    if (data.customIcons) localStorage.setItem('myCustomIcons', JSON.stringify(data.customIcons));
                    if (data.lock) localStorage.setItem('myLock', JSON.stringify(data.lock));
                    if (data.profile) localStorage.setItem('myProfile', JSON.stringify(data.profile));
                    if (data.theme) localStorage.setItem('myTheme', JSON.stringify(data.theme));
                    
                    // 恢复照片到 IndexedDB
                    if (data.photos && typeof PhotoDB !== 'undefined') {
                        if (typeof showToast === 'function') showToast('正在恢复照片，请稍候...');
                        await PhotoDB.init();
                        for (let key in data.photos) {
                            if (data.photos[key]) {
                                await PhotoDB.saveImageBase64(key, data.photos[key]);
                            }
                        }
                    }
                    
                    showToast(T('导入成功！')); 
                    setTimeout(() => location.reload(), 1000);
                });
            } catch (err) {
                showToast('格式错误，请检查粘贴的内容', 'error');
            }
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '取消';
        closeBtn.style.cssText = 'flex:1;padding:14px;background:#555;color:white;border:none;border-radius:12px;font-size:16px;font-weight:bold;';
        closeBtn.onclick = () => { overlay.style.display = 'none'; document.getElementById('import-textarea').value = ''; };
        
        btnGroup.appendChild(importBtn); btnGroup.appendChild(closeBtn);
        overlay.appendChild(title); overlay.appendChild(textarea); overlay.appendChild(btnGroup);
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function clearAllData() { showAlert(T('清空数据'), T('确定要清空所有数据吗？此操作不可恢复！'), () => { ['myItems','myGiftRecords','myImportantDates','myProfile','myTheme','myDiaries','myBooks','myCustomIcons','myLock'].forEach(k => localStorage.removeItem(k)); showToast(T('已清空')); location.reload(); }); }
function getLockSettings() { return JSON.parse(localStorage.getItem('myLock')) || { type: '' }; }
function loadLockSettings() { const l = getLockSettings(); document.querySelectorAll('.lock-check').forEach(el => el.classList.remove('active')); if (l.type) { const el = document.getElementById('lock-' + l.type); if (el) el.classList.add('active'); } }
function setLockType(type) {
    const l = getLockSettings();
    if (l.type === type) { l.type = ''; l.password = ''; l.pattern = ''; localStorage.setItem('myLock', JSON.stringify(l)); loadLockSettings(); showToast(T('已取消应用锁')); return; }
    if (type === 'password') {
        showPrompt(T('请设置密码（4位数字）'), '', (pwd) => {
            if (!/^\d{4}$/.test(pwd)) { showToast(T('请输入4位数字密码'), 'error'); return; }
            showPrompt(T('请再次输入密码'), '', (confirmPwd) => {
                if (confirmPwd !== pwd) { showToast(T('两次密码不一致'), 'error'); return; }
                l.type = 'password'; l.password = pwd; l.pattern = ''; localStorage.setItem('myLock', JSON.stringify(l)); showToast(T('密码锁设置成功！')); loadLockSettings();
            });
        });
    } else if (type === 'fingerprint') {
        showAlert(T('启用指纹解锁'), T('是否启用指纹解锁？（模拟）'), () => { l.type = 'fingerprint'; l.password = ''; l.pattern = ''; localStorage.setItem('myLock', JSON.stringify(l)); showToast(T('指纹锁已启用（模拟）')); loadLockSettings(); });
    }
}
function openPatternLock() {
    const l = getLockSettings();
    if (l.type === 'pattern') { if (!confirm(T('已经设置了图形锁，是否重新设置？\n点“取消”则保持不变'))) return; }
    patternMode = 'set'; patternFirstAttempt = null; document.getElementById('pattern-title').innerText = T('绘制解锁图案'); document.getElementById('pattern-hint').innerText = T('请连接至少 4 个点'); document.getElementById('pattern-lock-modal').style.display = 'flex'; initPatternCanvas();
}
function closePatternLock() { document.getElementById('pattern-lock-modal').style.display = 'none'; patternDrawing = false; patternSelected = []; }
function initPatternCanvas() {
    const canvas = document.getElementById('pattern-canvas'); const ctx = canvas.getContext('2d'); const size = 300; const cellSize = size / 3;
    patternPoints = [];
    for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { patternPoints.push({ x: cellSize * c + cellSize / 2, y: cellSize * r + cellSize / 2, index: r * 3 + c }); } }
    patternSelected = []; drawPattern();
    canvas.onmousedown = null; canvas.onmousemove = null; canvas.onmouseup = null; canvas.ontouchstart = null; canvas.ontouchmove = null; canvas.ontouchend = null;
    canvas.onmousedown = (e) => { patternDrawing = true; handlePatternMove(e); }; canvas.onmousemove = (e) => { if (patternDrawing) handlePatternMove(e); }; canvas.onmouseup = () => { patternDrawing = false; finishPattern(); };
    canvas.ontouchstart = (e) => { e.preventDefault(); patternDrawing = true; handlePatternMove(e.touches[0]); }; canvas.ontouchmove = (e) => { e.preventDefault(); if (patternDrawing) handlePatternMove(e.touches[0]); }; canvas.ontouchend = (e) => { e.preventDefault(); patternDrawing = false; finishPattern(); };
}
function getCanvasPos(e, canvas) { const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }; }
function handlePatternMove(e) {
    const canvas = document.getElementById('pattern-canvas'); const pos = getCanvasPos(e, canvas);
    patternPoints.forEach(p => { if (patternSelected.includes(p.index)) return; const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2); if (dist < 30) { patternSelected.push(p.index); if (navigator.vibrate) navigator.vibrate(20); } });
    drawPattern(pos);
}
function drawPattern(currentPos) {
    const canvas = document.getElementById('pattern-canvas'); const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    patternPoints.forEach(p => { const selected = patternSelected.includes(p.index); ctx.beginPath(); ctx.arc(p.x, p.y, selected ? 12 : 8, 0, Math.PI * 2); ctx.fillStyle = selected ? '#d98880' : '#bbb'; ctx.fill(); });
    if (patternSelected.length > 1) {
        ctx.beginPath(); ctx.strokeStyle = '#d98880'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < patternSelected.length - 1; i++) { const a = patternPoints[patternSelected[i]]; const b = patternPoints[patternSelected[i + 1]]; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
        if (currentPos && patternDrawing) { const last = patternPoints[patternSelected[patternSelected.length - 1]]; ctx.moveTo(last.x, last.y); ctx.lineTo(currentPos.x, currentPos.y); }
        ctx.stroke();
    }
}
function resetPattern() { patternSelected = []; drawPattern(); document.getElementById('pattern-hint').innerText = patternMode === 'set' && patternFirstAttempt ? T('请再次绘制确认') : T('请连接至少 4 个点'); }
function finishPattern() {
    patternDrawing = false;
    if (patternSelected.length < 4) { document.getElementById('pattern-hint').innerText = T('⚠️ 至少连接 4 个点'); setTimeout(resetPattern, 600); return; }
    const patternStr = patternSelected.join('-');
    if (patternMode === 'set') {
        if (!patternFirstAttempt) { patternFirstAttempt = patternStr; document.getElementById('pattern-hint').innerText = T('请再次绘制确认'); setTimeout(resetPattern, 400); }
        else {
            if (patternFirstAttempt === patternStr) {
                const l = getLockSettings(); l.type = 'pattern'; l.pattern = patternStr; l.password = ''; localStorage.setItem('myLock', JSON.stringify(l)); loadLockSettings();
                document.getElementById('pattern-hint').innerText = T('✅ 图形锁设置成功！'); setTimeout(() => { closePatternLock(); showToast(T('图形锁设置成功！')); }, 600);
            } else { document.getElementById('pattern-hint').innerText = T('❌ 两次不一致，请重新绘制'); patternFirstAttempt = null; setTimeout(resetPattern, 800); }
        }
    }
}
function showPrompt(title, defaultValue, onOk) { promptCallback = onOk; document.getElementById('prompt-title').textContent = title; const input = document.getElementById('prompt-input'); input.value = defaultValue || ''; document.getElementById('prompt-modal').style.display = 'flex'; setTimeout(() => input.focus(), 100); }
function closePrompt() { promptCallback = null; document.getElementById('prompt-modal').style.display = 'none'; }
function submitPrompt() { const val = document.getElementById('prompt-input').value; const cb = promptCallback; closePrompt(); if (typeof cb === 'function') cb(val); }
function showAlert(title, message, onOk) { alertCallback = onOk; document.getElementById('alert-title').textContent = title; document.getElementById('alert-message').textContent = message; document.getElementById('alert-modal').style.display = 'flex'; document.getElementById('alert-cancel-btn').style.display = 'block'; }
function showAlertSimple(title, message) { showAlert(title, message); document.getElementById('alert-cancel-btn').style.display = 'none'; }
function closeAlert(isOk) { const cb = alertCallback; alertCallback = null; document.getElementById('alert-modal').style.display = 'none'; if (isOk && typeof cb === 'function') cb(); }
function showConfirm(title, message, onOk) { confirmCallback = onOk; document.getElementById('confirm-title').textContent = title || T('确认删除'); document.getElementById('confirm-message').textContent = message || T('确定要删除吗？'); document.getElementById('confirm-modal').style.display = 'flex'; }
function closeConfirm() { confirmCallback = null; document.getElementById('confirm-modal').style.display = 'none'; }
function confirmOk() { const cb = confirmCallback; closeConfirm(); if (typeof cb === 'function') cb(); }
function bindLongPress(el, callback) {
    let timer = null; let fired = false; let startX = 0, startY = 0;
    const start = (e) => {
        fired = false; const p = e.touches ? e.touches[0] : e; startX = p.clientX; startY = p.clientY;
        clearTimeout(timer); timer = setTimeout(() => { fired = true; itemLongPressFired = true; window._longPressFired = true; if (navigator.vibrate) navigator.vibrate(30); callback(); }, 600);
    };
    const move = (e) => { const p = e.touches ? e.touches[0] : e; if (Math.abs(p.clientX - startX) > 10 || Math.abs(p.clientY - startY) > 10) { clearTimeout(timer); } };
    const cancel = () => { clearTimeout(timer); };
    el.addEventListener('touchstart', start, { passive: true }); el.addEventListener('touchmove', move, { passive: true }); el.addEventListener('touchend', cancel); el.addEventListener('touchcancel', cancel);
    el.addEventListener('mousedown', start); el.addEventListener('mousemove', move); el.addEventListener('mouseup', cancel); el.addEventListener('mouseleave', cancel);
    el.addEventListener('click', (e) => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } }, true);
}
function toggleMultiSelect(type) {
    if (multiSelectMode[type]) { exitMultiSelect(type); renderMultiList(type); }
    else {
        multiSelectMode[type] = true; multiSelectedIds[type].clear();
        if (type === 'important' && importantViewMode === 'calendar') { showImportantListView(); }
        const btn = document.getElementById('multi-select-btn-' + type); if (btn) { btn.textContent = T('取消'); btn.classList.add('multi-select-active'); }
        document.body.classList.add('multi-select-mode'); renderMultiList(type); updateMultiSelectBar(type);
    }
}
function exitMultiSelect(type) {
    multiSelectMode[type] = false; multiSelectedIds[type].clear(); const btn = document.getElementById('multi-select-btn-' + type);
    if (btn) { btn.textContent = T('选择'); btn.classList.remove('multi-select-active'); }
    const anyActive = Object.values(multiSelectMode).some(v => v);
    if (!anyActive) { document.body.classList.remove('multi-select-mode'); const bar = document.getElementById('multi-select-bar'); if (bar) bar.style.display = 'none'; }
    if (type === 'important') { if (importantViewMode === 'list') { renderImportantList(); } else { backToCalendar(); renderUpcoming7Days(); } }
}
function toggleMultiSelected(type, id) {
    if (!multiSelectMode[type]) return; const set = multiSelectedIds[type];
    if (set.has(id)) set.delete(id); else set.add(id);
    updateCardSelection(type, id); updateMultiSelectBar(type);
}
function updateCardSelection(type, id) {
    const card = document.querySelector(`[data-multi-id="${type}-${id}"]`); if (!card) return;
    const checked = multiSelectedIds[type].has(id); const cb = card.querySelector('.multi-checkbox');
    if (cb) cb.classList.toggle('checked', checked); card.classList.toggle('multi-checked', checked);
}
function updateMultiSelectBar(type) {
    const bar = document.getElementById('multi-select-bar'); if (!bar) return;
    if (!multiSelectMode[type]) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex'; const count = multiSelectedIds[type].size; document.getElementById('multi-select-count').textContent = T('已选 {n} 项', { n: count });
    const btns = document.getElementById('multi-select-action-btns'); const disabledAttr = count === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '';
    let html = '';
    if (type === 'items') { html += `<button class="multi-action-btn status" ${disabledAttr} onclick="batchChangeStatusSelected()">${T('改状态')}</button>`; }
    html += `<button class="multi-action-btn delete" ${disabledAttr} onclick="batchDeleteSelected('${type}')">${T('删除')}</button>`;
    btns.innerHTML = html;
}
function renderMultiList(type) {
    if (type === 'items') renderItemsList(); else if (type === 'gift') renderGiftList(); else if (type === 'important') renderImportantList(); else if (type === 'diary') renderDiaryList(); else if (type === 'books') renderBookList();
}
function batchDeleteSelected(type) {
    const ids = Array.from(multiSelectedIds[type]); if (ids.length === 0) return;
    const msg = T('确定删除选中的 {n} 项吗？删除后无法恢复。', { n: ids.length });
    showConfirm(T('批量删除'), msg, () => {
        if (type === 'items') { localStorage.setItem('myItems', JSON.stringify(getItems().filter(i => !ids.includes(i.id)))); }
        else if (type === 'gift') { localStorage.setItem('myGiftRecords', JSON.stringify(getGiftRecords().filter(r => !ids.includes(r.id)))); }
        else if (type === 'important') { localStorage.setItem('myImportantDates', JSON.stringify(getImportantDates().filter(d => !ids.includes(d.id)))); renderCalendar(); renderUpcomingDates(); renderUpcoming7Days(); }
        else if (type === 'diary') { saveDiaries(getDiaries().filter(d => !ids.includes(d.id))); }
        else if (type === 'books') { localStorage.setItem('myBooks', JSON.stringify(getBooks().filter(b => !ids.includes(b.id)))); renderBookProgress(); }
        showToast(T('已删除')); exitMultiSelect(type); renderMultiList(type);
        if (type === 'items') updateItemStats();
    });
}
function batchChangeStatusSelected() {
    const ids = Array.from(multiSelectedIds.items); if (ids.length === 0) return;
    const btns = document.getElementById('multi-select-action-btns');
    btns.innerHTML = `<button class="multi-action-btn status" onclick="applyBatchStatus('持有中')">${T('持有中')}</button><button class="multi-action-btn status" onclick="applyBatchStatus('暂离中')">${T('暂离中')}</button><button class="multi-action-btn status" onclick="applyBatchStatus('已移除')">${T('已移除')}</button><button class="multi-action-btn status" style="background:#eee;" onclick="updateMultiSelectBar('items')">${T('返回')}</button>`;
}
function applyBatchStatus(status) {
    const ids = Array.from(multiSelectedIds.items); if (ids.length === 0) return;
    localStorage.setItem('myItems', JSON.stringify(getItems().map(i => ids.includes(i.id) ? { ...i, status } : i)));
    showToast(T('已改为「{status}」', { status: T(status) })); exitMultiSelect('items'); renderItemsList(); updateItemStats();
}
function showToast(msg, type) {
    let container = document.getElementById('toast-container');
    if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
    const t = document.createElement('div'); t.className = 'toast ' + (type || 'success'); t.textContent = msg; container.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show')); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2000);
}
function checkAppLock() {
    const l = getLockSettings(); const overlay = document.getElementById('unlock-overlay');
    if (!l.type) { overlay.style.display = 'none'; return; }
    overlay.style.display = 'flex'; document.getElementById('unlock-password-area').style.display = 'none'; document.getElementById('unlock-fingerprint-area').style.display = 'none'; document.getElementById('unlock-pattern-area').style.display = 'none';
    const lockoutMsg = document.getElementById('lockout-msg'); lockoutMsg.style.display = 'none'; clearInterval(lockoutInterval);
    if (l.lockUntil && Date.now() < l.lockUntil) { startLockoutTimer(l.lockUntil); return; }
    if (l.type === 'password') { document.getElementById('unlock-password-area').style.display = 'block'; document.getElementById('unlock-pwd-input').value = ''; setTimeout(() => document.getElementById('unlock-pwd-input').focus(), 100); }
    else if (l.type === 'fingerprint') { document.getElementById('unlock-fingerprint-area').style.display = 'block'; }
    else if (l.type === 'pattern') { document.getElementById('unlock-pattern-area').style.display = 'block'; initUnlockPatternCanvas(); }
}
function startLockoutTimer(until) {
    const lockoutMsg = document.getElementById('lockout-msg'); lockoutMsg.style.display = 'block';
    const update = () => { const remain = Math.ceil((until - Date.now()) / 1000); if (remain <= 0) { clearInterval(lockoutInterval); checkAppLock(); } else { const m = Math.floor(remain / 60); const s = remain % 60; lockoutMsg.innerText = `尝试次数过多，请等待 ${m}分${s}秒 后重试`; } };
    update(); lockoutInterval = setInterval(update, 1000);
}
function handleUnlockFail() {
    const l = getLockSettings(); l.failCount = (l.failCount || 0) + 1; let lockTimeMs = 0;
    if (l.failCount === 8) { lockTimeMs = 7 * 60 * 1000; l.lockUntil = Date.now() + lockTimeMs; showToast('错误次数过多，锁定 7 分钟', 'error'); }
    else if (l.failCount >= 11) { lockTimeMs = 60 * 60 * 1000; l.lockUntil = Date.now() + lockTimeMs; showToast('错误次数过多，锁定 1 小时', 'error'); }
    else { showToast(`密码/图案错误，还可尝试 ${7 - l.failCount} 次`, 'error'); }
    localStorage.setItem('myLock', JSON.stringify(l));
    if (lockTimeMs > 0) { if (document.getElementById('unlock-pwd-input')) document.getElementById('unlock-pwd-input').value = ''; checkAppLock(); }
}
function handleUnlockSuccess() {
    const l = getLockSettings(); l.failCount = 0; l.lockUntil = 0; localStorage.setItem('myLock', JSON.stringify(l));
    document.getElementById('unlock-overlay').style.display = 'none'; clearInterval(lockoutInterval);
}
function verifyPassword() {
    const l = getLockSettings(); const input = document.getElementById('unlock-pwd-input').value;
    if (input === l.password) { handleUnlockSuccess(); } else { document.getElementById('unlock-pwd-input').value = ''; handleUnlockFail(); }
}
function verifyFingerprint() { setTimeout(() => { document.getElementById('unlock-overlay').style.display = 'none'; showToast(T('指纹验证成功')); }, 500); }
function initUnlockPatternCanvas() {
    const canvas = document.getElementById('unlock-pattern-canvas'); const cellSize = canvas.width / 3; unlockPatternPoints = [];
    for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { unlockPatternPoints.push({ x: cellSize * c + cellSize / 2, y: cellSize * r + cellSize / 2, index: r * 3 + c }); } }
    unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = '';
    canvas.onmousedown = (e) => { unlockPatternDrawing = true; handleUnlockPatternMove(e); }; canvas.onmousemove = (e) => { if (unlockPatternDrawing) handleUnlockPatternMove(e); }; canvas.onmouseup = () => { unlockPatternDrawing = false; finishUnlockPattern(); };
    canvas.ontouchstart = (e) => { e.preventDefault(); unlockPatternDrawing = true; handleUnlockPatternMove(e.touches[0]); }; canvas.ontouchmove = (e) => { e.preventDefault(); if (unlockPatternDrawing) handleUnlockPatternMove(e.touches[0]); }; canvas.ontouchend = (e) => { e.preventDefault(); unlockPatternDrawing = false; finishUnlockPattern(); };
}
function handleUnlockPatternMove(e) {
    const canvas = document.getElementById('unlock-pattern-canvas'); const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; const pos = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    unlockPatternPoints.forEach(p => { if (unlockPatternSelected.includes(p.index)) return; const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2); if (dist < 30) { unlockPatternSelected.push(p.index); if (navigator.vibrate) navigator.vibrate(20); } });
    drawUnlockPattern(pos);
}
function drawUnlockPattern(currentPos) {
    const canvas = document.getElementById('unlock-pattern-canvas'); const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    unlockPatternPoints.forEach(p => { const selected = unlockPatternSelected.includes(p.index); ctx.beginPath(); ctx.arc(p.x, p.y, selected ? 12 : 8, 0, Math.PI * 2); ctx.fillStyle = selected ? '#d98880' : '#bbb'; ctx.fill(); });
    if (unlockPatternSelected.length > 1) {
        ctx.beginPath(); ctx.strokeStyle = '#d98880'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < unlockPatternSelected.length - 1; i++) { const a = unlockPatternPoints[unlockPatternSelected[i]]; const b = unlockPatternPoints[unlockPatternSelected[i + 1]]; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
        if (currentPos && unlockPatternDrawing) { const last = unlockPatternPoints[unlockPatternSelected[unlockPatternSelected.length - 1]]; ctx.moveTo(last.x, last.y); ctx.lineTo(currentPos.x, currentPos.y); }
        ctx.stroke();
    }
}
function finishUnlockPattern() {
    unlockPatternDrawing = false;
    if (unlockPatternSelected.length < 4) { document.getElementById('unlock-pattern-hint').innerText = T('至少连接 4 个点'); setTimeout(() => { unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = ''; }, 800); return; }
    const patternStr = unlockPatternSelected.join('-'); const l = getLockSettings();
    if (patternStr === l.pattern) { handleUnlockSuccess(); } else { document.getElementById('unlock-pattern-hint').innerText = T('图案错误，请重试'); setTimeout(() => { unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = ''; }, 800); handleUnlockFail(); }
}

// ================= 全局点击外部收起 =================
document.addEventListener('click', function(e) {
    const searchWrapper = document.getElementById('search-bar-wrapper');
    const searchIcon = document.querySelector('#page-all-items h3 + span') || document.querySelector('#page-all-items .page-main-title ~ span');
    if (searchWrapper && searchWrapper.style.display === 'block') {
        const inWrapper = searchWrapper.contains(e.target); const inIcon = searchIcon && searchIcon.contains(e.target); const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleSearchBar"]');
        if (!inWrapper && !inIcon && !isToggleClick) { searchWrapper.style.display = 'none'; document.getElementById('search-input').value = ''; renderItemsList(); }
    }
    const impSearchBar = document.getElementById('important-search-bar');
    if (impSearchBar && impSearchBar.style.display === 'block') {
        const inBar = impSearchBar.contains(e.target); const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleImportantSearch"]');
        if (!inBar && !isToggleClick) { impSearchBar.style.display = 'none'; if (typeof importantSearchKeyword !== 'undefined') importantSearchKeyword = ''; const inp = document.getElementById('important-search-input'); if (inp) inp.value = ''; if (typeof renderCalendar === 'function') renderCalendar(); }
    }
    const impMenu = document.getElementById('important-menu');
    if (impMenu && impMenu.style.display === 'block') {
        const inMenu = impMenu.contains(e.target); const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleImportantMenu"]');
        if (!inMenu && !isToggleClick) { if (typeof closeImportantMenu === 'function') closeImportantMenu(); }
    }
});

// ================= 初始化 =================
window.addEventListener('load', () => {
    applyTheme();
    const t = getTheme();
    const startPageMap = { 'home': 'page-home', 'all-items': 'page-all-items', 'gift-record': 'page-gift-record', 'important-dates': 'page-important-dates' };
    const targetPage = startPageMap[t.startpage] || 'page-home';
    switchPage(targetPage);
    updateDashboard(); updateFilterButtons(); updateImportantMenuButtons(); selectLevel('提醒'); renderUpcomingDates(); refreshDrawerInfo(); applyCustomIcons(); renderBookProgress(); renderBookList(); renderCategoryGrid(); renderAcquireGrid();
    for (let i = 0; i < 3; i++) { renderGiftPhotoSlot(i); renderEventPhotoSlot(i); }
    document.querySelectorAll('.back-arrow').forEach(el => { if (el.textContent.trim() === '←' || el.textContent.trim() === '<') { el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'; } });
    document.querySelectorAll('.calendar-grid').forEach(el => { el.style.userSelect = 'none'; el.style.webkitUserSelect = 'none'; el.style.webkitTouchCallout = 'none'; });
    applyLanguage(); checkAppLock();
    if ((getTheme().lang || 'zh-CN') !== 'zh-CN') {
        let __transTimer = null;
        const obs = new MutationObserver(() => { if (__translating) return; clearTimeout(__transTimer); __transTimer = setTimeout(translateDOM, 60); });
        obs.observe(document.body, { childList: true, subtree: true });
    }
});

// ================= 全局滑动与边缘返回手势 =================
const swipePages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
let touchStartX = 0; let touchStartY = 0; let isEdgeSwipe = false;
document.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches.length) return;
    // 遇到底部导航、悬浮按钮、弹窗、画板、日历卡片时，直接放弃全局滑动拦截
    if (e.target.closest('.bottom-nav') || e.target.closest('.floating-add-btn') || e.target.closest('.modal') || e.target.closest('#calendar-view') || e.target.tagName.toLowerCase() === 'canvas') { touchStartX = -1; return; }
    const drawer = document.getElementById('side-drawer');
    const diaryPanel = document.getElementById('diary-panel');
    if (drawer && drawer.classList.contains('open')) { touchStartX = -1; return; }
    if (diaryPanel && diaryPanel.classList.contains('open')) { touchStartX = -1; return; }
    const clientX = e.touches[0].clientX; const screenWidth = window.innerWidth;
    isEdgeSwipe = (clientX <= 30 || clientX >= screenWidth - 30);
    touchStartX = clientX; touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', (e) => {
    if (touchStartX === -1) return;
    if (!e.changedTouches || !e.changedTouches.length) return; // 保护机制
    const drawer = document.getElementById('side-drawer');
    const diaryPanel = document.getElementById('diary-panel');
    if (drawer && drawer.classList.contains('open')) return;
    if (diaryPanel && diaryPanel.classList.contains('open')) return;
    const touchEndX = e.changedTouches[0].clientX; const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX; const deltaY = touchEndY - touchStartY;
    if (isEdgeSwipe && Math.abs(deltaX) > 80 && Math.abs(deltaY) < 50) { handleEdgeBack(); return; }
    if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const activePage = document.querySelector('.page.active'); if (!activePage) return;
        const currentIndex = swipePages.indexOf(activePage.id); if (currentIndex === -1) return;
        if (deltaX < 0) {
            if (currentIndex < swipePages.length - 1) { switchPage(swipePages[currentIndex + 1]); }
            else if (activePage.id === 'page-important-dates') { const d = new Date(); const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; openDiaryPanel(diaryPanelDate || todayStr); }
        } else {
            if (currentIndex > 0) { switchPage(swipePages[currentIndex - 1]); }
            else if (activePage.id === 'page-home') { openDrawer(); }
        }
    }
}, { passive: true });
function handleEdgeBack() {
    if (document.getElementById('confirm-modal').style.display === 'flex') { closeConfirm(); return; }
    if (document.getElementById('prompt-modal').style.display === 'flex') { closePrompt(); return; }
    if (document.getElementById('alert-modal').style.display === 'flex') { closeAlert(false); return; }
    if (document.getElementById('date-picker-modal').style.display === 'flex') { closeDatePicker(); return; }
    if (document.getElementById('template-modal').style.display === 'flex') { closeTemplateModal(); return; }
    if (document.getElementById('pattern-lock-modal').style.display === 'flex') { closePatternLock(); return; }
    if (document.getElementById('crop-overlay').style.display === 'flex') { cancelWallpaper(); return; }
    if (document.getElementById('side-drawer').classList.contains('open')) { closeDrawer(); return; }
    if (document.getElementById('diary-panel').classList.contains('open')) { closeDiaryPanel(); return; }
    if (document.getElementById('page-important-dates').classList.contains('active')) {
        if (document.getElementById('important-list-view').style.display === 'block') { exitImportantList(); return; }
    }
    const activePage = document.querySelector('.page.active')?.id; if (!activePage) return;
    const backMap = {
        'page-add': () => switchPage('page-all-items'), 'page-add-gift': () => switchPage('page-gift-record'), 'page-gift-detail': () => switchPage('page-gift-record'), 'page-event-detail': () => switchPage('page-gift-detail'), 'page-add-event': () => switchPage('page-gift-detail'), 'page-add-important': () => switchPage('page-important-dates'), 'page-important-detail': () => backFromImportantDetail(), 'page-book-list': () => switchPage('page-home'), 'page-book-view': () => switchPage('page-home'), 'page-book-detail': () => switchPage('page-book-list'), 'page-item-distribution': () => switchPage('page-all-items'), 'page-gift-distribution': () => switchPage('page-gift-record'), 'page-diary-list': () => backFromImportantDetail(), 'page-diary-view': () => backToDiaryList(), 'page-diary-edit': () => cancelDiaryEdit(), 'page-profile': () => switchPage('page-home'), 'page-theme': () => switchPage('page-home'), 'page-backup': () => switchPage('page-home'), 'page-lock': () => switchPage('page-home'), 'page-about': () => switchPage('page-home')
    };
    if (backMap[activePage]) { backMap[activePage](); }
}
// ================= 通用图片压缩与日期选择器 =================
function compressImage(base64Str, maxWidth, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => { showToast(T('图片读取失败，请换一张'), 'error'); };
    img.src = base64Str;
}

function openDatePicker(inputId, mode) {
    currentInputId = inputId;
    pickerMode = mode || 'full';
    pickerStep = 'year';
    selectedYear = null; selectedMonth = null; selectedDay = null;
    document.getElementById('date-picker-modal').style.display = 'flex';
    renderPickerBody();
}
function closeDatePicker() { document.getElementById('date-picker-modal').style.display = 'none'; }
function renderPickerBody() {
    const body = document.getElementById('picker-body');
    const title = document.getElementById('picker-title');
    body.innerHTML = '';
    if (pickerStep === 'year') {
        title.innerText = T('1. 选择年份');
        const y = new Date().getFullYear();
        for (let i = y - 10; i <= y + 10; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = T('{n}年', { n: i });
            d.onclick = () => { selectedYear = i; pickerStep = 'month'; renderPickerBody(); }; body.appendChild(d);
        }
    } else if (pickerStep === 'month') {
        title.innerText = T('{y}年 2. 选择月份', { y: selectedYear });
        for (let i = 1; i <= 12; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = T('{n}月', { n: i });
            d.onclick = () => {
                selectedMonth = i;
                if (pickerMode === 'year-month') {
                    calYear = selectedYear; calMonth = selectedMonth;
                    document.getElementById('important-detail-card').style.display = 'none';
                    renderCalendar(); closeDatePicker();
                } else { pickerStep = 'day'; renderPickerBody(); }
            };
            body.appendChild(d);
        }
    } else if (pickerStep === 'day') {
        title.innerText = T('{y}年{m}月 3. 选择日期', { y: selectedYear, m: selectedMonth });
        const days = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let i = 1; i <= days; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = T('{n}日', { n: i });
            d.onclick = () => { selectedDay = i; confirmDate(); }; body.appendChild(d);
        }
    }
}
function selectToday() {
    const t = new Date(); selectedYear = t.getFullYear(); selectedMonth = t.getMonth() + 1; selectedDay = t.getDate(); confirmDate();
}
function confirmDate() {
    if (selectedYear && selectedMonth && selectedDay) {
        const f = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        document.getElementById(currentInputId).value = f;
    }
    closeDatePicker();
}
// ================== 无损图片存储方案 (IndexedDB) ==================
const PhotoDB = {
    dbName: 'MyLifePhotosDB',
    storeName: 'photos',
    db: null,

    // 初始化数据库
    init() {
        return new Promise((resolve, reject) => {
            if (this.db) return resolve(this.db);
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName); // 用 key (如 ID) 来存图
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 在 PhotoDB 对象里加上这个方法
    async saveImageBase64(key, base64Str) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(base64Str, key);
            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 保存原图 (接收 File 对象)
    async saveImage(key, file) {
        await this.init();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Str = e.target.result; // 这里是没有被压缩的完整 Base64
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(base64Str, key);
                request.onsuccess = () => resolve(true);
                request.onerror = (e) => reject(e.target.error);
            };
            reader.readAsDataURL(file);
        });
    },

    // 读取原图
    async getImage(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 删除图片
    async deleteImage(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    }
};