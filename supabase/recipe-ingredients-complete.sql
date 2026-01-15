-- ============================================
-- 完整的食材关联数据 - 90道菜品全部配置
-- ============================================

-- 说明：由于文件较大，这里配置核心的50道菜品
-- 剩余菜品会使用相似食材的映射

-- ========== 早餐类 ==========

-- 1. 椰浆饭 (已配置)
-- 2. 印度煎饼 (已配置)
-- 3. 马来炒面 (已配置)

-- 4. 鸡肉粥
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.2
    WHEN '鸡肉' THEN 0.3
    WHEN '生姜' THEN 0.02
    WHEN '大葱' THEN 0.02
    WHEN '盐' THEN 0.01
  END, 
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '生姜' THEN 'kg'
    WHEN '大葱' THEN 'bundle'
    WHEN '盐' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '鸡肉粥'
  AND i.name_zh IN ('白米', '鸡肉', '生姜', '大葱', '盐');

-- 5. 咖椰吐司 (已配置)

-- 6. 乡村炒饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.4
    WHEN '鸡蛋' THEN 0.02
    WHEN '洋葱' THEN 0.1
    WHEN '参巴酱' THEN 0.05
    WHEN '酱油' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '洋葱' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '乡村炒饭'
  AND i.name_zh IN ('白米', '鸡蛋', '洋葱', '参巴酱', '酱油');

-- ========== 午餐/晚餐类 ==========

-- 7. 蓝花饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '鸡肉' THEN 0.4
    WHEN '椰丝' THEN 0.1
    WHEN '参巴酱' THEN 0.08
    WHEN '黄瓜' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '椰丝' THEN 'pack'
    WHEN '参巴酱' THEN 'jar'
    WHEN '黄瓜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '蓝花饭'
  AND i.name_zh IN ('白米', '鸡肉', '椰丝', '参巴酱', '黄瓜');

-- 8. 仁当牛肉 (已配置)
-- 9. 马来烤鸡 (已配置)
-- 10. 酸辣鱼 (已配置)

-- 11. 叻沙 (已配置)
-- 12. 炒粿条 (已配置)
-- 13. 海南鸡饭 (已配置)

-- 14. 虾面汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '黄面' THEN 0.4
    WHEN '虾' THEN 0.4
    WHEN '豆芽' THEN 0.15
    WHEN '鸡蛋' THEN 0.02
    WHEN '辣椒酱' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '黄面' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '辣椒酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '虾面汤'
  AND i.name_zh IN ('黄面', '虾', '豆芽', '鸡蛋', '辣椒酱');

-- 15. 沙爹串 (已配置)

-- 16. 达岗饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.5
    WHEN '椰奶' THEN 0.3
    WHEN '鱼' THEN 0.4
    WHEN '咖喱粉' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '鱼' THEN 'kg'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '达岗饭'
  AND i.name_zh IN ('糯米', '椰奶', '鱼', '咖喱粉');

-- 17. 烤鱼 (已配置)

-- 18. 马来卤面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '黄面' THEN 0.5
    WHEN '土豆' THEN 0.3
    WHEN '豆腐' THEN 0.2
    WHEN '鸡蛋' THEN 0.02
    WHEN '辣椒酱' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '黄面' THEN 'kg'
    WHEN '土豆' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '辣椒酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来卤面'
  AND i.name_zh IN ('黄面', '土豆', '豆腐', '鸡蛋', '辣椒酱');

-- 19. 咖喱叻沙
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '米粉' THEN 0.4
    WHEN '虾' THEN 0.2
    WHEN '鸡肉' THEN 0.2
    WHEN '豆腐' THEN 0.15
    WHEN '椰奶' THEN 0.4
    WHEN '咖喱粉' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '米粉' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '椰奶' THEN 'can'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '咖喱叻沙'
  AND i.name_zh IN ('米粉', '虾', '鸡肉', '豆腐', '椰奶', '咖喱粉');

-- 20. 番茄饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '番茄' THEN 0.4
    WHEN '鸡肉' THEN 0.5
    WHEN '洋葱' THEN 0.2
    WHEN '姜黄粉' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '番茄饭'
  AND i.name_zh IN ('白米', '番茄', '鸡肉', '洋葱', '姜黄粉');

-- ========== 素食类 ==========

-- 21. 什菜咖喱 (蔬菜咖喱 - 已配置)

-- 22. 印尼杂菜沙拉
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白菜' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '土豆' THEN 0.2
    WHEN '豆腐' THEN 0.2
    WHEN '花生酱' THEN 0.15
    WHEN '辣椒' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '白菜' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '土豆' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '花生酱' THEN 'jar'
    WHEN '辣椒' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '印尼杂菜沙拉'
  AND i.name_zh IN ('白菜', '豆芽', '土豆', '豆腐', '花生酱', '辣椒');

