# PetFit 识别映射依据

## 1. 目标

把 `AI 识别结果` 稳定映射到：

- 统一中文展示名
- 统一贴纸资产
- 统一目标对象
- 可选状态标签
- 代表贴纸优先级

## 2. 当前约束

- `food` 默认进入 `bowl`
- `drink` 默认进入 `bottle`
- `rest` 不走识别映射，直接走行为记录

## 3. 当前第一版规则

- 主食、蛋白、完整套餐优先级更高
- 水果和蔬菜可作为次级代表贴纸
- 零食甜品默认优先级较低
- 奶茶、可乐、橙汁这类默认可挂 `tag_drink_sweet`
- 咖啡默认可挂 `tag_drink_caffeinated`

## 4. 数据文件

完整映射表见：

- [recognition-sticker-mapping.csv](/D:/360MoveData/Users/swqyh/Desktop/petfit/assets/derived/indexes/recognition-sticker-mapping.csv)
- [recognition-sticker-mapping.json](/D:/360MoveData/Users/swqyh/Desktop/petfit/assets/derived/indexes/recognition-sticker-mapping.json)
- [recognition-sticker-mapping.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/assets/derived/indexes/recognition-sticker-mapping.md)

## 5. 后续还要补的内容

- 复杂餐食拆分与组合餐优先规则
- 未知食物、未知饮品兜底映射
- `识别置信度低` 时的人工确认策略
- 贴纸进入饭碗主视觉时的代表项筛选规则
