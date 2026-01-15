-- ============================================
-- 马来西亚膳食计划 - 菜品和食材数据库
-- ============================================

-- 1. 食材表（已存在，补充价格数据）
-- 更新现有 ingredients 表，添加更多食材和价格

-- 清空并重新填充食材数据
TRUNCATE TABLE ingredients CASCADE;

-- 插入马来西亚常见食材（包含价格，单位：马币/kg 或 马币/份）
INSERT INTO ingredients (name_zh, name_en, name_ms, category, unit, price_per_unit) VALUES
-- 肉类 (Meat)
('鸡肉', 'Chicken', 'Ayam', 'meat', 'kg', 12.00),
('鸡腿', 'Chicken Leg', 'Paha Ayam', 'meat', 'kg', 15.00),
('鸡翅', 'Chicken Wings', 'Sayap Ayam', 'meat', 'kg', 18.00),
('鸡胸肉', 'Chicken Breast', 'Dada Ayam', 'meat', 'kg', 16.00),
('牛肉', 'Beef', 'Daging Lembu', 'meat', 'kg', 35.00),
('羊肉', 'Lamb', 'Daging Kambing', 'meat', 'kg', 40.00),
('猪肉', 'Pork', 'Daging Babi', 'meat', 'kg', 18.00),
('排骨', 'Pork Ribs', 'Tulang Babi', 'meat', 'kg', 25.00),
('鸭肉', 'Duck', 'Itik', 'meat', 'kg', 20.00),

-- 海鲜 (Seafood)
('虾', 'Prawns', 'Udang', 'seafood', 'kg', 35.00),
('大虾', 'Large Prawns', 'Udang Besar', 'seafood', 'kg', 45.00),
('鱼', 'Fish', 'Ikan', 'seafood', 'kg', 15.00),
('石斑鱼', 'Grouper', 'Ikan Kerapu', 'seafood', 'kg', 40.00),
('鲳鱼', 'Pomfret', 'Ikan Bawal', 'seafood', 'kg', 30.00),
('鲭鱼', 'Mackerel', 'Ikan Kembung', 'seafood', 'kg', 12.00),
('鱿鱼', 'Squid', 'Sotong', 'seafood', 'kg', 18.00),
('螃蟹', 'Crab', 'Ketam', 'seafood', 'kg', 45.00),
('贝类', 'Shellfish', 'Kerang', 'seafood', 'kg', 20.00),
('蛤蜊', 'Clams', 'Lala', 'seafood', 'kg', 15.00),

-- 蔬菜 (Vegetables)
('白菜', 'Cabbage', 'Kobis', 'vegetable', 'kg', 3.00),
('菠菜', 'Spinach', 'Bayam', 'vegetable', 'kg', 4.00),
('生菜', 'Lettuce', 'Salad', 'vegetable', 'kg', 5.00),
('西兰花', 'Broccoli', 'Brokoli', 'vegetable', 'kg', 8.00),
('花椰菜', 'Cauliflower', 'Kembang Kol', 'vegetable', 'kg', 7.00),
('胡萝卜', 'Carrot', 'Lobak Merah', 'vegetable', 'kg', 4.00),
('洋葱', 'Onion', 'Bawang Besar', 'vegetable', 'kg', 5.00),
('大葱', 'Spring Onion', 'Daun Bawang', 'vegetable', 'bundle', 2.00),
('大蒜', 'Garlic', 'Bawang Putih', 'vegetable', 'kg', 8.00),
('生姜', 'Ginger', 'Halia', 'vegetable', 'kg', 6.00),
('辣椒', 'Chili', 'Cili', 'vegetable', 'kg', 5.00),
('青椒', 'Green Pepper', 'Lada Hijau', 'vegetable', 'kg', 6.00),
('番茄', 'Tomato', 'Tomato', 'vegetable', 'kg', 5.00),
('黄瓜', 'Cucumber', 'Timun', 'vegetable', 'kg', 3.00),
('茄子', 'Eggplant', 'Terung', 'vegetable', 'kg', 4.00),
('豆芽', 'Bean Sprouts', 'Taugeh', 'vegetable', 'kg', 3.00),
('空心菜', 'Water Spinach', 'Kangkung', 'vegetable', 'kg', 3.00),
('芥蓝', 'Chinese Kale', 'Kailan', 'vegetable', 'kg', 5.00),
('菜心', 'Choy Sum', 'Sawi', 'vegetable', 'kg', 4.00),
('长豆', 'Long Beans', 'Kacang Panjang', 'vegetable', 'kg', 4.00),
('四季豆', 'French Beans', 'Kacang Buncis', 'vegetable', 'kg', 6.00),
('玉米', 'Corn', 'Jagung', 'vegetable', 'pcs', 2.00),
('土豆', 'Potato', 'Kentang', 'vegetable', 'kg', 3.00),
('红薯', 'Sweet Potato', 'Keledek', 'vegetable', 'kg', 3.00),
('南瓜', 'Pumpkin', 'Labu', 'vegetable', 'kg', 3.00),

