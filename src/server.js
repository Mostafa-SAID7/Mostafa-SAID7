const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const githubRoutes = require('./routes/github.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Request logging in development
if (config.server.env === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api', githubRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 GitHub Profile Dashboard Server');
    console.log('━'.repeat(50));
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${config.server.env}`);
    console.log(`✓ GitHub User: ${config.github.username}`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`  • Main Page:      http://localhost:${PORT}/`);
    console.log(`  • Dashboard:      http://localhost:${PORT}/dashboard.html`);
    console.log(`  • API Commits:    http://localhost:${PORT}/api/commits`);
    console.log(`  • API Stats:      http://localhost:${PORT}/api/stats`);
    console.log(`  • Health Check:   http://localhost:${PORT}/health`);
    console.log('━'.repeat(50));
    console.log('');
});
