// data.js — Saigon Companion RC29.64 · Travel Engine 25.7.0 Integrity Pilot
// Timeline is authoritative for itinerary content; booking linkage is reconciled to Booking Foundation IDs.

const PLACES={
  "in-the-mood-d4": {"title":"In The Mood Saigon","emoji":"🎁","cat":"SHOP","sub":"Day 4 · First shopping stop","shoppingRoute":"Day 4 · Thảo Điền walk","hours":"10:00–19:00 · verify on the day","address":"32 Trần Ngọc Diện, An Khánh, Hồ Chí Minh, Vietnam","maps":"https://www.google.com/maps/search/?api=1&query=In%20The%20Mood%20Saigon%2032%20Tran%20Ngoc%20Dien","desc":"Day 4 第一站；越南設計、手工家品、飾物及特色手信。","categoryLabel":"🛍 Shopping","transport":"Walk / Grab","highlights":["Vietnamese design","Handmade gifts"]},
  "grade-b-d4": {"title":"Grade B","emoji":"🏺","cat":"SHOP","sub":"Day 4 · Second shopping stop","shoppingRoute":"Day 4 · Thảo Điền walk","address":"14 Trần Ngọc Diện, An Khánh, Hồ Chí Minh, Vietnam","maps":"https://www.google.com/maps/search/?api=1&query=Grade%20B%2014%20Tran%20Ngoc%20Dien%20Ho%20Chi%20Minh","desc":"第二站；設計陶瓷及生活選物。","categoryLabel":"🏺 Ceramics","transport":"Walk","highlights":["Ceramics","Lifestyle objects"]},
  "quince": {
    "title": "Quince Saigon",
    "emoji": "🍽️",
    "cat": "RESTAURANTS",
    "sub": "Modern Mediterranean · Wood-fired Dining",
    "status": "confirmed",
    "maps": "https://www.google.com/maps/search/?api=1&query=Quince%20Saigon%2037bis%20Ky%20Con%20District%201",
    "address": "37bis Ký Con, District 1, Ho Chi Minh City, Vietnam",
    "desc": "Quince Saigon 主打現代地中海及歐陸料理，以柴火、炭烤與時令食材帶出煙燻香氣；開放式廚房與溫暖精緻的用餐氣氛，很適合四位朋友享受旅程最後一晚。菜單按季節調整，當日以餐廳菜單為準。",

    "signature": ["Wood-fired / charcoal-grilled seasonal dishes", "Scallops 或當日海鮮料理（視菜單供應）", "Seasonal desserts"],
    "worth": ["適合四人分享前菜，再各選主菜。", "可留意開放式柴火廚房及當日 specials。", "不飲酒亦可以專注食物與甜品。"],
    "categoryLabel": "🍽️ Restaurant",
    "transport": "Grab from Thảo Điền; allow traffic buffer"
  },

  "currency-guide": {
    "title": "Cash & Currency",
    "emoji": "💱",
    "cat": "PRACTICAL",
    "sub": "5 useful options · choose by where you are",
    "categoryLabel": "💱 Currency",
    "desc": "不用特地為換錢改路線。Day 1 有三個自然選擇，Day 2 另有一個順路 ATM；Takashimaya 則是任何一天回到 Fusion 附近都方便的 fallback。",
    "currencyOptions": [
      {"name":"VPBank ATM · Hàm Nghi","icon":"🏧","best":"Day 1 morning · before Phở SOL","note":"Wise 提款首選。現時 Wise 顯示 VPBank 為 no operator fee；提款前仍以 ATM 畫面為準。","address":"165–167–169 Hàm Nghi, District 1","maps":"https://www.google.com/maps/search/?api=1&query=VPBank%20ATM%20165-167-169%20Ham%20Nghi%20District%201%20Ho%20Chi%20Minh%20City"},
      {"name":"Hà Tâm","icon":"💵","best":"Day 1 · Bến Thành / Nguyễn Trãi","note":"想用 AUD 現金比較匯率時的 Day 1 選擇；到埗再看當日 rate。","address":"2 Nguyễn An Ninh, District 1","maps":"https://www.google.com/maps/search/?api=1&query=Ha%20Tam%202%20Nguyen%20An%20Ninh%20Ho%20Chi%20Minh%20City"},
      {"name":"Hung Long Money Exchange","icon":"💱","best":"Day 1 afternoon · before Cafe Apartments","note":"若朝早未換夠，從 Fusion 前往 Nguyễn Huệ / Cafe Apartments 時順道最自然。","address":"86 Mạc Thị Bưởi, District 1","maps":"https://www.google.com/maps/search/?api=1&query=Hung%20Long%20Money%20Exchange%2086%20Mac%20Thi%20Buoi%20Ho%20Chi%20Minh%20City"},
      {"name":"TPBank LiveBank · Hai Bà Trưng","icon":"🏧","best":"Day 2 · Hai Bà Trưng lunch area","note":"Pizza 4P’s Hai Bà Trưng 附近的提款選擇。現時 Wise 顯示 TPBank 為 no operator fee；提款前仍以 ATM 畫面為準。","address":"125 Hai Bà Trưng, District 1","maps":"https://www.google.com/maps/search/?api=1&query=TPBank%20LiveBank%20125%20Hai%20Ba%20Trung%20Ho%20Chi%20Minh%20City"},
      {"name":"Takashimaya B2 Exchange","icon":"💱","best":"Any day · around Fusion","note":"酒店相連的最方便 cash-exchange fallback；09:30 後經過 Saigon Centre 時再處理即可。","address":"Saigon Centre / Takashimaya B2, 65 Lê Lợi, District 1","maps":"https://www.google.com/maps/search/?api=1&query=Takashimaya%20Saigon%20Centre%2065%20Le%20Loi%20Ho%20Chi%20Minh%20City"}
    ]
  },
  "fusion": {
    "title": "Fusion Original Saigon Centre",
    "emoji": "🏨",
    "cat": "STAY",
    "sub": "District 1 市中心基地 · Saigon Centre 內",
    "maps": "https://www.google.com/maps/search/?api=1&query=Fusion%20Original%20Saigon%20Centre%20Fusion%20Original%20Saigon%20Centre%2C%2065%20L%C3%AA%20L%E1%BB%A3i%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City",
    "address": "Fusion Original Saigon Centre, 65 Lê Lợi, Bến Nghé, District 1, Ho Chi Minh City",
    "source": {"type":"official","url":"https://fusionhotelgroup.com/","verifiedAt":"2026-09-18"},
    "desc": "酒店直接連接 Saigon Centre／Takashimaya，位置非常方便。天氣熱或落雨時尤其實用：shopping、食物和日用品都在樓下，中央景點亦多數只需步行或短程 Grab。",
    "signature": ["直接連接 Saigon Centre／Takashimaya", "District 1 中心位置", "適合放低戰利品或中途返房休息"],
    "worth": ["把酒店當作方便的市中心基地，不需要每段行程都刻意返酒店。", "Takashimaya 和附近餐飲很適合最後補貨。"],
    "categoryLabel": "🏨 Stay",
    "transport": "Grab / walk depending on current route",
    "highlights": ["Direct access to Saigon Centre / Takashimaya", "Central District 1 base", "Easy rain / heat fallback"],
    "tips": ["Useful as a bag-drop and reset point between city stops.", "Takashimaya downstairs is convenient for last-minute supplies."]
  },

  "cafe-apartments": {
    "title": "The Cafe Apartments",
    "emoji": "🌃",
    "cat": "CAFÉS",
    "sub": "Day 1 · Flexible / optional Nguyễn Huệ stop",
    "status": "optional",
    "hours": "Individual venues vary; most operate about 08:00–22:00",
    "maps": "https://www.google.com/maps/search/?api=1&query=The%20Cafe%20Apartments%2042%20Nguy%E1%BB%85n%20Hu%E1%BB%87%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
    "address": "42 Nguyễn Huệ, District 1, Ho Chi Minh City, Vietnam",
    "desc": "A flexible Day 1 energy-dependent stop, not a fixed afternoon block. If everyone still has energy after Fusion check-in, do a short browse / photos / coffee; after Omakase it can reappear as an optional Nguyễn Huệ evening wander.",
    "signature": [
      "Short browse, photos and coffee if energy allows",
      "Optional evening Nguyễn Huệ wander after Omakase",
      "Individual cafés and shops across the old apartment building"
    ],
    "worth": [
      "Cafe Apartments is the flexible element; protect Qspa and the 17:30 Omakase seating.",
      "If tired, stay at Fusion and rest."
    ],
    "categoryLabel": "☕ Cafe",
    "price": "$–$$",
    "transport": "Walk from Fusion when energy allows"
  },
  "cong": {
    "title": "Cộng Cà Phê Tân Định",
    "emoji": "🥥",
    "cat": "CAFÉS",
    "sub": "粉紅教堂景觀咖啡",
    "status": "planned",
    "hours": "07:00–23:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=C%E1%BB%99ng%20C%C3%A0%20Ph%C3%AA%20T%C3%A2n%20%C4%90%E1%BB%8Bnh%20C%E1%BB%99ng%20C%C3%A0%20Ph%C3%AA%20T%C3%A2n%20%C4%90%E1%BB%8Bnh%2C%20Hai%20B%C3%A0%20Tr%C6%B0ng%2C%20District%203%2C%20Ho%20Chi%20Minh%20City",
    "address": "274 Hai Bà Trưng, Tân Định, Ho Chi Minh City, Vietnam",
    "desc": "Cộng Cà Phê Tân Định 最大賣點唔係咖啡本身，而係位置：粉紅教堂正對面／附近，適合打完卡後上樓坐低，用椰子咖啡或冰沙咖啡換一個俯瞰教堂角度。復古軍綠風裝潢亦好有越南味。",
    "signature": [
      "椰子咖啡／椰子冰沙咖啡",
      "粉紅教堂視角",
      "復古越南風格"
    ],
    "worth": [
      "如果只想影教堂，停留 20–30 分鐘已足夠。",
      "座位景觀視乎當日樓層與窗邊位置。"
    ],
    "categoryLabel": "☕ Cafe",
    "price": "$–$$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "椰子咖啡／椰子冰沙咖啡",
      "粉紅教堂視角",
      "復古越南風格"
    ],
    "tips": [
      "如果只想影教堂，停留 20–30 分鐘已足夠。",
      "座位景觀視乎當日樓層與窗邊位置。"
    ]
  },
  "marou": {
    "title": "Maison Marou",
    "emoji": "🍫",
    "cat": "CAFÉS",
    "sub": "朱古力甜點",
    "status": "planned",
    "hours": "",
    "maps": "https://www.google.com/maps/search/?api=1&query=Maison%20Marou%20Level%20B2%2C%20Saigon%20Centre%20%E2%80%93%20Takashimaya%2C%2065%20L%C3%AA%20L%E1%BB%A3i%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
    "address": "Level B2, Saigon Centre – Takashimaya, 65 Lê Lợi, Ho Chi Minh City, Vietnam",
    "desc": "Maison Marou 是越南精品朱古力品牌，今次最方便的分店就在 Saigon Centre / Fusion 附近。它適合兩種用途：一是旅行中段回酒店後飲杯熱朱古力，二是最後買手信。比起普通 souvenir，Marou 朱古力包裝靚、有越南產地特色，而且容易帶回澳洲。",
    "signature": [
      "熱朱古力、朱古力撻、bonbon",
      "越南產地朱古力手信",
      "包裝靚，送禮安全牌"
    ],
    "worth": [
      "如果怕行李熱溶，最後一日或晚間買最好。",
      "店內甜品偏濃郁，4 人 share 會比每人一份舒服。"
    ],
    "categoryLabel": "☕ Cafe",
    "price": "$–$$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "熱朱古力、朱古力撻、bonbon",
      "越南產地朱古力手信",
      "包裝靚，送禮安全牌"
    ],
    "tips": [
      "如果怕行李熱溶，最後一日或晚間買最好。",
      "店內甜品偏濃郁，4 人 share 會比每人一份舒服。"
    ]
  },
  "running-bean": {
    "title": "The Running Bean",
    "emoji": "☕",
    "cat": "CAFÉS",
    "sub": "Day 5 · Bến Thành Breakfast & Coffee",
    "status": "planned",
    "hours": "07:30–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=The%20Running%20Bean%205%20Nguyen%20Trung%20Truc%20Ben%20Thanh%20Ho%20Chi%20Minh%20City",
    "address": "5 Nguyễn Trung Trực, Bến Thành, Ho Chi Minh City, Vietnam",
    "desc": "Day 5 最後一朝去 Bến Thành 分店，特色咖啡配 all-day brunch；現代舒適環境，適合四位朋友慢慢食早餐再去 Museum of Fine Arts。",
    "signature": [
      "越式蛋咖啡",
      "椰子咖啡／冰沙咖啡",
      "明亮現代空間"
    ],
    "worth": [
      "早餐預留約 45–60 分鐘，之後去 Museum of Fine Arts。",
      "中午仍有 Bếp Mẹ Ỉn，早餐可選輕食分享。"
    ],
    "categoryLabel": "☕ Cafe",
    "price": "$–$$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "越式蛋咖啡",
      "椰子咖啡／冰沙咖啡",
      "明亮現代空間"
    ],
    "tips": [
      "早餐預留約 45–60 分鐘，之後去 Museum of Fine Arts。"
    ]
  },
  "bep-me-in": {
    "title": "Bếp Mẹ Ỉn",
    "emoji": "🏡",
    "cat": "RESTAURANTS",
    "sub": "越式家常菜",
    "status": "planned",
    "hours": "10:30–22:30",
    "maps": "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFp%20M%E1%BA%B9%20%E1%BB%88n%20136%2F9%20L%C3%AA%20Th%C3%A1nh%20T%C3%B4n%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam",
    "address": "136/9 Lê Thánh Tôn, Bến Thành, Hồ Chí Minh, Vietnam",
    "desc": "Bếp Mẹ Ỉn 是 Michelin Bib Gourmand 越式家常菜，藏在市中心小巷內，氣氛比街邊小店舒服，但菜式仍然保留越南家庭菜與街頭味道。放在最後一日午餐很適合：不用太 formal，但又可以把 bánh xèo、椰子炒飯、越式小食一次過收尾。",
    "signature": [
      "Bánh Xèo 黃金煎餅",
      "椰子炒飯",
      "越式拼盤與家常菜"
    ],
    "worth": [
      "入口在巷內，第一次去要跟 Google Maps 慢慢找。",
      "多人 share 最好食，4 人比 2 人更適合。",
      "🥖 Local Tip：隔籬同一條巷係 Bánh Mì Mẹ Ỉn（136/13 Lê Thánh Tôn）。可問店員能否叫法包送到 Bếp Mẹ Ỉn 一齊 share；以當日安排為準。"
    ],
    "categoryLabel": "🍽 Restaurant",
    "price": "$$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "Bánh Xèo 黃金煎餅",
      "椰子炒飯",
      "越式拼盤與家常菜"
    ],
    "tips": [
      "入口在巷內，第一次去要跟 Google Maps 慢慢找。",
      "多人 share 最好食，4 人比 2 人更適合。",
      "🥖 Local Tip：隔籬同一條巷係 Bánh Mì Mẹ Ỉn（136/13 Lê Thánh Tôn）。可問店員能否叫法包送到 Bếp Mẹ Ỉn 一齊 share；以當日安排為準。"
    ]
  },
  "com-tam-moc": {
    "title": "Cơm Tấm Mộc",
    "emoji": "🍚",
    "cat": "RESTAURANTS",
    "sub": "Day 2 · Fashion Day Breakfast",
    "status": "planned",
    "hours": "09:00–21:30 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=C%C6%A1m%20T%E1%BA%A5m%20M%E1%BB%99c%2085%20L%C3%BD%20T%E1%BB%B1%20Tr%E1%BB%8Dng%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam",
    "address": "85 Lý Tự Trọng, Bến Thành, Hồ Chí Minh 700000, Vietnam",
    "desc": "有冷氣嘅越式碎米飯餐廳，09:00 開門。",
    "signature": [
      "炭烤豬排碎米飯",
      "魚露、蛋、酸菜配搭",
      "冷氣環境比街邊舒服"
    ],
    "worth": [
      "4 人點 2–3 份 share 已足夠，預算約 60,000–100,000 VND / 人，因為 10:00 還有 cooking class。",
      "如果早上不餓，可以改成外帶咖啡。"
    ],
    "categoryLabel": "🍽 Restaurant",
    "price": "$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "炭烤豬排碎米飯",
      "魚露、蛋、酸菜配搭",
      "冷氣環境比街邊舒服"
    ],
    "tips": [
      "4 人點 2–3 份 share 已足夠，預算約 60,000–100,000 VND / 人，因為 10:00 還有 cooking class。",
      "如果早上不餓，可以改成外帶咖啡。"
    ]
  },

  "lune": {
    "title": "LÚNE Restaurant & Bar",
    "emoji": "🇫🇷",
    "cat": "RESTAURANTS",
    "sub": "現代法式料理 · 越南風味",
    "status": "planned",
    "hours": "Mon–Sat 11:30–14:00 & 17:00–22:30；Sunday closed",
    "maps": "https://www.google.com/maps/search/?api=1&query=L%C3%9ANE%20Restaurant%20%26%20Bar%2017%2F14%20L%C3%AA%20Th%C3%A1nh%20T%C3%B4n%2C%20S%C3%A0i%20G%C3%B2n%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2070000%2C%20Vietnam",
    "address": "17/14 Lê Thánh Tôn, Sài Gòn, Hồ Chí Minh 70000, Vietnam",
    "desc": "LÚNE 以現代法式烹調結合越南及亞洲食材，菜式偏精緻創意。可以留意龍蝦 raviolo、帶越南元素的 foie gras terrine，以及當日海鮮與季節料理；適合想試精緻 fusion dining 的一餐。",
    "signature": [
      "Canadian lobster raviolo｜Michelin Guide 點名 standout",
      "Phở foie gras terrine｜法式技巧 × 越南味",
      "Sea urchin + A5 wagyu｜近期食客特別提到"
    ],
    "worth": ["Smart casual 已足夠。", "如果四人想試多款 signature dishes，可一開始便向店員講明想分享。"],
    "categoryLabel": "🍽 Restaurant",
    "price": "$$$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "Michelin Selected 話題餐廳",
      "法式技巧結合越南／亞洲食材",
      "Bar + restaurant 氣氛，適合四人換裝後晚餐"
    ],
    "tips": ["Smart casual is sufficient.", "Ask about seasonal dishes if the table wants to share."]
  },
  "omakase-tiger": {
    "title": "Omakase Tiger",
    "emoji": "🍣",
    "cat": "RESTAURANTS",
    "sub": "Penthouse Omakase counter",
    "status": "booked",
    "hours": "Reservation confirmed · 17:30",
    "maps": "https://www.google.com/maps/search/?api=1&query=Omakase%20Tiger%2085%2F9%20Ph%E1%BA%A1m%20Vi%E1%BA%BFt%20Ch%C3%A1nh%2C%20Th%E1%BA%A1nh%20M%E1%BB%B9%20T%C3%A2y%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam",
    "address": "85/9 Phạm Viết Chánh, Thạnh Mỹ Tây, Hồ Chí Minh 700000, Vietnam",
    "desc": "Penthouse omakase counter，可近距離欣賞師傅準備料理。",
    "signature": ["按當日海鮮安排的 seasonal omakase", "Counter seating 最適合看 preparation", "想飲酒可再考慮 sake pairing"],
    "worth": ["當作 chef-led menu 體驗，不需要逐道自己揀。", "有 allergy 或非常不吃的食材，開餐前先講。"],
    "categoryLabel": "🍽 Restaurant",
    "price": "$$$",
    "transport": "Grab / walk depending on current route",
    "highlights": ["Penthouse setting with city views", "Small counter for close-up chef interaction", "Seasonal chef-led courses"],
    "tips": ["Mention allergies or strong dislikes before the meal starts.", "Smart casual is sufficient."]
  },
  "pho-sol": {
    "title": "Phở SOL",
    "emoji": "🍜",
    "cat": "RESTAURANTS",
    "sub": "石鍋牛肉河粉",
    "status": "planned",
    "hours": "06:00–24:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20SOL%2032%20Ph%E1%BA%A1m%20H%E1%BB%93ng%20Th%C3%A1i%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam",
    "address": "32 Phạm Hồng Thái, Bến Thành, Hồ Chí Minh, Vietnam",
    "desc": "Phở SOL 是抵達後第一餐的好選擇：位置近第一郡，石鍋河粉上枱有儀式感，熱湯、牛肉、油條很適合剛落機後慢慢進入越南節奏。它比街邊河粉更乾淨舒服，適合四位朋友第一餐先穩陣開局。",
    "signature": [
      "石鍋河粉",
      "牛骨湯與牛肉配料",
      "油條 quẩy 沾湯"
    ],
    "worth": [
      "4 人可以點不同款式 share，不一定每人一碗。",
      "第一日下機後不要排太多，食完留體力去景點和 spa。"
    ],
    "categoryLabel": "🍽 Restaurant",
    "price": "$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "石鍋河粉",
      "牛骨湯與牛肉配料",
      "油條 quẩy 沾湯"
    ],
    "tips": [
      "4 人可以點不同款式 share，不一定每人一碗。",
      "第一日下機後不要排太多，食完留體力去景點和 spa。"
    ]
  },
  "clothes-bar": {
    "title": "Clothes Bar", "emoji":"👗", "cat":"SHOP", "sub":"Day 1 · Nguyễn Trãi Shopping Start",
    "maps":"https://www.google.com/maps/search/?api=1&query=Clothes%20Bar%2024%20Nguyen%20Trai%20Ho%20Chi%20Minh%20City",
    "address":"24 Nguyễn Trãi, District 1, Ho Chi Minh City",
    "desc":"Day 1 Nguyễn Trãi Shopping Walk 的 navigation anchor；完整店舖內容放在 Shopping List。"
  },
  "dot-dot-gem": {
    "title":"Dot Dot Gem","emoji":"💍","cat":"SHOP","sub":"Day 1 · Nguyễn Trãi Jewellery","shoppingRoute":"Day 1 · Nguyễn Trãi walk","hours":"09:00–21:00 · Tuesday listing may vary; check same day","maps":"https://www.google.com/maps/search/?api=1&query=Dot%20Dot%20Gem%2029%20Nguyen%20Trai%20Ho%20Chi%20Minh","address":"29 Nguyễn Trãi, Bến Thành, Hồ Chí Minh","desc":"Nguyễn Trãi 主線上的 contemporary jewellery stop，位置夾在 Clothes Bar 與後段 fashion shops 之間，不需要另外繞路。適合看細緻耳環、戒指與日常首飾。","signature":["Contemporary jewellery","Rings + earrings","Right on Nguyễn Trãi route"],"worth":["真正順路，想睇首飾先入；唔需要當 mandatory checkpoint。"],"categoryLabel":"💍 Jewellery","price":"Varies","transport":"Walk on Nguyễn Trãi","highlights":["Contemporary jewellery","Rings + earrings"],"tips":["快逛即可，留時間畀後面 49A/49B/52。"]
  },
  "bubbli-wear": {
    "title":"Bubbli.wear","emoji":"👗","cat":"SHOP","sub":"Day 1 · Nguyễn Trãi Quick Browse","shoppingRoute":"Day 1 · Nguyễn Trãi walk","hours":"09:00–22:00","maps":"https://www.google.com/maps/search/?api=1&query=Bubbli.wear%2039%2F15%20Nguyen%20Trai%20Ho%20Chi%20Minh","address":"39/15 Nguyễn Trãi, Bến Thành, Hồ Chí Minh","desc":"39/15 Nguyễn Trãi 的 local womenswear quick browse；本身就在 29 號 Dot Dot Gem 與 49A/49B fashion pair 之間，見到啱先入。","signature":["Local womenswear","Quick browse","No extra transport"],"worth":["順路先係價值；唔需要每間完成。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Walk on Nguyễn Trãi","highlights":["Local womenswear","Quick browse"],"tips":["按興趣 skip / enter。"]
  },
  "carpe-diem": {
    "title":"Carpe Diem · Handcrafted Candles & Gifts","emoji":"🕯️","cat":"SHOP","sub":"Day 4 · Candles + Gifts","shoppingRoute":"Day 4 · Scent walk","hours":"09:00–20:00 · weekend to 20:30","maps":"https://www.google.com/maps/search/?api=1&query=Carpe%20Diem%2028%20Thao%20Dien%20Ho%20Chi%20Minh","address":"28 Thảo Điền, An Khánh, Hồ Chí Minh","desc":"手工香薰蠟燭與小禮物；28 Thảo Điền 正好接住 Blume 25，再到 YouOn 29，係真正零碎步行式 stop。","signature":["Handcrafted candles","Scented gifts","Easy souvenir"],"worth":["香薰 / 小禮物比再加一間 fashion 更有變化。"],"categoryLabel":"🕯️ Home fragrance","price":"Varies","transport":"Walk within Thảo Điền core","highlights":["Handcrafted candles","Gifts"],"tips":["易碎或較重蠟燭留意行李重量。"]
  },
  "youon-thao-dien": {
    "title":"YouOn Boutique · Thảo Điền","emoji":"👗","cat":"SHOP","sub":"Day 4 · Thảo Điền Fashion","shoppingRoute":"Day 4 · Thảo Điền walk","hours":"09:00–21:00","maps":"https://www.google.com/maps/search/?api=1&query=YouOn%20Boutique%2029%20Thao%20Dien%20Ho%20Chi%20Minh","address":"29 Thảo Điền, An Khánh, Hồ Chí Minh","desc":"棉麻、空氣感與容易穿回日常的 local womenswear；今次鎖定 29 Thảo Điền branch。","signature":["Local womenswear","Relaxed silhouettes","Thảo Điền branch"],"worth":["同 25/28 Thảo Điền 連成短 walking cluster。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Walk","highlights":["Local womenswear","Relaxed silhouettes"],"tips":["不要誤去 Lưu Văn Lang branch。"]
  },
  "dakao-quartier": {
    "title":"dakao quartier","emoji":"🏺","cat":"SHOP","sub":"Day 4 · Xuân Thủy Design","shoppingRoute":"Day 4 · Xuân Thủy design walk","hours":"09:00–21:00","maps":"https://www.google.com/maps/search/?api=1&query=dakao%20quartier%2083%20Xuan%20Thuy%20Ho%20Chi%20Minh","address":"83 Xuân Thủy, An Khánh, Hồ Chí Minh","desc":"Saigon contemporary home design / décor concept store；由 fashion + scent 轉入 Xuân Thủy 後，呢站開始睇家品與設計。","signature":["Contemporary Saigon design","Home décor","Curated gifts"],"worth":["同 Aurora 94、Vina 111 串成同一條 Xuân Thủy design line。"],"categoryLabel":"🏺 Home + Design","price":"Varies","transport":"Walk on Xuân Thủy","highlights":["Home décor","Contemporary Saigon design"],"tips":["家品可先影相，最後先決定是否買較大件。"]
  },
  "aurora-saigon": {
    "title":"Aurora Saigon","emoji":"💎","cat":"SHOP","sub":"Day 4 · Xuân Thủy Silver Jewellery","shoppingRoute":"Day 4 · Xuân Thủy design walk","hours":"10:30–19:30","maps":"https://www.google.com/maps/search/?api=1&query=Aurora%20Saigon%2094%20Xuan%20Thuy%20Ho%20Chi%20Minh","address":"94 Xuân Thủy, Thảo Điền, Hồ Chí Minh","desc":"Contemporary jewellery boutique；有 925 sterling silver 作品，正好補你想睇 silver jewellery。94 Xuân Thủy 位於 dakao 83 與 Vina 111 之間。","signature":["925 sterling silver","Gemstone jewellery","Contemporary pieces"],"worth":["首飾 stop 同 Xuân Thủy 主線完全重疊，值得入去睇。"],"categoryLabel":"💎 Jewellery","price":"Varies","transport":"Walk on Xuân Thủy","highlights":["925 sterling silver","Gemstones"],"tips":["Aurora 同 Wicky Candle 同一地址，一次睇兩種。"]
  },
  "wicky-candle": {
    "title":"Wicky Candle","emoji":"🕯️","cat":"SHOP","sub":"Day 4 · Xuân Thủy Candle Stop","shoppingRoute":"Day 4 · Xuân Thủy design walk","hours":"09:30–21:00","maps":"https://www.google.com/maps/search/?api=1&query=Wicky%20Candle%2094%20Xuan%20Thuy%20Ho%20Chi%20Minh","address":"94 Xuân Thủy, An Khánh, Hồ Chí Minh","desc":"香薰蠟燭店，同 Aurora Saigon 同一個 94 Xuân Thủy 地址；不增加 walking distance，睇完 jewellery 可以順手聞香。","signature":["Scented candles","Same-address stop","Home fragrance"],"worth":["零 detour；有興趣先入。"],"categoryLabel":"🕯️ Home fragrance","price":"Varies","transport":"Same address as Aurora","highlights":["Scented candles","Home fragrance"],"tips":["同 Aurora 合併做一個停點最省時間。"]
  },
  "vina-design-thao-dien": {
    "title":"Vina Design Store · Thảo Điền","emoji":"⭐","cat":"SHOP","sub":"Day 4 · Xuân Thủy Design Finish","shoppingRoute":"Day 4 · Xuân Thủy design walk","hours":"10:00–21:00","maps":"https://www.google.com/maps/search/?api=1&query=Vina%20Design%20Store%20111%20Xuan%20Thuy%20Ho%20Chi%20Minh","address":"111 Xuân Thủy, An Khánh, Hồ Chí Minh","desc":"Curated Vietnamese design objects；111 Xuân Thủy 放在 Day 4 design walk 尾段，比再加普通 fashion shop更有特色。","signature":["Vietnamese design objects","Curated local products","Design gifts"],"worth":["由 dakao 83 → Aurora/Wicky 94 → Vina 111，地址順序清楚。"],"categoryLabel":"⭐ Vietnamese Design","price":"Varies","transport":"Walk on Xuân Thủy","highlights":["Vietnamese design","Curated local products"],"tips":["同 Day 1 的 111 Tôn Thất Đạm 係不同店址，不要混淆。"]
  },
  "pizza4ps": {
    "title": "Pizza 4P’s Hai Bà Trưng",
    "emoji": "🍕",
    "cat": "RESTAURANTS",
    "sub": "自家製芝士 · 日越風味 Pizza",
    "status": "planned",
    "hours": "Mon–Fri 11:00–23:00 · Sat–Sun 10:00–23:00",
    "maps": "https://www.google.com/maps/search/?api=1&query=Pizza%204P%27s%20151B%20Hai%20Ba%20Trung%20Ho%20Chi%20Minh%20City",
    "address": "151B Hai Bà Trưng, Võ Thị Sáu, District 3, Ho Chi Minh City, Vietnam",
    "source": {"type":"official","url":"https://pizza4ps.com/jp/location/935/?lang=english","verifiedAt":"2026-09-18"},
    "desc": "Pizza 4P’s 的特色是自家製芝士，再把意式 pizza 技巧和日本、越南風味放在一起。Hai Bà Trưng 分店有冷氣，四人 share 幾款 pizza／pasta 很舒服。",
    "signature": [
      "Crab tomato cream spaghetti｜近期評論反覆點名",
      "House-made 4-cheese pizza + honey｜4P’s 經典",
      "Burrata / Parma ham pizza｜第一次去最值得 share"
    ],
    "worth": ["四個人 share pizza 和 pasta，可以一次試多幾款。", "自家製芝士是 4P’s 最有辨識度的特色。"],
    "categoryLabel": "🍽 Restaurant",
    "price": "$$",
    "transport": "Grab from Trần Quang Diệu · lunch at Hai Bà Trưng · then Grab to Qspa",
    "highlights": [
      "House-made cheese",
      "Burrata / 4-cheese pizza",
      "食完由 Hai Bà Trưng Grab 接 Qspa"
    ],
    "tips": ["Share pizzas and pasta across the table to try more dishes.", "House-made cheese is the signature reason to visit."]
  },
  "quan-thuy": {
    "title": "Quán Thuý 94",
    "emoji": "🦀",
    "cat": "RESTAURANTS",
    "sub": "Day 4 · Early lunch before Thảo Điền",
    "status": "planned",
    "hours": "09:00–21:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Qu%C3%A1n%20Thu%C3%BD%2094%2084%20%C4%90inh%20Ti%C3%AAn%20Ho%C3%A0ng%2C%20T%C3%A2n%20%C4%90%E1%BB%8Bnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam",
    "address": "84 Đinh Tiên Hoàng, Tân Định, Hồ Chí Minh, Vietnam",
    "desc": "粉紅教堂一帶走完，11:00 就坐低食蟹肉粉絲。Quán Thuý 94 今次不是早餐，而是 Day 4 的 early lunch；一碗鮮甜蟹湯把 Tân Định 收尾，食完才一次 Grab 入 Thảo Điền。",
    "signature": [
      "Miến cua 蟹肉粉絲",
      "炸蟹肉春捲",
      "Tân Định / Pink Church 動線順路"
    ],
    "worth": [
      "環境偏地道，接受度要有心理準備。",
      "建議早去，太晚可能部分款式售完。"
    ],
    "categoryLabel": "🍽 Restaurant",
    "price": "$",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "Miến cua 蟹肉粉絲",
      "炸蟹肉春捲",
      "Tân Định / Pink Church 動線順路"
    ],
    "tips": [
      "環境偏地道，接受度要有心理準備。",
      "建議早去，太晚可能部分款式售完。"
    ]
  },
  "libe": {
    "title": "LIBÉ",
    "emoji": "👗",
    "cat": "SHOP",
    "sub": "Day 1 · Nguyễn Trãi Fashion Cluster",
    "shoppingRoute": "Day 1 · LIBÉ anchor → nearby walk",
    "hours": "09:30–21:30",
    "maps": "https://www.google.com/maps/search/?api=1&query=LIB%C3%89%20LIB%C3%89%20Nguy%E1%BB%85n%20Tr%C3%A3i%2C%2052%20Nguy%E1%BB%85n%20Tr%C3%A3i%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam",
    "address": "LIBÉ Nguyễn Trãi, 52 Nguyễn Trãi, Bến Thành, Hồ Chí Minh, Vietnam",
    "desc": "LIBÉ 的衣服不急著搶鏡，勝在比例乾淨、顏色容易相處。它像旅行途中偶然遇到的一個實用衣櫃：上班、週末、吃飯都穿得到，回到澳洲後也不容易被遺忘。",
    "signature": [
      "Casual chic 女裝",
      "上班、旅行、日常都易穿",
      "多層店面，款式更新快"
    ],
    "worth": [
      "記得上不同樓層，唔好只睇地下。",
      "尺寸可能偏亞洲版型，最好試身。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "Casual chic 女裝",
      "上班、旅行、日常都易穿",
      "多層店面，款式更新快"
    ],
    "tips": [
      "記得上不同樓層，唔好只睇地下。",
      "尺寸可能偏亞洲版型，最好試身。"
    ]
  },
  "dauple": {
    "title": "Dauple by Ka's",
    "emoji": "🧵",
    "cat": "SHOP",
    "sub": "Day 2 · Nguyễn Trãi Fashion Cluster",
    "shoppingRoute": "Day 2 · Nguyễn Trãi",
    "hours": "09:30–21:30 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Dauple%20by%20Ka's%20Dauple%20by%20Ka's%2C%2070%20Ph%E1%BA%A1m%20H%E1%BB%93ng%20Th%C3%A1i%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam",
    "address": "Dauple by Ka's, 70 Phạm Hồng Thái, Bến Thành, Hồ Chí Minh, Vietnam",
    "desc": "Dauple by Ka’s 偏成熟、優雅、度假感，適合想買一兩件「比普通 fast fashion 更有質感」的朋友。亞麻、真絲、柔和色調和寬鬆剪裁會比街頭品牌更耐看。",
    "signature": [
      "亞麻／真絲質感",
      "成熟優雅剪裁",
      "適合旅行 resort / dinner look"
    ],
    "worth": [
      "價位通常比普通本地品牌高少少，但勝在質感。",
      "如果只想買年輕街頭款，可留時間給 The New Playground。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "亞麻／真絲質感",
      "成熟優雅剪裁",
      "適合旅行 resort / dinner look"
    ],
    "tips": [
      "價位通常比普通本地品牌高少少，但勝在質感。",
      "如果只想買年輕街頭款，可留時間給 The New Playground。"
    ]
  },
  "nosbyn": {
    "title": "NOSBYN",
    "emoji": "🤎",
    "cat": "SHOP",
    "sub": "Day 2 · Nguyễn Trãi Fashion Cluster",
    "shoppingRoute": "Day 2 · Nguyễn Trãi",
    "hours": "09:30–21:30 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=NOSBYN%20Nosbyn%2C%209%20Phan%20Chu%20Trinh%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20Ho%20Chi%20Minh%20City",
    "address": "Nosbyn, 9 Phan Chu Trinh, Bến Thành, Ho Chi Minh City",
    "desc": "NOSBYN 把簡約做得很安靜：線條俐落、顏色克制，單件未必喧鬧，放進原有衣櫃卻很容易。適合平日偏 MUJI、Lululemon 或簡潔 casual 的人慢慢試。",
    "signature": [
      "Minimal / timeless 女裝",
      "布料質感與剪裁較穩",
      "Office、旅行、日常都可重複穿"
    ],
    "worth": [
      "顏色偏 neutral，啱鍾意低調質感的人。",
      "熱門尺碼可能不齊，看到喜歡要即試。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "Minimal / timeless 女裝",
      "布料質感與剪裁較穩",
      "Office、旅行、日常都可重複穿"
    ],
    "tips": [
      "顏色偏 neutral，啱鍾意低調質感的人。",
      "熱門尺碼可能不齊，看到喜歡要即試。"
    ]
  },
  "rue-miche-ledition": {
    "title": "Rue Miche L’Édition",
    "emoji": "🛍",
    "cat": "SHOP",
    "sub": "Day 2 · Union Square Vietnamese Design Flagship",
    "shoppingRoute": "Day 2 · Vincom → Rue Miche L’Édition → LÚNE",
    "hours": "10:00–21:30 daily · official Rue Miche listing",
    "maps": "https://www.google.com/maps/search/?api=1&query=Rue%20Miche%20L%27Edition%20Union%20Square%20171%20Dong%20Khoi%20Ho%20Chi%20Minh",
    "address": "LL3 / Basement 3, Union Square, 171 Đồng Khởi, District 1, Ho Chi Minh City",
    "website": "https://www.ruemiche.com/about-us",
    "phone": "+84 904 260 842",
    "desc": "Rue Miche L’Édition 是 Union Square B3 的大型 Vietnamese multi-brand flagship。Day 2 在 Vincom 看完 local brands 後步行過來，集中看更多 Vietnamese designers，再步行去 LÚNE。",
    "signature": [
      "大型 Vietnamese multi-brand concept store",
      "Fashion、accessories、lifestyle 與 creative space",
      "Day 2 黃昏由 Vincom 接 LÚNE 最順路"
    ],
    "worth": [
      "主打越南本地設計品牌與 accessories。",
      "時間緊可縮短 Vincom，把 browsing time 留給這個 flagship。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Walk 4–6 min from Vincom · then walk 3–5 min toward LÚNE",
    "highlights": ["Vietnamese local designers", "Large multi-brand flagship", "Union Square B3"],
    "tips": ["Day 2 afternoon planned stop。", "Opening hours 10:00–21:30；出發當日可再確認。"]
  },
  "new-playground": {
    "title": "The New Playground",
    "emoji": "🛍",
    "cat": "SHOP",
    "sub": "Day 2 · Vincom Đồng Khởi Local Fashion",
    "shoppingRoute": "Day 2 · Fashion + City",
    "hours": "10:00–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=The%20New%20Playground%20Vincom%20Center%20Dong%20Khoi%2072%20Le%20Thanh%20Ton%20Ho%20Chi%20Minh%20City",
    "address": "Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, District 1, Ho Chi Minh City",
    "desc": "Day 2 sightseeing 後直接走進 Vincom，把黃昏留給一整片 Vietnamese local fashion。The New Playground 集中多個本地品牌；PUSH PUSH 在場內有 selected range，適合一站慢慢掃。",
    "signature": [
      "多個越南本地品牌集中",
      "冷氣環境，適合下午避暑",
      "Streetwear 到 accessories 都有"
    ],
    "worth": [
      "店多但不是每間都精緻，當作快速掃街最有效率。",
      "如果時間 delay，可以只逛這裡，不逐間 boutique 追。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "多個越南本地品牌集中",
      "冷氣環境，適合下午避暑",
      "Streetwear 到 accessories 都有"
    ],
    "tips": [
      "店多但不是每間都精緻，當作快速掃街最有效率。",
      "如果時間 delay，可以只逛這裡，不逐間 boutique 追。"
    ]
  },
  "saigon-concept": {
    "title": "Saigon Concept",
    "emoji": "🌿",
    "cat": "SHOP",
    "sub": "Day 4 · Thảo Điền Lifestyle Walk",
    "shoppingRoute": "Day 4 · Thảo Điền walk",
    "hours": "09:00–18:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Saigon%20Concept%2014%20Tr%E1%BA%A7n%20Ng%E1%BB%8Dc%20Di%E1%BB%87n%2C%20Th%E1%BA%A3o%20%C4%90i%E1%BB%81n%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
    "address": "14 Trần Ngọc Diện, Thảo Điền, Ho Chi Minh City, Vietnam",
    "desc": "Saigon Concept 是 Thảo Điền 很適合慢逛的 lifestyle compound：紅磚庭園、棉麻服飾、家居選物與小型品牌集中在同一區。Day 3 到草田區後先放慢節奏，由這裡開始很舒服。",
    "signature": [
      "庭園式複合空間",
      "DESIGNED BY SISI / lifestyle 選物",
      "適合拍照與慢逛"
    ],
    "worth": [
      "下午早段去比較好，部分小店可能較早關。",
      "重點是氛圍，不一定每間都要買。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "庭園式複合空間",
      "DESIGNED BY SISI / lifestyle 選物",
      "適合拍照與慢逛"
    ],
    "tips": [
      "下午早段去比較好，部分小店可能較早關。",
      "重點是氛圍，不一定每間都要買。"
    ]
  },
  "ohquao": {
    "title": "OHQUAO",
    "emoji": "🎁",
    "cat": "SHOP",
    "sub": "Day 4 · Thảo Điền Lifestyle Walk",
    "shoppingRoute": "Day 4 · Thảo Điền walk",
    "hours": "10:00–20:00",
    "maps": "https://www.google.com/maps/search/?api=1&query=OHQUAO%2019%20%C4%90%C6%B0%E1%BB%9Dng%20S%E1%BB%91%2038%2C%20P.%20Th%E1%BA%A3o%20%C4%90i%E1%BB%81n%2C%20Qu%E1%BA%ADn%202%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh",
    "address": "19 Đường Số 38, P. Thảo Điền, Quận 2, TP. Hồ Chí Minh",
    "desc": "OHQUAO 把插畫、家品、文具與小禮物放進一個很 Thảo Điền 的生活感空間。Day 4 從插畫、家品到小手信都有地方感；這種隨意很像 Thảo Điền 的節奏。",
    "signature": [
      "120+ local brands / Vietnamese design",
      "文具、陶瓷、家品、原創藝術",
      "適合買輕便 souvenir"
    ],
    "worth": [
      "小店尺度不大，適合慢慢看設計、文具與家品。",
      "適合安排在 Mộc Hương Spa 前後順路逛。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "120+ local brands / Vietnamese design",
      "文具、陶瓷、家品、原創藝術",
      "適合買輕便 souvenir"
    ],
    "tips": [
      "小店尺度不大，適合慢慢看設計、文具與家品。",
      "適合安排在 Mộc Hương Spa 前後順路逛。"
    ]
  },
  "louh": {
    "title": "LOUH Saigon",
    "emoji": "🧺",
    "cat": "SHOP",
    "sub": "Day 4 · Thảo Điền Lifestyle Walk",
    "shoppingRoute": "Day 4 · Thảo Điền walk",
    "hours": "10:00–18:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=LOUH%20Saigon%2061%20Nguy%E1%BB%85n%20B%C3%A1%20Hu%C3%A2n%20Th%E1%BA%A3o%20%C4%90i%E1%BB%81n%20Ho%20Chi%20Minh%20City",
    "address": "61 Nguyễn Bá Huân, Thảo Điền, Ho Chi Minh City, Vietnam",
    "desc": "LOUH 的亞麻、棉質女裝與家居服很適合放在 Thảo Điền 慢行裡。不是必到 checkpoint；16:00 Spa 後再走第二段，順路就試，累就跳過。",
    "signature": [
      "法式優雅剪裁",
      "亞麻／棉質天然布料",
      "女裝與家居服為主"
    ],
    "worth": [
      "適合放在 Thảo Điền lifestyle walk 後段，按當日體力決定是否入店。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "法式優雅剪裁",
      "亞麻／棉質天然布料",
      "女裝與家居服為主"
    ],
    "tips": [
      "適合放在 Thảo Điền lifestyle walk 後段，按當日體力決定是否入店。"
    ]
  },
  "garmentory": {
    "title": "11 Garmentory",
    "emoji": "🧥",
    "cat": "SHOP",
    "sub": "Day 2 · Fashion Day First Stop",
    "shoppingRoute": "Day 2 · 11 Garmentory → Trần Quang Diệu",
    "hours": "10:00–21:30 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=11%20Garmentory%20117B%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20C%E1%BA%A7u%20Ki%E1%BB%87u%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
    "address": "117B Nguyễn Đình Chính, Phường Cầu Kiệu, Ho Chi Minh City, Vietnam",
    "desc": "本地設計服飾及選物店；可試穿小眾品牌。",
    "signature": [
      "本地設計師選物",
      "女裝／生活風格小店感",
      "District 3 氣氛比 D1 更 local"
    ],
    "worth": [
      "10:15 開始，約一小時。",
      "這站是主站；後面 cluster 可以按興趣自由取捨。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "本地設計師選物",
      "女裝／生活風格小店感",
      "District 3 氣氛比 D1 更 local"
    ],
    "tips": [
      "10:15 開始，約一小時。",
      "這站是主站；後面 cluster 可以按興趣自由取捨。"
    ]
  },
  "dalla-saigon": {
    "title": "Dalla Saigon",
    "emoji": "👗",
    "cat": "SHOP",
    "sub": "Day 2 · Trần Quang Diệu Fashion Cluster",
    "shoppingRoute": "Day 2 · Trần Quang Diệu",
    "hours": "08:00–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Dalla%20Saigon%2064%20Tr%E1%BA%A7n%20Quang%20Di%E1%BB%87u%20Ph%C6%B0%E1%BB%9Dng%2014%20Qu%E1%BA%ADn%203%20H%E1%BB%93%20Ch%C3%AD%20Minh",
    "address": "64 Trần Quang Diệu, Phường 14, Quận 3, Hồ Chí Minh, Vietnam",
    "desc": "Dalla 是 Trần Quang Diệu shopping cluster 的其中一站：年輕女裝、連身裙與日常單品。和 RUBIES、Lane Cì 落在同一段街區，慢慢走最順。",
    "signature": [
      "日常女裝、連身裙、上班單品",
      "Trần Quang Diệu 街區代表店之一"
    ],
    "worth": [
      "11:30 左右進入 cluster；三間店共用 browsing time。",
      "11:30 左右進入 cluster；13:00 前往 Pizza 4P’s 午餐。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Walk within Trần Quang Diệu cluster",
    "highlights": [
      "日常女裝、連身裙、上班單品",
      "Trần Quang Diệu 街區代表店之一"
    ],
    "tips": [
      "11:30 左右進入 cluster；三間店共用 browsing time。",
      "11:30 左右進入 cluster；13:00 前往 Pizza 4P’s 午餐。"
    ]
  },
  "rubies": {
    "title": "Rubies Rubies",
    "emoji": "👚",
    "cat": "SHOP",
    "sub": "Day 2 · Trần Quang Diệu Fashion Cluster",
    "shoppingRoute": "Day 2 · Trần Quang Diệu",
    "hours": "Check same day",
    "maps": "https://www.google.com/maps/search/?api=1&query=Rubies%20Rubies%2047-49%20Tr%E1%BA%A7n%20Quang%20Di%E1%BB%87u%20Ph%C6%B0%E1%BB%9Dng%2014%20Qu%E1%BA%ADn%203%20H%E1%BB%93%20Ch%C3%AD%20Minh",
    "address": "47–49 Trần Quang Diệu, Phường 14, Quận 3, Hồ Chí Minh, Vietnam",
    "desc": "RUBIES 在同一段 Trần Quang Diệu 路線裡，風格年輕俐落。它不是獨立任務；和 Dalla、Lane Cì 邊走邊看，哪間有感覺就多留十分鐘。",
    "signature": [
      "年輕俐落女裝",
      "本地連鎖品牌，多分店",
      "與 Dalla Saigon 同街，步行可達"
    ],
    "worth": [
      "店內偏小，建議分批試身。",
      "出發前查 Instagram / Facebook 確認分店營業時間。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Walk within Trần Quang Diệu cluster",
    "highlights": [
      "年輕俐落女裝",
      "本地連鎖品牌，多分店",
      "與 Dalla Saigon 同街，步行可達"
    ],
    "tips": [
      "店內偏小，建議分批試身。",
      "出發前查 Instagram / Facebook 確認分店營業時間。"
    ]
  },
  "mozaic-space": {
    "title": "Mozaic Space",
    "emoji": "🧢",
    "cat": "SHOP",
    "sub": "Day 2 · Optional Fashion Stop",
    "shoppingRoute": "Day 2 · Optional after Trần Quang Diệu cluster",
    "hours": "10:00–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Mozaic%20Space%2031%2F23%20Le%20Van%20Sy%20Ho%20Chi%20Minh",
    "address": "31/23 Lê Văn Sỹ, Nhiêu Lộc, Hồ Chí Minh, Vietnam",
    "desc": "Multi-brand Vietnamese fashion / streetwear concept store。Day 2 行完 Trần Quang Diệu shopping cluster 後如果大家仲有精神先去；由 Lane Cì 接過去最順，Grab 約 5–10 分鐘。",
    "signature": ["Vietnamese multi-brand fashion", "Streetwear / local labels", "適合做 Day 2 optional final browse"],
    "worth": ["OPTIONAL：唔影響主行程；有時間、有腳力先加。", "由 Lane Cì / Trần Quang Diệu 尾站 Grab 約 5–10 分鐘；唔標示為 walking route。"],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab 5–10 min from Lane Cì · optional",
    "highlights": ["Vietnamese multi-brand fashion", "Local streetwear / concept-store browse"],
    "tips": ["行完 Trần Quang Diệu cluster、到 Lane Cì 後先決定去唔去。", "Trading hours 10:00–22:00；出發當日再確認。"]
  },
  "lane-ci": {
    "title": "LANE Cì",
    "emoji": "🎀",
    "cat": "SHOP",
    "sub": "Day 2 · Trần Quang Diệu Fashion Cluster",
    "shoppingRoute": "Day 2 · Trần Quang Diệu",
    "hours": "10:00–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=LANE%20C%C3%AC%2027%20Tr%E1%BA%A7n%20Quang%20Di%E1%BB%87u%20Ph%C6%B0%E1%BB%9Dng%2014%20Qu%E1%BA%ADn%203%20H%E1%BB%93%20Ch%C3%AD%20Minh",
    "address": "27 Trần Quang Diệu, Phường 14, Quận 3, Hồ Chí Minh, Vietnam",
    "desc": "Lane Cì 是 Trần Quang Diệu cluster 裡較甜、較少女的一筆。放在同一段 browsing 裡就好；12:45 左右要開始收尾，留時間去 Pizza 4P’s。",
    "signature": [
      "少女甜美風格單品",
      "小型精品店感",
      "同街最後一站，順路收尾"
    ],
    "worth": [
      "店較細，適合快閃選購。",
      "出發前查 Facebook 專頁確認營業狀態。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Walk within Trần Quang Diệu cluster",
    "highlights": [
      "少女甜美風格單品",
      "小型精品店感",
      "同街最後一站，順路收尾"
    ],
    "tips": [
      "店較細，適合快閃選購。",
      "出發前查 Facebook 專頁確認營業狀態。"
    ]
  },
  "aastu": {
    "title": "AASTU", "emoji": "🖤", "cat": "SHOP",
    "sub": "Day 2 · Trần Quang Diệu Fashion Cluster", "shoppingRoute": "Day 2 · 11 Garmentory → Trần Quang Diệu",
    "hours": "09:30–21:30 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=AASTU%20118%2F12%20Tran%20Quang%20Dieu%20Ho%20Chi%20Minh",
    "address": "118/12 Trần Quang Diệu, Nhiêu Lộc, Hồ Chí Minh",
    "desc": "AASTU 以簡潔、俐落的 contemporary womenswear 為主，適合在 Trần Quang Diệu fashion cluster 一起慢慢逛。",
    "signature": ["Vietnamese streetwear / clean basics", "Trần Quang Diệu flagship", "Day 2 walking cluster must-see"],
    "worth": ["主看 AASTU；Dalla、RUBIES、Mì Workshop、Lane Cì 都係 nearby browse，唔需要逐間完成。"],
    "categoryLabel":"🛍 Shopping","price":"Varies","transport":"Walk within Day 2 fashion cluster",
    "highlights":["Vietnamese streetwear / clean basics","Trần Quang Diệu flagship"],"tips":["AASTU 優先，其餘按興趣。"]
  },
  "complex-0123": {
    "title": "0123 Complex",
    "emoji": "🏘",
    "cat": "SHOP",
    "sub": "Day 4 · Thảo Điền Creative Complex",
    "shoppingRoute": "Day 4 · Thảo Điền walk",
    "hours": "Complex 06:30–23:30 · individual tenants vary",
    "maps": "https://www.google.com/maps/search/?api=1&query=0123%20Complex%2006%20Dang%20Huu%20Pho%20Ho%20Chi%20Minh%20City",
    "address": "06 Đặng Hữu Phổ, An Khánh, Hồ Chí Minh, Vietnam",
    "desc": "2026 新開的 Thảo Điền creative / retail complex；independent fashion、lifestyle、café 與展覽活動集中，Day 4 比重複再逛 PUSH PUSH 更值得留時間。",
    "signature": [
      "Independent local fashion / lifestyle",
      "Creative compound + café",
      "2026 新場，適合慢慢 browse"
    ],
    "worth": [
      "放在 Thảo Điền Open List 主線；實際店舖與展覽按當日開放情況自由逛。",
      "PUSH PUSH 如 Day 2 已睇過，可直接把時間留給這裡。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab into Thảo Điền, then walk / short Grab within the neighbourhood",
    "highlights": [
      "Independent local fashion / lifestyle",
      "Creative compound + café",
      "2026 新場，適合慢慢 browse"
    ],
    "tips": [
      "Open-list stop：不用鎖死到店時間。",
      "到埗前看當日 tenant / exhibition listings。"
    ]
  },
  "push-push": {
    "title": "Push Push Official",
    "emoji": "👖",
    "cat": "SHOP",
    "sub": "Day 4 · Optional if missed on Day 2",
    "shoppingRoute": "Day 4 · Tân Định optional",
    "hours": "09:30–21:30",
    "maps": "https://www.google.com/maps/search/?api=1&query=Push%20Push%20Official%2020%20Nguy%E1%BB%85n%20V%C4%83n%20Nguy%E1%BB%85n%2C%20T%C3%A2n%20%C4%90%E1%BB%8Bnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam",
    "address": "20 Nguyễn Văn Nguyễn, Tân Định, Hồ Chí Minh 700000, Vietnam",
    "desc": "粉紅教堂一帶如果仍想行多一間本地 fashion，Push Push 可作順路 optional stop；年輕剪裁、寬鬆恤衫與街頭感單品適合快看一輪。",
    "signature": [
      "Streetwear / casual pants",
      "年輕感、寬鬆剪裁",
      "粉紅教堂附近可順路"
    ],
    "worth": [
      "不是每位朋友都會啱，可作分組自由逛。"
    ],
    "categoryLabel": "🛍 Shopping",
    "price": "Varies",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "Streetwear / casual pants",
      "年輕感、寬鬆剪裁",
      "粉紅教堂附近可順路"
    ],
    "tips": [
      "不是每位朋友都會啱，可作分組自由逛。"
    ]
  },
  "nha-suga": {
    "title": "Spa Nhà Suga Premium Korea Headspa – Nguyễn Huệ",
    "emoji": "🫧",
    "cat": "SPA",
    "sub": "Reference only · The Cafe Apartments",
    "status": "optional",
    "hours": "09:00–20:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Spa%20Nh%C3%A0%20Suga%20Premium%20Korea%20Headspa%20Nguyen%20Hue%2042%20Nguyen%20Hue%20Ho%20Chi%20Minh%20City",
    "address": "8th Floor, The Café Apartment, 42 Nguyễn Huệ, District 1, Ho Chi Minh City, Vietnam",
    "desc": "Reference-only head-spa entry inside The Cafe Apartments. It is no longer a planned or suggested Day 1 spa; Qspa is the canonical D1 recovery treatment.",
    "signature": [
      "Korean-style head spa / scalp care",
      "Shoulder / neck relaxation"
    ],
    "worth": [
      "Not planned on D1."
    ],
    "categoryLabel": "💆 Spa",
    "transport": "Inside The Cafe Apartments"
  },
  "moc-huong": {
    "title":"Mộc Hương Wellness · An Khánh","emoji":"🌿","cat":"SPA","sub":"越式 Wellness · 靜心放鬆",
    "hours":"09:00–22:00 · verify directly","address":"03 Đặng Hữu Phổ, An Khánh, Hồ Chí Minh, Vietnam",
    "maps":"https://www.google.com/maps/search/?api=1&query=Moc%20Huong%20Wellness%2003%20Dang%20Huu%20Pho%20An%20Khanh",
    "desc":"位於 Thảo Điền／An Khánh 一帶的 Wellness SPA，適合 Shopping 後安排一段放慢節奏的休息時間。這張 Guide 介紹體驗重點；預約狀態、聯絡方式及人數請看 Booking Card。",
    "signature":["Massage / body relaxation · 按實際 Menu 選擇","購物後的休息站","可先詢問按摩力度及偏好部位"],
    "worth":["療程前可先向店員講清楚想偏重肩頸、背部或腳部，以及希望力度輕、中或重。","如果對香薰、精油或按摩產品敏感，開始前先告知店員。","療程後預留少少時間飲水、整理，再慢慢行去附近 0123 Complex。"],
    "categoryLabel":"💆 Spa","price":"Check treatment menu","transport":"An Khánh · near 0123 Complex",
    "highlights":["放鬆身心","按喜好選擇按摩重點","SPA 後可步行繼續行程"],
    "tips":["留意療程種類、包含項目及是否設有額外收費。","如果想同朋友同時完成，可在開始前確認各人療程時長一致。","環境及服務項目以分店當日提供為準。"]
  },
  "ha-spa": {
    "title": "Hạ Spa",
    "emoji": "💆‍♀️",
    "cat": "SPA",
    "sub": "機場附近 · Massage + Hair Care",
    "hours": "08:30–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=H%E1%BA%A1%20Spa%20334%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ward%202%2C%20T%C3%A2n%20B%C3%ACnh%20District%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam",
    "address": "334 Nguyễn Trọng Tuyển, Ward 2, Tân Bình District, Hồ Chí Minh 700000, Vietnam",
    "desc": "靠近機場，適合夜機前做最後一次 massage／hair care，不需要做完再返回市中心。若可寄存行李，最後一日會特別方便。",
    "signature": ["Massage", "洗頭／hair care", "旅客行李寄存"],
    "worth": ["預約時確認四人能否同時做 treatment，以及可否寄存全部行李。", "完成後預留足夠時間應付往機場交通及 check-in。"],
    "categoryLabel": "💆 Spa",
    "price": "$$",
    "transport": "Grab / walk depending on current route",
    "highlights": ["Airport-side location", "Massage and hair-care", "Traveller-friendly luggage storage"],
    "tips": ["Confirm luggage storage and four-person capacity.", "Leave a conservative airport buffer afterwards."]
  },
  "post-office": {
    "title": "Saigon Central Post Office",
    "emoji": "📮",
    "cat": "ATTRACTIONS",
    "sub": "法式郵局",
    "hours": "Mon–Fri 07:00–19:00；Sat 07:00–18:00；Sun 08:00–18:00",
    "maps": "https://www.google.com/maps/search/?api=1&query=Saigon%20Central%20Post%20Office%20Saigon%20Central%20Post%20Office%2C%202%20C%C3%B4ng%20x%C3%A3%20Paris%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City",
    "address": "Saigon Central Post Office, 2 Công xã Paris, Bến Nghé, District 1, Ho Chi Minh City",
    "desc": "西貢中央郵政局是最容易安排、最有法式殖民建築感的經典景點。金黃色拱頂、古老地圖、木製電話亭都很上鏡，而且仍然是運作中的郵局。Day 1 放在抵達後不會太累，因為它和紅教堂、書街三點幾乎連在一起。",
    "signature": [
      "金黃色拱頂大廳",
      "法式殖民建築",
      "可買明信片／郵票"
    ],
    "worth": [
      "免費入場，停留 20–30 分鐘已夠。",
      "人多時先拍建築細節，不一定要等無人全景。"
    ],
    "categoryLabel": "📍 Attraction",
    "price": "Free",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "金黃色拱頂大廳",
      "法式殖民建築",
      "可買明信片／郵票"
    ],
    "tips": [
      "免費入場，停留 20–30 分鐘已夠。",
      "人多時先拍建築細節，不一定要等無人全景。"
    ]
  },
  "notre-dame": {
    "title": "Notre-Dame Cathedral",
    "emoji": "⛪",
    "cat": "ATTRACTIONS",
    "sub": "紅磚教堂",
    "maps": "https://www.google.com/maps/search/?api=1&query=Notre-Dame%20Cathedral%20Notre-Dame%20Cathedral%20Basilica%20of%20Saigon%2C%20C%C3%B4ng%20x%C3%A3%20Paris%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City",
    "address": "Notre-Dame Cathedral Basilica of Saigon, Công xã Paris, Bến Nghé, District 1, Ho Chi Minh City",
    "desc": "西貢聖母聖殿主教座堂是中央郵政局對面的紅磚地標。近年常有修復工程，重點應放在外觀打卡與和郵政局／書街形成一個短小經典路線，不建議專程安排太長時間。",
    "signature": [
      "紅磚外觀",
      "郵政局對面",
      "經典 D1 地標合照"
    ],
    "worth": [
      "內部是否開放常受工程／宗教活動影響，當作外觀景點最穩。",
      "中午光線硬，早上或傍晚拍照較舒服。"
    ],
    "categoryLabel": "📍 Attraction",
    "price": "Free",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "紅磚外觀",
      "郵政局對面",
      "經典 D1 地標合照"
    ],
    "tips": [
      "內部是否開放常受工程／宗教活動影響，當作外觀景點最穩。",
      "中午光線硬，早上或傍晚拍照較舒服。"
    ]
  },
  "book-street": {
    "title": "Nguyễn Văn Bình Book Street",
    "copyAddressEligible": false,
    "emoji": "📚",
    "cat": "ATTRACTIONS",
    "sub": "書街散步",
    "hours": "Mon–Fri 08:00–21:00；Sat–Sun 08:00–21:30",
    "maps": "https://www.google.com/maps/search/?api=1&query=Nguy%E1%BB%85n%20V%C4%83n%20B%C3%ACnh%20Book%20Street%20Nguy%E1%BB%85n%20V%C4%83n%20B%C3%ACnh%20Book%20Street%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City",
    "address": "Nguyễn Văn Bình Book Street, Bến Nghé, District 1, Ho Chi Minh City",
    "desc": "Nguyễn Văn Bình Book Street 夾在郵政局與紅教堂旁邊，是短短一條步行文化街。書店、咖啡、文創攤位集中，適合在 Day 1 三大景點中作一個較輕鬆的過渡位。",
    "signature": [
      "步行書街",
      "書店、文創、咖啡小攤",
      "與郵政局／紅教堂相連"
    ],
    "worth": [
      "不是大型景點，停留 20–40 分鐘即可。",
      "若太熱，可以只穿過拍照，不必硬逛每間店。"
    ],
    "categoryLabel": "📍 Attraction",
    "price": "Free",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "步行書街",
      "書店、文創、咖啡小攤",
      "與郵政局／紅教堂相連"
    ],
    "tips": [
      "不是大型景點，停留 20–40 分鐘即可。",
      "若太熱，可以只穿過拍照，不必硬逛每間店。"
    ]
  },
  "pink-church": {
    "title": "Tân Định Church",
    "emoji": "🌸",
    "cat": "ATTRACTIONS",
    "sub": "粉紅教堂",
    "maps": "https://www.google.com/maps/search/?api=1&query=T%C3%A2n%20%C4%90%E1%BB%8Bnh%20Church%20Tan%20Dinh%20Church%2C%20289%20Hai%20B%C3%A0%20Tr%C6%B0ng%2C%20Ward%208%2C%20District%203%2C%20Ho%20Chi%20Minh%20City",
    "address": "Tan Dinh Church, 289 Hai Bà Trưng, Ward 8, District 3, Ho Chi Minh City",
    "desc": "新定教堂／粉紅教堂是 Saigon 最容易出片的地標之一。粉紅色外牆本身已經很有記憶點，配對面 Cộng Cà Phê 的樓上視角，可以一次拍到近景和俯瞰全景。",
    "signature": [
      "粉紅外牆",
      "對面 cafe 視角",
      "Tân Định 街區順路早餐"
    ],
    "worth": [
      "內部開放不穩，當作外觀打卡最實際。",
      "早上光線和人流通常較友善。"
    ],
    "categoryLabel": "📍 Attraction",
    "price": "Free",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "粉紅外牆",
      "對面 cafe 視角",
      "Tân Định 街區順路早餐"
    ],
    "tips": [
      "內部開放不穩，當作外觀打卡最實際。",
      "早上光線和人流通常較友善。"
    ]
  },
  "war-museum": {
    "title": "War Remnants Museum",
    "emoji": "🏛",
    "cat": "ATTRACTIONS",
    "sub": "Day 3 · War Day",
    "hours": "07:30–17:30",
    "maps": "https://www.google.com/maps/search/?api=1&query=War%20Remnants%20Museum%20War%20Remnants%20Museum%2C%2028%20V%C3%B5%20V%C4%83n%20T%E1%BA%A7n%2C%20District%203%2C%20Ho%20Chi%20Minh%20City",
    "address": "War Remnants Museum, 28 Võ Văn Tần, District 3, Ho Chi Minh City",
    "desc": "上午在 Cu Chi 看戰爭如何藏進地下，下午回城看它留下來的影像與物件。War Remnants Museum 放在同一天，目的不是多打一個景點，而是讓 War Day 有完整的前後文。",
    "signature": [
      "越戰相關照片與史料",
      "館內展覽以照片、文件與戰爭遺物為主",
      "Cu Chi 後接著看，War Day 前後文完整"
    ],
    "worth": [
      "15:40–17:00 是主參觀時段；Mặn Mòi 早完就把時間留給 museum。",
      "看完直接去 Qspa 做 120 分鐘 War Day Recovery；如果當日只想專注洗頭／hair spa，Nara 才是 optional alternative。"
    ],
    "categoryLabel": "📍 Attraction",
    "price": "40,000 VND / adult",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "越戰相關照片與史料",
      "館內展覽以照片、文件與戰爭遺物為主",
      "Cu Chi 後接著看，War Day 前後文完整"
    ],
    "tips": [
      "15:40–17:00 是主參觀時段；Mặn Mòi 早完就把時間留給 museum。"
    ]
  },
  "fine-arts": {
    "title": "Fine Arts Museum",
    "emoji": "🖼",
    "cat": "ATTRACTIONS",
    "sub": "黃色法式美術館",
    "hours": "08:00–17:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Fine%20Arts%20Museum%20Ho%20Chi%20Minh%20City%20Museum%20of%20Fine%20Arts%2C%2097A%20Ph%C3%B3%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20District%201%2C%20Ho%20Chi%20Minh%20City",
    "address": "Ho Chi Minh City Museum of Fine Arts, 97A Phó Đức Chính, District 1, Ho Chi Minh City",
    "desc": "胡志明市美術館是一座黃色法式大宅，比起展品本身，建築、樓梯、彩色玻璃、舊式地磚和復古感更容易令人留下印象。Day 5 上午安排它很適合：節奏慢、拍照靚、又不會太消耗體力。",
    "signature": [
      "黃色法式建築",
      "彩色玻璃、樓梯、復古地磚",
      "適合王家衛感照片"
    ],
    "worth": [
      "館內部分位置沒有強冷氣，早上去較舒服。",
      "建議停留 60–90 分鐘。"
    ],
    "categoryLabel": "📍 Attraction",
    "price": "40,000 VND / adult",
    "transport": "Grab / walk depending on current route",
    "highlights": [
      "黃色法式建築",
      "彩色玻璃、樓梯、復古地磚",
      "適合王家衛感照片"
    ],
    "tips": [
      "館內部分位置沒有強冷氣，早上去較舒服。",
      "建議停留 60–90 分鐘。"
    ]
  },
  "general": {
    "title": "Moments",
    "emoji": "✨",
    "cat": "MOMENTS",
    "sub": "Every place has a story",
    "desc": "每一個地方都可以留底 rating、something to say 同相片。",
    "categoryLabel": "✨ Moments",
    "price": "Memory",
    "hours": "Anytime",
    "maps": "#",
    "address": "Saigon Companion"
  },
  "workshop-coffee": {
    "title": "The Workshop Coffee",
    "emoji": "☕",
    "cat": "CAFÉS",
    "sub": "Day 1 · Nguyễn Huệ 附近咖啡選項",
    "hours": "08:00–21:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=The%20Workshop%20Coffee%202nd%20Floor%2C%2027%20Ng%C3%B4%20%C4%90%E1%BB%A9c%20K%E1%BA%BF%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
    "address": "2nd Floor, 27 Ngô Đức Kế, District 1, Ho Chi Minh City, Vietnam",
    "desc": "藏在 Ngô Đức Kế 老樓上層的 specialty coffee 空間，離 Nguyễn Huệ Walking Street 與 The Cafe Apartments 只是一小段步程。高樓底、長木枱與工業感不刻意討好鏡頭，反而適合在第一日的城市喧鬧之間，留一段安靜喝咖啡的空白。",
    "signature": [
      "以手沖、espresso 與 specialty coffee 為主",
      "樓上空間寬敞，適合短坐或慢慢聊天",
      "由 Café Apartments 一帶步行前往，毋須另開一段行程"
    ],
    "worth": [
      "這是 read-only nearby option，不會取代原定 Day 1 行程。",
      "入口較低調，跟 Google Maps 到 27 Ngô Đức Kế 後再留意上樓指示。"
    ],
    "categoryLabel": "☕ Cafe · Optional",
    "price": "$–$$",
    "transport": "Walk from Nguyễn Huệ / Cafe Apartments",
    "highlights": [
      "以手沖、espresso 與 specialty coffee 為主",
      "樓上空間寬敞，適合短坐或慢慢聊天",
      "由 Café Apartments 一帶步行前往，毋須另開一段行程"
    ],
    "tips": [
      "這是 read-only nearby option，不會取代原定 Day 1 行程。",
      "入口較低調，跟 Google Maps 到 27 Ngô Đức Kế 後再留意上樓指示。"
    ]
  },
  "cash-backup": {
    "title": "Cash / Currency Backup",
    "emoji": "💵",
    "cat": "PRACTICAL",
    "sub": "Reference only · not Guide inventory",
    "maps": "",
    "address": "",
    "desc": "Day 1 currency choices are shown directly on the Timeline; this record is retained only for engine compatibility and is not exposed as Guide inventory.",
    "signature": [],
    "worth": [],
    "categoryLabel": "Practical",
    "transport": "",
    "highlights": [],
    "tips": []
  },
  "late-night-supper": {
    "title": "Late-night Hotel Supper",
    "emoji": "🌙",
    "cat": "RESTAURANTS",
    "sub": "Any night · Savoury or sweet delivery",
    "status": "optional",
    "hours": "Oanh Cua about 06:00–22:00; late dessert availability varies — check GrabFood Open Now",
    "maps": "https://www.google.com/maps/search/?api=1&query=Oanh%20Cua%20214%2F1B%20Nguy%E1%BB%85n%20Tr%C3%A3i%20Ho%20Chi%20Minh%20City",
    "address": "Delivery to Fusion Original; Oanh Cua: 214/1B Nguyễn Trãi, District 1",
    "desc": "返到酒店仲想食多少少，可以按心情揀鹹或甜。鹹食可叫 Oanh Cua 蟹料理送到 Fusion Original lobby；甜食可在 GrabFood 搜尋 BINGO Artisanal Ice Dessert & Tofu Café，或用 Dessert／Chè／Tofu／Bingsu 關鍵字並篩選 Open Now。",
    "signature": [
      "🦀 Oanh Cua：蟹料理、蟹肉小食，適合四人 share",
      "🍧 BINGO／夜間甜品：刨冰、豆腐花、水果甜品",
      "送到 Fusion Original lobby，落單後留意電話／App 訊息"
    ],
    "worth": [
      "Oanh Cua 官方 delivery / hotline：0876 255 559；亦可當晚檢查 GrabFood。",
      "BINGO 是否可送及營業狀態以當晚 GrabFood 顯示為準，不寫死一定可落單。",
      "Day 1–4 都可用；完全 optional，不需要 Booking。"
    ],
    "categoryLabel": "🌙 Optional Supper",
    "price": "$–$$",
    "transport": "Delivery to hotel / Grab if dining in",
    "highlights": [
      "🦀 Oanh Cua：蟹料理、蟹肉小食，適合四人 share",
      "🍧 BINGO／夜間甜品：刨冰、豆腐花、水果甜品",
      "送到 Fusion Original lobby，落單後留意電話／App 訊息"
    ],
    "tips": [
      "Oanh Cua 官方 delivery / hotline：0876 255 559；亦可當晚檢查 GrabFood。",
      "BINGO 是否可送及營業狀態以當晚 GrabFood 顯示為準，不寫死一定可落單。",
      "Day 1–4 都可用；完全 optional，不需要 Booking。"
    ]
  },
  "man-moi": {
    "title": "Mặn Mòi · Tao Đàn",
    "emoji": "🍲",
    "cat": "RESTAURANTS",
    "sub": "越南家常菜 · Sharing style",
    "status": "optional",
    "hours": "10:00–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=M%E1%BA%B7n%20M%C3%B2i%20Tao%20%C4%90%C3%A0n%2034%20V%C3%B5%20V%C4%83n%20T%E1%BA%A7n%20Ho%20Chi%20Minh%20City",
    "address": "34 Võ Văn Tần, Xuân Hòa, Ho Chi Minh City, Vietnam",
    "desc": "Mặn Mòi 主打越南家常菜，環境帶綠意和舊西貢氣氛。四人最適合 family-style sharing：煲仔、湯、燒烤和白飯一齊叫，比每人各自一個 main 更能試到不同味道。",
    "signature": [
      "Pork jowl｜近期食客點名好食",
      "Sticky rice chicken｜適合四人分食",
      "家常 claypot / soup｜Mặn Mòi 最有代表性的越南家常路線"
    ],
    "worth": ["四人以 sharing 方式點菜最合適。", "Tao Đàn 分店在 Võ Văn Tần，附近就是 District 3 多個中央景點。"],
    "categoryLabel": "🍽 Restaurant",
    "price": "$$",
    "transport": "Private-tour drop → short walk to War Remnants Museum",
    "highlights": [
      "南部家常菜，味道細緻而不過重",
      "木質與綠意交疊的老西貢氛圍",
      "多人分享最有感覺"
    ],
    "tips": ["Order family-style for four and share across the table.", "Claypots, soup and grilled dishes give a good spread of home-style flavours."]
  },
  "tan-son-nhat-airport": {
    "title": "Tan Son Nhat International Airport",
    "emoji": "✈️",
    "cat": "SIGHTS",
    "sub": "Airport",
    "maps": "https://www.google.com/maps/search/?api=1&query=Tan%20Son%20Nhat%20International%20Airport%20Terminal%202%20Ho%20Chi%20Minh%20City",
    "address": "Tan Son Nhat International Airport, International Terminal T2, Ho Chi Minh City, Vietnam",
    "desc": "VN 行程抵達及離境使用的新山一機場。"
  },
  "concept-111": {
    "title":"111 Concept Store","emoji":"🧩","cat":"SHOP","sub":"Day 1 · Optional after Nguyễn Trãi","shoppingRoute":"Day 1 after Nguyễn Trãi if time",
    "hours":"10:00–20:30/21:00 · check same day","maps":"https://www.google.com/maps/search/?api=1&query=111%20Concept%20Store%20111%20Ton%20That%20Dam%20Ho%20Chi%20Minh",
    "address":"111 Tôn Thất Đạm, District 1, Hồ Chí Minh",
    "desc":"三層 Vietnamese design goods + curated vintage；Day 1 行完 Nguyễn Trãi 有時間就去；如果錯過，之後旅程自由時間再決定是否補返。",
    "signature":["Vietnamese design goods","Curated vintage","3-floor concept store"],"worth":["Day 1 有時間先去；唔夠時間就 skip，唔需要趕 Qspa。"],
    "categoryLabel":"🛍 Shopping","price":"Varies","transport":"Walk within Old Market cluster","highlights":["Local design","Vintage"],"tips":["預留約 25–30 min。"]
  },
  "waa-studios": {
    "title":"waa. studios","emoji":"👜","cat":"SHOP","sub":"Optional · Old Market accessories",
    "hours":"09:30–21:30 daily","maps":"https://www.google.com/maps/search/?api=1&query=waa%20studios%2038%20Dang%20Thi%20Nhu%20Ho%20Chi%20Minh",
    "address":"38 Đặng Thị Nhu, District 1, Hồ Chí Minh",
    "desc":"Vietnamese accessories / leather goods，主打 bags、sandals 與簡潔皮具。保留在 Guide 供自由時間搜尋，但 Day 5 不再設固定 shopping route。",
    "signature":["Bags / sandals / belts","Vietnamese accessories","Quiet local boutique"],"worth":["自由時間想補 accessories 才去；不再是 Day 5 mandatory stop。"],
    "categoryLabel":"🛍 Shopping","price":"Varies","transport":"Walk within Old Market cluster","highlights":["Accessories","Leather goods"],"tips":["預留約 20 min。"]
  },
  "takashimaya": {
    "title": "Takashimaya Saigon",
    "emoji": "🛍",
    "cat": "SHOP",
    "sub": "Optional · Saigon Centre shopping",
    "hours": "Check same day",
    "maps": "https://maps.google.com/?q=Takashimaya+Saigon",
    "address": "Saigon Centre, 65 Lê Lợi, District 1, Ho Chi Minh City",
    "desc": "就在 Fusion Original 同一棟 Saigon Centre 內。需要補手信、beauty、零食或漏買用品時最方便，但 Day 5 不再設固定 shopping route。",
    "signature": [
      "同 Fusion Original 同一棟，最後一日最省腳力",
      "百貨、beauty、食品與手信集中",
      "適合把未買齊的東西一次收尾"
    ],
    "worth": [
      "最後一日以補貨為主，不需要為購物特別繞路。"
    ]
  },
  "qspa": {
    "title": "Qspa · Retreat & Beauty Care Center",
    "emoji": "🌿",
    "cat": "SPA",
    "sub": "Massage · Beauty · Hair Care",
    "status": "planned",
    "maps": "https://www.google.com/maps/search/?api=1&query=Qspa%2025%2F1%20Truong%20Dinh%20Ho%20Chi%20Minh%20City",
    "address": "25/1 Trương Định, Xuân Hòa, Hồ Chí Minh City",
    "phone": "028 3535 9727",
    "website": "https://qspa.com.vn/",
    "source": {"type":"official","url":"https://qspa.com.vn/wp-content/uploads/2025/04/Menu-Truong-Dinh.pdf","verifiedAt":"2026-09-18"},
    "facebookUrl": "https://www.facebook.com/QspaCenter/",
    "messengerUrl": "https://m.me/QspaCenter",
    "instagramUrl": "https://www.instagram.com/qspacenter/",
    "desc": "全方位 spa，可按當日每個人的狀態自由揀 massage、body treatment、facial／beauty 或 hair care，不需要四個人做同一個 package。",
    "signature": ["Massage／body treatments", "Facial／beauty options", "Hair care／洗頭"],
    "worth": [],
    "categoryLabel": "💆 Spa",
    "transport": "Grab according to the day route",
    "alternativeGuides": [
      {
        "day": "D2",
        "placeId": "norah-spa-2",
        "label": "Norah Spa 2",
        "note": "Route-friendly alternative"
      },
      {
        "day": "D3",
        "placeId": "nara-spa",
        "label": "Nara Spa",
        "note": "Hair / hair-spa alternative"
      }
    ]
  },
  "norah-spa-2": {
    "title": "Norah Spa 2",
    "emoji": "🌿",
    "cat": "SPA",
    "sub": "OPTIONAL · D2 順路 alternative",
    "status": "optional",
    "hours": "09:30–23:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Norah%20Spa%202%2074C%20Hai%20Ba%20Trung%20Ho%20Chi%20Minh%20City",
    "address": "74C Hai Bà Trưng, Sài Gòn, Ho Chi Minh City, Vietnam",
    "phone": "+84 70 544 0248",
    "desc": "如果 D2 想留在 Central D1 walking route 附近、不想特別返回 Qspa，Norah Spa 2 可作順路 alternative；它不是另一個必做 booking。",
    "signature": [
      "Foot Therapy · 60 / 90 min",
      "Foot + Head + Neck + Shoulders",
      "Full-body / hair-spa / 120-min packages"
    ],
    "worth": ["OPTIONAL · 最適合 D2 臨時改 route。", "只有當順路比原定 Qspa 更重要時才選。"],
    "categoryLabel": "💆 Spa",
    "transport": "Route-friendly alternative near the Central D1 walking route"
  },
  "moc-healing": {
    "title": "Mộc Healing Spa",
    "emoji": "🦶",
    "cat": "SPA",
    "sub": "Day 2 · Bến Thành Foot Reset",
    "status": "planned",
    "hours": "11:00–23:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Moc%20Healing%20Spa%2039%2041%20Thu%20Khoa%20Huan%20Ben%20Thanh%20Ho%20Chi%20Minh",
    "address": "39–41 Thủ Khoa Huân, Bến Thành, Ho Chi Minh City, Vietnam",
    "desc": "Pizza 4P’s 食完沿 Thủ Khoa Huân 行過來，不為按摩多叫一程車。這站放在下午 shopping 前，先把腳鬆開，再一路步行接 Bến Thành / Nguyễn Trãi 一帶的 local fashion。",
    "signature": [
      "Foot massage / body massage",
      "與 Pizza 4P’s Bến Thành 同一條街",
      "Spa 後直接開始步行 shopping corridor"
    ],
    "worth": [
      "約 14:20 入場，目標 60 分鐘。",
      "Hotline / Zalo：+84 28 3535 4436。"
    ],
    "categoryLabel": "💆 Spa",
    "transport": "Walk from Pizza 4P’s Bến Thành",
    "highlights": [
      "Foot massage / body massage",
      "與 Pizza 4P’s Bến Thành 同一條街",
      "Spa 後直接開始步行 shopping corridor"
    ],
    "tips": [
      "預約時確認 60 分鐘 foot-focused treatment。",
      "做完不用叫 Grab，直接開始下午 shopping。"
    ]
  },
  "cu-chi": {
    "title": "Cu Chi Tunnels",
    "emoji": "🪖",
    "cat": "ATTRACTIONS",
    "sub": "古芝地道 · 地下戰時生活與防禦網絡",
    "status": "planned",
    "hours": "07:00–17:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Cu%20Chi%20Tunnels%20Ho%20Chi%20Minh%20City",
    "address": "Củ Chi District, Ho Chi Minh City, Vietnam",
    "desc": "古芝地道位於胡志明市西北面。早期地道可追溯至反法殖民時期，其後在越戰期間大幅擴展，用作移動、藏身、通訊及地下生活。親身到現場最值得看的，不只是「一條隧道」，而是整套如何在地下生活及維持運作的系統。",
    "signature": ["留意隱蔽入口、通風孔，以及不同深度地道如何連接", "地下曾設生活區、會議空間、廚房及醫療空間", "遊客可進入的部分可能經過擴闊或調整；原本地道更加狹窄"],
    "worth": ["地道內會熱、暗而且狹窄；crawl section 可按自己舒適程度決定是否進入。", "留意 camouflage、ventilation 和排煙設計如何減低地面被發現的機會。", "之後去 War Remnants Museum，可再由博物館角度理解同一段戰爭歷史。"],
    "categoryLabel": "🏛 Attraction",
    "transport": "Private tour transfer",
    "highlights": ["Concealed entrances and multi-level tunnel structure", "Living, meeting, kitchen and medical spaces underground", "Camouflage, ventilation and smoke-dispersal design"],
    "tips": ["Entering the crawl sections is optional if confined spaces are uncomfortable.", "Visitor sections may be widened or adapted compared with original wartime tunnels."]
  },
  "nara-spa": {
    "title": "Nara Spa",
    "emoji": "🫧",
    "cat": "SPA",
    "sub": "OPTIONAL · D3 洗頭／Hair Spa alternative",
    "status": "optional",
    "maps": "https://www.google.com/maps/search/?api=1&query=Nara%20Spa%20595%2F74%20Nguyen%20Dinh%20Chieu%20Ho%20Chi%20Minh%20City",
    "address": "595/74 Nguyễn Đình Chiểu, Bàn Cờ, District 3, Ho Chi Minh City",
    "desc": "如果 Cu Chi 回來後最想做的是洗頭、hair spa 或專門 hair reset，Nara 可作 D3 alternative；原定 recovery 仍然是 Qspa。",
    "signature": [
      "Massage + Hair Wash / Hair Spa",
      "Dedicated post-Cu-Chi hair-reset option"
    ],
    "worth": ["OPTIONAL · 最適合 D3。", "只有當洗頭／hair spa 變成當日優先項目時才轉過來；不需要另當成必做 booking。"],
    "categoryLabel": "💆 Spa",
    "transport": "Optional short Grab from War Remnants Museum"
  },
  "maruco": {
    "title": "Izakaya Maruco",
    "emoji": "🔥",
    "cat": "RESTAURANTS",
    "sub": "Day 3 · Japanese Izakaya · 19:30 confirmed",
    "status": "confirmed",
    "hours": "17:00–24:00 · confirm same day if hours change",
    "maps": "https://www.google.com/maps/search/?api=1&query=46%20M%C3%AA%20Linh%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20Ho%20Chi%20Minh%20City",
    "address": "46 Mê Linh, Phường 19, Bình Thạnh, Ho Chi Minh City",
    "phone": "034 992 1802",
    "instagramUrl": "https://www.instagram.com/maruco0930_vn/",
    "desc": "日式居酒屋，以稻草燒、炙燒及各式燒物為特色；煙燻香氣濃郁，適合四人點幾款料理分享。可留意牛舌、刺身及當日烤物，實際供應以店內餐牌為準。",
    "signature": [
      "稻草燒牛舌",
      "Japanese izakaya grilled dishes",
      "Sashimi / sharing plates"
    ],
    "worth": [
      "PRIMARY · Day 3 dinner，19:30 已經經 Instagram confirmed。",
      "Qspa 18:30 完成後直接 Grab 過去，預留交通 buffer。",
      "唔飲酒都適合，以牛舌、燒物同 share plates 為主。"
    ],
    "categoryLabel": "🍽 Restaurant",
    "price": "$$",
    "transport": "Grab from Qspa",
    "highlights": ["稻草燒牛舌", "Japanese izakaya atmosphere"],
    "tips": ["19:30 booking confirmed via Instagram.", "Dinner 後直接 Grab 返回 Fusion。"]
  },
  "oc-dao": {
    "title": "Ốc Đào · Nguyễn Trãi",
    "emoji": "🦀",
    "cat": "RESTAURANTS",
    "sub": "OPTIONAL · Vietnamese ốc · Local seafood",
    "status": "planned",
    "hours": "11:00–22:15 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=%E1%BB%90c%20%C4%90%C3%A0o%20212B%2FD48%20Nguy%E1%BB%85n%20Tr%C3%A3i%20Ho%20Chi%20Minh%20City",
    "address": "212B/D48 Nguyễn Trãi, District 1, Ho Chi Minh City, Vietnam",
    "desc": "地道越南 ốc 海鮮店，主打螺、蜆、貝類及各式海鮮，配香茅、蒜、辣椒、羅望子等越式醬汁。環境偏熱鬧 casual，適合四人分享幾款不同煮法。",
    "signature": [
      "各式 ốc／貝類／海鮮",
      "越式醬汁 + beer，四人 share 最有氣氛"
    ],
    "worth": [
      "19:15–19:30 到即可；今晚不再塞任何 after-dinner activity。",
      "店內節奏 casual，重點是 ốc + beer，不要換成 polished seafood dinner。"
    ],
    "categoryLabel": "🍽 Restaurant",
    "price": "$",
    "transport": "Grab from Qspa",
    "highlights": [
      "各式 ốc／貝類／海鮮",
      "越式醬汁 + beer"
    ],
    "tips": [
      "Dinner 後直接返 Fusion。"
    ]
  },
  "mojo-spa": {
    "title": "Mojo Spa & Foot Massage",
    "emoji": "🦶",
    "cat": "SPA",
    "sub": "Day 4 Open List · Easy walk-in reset",
    "hours": "11:00–22:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Mojo%20Spa%20%26%20Foot%20Massage%202%20Le%20Van%20Mien%20Thao%20Dien%20Ho%20Chi%20Minh",
    "address": "2 Lê Văn Miến, Thảo Điền, Ho Chi Minh City, Vietnam",
    "desc": "最適合行街途中突然想停一停的一間。主打 foot massage，位置在 Thảo Điền 核心區，不需要為 Spa 特登離開 Open List 動線。",
    "signature": ["Foot massage", "短休息容易插入", "核心區 walk-in fallback"],
    "worth": ["行攰先去，不用預先把下午切成一節。", "四人未必即時同時有位；到附近才問最符合 Open Day 玩法。"],
    "categoryLabel": "🦶 Spa",
    "price": "$–$$",
    "transport": "Walk-in option · 2 Lê Văn Miến"
  },
  "thao-dien-spa": {
    "title": "Thao Dien Spa",
    "emoji": "💆",
    "cat": "SPA",
    "sub": "Day 4 Open List · Massage fallback",
    "hours": "09:00–21:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Thao%20Dien%20Spa%2047%2F1%2F13%20Quoc%20Huong%20Ho%20Chi%20Minh",
    "address": "47/1/13 Quốc Hương, Thảo Điền, Ho Chi Minh City, Vietnam",
    "desc": "傳統 massage fallback。比 Mộc Hương 更像『附近有位就入』的選擇；適合 Open List 行到 Quốc Hương 一帶時再決定。",
    "signature": ["Body massage", "Established local spa", "Quốc Hương fallback"],
    "worth": ["不需要為它改整日路線。", "如果四人想同時做，去到附近先問當刻 capacity。"],
    "categoryLabel": "💆 Spa",
    "price": "$–$$",
    "transport": "Walk-in option · 47/1/13 Quốc Hương"
  },
  "golden-lotus-thao-dien": {
    "title": "Golden Lotus Healing World",
    "emoji": "♨️",
    "cat": "SPA",
    "sub": "Day 4 Open List · Big-capacity backup",
    "hours": "09:00–00:00 daily",
    "maps": "https://www.google.com/maps/search/?api=1&query=Golden%20Lotus%20Healing%20World%2016A%20Street%2010%20Thao%20Dien%20Ho%20Chi%20Minh",
    "address": "16A Street No. 10, Thảo Điền, Ho Chi Minh City, Vietnam",
    "desc": "大型 Korean-style healing complex，massage 之外亦有 sauna、bathhouse、jjimjilbang。唔係 boutique spa 氣氛，但勝在規模大、開得夜，適合其他細 Spa 無四人位時做 backup。",
    "signature": ["Massage", "Sauna / bathhouse", "Jjimjilbang · large complex"],
    "worth": ["四人臨時想一起休息時，規模較大的實用後備。", "開到午夜，唔需要為它鎖死下午時間。"],
    "categoryLabel": "♨️ Spa",
    "price": "$$",
    "transport": "Walk-in backup · 16A Street No. 10"
}
};

