/**
 * EZer Shared Navigation Component
 * Provides consistent header and footer navigation across all pages
 *
 * Usage:
 *   1. Include this script in your HTML: <script src="/js/shared-nav.js"></script>
 *   2. Add placeholder divs: <div id="shared-header"></div> and <div id="shared-footer"></div>
 *   3. Call: initSharedNav({ activePage: 'home', isCountryPage: false });
 */

(function() {
    'use strict';

    // Detect if we're in a country subfolder
    function detectContext() {
        const path = window.location.pathname;
        const countryMatch = path.match(/^\/([a-z]{2})\//);

        return {
            isCountryPage: countryMatch !== null,
            countryCode: countryMatch ? countryMatch[1] : null,
            basePath: countryMatch ? '../' : '',
            countryPath: countryMatch ? '' : '/us/' // Default to US for root pages
        };
    }

    // Navigation items configuration
    function getNavItems(context, activePage) {
        const { isCountryPage, basePath, countryPath } = context;

        // For country pages, links are relative to country folder
        // For root pages, we link to /us/ as default or use absolute paths
        const featuresLink = isCountryPage ? 'features.html' : `${countryPath}features.html`;
        const pricingLink = isCountryPage ? 'pricing.html' : `${countryPath}pricing.html`;
        const homeLink = isCountryPage ? 'index.html' : '/';
        const termsLink = isCountryPage ? 'terms.html' : `${countryPath}terms.html`;

        // Privacy links
        const privacyGeneral = isCountryPage ? 'privacy.html' : `${countryPath}privacy.html`;
        const privacyIos = isCountryPage ? `${basePath}privacy-ios.html` : '/privacy-ios.html';
        const privacyAndroid = isCountryPage ? `${basePath}privacy-android.html` : '/privacy-android.html';

        return {
            main: [
                { id: 'home', label: 'Home', href: homeLink },
                { id: 'features', label: 'Features', href: featuresLink },
                { id: 'pricing', label: 'Pricing', href: pricingLink },
                {
                    id: 'privacy',
                    label: 'Privacy Policy',
                    dropdown: true,
                    items: [
                        { label: 'General Privacy Policy', href: privacyGeneral },
                        { label: 'Privacy Policy (iOS)', href: privacyIos },
                        { label: 'Privacy Policy (Android)', href: privacyAndroid }
                    ]
                },
                { id: 'terms', label: 'Terms', href: termsLink },
                { id: 'blog', label: 'Blog', href: '/blog.html' }
            ],
            activePage: activePage
        };
    }

    // Generate header HTML
    function generateHeader(context, activePage) {
        const nav = getNavItems(context, activePage);
        const { isCountryPage, basePath } = context;
        const logoPath = isCountryPage ? `${basePath}logo-192.png` : '/logo-192.png';

        // Generate desktop nav items
        const desktopNavItems = nav.main.map(item => {
            if (item.dropdown) {
                return `
                    <div class="relative group">
                        <button class="nav-link px-3 py-2 rounded-lg text-gray-600 text-sm flex items-center gap-1 hover:text-indigo-600 transition-colors">
                            ${item.label}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50">
                            ${item.items.map((subItem, idx) => `
                                <a href="${subItem.href}" class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 ${idx === 0 ? 'rounded-t-lg' : ''} ${idx === item.items.length - 1 ? 'rounded-b-lg' : ''}">${subItem.label}</a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            const isActive = item.id === activePage;
            const activeClass = isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600';
            return `<a href="${item.href}" class="nav-link px-3 py-2 rounded-lg ${activeClass} text-sm transition-colors">${item.label}</a>`;
        }).join('');

        // Generate mobile nav items
        const mobileNavItems = nav.main.map(item => {
            if (item.dropdown) {
                return `
                    <div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Privacy Policies</div>
                    ${item.items.map(subItem => `
                        <a href="${subItem.href}" class="block px-4 py-3 pl-6 rounded-lg text-gray-600 hover:bg-gray-50">${subItem.label}</a>
                    `).join('')}
                `;
            }
            const isActive = item.id === activePage;
            const activeClass = isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50';
            return `<a href="${item.href}" class="block px-4 py-3 rounded-lg ${activeClass}">${item.label}</a>`;
        }).join('');

        return `
            <nav class="bg-white shadow-sm sticky top-0 z-50">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center h-16">
                        <a href="${isCountryPage ? 'index.html' : '/'}" class="flex items-center gap-3">
                            <img src="${logoPath}" alt="EZer Logo" class="h-10 w-10">
                            <div>
                                <div class="text-2xl font-bold text-indigo-600">EZer</div>
                                <div class="text-xs text-gray-500 hidden sm:block -mt-1">Helping you.</div>
                            </div>
                        </a>

                        <div class="hidden lg:flex gap-4 items-center">
                            ${desktopNavItems}
                        </div>

                        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Open menu">
                            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Mobile Menu -->
                    <div id="mobile-menu" class="hidden lg:hidden py-4 border-t">
                        ${mobileNavItems}
                    </div>
                </div>
            </nav>
        `;
    }

    // Generate footer HTML
    function generateFooter(context, options = {}) {
        const { isCountryPage, basePath, countryPath } = context;
        const logoPath = isCountryPage ? `${basePath}logo-192.png` : '/logo-192.png';

        const countryName = options.countryName || 'your country';
        const currencySymbol = options.currencySymbol || '$';
        const priceMonthly = options.priceMonthly || '4.99';

        // Links
        const featuresLink = isCountryPage ? 'features.html' : `${countryPath}features.html`;
        const pricingLink = isCountryPage ? 'pricing.html' : `${countryPath}pricing.html`;
        const privacyLink = isCountryPage ? 'privacy.html' : `${countryPath}privacy.html`;
        const termsLink = isCountryPage ? 'terms.html' : `${countryPath}terms.html`;
        const changeCountryLink = isCountryPage ? basePath : '/';

        return `
            <footer class="bg-gray-900 text-white py-12">
                <div class="container mx-auto px-4">
                    <div class="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div class="flex items-center gap-3 mb-4">
                                <img src="${logoPath}" alt="EZer Logo" class="h-12 w-12">
                                <div class="text-2xl font-bold">EZer</div>
                            </div>
                            <p class="text-gray-400 text-sm mb-4">Your Smart Finance Companion${isCountryPage ? ` in ${countryName}` : ''}.</p>
                            <p class="text-green-400 font-semibold">Free to use</p>
                            <p class="text-sm text-gray-400">Plus ${currencySymbol}${priceMonthly}/month</p>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-4">Product</h4>
                            <div class="space-y-2 text-gray-400 text-sm">
                                <a href="${featuresLink}" class="block hover:text-white transition-colors">Features</a>
                                <a href="${pricingLink}" class="block hover:text-white transition-colors">Pricing</a>
                                <a href="/blog.html" class="block hover:text-white transition-colors">Blog</a>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-4">Legal</h4>
                            <div class="space-y-2 text-gray-400 text-sm">
                                <a href="${privacyLink}" class="block hover:text-white transition-colors">Privacy Policy</a>
                                <a href="${termsLink}" class="block hover:text-white transition-colors">Terms & Conditions</a>
                                <a href="/data-deletion.html" class="block hover:text-white transition-colors">Data Deletion</a>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-4">Support</h4>
                            <div class="space-y-2 text-gray-400 text-sm">
                                <a href="/feedback.html" class="block hover:text-white transition-colors">Feedback</a>
                                <a href="/report.html" class="block hover:text-white transition-colors">Report Issue</a>
                                <a href="mailto:support@ezerapp.com" class="block hover:text-white transition-colors">Contact Us</a>
                                <a href="${changeCountryLink}" class="block hover:text-white transition-colors">Change Country</a>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                        <p>&copy; ${new Date().getFullYear()} EZer. All rights reserved.</p>
                        <p class="mt-2">Email: support@ezerapp.com | Website: https://www.ezerapp.com</p>
                    </div>
                </div>
            </footer>
        `;
    }

    // Initialize mobile menu toggle
    function initMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (btn && menu) {
            btn.addEventListener('click', function() {
                menu.classList.toggle('hidden');

                // Toggle icon between hamburger and X
                const svg = btn.querySelector('svg');
                if (menu.classList.contains('hidden')) {
                    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                } else {
                    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                }
            });
        }
    }

    // Main initialization function
    window.initSharedNav = function(options = {}) {
        const context = detectContext();
        const activePage = options.activePage || null;
        const footerOptions = {
            countryName: options.countryName,
            currencySymbol: options.currencySymbol,
            priceMonthly: options.priceMonthly
        };

        // Inject header
        const headerContainer = document.getElementById('shared-header');
        if (headerContainer) {
            headerContainer.innerHTML = generateHeader(context, activePage);
        }

        // Inject footer
        const footerContainer = document.getElementById('shared-footer');
        if (footerContainer) {
            footerContainer.innerHTML = generateFooter(context, footerOptions);
        }

        // Initialize mobile menu
        initMobileMenu();

        // Initialize Lucide icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Also expose individual functions for flexibility
    window.EZerNav = {
        detectContext,
        generateHeader,
        generateFooter,
        initMobileMenu
    };

})();
