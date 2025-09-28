// call
function myCall(context, ...args) {
  if (context == null) {
    context = window;
  }
  const fn = Symbol('fn');
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}

// apply
function myApply(context, args) {
  if (context == null) {
    context = window;
  }
  const fn = Symbol('fn');
  context[fn] = this;
  let result;
  if (Array.isArray(args)) {
    result = context[fn](...args);
  } else {
    result = context[fn](args);
  }
  delete context[fn];
  return result;
}

// bind
function myBind(context, ...args) {
  const self = this;
  return function (...newArgs) {
    const finalArgs = args.concat(newArgs);
    return self.apply(context, finalArgs);
  };
}