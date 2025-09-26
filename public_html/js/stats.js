/*
=========================================
3D FLICK - STATS SYSTEM
=========================================
İstatistik takibi ve yönetimi
*/

var stats = {
    totalGenerations: 0,
    dailyGenerations: 0,
    lastGenerationDate: null,
    totalPoints: 0,
    level: 1,
    streak: 0
};

var updateStats = function() {
    stats.totalGenerations = parseInt(localStorage.getItem('totalGenerations')) || 0;
    stats.dailyGenerations = parseInt(localStorage.getItem('dailyGenerationCount')) || 0;
    stats.totalPoints = achievementStats ? achievementStats.totalPoints : 0;
    
    // Level hesapla (her 100 puan = 1 level)
    stats.level = Math.floor(stats.totalPoints / 100) + 1;
    
    // UI'ı güncelle
    var elements = {
        totalModels: document.getElementById('totalModels'),
        dailyModels: document.getElementById('dailyModels'),
        achievementScore: document.getElementById('achievementScore'),
        userLevel: document.getElementById('userLevel')
    };
    
    if (elements.totalModels) elements.totalModels.textContent = stats.totalGenerations;
    if (elements.dailyModels) elements.dailyModels.textContent = stats.dailyGenerations;
    if (elements.achievementScore) elements.achievementScore.textContent = stats.totalPoints;
    if (elements.userLevel) elements.userLevel.textContent = stats.level;
};

var initializeStats = function() {
    console.log('📊 Stats sistemi başlatılıyor...');
    updateStats();
    console.log('✅ Stats sistemi başlatıldı');
};

console.log('📊 Stats.js yüklendi');
