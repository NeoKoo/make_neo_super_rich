import { useState, useEffect } from 'react';
import { UserSettings } from '../types/settings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import { getZodiacSign } from '../constants/zodiacColors';
import { calculateLuckyColor } from '../utils/luckyColor';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { TabBar } from '../components/layout/TabBar';
import { SoundSettings } from '../components/settings/SoundSettings';
import { ThemeSelector } from '../components/theme/ThemeSelector';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { APP_CONFIG } from '../config/app';
import { getStorageSize } from '../utils/storage';
import { User, Palette, Database, Info, Save, TestTube } from 'lucide-react';
import { notificationManager } from '../utils/notificationManager';
import { createTestScratchRecord, clearTestScratchRecords, showScratchTestInstructions } from '../utils/testScratchCard';

export function SettingsPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    'lottery_user_settings',
    APP_CONFIG.defaultSettings
  );

  const [name, setName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const [notifications] = useState(settings.notifications);
  useEffect(() => {
    setName(settings.name || '');
    const [month, day] = settings.birthDate.split('-');
    setBirthMonth(month);
    setBirthDay(day);
    
    // 初始化通知系统
    notificationManager.requestPermission().catch(console.error);
  }, [settings.name, settings.birthDate]);

  const handleSaveSettings = () => {
    if (!name.trim()) {
      error('请输入姓名');
      return;
    }

    const birthDate = `${birthMonth}-${birthDay}`;
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);

    if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
      error('请输入有效的生日日期');
      return;
    }

    const zodiacSign = getZodiacSign(month, day);
    const currentDate = new Date();
    const birthDateObj = new Date(new Date().getFullYear(), month - 1, day);
    const luckyColor = calculateLuckyColor(birthDateObj, currentDate);

    const newSettings: UserSettings = {
      ...settings,
      name: name.trim(),
      birthDate,
      zodiacSign,
      luckyColor: {
        primary: luckyColor.primaryColor,
        secondary: luckyColor.secondaryColor,
        woodPurpleColors: luckyColor.woodPurpleColors
      },
      notifications
    };

    setSettings(newSettings);
    success('设置已保存');
  };

  const handleClearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      localStorage.removeItem('lottery_history');
      success('历史记录已清空');
    }
  };

  const storageSize = getStorageSize();

  return (
    <div className="min-h-screen pb-24 sm:pb-20">
      <Header
        title="设置"
        showBack
        onBack={() => window.history.back()}
        rightElement={
          <Button onClick={handleSaveSettings} size="sm" variant="gold">
            <Save className="w-4 h-4 mr-1.5" />
            保存
          </Button>
        }
      />

      <div className="px-4 pt-4 pb-36 sm:pb-32 space-y-6">
        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-xl">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">个人信息</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-3 bg-background-tertiary/50 rounded-xl text-text-primary border border-white/10 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">出生日期</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-text-muted mb-1">月</label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full px-4 py-3 bg-background-tertiary/50 rounded-xl text-text-primary border border-white/10 focus:border-primary focus:outline-none transition-colors"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {i + 1}月
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-text-muted mb-1">日</label>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full px-4 py-3 bg-background-tertiary/50 rounded-xl text-text-primary border border-white/10 focus:border-primary focus:outline-none transition-colors"
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {i + 1}日
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>自动识别：</span>
              <span className="px-3 py-1 bg-gradient-to-r from-primary to-primary-dark rounded-full text-white text-xs font-medium shadow-lg shadow-primary/25">
                {settings.zodiacSign}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Palette className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">幸运色主题</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-text-secondary">主色调：</span>
                <div
                  className="w-8 h-8 rounded-full shadow-lg"
                  style={{ backgroundColor: settings.luckyColor.primary }}
                />
                <span className="text-text-primary font-mono ml-2">{settings.luckyColor.primary}</span>
              </div>
            </div>

            <div className="text-xs text-text-muted space-y-2">
              <div>幸运色来源：</div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: settings.luckyColor.woodPurpleColors[0] }}>
                  {settings.zodiacSign} - 星座
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: settings.luckyColor.woodPurpleColors[1] }}>
                  木质/紫色系
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: settings.luckyColor.woodPurpleColors[2] }}>
                  木质/紫色系
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <ThemeSelector />
        </div>

        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <NotificationSettings />
        </div>

        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <SoundSettings />
        </div>

        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">数据管理</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-secondary">历史记录数量</div>
                <div className="text-2xl font-bold text-text-primary">
                  {JSON.parse(localStorage.getItem('lottery_history') || '[]').length}
                </div>
              </div>
              <Button
                onClick={handleClearHistory}
                variant="danger"
                size="sm"
              >
                清空
              </Button>
            </div>

            <div className="text-sm text-text-secondary">
              <div className="mb-1">存储空间占用：</div>
              <div className="text-text-primary font-semibold">{storageSize}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Info className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">关于</h3>
          </div>

          <div className="space-y-2 text-sm text-text-secondary">
            <div>应用名称：{APP_CONFIG.name}</div>
            <div>版本：{APP_CONFIG.version}</div>
            <div className="pt-2 border-t border-white/10">
              基于幸运色的双色球/大乐透选号工具
            </div>
            <div className="text-amber-400 font-medium">助您好运连连！🍀</div>
          </div>
        </div>

        {/* 测试工具区域 */}
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <TestTube className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">测试工具</h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  createTestScratchRecord();
                  success('测试刮刮乐记录已创建');
                  showScratchTestInstructions();
                }}
                variant="primary"
                size="sm"
              >
                创建测试记录
              </Button>
              
              <Button
                onClick={() => {
                  clearTestScratchRecords();
                  success('测试刮刮乐记录已清除');
                  showScratchTestInstructions();
                }}
                variant="secondary"
                size="sm"
              >
                清除测试记录
              </Button>
            </div>
            
            <div className="text-xs text-text-muted bg-amber-500/10 rounded-lg p-3">
              <div className="font-medium mb-2">📋 使用说明：</div>
              <div>1. 点击&ldquo;创建测试记录&rdquo;生成一个带开奖结果的测试记录</div>
              <div>2. 进入历史记录页面，找到以&ldquo;test-scratch-&rdquo;开头的记录</div>
              <div>3. 点击&ldquo;检查开奖&rdquo;按钮获取开奖结果</div>
              <div>4. 刮开银色覆盖层查看开奖号码</div>
              <div>5. 刮开50%会自动显示全部内容</div>
              <div>6. 点击&ldquo;清除测试记录&rdquo;可清理所有测试记录</div>
            </div>
            
            <div className="text-xs text-text-muted bg-blue-500/10 rounded-lg p-3">
              <div className="font-medium mb-2">💡 提示：</div>
              <div>打开浏览器控制台查看详细操作说明</div>
            </div>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
