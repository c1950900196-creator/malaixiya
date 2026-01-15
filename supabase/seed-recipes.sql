-- 马来西亚食谱数据种子文件
-- 包含80+道马来西亚传统菜肴

-- ==================== 早餐类 (Breakfast) ====================

-- 1. Nasi Lemak (椰浆饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Nasi Lemak',
  'Nasi Lemak',
  '椰浆饭',
  '马来西亚国民早餐，椰浆饭配参巴辣椒、江鱼仔、花生、黄瓜和鸡蛋',
  'malay',
  ARRAY['breakfast'],
  20,
  30,
  4,
  'medium',
  true,
  6.00
);

-- 2. Roti Canai (煎饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Roti Canai',
  'Roti Canai',
  '印度煎饼',
  '薄脆的印度煎饼，搭配咖喱酱或达尔豆汤',
  'indian',
  ARRAY['breakfast'],
  30,
  20,
  4,
  'medium',
  true,
  4.00
);

-- 3. Mee Goreng (炒面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Mee Goreng',
  'Mee Goreng',
  '马来炒面',
  '辛辣的印度风味炒黄面，配蔬菜、豆腐和虾',
  'indian',
  ARRAY['breakfast', 'lunch', 'dinner'],
  15,
  15,
  4,
  'easy',
  true,
  5.50
);

-- 4. Chicken Congee (鸡肉粥)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_diabetic_friendly, estimated_cost)
VALUES (
  'Chicken Congee',
  'Bubur Ayam',
  '鸡肉粥',
  '温暖营养的早餐选择，适合糖尿病患者',
  'chinese',
  ARRAY['breakfast'],
  10,
  40,
  4,
  'easy',
  true,
  true,
  3.50
);

-- 5. Kaya Toast (咖椰吐司)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Kaya Toast',
  'Roti Kaya',
  '咖椰吐司',
  '传统新加坡-马来西亚早餐，烤面包配咖椰酱和黄油',
  'chinese',
  ARRAY['breakfast', 'snack'],
  5,
  5,
  2,
  'easy',
  true,
  2.50
);

-- 6. Nasi Goreng Kampung (乡村炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Village Fried Rice',
  'Nasi Goreng Kampung',
  '乡村炒饭',
  '马来风味炒饭，配江鱼仔和参巴辣椒',
  'malay',
  ARRAY['breakfast', 'lunch', 'dinner'],
  15,
  15,
  4,
  'easy',
  true,
  5.00
);

-- ==================== 午餐/晚餐类 (Lunch/Dinner) ====================

-- 7. Nasi Kerabu (蓝花饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Blue Rice',
  'Nasi Kerabu',
  '蓝花饭',
  '吉兰丹特色蓝色米饭，配炸鸡、生菜和参巴酱',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  45,
  4,
  'medium',
  true,
  8.00
);

-- 8. Rendang (仁当咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Beef Rendang',
  'Rendang Daging',
  '仁当牛肉',
  '慢炖香料牛肉，浓郁椰香，世界最佳料理之一',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  120,
  6,
  'hard',
  true,
  15.00
);

-- 9. Ayam Percik (烤鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Grilled Spiced Chicken',
  'Ayam Percik',
  '马来烤鸡',
  '椰奶香料腌制烤鸡，登嘉楼特色菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  40,
  4,
  'medium',
  true,
  10.00
);

-- 10. Asam Pedas (酸辣鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Spicy Sour Fish',
  'Asam Pedas Ikan',
  '酸辣鱼',
  '马六甲特色酸辣鱼汤，配罗望子和辣椒',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  30,
  4,
  'medium',
  true,
  true,
  12.00
);

-- 11. Laksa (叻沙)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Laksa',
  'Laksa',
  '叻沙',
  '浓郁椰香辣汤面，配虾、鸡肉和豆芽',
  'chinese',
  ARRAY['lunch', 'dinner'],
  25,
  35,
  4,
  'medium',
  true,
  true,
  9.00
);

-- 12. Char Kway Teow (炒粿条)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Fried Flat Noodles',
  'Char Kway Teow',
  '炒粿条',
  '槟城著名炒河粉，配虾、豆芽和腊肠',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  10,
  2,
  'medium',
  false,
  true,
  8.00
);

-- 13. Chicken Rice (海南鸡饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Hainanese Chicken Rice',
  'Nasi Ayam Hainan',
  '海南鸡饭',
  '嫩滑白切鸡配香米饭、姜蓉和辣椒酱',
  'chinese',
  ARRAY['lunch', 'dinner'],
  20,
  50,
  4,
  'medium',
  true,
  9.00
);

-- 14. Prawn Mee (虾面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Prawn Noodle Soup',
  'Mee Udang',
  '虾面汤',
  '浓郁虾汤面，配大虾、豆芽和水煮蛋',
  'chinese',
  ARRAY['lunch', 'dinner'],
  30,
  60,
  4,
  'hard',
  true,
  true,
  12.00
);

