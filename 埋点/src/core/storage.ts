class Storage {
  setItem(key: string, value: any): void {
    try {
      // 如果是对象，则转换为JSON
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value
      localStorage.setItem(key, valueToStore)
    } catch (e) {
      console.error(`Error setting item in storage: ${key}`, e)
    }
  }

  getItem(key: string): any {
    try {
      const value = localStorage.getItem(key)
      if (!value) return null

      // 尝试解析JSON，如果失败则返回原始值
      try {
        return JSON.parse(value)
      } catch (e) {
        // 如果不是有效的JSON，直接返回原始字符串
        return value
      }
    } catch (e) {
      console.error(`Error getting item from storage: ${key}`, e)
      return null
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error(`Error removing item from storage: ${key}`, e)
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }

  setSessionItem(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
  }

  getSessionItem(key: string): any {
    if (typeof window !== 'undefined') {
      const value = sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    }
    return null
  }

  removeSessionItem(key: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key)
    }
  }

  clearSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
  }
}

export default Storage
