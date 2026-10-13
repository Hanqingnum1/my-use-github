// ================= 全局变量 =================
let currentInputId = null;
let selectedYear = null;
let selectedMonth = null;
let selectedDay = null;
let pickerStep = 'year';
let myChart = null; // ECharts 实例

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

// 点击保存物品
function saveItem() {
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('item-price').value;
    const imageFile = document.getElementById('item-image').files[0];

    if (!name || !category) {
        alert('请至少填写物品名称和分类！');
        return;
    }

    // 处理图片：如果用户选了图片，转换成 Base64
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 压缩图片（防止手机内存爆炸）
            compressImage(e.target.result, 300, function(compressedBase64) {
                saveDataToLocal(name, category, price, compressedBase64);
            });
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveDataToLocal(name, category, price, ''); // 没有图片就用空字符串
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

// 把数据存进 LocalStorage
function saveDataToLocal(name, category, price, imageBase64) {
    const items = getItems();
    const quantity = document.getElementById('item-quantity').value || 1;
    const newItem = {
        id: Date.now(),
        name: name,
        category: category,
        price: price || 0,
        quantity: quantity,
        image: imageBase64,
        purchaseDate: document.getElementById('purchase-date').value,
        expiryDate: document.getElementById('expiry-date').value,
        warrantyDate: document.getElementById('warranty-date').value
    };
    items.push(newItem);
    localStorage.setItem('myItems', JSON.stringify(items));
    
    alert('保存成功！');
    resetForm();
    switchPage('page-home');
}

// 清空表单
function resetForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-quantity').value = '1'; // 重置为 1
    document.getElementById('item-image').value = '';
    document.getElementById('purchase-date').value = '';
    document.getElementById('expiry-date').value = '';
    document.getElementById('warranty-date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('warranty-box').style.display = 'none';
}

// ================= 渲染主页与列表 =================

// 刷新主页数据
function updateDashboard() {
    const items = getItems();
    document.getElementById('total-count').innerText = items.length + ' 件';
    let totalPrice = 0;
    items.forEach(item => totalPrice += parseFloat(item.price || 0));
    document.querySelector('.hero-value').innerText = '¥ ' + totalPrice.toFixed(2);
}

// 渲染“全部物品”列表
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
    const items = getItems();
    const container = document.getElementById('items-list');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center; margin-top:50px;">暂无物品数据</p>';
        return;
    }
    
    container.innerHTML = '';
    items.forEach(item => {
        // 计算保质期倒计时
        const daysToExpiry = getDaysRemaining(item.expiryDate);
        let expiryText = '未设置';
        let expiryClass = '';
        if (daysToExpiry !== null) {
            if (daysToExpiry < 0) {
                expiryText = `已过期 ${Math.abs(daysToExpiry)} 天`;
                expiryClass = 'text-warning';
            } else {
                expiryText = `还剩 ${daysToExpiry} 天`;
                if (daysToExpiry <= 7) expiryClass = 'text-warning'; // 7天内过期标红
            }
        }

        // 计算质保期倒计时
        const daysToWarranty = getDaysRemaining(item.warrantyDate);
        let warrantyText = '无质保/未设置';
        let warrantyClass = '';
        if (daysToWarranty !== null) {
            if (daysToWarranty < 0) {
                warrantyText = `已过保 ${Math.abs(daysToWarranty)} 天`;
                warrantyClass = 'text-warning';
            } else {
                warrantyText = `还剩 ${daysToWarranty} 天`;
            }
        }

        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-header">
                <div class="item-title">
                    ${item.name}
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <div class="item-category-tag">${item.category}</div>
            </div>
            <div class="item-info-row">
                <span>📅 距离过期</span>
                <span class="${expiryClass}">${expiryText}</span>
            </div>
            <div class="item-info-row">
                <span>🛡️ 距离过质保</span>
                <span class="${warrantyClass}">${warrantyText}</span>
            </div>
        `;
        container.appendChild(div);
    });
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