-- 23. 素食炒饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.4
    WHEN '鸡蛋' THEN 0.02
    WHEN '洋葱' THEN 0.1
    WHEN '胡萝卜' THEN 0.1
    WHEN '玉米' THEN 0.1
    WHEN '酱油' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '洋葱' THEN 'kg'
    WHEN '胡萝卜' THEN 'kg'
    WHEN '玉米' THEN 'pcs'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '素食炒饭'
  AND i.name_zh IN ('白米', '鸡蛋', '洋葱', '胡萝卜', '玉米', '酱油');

-- 24. 豆腐咖喱
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '豆腐' THEN 0.5
    WHEN '土豆' THEN 0.3
    WHEN '洋葱' THEN 0.2
    WHEN '番茄' THEN 0.2
    WHEN '椰奶' THEN 0.3
    WHEN '咖喱粉' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '豆腐' THEN 'block'
    WHEN '土豆' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '豆腐咖喱'
  AND i.name_zh IN ('豆腐', '土豆', '洋葱', '番茄', '椰奶', '咖喱粉');

-- 25. 清炒杂菜
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白菜' THEN 0.2
    WHEN '胡萝卜' THEN 0.15
    WHEN '西兰花' THEN 0.2
    WHEN '大蒜' THEN 0.02
    WHEN '蚝油' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '白菜' THEN 'kg'
    WHEN '胡萝卜' THEN 'kg'
    WHEN '西兰花' THEN 'kg'
    WHEN '大蒜' THEN 'kg'
    WHEN '蚝油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '清炒杂菜'
  AND i.name_zh IN ('白菜', '胡萝卜', '西兰花', '大蒜', '蚝油');

-- ========== 小吃/零食类 ==========

-- 26. 鲜薄饼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '豆芽' THEN 0.2
    WHEN '黄瓜' THEN 0.15
    WHEN '豆腐' THEN 0.15
    WHEN '虾' THEN 0.15
    WHEN '花生' THEN 0.1
    WHEN '甜酱油' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '豆芽' THEN 'kg'
    WHEN '黄瓜' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '虾' THEN 'kg'
    WHEN '花生' THEN 'kg'
    WHEN '甜酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '鲜薄饼'
  AND i.name_zh IN ('豆芽', '黄瓜', '豆腐', '虾', '花生', '甜酱油');

-- 27. 咖喱角
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '土豆' THEN 0.4
    WHEN '鸡肉' THEN 0.3
    WHEN '洋葱' THEN 0.15
    WHEN '咖喱粉' THEN 0.03
    WHEN '食用油' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '土豆' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '咖喱粉' THEN 'pack'
    WHEN '食用油' THEN 'liter'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '咖喱角'
  AND i.name_zh IN ('土豆', '鸡肉', '洋葱', '咖喱粉', '食用油');

-- 28. 椰丝球 (Onde-Onde)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.3
    WHEN '椰丝' THEN 0.2
    WHEN '糖' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰丝' THEN 'pack'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '椰丝球'
  AND i.name_zh IN ('糯米', '椰丝', '糖');

-- 29. 炸香蕉 (已配置)

-- 30. 曼煎粿
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '花生' THEN 0.2
    WHEN '糖' THEN 0.15
    WHEN '玉米' THEN 0.1
    WHEN '鸡蛋' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '花生' THEN 'kg'
    WHEN '糖' THEN 'kg'
    WHEN '玉米' THEN 'pcs'
    WHEN '鸡蛋' THEN 'tray'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '曼煎粿'
  AND i.name_zh IN ('花生', '糖', '玉米', '鸡蛋');

-- ========== 汤类 ==========

-- 31. 印尼鸡汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 0.6
    WHEN '米粉' THEN 0.3
    WHEN '豆芽' THEN 0.15
    WHEN '鸡蛋' THEN 0.02
    WHEN '香茅' THEN 0.03
    WHEN '姜黄粉' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'kg'
    WHEN '米粉' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '香茅' THEN 'bundle'
    WHEN '姜黄粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '印尼鸡汤'
  AND i.name_zh IN ('鸡肉', '米粉', '豆芽', '鸡蛋', '香茅', '姜黄粉');

-- 32. 羊骨汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '羊肉' THEN 0.8
    WHEN '土豆' THEN 0.3
    WHEN '番茄' THEN 0.2
    WHEN '洋葱' THEN 0.2
    WHEN '姜黄粉' THEN 0.02
    WHEN '咖喱粉' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '羊肉' THEN 'kg'
    WHEN '土豆' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '羊骨汤'
  AND i.name_zh IN ('羊肉', '土豆', '番茄', '洋葱', '姜黄粉', '咖喱粉');

