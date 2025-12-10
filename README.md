# 🎲 Number Battle 🎲

A strategic card-based puzzle game where you compete against an AI opponent on a connected grid. Place your numbered cards wisely to score points through matches, sums, and sequences!

## Website
https://arpan-shah-102.github.io/ai-number-battle

## ✨ What's New

- **🔧 Major Bug Fixes**:
  - Custom level imports now properly apply board size, paths, AI difficulty, gamemode, restrictions, and icon pack
  - Cell sizes now scale responsively for irregular/imported board dimensions
  - Floating points display updates immediately when spending in casino, shop, or quests
  - Quests now properly detect completion and update UI in real-time
- **💰 Casino Improvements**:
  - Maximum bet limit of 1,000 points per game
  - Decimal betting support (e.g., bet 25.50 points)
  - New "Half" button to quickly bet 50% of your points
  - Points display shows decimals (e.g., 125.75 pts)
- **⚡ Power-up Fixes**:
  - Double Points powerup now shows +1.0x multiplier (not +2.0x) and disables after use
  - Skip AI Turn and View Next Card powerups now disable after use until round ends
  - Permanent Double Points limited to 1 purchase max
  - Other permanent powerups capped at 99 purchases each
- **📜 Quest System Updates**:
  - Quest rewards (⭐) now visible in quest list
  - Point Collector and Points Master quests now track casino earnings
  - Quest progress bars update automatically when modal is open
