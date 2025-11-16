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

class NumberConnectionGame {
  constructor() {
      this.gridSize = 5;
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
      
      // Powerups
      this.skipAIAvailable = 1;
      this.skipAIUsed = false;
      this.replaceCardAvailable = 2;
      
      // Settings
      this.aiDifficulty = this.loadDifficulty();
      this.currentTheme = this.loadTheme();
      this.gameMode = this.loadGameMode();
      this.sfxEnabled = this.loadSFX();
      
      // Blitz mode
      this.blitzInterval = null;
      this.blitzActive = false;
      
      // Statistics
      this.stats = this.loadStats();
      
      this.applyTheme(this.currentTheme);
      this.updateDifficultyDropdown();
      this.updateBoardSizeDropdown();
      this.updateGameModeDropdown();
      this.updateSFXToggle();
      this.updateStatsDisplay();
      this.updateThemeUnlocks();
      this.updateBoardSizeUnlocks();
      
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

  loadGameMode() {
      return localStorage.getItem('gameMode') || 'classic';
  }

  saveGameMode(mode) {
      localStorage.setItem('gameMode', mode);
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
          { name: 'royal', wins: 10 }
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
      
      // Check if 7x7 is locked
      if (newSize === 7 && this.stats.wins < 10) {
          alert('🔒 7x7 board is locked! You need 10 wins to unlock it.');
          this.updateBoardSizeDropdown();
          return;
      }
      
      if (newSize !== this.gridSize) {
          this.gridSize = newSize;
          this.totalCells = this.gridSize * this.gridSize;
          this.deckSize = this.totalCells;
          closeSettings();
          this.newGame();
      }
  }

  changeGameMode(value) {
      SoundEffects.playButton();
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
      // Remove all theme classes
      document.body.className = '';
      
      // Apply new theme
      if (theme !== 'default') {
          document.body.classList.add(theme + '-theme');
      }
      
      // Update active state on ALL theme options (both sections)
      document.querySelectorAll('.theme-option').forEach(option => {
          option.classList.remove('active');
      });
      
      // Find and activate the selected theme (search in both sections)
      const activeTheme = document.querySelector(`.theme-option.${theme}`);
      if (activeTheme) {
          activeTheme.classList.add('active');
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
      
      // Show message for blitz mode
      if (this.gameMode === 'blitz') {
          this.showMessage('BLITZ MODE: Place your first card to start the race! 🏁');
      } else if (this.gameMode === 'nobonus') {
          this.showMessage('NO BONUS MODE: No bonus points at the end!');
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
      
      // Check if AI has cards and there are empty cells
      if (this.aiDeck.length === 0) {
          this.checkGameEnd();
          return;
      }
      
      const hasEmptyCells = this.mapState.some(cell => cell === null);
      if (!hasEmptyCells) {
          this.checkGameEnd();
          return;
      }
      
      // Random delay between 900-1100ms (1000ms average ± 100ms)
      const delay = 900 + Math.random() * 200;
      
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
              
              // Check if game should end
              this.checkGameEnd();
              
              // If game hasn't ended, schedule next move
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
          if (cell && cell.classList.contains('empty')) {
              const cellIndex = parseInt(cell.dataset.index);
              this.hoveredCellIndex = cellIndex;
              this.highlightNearbyConnections(cellIndex);
          }
      });

      mapGrid.addEventListener('mouseout', (e) => {
          const cell = e.target.closest('.map-cell');
          if (cell && cell.classList.contains('empty')) {
              this.hoveredCellIndex = null;
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
              const neighbors = this.getPotentialNeighbors(i);                        if (neighbors.length > 0) {
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

      for (let i = 0; i < this.deckSize; i++) {
          this.playerDeck.push(Math.floor(Math.random() * 10));
          this.aiDeck.push(Math.floor(Math.random() * 10));
      }
  }

  drawNextCard() {
      if (this.playerDeck.length > 0) {
          this.currentPlayerCard = this.playerDeck.shift();
          document.getElementById('currentCard').textContent = this.currentPlayerCard;
          this.isPlayerTurn = true;
          this.enablePlayerInput();
      } else {
          document.getElementById('currentCard').textContent = '—';
          this.currentPlayerCard = null;
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
      
      document.getElementById('skipAiCount').textContent = this.skipAIAvailable;
      document.getElementById('replaceCardCount').textContent = this.replaceCardAvailable;
      
      const isSurvival = this.gameMode === 'survival';
      const isBlitz = this.gameMode === 'blitz';
      
      skipBtn.disabled = this.skipAIAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival || isBlitz;
      replaceBtn.disabled = this.replaceCardAvailable === 0 || !this.isPlayerTurn || this.gameEnded || isSurvival;
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
          
          // Put current card back into deck
          this.playerDeck.push(this.currentPlayerCard);
          
          if (this.playerDeck.length > 0) {
              // Shuffle and draw a new card
              const randomIndex = Math.floor(Math.random() * this.playerDeck.length);
              this.currentPlayerCard = this.playerDeck.splice(randomIndex, 1)[0];
              document.getElementById('currentCard').textContent = this.currentPlayerCard;
              this.showMessage("🔄 Card replaced!");
              SoundEffects.playPowerup();
          } else {
              this.currentPlayerCard = null;
              document.getElementById('currentCard').textContent = '—';
              this.showMessage("No cards left!");
              this.checkGameEnd();
          }
          
          this.updatePowerupDisplay();
      }
  }

  createFloatingCard(number, startX, startY, endX, endY, isPlayer) {
      const card = document.createElement('div');
      card.className = `floating-card ${isPlayer ? 'player' : 'ai'}`;
      card.textContent = number;
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
      });

      mapGrid.addEventListener('dragover', (e) => {
          if (!this.isPlayerTurn || this.gameEnded) return;
          e.preventDefault();
          const cell = e.target.closest('.map-cell');
          if (cell && cell.classList.contains('empty')) {
              cell.classList.add('drag-over');
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

      const playedCard = this.currentPlayerCard;
      this.currentPlayerCard = null;
      this.isPlayerTurn = false;

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
          document.getElementById('currentCard').textContent = this.currentPlayerCard;
      } else {
          document.getElementById('currentCard').textContent = '—';
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
          } else {
              this.showMessage(`No points this turn.`);
          }
          
          this.updateMap();

          // Check if game should end after player's turn
          if (this.shouldGameEnd()) {
              this.endGame();
              return;
          }

          // Start blitz mode if this is the first card in blitz mode
          if (this.gameMode === 'blitz' && !this.blitzActive) {
              setTimeout(() => {
                  this.startBlitzMode();
                  this.isPlayerTurn = true;
                  this.enablePlayerInput();
              }, 1000);
          } else if (this.gameMode === 'blitz') {
              // In blitz mode, player can play immediately
              if (this.playerDeck.length > 0 || this.currentPlayerCard !== null) {
                  this.isPlayerTurn = true;
                  this.enablePlayerInput();
              } else {
                  this.checkGameEnd();
              }
          } else {
              // In other modes, AI takes turn (faster - 800ms)
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

      // Check if AI turn should be skipped
      if (this.skipAIUsed) {
          this.skipAIUsed = false;
          this.showMessage("AI turn skipped! ⏭️");
          
          setTimeout(() => {
              // Check if game should end
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
      
      // Faster AI - 600ms
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
                  } else {
                      this.showMessage(`AI played but scored no points.`);
                  }
                  
                  this.updateMap();
                  
                  setTimeout(() => {
                      // Check if game should end
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
          cell ? { ...cell } : null
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
      return (num + 1) % 10;
  }

  getPrevNumber(num) {
      return (num - 1 + 10) % 10;
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

  updateMap() {
      const cells = document.querySelectorAll('.map-cell');
      cells.forEach((cell, index) => {
          const cellData = this.mapState[index];
          
          if (cellData) {
              cell.textContent = cellData.number;
              cell.classList.remove('empty', 'neutral', 'player-owned', 'ai-owned');
              
              if (cellData.owner === 'player') {
                  cell.classList.add('player-owned');
              } else if (cellData.owner === 'ai') {
                  cell.classList.add('ai-owned');
              } else {
                  cell.classList.add('neutral');
              }
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
      // Check if all cells are filled
      const hasEmptyCells = this.mapState.some(cell => cell === null);
      
      // Check if both decks are empty AND current player card is null
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
      
      // Check if this is no bonus mode
      const isNoBonus = this.gameMode === 'nobonus';
      
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

          // Check for unlocks before updating stats
          const prevWins = this.stats.wins;
          const unlockedItems = [];

          this.stats.gamesPlayed++;
          if (this.playerScore > this.aiScore) {
              this.stats.wins++;
              
              // Check for unlocks
              if (prevWins < 3 && this.stats.wins >= 3) {
                  unlockedItems.push('🔥 Fire Theme');
              }
              if (prevWins < 5 && this.stats.wins >= 5) {
                  unlockedItems.push('🌙 Midnight Theme');
              }
              if (prevWins < 10 && this.stats.wins >= 10) {
                  unlockedItems.push('👑 Royal Theme', '⭐ 7x7 Board');
              }
          } else if (this.aiScore > this.playerScore) {
              this.stats.losses++;
          } else {
              this.stats.ties++;
          }
          this.saveStats();

          setTimeout(() => {
              const gameOver = document.getElementById('gameOver');
              const winnerText = document.getElementById('winnerText');
              const unlockMessage = document.getElementById('unlockMessage');
              
              if (this.playerScore > this.aiScore) {
                  winnerText.textContent = '🎉 YOU WIN! 🎉';
                  winnerText.style.color = '#4CAF50';
                  SoundEffects.playWin();
                  
                  // Show unlock message if any
                  if (unlockedItems.length > 0) {
                      unlockMessage.textContent = '🎊 Unlocked: ' + unlockedItems.join(', ');
                      SoundEffects.playUnlock();
                  } else {
                      unlockMessage.textContent = '';
                  }
              } else if (this.aiScore > this.playerScore) {
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
      this.skipAIAvailable = this.gameMode === 'survival' ? 0 : 1;
      this.skipAIUsed = false;
      this.replaceCardAvailable = this.gameMode === 'survival' ? 0 : 2;
      this.blitzActive = false;
      
      this.stopBlitzMode();
      
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
  // Check if theme is locked
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

function changeBoardSize(value) {
  game.changeBoardSize(value);
}

function changeGameMode(value) {
  game.changeGameMode(value);
}

function toggleRules() {
  SoundEffects.playButton();
  const rules = document.querySelector('.rules');
  rules.style.display = rules.style.display === 'none' ? 'block' : 'none';
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