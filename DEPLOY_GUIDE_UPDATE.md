# 🚀 更新部署指南 - 添加智谱AI API配置

## 📋 新增内容说明

本更新在原有部署指南基础上，添加了以下AI相关配置：
1. **智谱AI API** - 用于财神推荐和每日运势
2. **极速数据API** - 用于彩票开奖查询

---

## 🔧 部署前准备 - 新增项

### 1. API密钥配置（必需）

#### 智谱AI API（新）
```bash
# 在项目根目录创建或编辑 .env 文件
cat > .env << EOF
# 极速数据API密钥（彩票开奖查询）
VITE_JISU_API_KEY=your_jisu_api_key_here

# 智谱AI API密钥（AI财神推荐和每日运势）
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here

# 注意：不要将.env文件提交到Git仓库
echo ".env" >> .gitignore
```

#### API密钥获取

##### 1. 获取极速数据API密钥
1. 访问 https://www.jisuapi.com/
2. 注册账号并登录
3. 进入API市场
4. 搜索"彩票开奖"或"caipiao"
5. 选择彩票开奖API
6. 申请API Key（免费额度：100次/天）
7. 复制API Key

##### 2. 获取智谱AI API密钥
1. 访问 https://open.bigmodel.cn/
2. 注册账号并登录
3. 进入用户中心 → API Keys
4. 创建新的API密钥
5. 选择模型：GLM-4-Flash（推荐，免费额度更高）
6. 复制API密钥

### 2. API密钥配置（在部署时配置）

#### Vercel环境变量配置
1. 进入Vercel Dashboard
2. 选择项目：`lottery-picker-pwa`
3. 点击 Settings → Environment Variables
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|---------|------|------|
| `VITE_JISU_API_KEY` | `your_jisu_api_key` | 极速数据API密钥 |
| `VITE_ZHIPU_API_KEY` | `your_zhipu_api_key` | 智谱AI API密钥 |

**重要提示**：
- ✅ 必须在部署前配置这两个环境变量
- ✅ API密钥不能有引号
- ✅ 不要在环境变量值中使用引号
- ✅ 生产环境变量不需要`VITE_`前缀（Vercel会自动处理）

---

## 🚀 部署步骤

### 方法1：使用Vercel CLI（推荐）

#### 1. 安装Vercel CLI
```bash
npm i -g vercel
vercel login
```

#### 2. 导入项目
```bash
cd /Users/neo/Documents/Project/makeNeoRich
vercel import
```

#### 3. 配置环境变量
系统会提示添加环境变量：
```
? What's your Vercel username or email? neo@example.com
? What's your Vercel token? (leave blank to skip)
? Link to existing project? [y/N] n
? What's your project's name? lottery-picker-pwa
? Which scope do you want to deploy? (Select scope)
```

#### 4. 环境变量配置
部署时会提示配置环境变量，添加：
```
VITE_JISU_API_KEY: your_jisu_api_key
VITE_ZHIPU_API_KEY: your_zhipu_api_key
```

#### 5. 部署到生产环境
```bash
vercel --prod
```

---

### 方法2：通过Vercel Dashboard

#### 1. 连接GitHub
1. 访问 https://vercel.com/
2. 点击"New Project"按钮
3. 选择"Import Git Repository"
4. 搜索并选择你的GitHub仓库
5. 点击"Import"

#### 2. 配置项目
**Framework Preset**: Vite
**Root Directory**: ./
**Build Command**: npm run build
**Output Directory**: dist
**Framework Directory**: ./

#### 3. 配置环境变量（重要！）
点击"Environment Variables"部分，添加以下变量：

**Environment Variables**:
```
VITE_JISU_API_KEY=your_jisu_api_key_here
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here
```

**注意**：
- 环境变量名不要使用引号
- API密钥直接粘贴值，不要有引号
- 生产环境变量不需要`VITE_`前缀

#### 4. 部署项目
点击"Deploy"按钮，等待部署完成

---

## 📋 部署后验证

### 1. 访问生产URL
部署完成后会显示生产URL，例如：
```
https://lottery-picker-pwa.vercel.app
```

