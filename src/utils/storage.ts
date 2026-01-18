/**
 * Storage utility functions for localStorage operations
 */

/**
 * Get item from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value from localStorage or default value
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Save item to localStorage
 * @param key - Storage key
 * @param value - Value to save
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage (${key}):`, error);
  }
}

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Get total size of localStorage in bytes
 * @returns Size in bytes
 */
export function getStorageSize(): number {
  try {
    let total = 0;
    for (const key in window.localStorage) {
      if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
}

/**
 * Clear all localStorage items (use with caution)
 */
export function clearStorage(): void {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}
