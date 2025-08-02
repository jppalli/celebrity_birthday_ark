// Placeholder for keytype sound
// This file can be used to generate a simple beep sound if no audio file is available

function generateKeytypeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Simple typewriter-like sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.type = 'square';
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
        console.log('Could not generate keytype sound:', error);
    }
}

// Export for use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = generateKeytypeSound;
}