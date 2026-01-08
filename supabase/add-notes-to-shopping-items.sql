-- 为 shopping_list_items 表添加 notes 字段
-- 用于存储AI生成的食材名称（当不使用ingredients表时）

ALTER TABLE shopping_list_items ADD COLUMN IF NOT EXISTS notes TEXT;

-- 添加注释
COMMENT ON COLUMN shopping_list_items.notes IS '食材备注，格式：中文名 | English | Nama Melayu';


