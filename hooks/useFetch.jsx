export default function useFetch(url, options) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setData(data)
        setError(null)
      })
      .catch(err => {
        setError(err)
        setData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [url, options])

  return { data, loading, error }
}