### 2. 功能验证清单

#### 基础功能测试
- [ ] 页面正常加载，无控制台错误
- [ ] 可以正常选择号码
- [ ] 可以保存记录
- [ ] PWA可以安装
- [ ] 响应式布局正常

#### AI功能测试（新增）
- [ ] **财神推荐功能**
  - 点击财神按钮可以打开弹窗
  - 可以生成推荐号码
  - 推荐号码会自动填充到选号区
  
- [ ] **每日运势功能**
  - 首页显示今日运势卡片
  - 显示祝福语和幸运时间
  - 实时检测幸运时间状态
  
- [ ] **开奖查询功能**
  - 可以查询开奖结果
  - 开奖结果可以刮开查看
  - 中奖计算正确

#### API功能测试（新增）
- [ ] **极速数据API**
  - 可以查询彩票开奖结果
  - API调用正常，无错误
  - 响应数据格式正确
  
- [ ] **智谱AI API**
  - 可以生成财神推荐号码
  - 可以生成每日运势
  - AI调用正常，无错误
  - 响应数据格式正确

### 3. 环境变量验证
#### 检查环境变量是否生效
```bash
# 在生产环境中验证环境变量（通过Vercel Dashboard或部署日志）
# 检查以下命令的输出
console.log('Jisu Key:', import.meta.env.VITE_JISU_API_KEY);
console.log('Zhipu Key:', import.meta.env.VITE_ZHIPU_API_KEY);
```

#### 验证API可用性
```javascript
// 在浏览器控制台测试
// 测试极速数据API
fetch('https://api.jisuapi.com/caipiao/query?appkey=YOUR_JISU_KEY&caipiaoid=11')
  .then(res => res.json())
  .then(data => console.log('Jisu API:', data));

// 测试智谱AI API
fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${YOUR_ZHIPU_API_KEY}`
  },
  body: JSON.stringify({
    model: 'GLM-4-Flash',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的彩票推荐助手。'
      },
      {
        role: 'user',
        content: '彩票类型：双色球\n用户的星座：射手座\n用户的生日：12-10\n今天的日期：2026年1月17日 星期六\n\n请生成一组幸运号码，格式为：今晚的开奖号码为：X X X X X X - Y（不要有其他内容）'
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  })
}).then(res => res.json())
  .then(data => console.log('Zhipu AI:', data));
```

---

## 🔧 故障排查

### API相关错误

#### 1. 智谱AI API错误

##### 错误：401 Unauthorized
**原因**: API密钥无效或已过期
**解决**:
1. 检查环境变量配置是否正确
2. 在智谱AI平台重新生成API密钥
3. 更新Vercel环境变量
4. 重新部署应用

##### 错误：402 Payment Required
**原因**: API额度用尽
**解决**:
1. 检查智谱AI控制台的剩余额度
2. 充值或升级套餐
3. 优化API调用频率

##### 错误：429 Too Many Requests
**原因**: 请求频率超限
**解决**:
1. 添加调用频率限制
2. 使用缓存减少重复请求
3. 优化代码逻辑

#### 2. 极速数据API错误

##### 错误：104 API请求超过限制
**原因**: 超过每日免费额度（100次/天）
**解决**:
1. 检查极速数据控制台额度
2. 添加本地缓存减少API调用
3. 考虑升级付费套餐

##### 错误：206201 无数据
**原因**: 请求的彩票期号不存在
**解决**:
1. 检查彩票期号是否正确
2. 使用最新的期号
3. 或者不传期号，获取最新期

##### 错误：206202 参数错误
**原因**: 请求参数有误
**解决**:
1. 检查彩票ID是否正确（双色球11，大乐透14）
2. 检查参数格式是否正确

#### 3. Vercel部署问题

##### 错误：Build Failed
**原因**: 构建过程出错
**解决**:
1. 在本地先运行`npm run build`验证
2. 查看构建日志，修复错误
3. 确保所有依赖已安装

##### 错误：Environment Variable Not Found
**原因**: 环境变量未配置
**解决**:
1. 在Vercel Dashboard添加环境变量
2. 确保变量名和值正确
3. 重新部署应用

##### 错误：404 Not Found
**原因**: 路由未正确配置
**解决**:
1. 检查vite.config.ts中的base路径
2. 检查vercel.json中的路由配置
3. 检查构建输出目录是否正确

---

## 💰 使用建议

### 1. API额度管理

#### 智谱AI API（GLM-4-Flash）
- **免费额度**: 查看控制台
- **Token消耗**: 约100-200 tokens/次
- **优化建议**:
  - 缓存API结果
  - 合理使用AI功能
  - 避免频繁重复调用

#### 极速数据API
- **免费额度**: 100次/天
- **优化建议**:
  - 使用7天缓存策略
  - 避免重复查询相同期号
  - 记录本地已查询的期号

### 2. 安全注意事项

#### API密钥保护
1. **不要提交到Git**: 确保`.env`文件在`.gitignore`中
2. **使用环境变量**: 生产环境通过Vercel Dashboard配置
3. **定期轮换**: 建议每月更换一次API密钥
4. **最小权限**: 只授予必要的API权限

#### 开发与生产环境
- **开发环境**: 可以使用`.env`文件
- **生产环境**: 必须使用Vercel环境变量
- **测试密钥**: 使用测试密钥进行测试
- **生产密钥**: 使用生产密钥进行部署

### 3. 监控与日志

#### Vercel监控
- 访问Vercel Dashboard
- 查看应用日志
- 监控API调用频率
- 监控错误率

#### 自定义监控（可选）
```javascript
// 在应用中添加API调用日志
console.log('[API] Jisu API called:', {
  url: url,
  timestamp: new Date().toISOString(),
  status: 'started'
});

