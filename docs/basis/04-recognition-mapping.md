# PetFit 识别映射依据

## 1. 目标

把 `AI 识别结果` 稳定映射到以下几层：

- 统一中文显示名
- 统一贴纸资产
- 统一目标对象页
- 可选状态标签
- 统一代表贴纸优先级
- 统一对象状态切换规则

这份文档现在就是后续前端、后端、安卓接入时的依据，不再只靠截图或零散 mock 判断。

## 2. 当前事实来源

以下文件共同构成当前 source of truth：

- 识别键与贴纸映射表：
  [recognition-sticker-mapping.json](/D:/360MoveData/Users/swqyh/Desktop/petfit/assets/derived/indexes/recognition-sticker-mapping.json)
- 识别 catalog 运行时归一化入口：
  [recognition-catalog.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/recognition-catalog.ts)
- 识别资产索引：
  [recognition-asset-index.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/recognition-asset-index.ts)
- 对象状态规则：
  [object-asset-rules.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/object-asset-rules.ts)
- 运行时 selector：
  [selectors.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/domain/selectors.ts)

## 3. 当前识别资产规模

截至当前仓库状态：

- canonical recognition entries：`51`
- food entries：`41`
- drink entries：`10`

## 4. 目标对象路由

当前路由规则已经固化在
[object-asset-rules.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/object-asset-rules.ts)
和
[recognition-catalog.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/recognition-catalog.ts)：

- `food` -> `bowl`
- `drink` -> `bottle`
- `rest` -> `manual_record_only`

说明：

- 饮食识别结果统一落到饭碗页，转成 food stickers。
- 饮料识别结果统一落到水瓶页，转成 drink stickers。
- 休息不走图像识别贴纸路由，而走手动记录/计时记录。

## 5. 饭碗贴纸调用规则

饭碗页的代表贴纸来自：

- 当日 `foodRecords`
- 每条记录的 `recognitionKeys`
- 在 `recognitionCatalog.byKey` 中查到的条目
- 按 `representativePriority` 升序排序
- 最多取前 `6` 个作为饭碗页可见贴纸
- 超出的数量写入 `overflowCount`

对应 selector：
[selectBowlView](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/domain/selectors.ts)

当前优先级原则：

- `1`
  主食/蛋白质优先代表一餐主体
- `2`
  组合餐、常见配餐次一级
- `3`
  蔬菜水果作为辅助代表项
- `4`
  零食、甜品尽量后置

## 6. 水瓶贴纸调用规则

水瓶页的可见贴纸来自：

- 当日 `drinkRecords`
- 每条记录的 `recognitionKey`
- 在 `recognitionCatalog.byKey` 中查到的条目
- 取条目里的 `stickerAssetName`
- 去重后形成 `stickerAssets`

水瓶页的标签来自：

- 每条 `drinkRecord.statusTags`
- 去重后映射到 tag assets

当前约定的状态标签资产：

- `tag_drink_sweet`
- `tag_drink_caffeinated`
- `tag_drink_low_sugar`
- `tag_drink_sugar_free`

对应 selector：
[selectBottleView](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/domain/selectors.ts)

## 7. 对象状态切换规则

### 饭碗对象状态

规则已经固化在
[object-asset-rules.ts](/D:/360MoveData/Users/swqyh/Desktop/petfit/src/data/object-asset-rules.ts)

- `totalItems <= 0`
  -> `object_bowl_empty`
- `totalItems <= 3`
  -> `object_bowl_light_fruit`
- `totalItems <= 6`
  -> `object_bowl_full_fruit_salad`
- `totalItems > 6`
  -> `object_bowl_overflow_plus_n`

### 水瓶对象状态

- `totalHydrationMl <= 0`
  -> `object_bottle_empty`
- `progress < 0.25`
  -> `object_bottle_water_low`
- `0.25 <= progress < 0.6`
  -> `object_bottle_water_mid`
- `0.6 <= progress < 1`
  -> `object_bottle_water_high`
- `progress >= 1`
  -> `object_bottle_water_full`

其中 `progress = totalHydrationMl / goalMl`

### 休息对象状态

- `totalMinutes <= 0`
  -> `object_cushion_idle_flat`
- `totalMinutes >= restGoalMinutes`
  -> `object_cushion_finished_plush`
- 最新一条休息记录 `durationMinutes >= 15`
  -> `object_cushion_resting_with_buding`
- 其他情况
  -> `object_cushion_used_soft`

## 8. 后端 / 安卓接入建议

后端和安卓不要直接抄页面视觉逻辑，而应复用这三层：

1. `recognition-sticker-mapping.json`
   负责 `recognition_key -> display_name / sticker / target_object / status_tag`
2. `object-asset-rules.ts`
   负责对象状态切换阈值
3. `selectors.ts`
   负责当前前端 demo 的实际消费方式

建议未来服务端接口至少返回：

- `recognitionKey`
- `displayName`
- `targetObject`
- `stickerAssetName`
- `statusTag`
- `representativePriority`

这样无论是 Web demo、安卓端还是后端聚合层，都能共享同一套资产索引。

## 9. 当前仍待继续完善

- 未知食物 / 未知饮料的兜底贴纸策略
- 多食物混合图像的拆分与排序细则
- 低置信度识别时的人为确认流程
- 休息页的“活动贴纸/海报位”后续物料挂载规则
- 后端返回结构与安卓资源包命名统一
