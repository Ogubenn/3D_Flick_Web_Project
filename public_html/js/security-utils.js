// Security Helper Functions
// 3D Flick - XSS Protection & Input Validation

(function() {
    'use strict';
    
    const SecurityUtils = {
        
        // XSS Koruması - HTML Sanitization
        sanitizeHTML: function(input) {
            if (typeof input !== 'string') {
                return '';
            }
            
            const tempDiv = document.createElement('div');
            tempDiv.textContent = input;
            return tempDiv.innerHTML;
        },
        
        // HTML Escape - Özel karakterleri escape et
        escapeHTML: function(text) {
            if (typeof text !== 'string') {
                return '';
            }
            
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '/': '&#x2F;'
            };
            
            return text.replace(/[&<>"'/]/g, function(s) {
                return map[s];
            });
        },
        
        // URL Validation
        validateURL: function(url) {
            try {
                const urlObj = new URL(url);
                // Sadece HTTP/HTTPS protokollerine izin ver
                return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
            } catch (e) {
                return false;
            }
        },
        
        // Input Validation - Zararlı pattern'leri kontrol et
        validateInput: function(input) {
            if (typeof input !== 'string') {
                return false;
            }
            
            // Zararlı pattern'ler
            const maliciousPatterns = [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
                /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
                /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
                /javascript:/gi,
                /vbscript:/gi,
                /data:text\/html/gi,
                /on\w+\s*=/gi, // onclick, onload vs.
                /expression\s*\(/gi,
                /url\s*\(/gi
            ];
            
            return !maliciousPatterns.some(pattern => pattern.test(input));
        },
        
        // LocalStorage Güvenli Yazma
        safeLocalStorageSet: function(key, value) {
            try {
                if (typeof key !== 'string' || key.length === 0) {
                    throw new Error('Geçersiz anahtar');
                }
                
                // Value'yu serialize et ve validate et
                const serializedValue = JSON.stringify(value);
                if (!this.validateInput(serializedValue)) {
                    throw new Error('Geçersiz veri');
                }
                
                localStorage.setItem(key, serializedValue);
                return true;
            } catch (error) {
                console.warn('LocalStorage yazma hatası:', error);
                return false;
            }
        },
        
        // LocalStorage Güvenli Okuma
        safeLocalStorageGet: function(key, defaultValue = null) {
            try {
                if (typeof key !== 'string' || key.length === 0) {
                    return defaultValue;
                }
                
                const value = localStorage.getItem(key);
                if (value === null) {
                    return defaultValue;
                }
                
                // Validate before parsing
                if (!this.validateInput(value)) {
                    localStorage.removeItem(key); // Zararlı veriyi temizle
                    return defaultValue;
                }
                
                return JSON.parse(value);
            } catch (error) {
                console.warn('LocalStorage okuma hatası:', error);
                return defaultValue;
            }
        },
        
        // DOM Manipulation Güvenlik
        safeCreateElement: function(tagName, properties = {}) {
            // Sadece güvenli tag'lere izin ver
            const allowedTags = ['div', 'span', 'p', 'button', 'img', 'canvas', 'svg', 'path', 'a'];
            if (!allowedTags.includes(tagName.toLowerCase())) {
                console.warn('İzin verilmeyen HTML tag:', tagName);
                return null;
            }
            
            const element = document.createElement(tagName);
            
            // Properties'leri güvenli şekilde ayarla
            Object.keys(properties).forEach(prop => {
                if (prop === 'innerHTML' || prop === 'outerHTML') {
                    // HTML content'i sanitize et
                    element.textContent = properties[prop];
                } else if (prop === 'href' && tagName.toLowerCase() === 'a') {
                    // URL'leri validate et
                    if (this.validateURL(properties[prop])) {
                        element[prop] = properties[prop];
                    }
                } else if (prop.startsWith('on')) {
                    // Event handler'ları engelle
                    console.warn('Event handler property engellenди:', prop);
                } else {
                    // Diğer property'leri escape et
                    element[prop] = this.escapeHTML(String(properties[prop]));
                }
            });
            
            return element;
        },
        
        // CSP Nonce Generator (Client-side)
        generateNonce: function() {
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        },
        
        // Content Security Policy Validator
        validateCSP: function() {
            // Meta tag'deki CSP'yi kontrol et
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
                console.log('✅ Content Security Policy aktif');
                return true;
            } else {
                console.warn('⚠️ Content Security Policy bulunamadı');
                return false;
            }
        },
        
        // Security Headers Check
        checkSecurityHeaders: function() {
            console.group('🔒 Security Headers Kontrolü');
            
            // Bu client-side'da tam kontrol edilemez, sadece mevcut durumu log'la
            console.log('CSP Meta Tag:', document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? '✅ Mevcut' : '❌ Eksik');
            console.log('X-Frame-Options Meta:', document.querySelector('meta[http-equiv="X-Frame-Options"]') ? '✅ Mevcut' : '❌ Eksik');
            console.log('X-Content-Type-Options Meta:', document.querySelector('meta[http-equiv="X-Content-Type-Options"]') ? '✅ Mevcut' : '❌ Eksik');
            console.log('X-XSS-Protection Meta:', document.querySelector('meta[http-equiv="X-XSS-Protection"]') ? '✅ Mevcut' : '❌ Eksik');
            
            // LocalStorage güvenlik testi
            const testKey = '_security_test_' + Date.now();
            const testValue = '<script>alert("xss")</script>';
            
            if (this.safeLocalStorageSet(testKey, testValue)) {
                const retrieved = this.safeLocalStorageGet(testKey);
                if (retrieved === testValue) {
                    console.log('LocalStorage Güvenlik:', '✅ XSS koruması aktif');
                } else {
                    console.log('LocalStorage Güvenlik:', '❌ XSS koruması eksik');
                }
                localStorage.removeItem(testKey);
            }
            
            console.groupEnd();
        },
        
        // Güvenli Event Listener
        addSecureEventListener: function(element, event, handler, options = {}) {
            if (!element || typeof handler !== 'function') {
                console.warn('Geçersiz element veya handler');
                return false;
            }
            
            // Wrapper function ile güvenlik kontrolü
            const secureHandler = function(e) {
                try {
                    // Event object'ini validate et
                    if (e && typeof e === 'object') {
                        handler.call(this, e);
                    }
                } catch (error) {
                    console.error('Event handler hatası:', error);
                }
            };
            
            element.addEventListener(event, secureHandler, options);
            return true;
        }
    };
    
    // Global erişim için
    window.SecurityUtils = SecurityUtils;
    
    // Sayfa yüklendiğinde güvenlik kontrolü
    document.addEventListener('DOMContentLoaded', function() {
        SecurityUtils.validateCSP();
        
        // Geliştirme modunda güvenlik testi
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                SecurityUtils.checkSecurityHeaders();
            }, 1000);
        }
    });
    
    // Console'a güvenlik araçlarını tanıt
    console.log('%c🔒 Security Utils Loaded', 'color: #e53e3e; font-weight: bold;');
    console.log('%cKullanılabilir güvenlik fonksiyonları:', 'color: #e53e3e;');
    console.log('  SecurityUtils.sanitizeHTML(input) - HTML sanitization');
    console.log('  SecurityUtils.escapeHTML(text) - HTML escape');
    console.log('  SecurityUtils.validateInput(input) - Input validation');
    console.log('  SecurityUtils.safeLocalStorageSet/Get() - Güvenli localStorage');
    console.log('  SecurityUtils.checkSecurityHeaders() - Security headers kontrolü');
    
})();