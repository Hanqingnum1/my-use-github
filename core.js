// ================= 全局变量 =================
let multiSelectMode = { items: false, gift: false, important: false, diary: false, books: false };
let multiSelectedIds = { items: new Set(), gift: new Set(), important: new Set(), diary: new Set(), books: new Set() };
let currentInputId = null;
let selectedYear = null, selectedMonth = null, selectedDay = null;
let pickerStep = 'year';
let pickerMode = 'full';
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
let importantListFilter = 'all';
let selectedImportantLevel = '提醒';
let editingImportantId = null;
let selectedImportantType = '普通';
let selectedCalendarType = '阳历';
let currentImportantDetailId = null;
let importantDetailSource = null;
let selectedEventChipName = null;
let selectedGiftType = '随礼';
let currentEventId = null;
let editingEventId = null;
let patternPoints = [];
let patternSelected = [];
let patternDrawing = false;
let patternFirstAttempt = null;
let patternMode = 'set';
let cropTarget = 'wallpaper';
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
let diaryPanelDate = null;
let currentDiaryType = '日记';
let selectedCalDate = null;
let currentDiaryViewId = null;
let currentDiaryListType = '日记';
let currentDiaryListDate = null;
let diaryEditSource = 'panel';
let currentDiaryTemplate = null;
let editingDiaryId = null;
let isLongPress = false;
let longPressTimer = null;
let confirmCallback = null;
let itemLongPressTimer = null;
let itemLongPressFired = false;
let allItemsTopFilter = '';
let allItemsFilter = 'all';
let allItemsCategory = '';
let allItemsSort = 'default';
let allItemsView = 'list';
let selectedAcquire = '网购';
let selectedItemStatus = '持有中';
let allItemsSortDir = 'desc';
let editingItemImages = ['', '', ''];
let selectedCategoryName = '';
let giftPhotos = ['', '', ''];
let eventPhotos = ['', '', ''];
let giftTopFilter = '';
let giftCategoryFilter = '';
let giftSort = 'default';
let giftSortDir = 'desc';
let giftView = 'list';
let computedSpentDays = 0;
let bookFilterStatus = 'all';
let bookSort = 'default';
let bookSortDir = 'desc';
let bookView = 'list';
let currentBookViewId = null;
let iconSrcImage = null;
let selectedIconCells = [];
let promptCallback = null;
let alertCallback = null;
let unlockPatternDrawing = false;
let unlockPatternSelected = [];
let unlockPatternPoints = [];
let lockoutInterval = null;

const nationalHolidays = {
    '01-01': '元旦', '02-14': '情人节', '03-08': '妇女节', '03-12': '植树节',
    '04-01': '愚人节', '05-01': '劳动节', '05-04': '青年节', '06-01': '儿童节',
    '07-01': '建党节', '08-01': '建军节', '09-10': '教师节',
    '10-01': '国庆节', '12-24': '平安夜', '12-25': '圣诞节'
};

// ================= 多语言字典 (请将你代码里的 i18nData 和 I18N 整个复制到这里) =================
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
        '普通': 'Normal',
        '生日': 'Birthday',
        '纪念日': 'Anniversary',
        '阴历': 'Lunar',
        '阳历': 'Solar',
        '已相伴': 'Together for',
        '下次提醒': 'Next Reminder',
        '添加日期': 'Add Date',
        '下次：': 'Next: ',
        '未结束': 'Ongoing',
        '已结束': 'Ended',
        '非常重要': 'Very Important',
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
        '普通': 'Normal',
        '生日': 'Geburtstag',
        '纪念日': 'Jahrestag',
        '阴历': 'Mondkalender',
        '阳历': 'Sonnenkalender',
        '已相伴': 'Zusammen seit',
        '下次提醒': 'Nächste Erinnerung',
        '添加日期': 'Datum hinzufügen',
        '下次：': 'Nächstes: ',
        '未结束': 'Laufend',
        '已结束': 'Beendet',
        '非常重要': 'Sehr wichtig',
    }
};
// -----------------------------------------------------------

function T(zh, params) {
    const lang = getTheme().lang || 'zh-CN';
    let text = zh;
    if (lang !== 'zh-CN' && I18N[lang] && I18N[lang][zh]) { text = I18N[lang][zh]; }
    if (params) { Object.keys(params).forEach(k => { text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), () => params[k]); }); }
    return text;
}
let __translating = false;
function translateDOM() {
    const lang = getTheme().lang || 'zh-CN';
    const dict = I18N[lang];
    
    // 允许 lang === 'zh-CN' 时继续执行，用于把外文还原回中文
    if (lang !== 'zh-CN' && (!dict || __translating)) return;
    if (__translating) return;
    __translating = true;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const toTranslate = [];
    let n;
    while ((n = walker.nextNode())) {
        const p = n.parentElement;
        if (!p || p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
        
        // 核心：第一次遇到包含中文的节点时，把原始中文死记硬背下来
        if (!n._origText) {
            if (/[\u4e00-\u9fa5]/.test(n.textContent)) {
                n._origText = n.textContent;
            } else {
                continue;
            }
        }
        toTranslate.push(n);
    }
    
    toTranslate.forEach(node => {
        const raw = node._origText;
        const trimmed = raw.trim();
        if (lang === 'zh-CN') {
            node.textContent = raw; // 切回中文时直接还原
        } else if (dict && dict[trimmed]) {
            node.textContent = raw.replace(trimmed, dict[trimmed]);
        } else {
            node.textContent = raw; // 查不到翻译就保持原样
        }
    });

    // 同步处理输入框 placeholder 的双向翻译
    document.querySelectorAll('[placeholder]').forEach(el => { 
        if (!el._origPh) {
            if (/[\u4e00-\u9fa5]/.test(el.placeholder)) {
                el._origPh = el.placeholder;
            } else {
                return;
            }
        }
        if (lang === 'zh-CN') {
            el.placeholder = el._origPh;
        } else if (dict && dict[el._origPh]) {
            el.placeholder = dict[el._origPh];
        }
    });

    // 同步处理 title 的双向翻译
    document.querySelectorAll('[title]').forEach(el => { 
        if (!el._origTitle) {
            if (/[\u4e00-\u9fa5]/.test(el.title)) {
                el._origTitle = el.title;
            } else {
                return;
            }
        }
        if (lang === 'zh-CN') {
            el.title = el._origTitle;
        } else if (dict && dict[el._origTitle]) {
            el.title = dict[el._origTitle];
        }
    });
    
    __translating = false;
}
function t(key, params) {
    const lang = getTheme().lang || 'zh-CN';
    let text = (i18nData[lang] && i18nData[lang][key]) || (i18nData['zh-CN'] && i18nData['zh-CN'][key]) || key;
    if (params) { Object.keys(params).forEach(k => { text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), () => params[k]); }); }
    return text;
}
function applyLanguage() {
    translateDOM();
    if (typeof renderBookProgress === 'function') renderBookProgress();
    if (typeof renderUpcomingDates === 'function') renderUpcomingDates();
    const activePage = document.querySelector('.page.active')?.id;
    if (activePage === 'page-home' && typeof updateDashboard === 'function') updateDashboard();
    if (activePage === 'page-all-items') { if (typeof updateItemStats === 'function') updateItemStats(); if (typeof renderItemsList === 'function') renderItemsList(); }
    if (activePage === 'page-gift-record' && typeof renderGiftList === 'function') renderGiftList();
    if (activePage === 'page-important-dates') { if (typeof renderCalendar === 'function') renderCalendar(); if (typeof renderUpcoming7Days === 'function') renderUpcoming7Days(); }
    if (activePage === 'page-book-list' && typeof renderBookList === 'function') renderBookList();
    const importantListView = document.getElementById('important-list-view');
    if (importantListView && importantListView.style.display === 'block' && typeof renderImportantList === 'function') renderImportantList();
    const diaryPanel = document.getElementById('diary-panel');
    if (diaryPanel && diaryPanel.classList.contains('open') && diaryPanelDate && typeof renderDiaryPanel === 'function') renderDiaryPanel(diaryPanelDate);
    translateDOM();
}

