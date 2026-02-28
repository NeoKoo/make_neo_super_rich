# API Documentation

本页面详细说明了 makeNeoRich 彩票选号助手使用的所有外部 API。

## 目录

- [极速数据 API](#极速数据-api)
- [智谱 AI API](#智谱-ai-api)
- [千问大模型 API](#千问大模型-api)
- [API 密钥配置](#api-密钥配置)
- [错误处理](#错误处理)
- [速率限制](#速率限制)

---

## 极速数据 API

### 用途
获取最新的彩票开奖结果，用于历史记录的中奖验证。

### API 详情
- **提供商**: 极速数据 (https://www.jisuapi.com/)
- **API名称**: 彩票开奖
- **文档地址**: https://www.jisuapi.com/api/caipiao/

### 支持的彩票类型
- 双色球 (ssq)
- 大乐透 (dlt)

### API 配置

在 `.env` 文件中配置：
```env
VITE_JISU_API_KEY=your_api_key_here
```

### API 端点

```
GET https://api.jisuapi.com/caipiao/query
```

### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| lotteryid | string | 是 | 彩票类型：ssq(双色球), dlt(大乐透) |
| issueno | string | 否 | 期号，不传则返回最新期 |
| appkey | string | 是 | API密钥 |

### 响应示例

```json
{
  "status": "0",
  "msg": "ok",
  "result": {
    "lotteryid": "ssq",
    "issueno": "2024001",
    "number": "01,05,12,18,25,29,07",
    "opencode": "01,05,12,18,25,29",
    "specialcode": "07",
    "opentime": "2024-01-01 21:15:00",
    "deadline": "2024-01-01 20:00:00",
    "saleamount": "350000000",
    "poolmoney": "800000000",
    "detail": [
      {
        "prize": "一等奖",
        "num": "5",
        "money": "5000000"
      }
    ]
  }
}
```

### 缓存策略

- **缓存时长**: 7天
- **存储位置**: localStorage
- **缓存键**: `lottery_draw_{lotteryType}_{issueNumber}`
- **目的**: 减少 API 调用，提高响应速度

### 使用场景

1. **历史记录查询**: 用户查看历史选号记录时，自动查询对应期号的开奖结果
2. **中奖验证**: 比对用户选号与开奖号码，计算中奖等级
3. **数据展示**: 显示开奖时间、奖金池等信息

---

## 智谱 AI API

### 用途
提供财神AI智能推荐功能，基于多维分析推荐彩票号码。

### API 详情
- **提供商**: 智谱AI (https://open.bigmodel.cn/)
- **模型**: GLM-4
- **文档地址**: https://open.bigmodel.cn/dev/api

### API 配置

在 `.env` 文件中配置：
```env
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here
```

### 功能特性

1. **多组号码推荐**: 一次生成5组推荐号码
2. **详细理由说明**: 每个号码都有详细的推荐理由
3. **运势分析**: 综合运势等级评估
4. **置信度评分**: 每个号码的置信度 (0-100)
5. **个性化分析**: 基于用户生日、星座、五行等因素

### 分析维度

- **玄学因素**: 五行生克、天干地支、生肖运势
- **命理分析**: 星座特质、生命路径数、命理五行
- **数字规律**: 号码频率、和值分析、奇偶平衡
- **时机判断**: 日期能量、时辰吉凶、节气影响

### API 调用示例

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_ZHIPU_API_KEY}`
  },
  body: JSON.stringify({
    model: 'glm-4',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    stream: false,
    temperature: 0.7
  })
});
```

### 响应数据结构

```typescript
interface EnhancedLotteryRecommendation {
  // 5组号码推荐
  recommendations: NumberSetRecommendation[];

  // 整体分析
  overallAnalysis: {
    summary: string;           // 整体分析摘要
    fortuneLevel: string;      // 运势等级
    bestSet: number;           // 最佳推荐组编号
    keyFactors: string[];      // 关键影响因素
    advice: string;            // 购彩建议
    bestTiming: string;        // 最佳购彩时机
  };

  // 玄学洞察
  metaphysicsInsight: {
    zodiacInfluence: string;   // 星座影响分析
    wuxingBalance: string;     // 五行平衡分析
    numerologyPattern: string; // 数字命理模式
    energyLevel: number;       // 当日能量指数 (0-100)
  };
}
```

### 使用场景

1. **财神AI推荐**: 用户点击"财神AI推荐"按钮
2. **个性化建议**: 根据用户设置提供定制化推荐
3. **详细分析**: 展示每个号码的推荐理由和置信度

---

## 千问大模型 API

### 用途
提供每日运势分析和玄学命理解读功能。

### API 详情
- **提供商**: 阿里云千问 (https://dashscope.aliyun.com/)
- **模型**: qwen-turbo
- **文档地址**: https://help.aliyun.com/zh/dashscope/

### API 配置

在 `.env` 文件中配置：
```env
VITE_QWEN_API_KEY=your_qwen_api_key_here
```

### 功能特性

1. **每日运势**: 基于生日和日期分析当日运势
2. **玄学解读**: 五行、星座、天干地支等命理解读
3. **幸运建议**: 幸运数字、幸运颜色、幸运方位等
4. **购彩时机**: 判断当日是否适合购彩

### API 调用示例

```typescript
const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_QWEN_API_KEY}`
  },
  body: JSON.stringify({
    model: 'qwen-turbo',
    input: {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }
  })
});
```

### 响应数据结构

```typescript
interface DailyFortune {
  date: string;              // 日期
  fortuneLevel: string;      // 运势等级
  overallScore: number;      // 综合评分 (0-100)
  luckyNumbers: number[];    // 幸运数字
  luckyColor: string;        // 幸运颜色
  luckyDirection: string;    // 幸运方位
  analysis: {
    career: string;          // 事业运势
    wealth: string;          // 财运
    health: string;          // 健康
    love: string;            // 爱情
  };
  metaphysics: {
    wuxing: string;          // 五行分析
    zodiac: string;          // 星座分析
    tiyongRelation: string;  // 体用关系
  };
  advice: string;            // 综合建议
}
```

### 使用场景

1. **每日运势卡片**: 显示用户当日运势
2. **玄学分析**: 提供专业的命理解读
3. **购彩建议**: 基于运势给出购彩建议

---

## API 密钥配置

### 获取 API 密钥

#### 1. 极速数据 API
1. 访问 https://www.jisuapi.com/
2. 注册账号并登录
3. 进入控制台 → 数据中心 → 我的API
4. 申请"彩票开奖"API
5. 复制 API Key

#### 2. 智谱 AI API
1. 访问 https://open.bigmodel.cn/
2. 注册账号并登录
3. 进入控制台 → API Keys
4. 创建新的 API Key
5. 复制 API Key

#### 3. 千问大模型 API
1. 访问 https://dashscope.aliyun.com/
2. 注册账号并登录
3. 进入控制台 → API-KEY管理
4. 创建新的 API Key
5. 复制 API Key

### 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# 极速数据API密钥（必需 - 用于开奖数据查询）
VITE_JISU_API_KEY=your_api_key_here

# 智谱AI API密钥（可选 - 用于财神AI推荐）
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here

# 千问大模型API密钥（可选 - 用于运势分析）
VITE_QWEN_API_KEY=your_qwen_api_key_here
```

### 注意事项

⚠️ **安全提示**:
- 不要将 `.env` 文件提交到 Git 仓库
- 使用 `.env.example` 作为模板
- 在 Vercel 等平台部署时，在环境变量中配置

⚠️ **功能依赖**:
- `VITE_JISU_API_KEY`: 必需，否则无法查询开奖结果
- `VITE_ZHIPU_API_KEY`: 可选，无密钥时财神AI功能不可用
- `VITE_QWEN_API_KEY`: 可选，无密钥时运势分析功能不可用

---

## 错误处理

### 极速数据 API 错误

| 错误代码 | 说明 | 处理方式 |
|---------|------|----------|
| 1001 | API密钥错误 | 检查 `.env` 配置 |
| 1002 | API密钥过期 | 重新申请密钥 |
| 1003 | 超出调用次数 | 等待配额重置或升级套餐 |
| 1004 | 参数错误 | 检查请求参数 |
| 1005 | 彩票类型不支持 | 检查彩票类型参数 |

### 智谱 AI API 错误

| 错误代码 | 说明 | 处理方式 |
|---------|------|----------|
| 401 | 认证失败 | 检查 API Key |
| 429 | 请求过多 | 等待后重试 |
| 500 | 服务器错误 | 联系技术支持 |
| timeout | 请求超时 | 检查网络连接 |

### 千问大模型 API 错误

| 错误代码 | 说明 | 处理方式 |
|---------|------|----------|
| InvalidApiKey | API密钥无效 | 检查 API Key |
| QuotaExceeded | 配额用尽 | 等待重置或升级 |
| InvalidParameter | 参数错误 | 检查请求参数 |
| ServiceUnavailable | 服务不可用 | 稍后重试 |

### 错误处理策略

```typescript
// 统一错误处理
try {
  const result = await callAPI();
  return { success: true, data: result };
} catch (error) {
  console.error('API调用失败:', error);
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      userFriendlyMessage: getUserFriendlyMessage(error)
    }
  };
}

// 用户友好的错误提示
function getUserFriendlyMessage(error: any): string {
  const errorMessages = {
    '1001': 'API密钥未配置，请联系管理员',
    '1003': 'API调用次数已达上限，请稍后再试',
    '401': 'API认证失败，请检查密钥配置',
    '429': '请求过于频繁，请稍后再试',
    'timeout': '网络连接超时，请检查网络'
  };

  return errorMessages[error.code] || '服务暂时不可用，请稍后再试';
}
```

---

## 速率限制

### 极速数据 API

- **免费套餐**: 100次/天
- **付费套餐**: 根据订阅级别不同
- **超限处理**: 显示友好提示，建议升级套餐

### 智谱 AI API

- **免费套餐**: 每月一定额度
- **付费套餐**: 按调用量计费
- **超限处理**: 降级到随机推荐功能

### 千问大模型 API

- **免费套餐**: 每月一定额度
- **付费套餐**: 按调用量计费
- **超限处理**: 降级到基础运势分析

### 缓存策略

为减少 API 调用，应用采用多层缓存策略：

1. **开奖数据缓存**: 7天
2. **AI推荐缓存**: 1天
3. **运势分析缓存**: 1天
4. **localStorage存储**: 本地持久化

---

## 最佳实践

### 1. API 调用优化

```typescript
// 使用 API 队列管理器
import { apiQueue } from './utils/apiQueue';

// 将请求加入队列，自动控制速率
const result = await apiQueue.add(() => fetchLotteryResult());
```

### 2. 错误重试

```typescript
// 自动重试机制
async function fetchWithRetry(
  apiFunc: () => Promise<any>,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiFunc();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * (i + 1)); // 指数退避
    }
  }
}
```

### 3. 降级策略

```typescript
// 当 API 不可用时使用降级方案
async function getAIRecommendation() {
  try {
    return await callZhipuAI();
  } catch (error) {
    console.warn('AI推荐失败，使用随机推荐');
    return generateRandomRecommendation();
  }
}
```

### 4. 监控和日志

```typescript
// 记录 API 调用日志
function logAPICall(apiName: string, success: boolean, duration: number) {
  console.log(`[API] ${apiName} - ${success ? '成功' : '失败'} - ${duration}ms`);
}
```

---

## 相关文档

- [API 使用指南](./GUIDES/ai-recommendations.md)
- [功能指南](./GUIDES/)
- [部署指南](../DEPLOY_COMPLETE_GUIDE.md)
- [环境变量配置](../SETUP_GUIDE.md)

---

## 技术支持

如有 API 相关问题，请参考：
- 极速数据客服：https://www.jisuapi.com/
- 智谱AI文档：https://open.bigmodel.cn/dev/api
- 千问文档：https://help.aliyun.com/zh/dashscope/
