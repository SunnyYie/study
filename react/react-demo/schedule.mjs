// 3. commit阶段
function commitRoot(wip_fiber) {
  wip_fiber.deletions && wip_fiber.deletions.forEach(commitWork)
  commitWork(wip_fiber.child)
  current_fiber = wip_fiber
  wip_fiber = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  const domParent = fiber.parent.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
    // 更新属性
    const oldProps = fiber.alternate.props
    const newProps = fiber.props
    for (const key in oldProps) {
      if (key !== 'children' && !(key in newProps)) {
        domParent[key] = ''
      }
    }
    for (const key in newProps) {
      if (key !== 'children' && oldProps[key] !== newProps[key]) {
        domParent[key] = newProps[key]
      }
    }
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom)
  }
}

export { commitRoot, commitWork }
