// ================= 全局变量 =================
let currentInputId = null;
let selectedYear = null, selectedMonth = null, selectedDay = null;
let pickerStep = 'year';
let pickerMode = 'full';   // 'full' = 选年月日, 'year-month' = 只选年月
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
let cropTarget = 'wallpaper';   // 'wallpaper' 或 'avatar'
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
let selectedCalDate = null;       // 日历当前选中日期
let currentDiaryViewId = null;    // 日记/便签只读页的 ID
let currentDiaryListType = '日记'; // 列表页当前类型
let currentDiaryListDate = null;  // 列表页对应的日期
let diaryEditSource = 'panel';    // 'panel' = 从侧边面板进入编辑；'list' = 从列表/只读页进入
let currentDiaryTemplate = null;  // 当前选中的模板
let editingDiaryId = null;        // 正在编辑的日记 ID
let isLongPress = false;          // 长按标志
let longPressTimer = null;        // 长按计时器
// 全局确认弹窗
let confirmCallback = null;
// 长按删除
let itemLongPressTimer = null;
let itemLongPressFired = false;
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
// 自动计算已用时
let computedSpentDays = 0;
// 书本列表页
let bookFilterStatus = 'all';
let bookSort = 'default';
let bookSortDir = 'desc';
let bookView = 'list';
let currentBookViewId = null;

// 图标选择相关
let iconSrcImage = null;
let selectedIconCells = []; // [{row, col, num}]

// 批量多选
let multiSelectMode = { items: false, gift: false, important: false, diary: false };
let multiSelectedIds = {
    items: new Set(),
    gift: new Set(),
    important: new Set(),
    diary: new Set()
};

const nationalHolidays = {
    '01-01': '元旦', '02-14': '情人节', '03-08': '妇女节', '03-12': '植树节',
    '04-01': '愚人节', '05-01': '劳动节', '05-04': '青年节', '06-01': '儿童节',
    '07-01': '建党节', '08-01': '建军节', '09-10': '教师节',
    '10-01': '国庆节', '12-24': '平安夜', '12-25': '圣诞节'
};

// ================= 多语言字典 =================
const i18nData = {
    'zh-CN': {
        // 底部导航与主页
        'nav.home': '主页', 'nav.items': '全部物品', 'nav.gift': '随礼记录', 'nav.important': '重要日期',
        'home.bought': '我居然买了这么多 😱', 'home.gift': '这都是人情世故啊 😮‍💨',
        'home.addItem': '物品', 'home.addGift': '随礼', 'home.addImportant': '重要日期', 'home.addBook': '书本',
        'home.bookTitle': '今天看书了嘛~ 📖', 'home.clickAddBook': '点击添加一本正在读的书', 'home.noActiveBook': '还没有选择要展示的书，去书本列表勾选',
        'home.upcoming': '马上要发生 👇', 'home.daysAfter': '天后',
        // 通用按钮、提示与弹窗
        'btn.save': '保存', 'btn.edit': '编辑', 'btn.delete': '删除', 'btn.cancel': '取消', 'btn.confirm': '确定', 'btn.close': '关闭',
        'tip.today': '今日', 'tip.selectDate': '点击选择', 'tip.remark': '其他需要记录的信息...',
        'alert.title': '提示', 'alert.confirmDel': '确认删除',
        // 物品模块
        'item.title': '添加物品', 'item.edit': '编辑物品', 'item.save': '保存修改', 'item.img': '物品图片', 'item.upload': '上传',
        'item.basic': '基本信息', 'item.name': '物品名称', 'item.namePh': '例如：吹风机', 'item.qty': '数量', 'item.category': '分类',
        'item.other': '其他信息', 'item.acquire': '获取方式', 'item.priceDate': '购买价格 / 日期', 'item.price': '价格', 'item.buyDate': '购买日期',
        'item.expiry': '物品保质期', 'item.warranty': '物品质保期', 'item.remark': '备注', 'item.status': '物品状态',
        'item.held': '持有中', 'item.paused': '暂离中', 'item.removed': '已移除',
        'item.all': '全部物品', 'item.search': '搜索物品名称或分类...', 'item.heldTitle': '持有', 'item.expiring': '快过期', 'item.warrantyTitle': '快过保',
        'item.filterAll': '全部', 'item.filterExpired': '已过期', 'item.filterWarrantyExpired': '已过保', 'item.filterHeld': '持有', 'item.filterPaused': '暂离', 'item.filterRemoved': '移除',
        'item.catAll': '全部分类', 'item.sortDefault': '默认', 'item.sortPurchase': '购买日期', 'item.sortPrice': '价格', 'item.sortName': '名称', 'item.sortExpiry': '过期倒计时',
        'item.addBtn': '添加物品', 'item.noMatch': '暂无匹配的物品',
        // 随礼模块
        'gift.title': '增加随礼', 'gift.person': '随礼人', 'gift.personPh': '例如：张三', 'gift.type': '类型', 'gift.give': '随礼', 'gift.receive': '收礼',
        'gift.event': '随礼事件', 'gift.eventPh': '或直接输入事件', 'gift.amount': '礼金数额', 'gift.amountPh': '自定义金额', 'gift.time': '时间', 'gift.location': '地点', 'gift.locationPh': '例如：北京',
        'gift.photos': '照片（最多 3 张）', 'gift.saveRecord': '保存记录', 'gift.listTitle': '随礼记录', 'gift.searchPh': '搜索随礼人、事件或备注...',
        'gift.catAll': '全部分类', 'gift.sortDate': '日期', 'gift.sortAmount': '金额', 'gift.sortName': '姓名', 'gift.addRecord': '添加记录', 'gift.noMatch': '暂无匹配的记录',
        'gift.detail': '随礼详情', 'gift.addEvent': '增加随礼事件', 'gift.saveEvent': '保存事件', 'gift.eventDetail': '事件详情',
        // 重要日期模块
        'date.title': '增加重要日期', 'date.person': '主人公', 'date.personPh': '例如：我自己、爸爸', 'date.time': '时间', 'date.event': '事件', 'date.eventPh': '例如：结婚纪念日',
        'date.level': '重要程度', 'date.remind': '提醒', 'date.important': '重要', 'date.memory': '纪念', 'date.saveDate': '保存日期', 'date.detail': '重要日期详情',
        'date.calTitle': '重要日期', 'date.searchPh': '搜索重要日期...', 'date.next7': '接下来 7 天', 'date.today': '今天', 'date.tomorrow': '明天', 'date.dayAfter': '后天',
        'date.week0': '日', 'date.week1': '一', 'date.week2': '二', 'date.week3': '三', 'date.week4': '四', 'date.week5': '五', 'date.week6': '六',
        // 书本模块
        'book.editTitle': '书籍详情', 'book.heroText': '记录你的阅读旅程', 'book.name': '书名', 'book.startTime': '开始阅读时间', 'book.startPh': '点击选择（必填）',
        'book.totalPages': '总页数', 'book.currentPages': '目前页数', 'book.estimate': '预计用时（天）', 'book.spent': '已用时（天，自动计算）', 'book.spentPh': '填完开始时间后自动计算',
        'book.save': '保存', 'book.listTitle': '我的书本', 'book.searchPh': '搜索书名...', 'book.filterReading': '在读', 'book.filterDone': '读完',
        'book.sortName': '名称', 'book.sortProgress': '进度', 'book.addBook': '添加书本', 'book.viewTitle': '书本详情', 'book.noMatch': '还没有添加书本，点右下角 + 添加',
        'book.timeInfo': '时间信息', 'book.readProgress': '阅读进度', 'book.status': '状态', 'book.reading': '阅读中', 'book.finished': '已读完',
        // 侧边栏与设置
        'drawer.profile': '个人中心', 'drawer.theme': '主题个性化', 'drawer.backup': '数据与备份', 'drawer.lock': '应用锁', 'drawer.about': '关于',
        'profile.nick': '昵称', 'profile.sign': '签名', 'profile.noNick': '未设置昵称', 'profile.clickSign': '点击设置个性签名',
        'theme.title': '主题个性化', 'theme.preference': '偏好设置', 'theme.lang': '语言', 'theme.startpage': '默认启动页',
        'theme.color': '主题色', 'theme.dark': '深夜模式', 'theme.wallpaper': '背景壁纸', 'theme.uploadWallpaper': '上传壁纸', 'theme.clearWallpaper': '清除壁纸',
        'theme.icon': '导航图标定制', 'theme.uploadIcon': '上传图标图', 'theme.resetIcon': '重置图标',
        'backup.title': '数据与备份', 'backup.export': '导出全部数据（JSON）', 'backup.import': '导入数据', 'backup.storage': '存储与清理', 'backup.usage': '占用空间', 'backup.clearAll': '清空所有数据',
        'lock.title': '应用锁', 'lock.choose': '选择解锁方式（三选一）', 'lock.fingerprint': '指纹解锁', 'lock.pattern': '图形解锁', 'lock.password': '密码解锁',
        'about.title': '关于', 'about.version': '版本', 'about.desc': '记录你的每一件物品与每一天',
        'date.start': '开始阅读', 'date.weekday.0': '星期日', 'date.weekday.1': '星期一', 'date.weekday.2': '星期二', 'date.weekday.3': '星期三', 'date.weekday.4': '星期四', 'date.weekday.5': '星期五', 'date.weekday.6': '星期六'
    },
    'en': {
        'nav.home': 'Home', 'nav.items': 'Items', 'nav.gift': 'Gifts', 'nav.important': 'Dates',
        'home.bought': 'I bought so much 😱', 'home.gift': 'Social etiquette 😮‍💨',
        'home.addItem': 'Item', 'home.addGift': 'Gift', 'home.addImportant': 'Date', 'home.addBook': 'Book',
        'home.bookTitle': 'Read today? 📖', 'home.clickAddBook': 'Click to add a reading book', 'home.noActiveBook': 'No book selected to show',
        'home.upcoming': 'Happening soon 👇', 'home.daysAfter': 'days left',
        'btn.save': 'Save', 'btn.edit': 'Edit', 'btn.delete': 'Delete', 'btn.cancel': 'Cancel', 'btn.confirm': 'OK', 'btn.close': 'Close',
        'tip.today': 'Today', 'tip.selectDate': 'Tap to select', 'tip.remark': 'Other info...',
        'alert.title': 'Tip', 'alert.confirmDel': 'Confirm Delete',
        'item.title': 'Add Item', 'item.edit': 'Edit Item', 'item.save': 'Save Changes', 'item.img': 'Item Image', 'item.upload': 'Upload',
        'item.basic': 'Basic Info', 'item.name': 'Item Name', 'item.namePh': 'e.g. Hair dryer', 'item.qty': 'Qty', 'item.category': 'Category',
        'item.other': 'Other Info', 'item.acquire': 'Acquire Method', 'item.priceDate': 'Price / Date', 'item.price': 'Price', 'item.buyDate': 'Purchase Date',
        'item.expiry': 'Expiry Date', 'item.warranty': 'Warranty Date', 'item.remark': 'Remark', 'item.status': 'Status',
        'item.held': 'Held', 'item.paused': 'Paused', 'item.removed': 'Removed',
        'item.all': 'All Items', 'item.search': 'Search items...', 'item.heldTitle': 'Held', 'item.expiring': 'Expiring', 'item.warrantyTitle': 'Warranty Exp',
        'item.filterAll': 'All', 'item.filterExpired': 'Expired', 'item.filterWarrantyExpired': 'Warranty Exp', 'item.filterHeld': 'Held', 'item.filterPaused': 'Paused', 'item.filterRemoved': 'Removed',
        'item.catAll': 'All Categories', 'item.sortDefault': 'Default', 'item.sortPurchase': 'Purchase Date', 'item.sortPrice': 'Price', 'item.sortName': 'Name', 'item.sortExpiry': 'Expiry',
        'item.addBtn': 'Add Item', 'item.noMatch': 'No matching items',
        'gift.title': 'Add Gift', 'gift.person': 'Person', 'gift.personPh': 'e.g. John', 'gift.type': 'Type', 'gift.give': 'Give', 'gift.receive': 'Receive',
        'gift.event': 'Event', 'gift.eventPh': 'Or input event', 'gift.amount': 'Amount', 'gift.amountPh': 'Custom amount', 'gift.time': 'Time', 'gift.location': 'Location', 'gift.locationPh': 'e.g. Beijing',
        'gift.photos': 'Photos (Max 3)', 'gift.saveRecord': 'Save Record', 'gift.listTitle': 'Gift Records', 'gift.searchPh': 'Search person, event or remark...',
        'gift.catAll': 'All Categories', 'gift.sortDate': 'Date', 'gift.sortAmount': 'Amount', 'gift.sortName': 'Name', 'gift.addRecord': 'Add Record', 'gift.noMatch': 'No matching records',
        'gift.detail': 'Gift Detail', 'gift.addEvent': 'Add Gift Event', 'gift.saveEvent': 'Save Event', 'gift.eventDetail': 'Event Detail',
        'date.title': 'Add Important Date', 'date.person': 'Person', 'date.personPh': 'e.g. Myself, Dad', 'date.time': 'Time', 'date.event': 'Event', 'date.eventPh': 'e.g. Anniversary',
        'date.level': 'Level', 'date.remind': 'Remind', 'date.important': 'Important', 'date.memory': 'Memory', 'date.saveDate': 'Save Date', 'date.detail': 'Date Detail',
        'date.calTitle': 'Important Dates', 'date.searchPh': 'Search dates...', 'date.next7': 'Next 7 Days', 'date.today': 'Today', 'date.tomorrow': 'Tomorrow', 'date.dayAfter': 'Day After',
        'date.week0': 'Sun', 'date.week1': 'Mon', 'date.week2': 'Tue', 'date.week3': 'Wed', 'date.week4': 'Thu', 'date.week5': 'Fri', 'date.week6': 'Sat',
        'book.editTitle': 'Book Detail', 'book.heroText': 'Record your reading journey', 'book.name': 'Book Name', 'book.startTime': 'Start Date', 'book.startPh': 'Tap to select (Required)',
        'book.totalPages': 'Total Pages', 'book.currentPages': 'Current Pages', 'book.estimate': 'Est. Days', 'book.spent': 'Spent Days (Auto)', 'book.spentPh': 'Auto-calculated',
        'book.save': 'Save', 'book.listTitle': 'My Books', 'book.searchPh': 'Search books...', 'book.filterReading': 'Reading', 'book.filterDone': 'Finished',
        'book.sortName': 'Name', 'book.sortProgress': 'Progress', 'book.addBook': 'Add Book', 'book.viewTitle': 'Book Detail', 'book.noMatch': 'No books added. Tap + to add.',
        'book.timeInfo': 'Time Info', 'book.readProgress': 'Reading Progress', 'book.status': 'Status', 'book.reading': 'Reading', 'book.finished': 'Finished',
        'drawer.profile': 'Profile', 'drawer.theme': 'Theme', 'drawer.backup': 'Backup', 'drawer.lock': 'App Lock', 'drawer.about': 'About',
        'profile.nick': 'Nickname', 'profile.sign': 'Sign', 'profile.noNick': 'Not set', 'profile.clickSign': 'Tap to set',
        'theme.title': 'Theme', 'theme.preference': 'Preferences', 'theme.lang': 'Language', 'theme.startpage': 'Start Page',
        'theme.color': 'Theme Color', 'theme.dark': 'Dark Mode', 'theme.wallpaper': 'Wallpaper', 'theme.uploadWallpaper': 'Upload', 'theme.clearWallpaper': 'Clear',
        'theme.icon': 'Custom Icons', 'theme.uploadIcon': 'Upload Image', 'theme.resetIcon': 'Reset',
        'backup.title': 'Backup', 'backup.export': 'Export Data (JSON)', 'backup.import': 'Import Data', 'backup.storage': 'Storage', 'backup.usage': 'Usage', 'backup.clearAll': 'Clear All Data',
        'lock.title': 'App Lock', 'lock.choose': 'Choose unlock method', 'lock.fingerprint': 'Fingerprint', 'lock.pattern': 'Pattern', 'lock.password': 'Password',
        'about.title': 'About', 'about.version': 'Version', 'about.desc': 'Record every item and day',
        'date.start': 'Start', 'date.weekday.0': 'Sunday', 'date.weekday.1': 'Monday', 'date.weekday.2': 'Tuesday', 'date.weekday.3': 'Wednesday', 'date.weekday.4': 'Thursday', 'date.weekday.5': 'Friday', 'date.weekday.6': 'Saturday'
    },
    'de': {
        'nav.home': 'Startseite', 'nav.items': 'Artikel', 'nav.gift': 'Geschenke', 'nav.important': 'Termine',
        'home.bought': 'Ich habe so viel gekauft 😱', 'home.gift': 'Soziale Etikette 😮‍💨',
        'home.addItem': 'Artikel', 'home.addGift': 'Geschenk', 'home.addImportant': 'Termin', 'home.addBook': 'Buch',
        'home.bookTitle': 'Heute gelesen? 📖', 'home.clickAddBook': 'Klicken um Buch hinzuzufügen', 'home.noActiveBook': 'Kein Buch ausgewählt',
        'home.upcoming': 'Bald passiert 👇', 'home.daysAfter': 'Tage übrig',
        'btn.save': 'Speichern', 'btn.edit': 'Bearbeiten', 'btn.delete': 'Löschen', 'btn.cancel': 'Abbrechen', 'btn.confirm': 'OK', 'btn.close': 'Schließen',
        'tip.today': 'Heute', 'tip.selectDate': 'Tippen zum Auswählen', 'tip.remark': 'Weitere Infos...',
        'alert.title': 'Tipp', 'alert.confirmDel': 'Löschen bestätigen',
        'item.title': 'Artikel hinzufügen', 'item.edit': 'Artikel bearbeiten', 'item.save': 'Änderungen speichern', 'item.img': 'Artikelbild', 'item.upload': 'Hochladen',
        'item.basic': 'Basisinformationen', 'item.name': 'Artikelname', 'item.namePh': 'z.B. Haartrockner', 'item.qty': 'Menge', 'item.category': 'Kategorie',
        'item.other': 'Weitere Infos', 'item.acquire': 'Erwerbsart', 'item.priceDate': 'Preis / Datum', 'item.price': 'Preis', 'item.buyDate': 'Kaufdatum',
        'item.expiry': 'Haltbarkeitsdatum', 'item.warranty': 'Garantie', 'item.remark': 'Notiz', 'item.status': 'Status',
        'item.held': 'Gehalten', 'item.paused': 'Pausiert', 'item.removed': 'Entfernt',
        'item.all': 'Alle Artikel', 'item.search': 'Artikel suchen...', 'item.heldTitle': 'Gehalten', 'item.expiring': 'Läuft ab', 'item.warrantyTitle': 'Garantie',
        'item.filterAll': 'Alle', 'item.filterExpired': 'Abgelaufen', 'item.filterWarrantyExpired': 'Garantie abgelaufen', 'item.filterHeld': 'Gehalten', 'item.filterPaused': 'Pausiert', 'item.filterRemoved': 'Entfernt',
        'item.catAll': 'Alle Kategorien', 'item.sortDefault': 'Standard', 'item.sortPurchase': 'Kaufdatum', 'item.sortPrice': 'Preis', 'item.sortName': 'Name', 'item.sortExpiry': 'Ablauf',
        'item.addBtn': 'Hinzufügen', 'item.noMatch': 'Keine Artikel gefunden',
        'gift.title': 'Geschenk hinzufügen', 'gift.person': 'Person', 'gift.personPh': 'z.B. Max', 'gift.type': 'Typ', 'gift.give': 'Geben', 'gift.receive': 'Erhalten',
        'gift.event': 'Ereignis', 'gift.eventPh': 'Oder Ereignis eingeben', 'gift.amount': 'Betrag', 'gift.amountPh': 'Benutzerdefiniert', 'gift.time': 'Zeit', 'gift.location': 'Ort', 'gift.locationPh': 'z.B. Berlin',
        'gift.photos': 'Fotos (Max 3)', 'gift.saveRecord': 'Speichern', 'gift.listTitle': 'Geschenkliste', 'gift.searchPh': 'Suchen...',
        'gift.catAll': 'Alle Kategorien', 'gift.sortDate': 'Datum', 'gift.sortAmount': 'Betrag', 'gift.sortName': 'Name', 'gift.addRecord': 'Hinzufügen', 'gift.noMatch': 'Keine Einträge gefunden',
        'gift.detail': 'Geschenkdetail', 'gift.addEvent': 'Ereignis hinzufügen', 'gift.saveEvent': 'Speichern', 'gift.eventDetail': 'Ereignisdetail',
        'date.title': 'Termin hinzufügen', 'date.person': 'Person', 'date.personPh': 'z.B. Ich selbst', 'date.time': 'Zeit', 'date.event': 'Ereignis', 'date.eventPh': 'z.B. Jubiläum',
        'date.level': 'Wichtigkeit', 'date.remind': 'Erinnern', 'date.important': 'Wichtig', 'date.memory': 'Erinnerung', 'date.saveDate': 'Speichern', 'date.detail': 'Termindetail',
        'date.calTitle': 'Wichtige Termine', 'date.searchPh': 'Termine suchen...', 'date.next7': 'Nächste 7 Tage', 'date.today': 'Heute', 'date.tomorrow': 'Morgen', 'date.dayAfter': 'Übermorgen',
        'date.week0': 'So', 'date.week1': 'Mo', 'date.week2': 'Di', 'date.week3': 'Mi', 'date.week4': 'Do', 'date.week5': 'Fr', 'date.week6': 'Sa',
        'book.editTitle': 'Buchdetail', 'book.heroText': 'Reise aufzeichnen', 'book.name': 'Buchtitel', 'book.startTime': 'Startdatum', 'book.startPh': 'Tippen (Erforderlich)',
        'book.totalPages': 'Seiten gesamt', 'book.currentPages': 'Aktuelle Seite', 'book.estimate': 'Geschätzte Tage', 'book.spent': 'Verbrachte Tage', 'book.spentPh': 'Auto-berechnet',
        'book.save': 'Speichern', 'book.listTitle': 'Meine Bücher', 'book.searchPh': 'Bücher suchen...', 'book.filterReading': 'Lesend', 'book.filterDone': 'Gelesen',
        'book.sortName': 'Name', 'book.sortProgress': 'Fortschritt', 'book.addBook': 'Buch hinzufügen', 'book.viewTitle': 'Buchdetail', 'book.noMatch': 'Keine Bücher. Tippen +.',
        'book.timeInfo': 'Zeitinfo', 'book.readProgress': 'Fortschritt', 'book.status': 'Status', 'book.reading': 'Lesend', 'book.finished': 'Gelesen',
        'drawer.profile': 'Profil', 'drawer.theme': 'Thema', 'drawer.backup': 'Backup', 'drawer.lock': 'App-Sperre', 'drawer.about': 'Über',
        'profile.nick': 'Spitzname', 'profile.sign': 'Signatur', 'profile.noNick': 'Nicht gesetzt', 'profile.clickSign': 'Tippen zum Einstellen',
        'theme.title': 'Thema', 'theme.preference': 'Einstellungen', 'theme.lang': 'Sprache', 'theme.startpage': 'Startseite',
        'theme.color': 'Themenfarbe', 'theme.dark': 'Dunkelmodus', 'theme.wallpaper': 'Hintergrundbild', 'theme.uploadWallpaper': 'Hochladen', 'theme.clearWallpaper': 'Löschen',
        'theme.icon': 'Benutzerdefinierte Symbole', 'theme.uploadIcon': 'Bild hochladen', 'theme.resetIcon': 'Zurücksetzen',
        'backup.title': 'Backup', 'backup.export': 'Daten exportieren', 'backup.import': 'Importieren', 'backup.storage': 'Speicher', 'backup.usage': 'Nutzung', 'backup.clearAll': 'Alles löschen',
        'lock.title': 'App-Sperre', 'lock.choose': 'Methode wählen', 'lock.fingerprint': 'Fingerabdruck', 'lock.pattern': 'Muster', 'lock.password': 'Passwort',
        'about.title': 'Über', 'about.version': 'Version', 'about.desc': 'Jeden Artikel und Tag aufzeichnen',
        'date.start': 'Start', 'date.weekday.0': 'Sonntag', 'date.weekday.1': 'Montag', 'date.weekday.2': 'Dienstag', 'date.weekday.3': 'Mittwoch', 'date.weekday.4': 'Donnerstag', 'date.weekday.5': 'Freitag', 'date.weekday.6': 'Samstag'
    }
};

