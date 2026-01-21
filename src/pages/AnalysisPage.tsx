import { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { Header } from '../components/layout/Header';
import { TabBar } from '../components/layout/TabBar';
import { HotColdNumbers } from '../components/analysis/HotColdNumbers';
import { PersonalAnalysis } from '../components/analysis/PersonalAnalysis';
import { Loading } from '../components/common/Loading';
import { BarChart3, TrendingUp, User, RefreshCw } from 'lucide-react';

type AnalysisTab = 'hotcold' | 'personal';

export function AnalysisPage() {
  const analysisData = useAnalysis();
  const [activeTab, setActiveTab] = useState<AnalysisTab>('hotcold');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 这里可以添加刷新逻辑，比如重新获取数据
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen pb-24">
        <Header
          title="数据分析"
          showBack
          onBack={() => window.history.back()}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-purple-400" />
            </div>
            <div className="text-text-secondary text-lg font-medium">暂无分析数据</div>
            <div className="text-text-muted text-sm mt-2">请先进行选号并保存记录</div>
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header
        title="数据分析"
        showBack
        onBack={() => window.history.back()}
        rightElement={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary rounded-xl text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:scale-105 disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <Loading size="sm" />
                <span>刷新中...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>刷新</span>
              </>
            )}
          </button>
        }
      />

      {/* 标签切换 */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 p-1 bg-background-secondary/50 rounded-xl">
          <button
            onClick={() => setActiveTab('hotcold')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'hotcold'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            冷热分析
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <User className="w-4 h-4" />
            个人分析
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 pt-6 pb-36">
        {activeTab === 'hotcold' ? (
          <div className="space-y-6">
            <HotColdNumbers
              analysis={analysisData.hotColdAnalysis.red}
              title="红球冷热分析"
              ballType="red"
            />
            <HotColdNumbers
              analysis={analysisData.hotColdAnalysis.blue}
              title="蓝球冷热分析"
              ballType="blue"
            />
          </div>
        ) : (
          <PersonalAnalysis analysis={analysisData.personalAnalysis} />
        )}
      </div>

      <TabBar />
    </div>
  );
}