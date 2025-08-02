// Celebrity Birthday Challenge Game Engine - Wordle Style
class CelebrityBirthdayChallenge {
    constructor() {
        this.celebrities = celebrityBirthdays;
        this.currentCelebrity = null;
        this.guessesRemaining = 5;
        this.currentClueIndex = 0;
        this.gameComplete = false;
        this.gameWon = false;
        this.startTime = null;
        this.endTime = null;
        this.gameTime = 0;
        this.previousGuesses = [];
        this.score = 0;
        this.currentActiveInput = 1; // Track which input is currently active
        
        // Settings
        this.soundEffectsEnabled = true;
        this.backgroundMusicEnabled = true;
        
        // Calendar state - Use current year
        this.currentCalendarMonth = new Date().getMonth();
        this.currentCalendarYear = new Date().getFullYear();
        
        // Sound system
        this.sounds = new Map();
        
        // DOM Elements
        this.elements = this.initializeElements();
        
        // Initialize the game
        this.init();
    }
    
    initializeElements() {
        const elements = {
            cluesGrid: document.getElementById('cluesGrid'),
            clueText1: document.getElementById('clueText1'),
            clueText2: document.getElementById('clueText2'),
            clueText3: document.getElementById('clueText3'),
            clueText4: document.getElementById('clueText4'),
            clueText5: document.getElementById('clueText5'),
            clue1: document.getElementById('clue1'),
            clue2: document.getElementById('clue2'),
            clue3: document.getElementById('clue3'),
            clue4: document.getElementById('clue4'),
            clue5: document.getElementById('clue5'),
            
            // Individual input fields for each clue
            guessInput1: document.getElementById('guessInput1'),
            guessInput2: document.getElementById('guessInput2'),
            guessInput3: document.getElementById('guessInput3'),
            guessInput4: document.getElementById('guessInput4'),
            guessInput5: document.getElementById('guessInput5'),
            
            // Failed guess displays
            failedGuess1: document.getElementById('failedGuess1'),
            failedGuess2: document.getElementById('failedGuess2'),
            failedGuess3: document.getElementById('failedGuess3'),
            failedGuess4: document.getElementById('failedGuess4'),
            failedGuess5: document.getElementById('failedGuess5'),
            
            submitGuess: document.getElementById('submitGuess'),
            skipGuess: document.getElementById('skipGuess'),
            guessesLeft: document.getElementById('guessesLeft'),
            previousGuesses: document.getElementById('previousGuesses'),
            successMessage: document.getElementById('successMessage'),
            failureMessage: document.getElementById('failureMessage'),
            congrats: document.getElementById('congrats'),
            
            // Hamburger menu elements
            hamburgerMenu: document.getElementById('hamburgerMenu'),
            slideMenu: document.getElementById('slideMenu'),
            menuOverlay: document.getElementById('menuOverlay'),
            closeMenu: document.getElementById('closeMenu'),
            menuStatsLink: document.getElementById('menuStatsLink'),
            menuCalendarLink: document.getElementById('menuCalendarLink'),
            menuHelpLink: document.getElementById('menuHelpLink'),
            menuSoundEffectsToggle: document.getElementById('menuSoundEffectsToggle'),
            menuBackgroundMusicToggle: document.getElementById('menuBackgroundMusicToggle'),
            
            // Modal elements
            calendarModal: document.getElementById('calendarModal'),
            closeCalendar: document.getElementById('closeCalendar'),
            calendarDates: document.getElementById('calendarDates'),
            calendarStatus: document.getElementById('calendarStatus'),
            helpModal: document.getElementById('helpModal'),
            closeHelp: document.getElementById('closeHelp'),
            statsModal: document.getElementById('statsModal'),
            closeStats: document.getElementById('closeStats'),
            totalSolved: document.getElementById('totalSolved'),
            currentStreak: document.getElementById('currentStreak'),
            successRate: document.getElementById('successRate'),
            avgTime: document.getElementById('avgTime'),
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            calendarMonthYear: document.getElementById('calendarMonthYear')
        };
        
        // Debug: Log missing elements
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
        
        if (missingElements.length > 0) {
            console.warn('Missing elements:', missingElements);
        }
        
        return elements;
    }
    
    async init() {
        this.startTime = new Date();
        await this.initializeSounds();
        this.loadSettings();
        this.loadUserData();
        this.selectTodaysCelebrity();
        this.setupEventListeners();
        
        // Ensure all modals are hidden
        if (this.elements.calendarModal) this.elements.calendarModal.style.display = 'none';
        if (this.elements.helpModal) this.elements.helpModal.style.display = 'none';
        if (this.elements.statsModal) this.elements.statsModal.style.display = 'none';
        
        // Start background music when game finishes loading
        setTimeout(() => {
            this.playBackgroundMusic();
        }, 1000);
        
        // Focus on first input
        this.focusCurrentInput();
    }
    
