# Vercel部署指南 - PWA彩票选号助手

## 🚀 部署到Vercel（推荐方式）

Vercel提供免费的HTTPS托管、自动SSL、全球CDN，非常适合部署PWA应用。

---

## 方法1：通过Vercel CLI部署（推荐）

### 前置准备

1. **安装Vercel CLI**

```bash
npm i -g vercel
```

2. **登录Vercel**

```bash
vercel login
```

系统会提示：
- 选择登录方式（Email/GitHub）
- 如果选择GitHub，点击授权
- 等待授权完成

3. **检查Node.js版本**

```bash
node --version
```

确保版本 >= 18.x

### 部署步骤

1. **构建项目**

```bash
npm run build
```

验证生成`dist/`目录。

2. **开始部署**

```bash
vercel
```

系统会提示：

```
? Set up and deploy "/Users/neo/Documents/Project/makeNeoRich"? [Y/n] Y
? Which scope do you want to deploy to? Your username
? Link to existing project? [y/N] N
? What's your project's name? lottery-picker-pwa
? In which directory is your code located? ./
```

按提示选择：

- **Scope**: 选择您的账户
- **Project name**: 输入`lottery-picker-pwa`
- **Directory**: 保持默认（当前目录）

3. **等待部署完成**

Vercel会：
- 上传项目文件
- 构建项目（运行`npm run build`）
- 部署到CDN

完成后会显示：

```
✅ Production: https://lottery-picker-pwa.vercel.app [1m 23s]
```

4. **验证部署**

访问显示的URL，验证应用正常运行。

---

## 方法2：通过Vercel网站部署

### 前置准备

1. **创建GitHub仓库**

```bash
# 初始化Git（如果尚未初始化）
git init
git add .
git commit -m "Initial commit: PWA lottery picker"

# 推送到GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lottery-picker-pwa.git
git push -u origin main
```

2. **登录Vercel**

访问 https://vercel.com/login

使用GitHub账号登录（推荐）。

### 部署步骤

1. **导入项目**

- 登录后，点击"New Project"
- 选择"Import Git Repository"
- 选择刚创建的GitHub仓库

2. **配置项目**

```
Project Name: lottery-picker-pwa
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

3. **环境变量配置**

在"Environment Variables"部分添加：

```
VITE_JISU_API_KEY = your_api_key_here
```

**重要**：如果在生产环境使用API，必须配置此变量。

4. **部署**

点击"Deploy"按钮。

Vercel会自动：
- 拉取代码
- 安装依赖
- 构建项目
- 部署到CDN

---

## ⚙️ Vercel项目配置

### 修改配置（部署后）

1. **访问Vercel Dashboard**

登录 https://vercel.com/dashboard

2. **选择项目**

找到`lottery-picker-pwa`项目，点击进入。

3. **配置选项卡**

#### Build & Development Settings

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Build Output: Static
```

#### Environment Variables

```bash
VITE_JISU_API_KEY = your_api_key_here
```

**添加步骤**：
1. 点击"Environment Variables"
2. 输入`VITE_JISU_API_KEY`
3. 输入API Key值
4. 点击"Add"
5. 重新部署以应用环境变量

**重要提示**：
- 环境变量只在构建时可用
- 修改后必须重新部署才能生效

#### Domains

**默认域名**：
- Production: `https://lottery-picker-pwa.vercel.app`
- Preview: `https://lottery-picker-pwa-xxx.vercel.app`

**自定义域名**（可选）：
1. 点击"Domains"
2. 点击"Add Domain"
3. 输入自定义域名（如：`lottery.yourdomain.com`）
4. 按提示配置DNS记录

---

## 🔄 持续部署配置

### 自动部署（推荐）

#### GitHub集成

1. **在Vercel中启用GitHub集成**

- Dashboard → Settings → Git Integrations
- 点击"Edit" → GitHub
- 选择要部署的仓库

2. **配置自动部署**

```
Branch: main
Root Directory: ./
Build Command: npm run build
Output Directory: dist
```

3. **效果**

每次推送到`main`分支，Vercel会自动：
- 检测到代码变更
- 触发构建
- 部署新版本

### Git Hooks配置（可选）

在项目中添加`.vercelignore`文件：

```gitignore
.env.local
.env.*.local
*.log
.DS_Store
.vscode/
.idea/
```

---

## 📊 监控和分析

### Vercel Analytics

1. **访问Analytics**

- Dashboard → 项目 → Analytics

2. **查看指标**

- **访问量**: 页面访问次数
- **带宽**: 数据传输量
- **性能**: 页面加载时间
- **地理分布**: 用户所在地区
- **设备分布**: 桌面/移动端比例

