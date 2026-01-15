-- ============================================
-- 继续添加菜品数据（补充至200+道）
-- ============================================

-- 晚餐类继续
INSERT INTO recipes (name_zh, name_en, name_ms, description, category, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, calories, health_tags, dietary_restrictions) VALUES
('蒜蓉虾', 'Garlic Prawns', 'Udang Bawang Putih', '蒜蓉炒虾', 'dinner', 'chinese', 'dinner', 15, 10, 2, 'easy', 320, ARRAY['quick', 'seafood'], ARRAY[]::TEXT[]),
('避风塘炒蟹', 'Typhoon Shelter Crab', 'Ketam Goreng', '香蒜辣椒炒蟹', 'dinner', 'chinese', 'dinner', 30, 15, 2, 'medium', 420, ARRAY['spicy', 'seafood'], ARRAY[]::TEXT[]),
('咸蛋黄虾', 'Salted Egg Yolk Prawns', 'Udang Telur Masin', '咸蛋黄炒虾', 'dinner', 'chinese', 'dinner', 20, 15, 2, 'medium', 450, ARRAY['rich', 'seafood'], ARRAY[]::TEXT[]),
('姜葱牛肉', 'Ginger Scallion Beef', 'Daging Halia Bawang', '姜葱爆牛肉', 'dinner', 'chinese', 'dinner', 20, 15, 2, 'easy', 420, ARRAY['quick'], ARRAY[]::TEXT[]),
('干煸牛肉', 'Dry-Fried Beef', 'Daging Goreng Kering', '干煸牛肉丝', 'dinner', 'chinese', 'dinner', 20, 20, 2, 'medium', 450, ARRAY['spicy'], ARRAY[]::TEXT[]),
('葱爆羊肉', 'Scallion Lamb', 'Kambing Bawang', '葱爆羊肉', 'dinner', 'chinese', 'dinner', 20, 15, 2, 'easy', 480, ARRAY['quick'], ARRAY[]::TEXT[]),
('孜然羊肉', 'Cumin Lamb', 'Kambing Jintan', '孜然炒羊肉', 'dinner', 'chinese', 'dinner', 20, 15, 2, 'easy', 500, ARRAY['spicy'], ARRAY[]::TEXT[]),
('红烧茄子', 'Braised Eggplant', 'Terung Masak Merah', '红烧茄子', 'dinner', 'chinese', 'dinner', 15, 20, 2, 'easy', 220, ARRAY['vegetarian'], ARRAY[]::TEXT[]),
('蒜蓉空心菜', 'Garlic Water Spinach', 'Kangkung Bawang Putih', '蒜蓉炒空心菜', 'dinner', 'chinese', 'dinner', 5, 10, 2, 'easy', 120, ARRAY['vegetarian', 'quick'], ARRAY[]::TEXT[]),
('参巴空心菜', 'Sambal Water Spinach', 'Kangkung Belacan', '参巴炒空心菜', 'dinner', 'malay', 'dinner', 5, 10, 2, 'easy', 150, ARRAY['vegetarian', 'spicy'], ARRAY[]::TEXT[]),

