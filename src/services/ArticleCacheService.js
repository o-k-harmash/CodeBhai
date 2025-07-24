const CACHE_TTL_SECONDS = 60 * 60; // 1 час

export class ArticleCacheService {
  constructor(cache) {
    this.cache = cache;
  }

  _getKey(articleId) {
    return `article:view:${articleId}`;
  }

  async get(articleId) {
    const cached = await this.cache.get(this._getKey(articleId));
    return cached ? JSON.parse(cached) : null;
  }

  async set(articleId, data) {
    await this.cache.set(this._getKey(articleId), JSON.stringify(data), {
      EX: CACHE_TTL_SECONDS,
    });
  }
}
