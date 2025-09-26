/*
=========================================
3D FLICK - ACHIEVEMENT SYSTEM
=========================================
Kapsamlı başarım sistemi - 35+ başarım
*/

/*
-----------------------------------------
BAŞARIM VERİLERİ
-----------------------------------------
*/

var achievements = {
    // Temel Başarımlar (1-10)
    first_generation: {
        id: 'first_generation',
        title: '🎯 İlk Adım',
        description: 'İlk 3D modelini oluştur',
        icon: '🎯',
        requirement: 1,
        type: 'generation',
        points: 10,
        unlocked: false
    },
    
    generation_5: {
        id: 'generation_5',
        title: '🔥 Hızlı Başlangıç',
        description: '5 model oluştur',
        icon: '🔥',
        requirement: 5,
        type: 'generation',
        points: 25,
        unlocked: false
    },
    
    generation_10: {
        id: 'generation_10',
        title: '⚡ Enerji Bombası',
        description: '10 model oluştur',
        icon: '⚡',
        requirement: 10,
        type: 'generation',
        points: 50,
        unlocked: false
    },
    
    generation_25: {
        id: 'generation_25',
        title: '💎 Değerli Koleksiyon',
        description: '25 model oluştur',
        icon: '💎',
        requirement: 25,
        type: 'generation',
        points: 100,
        unlocked: false
    },
    
    generation_50: {
        id: 'generation_50',
        title: '👑 Kraliyet Koleksiyonu',
        description: '50 model oluştur',
        icon: '👑',
        requirement: 50,
        type: 'generation',
        points: 200,
        unlocked: false
    },
    
    generation_100: {
        id: 'generation_100',
        title: '🌟 Yıldız Üreticisi',
        description: '100 model oluştur',
        icon: '🌟',
        requirement: 100,
        type: 'generation',
        points: 500,
        unlocked: false
    },
    
    generation_250: {
        id: 'generation_250',
        title: '🚀 Galaktik Üretici',
        description: '250 model oluştur',
        icon: '🚀',
        requirement: 250,
        type: 'generation',
        points: 1000,
        unlocked: false
    },
    
    generation_500: {
        id: 'generation_500',
        title: '💫 Evrensel Master',
        description: '500 model oluştur',
        icon: '💫',
        requirement: 500,
        type: 'generation',
        points: 2500,
        unlocked: false
    },
    
    generation_1000: {
        id: 'generation_1000',
        title: '🌌 Sonsuzluk Efendisi',
        description: '1000 model oluştur',
        icon: '🌌',
        requirement: 1000,
        type: 'generation',
        points: 5000,
        unlocked: false
    },
    
    daily_streak_7: {
        id: 'daily_streak_7',
        title: '📅 Haftalık Düzenli',
        description: '7 gün üst üste model oluştur',
        icon: '📅',
        requirement: 7,
        type: 'streak',
        points: 150,
        unlocked: false
    },
    
    // Hız Başarımları (11-15)
    speed_demon: {
        id: 'speed_demon',
        title: '⚡ Hız Canavarı',
        description: '10 saniyede 5 model oluştur',
        icon: '⚡',
        requirement: 5,
        type: 'speed',
        points: 75,
        unlocked: false
    },
    
    lightning_fast: {
        id: 'lightning_fast',
        title: '🌩️ Şimşek Hızı',
        description: '1 dakikada 10 model oluştur',
        icon: '🌩️',
        requirement: 10,
        type: 'speed_minute',
        points: 100,
        unlocked: false
    },
    
    rapid_fire: {
        id: 'rapid_fire',
        title: '💥 Rapid Fire',
        description: '30 saniyede 8 model oluştur',
        icon: '💥',
        requirement: 8,
        type: 'rapid',
        points: 125,
        unlocked: false
    },
    
    time_master: {
        id: 'time_master',
        title: '⏰ Zaman Efendisi',
        description: 'Aynı dakika içinde 15 model oluştur',
        icon: '⏰',
        requirement: 15,
        type: 'time_master',
        points: 200,
        unlocked: false
    },
    
    combo_master: {
        id: 'combo_master',
        title: '🔗 Kombo Master',
        description: '20 model combo yap',
        icon: '🔗',
        requirement: 20,
        type: 'combo',
        points: 150,
        unlocked: false
    },
    
    // Özel Başarımlar (16-25)
    night_owl: {
        id: 'night_owl',
        title: '🦉 Gece Baykuşu',
        description: 'Gece yarısından sonra model oluştur',
        icon: '🦉',
        requirement: 1,
        type: 'night',
        points: 50,
        unlocked: false
    },
    
    early_bird: {
        id: 'early_bird',
        title: '🐦 Erken Kuş',
        description: 'Sabah 6\'dan önce model oluştur',
        icon: '🐦',
        requirement: 1,
        type: 'early',
        points: 50,
        unlocked: false
    },
    
    weekend_warrior: {
        id: 'weekend_warrior',
        title: '⚔️ Hafta Sonu Savaşçısı',
        description: 'Hafta sonu 50 model oluştur',
        icon: '⚔️',
        requirement: 50,
        type: 'weekend',
        points: 200,
        unlocked: false
    },
    
    theme_switcher: {
        id: 'theme_switcher',
        title: '🎨 Tema Değiştirici',
        description: '10 kere tema değiştir',
        icon: '🎨',
        requirement: 10,
        type: 'theme',
        points: 75,
        unlocked: false
    },
    
    sound_explorer: {
        id: 'sound_explorer',
        title: '🔊 Ses Kaşifi',
        description: 'Tüm ses efektlerini dene',
        icon: '🔊',
        requirement: 5,
        type: 'sound',
        points: 50,
        unlocked: false
    },
    
    perfectionist: {
        id: 'perfectionist',
        title: '✨ Mükemmeliyetçi',
        description: 'Hiç hata yapmadan 100 model oluştur',
        icon: '✨',
        requirement: 100,
        type: 'perfect',
        points: 300,
        unlocked: false
    },
    
    explorer: {
        id: 'explorer',
        title: '🗺️ Kaşif',
        description: 'Tüm özellikleri keşfet',
        icon: '🗺️',
        requirement: 10,
        type: 'explore',
        points: 100,
        unlocked: false
    },
    
    social_butterfly: {
        id: 'social_butterfly',
        title: '🦋 Sosyal Kelebek',
        description: '10 kere paylaş',
        icon: '🦋',
        requirement: 10,
        type: 'share',
        points: 75,
        unlocked: false
    },
    
    data_lover: {
        id: 'data_lover',
        title: '📊 Veri Aşığı',
        description: 'İstatistikleri 50 kere kontrol et',
        icon: '📊',
        requirement: 50,
        type: 'stats',
        points: 50,
        unlocked: false
    },
    
    persistent: {
        id: 'persistent',
        title: '💪 Kararlı',
        description: '7 gün üst üste siteyi ziyaret et',
        icon: '💪',
        requirement: 7,
        type: 'persistent',
        points: 100,
        unlocked: false
    },
    
    // Efsanevi Başarımlar (26-35)
    legendary_creator: {
        id: 'legendary_creator',
        title: '👑 Efsanevi Yaratıcı',
        description: 'Tüm diğer başarımları aç',
        icon: '👑',
        requirement: 34,
        type: 'legendary',
        points: 1000,
        unlocked: false
    },
    
    model_rain: {
        id: 'model_rain',
        title: '🌧️ Model Yağmuru',
        description: '1 saatte 100 model oluştur',
        icon: '🌧️',
        requirement: 100,
        type: 'hour_challenge',
        points: 500,
        unlocked: false
    },
    
    midnight_madness: {
        id: 'midnight_madness',
        title: '🌙 Gece Yarısı Çılgınlığı',
        description: 'Gece yarısında 25 model oluştur',
        icon: '🌙',
        requirement: 25,
        type: 'midnight',
        points: 200,
        unlocked: false
    },
    
    power_user: {
        id: 'power_user',
        title: '⚡ Güç Kullanıcısı',
        description: 'Tüm kısayol tuşlarını kullan',
        icon: '⚡',
        requirement: 10,
        type: 'power',
        points: 150,
        unlocked: false
    },
    
    achievement_hunter: {
        id: 'achievement_hunter',
        title: '🏆 Başarım Avcısı',
        description: '20 başarım aç',
        icon: '🏆',
        requirement: 20,
        type: 'hunter',
        points: 250,
        unlocked: false
    },
    
    dedication: {
        id: 'dedication',
        title: '🎯 Adanmışlık',
        description: '30 gün üst üste aktif ol',
        icon: '🎯',
        requirement: 30,
        type: 'dedication',
        points: 500,
        unlocked: false
    },
    
    speed_legend: {
        id: 'speed_legend',
        title: '🚄 Hız Efsanesi',
        description: '1 saniyede model oluştur',
        icon: '🚄',
        requirement: 1,
        type: 'speed_legend',
        points: 300,
        unlocked: false
    },
    
    model_storm: {
        id: 'model_storm',
        title: '⛈️ Model Fırtınası',
        description: '5 dakikada 50 model oluştur',
        icon: '⛈️',
        requirement: 50,
        type: 'storm',
        points: 400,
        unlocked: false
    },
    
    infinity_user: {
        id: 'infinity_user',
        title: '♾️ Sonsuzluk Kullanıcısı',
        description: '2500 model oluştur',
        icon: '♾️',
        requirement: 2500,
        type: 'generation',
        points: 10000,
        unlocked: false
    },
    
    ultimate_master: {
        id: 'ultimate_master',
        title: '🌟 Nihai Master',
        description: 'Mükemmel skor ile 500 model oluştur',
        icon: '🌟',
        requirement: 500,
        type: 'ultimate',
        points: 2500,
        unlocked: false
    }
};

