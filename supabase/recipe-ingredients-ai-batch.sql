-- ============================================
-- AI 批量生成的食材关联数据
-- 为 seed-recipes.sql 中的菜品配置食材
-- ============================================

-- 印度煎饼 (Roti Canai)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面粉' THEN 0.5
    WHEN '食用油' THEN 0.1
    WHEN '盐' THEN 0.01
    WHEN '糖' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '面粉' THEN 'kg'
    WHEN '食用油' THEN 'liter'
    WHEN '盐' THEN 'kg'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '印度煎饼'
  AND i.name_zh IN ('盐', '糖', '食用油');

-- 仁当牛肉 (Beef Rendang)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '牛肉' THEN 1.0
    WHEN '椰奶' THEN 0.8
    WHEN '洋葱' THEN 0.3
    WHEN '大蒜' THEN 0.05
    WHEN '生姜' THEN 0.05
    WHEN '香茅' THEN 0.05
    WHEN '辣椒' THEN 0.1
    WHEN '姜黄粉' THEN 0.02
    WHEN '咖喱粉' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '牛肉' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '洋葱' THEN 'kg'
    WHEN '大蒜' THEN 'kg'
    WHEN '生姜' THEN 'kg'
    WHEN '香茅' THEN 'bundle'
    WHEN '辣椒' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '仁当牛肉'
  AND i.name_zh IN ('牛肉', '椰奶', '洋葱', '大蒜', '生姜', '香茅', '辣椒', '姜黄粉', '咖喱粉');

-- 酸辣鱼 (Asam Pedas)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '番茄' THEN 0.3
    WHEN '洋葱' THEN 0.2
    WHEN '辣椒' THEN 0.08
    WHEN '姜黄粉' THEN 0.01
    WHEN '虾酱' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '辣椒' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '虾酱' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '酸辣鱼'
  AND i.name_zh IN ('鱼', '番茄', '洋葱', '辣椒', '姜黄粉', '虾酱');

-- 烤鱼 (Ikan Bakar)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '参巴酱' THEN 0.1
    WHEN '生姜' THEN 0.03
    WHEN '大蒜' THEN 0.03
    WHEN '香茅' THEN 0.03
    WHEN '椰子油' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '生姜' THEN 'kg'
    WHEN '大蒜' THEN 'kg'
    WHEN '香茅' THEN 'bundle'
    WHEN '椰子油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '烤鱼'
  AND i.name_zh IN ('鱼', '参巴酱', '生姜', '大蒜', '香茅', '椰子油');

-- 参巴虾 (Sambal Prawns)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '虾' THEN 0.6
    WHEN '参巴酱' THEN 0.1
    WHEN '洋葱' THEN 0.15
    WHEN '番茄' THEN 0.2
    WHEN '糖' THEN 0.02
    WHEN '盐' THEN 0.01
  END,
  CASE i.name_zh
    WHEN '虾' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '糖' THEN 'kg'
    WHEN '盐' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '参巴虾'
  AND i.name_zh IN ('虾', '参巴酱', '洋葱', '番茄', '糖', '盐');

-- 咖椰吐司 (Kaya Toast)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面包' THEN 0.3
    WHEN '鸡蛋' THEN 0.02
    WHEN '椰奶' THEN 0.15
    WHEN '糖' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '面包' THEN 'loaf'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '咖椰吐司'
  AND i.name_zh IN ('面包', '鸡蛋', '椰奶', '糖');

-- 炒面 (Fried Noodles)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '黄面' THEN 0.5
    WHEN '虾' THEN 0.2
    WHEN '豆腐' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '鸡蛋' THEN 0.02
    WHEN '辣椒酱' THEN 0.05
    WHEN '酱油' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '黄面' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '豆芽' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '辣椒酱' THEN 'bottle'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '炒面' OR r.name_zh = '马来炒面'
  AND i.name_zh IN ('黄面', '虾', '豆腐', '豆芽', '鸡蛋', '辣椒酱', '酱油');

