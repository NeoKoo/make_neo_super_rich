# 反选选号功能 - 实施计划

## 项目概述

**目标**: 添加"反选选号"功能，允许用户逐步剔除号码，从剩余号码中生成新组，直到用户保留某组。

**日期**: 2026-02-07
**估计工时**: 4-6小时

## 需求总结

### 功能需求
1. 用户点击"反选选号"按钮，弹出全屏模态框
2. 从完整号码池自动生成第一组号码（带转球动画）
3. 显示当前号码组，提供"剔除这组"和"保留这组"两个按钮
4. 用户点击"剔除这组"→ 该组号码永久剔除，从剩余号码生成新组
5. 用户点击"保留这组"→ 保存到历史记录，关闭弹窗，跳转到历史页面
6. 可选显示号码池（开关控制），灰色标记已剔除号码
7. 显示已剔除的历史记录列表
8. 进度条显示剩余号码数量

### 非功能需求
- 动画流畅（使用Framer Motion或CSS transitions）
- 移动端震动反馈
- 音效反馈（使用现有soundManager）
- 响应式设计（适配手机/平板/桌面）
- 无障碍支持（ARIA属性、键盘导航）
- 性能优化（虚拟化长列表、懒加载）

### 技术约束
- 不使用测试框架（手动测试）
- 复用现有组件和工具
- 遵循项目代码风格（TypeScript、TailwindCSS）
- 状态使用React Hooks（useState、useCallback、useMemo）

## 技术架构

### 数据结构
```typescript
interface ReverseSelectionState {
  isActive: boolean              // 反选模式是否激活
  currentSelection: NumberSelection | null  // 当前显示的号码组
  excludedRedBalls: Set<number>  // 已剔除的红球
  excludedBlueBalls: Set<number> // 已剔除的蓝球
  history: NumberSelection[]      // 已剔除的号码组历史
  showNumberPool: boolean        // 是否显示号码池
  isAnimating: boolean           // 是否在播放动画
}

interface NumberPoolManager {
  availableRedBalls: number[]
  availableBlueBalls: number[]
  totalRedCount: number
  totalBlueCount: number

  generateRandomSet(config: LotteryConfig): NumberSelection | null
  excludeNumbers(selection: NumberSelection): void
  canGenerate(config: LotteryConfig): boolean
  reset(): void
}
```

### 文件结构
```
src/
├── utils/
│   └── numberPoolManager.ts        # 号码池管理器（新增）
├── hooks/
│   └── useReverseSelection.ts      # 反选模式Hook（新增）
├── components/
│   ├── common/
│   │   └── Modal.tsx               # 现有组件，需要确认是否支持全屏
│   └── reverseSelection/           # 反选组件目录（新增）
│       ├── ReverseSelectionModal.tsx        # 主弹窗组件
│       ├── NumberPoolDisplay.tsx           # 号码池显示组件
│       ├── CurrentSelectionDisplay.tsx      # 当前号码组显示
│       ├── ExcludedHistory.tsx              # 已剔除历史列表
│       ├── ReverseSelectionActions.tsx       # 底部按钮组
│       └── SpinAnimation.tsx                # 转球动画组件
├── pages/
│   └── HomePage.tsx                 # 需要修改，添加反选按钮和弹窗
└── components/lottery/
    └── ActionButtons.tsx             # 需要修改，添加"反选"按钮
```

### 核心算法

#### 号码池生成
```typescript
function createNumberPool(
  config: LotteryConfig,
  excludedRedBalls: Set<number>,
  excludedBlueBalls: Set<number>
): NumberPoolManager
```
- 过滤已剔除号码
- 随机生成新号码组
- 永久剔除已选号码
- 检查是否足够生成下一组

#### 随机生成
```typescript
function generateFromPool(
  pool: number[],
  count: number
): number[]
```
- 使用shuffle算法（复用randomStrategies.ts中的shuffle函数）
- 按数量切片
- 排序返回

## 实施步骤

### Phase 1: 核心工具和Hook（1.5小时）

#### 1.1 创建号码池管理器
**文件**: `src/utils/numberPoolManager.ts`（新建）

**任务**:
- 实现createNumberPool函数
- 实现generateRandomSet方法
- 实现excludeNumbers方法
- 实现canGenerate方法
- 实现reset方法
- 导出类型和函数

**验证**:
- 创建测试文件验证基本功能（手动测试）
- 双色球和大乐透都能正常生成
- 剔除逻辑正确工作

#### 1.2 创建反选模式Hook
**文件**: `src/hooks/useReverseSelection.ts`（新建）

**任务**:
- 定义ReverseSelectionState接口
- 实现状态管理（useState）
- 实现generateNewSelection方法
- 实现excludeCurrentSelection方法
- 实现keepCurrentSelection方法
- 实现resetSelection方法
- 实现toggleNumberPool方法
- 使用useMemo优化号码池计算
- 导出Hook

**验证**:
- 状态更新正确
- 方法调用不产生副作用
- 性能无明显问题