// ================= 页面切换 =================
function switchPage(pageId) {
    if (document.body.classList.contains('multi-select-mode')) {
        ['items', 'gift', 'important', 'diary', 'books'].forEach(t => { if (multiSelectMode[t]) exitMultiSelect(t); });
    }
    const mainPages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.display = mainPages.includes(pageId) ? 'flex' : 'none';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (!el) return;
    el.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if (pageId === 'page-home') {
        document.getElementById('nav-home').classList.add('active');
        updateDashboard(); renderUpcomingDates(); renderBookProgress();
    } else if (pageId === 'page-item-distribution') {
        document.getElementById('nav-all-items').classList.add('active'); setTimeout(initItemChart, 100);
    } else if (pageId === 'page-gift-distribution') {
        document.getElementById('nav-gift').classList.add('active'); setTimeout(initGiftChart, 100);
    } else if (pageId === 'page-all-items') {
        document.getElementById('nav-all-items').classList.add('active'); updateItemStats(); renderItemsList();
    } else if (pageId === 'page-gift-record') {
        document.getElementById('nav-gift').classList.add('active');
        giftTopFilter = ''; giftCategoryFilter = '';
        const gc = document.getElementById('stat-gift-card'); const rc = document.getElementById('stat-receive-card');
        if (gc) gc.classList.remove('active'); if (rc) rc.classList.remove('active');
        const sw = document.getElementById('gift-search-bar-wrapper'); const si = document.getElementById('gift-search-input');
        if (sw) sw.style.display = 'none'; if (si) si.value = '';
        renderGiftList();
    } else if (pageId === 'page-important-dates') {
        document.getElementById('nav-important').classList.add('active'); backToCalendar(); renderUpcoming7Days();
    } else if (pageId === 'page-book-list') {
        document.getElementById('nav-home').classList.add('active'); renderBookList();
    } else if (['page-add','page-add-gift','page-gift-detail','page-add-event','page-add-important','page-important-detail','page-profile','page-theme','page-backup','page-lock','page-about','page-event-detail','page-diary-edit','page-diary-list','page-diary-view','page-book-detail','page-book-view'].includes(pageId)) {
        document.getElementById('nav-home').classList.add('active');
    }
    const themeMap = { 'page-all-items': '#4A90A4', 'page-gift-record': '#C0392B', 'page-important-dates': '#7B68A6', 'page-book-list': '#8B6F47', 'page-book-view': '#8B6F47', 'page-book-detail': '#8B6F47' };
    const pageColor = themeMap[pageId] || 'var(--primary)';
    document.body.style.setProperty('--page-color', pageColor);
    document.body.style.setProperty('--nav-active-color', pageColor);
    window.scrollTo(0, 0);
    
    // 修复图表在隐藏状态下初始化导致空白的问题
    if (pageId === 'page-item-distribution' && typeof myChart !== 'undefined' && myChart) {
        setTimeout(() => myChart.resize(), 150);
    }
    if (pageId === 'page-gift-distribution' && typeof myGiftChart !== 'undefined' && myGiftChart) {
        setTimeout(() => myGiftChart.resize(), 150);
    }
}

