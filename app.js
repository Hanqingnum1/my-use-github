// ================= 全局变量 =================
let currentInputId = null;
let selectedYear = null, selectedMonth = null, selectedDay = null;
let pickerStep = 'year';
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
let selectedImportantLevel = '提醒';
let editingImportantId = null;
let currentImportantDetailId = null;
let selectedEventChipName = null;
let selectedGiftType = '随礼'; // 当前选中的随礼类型
let currentEventId = null;   // 当前查看的事件 ID
let editingEventId = null;   // 正在编辑的事件 ID
// 图形锁相关
let patternPoints = [];
let patternSelected = [];
let patternDrawing = false;
let patternFirstAttempt = null;   // 第一次绘制的图案（用于二次确认）
let patternMode = 'set';          // 'set' = 设置新图案, 'verify' = 验证已有图案
// 壁纸拖动选区相关
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
// 日记/便签相关
let diaryPanelDate = null;        // 当前日记面板对应的日期
let currentDiaryType = '日记';     // 日记 or 便签
let currentDiaryTemplate = null;  // 当前选中的模板
let editingDiaryId = null;        // 正在编辑的日记 ID
let isLongPress = false;          // 长按标志
let longPressTimer = null;        // 长按计时器
// 全部物品页面状态
let allItemsTopFilter = '';       // '' | 'held' | 'expiring' | 'warranty'
let allItemsFilter = 'all';
let allItemsCategory = '';
let allItemsSort = 'default';
let allItemsView = 'list';        // list | tile
let selectedAcquire = '网购';
let selectedItemStatus = '持有中';
let allItemsSortDir = 'desc'; // asc | desc
// 物品编辑页
let editingItemImages = ['', '', ''];
let selectedCategoryName = '';
let giftPhotos = ['', '', ''];
let eventPhotos = ['', '', ''];
let giftTopFilter = '';           // '' | 'gift' | 'receive'
let giftCategoryFilter = '';      // '' 或事件类型
let giftSort = 'default';
let giftSortDir = 'desc';
let giftView = 'list';

// 图标选择相关
let iconSrcImage = null;
let selectedIconCells = []; // [{row, col, num}]

const nationalHolidays = {
    '01-01': '元旦', '02-14': '情人节', '03-08': '妇女节', '03-12': '植树节',
    '04-01': '愚人节', '05-01': '劳动节', '05-04': '青年节', '06-01': '儿童节',
    '07-01': '建党节', '08-01': '建军节', '09-10': '教师节',
    '10-01': '国庆节', '12-24': '平安夜', '12-25': '圣诞节'
};

// ================= 页面切换 =================
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (!el) return;
    el.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if (pageId === 'page-home') {
        document.getElementById('nav-home').classList.add('active');
        updateDashboard();
        renderUpcomingDates();
        renderBookProgress();
    } else if (pageId === 'page-item-distribution') {
        document.getElementById('nav-all-items').classList.add('active');
        setTimeout(initItemChart, 100);
    } else if (pageId === 'page-gift-distribution') {
        document.getElementById('nav-gift').classList.add('active');
        setTimeout(initGiftChart, 100);
    } else if (pageId === 'page-all-items') {
        document.getElementById('nav-all-items').classList.add('active');
        updateItemStats();
        renderItemsList();
    } else if (pageId === 'page-gift-record') {
        document.getElementById('nav-gift').classList.add('active');
        giftTopFilter = '';
        giftCategoryFilter = '';
        const gc = document.getElementById('stat-gift-card');
        const rc = document.getElementById('stat-receive-card');
        if (gc) gc.classList.remove('active');
        if (rc) rc.classList.remove('active');
        const sw = document.getElementById('gift-search-bar-wrapper');
        const si = document.getElementById('gift-search-input');
        if (sw) sw.style.display = 'none';
        if (si) si.value = '';
        renderGiftList();
    }else if (pageId === 'page-important-dates') {
        document.getElementById('nav-important').classList.add('active');
        backToCalendar();
        } else if (['page-add','page-add-gift','page-gift-detail','page-add-event','page-add-important','page-important-detail','page-profile','page-theme','page-backup','page-lock','page-about','page-event-detail','page-diary-edit'].includes(pageId)) {
        document.getElementById('nav-home').classList.add('active');
        }
    // 底部导航只在4个主页面显示
    const mainPages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
    const nav = document.querySelector('.bottom-nav');
    if (nav) {
        nav.style.display = mainPages.includes(pageId) ? 'flex' : 'none';
    }
    window.scrollTo(0, 0);
}

// ================= 抽屉 =================
function openDrawer() {
    document.getElementById('side-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('open');
    refreshDrawerInfo();
}
function closeDrawer() {
    document.getElementById('side-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
}
function openDrawerPage(pageId) {
    closeDrawer();
    setTimeout(() => {
        switchPage(pageId);
        if (pageId === 'page-profile') loadProfile();
        if (pageId === 'page-theme') loadTheme();
        if (pageId === 'page-lock') loadLockSettings();
        if (pageId === 'page-backup') updateStorageUsage();
    }, 250);
}
function refreshDrawerInfo() {
    const p = getProfile();
    document.getElementById('drawer-name').textContent = p.nickname || '未设置昵称';
    document.getElementById('drawer-sign').textContent = p.sign || '点击设置个性签名';
    const av = document.getElementById('drawer-avatar');
    if (p.avatar) av.innerHTML = `<img src="${p.avatar}">`;
    else av.innerHTML = '👤';
}

// ================= 个人资料 =================
function getProfile() {
    return JSON.parse(localStorage.getItem('myProfile')) || { nickname: '', sign: '', avatar: '' };
}
function saveProfile(p) { localStorage.setItem('myProfile', JSON.stringify(p)); refreshDrawerInfo(); }
function loadProfile() {
    const p = getProfile();
    document.getElementById('profile-nickname-display').textContent = p.nickname || '未设置昵称';
    document.getElementById('profile-sign-display').textContent = p.sign || '点击设置个性签名';
    if (p.avatar) document.getElementById('profile-avatar-img').src = p.avatar;
}
function uploadAvatar(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => compressImage(e.target.result, 300, (b64) => {
        const p = getProfile(); p.avatar = b64; saveProfile(p);
        document.getElementById('profile-avatar-img').src = b64;
    });
    reader.readAsDataURL(input.files[0]);
}
function editField(field) {
    const p = getProfile();
    if (field === 'nickname') {
        const v = prompt('请输入昵称：', p.nickname || '');
        if (v !== null) { p.nickname = v.trim(); saveProfile(p); loadProfile(); }
    } else {
        const v = prompt('请输入个性签名：', p.sign || '');
        if (v !== null) { p.sign = v.trim(); saveProfile(p); loadProfile(); }
    }
}

// ================= 主题 =================
function getTheme() { return JSON.parse(localStorage.getItem('myTheme')) || { color: '#d98880', dark: false, wallpaper: '' }; }
function saveTheme(t) { localStorage.setItem('myTheme', JSON.stringify(t)); }
function applyTheme() {
    const t = getTheme();
    document.documentElement.style.setProperty('--primary', t.color);
    document.body.classList.toggle('dark-mode', !!t.dark);
    if (t.wallpaper) {
        document.body.style.backgroundImage = `url(${t.wallpaper})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    } else {
        document.body.style.backgroundImage = '';
    }
}
function loadTheme() {
    const t = getTheme();
    document.getElementById('setting-lang').value = t.lang || 'zh-CN';
    document.getElementById('setting-startpage').value = t.startpage || 'home';
    document.getElementById('dark-mode-toggle').checked = !!t.dark;
}
function saveSetting(k, v) { const t = getTheme(); t[k] = v; saveTheme(t); }
function setThemeColor(c) { const t = getTheme(); t.color = c; saveTheme(t); applyTheme(); }
function toggleDarkMode(on) { const t = getTheme(); t.dark = on; saveTheme(t); applyTheme(); }
function uploadWallpaper(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        compressImage(e.target.result, 1200, (b64) => {
            cropImgSrc = b64;
            showCropWindow();
        });
    };
    reader.readAsDataURL(input.files[0]);
}

function showCropWindow() {
    const area = document.getElementById('wallpaper-crop-area');
    const win = document.getElementById('wallpaper-crop-window');
    const img = document.getElementById('wallpaper-crop-img');
    area.style.display = 'block';

    img.onload = () => {
        cropImgNaturalW = img.naturalWidth;
        cropImgNaturalH = img.naturalHeight;

        const winW = win.clientWidth;
        const winH = win.clientHeight;

        // 缩放：让图片至少覆盖窗口（cover 模式）
        const scale = Math.max(winW / cropImgNaturalW, winH / cropImgNaturalH);
        cropImgDisplayW = cropImgNaturalW * scale;
        cropImgDisplayH = cropImgNaturalH * scale;

        img.style.width = cropImgDisplayW + 'px';
        img.style.height = cropImgDisplayH + 'px';

        // 初始居中
        cropImgX = (winW - cropImgDisplayW) / 2;
        cropImgY = (winH - cropImgDisplayH) / 2;
        updateCropPosition();

        bindCropDrag();
    };
    img.src = cropImgSrc;
}

function bindCropDrag() {
    const win = document.getElementById('wallpaper-crop-window');

    win.onmousedown = null; win.onmousemove = null; win.onmouseup = null; win.onmouseleave = null;
    win.ontouchstart = null; win.ontouchmove = null; win.ontouchend = null;

    const startDrag = (x, y) => {
        cropDragging = true;
        cropStartX = x - cropImgX;
        cropStartY = y - cropImgY;
    };
    const moveDrag = (x, y) => {
        if (!cropDragging) return;
        let newX = x - cropStartX;
        let newY = y - cropStartY;

        const winW = win.clientWidth;
        const winH = win.clientHeight;
        if (newX > 0) newX = 0;
        if (newY > 0) newY = 0;
        if (newX < winW - cropImgDisplayW) newX = winW - cropImgDisplayW;
        if (newY < winH - cropImgDisplayH) newY = winH - cropImgDisplayH;

        cropImgX = newX;
        cropImgY = newY;
        updateCropPosition();
    };
    const endDrag = () => { cropDragging = false; };

    win.onmousedown = (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); };
    win.onmousemove = (e) => { moveDrag(e.clientX, e.clientY); };
    win.onmouseup = endDrag;
    win.onmouseleave = endDrag;

    win.ontouchstart = (e) => { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY); };
    win.ontouchmove  = (e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); };
    win.ontouchend   = (e) => { e.preventDefault(); endDrag(); };
}

function updateCropPosition() {
    const img = document.getElementById('wallpaper-crop-img');
    img.style.left = cropImgX + 'px';
    img.style.top = cropImgY + 'px';
}

function confirmWallpaperCrop() {
    if (!cropImgSrc) return;
    const win = document.getElementById('wallpaper-crop-window');
    const winW = win.clientWidth;
    const winH = win.clientHeight;

    // 提高输出清晰度
    const outputScale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = winW * outputScale;
    canvas.height = winH * outputScale;
    const ctx = canvas.getContext('2d');

    // 窗口左上角在原始图片上的位置（像素）
    const srcX = (-cropImgX) * (cropImgNaturalW / cropImgDisplayW);
    const srcY = (-cropImgY) * (cropImgNaturalH / cropImgDisplayH);
    const srcW = winW * (cropImgNaturalW / cropImgDisplayW);
    const srcH = winH * (cropImgNaturalH / cropImgDisplayH);

    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);

        const t = getTheme();
        t.wallpaper = croppedBase64;
        saveTheme(t);
        applyTheme();

        cropImgSrc = null;
        document.getElementById('wallpaper-crop-area').style.display = 'none';
        alert('壁纸已应用！');
    };
    img.src = cropImgSrc;
}

function cancelWallpaper() {
    cropImgSrc = null;
    document.getElementById('wallpaper-crop-area').style.display = 'none';
}

function clearWallpaper() { const t = getTheme(); t.wallpaper = ''; saveTheme(t); applyTheme(); }

// ================= 自定义导航图标 =================
function getCustomIcons() { return JSON.parse(localStorage.getItem('myCustomIcons')) || { src: '', cells: [] }; }
function saveCustomIcons(data) { localStorage.setItem('myCustomIcons', JSON.stringify(data)); }

function uploadIconImage(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => compressImage(e.target.result, 600, (b64) => {
        iconSrcImage = b64;
        selectedIconCells = [];
        showIconSelector();
    });
    reader.readAsDataURL(input.files[0]);
}

function showIconSelector() {
    document.getElementById('icon-selector-area').style.display = 'block';
    document.getElementById('icon-source-img').src = iconSrcImage;
    const overlay = document.getElementById('icon-grid-overlay');
    overlay.innerHTML = '';
    // 4x4 网格
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            cell.className = 'icon-cell';
            cell.style.left = (c * 25) + '%';
            cell.style.top = (r * 25) + '%';
            cell.style.width = '25%';
            cell.style.height = '25%';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => toggleIconCell(r, c, cell);
            overlay.appendChild(cell);
        }
    }
    refreshIconSelection();
}

function toggleIconCell(r, c, cellEl) {
    const idx = selectedIconCells.findIndex(x => x.row === r && x.col === c);
    if (idx !== -1) {
        selectedIconCells.splice(idx, 1);
        // 重新编号
        selectedIconCells.forEach((item, i) => item.num = i + 1);
    } else {
        if (selectedIconCells.length >= 4) { alert('最多选择 4 个区域'); return; }
        selectedIconCells.push({ row: r, col: c, num: selectedIconCells.length + 1 });
    }
    // 保存
    const data = { src: iconSrcImage, cells: selectedIconCells };
    saveCustomIcons(data);
    applyCustomIcons();
    refreshIconSelection();
}

function refreshIconSelection() {
    document.querySelectorAll('#icon-grid-overlay .icon-cell').forEach(cell => {
        cell.classList.remove('selected');
        cell.removeAttribute('data-num');
    });
    selectedIconCells.forEach(item => {
        const selector = `#icon-grid-overlay .icon-cell[data-row="${item.row}"][data-col="${item.col}"]`;
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('selected');
            el.setAttribute('data-num', item.num);
        }
    });
    document.getElementById('icon-selected-count').textContent = selectedIconCells.length;
}

