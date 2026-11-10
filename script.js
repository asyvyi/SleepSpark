// --- QUOTES ---
const quotes = [
    "Sleep is the best meditation. 🛌",
    "Early to bed and early to rise makes a kid healthy, wealthy, and wise. 🌟",
    "A good laugh and a long sleep are the two best cures. 😴",
    "Sleep is that golden chain that ties health and our bodies together. ✨",
    "Your body is a temple, treat it with rest and care. 🏛️",
    "Sleep is the best time to recharge your superpowers. ⚡",
    "Dream big, sleep well. 🌙",
    "A well-rested mind learns faster and remembers better. 🧠",
    "Sleep is your brain’s favorite workout. 🏋️‍♂️",
    "Even superheroes need their sleep. 🦸‍♂️",
    "Sleep is the secret ingredient to a happy day. 😊",
    "Your body grows stronger while you sleep. 💪",
    "Good sleep is like hitting the reset button. 🔄",
    "Rest well, dream well, live well. 🌈",
    "Sleep now, conquer tomorrow. 🚀",
    "A consistent bedtime is a secret to a healthy life. 🕰️",
    "Sleep helps you think, play, and learn better. 🎮📚",
    "Every night is a chance to recharge your magic. ✨",
    "Sleep is not lazy — it’s your body’s superpower. 🦸‍♀️",
    "Sleep is the fuel that powers your day. ⛽"
];

// Display random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteDisplay").innerText = `"${quotes[randomIndex]}"`;
}
window.addEventListener("load", displayRandomQuote);

// --- MODE SWITCH ---
const modeSwitch = document.getElementById("modeSwitch");
modeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("day-mode");
    document.querySelector(".mode-label").innerText =
        document.body.classList.contains("day-mode") ? "Day Mode ☀️" : "Night Mode 🌙";
});

// --- CALCULATE SLEEP AMOUNT ---
function calculateSleepAmount(bedtime, waketime) {
    let [wakeH, wakeM] = waketime.split(":").map(Number);
    let [sleepH, sleepM] = bedtime.split(":").map(Number);

    let wakeTotal = wakeH * 60 + wakeM;
    let sleepTotal = sleepH * 60 + sleepM;

    if (sleepTotal > wakeTotal) wakeTotal += 24 * 60; // wrap next day

    let totalMinutes = wakeTotal - sleepTotal;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}

// --- GET TOP BEDTIMES FOR CALCULATE ---
function getTopSleepTimes(wakeTime) {
    let [wakeH, wakeM] = wakeTime.split(":").map(Number);
    const wakeTotal = wakeH * 60 + wakeM;
    const sleepTimes = [];
    const cycles = [5, 4, 3, 2, 1]; // 5 cycles first = 7.5h, then down

    cycles.forEach(i => {
        let sleepTotal = wakeTotal - i * 90;
        if (sleepTotal < 0) sleepTotal += 24 * 60; // wrap negative
        let h = Math.floor(sleepTotal / 60);
        let m = sleepTotal % 60;
        sleepTimes.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    });

    return sleepTimes;
}

// --- DISPLAY RESULTS ---
function displayTopResults(times, referenceTime, containerId, showCurrentTime = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (showCurrentTime) {
        container.innerHTML += `<div class="small-text">Current Time: ${referenceTime}</div>`;
    }

    times.forEach((time, index) => {
        const sleepAmount = showCurrentTime
            ? calculateSleepAmount(referenceTime, time) // Sleep Now: bedtime = now, wake-up = time
            : calculateSleepAmount(time, referenceTime); // Calculate: bedtime = suggested, wake-up = input

        const div = document.createElement('div');
        div.classList.add('result-card');
        if (index < 3) div.classList.add('best');

        div.innerHTML = `<span class="glow-number">${index + 1})</span>${time} — <span class="sleep-amount">${sleepAmount}</span>`;
        container.appendChild(div);
    });
}

// --- CALCULATE BUTTON ---
document.getElementById('calculateBtn').addEventListener('click', () => {
    const wakeTimeInput = document.getElementById('wakeTimeInput').value;
    if (!wakeTimeInput) return alert('Please select a wake-up time.');
    const topTimes = getTopSleepTimes(wakeTimeInput);
    displayTopResults(topTimes, wakeTimeInput, 'calculateResults');
});

// --- SLEEP NOW BUTTON ---
document.getElementById('sleepNowBtn').addEventListener('click', () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${h}:${m}`;

    const sleepTimes = [];
    const cycles = [5, 6, 7, 3, 4]; // top 3 ideal cycles first

    cycles.forEach(i => {
        let totalMinutes = now.getHours() * 60 + now.getMinutes() + i * 90;
        if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
        let wh = Math.floor(totalMinutes / 60);
        let wm = totalMinutes % 60;
        sleepTimes.push(`${wh.toString().padStart(2, '0')}:${wm.toString().padStart(2, '0')}`);
    });

    displayTopResults(sleepTimes, currentTime, 'sleepNowResults', true); // showCurrentTime = true
});

function getSleepHours(sleep, wake) {
    if (!sleep || !wake) return null;

    let [sh, sm] = sleep.split(":").map(Number);
    let [wh, wm] = wake.split(":").map(Number);

    let sleepMins = sh * 60 + sm;
    let wakeMins = wh * 60 + wm;

    let diff = wakeMins - sleepMins;
    if (diff < 0) diff += 1440;

    return diff / 60;
}

function getScore(hours) {
    if (hours >= 7 && hours <= 9) return 10;      // PERFECT
    if (hours >= 6 && hours < 7) return 7;        // OK
    if (hours > 9 && hours < 10) return 7;        // slightly too much
    if (hours >= 5 && hours < 6) return 5;        // low
    if (hours >= 10) return 3;                    // TOO MUCH ❌
    return 2;                                     // VERY LOW ❌
}

function feedback(score, hours) {
    if (hours >= 7 && hours <= 9) return "Perfect 💚";
    if (hours >= 10) return "Too much sleep ❌";
    if (hours < 5) return "Way too little ❌";
    if (hours < 7) return "Not enough ⚠";
    return "Okay 👍";
}

document.getElementById("calcWeek").addEventListener("click", () => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let total = 0;
    let count = 0;

    days.forEach(day => {
        let sleep = document.getElementById(`${day}-sleep`).value;
        let wake = document.getElementById(`${day}-wake`).value;

        let hours = getSleepHours(sleep, wake);
        let resultBox = document.getElementById(`${day}-result`);

        if (hours !== null) {
            let score = getScore(hours);
            total += score;
            count++;

            resultBox.innerText = `${hours.toFixed(1)}h → ${score}/10 (${feedback(score, hours)})`;
        }
    });

    let weeklyScore = count ? (total / count).toFixed(1) : 0;

    document.getElementById("weeklyScore").innerText =
        `Weekly Score: ${weeklyScore}/10`;

    let msg =
        weeklyScore >= 8 ? "Amazing consistency 🔥"
            : weeklyScore >= 6 ? "Pretty good, improve a bit 👍"
                : "Try sleeping more regularly ⚠";

    document.getElementById("weeklyFeedback").innerText = msg;
});

document.getElementById("shareBtn").addEventListener("click", () => {
    const score = document.getElementById("weeklyScore").innerText;

    const url = `${window.location.origin}?score=${encodeURIComponent(score)}`;

    if (navigator.share) {
        navigator.share({
            title: "My SleepSpark Score 😴",
            text: `Check my sleep result: ${score}`,
            url: url
        });
    } else {
        navigator.clipboard.writeText(url);
        alert("Link copied!");
    }
});