// ================= 自动翻译字典（中文原文 → 译文）=================
const I18N = {
    'en': {
        '我的生活': 'My Life',
        '我居然买了这么多 😱': 'I bought so much 😱',
        '本月支出 ¥ 0.00': 'Monthly Spend ¥ 0.00',
        '这都是人情世故啊 😮‍💨': 'Social etiquette 😮‍💨',
        '物品': 'Item', '随礼': 'Gift', '重要日期': 'Important Dates', '书本': 'Book',
        '今天看书了嘛~ 📖': 'Read today? 📖',
        '点击添加一本正在读的书': 'Click to add a reading book',
        '还没有选择要展示的书，去书本列表勾选': 'No book selected',
        '马上要发生 👇': 'Happening soon 👇', '天后': 'days left',
        '保存': 'Save', '编辑': 'Edit', '删除': 'Delete',
        '取消': 'Cancel', '确定': 'OK', '关闭': 'Close',
        '今日': 'Today', '点击选择': 'Tap to select', '点击选择（必填）': 'Tap to select (Required)',
        '其他需要记录的信息...': 'Other info...',
        '提示': 'Tip', '确认删除': 'Confirm Delete', '确定要删除吗？': 'Are you sure?',
        '请输入': 'Please input', '内容': 'Content',
        '上传': 'Upload', '备注': 'Remark',
        '名称': 'Name', '价格': 'Price', '日期': 'Date', '金额': 'Amount', '姓名': 'Name',
        '默认': 'Default', '全部': 'All', '其他': 'Other',
        '类型': 'Type', '时间': 'Time', '地点': 'Location', '事件': 'Event',
        '状态': 'Status', '筛选': 'Filter', '已结束': 'Ended', '未结束': 'Ongoing',
        '切换排序方向': 'Toggle sort direction', '切换视图': 'Toggle view',
        '添加物品': 'Add Item', '编辑物品': 'Edit Item', '保存修改': 'Save Changes',
        '物品图片': 'Item Image', '基本信息': 'Basic Info',
        '物品名称': 'Item Name', '例如：吹风机': 'e.g. Hair dryer',
        '分类': 'Category', '其他信息': 'Other Info', '获取方式': 'Acquire Method',
        '购买价格 / 日期': 'Price / Date', '购买日期': 'Purchase Date',
        '物品保质期': 'Expiry Date', '物品质保期': 'Warranty Date',
        '物品状态': 'Status',
        '持有中': 'Held', '暂离中': 'Paused', '已移除': 'Removed',
        '全部物品': 'All Items', '搜索物品名称或分类...': 'Search items...',
        '持有': 'Held', '快过期': 'Expiring', '快过保': 'Warranty Exp',
        '已过期': 'Expired', '已过保': 'Warranty Expired',
        '暂离': 'Paused', '移除': 'Removed', '全部分类': 'All Categories',
        '过期倒计时': 'Expiry', '暂无匹配的物品': 'No matching items',
        '删除物品': 'Delete Item', '物品分布': 'Item Distribution',
        '家电': 'Home Appliances', '电子产品': 'Electronics',
        '食品': 'Food', '厨房食材': 'Kitchen Ingredients',
        '护肤品': 'Skincare', '化妆品': 'Cosmetics',
        '生活用品': 'Daily Goods', '学习资料': 'Study Materials', '手办': 'Figures',
        '网购': 'Online', '线下': 'Offline', '赠送': 'Gift', '白嫖': 'Free',
        '随礼记录': 'Gift Records', '搜索随礼人、事件或备注...': 'Search...',
        '收礼': 'Receive', '添加记录': 'Add Record',
        '增加随礼': 'Add Gift', '随礼人': 'Person', '例如：张三': 'e.g. John',
        '事件信息': 'Event Info', '随礼事件': 'Event',
        '结婚': 'Marriage', '生子': 'Birth', '满月': 'Full Moon',
        '订婚': 'Engagement', '乔迁': 'Moving', '晚辈': 'Junior',
        '寿宴': 'Banquet', '升学': 'Graduation',
        '或直接输入事件': 'Or input event', '礼金数额': 'Amount',
        '自定义金额': 'Custom amount',
        '例如：北京': 'e.g. Beijing', '例如：上海': 'e.g. Shanghai',
        '照片（最多 3 张）': 'Photos (Max 3)', '保存记录': 'Save Record',
        '随礼详情': 'Gift Detail', '事件详情': 'Event Detail',
        '增加随礼事件': 'Add Gift Event', '保存事件': 'Save Event',
        '暂无匹配的记录': 'No matching records',
        '删除随礼记录': 'Delete Gift Record', '删除事件': 'Delete Event',
        '随礼分布': 'Gift Distribution',
        '增加重要日期': 'Add Important Date', '日期信息': 'Date Info',
        '主人公': 'Person', '例如：我自己、爸爸': 'e.g. Myself, Dad',
        '例如：结婚纪念日': 'e.g. Anniversary',
        '重要程度': 'Level', '提醒': 'Remind', '重要': 'Important', '纪念': 'Memory',
        '保存日期': 'Save Date', '重要日期详情': 'Date Detail',
        '搜索重要日期...': 'Search dates...', '接下来 7 天': 'Next 7 Days',
        '今天': 'Today', '明天': 'Tomorrow', '后天': 'Day After',
        '日': 'Sun', '一': 'Mon', '二': 'Tue', '三': 'Wed', '四': 'Thu', '五': 'Fri', '六': 'Sat',
        '搜索...': 'Search...', '暂无匹配的重要日期': 'No matching dates',
        '删除重要日期': 'Delete Important Date',
        '暂无': 'None', '未记录': 'Not recorded', '休': 'Off',
        '重要事件': 'Important Events', '日记 / 便签': 'Diary / Note',
        '书籍详情': 'Book Detail', '记录你的阅读旅程': 'Record your reading journey',
        '书名': 'Book Name', '开始阅读时间': 'Start Date',
        '总页数': 'Total Pages', '目前页数': 'Current Pages',
        '预计用时（天）': 'Est. Days',
        '已用时（天，自动计算）': 'Spent Days (Auto)',
        '填完开始时间后自动计算': 'Auto-calculated',
        '我的书本': 'My Books', '搜索书名...': 'Search books...',
        '在读': 'Reading', '读完': 'Finished', '进度': 'Progress',
        '添加书本': 'Add Book', '书本详情': 'Book Detail',
        '已读完': 'Finished', '阅读中': 'Reading',
        '还没有添加书本，点右下角 + 添加': 'No books yet. Tap + to add.',
        '时间信息': 'Time Info', '开始阅读': 'Start Reading',
        '预计用时': 'Est. Days', '已用时': 'Spent Days',
        '阅读进度': 'Reading Progress',
        '个人中心': 'Profile', '主题个性化': 'Theme',
        '数据与备份': 'Backup', '应用锁': 'App Lock', '关于': 'About',
        '未设置昵称': 'Not set', '点击设置个性签名': 'Tap to set',
        '昵称': 'Nickname', '签名': 'Sign', '改': 'Edit',
        '偏好设置': 'Preferences', '语言': 'Language',
        '默认启动页': 'Start Page', '主页': 'Home',
        '主题色': 'Theme Color', '深夜模式': 'Dark Mode',
        '导航图标定制': 'Custom Icons',
        '上传一张图片，从中选择 4 个区域，分别作为底部导航的图标': 'Upload an image and select 4 areas for nav icons',
        '上传图标图': 'Upload Image', '重置图标': 'Reset',
        '点击图片中的区域来选择（依次为：主页、物品、随礼、重要日期）': 'Tap areas (Home, Items, Gifts, Dates)',
        '已选择：': 'Selected: ',
        '备份与迁移': 'Backup & Migrate',
        '导出全部数据（JSON）': 'Export Data (JSON)', '导入数据': 'Import Data',
        '存储与清理': 'Storage', '占用空间': 'Usage', '清空所有数据': 'Clear All Data',
        '选择解锁方式（三选一）': 'Choose unlock method',
        '指纹解锁': 'Fingerprint', '图形解锁': 'Pattern', '密码解锁': 'Password',
        '版本': 'Version',
        '记录你的每一件物品与每一天': 'Record every item and day',
        '选择年份': 'Select Year', '选择月份': 'Select Month', '选择日期': 'Select Day',
        '选择模板': 'Choose Template', '日记': 'Diary', '便签': 'Note',
        '绘制解锁图案': 'Draw Unlock Pattern',
        '请连接至少 4 个点': 'Connect at least 4 dots',
        '重绘': 'Redraw', '确认使用': 'Use',
        '拖动图片选择显示区域：': 'Drag to select area:',
        '拖动图片选择头像区域（正方形）：': 'Drag to select avatar area:',
        '应用已锁定': 'App Locked', '请输入4位密码': 'Enter 4-digit password',
        '解锁': 'Unlock', '点击指纹模拟解锁': 'Tap fingerprint to unlock',
        '请绘制图案解锁': 'Draw pattern to unlock',
        '写日记': 'Write Diary', '写便签': 'Write Note',
        '标题（可不填）': 'Title (optional)', '写点什么...': 'Write something...',
        '删除这条记录': 'Delete this record',
        '已删除': 'Deleted', '保存成功！': 'Saved!', '修改成功！': 'Updated!',
        '请填写物品名称！': 'Please enter item name!',
        '请选择分类！': 'Please select category!',
        '图片读取失败，请换一张': 'Image read failed, try another',
        '已取消应用锁': 'App lock disabled',
        '密码锁设置成功！': 'Password lock set!',
        '指纹锁已启用（模拟）': 'Fingerprint lock enabled (simulated)',
        '请输入4位数字密码': 'Please enter 4-digit password',
        '两次密码不一致': 'Passwords do not match',
        '请设置密码（4位数字）': 'Set password (4 digits)',
        '请再次输入密码': 'Enter password again',
        '导入成功！': 'Imported!', '文件格式错误！': 'Invalid file format!',
        '已清空': 'Cleared',
        '导入会覆盖当前数据，是否继续？': 'Import will overwrite current data. Continue?',
        '清空数据': 'Clear Data',
        '确定要清空所有数据吗？此操作不可恢复！': 'Clear all data? Cannot be undone!',
        '头像已更新！': 'Avatar updated!', '壁纸已应用！': 'Wallpaper applied!',
        '最多选择 4 个区域': 'Max 4 areas',
        '确定要重置自定义图标吗？': 'Reset custom icons?',
        '修改昵称': 'Edit Nickname', '修改个性签名': 'Edit Signature',
        '请填写随礼人、事件和金额！': 'Please fill person, event and amount!',
        '请填写事件和金额！': 'Please fill event and amount!',
        '事件添加成功！': 'Event added!',
        '请填写日期和事件！': 'Please fill date and event!',
        '请选择开始阅读时间': 'Please select start date',
        '请填写书名': 'Please enter book name',
        '删除书本': 'Delete Book', '删除日记': 'Delete Diary',
        '这一天还没有记录': 'No records for this day',
        '暂无数据': 'No data',
        '{n} 件': '{n} items',
        '暂离 {n}': 'Paused {n}',
        '还有{n}天过期': '{n} days until expiry',
        '已过期{n}天': 'Expired {n} days ago',
        '还有{n}天过保': '{n} days until warranty ends',
        '已过保{n}天': 'Warranty expired {n} days ago',
        '{n} 笔': '{n} records',
        '{n}天后': 'in {n} days',
        '已过去{n}天': '{n} days ago',
        '日记 {n} 篇': '{n} diaries',
        '已用 {n} 天': '{n} days spent',
        '（已读完）': '(finished)',
        '计划剩余 {n} 天': 'planned {n} days left',
        '{cur}/{total}页 ({percent}%)': '{cur}/{total} pages ({percent}%)',
        '进度 {n}%': 'Progress {n}%',
        '{cur}/{total} 页': '{cur}/{total} pages',
        '{n} 天': '{n} days',
        '{n} 页': '{n} pages',
        '{n}年': '{n}',
        '{n}月': 'Month {n}',
        '{n}日': 'Day {n}',
        '{y}年{m}月{day}日': '{m}/{day}/{y}',
        '星期{day}': 'Weekday {day}',
        '{y}年{m}月': '{m}/{y}',
        '周{n}': 'Week {n}',
        '礼金': 'Amount',
        '点右上角': 'Tap top-right',
        '添加日记或便签': '+ to add diary or note',
        '编辑日记': 'Edit Diary',
        '编辑便签': 'Edit Note',
        '编辑书本': 'Edit Book',
        '1. 选择年份': '1. Select Year',
        '{y}年 2. 选择月份': '{y} - 2. Select Month',
        '{y}年{m}月 3. 选择日期': '{y}-{m} - 3. Select Day',
        '解锁成功': 'Unlocked',
        '密码错误': 'Wrong password',
        '指纹验证成功': 'Fingerprint verified',
        '至少连接 4 个点': 'Connect at least 4 dots',
        '图案错误，请重试': 'Wrong pattern, try again',
        '⚠️ 至少连接 4 个点': '⚠️ At least 4 dots',
        '请再次绘制确认': 'Draw again to confirm',
        '✅ 图形锁设置成功！': '✅ Pattern lock set!',
        '❌ 两次不一致，请重新绘制': '❌ Mismatch, try again',
        '已经设置了图形锁，是否重新设置？\n点“取消”则保持不变': 'Pattern lock already set. Reset?\nTap Cancel to keep.',
        '确定要重置自定义图标吗？': 'Reset custom icons?',
        '确定删除这件物品吗？': 'Delete this item?',
        '确定删除这个人吗？他/她的所有随礼记录都会一起删除。': 'Delete this person and all gift records?',
        '确定删除这条事件吗？': 'Delete this event?',
        '确定删除这个日期吗？': 'Delete this date?',
        '确定删除这本书吗？': 'Delete this book?',
        '确定删除这条记录吗？': 'Delete this record?',
        '今日心情': 'Today\'s Mood',
        '感恩日记': 'Gratitude Diary',
        '反思日记': 'Reflection Diary',
        '旅行日记': 'Travel Diary',
        '自由记录': 'Free Record',
        '待办清单': 'To-Do List',
        '购物清单': 'Shopping List',
        '灵感记录': 'Idea Notes',
        '提醒事项': 'Reminders',
        '空白便签': 'Blank Note',
        '元旦': 'New Year', '情人节': 'Valentine\'s', '妇女节': 'Women\'s Day',
        '植树节': 'Arbor Day', '愚人节': 'April Fools', '劳动节': 'Labor Day',
        '青年节': 'Youth Day', '儿童节': 'Children\'s Day', '建党节': 'Party Day',
        '建军节': 'Army Day', '教师节': 'Teachers\' Day', '国庆节': 'National Day',
        '平安夜': 'Christmas Eve', '圣诞节': 'Christmas',
        '确定删除「{name}」吗？删除后无法恢复。': 'Delete "{name}"? Cannot be undone.',
        '确定删除「{name}」吗？他/她的所有随礼记录都会一起删除。': 'Delete "{name}"? All gift records will be removed.',
        '确定删除「{name}」这条事件吗？': 'Delete event "{name}"?',
        '确定删除「{name}」吗？': 'Delete "{name}"?',
        '确定删除这条{type}吗？': 'Delete this {type}?',
        '生日': 'Birthday',
        '纪念日': 'Anniversary', // 顺手加上常用的，防止以后再漏
        '周日': 'Sun', '周一': 'Mon', '周二': 'Tue', '周三': 'Wed',
        '周四': 'Thu', '周五': 'Fri', '周六': 'Sat',
        '图形锁设置成功！': 'Pattern lock set!',
        '启用指纹解锁': 'Enable Fingerprint',
        '是否启用指纹解锁？（模拟）': 'Enable fingerprint unlock? (simulated)',
        '日期错误': 'Date error',
        '内容不能为空': 'Content cannot be empty',
        '全部图书': 'All Books',
        '篇': 'items',
        '详情': 'Detail',
        '选择': 'Select',
        '已选 {n} 项': '{n} selected',
        '批量删除': 'Delete Selected',
        '改状态': 'Change Status',
        '确定删除选中的 {n} 项吗？删除后无法恢复。': 'Delete {n} selected items? Cannot be undone.',
        '已改为「{status}」': 'Changed to "{status}"',
        '返回': 'Back',
    },
    'de': {
        '我的生活': 'Mein Leben',
        '我居然买了这么多 😱': 'Ich habe so viel gekauft 😱',
        '本月支出 ¥ 0.00': 'Monatsausgaben ¥ 0.00',
        '这都是人情世故啊 😮‍💨': 'Soziale Etikette 😮‍💨',
        '物品': 'Artikel', '随礼': 'Geschenk', '重要日期': 'Wichtige Termine', '书本': 'Buch',
        '今天看书了嘛~ 📖': 'Heute gelesen? 📖',
        '点击添加一本正在读的书': 'Klicken um Buch hinzuzufügen',
        '还没有选择要展示的书，去书本列表勾选': 'Kein Buch ausgewählt',
        '马上要发生 👇': 'Bald passiert 👇', '天后': 'Tage übrig',
        '保存': 'Speichern', '编辑': 'Bearbeiten', '删除': 'Löschen',
        '取消': 'Abbrechen', '确定': 'OK', '关闭': 'Schließen',
        '今日': 'Heute', '点击选择': 'Tippen zum Auswählen',
        '点击选择（必填）': 'Tippen (Erforderlich)',
        '其他需要记录的信息...': 'Weitere Infos...',
        '提示': 'Tipp', '确认删除': 'Löschen bestätigen',
        '确定要删除吗？': 'Wirklich löschen?',
        '请输入': 'Bitte eingeben', '内容': 'Inhalt',
        '上传': 'Hochladen', '备注': 'Notiz',
        '名称': 'Name', '价格': 'Preis', '日期': 'Datum', '金额': 'Betrag', '姓名': 'Name',
        '默认': 'Standard', '全部': 'Alle', '其他': 'Andere',
        '类型': 'Typ', '时间': 'Zeit', '地点': 'Ort', '事件': 'Ereignis',
        '状态': 'Status', '筛选': 'Filter',
        '已结束': 'Beendet', '未结束': 'Laufend',
        '切换排序方向': 'Sortierrichtung', '切换视图': 'Ansicht wechseln',
        '添加物品': 'Artikel hinzufügen', '编辑物品': 'Artikel bearbeiten',
        '保存修改': 'Änderungen speichern',
        '物品图片': 'Artikelbild', '基本信息': 'Basisinformationen',
        '物品名称': 'Artikelname', '例如：吹风机': 'z.B. Haartrockner',
        '分类': 'Kategorie', '其他信息': 'Weitere Infos',
        '获取方式': 'Erwerbsart', '购买价格 / 日期': 'Preis / Datum',
        '购买日期': 'Kaufdatum', '物品保质期': 'Haltbarkeitsdatum',
        '物品质保期': 'Garantie', '物品状态': 'Status',
        '持有中': 'Gehalten', '暂离中': 'Pausiert', '已移除': 'Entfernt',
        '全部物品': 'Alle Artikel', '搜索物品名称或分类...': 'Artikel suchen...',
        '持有': 'Gehalten', '快过期': 'Läuft ab', '快过保': 'Garantie',
        '已过期': 'Abgelaufen', '已过保': 'Garantie abgelaufen',
        '暂离': 'Pausiert', '移除': 'Entfernt', '全部分类': 'Alle Kategorien',
        '过期倒计时': 'Ablauf', '暂无匹配的物品': 'Keine Artikel gefunden',
        '删除物品': 'Artikel löschen', '物品分布': 'Artikelverteilung',
        '家电': 'Haushaltsgeräte', '电子产品': 'Elektronik',
        '食品': 'Lebensmittel', '厨房食材': 'Küchenzutaten',
        '护肤品': 'Hautpflege', '化妆品': 'Kosmetik',
        '生活用品': 'Alltagsartikel', '学习资料': 'Lernmaterialien', '手办': 'Figuren',
        '网购': 'Online', '线下': 'Offline', '赠送': 'Geschenk', '白嫖': 'Kostenlos',
        '随礼记录': 'Geschenkliste', '搜索随礼人、事件或备注...': 'Suchen...',
        '收礼': 'Erhalten', '添加记录': 'Hinzufügen',
        '增加随礼': 'Geschenk hinzufügen', '随礼人': 'Person', '例如：张三': 'z.B. Max',
        '事件信息': 'Ereignisinfo', '随礼事件': 'Ereignis',
        '结婚': 'Hochzeit', '生子': 'Geburt', '满月': 'Vollmond',
        '订婚': 'Verlobung', '乔迁': 'Umzug', '晚辈': 'Junior',
        '寿宴': 'Geburtstagsbankett', '升学': 'Schulabschluss',
        '或直接输入事件': 'Oder Ereignis eingeben',
        '礼金数额': 'Betrag', '自定义金额': 'Benutzerdefiniert',
        '例如：北京': 'z.B. Berlin', '例如：上海': 'z.B. Shanghai',
        '照片（最多 3 张）': 'Fotos (Max 3)', '保存记录': 'Speichern',
        '随礼详情': 'Geschenkdetail', '事件详情': 'Ereignisdetail',
        '增加随礼事件': 'Ereignis hinzufügen', '保存事件': 'Speichern',
        '暂无匹配的记录': 'Keine Einträge gefunden',
        '删除随礼记录': 'Geschenk löschen', '删除事件': 'Ereignis löschen',
        '随礼分布': 'Geschenkverteilung',
        '增加重要日期': 'Termin hinzufügen', '日期信息': 'Termininfo',
        '主人公': 'Person', '例如：我自己、爸爸': 'z.B. Ich selbst',
        '例如：结婚纪念日': 'z.B. Jubiläum',
        '重要程度': 'Wichtigkeit', '提醒': 'Erinnern', '重要': 'Wichtig', '纪念': 'Erinnerung',
        '保存日期': 'Speichern', '重要日期详情': 'Termindetail',
        '搜索重要日期...': 'Termine suchen...', '接下来 7 天': 'Nächste 7 Tage',
        '今天': 'Heute', '明天': 'Morgen', '后天': 'Übermorgen',
        '日': 'So', '一': 'Mo', '二': 'Di', '三': 'Mi', '四': 'Do', '五': 'Fr', '六': 'Sa',
        '搜索...': 'Suchen...', '暂无匹配的重要日期': 'Keine Termine gefunden',
        '删除重要日期': 'Termin löschen',
        '暂无': 'Keine', '未记录': 'Nicht erfasst', '休': 'Frei',
        '重要事件': 'Wichtige Ereignisse', '日记 / 便签': 'Tagebuch / Notiz',
        '书籍详情': 'Buchdetail', '记录你的阅读旅程': 'Reise aufzeichnen',
        '书名': 'Buchtitel', '开始阅读时间': 'Startdatum',
        '总页数': 'Seiten gesamt', '目前页数': 'Aktuelle Seite',
        '预计用时（天）': 'Geschätzte Tage',
        '已用时（天，自动计算）': 'Verbrachte Tage',
        '填完开始时间后自动计算': 'Auto-berechnet',
        '我的书本': 'Meine Bücher', '搜索书名...': 'Bücher suchen...',
        '在读': 'Lesend', '读完': 'Gelesen', '进度': 'Fortschritt',
        '添加书本': 'Buch hinzufügen', '书本详情': 'Buchdetail',
        '已读完': 'Gelesen', '阅读中': 'Lesend',
        '还没有添加书本，点右下角 + 添加': 'Keine Bücher. Tippen +.',
        '时间信息': 'Zeitinfo', '开始阅读': 'Start',
        '预计用时': 'Geschätzte Tage', '已用时': 'Verbrachte Tage',
        '阅读进度': 'Fortschritt',
        '个人中心': 'Profil', '主题个性化': 'Thema',
        '数据与备份': 'Backup', '应用锁': 'App-Sperre', '关于': 'Über',
        '未设置昵称': 'Nicht gesetzt', '点击设置个性签名': 'Tippen zum Einstellen',
        '昵称': 'Spitzname', '签名': 'Signatur', '改': 'Bearb.',
        '偏好设置': 'Einstellungen', '语言': 'Sprache',
        '默认启动页': 'Startseite', '主页': 'Startseite',
        '主题色': 'Themenfarbe', '深夜模式': 'Dunkelmodus',
        '导航图标定制': 'Symbole anpassen',
        '上传一张图片，从中选择 4 个区域，分别作为底部导航的图标': 'Bild hochladen und 4 Bereiche wählen',
        '上传图标图': 'Bild hochladen', '重置图标': 'Zurücksetzen',
        '点击图片中的区域来选择（依次为：主页、物品、随礼、重要日期）': 'Bereiche tippen (Start, Artikel, Geschenk, Termin)',
        '已选择：': 'Ausgewählt: ',
        '备份与迁移': 'Backup & Migration',
        '导出全部数据（JSON）': 'Daten exportieren', '导入数据': 'Importieren',
        '存储与清理': 'Speicher', '占用空间': 'Nutzung',
        '清空所有数据': 'Alles löschen',
        '选择解锁方式（三选一）': 'Methode wählen',
        '指纹解锁': 'Fingerabdruck', '图形解锁': 'Muster', '密码解锁': 'Passwort',
        '版本': 'Version',
        '记录你的每一件物品与每一天': 'Jeden Artikel und Tag aufzeichnen',
        '选择年份': 'Jahr wählen', '选择月份': 'Monat wählen', '选择日期': 'Tag wählen',
        '选择模板': 'Vorlage wählen', '日记': 'Tagebuch', '便签': 'Notiz',
        '绘制解锁图案': 'Muster zeichnen',
        '请连接至少 4 个点': 'Mindestens 4 Punkte',
        '重绘': 'Neu zeichnen', '确认使用': 'Verwenden',
        '拖动图片选择显示区域：': 'Ziehen zum Auswählen:',
        '拖动图片选择头像区域（正方形）：': 'Ziehen für Avatar:',
        '应用已锁定': 'App gesperrt', '请输入4位密码': '4-stelliges Passwort',
        '解锁': 'Entsperren', '点击指纹模拟解锁': 'Fingerabdruck tippen',
        '请绘制图案解锁': 'Muster zeichnen',
        '写日记': 'Tagebuch schreiben', '写便签': 'Notiz schreiben',
        '标题（可不填）': 'Titel (optional)', '写点什么...': 'Schreiben...',
        '删除这条记录': 'Eintrag löschen',
        '已删除': 'Gelöscht', '保存成功！': 'Gespeichert!', '修改成功！': 'Aktualisiert!',
        '请填写物品名称！': 'Bitte Artikelname eingeben!',
        '请选择分类！': 'Bitte Kategorie wählen!',
        '图片读取失败，请换一张': 'Bild konnte nicht gelesen werden',
        '已取消应用锁': 'App-Sperre deaktiviert',
        '密码锁设置成功！': 'Passwortschutz gesetzt!',
        '指纹锁已启用（模拟）': 'Fingerabdruck aktiviert',
        '请输入4位数字密码': 'Bitte 4-stelliges Passwort eingeben',
        '两次密码不一致': 'Passwörter stimmen nicht überein',
        '请设置密码（4位数字）': 'Passwort setzen (4 Ziffern)',
        '请再次输入密码': 'Passwort erneut eingeben',
        '导入成功！': 'Importiert!', '文件格式错误！': 'Ungültiges Dateiformat!',
        '已清空': 'Geleert',
        '导入会覆盖当前数据，是否继续？': 'Import überschreibt Daten. Fortsetzen?',
        '清空数据': 'Daten löschen',
        '确定要清空所有数据吗？此操作不可恢复！': 'Alle Daten löschen? Nicht rückgängig machbar!',
        '头像已更新！': 'Avatar aktualisiert!', '壁纸已应用！': 'Hintergrund angewendet!',
        '最多选择 4 个区域': 'Max 4 Bereiche',
        '确定要重置自定义图标吗？': 'Symbole zurücksetzen?',
        '修改昵称': 'Spitzname bearbeiten', '修改个性签名': 'Signatur bearbeiten',
        '请填写随礼人、事件和金额！': 'Bitte Person, Ereignis und Betrag ausfüllen!',
        '请填写事件和金额！': 'Bitte Ereignis und Betrag ausfüllen!',
        '事件添加成功！': 'Ereignis hinzugefügt!',
        '请填写日期和事件！': 'Bitte Datum und Ereignis ausfüllen!',
        '请选择开始阅读时间': 'Bitte Startdatum wählen',
        '请填写书名': 'Bitte Buchtitel eingeben',
        '删除书本': 'Buch löschen', '删除日记': 'Tagebuch löschen',
        '这一天还没有记录': 'Keine Einträge für diesen Tag',
        '暂无数据': 'Keine Daten',
        '{n} 件': '{n} Artikel',
        '暂离 {n}': '{n} pausiert',
        '还有{n}天过期': 'Noch {n} Tage bis Ablauf',
        '已过期{n}天': 'Vor {n} Tagen abgelaufen',
        '还有{n}天过保': 'Noch {n} Tage Garantie',
        '已过保{n}天': 'Garantie seit {n} Tagen abgelaufen',
        '{n} 笔': '{n} Einträge',
        '{n}天后': 'in {n} Tagen',
        '已过去{n}天': 'vor {n} Tagen',
        '日记 {n} 篇': '{n} Tagebücher',
        '已用 {n} 天': '{n} Tage verbracht',
        '（已读完）': '(gelesen)',
        '计划剩余 {n} 天': 'geplant noch {n} Tage',
        '{cur}/{total}页 ({percent}%)': '{cur}/{total} Seiten ({percent}%)',
        '进度 {n}%': 'Fortschritt {n}%',
        '{cur}/{total} 页': '{cur}/{total} Seiten',
        '{n} 天': '{n} Tage',
        '{n} 页': '{n} Seiten',
        '{n}年': '{n}',
        '{n}月': 'Monat {n}',
        '{n}日': 'Tag {n}',
        '{y}年{m}月{day}日': '{day}.{m}.{y}',
        '星期{day}': 'Wochentag {day}',
        '{y}年{m}月': '{m}.{y}',
        '周{n}': 'Woche {n}',
        '礼金': 'Betrag',
        '点右上角': 'Tippen oben rechts',
        '添加日记或便签': '+ um Tagebuch/Notiz hinzuzufügen',
        '编辑日记': 'Tagebuch bearbeiten',
        '编辑便签': 'Notiz bearbeiten',
        '编辑书本': 'Buch bearbeiten',
        '1. 选择年份': '1. Jahr wählen',
        '{y}年 2. 选择月份': '{y} - 2. Monat wählen',
        '{y}年{m}月 3. 选择日期': '{y}-{m} - 3. Tag wählen',
        '解锁成功': 'Entsperrt',
        '密码错误': 'Falsches Passwort',
        '指纹验证成功': 'Fingerabdruck verifiziert',
        '至少连接 4 个点': 'Mindestens 4 Punkte verbinden',
        '图案错误，请重试': 'Falsches Muster, erneut versuchen',
        '⚠️ 至少连接 4 个点': '⚠️ Mindestens 4 Punkte',
        '请再次绘制确认': 'Zur Bestätigung erneut zeichnen',
        '✅ 图形锁设置成功！': '✅ Mustersperre gesetzt!',
        '❌ 两次不一致，请重新绘制': '❌ Nicht übereinstimmend, erneut',
        '已经设置了图形锁，是否重新设置？\n点“取消”则保持不变': 'Mustersperre ist gesetzt. Zurücksetzen?\nAbbrechen = beibehalten.',
        '确定要重置自定义图标吗？': 'Benutzerdefinierte Symbole zurücksetzen?',
        '确定删除这件物品吗？': 'Diesen Artikel löschen?',
        '确定删除这个人吗？他/她的所有随礼记录都会一起删除。': 'Diese Person und alle Geschenkeinträge löschen?',
        '确定删除这条事件吗？': 'Dieses Ereignis löschen?',
        '确定删除这个日期吗？': 'Dieses Datum löschen?',
        '确定删除这本书吗？': 'Dieses Buch löschen?',
        '确定删除这条记录吗？': 'Diesen Eintrag löschen?',
        '今日心情': 'Heutige Stimmung',
        '感恩日记': 'Dankbarkeitstagebuch',
        '反思日记': 'Reflexionstagebuch',
        '旅行日记': 'Reisetagebuch',
        '自由记录': 'Freier Eintrag',
        '待办清单': 'Aufgabenliste',
        '购物清单': 'Einkaufsliste',
        '灵感记录': 'Ideennotizen',
        '提醒事项': 'Erinnerungen',
        '空白便签': 'Leere Notiz',
        '元旦': 'Neujahr', '情人节': 'Valentinstag', '妇女节': 'Weltfrauentag',
        '植树节': 'Tag des Baumes', '愚人节': 'Aprilscherz', '劳动节': 'Tag der Arbeit',
        '青年节': 'Tag der Jugend', '儿童节': 'Kindertag', '建党节': 'Parteitag',
        '建军节': 'Tag der Armee', '教师节': 'Tag der Lehrer', '国庆节': 'Nationalfeiertag',
        '平安夜': 'Heiligabend', '圣诞节': 'Weihnachten',
        '确定删除「{name}」吗？删除后无法恢复。': '"{name}" löschen? Nicht rückgängig machbar.',
        '确定删除「{name}」吗？他/她的所有随礼记录都会一起删除。': '"{name}" löschen? Alle Geschenkeinträge werden entfernt.',
        '确定删除「{name}」这条事件吗？': 'Ereignis "{name}" löschen?',
        '确定删除「{name}」吗？': '"{name}" löschen?',
        '确定删除这条{type}吗？': 'Diesen {type} löschen?',
        '生日': 'Geburtstag',
        '纪念日': 'Jahrestag',
        '周日': 'So', '周一': 'Mo', '周二': 'Di', '周三': 'Mi',
        '周四': 'Do', '周五': 'Fr', '周六': 'Sa',
        '图形锁设置成功！': 'Mustersperre gesetzt!',
        '启用指纹解锁': 'Fingerabdruck aktivieren',
        '是否启用指纹解锁？（模拟）': 'Fingerabdruck entsperren? (simuliert)',
        '日期错误': 'Datumsfehler',
        '内容不能为空': 'Inhalt darf nicht leer sein',
        '全部图书': 'Alle Bücher',
        '篇': 'Einträge',
        '详情': 'Detail',
        '选择': 'Auswählen',
        '已选 {n} 项': '{n} ausgewählt',
        '批量删除': 'Auswahl löschen',
        '改状态': 'Status ändern',
        '确定删除选中的 {n} 项吗？删除后无法恢复。': '{n} ausgewählte löschen? Nicht rückgängig machbar.',
        '已改为「{status}」': 'Geändert zu "{status}"',
        '返回': 'Zurück',
    }
};