-- 15. Satay (沙爹)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_nuts, estimated_cost)
VALUES (
  'Satay',
  'Satay',
  '沙爹串',
  '烤肉串配花生酱，马来西亚街头经典小吃',
  'malay',
  ARRAY['lunch', 'dinner', 'snack'],
  60,
  20,
  6,
  'medium',
  true,
  true,
  10.00
);

-- 16. Nasi Dagang (达岗饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Fish Curry Rice',
  'Nasi Dagang',
  '达岗饭',
  '登嘉楼特色早餐，椰浆糯米饭配鱼咖喱',
  'malay',
  ARRAY['breakfast', 'lunch'],
  30,
  45,
  4,
  'medium',
  true,
  true,
  9.00
);

-- 17. Ikan Bakar (烤鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Grilled Fish',
  'Ikan Bakar',
  '烤鱼',
  '香料腌制烤鱼，配参巴酱和生菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  25,
  4,
  'easy',
  true,
  true,
  11.00
);

-- 18. Mee Rebus (卤面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Boiled Noodles in Gravy',
  'Mee Rebus',
  '马来卤面',
  '黄面配甜辣薯仔汁，马来风味浓郁',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  40,
  4,
  'medium',
  true,
  6.50
);

-- 19. Curry Laksa (咖喱叻沙)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Curry Laksa',
  'Laksa Kari',
  '咖喱叻沙',
  '咖喱椰浆汤面，配豆腐泡、虾和鸡肉',
  'chinese',
  ARRAY['lunch', 'dinner'],
  25,
  35,
  4,
  'medium',
  true,
  true,
  8.50
);

-- 20. Nasi Tomato (番茄饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Tomato Rice',
  'Nasi Tomato',
  '番茄饭',
  '马来印度式香料番茄饭，配炸鸡或咖喱',
  'indian',
  ARRAY['lunch', 'dinner'],
  15,
  30,
  6,
  'easy',
  true,
  7.00
);

-- ==================== 素食类 (Vegetarian) ====================

-- 21. Vegetable Curry (蔬菜咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, is_diabetic_friendly, estimated_cost)
VALUES (
  'Mixed Vegetable Curry',
  'Kari Sayur Campur',
  '什菜咖喱',
  '健康蔬菜咖喱，适合糖尿病患者和素食者',
  'indian',
  ARRAY['lunch', 'dinner'],
  15,
  25,
  4,
  'easy',
  true,
  true,
  true,
  5.00
);

-- 22. Gado-Gado (加多加多)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, contains_nuts, estimated_cost)
VALUES (
  'Gado-Gado',
  'Gado-Gado',
  '印尼杂菜沙拉',
  '印尼风味蔬菜沙拉配花生酱',
  'indonesian',
  ARRAY['lunch', 'dinner'],
  20,
  15,
  4,
  'easy',
  true,
  true,
  true,
  6.00
);

-- 23. Vegetarian Fried Rice (素炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Vegetarian Fried Rice',
  'Nasi Goreng Sayur',
  '素食炒饭',
  '健康素食炒饭，配各种蔬菜和豆腐',
  'chinese',
  ARRAY['lunch', 'dinner'],
  10,
  15,
  4,
  'easy',
  true,
  true,
  4.50
);

-- 24. Tofu Curry (豆腐咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, is_diabetic_friendly, estimated_cost)
VALUES (
  'Tofu Curry',
  'Kari Tauhu',
  '豆腐咖喱',
  '高蛋白素食咖喱，适合减重和糖尿病患者',
  'indian',
  ARRAY['lunch', 'dinner'],
  10,
  20,
  4,
  'easy',
  true,
  true,
  true,
  4.00
);

-- 25. Stir-Fried Vegetables (炒杂菜)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, is_diabetic_friendly, estimated_cost)
VALUES (
  'Stir-Fried Mixed Vegetables',
  'Sayur Goreng Campur',
  '清炒杂菜',
  '简单健康的清炒蔬菜，低卡路里',
  'chinese',
  ARRAY['lunch', 'dinner'],
  10,
  10,
  4,
  'easy',
  true,
  true,
  true,
  3.50
);

-- ==================== 小吃/零食类 (Snacks) ====================

-- 26. Popiah (薄饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Fresh Spring Roll',
  'Popiah',
  '鲜薄饼',
  '福建风味生春卷，配蔬菜和甜酱',
  'chinese',
  ARRAY['snack', 'lunch'],
  30,
  20,
  6,
  'medium',
  true,
  true,
  7.00
);

-- 27. Curry Puff (咖喱角)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Curry Puff',
  'Karipap',
  '咖喱角',
  '酥脆咖喱角，内馅土豆鸡肉',
  'malay',
  ARRAY['snack'],
  40,
  25,
  12,
  'medium',
  true,
  8.00
);

-- 28. Onde-Onde (煎堆)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Onde-Onde',
  'Onde-Onde',
  '椰丝球',
  '绿色糯米球，内馅椰糖，外裹椰丝',
  'malay',
  ARRAY['snack', 'dessert'],
  30,
  15,
  20,
  'medium',
  true,
  true,
  6.00
);

