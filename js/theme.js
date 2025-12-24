/**
 * EZer Global Theme System
 * Manages dark/light/system theme preferences across all pages
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'ezer-theme';
    const html = document.documentElement;

    /**
     * Get saved theme from localStorage
     * @returns {string} 'light', 'dark', or 'system'
     */
    function getSavedTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'system';
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'light', 'dark', or 'system'
     */
    function applyTheme(theme) {
        if (theme === 'system') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', theme);
        }

        // Update active state on theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Save preference
        localStorage.setItem(STORAGE_KEY, theme);
    }

    /**
     * Initialize theme on page load
     */
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
    }

    /**
     * Set up theme toggle buttons
     */
    function setupThemeToggles() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                applyTheme(btn.dataset.theme);
            });
        });
    }

    /**
     * Set up mobile menu toggle
     */
    function setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');

        if (menuBtn && mobileNav) {
            menuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('open');
                const isOpen = mobileNav.classList.contains('open');
                menuBtn.setAttribute('aria-expanded', isOpen);
                menuBtn.innerHTML = isOpen
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            });
        }
    }

    /**
     * Highlight active navigation link based on current page
     */
    function highlightActiveNav() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html';

        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === pageName || (pageName === '' && href === 'index.html')) {
                link.classList.add('active');
            } else if (href === './' && (pageName === '' || pageName === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Apply theme immediately to prevent flash
    initTheme();

    // Set up interactions after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupThemeToggles();
            setupMobileMenu();
            highlightActiveNav();
        });
    } else {
        setupThemeToggles();
        setupMobileMenu();
        highlightActiveNav();
    }

    // Export for manual use if needed
    window.EZerTheme = {
        apply: applyTheme,
        get: getSavedTheme
    };
})();
