const NAMESPACE = 'typingGame';

export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(`${NAMESPACE}:${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T, throwOnError: boolean = false): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      if (throwOnError) {
        throw error;
      }
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${NAMESPACE}:${key}`);
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage)
      .filter(key => key.startsWith(`${NAMESPACE}:`))
      .forEach(key => localStorage.removeItem(key));
  }
};