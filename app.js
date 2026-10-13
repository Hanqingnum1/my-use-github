// ================= 全局变量 =================
let currentInputId = null;
let selectedYear = null, selectedMonth = null, selectedDay = null;
let pickerStep = 'year';
let myChart = null;
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
    } else if (pageId === 'page-all-items') {
        document.getElementById('nav-all-items').classList.add('active');
        renderItemsList();
    } else if (pageId === 'page-gift-record') {
        document.getElementById('nav-gift').classList.add('active');
        renderGiftList();
    } else if (pageId === 'page-important-dates') {
        document.getElementById('nav-important').classList.add('active');
        backToCalendar();
    } else if (['page-add', 'page-distribution', 'page-add-gift', 'page-gift-detail', 'page-add-event', 'page-add-important', 'page-important-detail', 'page-profile', 'page-theme', 'page-backup', 'page-lock', 'page-about'].includes(pageId)) {
        document.getElementById('nav-home').classList.add('active');
    }

    if (pageId === 'page-distribution') setTimeout(initChart, 100);
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
    const profile = getProfile();
    const nameEl = document.getElementById('drawer-name');
    const signEl = document.getElementById('drawer-sign');
    const avatarEl = document.getElementById('drawer-avatar');
    nameEl.textContent = profile.nickname || '未设置昵称';
    signEl.textContent = profile.sign || '点击设置个性签名';
    if (profile.avatar) {
        avatarEl.innerHTML = `<img src="${profile.avatar}">`;
    } else {
        avatarEl.innerHTML = '👤';
    }
}

// ================= 个人资料 =================
function getProfile() {
    return JSON.parse(localStorage.getItem('myProfile')) || { nickname: '', sign: '', avatar: '' };
}
function saveProfile(profile) {
    localStorage.setItem('myProfile', JSON.stringify(profile));
    refreshDrawerInfo();
}
function loadProfile() {
    const p = getProfile();
    document.getElementById('profile-nickname-display').textContent = p.nickname || '未设置昵称';
    document.getElementById('profile-sign-display').textContent = p.sign || '点击设置个性签名';
    if (p.avatar) document.getElementById('profile-avatar-img').src = p.avatar;
}
function uploadAvatar(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        compressImage(e.target.result, 300, (base64) => {
            const p = getProfile();
            p.avatar = base64;
            saveProfile(p);
            document.getElementById('profile-avatar-img').src = base64;
        });
    };
    reader.readAsDataURL(input.files[0]);
}
function editField(field) {
    const p = getProfile();
    if (field === 'nickname') {
        const val = prompt('请输入昵称：', p.nickname || '');
        if (val !== null) { p.nickname = val.trim(); saveProfile(p); loadProfile(); }
    } else if (field === 'sign') {
        const val = prompt('请输入个性签名：', p.sign || '');
        if (val !== null) { p.sign = val.trim(); saveProfile(p); loadProfile(); }
    }
}

// ================= 主题 =================
function getTheme() {
    return JSON.parse(localStorage.getItem('myTheme')) || { color: '#d98880', dark: false, wallpaper: '' };
}
function saveTheme(t) {
    localStorage.setItem('myTheme', JSON.stringify(t));
}
function applyTheme() {
    const t = getTheme();
    document.documentElement.style.setProperty('--primary', t.color);
    if (t.dark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
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
function saveSetting(key, value) {
    const t = getTheme();
    t[key] = value;
    saveTheme(t);
}
function setThemeColor(color) {
    const t = getTheme();
    t.color = color;
    saveTheme(t);
    applyTheme();
}
function toggleDarkMode(on) {
    const t = getTheme();
    t.dark = on;
    saveTheme(t);
    applyTheme();
}
function uploadWallpaper(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        compressImage(e.target.result, 800, (base64) => {
            const t = getTheme();
            t.wallpaper = base64;
            saveTheme(t);
            applyTheme();
        });
    };
    reader.readAsDataURL(input.files[0]);
}
function clearWallpaper() {
    const t = getTheme();
    t.wallpaper = '';
    saveTheme(t);
    applyTheme();
}

// ================= 数据备份 =================
function updateStorageUsage() {
    let total = 0;
    for (let k in localStorage) {
        if (localStorage.hasOwnProperty(k)) {
            total += localStorage[k].length + k.length;
        }
    }
    const kb = (total / 1024).toFixed(1);
    document.getElementById('storage-usage').textContent = kb + ' KB';
}
function exportData() {
    const data = {
        items: JSON.parse(localStorage.getItem('myItems') || '[]'),
        giftRecords: JSON.parse(localStorage.getItem('myGiftRecords') || '[]'),
        importantDates: JSON.parse(localStorage.getItem('myImportantDates') || '[]'),
        profile: getProfile(),
        theme: getTheme()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-life-backup-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
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
                alert('导入成功！');
                location.reload();
            }
        } catch (err) { alert('文件格式错误！'); }
    };
    reader.readAsText(input.files[0]);
}
function clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        localStorage.clear();
        alert('已清空，即将刷新');
        location.reload();
    }
}

