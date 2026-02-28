import { MissingValueData, MissingValueConfig, MissingValueAnalysis } from '../types/analysis';
import { DrawStatistics } from '../types/analysis';

/**
 * 遗漏值追踪器
 * 追踪每个号码的遗漏期数，预测回补概率
 */
export class MissingValueTracker {
  private config: MissingValueConfig;

  constructor(config: MissingValueConfig) {
    this.config = config;
  }

  /**
   * 计算理论遗漏周期
   * 公式：总号码数 / 每期开出数
   */
  private calculateTheoreticalCycle(): number {
    return this.config.totalNumbers / this.config.numbersPerDraw;
  }

  /**
   * 计算号码的遗漏值
   */
  private calculateMissingValue(
    number: number,
    drawData: DrawStatistics[],
    isRedBall: boolean
  ): MissingValueData {
    const theoreticalCycle = this.calculateTheoreticalCycle();
    const currentDrawNumber = parseInt(drawData[0]?.drawNumber || '0');

    // 找到该号码最后出现的期数
    let lastAppeared = 0;
    let maxMissing = 0;
    let totalMissing = 0;
    let missingCount = 0;

    for (let i = 0; i < drawData.length; i++) {
      const draw = drawData[i];
      const numbers = isRedBall ? draw.redBalls : draw.blueBalls;

      if (numbers.includes(number)) {
        const currentDraw = parseInt(draw.drawNumber);
        if (lastAppeared === 0) {
          // 第一次出现，计算从此处到现在的遗漏
          lastAppeared = currentDraw;
        } else {
          // 计算上一次出现到这次出现的遗漏
          const missing = parseInt(drawData[i - 1].drawNumber) - currentDraw;
          if (missing > 0) {
            totalMissing += missing;
            missingCount++;
            maxMissing = Math.max(maxMissing, missing);
          }
        }
      }
    }

    // 计算当前遗漏期数
    const currentMissing = lastAppeared > 0 ? currentDrawNumber - lastAppeared : drawData.length;

    // 计算平均遗漏周期
    const avgMissing = missingCount > 0 ? totalMissing / missingCount : theoreticalCycle;

    // 判断是否超冷号
    const isSuperCold = currentMissing > theoreticalCycle * this.config.superColdThreshold;

    // 计算回补概率 (0-100)
    // 基于当前遗漏与理论周期、历史最大遗漏的关系
    let replenishProbability = 0;
    if (isSuperCold) {
      // 超冷号，回补概率较高
      const ratio = currentMissing / (maxMissing || theoreticalCycle);
      replenishProbability = Math.min(95, 50 + ratio * 45);
    } else if (currentMissing > theoreticalCycle) {
      // 遗漏超过理论周期，回补概率增加
      const ratio = currentMissing / theoreticalCycle;
      replenishProbability = Math.min(80, 30 + ratio * 50);
    } else {
      // 正常范围，基于历史平均
      const ratio = currentMissing / avgMissing;
      replenishProbability = Math.min(60, 20 + ratio * 40);
    }

    return {
      number,
      missingPeriods: currentMissing,
      maxMissingPeriods: maxMissing || currentMissing,
      avgMissingPeriods: Math.round(avgMissing),
      theoreticalCycle: Math.round(theoreticalCycle * 10) / 10,
      replenishProbability: Math.round(replenishProbability),
      isSuperCold,
      lastAppeared,
    };
  }

  /**
   * 分析遗漏值
   */
  analyze(drawData: DrawStatistics[]): MissingValueAnalysis {
    const redBalls: MissingValueData[] = [];
    const blueBalls: MissingValueData[] = [];

    // 分析红球（假设1-33）
    for (let num = 1; num <= 33; num++) {
      redBalls.push(this.calculateMissingValue(num, drawData, true));
    }

    // 分析蓝球（假设1-16）
    for (let num = 1; num <= 16; num++) {
      blueBalls.push(this.calculateMissingValue(num, drawData, false));
    }

    // 提取超冷号
    const superColdRed = redBalls.filter((d) => d.isSuperCold).map((d) => d.number);
    const superColdBlue = blueBalls.filter((d) => d.isSuperCold).map((d) => d.number);

    // 提取高回补概率号码（按回补概率排序）
    const highReplenishRed = redBalls
      .sort((a, b) => b.replenishProbability - a.replenishProbability)
      .slice(0, 10)
      .map((d) => d.number);

    const highReplenishBlue = blueBalls
      .sort((a, b) => b.replenishProbability - a.replenishProbability)
      .slice(0, 5)
      .map((d) => d.number);

    return {
      red: redBalls,
      blue: blueBalls,
      superColdRed,
      superColdBlue,
      highReplenishRed,
      highReplenishBlue,
      analysisDate: Date.now(),
    };
  }

  /**
   * 获取遗漏值建议
   */
  getRecommendations(analysis: MissingValueAnalysis): {
    reason: string;
    numbers: number[];
  }[] {
    const recommendations: { reason: string; numbers: number[] }[] = [];

    // 推荐超冷号（高回补潜力）
    if (analysis.superColdRed.length > 0) {
      recommendations.push({
        reason: '超冷号回补推荐（遗漏超过理论周期2倍）',
        numbers: analysis.superColdRed.slice(0, 3),
      });
    }

    // 推荐高回补概率号码
    recommendations.push({
      reason: '高回补概率号码（综合分析推荐）',
      numbers: analysis.highReplenishRed.slice(0, 5),
    });

    // 推荐温号（遗漏接近理论周期）
    const warmRed = analysis.red
      .filter(
        (d) =>
          !d.isSuperCold &&
          d.missingPeriods >= d.theoreticalCycle * 0.8 &&
          d.missingPeriods <= d.theoreticalCycle * 1.2
      )
      .sort((a, b) => b.replenishProbability - a.replenishProbability)
      .slice(0, 3)
      .map((d) => d.number);

    if (warmRed.length > 0) {
      recommendations.push({
        reason: '温号推荐（遗漏接近理论周期）',
        numbers: warmRed,
      });
    }

    return recommendations;
  }
}

/**
 * 创建双色球遗漏值追踪器
 */
export function createSSQMissingValueTracker(): MissingValueTracker {
  return new MissingValueTracker({
    totalNumbers: 33,
    numbersPerDraw: 6,
    superColdThreshold: 2,
    analysisPeriods: 100,
  });
}

/**
 * 创建大乐透遗漏值追踪器
 */
export function createDLTMissingValueTracker(): MissingValueTracker {
  return new MissingValueTracker({
    totalNumbers: 35,
    numbersPerDraw: 5,
    superColdThreshold: 2,
    analysisPeriods: 100,
  });
}