const CATEGORIES={
  "PRACTICAL": [{"key":"currency-guide"}],
  "STAY": [
    {
      "key": "fusion"
    }
  ],
  "CAFÉS": [
    {
      "key": "cong"
    },
    {
      "key": "marou"
    },
    {
      "key": "cafe-apartments"
    },
    {
      "key": "running-bean"
    },
  ],
  "RESTAURANTS": [
    {"key":"quince"},
    {
      "key": "bep-me-in"
    },
    {
      "key": "com-tam-moc"
    },
    {
      "key": "lune"
    },
    {
      "key": "omakase-tiger"
    },
    {
      "key": "pho-sol"
    },
    {
      "key": "pizza4ps"
    },
    {
      "key": "late-night-supper"
    },
    {
      "key": "man-moi"
    },
    {
      "key": "quan-thuy"
    },
    {
      "key": "maruco"
    },
    {
      "key": "oc-dao"
    }
  ],
  "SHOP": [
    {
      "key": "ohquao"
    },
    {
      "key": "new-playground"
    },
    {
      "key": "rue-miche-ledition"
    },
    {
      "key": "mozaic-space"
    },
    {
      "key": "takashimaya"
    }
  ],
  "SPA": [
    {
      "key": "qspa"
    },
    {
      "key": "ha-spa"
    },
    {
      "key": "moc-huong"
    },
    {
      "key": "norah-spa-2"
    },
    {
      "key": "nara-spa"
    }
],
  "ATTRACTIONS": [
    {
      "key": "fine-arts"
    },
    {
      "key": "book-street"
    },
    {
      "key": "notre-dame"
    },
    {
      "key": "post-office"
    },
    {
      "key": "pink-church"
    },
    {
      "key": "war-museum"
    },
    {
      "key": "cu-chi"
    }
  ]
};

