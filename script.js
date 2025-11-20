// Sound Effects with AudioContext for better consistency
const SoundEffects = {
    enabled: true,
    context: null,

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    },

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },

    playCardPlace() {
        this.playTone(400, 0.1, 'square', 0.2);
    },

    playScore() {
        this.playTone(600, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(800, 0.15, 'sine', 0.3), 100);
    },

    playPowerup() {
        this.playTone(500, 0.1, 'square', 0.25);
        setTimeout(() => this.playTone(700, 0.1, 'square', 0.25), 80);
        setTimeout(() => this.playTone(900, 0.15, 'square', 0.25), 160);
    },

    playBonus() {
        this.playTone(700, 0.1, 'sine', 0.25);
    },

    playWin() {
        this.playTone(523, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.3), 150);
        setTimeout(() => this.playTone(784, 0.15, 'sine', 0.3), 300);
        setTimeout(() => this.playTone(1047, 0.3, 'sine', 0.3), 450);
    },

    playLose() {
        this.playTone(392, 0.2, 'sine', 0.3);
        setTimeout(() => this.playTone(349, 0.2, 'sine', 0.3), 200);
        setTimeout(() => this.playTone(294, 0.4, 'sine', 0.3), 400);
    },

    playButton() {
        this.playTone(550, 0.08, 'square', 0.15);
    },

    playUnlock() {
        this.playTone(800, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.3), 100);
        setTimeout(() => this.playTone(1200, 0.2, 'sine', 0.3), 200);
    }
};

SoundEffects.init();

const IconPacks = {
    default: (num) => num.toString(),
    font: (num) => num.toString(), // This already returns the number, font style is applied via CSS
    emoji: (num) => ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'][num],
    moon: (num) => {
        const phases = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
        return phases[num % 8] || '🌑';
    }
};

