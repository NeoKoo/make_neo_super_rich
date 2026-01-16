import { LotteryConfig } from '../types/lottery';
import { NumberSelection } from '../types/lottery';

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateBalancedOddEven(config: LotteryConfig): NumberSelection {
  const redBallCount = config.redBalls.count;
  const targetOddCount = Math.floor(redBallCount / 2);
  const targetEvenCount = redBallCount - targetOddCount;
  
  const oddNumbers: number[] = [];
  const evenNumbers: number[] = [];
  
  for (let i = config.redBalls.min; i <= config.redBalls.max; i++) {
    if (i % 2 !== 0) {
      oddNumbers.push(i);
    } else {
      evenNumbers.push(i);
    }
  }
  
  const selectedOdds = shuffle(oddNumbers).slice(0, targetOddCount);
  const selectedEvens = shuffle(evenNumbers).slice(0, targetEvenCount);
  const redBalls = shuffle([...selectedOdds, ...selectedEvens]).sort((a, b) => a - b);
  
  const blueBallPool = Array.from(
    { length: config.blueBalls.max - config.blueBalls.min + 1 },
    (_, i) => config.blueBalls.min + i
  );
  const blueBalls = shuffle(blueBallPool)
    .slice(0, config.blueBalls.count)
    .sort((a, b) => a - b);
  
  return { redBalls, blueBalls };
}

export function generateSumRange(config: LotteryConfig): NumberSelection {
  const targetSumMin = 80;
  const targetSumMax = 120;
  const redBallCount = config.redBalls.count;
  
  const redBallPool = Array.from(
    { length: config.redBalls.max - config.redBalls.min + 1 },
    (_, i) => config.redBalls.min + i
  );
  
  let redBalls: number[];
  let attempts = 0;
  const maxAttempts = 1000;
  
  do {
    redBalls = shuffle(redBallPool)
      .slice(0, redBallCount)
      .sort((a, b) => a - b);
    
    const sum = redBalls.reduce((total, num) => total + num, 0);
    
    if (sum >= targetSumMin && sum <= targetSumMax) {
      break;
    }
    
    attempts++;
  } while (attempts < maxAttempts);
  
  const blueBallPool = Array.from(
    { length: config.blueBalls.max - config.blueBalls.min + 1 },
    (_, i) => config.blueBalls.min + i
  );
  const blueBalls = shuffle(blueBallPool)
    .slice(0, config.blueBalls.count)
    .sort((a, b) => a - b);
  
  return { redBalls, blueBalls };
}

export function generateFullRandom(config: LotteryConfig): NumberSelection {
  const redBallPool = Array.from(
    { length: config.redBalls.max - config.redBalls.min + 1 },
    (_, i) => config.redBalls.min + i
  );
  const redBalls = shuffle(redBallPool)
    .slice(0, config.redBalls.count)
    .sort((a, b) => a - b);
  
  const blueBallPool = Array.from(
    { length: config.blueBalls.max - config.blueBalls.min + 1 },
    (_, i) => config.blueBalls.min + i
  );
  const blueBalls = shuffle(blueBallPool)
    .slice(0, config.blueBalls.count)
    .sort((a, b) => a - b);
  
  return { redBalls, blueBalls };
}

export function generateRandomNumbers(
  strategy: 'balanced_odd_even' | 'sum_range' | 'full_random',
  config: LotteryConfig
): NumberSelection {
  switch (strategy) {
    case 'balanced_odd_even':
      return generateBalancedOddEven(config);
    case 'sum_range':
      return generateSumRange(config);
    case 'full_random':
    default:
      return generateFullRandom(config);
  }
}