// ================= 应用锁 =================
function getLockSettings() {
    return JSON.parse(localStorage.getItem('myLock')) || { type: '' };
}
function loadLockSettings() {
    const l = getLockSettings();
    document.querySelectorAll('.lock-check').forEach(el => el.classList.remove('active'));
    if (l.type) {
        const el = document.getElementById('lock-' + l.type);
        if (el) el.classList.add('active');
    }
}
function setLockType(type) {
    const l = getLockSettings();
    if (l.type === type) { l.type = ''; }
    else { l.type = type; }
    localStorage.setItem('myLock', JSON.stringify(l));
    loadLockSettings();
}

// ================= 物品 =================
function toggleWarranty() {
    const cat = document.getElementById('category').value;
    document.getElementById('warranty-box').style.display = (cat === '家电' || cat === '电子产品') ? 'block' : 'none';
}
function getItems() { return JSON.parse(localStorage.getItem('myItems')) || []; }

function saveItem() {
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('item-price').value;
    const quantity = document.getElementById('item-quantity').value || 1;
    const imageFile = document.getElementById('item-image').files[0];

    if (!name || !category) { alert('请至少填写物品名称和分类！'); return; }

    const handleSave = (imageBase64) => {
        let items = getItems();
        const purchaseDate = document.getElementById('purchase-date').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const warrantyDate = document.getElementById('warranty-date').value;

        if (editingItemId) {
            const idx = items.findIndex(i => i.id === editingItemId);
            if (idx !== -1) items[idx] = { ...items[idx], name, category, price, quantity, image: imageBase64 || items[idx].image, purchaseDate, expiryDate, warrantyDate };
            alert('修改成功！');
        } else {
            items.push({ id: Date.now(), name, category, price: price || 0, quantity, image: imageBase64, purchaseDate, expiryDate, warrantyDate });
            alert('保存成功！');
        }
        localStorage.setItem('myItems', JSON.stringify(items));
        resetForm();
        switchPage('page-all-items');
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => compressImage(e.target.result, 300, handleSave);
        reader.readAsDataURL(imageFile);
    } else handleSave('');
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
    document.getElementById('form-title').innerText = '增加物品';
    document.getElementById('save-btn').innerText = '保存物品';
    ['item-name', 'item-price', 'item-image', 'purchase-date', 'expiry-date', 'warranty-date'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('item-quantity').value = '1';
    document.getElementById('category').value = '';
    document.getElementById('warranty-box').style.display = 'none';
}

function updateDashboard() {
    const items = getItems();
    document.getElementById('total-count').innerText = items.length + ' 件';
    let totalPrice = 0;
    items.forEach(i => totalPrice += parseFloat(i.price || 0));
    document.querySelector('.hero-value').innerText = '¥ ' + totalPrice.toFixed(2);

    const records = getGiftRecords();
    let totalGift = 0;
    records.forEach(r => r.events.forEach(e => totalGift += e.amount));
    document.getElementById('total-gift-amount').innerText = '¥ ' + totalGift.toFixed(2);
}

function getDaysRemaining(dateString) {
    if (!dateString) return null;
    const target = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function toggleFilterMenu() {
    const m = document.getElementById('filter-menu');
    m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
function setFilterType(t) { filterType = t; updateFilterButtons(); renderItemsList(); }
function setFilterStatus(s) { filterStatus = s; updateFilterButtons(); renderItemsList(); }
function updateFilterButtons() {
    document.querySelectorAll('#filter-menu .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filterType && btn.dataset.filterType === filterType) btn.classList.add('active');
        if (btn.dataset.filterStatus && btn.dataset.filterStatus === filterStatus) btn.classList.add('active');
    });
}

function renderItemsList() {
    let items = getItems();
    const container = document.getElementById('items-list');
    const kw = document.getElementById('search-input').value.toLowerCase().trim();
    if (!container) return;

    if (kw) items = items.filter(i => i.name.toLowerCase().includes(kw) || i.category.toLowerCase().includes(kw));
    if (filterType === 'expiring') items = items.filter(i => { const d = getDaysRemaining(i.expiryDate); return d !== null && d >= 0 && d <= 90; });
    else if (filterType === 'warranty') items = items.filter(i => { if (i.category !== '家电' && i.category !== '电子产品') return false; const d = getDaysRemaining(i.warrantyDate); return d !== null && d >= 0 && d <= 90; });
    if (filterStatus === 'expired') items = items.filter(i => { const d = getDaysRemaining(i.expiryDate); return d !== null && d < 0; });
    else if (filterStatus === 'not-expired') items = items.filter(i => { const d = getDaysRemaining(i.expiryDate); return d === null || d >= 0; });
    else if (filterStatus === 'warranty-expired') items = items.filter(i => { if (i.category !== '家电' && i.category !== '电子产品') return false; const d = getDaysRemaining(i.warrantyDate); return d !== null && d < 0; });
    else if (filterStatus === 'not-warranty-expired') items = items.filter(i => { if (i.category !== '家电' && i.category !== '电子产品') return true; const d = getDaysRemaining(i.warrantyDate); return d === null || d >= 0; });

    if (items.length === 0) { container.innerHTML = '<p style="color:#999;text-align:center;margin-top:50px;">暂无匹配的物品</p>'; return; }

    items.sort((a, b) => {
        const dA = a.expiryDate ? getDaysRemaining(a.expiryDate) : 99999;
        const dB = b.expiryDate ? getDaysRemaining(b.expiryDate) : 99999;
        const wA = a.warrantyDate ? getDaysRemaining(a.warrantyDate) : 99999;
        const wB = b.warrantyDate ? getDaysRemaining(b.warrantyDate) : 99999;
        return Math.min(dA, wA) - Math.min(dB, wB);
    });

    container.innerHTML = '';
    items.forEach(item => {
        const dExp = getDaysRemaining(item.expiryDate);
        let expiryHtml = '';
        if (dExp !== null) {
            const danger = dExp <= 90;
            const text = dExp >= 0 ? `还有 <span class="days-badge ${danger ? 'danger' : ''}">${dExp}天</span> 过期` : `已过期 <span class="days-badge danger">${Math.abs(dExp)}天</span>`;
            expiryHtml = `<div class="item-info-row">📅 ${text}</div>`;
        }
        let warrantyHtml = '';
        if (item.category === '家电' || item.category === '电子产品') {
            const dWar = getDaysRemaining(item.warrantyDate);
            if (dWar !== null) {
                const danger = dWar <= 90;
                const text = dWar >= 0 ? `还有 <span class="days-badge ${danger ? 'danger' : ''}">${dWar}天</span> 过保` : `已过保 <span class="days-badge danger">${Math.abs(dWar)}天</span>`;
                warrantyHtml = `<div class="item-info-row">🛡️ ${text}</div>`;
            }
        }
        const div = document.createElement('div');
        div.className = 'item-card';
        div.setAttribute('onclick', `editItem(${item.id})`);
        div.innerHTML = `
            <div class="item-header">
                <div class="item-title">${item.name} <span class="item-quantity">x${item.quantity}</span></div>
                <div class="item-category-tag">${item.category}</div>
            </div>
            ${expiryHtml}
            ${warrantyHtml}
        `;
        container.appendChild(div);
    });
}

function editItem(id) {
    const item = getItems().find(i => i.id === id);
    if (!item) return;
    editingItemId = id;
    document.getElementById('form-title').innerText = '编辑物品';
    document.getElementById('save-btn').innerText = '保存修改';
    document.getElementById('item-name').value = item.name || '';
    document.getElementById('item-price').value = item.price || '';
    document.getElementById('item-quantity').value = item.quantity || 1;
    document.getElementById('category').value = item.category || '';
    document.getElementById('purchase-date').value = item.purchaseDate || '';
    document.getElementById('expiry-date').value = item.expiryDate || '';
    document.getElementById('warranty-date').value = item.warrantyDate || '';
    toggleWarranty();
    switchPage('page-add');
}

function initChart() {
    const chartDom = document.getElementById('chart-container');
    if (!chartDom) return;
    if (myChart) myChart.dispose();
    myChart = echarts.init(chartDom);
    const categoryCount = {};
    getItems().forEach(i => categoryCount[i.category] = (categoryCount[i.category] || 0) + 1);
    const chartData = Object.keys(categoryCount).map(k => ({ name: k, value: categoryCount[k] }));
    myChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 15, icon: 'circle' },
        color: ['#d98880', '#85c1e9', '#82c8a0', '#f7dc6f', '#bb8fce', '#f5b041', '#f5b7b1', '#aed6f1'],
        series: [{ name: '物品分布', type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: chartData.length > 0 ? chartData : [{ value: 0, name: '暂无数据', itemStyle: { color: '#eee' } }] }]
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

    if (!person || !event || !amount) { alert('请填写随礼人、事件和金额！'); return; }

    let records = getGiftRecords();
    let existing = records.find(r => r.person === person);
    const newEvent = { id: Date.now(), event, amount: parseFloat(amount), date, location };

    if (existing) existing.events.push(newEvent);
    else records.push({ id: Date.now(), person, events: [newEvent] });

    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    alert('保存成功！');
    ['gift-person', 'gift-event', 'gift-amount', 'gift-date', 'gift-location'].forEach(id => document.getElementById(id).value = '');
    switchPage('page-gift-record');
}

function renderGiftList() {
    const records = getGiftRecords();
    const container = document.getElementById('gift-list');
    const kw = document.getElementById('gift-search-input').value.toLowerCase().trim();
    if (!container) return;

    let filtered = kw ? records.filter(r => r.person.toLowerCase().includes(kw)) : records;
    if (filtered.length === 0) { container.innerHTML = '<p style="color:#999;text-align:center;margin-top:50px;">暂无随礼记录</p>'; return; }

    container.innerHTML = '';
    const colors = ['#fadbd8', '#f5b7b1', '#f9e79f', '#a9dfbf', '#aed6f1', '#d2b4de', '#f5cba7', '#f1948a'];

    filtered.forEach(record => {
        let total = 0;
        record.events.forEach(e => total += e.amount);
        let tagsHtml = '';
        record.events.forEach((ev, i) => {
            tagsHtml += `<span class="event-tag" style="background: ${colors[i % colors.length]};">${ev.event} ¥${ev.amount}</span>`;
        });
        const div = document.createElement('div');
        div.className = 'gift-card';
        div.setAttribute('onclick', `showGiftDetail(${record.id})`);
        div.innerHTML = `
            <div class="gift-info-left">
                <div class="gift-person-name">${record.person}</div>
                <div class="gift-events-preview">${tagsHtml}</div>
            </div>
            <div class="gift-total">共 ¥${total}</div>
        `;
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
        div.innerHTML = `
            <div class="event-header">${ev.event}</div>
            <div class="event-info">💰 礼金：¥${ev.amount}</div>
            <div class="event-info">📅 时间：${ev.date || '未记录'}</div>
            <div class="event-info">📍 地点：${ev.location || '未记录'}</div>
        `;
        container.appendChild(div);
    });
}

function showAddEventPage() {
    ['event-name', 'event-amount', 'event-date', 'event-location'].forEach(id => document.getElementById(id).value = '');
    switchPage('page-add-event');
}

function saveGiftEvent() {
    const event = document.getElementById('event-name').value.trim();
    const amount = document.getElementById('event-amount').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value.trim();
    if (!event || !amount) { alert('请填写事件和金额！'); return; }
    let records = getGiftRecords();
    const record = records.find(r => r.id === currentGiftPersonId);
    if (!record) return;
    record.events.push({ id: Date.now(), event, amount: parseFloat(amount), date, location });
    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    alert('事件添加成功！');
    renderGiftEventList();
    switchPage('page-gift-detail');
}

// ================= 重要日期 =================
function getImportantDates() { return JSON.parse(localStorage.getItem('myImportantDates')) || []; }

function selectLevel(level) {
    selectedImportantLevel = level;
    document.querySelectorAll('.level-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.level === level);
    });
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
    document.getElementById('important-form-title').innerText = '增加重要日期';
    document.getElementById('important-save-btn').innerText = '保存日期';
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((new Date(item.date) - today) / (1000 * 60 * 60 * 24));
    let dayText = days === 0 ? '今天' : (days > 0 ? `${days}天后` : `已过去${Math.abs(days)}天`);
    document.getElementById('important-detail-content').innerHTML = `
        <div class="important-card level-${item.level}">
            <div class="important-card-header">
                <span class="important-card-name">${item.person ? `[${item.person}] ` : ''}${item.event}</span>
                <span class="important-card-level">${item.level}</span>
            </div>
            <div class="important-card-date" style="margin-top:10px;">📅 日期：${item.date} (${dayText})</div>
        </div>
    `;
    switchPage('page-important-detail');
}

