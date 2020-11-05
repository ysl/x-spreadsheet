export default {
  toolbar: {
    undo: '撤銷',
    redo: '重做',
    print: '列印',
    paintformat: '格式套用',
    clearformat: '清除格式',
    format: '格式',
    fontName: '字體',
    fontSize: '字型大小',
    fontBold: '粗體',
    fontItalic: '斜體',
    underline: '底線',
    strike: '刪除線',
    color: '字體顏色',
    bgcolor: '填充顏色',
    border: '邊框',
    merge: '合並儲存格',
    align: '水平對齊',
    valign: '垂直對齊',
    textwrap: '自動換行',
    freeze: '凍結',
    autofilter: '自動篩選',
    formula: '函數',
    more: '更多',
  },
  contextmenu: {
    copy: '複製',
    cut: '剪下',
    paste: '貼上',
    pasteValue: '貼上數據',
    pasteFormat: '貼上格式',
    hide: '隱藏',
    insertRow: '插入行',
    insertColumn: '插入列',
    deleteSheet: '刪除',
    deleteRow: '刪除行',
    deleteColumn: '刪除列',
    deleteCell: '刪除',
    deleteCellText: '刪除數據',
    validation: '數據驗證',
    cellprintable: '可列印',
    cellnonprintable: '不可列印',
    celleditable: '可編輯',
    cellnoneditable: '不可編輯',
    usereditable: '使用者編輯權限',
    notification: '執行程式提醒',
    timeReport: '回報完工時間',
  },
  userediting: {
    allowCellEditing: '允許使用者編輯此儲存格'
  },
  print: {
    size: '紙張大小',
    orientation: '方向',
    orientations: ['橫向', '縱向'],
  },
  format: {
    normal: '正常',
    text: '文字',
    number: '數值',
    percent: '百分比',
    rmb: '人民幣',
    usd: '美元',
    eur: '歐元',
    date: '短日期',
    time: '時間',
    datetime: '長日期',
    duration: '持續時間',
  },
  formula: {
    sum: '求和',
    average: '求平均值',
    max: '求最大值',
    min: '求最小值',
    concat: '字符拼接',
    _if: '條件判斷',
    and: '和',
    or: '或',
  },
  validation: {
    required: '此值必填',
    notMatch: '此值不匹配驗證規則',
    between: '此值應在 {} 和 {} 之間',
    notBetween: '此值不應在 {} 和 {} 之間',
    notIn: '此值不在列表中',
    equal: '此值應該等於 {}',
    notEqual: '此值不應該等於 {}',
    lessThan: '此值應該小於 {}',
    lessThanEqual: '此值應該小於等於 {}',
    greaterThan: '此值應該大於 {}',
    greaterThanEqual: '此值應該大於等於 {}',
  },
  error: {
    pasteForMergedCell: '無法對合並的儲存格執行此操作',
  },
  calendar: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
  button: {
    next: '下一步',
    cancel: '取消',
    remove: '刪除',
    save: '儲存',
    ok: '確認',
    create: '新增',
  },
  sort: {
    desc: '降冪',
    asc: '升冪',
  },
  filter: {
    empty: '空白',
  },
  dataValidation: {
    mode: '模式',
    range: '範圍',
    criteria: '條件',
    modeType: {
      cell: '儲存格',
      column: '列模式',
      row: '行模式',
    },
    type: {
      list: '列表',
      number: '數字',
      date: '日期',
      phone: '手機號',
      email: '電子郵件',
    },
    operator: {
      be: '在區間',
      nbe: '不在區間',
      lt: '小於',
      lte: '小於等於',
      gt: '大於',
      gte: '大於等於',
      eq: '等於',
      neq: '不等於',
    },
  },
  notification: {
    create_new_notificaiton: '建立新的提醒',
    title: '標題',
    position: '位置',
    file: '檔案',
    remind_date: '執行日期',
    remind_time: '執行時間',
    remind_user: '提醒對象',
    please_select_a_file: '請選擇一個檔案',
    please_pick_a_date: '請選擇一個日期',
    at_least_one_user: '至少選擇一個使用者',
    confirm_to_remove: '確定要刪除嗎？',
    program: '程式',
    download: '下載',
  },
  alert: {
    please_execute_program: '請執行測試程式',
  },
  timereport: {
    set_time_report_user: '設定回報完工時間的人員',
    none: '無',
    current_time: '現在時間',
    please_click_confirm_to_report_time: '請點擊確認來回報完工時間。',
    report_successfully: '回報成功',
  },
};
