import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toast } from './components/common/Toast';
import { TabBar } from './components/layout/TabBar';
import { useToast } from './hooks/useToast';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { soundManager } from './utils/soundManager';
import { themeManager } from './utils/themeManager';
import { useEffect } from 'react';

function App() {
  const { toasts, removeToast } = useToast();
  
  useEffect(() => {
    // 初始化音效系统
    soundManager.initialize().catch(console.error);
    
    // 主题系统在 themeManager 构造函数中自动初始化
    console.log(`[App] Current theme: ${themeManager.getCurrentTheme().name}`);
  }, []);

  return (
    <BrowserRouter>
      {/* 极光背景层 */}
      <div className="aurora-bg" />

      <TabBar />

      <div className="min-h-screen bg-transparent text-text-primary relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;
