import { LotteryType } from '../types/lottery';
import { HistoryRecord } from '../types/history';
import { 
  NumberFrequency, 
  HotColdAnalysis, 
  PersonalAnalysis, 
  PersonalSelectionPattern,
  DrawStatistics,
  AnalysisData 
} from '../types/analysis';

// 分析最近多少期的数据
const ANALYSIS_PERIODS = 100;

// 热号、温号、冷号的阈值
const HOT_THRESHOLD = 0.15;  // 出现频率 > 15%
const COLD_THRESHOLD = 0.05; // 出现频率 < 5%

export class AnalysisService {
  /**
   * 分析号码冷热程度
   */
  static analyzeHotColdNumbers(
    drawHistory: HistoryRecord[], 
    lotteryType: LotteryType
  ): { red: HotColdAnalysis; blue: HotColdAnalysis } {
    // 过滤有开奖结果的记录
    const drawsWithResults = drawHistory.filter(record => record.drawNumbers);
    
    // 获取最近指定期数的数据
    const recentDraws = drawsWithResults.slice(-ANALYSIS_PERIODS);
    
    // 分析红球
    const redAnalysis = this.analyzeNumberFrequencies(
      recentDraws,
      'red',
      lotteryType === '双色球' ? 33 : 35
    );
    
    // 分析蓝球
    const blueAnalysis = this.analyzeNumberFrequencies(
      recentDraws,
      'blue',
      lotteryType === '双色球' ? 16 : 12
    );
    
    return {
      red: this.categorizeNumbers(redAnalysis),
      blue: this.categorizeNumbers(blueAnalysis)
    };
  }

  /**
   * 分析个人选号模式
   */
  static analyzePersonalSelections(history: HistoryRecord[]): PersonalAnalysis {
    const totalSelections = history.length;
    const winningSelections = history.filter(record => record.won);
    const winningCount = winningSelections.length;
    const winningRate = totalSelections > 0 ? winningCount / totalSelections : 0;
    
    // 分析选号模式
    const selectionPattern = this.analyzeSelectionPattern(history);
    
    // 找出最佳策略
    const strategyStats = this.calculateStrategyStats(history);
    const bestStrategy = Object.entries(strategyStats)
      .sort(([,a], [,b]) => b.winRate - a.winRate)[0]?.[0] || 'manual';
    
    // 获取最近的选择记录
    const recentSelections = history.slice(-10).map(record => ({
      timestamp: record.timestamp,
      numbers: record.numbers,
      strategyType: record.strategyType,
      won: record.won || false,
      prizeLevel: record.prizeLevel
    }));
    
    return {
      totalSelections,
      winningCount,
      winningRate,
      bestStrategy,
      selectionPattern,
      recentSelections
    };
  }

  /**
   * 生成开奖统计数据
   */
  static generateDrawStatistics(drawHistory: HistoryRecord[]): DrawStatistics[] {
    return drawHistory
      .filter(record => record.drawNumbers)
      .map(record => {
        const redBalls = record.drawNumbers!.redBalls;
        const blueBalls = record.drawNumbers!.blueBalls;
        
        return {
          drawNumber: record.lotteryId,
          redBalls,
          blueBalls,
          sum: redBalls.reduce((a, b) => a + b, 0) + blueBalls.reduce((a, b) => a + b, 0),
          oddCount: [...redBalls, ...blueBalls].filter(n => n % 2 === 1).length,
          evenCount: [...redBalls, ...blueBalls].filter(n => n % 2 === 0).length,
          consecutiveCount: this.countConsecutiveNumbers([...redBalls, ...blueBalls]),
          span: Math.max(...redBalls, ...blueBalls) - Math.min(...redBalls, ...blueBalls)
        };
      });
  }