// T：翻译任意中文，支持 {name} 这种占位符
function T(zh, params) {
    const lang = getTheme().lang || 'zh-CN';
    let text = zh;
    if (lang !== 'zh-CN' && I18N[lang] && I18N[lang][zh]) {
        text = I18N[lang][zh];
    }
    if (params) {
        Object.keys(params).forEach(k => {
            text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), () => params[k]);
        });
    }
    return text;
}

// 自动扫描整个页面，把中文文本节点、placeholder、title 替换成当前语言
let __translating = false;
function translateDOM() {
    const lang = getTheme().lang || 'zh-CN';
    if (lang === 'zh-CN') return;
    const dict = I18N[lang];
    if (!dict || __translating) return;
    __translating = true;

    // 文本节点
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const toTranslate = [];
    let n;
    while ((n = walker.nextNode())) {
        const p = n.parentElement;
        if (!p) continue;
        if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
        if (!/[\u4e00-\u9fa5]/.test(n.textContent)) continue;
        toTranslate.push(n);
    }
    toTranslate.forEach(node => {
        const raw = node.textContent;
        const trimmed = raw.trim();
        if (dict[trimmed]) {
            node.textContent = raw.replace(trimmed, dict[trimmed]);
        }
    });

    // placeholder
    document.querySelectorAll('[placeholder]').forEach(el => {
        const ph = el.placeholder;
        if (ph && /[\u4e00-\u9fa5]/.test(ph) && dict[ph]) {
            el.placeholder = dict[ph];
        }
    });

    // title
    document.querySelectorAll('[title]').forEach(el => {
        const ti = el.title;
        if (ti && /[\u4e00-\u9fa5]/.test(ti) && dict[ti]) {
            el.title = dict[ti];
        }
    });

    __translating = false;
}

