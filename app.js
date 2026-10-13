// ================= 全局变量 =================
let currentInputId = null;
let selectedYear = null;
let selectedMonth = null;
let selectedDay = null;
let pickerStep = 'year';
let myChart = null; // ECharts 实例
let editingItemId = null; // 当前正在编辑的物品ID（为空代表是新增）

// ================= 页面切换逻辑 =================
function switchPage(pageId) {
    // 1. 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // 2. 显示目标页面
    document.getElementById(pageId).classList.add('active');

    // 3. 处理底部导航栏高亮
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (pageId === 'page-home') {
        document.getElementById('nav-home').classList.add('active');
        updateDashboard(); // 回到主页时刷新数据
    } else if (pageId === 'page-all-items') {
        document.getElementById('nav-all-items').classList.add('active');
        renderItemsList(); // 切换到全部物品时渲染列表
    } else if (pageId === 'page-gift-record') {
        document.getElementById('nav-gift').classList.add('active');
    } else if (pageId === 'page-add' || pageId === 'page-distribution') {
        document.getElementById('nav-home').classList.add('active'); // 二级页面高亮主页
    }

    // 4. 如果切到分布页，初始化/重绘图表（延迟一下等 DOM 显示出来）
    if (pageId === 'page-distribution') {
        setTimeout(initChart, 100);
    }
}

// ================= 表单逻辑 =================
function toggleWarranty() {
    const category = document.getElementById('category').value;
    const warrantyBox = document.getElementById('warranty-box');
    if (category === '家电' || category === '电子产品') {
        warrantyBox.style.display = 'block';
    } else {
        warrantyBox.style.display = 'none';
    }
}

// ================= 数据存储核心逻辑 =================

// 获取本地存储的物品列表
function getItems() {
    return JSON.parse(localStorage.getItem('myItems')) || [];
}

// 点击保存（支持新增和编辑）
function saveItem() {
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('item-price').value;
    const quantity = document.getElementById('item-quantity').value || 1;
    const imageFile = document.getElementById('item-image').files[0];

    if (!name || !category) {
        alert('请至少填写物品名称和分类！');
        return;
    }

    // 处理图片逻辑
    const handleSave = (imageBase64) => {
        let items = getItems();
        const purchaseDate = document.getElementById('purchase-date').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const warrantyDate = document.getElementById('warranty-date').value;

        if (editingItemId) {
            // 编辑模式：更新数据
            const index = items.findIndex(i => i.id === editingItemId);
            if (index !== -1) {
                items[index] = { 
                    ...items[index], 
                    name, category, price, quantity, 
                    image: imageBase64 || items[index].image, // 如果没选新图，保留旧图
                    purchaseDate, expiryDate, warrantyDate 
                };
            }
            alert('修改成功！');
        } else {
            // 新增模式
            const newItem = {
                id: Date.now(),
                name, category, price: price || 0, quantity,
                image: imageBase64, purchaseDate, expiryDate, warrantyDate
            };
            items.push(newItem);
            alert('保存成功！');
        }
        
        localStorage.setItem('myItems', JSON.stringify(items));
        resetForm();
        switchPage('page-all-items'); // 保存后直接跳回全部物品列表
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            compressImage(e.target.result, 300, handleSave);
        };
        reader.readAsDataURL(imageFile);
    } else {
        handleSave(''); 
    }
}

// 图片压缩函数（Canvas实现，防止 LocalStorage 塞满）
function compressImage(base64Str, maxWidth, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7)); // 压缩成 JPEG
    };
}

// 清空表单并重置模式
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

// ================= 渲染主页 =================

// 刷新主页数据
function updateDashboard() {
    const items = getItems();
    document.getElementById('total-count').innerText = items.length + ' 件';
    let totalPrice = 0;
    items.forEach(item => totalPrice += parseFloat(item.price || 0));
    document.querySelector('.hero-value').innerText = '¥ ' + totalPrice.toFixed(2);
}

// ================= 渲染“全部物品”列表（核心逻辑） =================

