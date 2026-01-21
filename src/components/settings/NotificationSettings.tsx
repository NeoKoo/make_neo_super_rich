import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Plus, Trash2 } from 'lucide-react';
import { 
  getNotificationSettings, 
  updateNotificationSettings, 
  getReminders, 
  addReminder, 
  removeReminder,
  updateReminder,
  createDefaultReminders,
  clearAllReminders
} from '../../utils/notificationManager';
import { getNextDrawTime, formatDrawTime } from '../../constants/lotterySchedule';
import { soundManager } from '../../utils/soundManager';

export function NotificationSettings() {
  const [settings, setSettings] = useState(getNotificationSettings());
  const [reminders, setReminders] = useState(getReminders());

  useEffect(() => {
    // 如果没有提醒，创建默认提醒
    if (reminders.length === 0) {
      createDefaultReminders();
      setReminders(getReminders());
    }
  }, []);

  const handleToggleEnabled = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
    soundManager.playButtonClick();
  };

  const handleToggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
    soundManager.playButtonClick();
  };

  const handleToggleVibration = () => {
    const newSettings = { ...settings, vibrationEnabled: !settings.vibrationEnabled };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
    soundManager.playButtonClick();
  };

  const handleMinutesBeforeChange = (value: number) => {
    const newSettings = { ...settings, defaultMinutesBefore: value };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
  };

  const handleAddReminder = () => {
    const lotteryType = confirm('请选择彩票类型：\n确定 = 双色球\n取消 = 大乐透') ? '双色球' : '大乐透';
    const nextDrawTime = getNextDrawTime(lotteryType);
    
    addReminder({
      lotteryType,
      drawTime: nextDrawTime,
      message: `${lotteryType}开奖提醒`,
      enabled: true,
      minutesBefore: settings.defaultMinutesBefore
    });
    
    setReminders(getReminders());
    soundManager.playButtonClick();
  };

  const handleRemoveReminder = (id: string) => {
    if (confirm('确定要删除这个提醒吗？')) {
      removeReminder(id);
      setReminders(getReminders());
      soundManager.playButtonClick();
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有提醒吗？')) {
      clearAllReminders();
      setReminders([]);
      soundManager.playButtonClick();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            {settings.enabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div>
            <div className="text-text-primary font-medium">购彩提醒</div>
            <div className="text-text-secondary text-sm">开奖前通知您</div>
          </div>
        </div>
        
        <button
          onClick={handleToggleEnabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.enabled ? 'bg-primary' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.enabled && (
        <div className="space-y-4">
          {/* 音效设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <span className="text-text-secondary">提醒音效</span>
            </div>
            
            <button
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 震动设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <div className="w-4 h-4 text-primary">📳</div>
              </div>
              <span className="text-text-secondary">震动提醒</span>
            </div>
            
            <button
              onClick={handleToggleVibration}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.vibrationEnabled ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 提前时间设置 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-text-secondary">提前提醒时间</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.defaultMinutesBefore}
                onChange={(e) => handleMinutesBeforeChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-text-primary font-medium w-12 text-right">
                {settings.defaultMinutesBefore}分钟
              </span>
            </div>
          </div>

          {/* 添加提醒按钮 */}
          <button
            onClick={handleAddReminder}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加提醒
          </button>
        </div>
      )}

      {/* 提醒列表 */}
      {reminders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-text-primary font-medium">我的提醒</h4>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清空全部
            </button>
          </div>
          
          <div className="space-y-2">
            {reminders.map(reminder => {
              const handleToggleReminder = () => {
                const updated = { ...reminder, enabled: !reminder.enabled };
                updateReminder(reminder.id, updated);
                setReminders(getReminders());
                soundManager.playButtonClick();
              };

              return (
                <div
                  key={reminder.id}
                  className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-xl p-4 backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-text-primary font-medium">{reminder.lotteryType}</div>
                      <div className="text-text-secondary text-sm">
                        开奖时间：{formatDrawTime(new Date(reminder.drawTime))}
                      </div>
                      <div className="text-text-muted text-xs">
                        提前{reminder.minutesBefore}分钟提醒
                      </div>
                    </div>
                  
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleReminder}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          reminder.enabled ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            reminder.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    
                      <button
                        onClick={() => handleRemoveReminder(reminder.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}