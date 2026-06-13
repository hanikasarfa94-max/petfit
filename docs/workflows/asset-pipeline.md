# Asset Pipeline

## 目标

把当前 `sprite sheet -> 单资产 -> 索引` 这条链路固化成可重复执行的流程。

## 输入

- `assets/raw/sprite-sheets/*.png`
- `assets/raw/mockups/*.png`
- `assets/raw/boards/*.png`

## 输出

- `assets/derived/cutouts/`
- `assets/derived/named/`
- `assets/derived/indexes/asset-index.csv`
- `assets/derived/indexes/asset-index.json`
- `assets/derived/indexes/asset-index.md`
- `assets/derived/indexes/cutout-label-template.csv`
- `assets/derived/indexes/semantic-asset-manifest.csv`
- `assets/derived/indexes/recognition-sticker-mapping.csv`

## 当前脚本

### 1. 自动去底与切片

```powershell
& 'C:\Users\swqyh\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\extract_sprite_sheet_assets.py
```

### 2. 重建资产索引

```powershell
& 'C:\Users\swqyh\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_asset_index.py
```

### 3. 发布语义化别名资产与识别映射

```powershell
& 'C:\Users\swqyh\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\publish_semantic_assets.py
```

## 建议执行顺序

1. 先跑切片脚本
2. 检查 `assets/derived/cutouts/`
3. 生成联系图，方便人工复核
4. 发布语义化别名资产
5. 再跑索引脚本
6. 用 `cutout-label-template.csv` 做人工复核或追加标注

## 注意事项

- 切片脚本假设背景是统一的洋红/粉紫渐变母版。
- 如果未来新增了不同背景的 sprite sheet，需要单独加规则，不要直接混跑。
- 页面 mockup 不走自动抠图，默认只进入索引。
- 如果语义命名策略变更，应先更新 `publish_semantic_assets.py`，再重发别名资产和映射表。
