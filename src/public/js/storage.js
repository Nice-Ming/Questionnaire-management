export const TOKEN_KEY = '__token__'
export const EMAIL_KEY = '__email__'
export const USERNAME_KEY = '__username__'

export default {
  get(key) {
    return window.sessionStorage.getItem(key)
  },
  set(key, val) {
    window.sessionStorage.setItem(key, val)
  },
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  clear() {
    window.sessionStorage.clear()
  }
}