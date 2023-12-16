
interface CacheEntry<T> {
    value: T;
    createdAt: number;
}

class Cache<T> {
    private parkCache: { [key: string]: CacheEntry<T> } 
    private ttlSeconds: number;
    constructor(ttlSeconds: number) {
        this.parkCache = {};
        this.ttlSeconds = ttlSeconds;
    }
    get(key: string) {
        if (Date.now() - this.parkCache[key]?.createdAt > this.ttlSeconds * 1000) {
            console.log(`cache expired on ${key}`)
            return null
        }
        return this.parkCache[key]?.value;
    }
    set(key: string, value: T ) {
        this.parkCache[key] = {value: value, createdAt: Date.now()};
    }
    clear() {
        this.parkCache = {};
    }
}

export default Cache;