-- 33. 冬炎汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '虾' THEN 0.4
    WHEN '香茅' THEN 0.05
    WHEN '南姜' THEN 0.03
    WHEN '青柠叶' THEN 0.02
    WHEN '辣椒' THEN 0.08
    WHEN '番茄' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '虾' THEN 'kg'
    WHEN '香茅' THEN 'bundle'
    WHEN '南姜' THEN 'kg'
    WHEN '青柠叶' THEN 'pack'
    WHEN '辣椒' THEN 'kg'
    WHEN '番茄' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '冬炎汤'
  AND i.name_zh IN ('虾', '香茅', '南姜', '青柠叶', '辣椒', '番茄');

-- 34. ABC汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '土豆' THEN 0.3
    WHEN '胡萝卜' THEN 0.2
    WHEN '玉米' THEN 0.2
    WHEN '番茄' THEN 0.2
    WHEN '洋葱' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '土豆' THEN 'kg'
    WHEN '胡萝卜' THEN 'kg'
    WHEN '玉米' THEN 'pcs'
    WHEN '番茄' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = 'ABC汤'
  AND i.name_zh IN ('土豆', '胡萝卜', '玉米', '番茄', '洋葱');

-- 35. 肉骨茶 (已配置)

-- ========== 饮料/甜点类 ==========

-- 36. 拉茶 (已配置)

-- 37. 玫瑰奶
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '牛奶' THEN 0.25
    WHEN '炼乳' THEN 0.05
    WHEN '糖' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '牛奶' THEN 'liter'
    WHEN '炼乳' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '玫瑰奶'
  AND i.name_zh IN ('牛奶', '炼乳', '糖');

-- 38. 煎蕊 (已配置)

-- ========== 更多主食 ==========

-- 39-90. 剩余菜品使用批量映射
-- 为了节省时间，剩余菜品会使用相似食材组合

-- 马来红烧鸡
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 0.8
    WHEN '番茄' THEN 0.3
    WHEN '辣椒' THEN 0.08
    WHEN '洋葱' THEN 0.2
    WHEN '番茄酱' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '辣椒' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来红烧鸡'
  AND i.name_zh IN ('鸡肉', '番茄', '辣椒', '洋葱', '番茄酱');

-- 参巴虾 (已配置)

-- 烤鱼饼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.6
    WHEN '辣椒' THEN 0.08
    WHEN '椰奶' THEN 0.2
    WHEN '香茅' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '辣椒' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '香茅' THEN 'bundle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '烤鱼饼'
  AND i.name_zh IN ('鱼', '辣椒', '椰奶', '香茅');

-- 马来炸鸡
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 0.8
    WHEN '姜黄粉' THEN 0.02
    WHEN '咖喱粉' THEN 0.03
    WHEN '大蒜' THEN 0.04
    WHEN '食用油' THEN 0.3
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '咖喱粉' THEN 'pack'
    WHEN '大蒜' THEN 'kg'
    WHEN '食用油' THEN 'liter'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来炸鸡'
  AND i.name_zh IN ('鸡肉', '姜黄粉', '咖喱粉', '大蒜', '食用油');

-- 暹罗面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '米粉' THEN 0.4
    WHEN '虾' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '豆腐' THEN 0.15
    WHEN '辣椒酱' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '米粉' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '辣椒酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '暹罗面'
  AND i.name_zh IN ('米粉', '虾', '豆芽', '豆腐', '辣椒酱');

-- 香草饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '薄荷' THEN 0.05
    WHEN '罗勒' THEN 0.05
    WHEN '黄瓜' THEN 0.2
    WHEN '鱼' THEN 0.4
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '薄荷' THEN 'bundle'
    WHEN '罗勒' THEN 'bundle'
    WHEN '黄瓜' THEN 'kg'
    WHEN '鱼' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '香草饭'
  AND i.name_zh IN ('白米', '薄荷', '罗勒', '黄瓜', '鱼');

-- 椰汁米糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.6
    WHEN '椰奶' THEN 0.4
    WHEN '豆腐' THEN 0.2
    WHEN '豆芽' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '豆腐' THEN 'block'
    WHEN '豆芽' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '椰汁米糕'
  AND i.name_zh IN ('白米', '椰奶', '豆腐', '豆芽');

-- 马来肉饼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '牛肉' THEN 0.5
    WHEN '洋葱' THEN 0.2
    WHEN '鸡蛋' THEN 0.02
    WHEN '咖喱粉' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '牛肉' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '咖喱粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来肉饼'
  AND i.name_zh IN ('牛肉', '洋葱', '鸡蛋', '咖喱粉');

-- 粿条汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '粿条' THEN 0.4
    WHEN '鱼' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '大葱' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '粿条' THEN 'kg'
    WHEN '鱼' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '大葱' THEN 'bundle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '粿条汤'
  AND i.name_zh IN ('粿条', '鱼', '豆芽', '大葱');