const GUIDE_ORDER=[
  "quince",
  "currency-guide",
  "fusion",
  "cong",
  "marou",
  "cafe-apartments",
  "running-bean",
  "bep-me-in",
  "late-night-supper",
  "com-tam-moc",
  "lune",
  "man-moi",
  "quan-thuy",
  "omakase-tiger",
  "pho-sol",
  "pizza4ps",
  "ohquao",
  "new-playground",
  "rue-miche-ledition",
  "mozaic-space",
  "takashimaya",
  "qspa",
  "ha-spa",
  "moc-huong",
  "fine-arts",
  "book-street",
  "notre-dame",
  "post-office",
  "pink-church",
  "war-museum",
  "norah-spa-2",
  "cu-chi",
  "nara-spa",
  "maruco",
  "oc-dao"
];

const DAY_LINKS={
  "quince": [["Day 4","day.html?day=4#quince-d4"]],
  "fusion": [
    [
      "Day 1",
      "day.html?day=1#day1-hotel-reset"
    ]
  ],
  "pho-sol": [
    [
      "Day 1",
      "day.html?day=1#pho-sol"
    ]
  ],
  "post-office": [
    [
      "Day 2",
      "day.html?day=2#post-office"
    ]
  ],
  "notre-dame": [
    [
      "Day 2",
      "day.html?day=2#post-office"
    ]
  ],
  "book-street": [
    [
      "Day 2",
      "day.html?day=2#post-office"
    ]
  ],
  "qspa": [["Day 1","day.html?day=1#qspa-d1"],["Day 2","day.html?day=2#qspa-d2"],["Day 3","day.html?day=3#qspa-d3"]],
  "maruco": [["Day 3","day.html?day=3#maruco"]],
  "nha-suga": [],
  "omakase-tiger": [
    [
      "Day 1",
      "day.html?day=1#omakase-tiger"
    ]
  ],
  "cafe-apartments": [["Day 1","day.html?day=1#cafe-apartments-optional"],["Day 1 · Evening","day.html?day=1#cafe-apartments-evening"]],
  "marou": [
    [
      "Day 5",
      "day.html?day=5#day5-free-browse"
    ]
  ],
  "fine-arts": [
    [
      "Day 5",
      "day.html?day=5#fine-arts"
    ]
  ],
  "bep-me-in": [
    [
      "Day 5",
      "day.html?day=5#bep-me-in"
    ]
  ],
  "takashimaya": [
    [
      "Day 5",
      "day.html?day=5#day5-free-browse"
    ]
  ],
  "ha-spa": [
    [
      "Day 5",
      "day.html?day=5#ha-spa"
    ]
  ],
  "man-moi": [
    [
      "Day 3",
      "day.html?day=3#man-moi"
    ]
  ],
  "late-night-supper": [
    [
      "Day 1",
      "day.html?day=1#late-night-supper"
    ]
  ],
  "com-tam-moc": [
    [
      "Day 2",
      "day.html?day=2#com-tam-moc"
    ]
  ],
  "garmentory": [
    [
      "Day 2",
      "day.html?day=2#garmentory"
    ]
  ],
  "dalla-saigon": [
    [
      "Day 2",
      "day.html?day=2#shopping-tqd"
    ]
  ],
  "rubies": [
    [
      "Day 2",
      "day.html?day=2#shopping-tqd"
    ]
  ],
  "lane-ci": [
    [
      "Day 2",
      "day.html?day=2#shopping-tqd"
    ]
  ],
  "mozaic-space": [
    [
      "Day 2 · Optional",
      "day.html?day=2#shopping-tqd"
    ]
  ],
  "pizza4ps": [
    [
      "Day 2",
      "day.html?day=2#pizza4ps"
    ]
  ],
  "libe": [
    [
      "Day 1",
      "day.html?day=1#shopping-nguyen-trai"
    ]
  ],
  "dauple": [
    [
      "Day 1",
      "day.html?day=1#shopping-nguyen-trai"
    ]
  ],
  "nosbyn": [
    [
      "Day 1",
      "day.html?day=1#shopping-nguyen-trai"
    ]
  ],
  "moc-healing": [],
  "lune": [
    [
      "Day 2",
      "day.html?day=2#lune"
    ]
  ],
  "cu-chi": [
    [
      "Day 3",
      "day.html?day=3#cu-chi"
    ]
  ],
  "war-museum": [
    [
      "Day 3",
      "day.html?day=3#war-museum"
    ]
  ],
  "nara-spa": [["Day 3 · Optional","day.html?day=3#qspa-d3"]],
  "oc-dao": [
    [
      "Day 3 · Optional",
      "day.html?day=3#maruco"
    ]
  ],
  "running-bean": [
    [
      "Day 5",
      "day.html?day=5#running-bean"
    ]
  ],
  "new-playground": [["Day 2","day.html?day=2#vincom-new-playground"]],
  "rue-miche-ledition": [["Day 2","day.html?day=2#rue-miche-ledition"]],
  "pink-church": [
    [
      "Day 4",
      "day.html?day=4#pink-church"
    ]
  ],
  "cong": [
    [
      "Day 4",
      "day.html?day=4#pink-church"
    ]
  ],
  "quan-thuy": [
    [
      "Day 4",
      "day.html?day=4#quan-thuy"
    ]
  ],
  "saigon-concept": [
    [
      "Day 4",
      "day.html?day=4#thao-dien-open-list"
    ]
  ],
  "ohquao": [
    [
      "Day 4",
      "day.html?day=4#thao-dien-open-list"
    ]
  ],
  "louh": [
    [
      "Day 4",
      "day.html?day=4#thao-dien-open-list"
    ]
  ],
  "moc-huong": [
    [
      "Day 4",
      "day.html?day=4#thao-dien-open-list"
    ]
  ],

  "mojo-spa": [["Day 4","day.html?day=4#thao-dien-open-list"]],
  "thao-dien-spa": [["Day 4","day.html?day=4#thao-dien-open-list"]],
  "golden-lotus-thao-dien": [["Day 4","day.html?day=4#thao-dien-open-list"]]
};

