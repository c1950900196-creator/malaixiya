-- ============================================
-- 菜品与食材关联数据（示例，为核心菜品配置）
-- ============================================

-- 为了节省空间，这里展示几个代表性菜品的食材配置
-- 实际使用时需要为所有210道菜配置

-- 椰浆饭 (Nasi Lemak)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional, notes)
SELECT 
  r.id,
  i.id,
  CASE i.name_zh
    WHEN '白米' THEN 300
    WHEN '椰奶' THEN 200
    WHEN '花生' THEN 50
    WHEN '鸡蛋' THEN 2
    WHEN '小鱼干' THEN 30
    WHEN '黄瓜' THEN 1
    WHEN '参巴酱' THEN 50
  END as quantity,
  CASE i.name_zh
    WHEN '白米' THEN 'g'
    WHEN '椰奶' THEN 'ml'
    WHEN '花生' THEN 'g'
    WHEN '鸡蛋' THEN '个'
    WHEN '小鱼干' THEN 'g'
    WHEN '黄瓜' THEN '根'
    WHEN '参巴酱' THEN 'g'
  END as unit,
  false as is_optional,
  '' as notes
FROM recipes r, ingredients i
WHERE r.name_zh = '椰浆饭'
  AND i.name_zh IN ('白米', '椰奶', '花生', '鸡蛋', '黄瓜', '参巴酱');

-- 海南鸡饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 500
    WHEN '白米' THEN 300
    WHEN '大蒜' THEN 20
    WHEN '生姜' THEN 20
    WHEN '大葱' THEN 1
    WHEN '酱油' THEN 30
    WHEN '麻油' THEN 10
  END, 
  CASE i.name_zh
    WHEN '鸡肉' THEN 'g'
    WHEN '白米' THEN 'g'
    WHEN '大蒜' THEN 'g'
    WHEN '生姜' THEN 'g'
    WHEN '大葱' THEN '根'
    WHEN '酱油' THEN 'ml'
    WHEN '麻油' THEN 'ml'
  END,
  false
FROM recipes r, ingredients i
WHERE r.name_zh = '海南鸡饭'
  AND i.name_zh IN ('鸡肉', '白米', '大蒜', '生姜', '大葱', '酱油', '麻油');

-- 仁当鸡
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 600
    WHEN '椰奶' THEN 400
    WHEN '洋葱' THEN 2
    WHEN '大蒜' THEN 30
    WHEN '生姜' THEN 30
    WHEN '香茅' THEN 2
    WHEN '辣椒' THEN 50
    WHEN '咖喱粉' THEN 30
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'g'
    WHEN '椰奶' THEN 'ml'
    WHEN '洋葱' THEN '个'
    WHEN '大蒜' THEN 'g'
    WHEN '生姜' THEN 'g'
    WHEN '香茅' THEN '根'
    WHEN '辣椒' THEN 'g'
    WHEN '咖喱粉' THEN 'g'
  END,
  false
FROM recipes r, ingredients i
WHERE r.name_zh = '仁当鸡'
  AND i.name_zh IN ('鸡肉', '椰奶', '洋葱', '大蒜', '生姜', '香茅', '辣椒', '咖喱粉');

-- 沙爹
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 500
    WHEN '洋葱' THEN 1
    WHEN '大蒜' THEN 20
    WHEN '香茅' THEN 2
    WHEN '姜黄粉' THEN 10
    WHEN '花生酱' THEN 100
    WHEN '椰奶' THEN 100
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'g'
    WHEN '洋葱' THEN '个'
    WHEN '大蒜' THEN 'g'
    WHEN '香茅' THEN '根'
    WHEN '姜黄粉' THEN 'g'
    WHEN '花生酱' THEN 'g'
    WHEN '椰奶' THEN 'ml'
  END,
  false
FROM recipes r, ingredients i
WHERE r.name_zh = '沙爹'
  AND i.name_zh IN ('鸡肉', '洋葱', '大蒜', '香茅', '姜黄粉', '花生酱', '椰奶');

-- 咖喱鱼头
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 800
    WHEN '咖喱粉' THEN 50
    WHEN '椰奶' THEN 400
    WHEN '洋葱' THEN 2
    WHEN '番茄' THEN 2
    WHEN '茄子' THEN 1
    WHEN '秋葵' THEN 100
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'g'
    WHEN '咖喱粉' THEN 'g'
    WHEN '椰奶' THEN 'ml'
    WHEN '洋葱' THEN '个'
    WHEN '番茄' THEN '个'
    WHEN '茄子' THEN '个'
    WHEN '秋葵' THEN 'g'
  END,
  CASE i.name_zh WHEN '秋葵' THEN true ELSE false END