-- 主食 (Staples)
('米饭', 'Rice', 'Nasi', 'grain', 'kg', 4.00),
('白米', 'White Rice', 'Beras Putih', 'grain', 'kg', 4.00),
('糯米', 'Glutinous Rice', 'Pulut', 'grain', 'kg', 5.00),
('面条', 'Noodles', 'Mee', 'grain', 'kg', 6.00),
('黄面', 'Yellow Noodles', 'Mee Kuning', 'grain', 'kg', 5.00),
('米粉', 'Rice Noodles', 'Meehoon', 'grain', 'kg', 5.00),
('粿条', 'Flat Noodles', 'Kuey Teow', 'grain', 'kg', 5.00),
('河粉', 'Rice Noodles', 'Hor Fun', 'grain', 'kg', 5.00),
('面包', 'Bread', 'Roti', 'grain', 'loaf', 3.00),
('馒头', 'Steamed Bun', 'Pau', 'grain', 'pcs', 1.50),

-- 豆制品 (Soy Products)
('豆腐', 'Tofu', 'Tauhu', 'protein', 'block', 2.00),
('豆干', 'Dried Tofu', 'Tauhu Kering', 'protein', 'pack', 3.00),
('腐竹', 'Beancurd Skin', 'Fu Chuk', 'protein', 'pack', 5.00),
('豆浆', 'Soy Milk', 'Susu Soya', 'protein', 'liter', 5.00),
('天贝', 'Tempeh', 'Tempe', 'protein', 'block', 3.00),

-- 蛋奶类 (Dairy & Eggs)
('鸡蛋', 'Eggs', 'Telur', 'dairy', 'tray', 8.00),
('咸蛋', 'Salted Egg', 'Telur Masin', 'dairy', 'pcs', 1.50),
('皮蛋', 'Century Egg', 'Telur Pitan', 'dairy', 'pcs', 2.00),
('牛奶', 'Milk', 'Susu', 'dairy', 'liter', 8.00),
('椰奶', 'Coconut Milk', 'Santan', 'dairy', 'can', 5.00),
('炼乳', 'Condensed Milk', 'Susu Pekat', 'dairy', 'can', 5.00),
('奶油', 'Cream', 'Krim', 'dairy', 'pack', 10.00),
('酸奶', 'Yogurt', 'Yogurt', 'dairy', 'cup', 3.00),
('芝士', 'Cheese', 'Keju', 'dairy', 'pack', 15.00),

-- 调味料 (Seasonings)
('盐', 'Salt', 'Garam', 'seasoning', 'kg', 2.00),
('糖', 'Sugar', 'Gula', 'seasoning', 'kg', 3.00),
('酱油', 'Soy Sauce', 'Kicap', 'seasoning', 'bottle', 5.00),
('蚝油', 'Oyster Sauce', 'Sos Tiram', 'seasoning', 'bottle', 8.00),
('鱼露', 'Fish Sauce', 'Sos Ikan', 'seasoning', 'bottle', 6.00),
('醋', 'Vinegar', 'Cuka', 'seasoning', 'bottle', 4.00),
('料酒', 'Cooking Wine', 'Arak Masak', 'seasoning', 'bottle', 8.00),
('麻油', 'Sesame Oil', 'Minyak Bijan', 'seasoning', 'bottle', 12.00),
('食用油', 'Cooking Oil', 'Minyak Masak', 'seasoning', 'liter', 10.00),
('花生油', 'Peanut Oil', 'Minyak Kacang', 'seasoning', 'liter', 15.00),
('椰子油', 'Coconut Oil', 'Minyak Kelapa', 'seasoning', 'bottle', 20.00),

