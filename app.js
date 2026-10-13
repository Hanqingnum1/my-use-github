// 点击“物品”按钮时，切换界面
function showAddForm() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('add-form').style.display = 'block';
}

// 点击“物品分布”按钮
function showDistribution() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('distribution-page').style.display = 'block';
}

// 点击“返回主页”按钮
function goHome() {
    // 把所有非主页的页面都隐藏掉
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('distribution-page').style.display = 'none';
    // 显示主页
    document.getElementById('home-page').style.display = 'block';
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
    goHome();
}