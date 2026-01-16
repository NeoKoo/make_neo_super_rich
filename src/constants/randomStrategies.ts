export enum RandomStrategy {
  BALANCED_ODD_EVEN = 'balanced_odd_even',
  SUM_RANGE = 'sum_range',
  FULL_RANDOM = 'full_random'
}

export interface RandomStrategyConfig {
  name: string;
  description: string;
  icon: string;
}

export const STRATEGIES: Record<RandomStrategy, RandomStrategyConfig> = {
  [RandomStrategy.BALANCED_ODD_EVEN]: {
    name: '平衡奇偶',
    description: '红球奇偶比例接近3:3，蓝球随机',
    icon: '⚖️'
  },
  [RandomStrategy.SUM_RANGE]: {
    name: '和值范围',
    description: '红球和值在80-120之间，符合历史平均值',
    icon: '📊'
  },
  [RandomStrategy.FULL_RANDOM]: {
    name: '完全随机',
    description: '所有号码完全随机生成，不受任何限制',
    icon: '🎲'
  }
};