function editImportantDate() {
    const item = getImportantDates().find(d => d.id === currentImportantDetailId);
    if (!item) return;
    editingImportantId = item.id;
    document.getElementById('important-form-title').innerText = '编辑重要日期';
    document.getElementById('important-save-btn').innerText = '保存修改';
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = dates.map(d => {
        const days = Math.ceil((new Date(d.date) - today) / (1000 * 60 * 60 * 24));
        return { ...d, days };
    }).filter(d => d.days >= 0 && d.days <= 30).sort((a, b) => a.days - b.days);

    if (upcoming.length === 0) { section.innerHTML = ''; return; }

    let html = '<div class="card"><h3 style="margin-bottom:12px;">马上要发生 👇</h3>';
    upcoming.forEach(d => {
        html += `
            <div class="upcoming-card" onclick="showImportantDetail(${d.id})">
                <div class="upcoming-info">
                    <div class="upcoming-event">${d.person ? `[${d.person}] ` : ''}${d.event}</div>
                    <div class="upcoming-date">${d.date} · ${d.level}</div>
                </div>
                <div class="upcoming-days">${d.days}<small>天后</small></div>
            </div>
        `;
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
            let bgColor = '#f5b7b1';
            if (ev.level === '重要') bgColor = '#d98880';
            else if (ev.level === '纪念') bgColor = '#bb8fce';
            eventsHtml += `<div class="cal-event-rect" style="background:${bgColor}">${ev.event}</div>`;
        });

        html += `<div class="cal-cell ${dayEvents.length > 0 ? 'has-event' : ''}" onclick="selectCalDay('${dateStr}')">
            <span class="cal-day">${d}</span>
            ${jieQiText ? `<span class="cal-holiday">${jieQiText}</span>` : (lunarText ? `<span class="cal-lunar">${lunarText}</span>` : '')}
            ${holiday ? `<span class="cal-holiday">${holiday}</span>` : ''}
            ${isWeekend ? `<span class="cal-holiday" style="color:#f5b041;">休</span>` : ''}
            ${eventsHtml ? `<div class="cal-events">${eventsHtml}</div>` : ''}
        </div>`;
    }
    grid.innerHTML = html;
}

function selectCalDay(dateStr) {
    const dates = getImportantDates().filter(d => d.date === dateStr);
    const detail = document.getElementById('important-detail-card');
    if (dates.length === 0) { detail.style.display = 'none'; return; }
    let html = '';
    dates.forEach(d => {
        html += `
            <div class="important-card level-${d.level}" onclick="showImportantDetail(${d.id})">
                <div class="important-card-header">
                    <span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${d.event}</span>
                    <span class="important-card-level">${d.level}</span>
                </div>
                <div class="important-card-date">${d.date}</div>
            </div>
        `;
    });
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
    if (bar.style.display === 'none') {
        importantSearchKeyword = '';
        document.getElementById('important-search-input').value = '';
    } else document.getElementById('important-search-input').focus();
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
        div.innerHTML = `
            <div class="important-card-header">
                <span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${d.event}</span>
                <span class="important-card-level">${d.level}</span>
            </div>
            <div class="important-card-date">${d.date} · ${dayText}</div>
        `;
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

// ================= 初始化 =================
window.addEventListener('load', () => {
    applyTheme();
    updateDashboard();
    updateFilterButtons();
    updateImportantMenuButtons();
    selectLevel('提醒');
    renderUpcomingDates();
    refreshDrawerInfo();
});