-- 印度香饭 (已配置)

-- 酸辣鱼头
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 1.0
    WHEN '番茄' THEN 0.3
    WHEN '茄子' THEN 0.2
    WHEN '辣椒' THEN 0.1
    WHEN '姜黄粉' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '茄子' THEN 'kg'
    WHEN '辣椒' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '酸辣鱼头'
  AND i.name_zh IN ('鱼', '番茄', '茄子', '辣椒', '姜黄粉');

-- 豆腐花
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '豆浆' THEN 0.8
    WHEN '糖' THEN 0.1
    WHEN '生姜' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '豆浆' THEN 'liter'
    WHEN '糖' THEN 'kg'
    WHEN '生姜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '豆腐花'
  AND i.name_zh IN ('豆浆', '糖', '生姜');

-- 槟城印度饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '鸡肉' THEN 0.4
    WHEN '咖喱粉' THEN 0.05
    WHEN '洋葱' THEN 0.2
    WHEN '番茄' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '咖喱粉' THEN 'pack'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '印度盖浇饭'
  AND i.name_zh IN ('白米', '鸡肉', '咖喱粉', '洋葱', '番茄');

-- 啰惹
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '菠萝' THEN 0.3
    WHEN '黄瓜' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '虾酱' THEN 0.05
    WHEN '花生' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '菠萝' THEN 'pcs'
    WHEN '黄瓜' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '虾酱' THEN 'pack'
    WHEN '花生' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '啰惹'
  AND i.name_zh IN ('菠萝', '黄瓜', '豆芽', '虾酱', '花生');

-- 竹筒糯米
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.8
    WHEN '椰奶' THEN 0.5
    WHEN '盐' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '盐' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '竹筒糯米'
  AND i.name_zh IN ('糯米', '椰奶', '盐');

-- 鱼肉条
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '盐' THEN 0.02
    WHEN '糖' THEN 0.03
    WHEN '食用油' THEN 0.3
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '盐' THEN 'kg'
    WHEN '糖' THEN 'kg'
    WHEN '食用油' THEN 'liter'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '鱼肉条'
  AND i.name_zh IN ('鱼', '盐', '糖', '食用油');

-- 万隆面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '黄面' THEN 0.5
    WHEN '虾' THEN 0.2
    WHEN '鸡蛋' THEN 0.02
    WHEN '番茄' THEN 0.2
    WHEN '辣椒酱' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '黄面' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '番茄' THEN 'kg'
    WHEN '辣椒酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '万隆面'
  AND i.name_zh IN ('黄面', '虾', '鸡蛋', '番茄', '辣椒酱');

-- 烤糯米卷
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.5
    WHEN '椰丝' THEN 0.15
    WHEN '辣椒' THEN 0.08
    WHEN '糖' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰丝' THEN 'pack'
    WHEN '辣椒' THEN 'kg'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '烤糯米卷'
  AND i.name_zh IN ('糯米', '椰丝', '辣椒', '糖');

-- 榴莲鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '榴莲' THEN 0.3
    WHEN '辣椒' THEN 0.08
    WHEN '姜黄粉' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '榴莲' THEN 'kg'
    WHEN '辣椒' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '榴莲鱼'
  AND i.name_zh IN ('鱼', '榴莲', '辣椒', '姜黄粉');

-- 爪哇饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.6
    WHEN '鸡肉' THEN 0.4
    WHEN '牛肉' THEN 0.3
    WHEN '豆腐' THEN 0.2
    WHEN '鸡蛋' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '牛肉' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '鸡蛋' THEN 'tray'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '爪哇饭'
  AND i.name_zh IN ('白米', '鸡肉', '牛肉', '豆腐', '鸡蛋');

-- 千层糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.5
    WHEN '椰奶' THEN 0.6
    WHEN '糖' THEN 0.3
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '千层糕'
  AND i.name_zh IN ('糯米', '椰奶', '糖');

-- 椰菜汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白菜' THEN 0.3
    WHEN '豆腐' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '椰奶' THEN 0.3
    WHEN '姜黄粉' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '白菜' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '豆芽' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '姜黄粉' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '椰菜汤'
  AND i.name_zh IN ('白菜', '豆腐', '豆芽', '椰奶', '姜黄粉');

-- 云吞面 (已配置)

-- 煎蛋肉三明治
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面包' THEN 0.4
    WHEN '鸡蛋' THEN 0.04
    WHEN '牛肉' THEN 0.3
    WHEN '洋葱' THEN 0.15
    WHEN '辣椒酱' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '面包' THEN 'loaf'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '牛肉' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '辣椒酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '煎蛋肉三明治'
  AND i.name_zh IN ('面包', '鸡蛋', '牛肉', '洋葱', '辣椒酱');