FROM recipes r, ingredients i
WHERE r.name_zh = '咖喱鱼头'
  AND i.name_zh IN ('鱼', '咖喱粉', '椰奶', '洋葱', '番茄', '茄子');

-- 炒粿条
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '粿条' THEN 400
    WHEN '虾' THEN 200
    WHEN '鸡蛋' THEN 2
    WHEN '豆芽' THEN 150
    WHEN '韭菜' THEN 50
    WHEN '酱油' THEN 30
    WHEN '辣椒酱' THEN 20
  END,
  CASE i.name_zh
    WHEN '粿条' THEN 'g'
    WHEN '虾' THEN 'g'
    WHEN '鸡蛋' THEN '个'
    WHEN '豆芽' THEN 'g'
    WHEN '韭菜' THEN 'g'
    WHEN '酱油' THEN 'ml'
    WHEN '辣椒酱' THEN 'g'
  END,
  false
FROM recipes r, ingredients i
WHERE r.name_zh = '炒粿条'
  AND i.name_zh IN ('粿条', '虾', '鸡蛋', '豆芽', '酱油', '辣椒酱');

-- 肉骨茶
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '排骨' THEN 600
    WHEN '大蒜' THEN 50
    WHEN '八角' THEN 3
    WHEN '肉桂' THEN 5
    WHEN '丁香' THEN 5
    WHEN '酱油' THEN 50
  END,
  CASE i.name_zh
    WHEN '排骨' THEN 'g'
    WHEN '大蒜' THEN 'g'
    WHEN '八角' THEN '颗'
    WHEN '肉桂' THEN 'g'
    WHEN '丁香' THEN 'g'
    WHEN '酱油' THEN 'ml'
  END,
  false
FROM recipes r, ingredients i
WHERE r.name_zh = '肉骨茶'
  AND i.name_zh IN ('排骨', '大蒜', '八角', '肉桂', '丁香', '酱油');

-- 咖喱鸡
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 600
    WHEN '土豆' THEN 300
    WHEN '洋葱' THEN 2
    WHEN '咖喱粉' THEN 40
    WHEN '椰奶' THEN 300
    WHEN '番茄' THEN 1
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'g'
    WHEN '土豆' THEN 'g'
    WHEN '洋葱' THEN '个'
    WHEN '咖喱粉' THEN 'g'
    WHEN '椰奶' THEN 'ml'
    WHEN '番茄' THEN '个'
  END,
  CASE i.name_zh WHEN '番茄' THEN true ELSE false END
FROM recipes r, ingredients i
WHERE r.name_zh = '咖喱鸡'
  AND i.name_zh IN ('鸡肉', '土豆', '洋葱', '咖喱粉', '椰奶', '番茄');

-- 清蒸鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 600
    WHEN '生姜' THEN 30
    WHEN '大葱' THEN 2
    WHEN '酱油' THEN 40
    WHEN '麻油' THEN 15
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'g'
    WHEN '生姜' THEN 'g'
    WHEN '大葱' THEN '根'
    WHEN '酱油' THEN 'ml'
    WHEN '麻油' THEN 'ml'
  END,
  false
FROM recipes r, ingredients i
WHERE r.name_zh = '清蒸鱼'
  AND i.name_zh IN ('鱼', '生姜', '大葱', '酱油', '麻油');

-- 炒饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional)
SELECT 
  r.id, i.id,
  CASE i.name_zh
    WHEN '米饭' THEN 400
    WHEN '鸡蛋' THEN 2
    WHEN '洋葱' THEN 1
    WHEN '虾' THEN 100
    WHEN '豌豆' THEN 50
    WHEN '酱油' THEN 20
  END,
  CASE i.name_zh
    WHEN '米饭' THEN 'g'
    WHEN '鸡蛋' THEN '个'
    WHEN '洋葱' THEN '个'
    WHEN '虾' THEN 'g'
    WHEN '豌豆' THEN 'g'
    WHEN '酱油' THEN 'ml'
  END,
  CASE i.name_zh WHEN '虾' THEN true ELSE false END
FROM recipes r, ingredients i
WHERE r.name_zh = '炒饭'
  AND i.name_zh IN ('米饭', '鸡蛋', '洋葱', '酱油');

-- 注：实际部署时需要为所有210道菜配置食材关联
-- 这里仅展示了10道代表性菜品的配置
-- 可以根据需要继续添加更多菜品的食材关联