const FRIENDS={
  "christal": "🧸 Christal",
  "crystal": "👓 Crystal",
  "mero": "✝️ Mero",
  "vivian": "👟 Vivian"
};

const BOOKINGS_DATA={
  "bk-moc-huong-d4": {
    "id":"bk-moc-huong-d4","bookingId":"bk-moc-huong-d4","eventId":"moc-huong-d4","timelineItemId":"moc-huong-d4",
    "day":4,"dayId":"day4","status":"pending","date":"2026-11-02","time":"15:30",
    "bookingName":"","bookingCategory":"Spa","category":"Spa","type":"spa","emoji":"🌿",
    "title":"Mộc Hương Wellness · An Khánh · 4 guests / 120 min",
    "bookingMethod":"WhatsApp / Official website","bookingWay":"WhatsApp / Official website",
    "bookingUrl":"https://mochuongwellness.vn/booking/","whatsapp":"+84 90 975 5877",
    "guests":4,"guestSummary":"4 guests · 120 minutes","address":"03 Đặng Hữu Phổ, An Khánh, Hồ Chí Minh, Vietnam",
    "notes":"PENDING — not booked. Request 2 Nov 15:30–17:30 for 4 people, 120 minutes, An Khánh branch at 03 Đặng Hữu Phổ.",
    "bookingHandoff":"Not confirmed. WhatsApp +84 90 975 5877 or book via official website; confirm availability, treatment, price and branch.",
    "placeId":"moc-huong"
  },
  "bk-quince": {
    "id": "bk-quince", "bookingId": "bk-quince", "eventId": "quince-d4", "timelineItemId": "quince-d4",
    "day": 4, "dayId": "day4", "status": "confirmed", "date": "2026-11-02", "time": "19:00",
    "bookingName": "Crystal Cheung", "bookingCategory": "Restaurants", "category": "Restaurants", "type": "restaurant",
    "emoji": "🍽️", "title": "Quince Saigon · Dining Room", "bookingMethod": "Google / TableCheck",
    "bookingWay": "Google / TableCheck", "platform": "TableCheck", "bookingUrl": "https://linktr.ee/quincesaigon", "guests": 4, "guestSummary": "4 guests",
    "address": "37bis Ký Con, District 1, Ho Chi Minh City, Vietnam",
    "notes": "Confirmed · Mon 2 Nov · 19:00 · 4 guests · Dining Room. No credit card requested. 可當日視 Thảo Điền 行程調整；取消或更改前先確認餐廳條款。",
    "bookingHandoff": "Confirmed 19:00 for four via Google / TableCheck. No credit card requested; cancellation policy not independently verified. 如需改時間或取消，先確認餐廳條款。",
    "placeId": "quince"
  },

  "bk-fusion-original": {
    "id": "bk-fusion-original",
    "bookingId": "bk-fusion-original",
    "eventId": "fusion",
    "day": 1,
    "dayId": "day1",
    "status": "confirmed",
    "date": "2026-10-30",
    "time": "",
    "bookingName": "Crystal Cheung",
    "bookingCategory": "Accommodation",
    "category": "Accommodation",
    "type": "accommodation",
    "title": "Fusion Original Saigon Centre",
    "depositPaid": "Paid",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "",
    "bookingWay": "Klook",
    "platform": "Klook",
    "bookingContact": "+84 28 3622 2265",
    "secondaryContact": "",
    "reference": "JCV982609",
    "referenceLabel": "Klook booking no.",
    "notes": "Paid and confirmed Klook booking. Two-Bedroom Executive · 4 nights · 4 adults · 1 room.",
    "totalAmount": "AUD 1,543.66",
    "cashbackAmount": "AUD 279.19",
    "cashbackProvider": "ShopBack",
    "cashbackStatus": "tracked",
    "netTotalAUD": "AUD 1,264.47",
    "price": "AUD 1,543.66",
    "paymentLabel": "Paid",
    "stayDates": "30 Oct – 3 Nov 2026",
    "roomType": "Two-Bedroom Executive",
    "roomCount": 1,
    "guestSummary": "4 adults",
    "adults": 4,
    "children": 0,
    "bedType": "2 semi-double beds and 1 king bed",
    "checkIn": "14:00",
    "checkOut": "12:00",
    "nights": 4,
    "phone": "+84 28 3622 2265",
    "email": "reservations.fosc@fusionoriginals.com",
    "address": "65 Le Loi, Ward Ben Nghe, District 1, Ho Chi Minh City, Vietnam",
    "bookingHandoff": "已付款及確認。Klook booking no. JCV982609。Gross AUD 1,543.66；ShopBack cashback tracked AUD 279.19；net cost AUD 1,264.47。",
    "placeId": "fusion",
    "paymentStatus": "paid"
  },
  "bk-omakase-tiger": {
    "id": "bk-omakase-tiger",
    "bookingId": "bk-omakase-tiger",
    "eventId": "omakase-tiger",
    "timelineItemId": "omakase-tiger",
    "day": 1,
    "dayId": "day1",
    "status": "confirmed",
    "date": "2026-10-30",
    "time": "17:30",
    "bookingName": "Crystal Cheung",
    "bookingCategory": "Restaurants",
    "category": "Restaurants",
    "type": "restaurant",
    "emoji": "🍣",
    "title": "Omakase Tiger",
    "depositPaid": "Paid",
    "depositAmount": "2000000",
    "depositCurrency": "VND",
    "bookingMethod": "WhatsApp",
    "bookingContact": "",
    "secondaryContact": "",
    "bookingUrl": "https://omakasetiger.com/en",
    "notes": "已確認 30 Oct 17:30；訂金 2,000,000 VND（約 AUD 112）已付。",
    "paymentStatus": "deposit paid",
    "signatureDishes": ["Seasonal omakase course", "Sake pairing", "Penthouse sunset counter"],
    "bookingHandoff": "已確認 30 Oct 17:30，訂金 2,000,000 VND 已付。唔需要重新訂；如要改資料，用 official website 或 email omakasetigersgn@gmail.com。",
    "email": "",
    "whatsapp": "+84 93 201 4124",
    "depositAUD": "AUD 112",
    "placeId": "omakase-tiger"
  },
  "bk-lune": {
    "id": "bk-lune",
    "bookingId": "bk-lune",
    "eventId": "lune",
    "timelineItemId": "lune",
    "day": 2,
    "dayId": "day2",
    "status": "confirmed",
    "date": "2026-10-31",
    "time": "19:00",
    "bookingName": "",
    "bookingCategory": "Restaurants",
    "category": "Restaurants",
    "type": "restaurant",
    "emoji": "🥂",
    "title": "LÜNE Restaurant & Bar",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Official online reservation / Email",
    "bookingContact": "",
    "secondaryContact": "",
    "bookingUrl": "https://www.adrienguenzi.com/reservations",
    "notes": "19:00 dinner for 4. Current D2 flow is Qspa → Cathedral / Central Post Office / Book Street → Vincom Center Đồng Khởi / The New Playground → Rue Miche L’Édition → LÚNE；不返 Fusion，按步行路線直接接晚餐。",
    "signatureDishes": ["Canadian lobster raviolo", "Phở foie gras terrine", "Sea urchin + A5 wagyu"],
    "email": "contact-lune@hdnt.vn",
    "address": "17/14 Lê Thánh Tôn, Sài Gòn, Ho Chi Minh City, Vietnam",
    "bookingHandoff": "已確認 31 Oct 19:00，4人。Booking time 為 Day 2 Timeline 的時間 authority；如需改時間，請由 Booking Edit 更新。",
    "placeId": "lune"
  },
  "bk-pizza4ps": {
    "id": "bk-pizza4ps",
    "bookingId": "bk-pizza4ps",
    "eventId": "pizza4ps",
    "timelineItemId": "pizza4ps",
    "day": 2,
    "dayId": "day2",
    "status": "pending",
    "date": "2026-10-31",
    "time": "12:45",
    "bookingName": "",
    "bookingCategory": "Restaurants",
    "category": "Restaurants",
    "type": "restaurant",
    "emoji": "🍕",
    "title": "Pizza 4P’s Hai Bà Trưng",
    "address": "151B Hai Bà Trưng, Võ Thị Sáu, District 3, Ho Chi Minh City, Vietnam",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Official online reservation",
    "bookingContact": "",
    "secondaryContact": "",
    "bookingUrl": "https://booking.pizza4ps.com/",
    "notes": "Hai Bà Trưng branch · 151B Hai Bà Trưng, Võ Thị Sáu, District 3。Reserve lunch for 4 around 12:45；食完前往 Qspa 做 D2 Afternoon Reset。Norah Spa 2 只保留為 route-friendly optional alternative。",
    "signatureDishes": ["Crab tomato cream spaghetti", "House-made 4-cheese pizza + honey", "Burrata / Parma ham pizza"],
    "bookingHandoff": "未訂。一定揀 Hai Bà Trưng branch · 151B Hai Bà Trưng, Võ Thị Sáu, District 3；4人，31 Oct 約12:45。用 Pizza 4P’s official reservation flow。",
    "placeId": "pizza4ps"
  },
  "bk-qspa": {
    "id": "bk-qspa",
    "bookingId": "bk-qspa",
    "eventId": "qspa-d1",
    "timelineItemId": "qspa-d1",
    "day": 1,
    "dayId": "day1",
    "status": "planned",
    "date": "30 Oct – 1 Nov 2026",
    "time": "D1 · D2 · D3",
    "bookingCategory": "Spa",
    "category": "Spa",
    "type": "spa",
    "emoji": "🌿",
    "title": "Qspa · Rediscover Your Soul",
    "bookingMethod": "Facebook Messenger / Instagram",
    "bookingContact": "028 3535 9727",
    "phone": "028 3535 9727",
    "website": "https://qspa.com.vn/",
    "messengerUrl": "https://m.me/QspaCenter",
    "instagramUrl": "https://www.instagram.com/qspacenter/",
    "placeId": "qspa",
    "notes": "120-minute treatments · three planned visits.",
    "plannedDays": "D1 · D2 · D3",
    "standalone": true,
    "membershipDiscount": "💳 MEMBERSHIP DISCOUNT — 50% OFF\nMembership holder: Lai Mong Hang\nRegistered phone: +61 411 600 494",
      "plannedVisits": [
      {
        "day": "D1",
        "date": "Fri 30 Oct 2026",
        "time": "12:30–14:30",
        "label": "Arrival Recovery",
        "duration": "120 min",
        "dayId": "day1",
        "timelineItemId": "qspa-d1"
      },
      {
        "day": "D2",
        "date": "Sat 31 Oct 2026",
        "time": "14:30–16:30",
        "label": "Afternoon Reset",
        "duration": "up to ~120 min",
        "dayId": "day2",
        "timelineItemId": "qspa-d2"
      },
      {
        "day": "D3",
        "date": "Sun 1 Nov 2026",
        "time": "16:30–18:30",
        "label": "War Day Recovery",
        "duration": "120 min",
        "dayId": "day3",
        "timelineItemId": "qspa-d3"
      }
    ],
    "alternativeGuides": [
      {
        "day": "D2",
        "placeId": "norah-spa-2",
        "label": "Norah Spa 2",
        "note": "Route-friendly alternative"
      },
      {
        "day": "D3",
        "placeId": "nara-spa",
        "label": "Nara Spa",
        "note": "Hair-reset alternative"
      }
    ]
  },
  "bk-ha-spa": {
    "id": "bk-ha-spa",
    "bookingId": "bk-ha-spa",
    "eventId": "ha-spa",
    "timelineItemId": "ha-spa",
    "day": 5,
    "dayId": "day5",
    "status": "pending",
    "date": "2026-11-03",
    "time": "15:30",
    "bookingName": "",
    "bookingCategory": "Spa",
    "category": "Spa",
    "type": "spa",
    "title": "Hạ Spa — Tân Bình",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Official website / WhatsApp",
    "bookingContact": "",
    "secondaryContact": "",
    "bookingUrl": "https://haspamassage.vn/lien-he/",
    "notes": "Confirm timing against airport transfer.",
    "address": "334 Nguyễn Trọng Tuyển, Ward 2, Tân Bình, Ho Chi Minh City",
    "bookingHandoff": "未訂。Tân Bình branch；可用 official website 或 WhatsApp +84 908 661 683。4人，3 Nov 15:30；預約時確認療程長度同機場 transfer timing。",
    "whatsapp": "+84 908 661 683",
    "placeId": "ha-spa"
  },
  "bk-transfer-in": {
    "id": "bk-transfer-in",
    "bookingId": "bk-transfer-in",
    "eventId": "airport-transfer",
    "timelineItemId": "airport-transfer",
    "day": 1,
    "dayId": "day1",
    "status": "confirmed",
    "date": "2026-10-30",
    "time": "05:55",
    "bookingName": "",
    "bookingCategory": "Transport",
    "category": "Transport",
    "type": "transport",
    "title": "Klook Private Airport Transfer · SGN → Fusion Original",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Klook",
    "bookingContact": "+84 395777770",
    "secondaryContact": "service.info.baolinh@gmail.com",
    "reference": "TKB045199",
    "referenceLabel": "Klook booking no.",
    "platform": "Klook",
    "operatorName": "Easycar",
    "phone": "+84 395777770",
    "whatsapp": "+84 395777770",
    "email": "service.info.baolinh@gmail.com",
    "totalAmount": "AUD 10.55",
    "price": "AUD 10.55",
    "paymentLabel": "Paid",
    "vehicle": "Economy 7 seater · 3 passengers",
    "pickupAddress": "Terminal 2 International Arrival · outside Arrival Hall · opposite pillar no. 9",
    "dropOff": "Fusion Original Saigon Centre · 65 Lê Lợi, Ho Chi Minh City",
    "bookingUrl": "https://www.klook.com/airport-transfers/service/sgn-tan-son-nhat-international-airport/",
    "notes": "05:55 is the flight arrival time supplied to Klook, not a fixed driver meeting time. Per the booked transfer terms, pickup is arranged within 1 hour after arrival. Meeting point: Terminal 2 International Arrival, outside the Arrival Hall, opposite pillar no. 9. Operator: Easycar · +84 395777770 · service.info.baolinh@gmail.com. Luggage allowance is based on 24-inch medium luggage (24 x 14 x 8 in / 63 x 36 x 21 cm); oversized luggage is treated as 2 pieces.",
    "standalone": true,
    "bookingHandoff": "已訂。05:55 是航班抵達時間；出關取行李後按 Klook 接機安排會合，條款為 arrival 後 1 小時內接送。集合點：T2 International Arrival 出 Arrival Hall，pillar 9 對面。Operator: Easycar。"
  },
  "bk-maruco": {
    "id": "bk-maruco",
    "bookingId": "bk-maruco",
    "eventId": "maruco",
    "timelineItemId": "maruco",
    "day": 3,
    "dayId": "day3",
    "status": "confirmed",
    "date": "2026-11-01",
    "time": "19:30",
    "bookingName": "",
    "bookingCategory": "Restaurants",
    "category": "Restaurants",
    "type": "restaurant",
    "emoji": "🔥",
    "title": "Izakaya Maruco",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Instagram",
    "bookingContact": "034 992 1802",
    "secondaryContact": "@maruco0930_vn",
    "bookingUrl": "https://www.instagram.com/maruco0930_vn/",
    "notes": "Day 3 primary dinner · 4人 · 1 Nov 2026 19:30。已經經 Instagram 預約確認。日本居酒屋；重點想食稻草燒牛舌。Qspa 18:30完成後直接 Grab 前往。",
    "signatureDishes": ["稻草燒牛舌", "Japanese izakaya grilled dishes", "Sashimi / sharing plates"],
    "address": "46 Mê Linh, Phường 19, Bình Thạnh, Ho Chi Minh City",
    "bookingHandoff": "已訂。1 Nov 2026 19:30，4人，經 Instagram @maruco0930_vn confirmed。Primary Day 3 dinner；Qspa 後直接 Grab 前往。",
    "placeId": "maruco"
  },
  "bk-man-moi": {
    "id": "bk-man-moi",
    "bookingId": "bk-man-moi",
    "eventId": "man-moi",
    "timelineItemId": "man-moi",
    "day": 3,
    "dayId": "day3",
    "status": "pending",
    "date": "2026-11-01",
    "time": "Target ~13:30–14:00 · traffic dependent",
    "bookingName": "",
    "bookingCategory": "Restaurants",
    "category": "Restaurants",
    "type": "restaurant",
    "emoji": "🍲",
    "title": "Mặn Mòi · Tao Đàn",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Official online reservation",
    "bookingContact": "",
    "secondaryContact": "",
    "bookingUrl": "https://manmoi.vn/en/book-a-table/",
    "notes": "Post–Cu Chi lunch · 4 人。07:30 private-tour pickup；回城目標約 13:30–14:00，但交通可令到達時間前後浮動。請司機直接 drop Mặn Mòi Tao Đàn；餐後由 34 Võ Văn Tần 短步行到 War Remnants Museum（28 Võ Văn Tần）。",
    "signatureDishes": ["Pork jowl", "Sticky rice chicken", "Vietnamese home-style claypot / soup"],
    "address": "34 Võ Văn Tần, Xuân Hòa, Ho Chi Minh City",
    "bookingHandoff": "未訂。用 Mặn Mòi official Book a Table，必須選 Tao Đàn branch · 34 Võ Văn Tần，4人，1 Nov。Cu Chi 回城受交通影響，目標到達約 13:30–14:00；不要把估算到達時間誤標成已確認訂位時間。",
    "placeId": "man-moi"
  },
  "bk-cu-chi": {
    "id": "bk-cu-chi",
    "bookingId": "bk-cu-chi",
    "eventId": "cu-chi",
    "timelineItemId": "cu-chi",
    "day": 3,
    "dayId": "day3",
    "status": "confirmed",
    "date": "2026-11-01",
    "time": "07:30",
    "bookingName": "",
    "bookingCategory": "Activities",
    "category": "Activities",
    "type": "activity",
    "title": "Cu Chi Tunnels Half Day Tour",
    "depositPaid": "",
    "depositAmount": "",
    "depositCurrency": "",
    "bookingMethod": "Klook · Private tour",
    "bookingContact": "+84 342260119",
    "secondaryContact": "operate@ssttravel.vn",
    "bookingUrl": "https://www.klook.com/en-AU/activity/137200-cu-chi-tunnels-private-day-tour-with-chinese-speaking-guide/",
    "reference": "TUM556012",
    "referenceLabel": "Klook booking no.",
    "platform": "Klook",
    "operatorName": "SST Travel",
    "phone": "+84 342260119",
    "whatsapp": "+84 342260119",
    "email": "operate@ssttravel.vn",
    "totalAmount": "AUD 229.20",
    "price": "AUD 229.20",
    "paymentLabel": "Paid",
    "tourType": "Private tour",
    "guests": "4 travellers",
    "pickupAddress": "Fusion Original Saigon Centre",
    "pickupNote": "07:30 departure · Fusion Original Saigon Centre",
    "cancellation": "Free cancellation before 31 Oct 2026 00:00 (Ho Chi Minh time, GMT+7), per Klook booking confirmation.",
    "included": ["Admission to attractions", "English-speaking guide", "Round-trip transfers to and from your hotel", "Round-trip transfers to and from the meet up location"],
    "notIncluded": ["Admission to shooting at AK-47", "Meals and beverages", "Other personal expenses", "Tips and gratuities", "Insurance", "Holiday surcharge (see Additional Information)"],
    "notes": "Confirmed Klook private tour for 4 with English guide. Operator has confirmed pickup can be 07:30 from Fusion Original Saigon Centre. Operator: SST Travel · +84 342260119 · operate@ssttravel.vn. Included: attraction admission, English-speaking guide, round-trip hotel / meet-up transfers. Not included: AK-47 shooting admission, meals and beverages, personal expenses, tips, insurance, holiday surcharge. Trip requests: skip tour lunch, no factory stop, and direct city drop at Mặn Mòi Tao Đàn, 34 Võ Văn Tần. Return is traffic-dependent; target arrival is about 13:30–14:00 rather than a fixed promise.",
    "bookingHandoff": "已訂。Klook booking TUM556012；operator 已確認可 1 Nov 07:30 由 Fusion Original Saigon Centre 出發，4人 Private Tour、English Guide。Operator: SST Travel。",
    "placeId": "cu-chi"
  }
};