### 自定义域名HTTPS

如果使用自定义域名：

1. Vercel自动提供Let's Encrypt SSL证书
2. 证书自动续期
3. 无需额外配置

---

## 🐛 常见问题

### Q1: 部署失败怎么办？

**A**: 检查以下几点：

1. **Node.js版本**
   ```bash
   node --version
   ```
   确保版本 >= 18.x

2. **构建错误**
   - 本地运行`npm run build`
   - 检查是否有TypeScript错误
   - 检查依赖是否正确安装

3. **环境变量缺失**
   - 确保`.env.example`中的变量都已配置
   - 重新部署以应用环境变量

### Q2: PWA功能不工作？

**A**: 检查以下几点：

1. **HTTPS必须**
   - Vercel自动提供HTTPS
   - 确保访问的是`https://`而不是`http://`

2. **Manifest路径**
   - 确保manifest.json在public目录
   - 确保路径为`/manifest.json`

3. **Service Worker**
   - 打开浏览器开发者工具
   - Application → Service Workers
   - 检查Service Worker是否注册成功
   - 检查是否有错误

### Q3: API请求失败？

**A**: 检查以下几点：

1. **环境变量配置**
   - Dashboard → Environment Variables
   - 确保`VITE_JISU_API_KEY`已添加
   - 重新部署以应用

2. **API额度**
   - 访问极速数据控制台
   - 检查剩余额度

3. **CORS问题**
   - Vercel的API请求应该支持CORS
   - 如果仍有问题，检查网络请求

### Q4: 如何回滚到上一个版本？

**A**: 使用Git回滚

```bash
# 查看部署历史
vercel ls

# 回滚到指定版本
vercel rollback https://lottery-picker-pwa.vercel.app
```

或通过Vercel Dashboard：
1. Dashboard → 项目 → Deployments
2. 找到要回滚的版本
3. 点击"Rollback to this deployment"

### Q5: 如何配置预览环境？

**A**: Vercel自动为每个Git分支创建预览URL

```
格式: https://lottery-picker-pwa-branch-name-xxx.vercel.app
```

或创建单独的预览环境：

1. Dashboard → Project → Settings
2. Environment → Add Environment
3. Name: `preview`
4. Branch: `develop`
5. Save

---

## 🔧 性能优化配置

### Vercel Edge Functions（可选）

如果需要API代理，可以创建Edge Functions：

```javascript
// api/proxy.js
export default async function handler(req, res) {
  // API代理逻辑
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ data: 'from edge function' });
}
```

### 缓存策略

在`vercel.json`中配置缓存：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📱 移动端优化

### iOS PWA安装

添加以下meta标签到`index.html`（已配置）：

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="选号助手" />
```

### Android PWA安装

确保`manifest.json`包含（已配置）：

```json
{
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#8E44AD",
  "background_color": "#1a1a2e"
}
```

---

## 📞 技术支持

### Vercel文档

- **官方文档**: https://vercel.com/docs
- **PWA指南**: https://vercel.com/guides/progressive-web-apps-with-next
- **部署指南**: https://vercel.com/docs/deployments/overview

### 项目文档

- **README.md**: 项目说明
- **SETUP_GUIDE.md**: 安装指南
- **TEST_PLAN.md**: 测试计划

---

## ✅ 部署验收清单

部署完成后，验证以下项目：

- [ ] 生产URL可正常访问
- [ ] HTTPS证书正常（无安全警告）
- [ ] PWA可以安装到桌面
- [ ] PWA可以添加到主屏幕（移动端）
- [ ] 离线功能正常工作
- [ ] API请求成功（如配置）
- [ ] Service Worker注册成功
- [ ] Lighthouse分数 > 90
- [ ] 移动端显示正常
- [ ] 环境变量正确加载
- [ ] 历史记录功能正常
- [ ] 所有核心功能可用

---

## 🎯 总结

### 推荐部署流程

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 构建项目（可选）
npm run build

# 4. 部署
vercel

# 5. 配置环境变量（如需要）
# 在Vercel Dashboard中配置

# 6. 验证部署
# 访问提供的URL测试应用
```

### 部署URL

- **生产环境**: https://lottery-picker-pwa.vercel.app
- **预览环境**: https://lottery-picker-pwa-preview.vercel.app

### 环境变量

```bash
VITE_JISU_API_KEY = your_api_key_here
```

---

**部署完成后，访问应用URL即可使用PWA彩票选号助手！** 🎯💰

**祝您好运连连！**
