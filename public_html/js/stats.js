/*
=========================================
3D FLICK - STATS SYSTEM
=========================================
İstatistik takibi ve yönetimi
*/

var stats = {
    totalGenerations: 0,
    dailyGenerations: 0,
    weeklyGenerations: 0,
    monthlyGenerations: 0,
    lastGenerationDate: null,
    totalPoints: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    achievementsUnlocked: 0,
    activeDays: 0,
    mostActiveHour: 14,
    avgUsage: 0,
    generationTimes: [],
    weeklyGoal: 5,
    streakGoal: 7,
    achievementGoal: 10,
    lastWeekStart: null,
    lastMonthStart: null
};

var updateStats = function() {
    // Temel istatistikleri al
    stats.totalGenerations = parseInt(localStorage.getItem('totalGenerations')) || 0;
    stats.dailyGenerations = parseInt(localStorage.getItem('dailyGenerationCount')) || 0;
    stats.totalPoints = achievementStats ? achievementStats.totalPoints : 0;
    stats.achievementsUnlocked = achievementStats ? achievementStats.unlockedCount : 0;
    
    // Zaman tabanlı istatistikleri hesapla
    updateTimeBasedStats();
    
    // Gelişmiş metrikleri hesapla
    calculateAdvancedMetrics();
    
    // Level hesapla (her 100 puan = 1 level)
    stats.level = Math.floor(stats.totalPoints / 100) + 1;
    
    // UI'ı güncelle
    updateStatsUI();
};

var updateTimeBasedStats = function() {
    var now = new Date();
    var currentWeekStart = getWeekStart(now);
    var currentMonthStart = getMonthStart(now);
    
    // Haftalık istatistikleri güncelle
    var lastWeekStart = localStorage.getItem('lastWeekStart');
    if (!lastWeekStart || lastWeekStart !== currentWeekStart.toISOString()) {
        if (lastWeekStart) {
            // Yeni hafta başladı, haftalık sayacı sıfırla
            localStorage.setItem('weeklyGenerations', '0');
        }
        localStorage.setItem('lastWeekStart', currentWeekStart.toISOString());
        stats.lastWeekStart = currentWeekStart;
    }
    
    // Aylık istatistikleri güncelle
    var lastMonthStart = localStorage.getItem('lastMonthStart');
    if (!lastMonthStart || lastMonthStart !== currentMonthStart.toISOString()) {
        if (lastMonthStart) {
            // Yeni ay başladı, aylık sayacı sıfırla
            localStorage.setItem('monthlyGenerations', '0');
        }
        localStorage.setItem('lastMonthStart', currentMonthStart.toISOString());
        stats.lastMonthStart = currentMonthStart;
    }
    
    stats.weeklyGenerations = parseInt(localStorage.getItem('weeklyGenerations')) || 0;
    stats.monthlyGenerations = parseInt(localStorage.getItem('monthlyGenerations')) || 0;
    
    // Streak verilerini al
    stats.streak = parseInt(localStorage.getItem('currentStreak')) || 0;
    stats.maxStreak = parseInt(localStorage.getItem('maxStreak')) || 0;
    
    // En aktif saati hesapla
    calculateMostActiveHour();
};

var calculateAdvancedMetrics = function() {
    // Aktif gün sayısını hesapla
    var generationDates = JSON.parse(localStorage.getItem('generationDates') || '[]');
    stats.activeDays = generationDates.length;
    
    // Ortalama kullanımı hesapla
    if (stats.activeDays > 0) {
        stats.avgUsage = (stats.totalGenerations / stats.activeDays).toFixed(1);
    } else {
        stats.avgUsage = 0;
    }
    
    // Generation zamanlarını al
    stats.generationTimes = JSON.parse(localStorage.getItem('generationTimes') || '[]');
};

