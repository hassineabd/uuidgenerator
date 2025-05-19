// Cookie consent management
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieModal = document.getElementById('cookie-modal');
    const acceptAllBtn = document.getElementById('accept-all-cookies');
    const settingsBtn = document.getElementById('cookie-settings');
    const saveSettingsBtn = document.getElementById('save-cookie-settings');
    const closeModalBtn = document.getElementById('close-cookie-modal');
    const cookieForm = document.getElementById('cookie-preferences-form');
    
    // Check if user has already made cookie choices
    const hasConsent = getCookie('cookie_consent');
    if (!hasConsent) {
        showCookieConsent();
    }
    
    // Event listeners
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            acceptAllCookies();
            hideCookieConsent();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showCookieModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideCookieModal();
        });
    }
    
    if (saveSettingsBtn && cookieForm) {
        saveSettingsBtn.addEventListener('click', function() {
            saveCookiePreferences();
            hideCookieModal();
            hideCookieConsent();
        });
    }
    
    // Toggle cookie settings in footer
    const footerCookieSettings = document.getElementById('footer-cookie-settings');
    if (footerCookieSettings) {
        footerCookieSettings.addEventListener('click', function(e) {
            e.preventDefault();
            showCookieModal();
        });
    }
    
    // Functions
    function showCookieConsent() {
        if (cookieConsent) {
            cookieConsent.classList.remove('hidden');
        }
    }
    
    function hideCookieConsent() {
        if (cookieConsent) {
            cookieConsent.classList.add('hidden');
        }
    }
    
    function showCookieModal() {
        if (cookieModal) {
            cookieModal.style.display = 'flex';
        }
    }
    
    function hideCookieModal() {
        if (cookieModal) {
            cookieModal.style.display = 'none';
        }
    }
    
    function acceptAllCookies() {
        // Set all cookies to accepted
        const cookiePrefs = {
            essential: true,
            preferences: true,
            analytics: true,
            advertising: true
        };
        
        // Save preferences
        setCookie('cookie_consent', 'true', 365);
        setCookie('cookie_preferences', JSON.stringify(cookiePrefs), 365);
        
        // If analytics is accepted, initialize analytics
        if (cookiePrefs.analytics) {
            initializeAnalytics();
        }
        
        // If advertising is accepted, initialize ad services
        if (cookiePrefs.advertising) {
            initializeAds();
        }
    }
    
    function saveCookiePreferences() {
        if (!cookieForm) return;
        
        const cookiePrefs = {
            essential: true, // Essential cookies are always required
            preferences: cookieForm.preferences.checked,
            analytics: cookieForm.analytics.checked,
            advertising: cookieForm.advertising.checked
        };
        
        // Save preferences
        setCookie('cookie_consent', 'true', 365);
        setCookie('cookie_preferences', JSON.stringify(cookiePrefs), 365);
        
        // Initialize services based on permissions
        if (cookiePrefs.analytics) {
            initializeAnalytics();
        }
        
        if (cookiePrefs.advertising) {
            initializeAds();
        }
    }
    
    // Helper function - Initialize analytics (placeholder)
    function initializeAnalytics() {
        // Here you would initialize your analytics tools like Google Analytics
        console.log('Analytics initialized');
    }
    
    // Helper function - Initialize ads (placeholder)
    function initializeAds() {
        // Here you would initialize Monetag or other ad services
        console.log('Ad services initialized');
        
        // Initialize Monetag if available
        if (window.monetag_id) {
            console.log('Monetag initialized with ID:', window.monetag_id);
        }
    }
    
    // Cookie utility functions
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }
    
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Load preferences from cookies if they exist
    function loadSavedPreferences() {
        if (cookieForm) {
            const prefsString = getCookie('cookie_preferences');
            if (prefsString) {
                try {
                    const prefs = JSON.parse(prefsString);
                    cookieForm.preferences.checked = prefs.preferences;
                    cookieForm.analytics.checked = prefs.analytics;
                    cookieForm.advertising.checked = prefs.advertising;
                } catch (e) {
                    console.error('Error parsing cookie preferences', e);
                }
            }
        }
    }
    
    // Load saved preferences when modal opens
    if (settingsBtn) {
        settingsBtn.addEventListener('click', loadSavedPreferences);
    }
    
    if (footerCookieSettings) {
        footerCookieSettings.addEventListener('click', loadSavedPreferences);
    }
    
    // Apply the saved preferences when page loads
    const prefsString = getCookie('cookie_preferences');
    if (prefsString) {
        try {
            const prefs = JSON.parse(prefsString);
            if (prefs.analytics) {
                initializeAnalytics();
            }
            if (prefs.advertising) {
                initializeAds();
            }
        } catch (e) {
            console.error('Error applying cookie preferences', e);
        }
    }
}); 