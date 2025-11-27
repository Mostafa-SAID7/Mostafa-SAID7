/**
 * Theme Management
 * Handles dark/light mode switching and persistence
 */

class ThemeManager {
    constructor() {
        this.themeKey = 'github-dashboard-theme';
        this.currentTheme = this.getSavedTheme() || 'dark';
        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);

        // Setup toggle button
        this.setupToggle();

        // Listen for system theme changes
        this.listenForSystemTheme();
    }

    getSavedTheme() {
        return localStorage.getItem(this.themeKey);
    }

    saveTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Update toggle button if it exists
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.setAttribute('data-theme', theme);
        }

        // Save to localStorage
        this.saveTheme(theme);

        console.log(`🎨 Theme set to: ${theme}`);
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupToggle() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    listenForSystemTheme() {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        darkModeQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getSavedTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    getTheme() {
        return this.currentTheme;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