    selectTodaysCelebrity() {
        const today = new Date();
        const todayStr = this.formatDate(today);
        const todayMonthDay = this.formatMonthDay(today);
        
        // Find celebrity for today's month-day (ignoring year)
        let celebrity = this.celebrities.find(c => c.date === todayMonthDay);
        
        // If no celebrity for today, pick one deterministically based on the date
        if (!celebrity) {
            // Create a seed based on the month-day to ensure same celebrity each year
            const dateSeed = this.getDateSeed(todayMonthDay);
            celebrity = this.celebrities[dateSeed % this.celebrities.length];
        }
        
        this.currentCelebrity = celebrity;
        this.currentDate = todayStr; // Still use full date for game tracking
        
        // Check if today's puzzle has already been played (solved OR failed)
        const userData = this.loadUserData();
        if (userData.games && userData.games[todayStr]) {
            this.showCompletedPuzzleMessage();
        } else {
            this.setupClueBoxes();
            this.updateGameDisplay();
        }
    }
    
    showCompletedPuzzleMessage() {
        // Hide all game elements
        this.elements.cluesGrid.style.display = 'none';
        this.elements.submitGuess.style.display = 'none';
        this.elements.skipGuess.style.display = 'none';
        this.elements.guessesLeft.style.display = 'none';
        
        // Remove any existing completed message
        const existingMessage = document.querySelector('.completed-puzzle-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Get the game result for this date
        const userData = this.loadUserData();
        const gameResult = userData.games[this.currentDate];
        const isToday = this.currentDate === this.formatDate(new Date());
        
        // Show completed message
        const completedMessage = document.createElement('div');
        completedMessage.className = gameResult.solved ? 'success-message completed-puzzle-message' : 'failure-message completed-puzzle-message';
        completedMessage.style.display = 'block';
        
        if (gameResult.solved) {
            if (isToday) {
                // Only show birthday message if this is actually today's daily challenge
                // (not a past challenge being played on the celebrity's birthday)
                const todayStr = this.formatDate(new Date());
                if (this.currentDate === todayStr) {
                    completedMessage.innerHTML = `
                        <h2>Happy Birthday ${this.currentCelebrity.name}</h2>
                        <p>You already solved today's puzzle!</p>
                        <p>Score: ${gameResult.score} points in ${gameResult.guessesUsed} guess${gameResult.guessesUsed !== 1 ? 'es' : ''}</p>
                        <p>Come back tomorrow for a new celebrity birthday challenge.</p>
                    `;
                } else {
                    // This is a past challenge, even if played on the celebrity's birthday
                    completedMessage.innerHTML = `
                        <h2>Puzzle Completed</h2>
                        <p>You solved this puzzle on ${this.currentDate}.</p>
                        <p>Score: ${gameResult.score} points in ${gameResult.guessesUsed} guess${gameResult.guessesUsed !== 1 ? 'es' : ''}</p>
                    `;
                }
            } else {
                // For past challenges, just show the stats without the birthday message
                completedMessage.innerHTML = `
                    <h2>Puzzle Completed</h2>
                    <p>You solved this puzzle on ${this.currentDate}.</p>
                    <p>Score: ${gameResult.score} points in ${gameResult.guessesUsed} guess${gameResult.guessesUsed !== 1 ? 'es' : ''}</p>
                `;
            }
        } else {
            completedMessage.innerHTML = `
                <h2>Game Over</h2>
                <p>You ${isToday ? "already played today's" : "played this"} puzzle.</p>
                <p>The answer was: <strong>${this.currentCelebrity.name}</strong></p>
                <p>${isToday ? "Come back tomorrow for a new celebrity birthday challenge." : "Try another date from the calendar!"}</p>
            `;
        }
        
        // Insert the message before the congrats section
        const gameArea = this.elements.cluesGrid.parentElement;
        gameArea.insertBefore(completedMessage, this.elements.congrats);
        
        // Show all clues for reference
        this.revealAllClues();
        this.elements.cluesGrid.style.display = 'flex';
    }
    
    resetToToday() {
        // Remove any completed message
        const existingMessage = document.querySelector('.completed-puzzle-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Reset to today's puzzle
        this.selectTodaysCelebrity();
    }
    
    setupClueBoxes() {
        // Set all clue texts but don't show them yet
        const clueElements = [
            this.elements.clueText1,
            this.elements.clueText2,
            this.elements.clueText3,
            this.elements.clueText4,
            this.elements.clueText5
        ];
        
        const clueBoxes = [
            this.elements.clue1,
            this.elements.clue2,
            this.elements.clue3,
            this.elements.clue4,
            this.elements.clue5
        ];
        
        // Clear all clue texts initially
        clueElements.forEach(element => {
            if (element) element.textContent = '';
        });
        
        // Reset all clue boxes
        clueBoxes.forEach(box => {
            if (box) {
                box.classList.remove('active', 'filled', 'failed');
            }
        });
        
        // Show first clue and make first input active
        this.revealClue(0);
        this.setActiveInput(1);
    }
    
    revealClue(index) {
        const clueElements = [
            this.elements.clueText1,
            this.elements.clueText2,
            this.elements.clueText3,
            this.elements.clueText4,
            this.elements.clueText5
        ];
        
        const clueBoxes = [
            this.elements.clue1,
            this.elements.clue2,
            this.elements.clue3,
            this.elements.clue4,
            this.elements.clue5
        ];
        
        if (clueElements[index] && this.currentCelebrity.clues[index]) {
            clueElements[index].textContent = this.currentCelebrity.clues[index];
            if (clueBoxes[index]) {
                clueBoxes[index].classList.add('filled');
            }
        }
    }
    
    setActiveInput(inputNumber) {
        // Hide all inputs first
        for (let i = 1; i <= 5; i++) {
            const input = this.elements[`guessInput${i}`];
            const clueBox = this.elements[`clue${i}`];
            if (input) {
                input.style.display = 'none';
                input.value = '';
            }
            if (clueBox) {
                clueBox.classList.remove('active');
            }
        }
        
        // Show and activate the current input
        const currentInput = this.elements[`guessInput${inputNumber}`];
        const currentClueBox = this.elements[`clue${inputNumber}`];
        
        if (currentInput && currentClueBox) {
            currentInput.style.display = 'block';
            currentClueBox.classList.add('active');
            this.currentActiveInput = inputNumber;
            
            // Focus on the input
            setTimeout(() => currentInput.focus(), 100);
        }
    }
    
    focusCurrentInput() {
        const currentInput = this.elements[`guessInput${this.currentActiveInput}`];
        if (currentInput) {
            currentInput.focus();
        }
    }
    
    getCurrentInput() {
        return this.elements[`guessInput${this.currentActiveInput}`];
    }
    
    updateGameDisplay() {
        if (this.elements.guessesLeft) {
            this.elements.guessesLeft.textContent = `${this.guessesRemaining} guesses remaining`;
        }
    }
    
    makeGuess(guess) {
        if (this.gameComplete || this.guessesRemaining <= 0) return;
        
        const normalizedGuess = guess.toLowerCase().trim();
        const normalizedAnswer = this.currentCelebrity.name.toLowerCase().trim();
        
        // Check if guess is correct
        if (normalizedGuess === normalizedAnswer) {
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess(guess);
        }
    }
    
    handleCorrectGuess() {
        this.gameWon = true;
        this.gameComplete = true;
        this.endTime = new Date();
        this.gameTime = Math.floor((this.endTime - this.startTime) / 1000);
        
        // Calculate score based on guesses used
        const guessesUsed = 5 - this.guessesRemaining + 1;
        this.score = Math.max(0, (6 - guessesUsed) * 100);
        
        // Mark current clue box as successful
        const currentClueBox = this.elements[`clue${this.currentActiveInput}`];
        if (currentClueBox) {
            currentClueBox.classList.remove('active');
            currentClueBox.classList.add('filled');
        }
        
        // Hide current input
        const currentInput = this.getCurrentInput();
        if (currentInput) {
            currentInput.style.display = 'none';
        }
        
        // Show success message
        const isToday = this.currentDate === this.formatDate(new Date());
        this.elements.successMessage.textContent = `Correct! It's ${this.currentCelebrity.name}.`;
        this.elements.successMessage.style.display = 'block';
        
        // Hide buttons
        this.elements.submitGuess.style.display = 'none';
        this.elements.skipGuess.style.display = 'none';
        this.elements.guessesLeft.style.display = 'none';
        
        // Reveal all remaining clues
        this.revealAllClues();
        
        // Record completion and show stats
        this.recordGameCompletion();
        this.updateCongratsStats();
        
        // For past challenges, show stats immediately. For today, show after delay
        if (isToday) {
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
            }, 2000);
        } else {
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
            }, 1000);
        }
        
        this.playSuccessSound();
    }
    
    handleIncorrectGuess(guess) {
        this.guessesRemaining--;
        this.previousGuesses.push(guess);
        
        // Show failed guess in current clue box
        const failedGuessElement = this.elements[`failedGuess${this.currentActiveInput}`];
        if (failedGuessElement) {
            failedGuessElement.textContent = `Incorrect: ${guess}`;
            failedGuessElement.style.display = 'block';
        }
        
        // Mark current clue box as failed
        const currentClueBox = this.elements[`clue${this.currentActiveInput}`];
        if (currentClueBox) {
            currentClueBox.classList.remove('active');
            currentClueBox.classList.add('failed');
        }
        
        // Hide current input
        const currentInput = this.getCurrentInput();
        if (currentInput) {
            currentInput.style.display = 'none';
        }
        
        // Add to sidebar previous guesses
        const guessElement = document.createElement('div');
        guessElement.className = 'previous-guess';
        guessElement.textContent = guess;
        this.elements.previousGuesses.appendChild(guessElement);
        
        if (this.guessesRemaining <= 0) {
            // Game over
            this.gameComplete = true;
            this.endTime = new Date();
            this.gameTime = Math.floor((this.endTime - this.startTime) / 1000);
            
            this.elements.failureMessage.textContent = `Game Over! It was ${this.currentCelebrity.name}`;
            this.elements.failureMessage.style.display = 'block';
            
            // Hide buttons
            this.elements.submitGuess.style.display = 'none';
            this.elements.skipGuess.style.display = 'none';
            this.elements.guessesLeft.style.display = 'none';
            
            // Reveal all clues
            this.revealAllClues();
            
            this.playFailSound();
        } else {
            // Move to next clue and input
            const nextInputNumber = this.currentActiveInput + 1;
            if (nextInputNumber <= 5) {
                this.revealClue(nextInputNumber - 1); // Reveal next clue (0-indexed)
                this.setActiveInput(nextInputNumber);
            }
            
            this.updateGameDisplay();
            this.playIncorrectSound();
        }
    }
    
    skipGuess() {
        if (this.gameComplete || this.guessesRemaining <= 0) return;
        
        this.guessesRemaining--;
        
        // Mark current clue box as skipped
        const currentClueBox = this.elements[`clue${this.currentActiveInput}`];
        if (currentClueBox) {
            currentClueBox.classList.remove('active');
            currentClueBox.classList.add('filled');
        }
        
        // Hide current input
        const currentInput = this.getCurrentInput();
        if (currentInput) {
            currentInput.style.display = 'none';
        }
        
        if (this.guessesRemaining <= 0) {
            // Game over
            this.gameComplete = true;
            this.endTime = new Date();
            this.gameTime = Math.floor((this.endTime - this.startTime) / 1000);
            
            this.elements.failureMessage.textContent = `Game Over! It was ${this.currentCelebrity.name}`;
            this.elements.failureMessage.style.display = 'block';
            
            // Hide buttons
            this.elements.submitGuess.style.display = 'none';
            this.elements.skipGuess.style.display = 'none';
            this.elements.guessesLeft.style.display = 'none';
            
            // Reveal all clues
            this.revealAllClues();
            
            this.playFailSound();
        } else {
            // Move to next clue and input
            const nextInputNumber = this.currentActiveInput + 1;
            if (nextInputNumber <= 5) {
                this.revealClue(nextInputNumber - 1); // Reveal next clue (0-indexed)
                this.setActiveInput(nextInputNumber);
            }
            
            this.updateGameDisplay();
        }
    }
    
    revealAllClues() {
        for (let i = 0; i < 5; i++) {
            this.revealClue(i);
        }
        
        // Remove active state from all clue boxes
        for (let i = 1; i <= 5; i++) {
            const clueBox = this.elements[`clue${i}`];
            if (clueBox) {
                clueBox.classList.remove('active');
                clueBox.classList.add('filled');
            }
        }
    }
    
    async initializeSounds() {
        const soundFiles = {
            correct: 'sounds/word-complete.mp3',
            incorrect: 'sounds/error.mp3',
            success: 'sounds/puzzle-complete.mp3',
            fail: 'sounds/reset.mp3',
            buttonClick: 'sounds/keytype.mp3',
            backgroundMusic: 'sounds/background-music.mp3'
        };
        
        const loadPromises = [];
        
        for (const [name, path] of Object.entries(soundFiles)) {
            const loadPromise = new Promise((resolve) => {
                try {
                    const audio = new Audio(path);
                    audio.preload = 'auto';
                    
                    if (name === 'backgroundMusic') {
                        audio.loop = true;
                        audio.volume = 0.2;
                    } else {
                        audio.volume = 0.5;
                    }
                    
                    audio.addEventListener('error', () => {
                        console.log(`Could not load sound: ${path}`);
                        resolve();
                    });
                    
                    audio.addEventListener('canplaythrough', () => {
                        this.sounds.set(name, audio);
                        console.log(`Sound loaded: ${name}`);
                        resolve();
                    });
                    
                    setTimeout(() => {
                        if (!this.sounds.has(name)) {
                            console.log(`Timeout loading sound: ${name}, adding anyway`);
                            this.sounds.set(name, audio);
                        }
                        resolve();
                    }, 3000);
                    
                } catch (error) {
                    console.log(`Error loading sound ${name}:`, error);
                    resolve();
                }
            });
            
            loadPromises.push(loadPromise);
        }
        
        await Promise.all(loadPromises);
        console.log('All sounds loaded, total sounds:', this.sounds.size);
    }
    
    playSound(soundName, volume = 0.5) {
        try {
            const audio = this.sounds.get(soundName);
            if (audio && this.soundEffectsEnabled) {
                const audioClone = audio.cloneNode();
                audioClone.volume = volume;
                audioClone.play().catch(e => {
                    console.log(`Could not play sound: ${soundName}`);
                });
            }
        } catch (error) {
            console.log(`Error playing sound ${soundName}:`, error);
        }
    }
    
    playCorrectSound() {
        this.playSound('correct', 0.4);
    }
    
    playIncorrectSound() {
        this.playSound('incorrect', 0.4);
    }
    
    playSuccessSound() {
        this.playSound('success', 0.6);
    }
    
    playFailSound() {
        this.playSound('fail', 0.4);
    }
    
    playButtonClickSound() {
        this.playSound('buttonClick', 0.3);
    }
    
    playBackgroundMusic() {
        try {
            const audio = this.sounds.get('backgroundMusic');
            if (audio && this.backgroundMusicEnabled) {
                if (audio.paused) {
                    audio.currentTime = 0;
                }
                audio.play().catch(e => {
                    console.log('Could not play background music:', e);
                });
            }
        } catch (error) {
            console.log('Error playing background music:', error);
        }
    }
    
    pauseBackgroundMusic() {
        try {
            const audio = this.sounds.get('backgroundMusic');
            if (audio) {
                audio.pause();
            }
        } catch (error) {
            console.log('Error pausing background music:', error);
        }
    }
    
    toggleBackgroundMusic() {
        if (this.backgroundMusicEnabled) {
            const audio = this.sounds.get('backgroundMusic');
            if (audio && audio.paused) {
                this.playBackgroundMusic();
            }
        } else {
            this.pauseBackgroundMusic();
        }
    }
    
    saveSettings() {
        const settings = {
            soundEffectsEnabled: this.soundEffectsEnabled,
            backgroundMusicEnabled: this.backgroundMusicEnabled
        };
        localStorage.setItem('celebrityBirthdaySettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('celebrityBirthdaySettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.soundEffectsEnabled = settings.soundEffectsEnabled !== undefined ? settings.soundEffectsEnabled : true;
                this.backgroundMusicEnabled = settings.backgroundMusicEnabled !== undefined ? settings.backgroundMusicEnabled : true;
            }
        } catch (error) {
            console.log('Could not load settings:', error);
            this.soundEffectsEnabled = true;
            this.backgroundMusicEnabled = true;
        }
        
        // Update toggle elements
        if (this.elements.menuSoundEffectsToggle) {
            this.elements.menuSoundEffectsToggle.checked = this.soundEffectsEnabled;
        }
        if (this.elements.menuBackgroundMusicToggle) {
            this.elements.menuBackgroundMusicToggle.checked = this.backgroundMusicEnabled;
        }
    }
    
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('celebrityBirthdayUserData')) || {
            games: {},
            stats: {
                totalSolved: 0,
                currentStreak: 0,
                maxStreak: 0,
                totalTime: 0,
                totalScore: 0,
                lastPlayed: null
            }
        };
        return userData;
    }
    
    saveUserData(userData) {
        localStorage.setItem('celebrityBirthdayUserData', JSON.stringify(userData));
    }
    
    recordGameCompletion() {
        const userData = this.loadUserData();
        const dateStr = this.currentDate || this.formatDate(new Date());
        
        userData.games[dateStr] = {
            solved: this.gameWon,
            time: this.gameTime,
            score: this.score,
            guessesUsed: 5 - this.guessesRemaining + (this.gameWon ? 1 : 0),
            date: dateStr,
            completed: true
        };
        
        if (this.gameWon) {
            userData.stats.totalSolved = Object.values(userData.games).filter(g => g.solved).length;
            userData.stats.totalScore += this.score;
            
            // Only update streak if this is today's puzzle
            const today = this.formatDate(new Date());
            if (dateStr === today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = this.formatDate(yesterday);
                
                if (userData.games[yesterdayStr]?.solved) {
                    userData.stats.currentStreak++;
                } else {
                    userData.stats.currentStreak = 1;
                }
                
                if (userData.stats.currentStreak > userData.stats.maxStreak) {
                    userData.stats.maxStreak = userData.stats.currentStreak;
                }
            }
        } else {
            // If failed today's puzzle, break the streak
            const today = this.formatDate(new Date());
            if (dateStr === today) {
                userData.stats.currentStreak = 0;
            }
        }
        
        userData.stats.totalTime += this.gameTime;
        userData.stats.lastPlayed = dateStr;
        
        this.saveUserData(userData);
    }
    
    updateStatsDisplay() {
        const userData = this.loadUserData();
        const stats = userData.stats;
        
        if (this.elements.totalSolved) {
            this.elements.totalSolved.textContent = stats.totalSolved;
        }
        if (this.elements.currentStreak) {
            this.elements.currentStreak.textContent = stats.currentStreak;
        }
        
        const totalPlayed = Object.keys(userData.games).length;
        const successRate = totalPlayed > 0 ? Math.round((stats.totalSolved / totalPlayed) * 100) : 0;
        if (this.elements.successRate) {
            this.elements.successRate.textContent = `${successRate}%`;
        }
        
        const avgTime = stats.totalSolved > 0 ? Math.round(stats.totalTime / stats.totalSolved) : 0;
        if (this.elements.avgTime) {
            this.elements.avgTime.textContent = `${avgTime}s`;
        }
    }

    updateCongratsStats() {
        const userData = this.loadUserData();
        const stats = userData.stats;
        
        const congratsTotalSolved = document.getElementById('congratsTotalSolved');
        const congratsCurrentStreak = document.getElementById('congratsCurrentStreak');
        const congratsSuccessRate = document.getElementById('congratsSuccessRate');
        const congratsAvgTime = document.getElementById('congratsAvgTime');
        
        if (congratsTotalSolved) congratsTotalSolved.textContent = stats.totalSolved;
        if (congratsCurrentStreak) congratsCurrentStreak.textContent = stats.currentStreak;
        
        const totalPlayed = Object.keys(userData.games).length;
        const successRate = totalPlayed > 0 ? Math.round((stats.totalSolved / totalPlayed) * 100) : 0;
        if (congratsSuccessRate) congratsSuccessRate.textContent = `${successRate}%`;
        
        const avgTime = stats.totalSolved > 0 ? Math.round(stats.totalTime / stats.totalSolved) : 0;
        if (congratsAvgTime) congratsAvgTime.textContent = `${avgTime}s`;
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    formatMonthDay(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    }
    
    getDateSeed(dateStr) {
        // Create a deterministic seed from the date string
        // This ensures the same celebrity is selected for the same date every time
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            const char = dateStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    renderCalendar() {
        const today = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.elements.calendarMonthYear.textContent =
            `${monthNames[this.currentCalendarMonth]} ${this.currentCalendarYear}`;
        
        const firstDay = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1);
        const lastDay = new Date(this.currentCalendarYear, this.currentCalendarMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        let html = '';
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="calendar-date"></div>';
        }
        
        const userData = this.loadUserData();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentCalendarYear, this.currentCalendarMonth, day);
            const dateStr = this.formatDate(date);
            const today = new Date();
            const isToday = dateStr === this.formatDate(today);
            const isPast = date < today;
            const isFuture = date > today;
            
            let classes = 'calendar-date';
            if (isToday) classes += ' today';
            else if (isPast) classes += ' past';
            else if (isFuture) classes += ' future';
            
            // Check if this date has been played
            if (userData.games && userData.games[dateStr]) {
                if (userData.games[dateStr].solved) {
                    classes += ' solved';
                } else {
                    classes += ' failed';
                }
            }
            
            // Check if there's a celebrity for this month-day
            const monthDay = this.formatMonthDay(date);
            const celebrity = this.celebrities.find(c => c.date === monthDay);
            
            if (celebrity) {
                html += `<div class="${classes}" data-date="${dateStr}" style="cursor: pointer;" title="Play ${celebrity.name}'s birthday challenge">${day}</div>`;
            } else {
                // Still allow playing any date (will use deterministic selection)
                html += `<div class="${classes}" data-date="${dateStr}" style="cursor: pointer;" title="Play ${dateStr} challenge">${day}</div>`;
            }
        }
        
        this.elements.calendarDates.innerHTML = html;
        
        document.querySelectorAll('.calendar-date[data-date]').forEach(el => {
            el.addEventListener('click', () => {
                const dateStr = el.dataset.date;
                
                const clickedDate = new Date(dateStr);
                const today = new Date();
                
                if (clickedDate > today) {
                    return;
                }
                
                this.loadChallengeForDate(dateStr);
                this.elements.calendarModal.style.display = 'none';
                
                // Update the calendar status
                this.elements.calendarStatus.textContent = `Playing ${dateStr} challenge`;
            });
        });
        
        this.updateCalendarNavigation();
    }
    
    updateCalendarNavigation() {
        const today = new Date();
        const celebrityDates = this.celebrities.map(c => new Date(c.date));
        const earliestDate = new Date(Math.min(...celebrityDates));
        
        const currentViewDate = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1);
        const earliestViewDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
        this.elements.prevMonth.disabled = currentViewDate <= earliestViewDate;
        
        const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.elements.nextMonth.disabled = currentViewDate >= currentMonthDate;
    }
    
    loadChallengeForDate(dateStr) {
        // Extract month-day from the full date string
        const date = new Date(dateStr);
        const monthDay = this.formatMonthDay(date);
        
        // Find celebrity by month-day (ignoring year)
        let celebrity = this.celebrities.find(c => c.date === monthDay);
        
        // If no celebrity for this month-day, pick one deterministically
        if (!celebrity) {
            const dateSeed = this.getDateSeed(monthDay);
            celebrity = this.celebrities[dateSeed % this.celebrities.length];
        }
        
        if (celebrity) {
            this.currentCelebrity = celebrity;
            this.currentDate = dateStr;
            this.guessesRemaining = 5;
            this.currentClueIndex = 0;
            this.gameComplete = false;
            this.gameWon = false;
            this.previousGuesses = [];
            this.score = 0;
            this.startTime = new Date();
            this.currentActiveInput = 1;
            
            // Reset UI
            this.elements.congrats.style.display = 'none';
            this.elements.successMessage.style.display = 'none';
            this.elements.failureMessage.style.display = 'none';
            this.elements.submitGuess.style.display = 'inline-block';
            this.elements.skipGuess.style.display = 'inline-block';
            this.elements.guessesLeft.style.display = 'block';
            this.elements.previousGuesses.innerHTML = '';
            
            // Show clues grid
            this.elements.cluesGrid.style.display = 'flex';
            
            // Reset all failed guess displays
            for (let i = 1; i <= 5; i++) {
                const failedGuess = this.elements[`failedGuess${i}`];
                if (failedGuess) {
                    failedGuess.style.display = 'none';
                }
            }
            
            // Check if this puzzle has already been played
            const userData = this.loadUserData();
            if (userData.games && userData.games[dateStr]) {
                this.showCompletedPuzzleMessage();
            } else {
                this.setupClueBoxes();
                this.updateGameDisplay();
                this.focusCurrentInput();
            }
        }
    }
    
    // Menu methods
    openMenu() {
        if (this.elements.slideMenu && this.elements.menuOverlay && this.elements.hamburgerMenu) {
            this.elements.slideMenu.classList.add('active');
            this.elements.menuOverlay.classList.add('active');
            this.elements.hamburgerMenu.querySelector('.hamburger-icon').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeMenu() {
        if (this.elements.slideMenu && this.elements.menuOverlay && this.elements.hamburgerMenu) {
            this.elements.slideMenu.classList.remove('active');
            this.elements.menuOverlay.classList.remove('active');
            this.elements.hamburgerMenu.querySelector('.hamburger-icon').classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    toggleMenu() {
        if (this.elements.slideMenu && this.elements.slideMenu.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    setupEventListeners() {
        // Game controls - Submit button
        if (this.elements.submitGuess) {
            this.elements.submitGuess.addEventListener('click', () => {
                const currentInput = this.getCurrentInput();
                if (currentInput) {
                    const guess = currentInput.value.trim();
                    if (guess) {
                        this.makeGuess(guess);
                        this.playButtonClickSound();
                    }
                }
            });
        }
        
        // Game controls - Skip button
        if (this.elements.skipGuess) {
            this.elements.skipGuess.addEventListener('click', () => {
                this.skipGuess();
                this.playButtonClickSound();
            });
        }
        
        // Set up event listeners for all input fields
        for (let i = 1; i <= 5; i++) {
            const input = this.elements[`guessInput${i}`];
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const guess = input.value.trim();
                        if (guess) {
                            this.makeGuess(guess);
                            this.playButtonClickSound();
                        }
                    }
                });
            }
        }
        
        // Hamburger Menu Controls
        if (this.elements.hamburgerMenu) {
            this.elements.hamburgerMenu.addEventListener('click', () => {
                this.toggleMenu();
                this.playButtonClickSound();
            });
        }
        
        if (this.elements.closeMenu) {
            this.elements.closeMenu.addEventListener('click', () => {
                this.closeMenu();
                this.playButtonClickSound();
            });
        }
        
        if (this.elements.menuOverlay) {
            this.elements.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Menu Navigation Links
        if (this.elements.menuStatsLink) {
            this.elements.menuStatsLink.addEventListener('click', () => {
                this.closeMenu();
                this.updateStatsDisplay();
                this.elements.statsModal.style.display = 'flex';
                this.playButtonClickSound();
            });
        }
        
        if (this.elements.menuCalendarLink) {
            this.elements.menuCalendarLink.addEventListener('click', () => {
                this.closeMenu();
                this.elements.calendarModal.style.display = 'flex';
                this.renderCalendar();
                this.playButtonClickSound();
            });
        }
        
        if (this.elements.menuHelpLink) {
            this.elements.menuHelpLink.addEventListener('click', () => {
                this.closeMenu();
                this.elements.helpModal.style.display = 'flex';
                this.playButtonClickSound();
            });
        }
        
        // Menu Settings Toggles
        if (this.elements.menuSoundEffectsToggle) {
            this.elements.menuSoundEffectsToggle.addEventListener('change', (e) => {
                this.soundEffectsEnabled = e.target.checked;
                this.saveSettings();
                this.playButtonClickSound();
            });
        }
        
        if (this.elements.menuBackgroundMusicToggle) {
            this.elements.menuBackgroundMusicToggle.addEventListener('change', (e) => {
                this.backgroundMusicEnabled = e.target.checked;
                this.toggleBackgroundMusic();
                this.saveSettings();
                this.playButtonClickSound();
            });
        }
        
        // Close menu on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.slideMenu && this.elements.slideMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Calendar functionality
        if (this.elements.closeCalendar) {
            this.elements.closeCalendar.addEventListener('click', () => {
                this.elements.calendarModal.style.display = 'none';
            });
        }
        
        // Today button functionality
        const todayButton = document.getElementById('todayButton');
        if (todayButton) {
            todayButton.addEventListener('click', () => {
                this.elements.calendarModal.style.display = 'none';
                this.resetToToday();
            });
        }
        
        if (this.elements.prevMonth) {
            this.elements.prevMonth.addEventListener('click', () => {
                this.currentCalendarMonth--;
                if (this.currentCalendarMonth < 0) {
                    this.currentCalendarMonth = 11;
                    this.currentCalendarYear--;
                }
                this.renderCalendar();
            });
        }
        
        if (this.elements.nextMonth) {
            this.elements.nextMonth.addEventListener('click', () => {
                this.currentCalendarMonth++;
                if (this.currentCalendarMonth > 11) {
                    this.currentCalendarMonth = 0;
                    this.currentCalendarYear++;
                }
                this.renderCalendar();
            });
        }
        
        // Help functionality
        if (this.elements.closeHelp) {
            this.elements.closeHelp.addEventListener('click', () => {
                this.elements.helpModal.style.display = 'none';
            });
        }
        
        // Stats functionality
        if (this.elements.closeStats) {
            this.elements.closeStats.addEventListener('click', () => {
                this.elements.statsModal.style.display = 'none';
            });
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (this.elements.calendarModal && e.target === this.elements.calendarModal) {
                this.elements.calendarModal.style.display = 'none';
            }
            if (this.elements.helpModal && e.target === this.elements.helpModal) {
                this.elements.helpModal.style.display = 'none';
            }
            if (this.elements.statsModal && e.target === this.elements.statsModal) {
                this.elements.statsModal.style.display = 'none';
            }
        });

        // Past challenges button in congrats section
        const pastChallengesBtn = document.getElementById('pastChallengesBtn');
        if (pastChallengesBtn) {
            pastChallengesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.elements.congrats.style.display = 'none';
                this.elements.calendarModal.style.display = 'flex';
                this.renderCalendar();
            });
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CelebrityBirthdayChallenge();
});