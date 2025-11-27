/**
 * Chart.js Utilities
 * Reusable chart configurations and factory functions
 */

const chartUtils = {
    /**
     * Create a line chart for commit activity
     */
    createCommitChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => utils.formatDateShort(item.date)),
                datasets: [{
                    label: 'Commits',
                    data: data.map(item => item.count),
                    fill: true,
                    backgroundColor: 'rgba(0, 217, 255, 0.1)',
                    borderColor: CONFIG.colors.primary,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: CONFIG.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.4,
                }],
            },
            options: {
                ...CONFIG.chartDefaults,
                plugins: {
                    ...CONFIG.chartDefaults.plugins,
                    tooltip: {
                        ...CONFIG.chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: (context) => `${context.parsed.y} commits`,
                        },
                    },
                },
            },
        });
    },

    /**
     * Create a doughnut chart for languages
     */
    createLanguagesChart(canvas, languages) {
        const ctx = canvas.getContext('2d');

        const sortedLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8); // Top 8 languages

        const labels = sortedLanguages.map(([lang]) => lang);
        const data = sortedLanguages.map(([, count]) => count);
        const colors = labels.map(lang => utils.getLanguageColor(lang));

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#0d1117',
                    hoverBorderWidth: 3,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                            },
                            padding: 12,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        ...CONFIG.chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} repos (${percentage}%)`;
                            },
                        },
                    },
                },
            },
        });
    },

    /**
     * Create a bar chart for repository stats
     */
    createRepoStatsChart(canvas, repos) {
        const ctx = canvas.getContext('2d');

        const topRepos = repos
            .sort((a, b) => b.stars - a.stars)
            .slice(0, 10);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topRepos.map(repo => repo.name),
                datasets: [
                    {
                        label: 'Stars',
                        data: topRepos.map(repo => repo.stars),
                        backgroundColor: 'rgba(0, 217, 255, 0.7)',
                        borderColor: CONFIG.colors.primary,
                        borderWidth: 1,
                    },
                    {
                        label: 'Forks',
                        data: topRepos.map(repo => repo.forks),
                        backgroundColor: 'rgba(111, 66, 193, 0.7)',
                        borderColor: CONFIG.colors.secondary,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                ...CONFIG.chartDefaults,
                indexAxis: 'y',
                plugins: {
                    ...CONFIG.chartDefaults.plugins,
                },
            },
        });
    },

    /**
     * Create a radar chart for activity patterns
     */
    createActivityPatternChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Group commits by day of week
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = new Array(7).fill(0);

        data.forEach(item => {
            const day = new Date(item.date).getDay();
            weekData[day] += item.count;
        });

        return new Chart(ctx, {
            type: 'radar',
            data: {
                labels: dayOfWeek,
                datasets: [{
                    label: 'Commits by Day',
                    data: weekData,
                    fill: true,
                    backgroundColor: 'rgba(0, 217, 255, 0.2)',
                    borderColor: CONFIG.colors.primary,
                    pointBackgroundColor: CONFIG.colors.primary,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: CONFIG.colors.primary,
                }],
            },
            options: {
                ...CONFIG.chartDefaults,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                        pointLabels: {
                            color: '#c9d1d9',
                        },
                        ticks: {
                            color: '#c9d1d9',
                            backdropColor: 'transparent',
                        },
                    },
                },
            },
        });
    },

    /**
     * Destroy chart if it exists
     */
    destroyChart(chartInstance) {
        if (chartInstance) {
            chartInstance.destroy();
        }
    },
};
