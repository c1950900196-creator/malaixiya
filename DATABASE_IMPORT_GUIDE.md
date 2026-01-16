# 🚀 数据库导入指南

## 📋 需要执行的SQL文件顺序

请按以下顺序在 **Supabase SQL Editor** 中执行SQL文件：

### 1️⃣ 导入食材数据
文件: `supabase/seed-ingredients.sql`

这个文件包含 100+ 种马来西亚常用食材及其价格。

### 2️⃣ 导入基础菜品数据 
文件: `supabase/seed-recipes.sql`

这个文件包含约 100 道马来西亚菜品。

### 3️⃣ 导入补充菜品数据
文件: `supabase/recipes-data-additional.sql`

这个文件补充了约 110 道菜品，使总数达到 210+。

### 4️⃣ 导入菜品-食材关联
文件: `supabase/recipe-ingredients-mapping.sql`

这个文件为核心菜品配置了食材关联关系（示例配置了10道代表性菜品）。

## 🔧 如何执行

### 方法一：Supabase Dashboard
1. 打开 https://supabase.com/dashboard
2. 选择你的项目
3. 左侧菜单 → **SQL Editor**
4. 点击 **New Query**
5. 复制粘贴 SQL 文件内容
6. 点击 **Run** 执行
7. 重复步骤 4-6，按顺序执行所有文件

### 方法二：本地 psql 命令行
```bash
# 设置环境变量（从 Supabase Dashboard → Settings → Database 获取）
export DB_URL="postgresql://postgres.[your-project-ref]:[your-password]@db.[your-project-ref].supabase.co:5432/postgres"

# 按顺序执行
cd /Users/huhaotian/未命名文件夹/malaysia-meal-planner
psql $DB_URL -f supabase/seed-ingredients.sql
psql $DB_URL -f supabase/seed-recipes.sql  
psql $DB_URL -f supabase/recipes-data-additional.sql
psql $DB_URL -f supabase/recipe-ingredients-mapping.sql
```

## ✅ 验证导入成功

执行以下SQL检查数据：

```sql
-- 检查食材数量
SELECT COUNT(*) as ingredient_count FROM ingredients;
-- 应该返回 100+

-- 检查菜品数量  
SELECT COUNT(*) as recipe_count FROM recipes;
-- 应该返回 210+

-- 检查食材关联数量
SELECT COUNT(*) as mapping_count FROM recipe_ingredients;
-- 应该返回 60+（10道菜 × 平均6个食材）

-- 查看早餐菜品
SELECT name_zh, name_en, cuisine_type FROM recipes WHERE meal_type = 'breakfast' LIMIT 10;

-- 查看某道菜的食材
SELECT r.name_zh, i.name_zh as ingredient, ri.quantity, ri.unit, i.avg_price_rm
FROM recipes r
JOIN recipe_ingredients ri ON r.id = ri.recipe_id  
JOIN ingredients i ON ri.ingredient_id = i.id
WHERE r.name_zh = '椰浆饭';
```

## 📝 重要说明

1. **食材关联配置**：目前只为 10 道代表性菜品配置了食材关联（示例）
   - 椰浆饭、海南鸡饭、仁当鸡、沙爹、咖喱鱼头、炒粿条、肉骨茶、咖喱鸡、清蒸鱼、炒饭

2. **如何添加更多食材关联**：
   - 如果需要为更多菜品配置食材，可以参考 `recipe-ingredients-mapping.sql` 的格式
   - 或者在后续版本中，让AI自动补充食材关联

3. **购物清单回退机制**：
   - 即使某些菜品没有配置食材关联，系统也会使用预设模板确保购物清单正常生成

## 🎯 下一步

数据导入完成后：
1. 等待 Vercel 部署完成（约 1-2 分钟）
2. 访问网站测试膳食计划生成
3. 检查购物清单是否正确显示价格

## 🐛 常见问题

**Q: 执行SQL时报错 "duplicate key value violates unique constraint"**
A: 说明数据已经导入过了。可以先执行：
```sql
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;
```
然后重新导入。

**Q: 购物清单价格显示为 0**
A: 说明该菜品还没配置食材关联，系统会使用预设模板。

**Q: 膳食计划生成失败**  
A: 检查 `recipes` 表是否有数据，以及 `meal_type` 字段是否正确设置。