fetch(url, options)
  .then(res => {
    console.log('[API] Jisu API success:', {
      url: url,
      timestamp: new Date().toISOString(),
      status: 'success',
      status_code: res.status
    });
    return res.json();
  })
  .catch(error => {
    console.error('[API] Jisu API failed:', {
      url: url,
      timestamp: new Date().toISOString(),
      status: 'failed',
      error: error.message
    });
  });
```

---

## 📊 部署检查清单

### 准备阶段
- [ ] 检查Node.js版本 >= 18.x
- [ ] 检查npm版本 >= 9.x
- [ ] 获取极速数据API密钥
- [ ] 获取智谱AI API密钥
- [ ] 确保本地`npm run build`成功

### 配置阶段
- [ ] 在Vercel Dashboard添加`VITE_JISU_API_KEY`
- [ ] 在Vercel Dashboard添加`VITE_ZHIPU_API_KEY`
- [ ] 验证环境变量格式正确（无引号）
- [ ] 配置项目根目录、构建命令、输出目录

### 部署阶段
- [ ] 部署成功，获得生产URL
- [ ] 生产URL可访问
- - [ ] 无404错误
- - - [ ] 无控制台错误

### 验证阶段
- [ ] 页面正常加载
- [ ] 财神推荐功能正常
- [ ] 每日运势功能正常
- [ ] 开奖查询功能正常
- [ ] 极速数据API工作正常
- [ ] 智谱AI API工作正常
- [ ] 环境变量正确加载

### 功能测试
- [ ] 可以正常选号
- [ ] 可以保存记录
- [ ] 可以查询开奖
- [ ] 刮刮乐效果正常
- [ ] PWA可以安装
- [ ] 移动端适配正常

---

## 🚀 快速部署命令

### 一键部署（推荐）
```bash
# 进入项目目录
cd /Users/neo/Documents/Project/makeNeoRich

# 安装依赖并构建
npm install
npm run build

# 使用Vercel CLI部署
npx vercel --prod
```

### 手动部署（详细）
```bash
# 1. 登录Vercel
npx vercel login

# 2. 导入项目
npx vercel import

# 3. 配置环境变量（系统会提示）
# 在提示时添加：
VITE_JISU_API_KEY=your_jisu_api_key
VITE_ZHIPU_API_KEY=your_zhipu_api_key

