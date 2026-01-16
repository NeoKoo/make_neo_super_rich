# 彩票选号助手 PWA

基于幸运色的双色球/大乐透选号工具，助您好运连连！🎯

## 功能特性

### 核心功能
- ✅ 根据星期几自动选择彩票类型（双色球/大乐透）
- ✅ 直观的球形按钮选号界面
- ✅ 球形按钮支持点击选择/取消
- ✅ 实时显示已选号码
- ✅ 选号数量限制验证
- ✅ 支持红球和蓝球独立选择

### 智能功能
- ✅ 一键随机选号，支持3种策略：
  - ⚖️ 平衡奇偶（红球奇偶比例接近3:3）
  - 📊 和值范围（红球和值在80-120之间）
  - 🎲 完全随机（不受任何限制）
- ✅ 选号策略提示（奇偶比例、和值范围）
- ✅ 冷热号码统计（基于历史记录）
- ✅ 号码复制到剪贴板

### 历史记录
- ✅ 保存选号记录到本地存储
- ✅ 按日期倒序排列
- ✅ 查询开奖结果（支持7天缓存）
- ✅ 中奖状态显示：
  - 命中的号码显示为金色
  - 未命中的号码显示为正常色
  - 显示命中数量和中奖等级
- ✅ 历史记录删除和清空

### 个性化功能
- ✅ 用户设置（出生日期、星座）
- ✅ 幸运色计算（3种方法综合）：
  - 星座幸运色
  - 五行命理
  - 数字命理学（生命路径数）
- ✅ 动态主题色（木质/紫色系为主）
- ✅ 主题色应用到球体按钮和界面

### PWA特性
- ✅ 完全离线可用
- ✅ 可安装到桌面/手机
- ✅ 推送通知支持
- ✅ 响应式设计（手机/平板/桌面）
- ✅ 深色主题

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **PWA插件**: vite-plugin-pwa 0.19.6
- **样式**: TailwindCSS 3.4
- **路由**: React Router DOM 6.22
- **存储**: localStorage（7天缓存策略）
- **API**: 极速数据开奖接口

## 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 配置API密钥

1. 访问 https://www.jisuapi.com/ 注册账号
2. 进入控制台 → 数据中心 → 我的API
3. 申请"彩票开奖"API
4. 复制API Key

在项目根目录创建`.env`文件：

\`\`\`env
VITE_JISU_API_KEY=your_api_key_here
\`\`\`

### 运行开发服务器

\`\`\`bash
npm run dev
\`\`\`

应用将在 http://localhost:3000 启动

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

生产文件将生成在`dist`目录

### 预览生产构建

\`\`\`bash
npm run preview
\`\`\`

## 🚀 快速部署到Vercel

### 方式1：网页版部署（最简单，无需命令行）⭐⭐⭐⭐

1. **创建GitHub仓库**（2分钟）
   - 访问 https://github.com/new
   - 仓库名：`lottery-picker-pwa`
   - 描述：`PWA彩票选号助手 - 基于幸运色的双色球/大乐透选号工具`
   - 选择"Public"
   - ⚠️ 不要勾选"Add a README file"等选项
   - 点击"Create repository"

2. **推送代码**（3分钟）
   ```bash
   # 添加GitHub远程仓库（替换为您的用户名）
   git remote add origin https://github.com/你的用户名/lottery-picker-pwa.git
   
   # 切换到main分支
   git branch -M main
   
   # 推送代码
   git push -u origin main
   ```
   - 如果提示输入GitHub用户名和密码
   - 或者使用Personal Access Token（推荐）

3. **Vercel部署**（5分钟）
   - 访问 https://vercel.com/
   - 使用GitHub账号登录
   - 点击"New Project"按钮
   - 选择"Import Git Repository"
   - 搜索并导入`lottery-picker-pwa`仓库
   - Vercel会自动检测配置：
     - Framework Preset: Vite
     - Root Directory: ./
     - Build Command: npm run build
     - Output Directory: dist
   - 点击"Deploy"按钮
   - 等待1-3分钟部署完成

4. **访问应用**（1分钟）
   - 部署成功后会显示URL
   - 示例：`https://lottery-picker-pwa.vercel.app`
   - 点击URL访问应用