function t(key, params) {
    const lang = getTheme().lang || 'zh-CN';
    let text =
        (i18nData[lang] && i18nData[lang][key]) ||
        (i18nData['zh-CN'] && i18nData['zh-CN'][key]) ||
        key;

    if (params) {
        Object.keys(params).forEach(k => {
            text = text.replace(
                new RegExp('\\{' + k + '\\}', 'g'),
                () => params[k]
            );
        });
    }
    return text;
}

function applyLanguage() {
    translateDOM();

    if (typeof renderBookProgress === 'function') renderBookProgress();
    if (typeof renderUpcomingDates === 'function') renderUpcomingDates();

    const activePage = document.querySelector('.page.active')?.id;
    if (activePage === 'page-home' && typeof updateDashboard === 'function') updateDashboard();
    if (activePage === 'page-all-items') {
        if (typeof updateItemStats === 'function') updateItemStats();
        if (typeof renderItemsList === 'function') renderItemsList();
    }
    if (activePage === 'page-gift-record' && typeof renderGiftList === 'function') renderGiftList();
    if (activePage === 'page-important-dates') {
        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof renderUpcoming7Days === 'function') renderUpcoming7Days();
    }
    if (activePage === 'page-book-list' && typeof renderBookList === 'function') renderBookList();

    const importantListView = document.getElementById('important-list-view');
    if (importantListView && importantListView.style.display === 'block' && typeof renderImportantList === 'function') {
        renderImportantList();
    }
    const diaryPanel = document.getElementById('diary-panel');
    if (diaryPanel && diaryPanel.classList.contains('open') && diaryPanelDate && typeof renderDiaryPanel === 'function') {
        renderDiaryPanel(diaryPanelDate);
    }

    // 渲染后再扫一次，翻译动态生成的内容
    translateDOM();
}

// ================= 页面切换 =================
function switchPage(pageId) {
    // 切换页面时，退出所有多选模式
    if (document.body.classList.contains('multi-select-mode')) {
        ['items', 'gift', 'important', 'diary'].forEach(t => {
            if (multiSelectMode[t]) exitMultiSelect(t);
        });
    }

    // 底部导航只在4个主页面显示
    const mainPages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
    const nav = document.querySelector('.bottom-nav');
    if (nav) {
        nav.style.display = mainPages.includes(pageId) ? 'flex' : 'none';
    }    
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
    }
    else if (pageId === 'page-important-dates') {
        document.getElementById('nav-important').classList.add('active');
        backToCalendar();
        renderUpcoming7Days();
        } else if (pageId === 'page-book-list') {
            document.getElementById('nav-home').classList.add('active');
            renderBookList();
        } else if (['page-add','page-add-gift','page-gift-detail','page-add-event','page-add-important','page-important-detail','page-profile','page-theme','page-backup','page-lock','page-about','page-event-detail','page-diary-edit','page-diary-list','page-diary-view','page-book-detail','page-book-view'].includes(pageId)) {
            document.getElementById('nav-home').classList.add('active');
        }
        // 页面主题色
        const themeMap = {
            'page-all-items': '#4A90A4',
            'page-gift-record': '#C0392B',
            'page-important-dates': '#7B68A6',
            'page-book-list': '#8B6F47',
            'page-book-view': '#8B6F47',
            'page-book-detail': '#8B6F47'
        };
        const pageColor = themeMap[pageId] || 'var(--primary)';
        document.body.style.setProperty('--page-color', pageColor);
        document.body.style.setProperty('--nav-active-color', pageColor);
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
    document.getElementById('drawer-name').textContent = p.nickname || T('未设置昵称');
    document.getElementById('drawer-sign').textContent = p.sign || T('点击设置个性签名');
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
    document.getElementById('profile-nickname-display').textContent = p.nickname || T('未设置昵称');
    document.getElementById('profile-sign-display').textContent = p.sign || T('点击设置个性签名');
    if (p.avatar) document.getElementById('profile-avatar-img').src = p.avatar;
}
function uploadAvatar(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => compressImage(e.target.result, 800, (b64) => {
        cropTarget = 'avatar';
        cropImgSrc = b64;
        showCropWindow();
    });
    reader.readAsDataURL(input.files[0]);
}
function editField(field) {
    const p = getProfile();
    if (field === 'nickname') {
        showPrompt(T('修改昵称'), p.nickname || '', (v) => {
            p.nickname = v.trim(); saveProfile(p); loadProfile();
        });
    } else {
        showPrompt(T('修改个性签名'), p.sign || '', (v) => {
            p.sign = v.trim(); saveProfile(p); loadProfile();
        });
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
function saveSetting(k, v) {
    const theme = getTheme();
    theme[k] = v;
    saveTheme(theme);
    if (k === 'lang') location.reload();
}

function setThemeColor(c) { const t = getTheme(); t.color = c; saveTheme(t); applyTheme(); }
function toggleDarkMode(on) { const t = getTheme(); t.dark = on; saveTheme(t); applyTheme(); }
function uploadWallpaper(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        compressImage(e.target.result, 1200, (b64) => {
            cropTarget = 'wallpaper';
            cropImgSrc = b64;
            showCropWindow();
        });
    };
    reader.readAsDataURL(input.files[0]);
}

function showCropWindow() {
    const overlay = document.getElementById('crop-overlay');
    const win = document.getElementById('wallpaper-crop-window');
    const img = document.getElementById('wallpaper-crop-img');
    const border = document.getElementById('crop-border');
    overlay.style.display = 'flex';

    // 根据裁剪目标设置窗口尺寸
        if (cropTarget === 'avatar') {
        win.style.width = '240px';
        win.style.height = '240px';
        win.style.borderRadius = '50%';
        if (border) { border.style.borderRadius = '50%'; }
    } else {
        win.style.width = '220px';
        win.style.height = '390px';
        win.style.borderRadius = '16px';
        if (border) { border.style.borderRadius = '16px'; }
    }
        const tipEl = document.getElementById('crop-tip-text');
    if (tipEl) {
        tipEl.textContent = cropTarget === 'avatar' ? T('拖动图片选择头像区域（正方形）：') : T('拖动图片选择显示区域：');
    }

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

    // 输出尺寸
    let outW, outH;
    if (cropTarget === 'avatar') {
        outW = 200;
        outH = 200;
    } else {
        const outputScale = 2;
        const maxW = 800;
        const scale = Math.min(outputScale, maxW / winW);
        outW = Math.round(winW * scale);
        outH = Math.round(winH * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');

    const srcX = (-cropImgX) * (cropImgNaturalW / cropImgDisplayW);
    const srcY = (-cropImgY) * (cropImgNaturalH / cropImgDisplayH);
    const srcW = winW * (cropImgNaturalW / cropImgDisplayW);
    const srcH = winH * (cropImgNaturalH / cropImgDisplayH);

    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);

        if (cropTarget === 'avatar') {
            const p = getProfile();
            p.avatar = croppedBase64;
            saveProfile(p);
            const avatarImg = document.getElementById('profile-avatar-img');
            if (avatarImg) avatarImg.src = croppedBase64;
            showToast(T('头像已更新！'));
        } else {
            const t = getTheme();
            t.wallpaper = croppedBase64;
            saveTheme(t);
            applyTheme();
            showToast(T('壁纸已应用！'));
        }

        cropImgSrc = null;
        document.getElementById('crop-overlay').style.display = 'none';
    };
    img.src = cropImgSrc;
}

function cancelWallpaper() {
    cropImgSrc = null;
    document.getElementById('crop-overlay').style.display = 'none';
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
        if (selectedIconCells.length >= 4) { showToast(T('最多选择 4 个区域'), 'error'); return; }
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
    if (!confirm(T('确定要重置自定义图标吗？'))) return;
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
        if (localStorage.hasOwnProperty(k)) {
            // 估算字节数：中文按 2 字节，英文按 1 字节
            total += new Blob([k + localStorage[k]]).size;
        }
    }
    document.getElementById('storage-usage').textContent = (total / 1024).toFixed(1) + ' KB';
}
function exportData() {
    const data = {
        items: JSON.parse(localStorage.getItem('myItems') || '[]'),
        giftRecords: JSON.parse(localStorage.getItem('myGiftRecords') || '[]'),
        importantDates: JSON.parse(localStorage.getItem('myImportantDates') || '[]'),
        diaries: JSON.parse(localStorage.getItem('myDiaries') || '[]'),
        books: JSON.parse(localStorage.getItem('myBooks') || '[]'),
        customIcons: JSON.parse(localStorage.getItem('myCustomIcons') || '{}'),
        lock: JSON.parse(localStorage.getItem('myLock') || '{}'),
        profile: getProfile(),
        theme: getTheme()
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
            if (data) {
                showAlert(T('导入数据'), T('导入会覆盖当前数据，是否继续？'), () => {
                    if (data.items) localStorage.setItem('myItems', JSON.stringify(data.items));
                    if (data.giftRecords) localStorage.setItem('myGiftRecords', JSON.stringify(data.giftRecords));
                    if (data.importantDates) localStorage.setItem('myImportantDates', JSON.stringify(data.importantDates));
                    if (data.diaries) localStorage.setItem('myDiaries', JSON.stringify(data.diaries));
                    if (data.books) localStorage.setItem('myBooks', JSON.stringify(data.books));
                    if (data.customIcons) localStorage.setItem('myCustomIcons', JSON.stringify(data.customIcons));
                    if (data.lock) localStorage.setItem('myLock', JSON.stringify(data.lock));
                    if (data.profile) localStorage.setItem('myProfile', JSON.stringify(data.profile));
                    if (data.theme) localStorage.setItem('myTheme', JSON.stringify(data.theme));
                    showToast(T('导入成功！')); location.reload();
                });
            }
        } catch (err) { showToast(T('文件格式错误！'), 'error'); }
    };
    reader.readAsText(input.files[0]);
}

function clearAllData() {
    showAlert(T('清空数据'), T('确定要清空所有数据吗？此操作不可恢复！'), () => {
        ['myItems','myGiftRecords','myImportantDates','myProfile','myTheme',
         'myDiaries','myBooks','myCustomIcons','myLock'].forEach(k => localStorage.removeItem(k));
        showToast(T('已清空')); location.reload();
    });
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
        l.type = '';
        l.password = '';
        l.pattern = '';
        localStorage.setItem('myLock', JSON.stringify(l));
        loadLockSettings();
        showToast(T('已取消应用锁'));
        return;
    }

    if (type === 'password') {
        showPrompt(T('请设置密码（4位数字）'), '', (pwd) => {
            if (!/^\d{4}$/.test(pwd)) { showToast(T('请输入4位数字密码'), 'error'); return; }
            showPrompt(T('请再次输入密码'), '', (confirmPwd) => {
                if (confirmPwd !== pwd) { showToast(T('两次密码不一致'), 'error'); return; }
                l.type = 'password';
                l.password = pwd;
                l.pattern = '';
                localStorage.setItem('myLock', JSON.stringify(l));
                showToast(T('密码锁设置成功！'));
                loadLockSettings();
            });
        });
    } else if (type === 'fingerprint') {
        showAlert(T('启用指纹解锁'), T('是否启用指纹解锁？（模拟）'), () => {
            l.type = 'fingerprint';
            l.password = '';
            l.pattern = '';
            localStorage.setItem('myLock', JSON.stringify(l));
            showToast(T('指纹锁已启用（模拟）'));
            loadLockSettings();
        });
    }
}

// ================= 事件 chips =================
function selectEventChip(type) {
    document.getElementById('gift-event').value = type;
    document.querySelectorAll('#page-add-gift .chip').forEach(c => c.classList.toggle('active', c.dataset.type === type));
}

function selectGiftType(type) {
    selectedGiftType = type;
    // 只影响当前可见的页面，避免两个页面互相干扰
    document.querySelectorAll('#page-add-gift .chip[data-gift-type]').forEach(c => {
        c.classList.toggle('active', c.dataset.giftType === type);
    });
    document.querySelectorAll('#page-add-event .chip[data-gift-type]').forEach(c => {
        c.classList.toggle('active', c.dataset.giftType === type);
    });
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
        div.innerHTML = `<div class="category-icon">${c.icon}</div><div class="category-name">${T(c.name)}</div>`;
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
        div.innerHTML = `<div class="category-icon">${c.icon}</div><div class="category-name">${T(c.name)}</div>`;
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

function deleteItem() {
    if (!editingItemId) return;
    if (!confirm(T('确定删除这件物品吗？'))) return;
    let items = getItems().filter(i => i.id !== editingItemId);
    localStorage.setItem('myItems', JSON.stringify(items));
    editingItemId = null;
    showToast(T('已删除'));
    switchPage('page-all-items');
}

function saveItem() {
    const name = document.getElementById('item-name').value.trim();
    const category = selectedCategoryName;
    const price = document.getElementById('item-price').value;
    const quantity = document.getElementById('item-quantity').value || 1;
    const remark = document.getElementById('item-remark').value.trim();

    if (!name) { showToast(T('请填写物品名称！'), 'error'); return; }
    if (!category) { showToast(T('请选择分类！'), 'error'); return; }

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
            showToast(T('修改成功！'));
        } else {
            items.push({
                id: Date.now(),
                name, category, price: price || 0, quantity,
                image: mainImage,
                images: images,
                purchaseDate, expiryDate, warrantyDate,
                status, acquireMethod, remark
            });
            showToast(T('保存成功！'));
        }
        localStorage.setItem('myItems', JSON.stringify(items));
        resetForm();
        switchPage('page-all-items');
    };

    handleSave();
}

function compressImage(base64Str, maxWidth, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => {
        showToast(T('图片读取失败，请换一张'), 'error');
    };
    img.src = base64Str;
}

function resetForm() {
    editingItemId = null;
    document.getElementById('item-edit-title').textContent = T('添加物品');
    document.getElementById('item-submit-text').textContent = T('添加物品');
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

    const delBtn = document.getElementById('item-delete-btn');
    if (delBtn) delBtn.style.display = 'none';
}

function updateDashboard() {
    const items = getItems();
    document.getElementById('total-count').innerText = T('{n} 件', { n: items.length });
    let totalPrice = 0;
    items.forEach(i => totalPrice += parseFloat(i.price || 0));
    document.getElementById('total-item-price').innerText = '¥ ' + totalPrice.toFixed(2);
    const records = getGiftRecords();
    let totalGift = 0;
    let giftCount = 0;
    records.forEach(r => {
        (r.events || []).forEach(e => {
            totalGift += (e.amount || 0);
            giftCount++;
        });
    });
    document.getElementById('total-gift-amount').innerText = '¥ ' + totalGift.toFixed(2);
    document.getElementById('total-gift-count').innerText = T('{n} 笔', { n: giftCount });
}

function getDaysRemaining(dateString) {
    if (!dateString) return null;
    const target = new Date(dateString);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function toggleFilterMenu() {
    const m = document.getElementById('filter-menu');
    const o = document.getElementById('filter-menu-overlay');
    const isOpen = m.style.display !== 'none';
    if (isOpen) {
        m.style.display = 'none';
        if (o) o.style.display = 'none';
    } else {
        m.style.display = 'block';
        if (o) o.style.display = 'block';
    }
}
function closeFilterMenu() {
    const m = document.getElementById('filter-menu');
    const o = document.getElementById('filter-menu-overlay');
    if (m) m.style.display = 'none';
    if (o) o.style.display = 'none';
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
    if (extra) extra.textContent = pausedCount > 0 ? T('暂离 {n}', { n: pausedCount }) : '';
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
        opt.textContent = `${T(cat)} (${count})`;
        select.appendChild(opt);
    });
    select.value = current;
}

