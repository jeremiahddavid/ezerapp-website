/**
 * EZer Website Analytics - Google Analytics 4
 * Privacy-friendly configuration
 * 
 * Measurement ID: G-W1MTLWPXJX
 * Property: EZer Website
 */

// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

const GA_MEASUREMENT_ID = 'G-W1MTLWPXJX';

gtag('config', GA_MEASUREMENT_ID, {
    'anonymize_ip': true,
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false,
    'send_page_view': true,
    'cookie_flags': 'SameSite=None;Secure',
});

// Track scroll depth (90%)
let scrollTracked = false;
window.addEventListener('scroll', function() {
    if (scrollTracked) return;
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    if (scrollPercent >= 90) {
        gtag('event', 'scroll_depth', { 'depth': '90%' });
        scrollTracked = true;
    }
});

// Track outbound link clicks
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
        gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': link.href,
            'transport_type': 'beacon'
        });
    }
});

// Track App Store / Play Store button clicks
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link) {
        if (link.href.includes('apps.apple.com')) {
            gtag('event', 'app_store_click', {
                'event_category': 'download',
                'event_label': 'ios',
                'transport_type': 'beacon'
            });
        } else if (link.href.includes('play.google.com')) {
            gtag('event', 'play_store_click', {
                'event_category': 'download',
                'event_label': 'android',
                'transport_type': 'beacon'
            });
        }
    }
});

// Extract country from URL path for regional analytics
const pathParts = window.location.pathname.split('/').filter(Boolean);
if (pathParts.length > 0 && pathParts[0].length === 2) {
    gtag('set', 'user_properties', { 'country_page': pathParts[0].toUpperCase() });
}