function applyCustomIcons() {
    const data = getCustomIcons();
    const navKeys = ['home', 'items', 'gift', 'important'];
    const defaults = [
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V9.5z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    ];
    navKeys.forEach((key, i) => {
        const el = document.getElementById('nav-icon-' + key);
        if (!el) return;
        el.style.backgroundImage = '';
        el.style.backgroundSize = '';
        el.style.backgroundPosition = '';
        el.style.width = '';
        el.style.height = '';
        el.style.borderRadius = '';
        el.innerHTML = '';

        const cell = data.cells[i];
        if (cell && data.src) {
            el.style.backgroundImage = `url(${data.src})`;
            el.style.backgroundSize = '400% 400%';
            el.style.backgroundPosition = `${(cell.col / 3) * 100}% ${(cell.row / 3) * 100}%`;
            el.style.width = '22px';
            el.style.height = '22px';
            el.style.borderRadius = '5px';
        } else {
            el.innerHTML = defaults[i];
        }
    });
}

function clearCustomIcons() {
    if (!confirm('确定要重置自定义图标吗？')) return;
    localStorage.removeItem('myCustomIcons');
    iconSrcImage = null;
    selectedIconCells = [];
    document.getElementById('icon-selector-area').style.display = 'none';
    applyCustomIcons();
}

// ================= 数据备份 =================
function updateStorageUsage() {
    let total = 0;
    for (let k in localStorage) {
        if (localStorage.hasOwnProperty(k)) total += localStorage[k].length + k.length;
    }
    document.getElementById('storage-usage').textContent = (total / 1024).toFixed(1) + ' KB';
}
function exportData() {
    const data = {
        items: JSON.parse(localStorage.getItem('myItems') || '[]'),
        giftRecords: JSON.parse(localStorage.getItem('myGiftRecords') || '[]'),
        importantDates: JSON.parse(localStorage.getItem('myImportantDates') || '[]'),
        profile: getProfile(), theme: getTheme()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my-life-backup-' + Date.now() + '.json';
    a.click(); URL.revokeObjectURL(url);
}
function importData(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm('导入会覆盖当前数据，是否继续？')) {
                if (data.items) localStorage.setItem('myItems', JSON.stringify(data.items));
                if (data.giftRecords) localStorage.setItem('myGiftRecords', JSON.stringify(data.giftRecords));
                if (data.importantDates) localStorage.setItem('myImportantDates', JSON.stringify(data.importantDates));
                if (data.profile) localStorage.setItem('myProfile', JSON.stringify(data.profile));
                if (data.theme) localStorage.setItem('myTheme', JSON.stringify(data.theme));
                alert('导入成功！'); location.reload();
            }
        } catch (err) { alert('文件格式错误！'); }
    };
    reader.readAsText(input.files[0]);
}
function clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        localStorage.clear(); alert('已清空'); location.reload();
    }
}

// ================= 应用锁 =================
function getLockSettings() { return JSON.parse(localStorage.getItem('myLock')) || { type: '' }; }
function loadLockSettings() {
    const l = getLockSettings();
    document.querySelectorAll('.lock-check').forEach(el => el.classList.remove('active'));
    if (l.type) { const el = document.getElementById('lock-' + l.type); if (el) el.classList.add('active'); }
}
function setLockType(type) {
    const l = getLockSettings();
    if (l.type === type) {
        // 再次点击 = 取消设置
        l.type = '';
        l.password = '';
        l.pattern = '';
        localStorage.setItem('myLock', JSON.stringify(l));
        loadLockSettings();
        alert('已取消应用锁');
        return;
    }

    if (type === 'password') {
        const pwd = prompt('请设置密码（4位数字）：');
        if (pwd === null) return;
        if (!/^\d{4}$/.test(pwd)) { alert('请输入4位数字密码'); return; }
        const confirmPwd = prompt('请再次输入密码：');
        if (confirmPwd !== pwd) { alert('两次密码不一致'); return; }
        l.type = 'password';
        l.password = pwd;
        localStorage.setItem('myLock', JSON.stringify(l));
        alert('密码锁设置成功！');
    } else if (type === 'fingerprint') {
        if (confirm('是否启用指纹解锁？（模拟，点击确定后需录入指纹）')) {
            l.type = 'fingerprint';
            localStorage.setItem('myLock', JSON.stringify(l));
            alert('指纹锁已启用（模拟）');
        }
    }
    // 注意：pattern 分支已删除，图形锁走 openPatternLock()
    loadLockSettings();
}

// ================= 事件 chips =================
function selectEventChip(type) {
    document.getElementById('gift-event').value = type;
    document.querySelectorAll('#page-add-gift .chip').forEach(c => c.classList.toggle('active', c.dataset.type === type));
}
function selectEventChip2(type) {
    document.getElementById('event-name').value = type;
    document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.toggle('active', c.dataset.type === type));
}

function selectAcquire(v) {
    selectedAcquire = v;
    renderAcquireGrid();
}

function selectItemStatus(v) {
    selectedItemStatus = v;
    document.querySelectorAll('#page-add .chip[data-status]').forEach(c => {
        c.classList.toggle('active', c.dataset.status === v);
    });
}

// 金额选择
function selectGiftAmount(amount, context) {
    const pageId = context === 'gift' ? 'page-add-gift' : 'page-add-event';
    const inputId = context === 'gift' ? 'gift-amount' : 'event-amount';
    const input = document.getElementById(inputId);
    const chips = document.querySelectorAll(`#${pageId} .amount-chips .chip`);
    chips.forEach(c => c.classList.remove('active'));

    if (amount === 'other') {
        input.style.display = 'block';
        input.value = '';
        input.focus();
        chips.forEach(c => { if (c.dataset.amount === 'other') c.classList.add('active'); });
    } else {
        input.style.display = 'none';
        input.value = amount;
        chips.forEach(c => { if (c.dataset.amount == amount) c.classList.add('active'); });
    }
}

// 随礼照片
function triggerGiftUpload(i) { document.getElementById('gift-image-' + i).click(); }
function uploadGiftPhoto(i, input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => compressImage(e.target.result, 500, (b64) => {
        giftPhotos[i] = b64; renderGiftPhotoSlot(i);
    });
    reader.readAsDataURL(input.files[0]);
}
function renderGiftPhotoSlot(i) {
    const p = document.getElementById('gift-image-preview-' + i);
    const ph = document.getElementById('gift-upload-placeholder-' + i);
    const rb = document.getElementById('gift-image-remove-' + i);
    if (!p) return;
    if (giftPhotos[i]) { p.src = giftPhotos[i]; p.style.display='block'; if(ph) ph.style.display='none'; if(rb) rb.style.display='flex'; }
    else { p.style.display='none'; if(ph) ph.style.display='flex'; if(rb) rb.style.display='none'; }
}
function removeGiftPhoto(i, ev) {
    if (ev) ev.stopPropagation();
    giftPhotos[i] = '';
    const input = document.getElementById('gift-image-' + i);
    if (input) input.value = '';
    renderGiftPhotoSlot(i);
}

