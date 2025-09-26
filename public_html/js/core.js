/*
=========================================
3D FLICK - CORE FUNCTIONS
=========================================
Ana sistem fonksiyonları ve temel değişkenler
*/

/*
-----------------------------------------
GLOBAL DEĞİŞKENLER VE CACHE
-----------------------------------------
*/

// Ana state değişkenleri - localStorage ile senkronize
var generationCount = parseInt(localStorage.getItem('dailyGenerationCount')) || 0;
var lastGenerationTime = localStorage.getItem('lastGenerationTime');
var totalGenerationCount = parseInt(localStorage.getItem('totalGenerationCount')) || 0;

// Günlük limit sistemi değişkenleri
var DAILY_LIMIT = 1; // Günlük model oluşturma limiti
var dailyLimitUsed = false;
var nextResetTime = null;

// DOM elementleri cache - Performans için bir kez seçip saklıyoruz
var elements = {
    mainButton: null,
    successMessage: null,
    statsPanel: null,
    achievementsContainer: null,
    themeToggle: null,
    soundToggle: null,
    statsToggle: null
};

/*
-----------------------------------------
CORE UTILITY FUNCTIONS
-----------------------------------------
*/

/**
 * DOM elementlerini cache'e alır
 */
var cacheElements = function() {
    elements.mainButton = document.getElementById('mainButton');
    elements.successMessage = document.getElementById('successMessage');
    elements.statsPanel = document.getElementById('statsPanel');
    elements.achievementsContainer = document.getElementById('achievementsContainer');
    elements.themeToggle = document.getElementById('themeToggle');
    elements.soundToggle = document.getElementById('soundToggle');
    elements.statsToggle = document.getElementById('statsToggle');
    
    console.log('✅ DOM elementleri cache\'lendi');
};

/**
 * LocalStorage'a veri kaydetme
 */
var saveToStorage = function(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch(e) {
        console.error('localStorage kaydetme hatası:', e);
        return false;
    }
};

/**
 * LocalStorage'dan veri okuma
 */
