export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef()

  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}
