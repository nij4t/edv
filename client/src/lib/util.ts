
export function memoize(fn: Function) {
  const cache: any = {}
  return async function (...args: any) {
    const key = JSON.stringify(args)
    cache[key] = cache[key] || fn.apply(this, args)
    return cache[key]
  }
}

export function debounce(func: Function, wait: number, immediate: boolean = false) {
  let timeout: number;
  return async function (...args: any) {
    const context = this;
    const later = async function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
