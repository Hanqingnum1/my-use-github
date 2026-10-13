// ================= 全局变量 =================
let currentInputId = null;
let selectedYear = null;
let selectedMonth = null;
let selectedDay = null;
let pickerStep = 'year';
let myChart = null;
let editingItemId = null;
let currentGiftPersonId = null;

// 筛选与过滤状态
let filterType = 'all';
let filterStatus = 'all';

// ================= 页面切换逻辑 =================
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    if (pageId === 'page-home') {
        document.getElementById('nav-home').classList.add('active');
        updateDashboard();
    } else if (pageId === 'page-all-items') {
        document.getElementById('nav-all-items').classList.add('active');
        renderItemsList();
    } else if (pageId === 'page-gift-record') {
        document.getElementById('nav-gift').classList.add('active');
        renderGiftList();
    } else if (['page-add', 'page-distribution', 'page-add-gift', 'page-gift-detail', 'page-add-event'].includes(pageId)) {
        document.getElementById('nav-home').classList.add('active');
    }

    if (pageId === 'page-distribution') {
        setTimeout(initChart, 100);
    }
}

// ================= 物品相关逻辑 =================
function toggleWarranty() {
    const category = document.getElementById('category').value;
    const warrantyBox = document.getElementById('warranty-box');
    warrantyBox.style.display = (category === '家电' || category === '电子产品') ? 'block' : 'none';
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
            const index = items.findIndex(i => i.id === editingItemId);
            if (index !== -1) items[index] = { ...items[index], name, category, price, quantity, image: imageBase64 || items[index].image, purchaseDate, expiryDate, warrantyDate };
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
    } else {
        handleSave('');
    }
}

function compressImage(base64Str, maxWidth, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
}

function resetForm() {
    editingItemId = null;
    document.getElementById('form-title').innerText = '增加物品';
    document.getElementById('save-btn').innerText = '保存物品';
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-quantity').value = '1';
    document.getElementById('item-image').value = '';
    document.getElementById('purchase-date').value = '';
    document.getElementById('expiry-date').value = '';
    document.getElementById('warranty-date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('warranty-box').style.display = 'none';
}

function updateDashboard() {
    const items = getItems();
    document.getElementById('total-count').innerText = items.length + ' 件';
    let totalPrice = 0;
    items.forEach(item => totalPrice += parseFloat(item.price || 0));
    document.querySelector('.hero-value').innerText = '¥ ' + totalPrice.toFixed(2);

    // 计算总随礼金额（粉色卡片）
    const records = getGiftRecords();
    let totalGift = 0;
    records.forEach(record => {
        record.events.forEach(e => totalGift += e.amount);
    });
    document.getElementById('total-gift-amount').innerText = '¥ ' + totalGift.toFixed(2);
}

function getDaysRemaining(dateString) {
    if (!dateString) return null;
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
}

// 筛选过滤菜单开关
function toggleFilterMenu() {
    const menu = document.getElementById('filter-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setFilterType(type) {
    filterType = type;
    updateFilterButtons();
    renderItemsList();
}

function setFilterStatus(status) {
    filterStatus = status;
    updateFilterButtons();
    renderItemsList();
}

function updateFilterButtons() {
    document.querySelectorAll('#filter-menu .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filterType && btn.dataset.filterType === filterType) btn.classList.add('active');
        if (btn.dataset.filterStatus && btn.dataset.filterStatus === filterStatus) btn.classList.add('active');
    });
}

// 核心：渲染物品列表
function renderItemsList() {
    let items = getItems();
    const container = document.getElementById('items-list');
    const searchKeyword = document.getElementById('search-input').value.toLowerCase().trim();
    if (!container) return;

    if (searchKeyword) {
        items = items.filter(item => item.name.toLowerCase().includes(searchKeyword) || item.category.toLowerCase().includes(searchKeyword));
    }

    if (filterType === 'expiring') {
        items = items.filter(item => { const d = getDaysRemaining(item.expiryDate); return d !== null && d >= 0 && d <= 90; });
    } else if (filterType === 'warranty') {
        items = items.filter(item => { if (item.category !== '家电' && item.category !== '电子产品') return false; const d = getDaysRemaining(item.warrantyDate); return d !== null && d >= 0 && d <= 90; });
    }

    if (filterStatus === 'expired') {
        items = items.filter(item => { const d = getDaysRemaining(item.expiryDate); return d !== null && d < 0; });
    } else if (filterStatus === 'not-expired') {
        items = items.filter(item => { const d = getDaysRemaining(item.expiryDate); return d === null || d >= 0; });
    } else if (filterStatus === 'warranty-expired') {
        items = items.filter(item => { if (item.category !== '家电' && item.category !== '电子产品') return false; const d = getDaysRemaining(item.warrantyDate); return d !== null && d < 0; });
    } else if (filterStatus === 'not-warranty-expired') {
        items = items.filter(item => { if (item.category !== '家电' && item.category !== '电子产品') return true; const d = getDaysRemaining(item.warrantyDate); return d === null || d >= 0; });
    }

    if (items.length === 0) { container.innerHTML = '<p style="color:#999;text-align:center; margin-top:50px;">暂无匹配的物品</p>'; return; }

    items.sort((a, b) => {
        const dA = a.expiryDate ? getDaysRemaining(a.expiryDate) : 99999;
        const dB = b.expiryDate ? getDaysRemaining(b.expiryDate) : 99999;
        const wA = a.warrantyDate ? getDaysRemaining(a.warrantyDate) : 99999;
        const wB = b.warrantyDate ? getDaysRemaining(b.warrantyDate) : 99999;
        return Math.min(dA, wA) - Math.min(dB, wB);
    });

    container.innerHTML = '';
    items.forEach(item => {
        const dExpiry = getDaysRemaining(item.expiryDate);
        let expiryHtml = '';
        if (dExpiry !== null) {
            const danger = dExpiry <= 90;
            const text = dExpiry >= 0 ? `还有 <span class="days-badge ${danger ? 'danger' : ''}">${dExpiry}天</span> 过期` : `已过期 <span class="days-badge danger">${Math.abs(dExpiry)}天</span>`;
            expiryHtml = `<div class="item-info-row"><span>📅 距离过期</span><span>${text}</span></div>`;
        }

        let warrantyHtml = '';
        if (item.category === '家电' || item.category === '电子产品') {
            const dWar = getDaysRemaining(item.warrantyDate);
            if (dWar !== null) {
                const danger = dWar <= 90;
                const text = dWar >= 0 ? `还有 <span class="days-badge ${danger ? 'danger' : ''}">${dWar}天</span> 过保` : `已过保 <span class="days-badge danger">${Math.abs(dWar)}天</span>`;
                warrantyHtml = `<div class="item-info-row"><span>🛡️ 距离过质保</span><span>${text}</span></div>`;
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
    getItems().forEach(item => categoryCount[item.category] = (categoryCount[item.category] || 0) + 1);
    const chartData = Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] }));
    myChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 15, icon: 'circle' },
        series: [{ name: '物品分布', type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: chartData.length > 0 ? chartData : [{ value: 0, name: '暂无数据', itemStyle: { color: '#eee' } }] }]
    });
}

