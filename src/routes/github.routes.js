const express = require('express');
const githubService = require('../services/github.service');

const router = express.Router();

/**
 * GET /api/commits
 * Get commit activity data for the last N days
 */
router.get('/commits', async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;

        if (days < 1 || days > 365) {
            return res.status(400).json({
                success: false,
                error: { message: 'Days must be between 1 and 365' },
            });
        }

        const data = await githubService.getCommitActivity(days);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stats
 * Get GitHub statistics
 */
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await githubService.getStats();

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/repos
 * Get all repositories
 */
router.get('/repos', async (req, res, next) => {
    try {
        const repos = await githubService.fetchRepos();

        res.json({
            success: true,
            data: repos,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/cache/clear
 * Clear the service cache
 */
router.post('/cache/clear', (req, res) => {
    try {
        githubService.clearCache();

        res.json({
            success: true,
            message: 'Cache cleared successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
