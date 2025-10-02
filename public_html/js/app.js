/**
 * 3D Flick - Core Application
 * Modern, clean implementation of daily STL generation
 * Mobile-first, performant, user-friendly
 */

class STLGenerator {
    constructor() {
        this.dailyLimit = 1;
        this.storageKeys = {
            lastGeneration: 'stl_last_generation',
            generatedToday: 'stl_generated_today',
            totalGenerated: 'stl_total_generated',
            achievements: 'stl_achievements'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        
        // Load achievements when ready
        setTimeout(() => {
            this.loadAchievements();
            this.updateAchievementProgress();
        }, 100);
        
        // Update UI every minute to refresh timer
        setInterval(() => this.updateUI(), 60000);
    }

    setupEventListeners() {
        // Main generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateSTL());
        }

        // Quick actions
        const downloadBtn = document.getElementById('downloadBtn');
        const shareBtn = document.getElementById('shareBtn');
        
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadLastSTL());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareSTL());

        // Login & Register buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) loginBtn.addEventListener('click', () => this.showLoginForm());
        if (registerBtn) registerBtn.addEventListener('click', () => this.showRegisterForm());

        // Form switching buttons
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');
        
        if (switchToRegister) switchToRegister.addEventListener('click', () => this.showRegisterForm());
        if (switchToLogin) switchToLogin.addEventListener('click', () => this.showLoginForm());

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));

        // Panel toggles - Enhanced debugging
        const panelButtons = document.querySelectorAll('[data-panel]');
        console.log('🔍 Panel butonları taranıyor... Toplam bulunan:', panelButtons.length);
        console.log('🔍 Tüm data-panel elementleri:', Array.from(panelButtons).map(btn => ({
            id: btn.id,
            panel: btn.dataset.panel,
            text: btn.textContent.trim()
        })));
        
        panelButtons.forEach((btn, index) => {
            console.log(`📋 Panel button ${index + 1}:`, {
                id: btn.id,
                dataset: btn.dataset,
                panelTarget: btn.dataset.panel,
                className: btn.className
            });
            
            btn.addEventListener('click', (e) => {
                console.log('🖱️ PANEL BUTTON TIKLANDI!', {
                    target: e.target,
                    targetId: e.target.id,
                    targetClass: e.target.className,
                    currentTarget: e.currentTarget,
                    currentTargetId: e.currentTarget.id
                });
                
                const clickedElement = e.currentTarget;
                const panelId = clickedElement.dataset.panel;
                
                console.log('🎯 Panel ID belirlendi:', panelId);
                console.log('📍 Dataset içeriği:', clickedElement.dataset);
                
                if (panelId) {
                    console.log('✅ Panel açılıyor:', panelId);
                    this.togglePanel(panelId);
                } else {
                    console.error('❌ Panel ID bulunamadı!', {
                        element: clickedElement,
                        dataset: clickedElement.dataset,
                        attributes: Array.from(clickedElement.attributes).map(attr => ({ name: attr.name, value: attr.value }))
                    });
                }
            });
        });

        // Panel close buttons
        document.querySelectorAll('.panel-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const panel = e.target.closest('.expandable-panel');
                if (panel) {
                    panel.classList.remove('active');
                }
            });
        });

        // Theme toggle - Kaldırıldı

        // Navigation login button
        const navLoginBtn = document.getElementById('navLoginBtn');
        if (navLoginBtn) {
            navLoginBtn.addEventListener('click', () => this.showLoginForm());
        }
    }

    // Core STL Generation
    async generateSTL() {
        if (!this.canGenerateToday()) {
            // Login modalına yönlendir
            this.showLoginModal();
            return;
        }

        const generateBtn = document.getElementById('generateBtn');
        const btnText = generateBtn.querySelector('.btn-primary-text');
        const btnIcon = generateBtn.querySelector('.btn-icon');
        
        // Show loading state
        generateBtn.classList.add('loading');
        if (btnText) btnText.textContent = 'OLUŞTURULUYOR...';
        if (btnIcon) btnIcon.textContent = '⏳';

        try {
            // Generate random STL data
            const stlData = this.createRandomSTL();
            const fileName = this.generateFileName();
            
            // Save to localStorage
            this.saveGeneration(stlData, fileName);
            
            // Update counters
            this.updateGenerationCount();
            
            // Record model generation for enhanced stats
            if (typeof recordModelGeneration === 'function') {
                recordModelGeneration();
            }
            
            // Update UI
            this.updateUI();
            
            // Show success with visual feedback
            generateBtn.classList.add('success');
            setTimeout(() => generateBtn.classList.remove('success'), 800);
            this.showMessage('STL dosyası başarıyla oluşturuldu!', 'success');
            
            // Check achievements
            if (window.achievements) {
                window.achievements.onGeneration();
            }
            
            // Enable quick actions
            this.enableQuickActions();
            
        } catch (error) {
            console.error('🚨 STL generation error:', error);
            this.showMessage('STL oluşturulurken hata oluştu.', 'error');
        } finally {
            // Reset button
            generateBtn.classList.remove('loading');
            if (btnText) btnText.textContent = 'GÜNLÜK MODELİNİ OLUŞTUR';
            if (btnIcon) btnIcon.textContent = '�';
        }
    }

    createRandomSTL() {
        // Simple cube STL generation
        const size = Math.random() * 50 + 10; // 10-60mm cube
        const vertices = [
            [0, 0, 0], [size, 0, 0], [size, size, 0], [0, size, 0], // bottom
            [0, 0, size], [size, 0, size], [size, size, size], [0, size, size]  // top
        ];

        const faces = [
            // Bottom face
            [[0, 1, 2], [0, 2, 3]],
            // Top face  
            [[4, 7, 6], [4, 6, 5]],
            // Front face
            [[0, 4, 5], [0, 5, 1]],
            // Back face
            [[2, 6, 7], [2, 7, 3]],
            // Left face
            [[0, 3, 7], [0, 7, 4]], 
            // Right face
            [[1, 5, 6], [1, 6, 2]]
        ];

        let stlContent = 'solid GeneratedCube\n';
        
        faces.flat().forEach(face => {
            const [v1, v2, v3] = face.map(i => vertices[i]);
            const normal = this.calculateNormal(v1, v2, v3);
            
            stlContent += `  facet normal ${normal.join(' ')}\n`;
            stlContent += '    outer loop\n';
            stlContent += `      vertex ${v1.join(' ')}\n`;
            stlContent += `      vertex ${v2.join(' ')}\n`;
            stlContent += `      vertex ${v3.join(' ')}\n`;
            stlContent += '    endloop\n';
            stlContent += '  endfacet\n';
        });
        
        stlContent += 'endsolid GeneratedCube\n';
        return stlContent;
    }

    calculateNormal(v1, v2, v3) {
        const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
        const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
        
        const normal = [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2], 
            u[0] * v[1] - u[1] * v[0]
        ];
        
        const length = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
        return length > 0 ? normal.map(n => (n/length).toFixed(6)) : [0, 0, 1];
    }

    generateFileName() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
        return `3dflick_${dateStr}_${timeStr}.stl`;
    }

    // Daily Limit System
    canGenerateToday() {
        const lastGen = SecurityUtils.safeLocalStorageGet(this.storageKeys.lastGeneration);
        const generatedToday = parseInt(SecurityUtils.safeLocalStorageGet(this.storageKeys.generatedToday, '0'));
        
        if (!lastGen) return true;
        
        const lastGenDate = new Date(lastGen);
        const today = new Date();
        
        // Reset if different day
        if (!this.isSameDay(lastGenDate, today)) {
            SecurityUtils.safeLocalStorageSet(this.storageKeys.generatedToday, '0');
            return true;
        }
        
        return generatedToday < this.dailyLimit;
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    updateGenerationCount() {
        const now = new Date().toISOString();
        const generatedToday = parseInt(SecurityUtils.safeLocalStorageGet(this.storageKeys.generatedToday, '0'));
        const totalGenerated = parseInt(SecurityUtils.safeLocalStorageGet(this.storageKeys.totalGenerated, '0'));

        SecurityUtils.safeLocalStorageSet(this.storageKeys.lastGeneration, now);
        SecurityUtils.safeLocalStorageSet(this.storageKeys.generatedToday, (generatedToday + 1).toString());
        SecurityUtils.safeLocalStorageSet(this.storageKeys.totalGenerated, (totalGenerated + 1).toString());
    }

    saveGeneration(stlData, fileName) {
        const generation = {
            data: stlData,
            fileName: fileName,
            timestamp: new Date().toISOString(),
            size: stlData.length
        };
        
        SecurityUtils.safeLocalStorageSet('last_stl', generation);
        
        // Save to history (keep last 10)
        const history = SecurityUtils.safeLocalStorageGet('stl_history', []);
        history.unshift(generation);
        if (history.length > 10) history.pop();
        SecurityUtils.safeLocalStorageSet('stl_history', history);
    }

    // UI Updates
    updateUI() {
        this.updateDailyStatus();
        this.updateGenerateButton();
        this.updateStats();
        this.updateTimeToReset();
    }

    updateDailyStatus() {
        const statusCard = document.querySelector('.status-card');
        const dailyStatusText = document.getElementById('dailyStatusText');
        
        const generatedToday = parseInt(SecurityUtils.safeLocalStorageGet(this.storageKeys.generatedToday, '0'));
        const canGenerate = this.canGenerateToday();
        
        if (statusCard) {
            statusCard.className = `status-card ${canGenerate ? 'available' : 'exhausted'}`;
        }
        
        if (dailyStatusText) {
            dailyStatusText.textContent = canGenerate ? 'Hakkınız var!' : 'Günlük limit doldu';
        }
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generateBtn');
        if (!generateBtn) return;
        
        const canGenerate = this.canGenerateToday();
        const btnText = generateBtn.querySelector('.btn-primary-text');
        
        // Buton her zaman aktif kalacak, sadece text değişecek
        generateBtn.disabled = false;
        generateBtn.classList.remove('disabled');
        
        if (btnText) {
            if (canGenerate) {
                btnText.textContent = 'GÜNLÜK MODELİNİ OLUŞTUR';
            } else {
                btnText.textContent = 'DAHA FAZLA MODEL İÇİN';
            }
        }
        
        console.log('🔄 Generate button güncellendi:', { canGenerate, buttonText: btnText?.textContent });
    }

    updateStats() {
        const totalGenerated = SecurityUtils.safeLocalStorageGet(this.storageKeys.totalGenerated, '0');
        const generatedToday = SecurityUtils.safeLocalStorageGet(this.storageKeys.generatedToday, '0');
        
        console.log('📊 Stat güncelleniyor:', { totalGenerated, generatedToday });
        
        // Update various stat displays
        const totalEl = document.getElementById('totalGenerated');
        const totalModelsStatsEl = document.getElementById('totalModelsStats');
        const totalModelsCountEl = document.getElementById('totalModelsCount');
        
        if (totalEl) totalEl.textContent = totalGenerated;
        if (totalModelsStatsEl) totalModelsStatsEl.textContent = totalGenerated;
        if (totalModelsCountEl) {
            totalModelsCountEl.textContent = totalGenerated;
            console.log('✅ Toplam model sayacı güncellendi:', totalGenerated);
        } else {
            console.error('❌ totalModelsCount elementi bulunamadı!');
        }
        
        // Update daily streak if applicable
        this.updateDailyStreak();
    }
    
    updateDailyStreak() {
        const lastGenDate = localStorage.getItem(this.storageKeys.lastGeneration);
        if (!lastGenDate) return;
        
        const currentStreak = parseInt(localStorage.getItem('daily_streak') || '0');
        const lastDate = new Date(lastGenDate);
        const today = new Date();
        
        // Check if we generated today
        if (this.isSameDay(lastDate, today)) {
            // Update streak count if it's a new day compared to yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const lastStreakDate = localStorage.getItem('last_streak_date');
            if (lastStreakDate && this.isSameDay(new Date(lastStreakDate), yesterday)) {
                // Continue streak
                localStorage.setItem('daily_streak', (currentStreak + 1).toString());
                localStorage.setItem('last_streak_date', today.toISOString());
            } else if (!lastStreakDate) {
                // Start new streak
                localStorage.setItem('daily_streak', '1');
                localStorage.setItem('last_streak_date', today.toISOString());
            }
        }
    }

    updateTimeToReset() {
        const timeEl = document.getElementById('countdownTimer');
        const limitTimerEl = document.getElementById('limitCountdownTimer');
        const loginCountdownEl = document.getElementById('loginCountdown');
        
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update all countdown timers with same value
        if (timeEl) timeEl.textContent = timeString;
        if (limitTimerEl) limitTimerEl.textContent = timeString;
        if (loginCountdownEl) loginCountdownEl.textContent = timeString;
        
        console.log('⏰ Countdown timers güncellendi:', timeString);
    }

    // Quick Actions
    downloadLastSTL() {
        const lastSTL = JSON.parse(localStorage.getItem('last_stl') || 'null');
        if (!lastSTL) {
            this.showMessage('İndirilecek STL dosyası bulunamadı.', 'warning');
            return;
        }
        
        const blob = new Blob([lastSTL.data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = lastSTL.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('STL dosyası indirildi.', 'success');
    }

    shareSTL() {
        const lastSTL = JSON.parse(localStorage.getItem('last_stl') || 'null');
        if (!lastSTL) {
            this.showMessage('Paylaşılacak STL dosyası bulunamadı.', 'warning');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: '3D Flick - STL Dosyası',
                text: 'Günlük STL dosyamı kontrol et!',
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showMessage('Link panoya kopyalandı.', 'success');
        }
        
        // Track achievement
        if (window.achievements) {
            window.achievements.onShare();
        }
    }



    loadHistory() {
        const historyContainer = document.getElementById('historyList');
        if (!historyContainer) return;
        
        const history = JSON.parse(localStorage.getItem('stl_history') || '[]');
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="no-data">Henüz STL dosyası oluşturulmamış.</p>';
            return;
        }
        
        historyContainer.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-info">
                    <span class="history-name">${item.fileName}</span>
                    <span class="history-date">${new Date(item.timestamp).toLocaleString('tr-TR')}</span>
                </div>
                <button class="btn btn-sm" onclick="app.downloadHistoryItem('${item.timestamp}')">
                    📥 İndir
                </button>
            </div>
        `).join('');
    }

    downloadHistoryItem(timestamp) {
        const history = JSON.parse(localStorage.getItem('stl_history') || '[]');
        const item = history.find(h => h.timestamp === timestamp);
        
        if (item) {
            const blob = new Blob([item.data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    enableQuickActions() {
        document.querySelectorAll('.quick-actions .btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    // Panel Management
    togglePanel(panelId) {
        console.log('🔄 Panel toggle başlatıldı. Panel ID:', panelId);
        
        const panel = document.getElementById(panelId);
        console.log('🔍 Panel elementi aranıyor...', {
            panelId,
            element: panel,
            found: !!panel
        });
        
        if (!panel) {
            console.error('❌ Panel elementi bulunamadı!', {
                panelId,
                allPanels: Array.from(document.querySelectorAll('.expandable-panel')).map(p => ({
                    id: p.id,
                    classes: p.className
                }))
            });
            return;
        }
        
        const isActive = panel.classList.contains('active');
        console.log('📊 Panel durumu:', {
            panelId,
            isCurrentlyActive: isActive,
            classList: Array.from(panel.classList)
        });
        
        // Close all panels first
        const allPanels = document.querySelectorAll('.expandable-panel');
        console.log('🔄 Tüm paneller kapatılıyor...', allPanels.length, 'panel bulundu');
        allPanels.forEach(p => {
            if (p.classList.contains('active')) {
                console.log('🔒 Panel kapatılıyor:', p.id);
            }
            p.classList.remove('active');
        });
        
        // Toggle current panel
        if (!isActive) {
            console.log('📂 Panel açılıyor:', panelId);
            panel.classList.add('active');
            
            // Verify it was added
            const verifyActive = panel.classList.contains('active');
            console.log('✅ Panel durum doğrulaması:', {
                panelId,
                activeAdded: verifyActive,
                finalClassList: Array.from(panel.classList)
            });
            
            // Scroll to panel smoothly with offset for better visibility
            setTimeout(() => {
                const rect = panel.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetScroll = rect.top + scrollTop - 100; // 100px offset from top
                
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
                console.log('📍 Panel görünümüne kaydırıldı:', panelId);
            }, 100); // Small delay to ensure CSS animation starts
            
            // Load panel content
            switch(panelId) {
                case 'achievementsPanel':
                    console.log('🏆 Başarımlar yükleniyor...');
                    this.loadAchievements();
                    // Track stats viewing
                    if (window.achievements) {
                        window.achievements.onStatsView();
                        console.log('📊 Başarım görüntüleme kaydedildi');
                    }
                    break;
                case 'historyPanel':
                    this.loadHistory();
                    break;
                case 'statsPanel':
                    // Track stats viewing
                    if (window.achievements) {
                        window.achievements.onStatsView();
                    }
                    break;
            }
        }
    }

    // Theme Management - Güncellenmiş ve Anında Çalışan
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('🎨 App.js tema değişimi:', currentTheme, '->', newTheme);
        
        // ANINDA tema değişimi
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Tema butonunu güncelle (eğer varsa)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const newIcon = newTheme === 'dark' ? '☀️' : '🌙';
            const newTitle = newTheme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema';
            
            themeToggle.innerHTML = `<span aria-hidden="true">${newIcon}</span><span class="sr-only">Tema değiştir</span>`;
            themeToggle.setAttribute('aria-label', newTitle);
            themeToggle.title = newTitle;
        }
        
        // Smooth transition için class ekle
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
        
        console.log('✅ App.js tema değişimi tamamlandı:', newTheme);
        
        // Track achievement
        if (window.achievements) {
            window.achievements.onThemeChange();
        }
    }

    // Achievements Integration
    loadAchievements() {
        console.log('🏆 loadAchievements çağrıldı');
        
        const container = document.getElementById('achievementsGrid');
        const unlockedCountEl = document.getElementById('unlockedCount');
        const totalPointsEl = document.getElementById('totalPoints');
        
        console.log('📍 Başarım elementleri:', {
            container: !!container,
            unlockedCountEl: !!unlockedCountEl,
            totalPointsEl: !!totalPointsEl
        });
        
        if (!container) {
            console.error('❌ achievementsGrid container bulunamadı!');
            return;
        }
        
        if (window.achievements && window.achievements.getAchievements) {
            const achievements = window.achievements.getAchievements();
            const stats = window.achievements.getStats();
            
            // Update stats
            const unlockedCount = window.achievements.getUnlockedCount();
            const totalCount = window.achievements.getTotalCount();
            
            if (unlockedCountEl) unlockedCountEl.textContent = unlockedCount;
            if (totalPointsEl) totalPointsEl.textContent = window.achievements.getTotalPoints();
            
            // Update progress indicator
            const progressEl = document.getElementById('achievementProgress');
            if (progressEl) {
                progressEl.textContent = `${unlockedCount}/${totalCount} Açıldı`;
            }
            
            // Render achievements - Tüm başarımları görünür yap
            container.innerHTML = achievements.map(achievement => `
                <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">
                        ${achievement.unlocked ? achievement.icon : `${achievement.icon}`}
                        ${!achievement.unlocked ? '<span class="lock-icon">🔒</span>' : ''}
                    </div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                        ${achievement.unlocked && achievement.unlockedAt ? 
                            `<div class="achievement-date">✅ Kazanıldı: ${new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')}</div>` : 
                            `<div class="achievement-points">🏆 ${achievement.points} puan</div>`
                        }
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="no-data">Başarımlar yükleniyor...</p>';
        }
    }
    
    updateAchievementProgress() {
        if (!window.achievements) return;
        
        const unlockedCount = window.achievements.getUnlockedCount();
        const totalCount = window.achievements.getTotalCount();
        const progressEl = document.getElementById('achievementProgress');
        
        if (progressEl) {
            progressEl.textContent = `${unlockedCount}/${totalCount} Açıldı`;
        }
    }

    // Login Modal System
    showLoginModal() {
        console.log('🔐 Login modal açılıyor...');
        this.togglePanel('loginPanel');
        // Ensure countdown is updated when modal opens
        this.updateTimeToReset();
    }

    showLoginForm() {
        console.log('🔑 Giriş formu açılıyor...');
        this.togglePanel('loginFormPanel');
    }

    showRegisterForm() {
        console.log('📝 Kayıt formu açılıyor...');
        this.togglePanel('registerFormPanel');
    }

    handleLogin(e) {
        e.preventDefault();
        console.log('🔑 Login form submitted');
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        console.log('Login attempt:', { email, passwordLength: password.length });
        
        // Simulate login process
        this.showMessage('Giriş yapılıyor...', 'info');
        
        setTimeout(() => {
            // For demo purposes, always successful
            this.showMessage('Giriş başarılı! Hoş geldiniz!', 'success');
            this.closeAllPanels();
            // Here you would typically redirect or update UI for logged-in state
        }, 2000);
    }

    handleRegister(e) {
        e.preventDefault();
        console.log('📝 Register form submitted');
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = formData.get('agreeTerms');
        
        console.log('Register attempt:', { name, email, passwordLength: password.length, agreeTerms });
        
        // Basic validation
        if (password !== confirmPassword) {
            this.showMessage('Şifreler eşleşmiyor!', 'error');
            return;
        }
        
        if (password.length < 8) {
            this.showMessage('Şifre en az 8 karakter olmalıdır!', 'error');
            return;
        }
        
        if (!agreeTerms) {
            this.showMessage('Kullanım şartlarını kabul etmelisiniz!', 'error');
            return;
        }
        
        // Simulate registration process
        this.showMessage('Hesap oluşturuluyor...', 'info');
        
        setTimeout(() => {
            // For demo purposes, always successful
            this.showMessage('Kayıt başarılı! Hoş geldiniz!', 'success');
            this.closeAllPanels();
            // Here you would typically redirect or update UI for logged-in state
        }, 2000);
    }

    closeAllPanels() {
        document.querySelectorAll('.expandable-panel').forEach(panel => {
            panel.classList.remove('active');
        });
    }

    // Utility Functions
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => messageEl.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => document.body.removeChild(messageEl), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 3D Flick yeni sistemi başlatılıyor...');
    window.app = new STLGenerator();
    
    // Load saved theme - Buton güncellemesi ile birlikte
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Tema butonunu başlangıçta güncelle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = savedTheme === 'dark' ? '☀️' : '🌙';
        const title = savedTheme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema';
        themeToggle.innerHTML = `<span aria-hidden="true">${icon}</span><span class="sr-only">Tema değiştir</span>`;
        themeToggle.setAttribute('aria-label', title);
        themeToggle.title = title;
    }
    console.log('🎨 App.js tema yüklendi:', savedTheme);
    
    // STL Upload sistemini başlat
    console.log('📤 STL Upload sistemi başlatılıyor...');
    window.stlUploadSystem = new STLUploadSystem();
    
    console.log('✅ 3D Flick yeni sistemi başlatıldı!');
});

