/*
=========================================
3D FLICK - LOGGER SYSTEM
=========================================
Production-ready logging sistemi
*/

var logger = {
    level: 'INFO',
    
    info: function(message, data) {
        if (console && console.log) {
            console.log('ℹ️ [INFO]', message, data || '');
        }
    },
    
    error: function(message, error) {
        if (console && console.error) {
            console.error('❌ [ERROR]', message, error || '');
        }
    },
    
    warn: function(message, data) {
        if (console && console.warn) {
            console.warn('⚠️ [WARN]', message, data || '');
        }
    },
    
    debug: function(message, data) {
        if (console && console.log) {
            console.log('🐛 [DEBUG]', message, data || '');
        }
    }
};

console.log('📝 Logger.js yüklendi');
