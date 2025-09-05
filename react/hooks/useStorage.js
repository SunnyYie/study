import { useSyncExternalStore } from 'react'

export function useStorage(key, initialValue) {
  const subscribe = callback => {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
  }

  const getSnapshot = () => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : initialValue
  }

  const res = useSyncExternalStore(subscribe, getSnapshot)

  const updateStorage = newValue => {
    localStorage.setItem(key, JSON.stringify(newValue))
    // 手动触发storage事件
    window.dispatchEvent(new StorageEvent('storage'))
  }

  return [res, updateStorage]
}
