interface StorageCache {
  set(key: string, value: string): void
  get(key: string): string | null
  setJSON<T>(key: string, jsonValue: T): void
  getJSON<T>(key: string): T | null
  remove(key: string): void
}

function createCache(storage: Storage): StorageCache {
  return {
    set(key, value) {
      if (key != null && value != null) {
        storage.setItem(key, value)
      }
    },
    get(key) {
      return key != null ? storage.getItem(key) : null
    },
    setJSON(key, jsonValue) {
      if (jsonValue != null) {
        this.set(key, JSON.stringify(jsonValue))
      }
    },
    getJSON<T>(key: string) {
      const value = this.get(key)
      return value != null ? (JSON.parse(value) as T) : null
    },
    remove(key) {
      storage.removeItem(key)
    }
  }
}

export default {
  session: createCache(sessionStorage),
  local: createCache(localStorage)
}
