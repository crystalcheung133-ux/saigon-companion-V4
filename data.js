// data.js — trip-specific content (places, categories, friends, day links)
// Edit THIS file to update trip content. script.js contains the app behaviour and should not need to change between trips.

const PLACES={"fusion":{"title":"Fusion Original Saigon Centre","emoji":"🏨","cat":"STAY","sub":"酒店據點","hours":"24 Hours","maps":"https://maps.google.com/?q=Fusion+Original+Saigon+Centre","address":"Fusion Original Saigon Centre, 65 Lê Lợi, Bến Nghé, District 1, Ho Chi Minh City","desc":"Fusion Original Saigon Centre 係今次旅程嘅城市據點：第一郡核心、樓下直通 Saigon Centre / Takashimaya，四個人每日出入、寄放戰利品、返酒店補妝都非常方便。兩房兩衛令行程唔需要因為梳洗同收拾而互相等待，呢點對短途朋友旅行特別重要。","signature":["2 Bedroom Suite：四人共享客廳，私隱同方便度平衡得好","直通 Takashimaya，雨天、酷熱或夜晚返酒店都安心","Maison Marou、超市、餐廳都在同一棟／附近，適合臨時補給"],"worth":["Hotel 係 base，不代表每日都由酒店出發；網站路線會以當時上一站作交通提示。","最適合用作「回巢點」：午后小休、放低戰利品、晚餐前換裝。"],"categoryLabel":"🏨 Stay","price":"Booked","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["2 Bedroom Suite：四人共享客廳，私隱同方便度平衡得好","直通 Takashimaya，雨天、酷熱或夜晚返酒店都安心","Maison Marou、超市、餐廳都在同一棟／附近，適合臨時補給"],"tips":["Hotel 係 base，不代表每日都由酒店出發；網站路線會以當時上一站作交通提示。","最適合用作「回巢點」：午后小休、放低戰利品、晚餐前換裝。"]},"bakes":{"title":"Bakes Thảo Điền","emoji":"🥐","cat":"CAFÉS","sub":"法式甜點","hours":"07:30–22:30 daily","maps":"https://maps.google.com/?q=Bakes+Thảo+Điền","address":"16 Thảo Điền, An Khánh, Hồ Chí Minh 700000, Vietnam","desc":"Bakes Thảo Điền 係草田區很順路的法式甜點 stop。相比普通 cafe，Bakes 嘅重點係精緻甜點同 croissant 類 pastry，適合 Day 3 逛完 Thảo Điền 小店後，用一小時坐低補糖、吹冷氣、整理戰利品。","signature":["多款法式甜點與千層 croissant","冷氣座位，適合午后避暑","同 The Dreamers Bakery 很近，可二選一"],"worth":["唔需要當成正式下午茶，4 人點 2–3 件 share 最剛好。","若當日太飽，可以外帶 pastry 留返酒店。"],"categoryLabel":"☕ Cafe","price":"$–$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["多款法式甜點與千層 croissant","冷氣座位，適合午后避暑","同 The Dreamers Bakery 很近，可二選一"],"tips":["唔需要當成正式下午茶，4 人點 2–3 件 share 最剛好。","若當日太飽，可以外帶 pastry 留返酒店。"]},"cafe-apartments":{"title":"The Cafe Apartments","emoji":"🌃","cat":"CAFÉS","sub":"老公寓咖啡樓","hours":"各店不同；大多約 09:00–22:00","maps":"https://maps.google.com/?q=The+Cafe+Apartments+42+Nguyễn+Huệ","address":"The Cafe Apartments, 42 Nguyễn Huệ, District 1, Ho Chi Minh City","desc":"The Cafe Apartments 係阮惠步行街最有代表性的老公寓改造景點。白天入內是迷宮式小店與 cafe，夜晚外牆一格格招牌亮起，反而成為最經典的西貢夜景背景。今次 Day 1 將 Spa 同夜景安排在同一棟樓，動線很聰明：下午上樓放鬆，晚上食完飯回來影霓虹燈。","signature":["夜晚外牆最上鏡","每層都有不同 cafe、選物店、香氛小店","電梯可能收小額費用，亦可逐層行樓梯探索"],"worth":["建議先搭到高層，再慢慢向下行，體力消耗較少。","不建議一入門就坐第一間；先逛一圈再決定。"],"categoryLabel":"☕ Cafe","price":"$–$$","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["夜晚外牆最上鏡","每層都有不同 cafe、選物店、香氛小店","電梯可能收小額費用，亦可逐層行樓梯探索"],"tips":["建議先搭到高層，再慢慢向下行，體力消耗較少。","不建議一入門就坐第一間；先逛一圈再決定。"]},"cong":{"title":"Cộng Cà Phê Tân Định","emoji":"🥥","cat":"CAFÉS","sub":"粉紅教堂景觀咖啡","hours":"約 07:00–23:00；出發前再確認","maps":"https://maps.google.com/?q=Cộng+Cà+Phê+Tân+Định","address":"Cộng Cà Phê Tân Định, Hai Bà Trưng, District 3, Ho Chi Minh City","desc":"Cộng Cà Phê Tân Định 最大賣點唔係咖啡本身，而係位置：粉紅教堂正對面／附近，適合打完卡後上樓坐低，用椰子咖啡或冰沙咖啡換一個俯瞰教堂角度。復古軍綠風裝潢亦好有越南味。","signature":["椰子咖啡／椰子冰沙咖啡","粉紅教堂視角","復古越南風格"],"worth":["如果只想影教堂，停留 20–30 分鐘已足夠。","座位景觀視乎當日樓層與窗邊位置。"],"categoryLabel":"☕ Cafe","price":"$–$$","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["椰子咖啡／椰子冰沙咖啡","粉紅教堂視角","復古越南風格"],"tips":["如果只想影教堂，停留 20–30 分鐘已足夠。","座位景觀視乎當日樓層與窗邊位置。"]},"marou":{"title":"Maison Marou Saigon","emoji":"🍫","cat":"CAFÉS","sub":"朱古力甜點","hours":"Mon–Thu 09:30–21:30；Fri–Sun 09:30–22:00","maps":"https://maps.google.com/?q=Maison+Marou+Station+Takashimaya","address":"B201, Level B2, Saigon Centre, 65 Lê Lợi, Sài Gòn, Hồ Chí Minh 700000, Vietnam","desc":"Maison Marou 是越南精品朱古力品牌，今次最方便的分店就在 Saigon Centre / Fusion 附近。它適合兩種用途：一是旅行中段回酒店後飲杯熱朱古力，二是最後買手信。比起普通 souvenir，Marou 朱古力包裝靚、有越南產地特色，而且容易帶回澳洲。","signature":["熱朱古力、朱古力撻、bonbon","越南產地朱古力手信","包裝靚，送禮安全牌"],"worth":["如果怕行李熱溶，最後一日或晚間買最好。","店內甜品偏濃郁，4 人 share 會比每人一份舒服。"],"categoryLabel":"☕ Cafe","price":"$–$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["熱朱古力、朱古力撻、bonbon","越南產地朱古力手信","包裝靚，送禮安全牌"],"tips":["如果怕行李熱溶，最後一日或晚間買最好。","店內甜品偏濃郁，4 人 share 會比每人一份舒服。"]},"running-bean":{"title":"The Running Bean","emoji":"☕","cat":"CAFÉS","sub":"晨間咖啡","hours":"07:30–22:00","maps":"https://maps.google.com/?q=The+Running+Bean+Ho+Chi+Minh","address":"115 Hồ Tùng Mậu, Sài Gòn, Hồ Chí Minh 70000, Vietnam","desc":"The Running Bean 係一間比較現代、明亮、旅客友善的 Saigon cafe。今次放在 Day 4 早上，角色唔係 brunch，而係入 War Museum 前的 caffeine stop：坐低 30–45 分鐘，飲杯蛋咖啡或椰子咖啡，再開始比較沉重的人文行程。","signature":["越式蛋咖啡","椰子咖啡／冰沙咖啡","明亮現代空間"],"worth":["早餐尖峰時段可能較多人，建議短坐即可。","Day 4 之後會有 Pizza 4P，不需要在這裡食太飽。"],"categoryLabel":"☕ Cafe","price":"$–$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["越式蛋咖啡","椰子咖啡／冰沙咖啡","明亮現代空間"],"tips":["早餐尖峰時段可能較多人，建議短坐即可。","Day 4 之後會有 Pizza 4P，不需要在這裡食太飽。"]},"bep-me-in":{"title":"Bếp Mẹ Ỉn","emoji":"🏡","cat":"RESTAURANTS","sub":"越式家常菜","hours":"10:30–22:30","maps":"https://maps.google.com/?q=Bếp+Mẹ+Ỉn+Ho+Chi+Minh","address":"136/9 Lê Thánh Tôn, Bến Thành, Hồ Chí Minh, Vietnam","desc":"Bếp Mẹ Ỉn 是 Michelin Bib Gourmand 越式家常菜，藏在市中心小巷內，氣氛比街邊小店舒服，但菜式仍然保留越南家庭菜與街頭味道。放在最後一日午餐很適合：不用太 formal，但又可以把 bánh xèo、椰子炒飯、越式小食一次過收尾。","signature":["Bánh Xèo 黃金煎餅","椰子炒飯","越式拼盤與家常菜"],"worth":["入口在巷內，第一次去要跟 Google Maps 慢慢找。","多人 share 最好食，4 人比 2 人更適合。"],"categoryLabel":"🍽 Restaurant","price":"$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Bánh Xèo 黃金煎餅","椰子炒飯","越式拼盤與家常菜"],"tips":["入口在巷內，第一次去要跟 Google Maps 慢慢找。","多人 share 最好食，4 人比 2 人更適合。"]},"com-tam-moc":{"title":"Cơm Tấm Mộc","emoji":"🍚","cat":"RESTAURANTS","sub":"炭烤豬排碎米飯","hours":"09:00–21:30 daily","maps":"https://maps.google.com/?q=Cơm+Tấm+Mộc+85+Lý+Tự+Trọng","address":"85 Lý Tự Trọng, Bến Thành, Hồ Chí Minh 700000, Vietnam","desc":"Cơm Tấm Mộc 是碎米飯的舒服版：保留炭烤豬排香氣，但環境比街邊小店乾淨、有冷氣。Day 2 早上放在 Cooking Class 前，重點是試一口地道早餐，而不是食到太飽。","signature":["炭烤豬排碎米飯","魚露、蛋、酸菜配搭","冷氣環境比街邊舒服"],"worth":["4 人點 2–3 份 share 已足夠，預算約 60,000–100,000 VND / 人，因為 10:00 還有 cooking class。","如果早上不餓，可以改成外帶咖啡。"],"categoryLabel":"🍽 Restaurant","price":"$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["炭烤豬排碎米飯","魚露、蛋、酸菜配搭","冷氣環境比街邊舒服"],"tips":["4 人點 2–3 份 share 已足夠，預算約 60,000–100,000 VND / 人，因為 10:00 還有 cooking class。","如果早上不餓，可以改成外帶咖啡。"]},"little-bear":{"title":"Little Bear","emoji":"🐻","cat":"RESTAURANTS","sub":"Michelin Guide 餐酒館","hours":"18:00–22:00；Monday closed","maps":"https://maps.google.com/?q=Little+Bear+Thảo+Điền","address":"36 Nguyễn Bá Huân, An Khánh, Hồ Chí Minh 700000, Vietnam","desc":"Little Bear 是 Thảo Điền 近年非常受注目的小型 wine bar / modern Vietnamese bistro。餐廳空間不大，但氣氛輕鬆，料理不是傳統大碟越菜，而是以分享盤、細緻調味和年輕主廚風格去呈現越南味道。Day 3 逛完草田區再去，地理同氣氛都最順。","signature":["Michelin Selected / Young Chef 話題","小型空間，counter/table seating 氣氛親近","越南味道 + bistro 手法，適合 share plates"],"worth":["星期一休息，必須訂位。","份量偏精緻，建議不要期待傳統大份量越菜。","不飲酒也可以去，重點是食物和氣氛。"],"categoryLabel":"🍽 Restaurant","price":"$$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Michelin Selected / Young Chef 話題","小型空間，counter/table seating 氣氛親近","越南味道 + bistro 手法，適合 share plates"],"tips":["星期一休息，必須訂位。","份量偏精緻，建議不要期待傳統大份量越菜。","不飲酒也可以去，重點是食物和氣氛。"]},"lune":{"title":"LÚNE Restaurant & Bar","emoji":"🍷","cat":"RESTAURANTS","sub":"現代越式餐廳","hours":"Mon–Sat 11:30–14:00 & 17:00–22:30；Sunday closed","maps":"https://maps.google.com/?q=LÚNE+Restaurant+Bar+Ho+Chi+Minh","address":"17/14 Lê Thánh Tôn, Sài Gòn, Hồ Chí Minh 70000, Vietnam","desc":"LÚNE Restaurant & Bar 是現代法式／fusion fine dining 路線，位置在 Lê Thánh Tôn 小巷內，氣氛比傳統酒店 fine dining 更有城市感。它適合 Day 2 晚上：白天已經 cooking class + shopping + spa，夜晚需要一餐有儀式感但不會太沉重的 dinner。","signature":["Michelin Selected 話題餐廳","法式技巧結合越南／亞洲食材","Bar + restaurant 氣氛，適合四人換裝後晚餐"],"worth":["建議提前 2–4 週預約，週日休息要留意。","Smart casual 已足夠，不需要太正式。","如果行街時間 delay，要預留回酒店換裝與 Grab 時間。"],"categoryLabel":"🍽 Restaurant","price":"$$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Michelin Selected 話題餐廳","法式技巧結合越南／亞洲食材","Bar + restaurant 氣氛，適合四人換裝後晚餐"],"tips":["建議提前 2–4 週預約，週日休息要留意。","Smart casual 已足夠，不需要太正式。","Vincom → LÚNE 約 5 分鐘 Grab。"]},"omakase-tiger":{"title":"Omakase Tiger","emoji":"🍣","cat":"RESTAURANTS","sub":"Omakase","hours":"Tue–Sun 17:30 / 20:00；Monday closed","maps":"https://maps.google.com/?q=Omakase+Tiger+The+Penthouse+Ho+Chi+Minh","address":"85/9 Phạm Viết Chánh, Thạnh Mỹ Tây, Hồ Chí Minh 700000, Vietnam","desc":"Omakase Tiger 最大賣點是「西貢景觀 + 8 座板前 + 價格相對友善」的組合。它不是傳統東京嚴肅壽司店，而是更有 Saigon rooftop 氣氛的 modern omakase。Day 1 選 17:30 場剛好遇上日落，食完再回阮惠步行街影 The Cafe Apartments 夜景，時間線很漂亮。","signature":["8-seat countertop，座位極少","17:30 日落場最有記憶點","約 10–14 道 omakase，價格比澳港日同類體驗低"],"worth":["最新 IG 曾出現 temporarily closed 訊息，出發前必須再確認營業狀態。","建議用官方／TableCheck 或 Facebook Messenger 確認訂位。"],"categoryLabel":"🍽 Restaurant","price":"$$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["8-seat countertop，座位極少","17:30 日落場最有記憶點","約 10–14 道 omakase，價格比澳港日同類體驗低"],"tips":["最新 IG 曾出現 temporarily closed 訊息，出發前必須再確認營業狀態。","建議用官方／TableCheck 或 Facebook Messenger 確認訂位。"]},"pho-sol":{"title":"Phở SOL","emoji":"🍜","cat":"RESTAURANTS","sub":"石鍋牛肉河粉","hours":"06:00–24:00 daily","maps":"https://maps.google.com/?q=Phở+SOL+32+Phạm+Hồng+Thái","address":"32 Phạm Hồng Thái, Bến Thành, Hồ Chí Minh, Vietnam","desc":"Phở SOL 是抵達後第一餐的好選擇：位置近第一郡，石鍋河粉上枱有儀式感，熱湯、牛肉、油條很適合剛落機後慢慢進入越南節奏。它比街邊河粉更乾淨舒服，適合四位朋友第一餐先穩陣開局。","signature":["石鍋河粉","牛骨湯與牛肉配料","油條 quẩy 沾湯"],"worth":["4 人可以點不同款式 share，不一定每人一碗。","第一日下機後不要排太多，食完留體力去景點和 spa。"],"categoryLabel":"🍽 Restaurant","price":"$","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["石鍋河粉","牛骨湯與牛肉配料","油條 quẩy 沾湯"],"tips":["4 人可以點不同款式 share，不一定每人一碗。","第一日下機後不要排太多，食完留體力去景點和 spa。"]},"pho-vietnam":{"title":"Phở Việt Nam Bến Thành","emoji":"🥣","cat":"RESTAURANTS","sub":"石鍋河粉","hours":"06:00–03:00 daily","maps":"https://maps.google.com/?q=Phở+Việt+Nam+14+Phạm+Hồng+Thái","address":"14 Phạm Hồng Thái, Bến Thành, Hồ Chí Minh 70000, Vietnam","desc":"Phở Việt Nam Bến Thành 是 Michelin Selected 河粉店，以 phở thố đá 石鍋河粉聞名。湯、牛肉和配料分開上，熱石鍋令湯從第一口到最後仍然滾熱。放在最後一日早餐，有一種「用一碗越南河粉收尾」的完整感。","signature":["Michelin Selected","Phở thố đá 石鍋河粉","湯保持高溫，牛肉即場燙熟"],"worth":["熱門時段可能要等位，但流轉快。","湯很熱，慢慢食比較安全。"],"categoryLabel":"🍽 Restaurant","price":"$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Michelin Selected","Phở thố đá 石鍋河粉","湯保持高溫，牛肉即場燙熟"],"tips":["熱門時段可能要等位，但流轉快。","湯很熱，慢慢食比較安全。"]},"pizza4ps":{"title":"Pizza 4P’s Hai Bà Trưng","emoji":"🍕","cat":"RESTAURANTS","sub":"自家製芝士 Pizza","hours":"Mon–Fri 11:00–23:00；Sat–Sun 10:00–23:00","maps":"https://maps.google.com/?q=Pizza+4P%27s+151B+Hai+Bà+Trưng","address":"151B Hai Bà Trưng, Võ Thị Sáu Ward, District 3, Ho Chi Minh City","desc":"Pizza 4P’s 是越南最成功的日式 pizza 品牌，重點是自家製芝士、窯烤 pizza 和穩定服務。Day 4 午餐安排它很合理：連續幾日越南菜後轉一餐西式 comfort food，而且 Võ Văn Tần 分店動線接 War Museum / District 3 很順。","signature":["House-made cheese","Burrata / 4-cheese pizza","Pasta 與 sharing dishes"],"worth":["建議預約，尤其週末或 lunch peak。","不需要點太多，下午還有 11 Garmentory / spa / dinner。"],"categoryLabel":"🍽 Restaurant","price":"$$","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["House-made cheese","Burrata / 4-cheese pizza","Pasta 與 sharing dishes"],"tips":["建議預約，尤其週末或 lunch peak。","不需要點太多，下午還有 11 Garmentory / spa / dinner。"]},"quan-thuy":{"title":"Quán Thuý 94","emoji":"🦀","cat":"RESTAURANTS","sub":"蟹肉粉絲","hours":"09:00–21:00 daily","maps":"https://maps.google.com/?q=Quán+Thuý+94+84+Đinh+Tiên+Hoàng","address":"84 Đinh Tiên Hoàng, Tân Định, Hồ Chí Minh, Vietnam","desc":"Quán Thuý 94 是蟹肉粉絲老店風格，適合 Day 3 早上先食一餐地道小店，再步行去粉紅教堂。它不是精緻 cafe，而是用蟹肉、粉絲、炸蟹春捲帶出很 Saigon 的早餐／早午餐感。","signature":["Miến cua 蟹肉粉絲","炸蟹肉春捲","Tân Định / Pink Church 動線順路"],"worth":["環境偏地道，接受度要有心理準備。","建議早去，太晚可能部分款式售完。"],"categoryLabel":"🍽 Restaurant","price":"$","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["Miến cua 蟹肉粉絲","炸蟹肉春捲","Tân Định / Pink Church 動線順路"],"tips":["環境偏地道，接受度要有心理準備。","建議早去，太晚可能部分款式售完。"]},"quince":{"title":"Quince Saigon","emoji":"🔥","cat":"RESTAURANTS","sub":"木火料理","hours":"17:30–22:30","maps":"https://maps.google.com/?q=Quince+Saigon","address":"37bis Ký Con, Bến Thành, Hồ Chí Minh, Vietnam","desc":"Quince Saigon 是最後一晚很適合的 farewell dinner。它以 wood-fired cooking、charcoal grill 和開放式廚房聞名，菜式有火烤香氣但不會太難懂。氣氛成熟、燈光暗、服務穩定，適合四人旅行最後一晚坐低慢慢回味。","signature":["Wood-fired / charcoal-grilled dishes","Open kitchen / counter seats","成熟但不拘謹的 farewell dinner 氣氛"],"worth":["如果想看廚房動作，可嘗試要求 counter seats。","燈光偏暗，影相未必最清楚，但氣氛很好。"],"categoryLabel":"🍽 Restaurant","price":"$$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Wood-fired / charcoal-grilled dishes","Open kitchen / counter seats","成熟但不拘謹的 farewell dinner 氣氛"],"tips":["如果想看廚房動作，可嘗試要求 counter seats。","燈光偏暗，影相未必最清楚，但氣氛很好。"]},"libe":{"title":"LIBÉ","emoji":"👗","cat":"SHOP","sub":"Day 2 日常女裝","hours":"09:30–21:30","maps":"https://maps.google.com/?q=LIBÉ+Ho+Chi+Minh","address":"LIBÉ Nguyễn Trãi, 52 Nguyễn Trãi, Bến Thành, Hồ Chí Minh, Vietnam","desc":"LIBÉ 的衣服不急著搶鏡，勝在比例乾淨、顏色容易相處。它像旅行途中偶然遇到的一個實用衣櫃：上班、週末、吃飯都穿得到，回到澳洲後也不容易被遺忘。","signature":["Casual chic 女裝","上班、旅行、日常都易穿","多層店面，款式更新快"],"worth":["記得上不同樓層，唔好只睇地下。","尺寸可能偏亞洲版型，最好試身。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Casual chic 女裝","上班、旅行、日常都易穿","多層店面，款式更新快"],"tips":["記得上不同樓層，唔好只睇地下。","尺寸可能偏亞洲版型，最好試身。"]},"dauple":{"title":"Dauple by Ka's","emoji":"🧵","cat":"SHOP","sub":"Day 2 亞麻真絲","hours":"09:30–21:30","maps":"https://maps.google.com/?q=Dauple+by+Ka's+Ho+Chi+Minh","address":"Dauple by Ka's, 70 Phạm Hồng Thái, Bến Thành, Hồ Chí Minh, Vietnam","desc":"Dauple by Ka’s 偏成熟、優雅、度假感，適合想買一兩件「比普通 fast fashion 更有質感」的朋友。亞麻、真絲、柔和色調和寬鬆剪裁會比街頭品牌更耐看。","signature":["亞麻／真絲質感","成熟優雅剪裁","適合旅行 resort / dinner look"],"worth":["價位通常比普通本地品牌高少少，但勝在質感。","如果只想買年輕街頭款，可留時間給 The New Playground。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["亞麻／真絲質感","成熟優雅剪裁","適合旅行 resort / dinner look"],"tips":["價位通常比普通本地品牌高少少，但勝在質感。","如果只想買年輕街頭款，可留時間給 The New Playground。"]},"nosbyn":{"title":"NOSBYN","emoji":"🤎","cat":"SHOP","sub":"Day 2 極簡日常","hours":"10:00–21:00","maps":"https://maps.google.com/?q=NOSBYN+Ho+Chi+Minh","address":"Nosbyn, 9 Phan Chu Trinh, Bến Thành, Ho Chi Minh City","desc":"NOSBYN 把簡約做得很安靜：線條俐落、顏色克制，單件未必喧鬧，放進原有衣櫃卻很容易。適合平日偏 MUJI、Lululemon 或簡潔 casual 的人慢慢試。","signature":["Minimal / timeless 女裝","布料質感與剪裁較穩","Office、旅行、日常都可重複穿"],"worth":["顏色偏 neutral，啱鍾意低調質感的人。","熱門尺碼可能不齊，看到喜歡要即試。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Minimal / timeless 女裝","布料質感與剪裁較穩","Office、旅行、日常都可重複穿"],"tips":["顏色偏 neutral，啱鍾意低調質感的人。","熱門尺碼可能不齊，看到喜歡要即試。"]},"new-playground":{"title":"The New Playground","emoji":"🛍","cat":"SHOP","sub":"Day 2 本地品牌集合","hours":"10:00–21:00","maps":"https://maps.google.com/?q=The+New+Playground+Ho+Chi+Minh","address":"26 Lý Tự Trọng, Sài Gòn, Hồ Chí Minh 700000, Vietnam","desc":"The New Playground 適合把選擇交給同行的年輕人。多個本地品牌集中在同一處，不必逐間追地址；有人看衣服、有人看帽袋，也可以約好時間再集合。","signature":["多個越南本地品牌集中","冷氣環境，適合下午避暑","Streetwear 到 accessories 都有"],"worth":["店多但不是每間都精緻，當作快速掃街最有效率。","如果時間 delay，可以只逛這裡，不逐間 boutique 追。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["多個越南本地品牌集中","冷氣環境，適合下午避暑","Streetwear 到 accessories 都有"],"tips":["店多但不是每間都精緻，當作快速掃街最有效率。","如果時間 delay，可以只逛這裡，不逐間 boutique 追。"]},"saigon-concept":{"title":"Saigon Concept","emoji":"🌿","cat":"SHOP","sub":"Day 3 Thảo Điền 選物","hours":"09:00–18:00","maps":"https://maps.google.com/?q=Saigon+Concept+Thảo+Điền","address":"14 Trần Ngọc Diện, P. Phú Thuận, An Khánh, Hồ Chí Minh 700000, Vietnam","desc":"Saigon Concept 是 Thảo Điền 很適合慢逛的 lifestyle compound：紅磚庭園、棉麻服飾、家居選物與小型品牌集中在同一區。Day 3 到草田區後先放慢節奏，由這裡開始很舒服。","signature":["庭園式複合空間","DESIGNED BY SISI / lifestyle 選物","適合拍照與慢逛"],"worth":["下午早段去比較好，部分小店可能較早關。","重點是氛圍，不一定每間都要買。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["庭園式複合空間","DESIGNED BY SISI / lifestyle 選物","適合拍照與慢逛"],"tips":["下午早段去比較好，部分小店可能較早關。","重點是氛圍，不一定每間都要買。"]},"ohquao":{"title":"OHQUAO","emoji":"🎁","cat":"SHOP","sub":"Day 3 越南設計與手信","hours":"10:00–20:00","maps":"https://maps.google.com/?q=OHQUAO+Thảo+Điền","address":"19 Đường Số 38, P. Thảo Điền, Quận 2, TP. Hồ Chí Minh","desc":"OHQUAO 像一間替現代越南做選書的店，把插畫、家品、文具與小禮物放在同一個空間。不是為了買「到此一遊」，而是挑一件回家後仍然願意使用的小東西。","signature":["在地藝術家小物","明信片、香氛、家居手信","適合買輕便 souvenir"],"worth":["不要預期大型店鋪，這類小店重點是慢慢看。","適合安排在 Mộc Hương Spa 前後順路逛。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["在地藝術家小物","明信片、香氛、家居手信","適合買輕便 souvenir"],"tips":["不要預期大型店鋪，這類小店重點是慢慢看。","適合安排在 Mộc Hương Spa 前後順路逛。"]},"garmentory":{"title":"11 Garmentory","emoji":"🧥","cat":"SHOP","sub":"Day 4 設計師選物","hours":"出發前再確認","maps":"https://maps.google.com/?q=11+Garmentory+Ho+Chi+Minh","address":"11 Garmentory, Trần Quang Diệu, District 3, Ho Chi Minh City","desc":"11 Garmentory 是 Day 4 District 3 逛街線的重點，風格偏本地設計、質感小眾，不是大量連鎖品牌。配合 Trần Quang Diệu 一帶的 cafe / boutique 氣氛，適合慢慢試衫、感受西貢比較安靜的時髦街區。","signature":["本地設計師選物","女裝／生活風格小店感","District 3 氣氛比 D1 更 local"],"worth":["小店營業時間可能變動，出發前再查 IG。","如果當日博物館或午餐 delay，可以保留 11 Garmentory 作主站，其他小店自由取捨。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["本地設計師選物","女裝／生活風格小店感","District 3 氣氛比 D1 更 local"],"tips":["小店營業時間可能變動，出發前再查 IG。","如果當日博物館或午餐 delay，可以保留 11 Garmentory 作主站，其他小店自由取捨。"]},"push-push":{"title":"Push Push Official","emoji":"👖","cat":"SHOP","sub":"Day 3 年輕人與舒適街頭款","hours":"09:30–21:30","maps":"https://maps.google.com/?q=Push+Push+Official+Ho+Chi+Minh","address":"20 Nguyễn Văn Nguyễn, Tân Định, Hồ Chí Minh 700000, Vietnam","desc":"Push Push 的輪廓年輕，但重點不只是「街頭」。寬鬆恤衫、T-shirt、長褲與帶點造型感的貼身單品，適合同行的 15–21 歲年輕人，也可能找到媽媽們旅行時會穿的舒服款。","signature":["Streetwear / casual pants","年輕感、寬鬆剪裁","粉紅教堂附近可順路"],"worth":["這類品牌 IG 資訊可能比 Google 準，出發前查 IG 最穩。","不是每位朋友都會啱，可作分組自由逛。"],"categoryLabel":"🛍 Shopping","price":"Varies","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Streetwear / casual pants","年輕感、寬鬆剪裁","粉紅教堂附近可順路"],"tips":["這類品牌 IG 資訊可能比 Google 準，出發前查 IG 最穩。","不是每位朋友都會啱，可作分組自由逛。"]},"nha-suga":{"title":"Spa Nhà Suga Premium","emoji":"💆","cat":"SPA","sub":"Day 1 Head Spa","hours":"出發前再確認","maps":"https://maps.google.com/?q=Spa+Nhà+Suga+Premium","address":"Spa Nhà Suga Premium, The Cafe Apartments, 42 Nguyễn Huệ, District 1, Ho Chi Minh City","desc":"Spa Nhà Suga Premium 的賣點是 head spa / scalp care，而不是傳統全身按摩。安排在 Day 1 下午很聰明：剛落機、頭皮和肩頸繃緊，做完再吹好頭髮，晚上去 Omakase Tiger 會精神很多。","signature":["Korean-style head spa / scalp care","肩頸放鬆","位於 The Cafe Apartments，同日夜景動線順"],"worth":["評論提過可能 overbook，出發前務必 WhatsApp 確認。","做完頭髮要確認有足夠時間吹乾再去晚餐。"],"categoryLabel":"💆 Spa","price":"$$","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["Korean-style head spa / scalp care","肩頸放鬆","位於 The Cafe Apartments，同日夜景動線順"],"tips":["評論提過可能 overbook，出發前務必 WhatsApp 確認。","做完頭髮要確認有足夠時間吹乾再去晚餐。"]},"moc-kim":{"title":"Mộc Kim Spa & Beauty","emoji":"🌿","cat":"SPA","sub":"Day 2 Spa · Bến Thành branch","hours":"09:00–21:00 daily","maps":"https://maps.google.com/?q=Mộc+Kim+Spa+Beauty+143+Lê+Thị+Hồng+Gấm","address":"143 Lê Thị Hồng Gấm, Bến Thành Ward, Ho Chi Minh City","desc":"Mộc Kim Spa & Beauty Day 2 改用 Bến Thành／Nguyễn Thái Bình 這間分店，位置更適合 Cooking Class 後先去放鬆，再接 Nguyễn Trãi shopping route。13:15–15:15 這段安排剛好讓身體從早上的廚藝課和市場節奏慢下來，做完 spa 再開始購物會舒服很多。","signature":["Bến Thành 旁邊分店，銜接 Day 2 flow 更順","足底按摩、身體按摩、草本洗頭都適合午後休息","營業時間 08:30–21:00，Day 2 13:15–15:15 時段穩陣"],"worth":["建議預約 13:15–15:15，避免 walk-in 等位。","Spa 後直接 Grab 約 10 分鐘去 LIBÉ，正式開始購物 flow。","Phone：+84 968 459 618。"],"categoryLabel":"💆 Spa","price":"$$","transport":"Grab / walk depending on current route","audit":"Updated to Bến Thành branch; hours 08:30–21:00; phone +84 968 459 618","highlights":["越式草本洗頭","足底穴位按摩","可作 shopping 後回復站"],"tips":["建議預約 13:15–15:15，避免 walk-in 等位。","Spa 後直接 Grab 約 10 分鐘去 LIBÉ，正式開始購物 flow。","電話：+84 968 459 618"]},"moc-huong":{"title":"Mộc Hương Wellness","emoji":"🏡","cat":"SPA","sub":"Day 3 Villa Wellness","hours":"09:00–22:00","maps":"https://maps.google.com/?q=Mộc+Hương+Wellness+Thảo+Điền","address":"61 Xuân Thủy, Thủ Đức, Hồ Chí Minh 700000, Vietnam","desc":"Mộc Hương Wellness Thảo Điền 走高級 villa spa 路線，環境比普通按摩店更度假。Day 3 逛草田區後在這裡做熱石／精油按摩，再去 Little Bear，整日節奏會很一致：慢、綠意、輕奢。","signature":["Villa-style spa setting","熱石／精油按摩","Thảo Điền 動線極順"],"worth":["比市區普通 spa 價位高，但環境感更好。","做完按摩去 Little Bear 只需短 Grab，唔需要返 D1 再出來。"],"categoryLabel":"💆 Spa","price":"$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["Villa-style spa setting","熱石／精油按摩","Thảo Điền 動線極順"],"tips":["比市區普通 spa 價位高，但環境感更好。","做完按摩去 Little Bear 只需短 Grab，唔需要返 D1 再出來。"]},"tinh-thuc":{"title":"Tỉnh Thức Spa","emoji":"💆","cat":"SPA","sub":"Day 4 body massage + facial","hours":"10:00–21:00 daily","maps":"https://maps.google.com/?q=Tỉnh+Thức+Spa+118%2F54+Trần+Quang+Diệu","address":"118/54 Trần Quang Diệu, Nhiêu Lộc, Hồ Chí Minh 700000, Vietnam","desc":"Tỉnh Thức Spa 是 Day 4 Phú Nhuận／District 3 shopping route 中間的休息站。它藏在 Trần Quang Diệu 巷內，位置剛好接住第一輪 shopping，再沿同一條街去 Dalla、Rubies 等第二輪店舖，無需折返 District 1。環境走安靜小型 spa 路線，適合做身體按摩、面部護理或草本洗頭。","signature":["90 分鐘身體按摩 + 面部護理","安靜巷內小型 spa","接住 Trần Quang Diệu shopping 動線"],"worth":["由 11 Garmentory／第一輪 shopping 過來順路，完成後可繼續行 Dalla 與 Rubies。","入口在 118 號巷內：由巷口行到底再左轉；建議預約並預留找入口時間。","Hotline / WhatsApp：+84 989 611 854"],"categoryLabel":"💆 Spa","price":"$$","transport":"Walk from nearby shopping / Grab depending on current route","audit":"Verified against official website and current public listings","highlights":["90 分鐘身體按摩 + 面部護理","安靜巷內小型 spa","接住 Trần Quang Diệu shopping 動線"],"tips":["由 11 Garmentory／第一輪 shopping 過來順路，完成後可繼續行 Dalla 與 Rubies。","入口在 118 號巷內：由巷口行到底再左轉；建議預約並預留找入口時間。","Hotline / WhatsApp：+84 989 611 854"]},"ha-spa":{"title":"Hạ Spa","emoji":"✈️","cat":"SPA","sub":"Day 5 機場前 Spa","hours":"09:00–21:00 daily","maps":"https://maps.google.com/?q=Hạ+Spa+334+Nguyễn+Trọng+Tuyển","address":"334 Nguyễn Trọng Tuyển, Ward 2, Tân Bình District, Hồ Chí Minh 700000, Vietnam","desc":"Hạ Spa 是最後一日飛機前的 airport-side spa。最大優勢是距離新山一機場近、可寄存行李，適合在搭夜機前洗頭、按摩、整理狀態，不用一身汗上機。","signature":["近機場","行李寄存","洗頭 + 全身放鬆 package"],"worth":["最後一日時間要保守，不要排太晚。","預約時確認行李寄存、吹髮、叫車到機場時間。"],"categoryLabel":"💆 Spa","price":"$$","transport":"Grab / walk depending on current route","audit":"Needs branch/address check","highlights":["近機場","行李寄存","洗頭 + 全身放鬆 package"],"tips":["最後一日時間要保守，不要排太晚。","預約時確認行李寄存、吹髮、叫車到機場時間。"]},"post-office":{"title":"Saigon Central Post Office","emoji":"📮","cat":"ATTRACTIONS","sub":"法式郵局","hours":"Mon–Fri 07:00–19:00；Sat 07:00–18:00；Sun 08:00–18:00","maps":"https://maps.google.com/?q=Saigon+Central+Post+Office","address":"Saigon Central Post Office, 2 Công xã Paris, Bến Nghé, District 1, Ho Chi Minh City","desc":"西貢中央郵政局是最容易安排、最有法式殖民建築感的經典景點。金黃色拱頂、古老地圖、木製電話亭都很上鏡，而且仍然是運作中的郵局。Day 1 放在抵達後不會太累，因為它和紅教堂、書街三點幾乎連在一起。","signature":["金黃色拱頂大廳","法式殖民建築","可買明信片／郵票"],"worth":["免費入場，停留 20–30 分鐘已夠。","人多時先拍建築細節，不一定要等無人全景。"],"categoryLabel":"📍 Attraction","price":"Free","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["金黃色拱頂大廳","法式殖民建築","可買明信片／郵票"],"tips":["免費入場，停留 20–30 分鐘已夠。","人多時先拍建築細節，不一定要等無人全景。"]},"notre-dame":{"title":"Notre-Dame Cathedral","emoji":"⛪","cat":"ATTRACTIONS","sub":"紅磚教堂","hours":"外觀打卡；內部開放情況出發前確認","maps":"https://maps.google.com/?q=Notre-Dame+Cathedral+Basilica+of+Saigon","address":"Notre-Dame Cathedral Basilica of Saigon, Công xã Paris, Bến Nghé, District 1, Ho Chi Minh City","desc":"西貢聖母聖殿主教座堂是中央郵政局對面的紅磚地標。近年常有修復工程，重點應放在外觀打卡與和郵政局／書街形成一個短小經典路線，不建議專程安排太長時間。","signature":["紅磚外觀","郵政局對面","經典 D1 地標合照"],"worth":["內部是否開放常受工程／宗教活動影響，當作外觀景點最穩。","中午光線硬，早上或傍晚拍照較舒服。"],"categoryLabel":"📍 Attraction","price":"Free","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["紅磚外觀","郵政局對面","經典 D1 地標合照"],"tips":["內部是否開放常受工程／宗教活動影響，當作外觀景點最穩。","中午光線硬，早上或傍晚拍照較舒服。"]},"book-street":{"title":"Nguyễn Văn Bình Book Street","emoji":"📚","cat":"ATTRACTIONS","sub":"書街散步","hours":"Mon–Fri 08:00–21:00；Sat–Sun 08:00–21:30","maps":"https://maps.google.com/?q=Nguyễn+Văn+Bình+Book+Street","address":"Nguyễn Văn Bình Book Street, Bến Nghé, District 1, Ho Chi Minh City","desc":"Nguyễn Văn Bình Book Street 夾在郵政局與紅教堂旁邊，是短短一條步行文化街。書店、咖啡、文創攤位集中，適合在 Day 1 三大景點中作一個較輕鬆的過渡位。","signature":["步行書街","書店、文創、咖啡小攤","與郵政局／紅教堂相連"],"worth":["不是大型景點，停留 20–40 分鐘即可。","若太熱，可以只穿過拍照，不必硬逛每間店。"],"categoryLabel":"📍 Attraction","price":"Free","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["步行書街","書店、文創、咖啡小攤","與郵政局／紅教堂相連"],"tips":["不是大型景點，停留 20–40 分鐘即可。","若太熱，可以只穿過拍照，不必硬逛每間店。"]},"pink-church":{"title":"Tân Định Church","emoji":"🌸","cat":"ATTRACTIONS","sub":"粉紅教堂","hours":"外觀打卡；內部開放情況出發前確認","maps":"https://maps.google.com/?q=Tân+Định+Church","address":"Tan Dinh Church, 289 Hai Bà Trưng, Ward 8, District 3, Ho Chi Minh City","desc":"新定教堂／粉紅教堂是 Saigon 最容易出片的地標之一。粉紅色外牆本身已經很有記憶點，配對面 Cộng Cà Phê 的樓上視角，可以一次拍到近景和俯瞰全景。","signature":["粉紅外牆","對面 cafe 視角","Tân Định 街區順路早餐"],"worth":["內部開放不穩，當作外觀打卡最實際。","早上光線和人流通常較友善。"],"categoryLabel":"📍 Attraction","price":"Free","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["粉紅外牆","對面 cafe 視角","Tân Định 街區順路早餐"],"tips":["內部開放不穩，當作外觀打卡最實際。","早上光線和人流通常較友善。"]},"war-museum":{"title":"War Remnants Museum","emoji":"🏛","cat":"ATTRACTIONS","sub":"戰爭遺跡博物館","hours":"07:30–17:30","maps":"https://maps.google.com/?q=War+Remnants+Museum","address":"War Remnants Museum, 28 Võ Văn Tần, District 3, Ho Chi Minh City","desc":"戰爭遺跡博物館是今次最沉重但最值得保留的人文景點。展覽以照片、文字和戰爭後果為主，內容不輕鬆，但能讓整個旅程不只是吃喝購物，也真正理解這座城市的歷史厚度。","signature":["越戰相關照片與史料","館內有冷氣，適合上午安排","與 District 3 / Pizza 4P’s 動線順"],"worth":["建議預留 90–120 分鐘，比「打卡景點」需要更多情緒空間。","看完可安排 Pizza 4P’s 或 cafe 作心理緩衝。"],"categoryLabel":"📍 Attraction","price":"Ticketed","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["越戰相關照片與史料","館內有冷氣，適合上午安排","與 District 3 / Pizza 4P’s 動線順"],"tips":["建議預留 90–120 分鐘，比「打卡景點」需要更多情緒空間。","看完可安排 Pizza 4P’s 或 cafe 作心理緩衝。"]},"fine-arts":{"title":"Fine Arts Museum","emoji":"🖼","cat":"ATTRACTIONS","sub":"黃色法式美術館","hours":"08:00–17:00 daily","maps":"https://maps.google.com/?q=Ho+Chi+Minh+City+Museum+of+Fine+Arts","address":"Ho Chi Minh City Museum of Fine Arts, 97A Phó Đức Chính, District 1, Ho Chi Minh City","desc":"胡志明市美術館是一座黃色法式大宅，比起展品本身，建築、樓梯、彩色玻璃、舊式地磚和復古感更容易令人留下印象。Day 5 上午安排它很適合：節奏慢、拍照靚、又不會太消耗體力。","signature":["黃色法式建築","彩色玻璃、樓梯、復古地磚","適合王家衛感照片"],"worth":["館內部分位置沒有強冷氣，早上去較舒服。","建議停留 60–90 分鐘。"],"categoryLabel":"📍 Attraction","price":"Ticketed","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["黃色法式建築","彩色玻璃、樓梯、復古地磚","適合王家衛感照片"],"tips":["館內部分位置沒有強冷氣，早上去較舒服。","建議停留 60–90 分鐘。"]},"cooking":{"title":"Saigon Cooking Class","emoji":"👩🏻‍🍳","cat":"EXPERIENCE","sub":"越式廚藝課","hours":"10:00–13:00（固定課程）","maps":"https://maps.google.com/?q=Saigon+Cooking+Class","address":"Saigon Cooking Class, 74 Hai Bà Trưng, Bến Nghé, District 1, Ho Chi Minh City","desc":"Saigon Cooking Class 是 Day 2 的主活動：不是單純食 lunch，而是透過市場／食材／實作去理解越南菜。對四位朋友來說，這種共同完成一餐的 activity 比普通景點更容易成為旅行記憶。","signature":["3 小時越菜體驗","親手做菜，即場享用作午餐","適合四人共同參與"],"worth":["課程時間固定，Day 2 早上不要排太緊。","早餐要輕食，留肚食自己煮的午餐。"],"categoryLabel":"🍳 Experience","price":"Pre-booked","transport":"Grab / walk depending on current route","audit":"Route-ready; check live hours before visit","highlights":["3 小時越菜體驗","親手做菜，即場享用作午餐","適合四人共同參與"],"tips":["課程時間固定，Day 2 早上不要排太緊。","早餐要輕食，留肚食自己煮的午餐。"]},"general":{"title":"Moments","emoji":"✨","cat":"MOMENTS","sub":"Every place has a story","desc":"每一個地方都可以留底 rating、something to say 同相片。","categoryLabel":"✨ Moments","price":"Memory","hours":"Anytime","maps":"#","address":"Saigon Companion"},"workshop-coffee":{"title":"The Workshop Coffee","emoji":"☕","cat":"CAFÉS","sub":"Day 1 · Nguyễn Huệ 附近咖啡選項","hours":"約 08:00–20:30；出發前再確認","maps":"https://www.google.com/maps/search/?api=1&query=The+Workshop+Coffee+27+Ngo+Duc+Ke+Ho+Chi+Minh","address":"27 Ngô Đức Kế, Bến Nghé, District 1, Ho Chi Minh City","desc":"藏在 Ngô Đức Kế 老樓上層的 specialty coffee 空間，離 Nguyễn Huệ Walking Street 與 The Cafe Apartments 只是一小段步程。高樓底、長木枱與工業感不刻意討好鏡頭，反而適合在第一日的城市喧鬧之間，留一段安靜喝咖啡的空白。","signature":["以手沖、espresso 與 specialty coffee 為主","樓上空間寬敞，適合短坐或慢慢聊天","由 Café Apartments 一帶步行前往，毋須另開一段行程"],"worth":["這是 read-only nearby option，不會取代原定 Day 1 行程。","入口較低調，跟 Google Maps 到 27 Ngô Đức Kế 後再留意上樓指示。"],"categoryLabel":"☕ Cafe · Optional","price":"$–$$","transport":"Walk from Nguyễn Huệ / Cafe Apartments","audit":"Address cross-checked July 2026; recheck live hours before visit","highlights":["以手沖、espresso 與 specialty coffee 為主","樓上空間寬敞，適合短坐或慢慢聊天","由 Café Apartments 一帶步行前往，毋須另開一段行程"],"tips":["這是 read-only nearby option，不會取代原定 Day 1 行程。","入口較低調，跟 Google Maps 到 27 Ngô Đức Kế 後再留意上樓指示。"]}};

const CATEGORIES={"STAY": [{"key": "fusion", "title": "Fusion Original Saigon Centre", "emoji": "🏨", "sub": "酒店據點"}], "CAFÉS": [{"key": "bakes", "title": "Bakes Thảo Điền", "emoji": "🥐", "sub": "法式甜點"}, {"key": "cong", "title": "Cộng Cà Phê Tân Định", "emoji": "🥥", "sub": "粉紅教堂景觀咖啡"}, {"key": "marou", "title": "Maison Marou Saigon", "emoji": "🍫", "sub": "朱古力甜點"}, {"key": "cafe-apartments", "title": "The Cafe Apartments", "emoji": "🌃", "sub": "老公寓咖啡樓"}, {"key": "running-bean", "title": "The Running Bean", "emoji": "☕", "sub": "晨間咖啡"}], "RESTAURANTS": [{"key": "bep-me-in", "title": "Bếp Mẹ Ỉn", "emoji": "🏡", "sub": "越式家常菜"}, {"key": "com-tam-moc", "title": "Cơm Tấm Mộc", "emoji": "🍚", "sub": "炭烤豬排碎米飯"}, {"key": "little-bear", "title": "Little Bear", "emoji": "🐻", "sub": "Michelin Guide 餐酒館"}, {"key": "lune", "title": "LÚNE Restaurant & Bar", "emoji": "🍷", "sub": "現代越式餐廳"}, {"key": "omakase-tiger", "title": "Omakase Tiger", "emoji": "🍣", "sub": "Omakase"}, {"key": "pho-sol", "title": "Phở SOL", "emoji": "🍜", "sub": "石鍋牛肉河粉"}, {"key": "pho-vietnam", "title": "Phở Việt Nam Bến Thành", "emoji": "🥣", "sub": "石鍋河粉"}, {"key": "pizza4ps", "title": "Pizza 4P’s Võ Văn Tần", "emoji": "🍕", "sub": "自家製芝士 Pizza"}, {"key": "quince", "title": "Quince Saigon", "emoji": "🔥", "sub": "木火料理"}, {"key": "quan-thuy", "title": "Quán Thuý 94", "emoji": "🦀", "sub": "蟹肉粉絲"}], "SHOP": [{"key": "garmentory", "title": "11 Garmentory", "emoji": "🧥", "sub": "Day 4 設計師選物"}, {"key": "dauple", "title": "Dauple by Ka's", "emoji": "🧵", "sub": "Day 2 亞麻真絲"}, {"key": "libe", "title": "LIBÉ", "emoji": "👗", "sub": "Day 2 女裝"}, {"key": "nosbyn", "title": "NOSBYN", "emoji": "🤎", "sub": "Day 2 極簡女裝"}, {"key": "ohquao", "title": "OHQUAO", "emoji": "🎁", "sub": "Day 3 手信選物"}, {"key": "push-push", "title": "Push Push Official", "emoji": "👖", "sub": "Day 4 Streetwear"}, {"key": "saigon-concept", "title": "Saigon Concept", "emoji": "🌿", "sub": "Day 3 Thảo Điền 選物"}, {"key": "new-playground", "title": "The New Playground", "emoji": "🛍", "sub": "Day 2 本地品牌集合"}], "SPA": [{"key": "ha-spa", "title": "Hạ Spa", "emoji": "✈️", "sub": "Day 5 機場前 Spa"}, {"key": "moc-huong", "title": "Mộc Hương Wellness", "emoji": "🏡", "sub": "Day 3 Villa Wellness"}, {"key": "moc-kim", "title": "Mộc Kim Spa & Beauty", "emoji": "🌿", "sub": "Day 2 足底＋草本洗頭"}, {"key": "nha-suga", "title": "Spa Nhà Suga Premium", "emoji": "💆", "sub": "Day 1 Head Spa"}, {"key": "tinh-thuc", "title": "Tỉnh Thức Spa", "emoji": "💆", "sub": "Day 4 body massage + facial"}], "ATTRACTIONS": [{"key": "fine-arts", "title": "Fine Arts Museum", "emoji": "🖼", "sub": "黃色法式美術館"}, {"key": "book-street", "title": "Nguyễn Văn Bình Book Street", "emoji": "📚", "sub": "書街散步"}, {"key": "notre-dame", "title": "Notre-Dame Cathedral", "emoji": "⛪", "sub": "紅磚教堂"}, {"key": "post-office", "title": "Saigon Central Post Office", "emoji": "📮", "sub": "法式郵局"}, {"key": "pink-church", "title": "Tân Định Church", "emoji": "🌸", "sub": "粉紅教堂"}, {"key": "war-museum", "title": "War Remnants Museum", "emoji": "🏛", "sub": "戰爭遺跡博物館"}], "EXPERIENCE": [{"key": "cooking", "title": "Saigon Cooking Class", "emoji": "👩🏻‍🍳", "sub": "越式廚藝課"}]};

const DAY_LINKS={
  fusion:[['Day 1','day.html?day=1#fusion']],
  'pho-sol':[['Day 1','day.html?day=1#pho-sol']],
  'post-office':[['Day 1','day.html?day=1#post-office']],
  'notre-dame':[['Day 1','day.html?day=1#post-office']],
  'book-street':[['Day 1','day.html?day=1#post-office']],
  'nha-suga':[['Day 1','day.html?day=1#nha-suga']],
  'tinh-thuc':[['Day 4','day.html?day=4#tinh-thuc']],
  'omakase-tiger':[['Day 1','day.html?day=1#omakase-tiger']],
  'cafe-apartments':[['Day 1','day.html?day=1#cafe-apartments']],
  'com-tam-moc':[['Day 2','day.html?day=2#com-tam-moc']],
  cooking:[['Day 2','day.html?day=2#cooking']],
  libe:[['Day 2','day.html?day=2#libe']],
  dauple:[['Day 2','day.html?day=2#libe']],
  nosbyn:[['Day 2','day.html?day=2#libe']],
  'new-playground':[['Day 2','day.html?day=2#libe']],
  'moc-kim':[['Day 2','day.html?day=2#moc-kim']],
  lune:[['Day 2','day.html?day=2#lune']],
  'quan-thuy':[['Day 3','day.html?day=3#quan-thuy']],
  'pink-church':[['Day 3','day.html?day=3#pink-church']],
  cong:[['Day 3','day.html?day=3#pink-church']],
  'push-push':[['Day 3','day.html?day=3#push-push']],
  'saigon-concept':[['Day 3','day.html?day=3#saigon-concept']],
  bakes:[['Day 3','day.html?day=3#bakes']],
  ohquao:[['Day 3','day.html?day=3#ohquao']],
  'moc-huong':[['Day 3','day.html?day=3#moc-huong']],
  'little-bear':[['Day 3','day.html?day=3#little-bear']],
  marou:[['Day 3','day.html?day=3#marou'],['Day 5','day.html?day=5#takashimaya']],
  'running-bean':[['Day 4','day.html?day=4#running-bean']],
  'war-museum':[['Day 4','day.html?day=4#war-museum']],
  pizza4ps:[['Day 4','day.html?day=4#pizza4ps']],
  garmentory:[['Day 4','day.html?day=4#garmentory']],
  'temple-leaf':[['Day 4','day.html?day=4#temple-leaf']],
  quince:[['Day 4','day.html?day=4#quince']],
  'pho-vietnam':[['Day 5','day.html?day=5#pho-vietnam']],
  'fine-arts':[['Day 5','day.html?day=5#fine-arts']],
  'bep-me-in':[['Day 5','day.html?day=5#bep-me-in']],
  'ha-spa':[['Day 5','day.html?day=5#ha-spa']]
};

const GUIDE_ORDER=["fusion", "bakes", "cong", "marou", "cafe-apartments", "running-bean", "bep-me-in", "com-tam-moc", "little-bear", "lune", "omakase-tiger", "pho-sol", "pho-vietnam", "pizza4ps", "quince", "quan-thuy", "garmentory", "dauple", "libe", "nosbyn", "ohquao", "push-push", "saigon-concept", "new-playground", "ha-spa", "moc-huong", "moc-kim", "nha-suga", "tinh-thuc", "fine-arts", "book-street", "notre-dame", "post-office", "pink-church", "war-museum", "cooking"];

const FRIENDS={christal:"🧸 Christal",crystal:"👓 Crystal",mero:"✝️ Mero",vivian:"👟 Vivian"};

const TRIP_DATA = {"checklist":{"title":"✅ Checklist","body":"<div class='checklist-mini trip-checklist-compact'><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Passport</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> E-Visa</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Travel Insurance</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Credit Card</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> AUD 500 Cash</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> eSIM</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Grab App</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Offline Maps</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Power Bank</label><label class='check-row'><input type='checkbox' data-check onchange='saveChecklist()'> Online Check-in</label><div class='ready-box' id='readyBox'><h2>✈ WE ARE READY</h2><p>Let's Go!</p></div></div>"},"city":{"title":"🇻🇳 City","body":"<p>Ho Chi Minh City 仍然被很多人親切稱為 Saigon。它是越南最有城市能量的地方：法式殖民建築、摩托車河流、咖啡文化、設計師小店同現代餐廳全部混在一起。</p><div class='fact-grid city-facts'><div class='fact'><strong>Currency</strong>Vietnamese Dong · VND</div><div class='fact'><strong>Time zone</strong>UTC +7</div><div class='fact'><strong>Transport</strong>Grab 最方便</div><div class='fact'><strong>Late Oct</strong>Hot · humid · showers possible</div></div><h3>Useful to Know</h3><ul><li>短程交通以 Grab 為主，4 人通常叫 6-seater 會舒服啲。</li><li>現金留俾小店、tips、街邊食物同 Spa。</li><li>下午戶外行程要留冷氣位；中午至下午最熱。</li><li>Saigon 同 Ho Chi Minh City 兩個名稱都會見到。</li><li>過馬路保持穩定步速，唔好突然停低。</li></ul>"},"emergency":{"title":"☎️ Emergency","body":"<div class='fact-grid trip-facts-compact'><div class='fact'><strong>Police</strong><a href='tel:113'>113</a></div><div class='fact'><strong>Fire</strong><a href='tel:114'>114</a></div><div class='fact'><strong>Ambulance</strong><a href='tel:115'>115</a></div><div class='fact'><strong>Hotel</strong><a href='tel:+842836222265'>+84 28 3622 2265</a></div><div class='fact'><strong>Australian Consulate-General</strong><a href='tel:+842835218100'>+84 28 3521 8100</a><br>20/F Vincom Centre, 47 Lý Tự Trọng, D1</div><div class='fact'><strong>24-hour Consular Emergency</strong><a href='tel:+61262613305'>+61 2 6261 3305</a></div><div class='fact'><strong>Nhà Suga Spa</strong><a href='tel:+84935227989'>+84 935 227 989</a></div><div class='fact'><strong>Mộc Hương Wellness</strong><a href='tel:+842837444550'>+84 28 3744 4550</a></div><div class='fact'><strong>Little Bear</strong><a href='tel:+84862512086'>+84 862 512 086</a></div><div class='fact'><strong>Pizza 4P’s Hai Bà Trưng</strong><a href='tel:+842836220500'>+84 28 3622 0500</a></div></div><p class='timestamp'>Local emergency lines may operate mainly in Vietnamese. Contact the hotel or travel insurer when practical.</p>"},"flights":{"title":"✈️ Flights","body":"<div class='fact-grid trip-facts-compact'><div class='fact'><strong>Outbound · Fri 30 Oct</strong>VietJet VJ082<br>MEL 01:30 → SGN 05:55<br>7kg carry-on · 20kg checked</div><div class='fact'><strong>Return · Tue 3 Nov</strong>Vietnam Airlines VN781<br>SGN 21:10 → MEL 09:25 +1<br>7kg carry-on · 20kg checked</div></div>"},"money":{"title":"💵 Money","body":"<p>信用卡為主，AUD 500 cash 作 backup；小店、街邊食店、tips、market 仍建議有現金。</p><div class='exchange-card trip-exchange-compact'><p class='kicker'>Reference Rate</p><h3>1 AUD ≈ 18,126 VND</h3><div class='exchange-grid'><div><strong>AUD 10</strong><span>≈181k</span></div><div><strong>AUD 50</strong><span>≈906k</span></div><div><strong>AUD 100</strong><span>≈1.81m</span></div><div><strong>AUD 500</strong><span>≈9.06m</span></div></div></div><p class='timestamp'>Approximate reference · 02/07/2026</p>"},"stay":{"title":"🏨 Stay","body":"<p><strong>Fusion Original Saigon Centre</strong><br>今次四人行的城市 base。位置連住 Saigon Centre / Takashimaya，落雨、太熱或者夜晚返酒店都方便。</p><div class='hotel-card'><p class='kicker'>Hotel Address</p><p><strong>Fusion Original Saigon Centre</strong><br>65 Đường Lê Lợi<br>Takashimaya Saigon Centre<br>District 1, Ho Chi Minh City, Vietnam</p><div class='guide-next-row'><button class='pill' onclick=\"copyText('Fusion Original Saigon Centre, 65 Đường Lê Lợi, Takashimaya Saigon Centre, District 1, Ho Chi Minh City, Vietnam')\">📋 Copy Address</button></div></div><div class='fact-grid hotel-facts'><div class='fact'><strong>Phone</strong><a href='tel:+842836222265'>+84 28 3622 2265</a></div><div class='fact'><strong>Check-in</strong>2:00 pm – 12:00 am</div><div class='fact'><strong>Check-out</strong>Before 12:00 pm</div><div class='fact'><strong>Room</strong>2 Bedroom Suite</div></div>"},"tips":{"title":"⚠️ Tips","body":"<ul class='trip-list-compact'><li>短程交通以 Grab 為主。</li><li>過馬路保持穩定步速，唔好突然停。</li><li>人多地方手機同袋放前面。</li><li>Spa tips 唔係必須，服務好可酌量俾。</li></ul>"},"weather":{"title":"☀️ Weather","body":"<p>10月尾通常炎熱潮濕，大約 29–33°C。下午可能有短暫驟雨，建議帶小傘、紙巾、薄外套入商場。</p>"}};

const TRIP_ORDER = ["checklist", "city", "emergency", "flights", "money", "stay", "tips", "weather"];


/* ============================================================================
   STAGE 1.5 — INFORMATION MIGRATION TEMPLATE
   ----------------------------------------------------------------------------
   Added: 2026-07-09. See STAGE_1_5_INFORMATION_MIGRATION.md for full detail.

   Purpose: prepare a data shape for final itinerary / booking details so that
   filling in real confirmations later is a data-entry task, not a rebuild.

   IMPORTANT — nothing below is wired into any current render path.
   PLACES, CATEGORIES, DAY_LINKS, GUIDE_ORDER, FRIENDS, TRIP_DATA, TRIP_ORDER
   (all defined above this block) are UNCHANGED and remain exactly what Trip,
   Guide, Days, Moments, Expenses, Comments and Emoji reactions read from.
   Everything below is new, additive, and inert until a future stage
   deliberately calls the helper functions in script.js and adds markup.
   ============================================================================ */

/* ----------------------------------------------------------------------
   1. BOOKINGS_DATA
   ----------------------------------------------------------------------
   One entry per booking (restaurant / spa / cooking class / airport
   transfer / hotel / ticket-experience). Keyed by booking id.

   Field reference (every booking SHOULD carry these; use null/'' when a
   real value isn't known yet rather than omitting the key, so future
   renderers can rely on the key existing):

     id                    string   unique booking id, same as the object key
     type                  string   'restaurant' | 'spa' | 'cookingClass' |
                                     'airportTransfer' | 'hotel' | 'ticket'
     title                 string   display name for the booking
     status                string   'confirmed' | 'pending' | 'toBook' | 'cancelled'
     date                  string   'YYYY-MM-DD' or null if not yet fixed
     time                  string   'HH:mm' (24h) or a range string, or null
     placeId               string|null  key into PLACES, when the booking maps
                                          to an existing place; null if it doesn't
                                          (e.g. airport transfer has no PLACES entry)
     dayId                 string|null  'day1'..'day5' or null if not yet assigned
     guests                number   party size, defaults to 4 for this trip
     reference             string|null  confirmation / booking reference number
     contact               string|null  phone or contact person for the venue
     address               string|null  street address (mirror PLACES.address
                                          when placeId is set, so this still
                                          works standalone if placeId is null)
     mapUrl                string|null  Google Maps link
     paymentStatus         string   'unpaid' | 'deposit' | 'paid' | 'payOnSite'
     notes                 string   free text, Cantonese/English mixed is fine
     reminders             array    list of {label, whenISO} reminder objects;
                                     empty array if none set yet
     attachmentsPlaceholder array   list of {label, url} placeholders for future
                                     confirmation emails / PDFs / screenshots;
                                     empty array if none yet — this is a
                                     placeholder shape only, no file upload
                                     mechanism exists yet in this codebase
   ------------------------------------------------------------------- */
const BOOKINGS_DATA = {

  /* --- Sample 1: restaurant booking, linked to an existing PLACES entry --- */
  "omakase-tiger-booking": {
    id: "omakase-tiger-booking",
    type: "restaurant",
    title: "Omakase Tiger — Dinner",
    status: "toBook",
    date: "2026-10-30",
    time: "17:30",
    placeId: "omakase-tiger",
    dayId: "day1",
    guests: 4,
    reference: null,
    contact: null,
    address: "85/9 Phạm Viết Chánh, Thạnh Mỹ Tây, Hồ Chí Minh 700000, Vietnam",
    mapUrl: "https://maps.google.com/?q=Omakase+Tiger+The+Penthouse+Ho+Chi+Minh",
    paymentStatus: "unpaid",
    notes: "17:30 日落場，出發前需再確認營業狀態（IG 曾顯示 temporarily closed）。",
    reminders: [],
    attachmentsPlaceholder: []
  },

  /* --- Sample 2: pre-booked experience, linked to an existing PLACES entry --- */
  "cooking-class-booking": {
    id: "cooking-class-booking",
    type: "cookingClass",
    title: "Saigon Cooking Class",
    status: "confirmed",
    date: "2026-10-31",
    time: "10:00–13:00",
    placeId: "cooking",
    dayId: "day2",
    guests: 4,
    reference: null,
    contact: null,
    address: "Saigon Cooking Class, 74 Hai Bà Trưng, Bến Nghé, District 1, Ho Chi Minh City",
    mapUrl: "https://maps.google.com/?q=Saigon+Cooking+Class",
    paymentStatus: "deposit",
    notes: "課程時間固定 10:00–13:00，Day 2 早上行程唔好排太緊；早餐食輕食，留肚食自己煮嘅午餐。",
    reminders: [],
    attachmentsPlaceholder: []
  },

  /* --- Sample 3: logistics booking with no PLACES entry (placeId stays null
         on purpose — this demonstrates the "no matching place" case) --- */
  "airport-transfer-booking": {
    id: "airport-transfer-booking",
    type: "airportTransfer",
    title: "SGN Airport → Fusion Original Saigon Centre",
    status: "pending",
    date: "2026-10-30",
    time: "06:30",
    placeId: null,
    dayId: "day1",
    guests: 4,
    reference: null,
    contact: null,
    address: "Tan Son Nhat International Airport (SGN)",
    mapUrl: "https://maps.google.com/?q=Tan+Son+Nhat+International+Airport",
    paymentStatus: "unpaid",
    notes: "未落實用酒店接送定係 Grab；4人連行李，建議 6-seater。",
    reminders: [],
    attachmentsPlaceholder: []
  }

};

/* ----------------------------------------------------------------------
   2. ITINERARY_SCHEMA — allowed activity types + one worked example each
   ----------------------------------------------------------------------
   This is documentation-as-data, not a validator (no schema-validation
   library is loaded in this project). Its job is to fix the vocabulary so
   the shared dynamic day renderer has one
   agreed shape to target, instead of every day inventing its own markup.

   Every itinerary activity, regardless of type, SHOULD eventually carry:
     id, type, dayId, time, title, placeId (nullable), bookingId (nullable),
     notes

   ITINERARY_ACTIVITY_TYPES lists every allowed value of `type`.
   ITINERARY_SCHEMA_EXAMPLES has one fully-filled-in example per type, built
   from real trip content already in PLACES/BOOKINGS_DATA where possible, so
   these aren't invented placeholder values.
   ------------------------------------------------------------------- */
const ITINERARY_ACTIVITY_TYPES = [
  "meal", "transport", "experience", "spa", "shoppingWindow",
  "buffer", "rest", "ticket", "booking", "note"
];

const ITINERARY_SCHEMA_EXAMPLES = {
  meal: {
    id: "example-meal-omakase-tiger",
    type: "meal",
    dayId: "day1",
    time: "17:30",
    title: "Omakase Tiger — Dinner",
    placeId: "omakase-tiger",
    bookingId: "omakase-tiger-booking",
    notes: "日落場，8 座板前。"
  },
  transport: {
    id: "example-transport-airport",
    type: "transport",
    dayId: "day1",
    time: "06:30",
    title: "SGN Airport → Fusion Original Saigon Centre",
    placeId: null,
    bookingId: "airport-transfer-booking",
    notes: "4 人連行李，建議 6-seater。"
  },
  experience: {
    id: "example-experience-cooking",
    type: "experience",
    dayId: "day2",
    time: "10:00–13:00",
    title: "Saigon Cooking Class",
    placeId: "cooking",
    bookingId: "cooking-class-booking",
    notes: "3 小時越菜體驗，親手做菜即場享用。"
  },
  spa: {
    id: "example-spa-placeholder",
    type: "spa",
    dayId: "day5",
    time: null,
    title: "Ha Spa",
    placeId: "ha-spa",
    bookingId: null,
    notes: "未落實時段，5 場 spa 之一，見 DAY_LINKS['ha-spa']。"
  },
  shoppingWindow: {
    id: "example-shopping-takashimaya",
    type: "shoppingWindow",
    dayId: "day5",
    time: null,
    title: "Takashimaya window",
    placeId: "marou",
    bookingId: null,
    notes: "Day 5 亦有 Marou 分店喺 Takashimaya，見 DAY_LINKS['marou']。"
  },
  buffer: {
    id: "example-buffer-day1-afternoon",
    type: "buffer",
    dayId: "day1",
    time: null,
    title: "Buffer / flexible time",
    placeId: null,
    bookingId: null,
    notes: "落地後彈性時間，視乎航班/海關時間調整。"
  },
  rest: {
    id: "example-rest-midday",
    type: "rest",
    dayId: "day3",
    time: null,
    title: "Hotel rest / cool down",
    placeId: "fusion",
    bookingId: null,
    notes: "中午最熱時段留返酒店房或附近咖啡店。"
  },
  ticket: {
    id: "example-ticket-placeholder",
    type: "ticket",
    dayId: null,
    time: null,
    title: "Ticketed experience (placeholder)",
    placeId: null,
    bookingId: null,
    notes: "未有需要預先買票嘅項目；呢個係型別範例，非真實行程。"
  },
  booking: {
    id: "example-booking-reference",
    type: "booking",
    dayId: "day2",
    time: "10:00–13:00",
    title: "Saigon Cooking Class (booking reference)",
    placeId: "cooking",
    bookingId: "cooking-class-booking",
    notes: "呢個type用嚟喺timeline度標示「呢個時段有booking」，唔重複返個活動本身嘅細節。"
  },
  note: {
    id: "example-note-general",
    type: "note",
    dayId: "day1",
    time: null,
    title: "General reminder",
    placeId: null,
    bookingId: null,
    notes: "例如：出發前落實 Omakase Tiger 營業狀態。"
  }
};

/* ----------------------------------------------------------------------
   3. PLACE_SCHEMA — forward-looking unified place shape + examples
   ----------------------------------------------------------------------
   IMPORTANT: this does NOT replace PLACES above. PLACES keeps its current
   field names (title/cat/maps/etc.) because Guide/Trip/Days/Moments all
   read those field names today — changing them would be exactly the kind
   of UI-breaking rewrite Stage 1.5 is explicitly not meant to do.

   PLACE_SCHEMA_EXAMPLE below is a *preview* of a possible future unified
   shape (id/name/category/district/... /bookingId), built by mapping two
   real PLACES entries into the new field names, so a future migration can
   compare old vs new side-by-side before touching any renderer.
   ------------------------------------------------------------------- */
const PLACE_SCHEMA_FIELDS = [
  "id", "name", "category", "district", "address", "hours", "mapUrl",
  "phone", "website", "price", "style", "whyGo", "routeFit", "bookingId", "notes"
];

const PLACE_SCHEMA_EXAMPLES = {
  "omakase-tiger": {
    id: "omakase-tiger",
    name: "Omakase Tiger",
    category: "RESTAURANTS",
    district: "Thạnh Mỹ Tây",
    address: "85/9 Phạm Viết Chánh, Thạnh Mỹ Tây, Hồ Chí Minh 700000, Vietnam",
    hours: "Tue–Sun 17:30 / 20:00；Monday closed",
    mapUrl: "https://maps.google.com/?q=Omakase+Tiger+The+Penthouse+Ho+Chi+Minh",
    phone: null,
    website: null,
    price: null,
    style: "Modern omakase, rooftop atmosphere",
    whyGo: "西貢景觀 + 8 座板前 + 價格相對友善；17:30 日落場最有記憶點。",
    routeFit: "Day 1 晚市，食完步行返阮惠步行街影 The Cafe Apartments 夜景。",
    bookingId: "omakase-tiger-booking",
    notes: "出發前必須再確認營業狀態（IG 曾顯示 temporarily closed）。"
  },
  "cooking": {
    id: "cooking",
    name: "Saigon Cooking Class",
    category: "EXPERIENCE",
    district: "Bến Nghé, District 1",
    address: "Saigon Cooking Class, 74 Hai Bà Trưng, Bến Nghé, District 1, Ho Chi Minh City",
    hours: "10:00–13:00（固定課程）",
    mapUrl: "https://maps.google.com/?q=Saigon+Cooking+Class",
    phone: null,
    website: null,
    price: "Pre-booked",
    style: "Hands-on Vietnamese cooking class",
    whyGo: "透過市場／食材／實作理解越南菜；一齊完成一餐比純景點更易成為回憶。",
    routeFit: "Day 2 主活動，早上行程唔好排太緊。",
    bookingId: "cooking-class-booking",
    notes: "早餐食輕食，留肚食自己煮嘅午餐。"
  }
};

/* ----------------------------------------------------------------------
   4. Optional read-only helper functions (see script.js)
   ----------------------------------------------------------------------
   getBookingsForDay(dayId), getBookingsForPlace(placeId), and
   getBookingStatusLabel(status) live in script.js, appended at the very
   end of the file. They are pure/read-only, not called by any existing
   render path, and safe to delete if a future stage designs different
   helpers instead.
   ------------------------------------------------------------------- */

/* ============================================================================
   ITINERARY_DATA — canonical Day timeline data (moved here from day.html)
   ----------------------------------------------------------------------------
   Added: 2026-07-09, as part of consolidating Companion itinerary data into
   data.js alongside PLACES/BOOKINGS_DATA, so a future itinerary-import
   pipeline only ever needs to replace one file, not edit HTML.

   Rendered by day.html (see the inline script there) via:
     ITINERARY_DATA[dayNumber] -> { title, kicker, heading, legend, dayId, items[] }
   Each item keeps its original rendering fields (id, time, title, details,
   route, map) UNCHANGED, and adds three new fields aligned with the
   ITINERARY_SCHEMA_EXAMPLES vocabulary defined above:
     type      one of ITINERARY_ACTIVITY_TYPES (meal/transport/experience/
               spa/shoppingWindow/buffer/rest/ticket/booking/note), inferred
               from the matching PLACES[item.id].cat where a place exists
     placeId   item.id when it matches a real PLACES key, otherwise null
               (three items — takashimaya, airport — have no PLACES entry;
               hotel-luggage maps to placeId:'fusion' since it is a return
               trip to the hotel)
     bookingId links to BOOKINGS_DATA where a real booking exists for that
               placeId (currently: omakase-tiger -> omakase-tiger-booking,
               cooking -> cooking-class-booking). Everything else is null
               because no booking has been made yet — this is intentionally
               NOT invented data; see STAGE_3E_ITINERARY_CONSOLIDATION.md.
   ------------------------------------------------------------------------- */
const ITINERARY_DATA = {"1":{"title":"Day 1 · Saigon Companion","kicker":"Day 1 · 30 Oct • Friday","heading":"Hello Saigon","legend":["☀️ Morning","🍜 Midday","🌙 Evening"],"items":[{"id":"airport-atm","time":"09:30–10:00","title":"💵 Airport ATM 取款","details":["Tien Phong Bank LiveBank 取 VND；Wise 卡優先。"],"route":"🚶 To next stop：完成取款後前往接送集合點。","map":"https://maps.google.com/?q=Tien+Phong+Bank+LiveBank+Tan+Son+Nhat+Airport","type":"money","dayId":"day1","placeId":null,"bookingId":null},{"id":"airport-transfer","time":"10:00–10:45","title":"🚐 Airport Transfer → Fusion Original","details":["Klook 接送直達酒店，先 drop luggage。"],"route":"🚶 To next stop：寄放行李後，若機場未能取款可步行約 9 分鐘去 Hà Tâm；否則直接去 Phở SOL。","map":"https://maps.google.com/?q=Fusion+Original+Saigon+Centre","type":"transport","dayId":"day1","placeId":"fusion","bookingId":null},{"id":"ha-tam","time":"10:45–11:15","title":"💵 Hà Tâm Jewelry（Backup）","details":["只在機場 ATM 未成功時使用；持 AUD 換 VND，注意財物。"],"route":"🚶 To next stop：步行約 5–10 分鐘去 Phở SOL。","map":"https://maps.google.com/?q=Ha+Tam+Jewelry+Ho+Chi+Minh","type":"money","dayId":"day1","placeId":null,"bookingId":null},{"id":"pho-sol","time":"11:15–12:15","title":"🍜 Phở SOL - Bến Thành","details":["酒店附近第一餐；石鍋河粉可 share。"],"route":"🚕 To next stop：Grab 約 5 分鐘去中央郵局，約 40,000–60,000 VND。","map":"https://maps.google.com/?q=Phở+SOL+Bến+Thành","type":"meal","dayId":"day1","placeId":"pho-sol","bookingId":null},{"id":"post-office","time":"12:30–14:00","title":"🏛 Post Office → Notre-Dame Cathedral → Book Street","details":["三個經典點集中在同一區，完成後可先回酒店 check-in 或直接繼續。"],"route":"🚕 To next stop：Grab 約 5 分鐘去 The Cafe Apartments / Nhà Suga，約 40,000–60,000 VND。","map":"https://maps.google.com/?q=Saigon+Central+Post+Office","type":"experience","dayId":"day1","placeId":"post-office","bookingId":null},{"id":"nha-suga","time":"14:00–17:00","title":"💆 The Cafe Apartments · Nhà Suga Spa","details":["Spa 位於 The Cafe Apartments 內；可先逛 cafe / 小店，再入療程。"],"route":"🚕 To next stop：Grab 約 15 分鐘去 Omakase Tiger，約 60,000–90,000 VND。","map":"https://maps.google.com/?q=Spa+Nhà+Suga+Premium","type":"spa","dayId":"day1","placeId":"nha-suga","bookingId":null},{"id":"omakase-tiger","time":"17:30–19:30","title":"🍣 Omakase Tiger","details":["17:30 日落場；晚餐後可回阮惠步行街。"],"route":"🚕 To next stop：Grab 約 15–20 分鐘返 Nguyễn Huệ / The Cafe Apartments 夜景。","map":"https://maps.google.com/?q=Omakase+Tiger+The+Penthouse+Ho+Chi+Minh","type":"meal","dayId":"day1","placeId":"omakase-tiger","bookingId":"omakase-tiger-booking"},{"id":"cafe-apartments","time":"19:45–20:15","title":"📸 Nguyễn Huệ Night Walk","details":["Optional：The Cafe Apartments 霓虹夜景與步行街合照。"],"route":"🚶 To next stop：步行約 5 分鐘返回酒店。","map":"https://maps.google.com/?q=The+Cafe+Apartments+42+Nguyễn+Huệ","type":"experience","dayId":"day1","placeId":"cafe-apartments","bookingId":null},{"id":"return-hotel","time":"20:15 onwards","title":"🛌 Return Hotel","details":["第一晚重點是 settle in，不拖到太夜。"],"route":"","map":"","type":"rest","dayId":"day1","placeId":"fusion","bookingId":null}],"dayId":"day1"},"2":{"title":"Day 2 · Saigon Companion","kicker":"Day 2 · 31 Oct • Saturday","heading":"Made in Saigon","legend":["☀️ Morning","🍜 Midday","🌙 Evening"],"items":[{"id":"com-tam-moc","time":"08:30–09:30","title":"🍚 Cơm Tấm Mộc","details":["越南豬扒碎飯早餐，份量可 share。"],"route":"🚕 To next stop：Grab 約 5 分鐘去 Saigon Cooking Class，約 40,000–60,000 VND。","map":"https://maps.google.com/?q=Cơm+Tấm+Mộc+Lý+Tự+Trọng+Ho+Chi+Minh","type":"meal","dayId":"day2","placeId":"com-tam-moc","bookingId":null},{"id":"cooking","time":"10:00–13:00","title":"🍳 Saigon Cooking Class","details":["3 小時手作廚藝體驗，完成後即場享用作 lunch。"],"route":"🚕 To next stop：Grab 約 10–15 分鐘去 Mộc Kim Spa。","map":"https://maps.google.com/?q=Saigon+Cooking+Class+80%2F1+Nguyen+Trai","type":"experience","dayId":"day2","placeId":"cooking","bookingId":"cooking-class-booking"},{"id":"grab-moc-kim","time":"13:00–13:15","title":"🚕 Grab → Mộc Kim Spa","details":["Cooking class 完結後直接去 Spa。"],"route":"🚶 To next stop：抵達後直接入 Spa。","map":"https://maps.google.com/?q=Mộc+Kim+Spa+Beauty+143+Lê+Thị+Hồng+Gấm","type":"transport","dayId":"day2","placeId":"moc-kim","bookingId":null},{"id":"moc-kim","time":"13:15–15:15","title":"💆 Mộc Kim Spa & Beauty","details":["草本洗頭 / head spa，做完剛好整理狀態。"],"route":"🚕 To next stop：Grab 約 10 分鐘去 Nguyễn Trãi shopping 起點。","map":"https://maps.google.com/?q=Mộc+Kim+Spa+Beauty+143+Lê+Thị+Hồng+Gấm","type":"spa","dayId":"day2","placeId":"moc-kim","bookingId":null},{"id":"libe","time":"15:30–18:30","title":"🛍 Nguyễn Trãi Shopping Route","details":["LIBÉ / Dauple by Ka’s / NOSBYN / The New Playground 等；核心店優先。"],"route":"🚕 To next stop：Vincom / The New Playground → LÚNE 約 5 分鐘。","map":"https://maps.google.com/?q=LIBÉ+52+Nguyễn+Trãi","type":"shoppingWindow","dayId":"day2","placeId":"libe","bookingId":null,"guideIds":["libe","dauple","nosbyn"],"showShoppingDirectory":true},{"id":"grab-lune","time":"18:45–19:00","title":"🚕 Grab → LÚNE","details":["從 D1 shopping / Vincom 轉場最簡單。"],"route":"🚶 To next stop：抵達餐廳。","map":"https://maps.google.com/?q=LÚNE+Restaurant+Bar+17%2F14+Lê+Thánh+Tôn","type":"transport","dayId":"day2","placeId":"lune","bookingId":null},{"id":"lune","time":"19:00–21:00","title":"🍷 LÚNE Restaurant & Bar","details":["Michelin selected contemporary French；預算約 800,000–1,500,000 VND pp。"],"route":"🚕 To next stop：晚餐後 Grab 約 5 分鐘返酒店。","map":"https://maps.google.com/?q=LÚNE+Restaurant+Bar+17%2F14+Lê+Thánh+Tôn","type":"meal","dayId":"day2","placeId":"lune","bookingId":null}],"dayId":"day2"},"3":{"title":"Day 3 · Saigon Companion","kicker":"Day 3 · 1 Nov • Sunday","heading":"A Slower Side","legend":["☀️ Morning","🍜 Midday","🌙 Evening"],"items":[{"id":"quan-thuy","time":"09:00–10:00","title":"🍜 Quán Thuý 94","details":["蟹肉粉絲早餐，之後步行約 5 分鐘到粉紅教堂。"],"route":"🚶 To next stop：步行約 5 分鐘去粉紅教堂。","map":"https://maps.google.com/?q=Quán+Thuý+94+Đinh+Tiên+Hoàng","type":"meal","dayId":"day3","placeId":"quan-thuy","bookingId":null},{"id":"pink-church","time":"10:00–10:45","title":"⛪ Pink Church + Cộng Cà Phê","details":["快閃打卡；可在 Cộng Cà Phê 高層坐一坐。"],"route":"🚶 To next stop：Push Push 如有合適實體店可順路；否則直接叫 Grab。","map":"https://maps.google.com/?q=Tân+Định+Church","type":"experience","dayId":"day3","placeId":"pink-church","bookingId":null},{"id":"push-push","time":"10:45–11:30","title":"👗 Push Push Official（Optional）","details":["年輕 streetwear；出發前再確認實體店地址。"],"route":"🚕 To next stop：Grab 約 15 分鐘跨橋去 Thảo Điền。","map":"https://maps.google.com/?q=Push+Push+Official+Ho+Chi+Minh","type":"shoppingWindow","dayId":"day3","placeId":"push-push","bookingId":null},{"id":"grab-thao-dien","time":"10:45–11:30","title":"🚕 Grab → Thảo Điền","details":["跨橋到草田區，開始 slower neighbourhood day。"],"route":"🚶 To next stop：由 Saigon Concept 開始步行。","map":"https://maps.google.com/?q=Saigon+Concept+Thảo+Điền","type":"transport","dayId":"day3","placeId":"saigon-concept","bookingId":null},{"id":"saigon-concept","time":"11:45–13:00","title":"🛍 Lifestyle Walk","details":["Saigon Concept → In the Mood → Soo Kafe 外帶蛋撻 → YouOn Boutique。"],"route":"🚶 To next stop：步行去 Bakes / The Dreamers 下午茶。","map":"https://maps.google.com/?q=Saigon+Concept+Thảo+Điền","type":"shoppingWindow","dayId":"day3","placeId":"saigon-concept","bookingId":null,"guideIds":["saigon-concept","ohquao"],"showShoppingDirectory":true},{"id":"bakes","time":"13:00–14:00","title":"☕ Afternoon Tea","details":["Bakes 或 The Dreamers；食唔食、食幾多自己 buffer，重點是坐低休息。"],"route":"🚶 To next stop：步行去 OHQUAO Living。","map":"https://maps.google.com/?q=Bakes+Thảo+Điền","type":"meal","dayId":"day3","placeId":"bakes","bookingId":null},{"id":"ohquao","time":"14:30–15:00","title":"🛍 OHQUAO Living","details":["藝術家明信片、香氛、手工藝品；放 Spa 前，趁仍有精神慢慢睇。"],"route":"🚕 To next stop：前往 Mộc Hương Wellness。","map":"https://maps.google.com/?q=OHQUAO+Living+Thảo+Điền","type":"shoppingWindow","dayId":"day3","placeId":"ohquao","bookingId":null},{"id":"moc-huong","time":"15:30–17:30","title":"💆 Mộc Hương Wellness","details":["白色法式別墅、蒸氣房、草本熱石療程。"],"route":"🚶 To next stop：Spa 後可步行約 2–3 分鐘去 Louh × Alouane。","map":"https://maps.google.com/?q=Mộc+Hương+Wellness+Thảo+Điền","type":"spa","dayId":"day3","placeId":"moc-huong","bookingId":null},{"id":"louh","time":"17:30–18:00","title":"🛍 Louh × Alouane","details":["高級棉織品家居服，Spa 後慢慢逛。"],"route":"🚕 To next stop：Grab 約 3 分鐘去 Little Bear。","map":"https://maps.google.com/?q=Louh+Alouane+Ho+Chi+Minh","type":"shoppingWindow","dayId":"day3","placeId":"ohquao","bookingId":null},{"id":"little-bear","time":"18:30–20:30","title":"🍷 Little Bear","details":["Creative Vietnamese；Michelin Guide 入選。"],"route":"🚕 To next stop：Grab 約 15 分鐘返酒店，約 80,000–120,000 VND。","map":"https://maps.google.com/?q=Little+Bear+Thảo+Điền","type":"meal","dayId":"day3","placeId":"little-bear","bookingId":null},{"id":"marou","time":"21:00","title":"🍫 Maison Marou @ Fusion Original","details":["返回酒店後可飲一杯熱朱古力。"],"route":"","map":"","type":"meal","dayId":"day3","placeId":"marou","bookingId":null}],"dayId":"day3"},"4":{"title":"Day 4 · Saigon Companion","kicker":"Day 4 · 2 Nov • Monday","heading":"City Contrast","legend":["☀️ Morning","🍜 Midday","🌙 Evening"],"items":[{"id":"running-bean","time":"08:30–09:30","title":"☕ The Running Bean","details":["晨間咖啡，為博物館行程留精神。"],"route":"🚕 To next stop：Grab 約 8–10 分鐘去 War Remnants Museum。","map":"https://maps.google.com/?q=The+Running+Bean+Ho+Chi+Minh","type":"meal","dayId":"day4","placeId":"running-bean","bookingId":null},{"id":"war-museum","time":"09:30–11:30","title":"🏛 War Remnants Museum","details":["上午參觀，避開午後疲倦。"],"route":"🚕 To next stop：Grab 約 8 分鐘去 Pizza 4P’s Hai Bà Trưng。","map":"https://maps.google.com/?q=War+Remnants+Museum","type":"experience","dayId":"day4","placeId":"war-museum","bookingId":null},{"id":"pizza4ps","time":"11:30–13:00","title":"🍕 Pizza 4P’s Hai Bà Trưng","details":["食完向 Phú Nhuận 方向，動線順。"],"route":"🚕 To next stop：Grab 約 15 分鐘去 11 Garmentory。","map":"https://maps.google.com/?q=Pizza+4P%27s+Hai+Bà+Trưng","type":"meal","dayId":"day4","placeId":"pizza4ps","bookingId":null},{"id":"garmentory","time":"13:30–15:15","title":"🛍 Phú Nhuận Shopping · 第一輪","details":["11 Garmentory（必行）→ ByVee → Pinguyen Store → thekat.shop → So Dópe Club。"],"route":"🚶 To next stop：沿 Trần Quang Diệu 步行去 Tỉnh Thức Spa。","map":"https://maps.google.com/?q=11+Garmentory+117B+Nguyễn+Đình+Chính","type":"shoppingWindow","dayId":"day4","placeId":"garmentory","bookingId":null,"showShoppingDirectory":true},{"id":"tinh-thuc","time":"15:15–17:00","title":"💆 Tỉnh Thức Spa","details":["90 分鐘身體按摩 + 面部護理，將第一輪 shopping 體力補回來。"],"route":"🚶 To next stop：按摩後沿 Trần Quang Diệu 開始第二輪 shopping / 咖啡 buffer。","map":"https://maps.google.com/?q=Tỉnh+Thức+Spa+118%2F54+Trần+Quang+Diệu","type":"spa","dayId":"day4","placeId":"tinh-thuc","bookingId":null},{"id":"shopping-round2","time":"17:00–19:00","title":"🛍 Phú Nhuận Shopping · 第二輪 + 咖啡歇腳","details":["Dalla Saigon → RUBIES → Lane Cì；按體力與時間取捨。"],"route":"🚕 To next stop：19:00 叫 Grab 去 District 1，預留 30 分鐘下班車程。","map":"https://maps.google.com/?q=Dalla+Saigon+64+Trần+Quang+Diệu","type":"shoppingWindow","dayId":"day4","placeId":"garmentory","bookingId":null,"showShoppingDirectory":true},{"id":"grab-quince","time":"19:00–19:30","title":"🚕 Grab to District 1","details":["下班尖峰時間，預留 30 分鐘車程去 Quince。"],"route":"🚶 To next stop：抵達 Quince。","map":"https://maps.google.com/?q=Quince+Saigon","type":"transport","dayId":"day4","placeId":"quince","bookingId":null},{"id":"quince","time":"19:30–21:30","title":"🔥 Quince Saigon","details":["Wood-fired contemporary European；Dinner category $$$。"],"route":"🚕 To next stop：如有精神，Grab 約 5 分鐘去 Social Club Rooftop。","map":"https://maps.google.com/?q=Quince+Saigon","type":"meal","dayId":"day4","placeId":"quince","bookingId":null},{"id":"social-club","time":"22:15 onwards","title":"🥂 Social Club Rooftop（Optional）","details":["視體力決定，不作硬性安排。"],"route":"🚕 To next stop：完成後 Grab 返回酒店。","map":"https://maps.google.com/?q=Social+Club+Rooftop+Saigon","type":"experience","dayId":"day4","placeId":null,"bookingId":null}],"dayId":"day4"},"5":{"title":"Day 5 · Saigon Companion","kicker":"Day 5 · 3 Nov • Tuesday","heading":"One Last Look","legend":["☀️ Morning","🍜 Midday","🌙 Evening"],"items":[{"id":"pho-vietnam","time":"09:30–10:30","title":"🍜 Phở Việt Nam Bến Thành","details":["最後一碗石鍋河粉，距酒店步行或 Grab 3–5 分鐘。"],"route":"🚶 To next stop：步行約 4 分鐘去 Museum of Fine Arts。","map":"https://maps.google.com/?q=Phở+Việt+Nam+Bến+Thành","type":"meal","dayId":"day5","placeId":"pho-vietnam","bookingId":null},{"id":"fine-arts","time":"10:30–11:45","title":"🏛 Museum of Fine Arts","details":["復古人文街拍，彩色玻璃與老升降機。"],"route":"🚕 To next stop：Grab 約 4 分鐘去 Bếp Mẹ Ỉn。","map":"https://maps.google.com/?q=Ho+Chi+Minh+City+Museum+of+Fine+Arts","type":"experience","dayId":"day5","placeId":"fine-arts","bookingId":null},{"id":"bep-me-in","time":"11:45–13:00","title":"🥞 Bếp Mẹ Ỉn","details":["Michelin Bib Gourmand；黃金煎餅、椰子炒飯與越式拼盤。"],"route":"🚕 To next stop：Grab 約 3 分鐘去 Takashimaya。","map":"https://maps.google.com/?q=Bếp+Mẹ+Ỉn+Ho+Chi+Minh","type":"meal","dayId":"day5","placeId":"bep-me-in","bookingId":null},{"id":"takashimaya","time":"13:00–14:15","title":"🛍 Takashimaya + Maison Marou","details":["最後手信時間：朱古力、咖啡、茶葉與乾果。"],"route":"🚶 To next stop：回 Fusion Original 提行李。","map":"https://maps.google.com/?q=Takashimaya+Saigon","type":"shoppingWindow","dayId":"day5","placeId":null,"bookingId":null},{"id":"hotel-luggage","time":"14:15–14:45","title":"🧳 Return Hotel / Luggage","details":["回 Fusion Original 提取寄存行李。"],"route":"🚕 To next stop：14:45 出發，Grab 約 20–25 分鐘去 Hạ Spa。","map":"https://maps.google.com/?q=Fusion+Original+Saigon+Centre","type":"buffer","dayId":"day5","placeId":"fusion","bookingId":null},{"id":"grab-ha-spa","time":"14:45–15:30","title":"🚕 Grab → Hạ Spa","details":["提早離開 D1，避開黃昏塞車。"],"route":"🚶 To next stop：抵達後直接入療程。","map":"https://maps.google.com/?q=Hạ+Spa+Ho+Chi+Minh","type":"transport","dayId":"day5","placeId":"ha-spa","bookingId":null},{"id":"ha-spa","time":"15:30–17:30","title":"💆 Hạ Spa","details":["草本洗頭 + 全身熱石按摩；近機場。"],"route":"🚕 To next stop：Grab 約 2 分鐘去新山一機場國際航廈。","map":"https://maps.google.com/?q=Hạ+Spa+Ho+Chi+Minh","type":"spa","dayId":"day5","placeId":"ha-spa","bookingId":null},{"id":"airport-transfer-final","time":"17:45–18:00","title":"🚕 Hạ Spa → Airport","details":["前往新山一國際機場。"],"route":"🚶 To next stop：國際線 Check-in 櫃檯。","map":"https://maps.google.com/?q=Tan+Son+Nhat+International+Airport","type":"transport","dayId":"day5","placeId":null,"bookingId":null},{"id":"airport","time":"18:00–21:10","title":"✈️ Check-in / Duty Free / Boarding","details":["預留 3 小時處理 check-in、過關與登機。"],"route":"","map":"","type":"transport","dayId":"day5","placeId":null,"bookingId":null}],"dayId":"day5"}};
