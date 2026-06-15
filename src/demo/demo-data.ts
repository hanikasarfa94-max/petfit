export const demoAssets = {
  back: "/assets/derived/ui-kit/icon_button_back.png",
  bottleBg: "/assets/raw/mockups/bottle_bg.png",
  bottle: "/assets/derived/named/object/object_bottle_water_full.png",
  bowlBg: "/assets/raw/mockups/bowl_bg.png",
  bowl: "/assets/derived/named/object/object_bowl_light_fruit_snack.png",
  bread: "/assets/derived/named/sticker-food/sticker_food_bread_loaf.png",
  broccoli: "/assets/derived/named/sticker-food/sticker_food_broccoli.png",
  cameraAction: "/assets/derived/named/icon/icon_action_camera.png",
  camera: "/assets/derived/ui-kit/icon_button_camera.png",
  confirm: "/assets/derived/ui-kit/icon_button_confirm.png",
  cushion: "/assets/derived/named/object/object_cushion_finished_plush.png",
  drink: "/assets/derived/ui-kit/icon_button_drink.png",
  effectFlame: "/assets/derived/ui-kit/effect_flame.png",
  effectHeart: "/assets/derived/ui-kit/effect_heart.png",
  egg: "/assets/derived/named/sticker-food/sticker_food_fried_egg.png",
  iconButtonDelete: "/assets/derived/ui-kit/icon_button_delete.png",
  iconButtonMore: "/assets/derived/ui-kit/icon_button_more.png",
  iconButtonRefresh: "/assets/derived/ui-kit/icon_button_refresh.png",
  mainBg: "/assets/raw/mockups/main_bg.png",
  mascotSmile: "/assets/derived/named/character/character_buding_smile.png",
  mascotSuccess: "/assets/derived/named/character/character_buding_success_wave.png",
  mascotWave: "/assets/derived/named/character/character_buding_wave.png",
  milk: "/assets/derived/named/sticker-drink/sticker_drink_milk_bottle.png",
  milkTea: "/assets/derived/named/sticker-drink/sticker_drink_milk_tea_cup.png",
  orange: "/assets/derived/named/sticker-food/sticker_food_orange.png",
  preview:
    "/tst/tst_image/drink_and_food_rice_and_fried_beef_with_pimento_and_slad_and_water_and_milk-tea.png",
  restAction: "/assets/derived/named/icon/icon_action_rest.png",
  rest: "/assets/derived/ui-kit/icon_button_rest.png",
  rice: "/assets/derived/named/sticker-food/sticker_food_rice_bowl.png",
  roastChicken: "/assets/derived/named/sticker-food/sticker_food_roast_chicken_leg.png",
  salad: "/assets/derived/named/sticker-food/sticker_food_salad_bowl.png",
  sandwich: "/assets/derived/named/sticker-food/sticker_food_sandwich_triangle.png",
  settings: "/assets/derived/ui-kit/icon_button_settings.png",
  sheetBg: "/assets/raw/mockups/sheet_bg.png",
  shellBubbleSpeechLg: "/assets/derived/ui-kit/shell_bubble_speech_lg.png",
  shellBubbleSpeechSm: "/assets/derived/ui-kit/shell_bubble_speech_sm.png",
  shellButtonPillPrimaryLg: "/assets/derived/ui-kit/shell_button_pill_primary_lg.png",
  shellButtonPillPrimarySm: "/assets/derived/ui-kit/shell_button_pill_primary_sm.png",
  shellButtonPillSecondaryLg: "/assets/derived/ui-kit/shell_button_pill_secondary_lg.png",
  shellButtonPillSecondaryLong:
    "/assets/derived/ui-kit/shell_button_pill_secondary_long.png",
  shellButtonPillSecondaryMd:
    "/assets/derived/ui-kit/shell_button_pill_secondary_md.png",
  shellButtonPillSecondarySm:
    "/assets/derived/ui-kit/shell_button_pill_secondary_sm.png",
  shellButtonRoundPrimary: "/assets/derived/ui-kit/shell_button_round_primary.png",
  shellButtonSquareSecondary:
    "/assets/derived/ui-kit/shell_button_square_secondary.png",
  shellCardBlank: "/assets/derived/ui-kit/shell_card_blank.png",
  shellCardCamera: "/assets/derived/ui-kit/shell_card_camera.png",
  shellCardDrink: "/assets/derived/ui-kit/shell_card_drink.png",
  shellCardRest: "/assets/derived/ui-kit/shell_card_rest.png",
  shellCardStats: "/assets/derived/ui-kit/shell_card_stats.png",
  shellChipCircle: "/assets/derived/ui-kit/shell_chip_circle.png",
  shellChipCirclePrimary: "/assets/derived/ui-kit/shell_chip_circle_primary.png",
  shellChipLg: "/assets/derived/ui-kit/shell_chip_lg.png",
  shellChipMd: "/assets/derived/ui-kit/shell_chip_md.png",
  shellChipSecondarySm: "/assets/derived/ui-kit/shell_chip_secondary_sm.png",
  shellChipSm: "/assets/derived/ui-kit/shell_chip_sm.png",
  shrimp: "/assets/derived/named/sticker-food/sticker_food_shrimp.png",
  slicedChicken:
    "/assets/derived/named/sticker-food/sticker_food_sliced_chicken_breast.png",
  sparkles: "/assets/derived/named/effect/effect_sparkle_cluster_medium.png",
  stats: "/assets/derived/ui-kit/icon_button_stats.png",
  strawberry: "/assets/derived/named/sticker-food/sticker_food_strawberry.png",
  drinkAction: "/assets/derived/named/icon/icon_action_drink.png",
  tea: "/assets/derived/named/sticker-drink/sticker_drink_green_tea_bottle.png",
  water: "/assets/derived/named/sticker-drink/sticker_drink_water_bottle.png",
} as const;

