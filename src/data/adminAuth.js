const ADMIN_AUTH_STORAGE_KEY = 'nzdcr_admin_authenticated'
const ADMIN_PASSWORD = 'Nzdcr3021'

function getStorage() {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

export function isAdminAuthenticated() {
  const storage = getStorage()
  if (!storage) return false
  return storage.getItem(ADMIN_AUTH_STORAGE_KEY) === '1'
}

export function loginAdmin(password) {
  if (password !== ADMIN_PASSWORD) return false
  const storage = getStorage()
  if (!storage) return false
  storage.setItem(ADMIN_AUTH_STORAGE_KEY, '1')
  return true
}

export function logoutAdmin() {
  const storage = getStorage()
  if (!storage) return
  storage.removeItem(ADMIN_AUTH_STORAGE_KEY)
}
