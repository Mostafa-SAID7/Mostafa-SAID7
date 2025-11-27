/**
 * Utility Functions
 * Helper functions for common tasks
 */

const utils = {
    /**
     * Format date to readable string
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Format date to short format (MMM DD)
     */
    formatDateShort(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format large numbers (1K, 1M, etc.)
     */
    formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    },

    /**
     * Get time ago string
     */
    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Show loading spinner
     */
    showLoading(element) {
        element.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>
    `;
    },

    /**
     * Show error message
     */
    showError(element, message) {
        element.innerHTML = `
      <div class="error">
        <strong>⚠️ Error</strong>
        <p>${message}</p>
        <button class="btn btn-secondary" onclick="location.reload()">Retry</button>
      </div>
    `;
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Animate number counting
     */
    animateNumber(element, end, duration = 1000) {
        const start = 0;
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = this.formatNumber(current);

            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            this.showToast('Failed to copy', 'error');
            return false;
        }
    },

    /**
     * Get color for language
     */
    getLanguageColor(language) {
        const colors = {
            JavaScript: '#f7df1e',
            TypeScript: '#3178c6',
            Python: '#3776ab',
            Java: '#b07219',
            'C#': '#178600',
            'C++': '#f34b7d',
            PHP: '#777bb4',
            Ruby: '#cc342d',
            Go: '#00add8',
            Rust: '#dea584',
            Swift: '#ffac45',
            Kotlin: '#a97bff',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Vue: '#42b883',
            React: '#61dafb',
            Angular: '#dd0031',
        };

        return colors[language] || '#8b949e';
    },

    /**
     * Create skeleton loader
     */
    createSkeleton(type = 'chart') {
        if (type === 'chart') {
            return '<div class="skeleton skeleton-chart"></div>';
        }
        if (type === 'text') {
            return '<div class="skeleton skeleton-text"></div>'.repeat(3);
        }
        if (type === 'title') {
            return '<div class="skeleton skeleton-title"></div>';
        }
        return '<div class="skeleton"></div>';
    },
};
