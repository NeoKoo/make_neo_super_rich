# 今日运势玄学增强功能计划

## 概述
在现有今日运势功能基础上，添加更多玄学元素（名字、星座、五行、数字命理等）来生成推荐号码，提供更丰富的运势分析。

## 现有功能分析

### 已实现的玄学元素
1. **星座** - 从生日计算（12星座）
2. **五行** - 从生日的年份天干计算（木、火、土、金、水）
3. **数字命理** - 生命灵数和每日数字
4. **幸运色** - 基于星座、五行、数字命理综合计算
5. **用户信息** - 名字、生日、星座

### 现有文件结构
```
src/
├── components/fortune/
│   └── DailyFortune.tsx          # 今日运势组件
├── utils/
│   ├── fortuneService.ts          # 运势API服务
│   └── luckyColor.ts             # 幸运色计算
├── constants/
│   ├── wuxingColors.ts           # 五行颜色配置
│   ├── zodiacColors.ts           # 星座颜色配置
│   └── numberColorMap.ts         # 数字命理颜色映射
└── types/
    └── color.ts                  # 颜色类型定义
```

## 功能设计

### 1. 扩展运势数据结构

创建新的类型定义 `src/types/fortune.ts`：

```typescript
// 玄学分析结果
export interface MetaphysicsAnalysis {
  // 名字分析
  nameAnalysis: {
    totalStrokes: number          // 总笔画数
    wuxing: WuxingType            // 名字五行属性
    luckyNumbers: number[]        // 名字幸运数字
    meaning: string               // 名字含义
  }

  // 星座深度分析
  zodiacAnalysis: {
    sign: string                  // 星座名称
    element: string              // 星座元素（火、土、风、水）
    luckyNumbers: number[]        // 星座幸运数字
    todayLuck: number            // 今日运势指数（1-10）
    luckyDirection: string       // 幸运方位
  }

  // 五行生克分析
  wuxingAnalysis: {
    personalWuxing: WuxingType   // 个人五行
    todayWuxing: WuxingType      // 今日五行
    relationship: string         // 五行关系（相生、相克、相同）
    luckyNumbers: number[]       // 五行幸运数字
    advice: string               // 五行建议
  }

  // 数字命理分析
  numerologyAnalysis: {
    lifePathNumber: number       // 生命灵数
    dailyNumber: number          // 今日数字
    combinedNumber: number       // 综合数字
    luckyNumbers: number[]       // 数字命理幸运数字
    meaning: string              // 数字含义
  }

  // 综合推荐号码
  recommendedNumbers: {
    redBalls: number[]          // 推荐红球号码
    blueBalls: number[]         // 推荐蓝球号码
    confidence: number          // 推荐置信度（0-100）
    reasons: string[]           // 推荐理由
  }
}

// 扩展的运势数据
export interface EnhancedDailyFortune {
  // 原有字段
  blessing: string
  luckyTime: string
  luckyHour: number
  reason: string

  // 新增玄学分析
  metaphysics: MetaphysicsAnalysis
}

export type WuxingType = '木' | '火' | '土' | '金' | '水'
```

### 2. 创建玄学号码计算工具

创建 `src/utils/metaphysicsCalculator.ts`：

```typescript
// 基于玄学元素计算推荐号码
export function calculateMetaphysicsNumbers(
  name: string,
  birthDate: Date,
  currentDate: Date,
  lotteryType: LotteryType
): RecommendedNumbers

// 名字分析
export function analyzeName(name: string): NameAnalysis

// 星座深度分析
export function analyzeZodiac(
  zodiacSign: string,
  currentDate: Date
): ZodiacAnalysis

// 五行生克分析
export function analyzeWuxing(
  personalWuxing: WuxingType,
  currentDate: Date
): WuxingAnalysis

// 数字命理分析
export function analyzeNumerology(
  birthDate: Date,
  currentDate: Date
): NumerologyAnalysis
```

### 3. 添加玄学常量定义

创建 `src/constants/metaphysics.ts`：

```typescript
// 汉字笔画数映射（简化版）
export const HANZI_STROKES: Record<string, number>

// 五行生克关系
export const WUXING_RELATIONSHIPS: Record<WuxingType, {
  generates: WuxingType      // 生
  overcomes: WuxingType       // 克
  isGeneratedBy: WuxingType   // 被生
  isOvercomeBy: WuxingType    // 被克
}>

// 五行对应的幸运数字
export const WUXING_LUCKY_NUMBERS: Record<WuxingType, number[]>

// 星座元素
export const ZODIAC_ELEMENTS: Record<string, string>

// 星座幸运数字
export const ZODIAC_LUCKY_NUMBERS: Record<string, number[]>

// 数字命理含义
export const NUMEROLOGY_MEANINGS: Record<number, string>

// 生命灵数幸运数字
export const LIFE_PATH_LUCKY_NUMBERS: Record<number, number[]>
```

### 4. 扩展 fortuneService.ts

修改 `getDailyFortune` 函数，返回增强的运势数据：

```typescript
export async function getEnhancedDailyFortune(
  name: string,
  zodiacSign: string,
  birthDate: Date,
  lotteryType: LotteryType
): Promise<EnhancedDailyFortuneResult>
```

使用AI API获取更详细的玄学分析，包括：
- 名字含义和吉凶
- 星座今日运势详情
- 五行生克分析
- 数字命理解读
- 基于以上元素的推荐号码

