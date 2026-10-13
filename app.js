// 点击“增加物品”按钮时，切换界面
function showAddForm() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('add-form').style.display = 'block';
}

// 点击“返回主页”按钮
function goHome() {
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
}

// 核心逻辑：根据分类，决定是否显示“质保期”
function toggleWarranty() {
    const category = document.getElementById('category').value;
    const warrantyBox = document.getElementById('warranty-box');
    
    // 如果选的是家电或电子产品，就显示质保期
    if (category === '家电' || category === '电子产品') {
        warrantyBox.style.display = 'block';
    } else {
        warrantyBox.style.display = 'none'; // 其他分类隐藏质保期
    }
}

// 保存物品的占位函数
function saveItem() {
    alert('保存功能还没写，下一步我们就来实现它！');
    goHome();
}