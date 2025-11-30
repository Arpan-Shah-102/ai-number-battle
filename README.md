# 🎲 Number Battle 🎲

A strategic card-based puzzle game where you compete against an AI opponent on a connected grid. Place your numbered cards wisely to score points through matches, sums, and sequences!

![Number Battle Game](./assets/favicon.png)

## ✨ What's New

- Added 4 new Game Modes: Testing Time, Ludicrously Lucky, Fog of War, Territorial
- Added 3 new Restrictions: Single Path, Scummy Sequences, Glorious Zeros
- UX improvement: Shop now includes quick "⚙️ Go to Settings" buttons that jump to the relevant Settings section

## 🎮 How to Play

### Basic Rules
- **You and the AI take turns** placing numbered cards (0-9) on a grid
- **Cells are connected** by paths - you can only score if numbers are connected!
- **First to fill the board** triggers endgame bonuses

### Scoring System
| Move Type | Points | Example |
|-----------|--------|---------|
| **Same Number** | 1 pt | 6 connects to 6 |
| **Add to Ten** | 2 pts | 3 connects to 7 |
| **Sequence** | 1 pt per number | 2→3→4 = 3 pts |
| **Bonus** | 1 pt per owned cell | At game end |


Notes on new scoring and modes:
- **Territorial mode** uses owned tiles as the final score — endgame bonus is effectively that tile count.
- **Glorious Zeros** restriction: 0+0 pairs are worth 10 points if enabled (instead of 1).
- **Scummy Sequences** restriction: only sequence scoring applies — normal match/add-to-ten scoring is disabled.

## 🕹️ Game Modes