### 5. 更新 DailyFortune.tsx 组件

添加新的UI部分展示玄学分析：

```tsx
// 玄学分析卡片
<MetaphysicsCard
  nameAnalysis={fortune.metaphysics.nameAnalysis}
  zodiacAnalysis={fortune.metaphysics.zodiacAnalysis}
  wuxingAnalysis={fortune.metaphysics.wuxingAnalysis}
  numerologyAnalysis={fortune.metaphysics.numerologyAnalysis}
/>

// 推荐号码展示
<RecommendedNumbers
  numbers={fortune.metaphysics.recommendedNumbers}
  lotteryType={lotteryType}
/>
```

### 6. 创建玄学信息展示子组件

创建 `src/components/fortune/MetaphysicsCard.tsx`：

展示玄学分析信息，包括：
- 名字分析（笔画数、五行属性、含义）
- 星座运势（元素、幸运数字、运势指数）
- 五行分析（个人五行、今日五行、关系）
- 数字命理（生命灵数、今日数字、含义）

创建 `src/components/fortune/RecommendedNumbers.tsx`：

展示基于玄学元素的推荐号码：
- 红球推荐号码
- 蓝球推荐号码
- 推荐置信度
- 推荐理由列表

## 实现步骤

### 步骤1: 创建类型定义
- [ ] 创建 `src/types/fortune.ts` 文件
- [ ] 定义玄学分析相关类型

### 步骤2: 添加玄学常量
- [ ] 创建 `src/constants/metaphysics.ts` 文件
- [ ] 定义汉字笔画数映射
- [ ] 定义五行生克关系
- [ ] 定义五行幸运数字
- [ ] 定义星座元素和幸运数字
- [ ] 定义数字命理含义

### 步骤3: 创建玄学计算工具
- [ ] 创建 `src/utils/metaphysicsCalculator.ts` 文件
- [ ] 实现名字分析函数
- [ ] 实现星座深度分析函数
- [ ] 实现五行生克分析函数
- [ ] 实现数字命理分析函数
- [ ] 实现综合推荐号码计算函数

### 步骤4: 扩展运势服务
- [ ] 修改 `src/utils/fortuneService.ts`
- [ ] 更新 `getDailyFortune` 函数签名
- [ ] 修改AI prompt以获取玄学分析
- [ ] 添加玄学数据解析逻辑

### 步骤5: 创建展示组件
- [ ] 创建 `src/components/fortune/MetaphysicsCard.tsx`
- [ ] 创建 `src/components/fortune/RecommendedNumbers.tsx`
- [ ] 添加样式和动画效果

### 步骤6: 更新主组件
- [ ] 修改 `src/components/fortune/DailyFortune.tsx`
- [ ] 集成新的玄学展示组件
- [ ] 添加展开/收起功能（避免信息过载）

### 步骤7: 测试和优化
- [ ] 测试各个玄学计算函数
- [ ] 测试AI API响应解析
- [ ] 测试UI展示效果
- [ ] 优化性能和用户体验

## UI设计建议

### 信息层次
1. **核心运势**（始终显示）
   - 祝福语
   - 幸运时间
   - 幸运原因

2. **玄学分析**（可展开）
   - 名字分析
   - 星座运势
   - 五行分析
   - 数字命理

3. **推荐号码**（可展开）
   - 红球推荐
   - 蓝球推荐
   - 推荐理由

### 视觉风格
- 使用渐变色区分不同玄学元素
- 添加图标增强可读性
- 使用动画效果提升用户体验
- 保持与现有设计风格一致

### 交互设计
- 默认折叠详细信息，避免信息过载
- 点击展开查看详细玄学分析
- 支持一键复制推荐号码
- 支持刷新运势功能

## 技术要点

### 名字笔画计算
- 简化实现：使用常用汉字笔画映射
- 可选：集成第三方笔画计算库

### 五行生克逻辑
```
木生火，火生土，土生金，金生水，水生木
木克土，土克水，水克火，火克金，金克木
```

### 号码推荐算法
1. 基于名字笔画数生成候选号码
2. 基于五行幸运数字筛选
3. 基于星座幸运数字调整权重
4. 基于数字命理优化
5. 综合计算置信度

### AI Prompt设计
```
作为命理专家，请基于以下信息提供玄学分析：
- 名字：{name}
- 星座：{zodiacSign}
- 生日：{birthDate}
- 今日日期：{currentDate}
- 彩票类型：{lotteryType}

请提供：
1. 名字含义和吉凶分析
2. 星座今日运势详情
3. 五行生克分析
4. 数字命理解读
5. 基于以上元素的推荐号码（红球6个，蓝球1-2个）
6. 推荐理由

严格按照JSON格式输出...
```

## 注意事项

1. **用户体验**
   - 避免信息过载，使用折叠/展开
   - 提供清晰的视觉层次
   - 添加加载状态和错误处理

2. **性能优化**
   - 缓存玄学计算结果
   - 避免重复计算
   - 优化AI API调用

3. **可扩展性**
   - 设计灵活的数据结构
   - 便于添加新的玄学元素
   - 支持自定义计算逻辑

4. **准确性**
   - 验证玄学计算逻辑
   - 测试AI API响应
   - 提供合理的默认值

## 后续扩展方向

1. 添加更多玄学元素（如八字、紫微斗数等）
2. 支持自定义玄学计算权重
3. 添加运势历史记录
4. 提供运势对比分析
5. 集成更多AI模型提供不同解读
