export function trackSource(source: string): void {
  const local_source = getMetrics()
  if (local_source) {
    saveMetrics(local_source)
    return
  }

  saveMetrics(source)
}

function getMetrics() {
  // Retrieve existing metrics from storage
  const existingMetrics = localStorage.getItem('source') || ''
  return existingMetrics
}

function saveMetrics(source: string) {
  // Save updated metrics to storage
  localStorage.setItem('source', source)
}