# 4. 部署
npx vercel --prod
```

---

## 🎯 API使用总结

### 智谱AI API
| 项目 | 用途 | 模型 | Token消耗 |
|-----|------|------|-------------|
| 财神推荐 | 生成推荐号码 | GLM-4-Flash | ~100 tokens/次 |
| 每日运势 | 生成运势和幸运时间 | GLM-4-Flash | ~150 tokens/次 |

### 极速数据API
| 项目 | 用途 | 免费额度 | 配置变量 |
|-----|------|----------|------------|
| 彩票开奖 | 查询开奖结果 | 100次/天 | VITE_JISU_API_KEY |
| 历史开奖 | 查询历史开奖 | 同上 | 同上 |

---

## 📞 技术支持

### 官方文档
- **智谱AI**: https://open.bigmodel.cn/dev/api
- **极速数据**: https://www.jisuapi.com/api/caipiao/
- **Vercel**: https://vercel.com/docs

### 项目文档
- **README.md**: 项目说明
- **SETUP_GUIDE.md**: 安装指南
- **TEST_PLAN.md**: 测试计划

### 开发工具
- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

## 💡 最佳实践

### 1. API调用优化
```javascript
// 缓存API结果
const apiCache = new Map();
const CACHE_DURATION = 7 * 24 * 60 * 1000; // 7天

async function fetchWithCache(url, options) {
  const cached = apiCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  apiCache.set(url, {
    timestamp: Date.now(),
    data
  });
  
  return data;
}
```

### 2. 错误处理
```javascript
// 统一错误处理
async function callSafely(apiCall, fallbackValue) {
  try {
    return await apiCall();
  } catch (error) {
    console.error('[API Error]', error);
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    throw error;
  }
}

// 使用示例
const result = await callSafely(() => fetchFromAPI(), null);
if (result) {
  // 处理成功结果
} else {
  // 使用默认值
}
```

### 3. 用户体验优化
```javascript
// 加载状态
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// 优雅降级
const [data, setData] = useState(null);
const [fallbackMode, setFallbackMode] = useState(false);

// 智能重试
const [retryCount, setRetryCount] = useState(0);

async function fetchData() {
  setLoading(true);
  setError(null);
  
  try {
    const result = await callAPI();
    setData(result);
    setRetryCount(0);
  } catch (error) {
    if (retryCount < 3) {
      // 重试3次
      setRetryCount(prev => prev + 1);
      setTimeout(() => fetchData(), 1000 * (retryCount + 1));
    } else {
      setError(error.message);
      setFallbackMode(true);
      setData(fallbackValue);
    }
  } finally {
    setLoading(false);
  }
}
```

---

## 📋 部署后维护

### 1. 定期检查
- [ ] 每周检查应用访问日志
- [ ] 监控API调用次数
- [ ] 检查错误率趋势
- [ ] 检查API剩余额度

### 2. 更新计划
- [ ] 根据API使用情况调整额度分配
- [ ] 优化缓存策略
- [ ] 考虑升级API套餐
- [ ] 定期轮换API密钥

### 3. 性能监控
- [ ] 页面加载时间 < 3秒
- [ ] API响应时间 < 2秒
- [ ] Lighthouse分数 > 90
- [ ] 错误率 < 1%

### 4. 功能更新
- [ ] 根据用户反馈优化功能
- [ ] 添加更多AI功能
- [ ] 优化PWA体验
- [ ] 添加更多运势类型

---

## 🎉 部署完成后

### 1. 验证所有功能
- [ ] 财神推荐功能
- [ ] 每日运势功能
- [ ] 刮刮乐开奖效果
- [ ] 开奖查询功能
- [ ] 历史记录管理
- [ ] AI号码推荐
- [ ] 随机选号策略
- [ ] 幸运色主题
- [ ] PWA离线支持

### 2. 通知团队
- [ ] 部署成功通知
- [ ] 生产URL分享
- [ ] API密钥信息共享
- [ ] 监控和告警配置

### 3. 用户通知
- [ ] 发布更新通知
- [ ] 功能说明更新
- [ ] 使用指南更新
- [ ] 常见问题解答

---

**祝部署成功！🎉**

有任何问题，随时查看本文档或联系技术支持！