// 事件照片
function triggerEventUpload(i) { document.getElementById('event-image-' + i).click(); }
function uploadEventPhoto(i, input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => compressImage(e.target.result, 500, (b64) => {
        eventPhotos[i] = b64; renderEventPhotoSlot(i);
    });
    reader.readAsDataURL(input.files[0]);
}
function renderEventPhotoSlot(i) {
    const p = document.getElementById('event-image-preview-' + i);
    const ph = document.getElementById('event-upload-placeholder-' + i);
    const rb = document.getElementById('event-image-remove-' + i);
    if (!p) return;
    if (eventPhotos[i]) { p.src = eventPhotos[i]; p.style.display='block'; if(ph) ph.style.display='none'; if(rb) rb.style.display='flex'; }
    else { p.style.display='none'; if(ph) ph.style.display='flex'; if(rb) rb.style.display='none'; }
}
function removeEventPhoto(i, ev) {
    if (ev) ev.stopPropagation();
    eventPhotos[i] = '';
    const input = document.getElementById('event-image-' + i);
    if (input) input.value = '';
    renderEventPhotoSlot(i);
}

// ================= 物品 =================
// 分类图标配置
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

// 获取方式配置
const acquireConfig = [
    { name: '网购', color: '#5B7FA6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
    { name: '线下', color: '#7BA05B', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 22V12h6v10"/></svg>' },
    { name: '赠送', color: '#E8A4B8', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>' },
    { name: '白嫖', color: '#D4A82A', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18.5 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>' },
    { name: '其他', color: '#9E9E9E', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
];

function renderCategoryGrid() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';
    categoryConfig.forEach(c => {
        const div = document.createElement('div');
        div.className = 'category-item' + (selectedCategoryName === c.name ? ' active' : '');
        div.style.setProperty('--cat-color', c.color);
        div.onclick = () => selectCategoryIcon(c.name);
        div.innerHTML = `<div class="category-icon">${c.icon}</div><div class="category-name">${c.name}</div>`;
        grid.appendChild(div);
    });
}

function selectCategoryIcon(name) {
    selectedCategoryName = name;
    renderCategoryGrid();
    updateDateFieldsVisibility();
}

function renderAcquireGrid() {
    const grid = document.getElementById('acquire-grid');
    if (!grid) return;
    grid.innerHTML = '';
    acquireConfig.forEach(c => {
        const div = document.createElement('div');
        div.className = 'category-item' + (selectedAcquire === c.name ? ' active' : '');
        div.style.setProperty('--cat-color', c.color);
        div.onclick = () => selectAcquire(c.name);
        div.innerHTML = `<div class="category-icon">${c.icon}</div><div class="category-name">${c.name}</div>`;
        grid.appendChild(div);
    });
}

function updateDateFieldsVisibility() {
    const cat = selectedCategoryName;
    const expiryBox = document.getElementById('expiry-box');
    const warrantyBox = document.getElementById('warranty-box');
    if (!expiryBox || !warrantyBox) return;
    expiryBox.style.display = 'none';
    warrantyBox.style.display = 'none';
    if (cat === '家电' || cat === '电子产品') {
        warrantyBox.style.display = 'block';
    } else if (cat === '食品' || cat === '厨房食材' || cat === '护肤品' || cat === '化妆品') {
        expiryBox.style.display = 'block';
    }
}

// 图片上传
function triggerImageUpload(index) {
    document.getElementById('item-image-' + index).click();
}

function uploadItemImage(index, input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        compressImage(e.target.result, 500, (b64) => {
            editingItemImages[index] = b64;
            renderImageSlot(index);
        });
    };
    reader.readAsDataURL(input.files[0]);
}

function renderImageSlot(index) {
    const preview = document.getElementById('item-image-preview-' + index);
    const placeholder = document.getElementById('upload-placeholder-' + index);
    const removeBtn = document.getElementById('image-remove-' + index);
    if (!preview) return;
    if (editingItemImages[index]) {
        preview.src = editingItemImages[index];
        preview.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        if (removeBtn) removeBtn.style.display = 'flex';
    } else {
        preview.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
        if (removeBtn) removeBtn.style.display = 'none';
    }
}

function removeItemImage(index, event) {
    if (event) event.stopPropagation();
    editingItemImages[index] = '';
    const input = document.getElementById('item-image-' + index);
    if (input) input.value = '';
    renderImageSlot(index);
}

function renderAllImageSlots() {
    for (let i = 0; i < 3; i++) renderImageSlot(i);
}

// 数量
function changeQuantity(delta) {
    const input = document.getElementById('item-quantity');
    let v = parseInt(input.value) || 1;
    v += delta;
    if (v < 1) v = 1;
    if (v > 999) v = 999;
    input.value = v;
}

function clampQuantity() {
    const input = document.getElementById('item-quantity');
    let v = parseInt(input.value) || 1;
    if (v < 1) v = 1;
    if (v > 999) v = 999;
    input.value = v;
}

function getItems() { return JSON.parse(localStorage.getItem('myItems')) || []; }

function saveItem() {
    const name = document.getElementById('item-name').value.trim();
    const category = selectedCategoryName;
    const price = document.getElementById('item-price').value;
    const quantity = document.getElementById('item-quantity').value || 1;
    const remark = document.getElementById('item-remark').value.trim();

    if (!name) { alert('请填写物品名称！'); return; }
    if (!category) { alert('请选择分类！'); return; }

    const images = editingItemImages.filter(x => x);
    const mainImage = images[0] || '';

    const handleSave = () => {
        let items = getItems();
        const purchaseDate = document.getElementById('purchase-date').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const warrantyDate = document.getElementById('warranty-date').value;
        const status = selectedItemStatus || '持有中';
        const acquireMethod = selectedAcquire || '网购';

        if (editingItemId) {
            const idx = items.findIndex(i => i.id === editingItemId);
            if (idx !== -1) {
                items[idx] = {
                    ...items[idx],
                    name, category, price, quantity,
                    image: mainImage,
                    images: images,
                    purchaseDate, expiryDate, warrantyDate,
                    status, acquireMethod, remark
                };
            }
            alert('修改成功！');
        } else {
            items.push({
                id: Date.now(),
                name, category, price: price || 0, quantity,
                image: mainImage,
                images: images,
                purchaseDate, expiryDate, warrantyDate,
                status, acquireMethod, remark
            });
            alert('保存成功！');
        }
        localStorage.setItem('myItems', JSON.stringify(items));
        resetForm();
        switchPage('page-all-items');
    };

    handleSave();
}

function compressImage(base64Str, maxWidth, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
}

function resetForm() {
    editingItemId = null;
    document.getElementById('item-edit-title').textContent = '添加物品';
    document.getElementById('item-submit-text').textContent = '添加物品';
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-quantity').value = '1';
    document.getElementById('purchase-date').value = '';
    document.getElementById('expiry-date').value = '';
    document.getElementById('warranty-date').value = '';
    document.getElementById('item-remark').value = '';
    document.getElementById('expiry-box').style.display = 'none';
    document.getElementById('warranty-box').style.display = 'none';

    // 清空图片
    for (let i = 0; i < 3; i++) {
        editingItemImages[i] = '';
        const input = document.getElementById('item-image-' + i);
        if (input) input.value = '';
    }
    renderAllImageSlots();

    selectedCategoryName = '';
    renderCategoryGrid();

    selectedAcquire = '网购';
    renderAcquireGrid();

    selectedItemStatus = '持有中';
    document.querySelectorAll('#page-add .chip[data-status]').forEach(c => {
        c.classList.toggle('active', c.dataset.status === '持有中');
    });
}

function updateDashboard() {
    const items = getItems();
    document.getElementById('total-count').innerText = items.length + ' 件';
    let totalPrice = 0;
    items.forEach(i => totalPrice += parseFloat(i.price || 0));
    document.getElementById('total-item-price').innerText = '¥ ' + totalPrice.toFixed(2);
    const records = getGiftRecords();
    let totalGift = 0;
    records.forEach(r => r.events.forEach(e => totalGift += e.amount));
    document.getElementById('total-gift-amount').innerText = '¥ ' + totalGift.toFixed(2);
}

function getDaysRemaining(dateString) {
    if (!dateString) return null;
    const target = new Date(dateString);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function toggleFilterMenu() { const m = document.getElementById('filter-menu'); m.style.display = m.style.display === 'none' ? 'block' : 'none'; }
function setFilterType(t) { filterType = t; updateFilterButtons(); renderItemsList(); }
function setFilterStatus(s) { filterStatus = s; updateFilterButtons(); renderItemsList(); }
function updateFilterButtons() {
    document.querySelectorAll('#filter-menu .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filterType && btn.dataset.filterType === filterType) btn.classList.add('active');
        if (btn.dataset.filterStatus && btn.dataset.filterStatus === filterStatus) btn.classList.add('active');
    });
}

// ================= 全部物品页面逻辑 =================
function getItemStatus(item) { return item.status || '持有中'; }
function getItemAcquire(item) { return item.acquireMethod || '网购'; }

function isHeld(item) {
    if (getItemStatus(item) === '已移除') return false;
    const d = getDaysRemaining(item.expiryDate);
    if (d !== null && d < 0) return false;
    return true;
}
function isExpiringSoon(item) {
    const cat = item.category;
    const d = getDaysRemaining(item.expiryDate);
    if (d === null || d < 0) return false;
    if (cat === '食品' || cat === '厨房食材') return d <= 60;
    if (cat === '护肤品' || cat === '化妆品') return d <= 180;
    return false;
}
function isWarrantyExpiringSoon(item) {
    const cat = item.category;
    if (cat !== '家电' && cat !== '电子产品') return false;
    const d = getDaysRemaining(item.warrantyDate);
    if (d === null || d < 0) return false;
    return d <= 180;
}

function updateItemStats() {
    const items = getItems().filter(i => getItemStatus(i) !== '已移除');
    const heldItems = getItems().filter(isHeld);
    const pausedCount = heldItems.filter(i => getItemStatus(i) === '暂离中').length;
    const heldNum = document.getElementById('stat-held-num');
    const extra = document.getElementById('stat-held-extra');
    const expNum = document.getElementById('stat-expiring-num');
    const warNum = document.getElementById('stat-warranty-num');
    if (heldNum) heldNum.textContent = heldItems.length;
    if (extra) extra.textContent = pausedCount > 0 ? `暂离 ${pausedCount}` : '';
    if (expNum) expNum.textContent = items.filter(isExpiringSoon).length;
    if (warNum) warNum.textContent = items.filter(isWarrantyExpiringSoon).length;
}

function selectTopCard(type) {
    allItemsTopFilter = (allItemsTopFilter === type) ? '' : type;
    const h = document.getElementById('stat-held');
    const e = document.getElementById('stat-expiring');
    const w = document.getElementById('stat-warranty');
    if (h) h.classList.toggle('active', allItemsTopFilter === 'held');
    if (e) e.classList.toggle('active', allItemsTopFilter === 'expiring');
    if (w) w.classList.toggle('active', allItemsTopFilter === 'warranty');
    renderItemsList();
}

function setAllItemsFilter(v) { allItemsFilter = v; renderItemsList(); }
function setAllItemsCategory(v) { allItemsCategory = v; renderItemsList(); }
function setAllItemsSort(v) { allItemsSort = v; renderItemsList(); }

function toggleViewMode() {
    allItemsView = allItemsView === 'list' ? 'tile' : 'list';
    const btn = document.getElementById('view-toggle-btn');
    if (allItemsView === 'list') {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    }
    renderItemsList();
}

function toggleSortDir() {
    allItemsSortDir = allItemsSortDir === 'desc' ? 'asc' : 'desc';
    const btn = document.getElementById('sort-dir-btn');
    if (allItemsSortDir === 'desc') {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
    }
    renderItemsList();
}

function updateCategoryCounts() {
    const select = document.getElementById('filter-category');
    if (!select) return;
    const current = select.value;
    while (select.options.length > 1) select.remove(1);
    const cats = ['家电','电子产品','食品','厨房食材','护肤品','化妆品','生活用品','书本','学习资料','手办'];
    const items = getItems().filter(i => getItemStatus(i) !== '已移除');
    cats.forEach(cat => {
        const count = items.filter(i => i.category === cat).length;
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = `${cat}（${count}）`;
        select.appendChild(opt);
    });
    select.value = current;
}

function toggleSearchBar() {
    const w = document.getElementById('search-bar-wrapper');
    w.style.display = w.style.display === 'none' ? 'block' : 'none';
    if (w.style.display === 'block') document.getElementById('search-input').focus();
}

function renderItemsList() {
    updateCategoryCounts();
    let items = getItems();
    const container = document.getElementById('items-list');
    if (!container) return;

    const searchInput = document.getElementById('search-input');
    const kw = (searchInput?.value || '').toLowerCase().trim();
    if (kw) items = items.filter(i => (i.name || '').toLowerCase().includes(kw) || (i.category || '').toLowerCase().includes(kw));

    if (allItemsTopFilter === 'held') items = items.filter(isHeld);
    else if (allItemsTopFilter === 'expiring') items = items.filter(isExpiringSoon);
    else if (allItemsTopFilter === 'warranty') items = items.filter(isWarrantyExpiringSoon);

    if (allItemsFilter === 'expired') {
        items = items.filter(i => { const d = getDaysRemaining(i.expiryDate); return d !== null && d < 0; });
    } else if (allItemsFilter === 'warranty-expired') {
        items = items.filter(i => { const d = getDaysRemaining(i.warrantyDate); return d !== null && d < 0; });
    } else if (allItemsFilter === 'held') {
        items = items.filter(i => getItemStatus(i) === '持有中');
    } else if (allItemsFilter === 'paused') {
        items = items.filter(i => getItemStatus(i) === '暂离中');
    } else if (allItemsFilter === 'removed') {
        items = items.filter(i => getItemStatus(i) === '已移除');
    }

    if (allItemsCategory) items = items.filter(i => i.category === allItemsCategory);

        items.sort((a, b) => {
        let r = 0;
        if (allItemsSort === 'purchase-desc') {
            r = (b.purchaseDate || '').localeCompare(a.purchaseDate || '');
        } else if (allItemsSort === 'price') {
            r = (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        } else if (allItemsSort === 'name') {
            r = (a.name || '').localeCompare(b.name || '');
        } else if (allItemsSort === 'expiry') {
            const dA = getDaysRemaining(a.expiryDate); const dB = getDaysRemaining(b.expiryDate);
            r = (dA === null ? 99999 : dA) - (dB === null ? 99999 : dB);
        } else {
            r = b.id - a.id;
        }
        return allItemsSortDir === 'asc' ? -r : r;
    });

    container.className = allItemsView === 'tile' ? 'items-list-tile' : 'items-list-list';

    if (items.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;margin-top:50px;">暂无匹配的物品</p>';
        return;
    }
    container.innerHTML = '';
    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4=';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = allItemsView === 'tile' ? 'item-tile' : 'item-card-new';
        div.setAttribute('onclick', `editItem(${item.id})`);

        const imgSrc = item.image || placeholder;
        const status = getItemStatus(item);
        let statusClass = 'status-held';
        if (status === '暂离中') statusClass = 'status-paused';
        else if (status === '已移除') statusClass = 'status-removed';
        const acquire = getItemAcquire(item);

        const dExp = getDaysRemaining(item.expiryDate);
        const dWar = getDaysRemaining(item.warrantyDate);
        let expBadge = '';
        if (dExp !== null) {
            const danger = dExp <= 60;
            expBadge = dExp >= 0
                ? `<span class="mini-badge ${danger?'mini-danger':''}">还有${dExp}天过期</span>`
                : `<span class="mini-badge mini-danger">已过期${Math.abs(dExp)}天</span>`;
        }
        let warBadge = '';
        if (dWar !== null) {
            const danger = dWar <= 180;
            warBadge = dWar >= 0
                ? `<span class="mini-badge ${danger?'mini-danger':''}">还有${dWar}天过保</span>`
                : `<span class="mini-badge mini-danger">已过保${Math.abs(dWar)}天</span>`;
        }

        if (allItemsView === 'tile') {
            div.innerHTML = `
                <img src="${imgSrc}" class="tile-img">
                <div class="tile-name">${item.name}</div>
                <div class="tile-tags">
                    <span class="mini-tag category">${item.category}</span>
                    <span class="mini-tag ${statusClass}">${status}</span>
                </div>
                <div class="tile-price">¥${item.price || 0}</div>
                <div class="tile-badges">${expBadge}${warBadge}</div>
            `;
        } else {
            div.innerHTML = `
                <img src="${imgSrc}" class="item-img-new">
                <div class="item-info-new">
                    <div class="item-name-new">${item.name} <span class="item-qty-new">x${item.quantity}</span></div>
                    <div class="item-tag-row">
                        <span class="mini-tag category">${item.category}</span>
                        <span class="mini-tag ${statusClass}">${status}</span>
                        <span class="mini-tag acquire">${acquire}</span>
                        <span class="mini-tag price">¥${item.price || 0}</span>
                    </div>
                    <div class="item-badge-row">${expBadge}${warBadge}</div>
                </div>
            `;
        }
        container.appendChild(div);
    });
}

function editItem(id) {
    const item = getItems().find(i => i.id === id);
    if (!item) return;
    editingItemId = id;
    document.getElementById('item-edit-title').textContent = '编辑物品';
    document.getElementById('item-submit-text').textContent = '保存修改';

    document.getElementById('item-name').value = item.name || '';
    document.getElementById('item-price').value = item.price || '';
    document.getElementById('item-quantity').value = item.quantity || 1;
    document.getElementById('purchase-date').value = item.purchaseDate || '';
    document.getElementById('expiry-date').value = item.expiryDate || '';
    document.getElementById('warranty-date').value = item.warrantyDate || '';
    document.getElementById('item-remark').value = item.remark || '';

    // 图片兼容：优先用 images 数组，旧数据用单张 image
    if (item.images && Array.isArray(item.images)) {
        editingItemImages = [item.images[0] || '', item.images[1] || '', item.images[2] || ''];
    } else if (item.image) {
        editingItemImages = [item.image, '', ''];
    } else {
        editingItemImages = ['', '', ''];
    }
    for (let i = 0; i < 3; i++) {
        const input = document.getElementById('item-image-' + i);
        if (input) input.value = '';
    }
    renderAllImageSlots();

    selectedCategoryName = item.category || '';
    renderCategoryGrid();
    updateDateFieldsVisibility();

    selectedAcquire = item.acquireMethod || '网购';
    renderAcquireGrid();

    selectedItemStatus = item.status || '持有中';
    document.querySelectorAll('#page-add .chip[data-status]').forEach(c => {
        c.classList.toggle('active', c.dataset.status === selectedItemStatus);
    });

    switchPage('page-add');
}

// ================= 物品分布图 =================
function initItemChart() {
    const itemEl = document.getElementById('item-chart-container');
    if (!itemEl) return;
    if (myChart) myChart.dispose();
    myChart = echarts.init(itemEl);
    const cc = {};
    getItems().forEach(i => cc[i.category] = (cc[i.category] || 0) + 1);
    const data = Object.keys(cc).map(k => ({ name: k, value: cc[k] }));
    myChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 12, icon: 'circle', textStyle: { fontSize: 11 } },
        color: ['#d98880', '#85c1e9', '#82c8a0', '#f7dc6f', '#bb8fce', '#f5b041', '#f5b7b1', '#aed6f1'],
        series: [{ name: '物品分布', type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: data.length > 0 ? data : [{ value: 0, name: '暂无数据', itemStyle: { color: '#eee' } }] }]
    });
}

