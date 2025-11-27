/**
 * Frontend Configuration
 */

const CONFIG = {
    // API endpoint
    apiUrl: window.location.origin,

    // Chart colors (theme-aware)
    colors: {
        primary: '#00d9ff',
        secondary: '#6f42c1',
        success: '#2ea043',
        warning: '#ff9800',
        danger: '#ff6b6b',
        text: '#ffffff',
        grid: '#444444',
    },

    // Chart defaults
    chartDefaults: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        family: 'Inter, sans-serif',
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#00d9ff',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            },
        },
        scales: {
            x: {
                ticks: { color: '#c9d1d9' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            y: {
                ticks: { color: '#c9d1d9' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