// ================= 抽屉/主题/备份/应用锁等 (将原代码对应的函数全部粘贴在此) =================
function openDrawer() { document.getElementById('side-drawer').classList.add('open'); document.getElementById('drawer-overlay').classList.add('open'); refreshDrawerInfo(); }
function closeDrawer() { document.getElementById('side-drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('open'); }
function openDrawerPage(pageId) {
    closeDrawer();
    setTimeout(() => { switchPage(pageId); if (pageId === 'page-profile') loadProfile(); if (pageId === 'page-theme') loadTheme(); if (pageId === 'page-lock') loadLockSettings(); if (pageId === 'page-backup') updateStorageUsage(); }, 250);
}
function refreshDrawerInfo() {
    const p = getProfile(); document.getElementById('drawer-name').textContent = p.nickname || T('未设置昵称'); document.getElementById('drawer-sign').textContent = p.sign || T('点击设置个性签名');
    const av = document.getElementById('drawer-avatar'); if (p.avatar) av.innerHTML = `<img src="${p.avatar}">`; else av.innerHTML = '👤';
}
function getProfile() { return JSON.parse(localStorage.getItem('myProfile')) || { nickname: '', sign: '', avatar: '' }; }
function saveProfile(p) { localStorage.setItem('myProfile', JSON.stringify(p)); refreshDrawerInfo(); }
function loadProfile() { const p = getProfile(); document.getElementById('profile-nickname-display').textContent = p.nickname || T('未设置昵称'); document.getElementById('profile-sign-display').textContent = p.sign || T('点击设置个性签名'); if (p.avatar) document.getElementById('profile-avatar-img').src = p.avatar; }
function uploadAvatar(input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => compressImage(e.target.result, 800, (b64) => { cropTarget = 'avatar'; cropImgSrc = b64; showCropWindow(); }); reader.readAsDataURL(input.files[0]); }
function editField(field) {
    const p = getProfile();
    if (field === 'nickname') { showPrompt(T('修改昵称'), p.nickname || '', (v) => { p.nickname = v.trim(); saveProfile(p); loadProfile(); }); }
    else { showPrompt(T('修改个性签名'), p.sign || '', (v) => { p.sign = v.trim(); saveProfile(p); loadProfile(); }); }
}
function getTheme() { return JSON.parse(localStorage.getItem('myTheme')) || { color: '#d98880', dark: false, wallpaper: '' }; }
function saveTheme(t) { localStorage.setItem('myTheme', JSON.stringify(t)); }
function applyTheme() {
    const t = getTheme(); document.documentElement.style.setProperty('--primary', t.color); document.body.classList.toggle('dark-mode', !!t.dark);
    if (t.wallpaper) { document.body.style.backgroundImage = `url(${t.wallpaper})`; document.body.style.backgroundSize = 'cover'; document.body.style.backgroundAttachment = 'fixed'; } else { document.body.style.backgroundImage = ''; }
}
function loadTheme() { const t = getTheme(); document.getElementById('setting-lang').value = t.lang || 'zh-CN'; document.getElementById('setting-startpage').value = t.startpage || 'home'; document.getElementById('dark-mode-toggle').checked = !!t.dark; }
function saveSetting(k, v) { 
    const theme = getTheme(); theme[k] = v; saveTheme(theme); 
    if (k === 'lang') { 
        showToast(T('正在切换语言...') || '正在切换语言...');
        setTimeout(() => {
            // 不再强制刷新，直接调用全局的语言渲染函数
            applyLanguage(); 
            showToast('Language switched successfully / 语言已切换');
        }, 100);
    } 
}
function setThemeColor(c) { const t = getTheme(); t.color = c; saveTheme(t); applyTheme(); }
function toggleDarkMode(on) { const t = getTheme(); t.dark = on; saveTheme(t); applyTheme(); }
function uploadWallpaper(input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => { compressImage(e.target.result, 1200, (b64) => { cropTarget = 'wallpaper'; cropImgSrc = b64; showCropWindow(); }); }; reader.readAsDataURL(input.files[0]); }
function showCropWindow() {
    const overlay = document.getElementById('crop-overlay'); const win = document.getElementById('wallpaper-crop-window'); const img = document.getElementById('wallpaper-crop-img'); const border = document.getElementById('crop-border');
    overlay.style.display = 'flex';
    if (cropTarget === 'avatar') { win.style.width = '240px'; win.style.height = '240px'; win.style.borderRadius = '50%'; if (border) border.style.borderRadius = '50%'; }
    else { win.style.width = '220px'; win.style.height = '390px'; win.style.borderRadius = '16px'; if (border) border.style.borderRadius = '16px'; }
    const tipEl = document.getElementById('crop-tip-text'); if (tipEl) tipEl.textContent = cropTarget === 'avatar' ? T('拖动图片选择头像区域（正方形）：') : T('拖动图片选择显示区域：');
    img.onload = () => {
        cropImgNaturalW = img.naturalWidth; cropImgNaturalH = img.naturalHeight; const winW = win.clientWidth; const winH = win.clientHeight;
        const scale = Math.max(winW / cropImgNaturalW, winH / cropImgNaturalH); cropImgDisplayW = cropImgNaturalW * scale; cropImgDisplayH = cropImgNaturalH * scale;
        img.style.width = cropImgDisplayW + 'px'; img.style.height = cropImgDisplayH + 'px';
        cropImgX = (winW - cropImgDisplayW) / 2; cropImgY = (winH - cropImgDisplayH) / 2; updateCropPosition(); bindCropDrag();
    };
    img.src = cropImgSrc;
}
function bindCropDrag() {
    const win = document.getElementById('wallpaper-crop-window');
    win.onmousedown = null; win.onmousemove = null; win.onmouseup = null; win.onmouseleave = null; win.ontouchstart = null; win.ontouchmove = null; win.ontouchend = null;
    const startDrag = (x, y) => { cropDragging = true; cropStartX = x - cropImgX; cropStartY = y - cropImgY; };
    const moveDrag = (x, y) => {
        if (!cropDragging) return; let newX = x - cropStartX; let newY = y - cropStartY; const winW = win.clientWidth; const winH = win.clientHeight;
        if (newX > 0) newX = 0; if (newY > 0) newY = 0; if (newX < winW - cropImgDisplayW) newX = winW - cropImgDisplayW; if (newY < winH - cropImgDisplayH) newY = winH - cropImgDisplayH;
        cropImgX = newX; cropImgY = newY; updateCropPosition();
    };
    const endDrag = () => { cropDragging = false; };
    win.onmousedown = (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); };
    win.onmousemove = (e) => { moveDrag(e.clientX, e.clientY); };
    win.onmouseup = endDrag; win.onmouseleave = endDrag;
    win.ontouchstart = (e) => { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY); };
    win.ontouchmove = (e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); };
    win.ontouchend = (e) => { e.preventDefault(); endDrag(); };
}
function updateCropPosition() { const img = document.getElementById('wallpaper-crop-img'); img.style.left = cropImgX + 'px'; img.style.top = cropImgY + 'px'; }
function confirmWallpaperCrop() {
    if (!cropImgSrc) return; const win = document.getElementById('wallpaper-crop-window'); const winW = win.clientWidth; const winH = win.clientHeight;
    let outW, outH; if (cropTarget === 'avatar') { outW = 200; outH = 200; } else { const outputScale = 2; const maxW = 800; const scale = Math.min(outputScale, maxW / winW); outW = Math.round(winW * scale); outH = Math.round(winH * scale); }
    const canvas = document.createElement('canvas'); canvas.width = outW; canvas.height = outH; const ctx = canvas.getContext('2d');
    const srcX = (-cropImgX) * (cropImgNaturalW / cropImgDisplayW); const srcY = (-cropImgY) * (cropImgNaturalH / cropImgDisplayH); const srcW = winW * (cropImgNaturalW / cropImgDisplayW); const srcH = winH * (cropImgNaturalH / cropImgDisplayH);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height); const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        if (cropTarget === 'avatar') { const p = getProfile(); p.avatar = croppedBase64; saveProfile(p); const avatarImg = document.getElementById('profile-avatar-img'); if (avatarImg) avatarImg.src = croppedBase64; showToast(T('头像已更新！')); }
        else { const t = getTheme(); t.wallpaper = croppedBase64; saveTheme(t); applyTheme(); showToast(T('壁纸已应用！')); }
        cropImgSrc = null; document.getElementById('crop-overlay').style.display = 'none';
    };
    img.src = cropImgSrc;
}
function cancelWallpaper() { cropImgSrc = null; document.getElementById('crop-overlay').style.display = 'none'; }
function clearWallpaper() { const t = getTheme(); t.wallpaper = ''; saveTheme(t); applyTheme(); }
function getCustomIcons() { return JSON.parse(localStorage.getItem('myCustomIcons')) || { src: '', cells: [] }; }
function saveCustomIcons(data) { localStorage.setItem('myCustomIcons', JSON.stringify(data)); }
function uploadIconImage(input) { if (!input.files[0]) return; const reader = new FileReader(); reader.onload = (e) => compressImage(e.target.result, 600, (b64) => { iconSrcImage = b64; selectedIconCells = []; showIconSelector(); }); reader.readAsDataURL(input.files[0]); }
function showIconSelector() {
    document.getElementById('icon-selector-area').style.display = 'block'; document.getElementById('icon-source-img').src = iconSrcImage;
    const overlay = document.getElementById('icon-grid-overlay'); overlay.innerHTML = '';
    for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { const cell = document.createElement('div'); cell.className = 'icon-cell'; cell.style.left = (c * 25) + '%'; cell.style.top = (r * 25) + '%'; cell.style.width = '25%'; cell.style.height = '25%'; cell.dataset.row = r; cell.dataset.col = c; cell.onclick = () => toggleIconCell(r, c, cell); overlay.appendChild(cell); } }
    refreshIconSelection();
}
function toggleIconCell(r, c, cellEl) {
    const idx = selectedIconCells.findIndex(x => x.row === r && x.col === c);
    if (idx !== -1) { selectedIconCells.splice(idx, 1); selectedIconCells.forEach((item, i) => item.num = i + 1); }
    else { if (selectedIconCells.length >= 4) { showToast(T('最多选择 4 个区域'), 'error'); return; } selectedIconCells.push({ row: r, col: c, num: selectedIconCells.length + 1 }); }
    const data = { src: iconSrcImage, cells: selectedIconCells }; saveCustomIcons(data); applyCustomIcons(); refreshIconSelection();
}
function refreshIconSelection() {
    document.querySelectorAll('#icon-grid-overlay .icon-cell').forEach(cell => { cell.classList.remove('selected'); cell.removeAttribute('data-num'); });
    selectedIconCells.forEach(item => { const selector = `#icon-grid-overlay .icon-cell[data-row="${item.row}"][data-col="${item.col}"]`; const el = document.querySelector(selector); if (el) { el.classList.add('selected'); el.setAttribute('data-num', item.num); } });
    document.getElementById('icon-selected-count').textContent = selectedIconCells.length;
}
function applyCustomIcons() {
    const data = getCustomIcons(); const navKeys = ['home', 'items', 'gift', 'important'];
    const defaults = ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V9.5z"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'];
    navKeys.forEach((key, i) => {
        const el = document.getElementById('nav-icon-' + key); if (!el) return;
        el.style.backgroundImage = ''; el.style.backgroundSize = ''; el.style.backgroundPosition = ''; el.style.width = ''; el.style.height = ''; el.style.borderRadius = ''; el.innerHTML = '';
        const cell = data.cells[i];
        if (cell && data.src) { el.style.backgroundImage = `url(${data.src})`; el.style.backgroundSize = '400% 400%'; el.style.backgroundPosition = `${(cell.col / 3) * 100}% ${(cell.row / 3) * 100}%`; el.style.width = '22px'; el.style.height = '22px'; el.style.borderRadius = '5px'; }
        else { el.innerHTML = defaults[i]; }
    });
}
function clearCustomIcons() { if (!confirm(T('确定要重置自定义图标吗？'))) return; localStorage.removeItem('myCustomIcons'); iconSrcImage = null; selectedIconCells = []; document.getElementById('icon-selector-area').style.display = 'none'; applyCustomIcons(); }
function updateStorageUsage() { let total = 0; for (let k in localStorage) { if (localStorage.hasOwnProperty(k)) { total += new Blob([k + localStorage[k]]).size; } } document.getElementById('storage-usage').textContent = (total / 1024).toFixed(1) + ' KB'; }
// ================== 导出与导入逻辑重构 ==================

// 1. 生成可读的 CSV / TXT 文本
function generateReadableData() {
    const items = JSON.parse(localStorage.getItem('myItems') || '[]');
    const gifts = JSON.parse(localStorage.getItem('myGiftRecords') || '[]');
    const dates = JSON.parse(localStorage.getItem('myImportantDates') || '[]');
    const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');

    let text = `【我的生活 - 数据备份】\n导出时间：${new Date().toLocaleString()}\n\n`;

    text += `================== 物品记录 ==================\n`;
    text += `名称, 数量, 分类, 价格, 状态, 购买日期\n`;
    items.forEach(i => {
        text += `"${i.name || ''}", ${i.quantity || 1}, "${i.category || ''}", ${i.price || 0}, "${i.status || '持有中'}", "${i.purchaseDate || i.date || ''}"\n`;
    });
    text += `\n`;

    text += `================== 随礼记录 ==================\n`;
    text += `人员, 类型, 事件, 金额, 日期\n`;
    gifts.forEach(g => {
        text += `"${g.person || ''}", "${g.type || '随礼'}", "${g.event || ''}", ${g.amount || 0}, "${g.date || ''}"\n`;
    });
    text += `\n`;

    text += `================== 重要日期 ==================\n`;
    text += `人物, 事件, 日期, 类型, 重要程度\n`;
    dates.forEach(d => {
        text += `"${d.person || ''}", "${d.event || ''}", "${d.date || ''}", "${d.type || '普通'}", "${d.level || '提醒'}"\n`;
    });
    text += `\n`;

    text += `================== 阅读记录 ==================\n`;
    text += `书名, 总页数, 当前页数, 状态\n`;
    books.forEach(b => {
        text += `"${b.name || ''}", ${b.totalPages || 0}, ${b.currentPages || 0}, "${b.status || '在读'}"\n`;
    });
    text += `\n`;

    text += `================== 日记与便签 ==================\n`;
    text += `日期, 类型, 标题, 内容\n`;
    diaries.forEach(d => {
        // 清理内容里的换行符，防止破坏 CSV 格式
        const safeContent = (d.content || '').replace(/\n/g, ' ');
        text += `"${d.date || ''}", "${d.type || '日记'}", "${d.title || ''}", "${safeContent}"\n`;
    });

    return text;
}

