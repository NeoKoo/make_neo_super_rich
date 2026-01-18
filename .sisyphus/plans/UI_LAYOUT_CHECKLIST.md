# UI布局检查清单

## 每次修改UI后必须执行的检查

### 1. 手机端检查 (375x812 或类似尺寸)

#### 底部区域检查
- [ ] TabBar是否完整显示，不被遮挡
- [ ] TabBar是否能正常点击（所有tab按钮）
- [ ] SelectedNumbers是否完整显示
- [ ] 已选号码区域是否能横向滚动
- [ ] 按钮区是否被挤压，能否点击
- [ ] 聚宝盆是否完整显示，不被遮挡
- [ ] 内容区域是否有足够的padding-bottom

#### 具体尺寸检查
- [ ] TabBar高度: ~60px (z-40)
- [ ] SelectedNumbers高度: ~100px (z-30)
- [ ] 聚宝盆高度: ~150px (-top-36)
- [ ] 内容区域padding-bottom: 240px (pb-60)
- [ ] 总计底部预留: ~390px

#### 滚动检查
- [ ] 内容区域是否能正常滚动
- [ ] 滚动到底部时，内容是否被遮挡
- [ ] 滚动时是否有卡顿或跳动

### 2. 桌面端检查 (1920x1080 或类似尺寸)

#### 底部区域检查
- [ ] TabBar是否完整显示
- [ ] SelectedNumbers是否完整显示
- [ ] 聚宝盆是否居中显示
- [ ] 内容区域是否有足够的padding-bottom

#### 布局检查
- [ ] 内容是否居中对齐
- [ ] 按钮区域是否合理分布
- [ ] 是否有过多的空白区域
- [ ] 在不同屏幕宽度下是否正常显示

### 3. 响应式检查

#### 断点检查
- [ ] 手机端 (max-width: 767px)
- [ ] 平板端 (768px - 1023px)
- [ ] 桌面端 (min-width: 1024px)

### 4. 固定元素z-index检查

| 元素 | z-index | 说明 |
|------|---------|------|
| TabBar | 40 | 最高，确保可点击 |
| SelectedNumbers | 30 | 次高 |
| 聚宝盆 | 10 | 在SelectedNumbers内部 |
| 动画层 | 90-100 | 最顶层 |

### 5. 布局计算公式

```
内容区域padding-bottom = 
  TabBar高度 (60px) + 
  SelectedNumbers高度 (100px) + 
  聚宝盆高度 (150px) + 
  安全余量 (80px) 
  = 390px

实际使用pb-60 (240px)是因为：
- 聚宝盆使用absolute定位在SelectedNumbers上方
- SelectedNumbers使用fixed定位
- 实际重叠部分可以共享空间
```

### 6. 当前布局配置

#### HomePage
```css
min-h-screen pb-20 (80px) - 外层容器
px-4 pt-4 pb-60 (240px) - 内容区域
```

#### SelectedNumbers
```css
fixed bottom-0 left-0 right-0 z-30
聚宝盆: absolute -top-36 (-144px) z-10
内容区: px-4 py-3 pt-36 (144px)
```

#### TabBar
```css
fixed bottom-0 left-0 right-0 z-40
height: 60px
```

#### HistoryPage & SettingsPage
```css
min-h-screen pb-20 (80px) - 外层容器
px-4 pt-4 pb-32 (128px) - 内容区域
```

### 7. 常见问题及解决方案

#### 问题1: TabBar无法点击
**原因**: SelectedNumbers的z-index过高或有毛玻璃效果遮挡
**解决**: 降低SelectedNumbers的z-index到30，TabBar保持40

#### 问题2: 内容被遮挡
**原因**: padding-bottom不足
**解决**: 增加padding-bottom，确保有足够空间

#### 问题3: 聚宝盆显示不完整
**原因**: 内容区域padding不足或聚宝盆top值过大
**解决**: 调整聚宝盆top值，增加内容区域padding

#### 问题4: 按钮被挤压
**原因**: flex布局没有设置flex-shrink
**解决**: 给按钮区域添加flex-shrink-0

### 8. 修改UI后的检查流程

1. ✅ 修改代码
2. ✅ 运行 `npm run build` 确保无错误
3. ✅ 启动开发服务器 `npm run dev`
4. ✅ 手机端检查（375x812）
5. ✅ 桌面端检查（1920x1080）
6. ✅ 不同屏幕宽度测试
7. ✅ 测试所有交互功能
8. ✅ 提交代码

### 9. 工具推荐

- Chrome DevTools设备模拟器
- 浏览器响应式设计模式
- 实际手机测试（iOS + Android）
- 浏览器开发者工具的Elements面板检查z-index

### 10. 修改记录

| 日期 | 修改内容 | 检查结果 | 备注 |
|------|---------|---------|------|
| 2026-01-18 | 添加聚宝盆和元宝动画 | 待检查 | 需要手机端和桌面端测试 |