-- 29. Fried Banana (炸香蕉)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Fried Banana Fritters',
  'Pisang Goreng',
  '炸香蕉',
  '马来西亚传统下午茶点心',
  'malay',
  ARRAY['snack'],
  10,
  15,
  6,
  'easy',
  true,
  true,
  3.00
);

-- 30. Apam Balik (曼煎粿)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Peanut Pancake',
  'Apam Balik',
  '曼煎粿',
  '厚煎饼配花生碎和甜玉米',
  'chinese',
  ARRAY['snack'],
  15,
  20,
  8,
  'easy',
  true,
  true,
  5.00
);

-- ==================== 汤类 (Soups) ====================

-- 31. Soto Ayam (印尼鸡汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Chicken Soto',
  'Soto Ayam',
  '印尼鸡汤',
  '香料鸡汤配粉丝和蔬菜',
  'indonesian',
  ARRAY['lunch', 'dinner'],
  20,
  45,
  6,
  'medium',
  true,
  8.00
);

-- 32. Sup Tulang (骨汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Mutton Bone Soup',
  'Sup Tulang',
  '羊骨汤',
  '香料羊骨汤，印度回教风味',
  'indian',
  ARRAY['lunch', 'dinner'],
  15,
  90,
  4,
  'medium',
  true,
  12.00
);

-- 33. Tom Yam (冬炎汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Tom Yam Soup',
  'Tom Yam',
  '冬炎汤',
  '泰式酸辣汤，配虾和香茅',
  'thai',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  4,
  'easy',
  true,
  true,
  9.00
);

-- 34. ABC Soup (ABC汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_diabetic_friendly, estimated_cost)
VALUES (
  'ABC Soup',
  'Sup ABC',
  'ABC汤',
  '简单营养的蔬菜汤，适合全家和糖尿病患者',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  60,
  6,
  'easy',
  true,
  true,
  6.00
);

-- 35. Bakut Teh (肉骨茶)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Pork Rib Tea',
  'Bak Kut Teh',
  '肉骨茶',
  '福建药材猪肉汤，配油条',
  'chinese',
  ARRAY['breakfast', 'lunch'],
  20,
  120,
  4,
  'medium',
  false,
  12.00
);

-- ==================== 饮料类 (Beverages) ====================

-- 36. Teh Tarik (拉茶)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Pulled Tea',
  'Teh Tarik',
  '拉茶',
  '马来西亚国民饮料，奶茶拉出泡沫',
  'indian',
  ARRAY['breakfast', 'snack'],
  5,
  10,
  2,
  'easy',
  true,
  true,
  2.00
);

-- 37. Bandung (玫瑰奶)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Rose Milk',
  'Air Bandung',
  '玫瑰奶',
  '粉红色玫瑰糖浆炼乳饮料',
  'malay',
  ARRAY['snack'],
  5,
  0,
  2,
  'easy',
  true,
  true,
  2.50
);

-- 38. Cendol (煎蕊)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Cendol',
  'Cendol',
  '煎蕊',
  '椰糖冰配绿色粉条和红豆',
  'malay',
  ARRAY['dessert', 'snack'],
  20,
  15,
  4,
  'medium',
  true,
  true,
  4.00
);

-- ==================== 更多主食 (More Main Dishes) ====================

-- 39. Ayam Masak Merah (红烧鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Chicken in Red Sauce',
  'Ayam Masak Merah',
  '马来红烧鸡',
  '番茄辣椒酱炖鸡，马来婚宴常见菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  40,
  6,
  'medium',
  true,
  11.00
);

-- 40. Sambal Udang (参巴虾)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Sambal Prawns',
  'Sambal Udang',
  '参巴虾',
  '辣椒虾，马来家常菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  15,
  4,
  'easy',
  true,
  true,
  14.00
);

-- 41. Otak-Otak (乌达)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Grilled Fish Cake',
  'Otak-Otak',
  '烤鱼饼',
  '香料鱼肉糕，用香蕉叶包裹烤制',
  'malay',
  ARRAY['snack', 'lunch'],
  40,
  20,
  8,
  'hard',
  true,
  true,
  10.00
);

-- 42. Ayam Goreng Berempah (香料炸鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Spiced Fried Chicken',
  'Ayam Goreng Berempah',
  '马来炸鸡',
  '香料腌制炸鸡，外酥里嫩',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  25,
  4,
  'medium',
  true,
  9.00
);

-- 43. Mee Siam (暹罗面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Siamese Noodles',
  'Mee Siam',
  '暹罗面',
  '酸辣米粉，配虾和豆芽',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  25,
  4,
  'medium',
  true,
  7.00
);

-- 44. Nasi Ulam (香草饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_diabetic_friendly, estimated_cost)
VALUES (
  'Herb Rice',
  'Nasi Ulam',
  '香草饭',
  '健康草药米饭，配生菜和烤鱼',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  30,
  4,
  'medium',
  true,
  true,
  8.50
);