// 1. 导出数据主弹窗 (支持导出照片)
async function exportData() {
    if (typeof showToast === 'function') showToast('正在打包数据与照片，请稍候...');
    
    // 1. 读取所有 IndexedDB 照片
    let allPhotos = {};
    try {
        if (typeof PhotoDB !== 'undefined') {
            await PhotoDB.init();
            allPhotos = await new Promise((resolve) => {
                const transaction = PhotoDB.db.transaction([PhotoDB.storeName], 'readonly');
                const store = transaction.objectStore(PhotoDB.storeName);
                const request = store.getAllKeys();
                request.onsuccess = async (e) => {
                    const keys = e.target.result;
                    let photosData = {};
                    for (let key of keys) {
                        photosData[key] = await PhotoDB.getImage(key);
                    }
                    resolve(photosData);
                };
            });
        }
    } catch (e) { console.error("读取照片失败", e); }

    // 2. 组装数据
    const data = { 
        items: JSON.parse(localStorage.getItem('myItems') || '[]'), 
        giftRecords: JSON.parse(localStorage.getItem('myGiftRecords') || '[]'), 
        importantDates: JSON.parse(localStorage.getItem('myImportantDates') || '[]'), 
        diaries: JSON.parse(localStorage.getItem('myDiaries') || '[]'), 
        books: JSON.parse(localStorage.getItem('myBooks') || '[]'), 
        customIcons: JSON.parse(localStorage.getItem('myCustomIcons') || '{}'), 
        lock: JSON.parse(localStorage.getItem('myLock') || '{}'), 
        profile: getProfile(), 
        theme: getTheme(),
        photos: allPhotos 
    };

    // 3. 生成文件并触发下载
    try {
        const jsonStr = JSON.stringify(data);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-life-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof showToast === 'function') showToast('导出成功！请去手机文件管理器中查看');
    } catch (err) {
        console.error(err);
        if (typeof showToast === 'function') showToast('导出失败，数据可能太大', 'error');
    }
}

// 2. 导入数据弹窗 (支持恢复照片)
function showImportModal() {
    let overlay = document.getElementById('import-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'import-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;flex-direction:column;padding:20px;box-sizing:border-box;';
        
        const title = document.createElement('div');
        title.innerText = '请将之前复制的 JSON 数据粘贴到下方：';
        title.style.cssText = 'color:white;font-size:15px;margin-bottom:10px;text-align:center;font-weight:bold;';
        
        const textarea = document.createElement('textarea');
        textarea.id = 'import-textarea';
        textarea.placeholder = '在此粘贴 JSON 代码...';
        textarea.style.cssText = 'flex:1;width:100%;border-radius:12px;padding:12px;font-size:12px;font-family:monospace;resize:none;line-height:1.5;';
        
        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = 'display:flex;gap:10px;margin-top:15px;';
        
        const importBtn = document.createElement('button');
        importBtn.innerText = '确认导入';
        importBtn.style.cssText = 'flex:1;padding:14px;background:var(--primary,#d98880);color:white;border:none;border-radius:12px;font-size:16px;font-weight:bold;';
        importBtn.onclick = async () => {
            const val = document.getElementById('import-textarea').value.trim();
            if (!val) return;
            try {
                const data = JSON.parse(val);
                showAlert(T('导入数据'), T('导入会覆盖当前数据，是否继续？'), async () => {
                    if (data.items) localStorage.setItem('myItems', JSON.stringify(data.items));
                    if (data.giftRecords) localStorage.setItem('myGiftRecords', JSON.stringify(data.giftRecords));
                    if (data.importantDates) localStorage.setItem('myImportantDates', JSON.stringify(data.importantDates));
                    if (data.diaries) localStorage.setItem('myDiaries', JSON.stringify(data.diaries));
                    if (data.books) localStorage.setItem('myBooks', JSON.stringify(data.books));
                    if (data.customIcons) localStorage.setItem('myCustomIcons', JSON.stringify(data.customIcons));
                    if (data.lock) localStorage.setItem('myLock', JSON.stringify(data.lock));
                    if (data.profile) localStorage.setItem('myProfile', JSON.stringify(data.profile));
                    if (data.theme) localStorage.setItem('myTheme', JSON.stringify(data.theme));
                    
                    // 恢复照片到 IndexedDB
                    if (data.photos && typeof PhotoDB !== 'undefined') {
                        if (typeof showToast === 'function') showToast('正在恢复照片，请稍候...');
                        await PhotoDB.init();
                        for (let key in data.photos) {
                            if (data.photos[key]) {
                                await PhotoDB.saveImageBase64(key, data.photos[key]);
                            }
                        }
                    }
                    
                    showToast(T('导入成功！')); 
                    setTimeout(() => location.reload(), 1000);
                });
            } catch (err) {
                showToast('格式错误，请检查粘贴的内容', 'error');
            }
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '取消';
        closeBtn.style.cssText = 'flex:1;padding:14px;background:#555;color:white;border:none;border-radius:12px;font-size:16px;font-weight:bold;';
        closeBtn.onclick = () => { overlay.style.display = 'none'; document.getElementById('import-textarea').value = ''; };
        
        btnGroup.appendChild(importBtn); btnGroup.appendChild(closeBtn);
        overlay.appendChild(title); overlay.appendChild(textarea); overlay.appendChild(btnGroup);
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}
// ================= 新增：读取本地 .json 文件的导入函数 =================
function importData(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data) {
                showAlert(T('导入数据'), T('导入会覆盖当前数据，是否继续？'), async () => {
                    if (data.items) localStorage.setItem('myItems', JSON.stringify(data.items));
                    if (data.giftRecords) localStorage.setItem('myGiftRecords', JSON.stringify(data.giftRecords));
                    if (data.importantDates) localStorage.setItem('myImportantDates', JSON.stringify(data.importantDates));
                    if (data.diaries) localStorage.setItem('myDiaries', JSON.stringify(data.diaries));
                    if (data.books) localStorage.setItem('myBooks', JSON.stringify(data.books));
                    if (data.customIcons) localStorage.setItem('myCustomIcons', JSON.stringify(data.customIcons));
                    if (data.lock) localStorage.setItem('myLock', JSON.stringify(data.lock));
                    if (data.profile) localStorage.setItem('myProfile', JSON.stringify(data.profile));
                    if (data.theme) localStorage.setItem('myTheme', JSON.stringify(data.theme));
                    
                    // 恢复照片到 IndexedDB
                    if (data.photos && typeof PhotoDB !== 'undefined') {
                        if (typeof showToast === 'function') showToast('正在恢复照片，请稍候...');
                        await PhotoDB.init();
                        for (let key in data.photos) {
                            if (data.photos[key]) {
                                await PhotoDB.saveImageBase64(key, data.photos[key]);
                            }
                        }
                    }
                    
                    showToast(T('导入成功！')); 
                    // 稍微延迟一下再刷新
                    setTimeout(() => {
                        window.location.href = window.location.href; 
                    }, 1000);
                });
            }
        } catch (err) {
            console.error(err);
            showToast(T('文件格式错误！'), 'error');
        } finally {
            input.value = ''; // 清空 input，允许用户重复选择同一个文件
        }
    };
    reader.readAsText(file);
}
function clearAllData() { showAlert(T('清空数据'), T('确定要清空所有数据吗？此操作不可恢复！'), () => { ['myItems','myGiftRecords','myImportantDates','myProfile','myTheme','myDiaries','myBooks','myCustomIcons','myLock'].forEach(k => localStorage.removeItem(k)); showToast(T('已清空')); location.reload(); }); }
function getLockSettings() { return JSON.parse(localStorage.getItem('myLock')) || { type: '' }; }
function loadLockSettings() { const l = getLockSettings(); document.querySelectorAll('.lock-check').forEach(el => el.classList.remove('active')); if (l.type) { const el = document.getElementById('lock-' + l.type); if (el) el.classList.add('active'); } }
function setLockType(type) {
    const l = getLockSettings();
    if (l.type === type) { l.type = ''; l.password = ''; l.pattern = ''; localStorage.setItem('myLock', JSON.stringify(l)); loadLockSettings(); showToast(T('已取消应用锁')); return; }
    if (type === 'password') {
        showPrompt(T('请设置密码（4位数字）'), '', (pwd) => {
            if (!/^\d{4}$/.test(pwd)) { showToast(T('请输入4位数字密码'), 'error'); return; }
            showPrompt(T('请再次输入密码'), '', (confirmPwd) => {
                if (confirmPwd !== pwd) { showToast(T('两次密码不一致'), 'error'); return; }
                l.type = 'password'; l.password = pwd; l.pattern = ''; localStorage.setItem('myLock', JSON.stringify(l)); showToast(T('密码锁设置成功！')); loadLockSettings();
            });
        });
    } else if (type === 'fingerprint') {
        showAlert(T('启用指纹解锁'), T('确定要使用系统指纹或面容解锁吗？'), async () => {
            showToast(T('请验证系统指纹...'));
            const fpId = await registerFingerprint();
            if (fpId) {
                l.type = 'fingerprint'; 
                l.password = ''; 
                l.pattern = ''; 
                l.fingerprintId = fpId; // 存下系统的凭证标识
                localStorage.setItem('myLock', JSON.stringify(l)); 
                showToast(T('指纹锁已成功关联系统')); 
                loadLockSettings();
            }
        });
    }
}
// ================= 系统指纹/面容 WebAuthn 逻辑 =================
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
}
function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
}

