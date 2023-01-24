export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }
}