-- 45. Lontong (椰汁米糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Rice Cake in Coconut Gravy',
  'Lontong',
  '椰汁米糕',
  '压制米糕配椰奶蔬菜汁',
  'indonesian',
  ARRAY['breakfast', 'lunch'],
  40,
  60,
  6,
  'hard',
  true,
  true,
  7.50
);

-- 46. Murtabak (马来煎饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Stuffed Pancake',
  'Murtabak',
  '马来肉饼',
  '厚煎饼内馅牛肉或鸡肉，配咖喱酱',
  'indian',
  ARRAY['lunch', 'dinner', 'snack'],
  30,
  20,
  4,
  'medium',
  true,
  8.50
);

-- 47. Kway Teow Soup (粿条汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, is_diabetic_friendly, estimated_cost)
VALUES (
  'Flat Noodle Soup',
  'Kuey Teow Sup',
  '粿条汤',
  '清淡健康的河粉汤，配鱼丸和蔬菜',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  2,
  'easy',
  true,
  true,
  true,
  6.00
);

-- 48. Nasi Bryani (印度香饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Biryani Rice',
  'Nasi Bryani',
  '印度香饭',
  '香料黄姜饭配炸鸡或羊肉',
  'indian',
  ARRAY['lunch', 'dinner'],
  30,
  60,
  6,
  'hard',
  true,
  12.00
);

-- 49. Ikan Asam Pedas (酸辣鱼头)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Sour Spicy Fish Head',
  'Ikan Kepala Asam Pedas',
  '酸辣鱼头',
  '麻六甲特色鱼头咖喱，酸辣开胃',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  35,
  4,
  'medium',
  true,
  true,
  13.00
);

-- 50. Tau Fu Fa (豆腐花)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, is_diabetic_friendly, estimated_cost)
VALUES (
  'Soft Tofu Pudding',
  'Tauhu Fa',
  '豆腐花',
  '滑嫩豆腐甜品，配姜糖水或豆浆',
  'chinese',
  ARRAY['dessert', 'snack'],
  10,
  30,
  4,
  'medium',
  true,
  true,
  true,
  3.00
);

-- ==================== 额外补充菜品 ====================

-- 51. Nasi Kandar (槟城印度饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Nasi Kandar',
  'Nasi Kandar',
  '印度盖浇饭',
  '槟城著名印度回教风味盖浇饭，配多种咖喱',
  'indian',
  ARRAY['lunch', 'dinner'],
  25,
  45,
  4,
  'medium',
  true,
  10.00
);

-- 52. Rojak (啰惹)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, contains_nuts, estimated_cost)
VALUES (
  'Fruit and Vegetable Salad',
  'Rojak',
  '啰惹',
  '水果蔬菜沙拉配虾膏花生酱',
  'chinese',
  ARRAY['snack', 'lunch'],
  20,
  10,
  4,
  'easy',
  true,
  true,
  true,
  6.50
);

-- 53. Lemang (竹筒糯米)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Bamboo Glutinous Rice',
  'Lemang',
  '竹筒糯米',
  '椰浆糯米在竹筒里烤制，开斋节传统食物',
  'malay',
  ARRAY['lunch', 'dinner'],
  60,
  180,
  8,
  'hard',
  true,
  true,
  15.00
);

-- 54. Keropok Lekor (鱼肉饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Fish Sausage Crackers',
  'Keropok Lekor',
  '鱼肉条',
  '登嘉楼特色炸鱼条小吃',
  'malay',
  ARRAY['snack'],
  40,
  20,
  12,
  'medium',
  true,
  true,
  8.00
);

-- 55. Mee Bandung (万隆面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Bandung Noodles',
  'Mee Bandung',
  '万隆面',
  '柔佛特色浓汁黄面，配虾和蔬菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  30,
  4,
  'medium',
  true,
  7.50
);

-- 56. Pulut Panggang (烤糯米)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Grilled Glutinous Rice',
  'Pulut Panggang',
  '烤糯米卷',
  '香蕉叶包糯米配辣椰丝，烤制',
  'malay',
  ARRAY['snack', 'breakfast'],
  45,
  25,
  8,
  'medium',
  true,
  6.00
);

-- 57. Ikan Patin Tempoyak (淡水鱼咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Patin Fish in Fermented Durian',
  'Ikan Patin Tempoyak',
  '榴莲鱼',
  '彭亨特色发酵榴莲鱼咖喱',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  30,
  4,
  'medium',
  true,
  true,
  12.00
);

-- 58. Nasi Ambeng (安炳饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Javanese Rice Platter',
  'Nasi Ambeng',
  '爪哇饭',
  '柔佛印尼爪哇风味大盘饭，配多种菜肴',
  'indonesian',
  ARRAY['lunch', 'dinner'],
  40,
  60,
  6,
  'hard',
  true,
  14.00
);