async function registerFingerprint() {
    if (!window.PublicKeyCredential) {
        showToast('当前环境不支持指纹解锁，请使用密码', 'error');
        return null;
    }
    try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!available) {
            showToast('手机未设置系统指纹或面容，请前往手机设置', 'error');
            return null;
        }

        const challenge = new Uint8Array(32); window.crypto.getRandomValues(challenge);
        const userId = new Uint8Array(16); window.crypto.getRandomValues(userId);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: challenge,
                rp: { name: "我的生活", id: window.location.hostname },
                user: { id: userId, name: "user", displayName: "我的生活用户" },
                pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
                authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
                timeout: 60000,
                attestation: "none"
            }
        });
        
        if (credential) return arrayBufferToBase64(credential.rawId);
    } catch (e) {
        console.error(e);
        if (e.name === 'NotAllowedError') showToast('已取消或指纹验证失败', 'error');
        else showToast('无法调起系统指纹', 'error');
        return null;
    }
}
function openPatternLock() {
    const l = getLockSettings();
    if (l.type === 'pattern') { if (!confirm(T('已经设置了图形锁，是否重新设置？\n点“取消”则保持不变'))) return; }
    patternMode = 'set'; patternFirstAttempt = null; document.getElementById('pattern-title').innerText = T('绘制解锁图案'); document.getElementById('pattern-hint').innerText = T('请连接至少 4 个点'); document.getElementById('pattern-lock-modal').style.display = 'flex'; initPatternCanvas();
}
function closePatternLock() { document.getElementById('pattern-lock-modal').style.display = 'none'; patternDrawing = false; patternSelected = []; }
function initPatternCanvas() {
    const canvas = document.getElementById('pattern-canvas'); const ctx = canvas.getContext('2d'); const size = 300; const cellSize = size / 3;
    patternPoints = [];
    for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { patternPoints.push({ x: cellSize * c + cellSize / 2, y: cellSize * r + cellSize / 2, index: r * 3 + c }); } }
    patternSelected = []; drawPattern();
    canvas.onmousedown = null; canvas.onmousemove = null; canvas.onmouseup = null; canvas.ontouchstart = null; canvas.ontouchmove = null; canvas.ontouchend = null;
    canvas.onmousedown = (e) => { patternDrawing = true; handlePatternMove(e); }; canvas.onmousemove = (e) => { if (patternDrawing) handlePatternMove(e); }; canvas.onmouseup = () => { patternDrawing = false; finishPattern(); };
    canvas.ontouchstart = (e) => { e.preventDefault(); patternDrawing = true; handlePatternMove(e.touches[0]); }; canvas.ontouchmove = (e) => { e.preventDefault(); if (patternDrawing) handlePatternMove(e.touches[0]); }; canvas.ontouchend = (e) => { e.preventDefault(); patternDrawing = false; finishPattern(); };
}
function getCanvasPos(e, canvas) { const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }; }
function handlePatternMove(e) {
    const canvas = document.getElementById('pattern-canvas'); const pos = getCanvasPos(e, canvas);
    patternPoints.forEach(p => { if (patternSelected.includes(p.index)) return; const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2); if (dist < 30) { patternSelected.push(p.index); if (navigator.vibrate) navigator.vibrate(20); } });
    drawPattern(pos);
}
function drawPattern(currentPos) {
    const canvas = document.getElementById('pattern-canvas'); const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    patternPoints.forEach(p => { const selected = patternSelected.includes(p.index); ctx.beginPath(); ctx.arc(p.x, p.y, selected ? 12 : 8, 0, Math.PI * 2); ctx.fillStyle = selected ? '#d98880' : '#bbb'; ctx.fill(); });
    if (patternSelected.length > 1) {
        ctx.beginPath(); ctx.strokeStyle = '#d98880'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < patternSelected.length - 1; i++) { const a = patternPoints[patternSelected[i]]; const b = patternPoints[patternSelected[i + 1]]; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
        if (currentPos && patternDrawing) { const last = patternPoints[patternSelected[patternSelected.length - 1]]; ctx.moveTo(last.x, last.y); ctx.lineTo(currentPos.x, currentPos.y); }
        ctx.stroke();
    }
}
function resetPattern() { patternSelected = []; drawPattern(); document.getElementById('pattern-hint').innerText = patternMode === 'set' && patternFirstAttempt ? T('请再次绘制确认') : T('请连接至少 4 个点'); }
function finishPattern() {
    patternDrawing = false;
    if (patternSelected.length < 4) { document.getElementById('pattern-hint').innerText = T('⚠️ 至少连接 4 个点'); setTimeout(resetPattern, 600); return; }
    const patternStr = patternSelected.join('-');
    if (patternMode === 'set') {
        if (!patternFirstAttempt) { patternFirstAttempt = patternStr; document.getElementById('pattern-hint').innerText = T('请再次绘制确认'); setTimeout(resetPattern, 400); }
        else {
            if (patternFirstAttempt === patternStr) {
                const l = getLockSettings(); l.type = 'pattern'; l.pattern = patternStr; l.password = ''; localStorage.setItem('myLock', JSON.stringify(l)); loadLockSettings();
                document.getElementById('pattern-hint').innerText = T('✅ 图形锁设置成功！'); setTimeout(() => { closePatternLock(); showToast(T('图形锁设置成功！')); }, 600);
            } else { document.getElementById('pattern-hint').innerText = T('❌ 两次不一致，请重新绘制'); patternFirstAttempt = null; setTimeout(resetPattern, 800); }
        }
    }
}
function showPrompt(title, defaultValue, onOk, placeholder) { 
    promptCallback = onOk; 
    document.getElementById('prompt-title').textContent = title; 
    const input = document.getElementById('prompt-input'); 
    input.value = defaultValue || ''; 
    input.placeholder = placeholder || '';
    document.getElementById('prompt-modal').style.display = 'flex'; 
    setTimeout(() => input.focus(), 100); 
}
function closePrompt() { promptCallback = null; document.getElementById('prompt-modal').style.display = 'none'; }
function submitPrompt() { const val = document.getElementById('prompt-input').value; const cb = promptCallback; closePrompt(); if (typeof cb === 'function') cb(val); }
function showAlert(title, message, onOk) { alertCallback = onOk; document.getElementById('alert-title').textContent = title; document.getElementById('alert-message').textContent = message; document.getElementById('alert-modal').style.display = 'flex'; document.getElementById('alert-cancel-btn').style.display = 'block'; }
function showAlertSimple(title, message) { showAlert(title, message); document.getElementById('alert-cancel-btn').style.display = 'none'; }
function closeAlert(isOk) { const cb = alertCallback; alertCallback = null; document.getElementById('alert-modal').style.display = 'none'; if (isOk && typeof cb === 'function') cb(); }
function showConfirm(title, message, onOk) { confirmCallback = onOk; document.getElementById('confirm-title').textContent = title || T('确认删除'); document.getElementById('confirm-message').textContent = message || T('确定要删除吗？'); document.getElementById('confirm-modal').style.display = 'flex'; }
function closeConfirm() { confirmCallback = null; document.getElementById('confirm-modal').style.display = 'none'; }
function confirmOk() { const cb = confirmCallback; closeConfirm(); if (typeof cb === 'function') cb(); }
function bindLongPress(el, callback) {
    let timer = null; let fired = false; let startX = 0, startY = 0;
    const start = (e) => {
        fired = false; const p = e.touches ? e.touches[0] : e; startX = p.clientX; startY = p.clientY;
        clearTimeout(timer); timer = setTimeout(() => { fired = true; itemLongPressFired = true; window._longPressFired = true; if (navigator.vibrate) navigator.vibrate(30); callback(); }, 600);
    };
    const move = (e) => { const p = e.touches ? e.touches[0] : e; if (Math.abs(p.clientX - startX) > 10 || Math.abs(p.clientY - startY) > 10) { clearTimeout(timer); } };
    const cancel = () => { clearTimeout(timer); };
    el.addEventListener('touchstart', start, { passive: true }); el.addEventListener('touchmove', move, { passive: true }); el.addEventListener('touchend', cancel); el.addEventListener('touchcancel', cancel);
    el.addEventListener('mousedown', start); el.addEventListener('mousemove', move); el.addEventListener('mouseup', cancel); el.addEventListener('mouseleave', cancel);
    el.addEventListener('click', (e) => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } }, true);
}
function toggleMultiSelect(type) {
    if (multiSelectMode[type]) { exitMultiSelect(type); renderMultiList(type); }
    else {
        multiSelectMode[type] = true; multiSelectedIds[type].clear();
        if (type === 'important' && importantViewMode === 'calendar') { showImportantListView(); }
        const btn = document.getElementById('multi-select-btn-' + type); if (btn) { btn.textContent = T('取消'); btn.classList.add('multi-select-active'); }
        document.body.classList.add('multi-select-mode'); renderMultiList(type); updateMultiSelectBar(type);
    }
}
function exitMultiSelect(type) {
    multiSelectMode[type] = false; multiSelectedIds[type].clear(); const btn = document.getElementById('multi-select-btn-' + type);
    if (btn) { btn.textContent = T('选择'); btn.classList.remove('multi-select-active'); }
    const anyActive = Object.values(multiSelectMode).some(v => v);
    if (!anyActive) { document.body.classList.remove('multi-select-mode'); const bar = document.getElementById('multi-select-bar'); if (bar) bar.style.display = 'none'; }
    if (type === 'important') { if (importantViewMode === 'list') { renderImportantList(); } else { backToCalendar(); renderUpcoming7Days(); } }
}
function toggleMultiSelected(type, id) {
    if (!multiSelectMode[type]) return; const set = multiSelectedIds[type];
    if (set.has(id)) set.delete(id); else set.add(id);
    updateCardSelection(type, id); updateMultiSelectBar(type);
}
function updateCardSelection(type, id) {
    const card = document.querySelector(`[data-multi-id="${type}-${id}"]`); if (!card) return;
    const checked = multiSelectedIds[type].has(id); const cb = card.querySelector('.multi-checkbox');
    if (cb) cb.classList.toggle('checked', checked); card.classList.toggle('multi-checked', checked);
}
function updateMultiSelectBar(type) {
    const bar = document.getElementById('multi-select-bar'); if (!bar) return;
    if (!multiSelectMode[type]) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex'; const count = multiSelectedIds[type].size; document.getElementById('multi-select-count').textContent = T('已选 {n} 项', { n: count });
    const btns = document.getElementById('multi-select-action-btns'); const disabledAttr = count === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '';
    let html = '';
    if (type === 'items') { html += `<button class="multi-action-btn status" ${disabledAttr} onclick="batchChangeStatusSelected()">${T('改状态')}</button>`; }
    html += `<button class="multi-action-btn delete" ${disabledAttr} onclick="batchDeleteSelected('${type}')">${T('删除')}</button>`;
    btns.innerHTML = html;
}
function renderMultiList(type) {
    if (type === 'items') renderItemsList(); else if (type === 'gift') renderGiftList(); else if (type === 'important') renderImportantList(); else if (type === 'diary') renderDiaryList(); else if (type === 'books') renderBookList();
}
function batchDeleteSelected(type) {
    const ids = Array.from(multiSelectedIds[type]); if (ids.length === 0) return;
    const msg = T('确定删除选中的 {n} 项吗？删除后无法恢复。', { n: ids.length });
    showConfirm(T('批量删除'), msg, () => {
        if (type === 'items') { localStorage.setItem('myItems', JSON.stringify(getItems().filter(i => !ids.includes(i.id)))); }
        else if (type === 'gift') { localStorage.setItem('myGiftRecords', JSON.stringify(getGiftRecords().filter(r => !ids.includes(r.id)))); }
        else if (type === 'important') { localStorage.setItem('myImportantDates', JSON.stringify(getImportantDates().filter(d => !ids.includes(d.id)))); renderCalendar(); renderUpcomingDates(); renderUpcoming7Days(); }
        else if (type === 'diary') { saveDiaries(getDiaries().filter(d => !ids.includes(d.id))); }
        else if (type === 'books') { localStorage.setItem('myBooks', JSON.stringify(getBooks().filter(b => !ids.includes(b.id)))); renderBookProgress(); }
        showToast(T('已删除')); exitMultiSelect(type); renderMultiList(type);
        if (type === 'items') updateItemStats();
    });
}
function batchChangeStatusSelected() {
    const ids = Array.from(multiSelectedIds.items); if (ids.length === 0) return;
    const btns = document.getElementById('multi-select-action-btns');
    btns.innerHTML = `<button class="multi-action-btn status" onclick="applyBatchStatus('持有中')">${T('持有中')}</button><button class="multi-action-btn status" onclick="applyBatchStatus('暂离中')">${T('暂离中')}</button><button class="multi-action-btn status" onclick="applyBatchStatus('已移除')">${T('已移除')}</button><button class="multi-action-btn status" style="background:#eee;" onclick="updateMultiSelectBar('items')">${T('返回')}</button>`;
}
function applyBatchStatus(status) {
    const ids = Array.from(multiSelectedIds.items); if (ids.length === 0) return;
    localStorage.setItem('myItems', JSON.stringify(getItems().map(i => ids.includes(i.id) ? { ...i, status } : i)));
    showToast(T('已改为「{status}」', { status: T(status) })); exitMultiSelect('items'); renderItemsList(); updateItemStats();
}
function showToast(msg, type) {
    let container = document.getElementById('toast-container');
    if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
    const t = document.createElement('div'); t.className = 'toast ' + (type || 'success'); t.textContent = msg; container.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show')); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2000);
}
function checkAppLock() {
    const l = getLockSettings(); const overlay = document.getElementById('unlock-overlay');
    if (!l.type) { overlay.style.display = 'none'; return; }
    overlay.style.display = 'flex'; document.getElementById('unlock-password-area').style.display = 'none'; document.getElementById('unlock-fingerprint-area').style.display = 'none'; document.getElementById('unlock-pattern-area').style.display = 'none';
    const lockoutMsg = document.getElementById('lockout-msg'); lockoutMsg.style.display = 'none'; clearInterval(lockoutInterval);
    if (l.lockUntil && Date.now() < l.lockUntil) { startLockoutTimer(l.lockUntil); return; }
    if (l.type === 'password') { document.getElementById('unlock-password-area').style.display = 'block'; document.getElementById('unlock-pwd-input').value = ''; setTimeout(() => document.getElementById('unlock-pwd-input').focus(), 100); }
    else if (l.type === 'fingerprint') { 
        document.getElementById('unlock-fingerprint-area').style.display = 'block'; 
        setTimeout(() => verifyFingerprint(), 300); // 延时 0.3 秒自动拉起系统指纹
    }
    else if (l.type === 'pattern') { document.getElementById('unlock-pattern-area').style.display = 'block'; initUnlockPatternCanvas(); }
}
function startLockoutTimer(until) {
    const lockoutMsg = document.getElementById('lockout-msg'); lockoutMsg.style.display = 'block';
    const update = () => { const remain = Math.ceil((until - Date.now()) / 1000); if (remain <= 0) { clearInterval(lockoutInterval); checkAppLock(); } else { const m = Math.floor(remain / 60); const s = remain % 60; lockoutMsg.innerText = `尝试次数过多，请等待 ${m}分${s}秒 后重试`; } };
    update(); lockoutInterval = setInterval(update, 1000);
}
function handleUnlockFail() {
    const l = getLockSettings(); l.failCount = (l.failCount || 0) + 1; let lockTimeMs = 0;
    if (l.failCount === 8) { lockTimeMs = 7 * 60 * 1000; l.lockUntil = Date.now() + lockTimeMs; showToast('错误次数过多，锁定 7 分钟', 'error'); }
    else if (l.failCount >= 11) { lockTimeMs = 60 * 60 * 1000; l.lockUntil = Date.now() + lockTimeMs; showToast('错误次数过多，锁定 1 小时', 'error'); }
    else { showToast(`密码/图案错误，还可尝试 ${7 - l.failCount} 次`, 'error'); }
    localStorage.setItem('myLock', JSON.stringify(l));
    if (lockTimeMs > 0) { if (document.getElementById('unlock-pwd-input')) document.getElementById('unlock-pwd-input').value = ''; checkAppLock(); }
}
function handleUnlockSuccess() {
    const l = getLockSettings(); l.failCount = 0; l.lockUntil = 0; localStorage.setItem('myLock', JSON.stringify(l));
    document.getElementById('unlock-overlay').style.display = 'none'; clearInterval(lockoutInterval);
}
function verifyPassword() {
    const l = getLockSettings(); const input = document.getElementById('unlock-pwd-input').value;
    if (input === l.password) { handleUnlockSuccess(); } else { document.getElementById('unlock-pwd-input').value = ''; handleUnlockFail(); }
}
async function verifyFingerprint() { 
    const l = getLockSettings();
    if (!l.fingerprintId) {
        showToast('没有指纹数据，请使用密码解锁', 'error');
        return;
    }
    try {
        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                allowCredentials: [{ type: 'public-key', id: base64ToArrayBuffer(l.fingerprintId), transports: ['internal'] }],
                userVerification: "required",
                timeout: 60000
            }
        });
        if (assertion) {
            handleUnlockSuccess();
            showToast(T('解锁成功'));
        }
    } catch(e) {
        console.error(e);
        showToast('指纹验证已取消或失败', 'error');
    }
}
function initUnlockPatternCanvas() {
    const canvas = document.getElementById('unlock-pattern-canvas'); const cellSize = canvas.width / 3; unlockPatternPoints = [];
    for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { unlockPatternPoints.push({ x: cellSize * c + cellSize / 2, y: cellSize * r + cellSize / 2, index: r * 3 + c }); } }
    unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = '';
    canvas.onmousedown = (e) => { unlockPatternDrawing = true; handleUnlockPatternMove(e); }; canvas.onmousemove = (e) => { if (unlockPatternDrawing) handleUnlockPatternMove(e); }; canvas.onmouseup = () => { unlockPatternDrawing = false; finishUnlockPattern(); };
    canvas.ontouchstart = (e) => { e.preventDefault(); unlockPatternDrawing = true; handleUnlockPatternMove(e.touches[0]); }; canvas.ontouchmove = (e) => { e.preventDefault(); if (unlockPatternDrawing) handleUnlockPatternMove(e.touches[0]); }; canvas.ontouchend = (e) => { e.preventDefault(); unlockPatternDrawing = false; finishUnlockPattern(); };
}
function handleUnlockPatternMove(e) {
    const canvas = document.getElementById('unlock-pattern-canvas'); const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; const pos = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    unlockPatternPoints.forEach(p => { if (unlockPatternSelected.includes(p.index)) return; const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2); if (dist < 30) { unlockPatternSelected.push(p.index); if (navigator.vibrate) navigator.vibrate(20); } });
    drawUnlockPattern(pos);
}
function drawUnlockPattern(currentPos) {
    const canvas = document.getElementById('unlock-pattern-canvas'); const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    unlockPatternPoints.forEach(p => { const selected = unlockPatternSelected.includes(p.index); ctx.beginPath(); ctx.arc(p.x, p.y, selected ? 12 : 8, 0, Math.PI * 2); ctx.fillStyle = selected ? '#d98880' : '#bbb'; ctx.fill(); });
    if (unlockPatternSelected.length > 1) {
        ctx.beginPath(); ctx.strokeStyle = '#d98880'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < unlockPatternSelected.length - 1; i++) { const a = unlockPatternPoints[unlockPatternSelected[i]]; const b = unlockPatternPoints[unlockPatternSelected[i + 1]]; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
        if (currentPos && unlockPatternDrawing) { const last = unlockPatternPoints[unlockPatternSelected[unlockPatternSelected.length - 1]]; ctx.moveTo(last.x, last.y); ctx.lineTo(currentPos.x, currentPos.y); }
        ctx.stroke();
    }
}
function finishUnlockPattern() {
    unlockPatternDrawing = false;
    if (unlockPatternSelected.length < 4) { document.getElementById('unlock-pattern-hint').innerText = T('至少连接 4 个点'); setTimeout(() => { unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = ''; }, 800); return; }
    const patternStr = unlockPatternSelected.join('-'); const l = getLockSettings();
    if (patternStr === l.pattern) { handleUnlockSuccess(); } else { document.getElementById('unlock-pattern-hint').innerText = T('图案错误，请重试'); setTimeout(() => { unlockPatternSelected = []; drawUnlockPattern(); document.getElementById('unlock-pattern-hint').innerText = ''; }, 800); handleUnlockFail(); }
}