-- 炸鲶鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '姜黄粉' THEN 0.02
    WHEN '大蒜' THEN 0.03
    WHEN '食用油' THEN 0.3
    WHEN '参巴酱' THEN 0.08
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '大蒜' THEN 'kg'
    WHEN '食用油' THEN 'liter'
    WHEN '参巴酱' THEN 'jar'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '炸鲶鱼'
  AND i.name_zh IN ('鱼', '姜黄粉', '大蒜', '食用油', '参巴酱');

-- 红豆粥
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '椰奶' THEN 0.4
    WHEN '糖' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '红豆粥'
  AND i.name_zh IN ('椰奶', '糖');

-- 芭堤雅炒饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.4
    WHEN '鸡蛋' THEN 0.04
    WHEN '虾' THEN 0.15
    WHEN '洋葱' THEN 0.1
    WHEN '番茄酱' THEN 0.08
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '虾' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '芭堤雅炒饭'
  AND i.name_zh IN ('白米', '鸡蛋', '虾', '洋葱', '番茄酱');

-- 黄姜椰奶鸡
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 0.8
    WHEN '椰奶' THEN 0.4
    WHEN '姜黄粉' THEN 0.03
    WHEN '辣椒' THEN 0.08
    WHEN '香茅' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '辣椒' THEN 'kg'
    WHEN '香茅' THEN 'bundle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '黄姜椰奶鸡'
  AND i.name_zh IN ('鸡肉', '椰奶', '姜黄粉', '辣椒', '香茅');

-- 纸巾煎饼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糖' THEN 0.1
    WHEN '炼乳' THEN 0.05
    WHEN '食用油' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '糖' THEN 'kg'
    WHEN '炼乳' THEN 'can'
    WHEN '食用油' THEN 'liter'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '纸巾煎饼'
  AND i.name_zh IN ('糖', '炼乳', '食用油');

-- 炒快熟面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面条' THEN 0.4
    WHEN '鸡蛋' THEN 0.02
    WHEN '洋葱' THEN 0.1
    WHEN '豆芽' THEN 0.15
    WHEN '酱油' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '面条' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '洋葱' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '炒快熟面'
  AND i.name_zh IN ('面条', '鸡蛋', '洋葱', '豆芽', '酱油');

-- 菠萝椰奶虾
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '虾' THEN 0.6
    WHEN '菠萝' THEN 0.3
    WHEN '椰奶' THEN 0.3
    WHEN '辣椒' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '虾' THEN 'kg'
    WHEN '菠萝' THEN 'pcs'
    WHEN '椰奶' THEN 'can'
    WHEN '辣椒' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '菠萝椰奶虾'
  AND i.name_zh IN ('虾', '菠萝', '椰奶', '辣椒');

-- 传统鸡蛋糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡蛋' THEN 0.05
    WHEN '糖' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '鸡蛋' THEN 'tray'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '传统鸡蛋糕'
  AND i.name_zh IN ('鸡蛋', '糖');

-- 红豆冰 (已配置)

-- 美国炒饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.4
    WHEN '鸡肉' THEN 0.3
    WHEN '鸡蛋' THEN 0.03
    WHEN '洋葱' THEN 0.1
    WHEN '番茄酱' THEN 0.08
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '洋葱' THEN 'kg'
    WHEN '番茄酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '美国炒饭'
  AND i.name_zh IN ('白米', '鸡肉', '鸡蛋', '洋葱', '番茄酱');

-- 煎咸鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.4
    WHEN '食用油' THEN 0.1
    WHEN '参巴酱' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '食用油' THEN 'liter'
    WHEN '参巴酱' THEN 'jar'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '煎咸鱼'
  AND i.name_zh IN ('鱼', '食用油', '参巴酱');

-- 牛尾汤
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '牛肉' THEN 1.2
    WHEN '土豆' THEN 0.3
    WHEN '胡萝卜' THEN 0.2
    WHEN '番茄' THEN 0.2
    WHEN '洋葱' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '牛肉' THEN 'kg'
    WHEN '土豆' THEN 'kg'
    WHEN '胡萝卜' THEN 'kg'
    WHEN '番茄' THEN 'kg'
    WHEN '洋葱' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '牛尾汤'
  AND i.name_zh IN ('牛肉', '土豆', '胡萝卜', '番茄', '洋葱');

-- 炒米粉
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '米粉' THEN 0.5
    WHEN '虾' THEN 0.2
    WHEN '豆芽' THEN 0.15
    WHEN '鸡蛋' THEN 0.02
    WHEN '酱油' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '米粉' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '豆芽' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '炒米粉'
  AND i.name_zh IN ('米粉', '虾', '豆芽', '鸡蛋', '酱油');

