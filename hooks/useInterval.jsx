export default function useInterval(callback, delay) {
  const savedCallback = useRef()
  // 保存最新的回调函数
  savedCallback.current = callback

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
