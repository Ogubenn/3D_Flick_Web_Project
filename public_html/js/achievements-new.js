/**
 * 3D Flick - Achievement System (Modernized)
 * Kapsamlı başarım sistemi - 35+ başarım
 * Yeni app.js sistemiyle uyumlu
 */

class AchievementSystem {
    constructor() {
        this.achievements = {
            // Temel Başarımlar (1-10)
            first_generation: {
                id: 'first_generation',
                name: '🎯 İlk Adım',
                description: 'İlk 3D modelini oluştur',
                icon: '🎯',
                requirement: 1,
                type: 'generation',
                points: 10,
                unlocked: false
            },
            
            generation_5: {
                id: 'generation_5',
                name: '🔥 Hızlı Başlangıç',
                description: '5 model oluştur',
                icon: '🔥',
                requirement: 5,
                type: 'generation',
                points: 25,
                unlocked: false
            },
            
            generation_10: {
                id: 'generation_10',
                name: '⚡ Enerji Bombası',
                description: '10 model oluştur',
                icon: '⚡',
                requirement: 10,
                type: 'generation',
                points: 50,
                unlocked: false
            },
            
            generation_25: {
                id: 'generation_25',
                name: '💎 Değerli Koleksiyon',
                description: '25 model oluştur',
                icon: '💎',
                requirement: 25,
                type: 'generation',
                points: 100,
                unlocked: false
            },
            
            generation_50: {
                id: 'generation_50',
                name: '👑 Kraliyet Koleksiyonu',
                description: '50 model oluştur',
                icon: '👑',
                requirement: 50,
                type: 'generation',
                points: 200,
                unlocked: false
            },
            
            generation_100: {
                id: 'generation_100',
                name: '🌟 Yıldız Üreticisi',
                description: '100 model oluştur',
                icon: '🌟',
                requirement: 100,
                type: 'generation',
                points: 500,
                unlocked: false
            },
            
            generation_250: {
                id: 'generation_250',
                name: '🚀 Galaktik Üretici',
                description: '250 model oluştur',
                icon: '🚀',
                requirement: 250,
                type: 'generation',
                points: 1000,
                unlocked: false
            },
            
            generation_500: {
                id: 'generation_500',
                name: '💫 Evrensel Master',
                description: '500 model oluştur',
                icon: '💫',
                requirement: 500,
                type: 'generation',
                points: 2500,
                unlocked: false
            },
            
            generation_1000: {
                id: 'generation_1000',
                name: '🌌 Sonsuzluk Efendisi',
                description: '1000 model oluştur',
                icon: '🌌',
                requirement: 1000,
                type: 'generation',
                points: 5000,
                unlocked: false
            },
            
            daily_streak_7: {
                id: 'daily_streak_7',
                name: '📅 Haftalık Düzenli',
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
                name: '⚡ Hız Canavarı',
                description: '10 saniyede 5 model oluştur',
                icon: '⚡',
                requirement: 5,
                type: 'speed',
                points: 75,
                unlocked: false
            },
            
            lightning_fast: {
                id: 'lightning_fast',
                name: '🌩️ Şimşek Hızı',
                description: '1 dakikada 10 model oluştur',
                icon: '🌩️',
                requirement: 10,
                type: 'speed_minute',
                points: 100,
                unlocked: false
            },
            
            rapid_fire: {
                id: 'rapid_fire',
                name: '💥 Rapid Fire',
                description: '30 saniyede 8 model oluştur',
                icon: '💥',
                requirement: 8,
                type: 'rapid',
                points: 125,
                unlocked: false
            },
            
            time_master: {
                id: 'time_master',
                name: '⏰ Zaman Efendisi',
                description: 'Aynı dakika içinde 15 model oluştur',
                icon: '⏰',
                requirement: 15,
                type: 'time_master',
                points: 200,
                unlocked: false
            },
            
            combo_master: {
                id: 'combo_master',
                name: '🔗 Kombo Master',
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
                name: '🦉 Gece Baykuşu',
                description: 'Gece yarısından sonra model oluştur',
                icon: '🦉',
                requirement: 1,
                type: 'night',
                points: 50,
                unlocked: false
            },
            
            early_bird: {
                id: 'early_bird',
                name: '🐦 Erken Kuş',
                description: 'Sabah 6\'dan önce model oluştur',
                icon: '🐦',
                requirement: 1,
                type: 'early',
                points: 50,
                unlocked: false
            },
            
            weekend_warrior: {
                id: 'weekend_warrior',
                name: '⚔️ Hafta Sonu Savaşçısı',
                description: 'Hafta sonu 50 model oluştur',
                icon: '⚔️',
                requirement: 50,
                type: 'weekend',
                points: 200,
                unlocked: false
            },
            
            theme_switcher: {
                id: 'theme_switcher',
                name: '🎨 Tema Değiştirici',
                description: '10 kere tema değiştir',
                icon: '🎨',
                requirement: 10,
                type: 'theme',
                points: 75,
                unlocked: false
            },
            
            sound_explorer: {
                id: 'sound_explorer',
                name: '🔊 Ses Kaşifi',
                description: 'Tüm ses efektlerini dene',
                icon: '🔊',
                requirement: 5,
                type: 'sound',
                points: 50,
                unlocked: false
            },
            
            perfectionist: {
                id: 'perfectionist',
                name: '✨ Mükemmeliyetçi',
                description: 'Hiç hata yapmadan 100 model oluştur',
                icon: '✨',
                requirement: 100,
                type: 'perfect',
                points: 300,
                unlocked: false
            },
            
            explorer: {
                id: 'explorer',
                name: '🗺️ Kaşif',
                description: 'Tüm özellikleri keşfet',
                icon: '🗺️',
                requirement: 10,
                type: 'explore',
                points: 100,
                unlocked: false
            },
            
            social_butterfly: {
                id: 'social_butterfly',
                name: '🦋 Sosyal Kelebek',
                description: '10 kere paylaş',
                icon: '🦋',
                requirement: 10,
                type: 'share',
                points: 75,
                unlocked: false
            },
            
            data_lover: {
                id: 'data_lover',
                name: '📊 Veri Aşığı',
                description: 'İstatistikleri 50 kere kontrol et',
                icon: '📊',
                requirement: 50,
                type: 'stats',
                points: 50,
                unlocked: false
            },
            
            persistent: {
                id: 'persistent',
                name: '💪 Kararlı',
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
                name: '👑 Efsanevi Yaratıcı',
                description: 'Tüm diğer başarımları aç',
                icon: '👑',
                requirement: 34,
                type: 'legendary',
                points: 1000,
                unlocked: false
            },
            
            model_rain: {
                id: 'model_rain',
                name: '🌧️ Model Yağmuru',
                description: '1 saatte 100 model oluştur',
                icon: '🌧️',
                requirement: 100,
                type: 'hour_challenge',
                points: 500,
                unlocked: false
            },
            
            midnight_madness: {
                id: 'midnight_madness',
                name: '🌙 Gece Yarısı Çılgınlığı',
                description: 'Gece yarısında 25 model oluştur',
                icon: '🌙',
                requirement: 25,
                type: 'midnight',
                points: 200,
                unlocked: false
            },
            
            power_user: {
                id: 'power_user',
                name: '⚡ Güç Kullanıcısı',
                description: 'Tüm kısayol tuşlarını kullan',
                icon: '⚡',
                requirement: 10,
                type: 'power',
                points: 150,
                unlocked: false
            },
            
            achievement_hunter: {
                id: 'achievement_hunter',
                name: '🏆 Başarım Avcısı',
                description: '20 başarım aç',
                icon: '🏆',
                requirement: 20,
                type: 'hunter',
                points: 250,
                unlocked: false
            },
            
            dedication: {
                id: 'dedication',
                name: '🎯 Adanmışlık',
                description: '30 gün üst üste aktif ol',
                icon: '🎯',
                requirement: 30,
                type: 'dedication',
                points: 500,
                unlocked: false
            },
            
            speed_legend: {
                id: 'speed_legend',
                name: '🚄 Hız Efsanesi',
                description: '1 saniyede model oluştur',
                icon: '🚄',
                requirement: 1,
                type: 'speed_legend',
                points: 300,
                unlocked: false
            },
            
            model_storm: {
                id: 'model_storm',
                name: '⛈️ Model Fırtınası',
                description: '5 dakikada 50 model oluştur',
                icon: '⛈️',
                requirement: 50,
                type: 'storm',
                points: 400,
                unlocked: false
            },
            
            infinity_user: {
                id: 'infinity_user',
                name: '♾️ Sonsuzluk Kullanıcısı',
                description: '2500 model oluştur',
                icon: '♾️',
                requirement: 2500,
                type: 'generation',
                points: 10000,
                unlocked: false
            },
            
            ultimate_master: {
                id: 'ultimate_master',
                name: '🌟 Nihai Master',
                description: 'Mükemmel skor ile 500 model oluştur',
                icon: '🌟',
                requirement: 500,
                type: 'ultimate',
                points: 2500,
                unlocked: false
            },

            // Sosyal Medya Başarımları (36-40)
            social_sharer: {
                id: 'social_sharer',
                name: '📱 Sosyal Paylaşımcı',
                description: 'İlk modelini sosyal medyada paylaş',
                icon: '📱',
                requirement: 1,
                type: 'social',
                points: 50,
                unlocked: false
            },

            viral_creator: {
                id: 'viral_creator',
                name: '🔥 Viral İçerik Üreticisi',
                description: '10 model paylaş',
                icon: '🔥',
                requirement: 10,
                type: 'social',
                points: 200,
                unlocked: false
            },

            influencer: {
                id: 'influencer',
                name: '🌟 Influencer',
                description: '50 model paylaş',
                icon: '🌟',
                requirement: 50,
                type: 'social',
                points: 500,
                unlocked: false
            },

            // Teknoloji Başarımları (41-45)
            mobile_user: {
                id: 'mobile_user',
                name: '📱 Mobil Kullanıcı',
                description: 'Mobil cihazdan 10 model oluştur',
                icon: '📱',
                requirement: 10,
                type: 'mobile',
                points: 100,
                unlocked: false
            },

            browser_explorer: {
                id: 'browser_explorer',
                name: '🌐 Tarayıcı Gezgini',
                description: '3 farklı tarayıcıda siteyi kullan',
                icon: '🌐',
                requirement: 3,
                type: 'browser',
                points: 150,
                unlocked: false
            },

            // Özel Event Başarımları (46-55)
            birthday_creator: {
                id: 'birthday_creator',
                name: '🎂 Doğum Günü Yaratıcısı',
                description: 'Doğum gününde model oluştur',
                icon: '🎂',
                requirement: 1,
                type: 'special_date',
                points: 300,
                unlocked: false
            },

            new_year_starter: {
                id: 'new_year_starter',
                name: '🎊 Yeni Yıl Başlangıcı',
                description: 'Yeni yılın ilk modelini oluştur',
                icon: '🎊',
                requirement: 1,
                type: 'special_date',
                points: 500,
                unlocked: false
            },

            holiday_spirit: {
                id: 'holiday_spirit',
                name: '🎄 Tatil Ruhu',
                description: 'Yılbaşı/Bayram günlerinde model oluştur',
                icon: '🎄',
                requirement: 1,
                type: 'special_date',
                points: 250,
                unlocked: false
            },

            valentine_creator: {
                id: 'valentine_creator',
                name: '💝 Sevgililer Günü Yaratıcısı',
                description: '14 Şubat\'ta model oluştur',
                icon: '💝',
                requirement: 1,
                type: 'special_date',
                points: 200,
                unlocked: false
            },

            // Gelişmiş Streak Başarımları (56-60)
            streak_master_30: {
                id: 'streak_master_30',
                name: '🔥 Aylık Streak',
                description: '30 gün üst üste model oluştur',
                icon: '🔥',
                requirement: 30,
                type: 'streak',
                points: 1000,
                unlocked: false
            },

            streak_legend_100: {
                id: 'streak_legend_100',
                name: '👑 Streak Efsanesi',
                description: '100 gün üst üste model oluştur',
                icon: '👑',
                requirement: 100,
                type: 'streak',
                points: 5000,
                unlocked: false
            },

            // Premium/VIP Başarımları (61-65)
            premium_user: {
                id: 'premium_user',
                name: '💎 Premium Üye',
                description: 'Premium üyelik satın al',
                icon: '💎',
                requirement: 1,
                type: 'premium',
                points: 500,
                unlocked: false
            },

            supporter: {
                id: 'supporter',
                name: '❤️ Site Destekçisi',
                description: 'Siteye bağış yap veya destek ol',
                icon: '❤️',
                requirement: 1,
                type: 'support',
                points: 1000,
                unlocked: false
            },

            // Bug Hunter & Feedback (66-70)
            bug_hunter: {
                id: 'bug_hunter',
                name: '🐛 Bug Avcısı',
                description: 'Bir bug rapor et',
                icon: '🐛',
                requirement: 1,
                type: 'feedback',
                points: 300,
                unlocked: false
            },

            feedback_provider: {
                id: 'feedback_provider',
                name: '💡 Geri Bildirim Sağlayıcı',
                description: '5 geri bildirim gönder',
                icon: '💡',
                requirement: 5,
                type: 'feedback',
                points: 500,
                unlocked: false
            },

            feature_requester: {
                id: 'feature_requester',
                name: '🚀 Özellik Talep Edicisi',
                description: 'Yeni özellik öner',
                icon: '🚀',
                requirement: 1,
                type: 'feedback',
                points: 200,
                unlocked: false
            },

            // STL Yükleme Başarımları (71-80)
            first_upload: {
                id: 'first_upload',
                name: '📤 İlk Yükleme',
                description: 'İlk STL figürünü yükle',
                icon: '📤',
                requirement: 1,
                type: 'upload',
                points: 100,
                unlocked: false
            },

            upload_streak_3: {
                id: 'upload_streak_3',
                name: '🔥 Yükleme Serisi',
                description: '3 gün üst üste STL yükle',
                icon: '🔥',
                requirement: 3,
                type: 'upload_streak',
                points: 150,
                unlocked: false
            },

            upload_master_10: {
                id: 'upload_master_10',
                name: '🎯 Yükleme Ustası',
                description: '10 STL figürü yükle',
                icon: '🎯',
                requirement: 10,
                type: 'upload',
                points: 250,
                unlocked: false
            },

            upload_expert_25: {
                id: 'upload_expert_25',
                name: '🏆 Yükleme Uzmanı',
                description: '25 STL figürü yükle',
                icon: '🏆',
                requirement: 25,
                type: 'upload',
                points: 500,
                unlocked: false
            },

            upload_legend_50: {
                id: 'upload_legend_50',
                name: '👑 Yükleme Efsanesi',
                description: '50 STL figürü yükle',
                icon: '👑',
                requirement: 50,
                type: 'upload',
                points: 1000,
                unlocked: false
            },

            upload_champion_100: {
                id: 'upload_champion_100',
                name: '⭐ Yükleme Şampiyonu',
                description: '100 STL figürü yükle',
                icon: '⭐',
                requirement: 100,
                type: 'upload',
                points: 2000,
                unlocked: false
            },

            big_file_uploader: {
                id: 'big_file_uploader',
                name: '📏 Büyük Dosya Uzmanı',
                description: '10MB üzeri STL dosyası yükle',
                icon: '📏',
                requirement: 1,
                type: 'upload_size',
                points: 200,
                unlocked: false
            },

            daily_limit_master: {
                id: 'daily_limit_master',
                name: '💯 Günlük Limit Ustası',
                description: 'Günlük limiti 5 kez doldur',
                icon: '💯',
                requirement: 5,
                type: 'daily_limit',
                points: 300,
                unlocked: false
            },

            speed_uploader: {
                id: 'speed_uploader',
                name: '⚡ Hızlı Yükleyici',
                description: '1 saatte 5 STL yükle',
                icon: '⚡',
                requirement: 5,
                type: 'speed_upload',
                points: 250,
                unlocked: false
            },

            gallery_organizer: {
                id: 'gallery_organizer',
                name: '🗂️ Galeri Organizatörü',
                description: 'Galerideki dosyaları 10 kez filtrele',
                icon: '🗂️',
                requirement: 10,
                type: 'gallery_usage',
                points: 150,
                unlocked: false
            }
        };
        
        this.stats = {
            totalPoints: 0,
            unlockedCount: 0,
            comboCount: 0,
            lastUnlockTime: 0,
            themeChanges: 0,
            shareCount: 0,
            statsViews: 0
        };
        
        this.storageKey = 'stl_achievements';
        this.init();
    }
    
