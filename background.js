'use strict';

// Constants
const TRANSPARENT_COLORS = [
  'rgba(0, 0, 0, 0)',
  'transparent',
  ''
];

const EXCLUDED_URLS = [
  'about:blank',
  'about:newtab',
  // 'moz-extension://',
  // 'chrome://',
  // 'file://'
];

// Helper functions
const isTransparentColor = (color) => TRANSPARENT_COLORS.includes(color);
const shouldProcessUrl = (url) => url && !EXCLUDED_URLS.some(excluded => url.startsWith(excluded));

// Main injection code - kept separate for clarity and maintainability
const injectionCode = `
  (function() {
    // Inject immediately
    document.documentElement.setAttribute('style', 'background-color: white !important');
    
    // Verify after DOM is ready
    const verifyBackground = () => {
      const html = document.documentElement;
      const body = document.body;
      
      if (!html || !body) return;
      
      const htmlStyle = window.getComputedStyle(html);
      const bodyStyle = window.getComputedStyle(body);
      
      const isTransparent = color => ['rgba(0, 0, 0, 0)', 'transparent', ''].includes(color);
      
      if (isTransparent(htmlStyle.backgroundColor) && isTransparent(bodyStyle.backgroundColor)) {
        html.setAttribute('style', 'background-color: white !important');
      }
    };

    // Check both immediately and after DOM is ready
    verifyBackground();
    document.addEventListener('DOMContentLoaded', verifyBackground, { once: true });
  })();
`;

// Main listener
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process during initial load and for valid URLs
  if (changeInfo.status !== 'loading' || !shouldProcessUrl(tab.url)) {
    return;
  }

  browser.tabs.executeScript(tabId, {
    code: injectionCode,
    runAt: 'document_start'
  }).catch(error => {
    // Only log actual errors, ignore expected permission errors
    if (!error.message?.includes('Missing host permission') &&
      !error.message?.includes('Cannot access')) {
      console.error(`Background injection failed for tab ${tabId}:`, error);
    }
  });
});