// Export for global access
window.STLGenerator = STLGenerator;

// ==========================================
// YENİ ÖZELLIK SİSTEMLERİ - 2024
// ==========================================

class EnhancedFeatures {
    constructor() {
        this.stats = JSON.parse(localStorage.getItem('userStats')) || {
            totalGenerations: 0,
            totalTime: 0,
            bestStreak: 0,
            currentStreak: 0,
            lastVisit: Date.now(),
            achievementsUnlocked: 0,
            socialShares: 0,
            registrationDate: Date.now(),
            premiumUser: false
        };
        
        this.init();
    }

    init() {
        this.initThemeToggle();
        this.initNotificationSystem();
        this.initSocialSharing();
        this.updateDailyStreak();
        this.saveStats();
    }

    // Theme Toggle Sistemi - Kaldırıldı
    initThemeToggle() {
        // Tema butonu kaldırıldı, sadece localStorage'dan tema yükle
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.body.setAttribute('data-theme', currentTheme);
    }

    // Bildirim Sistemi
    initNotificationSystem() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        document.body.appendChild(this.notificationContainer);
    }

    showNotification(title, message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌', 
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Animasyon için timeout
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Kapatma butonu
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Otomatik kapatma
        if (duration > 0) {
            setTimeout(() => this.removeNotification(notification), duration);
        }
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

    // İstatistik Sistemi
    updateStats(statName, value) {
        this.stats[statName] = value;
        this.saveStats();
    }

    incrementStat(statName, amount = 1) {
        this.stats[statName] = (this.stats[statName] || 0) + amount;
        this.saveStats();
    }

    saveStats() {
        localStorage.setItem('userStats', JSON.stringify(this.stats));
    }

    updateDailyStreak() {
        const today = new Date().toDateString();
        const lastVisit = new Date(this.stats.lastVisit).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (today !== lastVisit) {
            if (lastVisit === yesterday.toDateString()) {
                this.stats.currentStreak++;
            } else {
                this.stats.currentStreak = 1;
            }
            
            if (this.stats.currentStreak > this.stats.bestStreak) {
                this.stats.bestStreak = this.stats.currentStreak;
            }
            
            this.stats.lastVisit = Date.now();
            this.saveStats();
        }
    }

    // Sosyal Medya Paylaşım Sistemi
    initSocialSharing() {
        // Sayfa yüklendiğinde paylaşım bölümünü oluştur
        setTimeout(() => {
            this.createShareSection();
        }, 1000);
    }

    createShareSection() {
        // Eğer zaten varsa ekleme
        if (document.querySelector('.share-section')) return;
        
        const shareSection = document.createElement('div');
        shareSection.className = 'share-section';
        shareSection.innerHTML = `
            <h3>🎉 Başarını Paylaş!</h3>
            <p>3D modellerini sosyal medyada paylaş ve arkadaşlarını şaşırt!</p>
            <div class="share-buttons">
                <button class="share-btn facebook" data-platform="facebook">
                    📘 Facebook
                </button>
                <button class="share-btn twitter" data-platform="twitter">
                    🐦 Twitter
                </button>
                <button class="share-btn whatsapp" data-platform="whatsapp">
                    💬 WhatsApp
                </button>
                <button class="share-btn telegram" data-platform="telegram">
                    ✈️ Telegram
                </button>
                <button class="share-btn copy" data-platform="copy">
                    📋 Linki Kopyala
                </button>
            </div>
        `;

        // Paylaşım butonlarına event listener ekle
        shareSection.addEventListener('click', (e) => {
            if (e.target.matches('.share-btn') || e.target.closest('.share-btn')) {
                const btn = e.target.closest('.share-btn');
                const platform = btn.dataset.platform;
                this.shareToSocial(platform);
            }
        });

        // Ana içerik alanına ekle
        const mainContent = document.querySelector('.main-content') || document.querySelector('.container');
        if (mainContent) {
            mainContent.appendChild(shareSection);
        }
    }

    shareToSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('🎨 Harika 3D modeller oluşturdum! 3DFlick ile sen de dene: ');
        
        const platforms = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            whatsapp: `https://wa.me/?text=${text}${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${text}`,
            copy: 'copy'
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link Kopyalandı!', 'Bağlantı panoya kopyalandı', 'success');
                this.incrementStat('socialShares');
                // Sosyal paylaşım başarımlarını kontrol et
                this.checkSocialAchievements();
            }).catch(() => {
                this.showNotification('Hata!', 'Link kopyalanamadı', 'error');
            });
        } else {
            window.open(platforms[platform], '_blank', 'width=600,height=400');
            this.incrementStat('socialShares');
            this.checkSocialAchievements();
            this.showNotification('Paylaşım Açıldı!', `${platform.charAt(0).toUpperCase() + platform.slice(1)} penceresinde paylaş`, 'success');
        }
    }

    // Sosyal medya başarımlarını kontrol et
    checkSocialAchievements() {
        if (window.achievementSystem) {
            const shares = this.stats.socialShares;
            
            if (shares >= 1) window.achievementSystem.unlockAchievement('social_sharer');
            if (shares >= 10) window.achievementSystem.unlockAchievement('viral_creator');
            if (shares >= 50) window.achievementSystem.unlockAchievement('influencer');
        }
    }

    // Progress Bar Sistemi
    createProgressBar(current, total, label) {
        const percentage = Math.min((current / total) * 100, 100);
        
        return `
            <div class="progress-section">
                <div class="progress-label">
                    <span>${label}</span>
                    <span class="progress-percentage">${current}/${total} (${percentage.toFixed(1)}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }

    // Özel event başarımlarını kontrol et
    checkSpecialDateAchievements() {
        const today = new Date();
        const month = today.getMonth() + 1; // 0-11, bu yüzden +1
        const day = today.getDate();
        
        // Yılbaşı
        if (month === 1 && day === 1) {
            if (window.achievementSystem) {
                window.achievementSystem.unlockAchievement('new_year_starter');
            }
        }
        
        // Sevgililer günü
        if (month === 2 && day === 14) {
            if (window.achievementSystem) {
                window.achievementSystem.unlockAchievement('valentine_creator');
            }
        }
        
        // Kullanıcının doğum günü (localStorage'dan al)
        const userBirthday = localStorage.getItem('userBirthday');
        if (userBirthday) {
            const [bMonth, bDay] = userBirthday.split('-').map(Number);
            if (month === bMonth && day === bDay) {
                if (window.achievementSystem) {
                    window.achievementSystem.unlockAchievement('birthday_creator');
                }
            }
        }
    }

    // Mobil cihaz kontrol sistemi
    checkMobileAchievement() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            let mobileGenerations = parseInt(localStorage.getItem('mobileGenerations') || '0');
            mobileGenerations++;
            localStorage.setItem('mobileGenerations', mobileGenerations.toString());
            
            if (mobileGenerations >= 10 && window.achievementSystem) {
                window.achievementSystem.unlockAchievement('mobile_user');
            }
        }
    }

    // Tarayıcı çeşitliliği kontrolü
    checkBrowserAchievement() {
        const getBrowserName = () => {
            const userAgent = navigator.userAgent;
            if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) return 'Chrome';
            if (userAgent.includes('Firefox')) return 'Firefox';
            if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
            if (userAgent.includes('Edge')) return 'Edge';
            if (userAgent.includes('Opera')) return 'Opera';
            return 'Other';
        };
        
        const currentBrowser = getBrowserName();
        let usedBrowsers = JSON.parse(localStorage.getItem('usedBrowsers') || '[]');
        
        if (!usedBrowsers.includes(currentBrowser)) {
            usedBrowsers.push(currentBrowser);
            localStorage.setItem('usedBrowsers', JSON.stringify(usedBrowsers));
            
            if (usedBrowsers.length >= 3 && window.achievementSystem) {
                window.achievementSystem.unlockAchievement('browser_explorer');
            }
        }
    }

    // Model oluşturma sırasında çağrılacak fonksiyon
    onModelGenerated() {
        this.incrementStat('totalGenerations');
        this.checkSpecialDateAchievements();
        this.checkMobileAchievement();
        this.checkBrowserAchievement();
        
        // Streak başarımlarını kontrol et
        if (window.achievementSystem) {
            const streak = this.stats.currentStreak;
            if (streak >= 7) window.achievementSystem.unlockAchievement('daily_streak_7');
            if (streak >= 30) window.achievementSystem.unlockAchievement('streak_master_30');
            if (streak >= 100) window.achievementSystem.unlockAchievement('streak_legend_100');
        }
    }
}

// Global olarak erişilebilir yap
window.enhancedFeatures = new EnhancedFeatures();

// ==========================================
// STL YÜKLEME SİSTEMİ
// ==========================================

class STLUploadSystem {
    constructor() {
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.dailyLimit = 10;
        this.allowedFormats = ['.stl'];
        this.uploadedFiles = JSON.parse(localStorage.getItem('uploadedSTLFiles') || '[]');
        this.uploadStats = JSON.parse(localStorage.getItem('uploadStats') || '{}');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.checkDailyReset();
    }

    setupEventListeners() {
        console.log('🎧 STL Upload setupEventListeners başlatılıyor...');
        
        const dropzone = document.getElementById('stlDropzone');
        const fileInput = document.getElementById('stlFileInput');
        const confirmBtn = document.getElementById('confirmUpload');
        const cancelBtn = document.getElementById('cancelUpload');
        
        console.log('🔍 STL Upload elementleri kontrol ediliyor:', {
            dropzone: !!dropzone,
            fileInput: !!fileInput,
            confirmBtn: !!confirmBtn,
            cancelBtn: !!cancelBtn
        });

        // Dropzone events
        if (dropzone) {
            dropzone.addEventListener('click', () => {
                if (this.canUploadToday()) {
                    fileInput.click();
                }
            });

            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (this.canUploadToday()) {
                    dropzone.classList.add('dragover');
                }
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('dragover');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                
                if (this.canUploadToday()) {
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length > 0) {
                        this.handleFileSelection(files[0]);
                    }
                }
            });
        }

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelection(e.target.files[0]);
                }
            });
        }

        // Confirm/Cancel buttons
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmUpload());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelUpload());
        }

        // Gallery filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterGallery(e.target.dataset.filter);
                this.incrementGalleryUsage();
            });
        });
    }

    canUploadToday() {
        const today = new Date().toDateString();
        const todayUploads = this.uploadedFiles.filter(file => 
            new Date(file.uploadDate).toDateString() === today
        ).length;
        
        return todayUploads < this.dailyLimit;
    }

    getTodayUploadCount() {
        const today = new Date().toDateString();
        return this.uploadedFiles.filter(file => 
            new Date(file.uploadDate).toDateString() === today
        ).length;
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const lastCheck = localStorage.getItem('lastUploadCheck');
        
        if (lastCheck !== today) {
            localStorage.setItem('lastUploadCheck', today);
            this.updateUI();
        }

        // Günlük sıfırlanma zamanını güncelle
        this.updateResetTimer();
        setInterval(() => this.updateResetTimer(), 1000);
    }

    updateResetTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const resetTimeElement = document.getElementById('limitResetTime');
        if (resetTimeElement) {
            resetTimeElement.textContent = `Sıfırlanma: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    handleFileSelection(file) {
        // Format kontrolü
        if (!this.isValidFormat(file.name)) {
            this.showError('Geçersiz Format', 'Sadece .stl formatındaki dosyalar kabul edilir.');
            return;
        }

        // Boyut kontrolü
        if (file.size > this.maxFileSize) {
            this.showError('Dosya Çok Büyük', `Maksimum dosya boyutu ${this.maxFileSize / (1024 * 1024)}MB\'dir.`);
            return;
        }

        // Günlük limit kontrolü
        if (!this.canUploadToday()) {
            this.showError('Günlük Limit Aşıldı', 'Bugün için maksimum yükleme sayısına ulaştınız.');
            return;
        }

        this.selectedFile = file;
        this.showPreview(file);
    }

    isValidFormat(fileName) {
        const extension = '.' + fileName.split('.').pop().toLowerCase();
        return this.allowedFormats.includes(extension);
    }

    showPreview(file) {
        const preview = document.getElementById('uploadPreview');
        const dropzone = document.getElementById('stlDropzone');
        
        if (preview && dropzone) {
            // Dosya bilgilerini güncelle
            document.getElementById('previewFileName').textContent = file.name;
            document.getElementById('previewFileSize').textContent = this.formatFileSize(file.size);
            document.getElementById('previewUploadDate').textContent = new Date().toLocaleString('tr-TR');
            
            // UI'ı güncelle
            dropzone.style.display = 'none';
            preview.style.display = 'block';
        }
    }

    async confirmUpload() {
        if (!this.selectedFile) return;

        // Progress göster
        this.showProgress();
        
        try {
            // Simulated upload process
            await this.simulateUpload(this.selectedFile);
            
            // Dosyayı kaydet
            const fileData = {
                id: Date.now().toString(),
                name: this.selectedFile.name,
                size: this.selectedFile.size,
                uploadDate: new Date().toISOString(),
                type: 'stl'
            };
            
            this.uploadedFiles.push(fileData);
            this.saveFiles();
            
            // İstatistikleri güncelle
            this.updateUploadStats();
            
            // Başarımları kontrol et
            this.checkUploadAchievements();
            
            // UI'ı güncelle
            this.updateUI();
            this.resetUploadForm();
            
            // Başarı mesajı
            if (window.enhancedFeatures) {
                window.enhancedFeatures.showNotification(
                    'Yükleme Başarılı!',
                    `${this.selectedFile.name} başarıyla yüklendi.`,
                    'success'
                );
            }
            
        } catch (error) {
            this.showError('Yükleme Hatası', 'Dosya yüklenirken bir hata oluştu.');
        }
    }

    async simulateUpload(file) {
        const progressBar = document.getElementById('uploadProgressBar');
        const progressPercentage = document.getElementById('uploadPercentage');
        const progressSize = document.getElementById('uploadSizeInfo');
        const fileName = document.getElementById('uploadingFileName');
        
        if (fileName) fileName.textContent = file.name;
        
        const totalSize = file.size;
        let uploadedSize = 0;
        
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                uploadedSize += Math.random() * (totalSize / 20);
                
                if (uploadedSize >= totalSize) {
                    uploadedSize = totalSize;
                    clearInterval(interval);
                    
                    setTimeout(() => {
                        resolve();
                    }, 500);
                }
                
                const percentage = (uploadedSize / totalSize * 100).toFixed(1);
                
                if (progressBar) progressBar.style.width = `${percentage}%`;
                if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
                if (progressSize) {
                    progressSize.textContent = `${this.formatFileSize(uploadedSize)} / ${this.formatFileSize(totalSize)}`;
                }
            }, 100);
        });
    }

    showProgress() {
        const progress = document.getElementById('uploadProgress');
        const preview = document.getElementById('uploadPreview');
        
        if (progress && preview) {
            preview.style.display = 'none';
            progress.style.display = 'block';
        }
    }

    cancelUpload() {
        this.resetUploadForm();
        this.selectedFile = null;
    }

    resetUploadForm() {
        const dropzone = document.getElementById('stlDropzone');
        const progress = document.getElementById('uploadProgress');
        const preview = document.getElementById('uploadPreview');
        const fileInput = document.getElementById('stlFileInput');
        
        if (dropzone) dropzone.style.display = 'flex';
        if (progress) progress.style.display = 'none';
        if (preview) preview.style.display = 'none';
        if (fileInput) fileInput.value = '';
        
        this.selectedFile = null;
    }

    updateUI() {
        console.log('🔄 STL Upload UI güncelleniyor...');
        
        const todayCount = this.getTodayUploadCount();
        const remainingUploads = this.dailyLimit - todayCount;
        
        console.log('📊 Upload durumu:', {
            todayCount,
            dailyLimit: this.dailyLimit,
            remainingUploads,
            totalFiles: this.uploadedFiles.length
        });
        
        // Limit counter güncelle
        const limitCounter = document.getElementById('dailyUploadCounter');
        if (limitCounter) {
            limitCounter.textContent = `${todayCount}/${this.dailyLimit}`;
        }
        
        // Upload buton subtitle güncelle
        const uploadLimitDisplay = document.getElementById('uploadLimitDisplay');
        if (uploadLimitDisplay) {
            uploadLimitDisplay.textContent = `Bugün ${todayCount}/${this.dailyLimit} yüklendi`;
        }
        
        // Gallery count güncelle
        const galleryCount = document.getElementById('galleryCount');
        if (galleryCount) {
            galleryCount.textContent = `${this.uploadedFiles.length} figür`;
        }
        
        // Dropzone durumu
        const dropzone = document.getElementById('stlDropzone');
        if (dropzone) {
            if (!this.canUploadToday()) {
                dropzone.classList.add('disabled');
                dropzone.querySelector('.dropzone-title').textContent = 'Günlük Limit Doldu';
                dropzone.querySelector('.dropzone-subtitle').textContent = `Yarın ${remainingUploads} yükleme hakkınız olacak`;
            } else {
                dropzone.classList.remove('disabled');
                dropzone.querySelector('.dropzone-title').textContent = 'STL Dosyasını Sürükle & Bırak';
                dropzone.querySelector('.dropzone-subtitle').textContent = 'veya dosya seçmek için tıklayın';
            }
        }
    }

    refreshGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        // İstatistikleri güncelle
        this.updateGalleryStats();
        
        if (this.uploadedFiles.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-gallery">
                    <div class="empty-icon">📁</div>
                    <div class="empty-title">Henüz figür yüklenmemiş</div>
                    <div class="empty-subtitle">İlk STL dosyanızı yükleyerek başlayın!</div>
                    <button class="btn btn-primary" onclick="document.querySelector('#uploadBtn').click()">
                        📤 İlk Figürü Yükle
                    </button>
                </div>
            `;
            return;
        }
        
        this.renderGalleryItems('all');
    }

    renderGalleryItems(filter) {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        let filteredFiles = [...this.uploadedFiles];
        
        // Filter uygula
        switch (filter) {
            case 'today':
                const today = new Date().toDateString();
                filteredFiles = filteredFiles.filter(file => 
                    new Date(file.uploadDate).toDateString() === today
                );
                break;
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                filteredFiles = filteredFiles.filter(file => 
                    new Date(file.uploadDate) >= weekAgo
                );
                break;
            case 'large':
                filteredFiles = filteredFiles.filter(file => 
                    file.size > 10 * 1024 * 1024 // 10MB'dan büyük
                );
                break;
        }
        
        if (filteredFiles.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-gallery">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-title">Bu filtrede dosya bulunamadı</div>
                    <div class="empty-subtitle">Farklı bir filtre deneyin</div>
                </div>
            `;
            return;
        }
        
        // Dosyaları tarihe göre sırala (en yeni en üstte)
        filteredFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        
        galleryGrid.innerHTML = filteredFiles.map(file => `
            <div class="gallery-item" data-file-id="${file.id}">
                <div class="gallery-item-header">
                    <div class="gallery-item-icon">📄</div>
                    <button class="gallery-item-menu" onclick="stlUploadSystem.showFileMenu('${file.id}')">⋮</button>
                </div>
                <div class="gallery-item-name">${file.name}</div>
                <div class="gallery-item-size">${this.formatFileSize(file.size)}</div>
                <div class="gallery-item-date">${new Date(file.uploadDate).toLocaleDateString('tr-TR')}</div>
            </div>
        `).join('');
    }

    updateGalleryStats() {
        const totalCount = this.uploadedFiles.length;
        const todayCount = this.getTodayUploadCount();
        const totalSize = this.uploadedFiles.reduce((sum, file) => sum + file.size, 0);
        
        const elements = {
            'totalUploadedCount': totalCount,
            'todayUploadedCount': todayCount,
            'totalUploadSize': this.formatFileSize(totalSize)
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    filterGallery(filter) {
        this.renderGalleryItems(filter);
    }

    incrementGalleryUsage() {
        const usageCount = parseInt(localStorage.getItem('galleryFilterUsage') || '0') + 1;
        localStorage.setItem('galleryFilterUsage', usageCount.toString());
        
        if (usageCount >= 10 && window.achievementSystem) {
            window.achievementSystem.unlockAchievement('gallery_organizer');
        }
    }

    showFileMenu(fileId) {
        // Basit file menu (gelecekte geliştirilebilir)
        const file = this.uploadedFiles.find(f => f.id === fileId);
        if (!file) return;
        
        if (confirm(`"${file.name}" dosyasını silmek istiyor musunuz?`)) {
            this.deleteFile(fileId);
        }
    }

    deleteFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        this.saveFiles();
        this.updateUI();
        this.refreshGallery();
        
        if (window.enhancedFeatures) {
            window.enhancedFeatures.showNotification(
                'Dosya Silindi',
                'Figür galerinizden kaldırıldı.',
                'info'
            );
        }
    }

    updateUploadStats() {
        const today = new Date().toDateString();
        
        if (!this.uploadStats[today]) {
            this.uploadStats[today] = 0;
        }
        
        this.uploadStats[today]++;
        localStorage.setItem('uploadStats', JSON.stringify(this.uploadStats));
    }

    checkUploadAchievements() {
        const totalUploads = this.uploadedFiles.length;
        const todayUploads = this.getTodayUploadCount();
        
        if (window.achievementSystem) {
            // Upload count achievements
            if (totalUploads >= 1) window.achievementSystem.unlockAchievement('first_upload');
            if (totalUploads >= 10) window.achievementSystem.unlockAchievement('upload_master_10');
            if (totalUploads >= 25) window.achievementSystem.unlockAchievement('upload_expert_25');
            if (totalUploads >= 50) window.achievementSystem.unlockAchievement('upload_legend_50');
            if (totalUploads >= 100) window.achievementSystem.unlockAchievement('upload_champion_100');
            
            // File size achievement
            if (this.selectedFile && this.selectedFile.size > 10 * 1024 * 1024) {
                window.achievementSystem.unlockAchievement('big_file_uploader');
            }
            
            // Daily limit achievement
            if (todayUploads >= this.dailyLimit) {
                const dailyLimitReached = parseInt(localStorage.getItem('dailyLimitReached') || '0') + 1;
                localStorage.setItem('dailyLimitReached', dailyLimitReached.toString());
                
                if (dailyLimitReached >= 5) {
                    window.achievementSystem.unlockAchievement('daily_limit_master');
                }
            }
            
            // Speed upload achievement (5 uploads in 1 hour)
            this.checkSpeedUploadAchievement();
            
            // Upload streak achievement
            this.checkUploadStreakAchievement();
        }
    }

    checkSpeedUploadAchievement() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentUploads = this.uploadedFiles.filter(file => 
            new Date(file.uploadDate) >= oneHourAgo
        ).length;
        
        if (recentUploads >= 5 && window.achievementSystem) {
            window.achievementSystem.unlockAchievement('speed_uploader');
        }
    }

    checkUploadStreakAchievement() {
        // Son 3 günün her gününde yükleme yapılmış mı kontrol et
        const today = new Date();
        let consecutiveDays = 0;
        
        for (let i = 0; i < 30; i++) { // Son 30 günü kontrol et
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toDateString();
            
            const hasUploadOnDate = this.uploadedFiles.some(file => 
                new Date(file.uploadDate).toDateString() === checkDateStr
            );
            
            if (hasUploadOnDate) {
                consecutiveDays++;
            } else {
                break;
            }
        }
        
        if (consecutiveDays >= 3 && window.achievementSystem) {
            window.achievementSystem.unlockAchievement('upload_streak_3');
        }
    }

    saveFiles() {
        localStorage.setItem('uploadedSTLFiles', JSON.stringify(this.uploadedFiles));
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(title, message) {
        if (window.enhancedFeatures) {
            window.enhancedFeatures.showNotification(title, message, 'error');
        } else {
            alert(`${title}: ${message}`);
        }
    }
}

