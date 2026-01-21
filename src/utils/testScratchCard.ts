import { useHistory } from '../hooks/useHistory';

/**
 * 创建测试历史记录，用于测试刮刮乐效果
 */
export function createTestScratchRecord() {
  const testRecord = {
    id: 'test-scratch-' + Date.now(),
    lotteryType: '双色球' as const,
    lotteryId: '20240121',
    numbers: {
      redBalls: [3, 7, 12, 18, 25, 31],
      blueBalls: [8]
    },
    timestamp: Date.now(),
    strategyType: 'manual' as const,
    drawNumbers: {
      redBalls: [5, 15, 22, 28, 33],
      blueBalls: [12]
    },
    matchCount: {
      red: 2,
      blue: 1
    },
    prize: '三等奖',
    won: true
  };

  // 保存测试记录到本地存储
  const existingHistory = JSON.parse(localStorage.getItem('lottery_history') || '[]');
  existingHistory.push(testRecord);
  localStorage.setItem('lottery_history', JSON.stringify(existingHistory));
  
  return testRecord;
}

/**
 * 清除测试记录
 */
export function clearTestScratchRecords() {
  const existingHistory = JSON.parse(localStorage.getItem('lottery_history') || '[]');
  const filteredHistory = existingHistory.filter((record: HistoryRecord) => !record.id.startsWith('test-scratch-'));
  localStorage.setItem('lottery_history', JSON.stringify(filteredHistory));
  console.log('测试刮刮乐记录已清除');
}

/**
 * 在控制台输出测试说明
 */
export function showScratchTestInstructions() {
  console.log(`
🎫 刮刮乐效果测试说明：

1. 创建测试记录：
   在浏览器控制台运行：createTestScratchRecord()
   这会创建一个有开奖结果的测试记录

2. 测试刮刮乐：
   - 进入历史记录页面
   - 找到以"test-scratch-"开头的记录
   - 点击"检查开奖"按钮
   - 刮开银色覆盖层查看开奖结果

3. 清除测试记录：
   在控制台运行：clearTestScratchRecords()
   这会清除所有测试记录

4. 功能特点：
   ✅ 银色渐变覆盖层
   ✅ 随机噪点纹理
   ✅ 鼠标和触摸支持
   ✅ 刮开50%自动显示全部
   ✅ 刮开完成动画提示

现在您可以打开浏览器控制台，输入 createTestScratchRecord() 来创建测试记录！
  `);
}