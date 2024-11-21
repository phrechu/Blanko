'use strict';

// Check if this is the first run after installation
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open the setup page
    browser.tabs.create({
      url: "setup.html"
    });
  }
});

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
    const verifyBackground = () => {
      const html = document.documentElement;
      const body = document.body;
      
      if (!html || !body) return;
      
      const htmlStyle = window.getComputedStyle(html);
      const bodyStyle = window.getComputedStyle(body);
      
      const isTransparent = color => ['rgba(0, 0, 0, 0)', 'transparent', ''].includes(color);
      
      // Check if there's any CSS custom property for background-color
      const hasCustomProperty = element => {
        const style = window.getComputedStyle(element);
        return style.getPropertyValue('--background-color') || 
               style.getPropertyValue('--bg-color') ||
               style.getPropertyValue('--backgroundColor');
      };

      // Check if element has inline style for background
      const hasInlineBackground = element => {
        const style = element.getAttribute('style');
        return style && style.includes('background');
      };

      // Only inject if both html and body are truly transparent
      // and there are no custom properties or inline styles
      if (isTransparent(htmlStyle.backgroundColor) && 
          isTransparent(bodyStyle.backgroundColor) &&
          !hasCustomProperty(html) &&
          !hasCustomProperty(body) &&
          !hasInlineBackground(html) &&
          !hasInlineBackground(body)) {
        
        // Use a class instead of inline style for better compatibility
        if (!html.classList.contains('blanko-background')) {
          const style = document.createElement('style');
          style.textContent = \`.blanko-background { background-color: white !important; }\`;
          document.head.appendChild(style);
          html.classList.add('blanko-background');
        }
      }
    };

    // Check both immediately and after DOM is ready
    verifyBackground();
    document.addEventListener('DOMContentLoaded', verifyBackground, { once: true });

    // Also check after a short delay to catch dynamic changes
    setTimeout(verifyBackground, 500);
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