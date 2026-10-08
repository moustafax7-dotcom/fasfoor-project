export function customerReturnPath(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && !/[\u0000-\u001f]/.test(path) && !/^\/admin(?:[/?#]|$)/.test(path) ? path : '/account';
}
export function normalizeDigits(value) {
  return value.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x6f0));
}
