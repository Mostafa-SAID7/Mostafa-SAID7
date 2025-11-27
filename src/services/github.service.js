const fetch = require('node-fetch');
const config = require('../config');

/**
 * GitHub API Service
 * Handles all interactions with the GitHub API
 */
class GitHubService {
    constructor() {
        this.cache = new Map();
        this.username = config.github.username;
        this.token = config.github.token;
        this.apiUrl = config.github.apiUrl;
    }

    /**
     * Make an authenticated request to GitHub API
     */
    async makeRequest(url, retries = 3) {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `token ${this.token}`,
                    'User-Agent': 'GitHub-Profile-Dashboard',
                },
            });

            if (!response.ok) {
                if (response.status === 403 && retries > 0) {
                    // Rate limited, wait and retry
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.makeRequest(url, retries - 1);
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error.message);
            throw error;
        }
    }

    /**
     * Fetch all repositories for the user
     */
    async fetchRepos() {
        const cacheKey = 'repos';

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        let repos = [];
        let page = 1;

        while (true) {
            const url = `${this.apiUrl}/users/${this.username}/repos?per_page=100&page=${page}`;
            const data = await this.makeRequest(url);

            if (!Array.isArray(data) || data.length === 0) break;

            repos = repos.concat(data);
            page++;
        }

        this.setCache(cacheKey, repos);
        return repos;
    }

    /**
     * Fetch commits for a specific repository
     */
    async fetchCommits(repoName) {
        const cacheKey = `commits-${repoName}`;

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        let commits = [];
        let page = 1;

        while (true) {
            const url = `${this.apiUrl}/repos/${this.username}/${repoName}/commits?per_page=100&page=${page}`;

            try {
                const data = await this.makeRequest(url);

                if (!Array.isArray(data) || data.length === 0) break;

                commits = commits.concat(data);
                page++;
            } catch (error) {
                // Skip repos we don't have access to
                break;
            }
        }

        this.setCache(cacheKey, commits);
        return commits;
    }

    /**
     * Get commit activity aggregated by date
     */
    async getCommitActivity(days = 30) {
        const cacheKey = `activity-${days}`;

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        const repos = await this.fetchRepos();
        const commitDatesCount = {};

        for (const repo of repos) {
            const commits = await this.fetchCommits(repo.name);

            commits.forEach(commit => {
                if (commit.commit && commit.commit.author && commit.commit.author.date) {
                    const date = commit.commit.author.date.split('T')[0];
                    commitDatesCount[date] = (commitDatesCount[date] || 0) + 1;
                }
            });
        }

        // Generate data for last N days
        const today = new Date();
        const activityData = [];

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            activityData.push({
                date: dateStr,
                count: commitDatesCount[dateStr] || 0,
            });
        }

        this.setCache(cacheKey, activityData);
        return activityData;
    }

    /**
     * Get GitHub statistics
     */
    async getStats() {
        const cacheKey = 'stats';

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        const repos = await this.fetchRepos();

        const stats = {
            totalRepos: repos.length,
            totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
            languages: {},
            recentRepos: repos
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 5)
                .map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    updatedAt: repo.updated_at,
                })),
        };

        // Count languages
        repos.forEach(repo => {
            if (repo.language) {
                stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
            }
        });

        this.setCache(cacheKey, stats);
        return stats;
    }

    /**
     * Cache management
     */
    isCached(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;

        const age = Date.now() - cached.timestamp;
        if (age > config.cache.duration) {
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
    }
}

module.exports = new GitHubService();
