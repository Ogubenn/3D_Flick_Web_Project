/*
=========================================
3D FLICK - GAMEPLAY SYSTEM
=========================================
Oyun mekaniği ve etkileşimler
*/

var gameplayStats = {
    comboCount: 0,
    lastClickTime: 0,
    clickSpeed: 0
};

var updateComboCount = function() {
    var now = Date.now();
    if (now - gameplayStats.lastClickTime < 2000) { // 2 saniye içinde
        gameplayStats.comboCount++;
    } else {
        gameplayStats.comboCount = 1;
    }
    gameplayStats.lastClickTime = now;
    
    // Combo achievement kontrol et
    if (typeof triggerAchievementCheck === 'function') {
        triggerAchievementCheck('combo', gameplayStats.comboCount);
    }
};

var initializeGameplay = function() {
    console.log('🎮 Gameplay sistemi başlatılıyor...');
    // Gameplay logic buraya eklenebilir
    console.log('✅ Gameplay sistemi başlatıldı');
};

console.log('🎮 Gameplay.js yüklendi');