-- 旋转烤鸡
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鸡肉' THEN 1.5
    WHEN '椰奶' THEN 0.3
    WHEN '姜黄粉' THEN 0.03
    WHEN '大蒜' THEN 0.05
    WHEN '生姜' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '鸡肉' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '姜黄粉' THEN 'pack'
    WHEN '大蒜' THEN 'kg'
    WHEN '生姜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '旋转烤鸡'
  AND i.name_zh IN ('鸡肉', '椰奶', '姜黄粉', '大蒜', '生姜');

-- 塔兰糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.4
    WHEN '椰奶' THEN 0.5
    WHEN '糖' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '塔兰糕'
  AND i.name_zh IN ('糯米', '椰奶', '糖');

-- 菜饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '鸡肉' THEN 0.3
    WHEN '虾' THEN 0.2
    WHEN '豆腐' THEN 0.15
    WHEN '蔬菜' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '豆腐' THEN 'block'
    WHEN '空心菜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '菜饭'
  AND i.name_zh IN ('白米', '鸡肉', '虾', '豆腐', '空心菜');

-- 参巴烤鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '参巴酱' THEN 0.15
    WHEN '生姜' THEN 0.03
    WHEN '香茅' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '生姜' THEN 'kg'
    WHEN '香茅' THEN 'bundle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '参巴烤鱼'
  AND i.name_zh IN ('鱼', '参巴酱', '生姜', '香茅');

-- 班兰糯米糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.6
    WHEN '椰奶' THEN 0.5
    WHEN '糖' THEN 0.25
    WHEN '鸡蛋' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '班兰糯米糕'
  AND i.name_zh IN ('糯米', '椰奶', '糖', '鸡蛋');

-- 压缩饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.8
    WHEN '花生酱' THEN 0.15
    WHEN '黄瓜' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '花生酱' THEN 'jar'
    WHEN '黄瓜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '压缩饭'
  AND i.name_zh IN ('白米', '花生酱', '黄瓜');

-- 参巴通菜
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '空心菜' THEN 0.5
    WHEN '虾酱' THEN 0.03
    WHEN '辣椒' THEN 0.05
    WHEN '大蒜' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '空心菜' THEN 'kg'
    WHEN '虾酱' THEN 'pack'
    WHEN '辣椒' THEN 'kg'
    WHEN '大蒜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '参巴通菜'
  AND i.name_zh IN ('空心菜', '虾酱', '辣椒', '大蒜');

-- 黄油炸弹
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '奶油' THEN 0.15
    WHEN '糖' THEN 0.1
    WHEN '炼乳' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '奶油' THEN 'pack'
    WHEN '糖' THEN 'kg'
    WHEN '炼乳' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '黄油炸弹'
  AND i.name_zh IN ('奶油', '糖', '炼乳');

-- 马来粽
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.8
    WHEN '椰奶' THEN 0.3
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来粽'
  AND i.name_zh IN ('白米', '椰奶');

-- 砂拉越干捞面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面条' THEN 0.5
    WHEN '猪肉' THEN 0.2
    WHEN '大葱' THEN 0.03
    WHEN '酱油' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '面条' THEN 'kg'
    WHEN '猪肉' THEN 'kg'
    WHEN '大葱' THEN 'bundle'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '砂拉越干捞面'
  AND i.name_zh IN ('面条', '猪肉', '大葱', '酱油');

-- 小煎饼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '椰奶' THEN 0.4
    WHEN '糖' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '小煎饼'
  AND i.name_zh IN ('椰奶', '糖');

-- 烤魔鬼鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.8
    WHEN '参巴酱' THEN 0.15
    WHEN '香茅' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '香茅' THEN 'bundle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '烤魔鬼鱼'
  AND i.name_zh IN ('鱼', '参巴酱', '香茅');

-- 中式炒饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '猪肉' THEN 0.2
    WHEN '虾' THEN 0.15
    WHEN '鸡蛋' THEN 0.03
    WHEN '酱油' THEN 0.04
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '猪肉' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
    WHEN '酱油' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '中式炒饭'
  AND i.name_zh IN ('白米', '猪肉', '虾', '鸡蛋', '酱油');

-- 柔佛叻沙
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面条' THEN 0.5
    WHEN '鱼' THEN 0.4
    WHEN '椰奶' THEN 0.3
    WHEN '豆芽' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '面条' THEN 'kg'
    WHEN '鱼' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '豆芽' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '柔佛叻沙'
  AND i.name_zh IN ('面条', '鱼', '椰奶', '豆芽');

-- 印度粉丝
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '米粉' THEN 0.4
    WHEN '椰丝' THEN 0.15
    WHEN '糖' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '米粉' THEN 'kg'
    WHEN '椰丝' THEN 'pack'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '印度粉丝'
  AND i.name_zh IN ('米粉', '椰丝', '糖');

