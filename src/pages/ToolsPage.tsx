import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { TabBar } from '../components/layout/TabBar';
import { NumberReducer, SmartFilter } from '../components/advancedTools';
import { useLotteryConfig } from '../hooks/useLotteryConfig';
import { useToast } from '../hooks/useToast';
import { Wrench, Filter, Sparkles } from 'lucide-react';

type ToolsTab = 'reducer' | 'filter';

export function ToolsPage() {
  const navigate = useNavigate();
  const { lotteryType } = useLotteryConfig();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<ToolsTab>('reducer');

  // Convert lottery type to the format expected by components
  const componentLotteryType = lotteryType === '双色球' ? 'ssq' : 'dlt';

  const handleReducerApply = (combinations: Array<{ redBalls: number[]; blueBalls: number[] }>) => {
    // Save combinations to history or navigate with data
    console.log('Reducer applied:', combinations.length, 'combinations');
    success(`已生成 ${combinations.length} 组优化号码`);
    // You could navigate to history page or save to localStorage
    // navigate('/history', { state: { combinations } });
  };

  const handleFilterApply = (combinations: Array<{ redBalls: number[]; blueBalls: number[] }>) => {
    console.log('Filter applied:', combinations.length, 'combinations');
    success(`已筛选出 ${combinations.length} 组高质量号码`);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header
        title="高级工具"
        showBack
        onBack={() => navigate(-1)}
      />

      {/* 标签切换 */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 p-1 bg-background-secondary/50 rounded-xl">
          <button
            onClick={() => setActiveTab('reducer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'reducer'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Wrench className="w-4 h-4" />
            号码缩水
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'filter'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Filter className="w-4 h-4" />
            智能过滤
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 pt-6 pb-36">
        {activeTab === 'reducer' ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-blue-200/80 text-sm">
                  <strong>号码缩水工具</strong>可以将复式投注转换为优化组合，大幅降低投注成本。选择您想要的号码范围，系统将根据最佳策略进行缩水。
                </div>
              </div>
            </div>
            <NumberReducer
              lotteryType={componentLotteryType}
              onApply={handleReducerApply}
            />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="flex items-start gap-2">
                <Filter className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-purple-200/80 text-sm">
                  <strong>智能过滤系统</strong>可以根据多种条件快速筛选高质量号码组合。提供多种预设方案，也支持自定义过滤条件。
                </div>
              </div>
            </div>
            {/* For demo purposes, pass sample combinations */}
            <SmartFilter
              lotteryType={componentLotteryType}
              combinations={[]} // User should provide combinations here
              onFilter={handleFilterApply}
            />
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
