# Docs Overview

## 文档层级

- `source/`
  原始输入，来自最初的产品说明、原型图和待整理素材。
- `basis/`
  已归并后的项目依据，供设计、切图、前端、后端、安卓统一引用。
- `workflows/`
  面向执行的流程文档，例如资产处理、切图与命名流程。

## 当前建议阅读顺序

1. [01-project-basis.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/01-project-basis.md)
2. [02-asset-basis.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/02-asset-basis.md)
3. [03-execution-plan.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/03-execution-plan.md)
4. [04-recognition-mapping.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/04-recognition-mapping.md)
5. [asset-pipeline.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/workflows/asset-pipeline.md)
6. [backend-android-handoff.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/workflows/backend-android-handoff.md)

## 当前最关键的依据

- 识别结果如何进入饭碗/水瓶：
  [04-recognition-mapping.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/basis/04-recognition-mapping.md)
- 后端 / 安卓接入应该复用哪些索引与规则：
  [backend-android-handoff.md](/D:/360MoveData/Users/swqyh/Desktop/petfit/docs/workflows/backend-android-handoff.md)
- 运行时对象状态如何切换：
  [object-asset-rules.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/object-asset-rules.ts)
- 运行时 selector 如何消费这些规则：
  [selectors.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/domain/selectors.ts)