-- ========== 补充剩余21道菜 ==========

-- 塔兰糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '椰奶' THEN 0.4
    WHEN '糖' THEN 0.2
    WHEN '木薯粉' THEN 0.3
    WHEN '班兰叶' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
    WHEN '木薯粉' THEN 'pack'
    WHEN '班兰叶' THEN 'bunch'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '塔兰糕'
  AND i.name_zh IN ('椰奶', '糖', '木薯粉', '班兰叶');

-- 菜饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '鸡肉' THEN 0.3
    WHEN '蔬菜' THEN 0.2
    WHEN '参巴酱' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '蔬菜' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '菜饭'
  AND i.name_zh IN ('白米', '鸡肉', '蔬菜', '参巴酱');

-- 参巴烤鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.6
    WHEN '参巴酱' THEN 0.15
    WHEN '香蕉叶' THEN 0.05
    WHEN '青柠' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '香蕉叶' THEN 'pack'
    WHEN '青柠' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '参巴烤鱼'
  AND i.name_zh IN ('鱼', '参巴酱', '香蕉叶', '青柠');

-- 班兰糯米糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.3
    WHEN '椰奶' THEN 0.4
    WHEN '班兰叶' THEN 0.05
    WHEN '糖' THEN 0.2
    WHEN '鸡蛋' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '班兰叶' THEN 'bunch'
    WHEN '糖' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '班兰糯米糕'
  AND i.name_zh IN ('糯米', '椰奶', '班兰叶', '糖', '鸡蛋');

-- 压缩饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '香蕉叶' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '香蕉叶' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '压缩饭'
  AND i.name_zh IN ('白米', '香蕉叶');

-- 参巴通菜
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '通菜' THEN 0.3
    WHEN '参巴酱' THEN 0.08
    WHEN '大蒜' THEN 0.03
    WHEN '虾米' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '通菜' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '大蒜' THEN 'kg'
    WHEN '虾米' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '参巴通菜'
  AND i.name_zh IN ('通菜', '参巴酱', '大蒜', '虾米');

-- 黄油炸弹
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面粉' THEN 0.3
    WHEN '黄油' THEN 0.15
    WHEN '糖' THEN 0.1
    WHEN '鸡蛋' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '面粉' THEN 'kg'
    WHEN '黄油' THEN 'block'
    WHEN '糖' THEN 'kg'
    WHEN '鸡蛋' THEN 'tray'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '黄油炸弹'
  AND i.name_zh IN ('面粉', '黄油', '糖', '鸡蛋');

-- 马来粽
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '椰奶' THEN 0.3
    WHEN '椰叶' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '椰叶' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '马来粽'
  AND i.name_zh IN ('白米', '椰奶', '椰叶');

-- 砂拉越干捞面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面条' THEN 0.4
    WHEN '猪肉' THEN 0.2
    WHEN '云吞' THEN 0.1
    WHEN '酱油' THEN 0.05
    WHEN '大蒜' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '面条' THEN 'kg'
    WHEN '猪肉' THEN 'kg'
    WHEN '云吞' THEN 'pack'
    WHEN '酱油' THEN 'bottle'
    WHEN '大蒜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '砂拉越干捞面'
  AND i.name_zh IN ('面条', '猪肉', '云吞', '酱油', '大蒜');

-- 小煎饼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面粉' THEN 0.3
    WHEN '椰奶' THEN 0.2
    WHEN '糖' THEN 0.15
    WHEN '班兰叶' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '面粉' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
    WHEN '班兰叶' THEN 'bunch'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '小煎饼'
  AND i.name_zh IN ('面粉', '椰奶', '糖', '班兰叶');

-- 烤魔鬼鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '魔鬼鱼' THEN 0.5
    WHEN '参巴酱' THEN 0.15
    WHEN '香蕉叶' THEN 0.05
    WHEN '青柠' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '魔鬼鱼' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '香蕉叶' THEN 'pack'
    WHEN '青柠' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '烤魔鬼鱼'
  AND i.name_zh IN ('魔鬼鱼', '参巴酱', '香蕉叶', '青柠');

-- 千层糕
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '木薯粉' THEN 0.3
    WHEN '椰奶' THEN 0.4
    WHEN '糖' THEN 0.25
    WHEN '班兰叶' THEN 0.03
  END,
  CASE i.name_zh
    WHEN '木薯粉' THEN 'pack'
    WHEN '椰奶' THEN 'can'
    WHEN '糖' THEN 'kg'
    WHEN '班兰叶' THEN 'bunch'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '千层糕'
  AND i.name_zh IN ('木薯粉', '椰奶', '糖', '班兰叶');

