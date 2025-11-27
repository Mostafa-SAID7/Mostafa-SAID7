require('dotenv').config();

/**
 * Application configuration
 * Centralizes all environment variables and app settings
 */
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // GitHub API configuration
  github: {
    username: process.env.GITHUB_USERNAME,
    token: process.env.GITHUB_TOKEN,
    apiUrl: 'https://api.github.com',
  },

  // Cache configuration
  cache: {
    duration: parseInt(process.env.CACHE_DURATION) || 300000, // 5 minutes default
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};

/**
 * Validate required configuration
 */
function validateConfig() {
  const required = ['GITHUB_USERNAME', 'GITHUB_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('💡 Please copy .env.example to .env and fill in your values');
    process.exit(1);
  }
}

// Validate on import
validateConfig();

module.exports = config;