// ================= 随礼分布图 =================
function initGiftChart() {
    const giftEl = document.getElementById('gift-chart-container');
    if (!giftEl) return;
    if (myGiftChart) myGiftChart.dispose();
    myGiftChart = echarts.init(giftEl);
    const cc = {};
    getGiftRecords().forEach(r => r.events.forEach(e => cc[e.event] = (cc[e.event] || 0) + e.amount));
    const data = Object.keys(cc).map(k => ({ name: k, value: cc[k] }));
    myGiftChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: ¥{c}' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 12, icon: 'circle', textStyle: { fontSize: 11 } },
        color: ['#f5b7b1', '#f7dc6f', '#82c8a0', '#85c1e9', '#bb8fce', '#f5b041', '#d98880', '#aed6f1'],
        series: [{ name: '随礼分布', type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: data.length > 0 ? data : [{ value: 0, name: '暂无数据', itemStyle: { color: '#eee' } }] }]
    });
}

// ================= 随礼 =================
function getGiftRecords() { return JSON.parse(localStorage.getItem('myGiftRecords')) || []; }

function saveGiftPerson() {
    const person = document.getElementById('gift-person').value.trim();
    const event = document.getElementById('gift-event').value.trim();
    const amount = document.getElementById('gift-amount').value;
    const date = document.getElementById('gift-date').value;
    const location = document.getElementById('gift-location').value.trim();
    const remark = document.getElementById('gift-remark').value.trim();
    if (!person || !event || !amount) { alert('请填写随礼人、事件和金额！'); return; }

    const photos = giftPhotos.filter(x => x);
    let records = getGiftRecords();
    let existing = records.find(r => r.person === person);
    const newEvent = { id: Date.now(), event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || '' };
    if (existing) existing.events.push(newEvent);
    else records.push({ id: Date.now(), person, events: [newEvent] });
    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    alert('保存成功！');

    // 重置
    ['gift-person','gift-event','gift-date','gift-location','gift-remark'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('gift-amount').value = '';
    document.getElementById('gift-amount').style.display = 'none';
    document.querySelectorAll('#page-add-gift .chip').forEach(c => c.classList.remove('active'));
    giftPhotos = ['', '', ''];
    for (let i = 0; i < 3; i++) {
        const inp = document.getElementById('gift-image-' + i);
        if (inp) inp.value = '';
        renderGiftPhotoSlot(i);
    }
    switchPage('page-gift-record');
}

// ================= 随礼列表 =================
function updateGiftStats() {
    const records = getGiftRecords();
    let giftCount = 0, giftAmount = 0, receiveCount = 0, receiveAmount = 0;
    records.forEach(r => {
        r.events.forEach(e => {
            const t = e.type || '随礼';
            if (t === '收礼') { receiveCount++; receiveAmount += (e.amount || 0); }
            else { giftCount++; giftAmount += (e.amount || 0); }
        });
    });
    const gn = document.getElementById('stat-gift-num');
    const ga = document.getElementById('stat-gift-amount');
    const rn = document.getElementById('stat-receive-num');
    const ra = document.getElementById('stat-receive-amount');
    if (gn) gn.textContent = giftCount;
    if (ga) ga.textContent = '¥' + giftAmount;
    if (rn) rn.textContent = receiveCount;
    if (ra) ra.textContent = '¥' + receiveAmount;
}

function updateGiftCategoryOptions() {
    const select = document.getElementById('gift-filter-category');
    if (!select) return;
    const current = select.value;
    while (select.options.length > 1) select.remove(1);
    const records = getGiftRecords();
    const categories = new Set();
    records.forEach(r => r.events.forEach(e => categories.add(e.event)));
    Array.from(categories).sort().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
    select.value = current;
}

function selectGiftTopCard(type) {
    giftTopFilter = (giftTopFilter === type) ? '' : type;
    const g = document.getElementById('stat-gift-card');
    const r = document.getElementById('stat-receive-card');
    if (g) g.classList.toggle('active', giftTopFilter === 'gift');
    if (r) r.classList.toggle('active', giftTopFilter === 'receive');
    renderGiftList();
}

function setGiftCategory(v) { giftCategoryFilter = v; renderGiftList(); }
function setGiftSort(v) { giftSort = v; renderGiftList(); }

function toggleGiftSortDir() {
    giftSortDir = giftSortDir === 'desc' ? 'asc' : 'desc';
    const btn = document.getElementById('gift-sort-dir-btn');
    if (giftSortDir === 'desc') {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
    }
    renderGiftList();
}

function toggleGiftViewMode() {
    giftView = giftView === 'list' ? 'tile' : 'list';
    const btn = document.getElementById('gift-view-toggle-btn');
    if (giftView === 'list') {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    }
    renderGiftList();
}

function toggleGiftSearchBar() {
    const w = document.getElementById('gift-search-bar-wrapper');
    w.style.display = w.style.display === 'none' ? 'block' : 'none';
    if (w.style.display === 'block') document.getElementById('gift-search-input').focus();
}

function renderGiftList() {
    updateGiftStats();
    updateGiftCategoryOptions();

    const records = getGiftRecords();
    const container = document.getElementById('gift-list');
    if (!container) return;

    // 搜索关键词
    const searchInput = document.getElementById('gift-search-input');
    const kw = (searchInput?.value || '').toLowerCase().trim();

    // 每个人只保留符合条件的事件
    let processed = records.map(r => {
        // 人名匹配
        const personMatch = !kw || (r.person || '').toLowerCase().includes(kw);
        let events = r.events.slice();

        // 事件名或备注匹配
        if (kw) {
            events = events.filter(e =>
                (e.event || '').toLowerCase().includes(kw) ||
                (e.remark || '').toLowerCase().includes(kw) ||
                (e.location || '').toLowerCase().includes(kw)
            );
        }
        if (giftTopFilter === 'gift') events = events.filter(e => (e.type || '随礼') === '随礼');
        else if (giftTopFilter === 'receive') events = events.filter(e => e.type === '收礼');
        if (giftCategoryFilter) events = events.filter(e => e.event === giftCategoryFilter);

        // 如果人名匹配，即使事件没匹配也显示
        if (personMatch && kw && events.length === 0) {
            events = r.events.filter(e => {
                if (giftTopFilter === 'gift' && (e.type || '随礼') !== '随礼') return false;
                if (giftTopFilter === 'receive' && e.type !== '收礼') return false;
                if (giftCategoryFilter && e.event !== giftCategoryFilter) return false;
                return true;
            });
        }
        return { ...r, filteredEvents: events, personMatch };
    }).filter(r => r.filteredEvents.length > 0 || r.personMatch && kw);

    // 排序
    processed.sort((a, b) => {
        let r = 0;
        if (giftSort === 'amount') {
            const sa = a.filteredEvents.reduce((s, e) => s + (e.amount || 0), 0);
            const sb = b.filteredEvents.reduce((s, e) => s + (e.amount || 0), 0);
            r = sb - sa;
        } else if (giftSort === 'name') {
            r = (a.person || '').localeCompare(b.person || '');
        } else if (giftSort === 'date') {
            const ta = Math.max(...a.filteredEvents.map(e => new Date(e.date || 0).getTime()));
            const tb = Math.max(...b.filteredEvents.map(e => new Date(e.date || 0).getTime()));
            r = tb - ta;
        } else {
            r = b.id - a.id;
        }
        return giftSortDir === 'asc' ? -r : r;
    });

    container.className = giftView === 'tile' ? 'items-list-tile' : 'items-list-list';

    if (processed.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;margin-top:50px;">暂无匹配的记录</p>';
        return;
    }
    container.innerHTML = '';

    const giftColors    = ['#fadbd8', '#f5b7b1', '#f1948a', '#e6b0aa'];
    const receiveColors = ['#d5f4e6', '#a9dfbf', '#7dcea0', '#a2d9ce'];

    processed.forEach(record => {
        const total = record.filteredEvents.reduce((s, e) => s + (e.amount || 0), 0);
        const firstChar = (record.person || '?').charAt(0);
        const count = record.filteredEvents.length;

        // 事件标签
        let tagsHtml = '';
        let redIdx = 0, greenIdx = 0;
        record.filteredEvents.slice(0, 6).forEach(ev => {
            let bg;
            if (ev.type === '收礼') { bg = receiveColors[greenIdx % receiveColors.length]; greenIdx++; }
            else { bg = giftColors[redIdx % giftColors.length]; redIdx++; }
            tagsHtml += `<span class="mini-tag" style="background:${bg};color:#333;">${ev.event} ¥${ev.amount}</span>`;
        });
        if (record.filteredEvents.length > 6) {
            tagsHtml += `<span class="mini-tag" style="background:#eee;color:#888;">+${record.filteredEvents.length - 6}</span>`;
        }

        const div = document.createElement('div');
        div.setAttribute('onclick', `showGiftDetail(${record.id})`);

        if (giftView === 'tile') {
            div.className = 'item-tile';
            div.innerHTML = `
                <div class="gift-avatar-tile">${firstChar}</div>
                <div class="tile-name">${record.person}</div>
                <div class="tile-tags">${tagsHtml}</div>
                <div class="tile-price">¥${total}</div>
            `;
        } else {
            div.className = 'item-card-new';
            div.innerHTML = `
                <div class="gift-avatar">${firstChar}</div>
                <div class="item-info-new">
                    <div class="item-name-new">${record.person} <span class="item-qty-new">${count} 笔</span></div>
                    <div class="item-tag-row">${tagsHtml}</div>
                </div>
                <div class="gift-total-new">¥${total}</div>
            `;
        }
        container.appendChild(div);
    });
}

function showGiftDetail(personId) {
    currentGiftPersonId = personId;
    const record = getGiftRecords().find(r => r.id === personId);
    if (!record) return;
    document.getElementById('detail-person-name').innerText = record.person;
    renderGiftEventList();
    switchPage('page-gift-detail');
}

function renderGiftEventList() {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId);
    const container = document.getElementById('gift-event-list');
    if (!record || !container) return;
    container.innerHTML = '';
    [...record.events].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(ev => {
        const div = document.createElement('div');
                div.className = 'event-card';
        const bgColor = ev.type === '收礼' ? '#d5f4e6' : '#fadbd8';
        const borderColor = ev.type === '收礼' ? '#82c8a0' : '#d98880';
        div.style.background = bgColor;
        div.style.borderLeftColor = borderColor;
        div.style.cursor = 'pointer';
        div.setAttribute('onclick', `showEventDetail(${ev.id})`);
        div.innerHTML = `
            <div class="event-header">${ev.event} <span style="font-size:12px;color:#666;">(${ev.type || '随礼'})</span></div>
            <div class="event-info">💰 礼金：¥${ev.amount}</div>
            <div class="event-info">📅 时间：${ev.date || '未记录'}</div>
            <div class="event-info">📍 地点：${ev.location || '未记录'}</div>
        `;
        container.appendChild(div);
    });
}