-- 59. Kuih Lapis (九层糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Layered Cake',
  'Kuih Lapis',
  '千层糕',
  '多层蒸糕，马来传统糕点',
  'malay',
  ARRAY['dessert', 'snack'],
  60,
  120,
  16,
  'hard',
  true,
  true,
  12.00
);

-- 60. Sayur Lodeh (椰菜汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, is_diabetic_friendly, estimated_cost)
VALUES (
  'Vegetable Coconut Curry',
  'Sayur Lodeh',
  '椰菜汤',
  '椰奶蔬菜咖喱，清淡健康',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  25,
  4,
  'easy',
  true,
  true,
  true,
  5.50
);

-- 61. Roti John (罗惹面包)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Roti John',
  'Roti John',
  '煎蛋肉三明治',
  '法国面包配煎蛋肉馅，街头小吃',
  'malay',
  ARRAY['snack', 'dinner'],
  15,
  15,
  2,
  'easy',
  true,
  6.00
);

-- 62. Ikan Keli Goreng (炸鲶鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Fried Catfish',
  'Ikan Keli Goreng',
  '炸鲶鱼',
  '香料炸鲶鱼，配参巴酱',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  4,
  'easy',
  true,
  true,
  8.00
);

-- 63. Bubur Kacang (红豆粥)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Sweet Red Bean Porridge',
  'Bubur Kacang',
  '红豆粥',
  '甜红豆椰奶粥，斋戒月甜点',
  'malay',
  ARRAY['dessert', 'snack'],
  10,
  45,
  6,
  'easy',
  true,
  true,
  4.50
);

-- 64. Nasi Goreng Pattaya (芭堤雅炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Pattaya Fried Rice',
  'Nasi Goreng Pattaya',
  '芭堤雅炒饭',
  '炒饭包蛋皮，配番茄酱',
  'thai',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  2,
  'medium',
  true,
  7.00
);

-- 65. Ayam Masak Lemak Cili Padi (黄姜椰奶鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Chicken in Turmeric Coconut Gravy',
  'Ayam Masak Lemak Cili Padi',
  '黄姜椰奶鸡',
  '森美兰特色椰奶黄姜鸡',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  35,
  4,
  'medium',
  true,
  10.00
);

-- 66. Roti Tissue (纸巾煎饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Tissue Thin Roti',
  'Roti Tisu',
  '纸巾煎饼',
  '超薄脆印度煎饼，撒糖粉',
  'indian',
  ARRAY['dessert', 'snack'],
  30,
  10,
  2,
  'hard',
  true,
  true,
  4.50
);

-- 67. Maggi Goreng (炒快熟面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Fried Instant Noodles',
  'Maggi Goreng',
  '炒快熟面',
  '印度回教炒快熟面，配蛋和蔬菜',
  'indian',
  ARRAY['lunch', 'dinner', 'snack'],
  10,
  10,
  2,
  'easy',
  true,
  4.00
);

-- 68. Udang Masak Lemak Nenas (菠萝虾)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Prawns in Pineapple Coconut Curry',
  'Udang Masak Lemak Nenas',
  '菠萝椰奶虾',
  '椰奶菠萝虾咖喱，酸甜可口',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  4,
  'easy',
  true,
  true,
  13.00
);

-- 69. Kuih Bahulu (鸡蛋糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Traditional Egg Sponge Cake',
  'Kuih Bahulu',
  '传统鸡蛋糕',
  '马来传统小蛋糕，开斋节常见',
  'malay',
  ARRAY['snack', 'dessert'],
  20,
  25,
  24,
  'medium',
  true,
  true,
  6.00
);

-- 70. Ais Kacang (红豆冰)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Shaved Ice Dessert',
  'Ais Kacang',
  '红豆冰',
  '刨冰配红豆、玉米、果冻和糖浆',
  'chinese',
  ARRAY['dessert', 'snack'],
  15,
  0,
  2,
  'easy',
  true,
  true,
  4.00
);

-- 71. Nasi Goreng USA (美国炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'USA Fried Rice',
  'Nasi Goreng USA',
  '美国炒饭',
  '马来西亚特色炒饭配鸡肉香肠和鸡蛋',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  15,
  2,
  'easy',
  true,
  6.50
);

-- 72. Ikan Terubok Masin (咸鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Salted Fish',
  'Ikan Masin Goreng',
  '煎咸鱼',
  '传统煎咸鱼，配饭和参巴酱',
  'malay',
  ARRAY['lunch', 'dinner'],
  5,
  10,
  4,
  'easy',
  true,
  true,
  6.00
);

-- 73. Sup Ekor (牛尾汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Oxtail Soup',
  'Sup Ekor',
  '牛尾汤',
  '慢炖牛尾汤配香料和蔬菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  150,
  6,
  'hard',
  true,
  16.00
);

-- 74. Mee Hoon Goreng (炒米粉)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Fried Rice Vermicelli',
  'Mee Hoon Goreng',
  '炒米粉',
  '简单家常炒米粉，配蔬菜和虾',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  10,
  4,
  'easy',
  true,
  5.50
);

