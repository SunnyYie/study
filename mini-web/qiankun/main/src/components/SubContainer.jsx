import { registerApps } from '@/utils/qiankun'
import { useEffect } from 'react'
import { start } from 'qiankun'

export default function SubContainer() {
  useEffect(() => {
    if (!window.qiankunStarted) {
      window.qiankunStarted = true
      registerApps()
      start({
        sandbox: {
          experimentalStyleIsolation: true, // 样式隔离
        },
      })
    }
  }, [])

  return <div id="sub-container"></div>
}