-- 云吞面 (Wonton Noodles)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面条' THEN 0.4
    WHEN '猪肉' THEN 0.2
    WHEN '虾' THEN 0.15
    WHEN '大葱' THEN 0.05
    WHEN '酱油' THEN 0.04
    WHEN '麻油' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '面条' THEN 'kg'
    WHEN '猪肉' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '大葱' THEN 'bundle'
    WHEN '酱油' THEN 'bottle'
    WHEN '麻油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '云吞面'
  AND i.name_zh IN ('面条', '猪肉', '虾', '大葱', '酱油', '麻油');

-- 蔬菜咖喱 (Vegetable Curry)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '土豆' THEN 0.3
    WHEN '胡萝卜' THEN 0.2
    WHEN '菜花' THEN 0.25
    WHEN '豆角' THEN 0.2
    WHEN '洋葱' THEN 0.15
    WHEN '咖喱粉' THEN 0.04
    WHEN '椰奶' THEN 0.3
  END,
  CASE i.name_zh
    WHEN '土豆' THEN 'kg'
    WHEN '胡萝卜' THEN 'kg'
    WHEN '菜花' THEN 'kg'
    WHEN '豆角' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '咖喱粉' THEN 'pack'
    WHEN '椰奶' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '蔬菜咖喱'
  AND i.name_zh IN ('土豆', '胡萝卜', '洋葱', '咖喱粉', '椰奶');

-- 炸香蕉 (Fried Banana)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '香蕉' THEN 0.6
    WHEN '糖' THEN 0.05
    WHEN '食用油' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '香蕉' THEN 'kg'
    WHEN '糖' THEN 'kg'
    WHEN '食用油' THEN 'liter'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '炸香蕉'
  AND i.name_zh IN ('香蕉', '糖', '食用油');

-- 红豆冰 (Ais Kacang)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '红豆' THEN 0.15
    WHEN '玉米' THEN 0.1
    WHEN '糖' THEN 0.1
    WHEN '椰奶' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '红豆' THEN 'kg'
    WHEN '玉米' THEN 'pcs'
    WHEN '糖' THEN 'kg'
    WHEN '椰奶' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '红豆冰'
  AND i.name_zh IN ('糖', '椰奶');

-- 拉茶 (Teh Tarik)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '牛奶' THEN 0.2
    WHEN '糖' THEN 0.05
    WHEN '炼乳' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '牛奶' THEN 'liter'
    WHEN '糖' THEN 'kg'
    WHEN '炼乳' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '拉茶'
  AND i.name_zh IN ('牛奶', '糖', '炼乳');

-- 马来烤鸡 (Ayam Percik)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 1.0
    WHEN '椰奶' THEN 0.4
    WHEN '香茅' THEN 0.05
    WHEN '姜黄粉' THEN 0.02
    WHEN '辣椒' THEN 0.05
    WHEN '大蒜' THEN 0.04
    WHEN '生姜' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '香茅' THEN 'bundle'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '辣椒' THEN 'kg'
    WHEN '大蒜' THEN 'kg'
    WHEN '生姜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来烤鸡'
  AND i.name_zh IN ('鸡肉', '椰奶', '香茅', '姜黄粉', '辣椒', '大蒜', '生姜');

-- 印度香饭 (Biryani)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '鸡肉' THEN 0.6
    WHEN '洋葱' THEN 0.2
    WHEN '番茄' THEN 0.2
    WHEN '酸奶' THEN 0.2
    WHEN '姜黄粉' THEN 0.02
    WHEN '咖喱粉' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '酸奶' THEN 'cup'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '印度香饭'
  AND i.name_zh IN ('白米', '鸡肉', '洋葱', '番茄', '酸奶', '姜黄粉', '咖喱粉');

-- 煎蕊 (Cendol)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '椰奶' THEN 0.3
    WHEN '糖' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '煎蕊'
  AND i.name_zh IN ('椰奶', '糖');

-- 现在总共配置了约 25 道菜的食材关联