// 显示事件详情
function showEventDetail(eventId) {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId);
    if (!record) return;
    const ev = record.events.find(e => e.id === eventId);
    if (!ev) return;
    currentEventId = eventId;

    const bgColor = ev.type === '收礼' ? '#d5f4e6' : '#fadbd8';
    const borderColor = ev.type === '收礼' ? '#82c8a0' : '#d98880';

    document.getElementById('event-detail-content').innerHTML = `
        <div class="event-card" style="background:${bgColor}; border-left-color:${borderColor};">
            <div class="event-header">${ev.event} <span style="font-size:12px;color:#666;">(${ev.type || '随礼'})</span></div>
            <div class="event-info">👤 随礼人：${record.person}</div>
            <div class="event-info">💰 礼金：¥${ev.amount}</div>
            <div class="event-info">📅 时间：${ev.date || '未记录'}</div>
            <div class="event-info">📍 地点：${ev.location || '未记录'}</div>
        </div>
    `;
    switchPage('page-event-detail');
}

// 编辑事件（把数据填到增加事件页）
function editGiftEvent() {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId);
    if (!record) return;
    const ev = record.events.find(e => e.id === currentEventId);
    if (!ev) return;

    editingEventId = ev.id;
    document.getElementById('event-name').value = ev.event || '';
    document.getElementById('event-amount').value = ev.amount || '';
    document.getElementById('event-date').value = ev.date || '';
    document.getElementById('event-location').value = ev.location || '';

    // 选中类型
    selectedGiftType = ev.type || '随礼';
    document.querySelectorAll('#page-add-event .chip[data-gift-type]').forEach(c => {
        c.classList.toggle('active', c.dataset.giftType === selectedGiftType);
    });

    // 选中事件分类（如果匹配）
    document.querySelectorAll('#page-add-event .chip[data-type]').forEach(c => {
        c.classList.toggle('active', c.dataset.type === ev.event);
    });

    switchPage('page-add-event');
}