-- 香料 (Spices)
('咖喱粉', 'Curry Powder', 'Serbuk Kari', 'spice', 'pack', 8.00),
('辣椒粉', 'Chili Powder', 'Serbuk Cili', 'spice', 'pack', 6.00),
('姜黄粉', 'Turmeric Powder', 'Serbuk Kunyit', 'spice', 'pack', 5.00),
('香茅', 'Lemongrass', 'Serai', 'spice', 'bundle', 3.00),
('南姜', 'Galangal', 'Lengkuas', 'spice', 'kg', 8.00),
('青柠叶', 'Kaffir Lime Leaves', 'Daun Limau Purut', 'spice', 'pack', 3.00),
('咖喱叶', 'Curry Leaves', 'Daun Kari', 'spice', 'pack', 2.00),
('八角', 'Star Anise', 'Bunga Lawang', 'spice', 'pack', 10.00),
('肉桂', 'Cinnamon', 'Kayu Manis', 'spice', 'pack', 8.00),
('丁香', 'Cloves', 'Bunga Cengkih', 'spice', 'pack', 15.00),
('小茴香', 'Cumin', 'Jintan Putih', 'spice', 'pack', 8.00),
('芫荽', 'Coriander', 'Ketumbar', 'spice', 'bundle', 2.00),
('罗勒', 'Basil', 'Selasih', 'spice', 'bundle', 3.00),
('薄荷', 'Mint', 'Pudina', 'spice', 'bundle', 3.00),

-- 酱料 (Sauces & Pastes)
('参巴酱', 'Sambal', 'Sambal', 'sauce', 'jar', 8.00),
('虾酱', 'Shrimp Paste', 'Belacan', 'sauce', 'pack', 10.00),
('豆瓣酱', 'Bean Paste', 'Taucu', 'sauce', 'jar', 6.00),
('花生酱', 'Peanut Sauce', 'Sos Kacang', 'sauce', 'jar', 10.00),
('甜酱油', 'Sweet Soy Sauce', 'Kicap Manis', 'sauce', 'bottle', 6.00),
('辣椒酱', 'Chili Sauce', 'Sos Cili', 'sauce', 'bottle', 5.00),
('番茄酱', 'Tomato Sauce', 'Sos Tomato', 'sauce', 'bottle', 6.00),

-- 干货 (Dried Goods)
('花生', 'Peanuts', 'Kacang Tanah', 'nuts', 'kg', 12.00),
('腰果', 'Cashew Nuts', 'Gajus', 'nuts', 'kg', 40.00),
('杏仁', 'Almonds', 'Badam', 'nuts', 'kg', 50.00),
('核桃', 'Walnuts', 'Walnut', 'nuts', 'kg', 60.00),
('椰丝', 'Coconut Flakes', 'Kelapa Parut', 'dried', 'pack', 5.00),
('椰子', 'Coconut', 'Kelapa', 'fruit', 'pcs', 3.00),
('木耳', 'Wood Ear Fungus', 'Cendawan Telinga', 'dried', 'pack', 15.00),
('香菇', 'Shiitake Mushroom', 'Cendawan Shiitake', 'dried', 'pack', 20.00),
('金针菇', 'Enoki Mushroom', 'Cendawan Enoki', 'vegetable', 'pack', 5.00),

-- 水果 (Fruits)
('香蕉', 'Banana', 'Pisang', 'fruit', 'kg', 4.00),
('芒果', 'Mango', 'Mangga', 'fruit', 'kg', 6.00),
('木瓜', 'Papaya', 'Betik', 'fruit', 'kg', 3.00),
('菠萝', 'Pineapple', 'Nanas', 'pcs', 4.00),
('西瓜', 'Watermelon', 'Tembikai', 'kg', 2.00),
('榴莲', 'Durian', 'Durian', 'kg', 25.00),
('山竹', 'Mangosteen', 'Manggis', 'kg', 15.00),
('红毛丹', 'Rambutan', 'Rambutan', 'kg', 8.00),
('龙眼', 'Longan', 'Lengkeng', 'kg', 10.00),
('柠檬', 'Lemon', 'Lemon', 'pcs', 0.50),
('青柠', 'Lime', 'Limau Nipis', 'pcs', 0.30),
('橙子', 'Orange', 'Oren', 'kg', 6.00),
('苹果', 'Apple', 'Epal', 'kg', 8.00);

-- 2. 菜品食材关联表
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recipe_id, ingredient_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);

COMMENT ON TABLE recipe_ingredients IS '菜品和食材的关联表';
COMMENT ON COLUMN recipe_ingredients.quantity IS '食材数量';
COMMENT ON COLUMN recipe_ingredients.unit IS '单位（与ingredients表的unit对应）';
COMMENT ON COLUMN recipe_ingredients.is_optional IS '是否可选食材';