const IconPackMaxNumbers = {
    default: 10,
    font: 10,
    emoji: 10,
    moon: 8
};
// Tutorial System
function startTutorial() {
    SoundEffects.playButton();
    const modal = document.getElementById('tutorialModal');
    const content = document.getElementById('tutorialContent');
    
    content.innerHTML = `
        <div class="tutorial-instruction">
            Welcome to Number Battle! Let's learn the basics with a 3x3 demo game.
        </div>
        
        <h3>📖 Scoring Rules:</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>Same Number Match:</strong> Connect to the same number = 1 point (e.g., 8-8)</li>
            <li><strong>Add to Ten:</strong> Connect numbers that add to 10 = 2 points (e.g., 3-7, 4-6)</li>
            <li><strong>Sequences:</strong> Connect 3+ consecutive numbers = points (e.g., 2-3-4 = 3 points)</li>
            <li><strong>Sequences Loop:</strong> 9-0-1 counts as a sequence!</li>
            <li><strong>Paths Matter:</strong> Cells must be connected by the gray lines to score!</li>
            <li><strong>Claim Cells:</strong> When you score, you claim those cells (green for you, red for AI)</li>
            <li><strong>End Bonus:</strong> Get +1 point for each cell you own when the game ends</li>
        </ul>
        
        <h3>🎮 Interactive Demo:</h3>
        <p style="margin-bottom: 15px;">Click the button below to start an interactive demonstration!</p>
        
        <div style="text-align: center;">
            <button onclick="startInteractiveTutorial()" class="secondary" style="font-size: 1.2em; padding: 15px 30px;">
                ▶️ Start Interactive Demo
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeTutorial() {
    SoundEffects.playButton();
    document.getElementById('tutorialModal').classList.remove('show');
}

let tutorialGame = null;

function startInteractiveTutorial() {
    SoundEffects.playButton();
    closeTutorial();
    
    tutorialGame = new TutorialGame();
    tutorialGame.start();
}

// Tutorial Game Class (keeping original - not modified)
class TutorialGame {
    constructor() {
        this.step = 0;
        this.originalGame = game;
        this.awaitingPlayerAction = false;
        this.expectedCell = null;
        this.nextButton = null;
    }

    start() {
        this.originalGame.gameEnded = true;
        this.setupTutorialBoard();
        this.showStep(0);
    }

    setupTutorialBoard() {
        const mapGrid = document.getElementById('mapGrid');
        mapGrid.className = 'map-grid size-3';
        mapGrid.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'map-cell empty';
            cell.dataset.index = i;
            cell.textContent = '○';
            mapGrid.appendChild(cell);
        }
        
        this.connections = [
            { from: 0, to: 1 }, { from: 1, to: 2 },
            { from: 3, to: 4 }, { from: 4, to: 5 },
            { from: 6, to: 7 }, { from: 7, to: 8 },
            { from: 0, to: 3 }, { from: 3, to: 6 },
            { from: 1, to: 4 }, { from: 4, to: 7 },
            { from: 2, to: 5 }, { from: 5, to: 8 }
        ];
        
        this.drawTutorialConnections();
        
        document.getElementById('playerScore').textContent = '0';
        document.getElementById('aiScore').textContent = '0';
        document.getElementById('currentCard').textContent = '8';
        this.enableTutorialDragAndDrop();
    }

    enableTutorialDragAndDrop() {
        const currentCard = document.getElementById('currentCard');
        const mapGrid = document.getElementById('mapGrid');
        
        currentCard.draggable = true;
        currentCard.style.cursor = 'grab';
        
        currentCard.ondragstart = (e) => {
            if (!this.awaitingPlayerAction) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', 'card');
            currentCard.classList.add('dragging');
        };
        
        currentCard.ondragend = (e) => {
            currentCard.classList.remove('dragging');
        };
        
        mapGrid.ondragover = (e) => {
            if (!this.awaitingPlayerAction) return;
            e.preventDefault();
            const cell = e.target.closest('.map-cell');
            if (cell && cell.classList.contains('empty') && parseInt(cell.dataset.index) === this.expectedCell) {
                cell.classList.add('drag-over');
            }
        };
        
        mapGrid.ondragleave = (e) => {
            const cell = e.target.closest('.map-cell');
            if (cell) {
                cell.classList.remove('drag-over');
            }
        };
        
        mapGrid.ondrop = (e) => {
            if (!this.awaitingPlayerAction) return;
            e.preventDefault();
            const cell = e.target.closest('.map-cell');
            
            if (cell && cell.classList.contains('empty')) {
                cell.classList.remove('drag-over');
                const cellIndex = parseInt(cell.dataset.index);
                if (cellIndex === this.expectedCell) {
                    this.handleCellClick(cellIndex);
                }
            }
        };
    }

    drawTutorialConnections() {
        const svg = document.getElementById('connectionsSvg');
        const mapGrid = document.getElementById('mapGrid');
        const cells = mapGrid.querySelectorAll('.map-cell');
        
        const gridRect = mapGrid.getBoundingClientRect();
        svg.setAttribute('width', gridRect.width);
        svg.setAttribute('height', gridRect.height);
        svg.innerHTML = '';

        this.connections.forEach(({ from, to }) => {
            const fromCell = cells[from];
            const toCell = cells[to];
            
            const fromRect = fromCell.getBoundingClientRect();
            const toRect = toCell.getBoundingClientRect();

            const fromX = fromRect.left + fromRect.width / 2 - gridRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - gridRect.top;
            const toX = toRect.left + toRect.width / 2 - gridRect.left;
            const toY = toRect.top + toRect.height / 2 - gridRect.top;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromX);
            line.setAttribute('y1', fromY);
            line.setAttribute('x2', toX);
            line.setAttribute('y2', toY);
            
            svg.appendChild(line);
        });
    }

    createNextButton() {
        if (this.nextButton) {
            this.nextButton.style.display = 'inline-block';
            return this.nextButton;
        }
        
        const btn = document.createElement('button');
        btn.className = 'tutorial-next-btn';
        btn.textContent = 'Continue →';
        btn.style.display = 'inline-block';
        let isProcessing = false;
        btn.onclick = () => {
            if (isProcessing || btn.disabled) return;
            isProcessing = true;
            this.nextStep();
            setTimeout(() => isProcessing = false, 300);
        };
        btn.disabled = true;
        
        this.nextButton = btn;
        return btn;
    }

    showStep(step) {
        const message = document.getElementById('message');
        const cells = document.querySelectorAll('.map-cell');
        
        cells.forEach(cell => {
            cell.classList.remove('tutorial-highlight');
            cell.style.pointerEvents = 'none';
            cell.onclick = null;
        });
        
        const svg = document.getElementById('connectionsSvg');
        const lines = svg.querySelectorAll('line');
        lines.forEach(line => line.classList.remove('highlighted'));
        
        this.awaitingPlayerAction = false;
        const nextBtn = this.createNextButton();
        
        switch(step) {
            case 0:
                message.innerHTML = '📖 <strong>Step 1: Paths are Important!</strong> - Notice the gray lines connecting cells. You can ONLY score points through these connections!';
                message.appendChild(nextBtn);
                
                const pathsToHighlight = [
                    {from: 1, to: 4},
                    {from: 4, to: 7}
                ];
                
                pathsToHighlight.forEach(({from, to}) => {
                    const connIdx = this.connections.findIndex(c => 
                        (c.from === from && c.to === to) || (c.from === to && c.to === from)
                    );
                    if (connIdx !== -1 && lines[connIdx]) {
                        lines[connIdx].classList.add('highlighted');
                    }
                });
                
                setTimeout(() => { nextBtn.disabled = false; }, 500);
                break;
                
            case 1:
                nextBtn.disabled = true;
                lines.forEach(line => line.classList.remove('highlighted'));
                
                message.innerHTML = '📖 <strong>Step 2: Same Number Match</strong> - Click the highlighted center cell to place your "8".';
                document.getElementById('currentCard').textContent = '8';
                document.getElementById('playerHandArea').classList.remove('disabled');
                cells[4].classList.add('tutorial-highlight');
                this.awaitingPlayerAction = true;
                this.expectedCell = 4;
                cells[4].style.pointerEvents = 'auto';
                cells[4].onclick = () => this.handleCellClick(4);
                break;
                
            case 2:
                nextBtn.disabled = true;
                document.getElementById('playerHandArea').classList.add('disabled');
                cells[4].textContent = '8';
                cells[4].classList.remove('empty', 'tutorial-highlight');
                cells[4].classList.add('neutral');
                SoundEffects.playCardPlace();
                message.innerHTML = '✅ You placed an 8! Since there are no adjacent cards yet, you scored 0 points.';
                message.appendChild(nextBtn);
                setTimeout(() => { nextBtn.disabled = false; }, 500);
                break;
                
            case 3:
                nextBtn.disabled = true;
                message.innerHTML = '🤖 <strong>AI\'s turn:</strong> AI places an "8" next to yours...';
                message.appendChild(nextBtn);
                cells[1].classList.add('tutorial-highlight');
                setTimeout(() => { nextBtn.disabled = false; }, 1000);
                break;
                
            case 4:
                nextBtn.disabled = true;
                cells[1].textContent = '8';
                cells[1].classList.remove('empty', 'tutorial-highlight');
                cells[1].classList.add('neutral');
                SoundEffects.playCardPlace();
                
                setTimeout(() => {
                    cells[1].classList.add('ai-owned');
                    cells[4].classList.remove('neutral');
                    cells[4].classList.add('ai-owned');
                    document.getElementById('aiScore').textContent = '1';
                    SoundEffects.playScore();
                    message.innerHTML = '🎯 <strong>Same Number Match!</strong> The AI\'s "8" connects to your "8" through the path = 1 point. Both cells turn red (AI owns them).';
                    message.appendChild(nextBtn);
                    setTimeout(() => { nextBtn.disabled = false; }, 1500);
                }, 500);
                break;
                
            case 5:
                nextBtn.disabled = true;
                message.innerHTML = '📖 <strong>Step 3: Your Turn Again</strong> - Click the highlighted cell to place your "8" and score!';
                document.getElementById('currentCard').textContent = '8';
                document.getElementById('playerHandArea').classList.remove('disabled');
                cells[7].classList.add('tutorial-highlight');
                this.awaitingPlayerAction = true;
                this.expectedCell = 7;
                cells[7].style.pointerEvents = 'auto';
                cells[7].onclick = () => this.handleCellClick(7);
                break;
                
            case 6:
                nextBtn.disabled = true;
                document.getElementById('playerHandArea').classList.add('disabled');
                cells[7].textContent = '8';
                cells[7].classList.remove('empty', 'tutorial-highlight');
                cells[7].classList.add('neutral');
                SoundEffects.playCardPlace();
                
                setTimeout(() => {
                    cells[7].classList.remove('neutral');
                    cells[7].classList.add('player-owned');
                    cells[4].classList.remove('ai-owned');
                    cells[4].classList.add('player-owned');
                    document.getElementById('playerScore').textContent = '1';
                    SoundEffects.playScore();
                    message.innerHTML = '🎉 <strong>You scored 1 point!</strong> Your "8" connected to another "8" through the path. You claimed those cells (green).';
                    message.appendChild(nextBtn);
                    setTimeout(() => { nextBtn.disabled = false; }, 1500);
                }, 500);
                break;
                
            case 7:
                nextBtn.disabled = true;
                message.innerHTML = '📖 <strong>Step 4: Add to Ten</strong> - Click the top-left cell to place your "3".';
                document.getElementById('currentCard').textContent = '3';
                document.getElementById('playerHandArea').classList.remove('disabled');
                cells[0].classList.add('tutorial-highlight');
                this.awaitingPlayerAction = true;
                this.expectedCell = 0;
                cells[0].style.pointerEvents = 'auto';
                cells[0].onclick = () => this.handleCellClick(0);
                break;
                
            case 8:
                nextBtn.disabled = true;
                document.getElementById('playerHandArea').classList.add('disabled');
                cells[0].textContent = '3';
                cells[0].classList.remove('empty', 'tutorial-highlight');
                cells[0].classList.add('neutral');
                SoundEffects.playCardPlace();
                message.innerHTML = '✅ You placed a 3. No scoring yet.';
                message.appendChild(nextBtn);
                setTimeout(() => { nextBtn.disabled = false; }, 500);
                break;
                
            case 9:
                nextBtn.disabled = true;
                message.innerHTML = '🤖 AI places a "7" next to your "3"...';
                message.appendChild(nextBtn);
                cells[3].classList.add('tutorial-highlight');
                setTimeout(() => { nextBtn.disabled = false; }, 1000);
                break;
                
            case 10:
                nextBtn.disabled = true;
                cells[3].textContent = '7';
                cells[3].classList.remove('empty', 'tutorial-highlight');
                cells[3].classList.add('neutral');
                SoundEffects.playCardPlace();
                
                setTimeout(() => {
                    cells[0].classList.remove('neutral');
                    cells[0].classList.add('ai-owned');
                    cells[3].classList.remove('neutral');
                    cells[3].classList.add('ai-owned');
                    document.getElementById('aiScore').textContent = '3';
                    SoundEffects.playScore();
                    message.innerHTML = '💯 <strong>Add to Ten!</strong> 3 + 7 = 10 (connected by path). This scores 2 points! AI now has 3 points total.';
                    message.appendChild(nextBtn);
                    setTimeout(() => { nextBtn.disabled = false; }, 1500);
                }, 500);
                break;
                
            case 11:
                nextBtn.disabled = true;
                message.innerHTML = '📖 <strong>Step 5: Sequences</strong> - Click the top-right cell to place your "2".';
                document.getElementById('currentCard').textContent = '2';
                document.getElementById('playerHandArea').classList.remove('disabled');
                cells[2].classList.add('tutorial-highlight');
                this.awaitingPlayerAction = true;
                this.expectedCell = 2;
                cells[2].style.pointerEvents = 'auto';
                cells[2].onclick = () => this.handleCellClick(2);
                break;
                
            case 12:
                nextBtn.disabled = true;
                document.getElementById('playerHandArea').classList.add('disabled');
                cells[2].textContent = '2';
                cells[2].classList.remove('empty', 'tutorial-highlight');
                cells[2].classList.add('neutral');
                SoundEffects.playCardPlace();
                message.innerHTML = '✅ You placed a 2.';
                message.appendChild(nextBtn);
                setTimeout(() => { nextBtn.disabled = false; }, 500);
                break;
                
            case 13:
                nextBtn.disabled = true;
                message.innerHTML = '🤖 AI places a "3" on the right side...';
                message.appendChild(nextBtn);
                cells[5].classList.add('tutorial-highlight');
                setTimeout(() => { nextBtn.disabled = false; }, 1000);
                break;
                
            case 14:
                nextBtn.disabled = true;
                cells[5].textContent = '3';
                cells[5].classList.remove('empty', 'tutorial-highlight');
                cells[5].classList.add('neutral');
                SoundEffects.playCardPlace();
                message.innerHTML = '✅ AI placed a 3.';
                message.appendChild(nextBtn);
                setTimeout(() => { nextBtn.disabled = false; }, 500);
                break;
                
            case 15:
                nextBtn.disabled = true;
                message.innerHTML = '📖 <strong>Complete the Sequence!</strong> - Click the bottom-right cell to place your "4" and make a 2→3→4 sequence!';
                document.getElementById('currentCard').textContent = '4';
                document.getElementById('playerHandArea').classList.remove('disabled');
                cells[8].classList.add('tutorial-highlight');
                this.awaitingPlayerAction = true;
                this.expectedCell = 8;
                cells[8].style.pointerEvents = 'auto';
                cells[8].onclick = () => this.handleCellClick(8);
                break;
                
            case 16:
                nextBtn.disabled = true;
                document.getElementById('playerHandArea').classList.add('disabled');
                cells[8].textContent = '4';
                cells[8].classList.remove('empty', 'tutorial-highlight');
                cells[8].classList.add('neutral');
                SoundEffects.playCardPlace();
                
                setTimeout(() => {
                    cells[2].classList.add('connection-highlight');
                    cells[5].classList.add('connection-highlight');
                    cells[8].classList.add('connection-highlight');
                    
                    setTimeout(() => {
                        cells[2].classList.remove('neutral', 'connection-highlight');
                        cells[2].classList.add('player-owned');
                        cells[5].classList.remove('neutral', 'connection-highlight');
                        cells[5].classList.add('player-owned');
                        cells[8].classList.remove('neutral', 'connection-highlight');
                        cells[8].classList.add('player-owned');
                        document.getElementById('playerScore').textContent = '4';
                        SoundEffects.playScore();
                        message.innerHTML = '🎊 <strong>Sequence!</strong> 2→3→4 connected by paths = 3 points! Sequences must be 3+ numbers and score points equal to their length.';
                        message.appendChild(nextBtn);
                        setTimeout(() => { nextBtn.disabled = false; }, 1500);
                    }, 600);
                }, 500);
                break;
                
            case 17:
                message.innerHTML = '🎓 <strong>Tutorial Complete!</strong> Remember: Paths are essential! Cells must be connected by gray lines to score. Ready to play?';
                setTimeout(() => this.end(), 5000);
                break;
        }
    }

    handleCellClick(cellIndex) {
        if (this.awaitingPlayerAction && cellIndex === this.expectedCell) {
            this.nextStep();
        }
    }

    nextStep() {
        this.step++;
        this.showStep(this.step);
    }

    end() {
        SoundEffects.playButton();
        
        const currentCard = document.getElementById('currentCard');
        const mapGrid = document.getElementById('mapGrid');
        const cells = mapGrid.querySelectorAll('.map-cell');

        currentCard.ondragstart = null;
        currentCard.ondragend = null;
        mapGrid.ondragover = null;
        mapGrid.ondragleave = null;
        mapGrid.ondrop = null;
        cells.forEach(cell => { cell.onclick = null; });
        
        this.originalGame.gameEnded = false;
        this.originalGame.newGame();
    }
}

// MAIN GAME CLASS WITH ALL FIXES
class NumberConnectionGame {
    constructor() {
        const savedSize = localStorage.getItem('boardSize');
        this.gridSize = savedSize ? parseInt(savedSize) : 5;
        this.totalCells = this.gridSize * this.gridSize;
        this.deckSize = this.totalCells;
        this.playerScore = 0;
        this.aiScore = 0;
        this.playerDeck = [];
        this.aiDeck = [];
        this.currentPlayerCard = null;
        this.mapState = Array(this.totalCells).fill(null);
        this.connections = [];
        this.draggedElement = null;
        this.touchStartCell = null;
        this.isPlayerTurn = true;
        this.gameEnded = false;
        this.hoveredCellIndex = null;
        this.draggedOverCellIndex = null;

        this.lastAICard = null;
        this.lastAICellIndex = null;

        this.aiDifficulty = this.loadDifficulty();
        this.currentTheme = this.loadTheme();
        this.currentIconPack = this.loadIconPack();
        this.gameMode = this.loadGameMode();
        this.sfxEnabled = this.loadSFX();

        this.blitzInterval = null;
        this.blitzActive = false;

        // FIXED: Load stats and shop BEFORE initializing power-ups
        this.stats = this.loadStats();
        this.shop = this.loadShop();

        this.turnCount = 0;
        this.extraTurn = false;

        // FIXED: Now initialize power-ups AFTER shop is loaded
        // Power-ups: default amounts + permanent bonuses
        this.skipAIAvailable = 1 + (this.shop.owned.permanentPowerups?.skipAI || 0);
        this.skipAIUsed = false;
        this.replaceCardAvailable = 3 + (this.shop.owned.permanentPowerups?.replace || 0);
        this.viewNextAvailable = 1 + (this.shop.owned.permanentPowerups?.viewNext || 0);
        this.viewNextActive = false;
        this.viewNextUsedOnTurn = null;
        this.undoAvailable = 1 + (this.shop.owned.permanentPowerups?.undo || 0);
        this.undoState = null;
        this.pickCardAvailable = 0 + (this.shop.owned.permanentPowerups?.pickCard || 0);

        this.applyTheme(this.currentTheme);
        this.applyIconPack(this.currentIconPack);
        this.updateDifficultyDropdown();
        this.updateBoardSizeDropdown();
        this.updateGameModeDropdown();
        this.updateSFXToggle();
        this.updateStatsDisplay();
        this.updateSettingsUI();

        this.init();
        }

    loadDifficulty() {
        const saved = localStorage.getItem('aiDifficulty');
        return saved ? parseFloat(saved) : 0.4;
    }

    saveDifficulty() {
        localStorage.setItem('aiDifficulty', this.aiDifficulty.toString());
    }

    loadTheme() {
        return localStorage.getItem('theme') || 'default';
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    loadIconPack() {
        return localStorage.getItem('iconPack') || 'default';
    }

    saveIconPack(pack) {
        localStorage.setItem('iconPack', pack);
    }

    loadGameMode() {
        return localStorage.getItem('gameMode') || 'classic';
    }

    saveGameMode(mode) {
        localStorage.setItem('gameMode', mode);
    }

    saveBoardSize() {
        localStorage.setItem('boardSize', this.gridSize.toString());
    }

    loadSFX() {
        const saved = localStorage.getItem('sfxEnabled');
        return saved === null ? true : saved === 'true';
    }

    saveSFX() {
        localStorage.setItem('sfxEnabled', SoundEffects.enabled.toString());
    }

    loadStats() {
        const saved = localStorage.getItem('gameStats');
        if (saved) {
            try {
                const stats = JSON.parse(saved);
                // Ensure shopPoints exists, default to 0 if missing
                if (typeof stats.shopPoints !== 'number') {
                    stats.shopPoints = 0;
                }
                return stats;
            } catch (e) {
                console.warn('Corrupted stats found, resetting...');
                localStorage.removeItem('gameStats');
            }
        }
        return {
            wins: 0,
            losses: 0,
            ties: 0,
            highScore: 0,
            gamesPlayed: 0,
            shopPoints: 0
        };
    }

    saveStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
        this.updateStatsDisplay();
    }

    loadShop() {
        let saved = localStorage.getItem('shopData');
        if (saved) {
            try {
                const shopData = JSON.parse(saved);
                // Ensure points exists, default to 0 if missing
                if (typeof shopData.points !== 'number') {
                    shopData.points = 0;
                }
                // Ensure owned object exists with all categories
                if (!shopData.owned) {
                    shopData.owned = {
                        boards: ['4', '5', '6'],
                        modes: ['classic', 'nobonus', 'survival'],
                        themes: ['default', 'dark', 'nature', 'sunset', 'ocean'],
                        icons: ['default'],
                        aiLevels: ['0.4', '0.5', '0.6']
                    };
                }
                // Ensure aiLevels exists
                if (!shopData.owned.aiLevels) {
                    shopData.owned.aiLevels = ['0.4', '0.5', '0.6'];
                }
                // FIXED: Ensure permanentPowerups exists
                if (!shopData.owned.permanentPowerups) {
                    shopData.owned.permanentPowerups = {
                        skipAI: 0,
                        replace: 0,
                        viewNext: 0,
                        undo: 0,
                        pickCard: 0
                    };
                }
                return shopData;
            } catch (e) {
                console.warn('Corrupted shop data found, resetting...');
                localStorage.removeItem('shopData');
            }
        }
        
        const shopData = {
            points: 0,
            owned: {
                boards: ['4', '5', '6'],
                modes: ['classic', 'nobonus', 'survival'],
                themes: ['default', 'dark', 'nature', 'sunset', 'ocean'],
                icons: ['default'],
                aiLevels: ['0.4', '0.5', '0.6'],
                permanentPowerups: { // FIXED: Added to default data
                    skipAI: 0,
                    replace: 0,
                    viewNext: 0,
                    undo: 0,
                    pickCard: 0
                }
            }
        };
        
        this.saveShop(shopData);
        
        return shopData;
    }

    saveShop(shopData = null) {
        if (shopData) {
            localStorage.setItem('shopData', JSON.stringify(shopData));
        } else {
            localStorage.setItem('shopData', JSON.stringify(this.shop));
        }
    }

    updateStatsDisplay() {
        document.getElementById('winsCount').textContent = this.stats.wins;
        document.getElementById('lossesCount').textContent = this.stats.losses;
        document.getElementById('tiesCount').textContent = this.stats.ties;
        document.getElementById('highScore').textContent = this.stats.highScore;
        document.getElementById('shopPointsStat').textContent = this.shop.points.toFixed(1);
        
        const totalGames = this.stats.wins + this.stats.losses + this.stats.ties;
        const winRate = totalGames > 0 ? Math.round((this.stats.wins / totalGames) * 100) : 0;
        document.getElementById('winRate').textContent = winRate + '%';
    }

    updateSettingsUI() {
        // Ensure shop data exists before accessing
        if (!this.shop || !this.shop.owned) {
            return;
        }
        
        // Update board size dropdown
        const boardSelect = document.getElementById('boardSizeSelect');
        if (boardSelect) {
            boardSelect.innerHTML = '';
            const boardSizes = [
                { value: '3', label: '3x3 (Quick)' },
                { value: '4', label: '4x4 (Fast)' },
                { value: '5', label: '5x5 (Classic)' },
                { value: '6', label: '6x6 (Extended)' },
                { value: '7', label: '7x7 (Epic)' },
                { value: '8', label: '8x8 (Massive)' }
            ];
            
            boardSizes.forEach(size => {
                if (this.shop.owned.boards && this.shop.owned.boards.includes(size.value)) {
                    const option = document.createElement('option');
                    option.value = size.value;
                    option.textContent = size.label;
                    if (size.value === this.gridSize.toString()) {
                        option.selected = true;
                    }
                    boardSelect.appendChild(option);
                }
            });
        }
        
        // Update game mode dropdown
        const modeSelect = document.getElementById('gamemodeSelect');
        if (modeSelect) {
            modeSelect.innerHTML = '';
            const modes = [
                { value: 'classic', label: 'Classic (Take turns)' },
                { value: 'nobonus', label: 'No Bonus (No end bonus points)' },
                { value: 'survival', label: 'Survival (No powerups)' },
                { value: 'blitz', label: 'Blitz (Race mode!)' },
                { value: 'suddendeath', label: 'Sudden Death' },
                { value: 'chainreaction', label: 'Chain Reaction' },
                { value: 'reverserules', label: 'Reverse Rules' },
                { value: 'mirrormatch', label: 'Mirror Match' }
            ];
            
            modes.forEach(mode => {
                if (this.shop.owned.modes && this.shop.owned.modes.includes(mode.value)) {
                    const option = document.createElement('option');
                    option.value = mode.value;
                    option.textContent = mode.label;
                    if (mode.value === this.gameMode) {
                        option.selected = true;
                    }
                    modeSelect.appendChild(option);
                }
            });
        }
        
        // Update AI difficulty dropdown
        const difficultySelect = document.getElementById('difficultySelect');
        if (difficultySelect) {
            difficultySelect.innerHTML = '';
            const difficulties = [
                { value: '0.2', label: 'Novice' },
                { value: '0.3', label: 'Beginner' },
                { value: '0.4', label: 'Intermediate' },
                { value: '0.5', label: 'Skilled' },
                { value: '0.6', label: 'Advanced' },
                { value: '0.7', label: 'Expert' },
                { value: '0.8', label: 'Pro' },
                { value: '0.9', label: 'Master' }
            ];
            
            difficulties.forEach(diff => {
                if (this.shop.owned.aiLevels && this.shop.owned.aiLevels.includes(diff.value)) {
                    const option = document.createElement('option');
                    option.value = diff.value;
                    option.textContent = diff.label;
                    if (parseFloat(diff.value) === this.aiDifficulty) {
                        option.selected = true;
                    }
                    difficultySelect.appendChild(option);
                }
            });
        }
        
        // Update themes
        const themeSelector = document.querySelector('.theme-selector');
        if (themeSelector) {
            themeSelector.innerHTML = '';
            const themes = [
                { name: 'default', label: 'Default', class: 'default' },
                { name: 'dark', label: 'Dark', class: 'dark' },
                { name: 'nature', label: 'Nature', class: 'nature' },
                { name: 'sunset', label: 'Sunset', class: 'sunset' },
                { name: 'ocean', label: 'Ocean', class: 'ocean' },
                { name: 'fire', label: 'Fire', class: 'fire' },
                { name: 'midnight', label: 'Midnight', class: 'midnight' },
                { name: 'royal', label: 'Royal', class: 'royal' },
                { name: 'cosmic', label: 'Cosmic', class: 'cosmic' },
                { name: 'lava', label: 'Lava', class: 'lava' },
                { name: 'emerald', label: 'Emerald', class: 'emerald' }
            ];
            
            themes.forEach(theme => {
                if (this.shop.owned.themes && this.shop.owned.themes.includes(theme.name)) {
                    const div = document.createElement('div');
                    div.className = `theme-option ${theme.class}`;
                    if (theme.name === this.currentTheme) {
                        div.classList.add('active');
                    }
                    div.textContent = theme.label;
                    div.onclick = () => changeTheme(theme.name);
                    themeSelector.appendChild(div);
                }
            });
        }
        
        // Update icon packs
        const iconSelector = document.querySelector('.icon-selector');
        if (iconSelector) {
            iconSelector.innerHTML = '';
            const icons = [
                { name: 'default', label: 'Default', display: '0-9' },
                { name: 'emoji', label: 'Emoji', display: '1️⃣2️⃣3️⃣' },
                { name: 'font', label: 'Font', display: '0-9' },
                { name: 'moon', label: 'Moon', display: '🌑🌕🌘' }
            ];
            
            icons.forEach(icon => {
                if (this.shop.owned.icons && this.shop.owned.icons.includes(icon.name)) {
                    const div = document.createElement('div');
                    div.className = 'icon-option';
                    div.setAttribute('data-icon', icon.name);
                    if (icon.name === this.currentIconPack) {
                        div.classList.add('active');
                    }
                    div.innerHTML = `<div>${icon.display}</div><div class="icon-name">${icon.label}</div>`;
                    div.onclick = () => changeIconPack(icon.name);
                    iconSelector.appendChild(div);
                }
            });
        }
    }

    updateDifficultyDropdown() {
        const select = document.getElementById('difficultySelect');
        if (select && this.shop && this.shop.owned && this.shop.owned.aiLevels) {
            // Clear and rebuild
            select.innerHTML = '';
            
            const difficulties = [
                { value: '0.2', label: 'Novice' },
                { value: '0.3', label: 'Beginner' },
                { value: '0.4', label: 'Intermediate' },
                { value: '0.5', label: 'Skilled' },
                { value: '0.6', label: 'Advanced' },
                { value: '0.7', label: 'Expert' },
                { value: '0.8', label: 'Pro' },
                { value: '0.9', label: 'Master' }
            ];
            
            difficulties.forEach(diff => {
                if (this.shop.owned.aiLevels.includes(diff.value)) {
                    const option = document.createElement('option');
                    option.value = diff.value;
                    option.textContent = diff.label;
                    if (parseFloat(diff.value) === this.aiDifficulty) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                }
            });
            
            // If current difficulty is not in owned list, default to first available
            if (!this.shop.owned.aiLevels.includes(this.aiDifficulty.toString())) {
                if (this.shop.owned.aiLevels.length > 0) {
                    this.aiDifficulty = parseFloat(this.shop.owned.aiLevels[0]);
                    this.saveDifficulty();
                }
            }
        }
    }

    updateBoardSizeDropdown() {
        const select = document.getElementById('boardSizeSelect');
        if (select) {
            select.value = this.gridSize.toString();
        }
    }

    updateGameModeDropdown() {
        const select = document.getElementById('gamemodeSelect');
        if (select) {
            select.value = this.gameMode;
        }
    }

    updateSFXToggle() {
        const toggle = document.getElementById('sfxToggle');
        if (toggle) {
            toggle.checked = this.sfxEnabled;
        }
        SoundEffects.enabled = this.sfxEnabled;
    }

    changeDifficulty(value) {
        SoundEffects.playButton();
        
        // Check if this difficulty is owned
        if (!this.shop.owned.aiLevels || !this.shop.owned.aiLevels.includes(value)) {
            alert('🔒 This AI difficulty is locked! Purchase it in the shop first.');
            this.updateDifficultyDropdown();
            return;
        }
        
        this.aiDifficulty = parseFloat(value);
        this.saveDifficulty();
    }

    changeBoardSize(value) {
        SoundEffects.playButton();
        const newSize = parseInt(value);
        
        if (!this.shop.owned.boards.includes(value)) {
            alert('🔒 This board size is locked! Purchase it in the shop first.');
            this.updateBoardSizeDropdown();
            return;
        }
        
        if (newSize !== this.gridSize) {
            this.gridSize = newSize;
            this.totalCells = this.gridSize * this.gridSize;
            this.deckSize = this.totalCells;
            this.saveBoardSize();
            closeSettings();
            this.newGame();
        }
    }

    changeGameMode(value) {
        SoundEffects.playButton();
        
        if (!this.shop.owned.modes.includes(value)) {
            alert('🔒 This game mode is locked! Purchase it in the shop first.');
            this.updateGameModeDropdown();
            return;
        }
        
        this.gameMode = value;
        this.saveGameMode(value);
        closeSettings();
        this.showMessage(`Game mode changed to ${value}! Starting new game...`);
        setTimeout(() => {
            this.newGame();
        }, 1500);
    }

    toggleSFX(enabled) {
        this.sfxEnabled = enabled;
        SoundEffects.enabled = enabled;
        this.saveSFX();
        if (enabled) {
            SoundEffects.playButton();
        }
    }

    applyTheme(theme) {
        document.body.className = '';
        
        if (theme !== 'default') {
            document.body.classList.add(theme + '-theme');
        }
        
        if (this.currentIconPack && this.currentIconPack !== 'default') {
            document.body.classList.add('icon-' + this.currentIconPack);
        }
        
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        const activeTheme = document.querySelector(`.theme-option[onclick*="'${theme}'"]`);
        if (activeTheme) {
            activeTheme.classList.add('active');
        }
    }

    applyIconPack(pack) {
        if (!this.gameEnded && pack !== this.currentIconPack) {
            // Check if any cards on board are out of range for new pack
            const newMaxNum = IconPackMaxNumbers[pack] || 10;
            const hasInvalidCards = this.mapState.some(cell => 
                cell && cell.number >= newMaxNum
            );
            
            if (hasInvalidCards) {
                console.warn('Switching icon pack mid-game - some cards would be invalid. Resetting game.');
            }
            
            this.currentIconPack = pack;
            this.saveIconPack(pack);
            
            closeSettings();
            this.newGame(); 
            this.showMessage("Game reset due to icon pack change.");
            return;
        }
        
        this.currentIconPack = pack;
        this.saveIconPack(pack);

        // FIXED: Remove old icon classes and apply new one
        document.body.className = document.body.className.replace(/icon-\w+/g, '').trim();
        if (pack !== 'default') {
            document.body.classList.add('icon-' + pack);
        }
        
        // Reapply theme class if it was removed
        if (this.currentTheme && this.currentTheme !== 'default') {
            if (!document.body.classList.contains(this.currentTheme + '-theme')) {
                document.body.classList.add(this.currentTheme + '-theme');
            }
        }
        
        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => option.classList.remove('active'));
        const activeIcon = document.querySelector(`.icon-option[data-icon="${pack}"]`);
        if (activeIcon) {
            activeIcon.classList.add('active');
        }
        
        this.updateAllNumbers();
    }

    updateAllNumbers() {
        const cells = document.querySelectorAll('.map-cell');
        cells.forEach((cell, index) => {
            const cellData = this.mapState[index];
            if (cellData) {
                cell.textContent = IconPacks[this.currentIconPack](cellData.number);
            }
        });
        
        if (this.currentPlayerCard !== null) {
            document.getElementById('currentCard').textContent = IconPacks[this.currentIconPack](this.currentPlayerCard);
        }
        
        if (this.viewNextActive && this.playerDeck.length > 0) {
            const preview = document.getElementById('nextCardPreview');
            preview.textContent = `Next: ${IconPacks[this.currentIconPack](this.playerDeck[0])}`;
        }
    }

    saveUndoState() {
        if (!this.isPlayerTurn || this.currentPlayerCard === null) return;
        
        this.undoState = {
            mapState: this.mapState.map(cell => cell ? { number: cell.number, owner: cell.owner } : null),
            playerScore: this.playerScore,
            aiScore: this.aiScore,
            playerDeck: [...this.playerDeck],
            aiDeck: [...this.aiDeck],
            currentPlayerCard: this.currentPlayerCard
        };
    }

    useUndo() {
        if (!this.isPlayerTurn || this.undoAvailable === 0 || this.gameEnded || 
            this.gameMode === 'survival' || !this.undoState) {
            return;
        }
        
        this.undoAvailable--;
        
        if (this.gameMode === 'blitz') {
            this.stopBlitzMode();
        }
        
        this.mapState = this.undoState.mapState.map(cell => cell ? { number: cell.number, owner: cell.owner } : null);
        this.playerScore = this.undoState.playerScore;
        this.aiScore = this.undoState.aiScore;
        this.playerDeck = [...this.undoState.playerDeck];
        this.aiDeck = [...this.undoState.aiDeck];
        this.currentPlayerCard = this.undoState.currentPlayerCard;
        
        const preview = document.getElementById('nextCardPreview');
        preview.classList.remove('show');
        this.viewNextActive = false;
        
        const cardText = IconPacks[this.currentIconPack](this.currentPlayerCard);
        document.getElementById('currentCard').textContent = cardText;
        
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('aiScore').textContent = this.aiScore;
        
        this.updateMap();
        this.updatePowerupDisplay();
        
        this.isPlayerTurn = true;
        this.enablePlayerInput();
        
        this.showMessage("↩️ Undid the last turn! Cards removed from board.");
        SoundEffects.playPowerup();
        
        if (this.gameMode === 'blitz' && this.blitzActive) {
            this.startBlitzMode();
        }
    }

    usePickCard() {
        if (this.pickCardAvailable > 0 && this.isPlayerTurn && !this.gameEnded && this.gameMode !== 'survival') {
            this.pickCardAvailable--;
            
            const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
            
            // Show a simple prompt for card selection
            let selectedCard = null;
            let validInput = false;
            
            while (!validInput) {
                const input = prompt(`Pick any card (0-${maxNum - 1}):`);
                
                if (input === null) {
                    // User cancelled
                    this.pickCardAvailable++;
                    return;
                }
                
                const num = parseInt(input);
                if (!isNaN(num) && num >= 0 && num < maxNum) {
                    selectedCard = num;
                    validInput = true;
                } else {
                    alert(`Please enter a number between 0 and ${maxNum - 1}`);
                }
            }
            
            // Replace current card with selected card
            if (this.currentPlayerCard !== null) {
                this.playerDeck.push(this.currentPlayerCard);
            }
            
            this.currentPlayerCard = selectedCard;
            document.getElementById('currentCard').textContent = IconPacks[this.currentIconPack](this.currentPlayerCard);
            
            if (this.viewNextActive && this.playerDeck.length > 0) {
                const preview = document.getElementById('nextCardPreview');
                preview.textContent = `Next: ${IconPacks[this.currentIconPack](this.playerDeck[0])}`;
            }
            
            this.showMessage(`🎯 Picked card: ${IconPacks[this.currentIconPack](selectedCard)}!`);
            SoundEffects.playPowerup();
            this.updatePowerupDisplay();
        }
    }

    useViewNext() {
        if (this.viewNextAvailable > 0 && !this.gameEnded && this.gameMode !== 'survival' && this.playerDeck.length > 0 && this.isPlayerTurn) {
            this.viewNextAvailable--;
            this.viewNextActive = true;
            this.viewNextUsedOnTurn = this.turnCount;
            
            const nextCard = this.playerDeck[0];
            const preview = document.getElementById('nextCardPreview');
            preview.textContent = `Next: ${IconPacks[this.currentIconPack](nextCard)}`;
            preview.classList.add('show');
            
            this.updatePowerupDisplay();
            this.showMessage(`👁️ Next card revealed: ${IconPacks[this.currentIconPack](nextCard)}`);
            SoundEffects.playPowerup();
        }
    }

    useSkipAI() {
        if (this.skipAIAvailable > 0 && this.isPlayerTurn && !this.gameEnded && this.gameMode !== 'survival' && this.gameMode !== 'blitz') {
            this.skipAIAvailable--;
            this.skipAIUsed = true;
            this.updatePowerupDisplay();
            this.showMessage("⏭️ AI's next turn will be skipped!");
            SoundEffects.playPowerup();
        }
    }

    useReplaceCard() {
        if (this.replaceCardAvailable > 0 && this.isPlayerTurn && !this.gameEnded && this.currentPlayerCard !== null && this.gameMode !== 'survival') {
            this.replaceCardAvailable--;
            
            const oldCard = this.currentPlayerCard;
            this.playerDeck.push(this.currentPlayerCard);
            
            if (this.playerDeck.length > 0) {
                let attempts = 0;
                do {
                    const randomIndex = Math.floor(Math.random() * this.playerDeck.length);
                    this.currentPlayerCard = this.playerDeck.splice(randomIndex, 1)[0];
                    attempts++;
                    
                    if (attempts > this.playerDeck.length + 1) {
                        break;
                    }
                } while (this.currentPlayerCard === oldCard && this.playerDeck.length > 0);
                
                document.getElementById('currentCard').textContent = IconPacks[this.currentIconPack](this.currentPlayerCard);
                
                if (this.viewNextActive && this.playerDeck.length > 0) {
                    const preview = document.getElementById('nextCardPreview');
                    preview.textContent = `Next: ${IconPacks[this.currentIconPack](this.playerDeck[0])}`;
                }
                
                this.showMessage("🔄 Card replaced!");
                SoundEffects.playPowerup();
            } else {
                this.currentPlayerCard = null;
                document.getElementById('currentCard').textContent = '—';
                document.getElementById('nextCardPreview').classList.remove('show');
                this.viewNextActive = false;
                this.showMessage("No cards left!");
                this.checkGameEnd();
            }
            
            this.updatePowerupDisplay();
        }
    }

    init() {
        this.createMap();
        this.generateConnections();
        this.createDecks();
        this.drawNextCard();
        this.setupDragAndDrop();
        this.setupTouch();
        this.setupHoverEffects();
        this.updatePowerupDisplay();
        
        let modeName = this.gameMode.charAt(0).toUpperCase() + this.gameMode.slice(1);
        if (this.gameMode === 'blitz') {
            this.showMessage('BLITZ MODE: Place your first card to start the race! 🏁');
        } else if (this.gameMode === 'nobonus') {
            this.showMessage('NO BONUS MODE: No bonus points at the end!');
        } else if (this.gameMode === 'suddendeath') {
            this.showMessage('SUDDEN DEATH: First to 10 points wins! ⚡');
        } else if (this.gameMode === 'chainreaction') {
            this.showMessage('CHAIN REACTION: Score to get extra turns! 🔗');
        } else if (this.gameMode === 'reverserules') {
            this.showMessage('REVERSE RULES: Lowest score wins! 🔄');
        } else if (this.gameMode === 'mirrormatch') {
            this.showMessage('MIRROR MATCH: You and AI have the same cards! 🪞');
        }
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.drawConnectionLines();
            });
        });
    }// Continuing from init()...

    startBlitzMode() {
        if (this.gameMode !== 'blitz' || this.blitzActive) return;
        
        this.blitzActive = true;
        this.showMessage('🏁 RACE STARTED! Keep up with the AI! 🏁');
        
        this.scheduleNextAIMove();
    }

    scheduleNextAIMove() {
        if (!this.blitzActive || this.gameEnded) {
            return;
        }
        
        if (this.aiDeck.length === 0) {
            this.checkGameEnd();
            return;
        }
        
        const hasEmptyCells = this.mapState.some(cell => cell === null);
        if (!hasEmptyCells) {
            this.checkGameEnd();
            return;
        }
        
        const delay = 900 + Math.random() * 300;
        
        this.blitzInterval = setTimeout(() => {
            this.aiTurnBlitz();
        }, delay);
    }

    aiTurnBlitz() {
        if (this.aiDeck.length === 0 || this.gameEnded) {
            this.checkGameEnd();
            return;
        }

        let aiCard = this.aiDeck.shift();

        // FIXED: Ensure AI card is within valid range for current icon pack
        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        if (aiCard >= maxNum) {
            console.warn(`AI card ${aiCard} out of range for ${this.currentIconPack}, regenerating...`);
            aiCard = Math.floor(Math.random() * maxNum);
        }

        const bestMove = this.findBestAIMove(aiCard);
        
        if (bestMove !== null) {
            this.lastAICard = aiCard;
            this.lastAICellIndex = bestMove;
            
            const aiScoreCard = document.querySelector('.score-card.ai');
            const cells = document.querySelectorAll('.map-cell');
            const targetCell = cells[bestMove];
            
            if (!targetCell) {
                this.checkGameEnd();
                return;
            }
            
            const aiRect = aiScoreCard.getBoundingClientRect();
            const cellRect = targetCell.getBoundingClientRect();
            
            this.createFloatingCard(
                aiCard,
                aiRect.left + aiRect.width / 2 - 30,
                aiRect.top + aiRect.height / 2 - 30,
                cellRect.left + cellRect.width / 2 - 30,
                cellRect.top + cellRect.height / 2 - 30,
                false
            );

            SoundEffects.playCardPlace();

            this.mapState[bestMove] = { number: aiCard, owner: 'neutral' };
            
            setTimeout(() => {
                targetCell.classList.add('just-placed');
                this.updateMap();
                setTimeout(() => targetCell.classList.remove('just-placed'), 400);
            }, 100);

            setTimeout(() => {
                const points = this.calculatePoints(bestMove, aiCard, 'ai');
                
                if (points > 0) {
                    this.aiScore += points;
                    this.updateScore('ai');
                    SoundEffects.playScore();
                }
                
                this.updateMap();
                
                this.checkGameEnd();
                
                if (!this.gameEnded) {
                    this.scheduleNextAIMove();
                }
            }, 200);
        } else {
            this.checkGameEnd();
        }
    }

    stopBlitzMode() {
        this.blitzActive = false;
        if (this.blitzInterval) {
            clearTimeout(this.blitzInterval);
            this.blitzInterval = null;
        }
    }

    setupHoverEffects() {
        const mapGrid = document.getElementById('mapGrid');
        
        mapGrid.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('.map-cell');
            
            if (cell && !this.gameEnded) {
                const cellIndex = parseInt(cell.dataset.index);
                
                if (this.draggedOverCellIndex !== cellIndex) {
                    this.highlightNearbyConnections(cellIndex);
                }
            }
        });

        mapGrid.addEventListener('mouseout', (e) => {
            const cell = e.target.closest('.map-cell');
            if (cell) {
                this.clearNearbyHighlights();
            }
        });
    }

    highlightNearbyConnections(cellIndex) {
        const connectedCells = this.getConnectedCells(cellIndex);
        
        const cells = document.querySelectorAll('.map-cell');
        connectedCells.forEach(index => {
            cells[index].classList.add('nearby-highlight');
        });

        const svg = document.getElementById('connectionsSvg');
        const lines = svg.querySelectorAll('line');
        
        this.connections.forEach((connection, idx) => {
            const { from, to } = connection;
            if ((from === cellIndex && connectedCells.includes(to)) ||
                (to === cellIndex && connectedCells.includes(from))) {
                if (lines[idx]) {
                    lines[idx].classList.add('highlighted');
                }
            }
        });
    }

    clearNearbyHighlights() {
        const cells = document.querySelectorAll('.map-cell');
        cells.forEach(cell => {
            cell.classList.remove('nearby-highlight');
        });

        const svg = document.getElementById('connectionsSvg');
        const lines = svg.querySelectorAll('line');
        lines.forEach(line => {
            line.classList.remove('highlighted');
        });
    }

    createMap() {
        const mapGrid = document.getElementById('mapGrid');
        mapGrid.innerHTML = '';
        mapGrid.className = `map-grid size-${this.gridSize}`;
        
        for (let i = 0; i < this.totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'map-cell empty';
            cell.dataset.index = i;
            cell.textContent = '○';
            mapGrid.appendChild(cell);
        }
    }

    generateConnections() {
        this.connections = [];
        const adjacencyList = new Map();

        for (let i = 0; i < this.totalCells; i++) {
            adjacencyList.set(i, []);
        }

        for (let i = 0; i < this.totalCells; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;

            if (col < this.gridSize - 1) {
                const right = i + 1;
                if (Math.random() > 0.2 || adjacencyList.get(i).length === 0) {
                    if (!adjacencyList.get(i).includes(right)) {
                        this.connections.push({ from: i, to: right });
                        adjacencyList.get(i).push(right);
                        adjacencyList.get(right).push(i);
                    }
                }
            }

            if (row < this.gridSize - 1) {
                const bottom = i + this.gridSize;
                if (Math.random() > 0.2 || adjacencyList.get(i).length === 0) {
                    if (!adjacencyList.get(i).includes(bottom)) {
                        this.connections.push({ from: i, to: bottom });
                        adjacencyList.get(i).push(bottom);
                        adjacencyList.get(bottom).push(i);
                    }
                }
            }
        }

        for (let i = 0; i < this.totalCells; i++) {
            if (adjacencyList.get(i).length === 0) {
                const neighbors = this.getPotentialNeighbors(i);
                if (neighbors.length > 0) {
                    const neighbor = neighbors[0];
                    this.connections.push({ from: i, to: neighbor });
                    adjacencyList.get(i).push(neighbor);
                    adjacencyList.get(neighbor).push(i);
                }
            }
        }
    }

    getPotentialNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / this.gridSize);
        const col = index % this.gridSize;

        if (col < this.gridSize - 1) neighbors.push(index + 1);
        if (row < this.gridSize - 1) neighbors.push(index + this.gridSize);
        if (col > 0) neighbors.push(index - 1);
        if (row > 0) neighbors.push(index - this.gridSize);

        return neighbors;
    }

    drawConnectionLines() {
        const svg = document.getElementById('connectionsSvg');
        const mapGrid = document.getElementById('mapGrid');
        const cells = mapGrid.querySelectorAll('.map-cell');
        
        if (cells.length === 0) {
            setTimeout(() => this.drawConnectionLines(), 100);
            return;
        }

        const firstCell = cells[0].getBoundingClientRect();
        if (firstCell.width === 0 || firstCell.height === 0) {
            setTimeout(() => this.drawConnectionLines(), 100);
            return;
        }

        const gridRect = mapGrid.getBoundingClientRect();
        svg.setAttribute('width', gridRect.width);
        svg.setAttribute('height', gridRect.height);
        svg.innerHTML = '';

        this.connections.forEach(({ from, to }) => {
            const fromCell = cells[from];
            const toCell = cells[to];
            
            if (!fromCell || !toCell) return;
            
            const fromRect = fromCell.getBoundingClientRect();
            const toRect = toCell.getBoundingClientRect();

            const fromX = fromRect.left + fromRect.width / 2 - gridRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - gridRect.top;
            const toX = toRect.left + toRect.width / 2 - gridRect.left;
            const toY = toRect.top + toRect.height / 2 - gridRect.top;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromX);
            line.setAttribute('y1', fromY);
            line.setAttribute('x2', toX);
            line.setAttribute('y2', toY);
            
            svg.appendChild(line);
        });
    }

    createDecks() {
        this.playerDeck = [];
        this.aiDeck = [];

        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        
        if (this.gameMode === 'mirrormatch') {
            const mirrorDeck = [];
            for (let i = 0; i < this.deckSize; i++) {
                mirrorDeck.push(Math.floor(Math.random() * maxNum));
            }
            this.playerDeck = [...mirrorDeck];
            this.aiDeck = [...mirrorDeck];
        } else {
            for (let i = 0; i < this.deckSize; i++) {
                this.playerDeck.push(Math.floor(Math.random() * maxNum));
                this.aiDeck.push(Math.floor(Math.random() * maxNum));
            }
        }
    }

    drawNextCard() {
        if (this.playerDeck.length > 0) {
            this.currentPlayerCard = this.playerDeck.shift();
            document.getElementById('currentCard').textContent = IconPacks[this.currentIconPack](this.currentPlayerCard);
            this.isPlayerTurn = true;
            this.enablePlayerInput();
            
            if (this.viewNextActive && this.viewNextUsedOnTurn !== null && this.turnCount > this.viewNextUsedOnTurn) {
                document.getElementById('nextCardPreview').classList.remove('show');
                this.viewNextActive = false;
            }
            
            if (this.viewNextActive && this.playerDeck.length > 0) {
                const preview = document.getElementById('nextCardPreview');
                preview.textContent = `Next: ${IconPacks[this.currentIconPack](this.playerDeck[0])}`;
                preview.classList.add('show');
            }
        } else {
            document.getElementById('currentCard').textContent = '—';
            this.currentPlayerCard = null;
            document.getElementById('nextCardPreview').classList.remove('show');
            this.viewNextActive = false;
            this.checkGameEnd();
        }
    }

    enablePlayerInput() {
        document.getElementById('playerHandArea').classList.remove('disabled');
        this.updatePowerupDisplay();
    }

    disablePlayerInput() {
        document.getElementById('playerHandArea').classList.add('disabled');
        this.updatePowerupDisplay();
    }

    updatePowerupDisplay() {
        const skipBtn = document.getElementById('skipAiBtn');
        const replaceBtn = document.getElementById('replaceCardBtn');
        const viewNextBtn = document.getElementById('viewNextBtn');
        const undoBtn = document.getElementById('undoBtn');
        const pickCardBtn = document.getElementById('pickCardBtn'); // NEW
        
        document.getElementById('skipAiCount').textContent = this.skipAIAvailable;
        document.getElementById('replaceCardCount').textContent = this.replaceCardAvailable;
        document.getElementById('viewNextCount').textContent = this.viewNextAvailable;
        document.getElementById('undoCount').textContent = this.undoAvailable;
        document.getElementById('pickCardCount').textContent = this.pickCardAvailable; // NEW
        
        const isSurvival = this.gameMode === 'survival';
        const isBlitz = this.gameMode === 'blitz';
        
        skipBtn.disabled = this.skipAIAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || isBlitz;
        replaceBtn.disabled = this.replaceCardAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival;
        viewNextBtn.disabled = this.viewNextAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || this.playerDeck.length === 0;
        undoBtn.disabled = this.undoAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || !this.undoState;
        pickCardBtn.disabled = this.pickCardAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival; // NEW
    }

    createFloatingCard(number, startX, startY, endX, endY, isPlayer) {
        const card = document.createElement('div');
        card.className = `floating-card ${isPlayer ? 'player' : 'ai'}`;
        card.textContent = IconPacks[this.currentIconPack](number);
        card.style.left = startX + 'px';
        card.style.top = startY + 'px';
        document.body.appendChild(card);

        setTimeout(() => {
            card.remove();
        }, 800);
    }

    createPointsPopup(points, x, y, isPlayer, isBonus = false) {
        const popup = document.createElement('div');
        popup.className = `points-popup ${isBonus ? 'bonus' : (isPlayer ? 'player' : 'ai')}`;
        popup.textContent = `+${points} ${isBonus ? '✨' : ''}`;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 1500);
    }

    createCellPoints(cellIndex, points) {
        const cells = document.querySelectorAll('.map-cell');
        const cell = cells[cellIndex];
        if (!cell) return;

        const pointIndicator = document.createElement('div');
        pointIndicator.className = 'cell-points';
        pointIndicator.textContent = `+${points}`;
        cell.appendChild(pointIndicator);

        setTimeout(() => {
            pointIndicator.remove();
        }, 600);
    }

    animateBonusCells() {
        const cells = document.querySelectorAll('.map-cell');
        
        const playerCells = [];
        const aiCells = [];
        
        this.mapState.forEach((cellData, index) => {
            if (cellData && cellData.owner === 'player') {
                playerCells.push(index);
            } else if (cellData && cellData.owner === 'ai') {
                aiCells.push(index);
            }
        });

        playerCells.forEach((index, i) => {
            setTimeout(() => {
                cells[index].classList.add('bonus-pulse-player');
                SoundEffects.playBonus();
                setTimeout(() => {
                    cells[index].classList.remove('bonus-pulse-player');
                }, 800);
            }, i * 50);
        });

        setTimeout(() => {
            aiCells.forEach((index, i) => {
                setTimeout(() => {
                    cells[index].classList.add('bonus-pulse-ai');
                    SoundEffects.playBonus();
                    setTimeout(() => {
                        cells[index].classList.remove('bonus-pulse-ai');
                    }, 800);
                }, i * 50);
            });
        }, playerCells.length * 50 + 200);
    }

    setupDragAndDrop() {
        const currentCard = document.getElementById('currentCard');
        const mapGrid = document.getElementById('mapGrid');

        currentCard.addEventListener('dragstart', (e) => {
            if (!this.isPlayerTurn || this.gameEnded) {
                e.preventDefault();
                return;
            }
            this.draggedElement = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        currentCard.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            this.draggedElement = null;
            
            if (this.draggedOverCellIndex !== null) {
                this.clearNearbyHighlights();
                this.draggedOverCellIndex = null;
            }
        });

        mapGrid.addEventListener('dragover', (e) => {
            if (!this.isPlayerTurn || this.gameEnded) return;
            e.preventDefault();
            const cell = e.target.closest('.map-cell');
            if (cell && cell.classList.contains('empty')) {
                cell.classList.add('drag-over');
                
                const cellIndex = parseInt(cell.dataset.index);
                if (this.draggedOverCellIndex !== cellIndex) {
                    this.clearNearbyHighlights();
                    this.draggedOverCellIndex = cellIndex;
                    this.highlightNearbyConnections(cellIndex);
                }
            }
        });

        mapGrid.addEventListener('dragleave', (e) => {
            const cell = e.target.closest('.map-cell');
            if (cell) {
                cell.classList.remove('drag-over');
            }
        });

        mapGrid.addEventListener('drop', (e) => {
            if (!this.isPlayerTurn || this.gameEnded) return;
            e.preventDefault();
            const cell = e.target.closest('.map-cell');
            
            if (cell && cell.classList.contains('empty')) {
                const cellIndex = parseInt(cell.dataset.index);
                this.playCard(cellIndex);
                cell.classList.remove('drag-over');
            }
            
            if (this.draggedOverCellIndex !== null) {
                this.clearNearbyHighlights();
                this.draggedOverCellIndex = null;
            }
        });
    }

    setupTouch() {
        const mapGrid = document.getElementById('mapGrid');

        mapGrid.addEventListener('touchstart', (e) => {
            if (!this.isPlayerTurn || this.gameEnded) return;
            const cell = e.target.closest('.map-cell');
            if (cell && cell.classList.contains('empty')) {
                this.touchStartCell = cell;
                cell.classList.add('drag-over');
            }
        }, { passive: true });

        mapGrid.addEventListener('touchend', (e) => {
            if (!this.isPlayerTurn || this.gameEnded) return;
            if (this.touchStartCell) {
                const cellIndex = parseInt(this.touchStartCell.dataset.index);
                this.playCard(cellIndex);
                this.touchStartCell.classList.remove('drag-over');
                this.touchStartCell = null;
            }
        });

        mapGrid.addEventListener('touchcancel', (e) => {
            if (this.touchStartCell) {
                this.touchStartCell.classList.remove('drag-over');
                this.touchStartCell = null;
            }
        });

        mapGrid.addEventListener('click', (e) => {
            if (!this.isPlayerTurn || this.gameEnded) return;
            const cell = e.target.closest('.map-cell');
            if (cell && cell.classList.contains('empty')) {
                const cellIndex = parseInt(cell.dataset.index);
                this.playCard(cellIndex);
            }
        });
    }

    playCard(cellIndex) {
        if (this.currentPlayerCard === null || !this.isPlayerTurn || this.gameEnded) return;

        this.saveUndoState();

        const playedCard = this.currentPlayerCard;
        this.currentPlayerCard = null;
        this.isPlayerTurn = false;
        this.turnCount++;

        this.clearNearbyHighlights();

        const cardElement = document.getElementById('currentCard');
        const cells = document.querySelectorAll('.map-cell');
        const targetCell = cells[cellIndex];
        
        const cardRect = cardElement.getBoundingClientRect();
        const cellRect = targetCell.getBoundingClientRect();
        
        this.createFloatingCard(
            playedCard,
            cardRect.left + cardRect.width / 2 - 30,
            cardRect.top + cardRect.height / 2 - 30,
            cellRect.left + cellRect.width / 2 - 30,
            cellRect.top + cellRect.height / 2 - 30,
            true
        );

        SoundEffects.playCardPlace();

        this.mapState[cellIndex] = { number: playedCard, owner: 'neutral' };
        
        setTimeout(() => {
            targetCell.classList.add('just-placed');
            this.updateMap();
            setTimeout(() => targetCell.classList.remove('just-placed'), 400);
        }, 400);

        if (this.playerDeck.length > 0) {
            this.currentPlayerCard = this.playerDeck.shift();
            document.getElementById('currentCard').textContent = IconPacks[this.currentIconPack](this.currentPlayerCard);
            
            if (this.viewNextActive && this.viewNextUsedOnTurn !== null && this.turnCount > this.viewNextUsedOnTurn) {
                document.getElementById('nextCardPreview').classList.remove('show');
                this.viewNextActive = false;
            } else if (this.viewNextActive && this.playerDeck.length > 0) {
                const preview = document.getElementById('nextCardPreview');
                preview.textContent = `Next: ${IconPacks[this.currentIconPack](this.playerDeck[0])}`;
                preview.classList.add('show');
            } else if (this.playerDeck.length === 0) {
                document.getElementById('nextCardPreview').classList.remove('show');
                this.viewNextActive = false;
            }
        } else {
            document.getElementById('currentCard').textContent = '—';
            document.getElementById('nextCardPreview').classList.remove('show');
            this.viewNextActive = false;
        }

        this.disablePlayerInput();

        setTimeout(() => {
            const points = this.calculatePoints(cellIndex, playedCard, 'player');
            
            if (points > 0) {
                this.playerScore += points;
                this.updateScore('player');
                
                const scoreCard = document.querySelector('.score-card.player');
                const rect = scoreCard.getBoundingClientRect();
                this.createPointsPopup(points, rect.left + rect.width / 2 - 50, rect.top - 50, true);
                
                this.showMessage(`🎉 You scored ${points} point${points !== 1 ? 's' : ''}!`);
                SoundEffects.playScore();
                
                // FIXED: Force map update before checking sudden death
                this.updateMap();
                
                if (this.gameMode === 'suddendeath' && this.playerScore >= 10) {
                    this.showMessage('⚡ SUDDEN DEATH! You reached 10 points first! ⚡');
                    // FIXED: Longer delay to let animations complete
                    setTimeout(() => this.endGame(), 2000);
                    return;
                }
                if (this.gameMode === 'chainreaction') {
                    this.extraTurn = true;
                    this.showMessage(`🔗 CHAIN! You scored, take another turn!`);
                }
            } else {
                this.showMessage(`No points this turn.`);
                this.extraTurn = false;
            }
            
            // FIXED: Force update map to apply owner colors
            this.updateMap();

            if (this.shouldGameEnd()) {
                this.endGame();
                return;
            }

            if (this.gameMode === 'blitz' && !this.blitzActive) {
                setTimeout(() => {
                    this.startBlitzMode();
                    this.isPlayerTurn = true;
                    this.enablePlayerInput();
                }, 1000);
            } else if (this.gameMode === 'blitz') {
                if (this.playerDeck.length > 0 || this.currentPlayerCard !== null) {
                    this.isPlayerTurn = true;
                    this.enablePlayerInput();
                } else {
                    this.checkGameEnd();
                }
            } else if (this.gameMode === 'chainreaction' && this.extraTurn) {
                setTimeout(() => {
                    this.isPlayerTurn = true;
                    this.enablePlayerInput();
                    this.extraTurn = false;
                }, 1000);
            } else {
                setTimeout(() => {
                    this.aiTurn();
                }, 800);
            }
        }, 800);
    }

    aiTurn() {
        if (this.aiDeck.length === 0 || this.gameEnded) {
            this.checkGameEnd();
            return;
        }

        if (this.skipAIUsed) {
            this.skipAIUsed = false;
            this.showMessage("AI turn skipped! ⏭️");
            
            setTimeout(() => {
                if (this.shouldGameEnd()) {
                    this.endGame();
                    return;
                }
                
                if (this.playerDeck.length > 0 || this.currentPlayerCard !== null) {
                    this.isPlayerTurn = true;
                    this.enablePlayerInput();
                } else {
                    this.checkGameEnd();
                }
            }, 500);
            return;
        }

        let aiCard = this.aiDeck.shift();

        // FIXED: Ensure AI card is within valid range for current icon pack
        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        if (aiCard >= maxNum) {
            console.warn(`AI card ${aiCard} out of range for ${this.currentIconPack}, regenerating...`);
            aiCard = Math.floor(Math.random() * maxNum);
        }

        const bestMove = this.findBestAIMove(aiCard);
        
        this.lastAICard = aiCard;
        this.lastAICellIndex = bestMove;
        
        const aiDelay = 600;
        
        if (bestMove !== null) {
            setTimeout(() => {
                const aiScoreCard = document.querySelector('.score-card.ai');
                const cells = document.querySelectorAll('.map-cell');
                const targetCell = cells[bestMove];
                
                if (!targetCell) {
                    this.checkGameEnd();
                    return;
                }
                
                const aiRect = aiScoreCard.getBoundingClientRect();
                const cellRect = targetCell.getBoundingClientRect();
                
                this.createFloatingCard(
                    aiCard,
                    aiRect.left + aiRect.width / 2 - 30,
                    aiRect.top + aiRect.height / 2 - 30,
                    cellRect.left + cellRect.width / 2 - 30,
                    cellRect.top + cellRect.height / 2 - 30,
                    false
                );

                SoundEffects.playCardPlace();

                this.mapState[bestMove] = { number: aiCard, owner: 'neutral' };
                
                setTimeout(() => {
                    targetCell.classList.add('just-placed');
                    this.updateMap();
                    setTimeout(() => targetCell.classList.remove('just-placed'), 400);
                }, 400);

                setTimeout(() => {
                    const points = this.calculatePoints(bestMove, aiCard, 'ai');
                    
                    if (points > 0) {
                        this.aiScore += points;
                        this.updateScore('ai');
                        
                        const scoreCard = document.querySelector('.score-card.ai');
                        const rect = scoreCard.getBoundingClientRect();
                        this.createPointsPopup(points, rect.left + rect.width / 2 - 50, rect.top - 50, false);
                        
                        this.showMessage(`🤖 AI scored ${points} point${points !== 1 ? 's' : ''}!`);
                        SoundEffects.playScore();
                        
                        // FIXED: Force map update before checking sudden death
                        this.updateMap();
                        
                        if (this.gameMode === 'suddendeath' && this.aiScore >= 10) {
                            this.showMessage('⚡ SUDDEN DEATH! AI reached 10 points first! ⚡');
                            // FIXED: Longer delay to let animations complete
                            setTimeout(() => this.endGame(), 2000);
                            return;
                        }
                        
                        if (this.gameMode === 'chainreaction') {
                            this.showMessage(`🔗 AI chains! Taking another turn!`);
                            setTimeout(() => {
                                if (!this.shouldGameEnd()) {
                                    this.aiTurn();
                                } else {
                                    this.endGame();
                                }
                            }, 1000);
                            return;
                        }
                    } else {
                        this.showMessage(`AI played but scored no points.`);
                    }
                    
                    // FIXED: Force update map to apply owner colors
                    this.updateMap();
                    
                    setTimeout(() => {
                        if (this.shouldGameEnd()) {
                            this.endGame();
                            return;
                        }
                        
                        if (this.playerDeck.length > 0 || this.currentPlayerCard !== null) {
                            this.isPlayerTurn = true;
                            this.enablePlayerInput();
                        } else {
                            this.checkGameEnd();
                        }
                    }, 500);
                }, 800);
            }, aiDelay);
        } else {
            this.checkGameEnd();
        }
    }

    findBestAIMove(aiCard) {
        const emptyCells = this.mapState
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);

        if (emptyCells.length === 0) return null;

        if (this.gameMode === 'reverserules') {
            if (Math.random() > this.aiDifficulty) {
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }

            let lowestScore = 1000;
            let bestCell = null;

            emptyCells.forEach(cellIndex => {
                const points = this.simulatePoints(cellIndex, aiCard, 'ai');
                if (points < lowestScore) {
                    lowestScore = points;
                    bestCell = cellIndex;
                }
            });

            if (bestCell === null) {
                bestCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }

            return bestCell;
        }

        if (Math.random() > this.aiDifficulty) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        let bestScore = -1;
        let bestCell = null;

        emptyCells.forEach(cellIndex => {
            const points = this.simulatePoints(cellIndex, aiCard, 'ai');
            if (points > bestScore) {
                bestScore = points;
                bestCell = cellIndex;
            }
        });

        if (bestCell === null) {
            bestCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        return bestCell;
    }

    simulatePoints(cellIndex, number, owner) {
        const tempState = this.mapState.map(cell => 
            cell ? { number: cell.number, owner: cell.owner } : null
        );
        tempState[cellIndex] = { number, owner: 'neutral' };
        return this.calculatePointsForState(cellIndex, number, owner, tempState, false);
    }

    calculatePoints(cellIndex, number, owner) {
        return this.calculatePointsForState(cellIndex, number, owner, this.mapState, true);
    }

    // FIXED: Scoring calculation with proper moon phase logic
    calculatePointsForState(cellIndex, number, owner, state, updateOwnership) {
        let totalPoints = 0;
        const highlightCells = new Set([cellIndex]);
        const cellsToOwn = new Set([cellIndex]);
        const cellPointsMap = new Map();

        const connectedCells = this.getConnectedCells(cellIndex);

        // FIXED: Moon icon pack special matching
        if (this.currentIconPack === 'moon') {
            connectedCells.forEach(connectedIndex => {
                const connectedCell = state[connectedIndex];
                if (connectedCell) {
                    let cellPoints = 0;
                    
                    // Same phase match = 1 point
                    if (connectedCell.number === number) {
                        totalPoints += 1;
                        cellPoints += 1;
                        highlightCells.add(connectedIndex);
                        cellsToOwn.add(connectedIndex);
                    }
                    
                    // FIXED: Moon phases only go 0-7, no "add to 10" rule
                    // Instead: Opposite phases = 2 points
                    // 🌑(0)+🌕(4), 🌒(1)+🌖(5), 🌓(2)+🌗(6), 🌔(3)+🌘(7)
                    const diff = Math.abs(connectedCell.number - number);
                    if (diff === 4) {
                        totalPoints += 2;
                        cellPoints += 2;
                        highlightCells.add(connectedIndex);
                        cellsToOwn.add(connectedIndex);
                    }

                    if (cellPoints > 0) {
                        cellPointsMap.set(connectedIndex, (cellPointsMap.get(connectedIndex) || 0) + cellPoints);
                    }
                }
            });
        } else {
            // Normal number matching rules
            connectedCells.forEach(connectedIndex => {
                const connectedCell = state[connectedIndex];
                if (connectedCell) {
                    let cellPoints = 0;
                    
                    if (connectedCell.number === number) {
                        totalPoints += 1;
                        cellPoints += 1;
                        highlightCells.add(connectedIndex);
                        cellsToOwn.add(connectedIndex);
                    }
                    
                    if (connectedCell.number + number === 10) {
                        totalPoints += 2;
                        cellPoints += 2;
                        highlightCells.add(connectedIndex);
                        cellsToOwn.add(connectedIndex);
                    }

                    if (cellPoints > 0) {
                        cellPointsMap.set(connectedIndex, (cellPointsMap.get(connectedIndex) || 0) + cellPoints);
                    }
                }
            });
        }

        // Rest of the function stays the same...
        const sequences = this.findAllSequences(cellIndex, number, state);
        sequences.forEach(sequence => {
            if (sequence.length >= 3) {
                totalPoints += sequence.length;
                sequence.forEach(idx => {
                    highlightCells.add(idx);
                    cellsToOwn.add(idx);
                    if (idx !== cellIndex) {
                        cellPointsMap.set(idx, (cellPointsMap.get(idx) || 0) + 1);
                    }
                });
            }
        });

        if (updateOwnership && totalPoints > 0) {
            cellsToOwn.forEach(index => {
                if (state[index]) {
                    state[index].owner = owner;
                }
            });

            setTimeout(() => {
                this.highlightCells(Array.from(highlightCells));
                
                cellPointsMap.forEach((points, index) => {
                    if (index !== cellIndex) {
                        setTimeout(() => this.createCellPoints(index, points), 100);
                    }
                });
            }, 100);
        }

        return totalPoints;
    }

    getConnectedCells(index) {
        const connected = [];
        this.connections.forEach(({ from, to }) => {
            if (from === index) connected.push(to);
            if (to === index) connected.push(from);
        });
        return connected;
    }

    getNextNumber(num) {
        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        return (num + 1) % maxNum;
    }

    getPrevNumber(num) {
        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        return (num - 1 + maxNum) % maxNum;
    }

    // FIXED: Improved sequence detection to catch all valid sequences
    findAllSequences(startIndex, startNumber, state) {
        const allSequences = [];
        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        
        // Build adjacency map for faster lookups
        const adjacencyMap = new Map();
        this.connections.forEach(({ from, to }) => {
            if (!adjacencyMap.has(from)) adjacencyMap.set(from, []);
            if (!adjacencyMap.has(to)) adjacencyMap.set(to, []);
            adjacencyMap.get(from).push(to);
            adjacencyMap.get(to).push(from);
        });
        
        // Try finding sequences in both directions
        const visitedGlobal = new Set();
        
        // Find sequence going "up" (incrementing numbers)
        const upSequence = this.exploreSequenceDirection(
            startIndex, 
            startNumber, 
            'up', 
            state, 
            new Set([startIndex]),
            adjacencyMap,
            maxNum
        );
        
        // Find sequence going "down" (decrementing numbers)
        const downSequence = this.exploreSequenceDirection(
            startIndex, 
            startNumber, 
            'down', 
            state, 
            new Set([startIndex]),
            adjacencyMap,
            maxNum
        );
        
        // Combine both directions
        if (upSequence.length > 1 || downSequence.length > 1) {
            // Remove duplicate start index
            const combined = [...downSequence.reverse().slice(0, -1), ...upSequence];
            if (combined.length >= 3) {
                allSequences.push(combined);
            }
        }
        
        return allSequences;
    }

    exploreSequenceDirection(startIndex, startNumber, direction, state, visited, adjacencyMap, maxNum) {
        const sequence = [startIndex];
        let currentIndex = startIndex;
        let currentNumber = startNumber;
        
        // Continue exploring in the given direction
        while (true) {
            const neighbors = adjacencyMap.get(currentIndex) || [];
            let foundNext = false;
            
            // Calculate expected next number
            let expectedNumber;
            if (direction === 'up') {
                expectedNumber = (currentNumber + 1) % maxNum;
            } else {
                expectedNumber = (currentNumber - 1 + maxNum) % maxNum;
            }
            
            // Look through all neighbors for the expected number
            for (const neighborIndex of neighbors) {
                // Skip if already visited
                if (visited.has(neighborIndex)) continue;
                
                const neighborCell = state[neighborIndex];
                
                // Check if this neighbor has the expected number
                if (neighborCell && neighborCell.number === expectedNumber) {
                    visited.add(neighborIndex);
                    sequence.push(neighborIndex);
                    currentIndex = neighborIndex;
                    currentNumber = neighborCell.number;
                    foundNext = true;
                    break;
                }
            }
            
            // If we didn't find the next number, stop
            if (!foundNext) break;
        }
        
        return sequence;
    }

    highlightCells(cellIndices) {
        const cells = document.querySelectorAll('.map-cell');
        cellIndices.forEach(index => {
            if (cells[index]) {
                cells[index].classList.add('connection-highlight', 'scoring');
                setTimeout(() => {
                    cells[index].classList.remove('connection-highlight', 'scoring');
                }, 600);
            }
        });
    }

    updateMap() {
        const cells = document.querySelectorAll('.map-cell');
        const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
        
        cells.forEach((cell, index) => {
            const cellData = this.mapState[index];
            
            // Remove ALL possible state classes first
            cell.classList.remove('empty', 'neutral', 'player-owned', 'ai-owned', 
                                'tutorial-highlight', 'drag-over', 'nearby-highlight');
            
            if (cellData) {
                // FIXED: Validate number is in range
                let displayNumber = cellData.number;
                if (displayNumber >= maxNum) {
                    console.warn(`Cell ${index} has invalid number ${displayNumber} for ${this.currentIconPack}`);
                    displayNumber = displayNumber % maxNum; // Wrap to valid range
                }
                
                cell.textContent = IconPacks[this.currentIconPack](displayNumber);
                
                // FIXED: Apply owner color classes immediately
                if (cellData.owner === 'player') {
                    cell.classList.add('player-owned');
                } else if (cellData.owner === 'ai') {
                    cell.classList.add('ai-owned');
                } else {
                    cell.classList.add('neutral');
                }
            } else {
                cell.textContent = '○';
                cell.classList.add('empty');
                cell.style.pointerEvents = '';
            }
        });
    }

    updateScore(player) {
        const scoreElement = document.getElementById(player === 'player' ? 'playerScore' : 'aiScore');
        const score = player === 'player' ? this.playerScore : this.aiScore;
        scoreElement.textContent = score;
        scoreElement.classList.add('score-animation');
        setTimeout(() => scoreElement.classList.remove('score-animation'), 500);
    }

    shouldGameEnd() {
        const hasEmptyCells = this.mapState.some(cell => cell === null);
        const bothDecksEmpty = this.playerDeck.length === 0 && this.aiDeck.length === 0 && this.currentPlayerCard === null;
        
        return !hasEmptyCells || bothDecksEmpty;
    }

    checkGameEnd() {
        if (this.shouldGameEnd()) {
            this.endGame();
        }
    }

    endGame() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.stopBlitzMode();

        const playerCells = this.mapState.filter(cell => cell && cell.owner === 'player').length;
        const aiCells = this.mapState.filter(cell => cell && cell.owner === 'ai').length;
        
        const isNoBonus = this.gameMode === 'nobonus' || this.gameMode === 'suddendeath';
        
        if (!isNoBonus) {
            this.animateBonusCells();

            setTimeout(() => {
                if (playerCells > 0) {
                    const playerCard = document.querySelector('.score-card.player');
                    const rect = playerCard.getBoundingClientRect();
                    this.createPointsPopup(playerCells, rect.left + rect.width / 2 - 50, rect.top - 50, true, true);
                }
            }, 200);
            
            setTimeout(() => {
                if (aiCells > 0) {
                    const aiCard = document.querySelector('.score-card.ai');
                    const rect = aiCard.getBoundingClientRect();
                    this.createPointsPopup(aiCells, rect.left + rect.width / 2 - 50, rect.top - 50, false, true);
                }
            }, playerCells * 50 + 400);
        }

        const bonusDelay = isNoBonus ? 0 : Math.max(playerCells, aiCells) * 50 + 1000;

        setTimeout(() => {
            if (!isNoBonus) {
                this.playerScore += playerCells;
                this.aiScore += aiCells;

                this.updateScore('player');
                this.updateScore('ai');

                this.showMessage(`Game Over! Bonus: You +${playerCells}, AI +${aiCells}`);
            } else {
                this.showMessage(`Game Over! No bonus points in this mode.`);
            }

            if (this.playerScore > this.stats.highScore) {
                this.stats.highScore = this.playerScore;
            }

            // Award shop points ONLY if player wins
            this.stats.gamesPlayed++;

            let playerWon = false;
            if (this.gameMode === 'reverserules') {
                playerWon = this.playerScore < this.aiScore;
            } else {
                playerWon = this.playerScore > this.aiScore;
            }

            let pointsEarned = 0;
            if (playerWon) {
                this.stats.wins++;
                // Only award points if player wins
                pointsEarned = Math.floor(this.playerScore * 0.1 * 10) / 10; // 0.1 points per score point
                this.shop.points += pointsEarned;
                this.saveShop();
            } else if (this.gameMode === 'reverserules' ? (this.aiScore < this.playerScore) : (this.aiScore > this.playerScore)) {
                this.stats.losses++;
            } else {
                this.stats.ties++;
            }
            
            this.saveStats();

            setTimeout(() => {
                const gameOver = document.getElementById('gameOver');
                const winnerText = document.getElementById('winnerText');
                const shopPointsEarned = document.getElementById('shopPointsEarned');
                
                if (playerWon) {
                    winnerText.textContent = '🎉 YOU WIN! 🎉';
                    winnerText.style.color = '#4CAF50';
                    SoundEffects.playWin();
                    shopPointsEarned.textContent = `💰 Earned ${pointsEarned} shop points!`;
                } else if (this.gameMode === 'reverserules' ? (this.aiScore < this.playerScore) : (this.aiScore > this.playerScore)) {
                    winnerText.textContent = '🤖 AI WINS! 🤖';
                    winnerText.style.color = '#f44336';
                    shopPointsEarned.textContent = `No points earned - you lost!`;
                    SoundEffects.playLose();
                } else {
                    winnerText.textContent = '🤝 TIE GAME! 🤝';
                    winnerText.style.color = '#FF9800';
                    shopPointsEarned.textContent = `No points earned - it's a tie!`;
                }

                document.getElementById('finalPlayerScore').textContent = this.playerScore;
                document.getElementById('finalAIScore').textContent = this.aiScore;
                document.getElementById('unlockMessage').textContent = '';
                gameOver.classList.remove('hidden');
            }, 2000);
        }, bonusDelay);
    }

    showMessage(text) {
        const message = document.getElementById('message');
        message.textContent = text;
    }

    newGame() {
        SoundEffects.playButton();
        this.playerScore = 0;
        this.aiScore = 0;
        this.currentPlayerCard = null;
        this.mapState = Array(this.totalCells).fill(null);
        this.isPlayerTurn = true;
        this.gameEnded = false;
        this.hoveredCellIndex = null;
        this.draggedOverCellIndex = null;
        
        // Reset power-ups to default amounts + permanent bonuses
        this.skipAIAvailable = 1 + (this.shop.owned.permanentPowerups?.skipAI || 0);
        this.skipAIUsed = false;
        this.replaceCardAvailable = 3 + (this.shop.owned.permanentPowerups?.replace || 0);
        this.viewNextAvailable = 1 + (this.shop.owned.permanentPowerups?.viewNext || 0);
        this.viewNextActive = false;
        this.viewNextUsedOnTurn = null;
        this.undoAvailable = 1 + (this.shop.owned.permanentPowerups?.undo || 0);
        this.undoState = null;
        this.pickCardAvailable = 0 + (this.shop.owned.permanentPowerups?.pickCard || 0); // NEW
        
        this.lastAICard = null;
        this.lastAICellIndex = null;
        this.blitzActive = false;
        this.turnCount = 0;
        this.extraTurn = false;
        
        this.stopBlitzMode();
        
        document.getElementById('nextCardPreview').classList.remove('show');
        
        document.getElementById('playerScore').textContent = '0';
        document.getElementById('aiScore').textContent = '0';
        document.getElementById('gameOver').classList.add('hidden');
        
        this.init();
        this.showMessage('New game started! Place your card!');
    }
}

