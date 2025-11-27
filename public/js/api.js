/**
 * API Client
 * Handles all API requests with caching and error handling
 */

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    /**
     * Make a GET request
     */
    async get(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = url;

        // Return cached data if available and not expired
        if (options.cache !== false && this.isCached(cacheKey)) {
            console.log(`📦 Using cached data for ${endpoint}`);
            return this.getFromCache(cacheKey);
        }

        // Return pending request if already in progress
        if (this.pendingRequests.has(cacheKey)) {
            console.log(`⏳ Waiting for pending request ${endpoint}`);
            return this.pendingRequests.get(cacheKey);
        }

        // Make new request
        const requestPromise = this.makeRequest(url, options);
        this.pendingRequests.set(cacheKey, requestPromise);

        try {
            const data = await requestPromise;
            this.setCache(cacheKey, data);
            return data;
        } finally {
            this.pendingRequests.delete(cacheKey);
        }
    }

    /**
     * Make the actual HTTP request
     */
    async makeRequest(url, options = {}) {
        try {
            console.log(`🌐 Fetching ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'Request failed');
            }

            return data.data;
        } catch (error) {
            console.error(`❌ API Error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get commit activity
     */
    async getCommitActivity(days = 30) {
        return this.get(`/api/commits?days=${days}`);
    }

    /**
     * Get GitHub stats
     */
    async getStats() {
        return this.get('/api/stats');
    }

    /**
     * Get repositories
     */
    async getRepos() {
        return this.get('/api/repos');
    }

    /**
     * Clear server cache
     */
    async clearServerCache() {
        return fetch(`${this.baseUrl}/api/cache/clear`, {
            method: 'POST',
        }).then(res => res.json());
    }

    /**
     * Cache management
     */
    isCached(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;

        const age = Date.now() - cached.timestamp;
        const maxAge = 5 * 60 * 1000; // 5 minutes

        if (age > maxAge) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    getFromCache(key) {
        return this.cache.get(key).data;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    clearCache() {
        this.cache.clear();
        console.log('✓ Client cache cleared');
    }
}

// Create and export global API client
const api = new ApiClient(CONFIG.apiUrl);
