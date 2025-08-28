// Game State
let gameState = {
    players: [],
    currentHole: 1,
    scores: {},
    waterfallActive: false,
    waterfallStartTime: null
};

// Par values for each hole (default 4 for all holes)
const holePars = [4, 4, 4, 4, 4, 4, 4, 4, 4];

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const addPlayerBtn = document.getElementById('add-player');
const resetGameBtn = document.getElementById('reset-game');
const addPlayerModal = document.getElementById('add-player-modal');
const playerNameInput = document.getElementById('player-name-input');
const playerColorInput = document.getElementById('player-color-input');
const confirmAddPlayerBtn = document.getElementById('confirm-add-player');
const cancelAddPlayerBtn = document.getElementById('cancel-add-player');
const playersContainer = document.getElementById('players-container');
const scorecardTable = document.getElementById('scorecard-table');
const currentHoleNumber = document.getElementById('current-hole-number');
const nextHoleBtn = document.getElementById('next-hole');
const startWaterfallBtn = document.getElementById('start-waterfall');
const waterfallOrder = document.getElementById('waterfall-order');
const startWaterfallCeremonyBtn = document.getElementById('start-waterfall-ceremony');
const stopWaterfallBtn = document.getElementById('stop-waterfall');
const waterfallTimer = document.getElementById('waterfall-timer');
const timerDisplay = document.getElementById('timer-display');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadGameState();
});

function initializeApp() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Player management
    addPlayerBtn.addEventListener('click', showAddPlayerModal);
    confirmAddPlayerBtn.addEventListener('click', addPlayer);
    cancelAddPlayerBtn.addEventListener('click', hideAddPlayerModal);
    resetGameBtn.addEventListener('click', resetGame);

    // Game controls
    nextHoleBtn.addEventListener('click', nextHole);
    startWaterfallBtn.addEventListener('click', () => switchTab('waterfall'));
    startWaterfallCeremonyBtn.addEventListener('click', startWaterfallCeremony);
    stopWaterfallBtn.addEventListener('click', stopWaterfallCeremony);

    // Modal close on outside click
    addPlayerModal.addEventListener('click', (e) => {
        if (e.target === addPlayerModal) hideAddPlayerModal();
    });

    // Enter key support for adding players
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });

    // Initialize scorecard
    updateScorecard();
    updateCurrentHoleInfo();
    updateWaterfallOrder();
}

function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });

    // Update waterfall order when switching to waterfall tab
    if (tabName === 'waterfall') {
        updateWaterfallOrder();
    }
}

function showAddPlayerModal() {
    addPlayerModal.classList.add('active');
    playerNameInput.focus();
    // Generate random color
    const colors = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    playerColorInput.value = colors[Math.floor(Math.random() * colors.length)];
}

function hideAddPlayerModal() {
    addPlayerModal.classList.remove('active');
    playerNameInput.value = '';
}

function addPlayer() {
    const name = playerNameInput.value.trim();
    const color = playerColorInput.value;

    if (!name) {
        alert('Please enter a player name');
        return;
    }

    if (gameState.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('Player name already exists');
        return;
    }

    const player = {
        id: Date.now().toString(),
        name: name,
        color: color
    };

    gameState.players.push(player);
    gameState.scores[player.id] = new Array(9).fill(0);

    updatePlayersDisplay();
    updateScorecard();
    updateWaterfallOrder();
    hideAddPlayerModal();
    saveGameState();
}

function removePlayer(playerId) {
    if (confirm('Are you sure you want to remove this player?')) {
        gameState.players = gameState.players.filter(p => p.id !== playerId);
        delete gameState.scores[playerId];
        
        updatePlayersDisplay();
        updateScorecard();
        updateWaterfallOrder();
        saveGameState();
    }
}

function updatePlayersDisplay() {
    playersContainer.innerHTML = '';
    
    gameState.players.forEach(player => {
        const playerChip = document.createElement('div');
        playerChip.className = 'player-chip';
        playerChip.style.borderColor = player.color;
        
        playerChip.innerHTML = `
            <div class="player-color" style="background-color: ${player.color}"></div>
            <span>${player.name}</span>
            <button class="remove-player" onclick="removePlayer('${player.id}')">×</button>
        `;
        
        playersContainer.appendChild(playerChip);
    });
}

function updateScorecard() {
    const thead = scorecardTable.querySelector('thead tr');
    const tbody = scorecardTable.querySelector('tbody');
    const tfoot = scorecardTable.querySelector('tfoot tr');

    // Clear existing player columns
    while (thead.children.length > 2) {
        thead.removeChild(thead.lastChild);
    }
    while (tfoot.children.length > 2) {
        tfoot.removeChild(tfoot.lastChild);
    }

    // Add player headers
    gameState.players.forEach(player => {
        const th = document.createElement('th');
        th.innerHTML = `<div style="color: ${player.color}">${player.name}</div>`;
        thead.appendChild(th);

        const td = document.createElement('td');
        td.innerHTML = `<strong id="total-${player.id}">0</strong>`;
        tfoot.appendChild(td);
    });

    // Clear and rebuild tbody
    tbody.innerHTML = '';
    
    for (let hole = 1; hole <= 9; hole++) {
        const tr = document.createElement('tr');
        
        // Hole number
        const holeCell = document.createElement('td');
        holeCell.innerHTML = `<strong>${hole}</strong>`;
        tr.appendChild(holeCell);
        
        // Par
        const parCell = document.createElement('td');
        parCell.innerHTML = `<strong>${holePars[hole - 1]}</strong>`;
        tr.appendChild(parCell);
        
        // Player scores
        gameState.players.forEach(player => {
            const scoreCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'score-input';
            input.min = '1';
            input.max = '15';
            input.value = gameState.scores[player.id][hole - 1] || '';
            input.addEventListener('input', () => updateScore(player.id, hole - 1, input.value));
            scoreCell.appendChild(input);
            tr.appendChild(scoreCell);
        });
        
        tbody.appendChild(tr);
    }

    updateTotals();
}

