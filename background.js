'use strict';

// Configuration constants - kept for edge cases
const CONFIG = {
  TRANSPARENT_COLORS: ['rgba(0, 0, 0, 0)', 'transparent', ''],
  EXCLUDED_URLS: ['about:blank', 'about:newtab'],
  CSS_VARS: ['--background-color', '--bg-color', '--backgroundColor'],
  CLASS_PATTERNS: {
    PREFIX: ['bg-', 'background-'],
    CONTAINS: ['has-background']
  }
};

// Setup handler
const handleInstallation = (details) => {
  if (details.reason === "install") {
    browser.tabs.create({ url: "setup.html" });
  }
};

// Optimized injection code
const createInjectionCode = () => `
  (function() {
    const CONFIG = ${JSON.stringify(CONFIG)};
    
    // Cache DOM elements and styles
    const html = document.documentElement;
    const body = document.body;
    
    function checkBackground() {
      if (!html || !body) return;
      
      // Cache computed styles (reduces calls)
      const htmlStyle = getComputedStyle(html);
      const bodyStyle = getComputedStyle(body);
      
      // Quick transparent check
      const isTransparent = color => CONFIG.TRANSPARENT_COLORS.includes(color);
      if (!isTransparent(htmlStyle.backgroundColor) || !isTransparent(bodyStyle.backgroundColor)) {
        return;
      }
      
      // Quick class check using native methods
      const hasBackgroundClass = element => {
        const classList = element.classList;
        return CONFIG.CLASS_PATTERNS.PREFIX.some(prefix => 
          Array.from(classList).some(cls => cls.startsWith(prefix))
        ) || CONFIG.CLASS_PATTERNS.CONTAINS.some(pattern => 
          Array.from(classList).some(cls => cls.includes(pattern))
        );
      };
      
      // Check for CSS variables (cached styles)
      const hasCustomProperty = element => {
        const style = getComputedStyle(element);
        return CONFIG.CSS_VARS.some(prop => style.getPropertyValue(prop).trim());
      };
      
      // Inline style check
      const hasInlineBackground = element => {
        const style = element.getAttribute('style');
        return style && (style.includes('background') || style.includes('bg-'));
      };
      
      // Only proceed if no background is found
      if (!hasCustomProperty(html) && !hasCustomProperty(body) &&
          !hasInlineBackground(html) && !hasInlineBackground(body) &&
          !hasBackgroundClass(html) && !hasBackgroundClass(body)) {
        
        // Apply background only once
        if (!html.classList.contains('blanko-background')) {
          const style = document.createElement('style');
          style.textContent = '.blanko-background{background-color:white!important}';
          (document.head || html).appendChild(style);
          html.classList.add('blanko-background');
        }
      }
    }
    
    // Initial check
    checkBackground();
    
    // Check once DOM is loaded
    document.addEventListener('DOMContentLoaded', checkBackground, { once: true });
    
    // Add MutationObserver for dynamic content
    const observer = new MutationObserver((mutations) => {
      requestAnimationFrame(checkBackground);
    });
    
    // Start observing once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    });
    
    // Cleanup observer after 30 seconds to prevent memory leaks
    setTimeout(() => observer.disconnect(), 30000);
  })();
`;

// Simplified URL validation
const isValidUrl = url => url && !CONFIG.EXCLUDED_URLS.some(excluded => url.startsWith(excluded));

// Simplified error handling
const handleError = (error, tabId) => {
  if (!error.message?.includes('Missing host permission') &&
    !error.message?.includes('Cannot access')) {
    console.error(`Injection failed for tab ${tabId}: `, error);
  }
};

// Optimized tab update handler
const handleTabUpdate = (tabId, changeInfo, tab) => {
  if ((changeInfo.status === 'loading' || changeInfo.status === 'complete') &&
    isValidUrl(tab.url)) {
    browser.tabs.executeScript(tabId, {
      code: createInjectionCode(),
      runAt: 'document_start'
    }).catch(error => handleError(error, tabId));
  }
};

// Event listeners
browser.runtime.onInstalled.addListener(handleInstallation);
browser.tabs.onUpdated.addListener(handleTabUpdate);