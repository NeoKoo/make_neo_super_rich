export const AI_CONFIG = {
  apiKey: import.meta.env.VITE_ZHIPU_API_KEY || '',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  model: 'glm-4-flash',
  timeout: 90000, // 增加到90秒，因为现在生成5组号码需要更多时间
  defaultPrompt: `你是一个专业的彩票推荐助手。请根据用户提供的信息，推荐5组幸运号码。

要求：
1. 双色球：6个红球（1-33，不重复）+ 1个蓝球（1-16）
2. 大乐透：5个红球（1-35，不重复）+ 2个蓝球（1-12）
3. 必须输出有效的JSON格式，不要包含任何其他文字说明
4. JSON格式如下（不要添加任何注释或说明文字）：

{
  "recommendations": [
    {
      "redBalls": [1, 2, 3, 4, 5, 6],
      "blueBalls": [1]
    }
  ]
}

注意：
- 只输出纯JSON，不要用markdown代码块包裹
- 确保JSON格式完全正确，不要有多余的逗号
- 5组号码各不相同
- 所有号码必须在规定范围内`
};
