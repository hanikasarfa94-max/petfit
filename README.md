# PetFit Workspace

这个仓库现在是 `PetFit` 的产品定义与资产工作区，不是应用代码仓库。

## 当前目标

- 把原始设计说明收敛成后续实现可直接依赖的依据文档
- 整理原始 mockup 与 sprite sheet
- 建立切片、抠图、索引的可重复工作流

## 目录说明

```text
docs/
  source/      原始输入文档，原则上不再直接改写
  basis/       后续产品、设计、实现统一依赖的依据文档
  workflows/   可执行工作流说明

assets/
  raw/
    boards/        总览板、流程板
    mockups/       页面级设计稿
    sprite-sheets/ 可自动切片/去底的资产母版
  derived/
    cutouts/       自动抠图与切片输出
    indexes/       资产索引、清单、标签模板
    contacts/      联系图/预览图等派生产物

scripts/
  build_asset_index.py
  build_cutout_contact_sheets.py
  extract_sprite_sheet_assets.py
  publish_semantic_assets.py
```

## 使用顺序

1. 先看 [docs/basis/01-project-basis.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/01-project-basis.md)
2. 再看 [docs/basis/02-asset-basis.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/02-asset-basis.md)
3. 处理资产时按 [docs/workflows/asset-pipeline.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/workflows/asset-pipeline.md) 执行
4. 需要语义化别名和识别映射时，使用 [docs/basis/04-recognition-mapping.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/04-recognition-mapping.md)

## 说明

- `docs/source/` 保留原始信息，不承担决策归并职责。
- 如果原始文档与依据文档冲突，以 `docs/basis/` 为准。
- `assets/derived/cutouts/` 保留原始切片编号。
- `assets/derived/named/` 是后续实现优先引用的语义化别名资产。
- 当前已经初始化 Git，但还没有创建首个提交。
