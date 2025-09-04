import { reconcileChildren, reconcileDiffChildren } from './fiber.mjs'
import {commitRoot, commitWork} from './schedule.mjs'

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

export { nextUnitOfWork, workLoop, performUnitOfWork }