function showAddEventPage() {
    editingEventId = null;
    selectedGiftType = '随礼';
    ['event-name','event-amount','event-date','event-location'].forEach(id => document.getElementById(id).value = '');
    document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.remove('active'));
    switchPage('page-add-event');
}

function saveGiftEvent() {
    const event = document.getElementById('event-name').value.trim();
    const amount = document.getElementById('event-amount').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value.trim();
    const remark = document.getElementById('event-remark').value.trim();
    if (!event || !amount) { alert('请填写事件和金额！'); return; }

    let records = getGiftRecords();
    const record = records.find(r => r.id === currentGiftPersonId);
    if (!record) return;

    const photos = eventPhotos.filter(x => x);

    if (editingEventId) {
        const idx = record.events.findIndex(e => e.id === editingEventId);
        if (idx !== -1) {
            record.events[idx] = { ...record.events[idx], event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || record.events[idx].image };
        }
        alert('修改成功！');
        editingEventId = null;
    } else {
        record.events.push({ id: Date.now(), event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || '' });
        alert('事件添加成功！');
    }

    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    // 重置
    eventPhotos = ['', '', ''];
    for (let i = 0; i < 3; i++) {
        const inp = document.getElementById('event-image-' + i);
        if (inp) inp.value = '';
        renderEventPhotoSlot(i);
    }
    renderGiftEventList();
    switchPage('page-gift-detail');
}

// ================= 重要日期 =================
function getImportantDates() { return JSON.parse(localStorage.getItem('myImportantDates')) || []; }

function selectLevel(level) {
    selectedImportantLevel = level;
    document.querySelectorAll('.level-btn').forEach(b => b.classList.toggle('active', b.dataset.level === level));
}

function saveImportantDate() {
    const person = document.getElementById('important-person').value.trim();
    const date = document.getElementById('important-date').value;
    const event = document.getElementById('important-event').value.trim();
    if (!date || !event) { alert('请填写日期和事件！'); return; }
    let dates = getImportantDates();
    if (editingImportantId) {
        const idx = dates.findIndex(d => d.id === editingImportantId);
        if (idx !== -1) dates[idx] = { ...dates[idx], person, date, event, level: selectedImportantLevel };
        alert('修改成功！');
    } else {
        dates.push({ id: Date.now(), person, date, event, level: selectedImportantLevel });
        alert('保存成功！');
    }
    localStorage.setItem('myImportantDates', JSON.stringify(dates));
    editingImportantId = null;
    document.getElementById('important-person').value = '';
    document.getElementById('important-date').value = '';
    document.getElementById('important-event').value = '';
    selectLevel('提醒');
    switchPage('page-important-dates');
}

function showImportantDetail(id) {
    const item = getImportantDates().find(d => d.id === id);
    if (!item) return;
    currentImportantDetailId = id;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.ceil((new Date(item.date) - today) / (1000 * 60 * 60 * 24));
    let dayText = days === 0 ? '今天' : (days > 0 ? `${days}天后` : `已过去${Math.abs(days)}天`);
    document.getElementById('important-detail-content').innerHTML = `
        <div class="important-card level-${item.level}">
            <div class="important-card-header">
                <span class="important-card-name">${item.person ? `[${item.person}] ` : ''}${item.event}</span>
                <span class="important-card-level">${item.level}</span>
            </div>
            <div class="important-card-date" style="margin-top:10px;">📅 日期：${item.date} (${dayText})</div>
        </div>`;
    switchPage('page-important-detail');
}

function editImportantDate() {
    const item = getImportantDates().find(d => d.id === currentImportantDetailId);
    if (!item) return;
    editingImportantId = item.id;
    document.getElementById('important-person').value = item.person || '';
    document.getElementById('important-date').value = item.date;
    document.getElementById('important-event').value = item.event;
    selectLevel(item.level);
    switchPage('page-add-important');
}

function renderUpcomingDates() {
    const section = document.getElementById('upcoming-dates-section');
    if (!section) return;
    const dates = getImportantDates();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = dates.map(d => {
        const days = Math.ceil((new Date(d.date) - today) / (1000 * 60 * 60 * 24));
        return { ...d, days };
    }).filter(d => d.days >= 0 && d.days <= 30).sort((a, b) => a.days - b.days);
    if (upcoming.length === 0) { section.innerHTML = ''; return; }
    let html = '<div class="card"><h3 style="margin-bottom:12px;">马上要发生 👇</h3>';
    upcoming.forEach(d => {
        html += `<div class="upcoming-card" onclick="showImportantDetail(${d.id})">
            <div class="upcoming-info">
                <div class="upcoming-event">${d.person ? `[${d.person}] ` : ''}${d.event}</div>
                <div class="upcoming-date">${d.date} · ${d.level}</div>
            </div>
            <div class="upcoming-days">${d.days}<small>天后</small></div>
        </div>`;
    });
    html += '</div>';
    section.innerHTML = html;
}

// ========== 日历渲染 ==========
function changeMonth(delta) {
    calMonth += delta;
    if (calMonth < 1) { calMonth = 12; calYear--; }
    else if (calMonth > 12) { calMonth = 1; calYear++; }
    document.getElementById('important-detail-card').style.display = 'none';
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('calendar-month-title');
    title.innerText = `${calYear}年${calMonth}月`;
    const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const kw = importantSearchKeyword.toLowerCase();
    let dates = getImportantDates();
    if (kw) dates = dates.filter(d => d.event.toLowerCase().includes(kw));
    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<div class="cal-cell empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const holiday = nationalHolidays[`${String(calMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`];
        const dayOfWeek = (firstDay + d - 1) % 7;
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        let lunarText = '', jieQiText = '';
        try {
            if (typeof Lunar !== 'undefined') {
                const lunar = Lunar.fromDate(new Date(calYear, calMonth - 1, d));
                jieQiText = lunar.getJieQi() || '';
                lunarText = lunar.getDayInChinese();
            }
        } catch (e) {}
        const dayEvents = dates.filter(dt => dt.date === dateStr);
        let eventsHtml = '';
        dayEvents.slice(0, 2).forEach(ev => {
            let bgColor = '#f9d5cf';
            if (ev.level === '重要') bgColor = '#e8a49b';
            else if (ev.level === '纪念') bgColor = '#c96a5a';
            eventsHtml += `<div class="cal-event-rect" style="background:${bgColor}">${ev.event}</div>`;
        });
                html += `<div class="cal-cell ${dayEvents.length > 0 ? 'has-event' : ''}" data-date="${dateStr}" onclick="selectCalDay('${dateStr}')">
            <span class="cal-day">${d}</span>
            ${jieQiText ? `<span class="cal-holiday">${jieQiText}</span>` : (lunarText ? `<span class="cal-lunar">${lunarText}</span>` : '')}
            ${holiday ? `<span class="cal-holiday">${holiday}</span>` : ''}
            ${isWeekend ? `<span class="cal-holiday" style="color:#f5b041;">休</span>` : ''}
            ${eventsHtml ? `<div class="cal-events">${eventsHtml}</div>` : ''}
        </div>`;
    }
        grid.innerHTML = html;

    // 绑定长按事件（弹出日记面板）
    document.querySelectorAll('#calendar-grid .cal-cell:not(.empty)').forEach(cell => {
        const dateStr = cell.dataset.date;
        if (!dateStr) return;
        let fired = false;
        const startPress = () => {
            fired = false;
            longPressTimer = setTimeout(() => {
                fired = true;
                isLongPress = true;
                if (navigator.vibrate) navigator.vibrate(30);
                openDiaryPanel(dateStr);
            }, 600);
        };
        const cancelPress = () => clearTimeout(longPressTimer);

        cell.addEventListener('touchstart', startPress, { passive: true });
        cell.addEventListener('touchend', cancelPress);
        cell.addEventListener('touchmove', cancelPress);
        cell.addEventListener('touchcancel', cancelPress);
        cell.addEventListener('mousedown', startPress);
        cell.addEventListener('mouseup', cancelPress);
        cell.addEventListener('mouseleave', cancelPress);
    });
}

function selectCalDay(dateStr) {
    if (isLongPress) { isLongPress = false; return; }
    const detail = document.getElementById('important-detail-card');
    const dates = getImportantDates().filter(d => d.date === dateStr);
    const diaries = getDiaries().filter(d => d.date === dateStr);

    if (dates.length === 0 && diaries.length === 0) { detail.style.display = 'none'; return; }

    let html = '';
    if (dates.length > 0) {
        html += '<div class="cal-detail-section">📌 重要事件</div>';
        dates.forEach(d => {
            html += `<div class="important-card level-${d.level}" onclick="showImportantDetail(${d.id})">
                <div class="important-card-header">
                    <span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${d.event}</span>
                    <span class="important-card-level">${d.level}</span>
                </div>
                <div class="important-card-date">${d.date}</div>
            </div>`;
        });
    }
    if (diaries.length > 0) {
        html += '<div class="cal-detail-section">📔 日记 / 便签</div>';
        diaries.sort((a, b) => b.createdAt - a.createdAt);
        diaries.forEach(d => {
            const icon = d.type === '日记' ? '📔' : '📝';
            const time = new Date(d.createdAt);
            const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
            html += `<div class="diary-card" onclick="editDiary(${d.id})">
                <div class="diary-card-header">
                    <span class="diary-card-type">${icon} ${d.type}</span>
                    <span class="diary-card-time">${timeStr}</span>
                </div>
                ${d.title ? `<div class="diary-card-title">${d.title}</div>` : ''}
                <div class="diary-card-content">${(d.content || '').replace(/</g,'&lt;')}</div>
            </div>`;
        });
    }
    detail.innerHTML = html;
    detail.style.display = 'block';
}