- **🎨 Level Editor** - Create and share custom levels! Design board layouts, choose paths, and test your creations
- **📤 Export/Import** - Share levels with codes, import from others, play custom levels
- **🎡 Roulette** - Casino game! Pick colors (2x) or numbers (10x), Green pays 14x! (567 pts)
- **✨ Creator Center** - Secret area with level editing tools (hint in tutorial!)
- **📜 Quests System** - Complete quests to earn Creator Points
- **💰 Floating Points** - Points display now visible in shop and casino at all times
- **🎨 Theme Updates** - Cosmic and Midnight themes now more visually distinct
- **🔧 UI Improvements** - Better shop layout, back button in casino, centered icon packs
- **🛡️ Easter Egg Limits** - Secret bonuses now limited to prevent exploitation
- **🎮 AI vs AI Controls** - Start/Pause/Resume button for watching AI battles
- **📐 10x10 Board** - Now available on all devices (warning shown on small screens)
- **🎭 Icon Pack Multipliers** - Shown in settings; Moon (0.9x) and Dice (0.8x) give reduced points
- **🎨 Centered Layout** - Game centers on large screens for better viewing
- **🎰 6 Casino Games** - Coin Flip (15 pts), Slots (35 pts), Higher/Lower (70 pts), Blackjack (150 pts), Dice Duel (250 pts), Roulette (567 pts)

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
| **Blitz** | 2.5x | Race against the clock! AI moves automatically |
| **Sudden Death** | 3.25x | First player to score wins! |
| **Chain Reaction** | 0.75x | Cells explode when scored - create combos! |
| **Reverse Rules** | 3.75x | Everything is backwards - lower scores win! |
| **Mirror Match** | 1.4x | You and AI get the same cards |
| **Subtraction** | 1.5x | Numbers subtract instead of add |
| **Time Trials** | 1.35x | 10 second turns; time decreases by 0.1s each turn (67 pts) |
| **Ludicrously Lucky** | 2.5x | Game may end randomly after turn 3 (80 pts) |
| **Fog of War** | 1.5x | Only revealed cells (placed by you or adjacent) are visible (100 pts) |
| **Territorial** | 1.6x | Final score = number of tiles you own (bonus points don't apply) (125 pts) |

## 🔒 Restrictions

Purchase restrictions from the shop to enable optional handicaps for bonus multipliers!

| Restriction | Price | Multiplier | Effect |
|-------------|-------|------------|--------|
| **No Bonus Points** | 5 pts | 1.2x | Disables end-game cell bonus |
| **AI First** | 10 pts | 1.05x | AI makes the first move |
| **Maintained Paths** | 20 pts | 0.75x | Full grid connections (easier) |
| **Survival Mode** | 25 pts | 1.2x | Progressive AI difficulty |
| **Single Path** | 30 pts | 1.3x | Game grid is a single winding path; blocking/territory becomes strategic |
| **Scummy Sequences** | 40 pts | 1.5x | Only sequence scoring is allowed; matches/add-to-ten give no points |
| **Glorious Zeros** | 50 pts | 0.75x | 0+0 matches are worth 10 points instead of 1 |
| **AI vs AI** | 200 pts | 0.5x | Watch two AIs battle! Pick your AI difficulty to root for |

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
| **⏭️ Skip AI Turn** | 1 | Skip the AI's next turn (disabled until round ends) |
| **🔄 Replace Card** | 3 | Get a new random card |
| **👁️ View Next** | 1 | See your next card (disabled until round ends) |
| **↩️ Undo Move** | 1 | Undo your last move |
| **🎯 Pick Card** | 1 | Choose any number (0-9) |
| **💎 Double Points** | 1 | +1.0x pts multiplier for the game (disabled after use) |

## 🎰 Casino

Click the **🎲 dice icons** in the game title to open the Casino! Gamble your shop points on various games.

### Casino Games

| Game | Unlock Price | Payout | Description |
|------|-------------|--------|-------------|
| 🪙 **Coin Flip** | 15 pts | 2x | 50/50 chance - choose heads or tails! |
| 🎰 **Slots** | 35 pts | 77.7 pts | Match 3 symbols for jackpot! |
| 🎯 **Higher/Lower** | 70 pts | 1.5x | Guess if hidden number is higher or lower |
| 🃏 **Blackjack** | 150 pts | 2x | Beat the dealer! Get closer to 21 without busting |
| 🎲 **Dice Duel** | 250 pts | 2x | Roll two dice vs dealer - highest total wins! |
| 🎡 **Roulette** | 567 pts | Varies | Bet on colors or numbers - spin the wheel! |

> Games are displayed in price order. Unlockable games show a **green glow** when you can afford them!

**Betting Features:**
- Maximum bet: **1,000 points** per game
- **Decimal betting** supported (e.g., bet 25.50 points)
- **Half button** - quickly bet 50% of your points
- **Max button** - bet maximum (capped at 1,000)

### Coin Flip
- Bet any amount of your shop points
- Choose **Heads** or **Tails**
- Win = **2x your bet** returned
- Lose = lose your bet
- Features animated 3D coin flip!

### Higher/Lower
- Two random numbers between 1-100 are generated
- You see one number, the other is hidden
- Guess if the hidden number is **higher** or **lower**
- Win = **3x your bet** returned
- The numbers are never the same!

### Blackjack
- Classic 21 card game against the dealer
- Enter your bet, then click "Deal Cards" to start
- Face cards are worth 10, Aces are worth 1 or 11 (auto-chosen to avoid busting)
- **Hit** to take another card, **Stand** to keep your hand
- Beat the dealer without going over 21
- Win = **2x your bet** returned
- Ties return your bet

### Dice Duel
- Roll two dice against the dealer
- Your dice are rolled first with animation
- Then the dealer's dice are revealed
- Higher total wins = **2x your bet** returned
- Ties return your bet

### Roulette
- Simplified casino roulette wheel with 10 numbers (0-9)
- Choose your bet type: **Color** (Red/Black/Green) or **Number** (0-9)
- Color bets pay **2x** your wager (Green pays **14x**)
- Number bets pay **10x** your wager
- Watch the animated wheel spin!
- 0 is green, odd numbers are red, even numbers are black

> **Tip:** Use the "Max" button to bet all your points at once!

## ✨ Creator Center

A hidden feature for dedicated players! Unlock the ability to create and share custom levels.

### How to Unlock
1. Click on the **AI Score** display
2. Within 5 seconds, click on the **Player Score** display
3. Within 5 seconds, click on the **Current Card** display
4. The Creator Center will open!

> **Tip:** The tutorial mentions this secret sequence!

### Requirements
- **500 Shop Points** to access Creator Center features
- **1 Creator Point** to unlock special abilities
- Creator Points are earned through the **Quests** system

### Level Editor
Once unlocked, you can create custom levels:

#### Left Panel - Level Settings
- **Board Size**: Choose dimensions from 2x2 to 8x8
- **Game Mode**: Select any game mode (Classic, Blitz, Subtraction, etc.)
- **AI Difficulty**: Set the AI from Novice to Master
- **Restrictions**: Toggle any restrictions (AI First, Glorious Zeros, etc.)

#### Center - Board Editor
- **Click and drag** between cells to draw paths
- **Click existing paths** to remove them
- Paths must connect horizontally or vertically adjacent cells
- All cells should be reachable through paths

#### Right Panel - Level Actions
- **Icon Pack**: Preview different icon packs in test mode
- **Test Game**: Play your level with the current settings
- **Clear All**: Remove all paths and reset the board
- **Export Level**: Save your level to a shareable code (costs 1 ⭐)
- **Import Level**: Load a level from a code

### Test Game Features
- Cells are colored **green (player)**, **red (AI)**, or **gray (neutral)** based on ownership
- **Full AI difficulty support** - AI intelligence scales from Novice to Master
- **All game modes work**:
  - Sudden Death: First to 10 points wins
  - Reverse Rules: Lower score wins, AI tries to minimize scoring
  - Territorial: Final score = owned cell count
  - Subtraction: Numbers subtract instead of add
- **All restrictions apply**: AI First, No Bonus, Scummy Sequences, Glorious Zeros
- Scoring includes same matches, add-to-10, and sequences
- End-game bonus points flash with a golden animation
- **Left-click drag** to draw paths, **right-click drag** to erase (tool toggles behavior)

### Exporting Levels
- Export costs **1 Creator Point** per export
- Creates a JSON level file
- Includes board size, paths, game mode, AI difficulty, and restrictions

### Importing Levels
- Paste a level code to import (costs 0.5 ⭐)
- **In Editor**: Load the level for editing/testing
- **In Player Mode**: Load as a custom level to play (shows "Custom Level" indicator, settings and icon packs are locked)

### Developer Secrets
There are hidden developer bonuses in the Creator Center:
- Click the **Creator Center title** 15 times within 3 seconds
- Click the **Level Editor title** 15 times within 3 seconds
- Each grants **+1000 Shop Points** and **+5 Creator Points**!

## 📋 Quests

Earn Creator Points by completing quests!

### How It Works
- Access Quests via the **Quests** button below Shop
- **3 random quests** are available at a time (picked from 12 possible quests)
- Each quest tracks your progress with a progress bar
- Claim **1-2 Creator Points** when a quest is complete
- **Refresh** quests for 5 points (if you want different ones)

### Quest Types
| Quest | Goal | Reward | Notes |
|-------|------|--------|-------|
| Point Collector | Earn 1,000 points | 1⭐ | Includes casino earnings |
| Card Shark | Play Blackjack 3 times | 1⭐ | |
| Speed Runner | Play Time Trials 3 times | 1⭐ | |
| Lucky Streak | Win 3 casino games in a row | 1⭐ | |
| High Roller | Bet 500+ points in one casino game | 1⭐ | |
| Marathon Player | Play 10 games in one session | 1⭐ | |
| Casino Regular | Win 5 casino games | 1⭐ | |
| Jackpot Hunter | Hit the slots jackpot | 2⭐ | |
| Blitz Champion | Win 3 Blitz mode games | 1⭐ | |
| Points Master | Earn 5,000 points total | 2⭐ | Includes casino earnings |
| Blackjack Pro | Play Blackjack 10 times | 2⭐ | |
| Time Trial Expert | Play Time Trials 10 times | 2⭐ | |

> Quest rewards are now visible in the quest list! Progress bars update in real-time when the quest modal is open.

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
- **Meme** 😂 - Yellow/coral (Shop, 67 pts)
- **Money** 💵 - Green/gold (Shop, 77 pts)

## 🎭 Icon Packs

| Icon Pack | Price | Multiplier | Description |
|-----------|-------|------------|-------------|
| **Default** | Free | 1.0x | Standard numbers (0-9) |
| **Emoji** | 3 pts | 1.0x | Number emojis (0️⃣-9️⃣) |
| **Font** | 10 pts | 1.0x | Stylized Orbitron font |
| **Moon** | 25 pts | 0.9x | Moon phases (🌑-🌘) |
| **Dice** | 40 pts | 0.8x | Dice faces (⚀-⚅) |
| **Roman** | 55 pts | 1.15x | Roman numerals (I-X) |

> **Note:** Some icon packs have reduced point multipliers as a trade-off for their unique visuals!

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

## 🔧 Recent Fixes & Improvements

### Custom Level Importing
- Custom levels now properly apply all settings: board size, paths, AI difficulty, gamemode, restrictions, and icon pack
- Cell sizes scale responsively for irregular board dimensions (e.g., 7x5 boards)
- Fixed issue where imported levels wouldn't work correctly

### Casino System
- Added 1,000 point maximum bet limit to prevent excessive betting
- Decimal betting support - bet fractions like 25.50 points
- New "Half" button to quickly bet 50% of your points
- Floating points display now updates immediately when spending
- All point displays show decimals for precision

### Power-ups
- **Double Points**: Now correctly shows +1.0x multiplier (not +2.0x), disables after use
- **Skip AI Turn**: Disables after use until the round ends (prevents spam)
- **View Next Card**: Disables after use until the round ends
- **Permanent Double Points**: Limited to 1 purchase maximum
- **Other Permanent Power-ups**: Capped at 99 purchases each
- Shop now shows max limits and disables buttons when caps are reached

### Quest System
- Quest rewards (⭐) now visible in quest titles and claim buttons
- Point Collector and Points Master quests now track casino earnings
- Quest progress bars update in real-time when modal is open
- Fixed completion detection issues

### UI/UX Improvements
- Removed alert popups from permanent purchases (replaced with in-game messages)
- Floating points badges in casino/shop/quests modals update instantly
- Better feedback when hitting purchase limits

## 📝 License

This project is open source and available for personal use and learning.

---

Made with ❤️ and JavaScript

**Enjoy playing Number Battle!** 🎲