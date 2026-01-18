import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toast } from './components/common/Toast';
import { useToast } from './hooks/useToast';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <BrowserRouter>
      {/* 极光背景层 */}
      <div className="aurora-bg" />

      <div className="min-h-screen bg-transparent text-text-primary relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;