// Shop Functions
function showShop() {
    SoundEffects.playButton();
    const modal = document.getElementById('shopModal');
    
    // Update shop points display
    document.getElementById('shopPointsDisplay').textContent = game.shop.points.toFixed(1);
    
    // Render shop items
    renderShopItems();
    
    modal.classList.add('show');
}

function closeShop() {
    SoundEffects.playButton();
    document.getElementById('shopModal').classList.remove('show');
}

function renderShopItems() {
    // Add this BEFORE the Board sizes section
    const powerupContainer = document.getElementById('powerupShopItems');
    powerupContainer.innerHTML = '';

    const powerups = [
        { id: 'skipAI', name: 'Skip AI Turn', price: 1, icon: '⏭️' },
        { id: 'replace', name: 'Replace Card', price: 0.5, icon: '🔄' },
        { id: 'viewNext', name: 'View Next Card', price: 1.5, icon: '👁️' },
        { id: 'undo', name: 'Undo Move', price: 2, icon: '↩️' },
        { id: 'pickCard', name: 'Pick Any Card', price: 3, icon: '🎯' }
    ];

    powerups.forEach(powerup => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">${powerup.icon} ${powerup.name}</div>
            <div class="shop-item-price">${powerup.price} pts</div>
            <button onclick="buyPowerup('${powerup.id}', ${powerup.price})" 
                    ${game.shop.points < powerup.price || game.gameMode === 'survival' ? 'disabled' : ''}>
                Buy
            </button>
        `;
        powerupContainer.appendChild(div);
    });

    // NEW: Permanent Power-up Bonuses
    const permPowerupContainer = document.getElementById('permanentPowerupShopItems');
    permPowerupContainer.innerHTML = '';

    const permanentPowerups = [
        { id: 'skipAI', name: 'Permanent Skip AI Bonus', basePrice: 1, icon: '⏭️' },
        { id: 'replace', name: 'Permanent Replace Bonus', basePrice: 0.5, icon: '🔄' },
        { id: 'viewNext', name: 'Permanent View Next Bonus', basePrice: 1.5, icon: '👁️' },
        { id: 'undo', name: 'Permanent Undo Bonus', basePrice: 2, icon: '↩️' },
        { id: 'pickCard', name: 'Permanent Pick Card Bonus', basePrice: 3, icon: '🎯' }
    ];

    permanentPowerups.forEach(powerup => {
        const price = powerup.basePrice * 100;
        const currentLevel = game.shop.owned.permanentPowerups?.[powerup.id] || 0;
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">${powerup.icon} ${powerup.name}</div>
            <div class="shop-item-desc">Current: +${currentLevel} per game</div>
            <div class="shop-item-price">${price} pts</div>
            <button onclick="buyPermanentPowerup('${powerup.id}', ${price})" 
                    ${game.shop.points < price || game.gameMode === 'survival' ? 'disabled' : ''}>
                Buy +1
            </button>
        `;
        permPowerupContainer.appendChild(div);
    });

    // AI Difficulty Levels
    const aiLevelContainer = document.getElementById('aiLevelShopItems');
    aiLevelContainer.innerHTML = '';

    const aiLevels = [
        { value: '0.2', name: 'Novice AI', price: 2 },
        { value: '0.3', name: 'Beginner AI', price: 3 },
        { value: '0.7', name: 'Expert AI', price: 7.5 },
        { value: '0.8', name: 'Pro AI', price: 12.5 },
        { value: '0.9', name: 'Master AI', price: 20 }
    ];

    aiLevels.forEach(level => {
        const owned = game.shop.owned.aiLevels && game.shop.owned.aiLevels.includes(level.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">🤖 ${level.name}</div>
            <div class="shop-item-price">${owned ? 'Owned' : level.price + ' pts'}</div>
            <button onclick="buyPermanent('aiLevel', '${level.value}', ${level.price})" 
                    ${owned || game.shop.points < level.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        aiLevelContainer.appendChild(div);
    });
    
    // Board sizes
    const boardContainer = document.getElementById('boardShopItems');
    boardContainer.innerHTML = '';
    
    const boards = [
        { value: '3', name: '3x3 Quick Board', price: 3 },
        { value: '7', name: '7x7 Epic Board', price: 10 },
        { value: '8', name: '8x8 Massive Board', price: 20 }
    ];
    
    boards.forEach(board => {
        const owned = game.shop.owned.boards.includes(board.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">🗺️ ${board.name}</div>
            <div class="shop-item-price">${owned ? 'Owned' : board.price + ' pts'}</div>
            <button onclick="buyPermanent('board', '${board.value}', ${board.price})" 
                    ${owned || game.shop.points < board.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        boardContainer.appendChild(div);
    });
    
    // Game modes
    const modeContainer = document.getElementById('gamemodeShopItems');
    modeContainer.innerHTML = '';
    
    const modes = [
        { value: 'blitz', name: 'Blitz Mode', price: 3 },
        { value: 'suddendeath', name: 'Sudden Death', price: 10 },
        { value: 'chainreaction', name: 'Chain Reaction', price: 20 },
        { value: 'reverserules', name: 'Reverse Rules', price: 35 },
        { value: 'mirrormatch', name: 'Mirror Match', price: 50 }
    ];
    
    modes.forEach(mode => {
        const owned = game.shop.owned.modes.includes(mode.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">🎮 ${mode.name}</div>
            <div class="shop-item-price">${owned ? 'Owned' : mode.price + ' pts'}</div>
            <button onclick="buyPermanent('mode', '${mode.value}', ${mode.price})" 
                    ${owned || game.shop.points < mode.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        modeContainer.appendChild(div);
    });
    
    // Themes
    const themeContainer = document.getElementById('themeShopItems');
    themeContainer.innerHTML = '';
    
    const themes = [
        { value: 'fire', name: 'Fire Theme', price: 3 },
        { value: 'midnight', name: 'Midnight Theme', price: 5 },
        { value: 'royal', name: 'Royal Theme', price: 10 },
        { value: 'cosmic', name: 'Cosmic Theme', price: 20 },
        { value: 'lava', name: 'Lava Theme', price: 35 },
        { value: 'emerald', name: 'Emerald Theme', price: 50 }
    ];
    
    themes.forEach(theme => {
        const owned = game.shop.owned.themes.includes(theme.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">🎨 ${theme.name}</div>
            <div class="shop-item-price">${owned ? 'Owned' : theme.price + ' pts'}</div>
            <button onclick="buyPermanent('theme', '${theme.value}', ${theme.price})" 
                    ${owned || game.shop.points < theme.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        themeContainer.appendChild(div);
    });
    
    // Icon packs
    const iconContainer = document.getElementById('iconShopItems');
    iconContainer.innerHTML = '';
    
    const icons = [
        { value: 'emoji', name: 'Emoji Numbers', price: 3 },
        { value: 'font', name: 'Font Icons', price: 10 },
        { value: 'moon', name: 'Moon Phase Icons', price: 25 }
    ];
    
    icons.forEach(icon => {
        const owned = game.shop.owned.icons.includes(icon.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">🎭 ${icon.name}</div>
            <div class="shop-item-price">${owned ? 'Owned' : icon.price + ' pts'}</div>
            <button onclick="buyPermanent('icon', '${icon.value}', ${icon.price})" 
                    ${owned || game.shop.points < icon.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        iconContainer.appendChild(div);
    });
}

function buyPowerup(type, price) {
    if (game.shop.points < price) {
        alert('Not enough points!');
        return;
    }
    
    if (game.gameMode === 'survival') {
        alert('Cannot buy power-ups in Survival mode!');
        return;
    }
    
    game.shop.points -= price;
    game.saveShop();
    
    switch(type) {
        case 'skipAI':
            game.skipAIAvailable++;
            break;
        case 'replace':
            game.replaceCardAvailable++;
            break;
        case 'viewNext':
            game.viewNextAvailable++;
            break;
        case 'undo':
            game.undoAvailable++;
            break;
        case 'pickCard': // NEW
            game.pickCardAvailable++;
            break;
    }
    
    game.updatePowerupDisplay();
    game.updateStatsDisplay();
    document.getElementById('shopPointsDisplay').textContent = game.shop.points.toFixed(1);
    renderShopItems();
    
    SoundEffects.playPowerup();
}

function buyPermanentPowerup(type, price) {
    if (game.shop.points < price) {
        alert('Not enough points!');
        return;
    }
    
    if (game.gameMode === 'survival') {
        alert('Cannot buy power-ups in Survival mode!');
        return;
    }
    
    if (!game.shop.owned.permanentPowerups) {
        game.shop.owned.permanentPowerups = {
            skipAI: 0,
            replace: 0,
            viewNext: 0,
            undo: 0,
            pickCard: 0
        };
    }
    
    game.shop.points -= price;
    game.shop.owned.permanentPowerups[type]++;
    
    // Apply to current game immediately
    switch(type) {
        case 'skipAI':
            game.skipAIAvailable++;
            break;
        case 'replace':
            game.replaceCardAvailable++;
            break;
        case 'viewNext':
            game.viewNextAvailable++;
            break;
        case 'undo':
            game.undoAvailable++;
            break;
        case 'pickCard':
            game.pickCardAvailable++;
            break;
    }
    
    game.saveShop();
    game.updatePowerupDisplay();
    game.updateStatsDisplay();
    document.getElementById('shopPointsDisplay').textContent = game.shop.points.toFixed(1);
    renderShopItems();
    
    SoundEffects.playUnlock();
    alert(`✨ Permanent bonus purchased! You'll now start every game with +${game.shop.owned.permanentPowerups[type]} of this power-up!`);
}

function buyPermanent(type, value, price) {
    if (game.shop.points < price) {
        alert('Not enough points!');
        return;
    }
    
    let alreadyOwned = false;
    
    switch(type) {
        case 'board':
            if (game.shop.owned.boards.includes(value)) {
                alreadyOwned = true;
            } else {
                game.shop.owned.boards.push(value);
            }
            break;
        case 'mode':
            if (game.shop.owned.modes.includes(value)) {
                alreadyOwned = true;
            } else {
                game.shop.owned.modes.push(value);
            }
            break;
        case 'theme':
            if (game.shop.owned.themes.includes(value)) {
                alreadyOwned = true;
            } else {
                game.shop.owned.themes.push(value);
            }
            break;
        case 'icon':
            if (game.shop.owned.icons.includes(value)) {
                alreadyOwned = true;
            } else {
                game.shop.owned.icons.push(value);
            }
            break;
        case 'aiLevel':
            if (!game.shop.owned.aiLevels) {
                game.shop.owned.aiLevels = ['intermediate', 'skilled', 'advanced'];
            }
            if (game.shop.owned.aiLevels.includes(value)) {
                alreadyOwned = true;
            } else {
                game.shop.owned.aiLevels.push(value);
            }
            break;
    }
    
    if (alreadyOwned) {
        alert('You already own this item!');
        return;
    }
    
    game.shop.points -= price;
    game.saveShop();
    game.updateStatsDisplay();// Continuing from buyPermanent function...

    document.getElementById('shopPointsDisplay').textContent = game.shop.points.toFixed(1);

    game.updateSettingsUI();
    renderShopItems();
    
    SoundEffects.playUnlock();
}

function showSettings() {
    SoundEffects.playButton();
    document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
    SoundEffects.playButton();
    document.getElementById('settingsModal').classList.remove('show');
}

function showStats() {
    SoundEffects.playButton();
    document.getElementById('statsModal').classList.add('show');
}

function closeStats() {
    SoundEffects.playButton();
    document.getElementById('statsModal').classList.remove('show');
}

function resetStats() {
    SoundEffects.playButton();
    if (confirm('Are you sure you want to reset all statistics AND shop data? This will reset your points and lock all purchased items!')) {
        // Reset stats
        game.stats = {
            wins: 0,
            losses: 0,
            ties: 0,
            highScore: 0,
            gamesPlayed: 0,
            shopPoints: 0
        };
        game.saveStats();
        
        // Reset shop
        game.shop = {
            points: 0,
            owned: {
                boards: ['4', '5', '6'],
                modes: ['classic', 'nobonus', 'survival'],
                themes: ['default', 'dark', 'nature', 'sunset', 'ocean'],
                icons: ['default'],
                aiLevels: ['0.4', '0.5', '0.6'] // Default: Intermediate, Skilled, Advanced
            }
        };
        game.saveShop();
        
        // Update all displays
        game.updateStatsDisplay();
        game.updateSettingsUI();
        
        // If shop is open, update it
        const shopModal = document.getElementById('shopModal');
        if (shopModal.classList.contains('show')) {
            document.getElementById('shopPointsDisplay').textContent = '0.0';
            renderShopItems();
        }
        
        SoundEffects.playButton();
        alert('Statistics and shop data have been completely reset!');
    }
}

function changeTheme(theme) {
    if (!game.shop.owned.themes.includes(theme)) {
        alert('🔒 This theme is locked! Purchase it in the shop first.');
        return;
    }
    
    SoundEffects.playButton();
    game.currentTheme = theme;
    game.saveTheme(theme);
    game.applyTheme(theme);
}

function changeIconPack(pack) {
    if (!game.shop.owned.icons.includes(pack)) {
        alert('🔒 This icon pack is locked! Purchase it in the shop first.');
        return;
    }
    
    SoundEffects.playButton();
    game.currentIconPack = pack;
    game.saveIconPack(pack);
    game.applyIconPack(pack);
}

function changeBoardSize(value) {
    game.changeBoardSize(value);
}

function changeGameMode(value) {
    game.changeGameMode(value);
}

function toggleRules() {
    SoundEffects.playButton();
    const rules = document.getElementById('gameRules');
    rules.classList.toggle('show');
}

// Initialize game
const game = new NumberConnectionGame();

// Resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (game) {
            game.drawConnectionLines();
        }
    }, 250);
});

// Modal close on background click
document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') {
        closeSettings();
    }
});

document.getElementById('statsModal').addEventListener('click', (e) => {
    if (e.target.id === 'statsModal') {
        closeStats();
    }
});

document.getElementById('tutorialModal').addEventListener('click', (e) => {
    if (e.target.id === 'tutorialModal') {
        closeTutorial();
    }
});

document.getElementById('shopModal').addEventListener('click', (e) => {
    if (e.target.id === 'shopModal') {
        closeShop();
    }
});