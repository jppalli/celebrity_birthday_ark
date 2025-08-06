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
            totalPlayed: document.getElementById('totalPlayed'),
            winPercentage: document.getElementById('winPercentage'),
            currentStreak: document.getElementById('currentStreak'),
            maxStreak: document.getElementById('maxStreak'),
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            calendarMonthYear: document.getElementById('calendarMonthYear'),
            topMessageArea: document.getElementById('topMessageArea'),
            playAnotherDayBtn: document.getElementById('playAnotherDayBtn'),
            countdownTimer: document.getElementById('countdownTimer'),
            countdownTime: document.getElementById('countdownTime')
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
        
        // Ensure all modals are properly initialized and hidden
        if (this.elements.calendarModal) {
            this.elements.calendarModal.style.display = 'none';
            this.elements.calendarModal.classList.remove('show');
        }
        if (this.elements.helpModal) {
            this.elements.helpModal.style.display = 'none';
            this.elements.helpModal.classList.remove('show');
        }
        if (this.elements.statsModal) {
            this.elements.statsModal.style.display = 'none';
            this.elements.statsModal.classList.remove('show');
        }
        
        // Hide original message elements since we use top message area
        if (this.elements.successMessage) this.elements.successMessage.style.display = 'none';
        if (this.elements.failureMessage) this.elements.failureMessage.style.display = 'none';
        
        // Start background music when game finishes loading
        setTimeout(() => {
            this.playBackgroundMusic();
        }, 1000);
        
        // Focus on first input
        this.focusCurrentInput();
    }
    
    selectTodaysCelebrity() {
        // Clear any existing completed messages first
        this.clearCompletedMessages();
        
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
        // Get the game result for this date
        const userData = this.loadUserData();
        const gameResult = userData.games[this.currentDate];
        const isToday = this.currentDate === this.formatDate(new Date());
        
        // Remove any existing completed message
        const existingMessage = document.querySelector('.completed-puzzle-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // For past challenges, show different messages based on whether they were solved
        if (!isToday) {
            if (gameResult.solved) {
                // For successfully completed challenges, show in top area with same style as today
                const successContent = `<div class="success-message">
                    <div class="success-message-content">
                        <p>It's <span class="celebrity-name">${this.currentCelebrity.name} <span class="success-icon">🎉</span></span></p>
                        <p>You solved it in ${gameResult.guessesUsed} guess${gameResult.guessesUsed !== 1 ? 'es' : ''}!</p>
                    </div>
                </div>`;
                
                this.showTopMessage(successContent);
                
                // Trigger confetti celebration for past challenge success
                this.triggerConfettiCelebration();
                
                // Show stats for past challenge success
                this.updateCongratsStats();
                setTimeout(() => {
                    this.elements.congrats.style.display = 'block';
                }, 1000);
            } else {
                // For failed challenges, allow replay in top area
                const replayContent = `<div class="replay-challenge-message">
                    <div class="replay-content">
                        <div class="replay-input-section">
                            <p>Want to try again? Enter your guess:</p>
                            <input type="text" id="replayGuessInput" placeholder="Enter celebrity name..." />
                            <button id="submitReplayGuess">Submit Guess</button>
                            <button id="showAnswerBtn">Show Answer</button>
                        </div>
                    </div>
                </div>`;
                
                // Show replay message immediately since we preserved the top area
                this.showTopMessage(replayContent);
                
                // Add event listeners for replay functionality
                setTimeout(() => this.setupReplayEventListeners(), 100);
            }
            
            // Show all clues for reference
            this.revealAllClues();
            this.elements.cluesGrid.style.display = 'flex';
            
            // Hide original game controls
            this.elements.submitGuess.style.display = 'none';
            this.elements.skipGuess.style.display = 'none';
            this.elements.guessesLeft.style.display = 'none';
            
            return;
        }
        
        // For today's challenge, show the completed message in top area
        // Hide game controls but keep clues visible
        this.elements.submitGuess.style.display = 'none';
        this.elements.skipGuess.style.display = 'none';
        this.elements.guessesLeft.style.display = 'none';
        
        // Show completed message in top area with same format as fresh completion
        if (gameResult.solved) {
            const successContent = `<div class="success-message">
                <div class="success-message-content">
                    <p>It's <span class="celebrity-name">${this.currentCelebrity.name} <span class="success-icon">🎉</span></span></p>
                    <p>You solved it in ${gameResult.guessesUsed} guess${gameResult.guessesUsed !== 1 ? 'es' : ''}!</p>
                    <p>Come back tomorrow for a new CelebBday challenge.</p>
                </div>
            </div>`;
            this.showTopMessage(successContent);
            
            // Trigger confetti celebration for today's already completed challenge
            this.triggerConfettiCelebration();
            
            // Show stats for today's already completed challenge
            this.updateCongratsStats();
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
                setTimeout(() => this.elements.congrats.classList.add('show'), 50);
            }, 1000);
        } else {
            const failureContent = `<div class="failure-message">
                <div class="failure-message-content">
                    <h3>Out of Guesses! 😔</h3>
                    <p>You gave it your best shot, but this celeb remained a mystery.</p>
                </div>
            </div>`;
            this.showTopMessage(failureContent, true);
            
            // Show stats for failed game
            this.updateCongratsStats();
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
                setTimeout(() => this.elements.congrats.classList.add('show'), 50);
            }, 1000);
        }
        
        // Show all clues for reference
        this.revealAllClues();
        this.elements.cluesGrid.style.display = 'flex';
        
        // Show countdown timer for today's completed challenge
        if (isToday) {
            setTimeout(() => {
                this.showCountdownTimer();
            }, 1000);
        }
    }
    
    setupReplayEventListeners() {
        const replayInput = document.getElementById('replayGuessInput');
        const submitReplayBtn = document.getElementById('submitReplayGuess');
        const showAnswerBtn = document.getElementById('showAnswerBtn');
        
        if (replayInput && submitReplayBtn) {
            // Handle replay guess submission
            const handleReplayGuess = () => {
                const guess = replayInput.value.trim();
                if (guess) {
                    this.handleReplayGuess(guess);
                }
            };
            
            submitReplayBtn.addEventListener('click', handleReplayGuess);
            replayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleReplayGuess();
                }
            });
        }
        
        if (showAnswerBtn) {
            showAnswerBtn.addEventListener('click', () => {
                this.showReplayAnswer();
            });
        }
    }
    
    handleReplayGuess(guess) {
        const normalizedGuess = guess.toLowerCase().trim();
        const normalizedAnswer = this.currentCelebrity.name.toLowerCase().trim();
        
        if (normalizedGuess === normalizedAnswer) {
            // Correct guess - show celebration in top area
            const successContent = `<div class="success-message">
                <div class="success-message-content">
                    <p>It's <span class="celebrity-name">${this.currentCelebrity.name} <span class="success-icon">🎉</span></span>!</p>
                    <p>Great job solving this challenge!</p>
                </div>
            </div>`;
            this.showTopMessage(successContent);
            this.triggerConfettiCelebration();
            
            // Save the successful replay completion
            this.saveReplayCompletion();
        } else {
            // Incorrect guess - don't reveal the answer, just end the replay
            const incorrectContent = `<div class="failure-message">
                <div class="failure-message-content">
                    <h3>Not Quite! 😔</h3>
                    <p>Your guess: <strong>${guess}</strong></p>
                    <p>You've used your replay attempt, but the mystery remains!</p>
                    <p>Better luck with tomorrow's CelebBday!</p>
                </div>
            </div>`;
            this.showTopMessage(incorrectContent);
        }
    }
    
    showReplayAnswer() {
        const answerContent = `<div class="replay-challenge-message">
            <div class="replay-answer">
                <h3>The Answer</h3>
                <p>The celebrity is: <strong>${this.currentCelebrity.name}</strong></p>
                <p>Thanks for playing!</p>
            </div>
        </div>`;
        this.showTopMessage(answerContent);
    }
    
    saveReplayCompletion() {
        const userData = this.loadUserData();
        const dateStr = this.currentDate;
        
        // Update the game record to show it as solved
        userData.games[dateStr] = {
            solved: true,
            time: 0, // Replay doesn't track time
            score: 100, // Give a standard score for replay success
            guessesUsed: 1, // Replay allows 1 guess
            date: dateStr,
            completed: true,
            replaySuccess: true // Mark as replay success
        };
        
        // Update total solved count
        userData.stats.totalSolved = Object.values(userData.games).filter(g => g.solved).length;
        userData.stats.totalScore += 100; // Add replay score
        
        // Don't update streak for replay completions (only for today's puzzle)
        
        this.saveUserData(userData);
        
        // Refresh the calendar if it's open to show the updated status
        if (this.elements.calendarModal && this.elements.calendarModal.style.display !== 'none') {
            this.renderCalendar();
        }
    }
    
    resetToToday() {
        // Remove any completed messages
        this.clearCompletedMessages();
        
        // Reset to today's puzzle
        this.selectTodaysCelebrity();
    }
    
    clearCompletedMessages(preserveTopArea = false) {
        // Remove all types of completed challenge messages from the DOM
        const completedMessages = document.querySelectorAll('.completed-puzzle-message, .replay-challenge-message, .completed-challenge-message');
        completedMessages.forEach(message => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        });
        
        // Only clear the top message area if not preserving it
        if (!preserveTopArea) {
            this.hideTopMessage();
        }
    }
    
    showTopMessage(content, scrollToTop = false) {
        if (this.elements.topMessageArea) {
            // Clear any pending hide timeouts
            if (this.hideTopMessageTimeout) {
                clearTimeout(this.hideTopMessageTimeout);
                this.hideTopMessageTimeout = null;
            }
            
            this.elements.topMessageArea.innerHTML = content;
            this.elements.topMessageArea.style.display = 'block';
            // Trigger reflow for smooth animation
            this.elements.topMessageArea.offsetHeight;
            this.elements.topMessageArea.classList.add('show');
            
            // Scroll to top if requested
            if (scrollToTop) {
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100); // Small delay to ensure message is rendered
            }
        }
    }

    showModal(modal) {
        if (modal) {
            // Ensure modal is properly positioned
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.zIndex = '1000';
            modal.style.display = 'flex';
            
            // Trigger reflow for smooth animation
            modal.offsetHeight;
            modal.classList.add('show');
            
            // Prevent body scrolling on mobile
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                // Restore body scrolling
                document.body.style.overflow = '';
            }, 300); // Match transition duration
        }
    }
    
    hideTopMessage() {
        if (this.elements.topMessageArea) {
            this.elements.topMessageArea.classList.remove('show');
            this.hideTopMessageTimeout = setTimeout(() => {
                if (this.elements.topMessageArea) {
                    this.elements.topMessageArea.style.display = 'none';
                    this.elements.topMessageArea.innerHTML = '';
                }
                this.hideTopMessageTimeout = null;
            }, 300);
        }
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
        
        // Get the current guess from the input
        const currentInput = this.getCurrentInput();
        const correctGuess = currentInput ? currentInput.value.trim() : this.currentCelebrity.name;
        
        // Mark current clue box as successful
        const currentClueBox = this.elements[`clue${this.currentActiveInput}`];
        if (currentClueBox) {
            currentClueBox.classList.remove('active');
            currentClueBox.classList.add('filled', 'correct');
        }
        
        // Don't show the guessed name or success message in clue area when correct
        const failedGuessElement = this.elements[`failedGuess${this.currentActiveInput}`];
        if (failedGuessElement) {
            failedGuessElement.style.display = 'none';
        }
        
        // Hide current input
        if (currentInput) {
            currentInput.style.display = 'none';
        }
        
        // Don't add to sidebar - guesses only show inside clue boxes
        
        // Show success message in top area
        const isToday = this.currentDate === this.formatDate(new Date());
        const successContent = `<div class="success-message">
            <div class="success-message-content">
                <p>It's <span class="celebrity-name">${this.currentCelebrity.name} <span class="success-icon">🎉</span></span></p>
                <p>You solved it in ${guessesUsed} guess${guessesUsed !== 1 ? 'es' : ''}!</p>
            </div>
        </div>`;
        this.showTopMessage(successContent);
        
        // Hide buttons
        this.elements.submitGuess.style.display = 'none';
        this.elements.skipGuess.style.display = 'none';
        this.elements.guessesLeft.style.display = 'none';
        
        // Reveal all remaining clues
        this.revealAllClues();
        
        // Trigger confetti celebration
        this.triggerConfettiCelebration();
        
        // Record completion and show stats
        this.recordGameCompletion();
        this.updateCongratsStats();
        
        // For past challenges, show stats immediately. For today, show after delay
        if (isToday) {
            // Show countdown timer for today's completed challenge
            setTimeout(() => {
                this.showCountdownTimer();
            }, 1000);
            
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
                setTimeout(() => this.elements.congrats.classList.add('show'), 50);
            }, 2000);
        } else {
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
                setTimeout(() => this.elements.congrats.classList.add('show'), 50);
            }, 1000);
        }
        
        this.playSuccessSound();
    }
    
    handleIncorrectGuess(guess) {
        this.guessesRemaining--;
        this.previousGuesses.push(guess);
        
        // Show failed guess in current clue box (simple, no clever message)
        const failedGuessElement = this.elements[`failedGuess${this.currentActiveInput}`];
        if (failedGuessElement) {
            failedGuessElement.innerHTML = `<span class="incorrect-guess">❌ ${guess}</span>`;
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
        
        // Don't add to sidebar - guesses only show inside clue boxes
        
        if (this.guessesRemaining <= 0) {
            // Game over - show failure message in top area
            this.gameComplete = true;
            this.endTime = new Date();
            this.gameTime = Math.floor((this.endTime - this.startTime) / 1000);
            
            // Show failure message in top area without spoiling the answer
            const failureContent = `<div class="failure-message">
                <div class="failure-message-content">
                    <h3>Out of Guesses! 😔</h3>
                    <p>You gave it your best shot, but today's celeb remains a mystery.</p>
                    <p>Come back tomorrow for a fresh challenge and another chance to shine! 🌟</p>
                </div>
            </div>`;
            this.showTopMessage(failureContent, true);
            
            // Hide buttons
            this.elements.submitGuess.style.display = 'none';
            this.elements.skipGuess.style.display = 'none';
            this.elements.guessesLeft.style.display = 'none';
            
            // Reveal all clues
            this.revealAllClues();
            
            // Record the failed game for calendar status
            this.recordGameCompletion();
            
            // Show stats for failed game
            this.updateCongratsStats();
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
                setTimeout(() => this.elements.congrats.classList.add('show'), 50);
            }, 1000);
            
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
        
        // Show skip message in current clue box (simple, no clever message)
        const failedGuessElement = this.elements[`failedGuess${this.currentActiveInput}`];
        if (failedGuessElement) {
            failedGuessElement.innerHTML = `<span class="skipped-guess">⏭️ Skipped</span>`;
            failedGuessElement.style.display = 'block';
        }
        
        // Mark current clue box as skipped
        const currentClueBox = this.elements[`clue${this.currentActiveInput}`];
        if (currentClueBox) {
            currentClueBox.classList.remove('active');
            currentClueBox.classList.add('filled', 'skipped');
        }
        
        // Hide current input
        const currentInput = this.getCurrentInput();
        if (currentInput) {
            currentInput.style.display = 'none';
        }
        
        // Don't add to sidebar - guesses only show inside clue boxes
        
        if (this.guessesRemaining <= 0) {
            // Game over - show failure message in top area
            this.gameComplete = true;
            this.endTime = new Date();
            this.gameTime = Math.floor((this.endTime - this.startTime) / 1000);
            
            // Show failure message in top area without spoiling the answer
            const failureContent = `<div class="failure-message">
                <div class="failure-message-content">
                    <h3>Out of Guesses! 😔</h3>
                    <p>You gave it your best shot, but today's celeb remains a mystery.</p>
                    <p>Come back tomorrow for a fresh challenge and another chance to shine! 🌟</p>
                </div>
            </div>`;
            this.showTopMessage(failureContent, true);
            
            // Hide buttons
            this.elements.submitGuess.style.display = 'none';
            this.elements.skipGuess.style.display = 'none';
            this.elements.guessesLeft.style.display = 'none';
            
            // Reveal all clues
            this.revealAllClues();
            
            // Record the failed game for calendar status
            this.recordGameCompletion();
            
            // Show stats for failed game
            this.updateCongratsStats();
            setTimeout(() => {
                this.elements.congrats.style.display = 'block';
                setTimeout(() => this.elements.congrats.classList.add('show'), 50);
            }, 1000);
            
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

    getCleverFailureMessage() {
        const messages = [
            "Not quite the star we're looking for! ⭐",
            "Close, but no Hollywood Walk of Fame! 🌟",
            "That's not ringing any bells... or Oscar bells! 🔔",
            "Swing and a miss! Try channeling your inner celebrity! 🎭",
            "Hmm, that name doesn't sparkle like a celebrity! ✨",
            "Not the right celebrity, but nice try! 🎬",
            "That guess is more like a background extra! 🎪",
            "Keep trying - fame awaits the persistent! 🏆",
            "Not quite A-list material... yet! 📸",
            "That's not hitting the red carpet! 🎪"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    getFinalFailureMessage() {
        const messages = [
            "Looks like you don't know everyone in Hollywood! 🎬",
            "Even the paparazzi would have gotten this one! 📸",
            "Time to brush up on your celebrity knowledge! 📚",
            "This star was hiding in plain sight! ⭐",
            "Better luck next time, future celebrity expert! 🌟",
            "Don't worry, even celebrities forget each other's names! 😅",
            "You gave it your best shot - that's what counts! 🎯",
            "Sometimes the stars just don't align! ✨",
            "This celebrity will remember you tried! 💫",
            "Practice makes perfect in the celebrity game! 🎭"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    triggerConfettiCelebration() {
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confettiContainer);
        
        // Enhanced confetti burst with different colors and sizes
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
            '#dda0dd', '#98d8c8', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24', '#0abde3',
            '#feca57', '#48dbfb', '#ff6348', '#1dd1a1', '#ffd32a'
        ];
        
        // Set confetti to burst from the top of the screen (header area)
        const headerPosition = { x: 50, y: 8 }; // 50% from left, 8% from top (header area)
        
        // Single center burst with many more particles starting from header
        this.createConfettiBurst(confettiContainer, colors, headerPosition, 120); // 120 particles!
        
        // Add enhanced CSS animation if not already present
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-center-burst {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    15% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(var(--fall-distance)) translateX(var(--drift)) rotate(var(--rotation)) scale(0.3);
                        opacity: 0;
                    }
                }
                
                .confetti-piece {
                    border-radius: 2px;
                }
                
                .confetti-piece.square {
                    border-radius: 0;
                }
                
                .confetti-piece.circle {
                    border-radius: 50%;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 6000);
    }
    
    createConfettiBurst(container, colors, position, count) {
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            
            // Random size - different sized rectangles
            const width = Math.random() * 12 + 4; // 4-16px width
            const height = Math.random() * 8 + 3; // 3-11px height
            
            // Random shape variation
            const shapeType = Math.random();
            if (shapeType < 0.7) {
                confetti.classList.add('square'); // 70% rectangles/squares
            } else if (shapeType < 0.9) {
                confetti.classList.add('circle'); // 20% circles
            }
            // 10% default rounded rectangles
            
            // Enhanced center burst physics - more dramatic spread
            const angle = (Math.random() * 360) * (Math.PI / 180); // Random angle in radians
            const velocity = Math.random() * 300 + 100; // 100-400px spread
            const drift = Math.cos(angle) * velocity; // X movement based on angle
            const fallDistance = Math.random() * 80 + 60; // 60-140vh fall distance
            const rotation = Math.random() * 1800 + 720; // 720-2520 degrees
            const duration = 3 + Math.random() * 2.5; // 3-5.5 seconds
            
            confetti.style.cssText = `
                position: absolute;
                width: ${width}px;
                height: ${height}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${position.x}%;
                top: ${position.y}%;
                --drift: ${drift}px;
                --fall-distance: ${fallDistance}vh;
                --rotation: ${rotation}deg;
                animation: confetti-center-burst ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                opacity: 0.9;
                transform: rotate(${Math.random() * 360}deg);
                box-shadow: 0 0 6px rgba(0,0,0,0.1);
            `;
            
            container.appendChild(confetti);
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
            success: 'sounds/success.mp3',
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
        
        const totalPlayed = Object.keys(userData.games).length;
        const winPercentage = totalPlayed > 0 ? Math.round((stats.totalSolved / totalPlayed) * 100) : 0;
        
        if (this.elements.totalPlayed) {
            this.elements.totalPlayed.textContent = totalPlayed;
        }
        if (this.elements.winPercentage) {
            this.elements.winPercentage.textContent = `${winPercentage}%`;
        }
        if (this.elements.currentStreak) {
            this.elements.currentStreak.textContent = stats.currentStreak;
        }
        if (this.elements.maxStreak) {
            this.elements.maxStreak.textContent = stats.maxStreak;
        }
    }

    updateCongratsStats() {
        const userData = this.loadUserData();
        const stats = userData.stats;
        
        const totalPlayed = Object.keys(userData.games).length;
        const winPercentage = totalPlayed > 0 ? Math.round((stats.totalSolved / totalPlayed) * 100) : 0;
        
        const congratsTotalPlayed = document.getElementById('congratsTotalPlayed');
        const congratsWinPercentage = document.getElementById('congratsWinPercentage');
        const congratsCurrentStreak = document.getElementById('congratsCurrentStreak');
        const congratsMaxStreak = document.getElementById('congratsMaxStreak');
        
        if (congratsTotalPlayed) congratsTotalPlayed.textContent = totalPlayed;
        if (congratsWinPercentage) congratsWinPercentage.textContent = `${winPercentage}%`;
        if (congratsCurrentStreak) congratsCurrentStreak.textContent = stats.currentStreak;
        if (congratsMaxStreak) congratsMaxStreak.textContent = stats.maxStreak;
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

    getTimeUntilNextBirthday() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeDiff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        return { hours, minutes, seconds };
    }

    updateCountdownTimer() {
        if (!this.elements.countdownTimer || !this.elements.countdownTime) return;
        
        const { hours, minutes, seconds } = this.getTimeUntilNextBirthday();
        this.elements.countdownTime.textContent = `${hours}h ${minutes}m ${seconds}s`;
        
        // Update every second
        setTimeout(() => this.updateCountdownTimer(), 1000);
    }

    showCountdownTimer() {
        if (!this.elements.countdownTimer) return;
        
        this.elements.countdownTimer.style.display = 'block';
        this.updateCountdownTimer();
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
            let statusIcon = '';
            let dayContent = day;
            
            if (isToday) {
                classes += ' today';
                // Give today the same format as solved days
                dayContent = `<span class="day-number">${day}</span><span class="status-indicator success">✓</span>`;
            } else if (isPast) {
                classes += ' past';
            } else if (isFuture) {
                classes += ' future';
            }
            
            // Check if this date has been played and add status indicators
            if (userData.games && userData.games[dateStr]) {
                if (userData.games[dateStr].solved) {
                    classes += ' solved';
                    dayContent = `<span class="day-number">${day}</span><span class="status-indicator success">✓</span>`;
                } else {
                    classes += ' failed';
                    dayContent = `<span class="day-number">${day}</span><span class="status-indicator failed">✗</span>`;
                }
            } else if (isFuture) {
                // Future dates are locked
                dayContent = `<span class="day-number">${day}</span><span class="status-indicator locked">•</span>`;
                classes += ' locked';
            } else if (!isToday) {
                // Past unplayed days (not today)
                dayContent = `<span class="day-number">${day}</span>`;
            }
            // Today's dayContent is already set above
            
            // Check if there's a celebrity for this month-day
            const monthDay = this.formatMonthDay(date);
            const celebrity = this.celebrities.find(c => c.date === monthDay);
            
            let title = '';
            let cursor = 'default';
            
            if (isFuture) {
                title = `Locked - Come back on ${dateStr}`;
                cursor = 'not-allowed';
            } else {
                title = '';
                cursor = 'pointer';
            }
            
            html += `<div class="${classes}" data-date="${dateStr}" style="cursor: ${cursor};" title="${title}">
                <span class="calendar-day-content">${dayContent}</span>
            </div>`;
        }
        
        this.elements.calendarDates.innerHTML = html;
        
        document.querySelectorAll('.calendar-date[data-date]').forEach(el => {
            el.addEventListener('click', () => {
                const dateStr = el.dataset.date;
                
                const clickedDate = new Date(dateStr);
                const today = new Date();
                
                if (clickedDate > today) {
                    // Show locked message for future dates
                    this.showLockedDateMessage(dateStr);
                    return;
                }
                
                this.loadChallengeForDate(dateStr);
                this.hideModal(this.elements.calendarModal);
                
                // Calendar status remains unchanged
            });
        });
        
        this.updateCalendarNavigation();
    }
    
    showLockedDateMessage(dateStr) {
        // Create a temporary message for locked dates
        const message = document.createElement('div');
        message.className = 'locked-date-message';
        message.innerHTML = `
            <div class="locked-message-content">
                <h3>Date Locked</h3>
                <p>This challenge will be available on ${dateStr}</p>
                <p>Come back then to play!</p>
            </div>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(message);
        
        // Remove message after 2 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 2000);
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
        // Immediately clear the top message content to prevent flashing
        if (this.elements.topMessageArea) {
            this.elements.topMessageArea.innerHTML = '';
            this.elements.topMessageArea.classList.remove('show');
        }
        
        // Clear any existing completed messages
        this.clearCompletedMessages(false);
        
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
            
            // Check if this puzzle has already been played FIRST
            const userData = this.loadUserData();
            const isCompleted = userData.games && userData.games[dateStr];
            
            // Reset UI elements
            this.elements.congrats.classList.remove('show');
            this.elements.congrats.style.display = 'none';
            this.elements.successMessage.style.display = 'none';
            this.elements.failureMessage.style.display = 'none';
            this.elements.previousGuesses.innerHTML = '';
            
            // Hide countdown timer for past challenges
            if (this.elements.countdownTimer) {
                this.elements.countdownTimer.style.display = 'none';
            }
            
            // Show clues grid
            this.elements.cluesGrid.style.display = 'flex';
            
            // Reset all failed guess displays
            for (let i = 1; i <= 5; i++) {
                const failedGuess = this.elements[`failedGuess${i}`];
                if (failedGuess) {
                    failedGuess.style.display = 'none';
                }
            }
            
            if (isCompleted) {
                // Hide game controls for completed puzzles
                this.elements.submitGuess.style.display = 'none';
                this.elements.skipGuess.style.display = 'none';
                this.elements.guessesLeft.style.display = 'none';
                
                // Show completed puzzle message
                this.showCompletedPuzzleMessage();
            } else {
                // Show game controls for new puzzles
                this.elements.submitGuess.style.display = 'inline-block';
                this.elements.skipGuess.style.display = 'inline-block';
                this.elements.guessesLeft.style.display = 'block';
                
                // Set up the game for playing
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
            const handleStatsClick = () => {
                this.closeMenu();
                // Small delay to ensure menu closes before modal opens
                setTimeout(() => {
                    this.updateStatsDisplay();
                    this.showModal(this.elements.statsModal);
                }, 100);
                this.playButtonClickSound();
            };
            
            this.elements.menuStatsLink.addEventListener('click', handleStatsClick);
            this.elements.menuStatsLink.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleStatsClick();
            });
        }
        
        if (this.elements.menuCalendarLink) {
            const handleCalendarClick = () => {
                this.closeMenu();
                // Small delay to ensure menu closes before modal opens
                setTimeout(() => {
                    this.showModal(this.elements.calendarModal);
                    this.renderCalendar();
                }, 100);
                this.playButtonClickSound();
            };
            
            this.elements.menuCalendarLink.addEventListener('click', handleCalendarClick);
            this.elements.menuCalendarLink.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleCalendarClick();
            });
        }
        
        if (this.elements.menuHelpLink) {
            this.elements.menuHelpLink.addEventListener('click', () => {
                this.closeMenu();
                this.showModal(this.elements.helpModal);
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
                this.hideModal(this.elements.calendarModal);
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
                this.hideModal(this.elements.helpModal);
            });
        }
        
        // Stats functionality
        if (this.elements.closeStats) {
            this.elements.closeStats.addEventListener('click', () => {
                this.hideModal(this.elements.statsModal);
            });
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (this.elements.calendarModal && e.target === this.elements.calendarModal) {
                this.hideModal(this.elements.calendarModal);
            }
            if (this.elements.helpModal && e.target === this.elements.helpModal) {
                this.hideModal(this.elements.helpModal);
            }
            if (this.elements.statsModal && e.target === this.elements.statsModal) {
                this.hideModal(this.elements.statsModal);
            }
        });

        // Past challenges button in congrats section
        const pastChallengesBtn = document.getElementById('pastChallengesBtn');
        if (pastChallengesBtn) {
            pastChallengesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.elements.congrats.classList.remove('show');
                this.elements.congrats.style.display = 'none';
                this.showModal(this.elements.calendarModal);
                this.renderCalendar();
            });
        }

        // Play Another Day button in congrats section
        const playAnotherDayBtn = document.getElementById('playAnotherDayBtn');
        if (playAnotherDayBtn) {
            playAnotherDayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.elements.congrats.classList.remove('show');
                this.elements.congrats.style.display = 'none';
                this.showModal(this.elements.calendarModal);
                this.renderCalendar();
                this.playButtonClickSound();
            });
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CelebrityBirthdayChallenge();
});