**总耗时**: 约10-15分钟

### 方式2：GitHub Actions自动部署

1. **创建GitHub仓库**（同方式1第1步）

2. **创建Workflows**（3分钟）
   在GitHub仓库中创建`.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20.x'
         - name: Install dependencies
           run: npm ci
         - name: Build project
           run: npm run build
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v25
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: 'lottery-picker-pwa'
           env:
             VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
             VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
   ```

3. **配置Secrets**（2分钟）
   - GitHub仓库 → Settings → Secrets and variables
   - 添加Secret：
     - Name: `VERCEL_TOKEN`
     - Value: 从Vercel Dashboard获取（Settings → Tokens）
     - Name: `VERCEL_ORG_ID`
     - Value: 从Vercel Dashboard获取（Settings → Organizations）
   - 点击"Add secret"

4. **自动部署**
   - 以后每次推送到main分支，会自动触发部署

### 方式3：使用Vercel CLI（需要命令行）

1. **安装Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **登录**：
   ```bash
   vercel login
   ```

3. **导入项目**：
   ```bash
   vercel import https://github.com/你的用户名/lottery-picker-pwa.git
   ```

4. **配置部署**：
   - Vercel会自动检测项目配置
   - 确认参数后部署

---

## 📊 部署检查清单

### GitHub仓库
- [ ] 仓库地址：https://github.com/你的用户名/lottery-picker-pwa
- [ ] README文件正确显示
- [ ] 代码已推送到main分支

### Vercel部署
- [ ] 成功导入GitHub仓库
- [ ] Framework Preset: Vite
- [ ] Root Directory: ./
- [ ] Build Command: npm run build
- [ ] Output Directory: dist
- [ ] 生产URL: https://lottery-picker-pwa.vercel.app

### 功能验证
- [ ] 主页面加载正常
- [ ] 选号功能正常
- [ ] 随机选号功能正常
- [ ] 历史记录功能正常
- [ ] 设置页面正常
- [ ] PWA可安装
- [ ] 离线功能正常

---

## 📝 详细部署文档

查看完整的部署指南和故障排除：[DEPLOY_COMPLETE_GUIDE.md](./DEPLOY_COMPLETE_GUIDE.md)

## 项目结构

\`\`\`
makeNeoRich/
├── public/              # 静态资源
│   ├── manifest.json  # PWA清单
│   └── icons/       # 应用图标
├── src/
│   ├── components/   # React组件
│   ├── hooks/       # 自定义Hooks
│   ├── utils/       # 工具函数
│   ├── types/       # TypeScript类型
│   ├── constants/   # 常量配置
│   ├── config/      # 配置文件
│   └── pages/       # 页面组件
├── index.html       # HTML入口
├── package.json     # 依赖配置
├── vite.config.ts  # Vite配置
└── tsconfig.json   # TypeScript配置
\`\`\`

## 核心算法

### 幸运色计算

采用3种方法综合计算，取出现最多的颜色：

1. **星座幸运色**：根据出生日期计算星座，映射对应幸运色
2. **五行命理**：根据出生年月日计算天干地支，判断五行，映射幸运色
3. **数字命理学**：计算生命路径数和当日数字，综合得出幸运色

### 随机选号策略

1. **平衡奇偶**：红球奇偶比例3:3，蓝球随机
2. **和值范围**：红球和值在80-120之间
3. **完全随机**：所有号码完全随机生成

### 中奖计算

根据双色球和大乐透官方规则计算中奖等级。

## 浏览器支持

- Chrome >= 90
- Safari >= 15
- Firefox >= 88
- Edge >= 90

## 开发计划

### 已完成
- ✅ 项目初始化
- ✅ 核心类型定义
- ✅ 幸运色算法
- ✅ 随机选号策略
- ✅ localStorage存储管理
- ✅ 开奖数据API和缓存
- ✅ 核心Hooks开发
- ✅ UI组件开发
- ✅ 页面集成

### 待完成
- ⏳ PWA manifest配置
- ⏳ 图标生成
- ⏳ 功能测试
- ⏳ 部署到Vercel

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 免责声明

本应用仅供娱乐参考，不保证中奖，请理性购彩。

---

**祝您好运连连！🎯💰**