function toggleSearchBar() {
    const w = document.getElementById('search-bar-wrapper');
    w.style.display = w.style.display === 'none' ? 'block' : 'none';
    if (w.style.display === 'block') {
        setTimeout(() => document.getElementById('search-input').focus(), 100);
    }
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
        container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('暂无匹配的物品')}</p>`;
        return;
    }
    container.innerHTML = '';
    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4=';

    items.forEach(item => {
        const isMulti = multiSelectMode.items;
        const isChecked = isMulti && multiSelectedIds.items.has(item.id);

        const div = document.createElement('div');
        div.className = allItemsView === 'tile' ? 'item-tile' : 'item-card-new';
        if (isChecked) div.classList.add('multi-checked');
        div.setAttribute('data-multi-id', `items-${item.id}`);

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
                ? `<span class="mini-badge ${danger?'mini-danger':''}">${T('还有{n}天过期', { n: dExp })}</span>`
                : `<span class="mini-badge mini-danger">${T('已过期{n}天', { n: Math.abs(dExp) })}</span>`;
        }
        let warBadge = '';
        if (dWar !== null) {
            const danger = dWar <= 180;
            warBadge = dWar >= 0
                ? `<span class="mini-badge ${danger?'mini-danger':''}">${T('还有{n}天过保', { n: dWar })}</span>`
                : `<span class="mini-badge mini-danger">${T('已过保{n}天', { n: Math.abs(dWar) })}</span>`;
        }

        const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';

        if (allItemsView === 'tile') {
            div.innerHTML = `
                ${checkboxHtml}
                <img src="${imgSrc}" class="tile-img">
                <div class="tile-name">${item.name}</div>
                <div class="tile-tags">
                    <span class="mini-tag category">${T(item.category)}</span>
                    <span class="mini-tag ${statusClass}">${T(status)}</span>
                </div>
                <div class="tile-price">¥${item.price || 0}</div>
                <div class="tile-badges">${expBadge}${warBadge}</div>
            `;
        } else {
            div.innerHTML = `
                ${checkboxHtml}
                <img src="${imgSrc}" class="item-img-new">
                <div class="item-info-new">
                    <div class="item-name-new">${item.name} <span class="item-qty-new">x${item.quantity}</span></div>
                    <div class="item-tag-row">
                        <span class="mini-tag category">${T(item.category)}</span>
                        <span class="mini-tag ${statusClass}">${T(status)}</span>
                        <span class="mini-tag acquire">${T(acquire)}</span>
                        <span class="mini-tag price">¥${item.price || 0}</span>
                    </div>
                    <div class="item-badge-row">${expBadge}${warBadge}</div>
                </div>
            `;
        }

        if (isMulti) {
            div.onclick = () => toggleMultiSelected('items', item.id);
        } else {
            div.onclick = () => editItem(item.id);
            bindLongPress(div, () => {
                showConfirm(T('删除物品'), T('确定删除「{name}」吗？删除后无法恢复。', { name: item.name }), () => {
                    let items2 = getItems().filter(i => i.id !== item.id);
                    localStorage.setItem('myItems', JSON.stringify(items2));
                    showToast(T('已删除'));
                    renderItemsList();
                    updateItemStats();
                });
            });
        }

        container.appendChild(div);
    });
}

function editItem(id) {
    const item = getItems().find(i => i.id === id);
    if (!item) return;
    editingItemId = id;
    document.getElementById('item-edit-title').textContent = T('编辑物品');
    document.getElementById('item-submit-text').textContent = T('保存修改');

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

    const delBtn = document.getElementById('item-delete-btn');
    if (delBtn) delBtn.style.display = 'block';

    switchPage('page-add');
}

// ================= 物品分布图 =================
function initItemChart() {
    const itemEl = document.getElementById('item-chart-container');
    if (!itemEl) return;
    if (myChart) myChart.dispose();
    myChart = echarts.init(itemEl);
    const cc = {};
    getItems().forEach(i => {
        const cat = i.category || '未分类';
        cc[cat] = (cc[cat] || 0) + 1;
    });
    const data = Object.keys(cc).map(k => ({ name: k, value: cc[k] }));
    myChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 12, icon: 'circle', textStyle: { fontSize: 11 } },
        color: ['#d98880', '#85c1e9', '#82c8a0', '#f7dc6f', '#bb8fce', '#f5b041', '#f5b7b1', '#aed6f1'],
        series: [{ name: T('物品分布'), type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: data.length > 0 ? data : [{ value: 0, name: T('暂无数据'), itemStyle: { color: '#eee' } }] }]
    });
}

// ================= 随礼分布图 =================
function initGiftChart() {
    const giftEl = document.getElementById('gift-chart-container');
    if (!giftEl) return;
    if (myGiftChart) myGiftChart.dispose();
    myGiftChart = echarts.init(giftEl);
    const cc = {};
    getGiftRecords().forEach(r => (r.events || []).forEach(e => {
        const ev = e.event || '未分类';
        cc[ev] = (cc[ev] || 0) + (e.amount || 0);
    }));
    const data = Object.keys(cc).map(k => ({ name: k, value: cc[k] }));
    myGiftChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: ¥{c}' },
        legend: { orient: 'vertical', right: '5%', top: 'middle', itemGap: 12, icon: 'circle', textStyle: { fontSize: 11 } },
        color: ['#f5b7b1', '#f7dc6f', '#82c8a0', '#85c1e9', '#bb8fce', '#f5b041', '#d98880', '#aed6f1'],
        series: [{ name: T('随礼分布'), type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: data.length > 0 ? data : [{ value: 0, name: T('暂无数据'), itemStyle: { color: '#eee' } }] }]
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
    if (!person || !event || !amount) { showToast(T('请填写随礼人、事件和金额！'), 'error'); return; }

    const photos = giftPhotos.filter(x => x);
    let records = getGiftRecords();
    let existing = records.find(r => r.person === person);
    const newEvent = { id: Date.now(), event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || '' };
    if (existing) {
        if (!Array.isArray(existing.events)) existing.events = [];
        existing.events.push(newEvent);
    } else {
        records.push({ id: Date.now(), person, events: [newEvent] });
    }
    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    showToast(T('保存成功！'));

    // 重置
    ['gift-person','gift-event','gift-date','gift-location','gift-remark'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('gift-amount').value = '';
    document.getElementById('gift-amount').style.display = 'none';
    document.querySelectorAll('#page-add-gift .chip').forEach(c => c.classList.remove('active'));
    selectedGiftType = '随礼';
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
        (r.events || []).forEach(e => {
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
    records.forEach(r => (r.events || []).forEach(e => {
        if (e.event) categories.add(e.event);
    }));
    Array.from(categories).sort().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = T(cat);
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
    if (w.style.display === 'block') {
        setTimeout(() => document.getElementById('gift-search-input').focus(), 100);
    }
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
        let events = (r.events || []).slice();

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
            events = (r.events || []).filter(e => {
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
        container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('暂无匹配的记录')}</p>`;
        return;
    }
    container.innerHTML = '';

    const giftColors    = ['#fadbd8', '#f5b7b1', '#f1948a', '#e6b0aa'];
    const receiveColors = ['#d5f4e6', '#a9dfbf', '#7dcea0', '#a2d9ce'];

    processed.forEach(record => {
        const isMulti = multiSelectMode.gift;
        const isChecked = isMulti && multiSelectedIds.gift.has(record.id);

        let total = 0;
        record.filteredEvents.forEach(e => {
            if (e.type === '收礼') {
                total += (e.amount || 0);
            } else {
                total -= (e.amount || 0);
            }
        });
        const totalText = total > 0 ? `+¥${total}` : total < 0 ? `-¥${Math.abs(total)}` : `¥0`;
        const firstChar = (record.person || '?').charAt(0);
        const count = record.filteredEvents.length;

        let tagsHtml = '';
        let redIdx = 0, greenIdx = 0;
        record.filteredEvents.slice(0, 6).forEach(ev => {
            let bg;
            if (ev.type === '收礼') { bg = receiveColors[greenIdx % receiveColors.length]; greenIdx++; }
            else { bg = giftColors[redIdx % giftColors.length]; redIdx++; }
            tagsHtml += `<span class="mini-tag" style="background:${bg};color:#333;">${T(ev.event)} ¥${ev.amount}</span>`;
        });
        if (record.filteredEvents.length > 6) {
            tagsHtml += `<span class="mini-tag" style="background:#eee;color:#888;">+${record.filteredEvents.length - 6}</span>`;
        }

        const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';

        const div = document.createElement('div');
        div.setAttribute('data-multi-id', `gift-${record.id}`);
        if (isChecked) div.classList.add('multi-checked');

        if (giftView === 'tile') {
            div.className = 'item-tile';
            div.innerHTML = `
                ${checkboxHtml}
                <div class="gift-avatar-tile">${firstChar}</div>
                <div class="tile-name">${record.person}</div>
                <div class="tile-tags">${tagsHtml}</div>
                <div class="tile-price">${totalText}</div>
            `;
        } else {
            div.className = 'item-card-new';
            div.innerHTML = `
                ${checkboxHtml}
                <div class="gift-avatar">${firstChar}</div>
                <div class="item-info-new">
                    <div class="item-name-new">${record.person} <span class="item-qty-new">${T('{n} 笔', { n: count })}</span></div>
                    <div class="item-tag-row">${tagsHtml}</div>
                </div>
                <div class="gift-total-new">${totalText}</div>
            `;
        }

        if (isMulti) {
            div.onclick = () => toggleMultiSelected('gift', record.id);
        } else {
            div.onclick = () => showGiftDetail(record.id);
            bindLongPress(div, () => {
                showConfirm(T('删除随礼记录'), T('确定删除「{name}」吗？他/她的所有随礼记录都会一起删除。', { name: record.person }), () => {
                    let records2 = getGiftRecords().filter(r => r.id !== record.id);
                    localStorage.setItem('myGiftRecords', JSON.stringify(records2));
                    showToast(T('已删除'));
                    renderGiftList();
                });
            });
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

function deleteGiftPerson() {
    if (!currentGiftPersonId) return;
    if (!confirm(T('确定删除这个人吗？他/她的所有随礼记录都会一起删除。'))) return;
    let records = getGiftRecords().filter(r => r.id !== currentGiftPersonId);
    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    currentGiftPersonId = null;
    showToast(T('已删除'));
    switchPage('page-gift-record');
}

function renderGiftEventList() {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId);
    const container = document.getElementById('gift-event-list');
    if (!record || !container) return;
    container.innerHTML = '';
    [...(record.events || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(ev => {
        const div = document.createElement('div');
                div.className = 'event-card';
        const bgColor = ev.type === '收礼' ? '#d5f4e6' : '#fadbd8';
        const borderColor = ev.type === '收礼' ? '#82c8a0' : '#d98880';
        div.style.background = bgColor;
        div.style.borderLeftColor = borderColor;
        div.style.cursor = 'pointer';
        div.setAttribute('onclick', `showEventDetail(${ev.id})`);
        div.innerHTML = `
            <div class="event-header">${T(ev.event)} <span style="font-size:12px;color:#666;">(${T(ev.type || '随礼')})</span></div>
            <div class="event-info">💰 ${T('礼金')}：¥${ev.amount}</div>
            <div class="event-info">📅 ${T('时间')}：${ev.date || T('未记录')}</div>
            <div class="event-info">📍 ${T('地点')}：${ev.location || T('未记录')}</div>
        `;
                // 长按删除这条事件
        bindLongPress(div, () => {
            showConfirm(T('删除事件'), T('确定删除「{name}」这条事件吗？', { name: ev.event }), () => {
                let records = getGiftRecords();
                const rec = records.find(r => r.id === currentGiftPersonId);
                if (!rec) return;
                rec.events = (rec.events || []).filter(e => e.id !== ev.id);
                if (rec.events.length === 0) {
                    records = records.filter(r => r.id !== currentGiftPersonId);
                    localStorage.setItem('myGiftRecords', JSON.stringify(records));
                    currentGiftPersonId = null;
                    showToast(T('已删除'));
                    switchPage('page-gift-record');
                } else {
                    localStorage.setItem('myGiftRecords', JSON.stringify(records));
                    showToast(T('已删除'));
                    renderGiftEventList();
                }
            });
        });

        container.appendChild(div);
    });
}

// 显示事件详情
function showEventDetail(eventId) {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId);
    if (!record) return;
    const ev = (record.events || []).find(e => e.id === eventId);
    if (!ev) return;
    currentEventId = eventId;

    const bgColor = ev.type === '收礼' ? '#d5f4e6' : '#fadbd8';
    const borderColor = ev.type === '收礼' ? '#82c8a0' : '#d98880';

    document.getElementById('event-detail-content').innerHTML = `
        <div class="event-card" style="background:${bgColor}; border-left-color:${borderColor};">
            <div class="event-header">${T(ev.event)} <span style="font-size:12px;color:#666;">(${T(ev.type || '随礼')})</span></div>
            <div class="event-info">👤 ${T('随礼人')}：${record.person}</div>
            <div class="event-info">💰 ${T('礼金')}：¥${ev.amount}</div>
            <div class="event-info">📅 ${T('时间')}：${ev.date || T('未记录')}</div>
            <div class="event-info">📍 ${T('地点')}：${ev.location || T('未记录')}</div>
        </div>
    `;
    switchPage('page-event-detail');
}

// 编辑事件（把数据填到增加事件页）
function editGiftEvent() {
    const record = getGiftRecords().find(r => r.id === currentGiftPersonId);
    if (!record) return;
    const ev = (record.events || []).find(e => e.id === currentEventId);
    if (!ev) return;

    editingEventId = ev.id;
    document.getElementById('event-name').value = ev.event || '';
    document.getElementById('event-amount').value = ev.amount || '';
    document.getElementById('event-date').value = ev.date || '';
    document.getElementById('event-location').value = ev.location || '';
    document.getElementById('event-remark').value = ev.remark || '';

    // 回填照片
    if (ev.photos && Array.isArray(ev.photos)) {
        eventPhotos = [ev.photos[0] || '', ev.photos[1] || '', ev.photos[2] || ''];
    } else if (ev.image) {
        eventPhotos = [ev.image, '', ''];
    } else {
        eventPhotos = ['', '', ''];
    }
    for (let i = 0; i < 3; i++) {
        const inp = document.getElementById('event-image-' + i);
        if (inp) inp.value = '';
        renderEventPhotoSlot(i);
    }

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
    ['event-name','event-amount','event-date','event-location','event-remark'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.remove('active'));
    eventPhotos = ['', '', ''];
    for (let i = 0; i < 3; i++) {
        const inp = document.getElementById('event-image-' + i);
        if (inp) inp.value = '';
        renderEventPhotoSlot(i);
    }
    switchPage('page-add-event');
}

function saveGiftEvent() {
    const event = document.getElementById('event-name').value.trim();
    const amount = document.getElementById('event-amount').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value.trim();
    const remark = document.getElementById('event-remark').value.trim();
    if (!event || !amount) { showToast(T('请填写事件和金额！'), 'error'); return; }

    let records = getGiftRecords();
    const record = records.find(r => r.id === currentGiftPersonId);
    if (!record) return;

    const photos = eventPhotos.filter(x => x);

    if (!Array.isArray(record.events)) record.events = [];
    if (editingEventId) {
        const idx = record.events.findIndex(e => e.id === editingEventId);
        if (idx !== -1) {
            record.events[idx] = { ...record.events[idx], event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || record.events[idx].image };
        }
        showToast(T('修改成功！'));
        editingEventId = null;
    } else {
        record.events.push({ id: Date.now(), event, amount: parseFloat(amount), date, location, type: selectedGiftType || '随礼', remark, photos, image: photos[0] || '' });
        showToast(T('事件添加成功！'));
    }

    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    // 重置
    editingEventId = null;
    selectedGiftType = '随礼';
    eventPhotos = ['', '', ''];
    ['event-name','event-amount','event-date','event-location','event-remark'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('#page-add-event .chip').forEach(c => c.classList.remove('active'));
    for (let i = 0; i < 3; i++) {
        const inp = document.getElementById('event-image-' + i);
        if (inp) inp.value = '';
        renderEventPhotoSlot(i);
    }
    renderGiftEventList();
    switchPage('page-gift-detail');
}

function deleteGiftEvent() {
    if (!currentEventId || !currentGiftPersonId) return;
    if (!confirm(T('确定删除这条事件吗？'))) return;
    let records = getGiftRecords();
    const record = records.find(r => r.id === currentGiftPersonId);
    if (!record) return;
    record.events = (record.events || []).filter(e => e.id !== currentEventId);
    // 如果这个人已经没有任何事件，顺带把这个人也删掉
    if (record.events.length === 0) {
        records = records.filter(r => r.id !== currentGiftPersonId);
    }
    localStorage.setItem('myGiftRecords', JSON.stringify(records));
    currentEventId = null;
    showToast(T('已删除'));
    if (records.find(r => r.id === currentGiftPersonId)) {
        // 这个人还有别的事件，回到随礼详情
        renderGiftEventList();
        switchPage('page-gift-detail');
    } else {
        // 这个人没事件了，回到列表
        currentGiftPersonId = null;
        switchPage('page-gift-record');
    }
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
    if (!date || !event) { showToast(T('请填写日期和事件！'), 'error'); return; }
    let dates = getImportantDates();
    if (editingImportantId) {
        const idx = dates.findIndex(d => d.id === editingImportantId);
        if (idx !== -1) dates[idx] = { ...dates[idx], person, date, event, level: selectedImportantLevel };
        showToast(T('修改成功！'));
    } else {
        dates.push({ id: Date.now(), person, date, event, level: selectedImportantLevel });
        showToast(T('保存成功！'));
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
    let dayText = days === 0 ? T('今天') : (days > 0 ? T('{n}天后', { n: days }) : T('已过去{n}天', { n: Math.abs(days) }));
    document.getElementById('important-detail-content').innerHTML = `
        <div class="important-card level-${item.level}">
            <div class="important-card-header">
                <span class="important-card-name">${item.person ? `[${item.person}] ` : ''}${T(item.event)}</span>
                <span class="important-card-level">${T(item.level)}</span>
            </div>
            <div class="important-card-date" style="margin-top:10px;">📅 ${T('日期')}：${item.date} (${dayText})</div>
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

function deleteImportantDate() {
    if (!currentImportantDetailId) return;
    if (!confirm(T('确定删除这个日期吗？'))) return;
    let dates = getImportantDates().filter(d => d.id !== currentImportantDetailId);
    localStorage.setItem('myImportantDates', JSON.stringify(dates));
    currentImportantDetailId = null;
    showToast(T('已删除'));
    switchPage('page-important-dates');
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
    let html = `<div class="card"><h3 style="margin-bottom:12px;">${T('马上要发生 👇')}</h3>`;
    upcoming.forEach(d => {
        html += `<div class="upcoming-card" onclick="showImportantDetail(${d.id})">
            <div class="upcoming-info">
                <div class="upcoming-event">${d.person ? `[${d.person}] ` : ''}${T(d.event)}</div>
                <div class="upcoming-date">${d.date} · ${T(d.level)}</div>
            </div>
            <div class="upcoming-days">${d.days}<small>${T('天后')}</small></div>
        </div>`;
    });
    html += '</div>';
    section.innerHTML = html;
}

function openCalendarPicker() {
    // 打开日期选择器的「只选年月」模式
    currentInputId = null;
    pickerMode = 'year-month';
    pickerStep = 'year';
    selectedYear = null;
    selectedMonth = null;
    selectedDay = null;
    document.getElementById('date-picker-modal').style.display = 'flex';
    renderPickerBody();
}

// ========== 日历渲染 ==========
function changeMonth(delta) {
    calMonth += delta;
    if (calMonth < 1) { calMonth = 12; calYear--; }
    else if (calMonth > 12) { calMonth = 1; calYear++; }
    selectedCalDate = null;
    document.getElementById('important-detail-card').style.display = 'none';
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('calendar-month-title');
    title.innerText = T('{y}年{m}月', { y: calYear, m: calMonth });
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
            eventsHtml += `<div class="cal-event-rect" style="background:${bgColor}">${T(ev.event)}</div>`;
        });

        // 判断今天
        const now = new Date();
        const isToday = (calYear === now.getFullYear() && calMonth === (now.getMonth() + 1) && d === now.getDate());

                const isSelected = selectedCalDate === dateStr && !isToday;
                html += `<div class="cal-cell ${dayEvents.length > 0 ? 'has-event' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-date="${dateStr}">
            <span class="cal-day">${d}</span>
            ${jieQiText ? `<span class="cal-holiday">${jieQiText}</span>` : (lunarText ? `<span class="cal-lunar">${lunarText}</span>` : '')}
            ${holiday ? `<span class="cal-holiday">${T(holiday)}</span>` : ''}
            ${isWeekend ? `<span class="cal-holiday" style="color:#f5b041;">${T('休')}</span>` : ''}
            ${eventsHtml ? `<div class="cal-events">${eventsHtml}</div>` : ''}
        </div>`;
    }
        grid.innerHTML = html;

    // 绑定点击和长按（统一走 JS，避免 preventDefault 吃掉 click）
    document.querySelectorAll('#calendar-grid .cal-cell:not(.empty)').forEach(cell => {
        const dateStr = cell.dataset.date;
        if (!dateStr) return;

        let longPressFired = false;
        let touchMoved = false;
        let startX = 0, startY = 0;
        let lpT = null;

        const startPress = (e) => {
            if (e && e.cancelable) e.preventDefault();
            longPressFired = false;
            touchMoved = false;
            const p = e.touches ? e.touches[0] : e;
            startX = p.clientX;
            startY = p.clientY;
            clearTimeout(lpT);
            lpT = setTimeout(() => {
                longPressFired = true;
                isLongPress = true;
                if (navigator.vibrate) navigator.vibrate(30);
                longPressNewDiary(dateStr);
            }, 550);
        };

        const movePress = (e) => {
            const p = e.touches ? e.touches[0] : e;
            if (Math.abs(p.clientX - startX) > 8 || Math.abs(p.clientY - startY) > 8) {
                touchMoved = true;
                clearTimeout(lpT);
            }
        };

        const endPress = () => {
            clearTimeout(lpT);
            if (!longPressFired && !touchMoved) {
                selectCalDay(dateStr);
            }
            if (longPressFired) {
                setTimeout(() => { isLongPress = false; }, 300);
            }
        };

        const cancelPress = () => { clearTimeout(lpT); };

        cell.addEventListener('touchstart', startPress, { passive: false });
        cell.addEventListener('touchmove', movePress, { passive: true });
        cell.addEventListener('touchend', endPress);
        cell.addEventListener('touchcancel', cancelPress);

        cell.addEventListener('mousedown', startPress);
        cell.addEventListener('mouseup', endPress);
        cell.addEventListener('mouseleave', cancelPress);
    });
}

// ================= 接下来 7 天 =================
function renderUpcoming7Days() {
    const list = document.getElementById('upcoming-7days-list');
    if (!list) return;

    const dates = getImportantDates();
    const diaries = getDiaries();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
    let html = '';

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        // 标记
        let label = '';
        let cls = '';
        if (i === 0) { label = T('今天'); cls = 'is-today'; }
        else if (i === 1) { label = T('明天'); }
        else if (i === 2) { label = T('后天'); }
        else { label = T('周' + weekdayNames[d.getDay()]); }

        // 当天的事件
        const dayEvents = dates.filter(x => x.date === dateStr);
        const dayDiaries = diaries.filter(x => x.date === dateStr);

        let contentHtml = '';
        if (dayEvents.length === 0 && dayDiaries.length === 0) {
            contentHtml = `<span class="day-empty">${T('暂无')}</span>`;
        } else {
            dayEvents.forEach(ev => {
                let dotColor = '#f9d5cf';
                if (ev.level === '重要') dotColor = '#e8a49b';
                else if (ev.level === '纪念') dotColor = '#c96a5a';
                const personPrefix = ev.person ? `[${ev.person}] ` : '';
                contentHtml += `<div class="day-event-line"><span class="day-dot" style="background:${dotColor};"></span><span>${personPrefix}${T(ev.event)}</span></div>`;
            });
            if (dayDiaries.length > 0) {
                contentHtml += `<div class="day-event-line"><span class="day-diary-icon">📔</span><span>${T('日记 {n} 篇', { n: dayDiaries.length })}</span></div>`;
            }
        }

        html += `
            <div class="day-row ${cls}">
                <div class="day-badge">
                    <div class="day-badge-label">${label}</div>
                    <div class="day-badge-date">${d.getMonth() + 1}/${d.getDate()}</div>
                </div>
                <div class="day-content">${contentHtml}</div>
            </div>
        `;
    }
    list.innerHTML = html;
}

function selectCalDay(dateStr) {
    const sel = window.getSelection && window.getSelection();
    if (sel) sel.removeAllRanges();
    if (isLongPress) { isLongPress = false; return; }

    selectedCalDate = dateStr;
    renderCalendar();

    const detail = document.getElementById('important-detail-card');
    const dates = getImportantDates().filter(d => d.date === dateStr);
    const diaries = getDiaries().filter(d => d.date === dateStr);
    const dayDiaries = diaries.filter(d => d.type === '日记');
    const dayNotes = diaries.filter(d => d.type === '便签');

    if (dates.length === 0 && diaries.length === 0) {
        detail.style.display = 'none';
        return;
    }

    let html = '';

    // 重要日期
    if (dates.length > 0) {
        html += `<div class="cal-detail-section">📌 ${T('重要事件')}</div>`;
        dates.forEach(d => {
            html += `<div class="important-card level-${d.level}" onclick="showImportantDetail(${d.id})">
                <div class="important-card-header">
                    <span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${T(d.event)}</span>
                    <span class="important-card-level">${T(d.level)}</span>
                </div>
                <div class="important-card-date">${d.date}</div>
            </div>`;
        });
    }

    // 日记 / 便签 概览
    if (dayDiaries.length > 0 || dayNotes.length > 0) {
        html += `<div class="cal-detail-section">📔 ${T('日记 / 便签')}</div>`;
        const both = dayDiaries.length > 0 && dayNotes.length > 0;
        html += `<div class="diary-overview-grid">`;

        if (dayDiaries.length > 0) {
            const preview = both ? '' : (dayDiaries[0].content || '').replace(/[□✓\n\r]/g, ' ').trim().slice(0, 40);
            html += `<div class="diary-overview-card diary ${both ? '' : 'full'}" onclick="openDiaryList('${dateStr}', '日记')">
                <div class="diary-overview-header">📔 ${T('日记')}</div>
                <div class="diary-overview-count">${dayDiaries.length}<small>${T('篇')}</small></div>
                ${preview ? `<div class="diary-overview-preview">${preview}</div>` : ''}
            </div>`;
        }

        if (dayNotes.length > 0) {
            const firstTitle = both ? '' : (dayNotes[0].title || (dayNotes[0].content || '').slice(0, 20));
            html += `<div class="diary-overview-card note ${both ? '' : 'full'}" onclick="openDiaryList('${dateStr}', '便签')">
                <div class="diary-overview-header">📝 ${T('便签')}</div>
                <div class="diary-overview-count">${dayNotes.length}<small>${T('篇')}</small></div>
                ${firstTitle ? `<div class="diary-overview-preview">${firstTitle}</div>` : ''}
            </div>`;
        }

        html += `</div>`;
    }

    detail.innerHTML = html;
    detail.style.display = 'block';

    // 重要日期卡片长按删除
    detail.querySelectorAll('.important-card').forEach(card => {
        const onclickAttr = card.getAttribute('onclick') || '';
        const m = onclickAttr.match(/showImportantDetail\((\d+)\)/);
        if (!m) return;
        const id = parseInt(m[1]);
        bindLongPress(card, () => {
            const item = getImportantDates().find(d => d.id === id);
            if (!item) return;
            showConfirm(T('删除重要日期'), T('确定删除「{name}」吗？', { name: item.event }), () => {
                let dates2 = getImportantDates().filter(d => d.id !== id);
                localStorage.setItem('myImportantDates', JSON.stringify(dates2));
                showToast(T('已删除'));
                renderUpcomingDates();
                renderUpcoming7Days();
                selectCalDay(dateStr);
            });
        });
    });
}

function backToCalendar() {
    document.getElementById('calendar-view').style.display = 'block';
    document.getElementById('important-list-view').style.display = 'none';
    importantViewMode = 'calendar';
    renderCalendar();
}

function toggleImportantSearch() {
    const bar = document.getElementById('important-search-bar');
    bar.style.display = bar.style.display === 'none' ? 'block' : 'none';
    if (bar.style.display === 'none') { 
        importantSearchKeyword = ''; 
        document.getElementById('important-search-input').value = ''; 
    } else {
        setTimeout(() => document.getElementById('important-search-input').focus(), 100);
    }
}
function toggleImportantMenu() {
    const m = document.getElementById('important-menu');
    const o = document.getElementById('important-menu-overlay');
    const isOpen = m.style.display !== 'none';
    if (isOpen) {
        m.style.display = 'none';
        if (o) o.style.display = 'none';
    } else {
        m.style.display = 'block';
        if (o) o.style.display = 'block';
    }
}

function closeImportantMenu() {
    const m = document.getElementById('important-menu');
    const o = document.getElementById('important-menu-overlay');
    if (m) m.style.display = 'none';
    if (o) o.style.display = 'none';
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
    if (dates.length === 0) { container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('暂无匹配的重要日期')}</p>`; return; }
    container.innerHTML = '';
    dates.forEach(d => {
        const days = Math.ceil((new Date(d.date) - today) / (1000 * 60 * 60 * 24));
        let dayText = days === 0 ? T('今天') : (days > 0 ? T('{n}天后', { n: days }) : T('已过去{n}天', { n: Math.abs(days) }));
        const div = document.createElement('div');
        div.className = `important-card level-${d.level}`;
        div.setAttribute('onclick', `showImportantDetail(${d.id})`);
        div.innerHTML = `<div class="important-card-header"><span class="important-card-name">${d.person ? `[${d.person}] ` : ''}${T(d.event)}</span><span class="important-card-level">${T(d.level)}</span></div><div class="important-card-date">${d.date} · ${dayText}</div>`;
        // 长按删除
        bindLongPress(div, () => {
            showConfirm(T('删除重要日期'), T('确定删除「{name}」吗？', { name: T(d.event) }), () => {
                let dates = getImportantDates().filter(x => x.id !== d.id);
                localStorage.setItem('myImportantDates', JSON.stringify(dates));
                showToast(T('已删除'));
                renderImportantList();
                renderCalendar();
                renderUpcomingDates();
            });
        });

        container.appendChild(div);
    });
}

// ================= 日期选择器 =================
function openDatePicker(inputId, mode) {
    currentInputId = inputId;
    pickerMode = mode || 'full';
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
        title.innerText = T('1. 选择年份');
        const y = new Date().getFullYear();
        for (let i = y - 10; i <= y + 10; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = T('{n}年', { n: i });
            d.onclick = () => { selectedYear = i; pickerStep = 'month'; renderPickerBody(); }; body.appendChild(d);
        }
    } else if (pickerStep === 'month') {
        title.innerText = T('{y}年 2. 选择月份', { y: selectedYear });
        for (let i = 1; i <= 12; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = T('{n}月', { n: i });
            d.onclick = () => {
                selectedMonth = i;
                if (pickerMode === 'year-month') {
                    // 只选年月模式：选完月直接应用并关闭
                    calYear = selectedYear;
                    calMonth = selectedMonth;
                    document.getElementById('important-detail-card').style.display = 'none';
                    renderCalendar();
                    closeDatePicker();
                } else {
                    pickerStep = 'day';
                    renderPickerBody();
                }
            };
            body.appendChild(d);
        }
    } else if (pickerStep === 'day') {
        title.innerText = T('{y}年{m}月 3. 选择日期', { y: selectedYear, m: selectedMonth });
        const days = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let i = 1; i <= days; i++) {
            const d = document.createElement('div'); d.className = 'picker-item'; d.innerText = T('{n}日', { n: i });
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
    book.updatedAt = Date.now();
    if (book.isActive === undefined) book.isActive = false;
    if (idx !== -1) {
        // 保留原有 isActive 状态
        book.isActive = books[idx].isActive || false;
        books[idx] = book;
    } else {
        books.push(book);
    }
    // 确保只有一本 isActive
    if (book.isActive) {
        books.forEach(b => { if (b.id !== book.id) b.isActive = false; });
    }
    localStorage.setItem('myBooks', JSON.stringify(books));
    renderBookProgress();
}

function renderBookProgress() {
    const container = document.getElementById('book-progress-section');
    if (!container) return;

    const books = getBooks();
    const activeBook = books.find(b => b.isActive);

    if (books.length === 0) {
        container.innerHTML = `
            <div class="card" onclick="switchPage('page-book-list')" style="cursor:pointer;">
                <h3 style="margin-bottom:10px;">${T('今天看书了嘛~ 📖')}</h3>
                <p style="color:#999; font-size:14px;">${T('点击添加一本正在读的书')}</p>
            </div>`;
        return;
    }

    if (!activeBook) {
        container.innerHTML = `
            <div class="card" onclick="switchPage('page-book-list')" style="cursor:pointer;">
                <h3 style="margin-bottom:10px;">${T('今天看书了嘛~ 📖')}</h3>
                <p style="color:#999; font-size:14px;">${T('还没有选择要展示的书，去书本列表勾选')}</p>
            </div>`;
        return;
    }

    const total = activeBook.totalPages || 1;
    const current = activeBook.currentPages || 0;
    const percent = Math.min(100, Math.round((current / total) * 100));
    const estimated = parseFloat(activeBook.estimatedHours) || 0;
    const isDone = percent >= 100;
    const spent = isDone ? (activeBook.spentHours || 0) : computeSpentDaysValue(activeBook.startDate);
    const remaining = isDone ? 0 : Math.max(0, estimated - spent).toFixed(1);

    container.innerHTML = `
        <div class="card" onclick="showBookView(${activeBook.id})" style="cursor:pointer;">
            <h3 style="margin-bottom:10px;">${T('今天看书了嘛~ 📖')}</h3>
            <div style="display:flex; justify-content:space-between; font-size:13px; color:#666; margin-bottom:6px;">
                <span>${activeBook.name}</span>
                <span>${T('已用 {n} 天', { n: spent })} ${isDone ? T('（已读完）') : '/ ' + T('计划剩余 {n} 天', { n: remaining })}</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width:${percent}%"></div>
                <div class="progress-icon" style="left:${percent}%">📖</div>
            </div>
            <div style="text-align:right; font-size:12px; color:#999; margin-top:4px;">${T('{cur}/{total}页 ({percent}%)', { cur: current, total, percent })}</div>
        </div>`;
}

// 纯计算函数（不影响 DOM）
function computeSpentDaysValue(startDate) {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((today - start) / (1000 * 60 * 60 * 24)));
}

function showBookDetail(id) {
    const books = getBooks();
    let book = null;
    if (id) book = books.find(b => b.id === id);
    if (!book) {
        book = { id: Date.now(), name: '', startDate: '', totalPages: 0, currentPages: 0, estimatedHours: 0, spentHours: 0, isActive: false };
    }
    document.getElementById('book-name').value = book.name || '';
    document.getElementById('book-start-date').value = book.startDate || '';
    document.getElementById('book-total-pages').value = book.totalPages || '';
    document.getElementById('book-current-pages').value = book.currentPages || '';
    document.getElementById('book-estimated-hours').value = book.estimatedHours || '';

    const titleEl = document.getElementById('book-edit-title');
    if (titleEl) titleEl.textContent = id ? T('编辑书本') : T('添加书本');

    computeSpentDays(book.startDate);
    document.getElementById('book-detail').dataset.bookId = book.id;
    switchPage('page-book-detail');
}

function computeSpentDays(startDate) {
    const el = document.getElementById('book-spent-hours');
    if (!el) return;
    if (!startDate) { el.value = ''; return; }
    const days = computeSpentDaysValue(startDate);
    el.value = T('{n} 天', { n: days });
    computedSpentDays = days;
}

function saveBookDetail() {
    const id = parseInt(document.getElementById('book-detail').dataset.bookId);
    const startDate = document.getElementById('book-start-date').value;
    if (!startDate) { showToast(T('请选择开始阅读时间'), 'error'); return; }

    let books = getBooks();
    const existing = books.find(b => b.id === id);
    const totalPages = parseInt(document.getElementById('book-total-pages').value) || 0;
    const currentPages = parseInt(document.getElementById('book-current-pages').value) || 0;
    const isDone = totalPages > 0 && currentPages >= totalPages;

    const book = {
        id: id || Date.now(),
        name: document.getElementById('book-name').value.trim(),
        startDate: startDate,
        totalPages: totalPages,
        currentPages: currentPages,
        estimatedHours: parseFloat(document.getElementById('book-estimated-hours').value) || 0,
        // 读完时冻结用时；未读完时用实时计算的
        spentHours: (isDone && existing) ? (existing.spentHours || computeSpentDaysValue(startDate)) : computeSpentDaysValue(startDate),
        isActive: existing ? existing.isActive : false
    };
    if (!book.name) { showToast(T('请填写书名'), 'error'); return; }
    saveBook(book);
    showToast(T('保存成功！'));

    // 回到只读详情页
    currentBookViewId = book.id;
    showBookView(book.id);
}

function cancelBookEdit() {
    const id = parseInt(document.getElementById('book-detail').dataset.bookId);
    if (id) {
        showBookView(id);
    } else {
        switchPage('page-book-list');
    }
}

// ================= 书本列表页 =================
function toggleBookSearchBar() {
    const w = document.getElementById('book-search-bar-wrapper');
    w.style.display = w.style.display === 'none' ? 'block' : 'none';
    if (w.style.display === 'block') {
        setTimeout(() => document.getElementById('book-search-input').focus(), 100);
    }
}

function setBookFilterStatus(v) { bookFilterStatus = v; renderBookList(); }
function setBookSort(v) { bookSort = v; renderBookList(); }

function toggleBookSortDir() {
    bookSortDir = bookSortDir === 'desc' ? 'asc' : 'desc';
    const btn = document.getElementById('book-sort-dir-btn');
    if (bookSortDir === 'desc') {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
    }
    renderBookList();
}

function toggleBookViewMode() {
    bookView = bookView === 'list' ? 'tile' : 'list';
    const btn = document.getElementById('book-view-toggle-btn');
    if (bookView === 'list') {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    }
    renderBookList();
}

function renderBookList() {
    let books = getBooks();
    const container = document.getElementById('book-list');
    if (!container) return;

    // 搜索
    const kw = (document.getElementById('book-search-input')?.value || '').toLowerCase().trim();
    if (kw) books = books.filter(b => (b.name || '').toLowerCase().includes(kw));

    // 状态筛选
    if (bookFilterStatus === 'reading') {
        books = books.filter(b => {
            const total = b.totalPages || 0;
            const cur = b.currentPages || 0;
            return !(total > 0 && cur >= total);
        });
    } else if (bookFilterStatus === 'done') {
        books = books.filter(b => {
            const total = b.totalPages || 0;
            const cur = b.currentPages || 0;
            return total > 0 && cur >= total;
        });
    }

    // 排序
    books.sort((a, b) => {
        let r = 0;
        if (bookSort === 'name') {
            r = (a.name || '').localeCompare(b.name || '');
        } else if (bookSort === 'progress') {
            const pa = (a.totalPages ? (a.currentPages || 0) / a.totalPages : 0);
            const pb = (b.totalPages ? (b.currentPages || 0) / b.totalPages : 0);
            r = pb - pa;
        } else {
            r = (b.updatedAt || b.id || 0) - (a.updatedAt || a.id || 0);
        }
        return bookSortDir === 'asc' ? -r : r;
    });

    container.className = bookView === 'tile' ? 'items-list-tile' : 'items-list-list';

    if (books.length === 0) {
        container.innerHTML = `<p style="color:#999;text-align:center;margin-top:50px;">${T('还没有添加书本，点右下角 + 添加')}</p>`;
        return;
    }

    container.innerHTML = '';
    books.forEach(book => {
        const total = book.totalPages || 0;
        const cur = book.currentPages || 0;
        const percent = total > 0 ? Math.min(100, Math.round((cur / total) * 100)) : 0;
        const isDone = percent >= 100 && total > 0;
        const spent = computeSpentDaysValue(book.startDate);

        const div = document.createElement('div');
        div.className = bookView === 'tile' ? 'item-tile' : 'item-card-new';
        div.style.position = 'relative';

        // 勾选方块
        const checkBox = `<div class="book-check ${book.isActive ? 'checked' : ''}" onclick="toggleBookActive(${book.id}, event)">
            ${book.isActive ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>`;

        if (bookView === 'tile') {
            div.innerHTML = `
                ${checkBox}
                <div class="book-cover-tile">📖</div>
                <div class="tile-name">${book.name}</div>
                <div class="tile-tags">
                    <span class="mini-tag" style="background:#f5ede3;color:#8B6F47;">${percent}%</span>
                    <span class="mini-tag" style="background:#f0f0f0;color:#666;">${isDone ? T('已读完') : T('已用 {n} 天', { n: spent })}</span>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="book-cover">📖</div>
                <div class="item-info-new">
                    <div class="item-name-new">${book.name}</div>
                    <div class="item-tag-row">
                        <span class="mini-tag" style="background:#f5ede3;color:#8B6F47;">${T('进度 {n}%', { n: percent })}</span>
                        <span class="mini-tag" style="background:#f0f0f0;color:#666;">${isDone ? T('已读完') : T('已用 {n} 天', { n: spent })}</span>
                        <span class="mini-tag" style="background:#faf6f0;color:#6b5740;">${T('{cur}/{total} 页', { cur, total })}</span>
                    </div>
                </div>
                ${checkBox}
            `;
        }

        // 点击卡片本身（除勾选外）→ 进只读详情
        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('book-check') || e.target.closest('.book-check')) return;
            showBookView(book.id);
        });
                // 长按删除
        bindLongPress(div, () => {
            showConfirm(T('删除书本'), T('确定删除「{name}」吗？', { name: book.name }), () => {
                let books = getBooks().filter(b => b.id !== book.id);
                localStorage.setItem('myBooks', JSON.stringify(books));
                showToast(T('已删除'));
                renderBookList();
                renderBookProgress();
            });
        });

        container.appendChild(div);
    });
}

