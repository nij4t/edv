
export function memoize(fn: Function) {
  const cache: any = {}
  return async function (...args: any) {
    const key = JSON.stringify(args)
    cache[key] = cache[key] || fn.apply(this, args)
    return cache[key]
  }
}