-- 75. Ayam Golek (旋转烤鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Rotisserie Chicken',
  'Ayam Golek',
  '旋转烤鸡',
  '香料腌制旋转烤全鸡',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  60,
  6,
  'medium',
  true,
  12.00
);

-- 76. Kuih Talam (塔兰糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Two-Layer Coconut Cake',
  'Kuih Talam',
  '塔兰糕',
  '双层椰奶糕点，绿色底层和白色顶层',
  'malay',
  ARRAY['snack', 'dessert'],
  30,
  45,
  16,
  'medium',
  true,
  true,
  8.00
);

-- 77. Nasi Berlauk (菜饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Rice with Side Dishes',
  'Nasi Berlauk',
  '菜饭',
  '砂拉越特色饭，配多种小菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  40,
  4,
  'medium',
  true,
  9.00
);

-- 78. Ikan Bakar Sambal (参巴烤鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Grilled Fish with Sambal',
  'Ikan Bakar Sambal',
  '参巴烤鱼',
  '香蕉叶包烤鱼配辣参巴酱',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  30,
  4,
  'medium',
  true,
  true,
  11.50
);

-- 79. Kuih Seri Muka (双色糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Pandan Coconut Cake',
  'Kuih Seri Muka',
  '班兰糯米糕',
  '下层糯米，上层班兰蛋羹的双色糕',
  'malay',
  ARRAY['snack', 'dessert'],
  40,
  60,
  16,
  'hard',
  true,
  true,
  10.00
);

-- 80. Nasi Impit (压缩饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Compressed Rice',
  'Nasi Impit',
  '压缩饭',
  '压制米饭配沙爹花生酱，开斋节传统',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  90,
  8,
  'medium',
  true,
  true,
  6.00
);

-- 81. Fried Wanton Mee (云吞面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Wonton Noodles',
  'Mee Wantan',
  '云吞面',
  '干捞云吞面配炸云吞和叉烧',
  'chinese',
  ARRAY['lunch', 'dinner'],
  30,
  20,
  2,
  'medium',
  false,
  true,
  7.50
);

-- 82. Sambal Kangkung (参巴通菜)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, is_diabetic_friendly, estimated_cost)
VALUES (
  'Sambal Water Spinach',
  'Kangkung Belacan',
  '参巴通菜',
  '辣炒通菜，马来西亚家常菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  10,
  10,
  4,
  'easy',
  true,
  true,
  true,
  3.50
);

-- 83. Roti Bom (黄油煎饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Butter Bomb Roti',
  'Roti Bom',
  '黄油炸弹',
  '超多黄油的印度煎饼卷，撒糖',
  'indian',
  ARRAY['snack'],
  20,
  15,
  2,
  'medium',
  true,
  true,
  4.00
);

-- 84. Ketupat (粽饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Rice Dumplings',
  'Ketupat',
  '马来粽',
  '椰叶包饭，开斋节传统食物',
  'malay',
  ARRAY['lunch', 'dinner'],
  60,
  120,
  12,
  'hard',
  true,
  true,
  8.00
);

-- 85. Mee Kolok (干捞面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Sarawak Dry Noodles',
  'Mee Kolok',
  '砂拉越干捞面',
  '砂拉越特色干捞面配叉烧和云吞',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  15,
  2,
  'easy',
  false,
  6.50
);

-- 86. Kuih Cara Manis (煎糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Sweet Mini Pancakes',
  'Kuih Cara Manis',
  '小煎饼',
  '迷你椰糖煎饼，马来传统糕点',
  'malay',
  ARRAY['snack', 'dessert'],
  30,
  40,
  24,
  'medium',
  true,
  true,
  7.00
);

-- 87. Ikan Pari Bakar (烤魔鬼鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Grilled Stingray',
  'Ikan Pari Bakar',
  '烤魔鬼鱼',
  '参巴酱烤魔鬼鱼，香蕉叶包裹',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  2,
  'easy',
  true,
  true,
  12.00
);

-- 88. Nasi Goreng Cina (中式炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Chinese Style Fried Rice',
  'Nasi Goreng Cina',
  '中式炒饭',
  '传统中式蛋炒饭配叉烧和虾',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  10,
  4,
  'easy',
  false,
  7.00
);

-- 89. Laksa Johor (柔佛叻沙)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Johor Laksa',
  'Laksa Johor',
  '柔佛叻沙',
  '柔佛特色叻沙，用意大利面配鱼汁',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  45,
  4,
  'medium',
  true,
  true,
  8.50
);

-- 90. Putu Mayam (粉丝糕)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'String Hoppers',
  'Putu Mayam',
  '印度粉丝',
  '细米粉丝配椰丝和糖，印度早餐',
  'indian',
  ARRAY['breakfast', 'snack'],
  30,
  20,
  6,
  'medium',
  true,
  true,
  4.50
);

-- ========== 新增30道菜品 (91-120) ==========