// 切换勾选（只能选一本）
function toggleBookActive(id, event) {
    if (event) event.stopPropagation();
    let books = getBooks();
    const book = books.find(b => b.id === id);
    if (!book) return;
    const newActive = !book.isActive;
    books.forEach(b => b.isActive = false);
    book.isActive = newActive;
    localStorage.setItem('myBooks', JSON.stringify(books));
    renderBookList();
    renderBookProgress();
}

// ================= 书本只读详情页 =================
function showBookView(id) {
    const book = getBooks().find(b => b.id === id);
    if (!book) return;
    currentBookViewId = id;

    const total = book.totalPages || 0;
    const cur = book.currentPages || 0;
    const percent = total > 0 ? Math.min(100, Math.round((cur / total) * 100)) : 0;
    const isDone = percent >= 100 && total > 0;
    const spent = isDone ? (book.spentHours || 0) : computeSpentDaysValue(book.startDate);

    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const dash = (percent / 100) * circumference;

    const content = document.getElementById('book-view-content');
    content.innerHTML = `
        <div class="book-view-top-grid">
            <div class="book-hero-card">
                <div class="book-hero-cover">📖</div>
                <div class="book-hero-title">${book.name}</div>
                <div class="book-hero-sub">${isDone ? T('已读完') : T('阅读中')}</div>
            </div>
            <div class="book-ring-card">
                <svg class="book-progress-ring" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="${radius}" stroke="var(--divider)" stroke-width="10" fill="none"/>
                    <circle cx="60" cy="60" r="${radius}" stroke="#8B6F47" stroke-width="10" fill="none"
                        stroke-linecap="round"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${circumference - dash}"
                        transform="rotate(-90 60 60)"/>
                </svg>
                <div class="book-progress-text">
                    <div class="book-progress-percent">${percent}%</div>
                    <div class="book-progress-pages">${cur}/${total}</div>
                </div>
            </div>
        </div>

        <div class="card book-view-card">
            <div class="book-view-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>
                <span>${T('时间信息')}</span>
            </div>
            <div class="book-view-row"><span>${T('开始阅读')}</span><span>${book.startDate || T('未记录')}</span></div>
            <div class="book-view-row"><span>${T('预计用时')}</span><span>${T('{n} 天', { n: book.estimatedHours || 0 })}</span></div>
            <div class="book-view-row"><span>${T('已用时')}</span><span>${T('{n} 天', { n: spent })}</span></div>
        </div>

        <div class="card book-view-card">
            <div class="book-view-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="20" x2="6" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="18" y1="20" x2="18" y2="14"/></svg>
                <span>${T('阅读进度')}</span>
            </div>
            <div class="book-view-row"><span>${T('总页数')}</span><span>${T('{n} 页', { n: book.totalPages || 0 })}</span></div>
            <div class="book-view-row"><span>${T('目前页数')}</span><span>${T('{n} 页', { n: book.currentPages || 0 })}</span></div>
            <div class="book-view-row"><span>${T('状态')}</span><span>${isDone ? T('已读完') : T('阅读中')}</span></div>
        </div>
    `;
    switchPage('page-book-view');
}

