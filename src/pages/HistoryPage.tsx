import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useLotteryAPI } from '../hooks/useLotteryAPI';
import { useToast } from '../hooks/useToast';
import { Header } from '../components/layout/Header';
import { HistoryItem } from '../components/history/HistoryItem';
import { Loading } from '../components/common/Loading';
import { TabBar } from '../components/layout/TabBar';
import { RefreshCw, Trash2, FileText } from 'lucide-react';

export function HistoryPage() {
  const { history, clearHistory, deleteHistory } = useHistory();
  const { loading, fetchAndCheckDraws } = useLotteryAPI();
  const { success, info } = useToast();

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
    <div className="min-h-screen pb-24 sm:pb-20">
      <Header
        title="历史记录"
        showBack
        onBack={() => window.history.back()}
        rightElement={
          <button
            onClick={handleCheckDraws}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary rounded-xl text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:scale-105"
          >
            {loading ? (
              <>
                <Loading size="sm" />
                <span>查询中...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>检查开奖</span>
              </>
            )}
          </button>
        }
      />

      <div className="px-4 pt-4 pb-36 sm:pb-32">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center">
              <FileText className="w-10 h-10 text-purple-400" />
            </div>
            <div className="text-text-secondary text-lg font-medium">暂无历史记录</div>
            <div className="text-text-muted text-sm mt-2">保存您的选号后，这里会显示历史记录</div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary">共 {history.length} 条记录</span>
              <button
                onClick={confirmClear ? handleClearAll : () => setConfirmClear(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  confirmClear
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-700/80 hover:bg-gray-600 text-text-secondary'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {confirmClear ? '确定清空' : '清空'}
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