// ================= 全局点击外部收起 =================
document.addEventListener('click', function(e) {
    const searchWrapper = document.getElementById('search-bar-wrapper');
    const searchIcon = document.querySelector('#page-all-items h3 + span') || document.querySelector('#page-all-items .page-main-title ~ span');
    if (searchWrapper && searchWrapper.style.display === 'block') {
        const inWrapper = searchWrapper.contains(e.target); const inIcon = searchIcon && searchIcon.contains(e.target); const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleSearchBar"]');
        if (!inWrapper && !inIcon && !isToggleClick) { searchWrapper.style.display = 'none'; document.getElementById('search-input').value = ''; renderItemsList(); }
    }
    const impSearchBar = document.getElementById('important-search-bar');
    if (impSearchBar && impSearchBar.style.display === 'block') {
        const inBar = impSearchBar.contains(e.target); const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleImportantSearch"]');
        if (!inBar && !isToggleClick) { impSearchBar.style.display = 'none'; if (typeof importantSearchKeyword !== 'undefined') importantSearchKeyword = ''; const inp = document.getElementById('important-search-input'); if (inp) inp.value = ''; if (typeof renderCalendar === 'function') renderCalendar(); }
    }
    const impMenu = document.getElementById('important-menu');
    if (impMenu && impMenu.style.display === 'block') {
        const inMenu = impMenu.contains(e.target); const isToggleClick = e.target.closest && e.target.closest('[onclick*="toggleImportantMenu"]');
        if (!inMenu && !isToggleClick) { if (typeof closeImportantMenu === 'function') closeImportantMenu(); }
    }
});

