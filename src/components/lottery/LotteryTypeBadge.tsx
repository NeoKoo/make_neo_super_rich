interface LotteryTypeBadgeProps {
  type: string;
  date?: Date;
}

export function LotteryTypeBadge({ type, date = new Date() }: LotteryTypeBadgeProps) {
  const dateStr = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="mb-6 px-4 py-3 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl border border-primary/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-text-secondary mb-1">📅 {dateStr}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-text-primary">
              🎯 今日选号
            </span>
            <span className="px-3 py-1 bg-primary rounded-full text-white text-sm font-semibold">
              {type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
