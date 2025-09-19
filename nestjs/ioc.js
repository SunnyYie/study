class Logger {
  log(message) {
    console.log(message)
  }
}

class UserService {
  constructor(logger) {
    this.logger = logger
    this.user = []
  }

  createUser(name) {
    this.logger.log(`User ${name} created.`)
    this.user.push(name)
  }

  getUsers() {
    return this.user
  }
}

class OrderService {
  constructor(logger, UserService) {
    this.logger = logger
    this.userService = UserService
    this.orders = []
  }
  createOrder(userName, product) {
    const users = this.userService.getUsers()
    if (users.includes(userName)) {
      this.logger.log(`Order for ${product} created for user ${userName}.`)
      this.orders.push({ user: userName, product })
    } else {
      this.logger.log(`User ${userName} does not exist. Cannot create order.`)
    }
  }
}

class Container {
  constructor() {
    this.services = {}
  }

  register(name, definition, dependencies) {
    this.services[name] = { definition, dependencies }
  }

  get(name) {
    const c = this.services[name]
    if (!c.instance) {
      const dependencies = c.dependencies.map((depName) => this.get(depName))
      c.instance = new c.definition(...dependencies)
    }
    return c.instance
  }
}


function withIoC() {

}

function withoutIoC() {
  const logger = new Logger()
  const userService = new UserService(logger)
  const orderService = new OrderService(logger, userService)
}
