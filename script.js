// Helper function to format numbers with commas and tenths place
function formatPoints(num) {
    const rounded = Math.round(num * 10) / 10;
    const [whole, decimal] = rounded.toFixed(1).split('.');
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${withCommas}.${decimal}`;
}

// Helper function to format numbers with commas and tenths place
function formatPoints(num) {
    const rounded = Math.round(num * 10) / 10;
    const [whole, decimal] = rounded.toFixed(1).split('.');
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${withCommas}.${decimal}`;
}

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
    },
    
    // Casino sound effects
    playCoinFlip() {
        // Metallic spinning sound
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.playTone(800 + (i % 2) * 200, 0.08, 'triangle', 0.2), i * 100);
        }
    },
    
    playSlotSpin() {
        // Rapid ticking sound for slot/roulette spinning
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.playTone(300 + Math.random() * 200, 0.05, 'square', 0.12), i * 80);
        }
    },
    
    playSlotStop() {
        // Thunk sound when a reel stops
        this.playTone(200, 0.15, 'square', 0.3);
        this.playTone(150, 0.1, 'sine', 0.2);
    },
    
    playJackpot() {
        // Exciting jackpot fanfare
        const notes = [523, 659, 784, 1047, 1319, 1568];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.35), i * 100);
        });
        setTimeout(() => {
            this.playTone(1047, 0.5, 'sine', 0.4);
            this.playTone(1319, 0.5, 'sine', 0.3);
            this.playTone(1568, 0.5, 'sine', 0.25);
        }, 650);
    },
    
    playCasinoWin() {
        // Quick celebratory sound for casino wins
        this.playTone(700, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(880, 0.1, 'sine', 0.3), 80);
        setTimeout(() => this.playTone(1100, 0.15, 'sine', 0.35), 160);
    },
    
    playCasinoLose() {
        // Sad womp womp
        this.playTone(300, 0.2, 'sine', 0.25);
        setTimeout(() => this.playTone(250, 0.3, 'sine', 0.25), 200);
    },
    
    playBetPlace() {
        // Chip/coin sound
        this.playTone(1200, 0.05, 'triangle', 0.2);
        setTimeout(() => this.playTone(1400, 0.05, 'triangle', 0.15), 50);
    }
};

SoundEffects.init();

// Load slots upgrade state on page load
loadSlotsState();

const IconPacks = {
    default: (num) => num.toString(),
    font: (num) => num.toString(), // This already returns the number, font style is applied via CSS
    emoji: (num) => ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'][num],
    moon: (num) => {
        const phases = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
        return phases[num % 8] || '🌑';
    },
    dice: (num) => {
        // Dice faces 1-6, map 0-9 to show the actual pip count
        // 0 shows ⚀ (1 pip), 1-5 shows respective faces, 6+ wraps
        const dice = ['⚀','⚁','⚂','⚃','⚄','⚅'];
        return dice[num % 6];
    },
    roman: (num) => {
        // Roman numerals I-X displayed, but mapped to values 0-9
        // I=0, II=1, III=2, IV=3, V=4, VI=5, VII=6, VIII=7, IX=8, X=9
        const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
        return romans[num] || num.toString();
    }
};

const IconPackMaxNumbers = {
    default: 10,
    font: 10,
    emoji: 10,
    moon: 8,
    dice: 6,
    roman: 10
};

