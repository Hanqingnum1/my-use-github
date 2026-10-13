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
    
    if (pageId === 'page-home') document.getElementById('nav-home').classList.add('active');
    else if (pageId === 'page-all-items') document.getElementById('nav-all-items').classList.add('active');
    else if (pageId === 'page-gift-record') document.getElementById('nav-gift').classList.add('active');
    else if (pageId === 'page-add' || pageId === 'page-distribution') {
        document.getElementById('nav-home').classList.add('active'); // 二级页面高亮主页
    }

    // 4. 如果切到分布页，初始化/重绘图表
    if (pageId === 'page-distribution') {
        setTimeout(initChart, 100); // 延迟一下，等 DOM 显示出来
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

function saveItem() {
    alert('数据保存功能正在开发中...');
    switchPage('page-home');
}

// ================= ECharts 环形图 =================
function initChart() {
    const chartDom = document.getElementById('chart-container');
    if (!chartDom) return;
    
    // 如果已有实例，先销毁，避免重复初始化
    if (myChart) myChart.dispose();
    myChart = echarts.init(chartDom);

    // 这里先用假数据，之后接入真实数据直接替换即可
    const option = {
        tooltip: { trigger: 'item' },
        legend: {
            orient: 'vertical',
            right: '5%',
            top: 'middle',
            itemGap: 20,
            icon: 'circle'
        },
        series: [
            {
                name: '物品分布',
                type: 'pie',
                radius: ['50%', '75%'], // 环形图
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: { show: false },
                emphasis: { scale: true, scaleSize: 10 },
                data: [
                    { value: 2, name: '美妆', itemStyle: { color: '#c084fc' } },
                    { value: 1, name: '食品', itemStyle: { color: '#fb923c' } }
                ]
            }
        ]
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

// 页面加载完成后，绑定图表容器
window.addEventListener('load', () => {
    // 如果一进来就在分布页，就初始化图表
    if (document.getElementById('page-distribution').classList.contains('active')) {
        initChart();
    }
});