// ==UserScript==
// @name         Google to Bing Auto-Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically search on Bing in a background tab when searching Google, then automatically close the Bing tab after 3 seconds
// @author       nussjunk.com
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @grant        GM_openInTab
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're on a Bing tab that was auto-opened
    if (window.location.href.includes('bing.com') && window.location.href.includes('auto_close=true')) {
        setTimeout(() => {
            window.close();
        }, 3000);
        return;
    }

    // Only run on Google search results
    if (!window.location.href.includes('google.com/search')) {
        return;
    }

    // Get the search query from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (!query) {
        return;
    }

    // Check if we've already opened Bing for this search
    const storageKey = `bing_opened_${query}`;
    if (sessionStorage.getItem(storageKey)) {
        return;
    }

    // Mark this search as processed
    sessionStorage.setItem(storageKey, 'true');

    // Open Bing search in a new tab with auto_close marker
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&auto_close=true`;
    
    // Use GM_openInTab if available, otherwise fall back to window.open
    if (typeof GM_openInTab !== 'undefined') {
        GM_openInTab(bingUrl, { active: false, insert: true });
    } else {
        window.open(bingUrl, '_blank');
    }
})();