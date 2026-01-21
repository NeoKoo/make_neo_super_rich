import { Reminder, NotificationSettings } from '../types/notifications';
import { getNextDrawTime, formatDrawTime } from '../constants/lotterySchedule';
import { soundManager } from './soundManager';

class NotificationManager {
  private static instance: NotificationManager;
  private reminders: Reminder[] = [];
  private settings: NotificationSettings;
  private checkInterval: number | null = null;
  private notificationPermission: NotificationPermission = 'default';

  private constructor() {
    this.settings = this.loadSettings();
    this.reminders = this.loadReminders();
    this.requestPermission();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[NotificationManager] This browser does not support notifications');
      return false;
    }

    if (this.notificationPermission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('[NotificationManager] Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * 添加提醒
   */
  addReminder(reminder: Omit<Reminder, 'id'>): string {
    const id = `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newReminder: Reminder = {
      ...reminder,
      id,
      enabled: true
    };

    this.reminders.push(newReminder);
    this.saveReminders();
    this.startChecking();
    
    return id;
  }

  /**
   * 删除提醒
   */
  removeReminder(id: string): void {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveReminders();
    
    if (this.reminders.length === 0) {
      this.stopChecking();
    }
  }

  /**
   * 更新提醒
   */
  updateReminder(id: string, updates: Partial<Reminder>): void {
    const index = this.reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reminders[index] = { ...this.reminders[index], ...updates };
      this.saveReminders();
    }
  }

  /**
   * 获取所有提醒
   */
  getReminders(): Reminder[] {
    return this.reminders;
  }

  /**
   * 获取设置
   */
  getSettings(): NotificationSettings {
    return this.settings;
  }

  /**
   * 更新设置
   */
  updateSettings(updates: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    
    if (updates.enabled !== undefined) {
      if (updates.enabled) {
        this.startChecking();
      } else {
        this.stopChecking();
      }
    }
  }

  /**
   * 开始检查提醒
   */
  private startChecking(): void {
    if (this.checkInterval || !this.settings.enabled || this.reminders.length === 0) {
      return;
    }

    this.stopChecking();
    
    // 每分钟检查一次
    this.checkInterval = window.setInterval(() => {
      this.checkReminders();
    }, 60 * 1000);
    
    console.log('[NotificationManager] Started reminder checking');
  }

  /**
   * 停止检查提醒
   */
  private stopChecking(): void {
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('[NotificationManager] Stopped reminder checking');
    }
  }

  /**
   * 检查提醒
   */
  private checkReminders(): void {
    const now = new Date();
    
    this.reminders.forEach(reminder => {
      if (!reminder.enabled) return;
      
      const drawTime = new Date(reminder.drawTime);
      const timeDiff = drawTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // 检查是否到了提醒时间
      if (minutesDiff > 0 && minutesDiff <= reminder.minutesBefore) {
        this.showNotification(reminder);
      }
    });
  }

  /**
   * 显示通知
   */
  private showNotification(reminder: Reminder): void {
    const title = '彩票开奖提醒';
    const message = `${reminder.lotteryType}即将开奖，记得购买彩票！\n开奖时间：${formatDrawTime(new Date(reminder.drawTime))}`;
    
    // 浏览器通知
    if (this.notificationPermission === 'granted' && this.settings.enabled) {
      try {
        const notification = new Notification(title, {
          body: message,
          icon: '/icons/icon-192x192.png',
          tag: reminder.id,
          requireInteraction: false
        });

        // 点击通知时打开应用
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // 自动关闭通知
        setTimeout(() => {
          notification.close();
        }, 10000);
      } catch (error) {
        console.error('[NotificationManager] Failed to show notification:', error);
      }
    }

    // 音效提醒
    if (this.settings.soundEnabled) {
      soundManager.playNotification();
    }

    // 震动提醒
    if (this.settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    console.log(`[NotificationManager] Showed reminder: ${reminder.lotteryType}`);
  }

  /**
   * 保存提醒到本地存储
   */
  private saveReminders(): void {
    try {
      localStorage.setItem('lottery_reminders', JSON.stringify(this.reminders));
    } catch (error) {
      console.error('[NotificationManager] Failed to save reminders:', error);
    }
  }

  /**
   * 从本地存储加载提醒
   */
  private loadReminders(): Reminder[] {
    try {
      const saved = localStorage.getItem('lottery_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('[NotificationManager] Failed to load reminders:', error);
      return [];
    }
  }

  /**
   * 保存设置到本地存储
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('notification_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('[NotificationManager] Failed to save settings:', error);
    }
  }

  /**
   * 从本地存储加载设置
   */
  private loadSettings(): NotificationSettings {
    try {
      const saved = localStorage.getItem('notification_settings');
      return saved ? JSON.parse(saved) : {
        enabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        defaultMinutesBefore: 30
      };
    } catch (error) {
      console.error('[NotificationManager] Failed to load settings:', error);
      return {
        enabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        defaultMinutesBefore: 30
      };
    }
  }

  /**
   * 创建默认提醒
   */
  createDefaultReminders(): void {
    const defaultReminders: Reminder[] = [
      {
        id: 'default_shuangseqiu',
        lotteryType: '双色球',
        drawTime: getNextDrawTime('双色球'),
        message: '双色球开奖提醒',
        enabled: true,
        minutesBefore: this.settings.defaultMinutesBefore
      },
      {
        id: 'default_daleou',
        lotteryType: '大乐透',
        drawTime: getNextDrawTime('大乐透'),
        message: '大乐透开奖提醒',
        enabled: true,
        minutesBefore: this.settings.defaultMinutesBefore
      }
    ];

    this.reminders = defaultReminders;
    this.saveReminders();
    this.startChecking();
  }

  /**
   * 清除所有提醒
   */
  clearAllReminders(): void {
    this.reminders = [];
    this.saveReminders();
    this.stopChecking();
  }
}

// 导出单例实例
export const notificationManager = NotificationManager.getInstance();

// 导出便捷函数
export const addReminder = (reminder: Omit<Reminder, 'id'>) => 
  notificationManager.addReminder(reminder);

export const removeReminder = (id: string) => 
  notificationManager.removeReminder(id);

export const updateReminder = (id: string, updates: Partial<Reminder>) => 
  notificationManager.updateReminder(id, updates);

export const getReminders = () => 
  notificationManager.getReminders();

export const getNotificationSettings = () => 
  notificationManager.getSettings();

export const updateNotificationSettings = (updates: Partial<NotificationSettings>) => 
  notificationManager.updateSettings(updates);

export const createDefaultReminders = () => 
  notificationManager.createDefaultReminders();

export const clearAllReminders = () => 
  notificationManager.clearAllReminders();