/*
-----------------------------------------
BAŞARIM FONKSİYONLARI
-----------------------------------------
*/

var unlockedAchievements = [];
var achievementStats = {
    totalPoints: 0,
    unlockedCount: 0,
    comboCount: 0,
    lastUnlockTime: 0
};

/**
 * LocalStorage'dan başarımları yükle
 */
var loadAchievements = function() {
    try {
        var saved = localStorage.getItem('achievements');
        if (saved) {
            var parsed = JSON.parse(saved);
            unlockedAchievements = parsed.unlocked || [];
            achievementStats = Object.assign(achievementStats, parsed.stats || {});
            
            // Unlock status'ları güncelle
            unlockedAchievements.forEach(function(id) {
                if (achievements[id]) {
                    achievements[id].unlocked = true;
                }
            });
        }
    } catch(e) {
        console.error('Achievement yükleme hatası:', e);
    }
};

/**
 * Başarımları kaydet
 */
var saveAchievements = function() {
    try {
        var data = {
            unlocked: unlockedAchievements,
            stats: achievementStats
        };
        localStorage.setItem('achievements', JSON.stringify(data));
    } catch(e) {
        console.error('Achievement kaydetme hatası:', e);
    }
};

/**
 * Başarım açma
 */
var unlockAchievement = function(achievementId) {
    if (!achievements[achievementId] || achievements[achievementId].unlocked) {
        return false;
    }
    
    achievements[achievementId].unlocked = true;
    unlockedAchievements.push(achievementId);
    
    achievementStats.unlockedCount++;
    achievementStats.totalPoints += achievements[achievementId].points;
    achievementStats.lastUnlockTime = Date.now();
    
    saveAchievements();
    
    // Başarım popup'ı göster
    showAchievementPopup(achievements[achievementId]);
    
    // Ses efekti çal
    if (typeof playSound === 'function') {
        playSound('achievement');
    }
    
    console.log('🏆 Başarım açıldı:', achievementId);
    return true;
};