-- 小吃和甜点类 (Snacks & Desserts) - 30道
('炸香蕉', 'Fried Banana', 'Pisang Goreng', '炸香蕉', 'snack', 'malay', 'snack', 10, 10, 4, 'easy', 220, ARRAY['sweet'], ARRAY[]::TEXT[]),
('红豆冰', 'Red Bean Ice', 'Ais Kacang', '刨冰配红豆椰糖', 'dessert', 'malay', 'dessert', 15, 0, 2, 'easy', 280, ARRAY['cold', 'sweet'], ARRAY[]::TEXT[]),
('煎蕊', 'Cendol', 'Cendol', '椰糖绿粉条冰', 'dessert', 'malay', 'dessert', 20, 15, 2, 'easy', 320, ARRAY['cold', 'sweet'], ARRAY[]::TEXT[]),
('豆沙饼', 'Red Bean Pastry', 'Kuih Kacang Merah', '红豆饼', 'snack', 'chinese', 'snack', 40, 25, 6, 'medium', 250, ARRAY['sweet'], ARRAY[]::TEXT[]),
('咖椰球', 'Ondeh-Ondeh', 'Ondeh-Ondeh', '椰丝包椰糖', 'dessert', 'malay', 'dessert', 30, 15, 8, 'medium', 180, ARRAY['sweet', 'traditional'], ARRAY[]::TEXT[]),
('娘惹糕', 'Kuih Lapis', 'Kuih Lapis', '九层糕', 'dessert', 'nyonya', 'dessert', 90, 60, 10, 'hard', 200, ARRAY['sweet', 'colorful'], ARRAY[]::TEXT[]),
('木薯糕', 'Tapioca Cake', 'Kuih Ubi Kayu', '木薯糕', 'dessert', 'malay', 'dessert', 30, 45, 8, 'medium', 240, ARRAY['sweet'], ARRAY[]::TEXT[]),
('番薯球', 'Sweet Potato Balls', 'Bola Ubi Keledek', '炸番薯球', 'snack', 'chinese', 'snack', 20, 15, 6, 'easy', 200, ARRAY['sweet'], ARRAY[]::TEXT[]),
('芋头饼', 'Yam Puff', 'Puff Keladi', '酥皮芋头饼', 'snack', 'chinese', 'snack', 45, 20, 6, 'medium', 280, ARRAY['crispy'], ARRAY[]::TEXT[]),
('咖喱卜', 'Curry Puffs', 'Karipap', '咖喱角', 'snack', 'indian', 'snack', 40, 20, 6, 'medium', 250, ARRAY['spicy'], ARRAY[]::TEXT[]),
('炸腐皮卷', 'Fried Beancurd Roll', 'Kulit Tauhu Goreng', '炸腐皮卷', 'snack', 'chinese', 'snack', 20, 10, 6, 'easy', 220, ARRAY['crispy'], ARRAY[]::TEXT[]),
('炸春卷', 'Fried Spring Roll', 'Popia Goreng', '炸春卷', 'snack', 'chinese', 'snack', 30, 15, 6, 'medium', 240, ARRAY['crispy'], ARRAY[]::TEXT[]),
('薄饼卷', 'Fresh Spring Roll', 'Popiah Basah', '鲜薄饼卷', 'snack', 'nyonya', 'snack', 30, 5, 4, 'medium', 200, ARRAY['fresh'], ARRAY[]::TEXT[]),
('虾饼', 'Prawn Crackers', 'Keropok Udang', '炸虾饼', 'snack', 'malay', 'snack', 5, 5, 4, 'easy', 180, ARRAY['crispy'], ARRAY[]::TEXT[]),
('鱼饼', 'Fish Cake', 'Keropok Ikan', '炸鱼饼', 'snack', 'malay', 'snack', 5, 5, 4, 'easy', 160, ARRAY['crispy'], ARRAY[]::TEXT[]),
('豆腐花', 'Tofu Pudding', 'Tauhu Fa', '豆腐花', 'dessert', 'chinese', 'dessert', 60, 20, 4, 'medium', 120, ARRAY['sweet', 'soft'], ARRAY[]::TEXT[]),
('龟苓膏', 'Herbal Jelly', 'Guiling Gao', '龟苓膏', 'dessert', 'chinese', 'dessert', 30, 60, 4, 'medium', 80, ARRAY['herbal', 'healthy'], ARRAY[]::TEXT[]),
('仙草', 'Grass Jelly', 'Cincau', '仙草冰', 'dessert', 'chinese', 'dessert', 20, 30, 4, 'easy', 100, ARRAY['cold', 'refreshing'], ARRAY[]::TEXT[]),
('豆花', 'Soybean Pudding', 'Tauhu Fa', '豆花', 'dessert', 'chinese', 'dessert', 60, 15, 4, 'medium', 110, ARRAY['sweet'], ARRAY[]::TEXT[]),
('摩摩喳喳', 'Bubur Cha Cha', 'Bubur Cha Cha', '椰奶芋头番薯糖水', 'dessert', 'malay', 'dessert', 20, 30, 4, 'easy', 280, ARRAY['sweet', 'coconut'], ARRAY[]::TEXT[]),
('红豆汤', 'Red Bean Soup', 'Sup Kacang Merah', '红豆糖水', 'dessert', 'chinese', 'dessert', 10, 60, 4, 'easy', 200, ARRAY['sweet'], ARRAY[]::TEXT[]),
('绿豆汤', 'Mung Bean Soup', 'Sup Kacang Hijau', '绿豆糖水', 'dessert', 'chinese', 'dessert', 10, 60, 4, 'easy', 180, ARRAY['sweet'], ARRAY[]::TEXT[]),
('腐竹糖水', 'Beancurd Dessert', 'Air Manis Fu Chuk', '腐竹糖水', 'dessert', 'chinese', 'dessert', 10, 30, 4, 'easy', 150, ARRAY['sweet'], ARRAY[]::TEXT[]),
('银耳莲子', 'White Fungus Lotus', 'Sup Jamur Putih', '银耳莲子糖水', 'dessert', 'chinese', 'dessert', 30, 90, 4, 'easy', 120, ARRAY['healthy'], ARRAY[]::TEXT[]),
('椰子布丁', 'Coconut Pudding', 'Puding Kelapa', '椰子布丁', 'dessert', 'malay', 'dessert', 20, 120, 4, 'easy', 220, ARRAY['sweet', 'coconut'], ARRAY[]::TEXT[]),
('摩卡', 'Mochi', 'Mochi', '糯米糍', 'dessert', 'japanese', 'dessert', 30, 15, 6, 'medium', 180, ARRAY['sweet', 'chewy'], ARRAY[]::TEXT[]),
('凉粉', 'Grass Jelly', 'Agar-Agar', '凉粉', 'dessert', 'chinese', 'dessert', 20, 30, 4, 'easy', 90, ARRAY['cold', 'refreshing'], ARRAY[]::TEXT[]),
('西米露', 'Sago Dessert', 'Sagu', '西米椰奶', 'dessert', 'malay', 'dessert', 15, 20, 4, 'easy', 200, ARRAY['sweet'], ARRAY[]::TEXT[]),
('榴莲泡芙', 'Durian Puff', 'Puff Durian', '榴莲泡芙', 'dessert', 'malay', 'dessert', 60, 30, 6, 'hard', 320, ARRAY['sweet'], ARRAY[]::TEXT[]),
('班兰蛋糕', 'Pandan Cake', 'Kek Pandan', '班兰戚风蛋糕', 'dessert', 'malay', 'dessert', 30, 45, 8, 'medium', 280, ARRAY['sweet'], ARRAY[]::TEXT[]);