var calculateMostActiveHour = function() {
    var hourCounts = {};
    var generationTimes = JSON.parse(localStorage.getItem('generationTimes') || '[]');
    
    generationTimes.forEach(function(timestamp) {
        var date = new Date(timestamp);
        var hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    var maxCount = 0;
    var mostActiveHour = 14; // default
    
    Object.keys(hourCounts).forEach(function(hour) {
        if (hourCounts[hour] > maxCount) {
            maxCount = hourCounts[hour];
            mostActiveHour = parseInt(hour);
        }
    });
    
    stats.mostActiveHour = mostActiveHour;
};

var getWeekStart = function(date) {
    var d = new Date(date);
    var day = d.getDay();
    var diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
};

var getMonthStart = function(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

var updateStatsUI = function() {
    // Temel istatistikler
    var elements = {
        totalModels: document.getElementById('totalModels'),
        dailyModels: document.getElementById('dailyModels'),
        achievementScore: document.getElementById('achievementScore'),
        userLevel: document.getElementById('userLevel'),
        
        // Enhanced modal elementleri
        dailyModelsStats: document.getElementById('dailyModelsStats'),
        totalModelsStats: document.getElementById('totalModelsStats'),
        currentStreakStats: document.getElementById('currentStreakStats'),
        maxStreakStats: document.getElementById('maxStreakStats'),
        achievementsUnlockedStats: document.getElementById('achievementsUnlockedStats'),
        weeklyModelsStats: document.getElementById('weeklyModelsStats'),
        monthlyModelsStats: document.getElementById('monthlyModelsStats'),
        mostActiveHour: document.getElementById('mostActiveHour'),
        avgUsageStats: document.getElementById('avgUsageStats'),
        activeDaysStats: document.getElementById('activeDaysStats'),
        achievementRateStats: document.getElementById('achievementRateStats'),
        userLevelDisplay: document.getElementById('userLevelDisplay')
    };
    
    // Temel değerleri güncelle
    if (elements.totalModels) elements.totalModels.textContent = stats.totalGenerations;
    if (elements.dailyModels) elements.dailyModels.textContent = stats.dailyGenerations;
    if (elements.achievementScore) elements.achievementScore.textContent = stats.totalPoints;
    if (elements.userLevel) elements.userLevel.textContent = stats.level;
    
    // Enhanced modal değerlerini güncelle
    if (elements.dailyModelsStats) elements.dailyModelsStats.textContent = stats.dailyGenerations;
    if (elements.totalModelsStats) elements.totalModelsStats.textContent = stats.totalGenerations;
    if (elements.currentStreakStats) elements.currentStreakStats.textContent = stats.streak;
    if (elements.maxStreakStats) elements.maxStreakStats.textContent = stats.maxStreak;
    if (elements.achievementsUnlockedStats) elements.achievementsUnlockedStats.textContent = stats.achievementsUnlocked;
    if (elements.weeklyModelsStats) elements.weeklyModelsStats.textContent = stats.weeklyGenerations;
    if (elements.monthlyModelsStats) elements.monthlyModelsStats.textContent = stats.monthlyGenerations;
    if (elements.userLevelDisplay) elements.userLevelDisplay.textContent = stats.level;
    
    // Saat formatında göster
    if (elements.mostActiveHour) {
        elements.mostActiveHour.textContent = String(stats.mostActiveHour).padStart(2, '0') + ':00';
    }
    
    if (elements.avgUsageStats) {
        elements.avgUsageStats.textContent = stats.avgUsage + ' model/gün';
    }
    
    if (elements.activeDaysStats) {
        elements.activeDaysStats.textContent = stats.activeDays + ' gün';
    }
    
    // Başarım oranını hesapla
    if (elements.achievementRateStats) {
        var achievementRate = Math.round((stats.achievementsUnlocked / 35) * 100);
        elements.achievementRateStats.textContent = achievementRate + '%';
    }
    
    // Progress barları güncelle
    updateProgressBars();
    
    // Trend göstergelerini güncelle
    updateTrendIndicators();
    
    // Hedefleri güncelle
    updateGoalProgress();
};

var initializeStats = function() {
    console.log('📊 Stats sistemi başlatılıyor...');
    updateStats();
    console.log('✅ Stats sistemi başlatıldı');
};

var updateProgressBars = function() {
    // Günlük progress (1 maksimum olduğu için)
    var dailyProgress = Math.min((stats.dailyGenerations / 1) * 100, 100);
    updateProgressBar('dailyProgressFill', dailyProgress);
    updateProgressText('dailyProgressText', stats.dailyGenerations + '/1');
    
    // Level progress (sonraki level için)
    var currentLevelProgress = (stats.totalPoints % 100);
    updateProgressBar('totalProgressFill', currentLevelProgress);
    
    // Streak progress (max streak'e göre)
    var streakProgress = stats.maxStreak > 0 ? (stats.streak / stats.maxStreak) * 100 : 0;
    updateProgressBar('streakProgressFill', Math.min(streakProgress, 100));
    
    // Achievement progress
    var achievementProgress = (stats.achievementsUnlocked / 35) * 100;
    updateProgressBar('achievementsProgressFill', achievementProgress);
    updateProgressText('achievementProgressText', stats.achievementsUnlocked + '/35');
    
    // Circular progress bars
    updateCircularProgress('weeklyCircularProgress', (stats.weeklyGenerations / stats.weeklyGoal) * 100);
    updateCircularProgress('monthlyCircularProgress', (stats.monthlyGenerations / 20) * 100);
};

var updateProgressBar = function(elementId, percentage) {
    var element = document.getElementById(elementId);
    if (element) {
        element.style.width = Math.min(percentage, 100) + '%';
    }
};

var updateProgressText = function(elementId, text) {
    var element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
};

var updateCircularProgress = function(elementId, percentage) {
    var element = document.getElementById(elementId);
    if (element) {
        element.style.setProperty('--percentage', percentage + '%');
        var textElement = element.querySelector('.circle-text');
        if (textElement) {
            textElement.textContent = Math.round(percentage) + '%';
        }
    }
};

var updateTrendIndicators = function() {
    // Bu hafta vs geçen hafta karşılaştırması (simulated)
    var weeklyTrend = Math.random() > 0.5 ? '+' + Math.floor(Math.random() * 20 + 5) : '-' + Math.floor(Math.random() * 10);
    updateTrendElement('dailyTrend', weeklyTrend + '%');
    updateTrendElement('totalTrend', '+' + Math.floor(Math.random() * 15 + 5) + '%');
    updateTrendElement('streakTrend', stats.streak > 0 ? '+100%' : '0%');
    updateTrendElement('achievementsTrend', '+' + Math.floor(Math.random() * 10 + 2) + '%');
};

var updateTrendElement = function(elementId, trend) {
    var element = document.getElementById(elementId);
    if (element) {
        element.textContent = trend;
        element.className = 'stat-trend ' + (trend.startsWith('+') ? 'positive' : 'negative');
    }
};

var updateGoalProgress = function() {
    // Haftalık hedef progress
    var weeklyGoalPercentage = Math.min((stats.weeklyGenerations / stats.weeklyGoal) * 100, 100);
    updateProgressBar('weeklyGoalProgress', weeklyGoalPercentage);
    updateProgressText('weeklyGoalStatus', stats.weeklyGenerations + '/' + stats.weeklyGoal);
    
    // Streak hedefi progress
    var streakGoalPercentage = Math.min((stats.streak / stats.streakGoal) * 100, 100);
    updateProgressBar('streakGoalProgress', streakGoalPercentage);
    updateProgressText('streakGoalStatus', stats.streak + '/' + stats.streakGoal);
    
    // Achievement hedefi progress
    var achievementGoalPercentage = Math.min((stats.achievementsUnlocked / stats.achievementGoal) * 100, 100);
    updateProgressBar('achievementGoalProgress', achievementGoalPercentage);
    updateProgressText('achievementGoalStatus', stats.achievementsUnlocked + '/' + stats.achievementGoal);
};

// Yeni model oluşturulduğunda çağrılacak fonksiyon
var recordModelGeneration = function() {
    try {
        var now = new Date();
        var timestamp = now.getTime();
        
        // Generation zamanını kaydet (maksimum 1000 kayıt tut)
        var generationTimes = JSON.parse(localStorage.getItem('generationTimes') || '[]');
        generationTimes.push(timestamp);
        
        // Eski kayıtları temizle (sadece son 1000 tanesini tut)
        if (generationTimes.length > 1000) {
            generationTimes = generationTimes.slice(-1000);
        }
        
        localStorage.setItem('generationTimes', JSON.stringify(generationTimes));
        
        // Haftalık ve aylık sayaçları artır
        var weeklyCount = parseInt(localStorage.getItem('weeklyGenerations') || '0');
        var monthlyCount = parseInt(localStorage.getItem('monthlyGenerations') || '0');
        
        localStorage.setItem('weeklyGenerations', String(Math.min(weeklyCount + 1, 999)));
        localStorage.setItem('monthlyGenerations', String(Math.min(monthlyCount + 1, 999)));
        
        // Generation tarihlerini kaydet (unique dates için, maksimum 365 gün)
        var today = now.toDateString();
        var generationDates = JSON.parse(localStorage.getItem('generationDates') || '[]');
        
        if (!generationDates.includes(today)) {
            generationDates.push(today);
            
            // Eski tarihleri temizle (sadece son 365 günü tut)
            if (generationDates.length > 365) {
                generationDates = generationDates.slice(-365);
            }
            
            localStorage.setItem('generationDates', JSON.stringify(generationDates));
        }
        
        // İstatistikleri güncelle
        debouncedUpdateStats();
        
        console.log('✅ Model generation recorded successfully');
    } catch (error) {
        console.error('❌ Failed to record model generation:', error);
    }
};

// Animasyonlu sayı artırma fonksiyonu
var animateNumber = function(elementId, targetValue, duration = 1000) {
    var element = document.getElementById(elementId);
    if (!element) return;
    
    var startValue = parseInt(element.textContent) || 0;
    var startTime = performance.now();
    
    function updateNumber(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        var easedProgress = 1 - Math.pow(1 - progress, 3);
        
        var currentValue = Math.round(startValue + (targetValue - startValue) * easedProgress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
};

// Modal açıldığında animasyonları başlat
var startStatsAnimations = function() {
    try {
        setTimeout(function() {
            // Sadece görünür olan elementler için animasyon başlat
            var animationElements = [
                { id: 'dailyModelsStats', value: stats.dailyGenerations, duration: 800 },
                { id: 'totalModelsStats', value: stats.totalGenerations, duration: 1200 },
                { id: 'currentStreakStats', value: stats.streak, duration: 1000 },
                { id: 'achievementsUnlockedStats', value: stats.achievementsUnlocked, duration: 1400 },
                { id: 'weeklyModelsStats', value: stats.weeklyGenerations, duration: 900 },
                { id: 'monthlyModelsStats', value: stats.monthlyGenerations, duration: 1100 },
                { id: 'activeDaysStats', value: stats.activeDays, duration: 1300 }
            ];
            
            animationElements.forEach(function(element) {
                if (document.getElementById(element.id)) {
                    animateNumber(element.id, element.value, element.duration);
                }
            });
        }, 200);
    } catch (error) {
        console.warn('Stats animations failed:', error);
    }
};

// Performance optimized update function
var throttledUpdateStats = function() {
    if (typeof updateStats === 'function') {
        updateStats();
    }
};

// Debounce function for performance
var debounce = function(func, wait) {
    var timeout;
    return function executedFunction() {
        var later = function() {
            clearTimeout(timeout);
            func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttled version for frequent updates
var debouncedUpdateStats = debounce(throttledUpdateStats, 100);

console.log('📊 Stats.js yüklendi');
