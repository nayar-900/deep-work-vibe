let timeLeft = 25 * 60; 
let timerId = null;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const toggleBtn = document.getElementById('toggleBtn');
const streakDisplay = document.getElementById('streak');

// Load streak from storage on open
chrome.storage.local.get(['streak'], (result) => {
    streakDisplay.textContent = `🔥 Streaks: ${result.streak || 0}`;
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

toggleBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        toggleBtn.textContent = 'Start Session';
        toggleBtn.classList.remove('stop-btn');
        chrome.runtime.sendMessage({command: "stop"});
    } else {
        isRunning = true;
        toggleBtn.textContent = 'End Session';
        toggleBtn.classList.add('stop-btn');
        chrome.runtime.sendMessage({command: "start"});
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                isRunning = false;
                toggleBtn.textContent = 'Start Session';
                toggleBtn.classList.remove('stop-btn');
                timeLeft = 25 * 60; 
                updateDisplay();
                chrome.runtime.sendMessage({command: "stop"});
                
                // Add to streak
                chrome.storage.local.get(['streak'], (result) => {
                    const newStreak = (result.streak || 0) + 1;
                    chrome.storage.local.set({streak: newStreak});
                    streakDisplay.textContent = `🔥 Streaks: ${newStreak}`;
                });

                alert("Session Complete! Take a break. You earned a streak! 🔥");
            }
        }, 1000);
    }
});

updateDisplay();