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
        this.playTone(523, 0.15, 'sine', 0.3); // C
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.3), 150); // E
        setTimeout(() => this.playTone(784, 0.15, 'sine', 0.3), 300); // G
        setTimeout(() => this.playTone(1047, 0.3, 'sine', 0.3), 450); // C high
    },

    playLose() {
        this.playTone(392, 0.2, 'sine', 0.3); // G
        setTimeout(() => this.playTone(349, 0.2, 'sine', 0.3), 200); // F
        setTimeout(() => this.playTone(294, 0.4, 'sine', 0.3), 400); // D
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

// Initialize audio context
SoundEffects.init();

// Icon Pack conversion functions
const IconPacks = {
    default: (num) => num.toString(),
    font: (num) => num.toString(),
    emoji: (num) => ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'][num],
    moon: (num) => ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][num]
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
        
        // FIXED: Correct tutorial paths - each cell connects to adjacent cells properly
        this.connections = [
            // Row 1
            { from: 0, to: 1 }, { from: 1, to: 2 },
            // Row 2
            { from: 3, to: 4 }, { from: 4, to: 5 },
            // Row 3
            { from: 6, to: 7 }, { from: 7, to: 8 },
            // Vertical columns
            { from: 0, to: 3 }, { from: 3, to: 6 },
            { from: 1, to: 4 }, { from: 4, to: 7 },
            { from: 2, to: 5 }, { from: 5, to: 8 }
        ];
        
        this.drawTutorialConnections();
        
        document.getElementById('playerScore').textContent = '0';
        document.getElementById('aiScore').textContent = '0';
        
        document.getElementById('currentCard').textContent = '8';
        
        // CRITICAL: Enable drag and drop for tutorial
        this.enableTutorialDragAndDrop();
    }

    // In class TutorialGame...

    enableTutorialDragAndDrop() {
        const currentCard = document.getElementById('currentCard');
        const mapGrid = document.getElementById('mapGrid');
        
        // Make the card draggable for the tutorial
        currentCard.draggable = true;
        currentCard.style.cursor = 'grab';
        
        // --- START OF FIX ---
        // Set up drag handlers specifically for the tutorial
        currentCard.ondragstart = (e) => {
            if (!this.awaitingPlayerAction) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.effectAllowed = 'move';
            // This line is required for drag-and-drop to work in all browsers
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
                    // When the correct cell is dropped on, advance the tutorial
                    this.handleCellClick(cellIndex);
                }
            }
        };
        // --- END OF FIX ---
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

    // In the TutorialGame class, modify createNextButton():
    createNextButton() {
    if (this.nextButton) {
        // Return existing button but ensure it's visible
        this.nextButton.style.display = 'inline-block';
        return this.nextButton;
    }
    
    const btn = document.createElement('button');
    btn.className = 'tutorial-next-btn';
    btn.textContent = 'Continue →';
    btn.style.display = 'inline-block'; // Make sure it's visible
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
        
        // Clear all highlights
        cells.forEach(cell => {
            cell.classList.remove('tutorial-highlight');
            cell.style.pointerEvents = 'none';
            cell.onclick = null;
        });
        
        // Clear SVG highlights
        const svg = document.getElementById('connectionsSvg');
        const lines = svg.querySelectorAll('line');
        lines.forEach(line => line.classList.remove('highlighted'));
        
        this.awaitingPlayerAction = false;
        
        // Create or get next button
        const nextBtn = this.createNextButton();
        
        switch(step) {
            case 0:
                message.innerHTML = '📖 <strong>Step 1: Paths are Important!</strong> - Notice the gray lines connecting cells. You can ONLY score points through these connections!';
                message.appendChild(nextBtn);
                
                // FIXED: Highlight correct paths from center (4) to top-center (1) and bottom-center (7)
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
                
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 500);
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
                cells[4].style.pointerEvents = 'auto'; // Make it clickable
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
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 500);
                break;
                
            case 3:
                nextBtn.disabled = true;
                message.innerHTML = '🤖 <strong>AI\'s turn:</strong> AI places an "8" next to yours...';
                message.appendChild(nextBtn);
                cells[1].classList.add('tutorial-highlight');
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 1000);
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
                    setTimeout(() => {
                        nextBtn.disabled = false;
                    }, 1500);
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
                    setTimeout(() => {
                        nextBtn.disabled = false;
                    }, 1500);
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
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 500);
                break;
                
            case 9:
                nextBtn.disabled = true;
                message.innerHTML = '🤖 AI places a "7" next to your "3"...';
                message.appendChild(nextBtn);
                cells[3].classList.add('tutorial-highlight');
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 1000);
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
                    setTimeout(() => {
                        nextBtn.disabled = false;
                    }, 1500);
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
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 500);
                break;
                
            case 13:
                nextBtn.disabled = true;
                message.innerHTML = '🤖 AI places a "3" on the right side...';
                message.appendChild(nextBtn);
                cells[5].classList.add('tutorial-highlight');
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 1000);
                break;
                
            case 14:
                nextBtn.disabled = true;
                cells[5].textContent = '3';
                cells[5].classList.remove('empty', 'tutorial-highlight');
                cells[5].classList.add('neutral');
                SoundEffects.playCardPlace();
                message.innerHTML = '✅ AI placed a 3.';
                message.appendChild(nextBtn);
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 500);
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
                        setTimeout(() => {
                            nextBtn.disabled = false;
                        }, 1500);
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

    // In TutorialGame class, modify the end() method:
    // Modified end() method to restore handlers:
    // In class TutorialGame...

    end() {
        SoundEffects.playButton();
        
        // --- START OF FIX ---
        // 1. Clean up all tutorial-specific event listeners
        const currentCard = document.getElementById('currentCard');
        const mapGrid = document.getElementById('mapGrid');
        const cells = mapGrid.querySelectorAll('.map-cell');

        currentCard.ondragstart = null;
        currentCard.ondragend = null;
        mapGrid.ondragover = null;
        mapGrid.ondragleave = null;
        mapGrid.ondrop = null;
        cells.forEach(cell => { cell.onclick = null; });
        
        // 2. Tell the main game it's no longer ended
        this.originalGame.gameEnded = false;
        
        // 3. Start a fresh game, which re-initializes all correct handlers
        this.originalGame.newGame();
        // --- END OF FIX ---
    }
}