var getFromStorage = function(key, defaultValue) {
    try {
        var value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch(e) {
        console.error('localStorage okuma hatası:', e);
        return defaultValue;
    }
};

/**
 * Rastgele STL model adı üretir
 */
var generateModelName = function() {
    var adjectives = ['Epic', 'Cosmic', 'Mystical', 'Divine', 'Legendary', 'Ancient', 'Sacred', 'Powerful', 'Magical', 'Supreme'];
    var objects = ['Cube', 'Sphere', 'Pyramid', 'Crystal', 'Gem', 'Artifact', 'Totem', 'Sculpture', 'Form', 'Structure'];
    
    var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    var obj = objects[Math.floor(Math.random() * objects.length)];
    var num = Math.floor(Math.random() * 999) + 1;
    
    return adj + '_' + obj + '_' + num + '.stl';
};

/**
 * STL dosyası oluşturur ve indirir
 */
var generateAndDownloadSTL = function() {
    console.log('🎲 STL dosyası oluşturuluyor...');
    
    // Basit bir küp STL içeriği
    var stlContent = `solid cube
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 1 1 0
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 1 1 0
      vertex 0 1 0
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0 0 1
      vertex 1 1 1
      vertex 1 0 1
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0 0 1
      vertex 0 1 1
      vertex 1 1 1
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex 0 0 0
      vertex 0 1 0
      vertex 0 1 1
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex 0 0 0
      vertex 0 1 1
      vertex 0 0 1
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 1 0 0
      vertex 1 1 1
      vertex 1 1 0
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 1 0 0
      vertex 1 0 1
      vertex 1 1 1
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex 0 0 0
      vertex 1 0 1
      vertex 1 0 0
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex 0 0 0
      vertex 0 0 1
      vertex 1 0 1
    endloop
  endfacet
  facet normal 0 1 0
    outer loop
      vertex 0 1 0
      vertex 1 1 0
      vertex 1 1 1
    endloop
  endfacet
  facet normal 0 1 0
    outer loop
      vertex 0 1 0
      vertex 1 1 1
      vertex 0 1 1
    endloop
  endfacet
endsolid cube`;

    // Dosyayı indir
    var blob = new Blob([stlContent], { type: 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = generateModelName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ STL dosyası indirildi');
    return true;
};

/**
 * Ana buton click handler
 */
var handleMainButtonClick = function() {
    console.log('🎯 Ana buton tıklandı!');
    
    if (!elements.mainButton) {
        console.error('❌ Main button elementi bulunamadı');
        return;
    }
    
    // Günlük limit kontrolü
    if (dailyLimitUsed) {
        console.log('⏳ Günlük limit zaten kullanılmış');
        alert('Günlük hakkınızı zaten kullandınız! Yarın tekrar gelebilirsiniz.');
        return;
    }
    
    if (!checkDailyLimit()) {
        console.log('⏳ Günlük limit kontrolü başarısız');
        alert('Günlük hakkınızı zaten kullandınız! Yarın tekrar gelebilirsiniz.');
        return;
    }
    
    // Button'u disable et
    elements.mainButton.disabled = true;
    elements.mainButton.innerHTML = '<div class="button-content"><div class="button-text">⏳ Oluşturuluyor...</div><div class="button-subtext">Lütfen bekleyin</div></div>';
    
    // Günlük limiti işaretle
    markDailyLimitUsed();
    
    // Simülasyon gecikmesi
    setTimeout(function() {
        // STL dosyası oluştur ve indir
        generateAndDownloadSTL();
        
        // Success mesajı göster
        if (elements.successMessage) {
            elements.successMessage.style.display = 'block';
            setTimeout(function() {
                if (elements.successMessage) {
                    elements.successMessage.style.display = 'none';
                }
            }, 3000);
        }
        
        // Button'u reset et
        elements.mainButton.disabled = false;
        elements.mainButton.innerHTML = '<span class="button-text">🎯 3D Model Üret</span><span class="button-subtext">Tıkla ve oluştur!</span>';
        
        // Achievement sistemi trigger et
        if (typeof triggerAchievementCheck === 'function') {
            triggerAchievementCheck('generation', generationCount);
        }
        
        // Stats güncelle
        if (typeof updateStats === 'function') {
            updateStats();
        }
        
        // Ses efekti çal
        if (typeof playSound === 'function') {
            playSound('success');
        }
        
        console.log('✅ Model oluşturma tamamlandı');
    }, 1500);
};

/**
 * Tema değiştirme
 */
var toggleTheme = function() {
    var html = document.documentElement;
    var currentTheme = html.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    
    if (elements.themeToggle) {
        elements.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    saveToStorage('theme', newTheme);
    
    if (typeof playSound === 'function') {
        playSound('click');
    }
    
    console.log('🎨 Tema değiştirildi:', newTheme);
};

/**
 * İstatistik panelini toggle et
 */
var toggleStatsPanel = function() {
    if (!elements.statsPanel) return;
    
    var isVisible = elements.statsPanel.style.display === 'block';
    elements.statsPanel.style.display = isVisible ? 'none' : 'block';
    
    if (typeof playSound === 'function') {
        playSound('click');
    }
    
    console.log('📊 Stats panel toggled');
};

/**
 * Core sistem başlatma
 */
var initializeSystem = function() {
    console.log('🔧 Core sistem başlatılıyor...');
    
    // DOM elementlerini cache'le
    cacheElements();
    
    // Tema yükle
    var savedTheme = getFromStorage('theme', 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (elements.themeToggle) {
        elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Son generation zamanını kontrol et
    var now = new Date();
    var lastTime = getFromStorage('lastGenerationTime', '0');
    var lastDate = new Date(parseInt(lastTime));
    
    // Eğer yeni gün başladıysa günlük sayacı resetle
    if (now.toDateString() !== lastDate.toDateString()) {
        generationCount = 0;
        saveToStorage('dailyGenerationCount', '0');
    }
    
    // Günlük limit sistemini başlat
    initializeDailyLimitSystem();
    
    console.log('✅ Core sistem başlatıldı');
    console.log('📊 Günlük model sayısı:', generationCount);
    console.log('🏆 Toplam model sayısı:', totalGenerationCount);
};

// Global error handler
window.addEventListener('error', function(e) {
    console.error('🚨 Global JavaScript hatası:', e.error);
});

/*
-----------------------------------------
GÜNLÜK LİMİT SİSTEMİ
-----------------------------------------
*/

/**
 * Günlük limit durumunu kontrol eder
 */
var checkDailyLimit = function() {
    var now = new Date();
    var lastGeneration = getFromStorage('lastGenerationDate', '');
    var todayString = now.toDateString();
    
    // Eğer bugün zaten model oluşturulduysa
    if (lastGeneration === todayString) {
        dailyLimitUsed = true;
        console.log('⏳ Günlük limit kullanılmış');
        return false;
    }
    
    dailyLimitUsed = false;
    console.log('✅ Günlük hak kullanılabilir');
    return true;
};

/**
 * Günlük limiti işaretler (kullanıldı olarak)
 */
var markDailyLimitUsed = function() {
    var now = new Date();
    saveToStorage('lastGenerationDate', now.toDateString());
    dailyLimitUsed = true;
    
    // Toplam sayacı artır
    totalGenerationCount++;
    saveToStorage('totalGenerationCount', totalGenerationCount.toString());
    
    console.log('✅ Günlük limit işaretlendi');
    updateDailyStatus();
};

/**
 * Sonraki reset zamanını hesaplar
 */
var getNextResetTime = function() {
    var now = new Date();
    var tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Gece yarısı
    
    return tomorrow;
};

/**
 * Geri sayım timer'ını başlatır
 */
var startCountdownTimer = function() {
    setInterval(function() {
        var now = new Date();
        var resetTime = getNextResetTime();
        var timeDiff = resetTime - now;
        
        if (timeDiff <= 0) {
            // Yeni gün başladı, sayfayı yenile
            location.reload();
            return;
        }
        
        var hours = Math.floor(timeDiff / (1000 * 60 * 60));
        var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        var timeString = 
            String(hours).padStart(2, '0') + ':' + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
        
        // UI'da göster
        var countdownElements = document.querySelectorAll('#dailyCountdown, #nextReset, #limitCountdown');
        countdownElements.forEach(function(element) {
            if (element) {
                element.textContent = timeString;
            }
        });
        
    }, 1000);
};

/**
 * Günlük durum UI'sını günceller
 */
var updateDailyStatus = function() {
    var statusElements = document.querySelectorAll('#dailyStatus, #statusText');
    var mainButton = document.getElementById('mainButton');
    var limitMessage = document.getElementById('limitUsedMessage');
    
    statusElements.forEach(function(element) {
        if (element) {
            if (dailyLimitUsed) {
                element.textContent = 'Günlük hakkınızı kullandınız';
                element.className = 'status-used';
            } else {
                element.textContent = 'Hakkınız var!';
                element.className = 'status-available';
            }
        }
    });
    
    // Ana buton durumu
    if (mainButton) {
        if (dailyLimitUsed) {
            mainButton.disabled = true;
            mainButton.classList.add('disabled');
            mainButton.title = 'Günlük hakkınızı kullandınız - Yarın tekrar gelebilirsiniz';
        } else {
            mainButton.disabled = false;
            mainButton.classList.remove('disabled');
            mainButton.title = 'Günlük 3D modelinizi oluşturun';
        }
    }
    
    // Limit mesajı göster/gizle
    if (limitMessage) {
        if (dailyLimitUsed) {
            limitMessage.style.display = 'block';
        } else {
            limitMessage.style.display = 'none';
        }
    }
    
    // Sayaçları güncelle
    var dailyCountElement = document.getElementById('dailyCount');
    var totalCountElement = document.getElementById('totalCount');
    var totalModelsElement = document.getElementById('totalModels');
    
    if (dailyCountElement) {
        dailyCountElement.textContent = dailyLimitUsed ? '1' : '0';
    }
    
    if (totalCountElement) {
        totalCountElement.textContent = totalGenerationCount;
    }
    
    if (totalModelsElement) {
        totalModelsElement.textContent = totalGenerationCount;
    }
};

/**
 * Günlük limit sistemini başlatır
 */
var initializeDailyLimitSystem = function() {
    console.log('🕒 Günlük limit sistemi başlatılıyor...');
    
    // Mevcut durumu kontrol et
    checkDailyLimit();
    
    // UI'ı güncelle
    updateDailyStatus();
    
    // Geri sayım timer'ını başlat
    startCountdownTimer();
    
    console.log('✅ Günlük limit sistemi başlatıldı');
};

console.log('📦 Core.js yüklendi');
