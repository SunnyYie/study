export default function useTimeout(callback, delay) {
  const savedCallback = useRef()
  // 保存最新的回调函数
  savedCallback.current = callback

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}