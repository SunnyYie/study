btn.onclick = () => {
  fetch('http://localhost:3000/download', {
    method: 'post',
    body: JSON.stringify({
      fileName: '1.png',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.arrayBuffer())
    .then(res => {
      const blob = new Blob([res], { type: 'image/png' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '1.png'
      a.click()
    })
}
