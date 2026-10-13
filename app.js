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