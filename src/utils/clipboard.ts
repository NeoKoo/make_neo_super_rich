import { NumberSelection } from '../types/lottery';

export async function copyNumbers(numbers: NumberSelection): Promise<boolean> {
  const redStr = numbers.redBalls.map(n => n.toString().padStart(2, '0')).join(' ');
  const blueStr = numbers.blueBalls.map(n => n.toString().padStart(2, '0')).join(' ');
  const text = `红球: ${redStr}\n蓝球: ${blueStr}`;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return successful;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

export async function copyHistoryItem(
  lotteryType: string,
  numbers: NumberSelection,
  drawNumbers?: NumberSelection
): Promise<boolean> {
  const redLabel = lotteryType === '双色球' ? '红球' : '前区';
  const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区';
  
  const userRedStr = numbers.redBalls.map(n => n.toString().padStart(2, '0')).join(' ');
  const userBlueStr = numbers.blueBalls.map(n => n.toString().padStart(2, '0')).join(' ');
  
  let text = `${lotteryType}\n您的号码：\n${redLabel}: ${userRedStr}\n${blueLabel}: ${userBlueStr}\n`;
  
  if (drawNumbers) {
    const drawRedStr = drawNumbers.redBalls.map(n => n.toString().padStart(2, '0')).join(' ');
    const drawBlueStr = drawNumbers.blueBalls.map(n => n.toString().padStart(2, '0')).join(' ');
    text += `\n开奖号码：\n${redLabel}: ${drawRedStr}\n${blueLabel}: ${drawBlueStr}`;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}
