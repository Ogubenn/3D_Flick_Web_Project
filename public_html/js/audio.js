/*
=========================================
3D FLICK - AUDIO SYSTEM
=========================================
Ses efektleri ve audio yönetimi
*/

/*
-----------------------------------------
AUDIO GLOBALS
-----------------------------------------
*/

var audioContext = null;
var soundEnabled = true;

/**
 * AudioContext'i başlat
 */
var initAudioContext = function() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('✅ AudioContext başlatıldı');
    } catch(e) {
        console.error('❌ AudioContext başlatma hatası:', e);
        audioContext = null;
    }
};

/**
 * AudioContext'i resume et
 */
var resumeAudioContext = function() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(function() {
            console.log('Audio Context resumed');
        }).catch(function(e) {
            console.error('Audio Context resume hatası:', e);
        });
    }
};

/*
-----------------------------------------
SES EFEKTLERİ
-----------------------------------------
*/

/**
 * Ses efekti çalma fonksiyonu
 * @param {string} soundType - Ses tipi ('click', 'success', 'error', 'achievement')
 */
var playSound = function(soundType) {
    if (!soundEnabled || !audioContext) {
        return;
    }
    
    // Audio context suspended ise resume et
    resumeAudioContext();
    
    try {
        // Oscillator ve gain node oluştur
        var oscillator = audioContext.createOscillator();
        var gainNode = audioContext.createGain();
        
        // Ses tipine göre parametreler
        var frequency, duration, volume;
        
        switch(soundType) {
            case 'click':
                frequency = 800;
                duration = 0.1;
                volume = 0.1;
                break;
            case 'success':
                frequency = 600;
                duration = 0.3;
                volume = 0.2;
                break;
            case 'error':
                frequency = 200;
                duration = 0.5;
                volume = 0.15;
                break;
            case 'achievement':
                frequency = 880;
                duration = 0.6;
                volume = 0.25;
                break;
            default:
                frequency = 440;
                duration = 0.2;
                volume = 0.1;
        }
        
        // Oscillator ayarları
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        // Volume ayarları
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        // Bağlantıları yap
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Çal ve durdur
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
        
    } catch(e) {
        console.error('Ses çalma hatası:', e);
    }
};

/**
 * Başarım sesi - özel melodi
 */
var playAchievementSound = function() {
    if (!soundEnabled || !audioContext) {
        return;
    }
    
    resumeAudioContext();
    
    try {
        // Melodi notaları
        var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        var noteDuration = 0.2;
        
        notes.forEach(function(frequency, index) {
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            var startTime = audioContext.currentTime + (index * noteDuration);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + noteDuration);
        });
        
    } catch(e) {
        console.error('Achievement ses hatası:', e);
    }
};

/**
 * Ses açma/kapama
 */
var toggleSound = function() {
    soundEnabled = !soundEnabled;
    
    if (elements.soundToggle) {
        elements.soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        elements.soundToggle.setAttribute('title', soundEnabled ? 'Sesi Kapat' : 'Sesi Aç');
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    
    // Test sesi çal
    if (soundEnabled) {
        playSound('click');
    }
    
    console.log('🔊 Ses durumu:', soundEnabled ? 'Açık' : 'Kapalı');
};

/**
 * Ses ayarlarını yükle
 */
var loadSoundSettings = function() {
    var saved = localStorage.getItem('soundEnabled');
    if (saved !== null) {
        soundEnabled = saved === 'true';
    }
    
    if (elements.soundToggle) {
        elements.soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        elements.soundToggle.setAttribute('title', soundEnabled ? 'Sesi Kapat' : 'Sesi Aç');
    }
};

/**
 * Audio sistem event listeners
 */
var setupAudioEventListeners = function() {
    // Sound toggle button
    if (elements.soundToggle) {
        elements.soundToggle.addEventListener('click', function(e) {
            toggleSound();
        });
        console.log('Sound toggle event listener eklendi');
    }
    
    // İlk user interaction'da audio context'i resume et
    document.addEventListener('click', resumeAudioContext, { once: true });
    document.addEventListener('touchstart', resumeAudioContext, { once: true });
};

/*
-----------------------------------------
AUDIO SYSTEM INITIALIZATION
-----------------------------------------
*/

/**
 * Audio sistemini başlatma
 */
var initializeAudioSystem = function() {
    console.log('Audio sistemi başlatılıyor...');
    
    // AudioContext'i başlat
    initAudioContext();
    
    // Ses ayarlarını yükle
    loadSoundSettings();
    
    // Event listeners'ı kur
    setupAudioEventListeners();
    
    console.log('✅ Audio sistemi başlatıldı');
};

console.log('🔊 Audio.js yüklendi');