  /**
   * 分析号码频率
   */
  private static analyzeNumberFrequencies(
    draws: HistoryRecord[],
    ballType: 'red' | 'blue',
    maxNumber: number
  ): NumberFrequency[] {
    const frequencies: NumberFrequency[] = [];
    
    for (let i = 1; i <= maxNumber; i++) {
      const count = draws.filter(draw => {
        const numbers = ballType === 'red' 
          ? draw.drawNumbers?.redBalls 
          : draw.drawNumbers?.blueBalls;
        return numbers?.includes(i);
      }).length;
      
      const frequency = draws.length > 0 ? count / draws.length : 0;
      
      // 计算最后出现位置和遗漏期数
      let lastAppeared = -1;
      let missingPeriods = draws.length;
      
      for (let j = draws.length - 1; j >= 0; j--) {
        const numbers = ballType === 'red' 
          ? draws[j].drawNumbers?.redBalls 
          : draws[j].drawNumbers?.blueBalls;
        
        if (numbers?.includes(i)) {
          lastAppeared = draws.length - j;
          missingPeriods = j;
          break;
        }
      }
      
      frequencies.push({
        number: i,
        count,
        frequency,
        lastAppeared,
        missingPeriods
      });
    }
    
    return frequencies.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * 将号码分类为热号、温号、冷号
   */
  private static categorizeNumbers(frequencies: NumberFrequency[]): HotColdAnalysis {
    const hotNumbers = frequencies.filter(f => f.frequency > HOT_THRESHOLD);
    const coldNumbers = frequencies.filter(f => f.frequency < COLD_THRESHOLD);
    const warmNumbers = frequencies.filter(f => 
      f.frequency >= COLD_THRESHOLD && f.frequency <= HOT_THRESHOLD
    );
    
    return {
      hotNumbers,
      warmNumbers,
      coldNumbers
    };
  }

  /**
   * 分析选号模式
   */
  private static analyzeSelectionPattern(history: HistoryRecord[]): PersonalSelectionPattern {
    const allRedBalls = history.flatMap(h => h.numbers.redBalls);
    const allBlueBalls = history.flatMap(h => h.numbers.blueBalls);
    
    // 计算奇偶比例
    const oddCount = [...allRedBalls, ...allBlueBalls].filter(n => n % 2 === 1).length;
    const totalCount = allRedBalls.length + allBlueBalls.length;
    const oddEvenRatio = totalCount > 0 ? oddCount / totalCount : 0.5;
    
    // 计算和值范围
    const sums = history.map(h => 
      h.numbers.redBalls.reduce((a, b) => a + b, 0) + 
      h.numbers.blueBalls.reduce((a, b) => a + b, 0)
    );
    const sumRange: [number, number] = [
      Math.min(...sums),
      Math.max(...sums)
    ];
    
    // 检查是否喜欢连号
    const withConsecutive = history.filter(h => 
      this.hasConsecutiveNumbers([...h.numbers.redBalls, ...h.numbers.blueBalls])
    ).length;
    const consecutiveNumbers = history.length > 0 ? withConsecutive / history.length > 0.3 : false;
    
    // 统计常选号码
    const numberFrequency = new Map<number, number>();
    [...allRedBalls, ...allBlueBalls].forEach(num => {
      numberFrequency.set(num, (numberFrequency.get(num) || 0) + 1);
    });
    
    const favoriteNumbers = Array.from(numberFrequency.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([num]) => num);
    
    // 找出避免的号码（从未选过的号码）
    const allPossibleNumbers = Array.from({ length: 35 }, (_, i) => i + 1); // 假设最大35
    const selectedNumbers = new Set([...allRedBalls, ...allBlueBalls]);
    const avoidNumbers = allPossibleNumbers.filter(num => !selectedNumbers.has(num));
    
    return {
      oddEvenRatio,
      sumRange,
      consecutiveNumbers,
      favoriteNumbers,
      avoidNumbers
    };
  }

  /**
   * 计算策略统计
   */
  private static calculateStrategyStats(history: HistoryRecord[]): Record<string, { winRate: number; count: number }> {
    const stats: Record<string, { wins: number; count: number }> = {};
    
    history.forEach(record => {
      const strategy = record.strategyType || 'manual';
      if (!stats[strategy]) {
        stats[strategy] = { wins: 0, count: 0 };
      }
      stats[strategy].count++;
      if (record.won) {
        stats[strategy].wins++;
      }
    });
    
    // 转换为胜率
    const result: Record<string, { winRate: number; count: number }> = {};
    Object.entries(stats).forEach(([strategy, { wins, count }]) => {
      result[strategy] = {
        winRate: count > 0 ? wins / count : 0,
        count
      };
    });
    
    return result;
  }

  /**
   * 检查是否有连号
   */
  private static hasConsecutiveNumbers(numbers: number[]): boolean {
    const sorted = [...numbers].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) {
        return true;
      }
    }
    return false;
  }

  /**
   * 计算连号数量
   */
  private static countConsecutiveNumbers(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    let count = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) {
        count++;
      }
    }
    return count;
  }

  /**
   * 生成完整的分析数据
   */
  static generateCompleteAnalysis(
    history: HistoryRecord[],
    lotteryType: LotteryType
  ): AnalysisData {
    const hotColdAnalysis = this.analyzeHotColdNumbers(history, lotteryType);
    const personalAnalysis = this.analyzePersonalSelections(history);
    const drawStatistics = this.generateDrawStatistics(history);
    
    // 生成趋势数据
    const trendData = drawStatistics.slice(-30).map(stat => ({
      period: stat.drawNumber,
      redSum: stat.redBalls.reduce((a, b) => a + b, 0),
      blueSum: stat.blueBalls.reduce((a, b) => a + b, 0),
      oddRatio: stat.oddCount / (stat.oddCount + stat.evenCount)
    }));
    
    return {
      hotColdAnalysis,
      drawStatistics,
      personalAnalysis,
      trendData
    };
  }
}