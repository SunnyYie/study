let wip_fiber = null // 正在工作的fiber节点
let current_fiber = null // 当前渲染完成的fiber节点

function reconcileChildren(fiber, children) {
  // 创建子fiber节点
  let prevSibling = null
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null,
      alternate: null,
    }
    // 建立父子关系和兄弟关系
    if (i === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  }
}

function reconcileDiffChildren(fiber, children) {
  // diff算法
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const oldFiber = fiber.alternate && fiber.alternate.child
    let newFiber = null
    // 1.复用
    if (oldFiber && child && child.type === oldFiber.type) {
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        parent: fiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      }
      console.log('复用节点', newFiber)
    } else if (child && (!oldFiber || child.type !== oldFiber.type)) {
      // 2.新增
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: null,
        alternate: null,
        effectTag: 'PLACEMENT',
      }
      console.log('新增节点', newFiber)
    } else if (oldFiber && (!child || child.type !== oldFiber.type)) {
      // 3.删除
      oldFiber.effectTag = 'DELETION'
      if (!fiber.deletions) {
        fiber.deletions = []
      }
      fiber.deletions.push(oldFiber)
      console.log('删除节点', oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
  }
}

export { wip_fiber, current_fiber, reconcileChildren, reconcileDiffChildren }