// Global instance - DOMContentLoaded'da oluşturulacak

// ==========================================
// YENİ MODAL VE UI FONKSİYONLARI
// ==========================================

// Modal ve panel butonları için event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Biraz bekle DOM tam yüklensin
    setTimeout(() => {
        // Stats butonu
        const statsBtn = document.getElementById('statsBtn');
        if (statsBtn) {
            statsBtn.addEventListener('click', () => {
                showStatsModal();
            });
        }
        
        // Feedback butonu (eğer varsa)
        const feedbackBtn = document.getElementById('feedbackBtn');
        if (feedbackBtn) {
            feedbackBtn.addEventListener('click', () => {
                showFeedbackModal();
            });
        }

        // STL Upload butonu
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) {
            console.log('📤 Upload butonu bulundu, event listener ekleniyor...');
            uploadBtn.addEventListener('click', () => {
                console.log('📤 Upload butonu tıklandı!');
                if (window.app) {
                    window.app.togglePanel('uploadPanel');
                } else {
                    console.log('❌ window.app bulunamadı');
                }
            });
        } else {
            console.log('❌ Upload butonu bulunamadı');
        }
        
        // Gallery butonu
        const galleryBtn = document.getElementById('galleryBtn');
        if (galleryBtn) {
            console.log('🖼️ Gallery butonu bulundu, event listener ekleniyor...');
            galleryBtn.addEventListener('click', () => {
                console.log('🖼️ Gallery butonu tıklandı!');
                if (window.app) {
                    window.app.togglePanel('galleryPanel');
                    if (window.stlUploadSystem) {
                        window.stlUploadSystem.refreshGallery();
                    }
                } else {
                    console.log('❌ window.app bulunamadı');
                }
            });
        } else {
            console.log('❌ Gallery butonu bulunamadı');
        }
    }, 300);
});

