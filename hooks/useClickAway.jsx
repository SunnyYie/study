export default function useClickAway(ref, onClickAway) {
  function handleClick(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      onClickAway(event)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, onClickAway])
}