// ================= 初始化 =================
window.addEventListener('load', () => {
    applyTheme();
    const t = getTheme();
    const startPageMap = { 'home': 'page-home', 'all-items': 'page-all-items', 'gift-record': 'page-gift-record', 'important-dates': 'page-important-dates' };
    const targetPage = startPageMap[t.startpage] || 'page-home';
    switchPage(targetPage);
    updateDashboard(); updateFilterButtons(); updateImportantMenuButtons(); selectLevel('提醒'); renderUpcomingDates(); refreshDrawerInfo(); applyCustomIcons(); renderBookProgress(); renderBookList(); renderCategoryGrid(); renderAcquireGrid();
    for (let i = 0; i < 3; i++) { renderGiftPhotoSlot(i); renderEventPhotoSlot(i); }
    document.querySelectorAll('.back-arrow').forEach(el => { if (el.textContent.trim() === '←' || el.textContent.trim() === '<') { el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'; } });
    document.querySelectorAll('.calendar-grid').forEach(el => { el.style.userSelect = 'none'; el.style.webkitUserSelect = 'none'; el.style.webkitTouchCallout = 'none'; });
    applyLanguage(); checkAppLock();
    if ((getTheme().lang || 'zh-CN') !== 'zh-CN') {
        let __transTimer = null;
        const obs = new MutationObserver(() => { if (__translating) return; clearTimeout(__transTimer); __transTimer = setTimeout(translateDOM, 60); });
        obs.observe(document.body, { childList: true, subtree: true });
    }
});

// ================= 全局滑动与边缘返回手势 =================
const swipePages = ['page-home', 'page-all-items', 'page-gift-record', 'page-important-dates'];
let touchStartX = 0; let touchStartY = 0; let isEdgeSwipe = false;
document.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches.length) return;
    // 遇到底部导航、悬浮按钮、弹窗、画板、日历卡片时，直接放弃全局滑动拦截
    if (e.target.closest('.bottom-nav') || e.target.closest('.floating-add-btn') || e.target.closest('.modal') || e.target.closest('#calendar-view') || e.target.tagName.toLowerCase() === 'canvas') { touchStartX = -1; return; }
    const drawer = document.getElementById('side-drawer');
    const diaryPanel = document.getElementById('diary-panel');
    if (drawer && drawer.classList.contains('open')) { touchStartX = -1; return; }
    if (diaryPanel && diaryPanel.classList.contains('open')) { touchStartX = -1; return; }
    
    // ⚠️ 删掉 isEdgeSwipe 的边缘判定，交给系统全局返回处理
    touchStartX = e.touches[0].clientX; 
    touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', (e) => {
    if (touchStartX === -1) return;
    if (!e.changedTouches || !e.changedTouches.length) return; // 保护机制
    const drawer = document.getElementById('side-drawer');
    const diaryPanel = document.getElementById('diary-panel');
    if (drawer && drawer.classList.contains('open')) return;
    if (diaryPanel && diaryPanel.classList.contains('open')) return;
    const touchEndX = e.changedTouches[0].clientX; const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX; const deltaY = touchEndY - touchStartY;
    if (isEdgeSwipe && Math.abs(deltaX) > 80 && Math.abs(deltaY) < 50) { handleEdgeBack(); return; }
    if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const activePage = document.querySelector('.page.active'); if (!activePage) return;
        const currentIndex = swipePages.indexOf(activePage.id); if (currentIndex === -1) return;
        if (deltaX < 0) {
            if (currentIndex < swipePages.length - 1) { switchPage(swipePages[currentIndex + 1]); }
            else if (activePage.id === 'page-important-dates') { const d = new Date(); const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; openDiaryPanel(diaryPanelDate || todayStr); }
        } else {
            if (currentIndex > 0) { switchPage(swipePages[currentIndex - 1]); }
            else if (activePage.id === 'page-home') { openDrawer(); }
        }
    }
}, { passive: true });
function handleEditYear() {
    const currentPhoto = window._currentAlbumPhotos[_fullScreenIndex];
    if (!currentPhoto) return;
    
    // 1. 立即关闭大图
    document.getElementById('global-image-preview').classList.remove('show');
    
    // 2. 弹窗，默认值传空，最后加上灰色提示字
    showPrompt('修改年份', '', (newYearStr) => {
        if (!newYearStr) return;
        const newYear = parseInt(newYearStr);
        if (isNaN(newYear)) { showToast('年份格式错误', 'error'); return; }
        
        let dates = getImportantDates();
        let item = dates.find(d => d.id === _fullScreenItemId);
        if (item) {
            let photo = item.photos.find(p => p.key === currentPhoto.key);
            if (photo) photo.year = newYear;
            localStorage.setItem('myImportantDates', JSON.stringify(dates));
            showToast('年份修改成功');
            renderAnniversaryAlbum(_fullScreenItemId);
        }
    }, '请输入年份（如 2024）');
}
// ================= 通用图片压缩与日期选择器 =================
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
    img.onerror = () => { showToast(T('图片读取失败，请换一张'), 'error'); };
    img.src = base64Str;
}

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
                    calYear = selectedYear; calMonth = selectedMonth;
                    document.getElementById('important-detail-card').style.display = 'none';
                    renderCalendar(); closeDatePicker();
                } else { pickerStep = 'day'; renderPickerBody(); }
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
// ================== 无损图片存储方案 (IndexedDB) ==================
const PhotoDB = {
    dbName: 'MyLifePhotosDB',
    storeName: 'photos',
    db: null,

    // 初始化数据库
    init() {
        return new Promise((resolve, reject) => {
            if (this.db) return resolve(this.db);
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName); // 用 key (如 ID) 来存图
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 在 PhotoDB 对象里加上这个方法
    async saveImageBase64(key, base64Str) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(base64Str, key);
            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 保存原图 (接收 File 对象)
    async saveImage(key, file) {
        await this.init();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Str = e.target.result; // 这里是没有被压缩的完整 Base64
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(base64Str, key);
                request.onsuccess = () => resolve(true);
                request.onerror = (e) => reject(e.target.error);
            };
            reader.readAsDataURL(file);
        });
    },

    // 读取原图
    async getImage(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 删除图片
    async deleteImage(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    }
};