-- 91. Nasi Hujan Panas (热雨饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Hot Rain Rice',
  'Nasi Hujan Panas',
  '热雨饭',
  '吉兰丹特色米饭配咖喱鸡和腌菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  40,
  4,
  'medium',
  true,
  9.00
);

-- 92. Ikan Pari Asam Pedas (酸辣魔鬼鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Spicy Sour Stingray',
  'Ikan Pari Asam Pedas',
  '酸辣魔鬼鱼',
  '酸辣魔鬼鱼汤，麻六甲特色',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  30,
  3,
  'medium',
  true,
  true,
  13.00
);

-- 93. Nasi Goreng Kerabu (吉兰丹炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Kerabu Fried Rice',
  'Nasi Goreng Kerabu',
  '吉兰丹炒饭',
  '蓝色香草炒饭配炸鸡',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  15,
  3,
  'medium',
  true,
  8.00
);

-- 94. Udang Galah Masak Lemak (河虾椰奶咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Prawn Coconut Curry',
  'Udang Galah Masak Lemak',
  '河虾椰奶咖喱',
  '大河虾配黄姜椰奶汁',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  25,
  4,
  'medium',
  true,
  true,
  15.00
);

-- 95. Roti Jala (网饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Net Bread',
  'Roti Jala',
  '网饼',
  '马来传统网状煎饼，配咖喱',
  'malay',
  ARRAY['breakfast', 'snack'],
  30,
  20,
  6,
  'medium',
  true,
  5.00
);

-- 96. Ikan Bakar Portugis (葡式烤鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Portuguese Grilled Fish',
  'Ikan Bakar Portugis',
  '葡式烤鱼',
  '麻六甲葡萄牙风味烤鱼',
  'portuguese',
  ARRAY['lunch', 'dinner'],
  20,
  25,
  3,
  'medium',
  false,
  true,
  12.00
);

-- 97. Nasi Minyak (油饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Ghee Rice',
  'Nasi Minyak',
  '油饭',
  '印度回教酥油香料饭',
  'indian',
  ARRAY['lunch', 'dinner'],
  15,
  30,
  6,
  'medium',
  true,
  7.50
);

-- 98. Ayam Kapitan (甲必丹鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Captain Chicken Curry',
  'Ayam Kapitan',
  '甲必丹鸡',
  '马六甲娘惹辣椰奶鸡',
  'nyonya',
  ARRAY['lunch', 'dinner'],
  25,
  40,
  4,
  'medium',
  true,
  10.00
);

-- 99. Kuih Bangkit (木薯饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Tapioca Cookies',
  'Kuih Bangkit',
  '木薯饼',
  '新年传统椰香小饼干',
  'chinese',
  ARRAY['snack', 'dessert'],
  40,
  30,
  30,
  'medium',
  true,
  true,
  6.00
);

-- 100. Ikan Kembung Sumbat (酿鲭鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Stuffed Mackerel',
  'Ikan Kembung Sumbat',
  '酿鲭鱼',
  '参巴酿鲭鱼，登嘉楼特色',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  20,
  4,
  'hard',
  true,
  true,
  9.00
);

-- 101. Nasi Goreng Paprik (辣椒炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Paprika Fried Rice',
  'Nasi Goreng Paprik',
  '辣椒炒饭',
  '马来辣椒炒饭配鸡蛋',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  12,
  2,
  'easy',
  true,
  6.50
);

-- 102. Sup Kambing (羊肉汤)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Mutton Soup',
  'Sup Kambing',
  '羊肉汤',
  '印度回教羊肉香料汤',
  'indian',
  ARRAY['lunch', 'dinner'],
  15,
  60,
  6,
  'medium',
  true,
  11.00
);

-- 103. Ikan Patin Masak Tempoyak (榴莲膏鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Patin Fish with Durian Paste',
  'Ikan Patin Masak Tempoyak',
  '榴莲膏鱼',
  '彭亨河鱼配发酵榴莲',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  35,
  4,
  'medium',
  true,
  true,
  12.00
);

-- 104. Mee Jawa (爪哇面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Javanese Noodles',
  'Mee Jawa',
  '爪哇面',
  '柔佛浓汁黄面配薯仔',
  'indonesian',
  ARRAY['lunch', 'dinner'],
  20,
  25,
  3,
  'medium',
  true,
  6.00
);

-- 105. Pulut Kuning (黄糯米)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Yellow Glutinous Rice',
  'Pulut Kuning',
  '黄糯米',
  '黄姜椰奶糯米，马来庆典必备',
  'malay',
  ARRAY['breakfast', 'lunch'],
  30,
  40,
  8,
  'medium',
  true,
  true,
  6.50
);

-- 106. Ayam Kurma (咖喱鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Chicken Korma',
  'Ayam Kurma',
  '咖喱鸡',
  '印度回教奶油咖喱鸡',
  'indian',
  ARRAY['lunch', 'dinner'],
  20,
  35,
  5,
  'medium',
  true,
  9.50
);

