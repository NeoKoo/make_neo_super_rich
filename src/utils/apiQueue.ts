interface QueueItem<T> {
  task: () => Promise<T>
  resolve: (value: T) => void
  reject: (reason: Error) => void
}

class RequestQueue {
  private queue: QueueItem<unknown>[] = []
  private isProcessing = false

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve: resolve as (value: unknown) => void, reject })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true

    const item = this.queue.shift()

    if (item) {
      try {
        const result = await item.task()
        item.resolve(result)
      } catch (error) {
        item.reject(error as Error)
      }
    }

    this.isProcessing = false
    this.processQueue()
  }

  clear() {
    this.queue = []
    this.isProcessing = false
  }

  size(): number {
    return this.queue.length
  }
}

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheItem<unknown>>()
  private defaultTTL = 5 * 60 * 1000

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    const now = Date.now()
    const age = now - item.timestamp

    if (age > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  clearByPrefix(prefix: string): void {
    const keysToDelete: string[] = []

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  size(): number {
    return this.cache.size
  }
}

export const aiRequestQueue = new RequestQueue()
export const aiAPICache = new APICache()

export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')

  return `${prefix}:${sortedParams}`
}

export async function queuedCachedRequest<T>(
  queue: RequestQueue,
  cache: APICache,
  cacheKey: string,
  task: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cached = cache.get<T>(cacheKey)
  if (cached) {
    console.log(`[API Queue] Cache hit for key: ${cacheKey}`)
    return cached
  }

  console.log(`[API Queue] Queueing request for key: ${cacheKey}`)

  const result = await queue.add(task)

  cache.set(cacheKey, result, ttl)

  return result
}