// Icon pack point multipliers (some packs give reduced points)
const IconPackMultipliers = {
    default: 1.0,
    font: 1.0,
    emoji: 1.0,
    moon: 0.9,
    dice: 0.8,
    roman: 1.15
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
        
        <h3>🎰 Casino:</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
            Click the <strong>🎲 dice icons</strong> in the game title to open the Casino! 
            Gamble your shop points on games like Coin Flip, Slots, Higher/Lower, and Blackjack. 
            Win big or lose it all - it's all part of the fun!
        </p>
        
        <h3>✨ Secret Area:</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
            There's a hidden <strong>Creator Center</strong> with special features! To access it:
            Click <em>AI Score</em> → <em>Your Score</em> → <em>Current Card</em> (within 5 seconds each).
            You'll need 500 Shop Points and 3 Creator Points (from Quests) to unlock its features.
        </p>
        
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

function showPowerups() {
    SoundEffects.playButton();
    game.updatePowerupDisplay();
    document.getElementById('powerupsModal').classList.add('show');
}

function closePowerups() {
    SoundEffects.playButton();
    document.getElementById('powerupsModal').classList.remove('show');
}

// Close powerups modal when clicking background
document.addEventListener('DOMContentLoaded', () => {
    const powerupsModal = document.getElementById('powerupsModal');
    if (powerupsModal) {
        powerupsModal.addEventListener('click', (e) => {
            if (e.target.id === 'powerupsModal') {
                closePowerups();
            }
        });
    }
});
// Better mobile touch handling for power-ups menu
document.addEventListener('DOMContentLoaded', () => {
    const activatorBtn = document.querySelector('.powerup-activator-btn');
    const menu = document.querySelector('.powerups-menu');
    const activator = document.querySelector('.powerups-activator');
    
    if (!activatorBtn || !menu || !activator) return;
    
    let menuOpen = false;
    
    // Toggle menu on mobile touch
    if (window.innerWidth < 768) {
        activatorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuOpen = !menuOpen;
            
            if (menuOpen) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            } else {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(10px)';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!activator.contains(e.target) && menuOpen) {
                menuOpen = false;
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(10px)';
            }
        });
        
        // Close menu after using a power-up
        const menuItems = menu.querySelectorAll('.powerup-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(() => {
                    menuOpen = false;
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(10px)';
                }, 300);
            });
        });
    }
    
    // Re-initialize on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            menuOpen = false;
            menu.style.opacity = '';
            menu.style.visibility = '';
            menu.style.transform = '';
        }, 250);
    });
});

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
        
        // Time Trials mode properties
        this.timeTrialsRemaining = 10.0;
        this.timeTrialsInterval = null;
        this.timeTrialsTurnCount = 0; // Track turn count to skip first turn
        
        // Fog of War mode properties
        this.visibleCells = new Set();
        
        // Ludicrously Lucky mode properties
        this.turnCountSinceStart = 0;

        // FIXED: Load stats and shop BEFORE initializing power-ups
        this.stats = this.loadStats();
        this.shop = this.loadShop();

        this.turnCount = 0;
        this.extraTurn = false;

        // FIXED: Separate consumable shop power-ups from defaults
        const shopConsumables = this.loadShopConsumables();
        const permanentBonuses = this.shop.owned.permanentPowerups || {
            skipAI: 0,
            replace: 0,
            viewNext: 0,
            undo: 0,
            pickCard: 0,
            doublePoints: 0
        };

        // Default amounts per game
        const defaults = {
            skipAI: 1,
            replace: 3,
            viewNext: 1,
            undo: 1,
            pickCard: 0,
            doublePoints: 0
        };

        // Total available = defaults + permanent + shop consumables
        this.skipAIAvailable = defaults.skipAI + permanentBonuses.skipAI + shopConsumables.skipAI;
        this.skipAIConsumable = shopConsumables.skipAI;
        this.skipAIUsed = false;

        this.replaceCardAvailable = defaults.replace + permanentBonuses.replace + shopConsumables.replace;
        this.replaceCardConsumable = shopConsumables.replace;

        this.viewNextAvailable = defaults.viewNext + permanentBonuses.viewNext + shopConsumables.viewNext;
        this.viewNextConsumable = shopConsumables.viewNext;
        this.viewNextActive = false;
        this.viewNextUsedOnTurn = null;

        this.undoAvailable = defaults.undo + permanentBonuses.undo + shopConsumables.undo;
        this.undoConsumable = shopConsumables.undo;
        this.undoState = null;

        this.pickCardAvailable = defaults.pickCard + permanentBonuses.pickCard + shopConsumables.pickCard;
        this.pickCardConsumable = shopConsumables.pickCard;

        // FIXED: Ensure doublePoints is always initialized
        this.doublePointsAvailable = (defaults.doublePoints || 0) + (permanentBonuses.doublePoints || 0) + (shopConsumables.doublePoints || 0);
        this.doublePointsConsumable = shopConsumables.doublePoints || 0;
        this.doublePointsActive = false;

        // FIXED: Game mode multipliers
        this.gameModeMultipliers = {
            classic: 1.0,
            nobonus: 1.1,
            blitz: 2.5,
            suddendeath: 3.25,
            chainreaction: 0.75,
            reverserules: 3.75,
            mirrormatch: 1.4,
            subtraction: 1.5,
            timetrials: 1.35,
            ludicrouslylucky: 2.5,
            fogofwar: 1.3,
            territorial: 1.6
        };

        // NEW: AI difficulty multipliers
        this.aiDifficultyMultipliers = {
            0.2: 0.5,   // Novice
            0.3: 0.75,  // Beginner
            0.4: 1.0,   // Intermediate
            0.5: 1.1,   // Skilled
            0.6: 1.2,   // Advanced
            0.7: 1.3,   // Expert
            0.8: 1.4,   // Pro
            0.9: 1.5    // Master
        };

        // NEW: Restrictions system
        this.restrictions = this.loadRestrictions();
        this.restrictionMultipliers = {
            noBonus: 1.2,           // No bonus points at end = 1.2x pts
            aiFirst: 1.05,          // AI goes first = 1.05x pts
            maintainedPaths: 0.75,  // Full grid connections = 0.75x pts
            singlePath: 1.3,        // Single winding path = 1.3x pts
            scummySequences: 1.5,   // Only sequences score = 1.5x pts
            gloriousZeros: 0.75,    // Zero pairs give 10 pts = 0.75x pts
            survival: 1.2,          // Survival mode = 1.2x pts
            aiVsAi: 0               // Will be calculated based on player AI difficulty
        };
        
        // AI vs AI player AI difficulty (for when player is also AI)
        this.playerAiDifficulty = this.loadPlayerAiDifficulty();
        
        // AI vs AI control state
        this.aiVsAiStarted = false;
        this.aiVsAiPaused = false;

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
    
    loadPlayerAiDifficulty() {
        const saved = localStorage.getItem('playerAiDifficulty');
        return saved ? parseFloat(saved) : 0.2; // Default to Novice
    }
    
    savePlayerAiDifficulty() {
        localStorage.setItem('playerAiDifficulty', this.playerAiDifficulty.toString());
    }
    
    getPlayerAiMultiplier() {
        // Returns multiplier based on player AI difficulty
        // Novice = 2x, Beginner = 1.5x, Intermediate = 1x, Skilled = 0.5x, rest = 0x
        const multipliers = {
            0.2: 2.0,   // Novice
            0.3: 1.5,   // Beginner
            0.4: 1.0,   // Intermediate
            0.5: 0.5,   // Skilled
            0.6: 0,     // Advanced
            0.7: 0,     // Expert
            0.8: 0,     // Pro
            0.9: 0      // Master
        };
        return multipliers[this.playerAiDifficulty] || 0;
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

    // NEW: Restrictions system
    loadRestrictions() {
        const saved = localStorage.getItem('restrictions');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure all restriction keys exist
                return {
                    noBonus: parsed.noBonus || false,
                    aiFirst: parsed.aiFirst || false,
                    maintainedPaths: parsed.maintainedPaths || false,
                    singlePath: parsed.singlePath || false,
                    scummySequences: parsed.scummySequences || false,
                    gloriousZeros: parsed.gloriousZeros || false,
                    survival: parsed.survival || false,
                    aiVsAi: parsed.aiVsAi || false
                };
            } catch (e) {
                console.warn('Corrupted restrictions, resetting...');
                localStorage.removeItem('restrictions');
            }
        }
        return {
            noBonus: false,
            aiFirst: false,
            maintainedPaths: false,
            singlePath: false,
            scummySequences: false,
            gloriousZeros: false,
            survival: false,
            aiVsAi: false
        };
    }

    saveRestrictions() {
        localStorage.setItem('restrictions', JSON.stringify(this.restrictions));
    }

    toggleRestriction(restriction, enabled) {
        SoundEffects.playButton();
        
        // Check if player owns this restriction (purchased from shop)
        if (enabled && !this.shop.owned.restrictions.includes(restriction)) {
            this.showMessage(`You need to buy this restriction from the shop first!`);
            this.updateRestrictionsUI();
            return;
        }
        
        // Prevent conflicting path restrictions
        if (enabled) {
            if (restriction === 'maintainedPaths' && this.restrictions.singlePath) {
                this.showMessage(`Can't enable Maintained Paths while Single Path is active!`);
                this.updateRestrictionsUI();
                return;
            }
            if (restriction === 'singlePath' && this.restrictions.maintainedPaths) {
                this.showMessage(`Can't enable Single Path while Maintained Paths is active!`);
                this.updateRestrictionsUI();
                return;
            }
        }
        
        this.restrictions[restriction] = enabled;
        this.saveRestrictions();
        this.updateMultiplierDisplay();
        this.updateRestrictionsUI();
        this.updateSettingsUI(); // Update settings to show/hide AI vs AI controls
        
        // Show message about the restriction
        if (enabled) {
            const names = {
                noBonus: 'No Bonus Points',
                aiFirst: 'AI First',
                maintainedPaths: 'Maintained Paths',
                survival: 'Survival Mode',
                singlePath: 'Single Path',
                scummySequences: 'Scummy Sequences',
                gloriousZeros: 'Glorious Zeros',
                aiVsAi: 'AI vs AI'
            };
            const multipliers = {
                noBonus: '1.2x',
                aiFirst: '1.05x',
                maintainedPaths: '0.75x',
                survival: '1.2x',
                singlePath: '1.3x',
                scummySequences: '1.5x',
                gloriousZeros: '0.75x',
                aiVsAi: `${this.getPlayerAiMultiplier()}x`
            };
            this.showMessage(`${names[restriction]} restriction enabled! (${multipliers[restriction]} pts) Starting new game...`);
        } else {
            this.showMessage(`Restriction disabled! Starting new game...`);
        }
        
        // Reset the game when restrictions change (like game modes and board sizes)
        setTimeout(() => {
            this.newGame();
        }, 500);
    }

    updateRestrictionsUI() {
        const noBonusCheck = document.getElementById('restrictionNoBonus');
        const aiFirstCheck = document.getElementById('restrictionAIFirst');
        const maintainedPathsCheck = document.getElementById('restrictionMaintainedPaths');
        const survivalCheck = document.getElementById('restrictionSurvival');
        const singlePathCheck = document.getElementById('restrictionSinglePath');
        const scummySequencesCheck = document.getElementById('restrictionScummySequences');
        const gloriousZerosCheck = document.getElementById('restrictionGloriousZeros');
        const aiVsAiCheck = document.getElementById('restrictionAiVsAi');
        const restrictionsSection = document.getElementById('restrictionsSettingsSection');
        
        const ownedRestrictions = this.shop.owned.restrictions || [];
        
        // Set checkbox states
        if (noBonusCheck) noBonusCheck.checked = this.restrictions.noBonus;
        if (aiFirstCheck) aiFirstCheck.checked = this.restrictions.aiFirst;
        if (maintainedPathsCheck) maintainedPathsCheck.checked = this.restrictions.maintainedPaths;
        if (survivalCheck) survivalCheck.checked = this.restrictions.survival;
        if (singlePathCheck) singlePathCheck.checked = this.restrictions.singlePath;
        if (scummySequencesCheck) scummySequencesCheck.checked = this.restrictions.scummySequences;
        if (gloriousZerosCheck) gloriousZerosCheck.checked = this.restrictions.gloriousZeros;
        if (aiVsAiCheck) aiVsAiCheck.checked = this.restrictions.aiVsAi;
        
        // Show/hide individual restriction options based on ownership
        const noBonusOption = noBonusCheck ? noBonusCheck.closest('.restriction-option') : null;
        const aiFirstOption = aiFirstCheck ? aiFirstCheck.closest('.restriction-option') : null;
        const maintainedPathsOption = maintainedPathsCheck ? maintainedPathsCheck.closest('.restriction-option') : null;
        const survivalOption = survivalCheck ? survivalCheck.closest('.restriction-option') : null;
        const singlePathOption = singlePathCheck ? singlePathCheck.closest('.restriction-option') : null;
        const scummySequencesOption = scummySequencesCheck ? scummySequencesCheck.closest('.restriction-option') : null;
        const gloriousZerosOption = gloriousZerosCheck ? gloriousZerosCheck.closest('.restriction-option') : null;
        const aiVsAiOption = aiVsAiCheck ? aiVsAiCheck.closest('.restriction-option') : null;
        
        if (noBonusOption) noBonusOption.style.display = ownedRestrictions.includes('noBonus') ? 'flex' : 'none';
        if (aiFirstOption) aiFirstOption.style.display = ownedRestrictions.includes('aiFirst') ? 'flex' : 'none';
        if (maintainedPathsOption) maintainedPathsOption.style.display = ownedRestrictions.includes('maintainedPaths') ? 'flex' : 'none';
        if (survivalOption) survivalOption.style.display = ownedRestrictions.includes('survival') ? 'flex' : 'none';
        if (singlePathOption) singlePathOption.style.display = ownedRestrictions.includes('singlePath') ? 'flex' : 'none';
        if (scummySequencesOption) scummySequencesOption.style.display = ownedRestrictions.includes('scummySequences') ? 'flex' : 'none';
        if (gloriousZerosOption) gloriousZerosOption.style.display = ownedRestrictions.includes('gloriousZeros') ? 'flex' : 'none';
        if (aiVsAiOption) aiVsAiOption.style.display = ownedRestrictions.includes('aiVsAi') ? 'flex' : 'none';
        
        // Show/hide Player AI Difficulty dropdown based on AI vs AI restriction
        const playerAiSection = document.getElementById('playerAiDifficultySection');
        if (playerAiSection) {
            playerAiSection.style.display = this.restrictions.aiVsAi ? 'block' : 'none';
        }
        
        // Show/hide restrictions section based on whether any are owned
        if (restrictionsSection) {
            const hasAnyRestriction = ownedRestrictions.length > 0;
            restrictionsSection.style.display = hasAnyRestriction ? 'block' : 'none';
        }
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
                        modes: ['classic'],
                        themes: ['default', 'dark', 'nature', 'sunset', 'ocean'],
                        icons: ['default'],
                        aiLevels: ['0.4', '0.5', '0.6']
                    };
                }
                // Ensure aiLevels exists
                if (!shopData.owned.aiLevels) {
                    shopData.owned.aiLevels = ['0.4', '0.5', '0.6'];
                }
                // Ensure restrictions array exists
                if (!shopData.owned.restrictions) {
                    shopData.owned.restrictions = [];
                }
                // FIXED: Ensure permanentPowerups exists
                if (!shopData.owned.permanentPowerups) {
                    shopData.owned.permanentPowerups = {
                        skipAI: 0,
                        replace: 0,
                        viewNext: 0,
                        undo: 0,
                        pickCard: 0,
                        doublePoints: 0
                    }
                } else {
                    // Ensure doublePoints exists in existing permanentPowerups
                    if (shopData.owned.permanentPowerups.doublePoints === undefined) {
                        shopData.owned.permanentPowerups.doublePoints = 0;
                    }
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
                modes: ['classic'],
                themes: ['default', 'dark', 'nature', 'sunset', 'ocean'],
                icons: ['default'],
                aiLevels: ['0.4', '0.5', '0.6'],
                restrictions: [],
                permanentPowerups: {
                    skipAI: 0,
                    replace: 0,
                    viewNext: 0,
                    undo: 0,
                    pickCard: 0,
                    doublePoints: 0
                },
                baseMultiplier: 0 // NEW: Base pts multiplier levels
            }
        };
        
        this.saveShop(shopData);
        
        return shopData;
    }
    loadPowerupState() {
        const saved = localStorage.getItem('powerupState');
        const defaultAmounts = {
            skipAI: 1,
            replace: 3,
            viewNext: 1,
            undo: 1,
            pickCard: 0,
            doublePoints: 0
        };
        
        // Get permanent bonuses
        const permanentBonuses = this.shop.owned.permanentPowerups || {
            skipAI: 0,
            replace: 0,
            viewNext: 0,
            undo: 0,
            pickCard: 0,
            doublePoints: 0
        };
        
        if (saved) {
            try {
                const powerups = JSON.parse(saved);
                
                // Ensure each powerup is at least the default + permanent amount
                const result = {};
                for (const key in defaultAmounts) {
                    const minAmount = defaultAmounts[key] + (permanentBonuses[key] || 0);
                    result[key] = Math.max(powerups[key] || 0, minAmount);
                }
                
                return result;
            } catch (e) {
                console.warn('Corrupted powerup state, resetting...');
                localStorage.removeItem('powerupState');
            }
        }
        
        // Return defaults + permanent bonuses
        const result = {};
        for (const key in defaultAmounts) {
            result[key] = defaultAmounts[key] + (permanentBonuses[key] || 0);
        }
        
        return result;
    }
    loadShopConsumables() {
        const saved = localStorage.getItem('shopConsumables');
        if (saved) {
            try {
                const consumables = JSON.parse(saved);
                // FIXED: Ensure all properties exist with default values
                return {
                    skipAI: consumables.skipAI || 0,
                    replace: consumables.replace || 0,
                    viewNext: consumables.viewNext || 0,
                    undo: consumables.undo || 0,
                    pickCard: consumables.pickCard || 0,
                    doublePoints: consumables.doublePoints || 0
                };
            } catch (e) {
                console.warn('Corrupted shop consumables, resetting...');
                localStorage.removeItem('shopConsumables');
            }
        }
        
        return {
            skipAI: 0,
            replace: 0,
            viewNext: 0,
            undo: 0,
            pickCard: 0,
            doublePoints: 0
        };
    }

    saveShopConsumables() {
        const consumables = {
            skipAI: this.skipAIConsumable,
            replace: this.replaceCardConsumable,
            viewNext: this.viewNextConsumable,
            undo: this.undoConsumable,
            pickCard: this.pickCardConsumable,
            doublePoints: this.doublePointsConsumable
        };
        localStorage.setItem('shopConsumables', JSON.stringify(consumables));
    }

    useConsumablePowerup(type) {
        // Check if we have shop consumables first, otherwise use default/permanent
        const consumableKey = type + 'Consumable';
        if (this[consumableKey] > 0) {
            this[consumableKey]--;
            this.saveShopConsumables();
            return true;
        }
        return true; // Still allow using default/permanent
    }

    savePowerupState() {
        const powerups = {
            skipAI: this.skipAIAvailable,
            replace: this.replaceCardAvailable,
            viewNext: this.viewNextAvailable,
            undo: this.undoAvailable,
            pickCard: this.pickCardAvailable,
            doublePoints: this.doublePointsAvailable
        };
        localStorage.setItem('powerupState', JSON.stringify(powerups));
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
        // Ensure shop points are displayed accurately from the shop object
        document.getElementById('shopPointsStat').textContent = formatPoints(this.shop.points);
        
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
            const isSmallScreen = window.innerWidth < 768;
            const boardSizes = [
                { value: '3', label: '3x3 (Quick)' },
                { value: '4', label: '4x4 (Fast)' },
                { value: '5', label: '5x5 (Classic)' },
                { value: '6', label: '6x6 (Extended)' },
                { value: '7', label: '7x7 (Epic)' },
                { value: '8', label: '8x8 (Massive)' },
                { value: '10', label: '10x10 (Colossal)', warning: isSmallScreen }
            ];
            
            boardSizes.forEach(size => {
                if (this.shop.owned.boards && this.shop.owned.boards.includes(size.value)) {
                    const option = document.createElement('option');
                    option.value = size.value;
                    option.textContent = size.warning ? `${size.label} ⚠️` : size.label;
                    option.title = size.warning ? 'Best on larger screens' : '';
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
                { value: 'classic', label: 'Classic', multiplier: 1.0 },
                { value: 'blitz', label: 'Blitz', multiplier: 2.5 },
                { value: 'suddendeath', label: 'Sudden Death', multiplier: 3.25 },
                { value: 'chainreaction', label: 'Chain Reaction', multiplier: 0.75 },
                { value: 'reverserules', label: 'Reverse Rules', multiplier: 3.75 },
                { value: 'mirrormatch', label: 'Mirror Match', multiplier: 1.4 },
                { value: 'subtraction', label: 'Subtraction', multiplier: 1.5 },
                { value: 'timetrials', label: 'Time Trials', multiplier: 1.35 },
                { value: 'ludicrouslylucky', label: 'Ludicrously Lucky', multiplier: 2.5 },
                { value: 'fogofwar', label: 'Fog of War', multiplier: 1.5 },
                { value: 'territorial', label: 'Territorial', multiplier: 1.6 }
            ];
            
            modes.forEach(mode => {
                if (this.shop.owned.modes && this.shop.owned.modes.includes(mode.value)) {
                    const option = document.createElement('option');
                    option.value = mode.value;
                    // FIXED: Only show name and multiplier
                    option.textContent = `${mode.label} (${mode.multiplier}x)`;
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
                { value: '0.2', label: 'Novice', multiplier: 0.5 },
                { value: '0.3', label: 'Beginner', multiplier: 0.75 },
                { value: '0.4', label: 'Intermediate', multiplier: 1.0 },
                { value: '0.5', label: 'Skilled', multiplier: 1.1 },
                { value: '0.6', label: 'Advanced', multiplier: 1.2 },
                { value: '0.7', label: 'Expert', multiplier: 1.3 },
                { value: '0.8', label: 'Pro', multiplier: 1.4 },
                { value: '0.9', label: 'Master', multiplier: 1.5 }
            ];
            
            difficulties.forEach(diff => {
                if (this.shop.owned.aiLevels && this.shop.owned.aiLevels.includes(diff.value)) {
                    const option = document.createElement('option');
                    option.value = diff.value;
                    // FIXED: Consistent format
                    option.textContent = `${diff.label} (${diff.multiplier}x)`;
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
                { name: 'emerald', label: 'Emerald', class: 'emerald' },
                { name: 'meme', label: 'Meme', class: 'meme' },
                { name: 'money', label: 'Money', class: 'money' }
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
                { name: 'default', label: 'Default', display: '0-9', class: '', multiplier: 1.0 },
                { name: 'emoji', label: 'Emoji', display: '1️⃣2️⃣3️⃣', class: '', multiplier: 1.0 },
                { name: 'font', label: 'Font', display: '0-9', class: 'icon-font-preview', multiplier: 1.0 },
                { name: 'moon', label: 'Moon', display: '🌑🌕🌘', class: '', multiplier: 0.9 },
                { name: 'dice', label: 'Dice', display: '⚀⚁⚂', class: '', multiplier: 0.8 },
                { name: 'roman', label: 'Roman', display: 'I-X', class: '', multiplier: 1.15 }
            ];
            
            icons.forEach(icon => {
                if (this.shop.owned.icons && this.shop.owned.icons.includes(icon.name)) {
                    const div = document.createElement('div');
                    div.className = 'icon-option';
                    div.setAttribute('data-icon', icon.name);
                    if (icon.name === this.currentIconPack) {
                        div.classList.add('active');
                    }
                    // FIXED: Add special class for font preview
                    const displayClass = icon.class ? ` class="${icon.class}"` : '';
                    // Show multiplier if not 1.0
                    let multiplierHtml = '';
                    if (icon.multiplier < 1.0) {
                        multiplierHtml = `<div class="icon-multiplier" style="color: #f44336; font-size: 0.35em;">×${icon.multiplier}</div>`;
                    } else if (icon.multiplier > 1.0) {
                        multiplierHtml = `<div class="icon-multiplier" style="color: #4caf50; font-size: 0.35em;">×${icon.multiplier}</div>`;
                    }
                    div.innerHTML = `<div${displayClass}>${icon.display}</div><div class="icon-name">${icon.label}</div>${multiplierHtml}`;
                    div.onclick = () => changeIconPack(icon.name);
                    iconSelector.appendChild(div);
                }
            });
        }
        
        // Update restrictions checkboxes
        this.updateRestrictionsUI();
        
        // Update player AI difficulty dropdown value
        const playerAiSelect = document.getElementById('playerAiDifficultySelect');
        if (playerAiSelect) {
            playerAiSelect.value = this.playerAiDifficulty.toString();
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
        this.updateMultiplierDisplay();
        
        // Reset the game when AI difficulty changes
        this.showMessage(`AI difficulty changed! Starting new game...`);
        setTimeout(() => {
            this.newGame();
        }, 500);
    }
    
    changePlayerAiDifficulty(value) {
        SoundEffects.playButton();
        this.playerAiDifficulty = value;
        this.savePlayerAiDifficulty();
        this.updateMultiplierDisplay();
        this.showMessage(`Your AI difficulty changed to ${this.getPlayerAiDifficultyName()}! (${this.getPlayerAiMultiplier()}x pts)`);
        setTimeout(() => {
            this.newGame();
        }, 500);
    }
    
    getPlayerAiDifficultyName() {
        const names = {
            0.2: 'Novice',
            0.3: 'Beginner',
            0.4: 'Intermediate',
            0.5: 'Skilled',
            0.6: 'Advanced',
            0.7: 'Expert',
            0.8: 'Pro',
            0.9: 'Master'
        };
        return names[this.playerAiDifficulty] || 'Unknown';
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
        this.updateMultiplierDisplay();
        closeSettings();
        this.showMessage(`Game mode changed to ${value}! Starting new game...`);
        setTimeout(() => {
            this.newGame();
        }, 500);
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
            this.restrictions.survival || !this.undoState) {
            return;
        }
        
        this.undoAvailable--;
        this.useConsumablePowerup('undo'); // FIXED
        
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
            this.useConsumablePowerup('pickCard'); // FIXED
            
            const maxNum = IconPackMaxNumbers[this.currentIconPack] || 10;
            
            let selectedCard = null;
            let validInput = false;
            
            while (!validInput) {
                const input = prompt(`Pick any card (0-${maxNum - 1}):`);
                
                if (input === null) {
                    this.pickCardAvailable++;
                    this.pickCardConsumable++;
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
    useDoublePoints() {
        if (this.doublePointsAvailable > 0 && this.isPlayerTurn && !this.gameEnded && 
            this.gameMode !== 'survival' && !this.doublePointsActive) {
            this.doublePointsAvailable--;
            this.doublePointsConsumable--; // Disable until game ends
            this.useConsumablePowerup('doublePoints');
            this.doublePointsActive = true;
            
            this.showMessage("💎 DOUBLE PTS activated for this game!");
            SoundEffects.playPowerup();
            this.updatePowerupDisplay();
            this.updateMultiplierDisplay();
            
            // FIXED: Update indicator text
            const playerScoreCard = document.querySelector('.score-card.player');
            const indicator = document.createElement('div');
            indicator.className = 'double-points-indicator';
            indicator.textContent = '💎 Shop 2X';
            indicator.title = 'Double pts for this game!';
            playerScoreCard.appendChild(indicator);
        }
    }

    useViewNext() {
        if (this.viewNextAvailable > 0 && !this.gameEnded && this.gameMode !== 'survival' && this.playerDeck.length > 0 && this.isPlayerTurn) {
            this.viewNextAvailable--;
            this.viewNextConsumable--; // Disable until round ends
            this.useConsumablePowerup('viewNext'); // FIXED
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
            this.skipAIConsumable--; // Disable until round ends
            this.useConsumablePowerup('skipAI'); // FIXED
            this.skipAIUsed = true;
            this.updatePowerupDisplay();
            this.showMessage("⏭️ AI's next turn will be skipped!");
            SoundEffects.playPowerup();
        }
    }

    useReplaceCard() {
        if (this.replaceCardAvailable > 0 && this.isPlayerTurn && !this.gameEnded && this.currentPlayerCard !== null && this.gameMode !== 'survival') {
            this.replaceCardAvailable--;
            this.useConsumablePowerup('replace'); // FIXED
            
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
        this.updatePowerupDisplay(); // FIXED: Ensure this is called
        this.updateMultiplierDisplay();
        
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
        } else if (this.gameMode === 'subtraction') {
            this.showMessage('SUBTRACTION: Claiming tiles subtracts opponent points! ➖');
        } else if (this.gameMode === 'timetrials') {
            this.showMessage('TIME TRIALS: 10 second turns, decreasing by 0.1s each turn! ⏱️');
        } else if (this.gameMode === 'ludicrouslylucky') {
            this.showMessage('LUDICROUSLY LUCKY: Game could end any turn after turn 3! 🎲');
        } else if (this.gameMode === 'fogofwar') {
            this.showMessage('FOG OF WAR: Only see cards you placed and adjacent cells! 🌫️');
        } else if (this.gameMode === 'territorial') {
            this.showMessage('TERRITORIAL: Claim tiles for points - most tiles wins! 🏰');
        }
        
        // NEW: Show restriction messages
        let restrictionMsgs = [];
        if (this.restrictions.noBonus) restrictionMsgs.push('No Bonus');
        if (this.restrictions.aiFirst) restrictionMsgs.push('AI First');
        if (this.restrictions.maintainedPaths) restrictionMsgs.push('Full Grid');
        if (this.restrictions.singlePath) restrictionMsgs.push('Single Path');
        if (this.restrictions.scummySequences) restrictionMsgs.push('Sequences Only');
        if (this.restrictions.gloriousZeros) restrictionMsgs.push('0+0=10pts');
        if (restrictionMsgs.length > 0) {
            setTimeout(() => {
                this.showMessage(`🔒 Restrictions: ${restrictionMsgs.join(', ')}`);
            }, 1500);
        }
        
        // Initialize Time Trials timer if needed
        if (this.gameMode === 'timetrials') {
            this.timeTrialsRemaining = 10.0;
            this.timeTrialsInterval = null;
            this.timeTrialsTurnCount = 0;
        }
        
        // Initialize Fog of War visibility
        if (this.gameMode === 'fogofwar') {
            this.visibleCells = new Set();
        }
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.drawConnectionLines();
                
                // NEW: If AI First restriction is enabled, AI goes first
                if (this.restrictions.aiFirst && !this.gameEnded) {
                    this.isPlayerTurn = false;
                    this.disablePlayerInput();
                    setTimeout(() => {
                        this.aiTurn();
                    }, 500);
                }
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
        
        // NEW: Handle custom level paths from level editor
        if (this.customLevelLoaded && this.customPaths !== undefined) {
            // If custom paths exist, build connections from them
            if (this.customPaths.length > 0) {
                // Build connections from custom paths (format: "row1,col1-row2,col2")
                for (const pathStr of this.customPaths) {
                    const parts = pathStr.split('-');
                    if (parts.length !== 2) continue;
                    
                    const [r1, c1] = parts[0].split(',').map(Number);
                    const [r2, c2] = parts[1].split(',').map(Number);
                    
                    // Convert row,col to cell index
                    const from = r1 * this.gridSize + c1;
                    const to = r2 * this.gridSize + c2;
                    
                    // Validate cells are within bounds
                    if (from >= 0 && from < this.totalCells && to >= 0 && to < this.totalCells) {
                        // Check if connection already exists
                        if (!adjacencyList.get(from).includes(to)) {
                            this.connections.push({ from: from, to: to });
                            adjacencyList.get(from).push(to);
                            adjacencyList.get(to).push(from);
                        }
                    }
                }
            }
            // If customPaths is empty array, leave connections empty (no paths)
            // Reset custom level flag after applying paths
            this.customLevelLoaded = false;
            this.customPaths = [];
            return;
        }
        
        // NEW: Single Path restriction - create a single winding path through all cells
        if (this.restrictions.singlePath) {
            this.generateSinglePath(adjacencyList);
            return;
        }

        // NEW: If maintainedPaths restriction is enabled, create full grid connections
        if (this.restrictions.maintainedPaths) {
            for (let i = 0; i < this.totalCells; i++) {
                const row = Math.floor(i / this.gridSize);
                const col = i % this.gridSize;

                // Connect to right neighbor
                if (col < this.gridSize - 1) {
                    const right = i + 1;
                    this.connections.push({ from: i, to: right });
                    adjacencyList.get(i).push(right);
                    adjacencyList.get(right).push(i);
                }

                // Connect to bottom neighbor
                if (row < this.gridSize - 1) {
                    const bottom = i + this.gridSize;
                    this.connections.push({ from: i, to: bottom });
                    adjacencyList.get(i).push(bottom);
                    adjacencyList.get(bottom).push(i);
                }
            }
            return; // Skip random connection generation
        }

        // Normal random connection generation
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
    
    // Generate a single winding path through all cells (Hamiltonian path)
    generateSinglePath(adjacencyList) {
        const visited = new Set();
        const path = [];
        
        // Start from a random corner for variety
        const corners = [0, this.gridSize - 1, this.totalCells - this.gridSize, this.totalCells - 1];
        let current = corners[Math.floor(Math.random() * corners.length)];
        
        visited.add(current);
        path.push(current);
        
        // Try to visit all cells using backtracking
        const stack = [{ cell: current, neighbors: this.getShuffledNeighbors(current) }];
        
        while (path.length < this.totalCells && stack.length > 0) {
            const top = stack[stack.length - 1];
            
            // Find unvisited neighbor
            let foundNext = false;
            while (top.neighbors.length > 0) {
                const next = top.neighbors.pop();
                if (!visited.has(next)) {
                    visited.add(next);
                    path.push(next);
                    stack.push({ cell: next, neighbors: this.getShuffledNeighbors(next) });
                    foundNext = true;
                    break;
                }
            }
            
            // Backtrack if no unvisited neighbors
            if (!foundNext) {
                stack.pop();
                // Also remove the cell from path and visited so it can be revisited from a different direction
                if (path.length > 1) {
                    const removed = path.pop();
                    visited.delete(removed);
                }
            }
        }
        
        // If we couldn't visit all cells, use a simpler snake pattern
        if (path.length < this.totalCells) {
            path.length = 0;
            for (let row = 0; row < this.gridSize; row++) {
                if (row % 2 === 0) {
                    for (let col = 0; col < this.gridSize; col++) {
                        path.push(row * this.gridSize + col);
                    }
                } else {
                    for (let col = this.gridSize - 1; col >= 0; col--) {
                        path.push(row * this.gridSize + col);
                    }
                }
            }
        }
        
        // Create connections along the path - only between orthogonally adjacent cells
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            
            // Verify these cells are actually orthogonally adjacent (not diagonal)
            const fromRow = Math.floor(from / this.gridSize);
            const fromCol = from % this.gridSize;
            const toRow = Math.floor(to / this.gridSize);
            const toCol = to % this.gridSize;
            const rowDiff = Math.abs(fromRow - toRow);
            const colDiff = Math.abs(fromCol - toCol);
            
            // Only add connection if cells are orthogonally adjacent (not diagonal)
            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                this.connections.push({ from, to });
                adjacencyList.get(from).push(to);
                adjacencyList.get(to).push(from);
            }
        }
    }
    
    getShuffledNeighbors(index) {
        const neighbors = this.getPotentialNeighbors(index);
        // Fisher-Yates shuffle
        for (let i = neighbors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
        }
        return neighbors;
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
        
        // AI vs AI mode: Show controls and wait for start/pause
        if (this.restrictions.aiVsAi && !this.gameEnded && this.currentPlayerCard !== null) {
            this.disablePlayerInput();
            
            // Show AI vs AI controls
            const controls = document.getElementById('aiVsAiControls');
            if (controls) {
                controls.style.display = 'block';
            }
            
            // If game hasn't started yet, wait for user to press start
            if (!this.aiVsAiStarted) {
                this.showMessage('🤖 Press Start to begin the AI Battle!');
                return;
            }
            
            // If paused, don't continue
            if (this.aiVsAiPaused) {
                this.showMessage('⏸️ AI Battle paused. Press Play to continue.');
                return;
            }
            
            setTimeout(() => {
                this.playerAiTurn();
            }, 800);
            return;
        }
        
        // Time Trials mode: Start the countdown timer (skip first turn)
        if (this.gameMode === 'timetrials' && !this.gameEnded) {
            this.timeTrialsTurnCount++;
            if (this.timeTrialsTurnCount > 1) {
                this.startTimeTrialsTimer();
            }
        }
    }
    
    toggleAiVsAi() {
        SoundEffects.playButton();
        const btn = document.getElementById('aiVsAiStartBtn');
        
        if (!this.aiVsAiStarted) {
            // First press: Start the battle
            this.aiVsAiStarted = true;
            this.aiVsAiPaused = false;
            btn.innerHTML = '⏸️ Pause Battle';
            btn.classList.add('playing');
            this.showMessage('🤖 AI Battle started!');
            
            // Start the player AI turn
            setTimeout(() => {
                this.playerAiTurn();
            }, 500);
        } else if (!this.aiVsAiPaused) {
            // Currently playing: Pause
            this.aiVsAiPaused = true;
            btn.innerHTML = '▶️ Resume Battle';
            btn.classList.remove('playing');
            this.showMessage('⏸️ AI Battle paused.');
        } else {
            // Currently paused: Resume
            this.aiVsAiPaused = false;
            btn.innerHTML = '⏸️ Pause Battle';
            btn.classList.add('playing');
            this.showMessage('▶️ AI Battle resumed!');
            
            // Resume the battle
            if (this.isPlayerTurn && this.currentPlayerCard !== null && !this.gameEnded) {
                setTimeout(() => {
                    this.playerAiTurn();
                }, 500);
            } else if (!this.isPlayerTurn && !this.gameEnded) {
                setTimeout(() => {
                    this.aiTurn();
                }, 500);
            }
        }
    }

    disablePlayerInput() {
        document.getElementById('playerHandArea').classList.add('disabled');
        this.updatePowerupDisplay();
        
        // Time Trials mode: Stop timer (don't decrease time here - do it in stopTimeTrialsTimer)
        if (this.gameMode === 'timetrials') {
            this.stopTimeTrialsTimer();
        }
    }
    
    startTimeTrialsTimer() {
        // Clear any existing timer
        if (this.timeTrialsInterval) {
            clearInterval(this.timeTrialsInterval);
        }
        
        let timerDisplay = document.getElementById('timeTrialsTimer');
        if (!timerDisplay) {
            // Create timer display if it doesn't exist
            const container = document.getElementById('playerHandArea');
            if (container) {
                const timer = document.createElement('div');
                timer.id = 'timeTrialsTimer';
                timer.className = 'testing-time-timer';
                timer.textContent = this.timeTrialsRemaining.toFixed(1) + 's';
                container.prepend(timer);
                timerDisplay = timer;
            }
        } else {
            timerDisplay.textContent = this.timeTrialsRemaining.toFixed(1) + 's';
            timerDisplay.classList.remove('danger');
        }
        
        // Make sure timer is visible
        if (timerDisplay) {
            timerDisplay.style.display = 'block';
        }
        
        let timeLeft = this.timeTrialsRemaining;
        
        // Helper to check if any menu is open
        const isMenuOpen = () => {
            const modals = ['settingsModal', 'statsModal', 'shopModal', 'powerupsModal', 'gamblingModal'];
            return modals.some(id => {
                const modal = document.getElementById(id);
                return modal && modal.classList.contains('show');
            });
        };
        
        this.timeTrialsInterval = setInterval(() => {
            // Slow down by 10x when menus are open
            const decrement = isMenuOpen() ? 0.01 : 0.1;
            timeLeft -= decrement;
            const display = document.getElementById('timeTrialsTimer');
            
            if (display) {
                display.textContent = Math.max(0, timeLeft).toFixed(1) + 's';
                if (timeLeft <= 3) {
                    display.classList.add('danger');
                }
            }
            
            if (timeLeft <= 0) {
                this.stopTimeTrialsTimer();
                // Time ran out - place card randomly or skip turn
                if (this.currentPlayerCard !== null && !this.gameEnded) {
                    this.showMessage('⏰ Time ran out! Random placement! ⏰');
                    const emptyCells = [];
                    this.mapState.forEach((cell, index) => {
                        if (cell === null) emptyCells.push(index);
                    });
                    if (emptyCells.length > 0) {
                        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];  
                        this.playCard(randomCell);
                    }
                }
            }
        }, 100);
    }
    
    stopTimeTrialsTimer() {
        if (this.timeTrialsInterval) {
            clearInterval(this.timeTrialsInterval);
            this.timeTrialsInterval = null;
        }
        
        // Hide timer when it's not player's turn (in Time Trials mode)
        const display = document.getElementById('timeTrialsTimer');
        if (display && this.gameMode === 'timetrials') {
            display.style.display = 'none';
        }
        
        // Decrease time for next turn (minimum 2 seconds)
        this.timeTrialsRemaining = Math.max(2.0, this.timeTrialsRemaining - 0.1);
    }

    updatePowerupDisplay() {
        const skipBtn = document.getElementById('skipAiBtn');
        const replaceBtn = document.getElementById('replaceCardBtn');
        const viewNextBtn = document.getElementById('viewNextBtn');
        const undoBtn = document.getElementById('undoBtn');
        const pickCardBtn = document.getElementById('pickCardBtn');
        const doublePointsBtn = document.getElementById('doublePointsBtn');
        
        // FIXED: Ensure all counts are valid numbers
        document.getElementById('skipAiCount').textContent = this.skipAIAvailable || 0;
        document.getElementById('replaceCardCount').textContent = this.replaceCardAvailable || 0;
        document.getElementById('viewNextCount').textContent = this.viewNextAvailable || 0;
        document.getElementById('undoCount').textContent = this.undoAvailable || 0;
        document.getElementById('pickCardCount').textContent = this.pickCardAvailable || 0;
        document.getElementById('doublePointsCount').textContent = this.doublePointsAvailable || 0; // FIXED
        
        const isSurvival = this.restrictions.survival;
        const isBlitz = this.gameMode === 'blitz';
        
        if (skipBtn) skipBtn.disabled = this.skipAIAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || isBlitz;
        if (replaceBtn) replaceBtn.disabled = this.replaceCardAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival;
        if (viewNextBtn) viewNextBtn.disabled = this.viewNextAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || this.playerDeck.length === 0;
        if (undoBtn) undoBtn.disabled = this.undoAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || !this.undoState;
        if (pickCardBtn) pickCardBtn.disabled = this.pickCardAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival;
        if (doublePointsBtn) doublePointsBtn.disabled = this.doublePointsAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || this.doublePointsActive; // FIXED
    }
    updateMultiplierDisplay() {
        const gameModeMultiplier = this.gameModeMultipliers[this.gameMode] || 1.0;
        const aiDifficultyMultiplier = this.aiDifficultyMultipliers[this.aiDifficulty] || 1.0;
        const doublePointsMultiplier = this.doublePointsActive ? 1.0 : 0; // Changed from 2.0 to 1.0
        const baseMultiplierBonus = (this.shop.owned.baseMultiplier || 0) * 0.1;
        const iconPackMultiplier = IconPackMultipliers[this.currentIconPack] || 1.0;
        
        // Calculate restriction multipliers (all 8 restrictions)
        let restrictionBonus = 0;
        if (this.restrictions.noBonus) restrictionBonus += (this.restrictionMultipliers.noBonus - 1.0);
        if (this.restrictions.aiFirst) restrictionBonus += (this.restrictionMultipliers.aiFirst - 1.0);
        if (this.restrictions.maintainedPaths) restrictionBonus += (this.restrictionMultipliers.maintainedPaths - 1.0);
        if (this.restrictions.survival) restrictionBonus += (this.restrictionMultipliers.survival - 1.0);
        if (this.restrictions.singlePath) restrictionBonus += (this.restrictionMultipliers.singlePath - 1.0);
        if (this.restrictions.scummySequences) restrictionBonus += (this.restrictionMultipliers.scummySequences - 1.0);
        if (this.restrictions.gloriousZeros) restrictionBonus += (this.restrictionMultipliers.gloriousZeros - 1.0);
        if (this.restrictions.aiVsAi) restrictionBonus += (this.getPlayerAiMultiplier() - 1.0);
        
        // Add all multipliers together, then multiply by icon pack multiplier
        const baseTotal = (gameModeMultiplier - 1.0) + (aiDifficultyMultiplier - 1.0) + 1.0 + doublePointsMultiplier + baseMultiplierBonus + restrictionBonus;
        let totalMultiplier = baseTotal * iconPackMultiplier;
        
        // Custom levels have 0x multiplier
        if (this.isPlayingCustomLevel) {
            totalMultiplier = 0;
        }
        
        const multiplierElement = document.getElementById('multipliersValue');
        if (multiplierElement) {
            multiplierElement.innerHTML = `${totalMultiplier.toFixed(2)}x <span class="dropdown-arrow">▼</span>`;
            
            // Add visual indicator if multiplier is high
            if (this.isPlayingCustomLevel) {
                multiplierElement.style.color = '#888';
                multiplierElement.style.fontSize = '1em';
            } else if (totalMultiplier >= 8.0) {
                multiplierElement.style.color = '#FF4500';
                multiplierElement.style.fontSize = '1.3em';
            } else if (totalMultiplier >= 5.0) {
                multiplierElement.style.color = '#FF9800';
                multiplierElement.style.fontSize = '1.2em';
            } else if (totalMultiplier >= 3.0) {
                multiplierElement.style.color = '#FFD700';
                multiplierElement.style.fontSize = '1.1em';
            } else {
                multiplierElement.style.color = '#4CAF50';
                multiplierElement.style.fontSize = '1em';
            }
        }
        
        // Update the dropdown breakdown
        this.updateMultiplierBreakdown(gameModeMultiplier, aiDifficultyMultiplier, doublePointsMultiplier, baseMultiplierBonus, restrictionBonus, iconPackMultiplier, totalMultiplier);
    }
    
    updateMultiplierBreakdown(gameModeMultiplier, aiDifficultyMultiplier, doublePointsMultiplier, baseMultiplierBonus, restrictionBonus, iconPackMultiplier, totalMultiplier) {
        const breakdownEl = document.getElementById('multiplierBreakdown');
        if (!breakdownEl) return;
        
        let html = '';
        
        // If playing a custom level, show simplified breakdown
        if (this.isPlayingCustomLevel) {
            html += `<div class="multiplier-item"><span class="multiplier-item-name">📦 Custom Level</span><span class="multiplier-item-value negative">0.00x</span></div>`;
            html += `<div class="multiplier-item" style="font-size: 0.85em; color: #888;"><span class="multiplier-item-name">Custom levels don't earn points</span><span class="multiplier-item-value"></span></div>`;
            html += `<div class="multiplier-item total"><span class="multiplier-item-name">Total</span><span class="multiplier-item-value">0.00x</span></div>`;
            breakdownEl.innerHTML = html;
            return;
        }
        
        // Base
        html += `<div class="multiplier-item"><span class="multiplier-item-name">Base</span><span class="multiplier-item-value">1.00x</span></div>`;
        
        // Game Mode
        const gameModeBonus = gameModeMultiplier - 1.0;
        if (gameModeBonus !== 0) {
            const sign = gameModeBonus >= 0 ? '+' : '';
            const cls = gameModeBonus < 0 ? 'negative' : '';
            html += `<div class="multiplier-item"><span class="multiplier-item-name">Game Mode (${this.gameMode})</span><span class="multiplier-item-value ${cls}">${sign}${gameModeBonus.toFixed(2)}x</span></div>`;
        }
        
        // AI Difficulty
        const aiBonus = aiDifficultyMultiplier - 1.0;
        if (aiBonus !== 0) {
            const sign = aiBonus >= 0 ? '+' : '';
            const cls = aiBonus < 0 ? 'negative' : '';
            html += `<div class="multiplier-item"><span class="multiplier-item-name">AI Difficulty</span><span class="multiplier-item-value ${cls}">${sign}${aiBonus.toFixed(2)}x</span></div>`;
        }
        
        // Base Multiplier upgrades
        if (baseMultiplierBonus > 0) {
            html += `<div class="multiplier-item"><span class="multiplier-item-name">Base Multiplier Upgrade</span><span class="multiplier-item-value">+${baseMultiplierBonus.toFixed(2)}x</span></div>`;
        }
        
        // Double Points
        if (doublePointsMultiplier > 0) {
            html += `<div class="multiplier-item"><span class="multiplier-item-name">💎 Double Points</span><span class="multiplier-item-value">+${doublePointsMultiplier.toFixed(2)}x</span></div>`;
        }
        
        // Individual restrictions
        if (this.restrictions.noBonus) {
            const bonus = this.restrictionMultipliers.noBonus - 1.0;
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 No Bonus</span><span class="multiplier-item-value">+${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.aiFirst) {
            const bonus = this.restrictionMultipliers.aiFirst - 1.0;
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 AI First</span><span class="multiplier-item-value">+${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.maintainedPaths) {
            const bonus = this.restrictionMultipliers.maintainedPaths - 1.0;
            const cls = bonus < 0 ? 'negative' : '';
            const sign = bonus >= 0 ? '+' : '';
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 Maintained Paths</span><span class="multiplier-item-value ${cls}">${sign}${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.survival) {
            const bonus = this.restrictionMultipliers.survival - 1.0;
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 Survival Mode</span><span class="multiplier-item-value">+${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.singlePath) {
            const bonus = this.restrictionMultipliers.singlePath - 1.0;
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 Single Path</span><span class="multiplier-item-value">+${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.scummySequences) {
            const bonus = this.restrictionMultipliers.scummySequences - 1.0;
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 Scummy Sequences</span><span class="multiplier-item-value">+${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.gloriousZeros) {
            const bonus = this.restrictionMultipliers.gloriousZeros - 1.0;
            const cls = bonus < 0 ? 'negative' : '';
            const sign = bonus >= 0 ? '+' : '';
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 Glorious Zeros</span><span class="multiplier-item-value ${cls}">${sign}${bonus.toFixed(2)}x</span></div>`;
        }
        if (this.restrictions.aiVsAi) {
            const bonus = this.getPlayerAiMultiplier() - 1.0;
            const cls = bonus < 0 ? 'negative' : '';
            const sign = bonus >= 0 ? '+' : '';
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🔒 AI vs AI (${this.getPlayerAiDifficultyName()})</span><span class="multiplier-item-value ${cls}">${sign}${bonus.toFixed(2)}x</span></div>`;
        }
        
        // Icon Pack multiplier (if not 1.0 and not a custom level)
        if (iconPackMultiplier !== 1.0 && !this.isPlayingCustomLevel) {
            const cls = iconPackMultiplier < 1.0 ? 'negative' : '';
            html += `<div class="multiplier-item"><span class="multiplier-item-name">🎭 Icon Pack (${this.currentIconPack})</span><span class="multiplier-item-value ${cls}">×${iconPackMultiplier.toFixed(2)}</span></div>`;
        }
        
        // Custom level indicator
        if (this.isPlayingCustomLevel) {
            html += `<div class="multiplier-item"><span class="multiplier-item-name">📦 Custom Level</span><span class="multiplier-item-value negative">0.00x</span></div>`;
        }
        
        // Total
        html += `<div class="multiplier-item total"><span class="multiplier-item-name">Total</span><span class="multiplier-item-value">${totalMultiplier.toFixed(2)}x</span></div>`;
        
        breakdownEl.innerHTML = html;
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
        
        // Fog of War: Player reveals their placed cell and adjacent
        this.revealCell(cellIndex);
        
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
            let basePoints = this.calculatePoints(cellIndex, playedCard, 'player');
            
            // Territorial mode: Don't add points, just update cell ownership count
            if (this.gameMode === 'territorial') {
                // In territorial mode, score = number of cells owned
                const playerCells = this.mapState.filter(cell => cell && cell.owner === 'player').length;
                this.playerScore = playerCells;
                this.updateScore('player');
                
                if (basePoints > 0) {
                    this.showMessage(`🏰 Claimed tile! You own ${playerCells} tile${playerCells !== 1 ? 's' : ''}!`);
                    SoundEffects.playScore();
                } else {
                    this.showMessage(`Tile placed. You own ${playerCells} tile${playerCells !== 1 ? 's' : ''}.`);
                }
                
                this.updateMap();
                
                if (this.shouldGameEnd()) {
                    this.endGame();
                    return;
                }
                
                setTimeout(() => {
                    if (!this.extraTurn) {
                        this.aiTurn();
                    } else {
                        this.extraTurn = false;
                        this.enablePlayerInput();
                        this.showMessage(`Your turn again!`);
                    }
                }, 800);
                return;
            }
            
            if (basePoints > 0) {
                this.playerScore += basePoints;
                this.updateScore('player');
                
                const scoreCard = document.querySelector('.score-card.player');
                const rect = scoreCard.getBoundingClientRect();
                this.createPointsPopup(basePoints, rect.left + rect.width / 2 - 50, rect.top - 50, true);
                
                // FIXED: No special message for double points since it doesn't affect score
                this.showMessage(`🎉 You scored ${basePoints} point${basePoints !== 1 ? 's' : ''}!`);
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
            
            // Ludicrously Lucky: Check for random game end (after turn 3)
            if (this.gameMode === 'ludicrouslylucky' && this.turnCount > 3) {
                // 10% chance to end each turn, increasing by 2% per turn after turn 3
                const endChance = 0.10 + (this.turnCount - 3) * 0.02;
                if (Math.random() < endChance) {
                    this.showMessage('🎲 LUDICROUSLY LUCKY! The game suddenly ends! 🎲');
                    setTimeout(() => this.endGame(), 1500);
                    return;
                }
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
        
        // AI vs AI: Check if paused
        if (this.restrictions.aiVsAi && this.aiVsAiPaused) {
            this.showMessage('⏸️ AI Battle paused. Press Play to continue.');
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
                
                // In Fog of War mode, hide the AI's card number
                const isFogMode = this.gameMode === 'fogofwar';
                const displayCard = isFogMode ? '?' : aiCard;
                
                this.createFloatingCard(
                    displayCard,
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
                    
                    // Territorial mode: Don't add points, just update cell ownership count
                    if (this.gameMode === 'territorial') {
                        const aiCells = this.mapState.filter(cell => cell && cell.owner === 'ai').length;
                        this.aiScore = aiCells;
                        this.updateScore('ai');
                        
                        if (points > 0) {
                            this.showMessage(`🤖 AI claimed tile! AI owns ${aiCells} tile${aiCells !== 1 ? 's' : ''}!`);
                            SoundEffects.playScore();
                        } else {
                            this.showMessage(`🤖 AI placed tile. AI owns ${aiCells} tile${aiCells !== 1 ? 's' : ''}.`);
                        }
                        
                        this.updateMap();
                        
                        if (this.shouldGameEnd()) {
                            this.endGame();
                            return;
                        }
                        
                        setTimeout(() => {
                            this.enablePlayerInput();
                            // Note: Don't call drawNextCard here - card was already drawn in playCard()
                        }, 500);
                        return;
                    }
                    
                    // In Fog of War: reveal cells that AI claimed (changed to red)
                    if (this.gameMode === 'fogofwar' && points > 0) {
                        // Reveal the cell AI played and any cells it converted
                        this.revealCell(bestMove);
                    }
                    
                    if (points > 0) {
                        this.aiScore += points;
                        this.updateScore('ai');
                        
                        const scoreCard = document.querySelector('.score-card.ai');
                        const rect = scoreCard.getBoundingClientRect();
                        this.createPointsPopup(points, rect.left + rect.width / 2 - 50, rect.top - 50, false);
                        
                        // In Fog of War, hide the exact points from player
                        if (this.gameMode === 'fogofwar') {
                            this.showMessage(`🤖 AI scored somewhere in the fog!`);
                        } else {
                            this.showMessage(`🤖 AI scored ${points} point${points !== 1 ? 's' : ''}!`);
                        }
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
                        if (this.gameMode === 'fogofwar') {
                            this.showMessage(`🤖 AI played somewhere in the fog...`);
                        } else {
                            this.showMessage(`AI played but scored no points.`);
                        }
                    }
                    
                    // FIXED: Force update map to apply owner colors
                    this.updateMap();
                    
                    setTimeout(() => {
                        if (this.shouldGameEnd()) {
                            this.endGame();
                            return;
                        }
                        
                        // Ludicrously Lucky: Check for random game end after AI turn
                        if (this.gameMode === 'ludicrouslylucky' && this.turnCount > 3) {
                            const endChance = 0.10 + (this.turnCount - 3) * 0.02;
                            if (Math.random() < endChance) {
                                this.showMessage('🎲 LUDICROUSLY LUCKY! The game suddenly ends! 🎲');
                                setTimeout(() => this.endGame(), 1500);
                                return;
                            }
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

    // AI vs AI: Player's AI makes a move
    playerAiTurn() {
        if (this.currentPlayerCard === null || this.gameEnded) {
            this.checkGameEnd();
            return;
        }
        
        const playerCard = this.currentPlayerCard;
        
        // Find best move using player AI difficulty
        const bestMove = this.findBestPlayerAiMove(playerCard);
        
        if (bestMove !== null) {
            // Show AI is "thinking"
            this.showMessage('🤖 Your AI is thinking...');
            
            setTimeout(() => {
                // Play the card using the existing playCard logic
                this.playCard(bestMove);
            }, 600);
        } else {
            this.checkGameEnd();
        }
    }
    
    findBestPlayerAiMove(playerCard) {
        const emptyCells = this.mapState
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);

        if (emptyCells.length === 0) return null;

        if (this.gameMode === 'reverserules') {
            // In reverse rules, lower is better
            if (Math.random() > this.playerAiDifficulty) {
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }

            let lowestScore = 1000;
            let bestCell = null;

            emptyCells.forEach(cellIndex => {
                const points = this.simulatePoints(cellIndex, playerCard, 'player');
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

        // Random chance based on difficulty (lower difficulty = more random)
        if (Math.random() > this.playerAiDifficulty) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        let bestScore = -1;
        let bestCell = null;

        emptyCells.forEach(cellIndex => {
            const points = this.simulatePoints(cellIndex, playerCard, 'player');
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
        // FIXED: Remove double points from here - it only affects cash
        return this.calculatePointsForState(cellIndex, number, owner, this.mapState, true);
    }

    // FIXED: Scoring calculation with proper moon phase logic
    calculatePointsForState(cellIndex, number, owner, state, updateOwnership) {
        let totalPoints = 0;
        let matchPoints = 0; // Track match/tens points separately for Scummy Sequences
        const highlightCells = new Set([cellIndex]);
        const cellsToOwn = new Set([cellIndex]);
        const cellPointsMap = new Map();

        const connectedCells = this.getConnectedCells(cellIndex);
        const isScummySequences = this.restrictions && this.restrictions.scummySequences;
        const isGloriousZeros = this.restrictions && this.restrictions.gloriousZeros;

        // FIXED: Moon icon pack special matching
        if (this.currentIconPack === 'moon') {
            connectedCells.forEach(connectedIndex => {
                const connectedCell = state[connectedIndex];
                if (connectedCell) {
                    let cellPoints = 0;
                    
                    // Same phase match = 1 point
                    if (connectedCell.number === number) {
                        let pts = 1;
                        // Glorious Zeros: 0+0 = 10 points!
                        if (isGloriousZeros && number === 0 && connectedCell.number === 0) {
                            pts = 10;
                        }
                        matchPoints += pts;
                        cellPoints += pts;
                        highlightCells.add(connectedIndex);
                        cellsToOwn.add(connectedIndex);
                    }
                    
                    // FIXED: Moon phases only go 0-7, no "add to 10" rule
                    // Instead: Opposite phases = 2 points
                    // 🌑(0)+🌕(4), 🌒(1)+🌖(5), 🌓(2)+🌗(6), 🌔(3)+🌘(7)
                    const diff = Math.abs(connectedCell.number - number);
                    if (diff === 4) {
                        matchPoints += 2;
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
                        let pts = 1;
                        // Glorious Zeros: 0+0 = 10 points!
                        if (isGloriousZeros && number === 0 && connectedCell.number === 0) {
                            pts = 10;
                        }
                        matchPoints += pts;
                        cellPoints += pts;
                        highlightCells.add(connectedIndex);
                        cellsToOwn.add(connectedIndex);
                    }
                    
                    if (connectedCell.number + number === 10) {
                        matchPoints += 2;
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

        // Calculate sequence points
        let sequencePoints = 0;
        const sequences = this.findAllSequences(cellIndex, number, state);
        sequences.forEach(sequence => {
            if (sequence.length >= 3) {
                sequencePoints += sequence.length;
                sequence.forEach(idx => {
                    highlightCells.add(idx);
                    cellsToOwn.add(idx);
                    if (idx !== cellIndex) {
                        cellPointsMap.set(idx, (cellPointsMap.get(idx) || 0) + 1);
                    }
                });
            }
        });
        
        // Scummy Sequences: Only count sequence points, ignore match/tens
        if (isScummySequences) {
            totalPoints = sequencePoints;
        } else {
            totalPoints = matchPoints + sequencePoints;
        }

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
                
                // NEW: Subtraction mode - subtract opponent's points
                if (this.gameMode === 'subtraction' && totalPoints > 0) {
                    if (owner === 'player') {
                        // Subtract from AI
                        const cellsToSubtract = Array.from(cellsToOwn).length;
                        const previousAIScore = this.aiScore;
                        this.aiScore = Math.max(0, this.aiScore - cellsToSubtract);
                        
                        if (previousAIScore !== this.aiScore) {
                            this.updateScore('ai');
                            const scoreCard = document.querySelector('.score-card.ai');
                            const rect = scoreCard.getBoundingClientRect();
                            this.createPointsPopup(-cellsToSubtract, rect.left + rect.width / 2 - 50, rect.top - 50, false);
                        }
                    } else if (owner === 'ai') {
                        // Subtract from player
                        const cellsToSubtract = Array.from(cellsToOwn).length;
                        const previousPlayerScore = this.playerScore;
                        this.playerScore = Math.max(0, this.playerScore - cellsToSubtract);
                        
                        if (previousPlayerScore !== this.playerScore) {
                            this.updateScore('player');
                            const scoreCard = document.querySelector('.score-card.player');
                            const rect = scoreCard.getBoundingClientRect();
                            this.createPointsPopup(-cellsToSubtract, rect.left + rect.width / 2 - 50, rect.top - 50, true);
                        }
                    }
                }
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
                                'tutorial-highlight', 'drag-over', 'nearby-highlight', 'fog-hidden');
            
            // Fog of War mode: Check if cell should be visible
            const isFogMode = this.gameMode === 'fogofwar';
            const isVisible = !isFogMode || this.visibleCells.has(index);
            
            if (cellData) {
                // In Fog of War: If a hidden cell becomes owned, reveal it and adjacent cells
                if (isFogMode && !isVisible && cellData.owner !== 'neutral') {
                    // Cell was converted - reveal it!
                    this.visibleCells.add(index);
                    // Also reveal adjacent cells
                    const connectedCells = this.getConnectedCells(index);
                    connectedCells.forEach(idx => this.visibleCells.add(idx));
                }
                
                // Re-check visibility after potential reveal
                const nowVisible = !isFogMode || this.visibleCells.has(index);
                
                if (isFogMode && !nowVisible) {
                    // Cell has content but is hidden in fog
                    cell.textContent = '🌫️';
                    cell.classList.add('fog-hidden');
                } else {
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
                }
            } else {
                cell.textContent = '○';
                cell.classList.add('empty');
                cell.style.pointerEvents = '';
            }
        });
    }
    
    // Fog of War: Reveal a cell and its adjacent cells
    revealCell(cellIndex) {
        if (this.gameMode !== 'fogofwar') return;
        
        // Reveal the placed cell
        this.visibleCells.add(cellIndex);
        
        // Reveal adjacent/connected cells
        const connectedCells = this.getConnectedCells(cellIndex);
        connectedCells.forEach(idx => {
            this.visibleCells.add(idx);
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
        
        // Stop Time Trials timer if running
        if (this.timeTrialsInterval) {
            clearInterval(this.timeTrialsInterval);
            this.timeTrialsInterval = null;
        }

        const playerCells = this.mapState.filter(cell => cell && cell.owner === 'player').length;
        const aiCells = this.mapState.filter(cell => cell && cell.owner === 'ai').length;
        
        // Determine winner for flash color
        let playerWon = false;
        let aiWon = false;
        if (this.gameMode === 'reverserules') {
            playerWon = this.playerScore < this.aiScore || (this.gameMode === 'territorial' && playerCells < aiCells);
            aiWon = this.aiScore < this.playerScore || (this.gameMode === 'territorial' && aiCells < playerCells);
        } else {
            playerWon = this.playerScore > this.aiScore || (this.gameMode === 'territorial' && playerCells > aiCells);
            aiWon = this.aiScore > this.playerScore || (this.gameMode === 'territorial' && aiCells > playerCells);
        }
        
        // Flash the game board color (light version of win/lose/tie)
        const mapContainer = document.querySelector('.map-container');
        const originalBg = mapContainer.style.background || '';
        const flashColor = playerWon ? 'rgba(144, 238, 144, 0.95)' : (aiWon ? 'rgba(255, 182, 182, 0.95)' : 'rgba(255, 224, 178, 0.95)');
        mapContainer.style.transition = 'background 0.3s ease-in-out';
        mapContainer.style.background = flashColor;
        
        // Fade back to original after delay
        setTimeout(() => {
            mapContainer.style.background = originalBg || 'rgba(255,255,255,0.95)';
            setTimeout(() => {
                mapContainer.style.transition = '';
            }, 300);
        }, 2000);
        
        // Territorial mode: Final scores ARE the owned cell counts
        if (this.gameMode === 'territorial') {
            this.playerScore = playerCells;
            this.aiScore = aiCells;
            this.updateScore('player');
            this.updateScore('ai');
            this.showMessage(`🏰 TERRITORIAL: You claimed ${playerCells} tiles, AI claimed ${aiCells}!`);
            this.animateBonusCells();
        }
        
        // NEW: Check both gamemode and restriction for no bonus
        // Also skip bonus for Territorial since the cell count IS the score
        const isNoBonus = this.gameMode === 'nobonus' || this.gameMode === 'suddendeath' || 
                          this.gameMode === 'territorial' || this.restrictions.noBonus;
        
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
                // FIXED: Don't apply double points to score, only to cash later
                let playerBonusPoints = playerCells;
                let aiBonusPoints = aiCells;
                
                this.playerScore += playerBonusPoints;
                this.aiScore += aiBonusPoints;

                this.updateScore('player');
                this.updateScore('ai');

                this.showMessage(`Game Over! Bonus: You +${playerBonusPoints}, AI +${aiBonusPoints}`);
            } else {
                this.showMessage(`Game Over! No bonus points in this mode.`);
            }

            if (this.playerScore > this.stats.highScore) {
                this.stats.highScore = this.playerScore;
            }

            // Award cash ONLY if player wins
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
                
                // Check if playing a custom level (0x multiplier)
                if (this.customLevelMultiplier === 0) {
                    pointsEarned = 0;
                } else {
                    // Calculate all multipliers
                    const gameModeMultiplier = this.gameModeMultipliers[this.gameMode] || 1.0;
                    const aiDifficultyMultiplier = this.aiDifficultyMultipliers[this.aiDifficulty] || 1.0;
                    const doublePointsMultiplier = this.doublePointsActive ? 1.0 : 0;
                    const baseMultiplierBonus = (this.shop.owned.baseMultiplier || 0) * 0.1;
                    const iconPackMultiplier = IconPackMultipliers[this.currentIconPack] || 1.0;
                    
                    // Calculate restriction multipliers (all 8)
                    let restrictionBonus = 0;
                    if (this.restrictions.noBonus) restrictionBonus += (this.restrictionMultipliers.noBonus - 1.0);
                    if (this.restrictions.aiFirst) restrictionBonus += (this.restrictionMultipliers.aiFirst - 1.0);
                    if (this.restrictions.maintainedPaths) restrictionBonus += (this.restrictionMultipliers.maintainedPaths - 1.0);
                    if (this.restrictions.survival) restrictionBonus += (this.restrictionMultipliers.survival - 1.0);
                    if (this.restrictions.singlePath) restrictionBonus += (this.restrictionMultipliers.singlePath - 1.0);
                    if (this.restrictions.scummySequences) restrictionBonus += (this.restrictionMultipliers.scummySequences - 1.0);
                    if (this.restrictions.gloriousZeros) restrictionBonus += (this.restrictionMultipliers.gloriousZeros - 1.0);
                    if (this.restrictions.aiVsAi) restrictionBonus += (this.getPlayerAiMultiplier() - 1.0);
                    
                    // Add all multipliers together, then multiply by icon pack multiplier
                    const baseTotal = (gameModeMultiplier - 1.0) + (aiDifficultyMultiplier - 1.0) + 1.0 + doublePointsMultiplier + baseMultiplierBonus + restrictionBonus;
                    const totalMultiplier = baseTotal * iconPackMultiplier;
                    
                    // Calculate cash earned
                    const basePoints = this.playerScore * 0.1;
                    pointsEarned = Math.round(basePoints * totalMultiplier * 10) / 10;
                    
                    // Ensure pointsEarned is never NaN
                    if (isNaN(pointsEarned) || pointsEarned < 0) {
                        pointsEarned = 0;
                    }
                }
                
                this.shop.points += pointsEarned;
                this.saveShop();
                
                // Track points for quests
                trackQuestProgress('points', Math.floor(pointsEarned));
                
                // Track time trials for quests
                if (this.gameMode === 'timetrials') {
                    trackQuestProgress('timetrials', 1);
                }
                
                // Track blitz wins for quests
                if (this.gameMode === 'blitz') {
                    trackQuestProgress('blitzwin', 1);
                }
            } else if (this.gameMode === 'reverserules' ? (this.aiScore < this.playerScore) : (this.aiScore > this.playerScore)) {
                this.stats.losses++;
            } else {
                this.stats.ties++;
            }
            
            // Track games played for quests
            trackQuestProgress('gamesplayed', 1);
            
            this.saveStats();

            setTimeout(() => {
                const gameOver = document.getElementById('gameOver');
                const winnerText = document.getElementById('winnerText');
                const shopPointsEarned = document.getElementById('shopPointsEarned');
                
                // FIXED: Save power-up state before showing game over
                this.savePowerupState();
                
                if (playerWon) {
                    winnerText.textContent = '🎉 YOU WIN! 🎉';
                    winnerText.style.color = '#4CAF50';
                    SoundEffects.playWin();
                    
                    // Check for custom level (0x multiplier)
                    if (this.customLevelMultiplier === 0) {
                        shopPointsEarned.textContent = `Custom Level - 0x multiplier (no points earned)`;
                        shopPointsEarned.style.whiteSpace = 'normal';
                        // Reset custom level multiplier for next game
                        this.customLevelMultiplier = 1;
                    } else {
                        // Recalculate multipliers for display
                        const gameModeMultiplier = this.gameModeMultipliers[this.gameMode] || 1.0;
                        const aiDifficultyMultiplier = this.aiDifficultyMultipliers[this.aiDifficulty] || 1.0;
                        const doublePointsMultiplier = this.doublePointsActive ? 1.0 : 0; // Changed from 2.0 to 1.0
                        const baseMultiplierBonus = (this.shop.owned.baseMultiplier || 0) * 0.1;
                        const iconPackMultiplier = IconPackMultipliers[this.currentIconPack] || 1.0;
                    
                    // Calculate restriction bonus for display (all 8)
                    let restrictionBonus = 0;
                    if (this.restrictions.noBonus) restrictionBonus += (this.restrictionMultipliers.noBonus - 1.0);
                    if (this.restrictions.aiFirst) restrictionBonus += (this.restrictionMultipliers.aiFirst - 1.0);
                    if (this.restrictions.maintainedPaths) restrictionBonus += (this.restrictionMultipliers.maintainedPaths - 1.0);
                    if (this.restrictions.survival) restrictionBonus += (this.restrictionMultipliers.survival - 1.0);
                    if (this.restrictions.singlePath) restrictionBonus += (this.restrictionMultipliers.singlePath - 1.0);
                    if (this.restrictions.scummySequences) restrictionBonus += (this.restrictionMultipliers.scummySequences - 1.0);
                    if (this.restrictions.gloriousZeros) restrictionBonus += (this.restrictionMultipliers.gloriousZeros - 1.0);
                    if (this.restrictions.aiVsAi) restrictionBonus += (this.getPlayerAiMultiplier() - 1.0);
                    
                    const baseTotal = (gameModeMultiplier - 1.0) + (aiDifficultyMultiplier - 1.0) + 1.0 + doublePointsMultiplier + baseMultiplierBonus + restrictionBonus;
                    const totalMultiplier = baseTotal * iconPackMultiplier;
                    
                    // Get difficulty name
                    const difficultyNames = {
                        0.2: 'Novice',
                        0.3: 'Beginner',
                        0.4: 'Intermediate',
                        0.5: 'Skilled',
                        0.6: 'Advanced',
                        0.7: 'Expert',
                        0.8: 'Pro',
                        0.9: 'Master'
                    };
                    const difficultyName = difficultyNames[this.aiDifficulty] || 'Unknown';
                    
                    const modeName = this.gameMode.charAt(0).toUpperCase() + this.gameMode.slice(1).replace(/([A-Z])/g, ' $1');
                    
                    // Simplified display - just show points earned and multiplier
                    shopPointsEarned.textContent = `💰 Earned ${pointsEarned.toFixed(1)} pts! (${totalMultiplier.toFixed(2)}x multiplier)`;
                    shopPointsEarned.style.whiteSpace = 'normal';
                    }
                } else if (this.gameMode === 'reverserules' ? (this.aiScore < this.playerScore) : (this.aiScore > this.playerScore)) {
                    winnerText.textContent = '🤖 AI WINS! 🤖';
                    winnerText.style.color = '#f44336';
                    shopPointsEarned.textContent = `No pts earned - you lost!`;
                    shopPointsEarned.style.whiteSpace = 'normal';
                    SoundEffects.playLose();
                } else {
                    winnerText.textContent = '🤝 TIE GAME! 🤝';
                    winnerText.style.color = '#FF9800';
                    shopPointsEarned.textContent = `No pts earned - it's a tie!`;
                    shopPointsEarned.style.whiteSpace = 'normal';
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
        
        // If we were playing a custom level, clear it and re-enable settings
        if (this.isPlayingCustomLevel) {
            this.clearCustomLevel();
            loadedCustomLevel = null; // Clear the global custom level reference
        }
        
        this.playerScore = 0;
        this.aiScore = 0;
        this.currentPlayerCard = null;
        this.mapState = Array(this.totalCells).fill(null);
        this.isPlayerTurn = true;
        this.gameEnded = false;
        this.hoveredCellIndex = null;
        this.draggedOverCellIndex = null;
        
        // Reset custom level multiplier (unless loadCustomLevel sets it)
        if (this.customLevelMultiplier === undefined) {
            this.customLevelMultiplier = 1; // Normal multiplier
        }
        
        // FIXED: Reset to defaults + permanent + keep shop consumables
        const shopConsumables = this.loadShopConsumables();
        const permanentBonuses = this.shop.owned.permanentPowerups || {
            skipAI: 0,
            replace: 0,
            viewNext: 0,
            undo: 0,
            pickCard: 0,
            doublePoints: 0
        };
        
        const defaults = {
            skipAI: 1,
            replace: 3,
            viewNext: 1,
            undo: 1,
            pickCard: 0,
            doublePoints: 0 // FIXED: Ensure this exists
        };

        this.skipAIAvailable = defaults.skipAI + permanentBonuses.skipAI + shopConsumables.skipAI;
        this.skipAIConsumable = shopConsumables.skipAI;

        this.replaceCardAvailable = defaults.replace + permanentBonuses.replace + shopConsumables.replace;
        this.replaceCardConsumable = shopConsumables.replace;

        this.viewNextAvailable = defaults.viewNext + permanentBonuses.viewNext + shopConsumables.viewNext;
        this.viewNextConsumable = shopConsumables.viewNext;

        this.undoAvailable = defaults.undo + permanentBonuses.undo + shopConsumables.undo;
        this.undoConsumable = shopConsumables.undo;

        this.pickCardAvailable = defaults.pickCard + permanentBonuses.pickCard + shopConsumables.pickCard;
        this.pickCardConsumable = shopConsumables.pickCard;

        // FIXED: Ensure doublePoints is properly initialized
        this.doublePointsAvailable = (defaults.doublePoints || 0) + (permanentBonuses.doublePoints || 0) + (shopConsumables.doublePoints || 0);
        this.doublePointsConsumable = shopConsumables.doublePoints || 0;
        
        // Only reset game-specific states
        this.skipAIUsed = false;
        this.viewNextActive = false;
        this.viewNextUsedOnTurn = null;
        this.undoState = null;
        this.doublePointsActive = false;
        
        this.lastAICard = null;
        this.lastAICellIndex = null;
        this.blitzActive = false;
        this.turnCount = 0;
        this.extraTurn = false;
        
        // Reset Time Trials properties
        this.timeTrialsRemaining = 10.0;
        this.timeTrialsTurnCount = 0;
        if (this.timeTrialsInterval) {
            clearInterval(this.timeTrialsInterval);
            this.timeTrialsInterval = null;
        }
        const timerDisplay = document.getElementById('timeTrialsTimer');
        if (timerDisplay) timerDisplay.remove();
        
        // Reset Fog of War visibility
        this.visibleCells = new Set();
        
        // Reset AI vs AI state
        this.aiVsAiStarted = false;
        this.aiVsAiPaused = false;
        const aiVsAiControls = document.getElementById('aiVsAiControls');
        if (aiVsAiControls) {
            aiVsAiControls.style.display = 'none';
        }
        const aiVsAiBtn = document.getElementById('aiVsAiStartBtn');
        if (aiVsAiBtn) {
            aiVsAiBtn.innerHTML = '▶️ Start AI Battle';
            aiVsAiBtn.classList.remove('playing');
        }
        
        this.stopBlitzMode();
        
        document.getElementById('nextCardPreview').classList.remove('show');
        
        const existingIndicator = document.querySelector('.double-points-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        document.getElementById('playerScore').textContent = '0';
        document.getElementById('aiScore').textContent = '0';
        document.getElementById('gameOver').classList.add('hidden');
        
        this.init();
        this.updatePowerupDisplay();
        this.updateMultiplierDisplay();
        
        this.showMessage('New game started! Place your card!');
    }

    // Load a custom level from the level editor
    loadCustomLevel(levelData) {
        // Store original settings before applying custom level
        this.originalSettings = {
            gridSize: this.gridSize,
            width: this.width,
            height: this.height,
            gameMode: this.gameMode,
            aiDifficulty: this.aiDifficulty,
            iconPack: this.currentIconPack,
            restrictions: { ...this.restrictions }
        };
        
        // Set board size (custom levels use width/height but game uses gridSize)
        this.gridSize = levelData.width; // Assume square grid from level editor
        this.width = levelData.width;
        this.height = levelData.height;
        this.totalCells = this.width * this.height;
        this.deckSize = this.totalCells;
        
        // Store custom paths for use in generateConnections
        this.customPaths = levelData.paths || [];
        this.customLevelLoaded = true;
        // Don't set isPlayingCustomLevel yet - newGame() checks this and would clear it!
        
        // Apply restrictions
        if (levelData.restrictions) {
            this.restrictions.noBonus = levelData.restrictions.noBonus || false;
            this.restrictions.aiFirst = levelData.restrictions.aiFirst || false;
            this.restrictions.survival = levelData.restrictions.survival || false;
            this.restrictions.scummySequences = levelData.restrictions.scummySequences || false;
            this.restrictions.gloriousZeros = levelData.restrictions.gloriousZeros || false;
            this.restrictions.maintained = levelData.restrictions.maintained || false;
            this.restrictions.singlePath = levelData.restrictions.singlePath || false;
            this.restrictions.aiVsAi = levelData.restrictions.aiVsAi || false;
        }
        
        // Set AI difficulty
        if (levelData.aiDifficulty) {
            this.aiDifficulty = levelData.aiDifficulty;
            this.saveDifficulty();
            const aiSelect = document.getElementById('aiDifficultySelect');
            if (aiSelect) {
                aiSelect.value = levelData.aiDifficulty;
            }
        }
        
        // Set game mode
        if (levelData.gameMode) {
            this.gameMode = levelData.gameMode;
            this.saveGameMode(levelData.gameMode);
            const gamemodeSelect = document.getElementById('gamemodeSelect');
            if (gamemodeSelect) {
                gamemodeSelect.value = levelData.gameMode;
            }
        }
        
        // Apply icon pack if specified
        if (levelData.iconPack) {
            this.currentIconPack = levelData.iconPack;
            this.iconPack = levelData.iconPack;
            document.body.className = document.body.className.replace(/icon-\w+/g, '');
            if (levelData.iconPack !== 'default') {
                document.body.classList.add(`icon-${levelData.iconPack}`);
            }
        }
        
        // Apply 0x multiplier for custom levels
        this.customLevelMultiplier = 0;
        
        // Update board size selector if this size is available
        const sizeSelect = document.getElementById('boardSizeSelect');
        if (sizeSelect) {
            const sizeValue = String(this.width);
            const option = Array.from(sizeSelect.options).find(o => o.value === sizeValue);
            if (option) {
                sizeSelect.value = sizeValue;
            }
        }
        
        // Disable settings while playing custom level
        disableSettingsForCustomLevel();
        
        // Start new game with custom level (don't have isPlayingCustomLevel set yet!)
        this.newGame();
        
        // Apply responsive cell sizing for irregular board dimensions
        this.applyResponsiveCellSizing();
        
        // NOW set that we're playing a custom level (after newGame won't clear it)
        this.isPlayingCustomLevel = true;
        
        // Update multiplier display to show 0x
        this.updateMultiplierDisplay();
        
        // Show message about custom level
        this.showMessage(`Custom level loaded! (0x multiplier)`);
    }
    
    // Clear custom level and re-enable settings
    clearCustomLevel() {
        this.isPlayingCustomLevel = false;
        this.customLevelMultiplier = 1;
        this.customLevelLoaded = false;
        this.customPaths = [];
        
        // Restore original settings if they were saved
        if (this.originalSettings) {
            this.gridSize = this.originalSettings.gridSize;
            this.width = this.originalSettings.width;
            this.height = this.originalSettings.height;
            this.totalCells = this.gridSize * this.gridSize;
            this.deckSize = this.totalCells;
            this.gameMode = this.originalSettings.gameMode;
            this.aiDifficulty = this.originalSettings.aiDifficulty;
            this.currentIconPack = this.originalSettings.iconPack;
            this.iconPack = this.originalSettings.iconPack;
            this.restrictions = { ...this.originalSettings.restrictions };
            
            // Save restored settings to localStorage
            this.saveBoardSize();
            this.saveGameMode(this.gameMode);
            this.saveDifficulty();
            this.saveIconPack(this.currentIconPack);
            this.saveRestrictions();
            
            // Update UI selects
            const sizeSelect = document.getElementById('boardSizeSelect');
            if (sizeSelect) {
                sizeSelect.value = String(this.gridSize);
            }
            
            const gamemodeSelect = document.getElementById('gamemodeSelect');
            if (gamemodeSelect) {
                gamemodeSelect.value = this.gameMode;
            }
            
            const aiSelect = document.getElementById('aiDifficultySelect');
            if (aiSelect) {
                aiSelect.value = this.aiDifficulty;
            }
            
            // Restore icon pack
            document.body.className = document.body.className.replace(/icon-\w+/g, '');
            if (this.currentIconPack !== 'default') {
                document.body.classList.add(`icon-${this.currentIconPack}`);
            }
            
            this.originalSettings = null;
        } else {
            // Fallback: Reset board size to the one selected in settings
            const sizeSelect = document.getElementById('boardSizeSelect');
            if (sizeSelect) {
                const selectedSize = parseInt(sizeSelect.value);
                this.gridSize = selectedSize;
                this.width = selectedSize;
                this.height = selectedSize;
                this.totalCells = selectedSize * selectedSize;
                this.deckSize = this.totalCells;
            }
        }
        
        enableSettingsAfterCustomLevel();
    }
    
    applyResponsiveCellSizing() {
        // Calculate appropriate cell size based on board dimensions
        const mapGrid = document.querySelector('.map-grid');
        if (!mapGrid) return;
        
        // Get the fixed container dimensions
        const mapWrapper = document.querySelector('.map-wrapper');
        if (!mapWrapper) return;
        
        // FIXED: Use fixed container size (500x500 from CSS)
        const containerWidth = 500;
        const containerHeight = 500;
        
        // Calculate gap based on grid size (smaller gap for larger grids)
        const gap = this.width >= 7 || this.height >= 7 ? 4 : 8;
        
        // Calculate cell dimensions to fit within container
        const availableWidth = containerWidth - (gap * (this.width - 1));
        const availableHeight = containerHeight - (gap * (this.height - 1));
        
        const cellWidth = Math.floor(availableWidth / this.width);
        const cellHeight = Math.floor(availableHeight / this.height);
        
        // Apply maximum size caps
        const maxCellSize = 80;
        const finalCellWidth = Math.min(cellWidth, maxCellSize);
        const finalCellHeight = Math.min(cellHeight, maxCellSize);
        
        // Calculate font size based on smaller dimension
        const fontSize = Math.floor(Math.min(finalCellWidth, finalCellHeight) * 0.5);
        
        // CRITICAL: Set grid-template-columns to define the grid layout for custom dimensions
        mapGrid.style.gridTemplateColumns = `repeat(${this.width}, ${finalCellWidth}px)`;
        mapGrid.style.display = 'grid';
        
        // Apply custom sizing to all cells
        const cells = mapGrid.querySelectorAll('.map-cell');
        cells.forEach(cell => {
            cell.style.width = `${finalCellWidth}px`;
            cell.style.height = `${finalCellHeight}px`;
            cell.style.fontSize = `${fontSize}px`;
        });
        
        // Update grid gap
        mapGrid.style.gap = `${gap}px`;
        
        // Center the grid within the container if it's smaller than container
        const totalWidth = (finalCellWidth * this.width) + (gap * (this.width - 1));
        const totalHeight = (finalCellHeight * this.height) + (gap * (this.height - 1));
        
        if (totalWidth < containerWidth || totalHeight < containerHeight) {
            mapGrid.style.justifyContent = 'center';
            mapGrid.style.alignContent = 'center';
        }
    }
}

// Shop Functions
function showShop() {
    SoundEffects.playButton();
    const modal = document.getElementById('shopModal');
    
    // Update cash display
    document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
    updateFloatingPointsBadges();
    
    // Render shop items
    renderShopItems();
    
    modal.classList.add('show');
}

function closeShop() {
    SoundEffects.playButton();
    document.getElementById('shopModal').classList.remove('show');
    game.updatePowerupDisplay();
}

// Toggle shop multiplier info dropdown
function toggleShopInfoDropdown() {
    const content = document.getElementById('shopInfoContent');
    const section = content.closest('.shop-info-section');
    
    SoundEffects.playButton();
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        section.classList.add('open');
    } else {
        content.style.display = 'none';
        section.classList.remove('open');
    }
}

function goToSettingsSection(sectionId) {
    SoundEffects.playButton();
    // Close the shop
    document.getElementById('shopModal').classList.remove('show');
    // Open settings
    document.getElementById('settingsModal').classList.add('show');
    // Scroll to the section after a brief delay to allow modal to open
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect
            element.style.transition = 'box-shadow 0.3s';
            element.style.boxShadow = '0 0 20px 5px rgba(102, 126, 234, 0.6)';
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 1500);
        }
    }, 100);
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
        { id: 'pickCard', name: 'Pick Any Card', price: 3, icon: '🎯' },
        { id: 'doublePoints', name: 'Double Points', price: 10, icon: '💎' } // NEW
    ];

    powerups.forEach(powerup => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">${powerup.icon} ${powerup.name}</div>
            <div class="shop-item-price">${powerup.price} pts</div>
            <button onclick="buyPowerup('${powerup.id}', ${powerup.price})" 
                    ${game.shop.points < powerup.price || game.restrictions.survival ? 'disabled' : ''}>
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
        { id: 'pickCard', name: 'Permanent Pick Card Bonus', basePrice: 3, icon: '🎯' },
        { id: 'doublePoints', name: 'Permanent Double Points Bonus', basePrice: 10, icon: '💎' } // NEW
    ];

    permanentPowerups.forEach(powerup => {
        const price = powerup.basePrice * 100;
        const currentLevel = game.shop.owned.permanentPowerups?.[powerup.id] || 0;
        const maxCap = powerup.id === 'doublePoints' ? 1 : 99;
        const atCap = currentLevel >= maxCap;
        const div = document.createElement('div');
        div.className = atCap ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">${powerup.icon} ${powerup.name}</div>
            <div class="shop-item-desc">Current: +${currentLevel} per game ${atCap ? '(MAX)' : `(max ${maxCap})`}</div>
            <div class="shop-item-price">${price} pts</div>
            <button onclick="buyPermanentPowerup('${powerup.id}', ${price})" 
                    ${game.shop.points < price || game.restrictions.survival || atCap ? 'disabled' : ''}>
                ${atCap ? '✓ Maxed' : 'Buy +1'}
            </button>
        `;
        permPowerupContainer.appendChild(div);
    });

    // AI Difficulty Levels
    const aiLevelContainer = document.getElementById('aiLevelShopItems');
    aiLevelContainer.innerHTML = '';

    const aiLevels = [
        { value: '0.2', name: 'Novice AI', price: 2, multiplier: 0.5 },
        { value: '0.3', name: 'Beginner AI', price: 3, multiplier: 0.75 },
        { value: '0.7', name: 'Expert AI', price: 7.5, multiplier: 1.3 },
        { value: '0.8', name: 'Pro AI', price: 12.5, multiplier: 1.4 },
        { value: '0.9', name: 'Master AI', price: 20, multiplier: 1.5 }
    ];

    aiLevels.forEach(level => {
        const owned = game.shop.owned.aiLevels && game.shop.owned.aiLevels.includes(level.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.innerHTML = `
            <div class="shop-item-name">🤖 ${level.name}</div>
            <div class="shop-item-multiplier">${level.multiplier}x pts</div>
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
        { value: '3', name: '3x3 Quick Board', price: 3, multiplier: null },
        { value: '7', name: '7x7 Epic Board', price: 10, multiplier: null },
        { value: '8', name: '8x8 Massive Board', price: 20, multiplier: null },
        { value: '10', name: '10x10 Colossal Board', price: 50, multiplier: 1.05, warning: '⚠️ Best on larger screens' }
    ];

    boards.forEach(board => {
        const owned = game.shop.owned.boards.includes(board.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        const multiplierText = board.multiplier ? `${board.multiplier}x pts` : 'No multiplier bonus';
        const warningText = board.warning ? ` <span style="color: #FF9800; font-size: 0.85em;">${board.warning}</span>` : '';
        div.innerHTML = `
            <div class="shop-item-name">🗺️ ${board.name}${warningText}</div>
            <div class="shop-item-multiplier">${multiplierText}</div>
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
        { value: 'blitz', name: 'Blitz', price: 3, multiplier: 2.5, desc: 'Race against the clock! AI moves automatically every few seconds.' },
        { value: 'suddendeath', name: 'Sudden Death', price: 7.5, multiplier: 3.25, desc: 'One mistake and you lose! First player to score wins the game.' },
        { value: 'chainreaction', name: 'Chain Reaction', price: 17.5, multiplier: 0.75, desc: 'Cells explode when scored! Create massive chain combos.' },
        { value: 'reverserules', name: 'Reverse Rules', price: 25, multiplier: 3.75, desc: 'Everything is backwards! Lower scores win, sequences go down.' },
        { value: 'mirrormatch', name: 'Mirror Match', price: 37.5, multiplier: 1.4, desc: 'You and AI get the same cards! Pure strategy, no luck.' },
        { value: 'subtraction', name: 'Subtraction', price: 50, multiplier: 1.5, desc: 'Numbers subtract instead of add! Reach zero to score.' },
        { value: 'timetrials', name: 'Time Trials', price: 67, multiplier: 1.35, desc: '10 seconds per turn, decreasing by 0.1s each turn! Race the clock.' },
        { value: 'ludicrouslylucky', name: 'Ludicrously Lucky', price: 80, multiplier: 2.5, desc: 'Game could randomly end any turn after turn 3! High risk, high reward.' },
        { value: 'fogofwar', name: 'Fog of War', price: 100, multiplier: 1.5, desc: 'Only placed cards and adjacent cells are visible. Navigate blind!' },
        { value: 'territorial', name: 'Territorial', price: 125, multiplier: 1.6, desc: 'No points during play - only owned cells count at game end!' }
    ];

    modes.forEach(mode => {
        const owned = game.shop.owned.modes.includes(mode.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.title = mode.desc;
        div.innerHTML = `
            <div class="shop-item-name">🎮 ${mode.name}</div>
            <div class="shop-item-multiplier">${mode.multiplier}x pts</div>
            <div class="shop-item-price">${owned ? 'Owned' : mode.price + ' pts'}</div>
            <button onclick="buyPermanent('mode', '${mode.value}', ${mode.price})" 
                    ${owned || game.shop.points < mode.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        modeContainer.appendChild(div);
    });
    
    // Themes - with background preview
    const themeContainer = document.getElementById('themeShopItems');
    themeContainer.innerHTML = '';
    
    const themeBackgrounds = {
        fire: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
        midnight: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        royal: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
        cosmic: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 30%, #4b134f 70%, #c94b4b 100%)',
        lava: 'linear-gradient(135deg, #C33764 0%, #1D2671 100%)',
        emerald: 'linear-gradient(135deg, #348F50 0%, #56B4D3 100%)',
        meme: 'linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%)',
        money: 'linear-gradient(135deg, #2E7D32 0%, #FDD835 100%)'
    };
    
    const themes = [
        { value: 'fire', name: 'Fire Theme', price: 3 },
        { value: 'midnight', name: 'Midnight Theme', price: 5 },
        { value: 'royal', name: 'Royal Theme', price: 10 },
        { value: 'cosmic', name: 'Cosmic Theme', price: 20 },
        { value: 'lava', name: 'Lava Theme', price: 35 },
        { value: 'emerald', name: 'Emerald Theme', price: 50 },
        { value: 'meme', name: 'Meme Theme', price: 67 },
        { value: 'money', name: 'Money Theme', price: 77 }
    ];
    
    themes.forEach(theme => {
        const owned = game.shop.owned.themes.includes(theme.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        div.style.background = themeBackgrounds[theme.value];
        div.style.color = 'white';
        div.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
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
        { value: 'emoji', name: 'Emoji Numbers', price: 3, multiplier: 1.0 },
        { value: 'font', name: 'Font Icons', price: 10, multiplier: 1.0 },
        { value: 'moon', name: 'Moon Phase Icons', price: 25, multiplier: 0.9 },
        { value: 'dice', name: 'Dice Icons', price: 40, multiplier: 0.8 },
        { value: 'roman', name: 'Roman Numerals', price: 55, multiplier: 1.15 }
    ];
    
    icons.forEach(icon => {
        const owned = game.shop.owned.icons.includes(icon.value);
        const div = document.createElement('div');
        div.className = owned ? 'shop-item owned' : 'shop-item';
        let multiplierText = '';
        if (icon.multiplier < 1.0) {
            multiplierText = `<div class="shop-item-multiplier" style="color: #f44336;">×${icon.multiplier} pts</div>`;
        } else if (icon.multiplier > 1.0) {
            multiplierText = `<div class="shop-item-multiplier" style="color: #4caf50;">×${icon.multiplier} pts</div>`;
        }
        div.innerHTML = `
            <div class="shop-item-name">🎭 ${icon.name}</div>
            ${multiplierText}
            <div class="shop-item-price">${owned ? 'Owned' : icon.price + ' pts'}</div>
            <button onclick="buyPermanent('icon', '${icon.value}', ${icon.price})" 
                    ${owned || game.shop.points < icon.price ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;
        iconContainer.appendChild(div);
    });

    // Restrictions
    const restrictionContainer = document.getElementById('restrictionShopItems');
    if (restrictionContainer) {
        restrictionContainer.innerHTML = '';
        
        const restrictions = [
            { value: 'noBonus', name: 'No Bonus Points', price: 5, multiplier: 1.2, desc: 'Disable end-game cell bonus points. A true test of scoring skill!' },
            { value: 'aiFirst', name: 'AI First', price: 10, multiplier: 1.05, desc: 'Let the AI make the first move. Start at a disadvantage!' },
            { value: 'maintainedPaths', name: 'Maintained Paths', price: 20, multiplier: 0.75, desc: 'Full grid connections instead of random. More predictable but easier!' },
            { value: 'survival', name: 'Survival Mode', price: 25, multiplier: 1.2, desc: 'Progressive difficulty - AI gets smarter each round! Can you survive?' },
            { value: 'singlePath', name: 'Single Path', price: 30, multiplier: 1.3, desc: 'Map is a single winding path - strategic blocking becomes crucial!' },
            { value: 'scummySequences', name: 'Scummy Sequences', price: 40, multiplier: 1.5, desc: 'Only sequences score points! Matches and tens give nothing.' },
            { value: 'gloriousZeros', name: 'Glorious Zeros', price: 50, multiplier: 0.75, desc: 'Zero pairs (0+0) give 10 points instead of 1! Chase those zeros.' },
            { value: 'aiVsAi', name: 'AI vs AI', price: 200, multiplier: 'variable', desc: 'Watch two AIs battle! Multiplier depends on your AI difficulty.' }
        ];
        
        restrictions.forEach(restriction => {
            const owned = game.shop.owned.restrictions.includes(restriction.value);
            const div = document.createElement('div');
            div.className = owned ? 'shop-item owned' : 'shop-item';
            div.title = restriction.desc;
            const multiplierText = restriction.multiplier === 'variable' ? 
                `${game.getPlayerAiMultiplier()}x pts (varies)` : 
                `${restriction.multiplier}x pts`;
            div.innerHTML = `
                <div class="shop-item-name">🔒 ${restriction.name}</div>
                <div class="shop-item-multiplier">${multiplierText}</div>
                <div class="shop-item-price">${owned ? 'Owned' : restriction.price + ' pts'}</div>
                <button onclick="buyPermanent('restriction', '${restriction.value}', ${restriction.price})" 
                        ${owned || game.shop.points < restriction.price ? 'disabled' : ''}>
                    ${owned ? '✓ Owned' : 'Buy'}
                </button>
            `;
            restrictionContainer.appendChild(div);
        });
    }

    // NEW: Base Multiplier
    const baseMultiplierContainer = document.getElementById('baseMultiplierShopItems');
    if (baseMultiplierContainer) {
        baseMultiplierContainer.innerHTML = '';
        
        const currentLevel = game.shop.owned.baseMultiplier || 0;
        const maxCap = 50;
        const atCap = currentLevel >= maxCap;
        const basePrice = 100;
        const priceIncrease = 50;
        const nextPrice = basePrice + (currentLevel * priceIncrease);
        const currentBonus = currentLevel * 0.1;
        const nextBonus = (currentLevel + 1) * 0.1;
        
        const div = document.createElement('div');
        div.className = atCap ? 'shop-item owned' : 'shop-item';
        
        if (atCap) {
            div.innerHTML = `
                <div class="shop-item-name">⭐ Base Multiplier</div>
                <div class="shop-item-desc">Current: +${currentBonus.toFixed(1)}x (MAX)</div>
                <div class="shop-item-multiplier">Level ${currentLevel} / ${maxCap}</div>
                <div class="shop-item-price">Maxed Out</div>
                <button disabled>✓ Maxed</button>
            `;
        } else {
            div.innerHTML = `
                <div class="shop-item-name">⭐ Base Multiplier</div>
                <div class="shop-item-desc">Current: +${currentBonus.toFixed(1)}x | Next: +${nextBonus.toFixed(1)}x</div>
                <div class="shop-item-multiplier">Level ${currentLevel} → ${currentLevel + 1} (max ${maxCap})</div>
                <div class="shop-item-price">${nextPrice} pts</div>
                <button onclick="buyBaseMultiplier(${nextPrice})" 
                        ${game.shop.points < nextPrice ? 'disabled' : ''}>
                    Buy Upgrade
                </button>
            `;
        }
        baseMultiplierContainer.appendChild(div);
    }
}

function buyPowerup(type, price) {
    if (game.shop.points < price) {
        alert('Not enough points!');
        return;
    }
    
    if (game.restrictions.survival) {
        alert('Cannot buy power-ups in Survival mode!');
        return;
    }
    
    game.shop.points -= price;
    game.saveShop();
    updateFloatingPointsBadges();
    
    // FIXED: Add to both available and consumable
    switch(type) {
        case 'skipAI':
            game.skipAIAvailable++;
            game.skipAIConsumable++;
            break;
        case 'replace':
            game.replaceCardAvailable++;
            game.replaceCardConsumable++;
            break;
        case 'viewNext':
            game.viewNextAvailable++;
            game.viewNextConsumable++;
            break;
        case 'undo':
            game.undoAvailable++;
            game.undoConsumable++;
            break;
        case 'pickCard':
            game.pickCardAvailable++;
            game.pickCardConsumable++;
            break;
        case 'doublePoints':
            game.doublePointsAvailable++;
            game.doublePointsConsumable++;
            break;
    }
    
    game.saveShopConsumables(); // FIXED
    game.updatePowerupDisplay();
    game.updateStatsDisplay();
    document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
    renderShopItems();
    
    SoundEffects.playPowerup();
}

function buyPermanentPowerup(type, price) {
    if (game.shop.points < price) {
        game.showMessage('❌ Not enough points!');
        return;
    }
    
    if (game.restrictions.survival) {
        game.showMessage('❌ Cannot buy power-ups in Survival mode!');
        return;
    }
    
    if (!game.shop.owned.permanentPowerups) {
        game.shop.owned.permanentPowerups = {
            skipAI: 0,
            replace: 0,
            viewNext: 0,
            undo: 0,
            pickCard: 0,
            doublePoints: 0 // NEW
        };
    }
    
    // Check purchase caps
    const currentCount = game.shop.owned.permanentPowerups[type] || 0;
    if (type === 'doublePoints' && currentCount >= 1) {
        game.showMessage('❌ You already own the maximum of this powerup!');
        return;
    }
    if (type !== 'doublePoints' && currentCount >= 99) {
        game.showMessage('❌ You already own the maximum (99) of this powerup!');
        return;
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
        case 'doublePoints':
            game.doublePointsAvailable++;
            break;
    }

    game.saveShop();
    game.savePowerupState(); // NEW
    game.updatePowerupDisplay();
    game.updateStatsDisplay();
    document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
    updateFloatingPointsBadges();
    renderShopItems();
    
    SoundEffects.playUnlock();
    game.showMessage(`✨ Permanent bonus purchased! You'll now start every game with +${game.shop.owned.permanentPowerups[type]} of this power-up!`);
}
function buyBaseMultiplier(price) {
    if (game.shop.points < price) {
        game.showMessage('❌ Not enough points!');
        return;
    }
    
    if (!game.shop.owned.baseMultiplier) {
        game.shop.owned.baseMultiplier = 0;
    }
    
    // Check if at max cap (50 purchases = 5.0x)
    if (game.shop.owned.baseMultiplier >= 50) {
        game.showMessage('❌ Base Multiplier is already at maximum (5.0x)!');
        return;
    }
    
    game.shop.points -= price;
    game.shop.owned.baseMultiplier++;
    
    game.saveShop();
    game.updateMultiplierDisplay();
    game.updateStatsDisplay();
    document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
    updateFloatingPointsBadges();
    renderShopItems();
    
    const newLevel = game.shop.owned.baseMultiplier;
    const newBonus = newLevel * 0.1;
    
    SoundEffects.playUnlock();
    game.showMessage(`⭐ Base Multiplier upgraded to Level ${newLevel}! You now get +${newBonus.toFixed(1)}x on ALL pts earnings!`);
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
        case 'restriction':
            if (!game.shop.owned.restrictions) {
                game.shop.owned.restrictions = [];
            }
            if (game.shop.owned.restrictions.includes(value)) {
                alreadyOwned = true;
            } else {
                game.shop.owned.restrictions.push(value);
            }
            break;
    }
    
    if (alreadyOwned) {
        alert('You already own this item!');
        return;
    }
    
    game.shop.points -= price;
    game.saveShop();
    updateFloatingPointsBadges();
    game.updateStatsDisplay();
    game.updateRestrictionsUI(); // Update restrictions visibility in settings

    document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);

    game.updateSettingsUI();
    renderShopItems();
    
    SoundEffects.playUnlock();
}

// Disable settings when playing a custom level
function disableSettingsForCustomLevel() {
    const selects = ['difficultySelect', 'boardSizeSelect', 'gamemodeSelect'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = true;
            el.style.opacity = '0.5';
        }
    });
    
    // Also disable restriction checkboxes
    document.querySelectorAll('#restrictionsSettingsSection input[type="checkbox"]').forEach(cb => {
        cb.disabled = true;
    });
    
    // Disable icon pack selection
    document.querySelectorAll('.icon-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.5';
    });
}

// Re-enable settings after custom level is cleared
function enableSettingsAfterCustomLevel() {
    const selects = ['difficultySelect', 'boardSizeSelect', 'gamemodeSelect'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = false;
            el.style.opacity = '1';
        }
    });
    
    // Re-enable restriction checkboxes
    document.querySelectorAll('#restrictionsSettingsSection input[type="checkbox"]').forEach(cb => {
        cb.disabled = false;
    });
    
    // Re-enable icon pack selection
    document.querySelectorAll('.icon-option').forEach(opt => {
        opt.style.pointerEvents = '';
        opt.style.opacity = '';
    });
}

function showSettings() {
    SoundEffects.playButton();
    document.getElementById('settingsModal').classList.add('show');
    
    // Show import/export if creator center is unlocked
    if (typeof updateImportExportVisibility === 'function') {
        updateImportExportVisibility();
    }
}

function closeSettings() {
    SoundEffects.playButton();
    document.getElementById('settingsModal').classList.remove('show');
}

function showStats() {
    SoundEffects.playButton();
    
    // Show creator points if creator center access is unlocked
    const creatorBox = document.getElementById('creatorPointsStatBox');
    if (creatorBox) {
        if (creatorCenterAccessUnlocked) {
            creatorBox.style.display = '';
            document.getElementById('creatorPointsStat').textContent = creatorPoints;
        } else {
            creatorBox.style.display = 'none';
        }
    }
    
    document.getElementById('statsModal').classList.add('show');
}

function closeStats() {
    SoundEffects.playButton();
    document.getElementById('statsModal').classList.remove('show');
}

function resetStats() {
    SoundEffects.playButton();
    if (confirm('Are you sure you want to reset all statistics, shop data, AND casino progress? This will reset your points and lock all purchased items!')) {
        // Clear ALL localStorage data
        localStorage.clear();
        
        // Show confirmation and reload
        alert('All data has been completely reset! The page will now reload.');
        window.location.reload();
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
    game.updateMultiplierDisplay(); // Update multiplier when icon pack changes
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

// Secret easter egg: click multiplier title 5 times for 100 points (max 10 times = 1000 pts)
let multiplierClickCount = 0;
let multiplierClickTimer = null;
let secretEggUses = parseInt(localStorage.getItem('secretEggUses') || '0');
const multiplierTitle = document.querySelector('.multipliers-title');
if (multiplierTitle) {
    multiplierTitle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent dropdown toggle
        multiplierClickCount++;
        
        // Reset counter after 2 seconds of no clicks
        clearTimeout(multiplierClickTimer);
        multiplierClickTimer = setTimeout(() => {
            multiplierClickCount = 0;
        }, 2000);
        
        if (multiplierClickCount >= 5) {
            if (secretEggUses < 10) {
                // Award 100 points!
                game.shop.points += 100;
                secretEggUses++;
                localStorage.setItem('secretEggUses', secretEggUses.toString());
                game.saveShop();
                game.updateMultiplierDisplay();
                SoundEffects.playUnlock();
                game.showMessage(`🎉 Secret bonus! +100 Shop Points! (${10 - secretEggUses} uses left)`);
                
                // Flash the multiplier title green with transition
                multiplierTitle.style.transition = 'color 0.15s ease, text-shadow 0.15s ease';
                multiplierTitle.style.color = '#00ff00';
                multiplierTitle.style.textShadow = '0 0 15px #00ff00, 0 0 30px #00ff00';
                setTimeout(() => {
                    multiplierTitle.style.color = '';
                    multiplierTitle.style.textShadow = '';
                }, 500);
            } else {
                // Penalty for trying after max uses!
                const penalty = Math.min(250, game.shop.points); // Don't go negative
                game.shop.points = Math.max(0, game.shop.points - penalty);
                game.saveShop();
                game.updateMultiplierDisplay();
                SoundEffects.playCasinoLose();
                game.showMessage(`❌ Too greedy! -${penalty} Shop Points! (No more uses)`);
                
                // Flash the multiplier title red with transition
                multiplierTitle.style.transition = 'color 0.15s ease, text-shadow 0.15s ease';
                multiplierTitle.style.color = '#ff0000';
                multiplierTitle.style.textShadow = '0 0 15px #ff0000, 0 0 30px #ff0000';
                setTimeout(() => {
                    multiplierTitle.style.color = '';
                    multiplierTitle.style.textShadow = '';
                }, 500);
            }
            
            multiplierClickCount = 0;
        }
    });
}

// ==================== GAMBLING SYSTEM ====================
let isFlipping = false;
let isGuessing = false;
let isSpinning = false;
let isBlackjackPlaying = false;
let currentCasinoGame = null;
let hlHiddenNumber = 0;
let hlShownNumber = 0;

// Slots game state
const SLOT_ICONS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
let slotsLevel = 0;
let slotsAvailableIcons = [...SLOT_ICONS];
const SLOT_UPGRADE_PRICES = [50, 100, 150];

// Blackjack game state
let bjPlayerCards = [];
let bjDealerCards = [];
let bjPlayerTotal = 0;
let bjDealerTotal = 0;
let bjCurrentBet = 0;
let bjPendingAce = null; // Track if player needs to choose ace value
let bjDealerHiddenCard = null;
let bjPlayerStood = false; // Track if player has stood
let bjDealerStood = false; // Track if dealer has stood
let bjIsPlayerTurn = true; // Track whose turn it is

// Casino game prices
const casinoGamePrices = {
    coinflip: 15,
    slots: 35,
    higherlower: 70,
    blackjack: 150,
    diceroll: 250,
    roulette: 567
};

let isRouletteSpinning = false;

// Load slots upgrade level from localStorage
function loadSlotsState() {
    const saved = localStorage.getItem('slotsUpgradeLevel');
    if (saved) {
        slotsLevel = parseInt(saved) || 0;
        // Remove icons based on level (remove from end of list)
        slotsAvailableIcons = SLOT_ICONS.slice(0, SLOT_ICONS.length - slotsLevel);
    }
}

function saveSlotsState() {
    localStorage.setItem('slotsUpgradeLevel', slotsLevel.toString());
}

// Check which casino games are owned
function getCasinoOwnedGames() {
    const owned = JSON.parse(localStorage.getItem('ownedCasinoGames') || '[]');
    return owned;
}

function saveCasinoOwnedGames(owned) {
    localStorage.setItem('ownedCasinoGames', JSON.stringify(owned));
}

function isCasinoGameOwned(gameId) {
    const owned = getCasinoOwnedGames();
    return owned.includes(gameId);
}

function buyCasinoGame(gameId) {
    const price = casinoGamePrices[gameId];
    if (game.shop.points >= price) {
        game.shop.points -= price;
        const owned = getCasinoOwnedGames();
        owned.push(gameId);
        saveCasinoOwnedGames(owned);
        game.saveShop();
        updateFloatingPointsBadges();
        updateCasinoUI();
        document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
        SoundEffects.playUnlock();
        return true;
    }
    return false;
}

function updateCasinoUI() {
    const games = ['coinflip', 'slots', 'higherlower', 'blackjack', 'diceroll', 'roulette']; // Order by price
    const comingSoon = []; // All games are now available!
    
    games.forEach(gameId => {
        const card = document.getElementById(gameId + 'Card');
        if (!card) return;
        
        const isOwned = isCasinoGameOwned(gameId);
        const isComingSoon = comingSoon.includes(gameId);
        const canAfford = game.shop.points >= casinoGamePrices[gameId];
        
        // Reset classes
        card.classList.remove('locked', 'can-afford');
        
        if (isOwned) {
            card.onclick = () => openCasinoGame(gameId);
        } else {
            card.classList.add('locked');
            
            // Add can-afford class if player has enough points and it's not coming soon
            if (canAfford && !isComingSoon) {
                card.classList.add('can-afford');
            }
            
            card.onclick = () => {
                if (isComingSoon) {
                    alert('This game is coming soon!');
                    return;
                }
                // Try to buy
                if (game.shop.points >= casinoGamePrices[gameId]) {
                    if (confirm(`Buy ${gameId.replace('higherlower', 'Higher/Lower').replace('coinflip', 'Coin Flip')} for ${casinoGamePrices[gameId]} points?`)) {
                        buyCasinoGame(gameId);
                    }
                } else {
                    alert(`Not enough points! Need ${casinoGamePrices[gameId]} points.`);
                }
            };
        }
        
        // Update lock icon
        if (!isOwned && !isComingSoon) {
            if (!card.querySelector('.casino-unlock-price')) {
                const priceTag = document.createElement('div');
                priceTag.className = 'casino-unlock-price';
                priceTag.textContent = `🔓 ${casinoGamePrices[gameId]} pts`;
                card.appendChild(priceTag);
            }
        } else if (isOwned) {
            const existingPrice = card.querySelector('.casino-unlock-price');
            if (existingPrice) existingPrice.remove();
        }
    });
}

function openGambling() {
    SoundEffects.playButton();
    const modal = document.getElementById('gamblingModal');
    modal.classList.add('show');
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
    updateFloatingPointsBadges();
    document.getElementById('gamblingResult').textContent = '';
    document.getElementById('gamblingResult').className = 'gambling-result';
    
    // Update casino UI
    updateCasinoUI();
    
    // Reset to game selection view
    backToCasinoMenu();
}

function updateFloatingPointsBadges() {
    const points = formatPoints(game.shop.points);
    const casinoBadge = document.getElementById('casinoPointsBadge');
    const shopBadge = document.getElementById('shopPointsBadge');
    const questsBadge = document.getElementById('questsPointsBadge');
    if (casinoBadge) casinoBadge.textContent = points;
    if (shopBadge) shopBadge.textContent = points;
    if (questsBadge) questsBadge.textContent = points;
}

function closeGambling() {
    document.getElementById('gamblingModal').classList.remove('show');
    backToCasinoMenu();
}

function openCasinoGame(gameId) {
    const comingSoon = []; // All games are now available!
    
    if (comingSoon.includes(gameId)) {
        alert('This game is coming soon!');
        return;
    }
    
    // Show back button
    const backBtn = document.querySelector('#gamblingModal .modal-buttons .secondary');
    if (backBtn && backBtn.textContent.includes('Back to Games')) {
        backBtn.style.display = '';
    }
    
    if (!isCasinoGameOwned(gameId)) {
        // Trigger buy flow
        if (game.shop.points >= casinoGamePrices[gameId]) {
            if (confirm(`Buy ${gameId.replace('higherlower', 'Higher/Lower').replace('coinflip', 'Coin Flip').replace('slots', 'Slots').replace('blackjack', 'Blackjack').replace('diceroll', 'Dice Duel').replace('roulette', 'Roulette')} for ${casinoGamePrices[gameId]} points?`)) {
                if (!buyCasinoGame(gameId)) return;
            } else {
                return;
            }
        } else {
            alert(`Not enough points! Need ${casinoGamePrices[gameId]} points.`);
            return;
        }
    }
    
    document.getElementById('casinoGamesGrid').style.display = 'none';
    
    if (gameId === 'coinflip') {
        document.getElementById('coinflipGame').style.display = 'block';
        currentCasinoGame = 'coinflip';
    } else if (gameId === 'slots') {
        document.getElementById('slotsGame').style.display = 'block';
        currentCasinoGame = 'slots';
        setupSlots();
    } else if (gameId === 'higherlower') {
        document.getElementById('higherlowerGame').style.display = 'block';
        currentCasinoGame = 'higherlower';
        setupHigherLower();
    } else if (gameId === 'blackjack') {
        document.getElementById('blackjackGame').style.display = 'block';
        currentCasinoGame = 'blackjack';
        setupBlackjack(true); // Auto-start the game
    } else if (gameId === 'diceroll') {
        document.getElementById('dicerollGame').style.display = 'block';
        currentCasinoGame = 'diceroll';
        setupDiceDuel();
    } else if (gameId === 'roulette') {
        document.getElementById('rouletteGame').style.display = 'block';
        currentCasinoGame = 'roulette';
        setupRoulette();
    }
    
    SoundEffects.playButton();
}

function backToCasinoMenu() {
    SoundEffects.playButton();
    document.getElementById('casinoGamesGrid').style.display = 'grid';
    
    // Hide back button (only show when in a game)
    const backBtn = document.querySelector('.modal-buttons .secondary');
    if (backBtn && backBtn.textContent.includes('Back to Games')) {
        backBtn.style.display = 'none';
    }
    
    // Hide all game views
    const coinflipGame = document.getElementById('coinflipGame');
    if (coinflipGame) coinflipGame.style.display = 'none';
    
    const slotsGame = document.getElementById('slotsGame');
    if (slotsGame) slotsGame.style.display = 'none';
    
    const higherlowerGame = document.getElementById('higherlowerGame');
    if (higherlowerGame) higherlowerGame.style.display = 'none';
    
    const blackjackGame = document.getElementById('blackjackGame');
    if (blackjackGame) blackjackGame.style.display = 'none';
    
    // Reset coin state
    const coin = document.getElementById('gamblingCoin');
    if (coin) coin.classList.remove('flipping', 'result-tails');
    
    // Reset higher/lower
    const hiddenCard = document.getElementById('hlHiddenCard');
    if (hiddenCard) hiddenCard.classList.remove('revealed');
    
    // Reset slots
    const reels = document.querySelectorAll('.slot-reel');
    reels.forEach(reel => {
        reel.classList.remove('spinning', 'winning');
    });
    
    // Reset blackjack
    isBlackjackPlaying = false;
    bjPendingAce = null;
    
    // Reset dice duel
    const dicerollGame = document.getElementById('dicerollGame');
    if (dicerollGame) dicerollGame.style.display = 'none';
    
    // Reset roulette
    const rouletteGame = document.getElementById('rouletteGame');
    if (rouletteGame) rouletteGame.style.display = 'none';
    const rouletteWheel = document.getElementById('rouletteWheel');
    if (rouletteWheel) rouletteWheel.classList.remove('spinning');
    isRouletteSpinning = false;
    
    currentCasinoGame = null;
    isGuessing = false;
    isSpinning = false;
    isDiceRolling = false;
    
    // Update points display
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
    updateFloatingPointsBadges();
}

// Close gambling modal when clicking outside
document.getElementById('gamblingModal').addEventListener('click', (e) => {
    if (e.target.id === 'gamblingModal') {
        closeGambling();
    }
});

function setMaxBet(inputId) {
    const maxAllowed = Math.min(game.shop.points, 1000);
    const rounded = Math.round(maxAllowed * 10) / 10;
    document.getElementById(inputId).value = rounded.toFixed(1);
}

function setHalfBet(inputId) {
    const halfAmount = Math.min(game.shop.points / 2, 500);
    const rounded = Math.round(halfAmount * 10) / 10;
    document.getElementById(inputId).value = rounded.toFixed(1);
}

function flipCoin(choice) {
    if (isFlipping) return;
    
    const betInput = document.getElementById('betAmount');
    let bet = parseFloat(betInput.value) || 0;
    
    // Round to nearest integer
    bet = Math.round(bet);
    
    // Enforce limits
    if (bet <= 0) {
        document.getElementById('gamblingResult').textContent = '❌ Enter a valid bet amount!';
        document.getElementById('gamblingResult').className = 'gambling-result lose';
        return;
    }
    
    if (bet > 1000) {
        bet = 1000;
        betInput.value = '1000';
        document.getElementById('gamblingResult').textContent = '⚠️ Maximum bet is 1000 points!';
        document.getElementById('gamblingResult').className = 'gambling-result';
        setTimeout(() => {
            document.getElementById('gamblingResult').textContent = '';
        }, 2000);
        return;
    }
    
    if (bet > game.shop.points) {
        document.getElementById('gamblingResult').textContent = '❌ Not enough points!';
        document.getElementById('gamblingResult').className = 'gambling-result lose';
        return;
    }
    
    isFlipping = true;
    
    // Update floating points immediately after deducting bet
    updateFloatingPointsBadges();
    
    // Disable buttons during flip
    document.getElementById('headsBtn').disabled = true;
    document.getElementById('tailsBtn').disabled = true;
    
    const coin = document.getElementById('gamblingCoin');
    const resultDiv = document.getElementById('gamblingResult');
    
    // Determine result
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = choice === result;
    
    // Reset coin
    coin.classList.remove('flipping', 'result-tails');
    coin.offsetHeight; // Force reflow
    
    // Add appropriate animation class
    if (result === 'tails') {
        coin.classList.add('flipping', 'result-tails');
    } else {
        coin.classList.add('flipping');
    }
    
    resultDiv.textContent = '';
    resultDiv.className = 'gambling-result';
    
    // Play coin flip sound
    SoundEffects.playCoinFlip();
    SoundEffects.playBetPlace();
    
    // Show result after animation
    setTimeout(() => {
        if (won) {
            const winnings = bet * 2;
            game.shop.points += winnings; // Add back full winnings (bet was already deducted)
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            resultDiv.textContent = `🎉 ${result.toUpperCase()}! You won ${winnings} points!`;
            resultDiv.className = 'gambling-result win';
            SoundEffects.playCasinoWin();
            trackQuestProgress('points', bet); // Track net gain
            trackQuestProgress('casinowin', 1);
            trackQuestProgress('highbet', bet); // Track high bet
        } else {
            // Bet was already deducted, nothing to do
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            resultDiv.textContent = `💔 ${result.toUpperCase()}! You lost ${bet} points!`;
            resultDiv.className = 'gambling-result lose';
            SoundEffects.playCasinoLose();
            trackQuestProgress('casinolose', 1);
        }
        
        // Update displays
        document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
        game.saveShop();
        updateFloatingPointsBadges();
        document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
        document.getElementById('shopPointsStat').textContent = formatPoints(game.shop.points);
        
        // Re-enable buttons
        document.getElementById('headsBtn').disabled = false;
        document.getElementById('tailsBtn').disabled = false;
        isFlipping = false;
        
        // Update bet input if it exceeds current points
        if (parseInt(betInput.value) > game.shop.points) {
            betInput.value = currentPoints > 0 ? currentPoints : 1;
        }
    }, 2000);
}

// ==================== SLOTS GAME ====================
function setupSlots() {
    loadSlotsState();
    updateSlotsUI();
    
    // Reset result
    document.getElementById('slotsResult').textContent = '';
    document.getElementById('slotsResult').className = 'gambling-result';
    
    // Reset reels
    const reels = document.querySelectorAll('.slot-reel');
    reels.forEach(reel => {
        reel.classList.remove('spinning', 'winning');
    });
    
    // Enable spin button if player has points
    document.getElementById('spinBtn').disabled = game.shop.points < 1;
}

function updateSlotsUI() {
    const iconCount = slotsAvailableIcons.length;
    document.getElementById('slotsIconCount').textContent = iconCount;
    document.getElementById('slotsLevel').textContent = slotsLevel;
    document.getElementById('slotsIconsRemaining').textContent = iconCount;
    
    // Update upgrade button
    const upgradeBtn = document.getElementById('upgradeBtn');
    const upgradePriceSpan = document.getElementById('upgradePrice');
    
    if (slotsLevel >= 3) {
        upgradeBtn.disabled = true;
        upgradeBtn.textContent = '✅ MAX LEVEL';
    } else {
        const nextPrice = SLOT_UPGRADE_PRICES[slotsLevel];
        upgradePriceSpan.textContent = nextPrice;
        upgradeBtn.disabled = game.shop.points < nextPrice;
    }
    
    // Update spin button
    document.getElementById('spinBtn').disabled = game.shop.points < 1 || isSpinning;
}

function spinSlots() {
    if (isSpinning) return;
    if (game.shop.points < 1) {
        document.getElementById('slotsResult').textContent = '❌ Not enough points! Need 1 pt to spin.';
        document.getElementById('slotsResult').className = 'gambling-result lose';
        return;
    }
    
    isSpinning = true;
    
    // Deduct cost
    game.shop.points -= 1;
    game.saveShop();
    SoundEffects.playBetPlace();
    updateFloatingPointsBadges();
    
    // Disable buttons
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('upgradeBtn').disabled = true;
    
    // Clear previous result
    document.getElementById('slotsResult').textContent = '';
    document.getElementById('slotsResult').className = 'gambling-result';
    
    // Get reel elements
    const reel1 = document.getElementById('slotReel1');
    const reel2 = document.getElementById('slotReel2');
    const reel3 = document.getElementById('slotReel3');
    const reels = [reel1, reel2, reel3];
    
    // Remove winning class
    reels.forEach(reel => {
        reel.classList.remove('winning');
        reel.classList.add('spinning');
    });
    
    // Play spinning sound
    SoundEffects.playSlotSpin();
    
    // Determine final symbols
    const results = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * slotsAvailableIcons.length);
        results.push(slotsAvailableIcons[randomIndex]);
    }
    
    // Animate each reel stopping one by one
    const stopTimes = [800, 1400, 2000];
    
    reels.forEach((reel, i) => {
        // Rapid symbol changing animation
        let spinInterval = setInterval(() => {
            const randomSymbol = slotsAvailableIcons[Math.floor(Math.random() * slotsAvailableIcons.length)];
            reel.querySelector('.slot-symbol').textContent = randomSymbol;
        }, 80);
        
        setTimeout(() => {
            clearInterval(spinInterval);
            reel.classList.remove('spinning');
            reel.querySelector('.slot-symbol').textContent = results[i];
            SoundEffects.playSlotStop();
        }, stopTimes[i]);
    });
    
    // Check result after all reels stop
    setTimeout(() => {
        const resultDiv = document.getElementById('slotsResult');
        const isJackpot = results[0] === results[1] && results[1] === results[2];
        
        if (isJackpot) {
            // JACKPOT! All three match
            const winnings = 77.7;
            game.shop.points += winnings; // Add full winnings (1 pt cost was already deducted)
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            resultDiv.textContent = `🎰 JACKPOT! ${results[0]}${results[1]}${results[2]} - You won ${winnings} points!`;
            resultDiv.className = 'gambling-result win';
            SoundEffects.playJackpot();
            
            // Add winning animation to reels
            reels.forEach(reel => reel.classList.add('winning'));
            
            // Track for quests
            trackQuestProgress('casinowin', 1);
            trackQuestProgress('slotsjackpot', 1);
        } else {
            // No win - cost already deducted
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            resultDiv.textContent = `${results[0]}${results[1]}${results[2]} - No match. Try again!`;
            resultDiv.className = 'gambling-result lose';
            SoundEffects.playCasinoLose();
            trackQuestProgress('casinolose', 1);
        }
        
        // Update displays
        document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
        game.saveShop();
        updateFloatingPointsBadges();
        document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
        document.getElementById('shopPointsStat').textContent = formatPoints(game.shop.points);
        
        isSpinning = false;
        updateSlotsUI();
    }, 2200);
}

function upgradeSlots() {
    if (slotsLevel >= 3) {
        document.getElementById('slotsResult').textContent = '✅ Slot machine is at max level!';
        return;
    }
    
    const price = SLOT_UPGRADE_PRICES[slotsLevel];
    
    if (game.shop.points < price) {
        document.getElementById('slotsResult').textContent = `❌ Not enough points! Need ${price} pts.`;
        document.getElementById('slotsResult').className = 'gambling-result lose';
        return;
    }
    
    // Deduct price
    game.shop.points -= price;
    
    // Upgrade - remove one icon from the available pool
    slotsLevel++;
    slotsAvailableIcons = SLOT_ICONS.slice(0, SLOT_ICONS.length - slotsLevel);
    
    saveSlotsState();
    
    // Show result
    const removedIcon = SLOT_ICONS[SLOT_ICONS.length - slotsLevel];
    document.getElementById('slotsResult').textContent = `⬆️ Upgraded to Level ${slotsLevel}! Removed ${removedIcon}. Now ${slotsAvailableIcons.length} icons.`;
    document.getElementById('slotsResult').className = 'gambling-result win';
    
    SoundEffects.playUnlock();
    
    // Update displays
    const currentPoints = game.shop.points;
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(currentPoints);
    game.saveShop();
    document.getElementById('shopPointsDisplay').textContent = formatPoints(currentPoints);
    document.getElementById('shopPointsStat').textContent = formatPoints(currentPoints);
    
    updateSlotsUI();
}

// ==================== HIGHER/LOWER GAME ====================
function setupHigherLower() {
    // Generate two different random numbers 1-100
    hlHiddenNumber = Math.floor(Math.random() * 100) + 1;
    hlShownNumber = Math.floor(Math.random() * 100) + 1;
    
    // Make sure they're different
    while (hlShownNumber === hlHiddenNumber) {
        hlShownNumber = Math.floor(Math.random() * 100) + 1;
    }
    
    // Update UI
    document.getElementById('hlShownNumber').textContent = hlShownNumber;
    document.getElementById('hlHiddenNumber').textContent = hlHiddenNumber;
    document.getElementById('hlHiddenNumber').style.display = 'none';
    document.querySelector('#hlHiddenCard .hl-question').style.display = 'block';
    document.getElementById('hlHiddenCard').classList.remove('revealed');
    document.getElementById('hlResult').textContent = '';
    document.getElementById('hlResult').className = 'gambling-result';
    
    // Enable buttons
    document.getElementById('higherBtn').disabled = false;
    document.getElementById('lowerBtn').disabled = false;
    
    isGuessing = false;
}

function guessHigherLower(guess) {
    if (isGuessing) return;
    
    const betInput = document.getElementById('hlBetAmount');
    const bet = parseInt(betInput.value) || 0;
    
    if (bet <= 0) {
        document.getElementById('hlResult').textContent = '❌ Enter a valid bet amount!';
        document.getElementById('hlResult').className = 'gambling-result lose';
        return;
    }
    
    if (bet > game.shop.points) {
        document.getElementById('hlResult').textContent = '❌ Not enough points!';
        document.getElementById('hlResult').className = 'gambling-result lose';
        return;
    }
    
    isGuessing = true;
    
    // Disable buttons
    document.getElementById('higherBtn').disabled = true;
    document.getElementById('lowerBtn').disabled = true;
    
    // Play bet sound
    SoundEffects.playBetPlace();
    
    // Deduct bet and update floating points
    game.shop.points -= bet;
    game.saveShop();
    updateFloatingPointsBadges();
    
    // Reveal the hidden number
    document.querySelector('#hlHiddenCard .hl-question').style.display = 'none';
    document.getElementById('hlHiddenNumber').style.display = 'block';
    document.getElementById('hlHiddenCard').classList.add('revealed');
    
    const resultDiv = document.getElementById('hlResult');
    
    // Determine if correct
    const isHigher = hlHiddenNumber > hlShownNumber;
    const won = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);
    
    setTimeout(() => {
        if (won) {
            const winnings = bet * 1.5;
            game.shop.points += winnings; // Add back full winnings (bet was already deducted)
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            resultDiv.textContent = `🎉 Correct! Hidden was ${hlHiddenNumber} (${isHigher ? 'HIGHER' : 'LOWER'}). You won ${winnings} points!`;
            resultDiv.className = 'gambling-result win';
            SoundEffects.playCasinoWin();
            trackQuestProgress('casinowin', 1);
            trackQuestProgress('highbet', bet);
        } else {
            // Bet was already deducted, nothing to do
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            resultDiv.textContent = `💔 Wrong! Hidden was ${hlHiddenNumber} (${isHigher ? 'HIGHER' : 'LOWER'}). You lost ${bet} points!`;
            resultDiv.className = 'gambling-result lose';
            SoundEffects.playCasinoLose();
            trackQuestProgress('casinolose', 1);
        }
        
        // Update displays
        document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
        game.saveShop();
        updateFloatingPointsBadges();
        document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
        document.getElementById('shopPointsStat').textContent = formatPoints(game.shop.points);
        
        // Update bet input if it exceeds current points
        if (parseInt(betInput.value) > game.shop.points) {
            betInput.value = currentPoints > 0 ? currentPoints : 1;
        }
        
        // Set up new game after delay
        setTimeout(() => {
            setupHigherLower();
        }, 2000);
    }, 500);
}

// ==================== BLACKJACK GAME ====================
const BJ_CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const BJ_SUITS = ['♠', '♥', '♦', '♣'];

function getCardValue(card, preferHigh = true) {
    const rank = card.rank;
    if (rank === 'A') return preferHigh ? 11 : 1;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
}

function calculateHandTotal(cards, isDealer = false) {
    let total = 0;
    let aces = 0;
    
    for (const card of cards) {
        if (card.rank === 'A') {
            aces++;
            total += 11; // Start with 11
        } else {
            total += getCardValue(card);
        }
    }
    
    // For dealer: automatically reduce aces to prevent bust
    // For player: we handle ace choice separately
    if (isDealer) {
        while (total > 21 && aces > 0) {
            total -= 10; // Change ace from 11 to 1
            aces--;
        }
    }
    
    return total;
}

function drawRandomCard() {
    const rank = BJ_CARDS[Math.floor(Math.random() * BJ_CARDS.length)];
    const suit = BJ_SUITS[Math.floor(Math.random() * BJ_SUITS.length)];
    const isRed = suit === '♥' || suit === '♦';
    return { rank, suit, isRed };
}

function renderCard(card, hidden = false) {
    const div = document.createElement('div');
    div.className = `bj-card ${hidden ? 'hidden' : (card.isRed ? 'red' : 'black')}`;
    if (!hidden) {
        div.textContent = card.rank + card.suit;
    }
    return div;
}

function updateBlackjackDisplay() {
    const dealerCardsEl = document.getElementById('bjDealerCards');
    const playerCardsEl = document.getElementById('bjPlayerCards');
    const dealerTotalEl = document.getElementById('bjDealerTotal');
    const playerTotalEl = document.getElementById('bjPlayerTotal');
    
    // Clear
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';
    
    // Render dealer cards
    bjDealerCards.forEach((card, i) => {
        if (i === 0 && bjDealerHiddenCard && isBlackjackPlaying) {
            dealerCardsEl.appendChild(renderCard(card, true));
        } else {
            dealerCardsEl.appendChild(renderCard(card));
        }
    });
    
    // Render player cards
    bjPlayerCards.forEach(card => {
        playerCardsEl.appendChild(renderCard(card));
    });
    
    // Update totals
    bjPlayerTotal = calculateHandTotal(bjPlayerCards);
    
    if (bjDealerHiddenCard && isBlackjackPlaying) {
        // Only show visible card value
        const visibleCards = bjDealerCards.slice(1);
        const visibleTotal = calculateHandTotal(visibleCards, true);
        dealerTotalEl.textContent = `(${visibleTotal}+?)`;
    } else {
        bjDealerTotal = calculateHandTotal(bjDealerCards, true);
        dealerTotalEl.textContent = `(${bjDealerTotal})`;
    }
    
    playerTotalEl.textContent = `(${bjPlayerTotal})`;
}

function setupBlackjack(autoStart = false) {
    // Reset state
    bjPlayerCards = [];
    bjDealerCards = [];
    bjPlayerTotal = 0;
    bjDealerTotal = 0;
    bjCurrentBet = 0;
    bjPendingAce = null;
    bjDealerHiddenCard = null;
    isBlackjackPlaying = false;
    
    // Reset UI
    document.getElementById('bjResult').textContent = '';
    document.getElementById('bjResult').className = 'gambling-result';
    document.getElementById('bjBetSection').style.display = 'block';
    document.getElementById('bjStartButtons').style.display = 'flex';
    document.getElementById('bjGameButtons').style.display = 'none';
    document.getElementById('bjAceChoice').style.display = 'none';
    document.getElementById('bjDealBtn').disabled = game.shop.points < 1;
    document.getElementById('bjHitBtn').disabled = false;
    document.getElementById('bjStandBtn').disabled = false;
    
    // Clear cards
    document.getElementById('bjDealerCards').innerHTML = '';
    document.getElementById('bjPlayerCards').innerHTML = '';
    document.getElementById('bjDealerTotal').textContent = '';
    document.getElementById('bjPlayerTotal').textContent = '';
    
    // Don't auto-start - let player choose their bet first
    if (autoStart) {
        document.getElementById('bjBetAmount').value = '10';
    }
}

function startBlackjack() {
    const betInput = document.getElementById('bjBetAmount');
    const bet = parseInt(betInput.value) || 0;
    
    if (bet <= 0) {
        document.getElementById('bjResult').textContent = '❌ Enter a valid bet amount!';
        document.getElementById('bjResult').className = 'gambling-result lose';
        return;
    }
    
    if (bet > game.shop.points) {
        document.getElementById('bjResult').textContent = '❌ Not enough points!';
        document.getElementById('bjResult').className = 'gambling-result lose';
        return;
    }
    
    // Track blackjack play for quests
    trackQuestProgress('blackjack', 1);
    
    // Deduct bet
    bjCurrentBet = bet;
    game.shop.points -= bet;
    game.saveShop();
    SoundEffects.playBetPlace();
    updateFloatingPointsBadges();
    
    isBlackjackPlaying = true;
    bjPlayerStood = false;
    bjDealerStood = false;
    bjIsPlayerTurn = true;
    
    // Hide bet section, show game buttons
    document.getElementById('bjBetSection').style.display = 'none';
    document.getElementById('bjStartButtons').style.display = 'none';
    document.getElementById('bjGameButtons').style.display = 'flex';
    document.getElementById('bjResult').textContent = '';
    
    // Deal initial cards
    bjPlayerCards = [];
    bjDealerCards = [];
    
    // Deal 2 cards each
    bjPlayerCards.push(drawRandomCard());
    bjDealerCards.push(drawRandomCard());
    bjDealerHiddenCard = bjDealerCards[0]; // First dealer card is hidden
    bjPlayerCards.push(drawRandomCard());
    bjDealerCards.push(drawRandomCard());
    
    updateBlackjackDisplay();
    updateBlackjackTurnIndicator();
    
    // Update points display
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
    
    // Check for immediate blackjack (21 with 2 cards)
    bjPlayerTotal = calculateBestPlayerTotal(bjPlayerCards);
    if (bjPlayerTotal === 21) {
        document.getElementById('bjResult').textContent = '🎰 Blackjack! Standing automatically...';
        setTimeout(() => blackjackStand(), 500);
    }
}

function blackjackHit() {
    if (!isBlackjackPlaying || !bjIsPlayerTurn || bjPlayerStood) return;
    
    SoundEffects.playButton();
    
    // Draw a card
    const newCard = drawRandomCard();
    bjPlayerCards.push(newCard);
    
    updateBlackjackDisplay();
    
    // Check for bust immediately
    bjPlayerTotal = calculateBestPlayerTotal(bjPlayerCards);
    if (bjPlayerTotal > 21) {
        endBlackjack('bust');
        return;
    }
    
    // Check if player hit 21 - auto stand
    if (bjPlayerTotal === 21) {
        document.getElementById('bjResult').textContent = '🎯 21! Standing automatically...';
        setTimeout(() => blackjackStand(), 500);
        return;
    }
    
    // After player hits, it's dealer's turn
    bjIsPlayerTurn = false;
    updateBlackjackTurnIndicator();
    setTimeout(() => dealerTurn(), 800);
}

function calculateBestPlayerTotal(cards) {
    let total = 0;
    let aces = 0;
    
    for (const card of cards) {
        if (card.rank === 'A') {
            aces++;
            total += 11;
        } else {
            total += getCardValue(card);
        }
    }
    
    // Reduce aces to 1 if needed to avoid bust
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    
    return total;
}

function recalculateWithLowAces(cards) {
    return calculateBestPlayerTotal(cards);
}

function blackjackStand() {
    if (!isBlackjackPlaying) return;
    
    SoundEffects.playButton();
    bjPlayerStood = true;
    
    // Reveal dealer's hidden card once player stands
    bjDealerHiddenCard = null;
    updateBlackjackDisplay();
    
    // Disable player buttons since they've stood
    document.getElementById('bjHitBtn').disabled = true;
    document.getElementById('bjStandBtn').disabled = true;
    
    // Dealer's turn - will keep drawing until done
    bjIsPlayerTurn = false;
    updateBlackjackTurnIndicator();
    dealerTurn();
}

function dealerTurn() {
    bjDealerTotal = calculateHandTotal(bjDealerCards, true);
    updateBlackjackDisplay();
    
    // If player hasn't stood yet, dealer just takes one action then passes back
    if (!bjPlayerStood) {
        // Dealer decides: hit if under 17, stand otherwise
        if (bjDealerTotal < 17) {
            setTimeout(() => {
                const newCard = drawRandomCard();
                bjDealerCards.push(newCard);
                SoundEffects.playButton();
                bjDealerTotal = calculateHandTotal(bjDealerCards, true);
                updateBlackjackDisplay();
                
                // Check if dealer busted
                if (bjDealerTotal > 21) {
                    endBlackjack('dealerBust');
                    return;
                }
                
                // Pass turn back to player
                bjIsPlayerTurn = true;
                updateBlackjackTurnIndicator();
            }, 800);
        } else {
            // Dealer stands for this turn
            bjDealerStood = true;
            document.getElementById('bjResult').textContent = '🤖 Dealer stands at ' + bjDealerTotal;
            
            // Pass turn back to player
            setTimeout(() => {
                bjIsPlayerTurn = true;
                updateBlackjackTurnIndicator();
            }, 500);
        }
    } else {
        // Player has stood - dealer plays until finished
        if (bjDealerTotal < 17) {
            setTimeout(() => {
                const newCard = drawRandomCard();
                bjDealerCards.push(newCard);
                SoundEffects.playButton();
                bjDealerTotal = calculateHandTotal(bjDealerCards, true);
                updateBlackjackDisplay();
                
                // Check if dealer busted
                if (bjDealerTotal > 21) {
                    endBlackjack('dealerBust');
                    return;
                }
                
                // Continue drawing
                dealerTurn();
            }, 800);
        } else {
            // Dealer stops at 17+ - compare hands
            endBlackjack('compare');
        }
    }
}

function endBlackjack(reason) {
    isBlackjackPlaying = false;
    
    // Disable game buttons
    document.getElementById('bjHitBtn').disabled = true;
    document.getElementById('bjStandBtn').disabled = true;
    
    const resultDiv = document.getElementById('bjResult');
    
    // Final totals
    bjPlayerTotal = calculateBestPlayerTotal(bjPlayerCards);
    bjDealerTotal = calculateHandTotal(bjDealerCards, true);
    
    // Reveal hidden card if not already
    bjDealerHiddenCard = null;
    updateBlackjackDisplay();
    
    let won = false;
    let message = '';
    
    if (reason === 'bust') {
        message = `💔 Bust! You went over 21 (${bjPlayerTotal}). You lost ${bjCurrentBet} points.`;
        SoundEffects.playCasinoLose();
    } else if (reason === 'dealerBust') {
        // Dealer busted - player wins!
        won = true;
        message = `🎉 Dealer busts at ${bjDealerTotal}! You win ${bjCurrentBet * 2} points!`;
    } else { // compare
        if (bjPlayerTotal > bjDealerTotal) {
            won = true;
            message = `🎉 You win! ${bjPlayerTotal} beats dealer's ${bjDealerTotal}. Won ${bjCurrentBet * 2} points!`;
        } else if (bjPlayerTotal < bjDealerTotal) {
            message = `💔 Dealer wins! ${bjDealerTotal} beats your ${bjPlayerTotal}. Lost ${bjCurrentBet} points.`;
            SoundEffects.playCasinoLose();
            trackQuestProgress('casinolose', 1);
        } else {
            // Push - return bet
            game.shop.points += bjCurrentBet;
            game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
            message = `🤝 Push! Both have ${bjPlayerTotal}. Bet returned.`;
            SoundEffects.playButton();
        }
    }
    
    if (won) {
        const winnings = bjCurrentBet * 2;
        game.shop.points += winnings; // Add full winnings (bet was already deducted in startBlackjack)
        game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
        resultDiv.className = 'gambling-result win';
        SoundEffects.playCasinoWin();
        trackQuestProgress('casinowin', 1);
        trackQuestProgress('highbet', bjCurrentBet);
    } else if (reason === 'bust' || bjPlayerTotal < bjDealerTotal) {
        // Bet was already deducted, nothing to add back
        game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
        resultDiv.className = 'gambling-result lose';
        if (reason === 'bust') trackQuestProgress('casinolose', 1);
    }
    
    resultDiv.textContent = message;
    
    // Update displays
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
    game.saveShop();
    updateFloatingPointsBadges();
    document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
    document.getElementById('shopPointsStat').textContent = formatPoints(game.shop.points);
    
    // Reset after delay
    setTimeout(() => {
        setupBlackjack();
    }, 3000);
}

function updateBlackjackTurnIndicator() {
    const resultDiv = document.getElementById('bjResult');
    if (!isBlackjackPlaying) return;
    
    if (bjPlayerStood) {
        resultDiv.textContent = '🤖 Dealer is playing...';
    } else if (bjIsPlayerTurn) {
        resultDiv.textContent = '👤 Your turn - Hit or Stand?';
        document.getElementById('bjHitBtn').disabled = false;
        document.getElementById('bjStandBtn').disabled = false;
    } else {
        resultDiv.textContent = '🤖 Dealer\'s turn...';
        document.getElementById('bjHitBtn').disabled = true;
        document.getElementById('bjStandBtn').disabled = true;
    }
}

function chooseAceValue(value) {
    // This function is for manual ace choice if needed
    // Currently we auto-choose based on bust prevention
    document.getElementById('bjAceChoice').style.display = 'none';
}

// ==================== DICE DUEL GAME ====================
let isDiceRolling = false;
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function setupDiceDuel() {
    // Reset dice display
    document.getElementById('playerDice1').textContent = '⚀';
    document.getElementById('playerDice2').textContent = '⚀';
    document.getElementById('dealerDice1').textContent = '?';
    document.getElementById('dealerDice2').textContent = '?';
    document.getElementById('playerDiceTotal').textContent = '-';
    document.getElementById('dealerDiceTotal').textContent = '-';
    document.getElementById('diceResult').textContent = '';
    document.getElementById('diceResult').className = 'gambling-result';
    document.getElementById('diceRollBtn').disabled = false;
    document.getElementById('diceBetSection').style.display = 'flex';
    isDiceRolling = false;
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function playDiceDuel() {
    if (isDiceRolling) return;
    
    const betInput = document.getElementById('diceBetAmount');
    const bet = parseInt(betInput.value) || 0;
    
    if (bet <= 0) {
        alert('Please enter a valid bet amount!');
        return;
    }
    
    if (bet > game.shop.points) {
        alert('Not enough points!');
        return;
    }
    
    // Deduct bet
    game.shop.points -= bet;
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
    game.saveShop();
    updateFloatingPointsBadges();
    
    isDiceRolling = true;
    document.getElementById('diceRollBtn').disabled = true;
    document.getElementById('diceBetSection').style.display = 'none';
    
    const playerDice1El = document.getElementById('playerDice1');
    const playerDice2El = document.getElementById('playerDice2');
    const dealerDice1El = document.getElementById('dealerDice1');
    const dealerDice2El = document.getElementById('dealerDice2');
    const playerTotalEl = document.getElementById('playerDiceTotal');
    const dealerTotalEl = document.getElementById('dealerDiceTotal');
    const resultDiv = document.getElementById('diceResult');
    
    // Animate player dice
    let rollCount = 0;
    const maxRolls = 15;
    
    SoundEffects.playButton();
    
    const rollInterval = setInterval(() => {
        playerDice1El.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
        playerDice2El.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
        playerDice1El.classList.add('dice-rolling');
        playerDice2El.classList.add('dice-rolling');
        rollCount++;
        
        if (rollCount >= maxRolls) {
            clearInterval(rollInterval);
            
            // Final player roll
            const playerRoll1 = rollDice();
            const playerRoll2 = rollDice();
            const playerTotal = playerRoll1 + playerRoll2;
            
            playerDice1El.textContent = DICE_FACES[playerRoll1 - 1];
            playerDice2El.textContent = DICE_FACES[playerRoll2 - 1];
            playerDice1El.classList.remove('dice-rolling');
            playerDice2El.classList.remove('dice-rolling');
            playerTotalEl.textContent = playerTotal;
            
            SoundEffects.playButton();
            
            // Animate dealer dice after a short delay
            setTimeout(() => {
                let dealerRollCount = 0;
                dealerDice1El.textContent = DICE_FACES[0];
                dealerDice2El.textContent = DICE_FACES[0];
                
                const dealerRollInterval = setInterval(() => {
                    dealerDice1El.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
                    dealerDice2El.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
                    dealerDice1El.classList.add('dice-rolling');
                    dealerDice2El.classList.add('dice-rolling');
                    dealerRollCount++;
                    
                    if (dealerRollCount >= maxRolls) {
                        clearInterval(dealerRollInterval);
                        
                        // Final dealer roll
                        const dealerRoll1 = rollDice();
                        const dealerRoll2 = rollDice();
                        const dealerTotal = dealerRoll1 + dealerRoll2;
                        
                        dealerDice1El.textContent = DICE_FACES[dealerRoll1 - 1];
                        dealerDice2El.textContent = DICE_FACES[dealerRoll2 - 1];
                        dealerDice1El.classList.remove('dice-rolling');
                        dealerDice2El.classList.remove('dice-rolling');
                        dealerTotalEl.textContent = dealerTotal;
                        
                        // Determine winner
                        setTimeout(() => {
                            if (playerTotal > dealerTotal) {
                                // Player wins
                                const winnings = bet * 2;
                                game.shop.points += winnings; // Add full winnings (bet was already deducted)
                                game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
                                resultDiv.textContent = `🎉 You win! ${playerTotal} beats ${dealerTotal}! +${winnings} points!`;
                                resultDiv.className = 'gambling-result win';
                                SoundEffects.playCasinoWin();
                                trackQuestProgress('casinowin', 1);
                                trackQuestProgress('highbet', bet);
                            } else if (playerTotal < dealerTotal) {
                                // Dealer wins - bet already deducted
                                game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
                                resultDiv.textContent = `💔 Dealer wins! ${dealerTotal} beats your ${playerTotal}. Lost ${bet} points.`;
                                resultDiv.className = 'gambling-result lose';
                                SoundEffects.playCasinoLose();
                                trackQuestProgress('casinolose', 1);
                            } else {
                                // Tie - return bet
                                game.shop.points += bet;
                                game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
                                resultDiv.textContent = `🤝 Tie! Both rolled ${playerTotal}. Bet returned.`;
                                resultDiv.className = 'gambling-result';
                                SoundEffects.playButton();
                            }
                            
                            // Update displays
                            document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
                            game.saveShop();
                            updateFloatingPointsBadges();
                            document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
                            document.getElementById('shopPointsStat').textContent = formatPoints(game.shop.points);
                            
                            // Reset after delay
                            setTimeout(() => {
                                setupDiceDuel();
                            }, 2500);
                        }, 500);
                    }
                }, 80);
            }, 600);
        }
    }, 80);
}

// ==================== ROULETTE ====================
let rouletteBetType = 'color'; // 'color' or 'number'
let rouletteColorChoice = 'red'; // 'red', 'black', or 'green'
let rouletteNumberChoice = 1;
let rouletteCurrentRotation = 0;

// Load saved roulette preferences
function loadRoulettePreferences() {
    const saved = localStorage.getItem('roulettePreferences');
    if (saved) {
        const prefs = JSON.parse(saved);
        rouletteBetType = prefs.betType || 'color';
        rouletteColorChoice = prefs.colorChoice || 'red';
        rouletteNumberChoice = prefs.numberChoice !== undefined ? prefs.numberChoice : 1;
    }
}

function saveRoulettePreferences() {
    localStorage.setItem('roulettePreferences', JSON.stringify({
        betType: rouletteBetType,
        colorChoice: rouletteColorChoice,
        numberChoice: rouletteNumberChoice
    }));
}

// Number colors: 0 = green, odd = red, even = black
const ROULETTE_COLORS = {
    0: 'green',
    1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red',
    6: 'black', 7: 'red', 8: 'black', 9: 'red'
};

// Wheel order: numbers arranged around the wheel (0 at top, going clockwise)
const ROULETTE_WHEEL_ORDER = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1];

function initRouletteNumbers() {
    // No numbers displayed on the wheel - just the colored segments spin
}

function setupRoulette() {
    document.getElementById('rouletteNumber').textContent = '?';
    document.getElementById('rouletteResult').textContent = '';
    document.getElementById('rouletteResult').className = 'gambling-result';
    document.getElementById('rouletteSpinBtn').disabled = false;
    document.getElementById('rouletteBetOptions').style.display = 'flex';
    
    const wheel = document.getElementById('rouletteWheel');
    wheel.classList.remove('spinning', 'stopping');
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(${rouletteCurrentRotation}deg)`;
    
    isRouletteSpinning = false;
    
    // Load saved preferences
    loadRoulettePreferences();
    
    // Apply saved preferences to UI
    selectRouletteBetType(rouletteBetType);
    if (rouletteBetType === 'color') {
        selectRouletteColor(rouletteColorChoice);
    } else {
        selectRouletteNumber(rouletteNumberChoice);
    }
}

function selectRouletteBetType(type) {
    rouletteBetType = type;
    
    // Update button states
    document.getElementById('betTypeColor').classList.toggle('active', type === 'color');
    document.getElementById('betTypeNumber').classList.toggle('active', type === 'number');
    
    // Show/hide appropriate section
    document.getElementById('colorBetSection').style.display = type === 'color' ? 'flex' : 'none';
    document.getElementById('numberBetSection').style.display = type === 'number' ? 'flex' : 'none';
    
    saveRoulettePreferences();
    SoundEffects.playButton();
}

function selectRouletteColor(color) {
    rouletteColorChoice = color;
    
    document.getElementById('betRed').classList.toggle('active', color === 'red');
    document.getElementById('betBlack').classList.toggle('active', color === 'black');
    document.getElementById('betGreen').classList.toggle('active', color === 'green');
    
    saveRoulettePreferences();
    SoundEffects.playButton();
}

function selectRouletteNumber(num) {
    rouletteNumberChoice = num;
    
    // Update all number buttons
    const numberBtns = document.querySelectorAll('.number-btn');
    numberBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === num);
    });
    
    saveRoulettePreferences();
    SoundEffects.playButton();
}

function spinRoulette() {
    if (isRouletteSpinning) return;
    
    const betInput = document.getElementById('rouletteBetAmount');
    const bet = parseInt(betInput.value) || 0;
    
    if (bet <= 0) {
        alert('Please enter a valid bet amount!');
        return;
    }
    
    if (bet > game.shop.points) {
        alert('Not enough points!');
        return;
    }
    
    // Deduct bet
    game.shop.points -= bet;
    document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
    game.saveShop();
    updateFloatingPointsBadges();
    
    isRouletteSpinning = true;
    document.getElementById('rouletteSpinBtn').disabled = true;
    document.getElementById('rouletteBetOptions').style.display = 'none';
    
    const wheel = document.getElementById('rouletteWheel');
    const numberDisplay = document.getElementById('rouletteNumber');
    const resultDiv = document.getElementById('rouletteResult');
    
    // Determine result (0-9)
    const result = Math.floor(Math.random() * 10);
    const resultColor = ROULETTE_COLORS[result];
    
    // Find the position of the result number in the wheel order
    const resultIndex = ROULETTE_WHEEL_ORDER.indexOf(result);
    
    // Calculate rotation: each number is 36 degrees apart
    // We need the result number to end up at the top (under the pointer)
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const targetDegree = resultIndex * 36; // Position of the number
    const totalRotation = rouletteCurrentRotation + (extraSpins * 360) + targetDegree;
    
    // Start spinning animation
    wheel.classList.remove('spinning', 'stopping');
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    // Force reflow to ensure animation starts fresh
    void wheel.offsetWidth;
    wheel.classList.add('spinning');
    numberDisplay.textContent = '?';
    resultDiv.textContent = '';
    resultDiv.className = 'gambling-result';
    
    SoundEffects.playSlotSpin();
    
    // After 400ms, stop spinning and transition to final position (1000ms total)
    setTimeout(() => {
        wheel.classList.remove('spinning');
        // Force reflow before adding transition
        void wheel.offsetWidth;
        wheel.style.transition = 'transform 0.6s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        wheel.style.transform = `rotate(${totalRotation}deg)`;
        rouletteCurrentRotation = totalRotation % 360;
        
        // Wait for the transition to complete (600ms)
        setTimeout(() => {
            wheel.classList.remove('stopping');
            SoundEffects.playSlotStop();
            
            // Show number with color emoji immediately
            const colorEmoji = resultColor === 'red' ? '🔴' : resultColor === 'black' ? '⚫' : '🟢';
            numberDisplay.textContent = `${colorEmoji} ${result}`;
            
            // Determine win
            let won = false;
            let multiplier = 0;
            
            if (rouletteBetType === 'color') {
                if (rouletteColorChoice === resultColor) {
                    won = true;
                    multiplier = rouletteColorChoice === 'green' ? 14 : 2;
                }
            } else {
                if (rouletteNumberChoice === result) {
                    won = true;
                    multiplier = 10;
                }
            }
            
            setTimeout(() => {
                if (won) {
                    const winnings = bet * multiplier;
                    game.shop.points += winnings; // Add full winnings (bet was already deducted)
                    game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
                    resultDiv.textContent = `🎉 ${colorEmoji} ${result}! You win ${multiplier}x! +${winnings} points!`;
                    resultDiv.className = 'gambling-result win';
                    SoundEffects.playCasinoWin();
                    trackQuestProgress('casinowin', 1);
                    trackQuestProgress('highbet', bet);
                } else {
                    // Bet was already deducted, nothing to do
                    game.shop.points = Math.round(game.shop.points * 10) / 10; // Round to tenths
                    const betTypeText = rouletteBetType === 'color' ? rouletteColorChoice : `number ${rouletteNumberChoice}`;
                    resultDiv.textContent = `💔 ${colorEmoji} ${result}! You bet on ${betTypeText}. Lost ${bet} points.`;
                    resultDiv.className = 'gambling-result lose';
                    SoundEffects.playCasinoLose();
                    trackQuestProgress('casinolose', 1);
                }
                
                // Update displays
                document.getElementById('gamblingPointsDisplay').textContent = formatPoints(game.shop.points);
                game.saveShop();
                updateFloatingPointsBadges();
                document.getElementById('shopPointsDisplay').textContent = formatPoints(game.shop.points);
                document.getElementById('shopPointsStat').textContent = formatPoints(game.shop.points);
            
                // Reset after delay
                setTimeout(() => {
                    setupRoulette();
                }, 1000);
            }, 300);
        }, 600);
    }, 400);
}

// ==================== MULTIPLIER DROPDOWN ====================
function toggleMultiplierDropdown(event) {
    // Prevent toggle if clicking on the title (for easter egg)
    if (event && event.target && event.target.classList.contains('multipliers-title')) {
        return;
    }
    
    const dropdown = document.getElementById('multipliersDropdown');
    const container = document.getElementById('currentMultipliers');
    
    SoundEffects.playButton();
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        container.classList.remove('dropdown-open');
    } else {
        dropdown.classList.add('show');
        container.classList.add('dropdown-open');
    }
}

// ==================== CREATOR CENTER SECRET ====================
let creatorSecretStep = 0;
let creatorSecretTimer = null;
let creatorCenterUnlocked = false;
let creatorCenterAccessUnlocked = false;
let creatorPoints = 0;

// Quest system
let questsData = {
    active: [],
    pointsEarnedSinceQuestStart: 0,
    blackjackPlayedSinceQuestStart: 0,
    timeTrialsPlayedSinceQuestStart: 0,
    casinoWinsSinceQuestStart: 0,
    casinoWinStreakCurrent: 0,
    gamesPlayedSinceQuestStart: 0,
    slotsJackpotsSinceQuestStart: 0
};

const QUEST_DEFINITIONS = [
    { id: 'points1000', title: 'Point Collector', description: 'Earn 1,000 points', target: 1000, type: 'points', reward: 1 },
    { id: 'blackjack3', title: 'Card Shark', description: 'Play Blackjack 3 times', target: 3, type: 'blackjack', reward: 1 },
    { id: 'timetrials3', title: 'Speed Runner', description: 'Play Time Trials 3 times', target: 3, type: 'timetrials', reward: 1 },
    { id: 'luckystreak', title: 'Lucky Streak', description: 'Win 3 casino games in a row', target: 3, type: 'casinostreak', reward: 1 },
    { id: 'highroller', title: 'High Roller', description: 'Bet 500+ points in one casino game', target: 1, type: 'highbet', reward: 1 },
    { id: 'marathon', title: 'Marathon Player', description: 'Play 10 games in one session', target: 10, type: 'gamesplayed', reward: 1 },
    { id: 'casinoregular', title: 'Casino Regular', description: 'Win 5 casino games', target: 5, type: 'casinowins', reward: 1 },
    { id: 'jackpothunter', title: 'Jackpot Hunter', description: 'Hit the slots jackpot', target: 1, type: 'slotsjackpot', reward: 2 },
    { id: 'blitzchamp', title: 'Blitz Champion', description: 'Win 3 Blitz mode games', target: 3, type: 'blitzwins', reward: 1 },
    { id: 'points5000', title: 'Points Master', description: 'Earn 5,000 points total', target: 5000, type: 'points', reward: 2 },
    { id: 'blackjack10', title: 'Blackjack Pro', description: 'Play Blackjack 10 times', target: 10, type: 'blackjack', reward: 2 },
    { id: 'timetrials10', title: 'Time Trial Expert', description: 'Play Time Trials 10 times', target: 10, type: 'timetrials', reward: 2 }
];

function loadCreatorData() {
    const saved = localStorage.getItem('creatorData');
    if (saved) {
        const data = JSON.parse(saved);
        creatorCenterUnlocked = data.unlocked || false;
        creatorCenterAccessUnlocked = data.accessUnlocked || false;
        creatorPoints = data.creatorPoints || 0;
        questsData = data.quests || {
            active: [],
            pointsEarnedSinceQuestStart: 0,
            blackjackPlayedSinceQuestStart: 0,
            timeTrialsPlayedSinceQuestStart: 0,
            casinoWinsSinceQuestStart: 0,
            casinoWinStreakCurrent: 0,
            gamesPlayedSinceQuestStart: 0,
            slotsJackpotsSinceQuestStart: 0
        };
        // Ensure new fields exist
        if (!questsData.casinoWinsSinceQuestStart) questsData.casinoWinsSinceQuestStart = 0;
        if (!questsData.casinoWinStreakCurrent) questsData.casinoWinStreakCurrent = 0;
        if (!questsData.gamesPlayedSinceQuestStart) questsData.gamesPlayedSinceQuestStart = 0;
        if (!questsData.slotsJackpotsSinceQuestStart) questsData.slotsJackpotsSinceQuestStart = 0;
    }
    
    // Show quests button if access is unlocked
    if (creatorCenterAccessUnlocked) {
        const questsBtn = document.getElementById('questsBtn');
        if (questsBtn) questsBtn.style.display = '';
    }
    
    // Initialize quests if none exist
    if (questsData.active.length === 0 && creatorCenterAccessUnlocked) {
        initializeQuests();
    }
}

function saveCreatorData() {
    localStorage.setItem('creatorData', JSON.stringify({
        unlocked: creatorCenterUnlocked,
        accessUnlocked: creatorCenterAccessUnlocked,
        creatorPoints: creatorPoints,
        quests: questsData
    }));
}

function initializeQuests() {
    // Randomly pick 3 unique quests
    const shuffled = [...QUEST_DEFINITIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    questsData.active = selected.map(q => ({
        ...q,
        progress: 0
    }));
    questsData.pointsEarnedSinceQuestStart = 0;
    questsData.blackjackPlayedSinceQuestStart = 0;
    questsData.timeTrialsPlayedSinceQuestStart = 0;
    questsData.casinoWinsSinceQuestStart = 0;
    questsData.casinoWinStreakCurrent = 0;
    questsData.gamesPlayedSinceQuestStart = 0;
    questsData.slotsJackpotsSinceQuestStart = 0;
    saveCreatorData();
}

// Secret unlock: AI score -> Player score -> Current card (within 5 seconds)
function setupCreatorSecretTrigger() {
    const aiScore = document.querySelector('.score-card.ai');
    const playerScore = document.querySelector('.score-card.player');
    const currentCard = document.getElementById('currentCard');
    
    if (!aiScore || !playerScore || !currentCard) return;
    
    function resetSecret() {
        creatorSecretStep = 0;
        clearTimeout(creatorSecretTimer);
    }
    
    // Helper to add both click and touch events
    function addTapListener(element, callback) {
        element.addEventListener('click', callback);
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            callback(e);
        });
    }
    
    addTapListener(aiScore, () => {
        if (creatorSecretStep === 0) {
            creatorSecretStep = 1;
            creatorSecretTimer = setTimeout(resetSecret, 5000);
        } else {
            resetSecret();
        }
    });
    
    addTapListener(playerScore, () => {
        if (creatorSecretStep === 1) {
            creatorSecretStep = 2;
        } else {
            resetSecret();
        }
    });
    
    addTapListener(currentCard, (e) => {
        // Don't trigger if dragging (only for click events)
        if (e.type === 'click' && e.detail === 0) return;
        
        if (creatorSecretStep === 2) {
            resetSecret();
            openCreatorCenter();
        }
    });
}

function openCreatorCenter() {
    // Mark access as unlocked (for showing quests button)
    if (!creatorCenterAccessUnlocked) {
        creatorCenterAccessUnlocked = true;
        const questsBtn = document.getElementById('questsBtn');
        if (questsBtn) questsBtn.style.display = '';
        
        // Initialize quests
        if (questsData.active.length === 0) {
            initializeQuests();
        }
        
        saveCreatorData();
        SoundEffects.playUnlock();
        game.showMessage('🔓 Secret discovered! Quests unlocked!');
    }
    
    SoundEffects.playButton();
    
    // Update displays
    document.getElementById('creatorShopPoints').textContent = formatPoints(game.shop.points);
    document.getElementById('creatorCreatorPoints').textContent = creatorPoints;
    
    // Show appropriate panel
    if (creatorCenterUnlocked) {
        document.getElementById('creatorLockPanel').style.display = 'none';
        document.getElementById('creatorFeatures').style.display = 'block';
        
        // Initialize level editor
        initLevelEditor();
        
        // Show import/export in settings
        updateImportExportVisibility();
    } else {
        document.getElementById('creatorLockPanel').style.display = 'block';
        document.getElementById('creatorFeatures').style.display = 'none';
        updateCreatorUnlockButton();
    }
    
    document.getElementById('creatorCenter').classList.remove('hidden');
}

function closeCreatorCenter() {
    // Save test state if in test mode
    if (editorTestMode) {
        saveEditorTestState();
        stopEditorTest();
    }
    
    SoundEffects.playButton();
    document.getElementById('creatorCenter').classList.add('hidden');
}

// Secret: Click creator center title 10 times in 3 seconds for bonus
let creatorTitleClicks = 0;
let creatorTitleTimer = null;

function setupCreatorTitleSecret() {
    const title = document.querySelector('.creator-content h2');
    if (!title) return;
    
    // No visual indication - this is for devs only
    title.addEventListener('click', () => {
        creatorTitleClicks++;
        
        if (creatorTitleClicks === 1) {
            creatorTitleTimer = setTimeout(() => {
                creatorTitleClicks = 0;
            }, 3000);
        }
        
        if (creatorTitleClicks >= 15) {
            clearTimeout(creatorTitleTimer);
            creatorTitleClicks = 0;
            
            // Award bonus
            game.shop.points += 1000;
            creatorPoints += 5;
            creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
            game.saveShop();
            saveCreatorData();
            
            // Update displays
            document.getElementById('creatorShopPoints').textContent = formatPoints(game.shop.points);
            document.getElementById('creatorCreatorPoints').textContent = creatorPoints;
            updateFloatingPointsBadges();
            
            SoundEffects.playJackpot();
            game.showMessage('🎉 SECRET BONUS! +1000 pts, +5 Creator Points!');
        }
    });
}

// Level Editor title secret (same bonus as creator center title)
let editorTitleClicks = 0;
let editorTitleTimer = null;

function setupEditorTitleSecret() {
    const title = document.getElementById('levelEditorTitle');
    if (!title) return;
    
    title.style.cursor = 'default'; // No visual hint
    title.addEventListener('click', () => {
        editorTitleClicks++;
        
        if (editorTitleClicks === 1) {
            editorTitleTimer = setTimeout(() => {
                editorTitleClicks = 0;
            }, 3000);
        }
        
        if (editorTitleClicks >= 15) {
            clearTimeout(editorTitleTimer);
            editorTitleClicks = 0;
            
            // Award bonus
            game.shop.points += 1000;
            creatorPoints += 5;
            creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
            game.saveShop();
            saveCreatorData();
            
            // Update displays
            document.getElementById('creatorShopPoints').textContent = formatPoints(game.shop.points);
            document.getElementById('creatorCreatorPoints').textContent = creatorPoints;
            updateFloatingPointsBadges();
            
            SoundEffects.playJackpot();
            game.showMessage('🎉 DEV BONUS! +1000 pts, +5 Creator Points!');
        }
    });
}

function updateCreatorUnlockButton() {
    const btn = document.getElementById('creatorUnlockBtn');
    const canUnlock = game.shop.points >= 500 && creatorPoints >= 3;
    btn.disabled = !canUnlock;
}

function tryUnlockCreatorCenter() {
    if (game.shop.points >= 500 && creatorPoints >= 3) {
        game.shop.points -= 500;
        creatorPoints -= 3;
        creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
        creatorCenterUnlocked = true;
        
        game.saveShop();
        saveCreatorData();
        
        SoundEffects.playUnlock();
        
        document.getElementById('creatorLockPanel').style.display = 'none';
        document.getElementById('creatorFeatures').style.display = 'block';
        document.getElementById('creatorShopPoints').textContent = formatPoints(game.shop.points);
        document.getElementById('creatorCreatorPoints').textContent = creatorPoints;
        
        // Initialize level editor
        initLevelEditor();
        
        // Show import/export in settings
        updateImportExportVisibility();
    }
}

// ==================== QUESTS SYSTEM ====================
function showQuests() {
    SoundEffects.playButton();
    
    document.getElementById('questsCreatorPoints').textContent = creatorPoints;
    updateFloatingPointsBadges();
    renderQuests();
    
    document.getElementById('questsModal').classList.add('show');
}

function closeQuests() {
    SoundEffects.playButton();
    document.getElementById('questsModal').classList.remove('show');
}

function renderQuests() {
    const container = document.getElementById('questsList');
    
    if (questsData.active.length === 0) {
        container.innerHTML = '<div class="no-quests-message">No quests available. Click refresh to get new quests!</div>';
        return;
    }
    
    container.innerHTML = questsData.active.map((quest, index) => {
        const progress = getQuestProgress(quest);
        const percentage = Math.min(100, (progress / quest.target) * 100);
        const isComplete = progress >= quest.target;
        
        return `
            <div class="quest-item ${isComplete ? 'completed' : ''}">
                <div class="quest-info">
                    <div class="quest-title">${quest.title} <span style="color: #FFD700; font-weight: bold;">(${quest.reward}⭐)</span></div>
                    <div class="quest-progress-text">${quest.description} (${progress}/${quest.target})</div>
                    <div class="quest-progress-bar">
                        <div class="quest-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <button class="quest-claim-btn ${isComplete ? 'ready' : ''}" 
                        onclick="claimQuest(${index})" 
                        ${!isComplete ? 'disabled' : ''}>
                    ${isComplete ? `⭐ Claim ${quest.reward}⭐` : 'In Progress'}
                </button>
            </div>
        `;
    }).join('');
}

function getQuestProgress(quest) {
    switch (quest.type) {
        case 'points':
            return questsData.pointsEarnedSinceQuestStart;
        case 'blackjack':
            return questsData.blackjackPlayedSinceQuestStart;
        case 'timetrials':
            return questsData.timeTrialsPlayedSinceQuestStart;
        case 'casinostreak':
            return questsData.casinoWinStreakCurrent;
        case 'casinowins':
            return questsData.casinoWinsSinceQuestStart;
        case 'gamesplayed':
            return questsData.gamesPlayedSinceQuestStart;
        case 'slotsjackpot':
            return questsData.slotsJackpotsSinceQuestStart;
        case 'highbet':
            return quest.progress || 0; // Tracked per-quest
        case 'blitzwins':
            return quest.progress || 0; // Tracked per-quest
        default:
            return quest.progress || 0;
    }
}

function claimQuest(index) {
    const quest = questsData.active[index];
    if (!quest) return;
    
    const progress = getQuestProgress(quest);
    if (progress < quest.target) return;
    
    // Award creator point
    creatorPoints += quest.reward;
    creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
    
    // Remove the quest
    questsData.active.splice(index, 1);
    
    saveCreatorData();
    SoundEffects.playUnlock();
    
    document.getElementById('questsCreatorPoints').textContent = creatorPoints;
    renderQuests();
    
    game.showMessage(`⭐ Quest complete! +${quest.reward} Creator Point!`);
}

function refreshQuests() {
    if (game.shop.points < 5) {
        alert('Not enough points! Need 5 points to refresh quests.');
        return;
    }
    
    game.shop.points -= 5;
    game.saveShop();
    
    // Reset all quests
    initializeQuests();
    
    SoundEffects.playButton();
    renderQuests();
    updateFloatingPointsBadges();
}

// Track quest progress
function trackQuestProgress(type, amount = 1) {
    if (!creatorCenterAccessUnlocked) return;
    
    switch (type) {
        case 'points':
            questsData.pointsEarnedSinceQuestStart += amount;
            break;
        case 'blackjack':
            questsData.blackjackPlayedSinceQuestStart += amount;
            break;
        case 'timetrials':
            questsData.timeTrialsPlayedSinceQuestStart += amount;
            break;
        case 'casinowin':
            questsData.casinoWinsSinceQuestStart += amount;
            questsData.casinoWinStreakCurrent += amount;
            break;
        case 'casinolose':
            questsData.casinoWinStreakCurrent = 0; // Reset streak on loss
            break;
        case 'gamesplayed':
            questsData.gamesPlayedSinceQuestStart += amount;
            break;
        case 'slotsjackpot':
            questsData.slotsJackpotsSinceQuestStart += amount;
            break;
        case 'highbet':
            // Update per-quest progress for high bet quests
            questsData.active.forEach(q => {
                if (q.type === 'highbet' && amount >= 500) {
                    q.progress = 1;
                }
            });
            break;
        case 'blitzwin':
            // Update per-quest progress for blitz wins
            questsData.active.forEach(q => {
                if (q.type === 'blitzwins') {
                    q.progress = (q.progress || 0) + amount;
                }
            });
            break;
    }
    
    saveCreatorData();
    
    // Re-render quests if modal is open to update progress bars
    const questsModal = document.getElementById('questsModal');
    if (questsModal && questsModal.classList.contains('show')) {
        renderQuests();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadCreatorData();
    setupCreatorSecretTrigger();
    setupCreatorTitleSecret();
});

// Close quests modal on background click
document.getElementById('questsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'questsModal') {
        closeQuests();
    }
});

// ==================== IMPORT/EXPORT SYSTEM ====================
function exportGameData() {
    const gameData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        shop: game.shop,
        stats: game.stats,
        creatorCenter: {
            unlocked: creatorCenterUnlocked,
            creatorPoints: creatorPoints,
            quests: questsData
        },
        settings: {
            theme: document.body.className,
            iconPack: game.iconPack,
            sfxEnabled: SoundEffects.enabled
        },
        casinoOwned: getCasinoOwnedGames(),
        roulettePrefs: {
            betType: rouletteBetType,
            colorChoice: rouletteColorChoice,
            numberChoice: rouletteNumberChoice
        }
    };
    
    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `number-battle-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    SoundEffects.playButton();
}

function importGameData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.version) {
                alert('Invalid save file format!');
                return;
            }
            
            // Restore shop data
            if (data.shop) {
                game.shop = { ...game.shop, ...data.shop };
                game.saveShop();
            }
            
            // Restore stats
            if (data.stats) {
                game.stats = { ...game.stats, ...data.stats };
                localStorage.setItem('numberGameStats', JSON.stringify(game.stats));
            }
            
            // Restore creator center
            if (data.creatorCenter) {
                creatorCenterUnlocked = data.creatorCenter.unlocked || false;
                creatorPoints = data.creatorCenter.creatorPoints || 0;
                if (data.creatorCenter.quests) {
                    questsData = data.creatorCenter.quests;
                }
                saveCreatorData();
            }
            
            // Restore settings
            if (data.settings) {
                if (data.settings.theme) {
                    document.body.className = data.settings.theme;
                    localStorage.setItem('numberGameTheme', data.settings.theme);
                }
                if (data.settings.iconPack) {
                    game.iconPack = data.settings.iconPack;
                    localStorage.setItem('numberGameIconPack', data.settings.iconPack);
                }
                if (data.settings.sfxEnabled !== undefined) {
                    SoundEffects.enabled = data.settings.sfxEnabled;
                    document.getElementById('sfxToggle').checked = SoundEffects.enabled;
                }
            }
            
            // Restore casino owned games
            if (data.casinoOwned) {
                saveCasinoOwnedGames(data.casinoOwned);
            }
            
            // Restore roulette preferences
            if (data.roulettePrefs) {
                rouletteBetType = data.roulettePrefs.betType || 'color';
                rouletteColorChoice = data.roulettePrefs.colorChoice || 'red';
                rouletteNumberChoice = data.roulettePrefs.numberChoice || 1;
                saveRoulettePreferences();
            }
            
            // Update UI
            game.updateUI();
            
            alert('Game data imported successfully!');
            SoundEffects.playUnlock();
            
        } catch (err) {
            alert('Error reading save file: ' + err.message);
        }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

// Show import/export section when creator center is unlocked
function updateImportExportVisibility() {
    const section = document.getElementById('importExportSection');
    if (section && creatorCenterUnlocked) {
        section.style.display = 'block';
    }
}

// ==================== LEVEL EDITOR ====================
let editorTool = 'connect'; // 'connect' or 'remove'
let editorPaths = new Set(); // Store paths as "row1,col1-row2,col2"
let editorWidth = 5;
let editorHeight = 5;
let editorDragging = false;
let editorDragStart = null;
let editorDragButton = 0; // 0 = left, 2 = right

function initLevelEditor() {
    editorWidth = 5;
    editorHeight = 5;
    editorPaths = new Set();
    document.getElementById('editorWidth').value = editorWidth;
    document.getElementById('editorHeight').value = editorHeight;
    updateEditorBoard();
    // Setup editor events after board is created
    setupEditorEvents();
    // Setup dev secret on editor title
    setupEditorTitleSecret();
}

function updateEditorBoard() {
    editorWidth = Math.min(10, Math.max(3, parseInt(document.getElementById('editorWidth').value) || 5));
    editorHeight = Math.min(10, Math.max(3, parseInt(document.getElementById('editorHeight').value) || 5));
    
    // Clamp input values
    document.getElementById('editorWidth').value = editorWidth;
    document.getElementById('editorHeight').value = editorHeight;
    
    const board = document.getElementById('editorBoard');
    
    // Smaller gap for larger boards
    const maxDim = Math.max(editorWidth, editorHeight);
    const gap = maxDim >= 8 ? 4 : maxDim >= 6 ? 6 : 8;
    
    // Use 1fr - cells will stretch to fill container (non-square is fine)
    board.style.gridTemplateColumns = `repeat(${editorWidth}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${editorHeight}, 1fr)`;
    board.style.gap = `${gap}px`;
    board.innerHTML = '';
    
    // Filter out paths that are outside the new dimensions
    const validPaths = new Set();
    editorPaths.forEach(path => {
        const [cell1, cell2] = path.split('-');
        const [r1, c1] = cell1.split(',').map(Number);
        const [r2, c2] = cell2.split(',').map(Number);
        if (r1 < editorHeight && c1 < editorWidth && r2 < editorHeight && c2 < editorWidth) {
            validPaths.add(path);
        }
    });
    editorPaths = validPaths;
    
    // Create cells
    for (let row = 0; row < editorHeight; row++) {
        for (let col = 0; col < editorWidth; col++) {
            const cell = document.createElement('div');
            cell.className = 'editor-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add path classes
            if (hasPath(row, col, row, col + 1)) {
                cell.classList.add('path-right');
            }
            if (hasPath(row, col, row + 1, col)) {
                cell.classList.add('path-down');
            }
            
            board.appendChild(cell);
        }
    }
    
    // Update path CSS variables based on gap size
    document.documentElement.style.setProperty('--editor-gap', `${gap}px`);
    
    updateEditorInfo();
}

// Refresh just the path visuals without rebuilding the board
function refreshEditorPathVisuals() {
    const cells = document.querySelectorAll('#editorBoard .editor-cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        cell.classList.remove('path-right', 'path-down');
        
        if (hasPath(row, col, row, col + 1)) {
            cell.classList.add('path-right');
        }
        if (hasPath(row, col, row + 1, col)) {
            cell.classList.add('path-down');
        }
    });
    updateEditorInfo();
}

// Get cell data from a mouse/touch position
function getEditorCellAt(x, y) {
    const element = document.elementFromPoint(x, y);
    if (element && element.classList.contains('editor-cell')) {
        return {
            row: parseInt(element.dataset.row),
            col: parseInt(element.dataset.col),
            element: element
        };
    }
    return null;
}

// Handle path drawing - called on mouse/touch move
function handleEditorDraw(x, y) {
    // Block editing during test mode
    if (editorTestMode) return;
    if (!editorDragging || !editorDragStart) return;
    
    const cell = getEditorCellAt(x, y);
    if (!cell) return;
    
    const row = cell.row;
    const col = cell.col;
    
    // Check if this cell is adjacent to our last position
    const dr = Math.abs(row - editorDragStart.row);
    const dc = Math.abs(col - editorDragStart.col);
    
    // Only process if moving to an adjacent cell (not diagonal)
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        // Determine action based on mouse button and tool
        // Left click (button 0): connect tool = add, disconnect tool = remove
        // Right click (button 2): connect tool = remove, disconnect tool = add
        const isRightClick = editorDragButton === 2;
        const shouldAdd = (editorTool === 'connect') !== isRightClick;
        
        if (shouldAdd) {
            addPath(editorDragStart.row, editorDragStart.col, row, col);
            SoundEffects.playCardPlace();
        } else {
            removePath(editorDragStart.row, editorDragStart.col, row, col);
            SoundEffects.playButton();
        }
        
        // Highlight the new cell
        cell.element.classList.add('selected');
        
        // Update start position for next segment
        editorDragStart = { row, col };
        refreshEditorPathVisuals();
    }
}

// Start drawing
function startEditorDraw(x, y, button = 0) {
    // Block editing during test mode
    if (editorTestMode) return;
    
    const cell = getEditorCellAt(x, y);
    if (!cell) return;
    
    editorDragging = true;
    editorDragStart = { row: cell.row, col: cell.col };
    editorDragButton = button; // Track which mouse button started the drag
    cell.element.classList.add('selected');
}

// Stop drawing
function stopEditorDraw() {
    editorDragging = false;
    editorDragStart = null;
    document.querySelectorAll('#editorBoard .editor-cell.selected').forEach(c => {
        c.classList.remove('selected');
    });
}

// Set up all editor event listeners (called when editor is initialized)
let editorEventsSetup = false;
function setupEditorEvents() {
    const board = document.getElementById('editorBoard');
    if (!board || editorEventsSetup) return;
    editorEventsSetup = true;
    
    // Prevent context menu on right-click for path drawing
    board.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Mouse events - handle both left (0) and right (2) click
    board.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.button === 0 || e.button === 2) {
            startEditorDraw(e.clientX, e.clientY, e.button);
        }
    });
    
    board.addEventListener('mousemove', (e) => {
        handleEditorDraw(e.clientX, e.clientY);
    });
    
    board.addEventListener('mouseup', stopEditorDraw);
    board.addEventListener('mouseleave', stopEditorDraw);
    
    // Touch events (no right-click equivalent, use default left-click behavior)
    board.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startEditorDraw(touch.clientX, touch.clientY, 0);
    }, { passive: false });
    
    board.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleEditorDraw(touch.clientX, touch.clientY);
    }, { passive: false });
    
    board.addEventListener('touchend', stopEditorDraw);
    board.addEventListener('touchcancel', stopEditorDraw);
}

// Global mouseup to catch releases outside the board
document.addEventListener('mouseup', stopEditorDraw);

function hasPath(r1, c1, r2, c2) {
    const path1 = `${r1},${c1}-${r2},${c2}`;
    const path2 = `${r2},${c2}-${r1},${c1}`;
    return editorPaths.has(path1) || editorPaths.has(path2);
}

function addPath(r1, c1, r2, c2) {
    // Normalize path order
    const path = r1 < r2 || (r1 === r2 && c1 < c2) 
        ? `${r1},${c1}-${r2},${c2}` 
        : `${r2},${c2}-${r1},${c1}`;
    editorPaths.add(path);
}

function removePath(r1, c1, r2, c2) {
    const path1 = `${r1},${c1}-${r2},${c2}`;
    const path2 = `${r2},${c2}-${r1},${c1}`;
    editorPaths.delete(path1);
    editorPaths.delete(path2);
}

function setEditorTool(tool) {
    editorTool = tool;
    document.getElementById('toolConnect').classList.toggle('active', tool === 'connect');
    document.getElementById('toolRemove').classList.toggle('active', tool === 'remove');
    SoundEffects.playButton();
}

function randomizeEditorPaths() {
    editorPaths = new Set();
    
    // Use the same algorithm as the main game's generateConnections
    const adjacencyList = new Map();
    const totalCells = editorWidth * editorHeight;
    
    for (let i = 0; i < totalCells; i++) {
        adjacencyList.set(i, []);
    }
    
    // Random path generation like main game (80% chance per direction)
    for (let i = 0; i < totalCells; i++) {
        const row = Math.floor(i / editorWidth);
        const col = i % editorWidth;
        
        // Connect to right neighbor
        if (col < editorWidth - 1) {
            const right = i + 1;
            if (Math.random() > 0.2 || adjacencyList.get(i).length === 0) {
                if (!adjacencyList.get(i).includes(right)) {
                    addPath(row, col, row, col + 1);
                    adjacencyList.get(i).push(right);
                    adjacencyList.get(right).push(i);
                }
            }
        }
        
        // Connect to bottom neighbor
        if (row < editorHeight - 1) {
            const bottom = i + editorWidth;
            if (Math.random() > 0.2 || adjacencyList.get(i).length === 0) {
                if (!adjacencyList.get(i).includes(bottom)) {
                    addPath(row, col, row + 1, col);
                    adjacencyList.get(i).push(bottom);
                    adjacencyList.get(bottom).push(i);
                }
            }
        }
    }
    
    // Ensure all cells have at least one connection
    for (let i = 0; i < totalCells; i++) {
        if (adjacencyList.get(i).length === 0) {
            const row = Math.floor(i / editorWidth);
            const col = i % editorWidth;
            const neighbors = [];
            
            // Check all 4 directions
            if (col > 0) neighbors.push({ r: row, c: col - 1 });
            if (col < editorWidth - 1) neighbors.push({ r: row, c: col + 1 });
            if (row > 0) neighbors.push({ r: row - 1, c: col });
            if (row < editorHeight - 1) neighbors.push({ r: row + 1, c: col });
            
            if (neighbors.length > 0) {
                const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                addPath(row, col, neighbor.r, neighbor.c);
            }
        }
    }
    
    updateEditorBoard();
    SoundEffects.playButton();
}

function connectAllPaths() {
    editorPaths = new Set();
    
    // Connect all adjacent cells (right and down)
    for (let row = 0; row < editorHeight; row++) {
        for (let col = 0; col < editorWidth; col++) {
            // Connect to right neighbor
            if (col < editorWidth - 1) {
                addPath(row, col, row, col + 1);
            }
            // Connect to bottom neighbor
            if (row < editorHeight - 1) {
                addPath(row, col, row + 1, col);
            }
        }
    }
    
    updateEditorBoard();
    SoundEffects.playButton();
}

function clearAllPaths() {
    editorPaths = new Set();
    updateEditorBoard();
    SoundEffects.playButton();
}

function updateEditorInfo() {
    document.getElementById('editorInfoSize').textContent = `${editorWidth}x${editorHeight}`;
    document.getElementById('editorInfoPaths').textContent = editorPaths.size;
    
    const modeSelect = document.getElementById('editorGameMode');
    const modeText = modeSelect.options[modeSelect.selectedIndex].text;
    document.getElementById('editorInfoMode').textContent = modeText;
    
    const aiSelect = document.getElementById('editorAIDifficulty');
    const aiText = aiSelect.options[aiSelect.selectedIndex].text;
    document.getElementById('editorInfoAI').textContent = aiText;
    
    // Count active restrictions
    const restrictions = getEditorRestrictions();
    const activeRestrictions = Object.values(restrictions).filter(v => v).length;
    document.getElementById('editorInfoRestrictions').textContent = activeRestrictions > 0 ? `${activeRestrictions} active` : 'None';
}

// Update editor icon pack display
let editorIconPack = 'default';

function updateEditorIconPack() {
    const select = document.getElementById('editorIconPack');
    if (select) {
        editorIconPack = select.value;
    }
    // Re-render board if in test mode
    if (editorTestMode && editorTestGame) {
        renderEditorTestBoard();
    }
}

// Update info when mode or AI changes
document.getElementById('editorGameMode')?.addEventListener('change', updateEditorInfo);
document.getElementById('editorAIDifficulty')?.addEventListener('change', updateEditorInfo);

// Update info when restrictions change
document.querySelectorAll('.editor-restrictions input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateEditorInfo);
});

function getEditorRestrictions() {
    return {
        noBonus: document.getElementById('restrictNoBonus')?.checked || false,
        aiFirst: document.getElementById('restrictAIFirst')?.checked || false,
        survival: document.getElementById('restrictSurvival')?.checked || false,
        scummySequences: document.getElementById('restrictScummySeq')?.checked || false,
        gloriousZeros: document.getElementById('restrictGloriousZeros')?.checked || false
    };
}

// ==================== EDITOR TEST GAME ====================
let editorTestMode = false;
let editorTestGame = null;
let editorSavedTestState = null;

function toggleEditorTest() {
    if (editorTestMode) {
        stopEditorTest();
    } else {
        startEditorTest();
    }
}

function startEditorTest() {
    // Check if player has enough creator points
    if (creatorPoints < 0.1) {
        alert('Not enough Creator Points! Need 0.1 ⭐ to test.');
        return;
    }
    
    // Deduct cost
    creatorPoints -= 0.1;
    creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
    saveCreatorData();
    document.getElementById('creatorCreatorPoints').textContent = creatorPoints.toFixed(1);
    
    editorTestMode = true;
    
    // Update button
    const btn = document.getElementById('editorTestBtn');
    btn.innerHTML = '⏹️ Stop Game <span class="cost-badge">Free</span>';
    btn.classList.add('testing');
    
    // Disable editor controls
    document.querySelector('.level-editor-left').classList.add('testing');
    document.querySelector('.level-editor-center').classList.add('testing');
    
    // Show test section
    document.getElementById('editorTestSection').style.display = 'block';
    
    // Create and start test game
    startEditorTestGame();
    
    SoundEffects.playButton();
}

function stopEditorTest() {
    editorTestMode = false;
    
    // Update button
    const btn = document.getElementById('editorTestBtn');
    btn.innerHTML = '▶️ Test Game <span class="cost-badge">0.1 ⭐</span>';
    btn.classList.remove('testing');
    
    // Re-enable editor controls
    document.querySelector('.level-editor-left').classList.remove('testing');
    document.querySelector('.level-editor-center').classList.remove('testing');
    
    // Hide test section
    document.getElementById('editorTestSection').style.display = 'none';
    
    // Clean up test game
    if (editorTestGame) {
        editorTestGame = null;
    }
    
    // Restore editor board
    updateEditorBoard();
    
    SoundEffects.playButton();
}

function startEditorTestGame() {
    // Create level data from editor
    const levelData = {
        width: editorWidth,
        height: editorHeight,
        paths: Array.from(editorPaths),
        gameMode: document.getElementById('editorGameMode').value,
        aiDifficulty: document.getElementById('editorAIDifficulty').value,
        restrictions: getEditorRestrictions()
    };
    
    // Initialize test game state
    editorTestGame = {
        levelData: levelData,
        board: [],
        playerScore: 0,
        aiScore: 0,
        currentCard: Math.floor(Math.random() * 10),
        nextCard: Math.floor(Math.random() * 10),
        isPlayerTurn: !levelData.restrictions.aiFirst,
        gameOver: false,
        connections: buildConnectionsFromPaths(levelData.paths, levelData.width, levelData.height)
    };
    
    // Initialize board
    for (let i = 0; i < levelData.height; i++) {
        editorTestGame.board[i] = [];
        for (let j = 0; j < levelData.width; j++) {
            editorTestGame.board[i][j] = { value: null, owner: null };
        }
    }
    
    // Render the test board
    renderEditorTestBoard();
    updateEditorTestUI();
    
    // If AI goes first, trigger AI move
    if (levelData.restrictions.aiFirst) {
        setTimeout(() => editorTestAIMove(), 500);
    }
}

function buildConnectionsFromPaths(paths, width, height) {
    const connections = new Map();
    const total = width * height;
    
    for (let i = 0; i < total; i++) {
        connections.set(i, []);
    }
    
    paths.forEach(path => {
        const [cell1, cell2] = path.split('-');
        const [r1, c1] = cell1.split(',').map(Number);
        const [r2, c2] = cell2.split(',').map(Number);
        
        const idx1 = r1 * width + c1;
        const idx2 = r2 * width + c2;
        
        if (!connections.get(idx1).includes(idx2)) {
            connections.get(idx1).push(idx2);
        }
        if (!connections.get(idx2).includes(idx1)) {
            connections.get(idx2).push(idx1);
        }
    });
    
    return connections;
}

function renderEditorTestBoard() {
    const board = document.getElementById('editorBoard');
    const levelData = editorTestGame.levelData;
    
    // Update grid
    board.style.gridTemplateColumns = `repeat(${levelData.width}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${levelData.height}, 1fr)`;
    board.innerHTML = '';
    
    // Get current icon pack
    const iconPack = IconPacks[editorIconPack] || IconPacks.default;
    
    for (let row = 0; row < levelData.height; row++) {
        for (let col = 0; col < levelData.width; col++) {
            const cell = document.createElement('div');
            cell.className = 'editor-cell editor-test-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const cellData = editorTestGame.board[row][col];
            if (cellData.value !== null) {
                cell.textContent = iconPack(cellData.value);
                // Handle player, AI, and neutral owned cells
                if (cellData.owner === 'player') {
                    cell.classList.add('player-owned');
                } else if (cellData.owner === 'ai') {
                    cell.classList.add('ai-owned');
                } else {
                    // Neutral cell - has value but no owner (didn't score)
                    cell.classList.add('neutral');
                }
                cell.classList.remove('empty');
            } else {
                cell.classList.add('empty');
                // Use a closure to capture row and col
                const r = row, c = col;
                cell.addEventListener('click', () => editorTestPlaceCard(r, c));
            }
            
            // Add path classes
            if (hasPath(row, col, row, col + 1)) {
                cell.classList.add('path-right');
            }
            if (hasPath(row, col, row + 1, col)) {
                cell.classList.add('path-down');
            }
            
            board.appendChild(cell);
        }
    }
}

function updateEditorTestUI() {
    const iconPack = IconPacks[editorIconPack] || IconPacks.default;
    document.getElementById('editorTestCard').textContent = iconPack(editorTestGame.currentCard);
    document.getElementById('editorTestPlayerScore').textContent = editorTestGame.playerScore;
    document.getElementById('editorTestAIScore').textContent = editorTestGame.aiScore;
    
    const gameMode = editorTestGame.levelData.gameMode || 'classic';
    const restrictions = editorTestGame.levelData.restrictions || {};
    
    if (editorTestGame.gameOver) {
        let finalPlayerScore = editorTestGame.playerScore;
        let finalAIScore = editorTestGame.aiScore;
        
        // Territorial mode: final score = owned cells count
        if (gameMode === 'territorial') {
            finalPlayerScore = countEditorTestOwnedCells('player');
            finalAIScore = countEditorTestOwnedCells('ai');
            document.getElementById('editorTestPlayerScore').textContent = finalPlayerScore;
            document.getElementById('editorTestAIScore').textContent = finalAIScore;
        } 
        // Normal bonus points (unless noBonus restriction or Territorial mode)
        else if (!restrictions.noBonus && !editorTestGame.bonusApplied) {
            editorTestGame.bonusApplied = true;
            const playerBonus = countEditorTestOwnedCells('player');
            const aiBonus = countEditorTestOwnedCells('ai');
            editorTestGame.playerScore += playerBonus;
            editorTestGame.aiScore += aiBonus;
            finalPlayerScore = editorTestGame.playerScore;
            finalAIScore = editorTestGame.aiScore;
            
            // Update display after bonus
            document.getElementById('editorTestPlayerScore').textContent = editorTestGame.playerScore;
            document.getElementById('editorTestAIScore').textContent = editorTestGame.aiScore;
            
            // Animate bonus if there were any
            if (playerBonus > 0 || aiBonus > 0) {
                animateEditorTestBonus();
            }
        }
        
        // Determine winner - Reverse Rules means LOWER score wins!
        let winner;
        if (gameMode === 'reverserules') {
            winner = finalPlayerScore < finalAIScore ? 'You win!' : 
                     finalPlayerScore > finalAIScore ? 'AI wins!' : 'Tie!';
        } else {
            winner = finalPlayerScore > finalAIScore ? 'You win!' : 
                     finalPlayerScore < finalAIScore ? 'AI wins!' : 'Tie!';
        }
        document.getElementById('editorTestMessage').textContent = winner;
    } else {
        document.getElementById('editorTestMessage').textContent = 
            editorTestGame.isPlayerTurn ? 'Your turn!' : 'AI thinking...';
    }
}

function countEditorTestOwnedCells(owner) {
    let count = 0;
    for (let r = 0; r < editorTestGame.levelData.height; r++) {
        for (let c = 0; c < editorTestGame.levelData.width; c++) {
            if (editorTestGame.board[r][c].owner === owner) {
                count++;
            }
        }
    }
    return count;
}

function animateEditorTestBonus() {
    const board = document.getElementById('editorBoard');
    const cells = board.querySelectorAll('.editor-test-cell');
    
    // Flash each owned cell
    cells.forEach((cell, index) => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const cellData = editorTestGame.board[row][col];
        
        if (cellData.owner === 'player' || cellData.owner === 'ai') {
            setTimeout(() => {
                cell.classList.add('bonus-flash');
                setTimeout(() => {
                    cell.classList.remove('bonus-flash');
                }, 400);
            }, index * 50);
        }
    });
}

function editorTestPlaceCard(row, col) {
    if (!editorTestMode || !editorTestGame || editorTestGame.gameOver) return;
    if (!editorTestGame.isPlayerTurn) return;
    if (editorTestGame.board[row][col].value !== null) return;
    
    // Place card - start as neutral (null owner), ownership set when scoring
    editorTestGame.board[row][col] = { value: editorTestGame.currentCard, owner: null };
    
    // Calculate score (with game mode support) - this will set ownership if points scored
    const points = calculateEditorTestScore(row, col, editorTestGame.currentCard, 'player');
    editorTestGame.playerScore += points;
    
    // Check for Sudden Death - first to 10 points wins!
    const gameMode = editorTestGame.levelData.gameMode || 'classic';
    if (gameMode === 'suddendeath' && editorTestGame.playerScore >= 10) {
        editorTestGame.gameOver = true;
        renderEditorTestBoard();
        updateEditorTestUI();
        return;
    }
    
    // Draw next card
    editorTestGame.currentCard = editorTestGame.nextCard;
    editorTestGame.nextCard = Math.floor(Math.random() * 10);
    
    SoundEffects.playCardPlace();
    
    // Check game over
    if (isEditorTestBoardFull()) {
        editorTestGame.gameOver = true;
        renderEditorTestBoard();
        updateEditorTestUI();
        return;
    }
    
    // AI turn
    editorTestGame.isPlayerTurn = false;
    renderEditorTestBoard();
    updateEditorTestUI();
    
    setTimeout(() => editorTestAIMove(), 500);
}

// Get AI difficulty value from string
function getEditorTestAIDifficulty() {
    const difficultyStr = editorTestGame.levelData.aiDifficulty || '0.4';
    return parseFloat(difficultyStr);
}

// Simulate points for a potential move (without actually placing)
function simulateEditorTestScore(row, col, value, owner) {
    // Create a temporary copy of the board
    const tempBoard = editorTestGame.board.map(r => r.map(c => ({ ...c })));
    tempBoard[row][col] = { value, owner: null };
    
    // Calculate what score this move would get
    let points = 0;
    const width = editorTestGame.levelData.width;
    const idx = row * width + col;
    const connections = editorTestGame.connections.get(idx) || [];
    const restrictions = editorTestGame.levelData.restrictions || {};
    const gameMode = editorTestGame.levelData.gameMode || 'classic';
    const isSubtraction = gameMode === 'subtraction';
    const isScummySequences = restrictions.scummySequences || false;
    const isGloriousZeros = restrictions.gloriousZeros || false;
    
    if (!isScummySequences) {
        connections.forEach(connIdx => {
            const connRow = Math.floor(connIdx / width);
            const connCol = connIdx % width;
            const connCell = tempBoard[connRow][connCol];
            
            if (connCell.value !== null) {
                if (connCell.value === value) {
                    if (isGloriousZeros && value === 0) {
                        points += 10;
                    } else {
                        points += 1;
                    }
                }
                
                if (isSubtraction) {
                    if (Math.abs(connCell.value - value) === 10) {
                        points += 2;
                    }
                } else {
                    if (connCell.value + value === 10) {
                        points += 2;
                    }
                }
            }
        });
    }
    
    return points;
}

// Find the best move for AI based on difficulty
function findBestEditorTestMove(aiCard) {
    const emptyCells = [];
    for (let r = 0; r < editorTestGame.levelData.height; r++) {
        for (let c = 0; c < editorTestGame.levelData.width; c++) {
            if (editorTestGame.board[r][c].value === null) {
                emptyCells.push({ row: r, col: c });
            }
        }
    }
    
    if (emptyCells.length === 0) return null;
    
    const aiDifficulty = getEditorTestAIDifficulty();
    const gameMode = editorTestGame.levelData.gameMode || 'classic';
    
    // Reverse Rules: AI tries to get LOWEST score
    if (gameMode === 'reverserules') {
        // Random chance to make suboptimal move based on difficulty
        if (Math.random() > aiDifficulty) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        
        let lowestScore = Infinity;
        let bestCell = null;
        
        emptyCells.forEach(cell => {
            const points = simulateEditorTestScore(cell.row, cell.col, aiCard, 'ai');
            if (points < lowestScore) {
                lowestScore = points;
                bestCell = cell;
            }
        });
        
        return bestCell || emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    // Normal modes: AI tries to get HIGHEST score
    // Random chance to make suboptimal move based on difficulty
    if (Math.random() > aiDifficulty) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    let bestScore = -1;
    let bestCell = null;
    
    emptyCells.forEach(cell => {
        const points = simulateEditorTestScore(cell.row, cell.col, aiCard, 'ai');
        if (points > bestScore) {
            bestScore = points;
            bestCell = cell;
        }
    });
    
    return bestCell || emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function editorTestAIMove() {
    if (!editorTestMode || !editorTestGame || editorTestGame.gameOver) return;
    
    // Check if board is full
    let hasEmptyCells = false;
    for (let r = 0; r < editorTestGame.levelData.height; r++) {
        for (let c = 0; c < editorTestGame.levelData.width; c++) {
            if (editorTestGame.board[r][c].value === null) {
                hasEmptyCells = true;
                break;
            }
        }
        if (hasEmptyCells) break;
    }
    
    if (!hasEmptyCells) {
        editorTestGame.gameOver = true;
        updateEditorTestUI();
        return;
    }
    
    // Generate AI card
    const aiCard = Math.floor(Math.random() * 10);
    
    // Use smart AI to find best move based on difficulty
    const bestMove = findBestEditorTestMove(aiCard);
    if (!bestMove) {
        editorTestGame.gameOver = true;
        updateEditorTestUI();
        return;
    }
    
    const cell = bestMove;
    
    // Place card - start as neutral (null owner), ownership set when scoring
    editorTestGame.board[cell.row][cell.col] = { value: aiCard, owner: null };
    
    // Calculate score - this will set ownership if points scored
    const points = calculateEditorTestScore(cell.row, cell.col, aiCard, 'ai');
    editorTestGame.aiScore += points;
    
    SoundEffects.playCardPlace();
    
    // Check for Sudden Death - first to 10 points wins!
    const gameMode = editorTestGame.levelData.gameMode || 'classic';
    if (gameMode === 'suddendeath' && editorTestGame.aiScore >= 10) {
        editorTestGame.gameOver = true;
        renderEditorTestBoard();
        updateEditorTestUI();
        return;
    }
    
    // Check game over
    if (isEditorTestBoardFull()) {
        editorTestGame.gameOver = true;
    } else {
        editorTestGame.isPlayerTurn = true;
    }
    
    renderEditorTestBoard();
    updateEditorTestUI();
}

function calculateEditorTestScore(row, col, value, owner) {
    let points = 0;
    const width = editorTestGame.levelData.width;
    const idx = row * width + col;
    const connections = editorTestGame.connections.get(idx) || [];
    const restrictions = editorTestGame.levelData.restrictions || {};
    const gameMode = editorTestGame.levelData.gameMode || 'classic';
    const isSubtraction = gameMode === 'subtraction';
    const isScummySequences = restrictions.scummySequences || false;
    const isGloriousZeros = restrictions.gloriousZeros || false;
    const cellsToCapture = new Set(); // Track cells to capture ownership
    
    // Calculate match same and add to 10 (unless scummy sequences is on)
    if (!isScummySequences) {
        connections.forEach(connIdx => {
            const connRow = Math.floor(connIdx / width);
            const connCol = connIdx % width;
            const connCell = editorTestGame.board[connRow][connCol];
            
            if (connCell.value !== null) {
                let scored = false;
                
                // Match same
                if (connCell.value === value) {
                    // Glorious zeros: 0+0 = 10 points
                    if (isGloriousZeros && value === 0) {
                        points += 10;
                    } else {
                        points += 1;
                    }
                    scored = true;
                }
                
                // Add to 10 (or subtract in subtraction mode)
                if (isSubtraction) {
                    // In subtraction mode, check if difference equals target
                    if (Math.abs(connCell.value - value) === 10 || connCell.value - value === 10 || value - connCell.value === 10) {
                        points += 2;
                        scored = true;
                    }
                } else {
                    if (connCell.value + value === 10) {
                        points += 2;
                        scored = true;
                    }
                }
                
                // Capture the cell if we scored from it
                if (scored) {
                    cellsToCapture.add(connIdx);
                }
            }
        });
    }
    
    // Sequence scoring - find all sequences including this cell
    const sequencePoints = calculateEditorTestSequences(row, col, value);
    points += sequencePoints;
    
    // Capture matched cells if we scored any points
    if (points > 0) {
        // The placed cell also becomes owned when scoring
        editorTestGame.board[row][col].owner = owner;
        
        cellsToCapture.forEach(connIdx => {
            const connRow = Math.floor(connIdx / width);
            const connCol = connIdx % width;
            editorTestGame.board[connRow][connCol].owner = owner;
        });
    }
    
    return points;
}

function calculateEditorTestSequences(row, col, value) {
    let totalSequencePoints = 0;
    const width = editorTestGame.levelData.width;
    const height = editorTestGame.levelData.height;
    const visited = new Set();
    
    // Try to build sequences in all directions from this cell
    const sequences = findEditorTestSequencesFrom(row, col, value, visited);
    
    sequences.forEach(seq => {
        if (seq.length >= 3) {
            totalSequencePoints += seq.length;
        }
    });
    
    return totalSequencePoints;
}

function findEditorTestSequencesFrom(row, col, value, visited) {
    const sequences = [];
    const width = editorTestGame.levelData.width;
    const height = editorTestGame.levelData.height;
    const idx = row * width + col;
    const connections = editorTestGame.connections.get(idx) || [];
    
    // For each connected cell, try to extend sequence in both directions
    connections.forEach(connIdx => {
        const connRow = Math.floor(connIdx / width);
        const connCol = connIdx % width;
        const connCell = editorTestGame.board[connRow][connCol];
        
        if (connCell.value === null) return;
        
        const diff = connCell.value - value;
        if (Math.abs(diff) !== 1) return;
        
        // Found a neighbor that differs by 1, try to build a sequence
        const seqKey = `${Math.min(idx, connIdx)}-${Math.max(idx, connIdx)}-${diff > 0 ? 'asc' : 'desc'}`;
        if (visited.has(seqKey)) return;
        visited.add(seqKey);
        
        // Build sequence in this direction
        const sequence = [value];
        let currentIdx = idx;
        let currentVal = value;
        
        // Extend forward
        let nextIdx = connIdx;
        let nextVal = connCell.value;
        while (nextVal !== null && Math.abs(nextVal - currentVal) === 1 && nextVal - currentVal === diff) {
            sequence.push(nextVal);
            currentIdx = nextIdx;
            currentVal = nextVal;
            
            // Find next in sequence
            const nextConns = editorTestGame.connections.get(currentIdx) || [];
            let found = false;
            for (const nc of nextConns) {
                if (nc === currentIdx) continue;
                const ncRow = Math.floor(nc / width);
                const ncCol = nc % width;
                const ncCell = editorTestGame.board[ncRow][ncCol];
                if (ncCell.value !== null && ncCell.value - currentVal === diff) {
                    nextIdx = nc;
                    nextVal = ncCell.value;
                    found = true;
                    break;
                }
            }
            if (!found) break;
        }
        
        // Extend backward
        currentIdx = idx;
        currentVal = value;
        let prevConns = editorTestGame.connections.get(currentIdx) || [];
        for (const pc of prevConns) {
            if (pc === connIdx) continue;
            const pcRow = Math.floor(pc / width);
            const pcCol = pc % width;
            const pcCell = editorTestGame.board[pcRow][pcCol];
            if (pcCell.value !== null && currentVal - pcCell.value === diff) {
                // Extend backward
                let backIdx = pc;
                let backVal = pcCell.value;
                while (backVal !== null) {
                    sequence.unshift(backVal);
                    currentIdx = backIdx;
                    currentVal = backVal;
                    
                    const backConns = editorTestGame.connections.get(currentIdx) || [];
                    let found = false;
                    for (const bc of backConns) {
                        const bcRow = Math.floor(bc / width);
                        const bcCol = bc % width;
                        const bcCell = editorTestGame.board[bcRow][bcCol];
                        if (bcCell.value !== null && currentVal - bcCell.value === diff) {
                            backIdx = bc;
                            backVal = bcCell.value;
                            found = true;
                            break;
                        }
                    }
                    if (!found) break;
                }
                break;
            }
        }
        
        if (sequence.length >= 3) {
            sequences.push(sequence);
        }
    });
    
    return sequences;
}

function isEditorTestBoardFull() {
    for (let r = 0; r < editorTestGame.levelData.height; r++) {
        for (let c = 0; c < editorTestGame.levelData.width; c++) {
            if (editorTestGame.board[r][c].value === null) return false;
        }
    }
    return true;
}

// ==================== EXPORT/IMPORT FUNCTIONS ====================
function exportCustomLevel() {
    // Check if player has enough creator points
    if (creatorPoints < 1) {
        alert('Not enough Creator Points! Need 1 ⭐ to export.');
        return;
    }
    
    // Deduct cost
    creatorPoints -= 1;
    creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
    saveCreatorData();
    document.getElementById('creatorCreatorPoints').textContent = creatorPoints.toFixed(1);
    
    const levelData = {
        version: '1.0',
        type: 'custom-level',
        exportDate: new Date().toISOString(),
        width: editorWidth,
        height: editorHeight,
        paths: Array.from(editorPaths),
        gameMode: document.getElementById('editorGameMode').value,
        aiDifficulty: document.getElementById('editorAIDifficulty').value,
        restrictions: getEditorRestrictions(),
        iconPack: editorIconPack
    };
    
    const blob = new Blob([JSON.stringify(levelData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-level-${editorWidth}x${editorHeight}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    SoundEffects.playButton();
}

function importCustomLevel(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if player has enough creator points
    if (creatorPoints < 0.5) {
        alert('Not enough Creator Points! Need 0.5 ⭐ to import.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.type !== 'custom-level') {
                alert('This is not a valid custom level file!');
                return;
            }
            
            // Deduct cost
            creatorPoints -= 0.5;
            creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
            saveCreatorData();
            document.getElementById('creatorCreatorPoints').textContent = creatorPoints.toFixed(1);
            
            // Load level data
            editorWidth = data.width || 5;
            editorHeight = data.height || 5;
            document.getElementById('editorWidth').value = editorWidth;
            document.getElementById('editorHeight').value = editorHeight;
            
            editorPaths = new Set(data.paths || []);
            
            // Set game mode
            const modeSelect = document.getElementById('editorGameMode');
            if (data.gameMode) {
                modeSelect.value = data.gameMode;
            }
            
            // Set AI difficulty
            const difficultySelect = document.getElementById('editorAIDifficulty');
            if (data.aiDifficulty && difficultySelect) {
                difficultySelect.value = data.aiDifficulty;
            }
            
            // Set restrictions
            if (data.restrictions) {
                document.getElementById('restrictNoBonus').checked = data.restrictions.noBonus || false;
                document.getElementById('restrictAIFirst').checked = data.restrictions.aiFirst || false;
                document.getElementById('restrictSurvival').checked = data.restrictions.survival || false;
                document.getElementById('restrictScummySeq').checked = data.restrictions.scummySequences || false;
                document.getElementById('restrictGloriousZeros').checked = data.restrictions.gloriousZeros || false;
            }
            
            // Set icon pack
            if (data.iconPack) {
                editorIconPack = data.iconPack;
                const iconPackSelect = document.getElementById('editorIconPack');
                if (iconPackSelect) {
                    iconPackSelect.value = data.iconPack;
                }
            }
            
            updateEditorBoard();
            updateEditorInfo();
            SoundEffects.playUnlock();
            
        } catch (err) {
            alert('Error reading level file: ' + err.message);
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

// Import level into player area (from settings)
let loadedCustomLevel = null;

function importLevelToPlayer(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if player has enough creator points
    if (creatorPoints < 0.5) {
        alert('Not enough Creator Points! Need 0.5 ⭐ to import.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.type !== 'custom-level') {
                alert('This is not a valid custom level file!');
                return;
            }
            
            // Deduct cost
            creatorPoints -= 0.5;
            creatorPoints = Math.round(creatorPoints * 100) / 100; // Fix floating point
            saveCreatorData();
            
            // Store the custom level
            loadedCustomLevel = data;
            
            closeSettings();
            
            // Start a new game with the custom level (settings are locked)
            game.loadCustomLevel(loadedCustomLevel);
            
            SoundEffects.playUnlock();
            game.showMessage('📥 Custom level loaded! (0x multiplier)');
            
        } catch (err) {
            alert('Error reading level file: ' + err.message);
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

// Save editor test state when closing creator center
function saveEditorTestState() {
    if (editorTestMode && editorTestGame) {
        editorSavedTestState = {
            levelData: editorTestGame.levelData,
            board: JSON.parse(JSON.stringify(editorTestGame.board)),
            playerScore: editorTestGame.playerScore,
            aiScore: editorTestGame.aiScore,
            currentCard: editorTestGame.currentCard,
            nextCard: editorTestGame.nextCard,
            isPlayerTurn: editorTestGame.isPlayerTurn,
            gameOver: editorTestGame.gameOver
        };
    }
}

// Restore saved test state
function restoreEditorTestState() {
    if (editorSavedTestState) {
        editorTestGame = {
            ...editorSavedTestState,
            connections: buildConnectionsFromPaths(
                editorSavedTestState.levelData.paths, 
                editorSavedTestState.levelData.width, 
                editorSavedTestState.levelData.height
            )
        };
        editorTestMode = true;
        
        // Update UI
        const btn = document.getElementById('editorTestBtn');
        btn.innerHTML = '⏹️ Stop Game <span class="cost-badge">Free</span>';
        btn.classList.add('testing');
        
        document.querySelector('.level-editor-left').classList.add('testing');
        document.querySelector('.level-editor-center').classList.add('testing');
        document.getElementById('editorTestSection').style.display = 'block';
        
        renderEditorTestBoard();
        updateEditorTestUI();
        
        editorSavedTestState = null;
        return true;
    }
    return false;
}

// Initialize editor when creator center is opened with unlocked features
function initEditorOnOpen() {
    if (creatorCenterUnlocked && document.getElementById('editorBoard')) {
        initLevelEditor();
    }
}