export type DemoRecognitionItem = {
  calories: number;
  image: string;
  note: string;
  title: string;
};

export type DemoDateItem = {
  day: string;
  label: string;
  selected?: boolean;
};

export type DemoDrinkChoice = {
  badge?: string;
  image: string;
  title: string;
};

export const demoRecognitionItems: DemoRecognitionItem[] = [
  {
    calories: 104,
    image: demoAssets.rice,
    note: "约 1/2 碗 (80g)",
    title: "米饭",
  },
  {
    calories: 66,
    image: demoAssets.slicedChicken,
    note: "约 60g",
    title: "鸡胸肉",
  },
  {
    calories: 12,
    image: demoAssets.salad,
    note: "约 1/2 碗 (40g)",
    title: "生菜沙拉",
  },
  {
    calories: 14,
    image: demoAssets.strawberry,
    note: "约 3 颗 (45g)",
    title: "草莓",
  },
];

export const demoDates: DemoDateItem[] = [
  { day: "周一", label: "6/16" },
  { day: "周二", label: "6/17" },
  { day: "周三", label: "6/18" },
  { day: "今天", label: "6/19", selected: true },
  { day: "周五", label: "6/20" },
  { day: "周六", label: "6/21" },
  { day: "周日", label: "6/22" },
];

export const demoDrinkChoices: DemoDrinkChoice[] = [
  { badge: "清爽", image: demoAssets.water, title: "水" },
  { image: demoAssets.milk, title: "牛奶" },
  { image: demoAssets.tea, title: "绿茶" },
  { badge: "偏甜", image: demoAssets.milkTea, title: "奶茶" },
];

export const demoSettingsGroups = [
  {
    items: [
      {
        iconPath: demoAssets.effectHeart,
        subtitle: "回顾我们一起走过的点滴时光",
        title: "共同记忆",
      },
    ],
  },
  {
    items: [
      {
        iconPath: demoAssets.settings,
        subtitle: "外观、动作与互动偏好",
        title: "桌宠设置",
      },
      {
        iconPath: demoAssets.stats,
        subtitle: "喝水、吃饭、休息等提醒",
        title: "提醒设置",
      },
      {
        iconPath: demoAssets.camera,
        subtitle: "管理应用权限与使用范围",
        title: "权限管理",
      },
    ],
  },
  {
    items: [
      {
        iconPath: demoAssets.iconButtonRefresh,
        subtitle: "备份与恢复你的记录",
        title: "数据同步",
      },
      {
        iconPath: demoAssets.iconButtonDelete,
        subtitle: "隐私设置与数据管理",
        title: "隐私与删除",
      },
      {
        iconPath: demoAssets.iconButtonMore,
        subtitle: "常见问题与意见反馈",
        title: "帮助反馈",
      },
    ],
  },
] as const;

export const demoStatsByObject = {
  bottle: {
    accent: "water",
    bars: [48, 62, 51, 80, 58, 70, 64],
    facts: [
      { label: "今日饮水", value: "250 ml" },
      { label: "距离目标", value: "还差 350 ml" },
      { label: "最常出现", value: "水" },
      { label: "甜饮提醒", value: "奶茶 1 次" },
    ],
    hint: "今天已经喝得不错啦，再补一两次就会更平衡。",
    title: "水瓶统计",
  },
  bowl: {
    accent: "meal",
    bars: [62, 55, 84, 68, 72, 58, 77],
    facts: [
      { label: "今日热量", value: "196 kcal" },
      { label: "已记录餐次", value: "1 餐" },
      { label: "最常出现", value: "米饭" },
      { label: "轻盈搭配", value: "沙拉 + 草莓" },
    ],
    hint: "饭碗记录已经很完整，适合拿来做前端展示主流程。",
    title: "饭碗统计",
  },
} as const;
