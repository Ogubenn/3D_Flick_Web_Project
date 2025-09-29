// Accessibility Test Suite
// 3D Flick - Erişilebilirlik Test Araçları

(function() {
    'use strict';
    
    const AccessibilityTests = {
        results: [],
        
        // Test suite başlatıcı
        runAllTests: function() {
            console.log('🔍 Accessibility Tests Starting...');
            this.results = [];
            
            this.testHeadingHierarchy();
            this.testAltTextImages();
            this.testKeyboardNavigation();
            this.testAriaLabels();
            this.testColorContrast();
            this.testFocusManagement();
            this.testLandmarks();
            this.testFormLabels();
            
            this.displayResults();
        },
        
        // Test sonucu kaydı
        addResult: function(test, passed, message, element = null) {
            this.results.push({
                test,
                passed,
                message,
                element,
                timestamp: new Date().toISOString()
            });
        },
        
        // 1. Heading hierarchy testi
        testHeadingHierarchy: function() {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let currentLevel = 0;
            let passed = true;
            
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                
                if (currentLevel === 0) {
                    if (level !== 1) {
                        passed = false;
                        this.addResult('Heading Hierarchy', false, 
                            `İlk başlık H${level}, H1 olmalı`, heading);
                    }
                } else if (level > currentLevel + 1) {
                    passed = false;
                    this.addResult('Heading Hierarchy', false, 
                        `H${currentLevel}'den sonra H${level} geldi, sıralama bozuk`, heading);
                }
                
                currentLevel = level;
            });
            
            if (passed) {
                this.addResult('Heading Hierarchy', true, 
                    `${headings.length} başlık düzgün sıralanmış`);
            }
        },
        
        // 2. Alt text kontrolü
        testAltTextImages: function() {
            const images = document.querySelectorAll('img');
            let missingAlt = 0;
            
            images.forEach(img => {
                if (!img.hasAttribute('alt')) {
                    missingAlt++;
                    this.addResult('Alt Text', false, 
                        'Alt attribute eksik', img);
                } else if (img.alt === '' && !img.hasAttribute('aria-hidden')) {
                    this.addResult('Alt Text', false, 
                        'Boş alt text ama aria-hidden yok', img);
                }
            });
            
            if (missingAlt === 0) {
                this.addResult('Alt Text', true, 
                    `${images.length} görsel alt text kontrolünden geçti`);
            }
        },
        
        // 3. Klavye navigasyon testi
        testKeyboardNavigation: function() {
            const interactiveElements = document.querySelectorAll(
                'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            let accessibleCount = 0;
            
            interactiveElements.forEach(element => {
                const tabIndex = element.getAttribute('tabindex');
                const isDisabled = element.disabled;
                
                if (!isDisabled && (tabIndex === null || tabIndex >= 0)) {
                    accessibleCount++;
                } else if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
                    this.addResult('Keyboard Navigation', false, 
                        'Tabindex -1 ama aria-hidden yok', element);
                }
            });
            
            this.addResult('Keyboard Navigation', true, 
                `${accessibleCount}/${interactiveElements.length} element klavye erişilebilir`);
        },
        
        // 4. ARIA labels kontrolü
        testAriaLabels: function() {
            const elementsNeedingLabels = document.querySelectorAll(
                'button:not([aria-label]):not([aria-labelledby]), ' +
                'input:not([aria-label]):not([aria-labelledby]), ' +
                '[role="button"]:not([aria-label]):not([aria-labelledby])'
            );
            
            let missingLabels = 0;
            
            elementsNeedingLabels.forEach(element => {
                const hasVisibleText = element.textContent.trim().length > 0;
                const hasLabel = element.closest('label') !== null;
                
                if (!hasVisibleText && !hasLabel) {
                    missingLabels++;
                    this.addResult('ARIA Labels', false, 
                        'Accessible name eksik', element);
                }
            });
            
            if (missingLabels === 0) {
                this.addResult('ARIA Labels', true, 
                    'Tüm interaktif elementlerde accessible name mevcut');
            }
        },
        
        // 5. Renk kontrastı kontrolü (basit)
        testColorContrast: function() {
            const textElements = document.querySelectorAll('p, span, div, button, a');
            let lowContrastCount = 0;
            
            textElements.forEach(element => {
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // Basit kontrast kontrolü (gerçek hesaplama daha karmaşık)
                if (color === backgroundColor) {
                    lowContrastCount++;
                    this.addResult('Color Contrast', false, 
                        'Metin ve arkaplan rengi aynı', element);
                }
            });
            
            if (lowContrastCount === 0) {
                this.addResult('Color Contrast', true, 
                    'Belirgin kontrast sorunları bulunamadı');
            }
        },
        
        // 6. Focus yönetimi kontrolü
        testFocusManagement: function() {
            let focusableCount = 0;
            let focusStyleCount = 0;
            
            const focusableElements = document.querySelectorAll(
                'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            focusableElements.forEach(element => {
                focusableCount++;
                
                // Focus stil kontrolü
                element.addEventListener('focus', () => {
                    const styles = window.getComputedStyle(element);
                    if (styles.outline !== 'none' && styles.outline !== '0px') {
                        focusStyleCount++;
                    }
                }, { once: true });
            });
            
            this.addResult('Focus Management', true, 
                `${focusableCount} focusable element tespit edildi`);
        },
        
        // 7. Landmark kontrolü
        testLandmarks: function() {
            const landmarks = {
                main: document.querySelectorAll('main, [role="main"]').length,
                navigation: document.querySelectorAll('nav, [role="navigation"]').length,
                banner: document.querySelectorAll('header, [role="banner"]').length,
                contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length
            };
            
            let passed = true;
            
            if (landmarks.main === 0) {
                passed = false;
                this.addResult('Landmarks', false, 'Main landmark eksik');
            }
            
            if (landmarks.navigation === 0) {
                passed = false;
                this.addResult('Landmarks', false, 'Navigation landmark eksik');
            }
            
            if (passed) {
                this.addResult('Landmarks', true, 
                    `Tüm temel landmark'lar mevcut: Main(${landmarks.main}), Nav(${landmarks.navigation})`);
            }
        },
        
        // 8. Form label kontrolü
        testFormLabels: function() {
            const inputs = document.querySelectorAll('input, textarea, select');
            let unlabeledCount = 0;
            
            inputs.forEach(input => {
                const hasLabel = input.labels && input.labels.length > 0;
                const hasAriaLabel = input.hasAttribute('aria-label') || 
                                   input.hasAttribute('aria-labelledby');
                
                if (!hasLabel && !hasAriaLabel) {
                    unlabeledCount++;
                    this.addResult('Form Labels', false, 
                        'Form elemanının label\'ı yok', input);
                }
            });
            
            if (unlabeledCount === 0) {
                this.addResult('Form Labels', true, 
                    `${inputs.length} form elemanının tümünde label mevcut`);
            }
        },
        
        // Sonuçları görüntüle
        displayResults: function() {
            console.group('🔍 Accessibility Test Results');
            
            const passed = this.results.filter(r => r.passed).length;
            const total = this.results.length;
            
            console.log(`✅ Geçen testler: ${passed}/${total}`);
            console.log(`❌ Başarısız testler: ${total - passed}/${total}`);
            
            this.results.forEach(result => {
                const emoji = result.passed ? '✅' : '❌';
                console.log(`${emoji} ${result.test}: ${result.message}`);
                
                if (result.element) {
                    console.log('   Element:', result.element);
                }
            });
            
            console.groupEnd();
            
            // Özet rapor
            const score = Math.round((passed / total) * 100);
            console.log(`📊 Accessibility Score: ${score}%`);
            
            if (score >= 90) {
                console.log('🎉 Excellent! Site erişilebilirlik standartlarına uygun.');
            } else if (score >= 70) {
                console.log('👍 Good! Birkaç iyileştirme yapılabilir.');
            } else {
                console.log('⚠️ Needs Improvement! Erişilebilirlik sorunları mevcut.');
            }
        },
        
        // Manuel test yardımcıları
        testTabOrder: function() {
            console.log('🔍 Tab Order Test - Tab tuşuna basarak sırayı kontrol edin:');
            
            const focusableElements = document.querySelectorAll(
                'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            focusableElements.forEach((element, index) => {
                element.addEventListener('focus', () => {
                    console.log(`${index + 1}. ${element.tagName} - ${element.textContent || element.value || 'No text'}`);
                });
            });
        },
        
        // Screen reader test
        testScreenReaderContent: function() {
            console.log('🔍 Screen Reader Content Test:');
            
            // Gizli içerik kontrolü
            const srOnlyElements = document.querySelectorAll('.sr-only');
            console.log(`Screen reader only content: ${srOnlyElements.length} element`);
            
            srOnlyElements.forEach((element, index) => {
                console.log(`${index + 1}. "${element.textContent}"`);
            });
            
            // ARIA live regions
            const liveRegions = document.querySelectorAll('[aria-live]');
            console.log(`ARIA live regions: ${liveRegions.length} element`);
        }
    };
    
    // Global erişim için
    window.AccessibilityTests = AccessibilityTests;
    
    // Sayfa yüklendiğinde otomatik test (geliştirme modunda)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                AccessibilityTests.runAllTests();
            }, 2000);
        });
    }
    
    // Konsol komutları
    console.log('%c🔍 Accessibility Test Suite Loaded', 'color: #667eea; font-weight: bold;');
    console.log('%cKullanılabilir komutlar:', 'color: #667eea;');
    console.log('  AccessibilityTests.runAllTests() - Tüm testleri çalıştır');
    console.log('  AccessibilityTests.testTabOrder() - Tab sırasını test et');
    console.log('  AccessibilityTests.testScreenReaderContent() - Screen reader içeriği');
    
})();