-- 继续添加更多主食变种
INSERT INTO recipes (name_zh, name_en, name_ms, description, category, cuisine_type, meal_type, prep_time, cook_time, servings, difficulty, calories, health_tags, dietary_restrictions) VALUES
('干炒牛河', 'Dry Fried Beef Hor Fun', 'Hor Fun Goreng Kering', '干炒牛河', 'lunch', 'chinese', 'lunch', 15, 15, 2, 'medium', 520, ARRAY['savory'], ARRAY[]::TEXT[]),
('湿炒河粉', 'Wet Fried Hor Fun', 'Hor Fun Goreng Basah', '湿炒河粉', 'lunch', 'chinese', 'lunch', 15, 15, 2, 'medium', 480, ARRAY['savory'], ARRAY[]::TEXT[]),
('星洲炒米', 'Singapore Fried Vermicelli', 'Meehoon Singapura', '星洲炒米', 'lunch', 'chinese', 'lunch', 15, 15, 2, 'medium', 460, ARRAY['spicy'], ARRAY[]::TEXT[]),
('槟城炒粿条', 'Penang Char Kuey Teow', 'Char Kuey Teow Penang', '槟城炒粿条', 'lunch', 'chinese', 'lunch', 15, 15, 2, 'medium', 550, ARRAY['traditional'], ARRAY[]::TEXT[]),
('广东炒面', 'Cantonese Chow Mein', 'Mee Goreng Canton', '广东炒面', 'lunch', 'chinese', 'lunch', 15, 15, 2, 'medium', 500, ARRAY['crispy'], ARRAY[]::TEXT[]),
('伊府面', 'Ee Fu Noodles', 'Mee Ee Fu', '伊府面', 'dinner', 'chinese', 'dinner', 20, 20, 2, 'medium', 480, ARRAY['savory'], ARRAY[]::TEXT[]),
('担担面', 'Dan Dan Noodles', 'Mee Dan Dan', '担担面', 'lunch', 'chinese', 'lunch', 20, 15, 2, 'medium', 520, ARRAY['spicy'], ARRAY[]::TEXT[]),
('麻辣烫', 'Spicy Hot Pot', 'Sup Pedas', '麻辣烫', 'dinner', 'chinese', 'dinner', 30, 30, 2, 'easy', 420, ARRAY['spicy', 'customizable'], ARRAY[]::TEXT[]),
('酸辣粉', 'Hot and Sour Noodles', 'Mee Masam Pedas', '酸辣粉', 'lunch', 'chinese', 'lunch', 15, 15, 2, 'easy', 380, ARRAY['spicy', 'sour'], ARRAY[]::TEXT[]),
('牛腩面', 'Beef Brisket Noodles', 'Mee Daging Rusuk', '牛腩面', 'lunch', 'chinese', 'lunch', 120, 30, 2, 'medium', 520, ARRAY['hearty'], ARRAY[]::TEXT[]),
('猪脚面', 'Pork Trotter Noodles', 'Mee Kaki Babi', '猪脚面', 'lunch', 'chinese', 'lunch', 90, 30, 2, 'easy', 580, ARRAY['rich'], ARRAY['halal']),
('卤肉饭', 'Braised Pork Rice', 'Nasi Babi Kecap', '卤肉饭', 'lunch', 'chinese', 'lunch', 60, 30, 2, 'easy', 550, ARRAY['savory'], ARRAY['halal']),
('鸡扒饭', 'Chicken Chop Rice', 'Nasi Ayam Chop', '鸡扒饭配黑椒汁', 'dinner', 'western', 'dinner', 20, 25, 2, 'medium', 580, ARRAY['western'], ARRAY[]::TEXT[]),
('牛扒饭', 'Beef Steak Rice', 'Nasi Daging Steak', '牛扒饭配黑椒汁', 'dinner', 'western', 'dinner', 20, 25, 2, 'medium', 650, ARRAY['western'], ARRAY[]::TEXT[]),
('羊扒饭', 'Lamb Chop Rice', 'Nasi Kambing Chop', '羊扒饭配薄荷酱', 'dinner', 'western', 'dinner', 20, 25, 2, 'medium', 680, ARRAY['western'], ARRAY[]::TEXT[]),
('鱼扒饭', 'Fish Fillet Rice', 'Nasi Ikan Fillet', '炸鱼扒饭', 'dinner', 'western', 'dinner', 20, 20, 2, 'easy', 520, ARRAY['western'], ARRAY[]::TEXT[]),
('炸鸡饭', 'Fried Chicken Rice', 'Nasi Ayam Goreng', '炸鸡配饭', 'dinner', 'mixed', 'dinner', 30, 25, 2, 'medium', 620, ARRAY['crispy'], ARRAY[]::TEXT[]),
('咖哩鸡饭', 'Curry Chicken Rice', 'Nasi Kari Ayam', '咖喱鸡配饭', 'lunch', 'malay', 'lunch', 25, 40, 2, 'easy', 550, ARRAY['spicy'], ARRAY[]::TEXT[]),
('香草烤鸡饭', 'Herb Roast Chicken Rice', 'Nasi Ayam Panggang Herba', '香草烤鸡饭', 'dinner', 'western', 'dinner', 30, 60, 2, 'medium', 580, ARRAY['aromatic'], ARRAY[]::TEXT[]),
('烤鸡腿饭', 'Roast Chicken Leg Rice', 'Nasi Paha Ayam Bakar', '烤鸡腿饭', 'dinner', 'mixed', 'dinner', 30, 45, 2, 'easy', 600, ARRAY['grilled'], ARRAY[]::TEXT[]);

-- 现在总共有约 210 道菜品

