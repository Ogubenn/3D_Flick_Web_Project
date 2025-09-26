/*
=========================================
3D FLICK - ANALYTICS SYSTEM
=========================================
Kullanıcı davranışı ve performans takibi
*/

var analytics = {
    sessionStart: Date.now(),
    events: [],
    
    track: function(event, data) {
        var eventData = {
            timestamp: Date.now(),
            event: event,
            data: data || {}
        };
        
        this.events.push(eventData);
        console.log('📊 Analytics:', event, data);
        
        // LocalStorage'a kaydet
        try {
            localStorage.setItem('analyticsEvents', JSON.stringify(this.events.slice(-100))); // Son 100 event
        } catch(e) {
            console.error('Analytics kaydetme hatası:', e);
        }
    },
    
    getStats: function() {
        return {
            sessionDuration: Date.now() - this.sessionStart,
            eventCount: this.events.length,
            events: this.events
        };
    }
};

// Sayfa yüklendiğinde session başlat
analytics.track('session_start');

console.log('📈 Analytics.js yüklendi');