function editBookFromView() {
    if (currentBookViewId) showBookDetail(currentBookViewId);
}

function deleteBook() {
    if (!currentBookViewId) return;
    if (!confirm(T('确定删除这本书吗？'))) return;
    let books = getBooks().filter(b => b.id !== currentBookViewId);
    localStorage.setItem('myBooks', JSON.stringify(books));
    currentBookViewId = null;
    showToast(T('已删除'));
    switchPage('page-book-list');
}

// ================= 图形锁 =================
function openPatternLock() {
    const l = getLockSettings();
    if (l.type === 'pattern') {
        // 已有图形锁 → 验证模式（先允许取消）
        if (!confirm(T('已经设置了图形锁，是否重新设置？\n点“取消”则保持不变'))) return;
    }
    patternMode = 'set';
    patternFirstAttempt = null;
    document.getElementById('pattern-title').innerText = T('绘制解锁图案');
    document.getElementById('pattern-hint').innerText = T('请连接至少 4 个点');
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
    document.getElementById('pattern-hint').innerText = patternMode === 'set' && patternFirstAttempt ? T('请再次绘制确认') : T('请连接至少 4 个点');
}

function finishPattern() {
    patternDrawing = false;
    if (patternSelected.length < 4) {
        document.getElementById('pattern-hint').innerText = T('⚠️ 至少连接 4 个点');
        setTimeout(resetPattern, 600);
        return;
    }

    const patternStr = patternSelected.join('-');

    if (patternMode === 'set') {
        if (!patternFirstAttempt) {
            // 第一次绘制，暂存，等待确认
            patternFirstAttempt = patternStr;
            document.getElementById('pattern-hint').innerText = T('请再次绘制确认');
            setTimeout(resetPattern, 400);
        } else {
            // 第二次绘制，对比
            if (patternFirstAttempt === patternStr) {
                const l = getLockSettings();
                l.type = 'pattern';
                l.pattern = patternStr;
                l.password = '';
                localStorage.setItem('myLock', JSON.stringify(l));
                loadLockSettings();
                document.getElementById('pattern-hint').innerText = T('✅ 图形锁设置成功！');
                setTimeout(() => {
                    closePatternLock();
                    showToast(T('图形锁设置成功！'));
                }, 600);
            } else {
                document.getElementById('pattern-hint').innerText = T('❌ 两次不一致，请重新绘制');
                patternFirstAttempt = null;
                setTimeout(resetPattern, 800);
            }
        }
    }
}

// ================= Toast 提示 =================
// ================= 全局确认弹窗 =================
// ================= 全局输入弹窗 =================
let promptCallback = null;
function showPrompt(title, defaultValue, onOk) {
    promptCallback = onOk;
    document.getElementById('prompt-title').textContent = title;
    const input = document.getElementById('prompt-input');
    input.value = defaultValue || '';
    document.getElementById('prompt-modal').style.display = 'flex';
    setTimeout(() => input.focus(), 100);
}
function closePrompt() {
    promptCallback = null;
    document.getElementById('prompt-modal').style.display = 'none';
}
function submitPrompt() {
    const val = document.getElementById('prompt-input').value;
    const cb = promptCallback;
    closePrompt();
    if (typeof cb === 'function') cb(val);
}

// ================= 全局消息弹窗 =================
let alertCallback = null;
function showAlert(title, message, onOk) {
    alertCallback = onOk;
    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-modal').style.display = 'flex';
    document.getElementById('alert-cancel-btn').style.display = 'block';
}
function showAlertSimple(title, message) {
    showAlert(title, message);
    document.getElementById('alert-cancel-btn').style.display = 'none';
}
function closeAlert(isOk) {
    const cb = alertCallback;
    alertCallback = null;
    document.getElementById('alert-modal').style.display = 'none';
    if (isOk && typeof cb === 'function') cb();
}

function showConfirm(title, message, onOk) {
    confirmCallback = onOk;
    document.getElementById('confirm-title').textContent = title || T('确认删除');
    document.getElementById('confirm-message').textContent = message || T('确定要删除吗？');
    document.getElementById('confirm-modal').style.display = 'flex';
}
// ================= 通用长按绑定 =================
// 用法：bindLongPress(element, () => { 删除逻辑 })
// 短按仍会触发原 click，长按则阻止 click
function bindLongPress(el, callback) {
    let timer = null;
    let fired = false;
    let startX = 0, startY = 0;

    const start = (e) => {
        fired = false;
        const p = e.touches ? e.touches[0] : e;
        startX = p.clientX;
        startY = p.clientY;
        
        clearTimeout(timer);
        timer = setTimeout(() => {
            fired = true;
            itemLongPressFired = true;
            if (navigator.vibrate) navigator.vibrate(30);
            callback();
        }, 600); // 从 1000ms 缩短到 600ms，反应更快
    };

    const move = (e) => {
        const p = e.touches ? e.touches[0] : e;
        // 如果手指滑动超过 10px，取消长按（防止滚动列表时误触发）
        if (Math.abs(p.clientX - startX) > 10 || Math.abs(p.clientY - startY) > 10) {
            clearTimeout(timer);
        }
    };

    const cancel = () => {
        clearTimeout(timer);
    };

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: true });
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
    el.addEventListener('mousedown', start);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseleave', cancel);

    // 长按触发后，阻止紧随的 click 事件（防止长按后弹出了删除框，结果又跳进了详情页）
    el.addEventListener('click', (e) => {
        if (fired) {
            e.stopPropagation();
            e.preventDefault();
            fired = false;
        }
    }, true);
}

function closeConfirm() {
    confirmCallback = null;
    document.getElementById('confirm-modal').style.display = 'none';
}
function confirmOk() {
    const cb = confirmCallback;
    closeConfirm();
    if (typeof cb === 'function') cb();
}
// ================= 批量多选核心逻辑 =================
function toggleMultiSelect(type) {
    if (multiSelectMode[type]) {
        // 退出
        exitMultiSelect(type);
        renderMultiList(type);
    } else {
        // 进入
        multiSelectMode[type] = true;
        multiSelectedIds[type].clear();
        // 重要日期：如果当前在日历视图，切到列表视图
        if (type === 'important' && importantViewMode === 'calendar') {
            showImportantListView();
        }
        const btn = document.getElementById('multi-select-btn-' + type);
        if (btn) {
            btn.textContent = T('取消');
            btn.classList.add('multi-select-active');
        }
        document.body.classList.add('multi-select-mode');
        renderMultiList(type);
        updateMultiSelectBar(type);
    }
}

function exitMultiSelect(type) {
    multiSelectMode[type] = false;
    multiSelectedIds[type].clear();
    const btn = document.getElementById('multi-select-btn-' + type);
    if (btn) {
        btn.textContent = T('选择');
        btn.classList.remove('multi-select-active');
    }
    const anyActive = Object.values(multiSelectMode).some(v => v);
    if (!anyActive) {
        document.body.classList.remove('multi-select-mode');
        const bar = document.getElementById('multi-select-bar');
        if (bar) bar.style.display = 'none';
    }
    // 修改这里：取消多选后，只重新渲染当前的列表，不再强制切回日历视图
    if (type === 'important') {
        if (importantViewMode === 'list') {
            renderImportantList();
        } else {
            document.getElementById('calendar-view').style.display = 'block';
            document.getElementById('important-list-view').style.display = 'none';
            document.getElementById('upcoming-7days-card').style.display = 'block';
            renderCalendar();
            renderUpcoming7Days();
        }
    }
}

function toggleMultiSelected(type, id) {
    if (!multiSelectMode[type]) return;
    const set = multiSelectedIds[type];
    if (set.has(id)) set.delete(id);
    else set.add(id);
    updateCardSelection(type, id);
    updateMultiSelectBar(type);
}

function updateCardSelection(type, id) {
    const card = document.querySelector(`[data-multi-id="${type}-${id}"]`);
    if (!card) return;
    const checked = multiSelectedIds[type].has(id);
    const cb = card.querySelector('.multi-checkbox');
    if (cb) cb.classList.toggle('checked', checked);
    card.classList.toggle('multi-checked', checked);
}

function updateMultiSelectBar(type) {
    const bar = document.getElementById('multi-select-bar');
    if (!bar) return;
    if (!multiSelectMode[type]) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'flex';
    const count = multiSelectedIds[type].size;
    document.getElementById('multi-select-count').textContent = T('已选 {n} 项', { n: count });

    const btns = document.getElementById('multi-select-action-btns');
    const disabledAttr = count === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '';
    let html = '';
    if (type === 'items') {
        html += `<button class="multi-action-btn status" ${disabledAttr} onclick="batchChangeStatusSelected()">${T('改状态')}</button>`;
    }
    html += `<button class="multi-action-btn delete" ${disabledAttr} onclick="batchDeleteSelected('${type}')">${T('删除')}</button>`;
    btns.innerHTML = html;
}

function renderMultiList(type) {
    if (type === 'items') renderItemsList();
    else if (type === 'gift') renderGiftList();
    else if (type === 'important') renderImportantList();
    else if (type === 'diary') renderDiaryList();
}

function batchDeleteSelected(type) {
    const ids = Array.from(multiSelectedIds[type]);
    if (ids.length === 0) return;

    const msg = T('确定删除选中的 {n} 项吗？删除后无法恢复。', { n: ids.length });

    showConfirm(T('批量删除'), msg, () => {
        if (type === 'items') {
            const items = getItems().filter(i => !ids.includes(i.id));
            localStorage.setItem('myItems', JSON.stringify(items));
        } else if (type === 'gift') {
            const records = getGiftRecords().filter(r => !ids.includes(r.id));
            localStorage.setItem('myGiftRecords', JSON.stringify(records));
        } else if (type === 'important') {
            const dates = getImportantDates().filter(d => !ids.includes(d.id));
            localStorage.setItem('myImportantDates', JSON.stringify(dates));
            renderCalendar();
            renderUpcomingDates();
            renderUpcoming7Days();
        } else if (type === 'diary') {
            const list = getDiaries().filter(d => !ids.includes(d.id));
            saveDiaries(list);
        }

        showToast(T('已删除'));
        exitMultiSelect(type);
        renderMultiList(type);

        if (type === 'items') updateItemStats();
    });
}

function batchChangeStatusSelected() {
    const ids = Array.from(multiSelectedIds.items);
    if (ids.length === 0) return;

    const btns = document.getElementById('multi-select-action-btns');
    btns.innerHTML = `
        <button class="multi-action-btn status" onclick="applyBatchStatus('持有中')">${T('持有中')}</button>
        <button class="multi-action-btn status" onclick="applyBatchStatus('暂离中')">${T('暂离中')}</button>
        <button class="multi-action-btn status" onclick="applyBatchStatus('已移除')">${T('已移除')}</button>
        <button class="multi-action-btn status" style="background:#eee;" onclick="updateMultiSelectBar('items')">${T('返回')}</button>
    `;
}

function applyBatchStatus(status) {
    const ids = Array.from(multiSelectedIds.items);
    if (ids.length === 0) return;

    let items = getItems();
    items = items.map(i => ids.includes(i.id) ? { ...i, status } : i);
    localStorage.setItem('myItems', JSON.stringify(items));

    showToast(T('已改为「{status}」', { status: T(status) }));
    exitMultiSelect('items');
    renderItemsList();
    updateItemStats();
}
function showToast(msg, type) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'success');
    t.textContent = msg;
    container.appendChild(t);
    // 强制重绘，触发动画
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 2000);
}

// ================= 初始化 =================
window.addEventListener('load', () => {
    applyTheme();
    
    // 读取默认启动页
    const t = getTheme();
    const startPageMap = {
        'home': 'page-home',
        'all-items': 'page-all-items',
        'gift-record': 'page-gift-record',
        'important-dates': 'page-important-dates'
    };
    const targetPage = startPageMap[t.startpage] || 'page-home';
    switchPage(targetPage);

    updateDashboard();
    updateFilterButtons();
    updateImportantMenuButtons();
    selectLevel('提醒');
    renderUpcomingDates();
    refreshDrawerInfo();
    applyCustomIcons();
    renderBookProgress();
    renderBookList();
    renderCategoryGrid();
    renderAcquireGrid();
    for (let i = 0; i < 3; i++) { renderGiftPhotoSlot(i); renderEventPhotoSlot(i); }
    
    // 所有返回箭头 ← 换成 SVG
    document.querySelectorAll('.back-arrow').forEach(el => {
        if (el.textContent.trim() === '←' || el.textContent.trim() === '<') {
            el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
        }
    });
    // 禁止日历长按选中文字
    document.querySelectorAll('.calendar-grid').forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.webkitTouchCallout = 'none';
    });

    // ====== 新增：检查应用锁 ======
    applyLanguage();
    checkAppLock();

    // 动态内容（列表、日历、弹窗等）生成后自动翻译
    if ((getTheme().lang || 'zh-CN') !== 'zh-CN') {
        let __transTimer = null;
        const obs = new MutationObserver(() => {
            if (__translating) return;
            clearTimeout(__transTimer);
            __transTimer = setTimeout(translateDOM, 60);
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
});

// ================= 应用锁验证 =================
let unlockPatternDrawing = false;
let unlockPatternSelected = [];
let unlockPatternPoints = [];
let lockoutInterval = null; // 用于倒计时刷新的定时器

function checkAppLock() {
    const l = getLockSettings();
    const overlay = document.getElementById('unlock-overlay');
    
    if (!l.type) {
        overlay.style.display = 'none';
        return;
    }
    
    overlay.style.display = 'flex';
    
    // 隐藏所有验证区
    document.getElementById('unlock-password-area').style.display = 'none';
    document.getElementById('unlock-fingerprint-area').style.display = 'none';
    document.getElementById('unlock-pattern-area').style.display = 'none';
    const lockoutMsg = document.getElementById('lockout-msg');
    lockoutMsg.style.display = 'none';
    clearInterval(lockoutInterval);

    // 检查是否在锁定期内
    if (l.lockUntil && Date.now() < l.lockUntil) {
        startLockoutTimer(l.lockUntil);
        return;
    }

    // 正常显示对应的解锁方式
    if (l.type === 'password') {
        document.getElementById('unlock-password-area').style.display = 'block';
        document.getElementById('unlock-pwd-input').value = '';
        setTimeout(() => document.getElementById('unlock-pwd-input').focus(), 100);
    } else if (l.type === 'fingerprint') {
        document.getElementById('unlock-fingerprint-area').style.display = 'block';
    } else if (l.type === 'pattern') {
        document.getElementById('unlock-pattern-area').style.display = 'block';
        initUnlockPatternCanvas();
    }
}

// 锁定倒计时显示逻辑
function startLockoutTimer(until) {
    const lockoutMsg = document.getElementById('lockout-msg');
    lockoutMsg.style.display = 'block';

    const update = () => {
        const remain = Math.ceil((until - Date.now()) / 1000);
        if (remain <= 0) {
            clearInterval(lockoutInterval);
            checkAppLock(); // 时间到了，重新检查，恢复输入
        } else {
            const m = Math.floor(remain / 60);
            const s = remain % 60;
            lockoutMsg.innerText = `尝试次数过多，请等待 ${m}分${s}秒 后重试`;
        }
    };
    update(); // 立即执行一次
    lockoutInterval = setInterval(update, 1000);
}

// 统一的密码/图形验证失败处理
function handleUnlockFail() {
    const l = getLockSettings();
    l.failCount = (l.failCount || 0) + 1; // 累加错误次数
    
    let lockTimeMs = 0;
    
    // 规则：累计 8 次错误（即超过 7 次）锁 7 分钟
    if (l.failCount === 8) {
        lockTimeMs = 7 * 60 * 1000;
        l.lockUntil = Date.now() + lockTimeMs;
        showToast('错误次数过多，锁定 7 分钟', 'error');
    } 
    // 规则：累计 11 次错误（即总共试了 10 次都是错的，再错第 11 次）锁 1 小时
    else if (l.failCount >= 11) {
        lockTimeMs = 60 * 60 * 1000;
        l.lockUntil = Date.now() + lockTimeMs;
        showToast('错误次数过多，锁定 1 小时', 'error');
    } 
    // 正常提示错误
    else {
        showToast(`密码/图案错误，还可尝试 ${7 - l.failCount} 次`, 'error');
    }
    
    localStorage.setItem('myLock', JSON.stringify(l));
    
    if (lockTimeMs > 0) {
        // 如果触发了锁定，立即清空输入并显示倒计时
        if (document.getElementById('unlock-pwd-input')) document.getElementById('unlock-pwd-input').value = '';
        checkAppLock();
    }
}

// 统一的解锁成功处理
function handleUnlockSuccess() {
    const l = getLockSettings();
    l.failCount = 0; // 成功则清零
    l.lockUntil = 0;
    localStorage.setItem('myLock', JSON.stringify(l));
    
    document.getElementById('unlock-overlay').style.display = 'none';
    clearInterval(lockoutInterval);
}

function verifyPassword() {
    const l = getLockSettings();
    const input = document.getElementById('unlock-pwd-input').value;
    
    if (input === l.password) {
        handleUnlockSuccess();
    } else {
        document.getElementById('unlock-pwd-input').value = '';
        handleUnlockFail();
    }
}

function verifyFingerprint() {
    // 模拟指纹验证
    setTimeout(() => {
        document.getElementById('unlock-overlay').style.display = 'none';
        showToast(T('指纹验证成功'));
    }, 500);
}

// --- 图形锁验证 ---
function initUnlockPatternCanvas() {
    const canvas = document.getElementById('unlock-pattern-canvas');
    const cellSize = canvas.width / 3;
    unlockPatternPoints = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            unlockPatternPoints.push({ x: cellSize * c + cellSize / 2, y: cellSize * r + cellSize / 2, index: r * 3 + c });
        }
    }
    unlockPatternSelected = [];
    drawUnlockPattern();
    document.getElementById('unlock-pattern-hint').innerText = '';

    canvas.onmousedown = (e) => { unlockPatternDrawing = true; handleUnlockPatternMove(e); };
    canvas.onmousemove = (e) => { if (unlockPatternDrawing) handleUnlockPatternMove(e); };
    canvas.onmouseup = () => { unlockPatternDrawing = false; finishUnlockPattern(); };

    canvas.ontouchstart = (e) => { e.preventDefault(); unlockPatternDrawing = true; handleUnlockPatternMove(e.touches[0]); };
    canvas.ontouchmove = (e) => { e.preventDefault(); if (unlockPatternDrawing) handleUnlockPatternMove(e.touches[0]); };
    canvas.ontouchend = (e) => { e.preventDefault(); unlockPatternDrawing = false; finishUnlockPattern(); };
}