| Mode | Multiplier | Description |
|------|------------|-------------|
| **Classic** | 1.0x | Standard gameplay |
| **No Bonus** | 1.1x | No end-game cell bonuses |
| **Survival** | 1.25x | Progressive difficulty |
| **Blitz** | 2.5x | Race against the clock! AI moves automatically |
| **Sudden Death** | 3.0x | First player to score wins! |
| **Chain Reaction** | 0.8x | Cells explode when scored - create combos! |
| **Reverse Rules** | 5.0x | Everything is backwards - lower scores win! |
| **Mirror Match** | 1.5x | You and AI get the same cards |
| **Subtraction** | 1.5x | Numbers subtract instead of add |
| **Testing Time** | 1.5x | 10 second turns; time decreases by 0.1s each turn (67 pts) |
| **Ludicrously Lucky** | 3.0x | Game may end randomly after turn 3 (80 pts) |
| **Fog of War** | 1.75x | Only revealed cells (placed by you or adjacent) are visible (100 pts) |
| **Territorial** | 2.0x | Final score = number of tiles you own (bonus points don't apply) (125 pts) |

## 🔒 Restrictions

Purchase restrictions from the shop to enable optional handicaps for bonus multipliers!

| Restriction | Price | Multiplier | Effect |
|-------------|-------|------------|--------|
| **No Bonus Points** | 5 pts | 1.2x | Disables end-game cell bonus |
| **AI First** | 10 pts | 1.05x | AI makes the first move |
| **Maintained Paths** | 20 pts | 0.8x | Full grid connections (easier) |
| **Single Path** | 30 pts | 1.4x | Game grid is a single winding path; blocking/territory becomes strategic |
| **Scummy Sequences** | 40 pts | 1.6x | Only sequence scoring is allowed; matches/add-to-ten give no points |
| **Glorious Zeros** | 50 pts | 0.9x | 0+0 matches are worth 10 points instead of 1 |

> Multipliers stack! Combine restrictions with game modes for maximum earnings.

## 🛒 Shop System

Earn **Shop Points** by winning games! Your earnings are multiplied by:
- **Game Mode** multiplier (0.8x to 5.0x)
- **AI Difficulty** multiplier (0.5x to 1.5x)
- **Active Restrictions** (stackable)
- **Base Multiplier** upgrades (+0.1x per level)
- **Double Points** power-up (+2.0x when active)

### Shop Categories
- **🎮 Power-ups** - One-time use abilities (Skip AI, Replace Card, Undo, etc.)
- **🗺️ Board Sizes** - Unlock 3x3 to 8x8 grids
- **🎮 Game Modes** - Unlock challenging game modes
- **🤖 AI Difficulty** - Unlock Novice (easy) to Master (hard)
- **🎨 Themes** - Customize your game's look
- **🎭 Icon Packs** - Different number styles (Emoji, Moon Phases)
- **🔒 Restrictions** - Challenge yourself for bonus multipliers
- **⭐ Base Multiplier** - Permanent pts boost
- **⚡ Permanent Power-ups** - Start each game with extra power-ups

UX note: The Shop includes "⚙️ Go to Settings" buttons for quick navigation to the Game Modes, Restrictions, AI Difficulty, Themes, Icon Packs, and Board Sizes sections of Settings.

## ⚡ Power-ups

| Power-up | Uses | Description |
|----------|------|-------------|
| **⏭️ Skip AI Turn** | 1 | Skip the AI's next turn |
| **🔄 Replace Card** | 3 | Get a new random card |
| **👁️ View Next** | 1 | See your next card |
| **↩️ Undo Move** | 1 | Undo your last move |
| **🎯 Pick Card** | 1 | Choose any number (0-9) |
| **💎 Double Points** | 1 | 2x pts multiplier for the game |

## 🤖 AI Difficulty Levels

| Level | Shop Pts Multiplier |
|-------|---------------------|
| Novice | 0.5x |
| Beginner | 0.75x |
| Intermediate | 1.0x |
| Skilled | 1.1x |
| Advanced | 1.2x |
| Expert | 1.3x |
| Pro | 1.4x |
| Master | 1.5x |

## 🎨 Themes

- **Default** - Purple gradient
- **Dark** - Dark mode
- **Nature** - Green tones
- **Sunset** - Warm colors
- **Ocean** - Blue gradient
- **Fire** 🔥 - Red/orange (Shop)
- **Midnight** 🌙 - Deep dark (Shop)
- **Royal** 👑 - Purple/gold (Shop)
- **Cosmic** 🌌 - Space theme (Shop)
- **Lava** 🌋 - Red/purple (Shop)
- **Emerald** 💎 - Teal/green (Shop)

## 🎓 Tutorial

Click the **🎓 Tutorial** button in-game to learn the basics with an interactive demo!

## 💾 Save System

Your progress is automatically saved to your browser's local storage:
- Game statistics (wins, losses, ties, high score)
- Shop points and owned items
- Settings and preferences
- Power-up inventories

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with gradients, animations, and themes
- **Vanilla JavaScript** - Game logic and AI
- **Web Audio API** - Sound effects
- **LocalStorage** - Save system

## 📁 Project Structure

```
P19 AI Moon Game/
├── index.html      # Main game page
├── style.css       # Styles and themes
├── script.js       # Game logic and AI
├── assets/
│   └── favicon.png # Game icon
└── README.md       # This file
```

## 🚀 Getting Started

### Two ways to start playing

#### One
Go to: https://arpan-shah-102.github.io/ai-number-battle

### Two
1. Clone or download the project
2. Open `index.html` in a modern web browser
3. Start playing!

No server or build tools required - it's a pure client-side game!

## 📱 Mobile Support

The game is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

Touch controls are supported for mobile devices.

## 🎯 Tips for New Players

1. **Watch the connections** - Only connected cells can score together
2. **Plan for sequences** - They're worth the most points per move
3. **Claim territory early** - More owned cells = bigger end bonus
4. **Use power-ups wisely** - Save them for critical moments
5. **Try different modes** - Each mode requires different strategies

## 📝 License

This project is open source and available for personal use and learning.

---

Made with ❤️ and JavaScript

**Enjoy playing Number Battle!** 🎲