// İstatistik modalını göster
function showStatsModal() {
    const statsModal = document.getElementById('statsModal');
    if (statsModal) {
        statsModal.style.display = 'flex';
        statsModal.classList.add('show');
        
        // Modal içeriğine show class ekle (animasyon için)
        const modalContent = statsModal.querySelector('.stats-modal-content');
        if (modalContent) {
            setTimeout(() => {
                modalContent.classList.add('show');
            }, 100);
        }
        
        // İstatistikleri güncelle
        if (typeof updateStats === 'function') {
            updateStats();
        }
        
        // Animasyonları başlat
        if (typeof startStatsAnimations === 'function') {
            startStatsAnimations();
        }
        
        console.log('📊 Enhanced stats modal opened');
    } else {
        console.log('❌ Stats modal not found');
    }
}

// İstatistik modalını oluştur
function createStatsModal() {
    const modal = document.createElement('div');
    modal.id = 'statsModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('statsModal')">&times;</span>
            <h2>📊 İstatistiklerim</h2>
            <div class="stats-dashboard">
                <div class="stat-card">
                    <span class="stat-value" id="totalGenerationsDisplay">0</span>
                    <div class="stat-label">Toplam Model</div>
                    <div class="stat-trend up" id="generationsTrend">+0%</div>
                </div>
                <div class="stat-card">
                    <span class="stat-value" id="achievementsDisplay">0</span>
                    <div class="stat-label">Başarım</div>
                    <div class="stat-trend up" id="achievementsTrend">+0%</div>
                </div>
                <div class="stat-card">
                    <span class="stat-value" id="currentStreakDisplay">0</span>
                    <div class="stat-label">Günlük Seri</div>
                    <div class="stat-trend up" id="streakTrend">+0%</div>
                </div>
                <div class="stat-card">
                    <span class="stat-value" id="socialSharesDisplay">0</span>
                    <div class="stat-label">Paylaşım</div>
                    <div class="stat-trend up" id="sharesTrend">+0%</div>
                </div>
            </div>
            
            <div class="progress-sections">
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Sonraki Başarıma</span>
                        <span class="progress-percentage" id="nextAchievementProgress">Hesaplanıyor...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="achievementProgressBar" style="width: 0%"></div>
                    </div>
                </div>
                
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Bu Haftaki Hedef (50 Model)</span>
                        <span class="progress-percentage" id="weeklyProgress">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="weeklyProgressBar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    updateStatsDisplay();
}