const TRIP_DATA={
  "checklist": {
    "title": "✅ Checklist",
    "body": "<div class='checklist-mini trip-checklist-compact'><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Passport</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> E-Visa</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Travel Insurance</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Credit Card</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> AUD 500 Cash</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> eSIM</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Grab App</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Offline Maps</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Power Bank</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Online Check-in</label><div class='ready-box' id='readyBox'><h2>✈ WE ARE READY</h2><p>Let's Go!</p></div></div>"
  },
  "emergency": {
    "title": "☎️ Emergency",
    "body": "<div class='fact-grid trip-facts-compact'><div class='fact'><strong>Police</strong><a href='tel:113'>113</a></div><div class='fact'><strong>Fire</strong><a href='tel:114'>114</a></div><div class='fact'><strong>Ambulance</strong><a href='tel:115'>115</a></div><div class='fact'><strong>Hotel</strong><a href='tel:+842836222265'>+84 28 3622 2265</a></div><div class='fact'><strong>Australian Consulate-General</strong><a href='tel:+842835218100'>+84 28 3521 8100</a><br>20/F Vincom Centre, 47 Lý Tự Trọng, D1</div><div class='fact'><strong>24-hour Consular Emergency</strong><a href='tel:+61262613305'>+61 2 6261 3305</a></div></div><p class='timestamp'>Local emergency lines may operate mainly in Vietnamese. Contact the hotel or travel insurer when practical.</p>"
  },
  "flights": {
    "title": "✈️ Flights",
    "body": "<div class='fact-grid trip-facts-compact'><div class='fact'><strong>Outbound · Fri 30 Oct</strong>VietJet VJ082<br>MEL T2 01:30 → SGN T2 05:55<br>7kg carry-on · 20kg checked</div><div class='fact'><strong>Return · Tue 3 Nov</strong>Vietnam Airlines VN781<br>SGN T2 21:10 → MEL T2 09:25 +1<br>7kg carry-on · 20kg checked</div></div>"
  },
  "stay": {
    "title": "🏨 Stay",
    "body": "<p><strong>Fusion Original Saigon Centre</strong><br>今次四人行的城市 base。位置連住 Saigon Centre / Takashimaya，落雨、太熱或者夜晚返酒店都方便。</p><div class='hotel-card'><p class='kicker'>Hotel Address</p><p><strong>Fusion Original Saigon Centre</strong><br>65 Đường Lê Lợi<br>Takashimaya Saigon Centre<br>District 1, Ho Chi Minh City, Vietnam</p><div class='guide-next-row'><button class='pill' onclick=\"copyText('Fusion Original Saigon Centre, 65 Đường Lê Lợi, Takashimaya Saigon Centre, District 1, Ho Chi Minh City, Vietnam')\">📋 Copy Address</button></div></div><div class='fact-grid hotel-facts'><div class='fact'><strong>Phone</strong><a href='tel:+842836222265'>+84 28 3622 2265</a></div><div class='fact'><strong>Check-in</strong>2:00 pm – 12:00 am</div><div class='fact'><strong>Check-out</strong>Before 12:00 pm</div><div class='fact'><strong>Room</strong>2 Bedroom Suite</div></div>"
  },
  "activities": {"title":"🎟️ Activities","body":""},
  "transport": {"title":"🚐 Transport","body":""}
};

