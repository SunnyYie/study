function EventEmitter() {
  this.events = new Map();
}

EventEmitter.prototype.on = function (eventName, listener) {
  if (!this.events.has(eventName)) {
    this.events.set(eventName, []);
  }
  this.events.get(eventName).push(listener);
}

EventEmitter.prototype.emit = function (eventName, ...args) {
  if (this.events.has(eventName)) {
    for (const listener of this.events.get(eventName)) {
      listener(...args);
    }
  }
}

EventEmitter.prototype.off = function (eventName, listener) {
  if (this.events.has(eventName)) {
    const listeners = this.events.get(eventName);
    this.events.set(eventName, listeners.filter(l => l !== listener));
  }
}

EventEmitter.prototype.once = function (eventName, listener) {
  const onceListener = (...args) => {
    listener(...args);
    this.off(eventName, onceListener);
  };

  this.on(eventName, onceListener);
}