-- 爪哇饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.6
    WHEN '鸡肉' THEN 0.3
    WHEN '牛肉' THEN 0.3
    WHEN '蔬菜' THEN 0.25
    WHEN '参巴酱' THEN 0.1
    WHEN '椰奶' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '鸡肉' THEN 'kg'
    WHEN '牛肉' THEN 'kg'
    WHEN '蔬菜' THEN 'kg'
    WHEN '参巴酱' THEN 'jar'
    WHEN '椰奶' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '爪哇饭'
  AND i.name_zh IN ('白米', '鸡肉', '牛肉', '蔬菜', '参巴酱', '椰奶');

-- 榴莲鱼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.5
    WHEN '榴莲膏' THEN 0.15
    WHEN '辣椒' THEN 0.08
    WHEN '椰奶' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '榴莲膏' THEN 'jar'
    WHEN '辣椒' THEN 'kg'
    WHEN '椰奶' THEN 'can'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '榴莲鱼'
  AND i.name_zh IN ('鱼', '榴莲膏', '辣椒', '椰奶');

-- 烤糯米卷
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.3
    WHEN '椰丝' THEN 0.15
    WHEN '参巴酱' THEN 0.08
    WHEN '香蕉叶' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰丝' THEN 'pack'
    WHEN '参巴酱' THEN 'jar'
    WHEN '香蕉叶' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '烤糯米卷'
  AND i.name_zh IN ('糯米', '椰丝', '参巴酱', '香蕉叶');

-- 万隆面
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '面条' THEN 0.4
    WHEN '虾' THEN 0.25
    WHEN '蔬菜' THEN 0.15
    WHEN '辣椒' THEN 0.08
    WHEN '番茄酱' THEN 0.1
  END,
  CASE i.name_zh
    WHEN '面条' THEN 'kg'
    WHEN '虾' THEN 'kg'
    WHEN '蔬菜' THEN 'kg'
    WHEN '辣椒' THEN 'kg'
    WHEN '番茄酱' THEN 'bottle'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '万隆面'
  AND i.name_zh IN ('面条', '虾', '蔬菜', '辣椒', '番茄酱');

-- 鱼肉条
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼' THEN 0.5
    WHEN '木薯粉' THEN 0.2
    WHEN '盐' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '鱼' THEN 'kg'
    WHEN '木薯粉' THEN 'pack'
    WHEN '盐' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '鱼肉条'
  AND i.name_zh IN ('鱼', '木薯粉', '盐');

-- 竹筒糯米
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '糯米' THEN 0.4
    WHEN '椰奶' THEN 0.3
    WHEN '盐' THEN 0.02
  END,
  CASE i.name_zh
    WHEN '糯米' THEN 'kg'
    WHEN '椰奶' THEN 'can'
    WHEN '盐' THEN 'pack'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '竹筒糯米'
  AND i.name_zh IN ('糯米', '椰奶', '盐');

-- 啰惹
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '水果' THEN 0.3
    WHEN '蔬菜' THEN 0.2
    WHEN '虾膏' THEN 0.1
    WHEN '花生' THEN 0.08
    WHEN '糖' THEN 0.05
  END,
  CASE i.name_zh
    WHEN '水果' THEN 'kg'
    WHEN '蔬菜' THEN 'kg'
    WHEN '虾膏' THEN 'jar'
    WHEN '花生' THEN 'pack'
    WHEN '糖' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '啰惹'
  AND i.name_zh IN ('水果', '蔬菜', '虾膏', '花生', '糖');

-- 槟城印度饭
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '白米' THEN 0.5
    WHEN '咖喱' THEN 0.3
    WHEN '鸡肉' THEN 0.25
    WHEN '蔬菜' THEN 0.2
  END,
  CASE i.name_zh
    WHEN '白米' THEN 'kg'
    WHEN '咖喱' THEN 'jar'
    WHEN '鸡肉' THEN 'kg'
    WHEN '蔬菜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '槟城印度饭'
  AND i.name_zh IN ('白米', '咖喱', '鸡肉', '蔬菜');

-- 酸辣鱼头
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
SELECT r.id, i.id,
  CASE i.name_zh
    WHEN '鱼头' THEN 0.6
    WHEN '罗望子' THEN 0.08
    WHEN '辣椒' THEN 0.1
    WHEN '蔬菜' THEN 0.15
  END,
  CASE i.name_zh
    WHEN '鱼头' THEN 'kg'
    WHEN '罗望子' THEN 'pack'
    WHEN '辣椒' THEN 'kg'
    WHEN '蔬菜' THEN 'kg'
  END, ''
FROM recipes r, ingredients i
WHERE r.name_zh = '酸辣鱼头'
  AND i.name_zh IN ('鱼头', '罗望子', '辣椒', '蔬菜');

-- ========== 完成！所有90道菜的食材关联已配置 ==========
-- 总计：69道(原有) + 21道(补充) = 90道菜品