### Phase 2: UI组件开发（2.5小时）

#### 2.1 创建组件目录结构
```bash
mkdir -p src/components/reverseSelection
```

#### 2.2 创建转球动画组件
**文件**: `src/components/reverseSelection/SpinAnimation.tsx`（新建）

**任务**:
- 设计转球动画（3秒旋转）
- 使用CSS transform和rotate
- 添加号码飞入效果
- 导出组件

**依赖**:
- 无需额外库，使用CSS animations

#### 2.3 创建当前号码组显示组件
**文件**: `src/components/reverseSelection/CurrentSelectionDisplay.tsx`（新建）

**任务**:
- 接收NumberSelection作为props
- 复用NumberBall组件显示号码
- 添加动画效果（淡入/飞入）
- 添加阴影和高亮效果
- 导出组件

**依赖**:
- `src/components/lottery/NumberBall.tsx`

#### 2.4 创建号码池显示组件
**文件**: `src/components/reverseSelection/NumberPoolDisplay.tsx`（新建）

**任务**:
- 显示全部号码池（红球+蓝球）
- 已剔除的号码用灰色显示+划线
- 可选号码正常显示
- 响应式布局（网格）
- 懒加载（只在展开时渲染）
- 导出组件

**依赖**:
- NumberBall组件

#### 2.5 创建已剔除历史组件
**文件**: `src/components/reverseSelection/ExcludedHistory.tsx`（新建）

**任务**:
- 显示已剔除的号码组列表
- 显示序号（1, 2, 3...）
- 最多显示50条（内存管理）
- 虚拟化（如果历史很长）
- 导出组件

**依赖**:
- NumberBall组件
- react-window（可选，用于虚拟化）

#### 2.6 创建底部按钮组件
**文件**: `src/components/reverseSelection/ReverseSelectionActions.tsx`（新建）

**任务**:
- 创建三个按钮：生成新组、剔除这组、保留这组
- 生成新组：黄色，圆形，带旋转图标
- 剔除这组：红色，圆角矩形，带删除图标
- 保留这组：绿色，圆角矩形，带勾选图标
- 动画期间禁用所有按钮
- 添加震动反馈（移动端）
- 添加音效反馈
- 导出组件

**依赖**:
- Button组件（src/components/common/Button.tsx）
- lucide-react图标库

#### 2.7 创建主弹窗组件
**文件**: `src/components/reverseSelection/ReverseSelectionModal.tsx`（新建）

**任务**:
- 实现全屏模态框
- 添加背景模糊效果
- 集成所有子组件
- 添加关闭按钮（带确认）
- 添加进度信息（剩余号码数量）
- 处理边界情况（号码池不足）
- 导出组件

**依赖**:
- Modal组件（需要确认是否支持全屏）
- 所有子组件

### Phase 3: 集成到现有系统（1小时）

#### 3.1 修改ActionButtons组件
**文件**: `src/components/lottery/ActionButtons.tsx`（修改）

**任务**:
- 添加"反选"按钮（在"随机"按钮旁边）
- 添加onReverse props
- 保持现有功能不变

**验证**:
- 按钮显示正常
- 点击事件正确传递

#### 3.2 修改HomePage组件
**文件**: `src/pages/HomePage.tsx`（修改）

**任务**:
- 导入useReverseSelection Hook
- 添加反选模式状态
- 传递onReverse处理函数到ActionButtons
- 添加ReverseSelectionModal组件到页面
- 实现handleReverseSelection函数
- 实现handleKeepSelection函数（保存到历史记录）
- 添加动画触发逻辑
- 处理弹窗关闭

**验证**:
- 反选按钮点击正常
- 弹窗打开/关闭正常
- 保存到历史记录正常

### Phase 4: 动画和效果（0.5小时）

#### 4.1 实现动画效果

**任务**:
- 打开动画：弹窗从底部向上滑入
- 生成动画：转球旋转（3秒）
- 剔除动画：号码组缩小并飞向历史区域
- 保留动画：庆祝动画（金币掉落）
- 切换开关动画：号码池展开/收起
- 号码池动画：已剔除号码变灰的过渡效果

**技术**:
- 使用Framer Motion或CSS transitions
- GPU加速（transform, opacity）

#### 4.2 添加音效

**任务**:
- 剔除号码：soundManager.playNumberClear()
- 保留号码：soundManager.playSaveSuccess()
- 打开弹窗：soundManager.playStrategySelect()

**依赖**:
- `src/utils/soundManager.ts`

#### 4.3 添加震动反馈

**任务**:
- 剔除号码：navigator.vibrate([50, 50, 50])
- 保留号码：navigator.vibrate([100, 50, 100])

### Phase 5: 边界情况和测试（1小时）

#### 5.1 处理边界情况

**任务**:
- 号码池不足：显示提示，提供"重新开始"按钮
- 用户取消：确认对话框，清空状态
- 动画期间禁用按钮
- 极端情况：所有号码都被剔除，自动重置
- 内存管理：限制历史记录数量（50条）
- 快速连续点击防护

