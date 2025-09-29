// WebP Detection and Optimization Script
// 3D Flick - Image Optimization Helper

(function() {
    'use strict';
    
    // WebP Support Detection
    function supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    // Initialize WebP support
    supportsWebP().then(function(supported) {
        if (supported) {
            document.documentElement.classList.add('webp-supported');
            console.log('✅ WebP format supported');
        } else {
            document.documentElement.classList.add('no-webp');
            console.log('❌ WebP format not supported, using fallback');
        }
    });
    
    // Image Optimization Helper
    const ImageOptimizer = {
        // Convert image URL to WebP if supported
        getOptimizedImageUrl: function(originalUrl) {
            if (document.documentElement.classList.contains('webp-supported')) {
                // Replace extension with .webp
                return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            }
            return originalUrl;
        },
        
        // Lazy load images with WebP support
        lazyLoadImage: function(img) {
            const src = img.dataset.src;
            const webpSrc = img.dataset.webp || this.getOptimizedImageUrl(src);
            
            if (document.documentElement.classList.contains('webp-supported') && webpSrc) {
                img.src = webpSrc;
            } else {
                img.src = src;
            }
            
            img.classList.remove('lazy-load');
            img.classList.add('lazy-loaded');
            
            // Add error handling
            img.onerror = function() {
                if (this.src !== src) {
                    console.log('WebP failed, falling back to original:', src);
                    this.src = src;
                }
            };
        },
        
        // Preload critical images
        preloadCriticalImages: function() {
            const criticalImages = [
                './images/logo.png',
                './images/hero-bg.jpg'
                // Add more critical images here
            ];
            
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = this.getOptimizedImageUrl(src);
                document.head.appendChild(link);
            });
        },
        
        // Generate responsive image srcset
        generateSrcSet: function(baseName, sizes = [320, 480, 768, 1024, 1200]) {
            const extension = document.documentElement.classList.contains('webp-supported') ? '.webp' : '.jpg';
            
            return sizes.map(size => `./images/${baseName}-${size}w${extension} ${size}w`).join(', ');
        }
    };
    
    // Intersection Observer for Lazy Loading
    const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                ImageOptimizer.lazyLoadImage(img);
                lazyImageObserver.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Preload critical images
        ImageOptimizer.preloadCriticalImages();
        
        // Set up lazy loading for all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            lazyImageObserver.observe(img);
        });
        
        // Add responsive images where needed
        document.querySelectorAll('img[data-responsive]').forEach(img => {
            const baseName = img.dataset.responsive;
            img.srcset = ImageOptimizer.generateSrcSet(baseName);
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
        });
    });
    
    // Export for global use
    window.ImageOptimizer = ImageOptimizer;
    
    // Performance monitoring for images
    const imagePerformanceMonitor = {
        loadTimes: new Map(),
        
        trackImageLoad: function(img) {
            const startTime = performance.now();
            
            img.addEventListener('load', () => {
                const loadTime = performance.now() - startTime;
                this.loadTimes.set(img.src, loadTime);
                
                if (loadTime > 1000) {
                    console.warn(`🐌 Slow image load detected: ${img.src} (${loadTime.toFixed(2)}ms)`);
                }
            });
        },
        
        getAverageLoadTime: function() {
            const times = Array.from(this.loadTimes.values());
            return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0;
        }
    };
    
    // Monitor all images
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('img').forEach(img => {
            imagePerformanceMonitor.trackImageLoad(img);
        });
    });
    
    window.imagePerformanceMonitor = imagePerformanceMonitor;
    
})();