function handleUnlockPatternMove(e) {
    const canvas = document.getElementById('unlock-pattern-canvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pos = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };

    unlockPatternPoints.forEach(p => {
        if (unlockPatternSelected.includes(p.index)) return;
        const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2);
        if (dist < 30) {
            unlockPatternSelected.push(p.index);
            if (navigator.vibrate) navigator.vibrate(20);
        }
    });
    drawUnlockPattern(pos);
}

function drawUnlockPattern(currentPos) {
    const canvas = document.getElementById('unlock-pattern-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    unlockPatternPoints.forEach(p => {
        const selected = unlockPatternSelected.includes(p.index);
        ctx.beginPath();
        ctx.arc(p.x, p.y, selected ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = selected ? '#d98880' : '#bbb';
        ctx.fill();
    });

    if (unlockPatternSelected.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#d98880';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < unlockPatternSelected.length - 1; i++) {
            const a = unlockPatternPoints[unlockPatternSelected[i]];
            const b = unlockPatternPoints[unlockPatternSelected[i + 1]];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }
        if (currentPos && unlockPatternDrawing) {
            const last = unlockPatternPoints[unlockPatternSelected[unlockPatternSelected.length - 1]];
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(currentPos.x, currentPos.y);
        }
        ctx.stroke();
    }
}

function finishUnlockPattern() {
    unlockPatternDrawing = false;
    if (unlockPatternSelected.length < 4) {
        document.getElementById('unlock-pattern-hint').innerText = T('至少连接 4 个点');
        setTimeout(() => { unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = ''; }, 800);
        return;
    }

    const patternStr = unlockPatternSelected.join('-');
    const l = getLockSettings();

    if (patternStr === l.pattern) {
        handleUnlockSuccess();
    } else {
        document.getElementById('unlock-pattern-hint').innerText = T('图案错误，请重试');
        setTimeout(() => { unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = ''; }, 800);
        handleUnlockFail();
    }
}

// ================= 全局：点击外部收起弹窗 =================
document.addEventListener('click', function(e) {
    // 1. 全部物品的搜索栏
    const searchWrapper = document.getElementById('search-bar-wrapper');
    const searchIcon = document.querySelector('#page-all-items h3 + span') ||
                       document.querySelector('#page-all-items .page-main-title ~ span');
    if (searchWrapper && searchWrapper.style.display === 'block') {
        const inWrapper = searchWrapper.contains(e.target);
        const inIcon = searchIcon && searchIcon.contains(e.target);
        // 也检查一下这个点击是否来自 toggleSearchBar 的 onclick（图标可能没有被 querySelector 精确匹配）
        const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleSearchBar"]');
        if (!inWrapper && !inIcon && !isToggleClick) {
            searchWrapper.style.display = 'none';
            document.getElementById('search-input').value = ''; // 加上这句清空
            renderItemsList(); // 加上这句恢复列表
        }
    }

    // 2. 重要日期的搜索栏
    const impSearchBar = document.getElementById('important-search-bar');
    if (impSearchBar && impSearchBar.style.display === 'block') {
        const inBar = impSearchBar.contains(e.target);
        const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleImportantSearch"]');
        if (!inBar && !isToggleClick) {
            impSearchBar.style.display = 'none';
            // 同步清空关键词
            if (typeof importantSearchKeyword !== 'undefined') importantSearchKeyword = '';
            const inp = document.getElementById('important-search-input');
            if (inp) inp.value = '';
            if (typeof renderCalendar === 'function') renderCalendar();
        }
    }

    // 3. 重要日期的 ⋯ 菜单
    const impMenu = document.getElementById('important-menu');
    if (impMenu && impMenu.style.display === 'block') {
        const inMenu = impMenu.contains(e.target);
        const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleImportantMenu"]');
        if (!inMenu && !isToggleClick) {
            if (typeof closeImportantMenu === 'function') closeImportantMenu();
        }
    }
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
// ===== 日记/便签：列表页、只读页、任务清单 =====
function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function openDiaryList(dateStr, type) {
    currentDiaryListDate = dateStr;
    currentDiaryListType = type;
    document.getElementById('diary-list-title').textContent = T(type);
    renderDiaryList();
    switchPage('page-diary-list');
}

function renderDiaryList() {
    const container = document.getElementById('diary-list-content');
    if (!container) return;
    const list = getDiaries()
        .filter(d => d.date === currentDiaryListDate && d.type === currentDiaryListType)
        .sort((a, b) => b.createdAt - a.createdAt);

    if (list.length === 0) {
        container.innerHTML = `<div class="diary-list-empty">${T('这一天还没有记录')}</div>`;
        return;
    }
    container.innerHTML = '';
    list.forEach(d => {
        const isMulti = multiSelectMode.diary;
        const isChecked = isMulti && multiSelectedIds.diary.has(d.id);

        const card = document.createElement('div');
        card.className = 'diary-list-card' + (d.type === '便签' ? ' note' : '');
        if (isChecked) card.classList.add('multi-checked');
        card.setAttribute('data-multi-id', `diary-${d.id}`);

        const icon = d.type === '日记' ? '📔' : '📝';
        const time = new Date(d.createdAt);
        const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
        let preview = (d.content || '').replace(/^[□☑✓]\s*/gm, '').trim();
        const checkboxHtml = isMulti ? `<div class="multi-checkbox ${isChecked ? 'checked' : ''}"></div>` : '';
        card.innerHTML = `
            ${checkboxHtml}
            <div class="diary-list-card-header">
                <span>${icon} ${T(d.type)}</span>
                <span>${timeStr}</span>
            </div>
            ${d.title ? `<div class="diary-list-card-title">${escapeHtml(d.title)}</div>` : ''}
            ${preview ? `<div class="diary-list-card-preview">${escapeHtml(preview)}</div>` : ''}
        `;

        if (isMulti) {
            card.onclick = () => toggleMultiSelected('diary', d.id);
        } else {
            card.onclick = () => showDiaryView(d.id);
            bindLongPress(card, () => {
                showConfirm(T('删除日记'), T('确定删除这条{type}吗？', { type: T(d.type) }), () => {
                    const list2 = getDiaries().filter(x => x.id !== d.id);
                    saveDiaries(list2);
                    showToast(T('已删除'));
                    renderDiaryList();
                });
            });
        }

        container.appendChild(card);
    });
}

function backToDiaryList() {
    switchPage('page-diary-list');
    setTimeout(() => renderDiaryList(), 30);
}

function showDiaryView(id) {
    const d = getDiaries().find(x => x.id === id);
    if (!d) return;
    currentDiaryViewId = id;

    const icon = d.type === '日记' ? '📔' : '📝';
    const time = new Date(d.createdAt);
    const timeStr = `${time.getFullYear()}-${String(time.getMonth()+1).padStart(2,'0')}-${String(time.getDate()).padStart(2,'0')} ${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;

    document.getElementById('diary-view-content').innerHTML = `
        <div class="card">
            <div class="diary-view-meta">
                <span>${icon} ${T(d.type)}</span>
                <span>${timeStr}</span>
            </div>
            ${d.title ? `<div class="diary-view-title">${escapeHtml(d.title)}</div>` : ''}
            ${renderDiaryViewBody(d)}
        </div>
    `;
    switchPage('page-diary-view');
}

function renderDiaryViewBody(d) {
    const content = d.content || '';
    const lines = content.split('\n');
    const hasTask = lines.some(l => /^[□☑✓]/.test(l));

    if (!hasTask) {
        return `<div class="diary-view-body">${escapeHtml(content)}</div>`;
    }

    let html = '';
    lines.forEach((line, idx) => {
        const m = line.match(/^([□☑✓])\s*(.*)$/);
        if (m) {
            const checked = m[1] !== '□';
            const text = m[2] || '&nbsp;';
            html += `<div class="diary-task-item ${checked ? 'checked' : ''}" data-line="${idx}" onclick="toggleDiaryTask(${idx})">
                <div class="diary-task-box"></div>
                <div class="diary-task-text">${m[2] ? escapeHtml(m[2]) : '&nbsp;'}</div>
            </div>`;
        } else if (line.trim()) {
            html += `<div style="margin:6px 0; color:var(--text-sub); font-size:13px; white-space:pre-wrap;">${escapeHtml(line)}</div>`;
        }
    });
    return html;
}

function toggleDiaryTask(lineIndex) {
    const diaries = getDiaries();
    const d = diaries.find(x => x.id === currentDiaryViewId);
    if (!d) return;
    const lines = (d.content || '').split('\n');
    const line = lines[lineIndex];
    if (!line) return;
    const m = line.match(/^([□☑✓])(\s*)(.*)$/);
    if (!m) return;
    const newMark = m[1] === '□' ? '☑' : '□';
    lines[lineIndex] = newMark + m[2] + m[3];
    d.content = lines.join('\n');
    saveDiaries(diaries);

    const el = document.querySelector(`#diary-view-content .diary-task-item[data-line="${lineIndex}"]`);
    if (el) el.classList.toggle('checked', newMark === '☑');
}

function editDiaryFromView() {
    if (!currentDiaryViewId) return;
    editDiary(currentDiaryViewId);
}

function deleteDiaryFromView() {
    if (!currentDiaryViewId) return;
    const d = getDiaries().find(x => x.id === currentDiaryViewId);
    if (!d) return;
    showConfirm(T('删除日记'), T('确定删除这条{type}吗？', { type: T(d.type) }), () => {
        let list = getDiaries().filter(x => x.id !== currentDiaryViewId);
        saveDiaries(list);
        showToast(T('已删除'));
        currentDiaryViewId = null;
        switchPage('page-diary-list');
        setTimeout(() => renderDiaryList(), 30);
    });
}

function showTemplateModalFromList() {
    diaryEditSource = 'list';
    currentDiaryType = currentDiaryListType;
    diaryPanelDate = currentDiaryListDate;
    document.getElementById('type-chip-diary').classList.toggle('active', currentDiaryType === '日记');
    document.getElementById('type-chip-note').classList.toggle('active', currentDiaryType === '便签');
    renderTemplateGrid();
    document.getElementById('template-modal').style.display = 'flex';
}

function longPressNewDiary(dateStr) {
    isLongPress = false;  // 长按已触发，无需再拦截后续 selectCalDay
    diaryPanelDate = dateStr;
    diaryEditSource = 'calendar';
    currentDiaryType = '日记';
    document.getElementById('type-chip-diary').classList.add('active');
    document.getElementById('type-chip-note').classList.remove('active');
    renderTemplateGrid();
    document.getElementById('template-modal').style.display = 'flex';
}

function openDiaryPanel(dateStr) {
    diaryPanelDate = dateStr;
    const d = new Date(dateStr);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('diary-panel-date').textContent = T('{y}年{m}月{day}日', { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() });
    document.getElementById('diary-panel-weekday').textContent = t('date.weekday.' + d.getDay());
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
        body.innerHTML = `<p style="text-align:center; color:#999; padding:40px 20px;">${T('这一天还没有记录')}<br><br>${T('点右上角')} <b style="color:#d98880;">+</b> ${T('添加日记或便签')}</p>`;
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
                <span class="diary-card-type">${icon} ${d.type === '日记' ? T('日记') : T('便签')}</span>
                <span class="diary-card-time">${timeStr}</span>
            </div>
            ${d.title ? `<div class="diary-card-title">${d.title}</div>` : ''}
            <div class="diary-card-content">${(d.content || '').replace(/</g,'&lt;')}</div>
        `;
                // 长按删除
        bindLongPress(card, () => {
            showConfirm(T('删除日记'), T('确定删除这条{type}吗？', { type: T(d.type) }), () => {
                let diaries = getDiaries().filter(x => x.id !== d.id);
                saveDiaries(diaries);
                showToast(T('已删除'));
                renderDiaryPanel(dateStr);
            });
        });

        body.appendChild(card);
    });
}

function showTemplateModal() {
    closeDiaryPanel();
    diaryEditSource = 'panel';
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
    templates.forEach(tpl => {
        const div = document.createElement('div');
        div.className = 'template-item';
        div.setAttribute('onclick', `selectTemplate('${tpl.id}')`);
        div.innerHTML = `<div class="template-icon">${tpl.icon}</div><div class="template-name">${T(tpl.name)}</div>`;
        grid.appendChild(div);
    });
}

function selectTemplate(templateId) {
    const templates = currentDiaryType === '日记' ? diaryTemplates : noteTemplates;
    const t = templates.find(x => x.id === templateId);
    if (!t) return;

    editingDiaryId = null;
    currentDiaryTemplate = t.id;
    document.getElementById('diary-edit-title').textContent = currentDiaryType === '日记' ? T('写日记') : T('写便签');
    document.getElementById('diary-title-input').value = '';
    document.getElementById('diary-content-input').value = t.content;
    document.getElementById('diary-delete-btn').style.display = 'none';

    closeTemplateModal();
    document.getElementById('diary-panel').classList.remove('open');
    document.getElementById('diary-panel-overlay').classList.remove('open');
    switchPage('page-diary-edit');
}

function editDiary(id) {
    const d = getDiaries().find(x => x.id === id);
    if (!d) return;
    const activePage = document.querySelector('.page.active')?.id;
    diaryEditSource = (activePage === 'page-diary-view' || activePage === 'page-diary-list') ? 'list' : 'panel';
    editingDiaryId = id;
    diaryPanelDate = d.date;
    currentDiaryType = d.type;
    document.getElementById('diary-edit-title').textContent = d.type === '日记' ? T('编辑日记') : T('编辑便签');
    document.getElementById('diary-title-input').value = d.title || '';
    document.getElementById('diary-content-input').value = d.content || '';
    document.getElementById('diary-delete-btn').style.display = 'block';
    document.getElementById('diary-panel').classList.remove('open');
    document.getElementById('diary-panel-overlay').classList.remove('open');
    switchPage('page-diary-edit');
}

function saveDiary() {
    if (!diaryPanelDate) { showToast(T('日期错误'), 'error'); return; }
    const title = document.getElementById('diary-title-input').value.trim();
    const content = document.getElementById('diary-content-input').value;
    if (!title && !content.trim()) { showToast(T('内容不能为空'), 'error'); return; }

    let diaries = getDiaries();
    let savedId;
    const wasEditing = !!editingDiaryId;

    if (editingDiaryId) {
        savedId = editingDiaryId;
        const idx = diaries.findIndex(d => d.id === editingDiaryId);
        if (idx !== -1) diaries[idx] = { ...diaries[idx], title, content };
        showToast(T('修改成功！'));
    } else {
        savedId = Date.now();
        diaries.push({
            id: savedId,
            date: diaryPanelDate,
            type: currentDiaryType,
            title,
            content,
            createdAt: Date.now()
        });
        showToast(T('保存成功！'));
    }
    saveDiaries(diaries);
    editingDiaryId = null;

    if (diaryEditSource === 'list') {
        if (wasEditing) {
            showDiaryView(savedId);
        } else {
            currentDiaryListType = currentDiaryType;
            switchPage('page-diary-list');
            setTimeout(() => renderDiaryList(), 30);
        }
    } else if (diaryEditSource === 'calendar') {
        switchPage('page-important-dates');
        setTimeout(() => selectCalDay(diaryPanelDate), 100);
    } else {
        switchPage('page-important-dates');
        setTimeout(() => openDiaryPanel(diaryPanelDate), 150);
    }
}

function cancelDiaryEdit() {
    const wasEditing = !!editingDiaryId;
    const editId = editingDiaryId;
    editingDiaryId = null;

    if (diaryEditSource === 'list') {
        if (wasEditing) {
            showDiaryView(editId);
        } else {
            switchPage('page-diary-list');
            setTimeout(() => renderDiaryList(), 30);
        }
    } else if (diaryEditSource === 'calendar') {
        switchPage('page-important-dates');
        setTimeout(() => selectCalDay(diaryPanelDate), 100);
    } else {
        switchPage('page-important-dates');
        setTimeout(() => { if (diaryPanelDate) openDiaryPanel(diaryPanelDate); }, 150);
    }
}

function deleteDiary() {
    if (!editingDiaryId) return;
    if (!confirm(T('确定删除这条记录吗？'))) return;
    let diaries = getDiaries().filter(d => d.id !== editingDiaryId);
    saveDiaries(diaries);
    editingDiaryId = null;

    if (diaryEditSource === 'list') {
        currentDiaryViewId = null;
        switchPage('page-diary-list');
        setTimeout(() => renderDiaryList(), 30);
    } else if (diaryEditSource === 'calendar') {
        switchPage('page-important-dates');
        setTimeout(() => selectCalDay(diaryPanelDate), 100);
    } else {
        switchPage('page-important-dates');
        setTimeout(() => openDiaryPanel(diaryPanelDate), 150);
    }
}

// ================= 纯净版：四大主页左右滑动 =================
const swipePages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
let swipeStartX = 0;
let swipeStartY = 0;

document.addEventListener('touchstart', (e) => {
    // 如果你按到了底部导航栏、悬浮按钮，或者弹出层，就不记录滑动
    if (e.target.closest('.bottom-nav') || e.target.closest('.floating-add-btn') || e.target.closest('.modal')) {
        swipeStartX = -1;
        return;
    }
    if (document.getElementById('side-drawer').classList.contains('open')) return;
    if (document.getElementById('diary-panel').classList.contains('open')) return;

    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (swipeStartX === -1) return; // 如果在导航栏点按，忽略
    if (document.getElementById('side-drawer').classList.contains('open')) return;
    if (document.getElementById('diary-panel').classList.contains('open')) return;

    const swipeEndX = e.changedTouches[0].clientX;
    const swipeEndY = e.changedTouches[0].clientY;
    
    const deltaX = swipeEndX - swipeStartX;
    const deltaY = swipeEndY - swipeStartY;

    // 滑动距离大于 70px，且是横向滑动
    if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;
        
        const currentIndex = swipePages.indexOf(activePage.id);
        if (currentIndex === -1) return;

        if (deltaX < 0) {
            // 向左滑
            if (currentIndex < swipePages.length - 1) {
                switchPage(swipePages[currentIndex + 1]);
            } else if (activePage.id === 'page-important-dates') {
                const d = new Date();
                const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                openDiaryPanel(diaryPanelDate || todayStr);
            }
        } else {
            // 向右滑
            if (currentIndex > 0) {
                switchPage(swipePages[currentIndex - 1]);
            } else if (activePage.id === 'page-home') {
                openDrawer();
            }
        }
    }
}, { passive: true });