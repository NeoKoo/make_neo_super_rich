import { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { Header } from '../components/layout/Header';
import { TabBar } from '../components/layout/TabBar';
import { HotColdNumbers } from '../components/analysis/HotColdNumbers';
import { PersonalAnalysis } from '../components/analysis/PersonalAnalysis';
import { MissingValueChart, IntervalDistribution } from '../components/analysis/advanced';
import { Loading } from '../components/common/Loading';
import { SkeletonAnalysis } from '../components/common/Skeleton';
import { BarChart3, TrendingUp, User, RefreshCw, Activity, Grid3x3 } from 'lucide-react';

type AnalysisTab = 'hotcold' | 'personal' | 'missing' | 'interval';

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
        <div className="flex gap-2 p-1 bg-background-secondary/50 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('hotcold')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
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
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <User className="w-4 h-4" />
            个人分析
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'missing'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Activity className="w-4 h-4" />
            遗漏值
          </button>
          <button
            onClick={() => setActiveTab('interval')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'interval'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            区间分布
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 pt-6 pb-36">
        {refreshing ? (
          <SkeletonAnalysis />
        ) : activeTab === 'hotcold' ? (
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
        ) : activeTab === 'personal' ? (
          <PersonalAnalysis analysis={analysisData.personalAnalysis} />
        ) : activeTab === 'missing' ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <div className="text-text-secondary text-lg">遗漏值分析</div>
              <div className="text-text-muted text-sm mt-2">
                该功能需要历史开奖数据支持，正在开发中...
              </div>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl max-w-md">
                <p className="text-yellow-200/80 text-sm">
                  💡 遗漏值分析将追踪每个号码多少期未出现，帮助您发现可能的回补号码。
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === 'interval' ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <div className="text-text-secondary text-lg">区间分布分析</div>
              <div className="text-text-muted text-sm mt-2">
                该功能需要历史开奖数据支持，正在开发中...
              </div>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl max-w-md">
                <p className="text-blue-200/80 text-sm">
                  💡 区间分布分析将显示号码在不同区间的分布规律，推荐选择均衡分布的号码组合。
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <TabBar />
    </div>
  );
}