    init() {
        this.loadAchievements();
        console.log('🏆 Achievement sistemi başlatıldı');
        console.log('📊 Açılmış başarım sayısı:', this.stats.unlockedCount);
    }
    
    // Storage Operations
    loadAchievements() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                
                // Load unlocked achievements
                if (data.unlocked && Array.isArray(data.unlocked)) {
                    data.unlocked.forEach(id => {
                        if (this.achievements[id]) {
                            this.achievements[id].unlocked = true;
                            this.achievements[id].unlockedAt = data.timestamps?.[id] || Date.now();
                        }
                    });
                }
                
                // Load stats
                if (data.stats) {
                    this.stats = { ...this.stats, ...data.stats };
                }
            }
        } catch (e) {
            console.error('Achievement yükleme hatası:', e);
        }
    }
    
    saveAchievements() {
        try {
            const unlockedIds = Object.keys(this.achievements).filter(id => this.achievements[id].unlocked);
            const timestamps = {};
            
            unlockedIds.forEach(id => {
                timestamps[id] = this.achievements[id].unlockedAt;
            });
            
            const data = {
                unlocked: unlockedIds,
                timestamps: timestamps,
                stats: this.stats
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('Achievement kaydetme hatası:', e);
        }
    }
    
    // Achievement Operations
    unlockAchievement(achievementId) {
        if (!this.achievements[achievementId] || this.achievements[achievementId].unlocked) {
            return false;
        }
        
        const achievement = this.achievements[achievementId];
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        
        this.stats.unlockedCount++;
        this.stats.totalPoints += achievement.points;
        this.stats.lastUnlockTime = Date.now();
        
        this.saveAchievements();
        this.showAchievementPopup(achievement);
        
        // Play sound if audio system is available
        if (window.audioManager && window.audioManager.playSound) {
            window.audioManager.playSound('achievement');
        }
        
        console.log('🏆 Başarım açıldı:', achievementId, achievement.name);
        return true;
    }
    
    checkAchievements() {
        const totalGenerated = parseInt(localStorage.getItem('stl_total_generated') || '0');
        
        // Generation achievements
        this.checkGenerationAchievements(totalGenerated);
        
        // Time-based achievements
        this.checkTimeBasedAchievements();
        
        // Special achievements
        this.checkSpecialAchievements();
        
        // Legendary achievement (unlock all others)
        if (this.stats.unlockedCount >= 34) {
            this.unlockAchievement('legendary_creator');
        }
    }
    
    checkGenerationAchievements(total) {
        const generationAchievements = [
            { id: 'first_generation', requirement: 1 },
            { id: 'generation_5', requirement: 5 },
            { id: 'generation_10', requirement: 10 },
            { id: 'generation_25', requirement: 25 },
            { id: 'generation_50', requirement: 50 },
            { id: 'generation_100', requirement: 100 },
            { id: 'generation_250', requirement: 250 },
            { id: 'generation_500', requirement: 500 },
            { id: 'generation_1000', requirement: 1000 },
            { id: 'infinity_user', requirement: 2500 }
        ];
        
        generationAchievements.forEach(({ id, requirement }) => {
            if (total >= requirement) {
                this.unlockAchievement(id);
            }
        });
    }
    
    checkTimeBasedAchievements() {
        const hour = new Date().getHours();
        
        // Night owl (midnight to 6 AM)
        if (hour >= 0 && hour < 6) {
            this.unlockAchievement('night_owl');
        }
        
        // Early bird (4 AM to 8 AM)
        if (hour >= 4 && hour < 8) {
            this.unlockAchievement('early_bird');
        }
    }
    
    checkSpecialAchievements() {
        // Theme switcher
        if (this.stats.themeChanges >= 10) {
            this.unlockAchievement('theme_switcher');
        }
        
        // Social butterfly
        if (this.stats.shareCount >= 10) {
            this.unlockAchievement('social_butterfly');
        }
        
        // Data lover
        if (this.stats.statsViews >= 50) {
            this.unlockAchievement('data_lover');
        }
        
        // Achievement hunter
        if (this.stats.unlockedCount >= 20) {
            this.unlockAchievement('achievement_hunter');
        }
        
        // Daily streak achievements
        const currentStreak = parseInt(localStorage.getItem('daily_streak') || '0');
        if (currentStreak >= 7) {
            this.unlockAchievement('daily_streak_7');
            this.unlockAchievement('persistent');
        }
        if (currentStreak >= 30) {
            this.unlockAchievement('dedication');
        }
    }
    
    // Event Triggers
    onGeneration() {
        this.checkAchievements();
    }
    
    onThemeChange() {
        this.stats.themeChanges++;
        this.saveAchievements();
        this.checkAchievements();
    }
    
    onShare() {
        this.stats.shareCount++;
        this.saveAchievements();
        this.checkAchievements();
    }
    
    onStatsView() {
        this.stats.statsViews++;
        this.saveAchievements();
        this.checkAchievements();
    }
    
    // UI Functions
    showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-content">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <div class="achievement-popup-info">
                    <div class="achievement-popup-title">Başarım Açıldı!</div>
                    <div class="achievement-popup-name">${achievement.name}</div>
                    <div class="achievement-popup-desc">${achievement.description}</div>
                    <div class="achievement-popup-points">+${achievement.points} puan</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Animate in
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        }, 4000);
    }
    
    // Getters for app integration
    getAchievements() {
        return Object.values(this.achievements).map(achievement => ({
            ...achievement,
            unlockedAt: achievement.unlockedAt
        }));
    }
    
    getStats() {
        return { ...this.stats };
    }
    
    getTotalPoints() {
        return this.stats.totalPoints;
    }
    
    getUnlockedCount() {
        return this.stats.unlockedCount;
    }
    
    getTotalCount() {
        return Object.keys(this.achievements).length;
    }
}

// Initialize achievements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.achievements = new AchievementSystem();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}