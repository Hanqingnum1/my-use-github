// 核心函数：切换底部导航页面
function switchTab(tabName) {
    // 1. 隐藏所有主页面区域
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('distribution-page').style.display = 'none';
    document.getElementById('all-items-page').style.display = 'none';
    document.getElementById('gift-record-page').style.display = 'none';

    // 2. 移除所有 Tab 的高亮状态
    document.getElementById('tab-home').classList.remove('active');
    document.getElementById('tab-all-items').classList.remove('active');
    document.getElementById('tab-gift-record').classList.remove('active');

    // 3. 根据点击的 Tab 显示对应页面并高亮
    if (tabName === 'home') {
        document.getElementById('home-page').style.display = 'block';
        document.getElementById('tab-home').classList.add('active');
    } else if (tabName === 'all-items') {
        document.getElementById('all-items-page').style.display = 'block';
        document.getElementById('tab-all-items').classList.add('active');
    } else if (tabName === 'gift-record') {
        document.getElementById('gift-record-page').style.display = 'block';
        document.getElementById('tab-gift-record').classList.add('active');
    } else if (tabName === 'add-form') {
        // 增加物品页属于“主页”的二级页面，所以高亮“主页” Tab
        document.getElementById('add-form').style.display = 'block';
        document.getElementById('tab-home').classList.add('active');
    } else if (tabName === 'distribution') {
        // 物品分布页也属于“主页”的二级页面
        document.getElementById('distribution-page').style.display = 'block';
        document.getElementById('tab-home').classList.add('active');
    }
}

// 点击“增加物品”按钮
function showAddForm() {
    switchTab('add-form');
}

// 点击“物品分布”按钮
function showDistribution() {
    switchTab('distribution');
}

// 核心逻辑：根据分类，决定是否显示“质保期”
function toggleWarranty() {
    const category = document.getElementById('category').value;
    const warrantyBox = document.getElementById('warranty-box');
    
    if (category === '家电' || category === '电子产品') {
        warrantyBox.style.display = 'block';
    } else {
        warrantyBox.style.display = 'none';
    }
}

// 保存物品的占位函数
function saveItem() {
    alert('保存功能还没写，下一步我们就来实现它！');
    switchTab('home');
}
// ================= 自定义平铺日期选择器 =================
let currentInputId = null;
let selectedYear = null;
let selectedMonth = null;
let selectedDay = null;
let pickerStep = 'year'; // 步骤：'year' -> 'month' -> 'day'

// 打开弹窗
function openDatePicker(inputId) {
    currentInputId = inputId;
    pickerStep = 'year';
    selectedYear = null;
    selectedMonth = null;
    selectedDay = null;
    document.getElementById('date-picker-modal').style.display = 'flex';
    renderPickerBody();
}

// 关闭弹窗
function closeDatePicker() {
    document.getElementById('date-picker-modal').style.display = 'none';
}

// 渲染平铺选项
function renderPickerBody() {
    const body = document.getElementById('picker-body');
    const title = document.getElementById('picker-title');
    body.innerHTML = '';

    if (pickerStep === 'year') {
        title.innerText = '1. 选择年份';
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 10; y <= currentYear + 10; y++) {
            const div = document.createElement('div');
            div.style.cssText = 'width:calc(25% - 10px); padding:12px 0; text-align:center; border:1px solid #ddd; border-radius:8px; cursor:pointer; background:#f9f9f9; font-size:14px;';
            div.innerText = y + '年';
            div.onclick = () => { selectedYear = y; pickerStep = 'month'; renderPickerBody(); };
            body.appendChild(div);
        }
    } else if (pickerStep === 'month') {
        title.innerText = selectedYear + '年 2. 选择月份';
        for (let m = 1; m <= 12; m++) {
            const div = document.createElement('div');
            div.style.cssText = 'width:calc(25% - 10px); padding:12px 0; text-align:center; border:1px solid #ddd; border-radius:8px; cursor:pointer; background:#f9f9f9; font-size:14px;';
            div.innerText = m + '月';
            div.onclick = () => { selectedMonth = m; pickerStep = 'day'; renderPickerBody(); };
            body.appendChild(div);
        }
    } else if (pickerStep === 'day') {
        title.innerText = selectedYear + '年' + selectedMonth + '月 3. 选择日期';
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const div = document.createElement('div');
            div.style.cssText = 'width:calc(25% - 10px); padding:12px 0; text-align:center; border:1px solid #ddd; border-radius:8px; cursor:pointer; background:#f9f9f9; font-size:14px;';
            div.innerText = d + '日';
            div.onclick = () => { selectedDay = d; confirmDate(); };
            body.appendChild(div);
        }
    }
}

// 点击今日按钮
function selectToday() {
    const today = new Date();
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth() + 1;
    selectedDay = today.getDate();
    confirmDate();
}

// 确认回填
function confirmDate() {
    if (selectedYear && selectedMonth && selectedDay) {
        const formatted = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        document.getElementById(currentInputId).value = formatted;
    }
    closeDatePicker();
}