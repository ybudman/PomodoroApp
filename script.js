let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const toggleCheckbox = document.getElementById('toggle-mode');

const FULL_DASH_ARRAY = 2 * Math.PI * 135; // Back to radius 135
const circle = document.querySelector('.progress-ring__circle');

// Set the initial properties of the circle
circle.style.strokeDasharray = `${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`;
circle.style.strokeDashoffset = FULL_DASH_ARRAY;

setProgress(timeLeft, isWorkTime ? 25 * 60 : 5 * 60);

const quotes = [
    "The only way to do great work is to love what you do.",
    "It always seems impossible until it's done.",
    "Don't count the days, make the days count.",
    "Quality is not an act, it is a habit.",
    "Success is not final, failure is not fatal.",
    "Focus on being productive instead of busy.",
    "The future depends on what you do today.",
    "Small progress is still progress.",
    "Your time is limited, don't waste it.",
    "Stay focused, go after your dreams.",
    "Done is better than perfect.",
    "Create the life you can't wait to wake up to.",
    "The only bad workout is the one that didn't happen.",
    "Everything you can imagine is real.",
    "Make each day your masterpiece."
];

let quoteInterval;

function setProgress(timeLeft, totalTime) {
    const progress = timeLeft / totalTime;
    const dashOffset = FULL_DASH_ARRAY * (1 - progress);
    circle.style.strokeDashoffset = dashOffset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the circle
    setProgress(timeLeft, isWorkTime ? 25 * 60 : 5 * 60);
    
    updateTitle();
}

function updateTitle() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - Pomodoro Timer`;
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
                updateDisplay();
                alert(isWorkTime ? 'Work Time!' : 'Break Time!');
            }
        }, 1000);
    }
    
    // Start quote rotation
    updateQuote(); // Show first quote immediately
    quoteInterval = setInterval(updateQuote, 20000); // Change quote every 20 seconds
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    toggleCheckbox.checked = false;
    timeLeft = 25 * 60;
    updateDisplay();
    document.title = 'Pomodoro Timer';
    
    // Clear quote interval
    clearInterval(quoteInterval);
}

toggleCheckbox.addEventListener('change', () => {
    isWorkTime = !toggleCheckbox.checked;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    
    // Remove existing tick marks
    const tickMarks = document.querySelectorAll('.tick-mark');
    tickMarks.forEach(tick => tick.remove());
    
    // Create new tick marks
    createTickMarks();
    
    updateDisplay();
    
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
});

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer); 

function updateQuote() {
    const quoteElement = document.getElementById('quote');
    // Fade out
    quoteElement.style.opacity = 0;
    
    setTimeout(() => {
        // Get random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
        // Fade in
        quoteElement.style.opacity = 1;
    }, 300);
} 

function createTickMarks() {
    const tickGroup = document.querySelector('.tick-marks');
    // Clear existing ticks
    tickGroup.innerHTML = '';
    
    const totalSeconds = isWorkTime ? 25 * 60 : 5 * 60;
    const radius = 135;
    
    for (let i = 0; i < totalSeconds; i++) {
        const angle = (i * 360) / totalSeconds;
        const tickLength = i % 60 === 0 ? 12 : 6; // Shorter ticks for better appearance
        
        const x1 = 150 + (radius - tickLength) * Math.cos((angle - 90) * Math.PI / 180);
        const y1 = 150 + (radius - tickLength) * Math.sin((angle - 90) * Math.PI / 180);
        const x2 = 150 + radius * Math.cos((angle - 90) * Math.PI / 180);
        const y2 = 150 + radius * Math.sin((angle - 90) * Math.PI / 180);
        
        const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tick.setAttribute('x1', x1);
        tick.setAttribute('y1', y1);
        tick.setAttribute('x2', x2);
        tick.setAttribute('y2', y2);
        tick.setAttribute('class', i % 60 === 0 ? 'tick-mark minute' : 'tick-mark');
        
        tickGroup.appendChild(tick);
    }
}

// Make sure to call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createTickMarks();
}); 