# PetFit 资产依据

## 1. 资产分层

后续所有图片资产按下面几层管理：

- `boards`: 总览板、信息汇总板、路线图图板
- `mockups`: 页面级参考图、状态页、流程页
- `sprite-sheets`: 适合自动去底与切片的资产母版
- `cutouts`: 已输出为透明 PNG 的可复用单资产
- `named`: 已补语义名与分类的实现优先资产
- `indexes`: 机器索引、人工标注模板、盘点清单

## 2. 当前资产家族

### 角色资产

- 小布丁待机、挥手、开心、惊讶、犯困、喝水、吃东西、睡觉等状态

### 对象资产

- 饭碗/餐盘状态
- 水瓶/水位状态
- 靠垫/休息状态

### 贴纸资产

- 主食、蛋白、蔬菜、水果、零食、快餐、组合餐
- 饮品与状态标签

### UI 资产

- 按钮图标
- 装饰特效
- 标签、气泡、数值徽标

## 3. 原始 sprite sheet 语义化命名

当前 6 张核心母版已改为：

- `buding-character-states-v1.png`
- `core-objects-and-badges-v1.png`
- `food-stickers-staples-protein-veg-v1.png`
- `food-stickers-fruit-snacks-combos-v1.png`
- `drink-stickers-and-status-tags-v1.png`
- `ui-icons-effects-and-secondary-states-v1.png`

## 4. 切片与抠图策略

### 可以自动处理的素材

- `assets/raw/sprite-sheets/` 下的纯色洋红背景母版

处理方式：

- 按角落背景色自动去底
- 透明化背景
- 按行列投影切片
- 生成透明 PNG 单资产
- 自动建立切片索引与待命名模板
- 发布语义化别名资产

### 暂不自动处理的素材

- `assets/raw/mockups/` 页面级整图
- `assets/raw/boards/` 流程总览图

这些图更多承担参考和标注作用，不适合直接脚本抠图。

## 5. 命名规范

### 原始文件

保留来源语义，不强求细颗粒度命名，但避免继续新增时间戳名。

### 切片输出

统一命名为：

```text
{sheet_name}__{index:02d}.png
```

例如：

```text
buding-character-states-v1__01.png
drink-stickers-and-status-tags-v1__07.png
```

### 人工重命名后的目标格式

```text
character_buding_wave.png
object_bottle_water_mid.png
sticker_food_rice_bowl.png
tag_drink_sweet.png
icon_action_camera.png
```

### 当前实现方式

- `cutouts/` 继续保留编号切片，作为稳定源切片
- `named/` 发布正式语义别名，作为后续实现引用层

## 6. 当前工作约束

- 自动切片只负责“去底 + 分离 + 建索引”，不直接假设语义名绝对正确。
- 语义命名、归类、映射仍需要人工复核。
- 页面 mockup 不和最终切片资产混放。

## 7. 接下来最重要的资产工作

1. 完成 sprite sheet 自动抠图与切片
2. 生成统一资产索引
3. 给切片资产补业务语义标签
4. 产出识别映射表 `识别结果 -> 贴纸 -> 对象`
5. 选定前端首批 P0 需要的角色/对象/贴纸资产