// Feedback modalını göster
function showFeedbackModal() {
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal) {
        feedbackModal.style.display = 'block';
    } else {
        createFeedbackModal();
    }
}

// Feedback modalını oluştur
function createFeedbackModal() {
    const modal = document.createElement('div');
    modal.id = 'feedbackModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('feedbackModal')">&times;</span>
            <h2>💡 Geri Bildirim Gönder</h2>
            <form id="feedbackForm" class="auth-form">
                <div class="form-group">
                    <label for="feedbackType">Geri Bildirim Türü:</label>
                    <select id="feedbackType" required>
                        <option value="">Seçiniz</option>
                        <option value="bug">🐛 Bug Raporu</option>
                        <option value="feature">🚀 Özellik Önerisi</option>
                        <option value="general">💬 Genel Geri Bildirim</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="feedbackTitle">Konu:</label>
                    <input type="text" id="feedbackTitle" required placeholder="Geri bildirim konusu">
                </div>
                <div class="form-group">
                    <label for="feedbackMessage">Mesaj:</label>
                    <textarea id="feedbackMessage" required rows="5" placeholder="Detaylı açıklama..."></textarea>
                </div>
                <div class="form-group">
                    <label for="feedbackEmail">E-posta (İsteğe bağlı):</label>
                    <input type="email" id="feedbackEmail" placeholder="Yanıt almak için e-posta adresiniz">
                </div>
                <button type="submit" class="btn auth-btn">📤 Gönder</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Form submit event listener
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);
}