function backToCalendar() {
    document.getElementById('calendar-view').style.display = 'block';
    document.getElementById('important-list-view').style.display = 'none';
    document.getElementById('important-detail-card').style.display = 'none';
    importantViewMode = 'calendar';
    renderCalendar();
}

function toggleImportantSearch() {
    const bar = document.getElementById('important-search-bar');
    bar.style.display = bar.style.display === 'none' ? 'block' : 'none';
    if (bar.style.display === 'none') { importantSearchKeyword = ''; document.getElementById('important-search-input').value = ''; }
    else document.getElementById('important-search-input').focus();
}
function toggleImportantMenu() {
    const m = document.getElementById('important-menu');
    m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
function setImportantFilter(f) { importantFilter = f; updateImportantMenuButtons(); showImportantListView(); }
function setImportantTransition(t) { importantTransition = t; updateImportantMenuButtons(); showImportantListView(); }
function updateImportantMenuButtons() {
    document.querySelectorAll('#important-menu .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.importantFilter && btn.dataset.importantFilter === importantFilter) btn.classList.add('active');
        if (btn.dataset.importantTransition && btn.dataset.importantTransition === importantTransition) btn.classList.add('active');
    });
}
function showImportantListView() {
    document.getElementById('important-menu').style.display = 'none';
    document.getElementById('calendar-view').style.display = 'none';
    document.getElementById('important-list-view').style.display = 'block';
    importantViewMode = 'list';
    renderImportantList();
}

function renderImportantList() {
    let dates = getImportantDates();
    const kw = document.getElementById('important-list-search').value.toLowerCase().trim();
    const container = document.getElementById('important-list-items');
    if (kw) dates = dates.filter(d => d.event.toLowerCase().includes(kw));
    if (importantFilter !== 'all') dates = dates.filter(d => d.level === importantFilter);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (importantTransition === 'ended') dates = dates.filter(d => new Date(d.date) < today);
    else if (importantTransition === 'ongoing') dates = dates.filter(d => new Date(d.date) >= today);
    dates.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (dates.length === 0) { container.innerHTML = '<p style="color:#999;text-align:center;margin-top:50px;">暂无匹配的重要日期</p>'; return; }
    container.innerHTML = '';
    dates.forEach(d => {
        const days = Math.ceil((new Date(d.date) - today) / (1000 * 60 * 60 * 24));
        let dayText = days === 0 ? '今天' : (days > 0 ? `${days}天后` : `已过去${Math.abs(days)}天`);
        const div = document.createElement('div');
        div.className = `important-card level-${d.level}`;
        div.setAttribute('onclick', `showImportantDetail(${d.id})`);
        div.innerHTML = `<div class="important-card-header"><span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${d.event}</span><span class="important-card-level">${d.level}</span></div><div class="important-card-date">${d.date} · ${dayText}</div>`;
        container.appendChild(div);
    });
}

// ================= 日期选择器 =================
function openDatePicker(inputId) {
    currentInputId = inputId;
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
        title.innerText = '1. 选择年份';
        const y = new Date().getFullYear();
        for (let i = y - 10; i <= y + 10; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = i + '年';
            d.onclick = () => { selectedYear = i; pickerStep = 'month'; renderPickerBody(); }; body.appendChild(d);
        }
    } else if (pickerStep === 'month') {
        title.innerText = selectedYear + '年 2. 选择月份';
        for (let i = 1; i <= 12; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = i + '月';
            d.onclick = () => { selectedMonth = i; pickerStep = 'day'; renderPickerBody(); }; body.appendChild(d);
        }
    } else if (pickerStep === 'day') {
        title.innerText = selectedYear + '年' + selectedMonth + '月 3. 选择日期';
        const days = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let i = 1; i <= days; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = i + '日';
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

// ================= 看书进度 =================
function getBooks() {
    return JSON.parse(localStorage.getItem('myBooks')) || [];
}

function saveBook(book) {
    let books = getBooks();
    const idx = books.findIndex(b => b.id === book.id);
    if (idx !== -1) books[idx] = book;
    else books.push(book);
    localStorage.setItem('myBooks', JSON.stringify(books));
    renderBookProgress();
}

function renderBookProgress() {
    const container = document.getElementById('book-progress-section');
    if (!container) return;

    const books = getBooks();
    if (books.length === 0) {
        container.innerHTML = `
            <div class="card" onclick="showBookDetail()" style="cursor:pointer;">
                <h3 style="margin-bottom:10px;">今天看书了嘛~ 📖</h3>
                <p style="color:#999; font-size:14px;">点击添加一本正在读的书</p>
            </div>`;
        return;
    }

    // 默认显示最新一本
    const book = books[books.length - 1];
    const total = book.totalPages || 1;
    const current = book.currentPages || 0;
    const percent = Math.min(100, Math.round((current / total) * 100));
    const estimated = parseFloat(book.estimatedHours) || 0;
    const spent = parseFloat(book.spentHours) || 0;
    const remaining = Math.max(0, estimated - spent).toFixed(1);

    container.innerHTML = `
        <div class="card" onclick="showBookDetail(${book.id})" style="cursor:pointer;">
            <h3 style="margin-bottom:10px;">今天看书了嘛~ 📖</h3>
            <div style="display:flex; justify-content:space-between; font-size:13px; color:#666; margin-bottom:6px;">
                <span>${book.name}</span>
                <span>已用 ${spent} 天 / 计划剩余 ${remaining} 天</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width:${percent}%"></div>
                <div class="progress-icon" style="left:${percent}%">📖</div>
            </div>
            <div style="text-align:right; font-size:12px; color:#999; margin-top:4px;">${current}/${total}页 (${percent}%)</div>
        </div>`;
}

function showBookDetail(id) {
    const books = getBooks();
    let book = null;
    if (id) book = books.find(b => b.id === id);
    if (!book) {
        // 新建
        book = { id: Date.now(), name: '', startDate: '', totalPages: 0, currentPages: 0, estimatedHours: 0, spentHours: 0 };
    }
    // 填充到表单（需要新增一个页面或弹窗）
    document.getElementById('book-name').value = book.name || '';
    document.getElementById('book-start-date').value = book.startDate || '';
    document.getElementById('book-total-pages').value = book.totalPages || '';
    document.getElementById('book-current-pages').value = book.currentPages || '';
    document.getElementById('book-estimated-hours').value = book.estimatedHours || '';
    document.getElementById('book-spent-hours').value = book.spentHours || '';
    // 存储当前编辑的 ID
    document.getElementById('book-detail').dataset.bookId = book.id;
    switchPage('page-book-detail');
}

function saveBookDetail() {
    const id = parseInt(document.getElementById('book-detail').dataset.bookId);
    const book = {
        id: id || Date.now(),
        name: document.getElementById('book-name').value.trim(),
        startDate: document.getElementById('book-start-date').value,
        totalPages: parseInt(document.getElementById('book-total-pages').value) || 0,
        currentPages: parseInt(document.getElementById('book-current-pages').value) || 0,
        estimatedHours: parseFloat(document.getElementById('book-estimated-hours').value) || 0,
        spentHours: parseFloat(document.getElementById('book-spent-hours').value) || 0
    };
    if (!book.name) { alert('请填写书名'); return; }
    saveBook(book);
    alert('保存成功！');
    switchPage('page-home');
}
// ================= 图形锁 =================
function openPatternLock() {
    const l = getLockSettings();
    if (l.type === 'pattern') {
        // 已有图形锁 → 验证模式（先允许取消）
        if (!confirm('已经设置了图形锁，是否重新设置？\n点“取消”则保持不变')) return;
    }
    patternMode = 'set';
    patternFirstAttempt = null;
    document.getElementById('pattern-title').innerText = '绘制解锁图案';
    document.getElementById('pattern-hint').innerText = '请连接至少 4 个点';
    document.getElementById('pattern-lock-modal').style.display = 'flex';
    initPatternCanvas();
}

function closePatternLock() {
    document.getElementById('pattern-lock-modal').style.display = 'none';
    patternDrawing = false;
    patternSelected = [];
}

function initPatternCanvas() {
    const canvas = document.getElementById('pattern-canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    const cellSize = size / 3;

    // 记录 9 个点的中心坐标
    patternPoints = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            patternPoints.push({
                x: cellSize * c + cellSize / 2,
                y: cellSize * r + cellSize / 2,
                index: r * 3 + c
            });
        }
    }

    patternSelected = [];
    drawPattern();

    // 移除旧监听，避免重复绑定
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
    canvas.ontouchstart = null;
    canvas.ontouchmove = null;
    canvas.ontouchend = null;

    // 鼠标事件
    canvas.onmousedown = (e) => { patternDrawing = true; handlePatternMove(e); };
    canvas.onmousemove = (e) => { if (patternDrawing) handlePatternMove(e); };
    canvas.onmouseup = () => { patternDrawing = false; finishPattern(); };

    // 触摸事件
    canvas.ontouchstart = (e) => { e.preventDefault(); patternDrawing = true; handlePatternMove(e.touches[0]); };
    canvas.ontouchmove = (e) => { e.preventDefault(); if (patternDrawing) handlePatternMove(e.touches[0]); };
    canvas.ontouchend = (e) => { e.preventDefault(); patternDrawing = false; finishPattern(); };
}

function getCanvasPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function handlePatternMove(e) {
    const canvas = document.getElementById('pattern-canvas');
    const pos = getCanvasPos(e, canvas);
    // 检测是否靠近某个点（半径 30）
    patternPoints.forEach(p => {
        if (patternSelected.includes(p.index)) return;
        const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2);
        if (dist < 30) {
            patternSelected.push(p.index);
            if (navigator.vibrate) navigator.vibrate(20);
        }
    });
    drawPattern(pos);
}

