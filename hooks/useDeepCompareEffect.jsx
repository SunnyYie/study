import { useEffect, useRef, useMemo } from 'react'
import { isEqual } from 'lodash'

export default function useDeepCompareEffect(callback, dependencies) {
  const hasMounted = useRef(false)
  const previousDependenciesRef = useRef()

  // 使用 useMemo 来进行深度比较，只有当依赖真正改变时才更新
  const memoizedDeps = useMemo(() => {
    const hasChanged = !isEqual(previousDependenciesRef.current, dependencies)
    if (hasChanged) {
      previousDependenciesRef.current = dependencies
    }
    return hasChanged ? dependencies : previousDependenciesRef.current
  }, [dependencies])

  useEffect(() => {
    if (hasMounted.current) {
      callback()
    } else {
      hasMounted.current = true
      callback()
    }
  }, [memoizedDeps])
}