// ================= 统一处理返回/关闭逻辑 =================
function handleEdgeBack() {
    // 1. 关闭各类弹窗
    if (document.getElementById('confirm-modal').style.display === 'flex') { closeConfirm(); return true; }
    if (document.getElementById('prompt-modal').style.display === 'flex') { closePrompt(); return true; }
    if (document.getElementById('alert-modal').style.display === 'flex') { closeAlert(false); return true; }
    if (document.getElementById('date-picker-modal').style.display === 'flex') { closeDatePicker(); return true; }
    if (document.getElementById('template-modal').style.display === 'flex') { closeTemplateModal(); return true; }
    if (document.getElementById('pattern-lock-modal').style.display === 'flex') { closePatternLock(); return true; }
    if (document.getElementById('crop-overlay').style.display === 'flex') { cancelWallpaper(); return true; }

    // 2. 关闭抽屉和侧边面板
    if (document.getElementById('side-drawer').classList.contains('open')) { closeDrawer(); return true; }
    if (document.getElementById('diary-panel').classList.contains('open')) { closeDiaryPanel(); return true; }

    // 3. 列表视图退回
    if (document.getElementById('page-important-dates').classList.contains('active')) {
        if (document.getElementById('important-list-view').style.display === 'block') {
            exitImportantList();
            return true;
        }
    }

    // 4. 跳转页面退回上级
    const activePage = document.querySelector('.page.active')?.id;
    if (!activePage || activePage === 'page-home') return false; // 已经是主页了，无路可退
    
    const backMap = {
        'page-add': () => switchPage('page-all-items'),
        'page-add-gift': () => switchPage('page-gift-record'),
        'page-gift-detail': () => switchPage('page-gift-record'),
        'page-event-detail': () => switchPage('page-gift-detail'),
        'page-add-event': () => switchPage('page-gift-detail'),
        'page-add-important': () => switchPage('page-important-dates'),
        'page-important-detail': () => backFromImportantDetail(),
        'page-book-list': () => switchPage('page-home'),
        'page-book-view': () => switchPage('page-home'),
        'page-book-detail': () => switchPage('page-book-list'),
        'page-item-distribution': () => switchPage('page-all-items'),
        'page-gift-distribution': () => switchPage('page-gift-record'),
        'page-diary-list': () => backFromImportantDetail(),
        'page-diary-view': () => backToDiaryList(),
        'page-diary-edit': () => cancelDiaryEdit(),
        'page-profile': () => switchPage('page-home'),
        'page-theme': () => switchPage('page-home'),
        'page-backup': () => switchPage('page-home'),
        'page-lock': () => switchPage('page-home'),
        'page-about': () => switchPage('page-home')
    };

    if (backMap[activePage]) {
        backMap[activePage]();
        return true;
    }
    return false;
}
// ================= 接管系统级返回键 / 边缘手势 (鸿蒙/安卓) =================
// 每次启动时，往历史栈压入一个空记录，防止第一步直接退出 App
history.pushState({ page: 'main' }, '', location.href);

window.addEventListener('popstate', function (e) {
    // 尝试执行你的返回逻辑（关弹窗、关抽屉、退页面）
    const handled = handleEdgeBack();
    
    if (handled) {
        // 如果当前页面/弹窗处理了这次返回，立刻补上一个历史记录！
        // 这样用户继续滑，我们还能接着处理，页面和 App 都不会退出
        history.pushState({ page: 'main' }, '', location.href);
    } else {
        // 如果没处理，说明已经到了主页的尽头
        // 为了防止用户一不小心滑一下就把 App 退出了，我们再压入一个记录
        // 如果你想在主页滑一下直接退出，可以去掉下面这行代码
        history.pushState({ page: 'main' }, '', location.href);
    }
});