#### 5.2 无障碍支持

**任务**:
- 添加ARIA属性（role, aria-label）
- 键盘导航支持（Enter, Space）
- 屏幕阅读器提示（aria-live）

#### 5.3 手动测试

**测试清单**:
- [ ] 反选按钮显示正常
- [ ] 弹窗打开正常
- [ ] 自动生成第一组号码
- [ ] 转球动画流畅
- [ ] "剔除这组"功能正常
- [ ] "保留这组"功能正常
- [ ] 保存到历史记录正常
- [ ] 跳转到历史页面正常
- [ ] 号码池开关正常
- [ ] 号码池显示正确
- [ ] 已剔除历史显示正确
- [ ] 号码池不足时提示正常
- [ ] 用户取消确认正常
- [ ] 音效播放正常
- [ ] 震动反馈正常
- [ ] 响应式布局正常（手机/平板/桌面）
- [ ] 双色球和大乐透都正常工作

## 依赖关系

```
Phase 1 (核心工具和Hook)
  ├─ 1.1 numberPoolManager.ts
  └─ 1.2 useReverseSelection.ts
       └─ 依赖 1.1

Phase 2 (UI组件)
  ├─ 2.2 SpinAnimation.tsx
  ├─ 2.3 CurrentSelectionDisplay.tsx
  ├─ 2.4 NumberPoolDisplay.tsx
  ├─ 2.5 ExcludedHistory.tsx
  ├─ 2.6 ReverseSelectionActions.tsx
  │    └─ 依赖 2.2, 2.3
  └─ 2.7 ReverseSelectionModal.tsx
       └─ 依赖 2.2, 2.3, 2.4, 2.5, 2.6

Phase 3 (集成)
  ├─ 3.1 ActionButtons.tsx (修改)
  └─ 3.2 HomePage.tsx (修改)
       └─ 依赖 1.2, 2.7, 3.1

Phase 4 (动画和效果)
  └─ 独立，不依赖其他阶段

Phase 5 (边界情况和测试)
  └─ 独立，需要验证所有功能
```

## 验收标准

### 功能验收
- [ ] 用户可以进入反选模式
- [ ] 可以生成号码组
- [ ] 可以剔除号码组
- [ ] 可以保留号码组
- [ ] 被剔除的号码永久剔除
- [ ] 可以查看号码池
- [ ] 可以查看已剔除历史
- [ ] 可以随时取消退出
- [ ] 保存到历史记录正常
- [ ] 跳转到历史页面正常

### 性能验收
- [ ] 动画流畅（60fps）
- [ ] 无明显卡顿
- [ ] 内存使用正常
- [ ] 长列表虚拟化（可选）

### 用户体验验收
- [ ] 界面美观，符合游戏化风格
- [ ] 动画流畅自然
- [ ] 音效反馈及时
- [ ] 震动反馈自然（移动端）
- [ ] 响应式布局正常
- [ ] 无障碍支持完善

### 代码质量验收
- [ ] 遵循项目代码风格
- [ ] TypeScript类型完整
- [ ] 无linting错误
- [ ] 代码结构清晰
- [ ] 注释充分

## 风险和挑战

### 技术风险
1. **Modal组件是否支持全屏**：现有Modal组件可能不支持全屏，需要修改或创建新组件
   - **缓解措施**：先检查Modal组件实现，必要时扩展或创建新的全屏Modal

2. **动画性能**：复杂动画可能影响性能，特别是低端设备
   - **缓解措施**：使用GPU加速，限制动画复杂度，提供降级选项

3. **内存管理**：长时间使用可能累积大量历史记录
   - **缓解措施**：限制历史记录数量（50条），及时清理状态

### 时间风险
1. **动画调试时间**：动画调试可能比预期时间长
   - **缓解措施**：优先实现核心功能，动画可以逐步优化

2. **集成问题**：与现有系统集成可能遇到意外问题
   - **缓解措施**：逐步集成，每步测试验证

## 后续优化

- [ ] 添加更多动画效果
- [ ] 支持自定义动画速度
- [ ] 添加统计信息（平均剔除组数、保留率等）
- [ ] 支持批量剔除
- [ ] 支持号码池保存和加载
- [ ] 添加自动化测试（如果测试框架就绪）
- [ ] 性能优化（虚拟化长列表）

## 参考资料

- 现有组件：`src/components/lottery/NumberBall.tsx`
- 现有Hook：`src/hooks/useHistory.ts`
- 现有工具：`src/utils/soundManager.ts`
- 现有工具：`src/utils/randomStrategies.ts`
- 现有动画：`src/components/animation/DragonBallAnimation.tsx`
- 现有动画：`src/components/animation/CoinAnimation.tsx`

---

**计划创建时间**: 2026-02-07
**计划版本**: 1.0
**作者**: Sisyphus (AI Assistant)