class NumberConnectionGame {
    constructor() {
        // Load saved settings
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
        
        this.skipAIAvailable = 1;
        this.skipAIUsed = false;
        this.replaceCardAvailable = 3;
        this.viewNextAvailable = 1;
        this.viewNextActive = false;
        this.viewNextUsedOnTurn = null;
        this.undoAvailable = 1;
        
        // Undo state
        this.undoState = null;
        
        this.lastAICard = null;
        this.lastAICellIndex = null;
        
        this.aiDifficulty = this.loadDifficulty();
        this.currentTheme = this.loadTheme();
        this.currentIconPack = this.loadIconPack();
        this.gameMode = this.loadGameMode();
        this.sfxEnabled = this.loadSFX();
        
        this.blitzInterval = null;
        this.blitzActive = false;
        
        this.stats = this.loadStats();
        
        this.turnCount = 0;
        this.extraTurn = false;
        
        this.applyTheme(this.currentTheme);
        this.applyIconPack(this.currentIconPack);
        this.updateDifficultyDropdown();
        this.updateBoardSizeDropdown();
        this.updateGameModeDropdown();
        this.updateSFXToggle();
        this.updateStatsDisplay();
        this.updateThemeUnlocks();
        this.updateBoardSizeUnlocks();
        this.updateIconPackUnlocks();
        this.updateGameModeUnlocks();
        
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
            return JSON.parse(saved);
        }
        return {
            wins: 0,
            losses: 0,
            ties: 0,
            highScore: 0,
            gamesPlayed: 0
        };
    }

    saveStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
        this.updateStatsDisplay();
        this.updateThemeUnlocks();
        this.updateBoardSizeUnlocks();
        this.updateIconPackUnlocks();
        this.updateGameModeUnlocks();
    }

    updateStatsDisplay() {
        document.getElementById('winsCount').textContent = this.stats.wins;
        document.getElementById('lossesCount').textContent = this.stats.losses;
        document.getElementById('tiesCount').textContent = this.stats.ties;
        document.getElementById('highScore').textContent = this.stats.highScore;
        
        const totalGames = this.stats.wins + this.stats.losses + this.stats.ties;
        const winRate = totalGames > 0 ? Math.round((this.stats.wins / totalGames) * 100) : 0;
        document.getElementById('winRate').textContent = winRate + '%';
    }

    updateThemeUnlocks() {
        const themes = [
            { name: 'fire', wins: 3 },
            { name: 'midnight', wins: 5 },
            { name: 'royal', wins: 10 },
            { name: 'cosmic', wins: 20 },
            { name: 'lava', wins: 35 },
            { name: 'emerald', wins: 50 }
        ];

        themes.forEach(theme => {
            const element = document.querySelector(`.theme-option.${theme.name}`);
            if (element) {
                if (this.stats.wins >= theme.wins) {
                    element.classList.remove('locked');
                    element.querySelector('.unlock-text').textContent = 'Unlocked!';
                } else {
                    element.classList.add('locked');
                    element.querySelector('.unlock-text').textContent = `${theme.wins} wins`;
                }
            }
        });
    }

    updateIconPackUnlocks() {
        const packs = [
            { name: 'font', wins: 10 },
            { name: 'moon', wins: 25 }
        ];

        packs.forEach(pack => {
            const element = document.querySelector(`.icon-option[data-icon="${pack.name}"]`);
            if (element) {
                if (this.stats.wins >= pack.wins) {
                    element.classList.remove('locked');
                    const unlockText = element.querySelector('.unlock-text');
                    if (unlockText) unlockText.textContent = 'Unlocked!';
                } else {
                    element.classList.add('locked');
                    const unlockText = element.querySelector('.unlock-text');
                    if (unlockText) unlockText.textContent = `${pack.wins} wins`;
                }
            }
        });
    }

    updateGameModeUnlocks() {
        const modes = [
            { id: 'suddendeathOption', wins: 10, name: 'Sudden Death' },
            { id: 'chainreactionOption', wins: 20, name: 'Chain Reaction' },
            { id: 'reverserulesOption', wins: 35, name: 'Reverse Rules' },
            { id: 'mirrormatchOption', wins: 50, name: 'Mirror Match' }
        ];

        modes.forEach(mode => {
            const element = document.getElementById(mode.id);
            if (element) {
                if (this.stats.wins >= mode.wins) {
                    element.disabled = false;
                    element.textContent = `${mode.name} ⭐ Unlocked!`;
                } else {
                    element.disabled = true;
                    element.textContent = `${mode.name} 🔒 Requires ${mode.wins} wins`;
                }
            }
        });
    }

    updateBoardSizeUnlocks() {
        const option7x7 = document.getElementById('board7x7Option');
        if (option7x7) {
            if (this.stats.wins >= 10) {
                option7x7.disabled = false;
                option7x7.textContent = '7x7 (Epic) ⭐ Unlocked!';
            } else {
                option7x7.disabled = true;
                option7x7.textContent = '7x7 (Epic) 🔒 Requires 10 wins';
            }
        }
        
        const option8x8 = document.getElementById('board8x8Option');
        if (option8x8) {
            if (this.stats.wins >= 20) {
                option8x8.disabled = false;
                option8x8.textContent = '8x8 (Massive) ⭐ Unlocked!';
            } else {
                option8x8.disabled = true;
                option8x8.textContent = '8x8 (Massive) 🔒 Requires 20 wins';
            }
        }
    }

    updateDifficultyDropdown() {
        const select = document.getElementById('difficultySelect');
        if (select) {
            select.value = this.aiDifficulty.toString();
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
        this.aiDifficulty = parseFloat(value);
        this.saveDifficulty();
    }

    changeBoardSize(value) {
        SoundEffects.playButton();
        const newSize = parseInt(value);
        
        if (newSize === 7 && this.stats.wins < 10) {
            alert('🔒 7x7 board is locked! You need 10 wins to unlock it.');
            this.updateBoardSizeDropdown();
            return;
        }
        
        if (newSize === 8 && this.stats.wins < 20) {
            alert('🔒 8x8 board is locked! You need 20 wins to unlock it.');
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
        
        // Check unlock requirements
        const requirements = {
            suddendeath: 10,
            chainreaction: 20,
            reverserules: 35,
            mirrormatch: 50
        };
        
        if (requirements[value] && this.stats.wins < requirements[value]) {
            alert(`🔒 This mode is locked! You need ${requirements[value]} wins to unlock it.`);
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
        
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeTheme = document.querySelector(`.theme-option.${theme}`);
        if (activeTheme) {
            activeTheme.classList.add('active');
        }
    }

    // In class NumberConnectionGame...

    applyIconPack(pack) {
        // If the game is in progress AND the selected pack is different, reset the game.
        if (!this.gameEnded && pack !== this.currentIconPack) {
            this.currentIconPack = pack;
            this.saveIconPack(pack);
            
            // Close the settings modal and start a new game.
            closeSettings();
            this.newGame(); 
            this.showMessage("Game reset due to icon pack change.");
            return; // Exit the function.
        }
        
        // If the game is over or the pack is the same, just update visuals.
        this.currentIconPack = pack;
        this.saveIconPack(pack);

        // Update the body class for styling.
        document.body.className = document.body.className.replace(/icon-\w+/g, '').trim();
        if (pack !== 'default') {
            document.body.classList.add('icon-' + pack);
        }
        
        // Update the active selection in the settings menu.
        document.querySelectorAll('.icon-option').forEach(option => option.classList.remove('active'));
        const activeIcon = document.querySelector(`.icon-option[data-icon="${pack}"]`);
        if (activeIcon) {
            activeIcon.classList.add('active');
        }
        
        // Refresh the numbers on the board.
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

    // COMPLETELY REWRITTEN UNDO SYSTEM - FIXED
    saveUndoState() {
        if (!this.isPlayerTurn || this.currentPlayerCard === null) return;
        
        this.undoState = {
            // Save BEFORE placing - copy empty cells
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
        
        // RESTORE THE BOARD COMPLETELY - cells become empty again
        this.mapState = this.undoState.mapState.map(cell => cell ? { number: cell.number, owner: cell.owner } : null);
        
        // Restore scores
        this.playerScore = this.undoState.playerScore;
        this.aiScore = this.undoState.aiScore;
        
        // Restore decks
        this.playerDeck = [...this.undoState.playerDeck];
        this.aiDeck = [...this.undoState.aiDeck];
        
        // Restore player's card
        this.currentPlayerCard = this.undoState.currentPlayerCard;
        
        // Update UI
        const preview = document.getElementById('nextCardPreview');
        preview.classList.remove('show');
        this.viewNextActive = false;
        
        const cardText = IconPacks[this.currentIconPack](this.currentPlayerCard);
        document.getElementById('currentCard').textContent = cardText;
        
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('aiScore').textContent = this.aiScore;
        
        // CRITICAL FIX: Actually update the visual board
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
    }

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

        const aiCard = this.aiDeck.shift();
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

    // In class NumberConnectionGame...

    setupHoverEffects() {
        const mapGrid = document.getElementById('mapGrid');
        
        mapGrid.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('.map-cell');
            
            // --- START OF FIX ---
            // The condition is changed to allow hovering at any time (not just the player's turn)
            // as long as the game has not ended. It now works on ANY cell, not just empty ones.
            if (cell && !this.gameEnded) {
                const cellIndex = parseInt(cell.dataset.index);
                
                // Avoids conflict with drag-and-drop highlighting
                if (this.draggedOverCellIndex !== cellIndex) {
                    this.highlightNearbyConnections(cellIndex);
                }
            }
            // --- END OF FIX ---
        });

        mapGrid.addEventListener('mouseout', (e) => {
            const cell = e.target.closest('.map-cell');
            // This condition is broadened to ensure highlights are cleared
            // when moving off of ANY cell, not just empty ones.
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
            // Create one deck and copy it
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
        
        document.getElementById('skipAiCount').textContent = this.skipAIAvailable;
        document.getElementById('replaceCardCount').textContent = this.replaceCardAvailable;
        document.getElementById('viewNextCount').textContent = this.viewNextAvailable;
        document.getElementById('undoCount').textContent = this.undoAvailable;
        
        const isSurvival = this.gameMode === 'survival';
        const isBlitz = this.gameMode === 'blitz';
        
        skipBtn.disabled = this.skipAIAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || isBlitz;
        replaceBtn.disabled = this.replaceCardAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival;
        viewNextBtn.disabled = this.viewNextAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || this.playerDeck.length === 0;
        undoBtn.disabled = this.undoAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || !this.undoState;
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

        // Save undo state BEFORE playing
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
                
                // Check sudden death
                if (this.gameMode === 'suddendeath' && this.playerScore >= 10) {
                    this.showMessage('⚡ SUDDEN DEATH! You reached 10 points first! ⚡');
                    setTimeout(() => this.endGame(), 1500);
                    return;
                }
                
                // Chain reaction - extra turn
                if (this.gameMode === 'chainreaction') {
                    this.extraTurn = true;
                    this.showMessage(`🔗 CHAIN! You scored, take another turn!`);
                }
            } else {
                this.showMessage(`No points this turn.`);
                this.extraTurn = false;
            }
            
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
                // Give player another turn
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

        const aiCard = this.aiDeck.shift();
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
                        
                        // Check sudden death
                        if (this.gameMode === 'suddendeath' && this.aiScore >= 10) {
                            this.showMessage('⚡ SUDDEN DEATH! AI reached 10 points first! ⚡');
                            setTimeout(() => this.endGame(), 1500);
                            return;
                        }
                        
                        // Chain reaction - AI gets extra turn
                        if (this.gameMode === 'chainreaction') {
                            this.showMessage(`🔗 AI chains! Taking another turn!`);
                            setTimeout(() => {
                                if (!this.shouldGameEnd()) {
                                    this.aiTurn(); // AI goes again
                                } else {
                                    this.endGame();
                                }
                            }, 1000);
                            return;
                        }
                    } else {
                        this.showMessage(`AI played but scored no points.`);
                    }
                    
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

        // For reverse rules, AI wants LOWEST score
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

        // Normal AI behavior
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

    calculatePointsForState(cellIndex, number, owner, state, updateOwnership) {
        let totalPoints = 0;
        const highlightCells = new Set([cellIndex]);
        const cellsToOwn = new Set([cellIndex]);
        const cellPointsMap = new Map();

        const connectedCells = this.getConnectedCells(cellIndex);

        // For moon theme, use special matching rules
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
                    
                    // Full moon pairs (opposite phases = 4 apart in 8-phase cycle)
                    if ((connectedCell.number + number) === 4 || Math.abs(connectedCell.number - number) === 4) {
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

        // Sequences must be 3+ in length
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

    findAllSequences(startIndex, startNumber, state) {
        const allSequences = [];
        
        const upSequence = this.exploreSequence(startIndex, startNumber, 'up', state);
        const downSequence = this.exploreSequence(startIndex, startNumber, 'down', state);

        if (upSequence.length > 1 || downSequence.length > 1) {
            const combined = [...downSequence.reverse().slice(0, -1), ...upSequence];
            if (combined.length >= 3) {
                allSequences.push(combined);
            }
        }

        return allSequences;
    }

    exploreSequence(startIndex, startNumber, direction, state) {
        const sequence = [startIndex];
        const visited = new Set([startIndex]);
        
        let currentIndex = startIndex;
        let currentNumber = startNumber;

        while (true) {
            const connected = this.getConnectedCells(currentIndex);
            let foundNext = false;

            for (const nextIndex of connected) {
                if (visited.has(nextIndex)) continue;
                
                const nextCell = state[nextIndex];
                if (!nextCell) continue;

                const expectedNumber = direction === 'up' 
                    ? this.getNextNumber(currentNumber)
                    : this.getPrevNumber(currentNumber);
                
                if (nextCell.number === expectedNumber) {
                    visited.add(nextIndex);
                    sequence.push(nextIndex);
                    currentIndex = nextIndex;
                    currentNumber = nextCell.number;
                    foundNext = true;
                    break;
                }
            }

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

    // In updateMap(), make the class updates more robust:
    updateMap() {
        const cells = document.querySelectorAll('.map-cell');
        cells.forEach((cell, index) => {
            const cellData = this.mapState[index];
            
            // CRITICAL: Remove ALL possible state classes first
            cell.classList.remove('empty', 'neutral', 'player-owned', 'ai-owned', 
                                'tutorial-highlight', 'drag-over', 'nearby-highlight'); // ADD MORE CLASSES
            
            if (cellData) {
                cell.textContent = IconPacks[this.currentIconPack](cellData.number);
                
                if (cellData.owner === 'player') {
                    cell.classList.add('player-owned');
                } else if (cellData.owner === 'ai') {
                    cell.classList.add('ai-owned');
                } else {
                    cell.classList.add('neutral');
                }
            } else {
                // Reset empty cells properly
                cell.textContent = '○';
                cell.classList.add('empty');
                // Ensure pointer events are enabled for empty cells
                cell.style.pointerEvents = ''; // ADD THIS
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

            const prevWins = this.stats.wins;
            const unlockedItems = [];

            this.stats.gamesPlayed++;
            
            // Determine winner (reverse for reverse rules)
            let playerWon = false;
            if (this.gameMode === 'reverserules') {
                playerWon = this.playerScore < this.aiScore;
            } else {
                playerWon = this.playerScore > this.aiScore;
            }
            
            if (playerWon) {
                this.stats.wins++;
                
                if (prevWins < 3 && this.stats.wins >= 3) {
                    unlockedItems.push('🔥 Fire Theme');
                }
                if (prevWins < 5 && this.stats.wins >= 5) {
                    unlockedItems.push('🌙 Midnight Theme');
                }
                if (prevWins < 10 && this.stats.wins >= 10) {
                    unlockedItems.push('👑 Royal Theme', '⭐ 7x7 Board', '🎭 Font Icons', '⚡ Sudden Death Mode');
                }
                if (prevWins < 20 && this.stats.wins >= 20) {
                    unlockedItems.push('🌌 Cosmic Theme', '💎 8x8 Board', '🔗 Chain Reaction Mode');
                }
                if (prevWins < 25 && this.stats.wins >= 25) {
                    unlockedItems.push('🌝 Moon Icons');
                }
                if (prevWins < 35 && this.stats.wins >= 35) {
                    unlockedItems.push('🌋 Lava Theme', '🔄 Reverse Rules Mode');
                }
                if (prevWins < 50 && this.stats.wins >= 50) {
                    unlockedItems.push('💚 Emerald Theme', '🪞 Mirror Match Mode');
                }
            } else if (this.gameMode === 'reverserules' ? (this.aiScore < this.playerScore) : (this.aiScore > this.playerScore)) {
                this.stats.losses++;
            } else {
                this.stats.ties++;
            }
            this.saveStats();

            setTimeout(() => {
                const gameOver = document.getElementById('gameOver');
                const winnerText = document.getElementById('winnerText');
                const unlockMessage = document.getElementById('unlockMessage');
                
                if (playerWon) {
                    winnerText.textContent = '🎉 YOU WIN! 🎉';
                    winnerText.style.color = '#4CAF50';
                    SoundEffects.playWin();
                    
                    if (unlockedItems.length > 0) {
                        unlockMessage.textContent = '🎊 Unlocked: ' + unlockedItems.join(', ');
                        SoundEffects.playUnlock();
                    } else {
                        unlockMessage.textContent = '';
                    }
                } else if (this.gameMode === 'reverserules' ? (this.aiScore < this.playerScore) : (this.aiScore > this.playerScore)) {
                    winnerText.textContent = '🤖 AI WINS! 🤖';
                    winnerText.style.color = '#f44336';
                    unlockMessage.textContent = '';
                    SoundEffects.playLose();
                } else {
                    winnerText.textContent = '🤝 TIE GAME! 🤝';
                    winnerText.style.color = '#FF9800';
                    unlockMessage.textContent = '';
                }

                document.getElementById('finalPlayerScore').textContent = this.playerScore;
                document.getElementById('finalAIScore').textContent = this.aiScore;
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
        this.skipAIAvailable = this.gameMode === 'survival' ? 0 : 1;
        this.skipAIUsed = false;
        this.replaceCardAvailable = this.gameMode === 'survival' ? 0 : 3;
        this.viewNextAvailable = this.gameMode === 'survival' ? 0 : 1;
        this.viewNextActive = false;
        this.viewNextUsedOnTurn = null;
        this.undoAvailable = this.gameMode === 'survival' ? 0 : 1;
        this.undoState = null;
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
    if (confirm('Are you sure you want to reset all statistics? This will lock themes and board sizes again!')) {
        game.stats = {
            wins: 0,
            losses: 0,
            ties: 0,
            highScore: 0,
            gamesPlayed: 0
        };
        game.saveStats();
        SoundEffects.playButton();
        alert('Statistics have been reset!');
    }
}

function changeTheme(theme) {
    const themeElement = document.querySelector(`.theme-option.${theme}`);
    if (themeElement && themeElement.classList.contains('locked')) {
        const winsRequired = themeElement.getAttribute('data-wins-required');
        alert(`🔒 This theme is locked! You need ${winsRequired} wins to unlock it. (Current wins: ${game.stats.wins})`);
        return;
    }
    
    SoundEffects.playButton();
    game.currentTheme = theme;
    game.saveTheme(theme);
    game.applyTheme(theme);
}

function changeIconPack(pack) {
    const iconElement = document.querySelector(`.icon-option[data-icon="${pack}"]`);
    if (iconElement && iconElement.classList.contains('locked')) {
        const winsRequired = iconElement.getAttribute('data-wins-required');
        alert(`🔒 This icon pack is locked! You need ${winsRequired} wins to unlock it. (Current wins: ${game.stats.wins})`);
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

const game = new NumberConnectionGame();

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (game) {
            game.drawConnectionLines();
        }
    }, 250);
});

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