// ================= 随礼记录相关逻辑 =================
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

    if (existing) { existing.events.push(newEvent); } 
    else { records.push({ id: Date.now(), person, events: [newEvent] }); }

    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    alert('保存成功！');
    
    document.getElementById('gift-person').value = '';
    document.getElementById('gift-event').value = '';
    document.getElementById('gift-amount').value = '';
    document.getElementById('gift-date').value = '';
    document.getElementById('gift-location').value = '';
    
    switchPage('page-gift-record');
}

// 渲染随礼列表（新版布局：名称 + 事件卡片 + 总金额）
function renderGiftList() {
    const records = getGiftRecords();
    const container = document.getElementById('gift-list');
    const searchKeyword = document.getElementById('gift-search-input').value.toLowerCase().trim();
    if (!container) return;

    let filtered = records;
    if (searchKeyword) { filtered = records.filter(r => r.person.toLowerCase().includes(searchKeyword)); }

    if (filtered.length === 0) { container.innerHTML = '<p style="color:#999;text-align:center; margin-top:50px;">暂无随礼记录</p>'; return; }

    container.innerHTML = '';
    const colors = ['#ffeaa7', '#fab1a0', '#81ecec', '#74b9ff', '#a29bfe', '#55efc4', '#fd79a8', '#e17055'];
    
    filtered.forEach(record => {
        let total = 0;
        record.events.forEach(e => total += e.amount);

        // 生成事件标签（每个事件一种颜色）
        let eventTagsHtml = '';
        record.events.forEach((ev, index) => {
            const color = colors[index % colors.length];
            eventTagsHtml += `<span class="event-tag" style="background: ${color};">${ev.event} ¥${ev.amount}</span>`;
        });

        const div = document.createElement('div');
        div.className = 'gift-card';
        div.setAttribute('onclick', `showGiftDetail(${record.id})`);
        // 左侧名称+事件，右侧总金额
        div.innerHTML = `
            <div class="gift-info-left">
                <div class="gift-person-name">${record.person}</div>
                <div class="gift-events-preview">
                    ${eventTagsHtml}
                </div>
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
    const sortedEvents = [...record.events].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEvents.forEach(ev => {
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
    document.getElementById('event-name').value = '';
    document.getElementById('event-amount').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-location').value = '';
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
    updateDashboard();
    updateFilterButtons();
});