/**
 * Başarım popup'ı göster
 */
var showAchievementPopup = function(achievement) {
    // Popup elementi oluştur
    var popup = document.createElement('div');
    popup.className = 'achievement-popup show';
    popup.innerHTML = `
        <div class="achievement-popup-content">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} puan</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // 3 saniye sonra kaldır
    setTimeout(function() {
        popup.classList.remove('show');
        setTimeout(function() {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 500);
    }, 3000);
};

/**
 * Başarım kontrolü yap
 */
var checkAchievement = function(type, value) {
    Object.keys(achievements).forEach(function(id) {
        var achievement = achievements[id];
        
        if (achievement.unlocked || achievement.type !== type) {
            return;
        }
        
        var shouldUnlock = false;
        
        switch(type) {
            case 'generation':
                shouldUnlock = value >= achievement.requirement;
                break;
            case 'speed':
            case 'combo':
            case 'theme':
            case 'share':
            case 'stats':
                shouldUnlock = value >= achievement.requirement;
                break;
            case 'night':
                var hour = new Date().getHours();
                shouldUnlock = hour >= 0 && hour < 6;
                break;
            case 'early':
                var hour = new Date().getHours();
                shouldUnlock = hour >= 4 && hour < 8;
                break;
            default:
                return;
        }
        
        if (shouldUnlock) {
            unlockAchievement(id);
        }
    });
};

/**
 * Başarım trigger
 */
var triggerAchievementCheck = function(type, value) {
    checkAchievement(type, value || 1);
    
    // Özel kontroller
    if (type === 'generation') {
        // İlk generation
        if (value === 1) {
            unlockAchievement('first_generation');
        }
        
        // Combo system
        achievementStats.comboCount++;
        if (achievementStats.comboCount >= 20) {
            unlockAchievement('combo_master');
        }
    }
    
    // Legendary achievement kontrolü
    if (achievementStats.unlockedCount >= 34) {
        unlockAchievement('legendary_creator');
    }
    
    updateAchievementDisplay();
};

/**
 * Başarım display'ini güncelle
 */
var updateAchievementDisplay = function() {
    var container = document.getElementById('achievementsGrid');
    var counter = document.getElementById('achievementCount');
    
    if (counter) {
        counter.textContent = achievementStats.unlockedCount;
    }
    
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(achievements).forEach(function(id) {
        var achievement = achievements[id];
        var item = document.createElement('div');
        item.className = 'achievement-item' + (achievement.unlocked ? ' unlocked' : '');
        
        item.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-points">${achievement.points} puan</div>
            </div>
            ${achievement.unlocked ? '<div class="achievement-badge">✅</div>' : ''}
        `;
        
        container.appendChild(item);
    });
};

/**
 * Achievement sistemi başlatma
 */
var initializeAchievementSystem = function() {
    console.log('🏆 Achievement sistemi başlatılıyor...');
    
    loadAchievements();
    updateAchievementDisplay();
    
    console.log('✅ Achievement sistemi başlatıldı');
    console.log('📊 Açılmış başarım sayısı:', achievementStats.unlockedCount);
};

console.log('🏆 Achievements.js yüklendi');