// 辅助函数：计算距离某个日期还有多少天
function getDaysRemaining(dateString) {
    if (!dateString) return null;
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 归零时间，只算天数
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 渲染“全部物品”列表
function renderItemsList() {
    let items = getItems();
    const container = document.getElementById('items-list');
    const searchKeyword = document.getElementById('search-input').value.toLowerCase().trim();
    if (!container) return;

    // 1. 搜索过滤
    if (searchKeyword) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchKeyword) || 
            item.category.toLowerCase().includes(searchKeyword)
        );
    }

    if (items.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center; margin-top:50px;">暂无物品数据</p>';
        return;
    }

    // 2. 排序：马上过期或马上过保的排在前面
    items.sort((a, b) => {
        const daysToExpiryA = a.expiryDate ? getDaysRemaining(a.expiryDate) : 99999;
        const daysToExpiryB = b.expiryDate ? getDaysRemaining(b.expiryDate) : 99999;
        const daysToWarrantyA = a.warrantyDate ? getDaysRemaining(a.warrantyDate) : 99999;
        const daysToWarrantyB = b.warrantyDate ? getDaysRemaining(b.warrantyDate) : 99999;
        
        // 综合取最紧急的天数进行排序（谁最快要到期谁在前面）
        const minA = Math.min(daysToExpiryA, daysToWarrantyA);
        const minB = Math.min(daysToExpiryB, daysToWarrantyB);
        return minA - minB;
    });

    container.innerHTML = '';
    
    // 3. 渲染卡片
    items.forEach(item => {
        // 计算过期天数
        const daysToExpiry = getDaysRemaining(item.expiryDate);
        let expiryHtml = '';
        if (daysToExpiry !== null) {
            const isDanger = daysToExpiry <= 90; // 小于3个月(90天)标红
            let text = daysToExpiry >= 0 
                ? `还有 <span class="days-badge ${isDanger ? 'danger' : ''}">${daysToExpiry}天</span> 过期` 
                : `已过期 <span class="days-badge danger">${Math.abs(daysToExpiry)}天</span>`;
            expiryHtml = `<div class="item-info-row"><span>📅 距离过期</span><span>${text}</span></div>`;
        }

        // 计算质保天数（仅家电和电子产品）
        let warrantyHtml = '';
        if (item.category === '家电' || item.category === '电子产品') {
            const daysToWarranty = getDaysRemaining(item.warrantyDate);
            if (daysToWarranty !== null) {
                const isDanger = daysToWarranty <= 90;
                let text = daysToWarranty >= 0 
                    ? `还有 <span class="days-badge ${isDanger ? 'danger' : ''}">${daysToWarranty}天</span> 过保` 
                    : `已过保 <span class="days-badge danger">${Math.abs(daysToWarranty)}天</span>`;
                warrantyHtml = `<div class="item-info-row"><span>🛡️ 距离过质保</span><span>${text}</span></div>`;
            }
        }

        const div = document.createElement('div');
        div.className = 'item-card';
        div.setAttribute('onclick', `editItem(${item.id})`); // 点击卡片跳转编辑
        div.innerHTML = `
            <div class="item-header">
                <div class="item-title">
                    ${item.name}
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <div class="item-category-tag">${item.category}</div>
            </div>
            ${expiryHtml}
            ${warrantyHtml}
        `;
        container.appendChild(div);
    });
}

// 点击卡片，跳转到编辑页面
function editItem(id) {
    const items = getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    editingItemId = id; // 标记正在编辑
    document.getElementById('form-title').innerText = '编辑物品';
    document.getElementById('save-btn').innerText = '保存修改';

    // 回填数据
    document.getElementById('item-name').value = item.name || '';
    document.getElementById('item-price').value = item.price || '';
    document.getElementById('item-quantity').value = item.quantity || 1;
    document.getElementById('category').value = item.category || '';
    document.getElementById('purchase-date').value = item.purchaseDate || '';
    document.getElementById('expiry-date').value = item.expiryDate || '';
    document.getElementById('warranty-date').value = item.warrantyDate || '';
    
    // 触发质保期显示逻辑
    toggleWarranty();
    
    // 跳转到表单页
    switchPage('page-add');
}

// ================= ECharts 环形图（真实数据版） =================
function initChart() {
    const chartDom = document.getElementById('chart-container');
    if (!chartDom) return;
    
    if (myChart) myChart.dispose();
    myChart = echarts.init(chartDom);

    const items = getItems();
    
    // 统计分类数据
    const categoryCount = {};
    items.forEach(item => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    const chartData = Object.keys(categoryCount).map(key => ({
        name: key,
        value: categoryCount[key]
    }));

    const option = {
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 15, icon: 'circle' },
        series: [{
            name: '物品分布',
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['35%', '50%'],
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            data: chartData.length > 0 ? chartData : [{ value: 0, name: '暂无数据', itemStyle: { color: '#eee' } }]
        }]
    };
    myChart.setOption(option);
}

// ================= 自定义平铺日期选择器 =================
function openDatePicker(inputId) {
    currentInputId = inputId;
    pickerStep = 'year';
    selectedYear = null; selectedMonth = null; selectedDay = null;
    document.getElementById('date-picker-modal').style.display = 'flex';
    renderPickerBody();
}

function closeDatePicker() {
    document.getElementById('date-picker-modal').style.display = 'none';
}

function renderPickerBody() {
    const body = document.getElementById('picker-body');
    const title = document.getElementById('picker-title');
    body.innerHTML = '';

    if (pickerStep === 'year') {
        title.innerText = '1. 选择年份';
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 10; y <= currentYear + 10; y++) {
            const div = document.createElement('div');
            div.className = 'picker-item';
            div.innerText = y + '年';
            div.onclick = () => { selectedYear = y; pickerStep = 'month'; renderPickerBody(); };
            body.appendChild(div);
        }
    } else if (pickerStep === 'month') {
        title.innerText = selectedYear + '年 2. 选择月份';
        for (let m = 1; m <= 12; m++) {
            const div = document.createElement('div');
            div.className = 'picker-item';
            div.innerText = m + '月';
            div.onclick = () => { selectedMonth = m; pickerStep = 'day'; renderPickerBody(); };
            body.appendChild(div);
        }
    } else if (pickerStep === 'day') {
        title.innerText = selectedYear + '年' + selectedMonth + '月 3. 选择日期';
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const div = document.createElement('div');
            div.className = 'picker-item';
            div.innerText = d + '日';
            div.onclick = () => { selectedDay = d; confirmDate(); };
            body.appendChild(div);
        }
    }
}

function selectToday() {
    const today = new Date();
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth() + 1;
    selectedDay = today.getDate();
    confirmDate();
}

function confirmDate() {
    if (selectedYear && selectedMonth && selectedDay) {
        const formatted = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        document.getElementById(currentInputId).value = formatted;
    }
    closeDatePicker();
}

// ================= 初始化 =================
window.addEventListener('load', () => {
    updateDashboard(); // 一加载就刷新主页数据
});