const TRIP_ORDER=[
  "flights",
  "stay",
  "activities",
  "transport",
  "checklist",
  "emergency"
];

const ITINERARY_DATA={
  "1": {
    "dayEmoji": "🛬",
    "title": "Day 1 · Saigon Companion",
    "kicker": "Day 1 · 30 Oct • Friday",
    "heading": "Hello Saigon",
    "areaLabel": "DISTRICT 1 · CENTRAL SAIGON",
    "legend": [
      "☀️ Morning",
      "🍜 Midday",
      "🌙 Evening"
    ],
    "items": [
      {
        "id": "airport-arrival",
        "time": "05:55",
        "title": "🛬 Arrive Ho Chi Minh City",
        "details": [
          "抵達 SGN Terminal 2，預留 immigration、行李及接送集合時間"
        ],
        "route": "🚐 To next stop：出關後乘已預訂 Klook Private Transfer → Fusion Original。",
        "map": "https://www.google.com/maps/search/?api=1&query=Tan%20Son%20Nhat%20International%20Airport",
        "type": "transport",
        "dayId": "day1",
        "placeId": "tan-son-nhat-airport",
        "bookingId": null
      },
      {
        "id": "airport-transfer",
        "navigationRole": "info",
        "time": "~06:55–08:00",
        "title": "🚐 Private Transfer · Fusion Original Saigon Centre",
        "details": [
          "05:55 抵達，Klook 條款為 arrival 後 1 小時內接送",
          "Arrival Hall 往 pillar 9 對面與 Easycar 會合",
          "Official check-in time 14:00"
        ],
        "route": "🚶 To next stop · 約 10 min：步行往 VPBank ATM。",
        "map": "https://www.google.com/maps/search/?api=1&query=Fusion%20Original%20Saigon%20Centre%2065%20Le%20Loi%20Ho%20Chi%20Minh%20City",
        "type": "transport",
        "dayId": "day1",
        "placeId": "fusion",
        "bookingId": "bk-transfer-in",
        "currencyGuide": true
      },
      {
        "id": "day1-currency",
        "time": "~08:00–08:45",
        "title": "💵 VND · Currency Exchange",
        "details": [
          "VPBank ATM 是 Wise 提款首選，Hà Tâm 可比較 AUD 現金匯率",
          "Takashimaya B2 09:30 開門，需要時可再換",
          "其他選擇及導航見 Currency Guide"
        ],
        "route": "🚶 To next stop · 約 5 min：步行往 Phở SOL · Bến Thành。",
        "map": "https://www.google.com/maps/search/?api=1&query=VPBank%20ATM%20165-167-169%20Ham%20Nghi%20District%201%20Ho%20Chi%20Minh%20City",
        "type": "money",
        "dayId": "day1",
        "placeId": "currency-guide",
        "bookingId": null,
        "guideIds": ["currency-guide"],
        "currencyGuide": true
      },
      {
        "id": "pho-sol",
        "time": "~09:00–10:00",
        "title": "🍜 Phở SOL · Bến Thành",
        "details": ["石鍋河粉早餐。"],
        "route": "🚶 To next stop · 約 3–5 min：步行往 Clothes Bar，從這裡開始 Nguyễn Trãi Shopping Walk。",
        "map": "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20SOL%2032%20Ph%E1%BA%A1m%20H%E1%BB%93ng%20Th%C3%A1i%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam",
        "type": "meal", "dayId": "day1", "placeId": "pho-sol", "bookingId": null
      },
            {
        "id": "shopping-nguyen-trai",
        "time": "~10:00–12:00",
        "title": "🛍 Nguyễn Trãi · Local Fashion Walk",
        "details": [
          "🚶 Phở SOL → Dauple → LÀMIN → Nguyễn Trãi：Clothes Bar 24 → Dot Dot Gem 29 → Bubbli 39/15 → Dear José 49A → KIDO 49B → LIBÉ 52",
          "💍 Dot Dot Gem 睇 contemporary jewellery；其餘 fashion shops 見啱先入，唔需要逐間完成",
          "🧩 111 Concept：行完 LIBÉ 有時間先 Grab 過去；Route Map 保留佢，方便即場睇距離再決定",
          "沿 Nguyễn Trãi shopping 路線搵啲嘢食墊底，例如 Bánh mì、粉麵或輕食。"
        ],
        "route": "🧩 LIBÉ 後：有時間就 Grab → 111 Concept；之後按時間去 Qspa / Fusion。唔去 111 就直接接 Qspa。",
        "map": "https://www.google.com/maps/search/?api=1&query=Clothes%20Bar%2024%20Nguyen%20Trai%20Ho%20Chi%20Minh%20City",
        "type": "shoppingWindow",
        "dayId": "day1",
        "placeId": "clothes-bar",
        "bookingId": null,
        "showShoppingDirectory": true
      },
            {
        "id": "qspa-d1",
        "time": "12:30–14:30",
        "title": "🌿 Qspa · Arrival Recovery",
        "details": [
          "120 分鐘按摩或護理。"
        ],
        "route": "🚕 Qspa 後 Grab → Fusion Original check-in。",
        "map": "https://www.google.com/maps/search/?api=1&query=Qspa%2025%2F1%20Truong%20Dinh%20Ho%20Chi%20Minh%20City",
        "type": "spa",
        "dayId": "day1",
        "placeId": "qspa",
        "bookingId": "bk-qspa",
        "guideIds": [
          "qspa"
        ]
      },
      {
        "id": "day1-hotel-reset",
        "time": "~15:00",
        "title": "🏨 Fusion Original · Check-in & Rest",
        "details": [
          "Qspa 後返 Fusion check-in",
          "沖涼、換衫、休息，Cafe Apartments 視 energy 決定"
        ],
        "route": "☕ Optional next：有精神約 15:15–16:15 步行去 The Cafe Apartments；攰就留在 Fusion 休息。",
        "map": "https://www.google.com/maps/search/?api=1&query=Fusion%20Original%20Saigon%20Centre%2065%20Le%20Loi%20Ho%20Chi%20Minh%20City",
        "type": "rest",
        "dayId": "day1",
        "placeId": "fusion",
        "bookingId": "bk-fusion-original",
        "currencyGuide": true
      },
            {
        "id": "cafe-apartments-optional",
        "time": "~15:15–16:15 · Optional",
        "title": "☕ The Cafe Apartments · Quick Explore",
        "details": [
          "有精神：短逛 Nguyễn Huệ / Cafe Apartments、影相、飲咖啡",
          "攰：留 Fusion 休息，準備 17:30 Omakase"
        ],
        "route": "🚕 如去 Cafe Apartments，16:15 前離開，前往 17:30 Omakase。",
        "map": "https://www.google.com/maps/search/?api=1&query=The%20Cafe%20Apartments%2042%20Nguy%E1%BB%85n%20Hu%E1%BB%87%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
        "type": "optional",
        "dayId": "day1",
        "placeId": "cafe-apartments",
        "bookingId": null,
        "guideIds": [
          "cafe-apartments"
        ]
      },
            {
        "id": "omakase-tiger",
        "time": "17:30",
        "title": "🌇🍣 Omakase Tiger · First Seating",
        "details": [
          "17:30 confirmed，訂金已付",
          "Penthouse omakase，黃昏景觀。"
        ],
        "route": "🌇 17:30 fixed first seating。食完按 energy 決定：Nguyễn Huệ / Cafe Apartments evening wander，或直接返 Fusion。",
        "map": "https://www.google.com/maps/search/?api=1&query=Omakase%20Tiger%2085%2F9%20Pham%20Viet%20Chanh%20Ho%20Chi%20Minh",
        "type": "meal",
        "dayId": "day1",
        "placeId": "omakase-tiger",
        "bookingId": "bk-omakase-tiger"
      },

            {
        "id": "cafe-apartments-evening",
        "time": "After Omakase · Optional",
        "title": "🌃 Nguyễn Huệ / Cafe Apartments · Evening Wander",
        "details": [
          "有精神：Nguyễn Huệ / Cafe Apartments evening wander",
          "攰：直接返 Fusion"
        ],
        "route": "🏨 Grab / 步行返回 Fusion。",
        "map": "https://www.google.com/maps/search/?api=1&query=The%20Cafe%20Apartments%2042%20Nguy%E1%BB%85n%20Hu%E1%BB%87%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam",
        "type": "optional",
        "dayId": "day1",
        "placeId": "cafe-apartments",
        "bookingId": null,
        "guideIds": [
          "cafe-apartments"
        ]
      },
      {
        "id": "late-night-supper",
        "time": "Optional",
        "title": "🌙 酒店宵夜",
        "navigationRole": "info",
        "details": [
          "想食鹹：Oanh Cua，可查 delivery / GrabFood",
          "想食甜：GrabFood 搜 BINGO / Chè / Tofu / Bingsu"
        ],
        "route": "🏨 可安排送到 Fusion lobby。",
        "map": "https://www.google.com/maps/search/?api=1&query=Oanh%20Cua%20214%2F1B%20Nguy%E1%BB%85n%20Tr%C3%A3i%20Ho%20Chi%20Minh%20City",
        "type": "optional",
        "dayId": "day1",
        "placeId": "late-night-supper",
        "bookingId": null
      }
    ],
    "dayId": "day1"
  },
  "2": {
    "dayEmoji": "🛍️",
    "title": "Day 2 · Saigon Companion",
    "kicker": "Day 2 · 31 Oct • Saturday",
    "heading": "Fashion Day",
    "areaLabel": "LOCAL FASHION · FOOT RESET · LÚNE",
    "legend": [
      "🛍️ Fashion",
      "🍕 Indoor Break",
      "🌙 Dinner"
    ],
    "items": [
      {
        "id": "com-tam-moc", "time": "09:00–09:45", "title": "🍚 Cơm Tấm Mộc",
        "details": ["炭燒碎米飯早餐；09:00 開門。"],
        "route": "🚕 To next stop · 約 15–20 min：Grab → 11 Garmentory。",
        "map": "https://www.google.com/maps/search/?api=1&query=C%C6%A1m%20T%E1%BA%A5m%20M%E1%BB%99c%2085%20L%C3%BD%20T%E1%BB%B1%20Tr%E1%BB%8Dng%20Ho%20Chi%20Minh", "type":"meal","dayId":"day2","placeId":"com-tam-moc","bookingId":null
      },
      {
        "id":"garmentory","time":"10:15–11:15","title":"🧥 11 Garmentory",
        "details":["本地設計師服飾及選物。"],
        "route":"🚶 Next：由 11 Garmentory 向 Trần Quang Diệu cluster 移動；以 AASTU 118/12 為必看，再沿街自由 browse。",
        "map":"https://www.google.com/maps/search/?api=1&query=11%20Garmentory%20117B%20Nguyen%20Dinh%20Chinh%20Ho%20Chi%20Minh","type":"shoppingWindow","dayId":"day2","placeId":"garmentory","bookingId":null,"showShoppingDirectory":true
      },
      {
        "id":"shopping-tqd","time":"11:30–12:30","title":"🛍 Trần Quang Diệu · Fashion Walk",
        "details":["AASTU · 118/12 Trần Quang Diệu 為主看店；之後按實際步行方向經 RUBIES · 47–49、Dalla · 64、Lane Cì · 27、Mì Workshop · 29。唔需要每間都入。", "OPTIONAL：行完 Mì Workshop 如果仲有時間／精神，步行約 5–7 min → Mozaic Space · 31/23 Đ. Lê Văn Sỹ；唔去就直接去 Pizza 4P’s。"],
        "route":"🚶 Optional extension：Mì Workshop → Mozaic Space 約 5–7 min；skip Mozaic 就直接 Grab → Pizza 4P’s Hai Bà Trưng。",
        "map":"https://www.google.com/maps/search/?api=1&query=Dalla%20Saigon%2064%20Tran%20Quang%20Dieu%20Ho%20Chi%20Minh","type":"shoppingWindow","dayId":"day2","placeId":"dalla-saigon","bookingId":null,"showShoppingDirectory":true
      },
            {
        "id": "pizza4ps",
        "time": "12:45–14:00",
        "title": "🍕 Pizza 4P’s · Hai Bà Trưng",
        "details": [
          "Pizza + 自家芝士，午餐休息"
        ],
        "route": "🚕 To next stop · 約 10–15 min：Grab → Qspa · 25/1 Trương Định。",
        "map": "https://www.google.com/maps/search/?api=1&query=Pizza%204P%27s%20151B%20Hai%20Ba%20Trung%20Ho%20Chi%20Minh",
        "type": "meal",
        "dayId": "day2",
        "placeId": "pizza4ps",
        "bookingId": "bk-pizza4ps",
        "guideIds": [
          "pizza4ps"
        ],
        "currencyGuide": true
      },
            {
        "id": "qspa-d2",
        "time": "14:30–16:30",
        "title": "🌿 Qspa · Afternoon Reset",
        "details": [
          "120 分鐘按摩或護理。"
        ],
        "route": "🚕 To next stop：Qspa → Cathedral / Central Post Office / Book Street cluster；之後一路步行接 Vincom / The New Playground → LÚNE。",
        "map": "https://www.google.com/maps/search/?api=1&query=Qspa%2025%2F1%20Truong%20Dinh%20Ho%20Chi%20Minh%20City",
        "type": "spa",
        "dayId": "day2",
        "placeId": "qspa",
        "bookingId": "bk-qspa",
        "guideIds": [
          "qspa",
          "norah-spa-2"
        ],
        "alternativeGuideIds": [
          "norah-spa-2"
        ]
      },
            {
        "id": "post-office",
        "time": "~16:30–17:10",
        "title": "📮 Cathedral · Central Post Office · Book Street",
        "copyAddressEligible": false,
        "details": [
          "Cathedral → Central Post Office → Book Street"
        ],
        "route": "🚶 To next stop · 約 5–8 min：步行往 Vincom Center Đồng Khởi / The New Playground。",
        "map": "https://www.google.com/maps/search/?api=1&query=Saigon%20Central%20Post%20Office",
        "type": "experience",
        "dayId": "day2",
        "placeId": "post-office",
        "bookingId": null,
        "guideIds": [
          "notre-dame",
          "post-office",
          "book-street"
        ],
        "guideGroups": [
          {
            "label": "⛪ Cathedral",
            "guideIds": [
              "notre-dame"
            ]
          },
          {
            "label": "📮 Post Office",
            "guideIds": [
              "post-office"
            ]
          },
          {
            "label": "📚 Book Street",
            "guideIds": [
              "book-street"
            ]
          }
        ]
      },
            {
        "id": "vincom-new-playground",
        "time": "~17:15–17:50",
        "title": "🛍 Vincom Center Đồng Khởi · The New Playground",
        "details": [
          "Vincom 本地品牌購物。",
          "The New Playground：PUSH PUSH、BLACKORP 等自由 browse"
        ],
        "route": "🚶 To next stop · 約 4–6 min：Vincom → Union Square B3 · Rue Miche L’Édition。",
        "map": "https://www.google.com/maps/search/?api=1&query=The%20New%20Playground%20Vincom%20Center%20Dong%20Khoi%2072%20Le%20Thanh%20Ton%20Ho%20Chi%20Minh%20City",
        "type": "shoppingWindow",
        "dayId": "day2",
        "placeId": "new-playground",
        "bookingId": null,
        "guideIds": [
          "new-playground"
        ],
        "showShoppingDirectory": true
      },
      {
        "id": "rue-miche-ledition",
        "time": "~17:55–18:25",
        "title": "🛍 Rue Miche L’Édition · Union Square",
        "details": [
          "Union Square B3 大型 Vietnamese multi-brand flagship；集中看本地 fashion、accessories 與 lifestyle brands。",
        ],
        "route": "🚶 To next stop · 約 3–5 min：Union Square → LÚNE。",
        "map": "https://www.google.com/maps/search/?api=1&query=Rue%20Miche%20L%27Edition%20Union%20Square%20171%20Dong%20Khoi%20Ho%20Chi%20Minh",
        "type": "shoppingWindow",
        "dayId": "day2",
        "placeId": "rue-miche-ledition",
        "bookingId": null,
        "guideIds": ["rue-miche-ledition"],
        "showShoppingDirectory": true
      },
      {
        "id":"lune","time":"19:00–21:00","title":"🥂 LÚNE",
        "details":["法式 Fine Dining，可選 À La Carte 或 Tasting Menu。"],
        "route":"🏨 To next stop · Dinner 後 Grab 返回 Fusion。",
        "map":"https://www.google.com/maps/search/?api=1&query=LUNE%20Restaurant%20Bar%2017%2014%20Le%20Thanh%20Ton%20Ho%20Chi%20Minh","type":"meal","dayId":"day2","placeId":"lune","bookingId":"bk-lune"
      }
    ],
    "dayId": "day2"
  },
  "3": {
    "dayEmoji": "🪖",
    "title": "Day 3 · Saigon Companion",
    "kicker": "Day 3 · 1 Nov • Sunday",
    "heading": "War Day",
    "areaLabel": "CU CHI → DISTRICT 3 → SAIGON NIGHT",
    "legend": [
      "🪖 History",
      "🫧 Reset",
      "🔥 Japanese Izakaya"
    ],
    "items": [
      {
        "id": "cu-chi",
        "navigationRole": "info",
        "time": "07:30–~13:30/14:00",
        "title": "🪖 Cu Chi Tunnels · Private Tour",
        "details": [
          "07:30 Fusion 出發，4人 Private Tour + English Guide",
          "Skip lunch / factory stop，回城 drop Mặn Mòi Tao Đàn · 34 Võ Văn Tần",
          "預計 13:30–14:00 回市區，視交通"
        ],
        "route": "🚐 下一站：請司機直接 drop Mặn Mòi Tao Đàn · 34 Võ Văn Tần；不先返酒店。",
        "map": "https://www.google.com/maps/search/?api=1&query=Cu%20Chi%20Tunnels%20Ho%20Chi%20Minh%20City",
        "type": "experience",
        "dayId": "day3",
        "placeId": "cu-chi",
        "bookingId": "bk-cu-chi"
      },
      {
        "id": "man-moi",
        "time": "~13:30/14:00–~14:35/15:05",
        "title": "🍲 Mặn Mòi · Tao Đàn",
        "details": [
          "Cu Chi 後直接午餐，預留約 60–65 min"
        ],
        "route": "🚶 下一站：34 Võ Văn Tần → War Remnants Museum 28 Võ Văn Tần；同一條街，短步行即可。",
        "map": "https://www.google.com/maps/search/?api=1&query=M%E1%BA%B7n%20M%C3%B2i%20Tao%20%C4%90%C3%A0n%2034%20V%C3%B5%20V%C4%83n%20T%E1%BA%A7n%20Ho%20Chi%20Minh%20City",
        "type": "meal",
        "dayId": "day3",
        "placeId": "man-moi",
        "bookingId": "bk-man-moi"
      },
            {
        "id": "war-museum",
        "time": "after lunch · target ~14:40–16:30",
        "title": "🏛 War Remnants Museum",
        "details": [
          "參觀戰爭遺跡博物館。"
        ],
        "route": "🚶/🚕 下一站：前往 Qspa 25/1 Trương Định；museum 完成後接 120-minute War Day Recovery。",
        "map": "https://www.google.com/maps/search/?api=1&query=War%20Remnants%20Museum%2028%20Vo%20Van%20Tan%20Ho%20Chi%20Minh%20City",
        "type": "experience",
        "dayId": "day3",
        "placeId": "war-museum",
        "bookingId": null
      },
            {
        "id": "qspa-d3",
        "time": "16:30–18:30",
        "title": "🌿 Qspa · War Day Recovery",
        "details": [
          "120 分鐘按摩或護理。；可選按摩或護理"
        ],
        "route": "🚕 下一站：Grab → Izakaya Maruco · 46 Mê Linh；19:30 booking confirmed，Spa 完成後直接去。",
        "map": "https://www.google.com/maps/search/?api=1&query=Qspa%2025%2F1%20Truong%20Dinh%20Ho%20Chi%20Minh%20City",
        "type": "spa",
        "dayId": "day3",
        "placeId": "qspa",
        "bookingId": "bk-qspa",
        "guideIds": [
          "qspa",
          "nara-spa"
        ],
        "alternativeGuideIds": [
          "nara-spa"
        ]
      },
      {
        "id": "maruco",
        "time": "19:30",
        "title": "🔥 Izakaya Maruco · Japanese Izakaya",
        "details": [
          "PRIMARY · 19:30 confirmed via Instagram · 4人",
          "日本居酒屋 · 重點：稻草燒牛舌",
          "Ốc Đào 大排檔保留做 optional backup"
        ],
        "route": "🏨 晚餐後 Grab 返回 Fusion。",
        "map": "https://www.google.com/maps/search/?api=1&query=46%20M%C3%AA%20Linh%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20Ho%20Chi%20Minh%20City",
        "type": "meal",
        "dayId": "day3",
        "placeId": "maruco",
        "bookingId": "bk-maruco",
        "guideIds": ["maruco", "oc-dao"],
        "alternativeGuideIds": ["oc-dao"]
      }
    ],
    "dayId": "day3"
  },
  "4": {
    "dayEmoji": "🌿",
    "title": "Day 4 · Saigon Companion",
    "kicker": "Day 4 · 2 Nov • Monday",
    "heading": "Thảo Điền Open Day",
    "areaLabel": "TÂN ĐỊNH → THẢO ĐIỀN",
    "legend": [
      "🌸 Tân Định Morning",
      "🎲 Thảo Điền Open List",
      "🌿 No Checklist"
    ],
    "items": [
      {
        "id": "quan-thuy", "time": "09:00–09:40", "title": "🦀 Quán Thuý 94 · Crab Breakfast",
        "details": ["蟹肉粉絲／蟹料理；早餐後 Grab 去粉紅教堂。"],
        "route": "🚕 Grab → Tân Định Pink Church。",
        "map": "https://www.google.com/maps/search/?api=1&query=Quan%20Thuy%2094%2084%20Dinh%20Tien%20Hoang%20Ho%20Chi%20Minh%20City",
        "type": "meal", "dayId": "day4", "placeId": "quan-thuy", "bookingId": null, "guideIds": ["quan-thuy"]
      },
      {
        "id": "pink-church", "time": "09:50–10:25", "title": "🩷 Pink Church + Cộng Cà Phê",
        "details": ["先影 Tân Định Pink Church 外觀，再過馬路去 Cộng Cà Phê（274 Hai Bà Trưng）飲 Coconut Coffee；有時間可上樓影教堂景觀。", "兩站相鄰，步行約 1–3 分鐘；之後 Grab 去 Thảo Điền Shopping Route 第一站 In The Mood。"],
        "route": "🚕 Grab → In The Mood Saigon，32 Trần Ngọc Diện。",
        "map": "https://www.google.com/maps/search/?api=1&query=Tan%20Dinh%20Pink%20Church%20Ho%20Chi%20Minh%20City",
        "type": "experience", "dayId": "day4", "placeId": "pink-church", "bookingId": null, "guideIds": ["pink-church", "cong"]
      },
      {
        "id": "thao-dien-open-list",
        "time": "11:00–15:10",
        "title": "🎲 Thảo Điền · Open List",
        "summary": "八站 Shopping Route；15:30 前到 Mộc Hương An Khánh",
        "details": [
          "🛍 Shopping · In The Mood → Grade B → YouOn → Vina → dakao → Aurora → Wicky → OHQUAO；按興趣選店，15:10 左右離開前往 SPA",
          "🥐 Coffee / Sweet · Bakes，或者沿途見到想坐的 café",
          "🍽 Eat · 已在 Quán Thuý 94 食早餐；下午按胃口加 café / snack"
        ],
        "route": "🚕 第一站 In The Mood · 32 Trần Ngọc Diện；Shopping 結束後前往 Mộc Hương An Khánh · 03 Đặng Hữu Phổ。",
        "map": "https://www.google.com/maps/search/?api=1&query=In%20The%20Mood%20Saigon%2032%20Tran%20Ngoc%20Dien",
        "type": "openList",
        "dayId": "day4",
        "placeId": "in-the-mood-d4",
        "bookingId": null,
        "guideIds": ["in-the-mood-d4","grade-b-d4","youon-thao-dien","vina-design-thao-dien","dakao-quartier","aurora-saigon","wicky-candle","ohquao"],
        "guideGroups": [
          {"label":"🛍 Shopping Guide · 8 stops","guideIds":["in-the-mood-d4","grade-b-d4","youon-thao-dien","vina-design-thao-dien","dakao-quartier","aurora-saigon","wicky-candle","ohquao"]}
        ],
        "showShoppingDirectory": true
      },
      {
        "id":"moc-huong-d4","time":"15:30–17:30","title":"🌿 Mộc Hương Wellness · An Khánh SPA",
        "details":["15:30 療程開始；17:30 結束，之後步行去 0123 Complex（17:45）。"],
        "route":"🚶 Walk 1–3 min → 0123 Complex · 06 Đặng Hữu Phổ (17:45).",
        "map":"https://www.google.com/maps/search/?api=1&query=Moc%20Huong%20Wellness%2003%20Dang%20Huu%20Pho%20An%20Khanh",
        "type":"spa","dayId":"day4","placeId":"moc-huong","bookingId":"bk-moc-huong-d4","guideIds":["moc-huong"]
      },
      {
        "id":"complex-0123-d4","time":"17:45–18:40","title":"🏘 0123 Complex · Evening Browse",
        "details":["06 Đặng Hữu Phổ, An Khánh · beside Mộc Hương An Khánh.","18:40 → Quince 19:00 leaves only 20 minutes; check live traffic and leave earlier if necessary."],
        "route":"🚕 Grab → Quince Saigon, 37bis Ký Con · 19:00 confirmed; check live ETA.",
        "map":"https://www.google.com/maps/search/?api=1&query=0123%20Complex%2006%20Dang%20Huu%20Pho%20Ho%20Chi%20Minh%20City",
        "type":"experience","dayId":"day4","placeId":"complex-0123","bookingId":null,"guideIds":["complex-0123"]
      },
      {
        "id": "quince-d4", "time": "19:00–20:45", "title": "🍽️ Quince Saigon · Farewell Dinner",
        "details": ["Confirmed · Dining Room · 4 guests · Google / TableCheck", "可當日視 Thảo Điền 行程調整；如需更改或取消，先確認餐廳條款。", "18:40 從 0123 Complex 出發只得 20 分鐘；請提前查看交通，必要時提早離開 0123，19:00 Quince Booking 不變。"],
        "route": "🚕 0123 Complex → Quince Saigon · 37bis Ký Con, District 1；18:40 出發時間緊迫，先查即時交通。",
        "map": "https://www.google.com/maps/search/?api=1&query=Quince%20Saigon%2037bis%20Ky%20Con%20District%201",
        "type": "meal", "dayId": "day4", "placeId": "quince", "bookingId": "bk-quince", "guideIds": ["quince"]
      }
    ],
    "dayId": "day4"
  },
  "5": {
    "dayEmoji": "✈️",
    "title": "Day 5 · Saigon Companion",
    "kicker": "Day 5 · 3 Nov • Tuesday",
    "heading": "One Last Look",
    "areaLabel": "DISTRICT 1 → TÂN BÌNH · AIRPORT",
    "legend": [
      "☀️ Morning",
      "🍜 Midday",
      "🌙 Evening"
    ],
    "items": [
      {
            "id": "running-bean",
            "time": "09:00",
            "timeDisplayMode": "fixed",
            "title": "☕ The Running Bean · Bến Thành",
            "details": [
                  "09:00 早餐；Day 5 全日未預約，時間可彈性調整。"
            ],
            "route": "🚶 早餐後在市中心購物、買手信。",
            "type": "meal",
            "dayId": "day5",
            "placeId": "running-bean",
            "bookingId": null,
            "guideIds": [
                  "running-bean"
            ],
            "map": "https://www.google.com/maps/search/?api=1&query=The%20Running%20Bean%205%20Nguyen%20Trung%20Truc%20Ben%20Thanh%20Ho%20Chi%20Minh%20City"
      },
      {
            "id": "day5-free-browse",
            "time": "AM",
            "timeDisplayMode": "period",
            "timeDisplayPeriod": "AM",
            "title": "🛍 Shopping & Souvenirs",
            "details": [
                  "Running Bean 後在市中心行街、買最後一批手信。",
                  "11:30 前返回酒店，將戰利品執入行李。"
            ],
            "route": "🚶 回 Fusion Original Saigon Centre。",
            "type": "shoppingWindow",
            "dayId": "day5",
            "placeId": null,
            "bookingId": null,
            "nonPlace": true,
            "nonPlaceRole": "freeTime"
      },
      {
            "id": "hotel-checkout",
            "time": "12:00",
            "timeDisplayMode": "fixed",
            "title": "🏨 Fusion Original · Check-out",
            "details": [
                  "11:30 返酒店執行李；12:00 Check-out。",
                  "行李寄存酒店，午餐及美術館後回來提取。"
            ],
            "route": "🚶 前往 Bếp Mẹ Ỉn · Lê Thánh Tôn。",
            "type": "buffer",
            "dayId": "day5",
            "placeId": "fusion",
            "bookingId": null,
            "guideIds": [],
            "map": "https://www.google.com/maps/search/?api=1&query=Fusion%20Original%20Saigon%20Centre%20Fusion%20Original%20Saigon%20Centre%2C%2065%20L%C3%AA%20L%E1%BB%A3i%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City"
      },
      {
            "id": "bep-me-in",
            "time": "12:30",
            "timeDisplayMode": "fixed",
            "title": "🥞 Bếp Mẹ Ỉn · Lê Thánh Tôn",
            "details": [
                  "Michelin Bib Gourmand；136/9 Lê Thánh Tôn 分店。",
                  "未訂位；午餐後去 Museum of Fine Arts。"
            ],
            "route": "🚶 / 🚕 前往 Museum of Fine Arts。",
            "type": "meal",
            "dayId": "day5",
            "placeId": "bep-me-in",
            "bookingId": null,
            "guideIds": [
                  "bep-me-in"
            ],
            "map": "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFp%20M%E1%BA%B9%20%E1%BB%88n%20136%2F9%20L%C3%AA%20Th%C3%A1nh%20T%C3%B4n%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam"
      },
      {
            "id": "fine-arts",
            "time": "PM",
            "timeDisplayMode": "period",
            "timeDisplayPeriod": "PM",
            "title": "🎨 Museum of Fine Arts",
            "details": [
                  "97A Phó Đức Chính；午餐後參觀、影相，按當日時間彈性調整。"
            ],
            "route": "🚶 / 🚕 返回 Fusion Original 提行李。",
            "type": "experience",
            "dayId": "day5",
            "placeId": "fine-arts",
            "bookingId": null,
            "guideIds": [
                  "fine-arts"
            ],
            "map": "https://www.google.com/maps/search/?api=1&query=Fine%20Arts%20Museum%20Ho%20Chi%20Minh%20City%20Museum%20of%20Fine%20Arts%2C%2097A%20Ph%C3%B3%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20District%201%2C%20Ho%20Chi%20Minh%20City"
      },
      {
            "id": "hotel-luggage",
            "time": "PM",
            "timeDisplayMode": "period",
            "timeDisplayPeriod": "PM",
            "title": "🧳 Fusion Original · Pick Up Luggage",
            "details": [
                  "目標約 14:30 返酒店攞寄存行李。",
                  "帶齊所有行李去 Hạ Spa；確認 Spa 可暫時代為保管。"
            ],
            "route": "🚕 Grab 去 Hạ Spa · Tân Bình；預留交通緩衝。",
            "type": "buffer",
            "dayId": "day5",
            "placeId": "fusion",
            "bookingId": null,
            "guideIds": [],
            "map": "https://www.google.com/maps/search/?api=1&query=Fusion%20Original%20Saigon%20Centre%20Fusion%20Original%20Saigon%20Centre%2C%2065%20L%C3%AA%20L%E1%BB%A3i%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City"
      },
      {
            "id": "grab-ha-spa",
            "time": "PM",
            "timeDisplayMode": "period",
            "timeDisplayPeriod": "PM",
            "title": "🚕 Grab → Hạ Spa",
            "details": [
                  "由酒店直接出發，預留交通時間；以即時路況為準。"
            ],
            "route": "🚕 前往 334 Nguyễn Trọng Tuyển。",
            "type": "transport",
            "dayId": "day5",
            "placeId": "ha-spa",
            "bookingId": null,
            "guideIds": [],
            "map": "https://www.google.com/maps/search/?api=1&query=H%E1%BA%A1%20Spa%20334%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ward%202%2C%20T%C3%A2n%20B%C3%ACnh%20District%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam"
      },
      {
            "id": "ha-spa",
            "time": "15:30",
            "timeDisplayMode": "fixed",
            "title": "💆‍♀️ Hạ Spa · Tân Bình",
            "details": [
                  "15:30 目標開始，約兩小時療程；尚未預約。",
                  "預先確認可存放行李，按摩後附近食少少再返回取行李。"
            ],
            "route": "🚶 Optional quick dinner nearby；18:00 左右離開前往機場。",
            "type": "spa",
            "dayId": "day5",
            "placeId": "ha-spa",
            "bookingId": "bk-ha-spa",
            "guideIds": [
                  "ha-spa"
            ],
            "map": "https://www.google.com/maps/search/?api=1&query=H%E1%BA%A1%20Spa%20334%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ward%202%2C%20T%C3%A2n%20B%C3%ACnh%20District%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam"
      },
      {
            "id": "day5-optional-dinner",
            "time": "PM",
            "timeDisplayMode": "period",
            "timeDisplayPeriod": "PM",
            "title": "🍜 Optional · Quick Dinner near Hạ Spa",
            "details": [
                  "只在時間充裕時於 Spa 附近簡單食少少。",
                  "餐廳未確認；如按摩延誤或交通繁忙，跳過晚餐直接去機場。"
            ],
            "route": "🚶 返回 Spa 攞行李，然後 Grab 去 SGN 國際航廈。",
            "type": "meal",
            "dayId": "day5",
            "placeId": null,
            "bookingId": null,
            "nonPlace": true
      },
      {
            "id": "airport-departure",
            "standalone": true,
            "transportEvent": true,
            "time": "18:00",
            "timeDisplayMode": "fixed",
            "title": "🚕 Leave for Airport",
            "details": [
                  "18:00 左右離開 Hạ Spa，21:00 國際航班。",
                  "如有延誤，優先趕機場，取消 Optional Dinner。"
            ],
            "route": "🚕 Grab 直達 SGN 國際航廈。",
            "type": "transport",
            "dayId": "day5",
            "placeId": "tan-son-nhat-airport",
            "bookingId": null,
            "guideIds": [],
            "map": "https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+Terminal+2"
      }
],
    "dayId": "day5"
  }
};
globalThis.TRAVEL_DATASETS=Object.freeze({PLACES,CATEGORIES,GUIDE_ORDER,DAY_LINKS,FRIENDS,BOOKINGS_DATA,TRIP_DATA,TRIP_ORDER,ITINERARY_DATA});
if(globalThis.TravelEngineIntegrity){globalThis.TRAVEL_ENGINE_ACCEPTANCE=globalThis.TravelEngineIntegrity.acceptTripData(globalThis.TRAVEL_DATASETS,globalThis.TRIP_CONFIG||{});}
(function computeMasterItineraryRevision(){function hashString(input){let h1=0xdeadbeef^input.length,h2=0x41c6ce57^input.length;for(let i=0;i<input.length;i++){const ch=input.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}h1=Math.imul(h1^(h1>>>16),2246822507);h1^=Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507);h2^=Math.imul(h1^(h1>>>13),3266489909);return(4294967296*(2097151&h2)+(h1>>>0)).toString(16);}try{globalThis.MASTER_ITINERARY_REVISION=hashString(JSON.stringify(ITINERARY_DATA));}catch(error){globalThis.MASTER_ITINERARY_REVISION=null;}})();
if(typeof TRIP_SYNC!=='undefined'&&typeof TRIP_SYNC.hydrateStaticData==='function'){TRIP_SYNC.hydrateStaticData({PLACES,CATEGORIES,GUIDE_ORDER,DAY_LINKS,FRIENDS,BOOKINGS_DATA,TRIP_DATA,TRIP_ORDER,ITINERARY_DATA});}
