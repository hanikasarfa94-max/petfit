# PetFit Frontend Prototype Execution

## 目标

在当前以文档和素材为主的仓库上，先构建一套 `React + TypeScript + Vite` 的移动端优先原型，用来孪生安卓应用的关键体验，优先验证信息架构、状态流转和视觉表达。

## 当前原则

- 运行时图片源只使用 `assets/derived/named/`
- 第一阶段识别流使用 `mock` 结果，不直接接入真实模型
- `识别结果 -> 贴纸 -> 对象状态` 统一由映射表驱动
- 原型优先验证 IA、交互闭环、页面气质，不先追求原生壳

## 阶段划分

### Phase 0: Foundation

目标：
- Vite + React + TypeScript 项目可启动
- 建立移动端优先页面壳
- 建立基础目录与路由骨架

完成标准：
- 存在 `src/app`、`src/shared`、`src/entities`、`src/data`、`src/domain`、`src/pages`
- 已注册主页、拍摄流、对象页、设置页、统计页路由

### Phase 1: Shared Contracts

目标：
- 建立领域模型
- 建立资产注册表
- 建立识别映射适配层
- 建立基础 store 与 selector

完成标准：
- 页面不直接读取原始 JSON，而通过 typed registry / selectors 消费
- 主页、饭碗、水瓶、靠垫都有基础派生视图能力

### Phase 2: P0 Vertical Slice

目标：
- 主页
- 饭碗页
- 拍摄 -> 识别 -> 确认 -> 保存反馈
- 喝口水浮层
- 设置页

完成标准：
- 形成从首页进入拍摄流并写回饭碗的闭环
- 快捷喝水可更新水瓶状态

### Phase 3: P1 Completion

目标：
- 水瓶页
- 靠垫页
- 明细抽屉
- 通用统计页

完成标准：
- 三个对象页都由共享模板驱动
- 明细与统计不做成额外一级导航

### Phase 4: Verification

目标：
- 视觉对照
- 路由检查
- 资产覆盖检查
- 关键交互 smoke test

完成标准：
- 主要手机视口下页面可正常显示
- 页面不直接依赖 `assets/raw/` 或 `assets/derived/cutouts/`

## 子代理分工

### Worker 1: Bootstrap / Foundation

职责：
- 项目脚手架
- 路由骨架
- App Shell
- 全局样式入口

写入范围：
- `package.json`
- `tsconfig*.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/app/*`
- `src/styles/globals.css`
- `src/styles/tokens.css`

### Worker 2: Data Plumbing

职责：
- 领域类型
- asset registry
- recognition catalog
- mock seed data
- Zustand store
- selectors

写入范围：
- `src/entities/**`
- `src/data/**`
- `src/domain/**`
- `src/app/store/**`

### Worker 3: UI Shell

职责：
- 移动端共享 UI 原子与布局件
- 顶部栏、气泡、对象容器、日期条、底部动作栏、sheet、drawer 壳

写入范围：
- `src/shared/**`
- `src/ui/**`

### Next Wave

Foundation 合并后再派：

- Bowl Flow
- Bottle + Rest Flows
- Settings + Stats
- Verification

## 依赖顺序

1. `Foundation` 先落
2. `Data Plumbing` 与 `UI Shell` 可以并行
3. 功能流代理必须消费共享 contracts，不自行重建
4. `Verification` 跟跑，最后再做一次全量收口

## 冻结决策

- `AI recognition` 第一阶段全部 mock
- 后端识别网关单独作为后续工作包，不阻塞前端原型
- 命名资产是运行时唯一真源
- cutout 仅用于追溯与调试

## 后续补充

- 真实识别网关契约
- 复杂餐食布局规则
- 低置信度与未知分类兜底策略