-- 107. Ikan Bakar Cencaru (烤竹荚鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Grilled Scad Fish',
  'Ikan Bakar Cencaru',
  '烤竹荚鱼',
  '参巴烤竹荚鱼配青柠',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  3,
  'easy',
  true,
  true,
  8.50
);

-- 108. Nasi Goreng Thai (泰式炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Thai Fried Rice',
  'Nasi Goreng Thai',
  '泰式炒饭',
  '泰式炒饭配虾和罗勒叶',
  'thai',
  ARRAY['lunch', 'dinner'],
  15,
  12,
  2,
  'easy',
  true,
  7.00
);

-- 109. Udang Masak Kicap (豉油虾)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Soy Sauce Prawns',
  'Udang Masak Kicap',
  '豉油虾',
  '马来式豉油虾配辣椒',
  'malay',
  ARRAY['lunch', 'dinner'],
  10,
  15,
  3,
  'easy',
  true,
  true,
  11.00
);

-- 110. Roti Planta (植物牛油煎饼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Planta Roti',
  'Roti Planta',
  '植物牛油煎饼',
  '印度煎饼配植物牛油和糖',
  'indian',
  ARRAY['breakfast', 'snack'],
  20,
  15,
  4,
  'medium',
  true,
  4.00
);

-- 111. Ayam Goreng Kunyit (黄姜炸鸡)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Turmeric Fried Chicken',
  'Ayam Goreng Kunyit',
  '黄姜炸鸡',
  '黄姜腌制炸鸡，金黄酥脆',
  'malay',
  ARRAY['lunch', 'dinner'],
  30,
  20,
  4,
  'easy',
  true,
  8.50
);

-- 112. Ikan Pari Bakar Sambal (参巴烤魔鬼鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Sambal Grilled Stingray',
  'Ikan Pari Bakar Sambal',
  '参巴烤魔鬼鱼',
  '辣参巴烤魔鬼鱼',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  20,
  2,
  'easy',
  true,
  true,
  12.00
);

-- 113. Nasi Goreng Belacan (虾膏炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Shrimp Paste Fried Rice',
  'Nasi Goreng Belacan',
  '虾膏炒饭',
  '虾膏炒饭配江鱼仔',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  12,
  3,
  'easy',
  true,
  6.50
);

-- 114. Gulai Ikan (鱼咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Fish Curry',
  'Gulai Ikan',
  '鱼咖喱',
  '马来黄姜鱼咖喱',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  25,
  4,
  'easy',
  true,
  true,
  9.00
);

-- 115. Kuih Ketayap (绿煎饼卷)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, is_vegetarian, estimated_cost)
VALUES (
  'Pandan Crepes',
  'Kuih Ketayap',
  '绿煎饼卷',
  '班兰煎饼卷椰丝糖',
  'malay',
  ARRAY['snack', 'dessert'],
  35,
  25,
  12,
  'medium',
  true,
  true,
  5.50
);

-- 116. Ikan Keli Masak Lemak (鲶鱼椰奶咖喱)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Catfish Coconut Curry',
  'Ikan Keli Masak Lemak',
  '鲶鱼椰奶咖喱',
  '鲶鱼黄姜椰奶咖喱',
  'malay',
  ARRAY['lunch', 'dinner'],
  15,
  25,
  4,
  'easy',
  true,
  true,
  8.00
);

-- 117. Mee Goreng Mamak (印度炒面)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Mamak Fried Noodles',
  'Mee Goreng Mamak',
  '印度炒面',
  '印度回教辣炒黄面',
  'indian',
  ARRAY['lunch', 'dinner'],
  15,
  15,
  2,
  'easy',
  true,
  6.00
);

-- 118. Sotong Goreng Tepung (炸鱿鱼)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, contains_seafood, estimated_cost)
VALUES (
  'Fried Squid',
  'Sotong Goreng Tepung',
  '炸鱿鱼',
  '酥炸鱿鱼配辣椒酱',
  'malay',
  ARRAY['lunch', 'dinner', 'snack'],
  20,
  15,
  4,
  'easy',
  true,
  true,
  10.00
);

-- 119. Nasi Goreng Ikan Masin (咸鱼炒饭)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Salted Fish Fried Rice',
  'Nasi Goreng Ikan Masin',
  '咸鱼炒饭',
  '咸鱼炒饭配鸡肉粒',
  'chinese',
  ARRAY['lunch', 'dinner'],
  15,
  12,
  3,
  'easy',
  false,
  7.00
);

-- 120. Bubur Lambuk (开斋粥)
INSERT INTO recipes (name_en, name_ms, name_zh, description, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, is_halal, estimated_cost)
VALUES (
  'Ramadan Porridge',
  'Bubur Lambuk',
  '开斋粥',
  '斋戒月香料粥配牛肉和蔬菜',
  'malay',
  ARRAY['lunch', 'dinner'],
  20,
  45,
  8,
  'medium',
  true,
  7.50
);