function drawPattern(currentPos) {
    const canvas = document.getElementById('pattern-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 画 9 个点
    patternPoints.forEach(p => {
        const selected = patternSelected.includes(p.index);
        ctx.beginPath();
        ctx.arc(p.x, p.y, selected ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = selected ? '#d98880' : '#bbb';
        ctx.fill();
    });

    // 画已选点之间的连线
    if (patternSelected.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#d98880';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < patternSelected.length - 1; i++) {
            const a = patternPoints[patternSelected[i]];
            const b = patternPoints[patternSelected[i + 1]];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }
        // 最后一根线连到当前手指/鼠标位置
        if (currentPos && patternDrawing) {
            const last = patternPoints[patternSelected[patternSelected.length - 1]];
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(currentPos.x, currentPos.y);
        }
        ctx.stroke();
    }
}

function resetPattern() {
    patternSelected = [];
    drawPattern();
    document.getElementById('pattern-hint').innerText = patternMode === 'set' && patternFirstAttempt ? '请再次绘制确认' : '请连接至少 4 个点';
}

function finishPattern() {
    patternDrawing = false;
    if (patternSelected.length < 4) {
        document.getElementById('pattern-hint').innerText = '⚠️ 至少连接 4 个点';
        setTimeout(resetPattern, 600);
        return;
    }

    const patternStr = patternSelected.join('-');

    if (patternMode === 'set') {
        if (!patternFirstAttempt) {
            // 第一次绘制，暂存，等待确认
            patternFirstAttempt = patternStr;
            document.getElementById('pattern-hint').innerText = '请再次绘制确认';
            setTimeout(resetPattern, 400);
        } else {
            // 第二次绘制，对比
            if (patternFirstAttempt === patternStr) {
                const l = getLockSettings();
                l.type = 'pattern';
                l.pattern = patternStr;
                localStorage.setItem('myLock', JSON.stringify(l));
                loadLockSettings();
                document.getElementById('pattern-hint').innerText = '✅ 图形锁设置成功！';
                setTimeout(() => {
                    closePatternLock();
                    alert('图形锁设置成功！');
                }, 600);
            } else {
                document.getElementById('pattern-hint').innerText = '❌ 两次不一致，请重新绘制';
                patternFirstAttempt = null;
                setTimeout(resetPattern, 800);
            }
        }
    }
}

// ================= 初始化 =================
window.addEventListener('load', () => {
    applyTheme();
    updateDashboard();
    updateFilterButtons();
    updateImportantMenuButtons();
    selectLevel('提醒');
    renderUpcomingDates();
    refreshDrawerInfo();
    applyCustomIcons();
    renderBookProgress();
    renderCategoryGrid();
    renderAcquireGrid();
    for (let i = 0; i < 3; i++) { renderGiftPhotoSlot(i); renderEventPhotoSlot(i); }
        // 所有返回箭头 ← 换成 <
    document.querySelectorAll('.back-arrow').forEach(el => {
        if (el.textContent.trim() === '←') el.textContent = '<';
    });
});

// ================= 日记/便签 =================

// 日记模板（5个）
const diaryTemplates = [
    { id: 'd1', name: '今日心情', icon: '😊', content: '【今天的心情】\n\n\n【今天发生的事】\n\n\n【最难忘的瞬间】\n\n' },
    { id: 'd2', name: '感恩日记', icon: '🙏', content: '【今天值得感恩的3件事】\n1. \n2. \n3. \n\n【我想感谢的人】\n\n' },
    { id: 'd3', name: '反思日记', icon: '🤔', content: '【今天学到了什么】\n\n\n【做得好的地方】\n\n\n【可以改进的地方】\n\n' },
    { id: 'd4', name: '旅行日记', icon: '✈️', content: '【去了哪里】\n\n【见了谁】\n\n【吃了什么】\n\n【感受】\n' },
    { id: 'd5', name: '自由记录', icon: '📖', content: '' }
];

// 便签模板（5个）
const noteTemplates = [
    { id: 'n1', name: '待办清单', icon: '✅', content: '□ \n□ \n□ \n□ \n□ ' },
    { id: 'n2', name: '购物清单', icon: '🛒', content: '□ \n□ \n□ \n□ ' },
    { id: 'n3', name: '灵感记录', icon: '💡', content: '灵感来源：\n\n具体想法：\n\n' },
    { id: 'n4', name: '提醒事项', icon: '⏰', content: '别忘了：\n\n截止时间：\n\n' },
    { id: 'n5', name: '空白便签', icon: '📝', content: '' }
];

function getDiaries() {
    return JSON.parse(localStorage.getItem('myDiaries')) || [];
}
function saveDiaries(list) {
    localStorage.setItem('myDiaries', JSON.stringify(list));
}

function openDiaryPanel(dateStr) {
    diaryPanelDate = dateStr;
    const d = new Date(dateStr);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('diary-panel-date').textContent = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    document.getElementById('diary-panel-weekday').textContent = `星期${weekdays[d.getDay()]}`;
    renderDiaryPanel(dateStr);
    document.getElementById('diary-panel').classList.add('open');
    document.getElementById('diary-panel-overlay').classList.add('open');
}

function closeDiaryPanel() {
    document.getElementById('diary-panel').classList.remove('open');
    document.getElementById('diary-panel-overlay').classList.remove('open');
    if (diaryPanelDate) selectCalDay(diaryPanelDate);
}

function renderDiaryPanel(dateStr) {
    const body = document.getElementById('diary-panel-body');
    const diaries = getDiaries().filter(d => d.date === dateStr);
    if (diaries.length === 0) {
        body.innerHTML = '<p style="text-align:center; color:#999; padding:40px 20px;">这一天还没有记录<br><br>点右上角 <b style="color:#d98880;">+</b> 添加日记或便签</p>';
        return;
    }
    body.innerHTML = '';
    diaries.sort((a, b) => b.createdAt - a.createdAt);
    diaries.forEach(d => {
        const card = document.createElement('div');
        card.className = 'diary-card';
        card.setAttribute('onclick', `editDiary(${d.id})`);
        const icon = d.type === '日记' ? '📔' : '📝';
        const time = new Date(d.createdAt);
        const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
        card.innerHTML = `
            <div class="diary-card-header">
                <span class="diary-card-type">${icon} ${d.type}</span>
                <span class="diary-card-time">${timeStr}</span>
            </div>
            ${d.title ? `<div class="diary-card-title">${d.title}</div>` : ''}
            <div class="diary-card-content">${(d.content || '').replace(/</g,'&lt;')}</div>
        `;
        body.appendChild(card);
    });
}

function showTemplateModal() {
    closeDiaryPanel();    // ← 加这一行
    currentDiaryType = '日记';
    document.getElementById('type-chip-diary').classList.add('active');
    document.getElementById('type-chip-note').classList.remove('active');
    renderTemplateGrid();
    document.getElementById('template-modal').style.display = 'flex';
}

function closeTemplateModal() {
    document.getElementById('template-modal').style.display = 'none';
}

function switchTemplateType(type) {
    currentDiaryType = type;
    document.getElementById('type-chip-diary').classList.toggle('active', type === '日记');
    document.getElementById('type-chip-note').classList.toggle('active', type === '便签');
    renderTemplateGrid();
}

function renderTemplateGrid() {
    const templates = currentDiaryType === '日记' ? diaryTemplates : noteTemplates;
    const grid = document.getElementById('template-grid');
    grid.innerHTML = '';
    templates.forEach(t => {
        const div = document.createElement('div');
        div.className = 'template-item';
        div.setAttribute('onclick', `selectTemplate('${t.id}')`);
        div.innerHTML = `<div class="template-icon">${t.icon}</div><div class="template-name">${t.name}</div>`;
        grid.appendChild(div);
    });
}

function selectTemplate(templateId) {
    const templates = currentDiaryType === '日记' ? diaryTemplates : noteTemplates;
    const t = templates.find(x => x.id === templateId);
    if (!t) return;

    editingDiaryId = null;
    currentDiaryTemplate = t.id;
    document.getElementById('diary-edit-title').textContent = currentDiaryType === '日记' ? '写日记' : '写便签';
    document.getElementById('diary-title-input').value = '';
    document.getElementById('diary-content-input').value = t.content;
    document.getElementById('diary-delete-btn').style.display = 'none';

    closeTemplateModal();
    closeDiaryPanel();
    switchPage('page-diary-edit');
}

function editDiary(id) {
    const d = getDiaries().find(x => x.id === id);
    if (!d) return;
    editingDiaryId = id;
    currentDiaryType = d.type;
    document.getElementById('diary-edit-title').textContent = d.type === '日记' ? '编辑日记' : '编辑便签';
    document.getElementById('diary-title-input').value = d.title || '';
    document.getElementById('diary-content-input').value = d.content || '';
    document.getElementById('diary-delete-btn').style.display = 'block';
    closeDiaryPanel();
    switchPage('page-diary-edit');
}

function saveDiary() {
    if (!diaryPanelDate) { alert('日期错误'); return; }
    const title = document.getElementById('diary-title-input').value.trim();
    const content = document.getElementById('diary-content-input').value;
    if (!title && !content.trim()) { alert('内容不能为空'); return; }

    let diaries = getDiaries();
    if (editingDiaryId) {
        const idx = diaries.findIndex(d => d.id === editingDiaryId);
        if (idx !== -1) diaries[idx] = { ...diaries[idx], title, content };
        alert('修改成功！');
    } else {
        diaries.push({
            id: Date.now(),
            date: diaryPanelDate,
            type: currentDiaryType,
            title,
            content,
            createdAt: Date.now()
        });
        alert('保存成功！');
    }
    saveDiaries(diaries);
    editingDiaryId = null;

    switchPage('page-important-dates');
    setTimeout(() => openDiaryPanel(diaryPanelDate), 150);
}

function cancelDiaryEdit() {
    editingDiaryId = null;
    switchPage('page-important-dates');
    setTimeout(() => { if (diaryPanelDate) openDiaryPanel(diaryPanelDate); }, 150);
}

function deleteDiary() {
    if (!editingDiaryId) return;
    if (!confirm('确定删除这条记录吗？')) return;
    let diaries = getDiaries().filter(d => d.id !== editingDiaryId);
    saveDiaries(diaries);
    editingDiaryId = null;
    switchPage('page-important-dates');
    setTimeout(() => openDiaryPanel(diaryPanelDate), 150);
}