// İstatistikleri güncelle
function updateStatsDisplay() {
    if (window.enhancedFeatures && window.enhancedFeatures.stats) {
        const stats = window.enhancedFeatures.stats;
        
        // İstatistikleri güncelle
        const elements = {
            'totalGenerationsDisplay': stats.totalGenerations || 0,
            'achievementsDisplay': stats.achievementsUnlocked || 0,
            'currentStreakDisplay': stats.currentStreak || 0,
            'socialSharesDisplay': stats.socialShares || 0
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Progress barları güncelle
        updateProgressBars(stats);
    }
}

// Progress barları güncelle
function updateProgressBars(stats) {
    // Haftalık hedef progress
    const weeklyTarget = 50;
    const currentWeeklyCount = stats.totalGenerations % weeklyTarget;
    const weeklyProgress = Math.min((currentWeeklyCount / weeklyTarget) * 100, 100);
    
    const weeklyProgressBar = document.getElementById('weeklyProgressBar');
    const weeklyProgressText = document.getElementById('weeklyProgress');
    
    if (weeklyProgressBar) weeklyProgressBar.style.width = `${weeklyProgress}%`;
    if (weeklyProgressText) weeklyProgressText.textContent = `${currentWeeklyCount}/${weeklyTarget} (${weeklyProgress.toFixed(1)}%)`;
    
    // Sonraki başarım progress (örnek)
    const nextAchievementProgress = document.getElementById('nextAchievementProgress');
    if (nextAchievementProgress) {
        const nextMilestone = Math.ceil(stats.totalGenerations / 10) * 10;
        const progressToNext = ((stats.totalGenerations % 10) / 10) * 100;
        nextAchievementProgress.textContent = `${stats.totalGenerations}/${nextMilestone} (${progressToNext.toFixed(1)}%)`;
        
        const achievementProgressBar = document.getElementById('achievementProgressBar');
        if (achievementProgressBar) {
            achievementProgressBar.style.width = `${progressToNext}%`;
        }
    }
}

// Feedback form submit işleme
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('feedbackType').value,
        title: document.getElementById('feedbackTitle').value,
        message: document.getElementById('feedbackMessage').value,
        email: document.getElementById('feedbackEmail').value,
        timestamp: new Date().toISOString()
    };
    
    // LocalStorage'a kaydet
    const feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    feedbacks.push(formData);
    localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
    
    // Başarım kontrolü
    if (window.achievementSystem) {
        if (formData.type === 'bug') {
            window.achievementSystem.unlockAchievement('bug_hunter');
        } else if (formData.type === 'feature') {
            window.achievementSystem.unlockAchievement('feature_requester');
        }
        
        if (feedbacks.length >= 5) {
            window.achievementSystem.unlockAchievement('feedback_provider');
        }
    }
    
    // Başarı mesajı
    if (window.enhancedFeatures) {
        window.enhancedFeatures.showNotification(
            'Geri Bildirim Gönderildi!',
            'Geri bildiriminiz için teşekkürler. En kısa sürede değerlendireceğiz.',
            'success'
        );
    }
    
    closeModal('feedbackModal');
    document.getElementById('feedbackForm').reset();
}

// Modal kapatma fonksiyonu
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        
        // Stats modal için özel işlem
        if (modalId === 'statsModal') {
            const modalContent = modal.querySelector('.stats-modal-content');
            if (modalContent) {
                modalContent.classList.remove('show');
            }
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Modal dışına tıklama ile kapatma
window.addEventListener('click', (e) => {
    const modals = ['statsModal', 'feedbackModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Global fonksiyonları window'a ekle
window.showStatsModal = showStatsModal;
window.showFeedbackModal = showFeedbackModal;
window.closeModal = closeModal;
window.updateStatsDisplay = updateStatsDisplay;