/*
=========================================
3D FLICK - UI SYSTEM
=========================================
Kullanıcı arayüzü ve etkileşim yönetimi
*/

/*
-----------------------------------------
UI EVENT HANDLERS
-----------------------------------------
*/

/**
 * UI sistemini başlatma
 */
var initializeUI = function() {
    console.log('🎨 UI sistemi başlatılıyor...');
    
    // Ana buton event listener
    if (elements.mainButton) {
        // Eski listener'ları temizle
        elements.mainButton.removeEventListener('click', handleMainButtonClick);
        
        // Yeni event listener ekle
        elements.mainButton.addEventListener('click', function(e) {
            console.log('Ana buton tıklandı (UI event handler)');
            handleMainButtonClick();
        });
    }
    
    // Tema toggle butonu
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', function(e) {
            console.log('Tema toggle tıklandı');
            toggleTheme();
        });
    }
    
    // Ses toggle butonu
    if (elements.soundToggle) {
        elements.soundToggle.addEventListener('click', function(e) {
            console.log('Ses toggle tıklandı');
            if (typeof toggleSound === 'function') {
                toggleSound();
            }
        });
    }
    
    // Stats toggle butonu
    if (elements.statsToggle) {
        elements.statsToggle.addEventListener('click', function(e) {
            console.log('Stats toggle tıklandı');
            toggleStatsPanel();
        });
    }
    
    // Leaderboard toggle
    var leaderboardToggle = document.getElementById('leaderboardToggle');
    if (leaderboardToggle) {
        leaderboardToggle.addEventListener('click', function(e) {
            console.log('Leaderboard toggle tıklandı');
            // TODO: Implement leaderboard
        });
    }
    
    // Profile toggle
    var profileToggle = document.getElementById('profileToggle');
    if (profileToggle) {
        profileToggle.addEventListener('click', function(e) {
            console.log('Profile toggle tıklandı');
            // TODO: Implement profile
        });
    }
    
    // Download button
    var downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            console.log('Download button tıklandı');
            // TODO: Download last model
        });
    }
    
    // Share button
    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            console.log('Share button tıklandı');
            if (typeof triggerAchievementCheck === 'function') {
                triggerAchievementCheck('share', 1);
            }
            // TODO: Implement sharing
        });
    }
    
    // Modal sistemini başlat
    initializeModals();
    
    console.log('✅ UI event listeners eklendi');
};

/**
 * Modal açma fonksiyonu
 */
var openModal = function(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        setTimeout(function() {
            modal.style.opacity = '1';
        }, 10);
        
        // Modal backdrop'a tıklayınca kapatma
        modal.addEventListener('click', function backdropHandler(e) {
            if (e.target === modal) {
                closeModal(modalId);
                modal.removeEventListener('click', backdropHandler);
            }
        });
        
        console.log('Modal başarıyla açıldı:', modalId);
    } else {
        console.error('Modal bulunamadı:', modalId);
    }
};

/**
 * Modal kapatma fonksiyonu
 */
var closeModal = function(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(function() {
            modal.style.display = 'none';
        }, 300);
        
        console.log('Modal kapatıldı:', modalId);
    }
};

/**
 * Toast notification gösterme
 */
var showToast = function(message, type) {
    type = type || 'info';
    
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animasyonla göster
    setTimeout(function() {
        toast.classList.add('show');
    }, 100);
    
    // 3 saniye sonra kaldır
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
};

/*
-----------------------------------------
MODAL MANAGEMENT - Günlük Limit Konsepti
-----------------------------------------
*/

/**
 * Modal'ları aç/kapat
 */
var openModal = function(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('📋 Modal açıldı:', modalId);
    }
};

var closeModal = function(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(function() {
            modal.style.display = 'none';
        }, 300);
        console.log('📋 Modal kapatıldı:', modalId);
    }
};

/**
 * Modal event listener'larını başlat
 */
var initializeModals = function() {
    console.log('📋 Modal sistemi başlatılıyor...');
    
    // Login modal
    var loginBtn = document.getElementById('loginBtn');
    var loginClose = document.getElementById('loginClose');
    var showRegister = document.getElementById('showRegister');
    var showLogin = document.getElementById('showLogin');
    var registerClose = document.getElementById('registerClose');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            openModal('loginModal');
        });
    }
    
    if (loginClose) {
        loginClose.addEventListener('click', function() {
            closeModal('loginModal');
        });
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', function() {
            closeModal('loginModal');
            openModal('registerModal');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function() {
            closeModal('registerModal');
            openModal('loginModal');
        });
    }
    
    if (registerClose) {
        registerClose.addEventListener('click', function() {
            closeModal('registerModal');
        });
    }
    
    // Achievements modal
    var achievementsBtn = document.getElementById('achievementsBtn');
    var viewAllAchievements = document.getElementById('viewAllAchievements');
    var achievementsClose = document.getElementById('achievementsClose');
    
    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', function() {
            openModal('achievementsModal');
        });
    }
    
    if (viewAllAchievements) {
        viewAllAchievements.addEventListener('click', function() {
            openModal('achievementsModal');
        });
    }
    
    if (achievementsClose) {
        achievementsClose.addEventListener('click', function() {
            closeModal('achievementsModal');
        });
    }
    
    // Help modal
    var helpBtn = document.getElementById('helpBtn');
    var helpClose = document.getElementById('helpClose');
    
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            openModal('helpModal');
        });
    }
    
    if (helpClose) {
        helpClose.addEventListener('click', function() {
            closeModal('helpModal');
        });
    }
    
    // Modal backdrop click to close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            setTimeout(function() {
                e.target.style.display = 'none';
            }, 300);
        }
    });
    
    console.log('✅ Modal sistemi başlatıldı');
};

console.log('🎨 UI.js yüklendi');
