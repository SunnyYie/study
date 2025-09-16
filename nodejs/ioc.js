// 日志服务
class Logger {
  log(message) {
    console.log(`[Log] ${message}`)
  }

  error(message) {
    console.error(`[Error] ${message}`)
  }
}

// 用户服务，依赖于Logger
class UserService {
  constructor(logger) {
    this.logger = logger
    this.users = []
  }

  addUser(name) {
    this.users.push(name)
    this.logger.log(`添加用户: ${name}`)
  }

  getUsers() {
    return this.users
  }
}

// 订单服务，依赖于Logger和UserService
class OrderService {
  constructor(logger, userService) {
    this.logger = logger
    this.userService = userService
    this.orders = []
  }

  createOrder(userName, product) {
    // 检查用户是否存在
    if (!this.userService.getUsers().includes(userName)) {
      this.logger.error(`用户 ${userName} 不存在`)
      return null
    }

    const order = { id: Date.now(), userName, product, date: new Date() }
    this.orders.push(order)
    this.logger.log(`为用户 ${userName} 创建订单: ${product}`)
    return order
  }
}

// 2. 简单的IoC容器 - 负责管理依赖关系
class Container {
  constructor() {
    // 存储注册的服务
    this.services = {}
  }

  // 注册服务
  register(name, factory, dependencies = []) {
    this.services[name] = { factory, dependencies }
  }

  // 获取服务实例（自动解析依赖）
  get(name) {
    const service = this.services[name]
    if (!service) {
      throw new Error(`服务 ${name} 未注册`)
    }

    // 如果已经创建过实例，直接返回（单例模式）
    if (service.instance) {
      return service.instance
    }

    // 解析依赖项
    const dependencies = service.dependencies.map(depName => this.get(depName))

    // 创建实例并缓存
    service.instance = service.factory(...dependencies)
    return service.instance
  }
}

// 3. 使用IoC容器
function useIoC() {
  // 创建容器
  const container = new Container()

  // 注册服务
  container.register('logger', () => new Logger(), [])
  container.register('userService', logger => new UserService(logger), ['logger'])
  container.register('orderService', (logger, userService) => new OrderService(logger, userService), [
    'logger',
    'userService',
  ])

  // 从容器获取服务（容器会自动注入所有依赖）
  const userService = container.get('userService')
  const orderService = container.get('orderService')

  // 使用服务
  userService.addUser('张三')
  userService.addUser('李四')

  const order1 = orderService.createOrder('张三', '笔记本电脑')
  const order2 = orderService.createOrder('王五', '手机') // 王五不存在，会报错
}

// 4. 不使用IoC/DI的情况（作为对比）
function withoutIoC() {
  // 手动创建所有依赖
  const logger = new Logger()
  const userService = new UserService(logger)
  const orderService = new OrderService(logger, userService)

  // 使用服务
  userService.addUser('张三')
  userService.addUser('李四')

  const order1 = orderService.createOrder('张三', '笔记本电脑')
  const order2 = orderService.createOrder('王五', '手机') // 王五不存在，会报错
}

// 运行示例
useIoC()
withoutIoC()
