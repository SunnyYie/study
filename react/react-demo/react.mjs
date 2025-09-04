// 初始化创建节点
const React = {
  createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child => (typeof child === 'object' ? child : React.createTextElement(child))),
      },
    }
  },
  createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: [],
      },
    }
  },
}

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
    let oldFiber = fiber.alternate && fiber.alternate.child
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

// 最小单元任务
let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1 // 判断是否该让出时间片
  }
  if (!nextUnitOfWork && wip_fiber) {
    // 说明render阶段完成，进入commit阶段
    commitRoot(wip_fiber)
  }
  requestIdleCallback(workLoop) // 循环调用
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
  }

  if (!fiber.alternate) {
    // 初次渲染
    reconcileChildren(fiber, fiber.props.children)
  } else {
    // diff算法
    reconcileDiffChildren(fiber, fiber.props.children)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

  return null
}

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

// 1. 创建虚拟DOM
const vdom = React.createElement('div', { id: 'foo' }, React.createElement('span', null, '1111111'))

// 2. 初始化fiber
function render(vdom, container) {
  wip_fiber = {
    dom: container,
    props: { children: [vdom] },
    alternate: current_fiber,
  }
  nextUnitOfWork = wip_fiber

  requestIdleCallback(workLoop) // 浏览器空闲时执行
}

render(vdom, document.getElementById('root'))

// setTimeout(() => {
//   const newVdom = React.createElement('div', { id: 'foo' }, React.createElement('div', null, '2222222'))
//   render(newVdom, document.getElementById('root'))
// }, 2000)