function updateScore(playerId, holeIndex, score) {
    const numScore = parseInt(score) || 0;
    gameState.scores[playerId][holeIndex] = numScore;
    updateTotals();
    updateWaterfallOrder();
    saveGameState();
}

function updateTotals() {
    gameState.players.forEach(player => {
        const total = gameState.scores[player.id].reduce((sum, score) => sum + (score || 0), 0);
        const totalElement = document.getElementById(`total-${player.id}`);
        if (totalElement) {
            totalElement.textContent = total;
        }
    });
}

function updateCurrentHoleInfo() {
    currentHoleNumber.textContent = gameState.currentHole;
    
    if (gameState.currentHole >= 9) {
        nextHoleBtn.textContent = 'Game Complete!';
        nextHoleBtn.disabled = true;
    } else {
        nextHoleBtn.textContent = 'Next Hole →';
        nextHoleBtn.disabled = false;
    }
}

function nextHole() {
    if (gameState.currentHole < 9) {
        gameState.currentHole++;
        updateCurrentHoleInfo();
        saveGameState();
    }
}

function updateWaterfallOrder() {
    if (gameState.players.length === 0) {
        waterfallOrder.innerHTML = '<p class="no-players">Add players in the Scorecard tab to see waterfall order</p>';
        return;
    }

    // Get current hole scores
    const currentHoleIndex = gameState.currentHole - 1;
    const playersWithScores = gameState.players.map(player => ({
        ...player,
        currentScore: gameState.scores[player.id][currentHoleIndex] || 0
    }));

    // Sort by current hole score (lowest first)
    playersWithScores.sort((a, b) => {
        if (a.currentScore === 0 && b.currentScore === 0) return 0;
        if (a.currentScore === 0) return 1;
        if (b.currentScore === 0) return -1;
        return a.currentScore - b.currentScore;
    });

    waterfallOrder.innerHTML = '';
    
    playersWithScores.forEach((player, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'player-order';
        orderDiv.style.borderLeftColor = player.color;
        
        orderDiv.innerHTML = `
            <div class="order-number">${index + 1}</div>
            <div class="player-color" style="background-color: ${player.color}"></div>
            <div>
                <strong>${player.name}</strong>
                <div style="font-size: 0.8rem; color: #6b7280;">
                    Hole ${gameState.currentHole}: ${player.currentScore || 'Not scored'} strokes
                </div>
            </div>
        `;
        
        waterfallOrder.appendChild(orderDiv);
    });
}

function startWaterfallCeremony() {
    if (gameState.players.length === 0) {
        alert('Add players first!');
        return;
    }

    gameState.waterfallActive = true;
    gameState.waterfallStartTime = Date.now();
    
    waterfallTimer.style.display = 'block';
    startWaterfallCeremonyBtn.style.display = 'none';
    stopWaterfallBtn.style.display = 'inline-flex';
    
    updateWaterfallTimer();
}

function stopWaterfallCeremony() {
    gameState.waterfallActive = false;
    gameState.waterfallStartTime = null;
    
    waterfallTimer.style.display = 'none';
    startWaterfallCeremonyBtn.style.display = 'inline-flex';
    stopWaterfallBtn.style.display = 'none';
}

function updateWaterfallTimer() {
    if (!gameState.waterfallActive || !gameState.waterfallStartTime) return;
    
    const elapsed = Date.now() - gameState.waterfallStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    if (gameState.waterfallActive) {
        setTimeout(updateWaterfallTimer, 100);
    }
}

function resetGame() {
    if (confirm('Are you sure you want to reset the entire game? This will remove all players and scores.')) {
        gameState = {
            players: [],
            currentHole: 1,
            scores: {},
            waterfallActive: false,
            waterfallStartTime: null
        };
        
        updatePlayersDisplay();
        updateScorecard();
        updateCurrentHoleInfo();
        updateWaterfallOrder();
        stopWaterfallCeremony();
        saveGameState();
    }
}

// Local Storage Functions
function saveGameState() {
    try {
        localStorage.setItem('wedgeWiffleGame', JSON.stringify(gameState));
    } catch (e) {
        console.warn('Could not save game state:', e);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('wedgeWiffleGame');
        if (saved) {
            const loadedState = JSON.parse(saved);
            gameState = { ...gameState, ...loadedState };
            
            // Ensure scores object exists for all players
            gameState.players.forEach(player => {
                if (!gameState.scores[player.id]) {
                    gameState.scores[player.id] = new Array(9).fill(0);
                }
            });
            
            updatePlayersDisplay();
            updateScorecard();
            updateCurrentHoleInfo();
            updateWaterfallOrder();
        }
    } catch (e) {
        console.warn('Could not load game state:', e);
    }
}

// PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// Prevent zoom on double tap (iOS Safari)
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;

// Add haptic feedback for mobile devices
function vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Add vibration to button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') || e.target.classList.contains('tab-btn')) {
        vibrate(25);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    
    switch (e.key) {
        case '1':
            switchTab('rules');
            break;
        case '2':
            switchTab('scorecard');
            break;
        case '3':
            switchTab('waterfall');
            break;
        case 'a':
        case 'A':
            if (document.activeElement.tagName !== 'INPUT') {
                showAddPlayerModal();
                e.preventDefault();
            }
            break;
        case 'Escape':
            hideAddPlayerModal();
            break;
    }
});

// Auto-save on page unload
window.addEventListener('beforeunload', saveGameState);

// Handle visibility change (app backgrounded/foregrounded)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveGameState();
    } else {
        loadGameState();
    }
});