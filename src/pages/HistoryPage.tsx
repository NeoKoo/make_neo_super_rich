import { useState } from 'react';
import { HistoryRecord } from '../types/history';
import { useHistory } from '../hooks/useHistory';
import { useLotteryAPI } from '../hooks/useLotteryAPI';
import { useToast } from '../hooks/useToast';
import { Header } from '../components/layout/Header';
import { HistoryItem } from '../components/history/HistoryItem';
import { Loading } from '../components/common/Loading';
import { TabBar } from '../components/layout/TabBar';

export function HistoryPage() {
  const { history, clearHistory, updateHistory, deleteHistory } = useHistory();
  const { loading, fetchAndCheckDraws } = useLotteryAPI();
  const { success, error, info } = useToast();
  
  const [confirmClear, setConfirmClear] = useState(false);

  const handleCheckDraws = async () => {
    const updatedRecords = await fetchAndCheckDraws(history);
    
    if (updatedRecords.some(r => r.drawNumbers && !history.find(h => h.id === r.id)?.drawNumbers)) {
      success('开奖结果已更新');
    } else {
      info('暂无新的开奖结果');
    }
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearHistory();
      success('历史记录已清空');
      setConfirmClear(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteHistory(id);
      success('记录已删除');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background-primary">
      <Header
        title="历史记录"
        showBack
        onBack={() => window.history.back()}
        rightElement={
          <button
            onClick={handleCheckDraws}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white text-sm font-semibold transition-colors"
          >
            {loading ? (
              <>
                <Loading size="sm" />
                <span>查询中...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>检查开奖</span>
              </>
            )}
          </button>
        }
      />

      <div className="px-4 pt-4 pb-32">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <div className="text-text-secondary text-lg">暂无历史记录</div>
            <div className="text-text-muted text-sm mt-2">保存您的选号后，这里会显示历史记录</div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary">共 {history.length} 条记录</span>
              <button
                onClick={() => setConfirmClear(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  confirmClear
                    ? 'bg-status-error hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-text-secondary'
                }`}
              >
                {confirmClear ? '确定清空' : '🗑️ 清空'}
              </button>
            </div>

            <div className="space-y-4">
              {history.map(record => (
                <HistoryItem
                  key={record.id}
                  record={record}
                  onDelete={() => handleDelete(record.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <TabBar />
    </div>
  );
}
