# ☠️ One Way Out

A tense typing survival game. Type fast or die trying.

![One Way Out](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## 🎮 Play Now

**[one-way-out.vercel.app](https://one-way-out.vercel.app)** *(coming soon)*

## 📖 About

Type each sentence exactly as shown before time runs out. Every mistake costs a life. The clock gets faster. How long can you survive?

Featuring 115 creepy horror-themed sentences that get progressively more terrifying as you advance.

## ✨ Features

### Core Gameplay
- ⌨️ **Real-time typing validation** — instant feedback on every keystroke
- ⏱️ **Dynamic timer** — starts at 15s, decreases as you level up
- 💀 **Lives system** — 5 mistakes and it's over
- 🔥 **Combo system** — chain perfect sentences for streaks
- 📊 **WPM tracking** — see your typing speed in real-time

### Game Modes
| Mode | Lives | Timer | Description |
|------|-------|-------|-------------|
| 🟢 **Casual** | 7 | Slow (20s→8s) | For beginners |
| 🟡 **Normal** | 5 | Medium (15s→5s) | The standard experience |
| 🔴 **Nightmare** | 3 | Fast (12s→4s) | No mercy |
| 📅 **Daily Challenge** | 5 | Fixed (12s) | Same sentences for everyone, one attempt per day |

### Progression
- 🏆 **17 Achievements** — unlock milestones for levels, combos, WPM, and more
- 📈 **Stats Dashboard** — track your total games, best scores, and improvement
- 🏅 **Personal Bests** — saved locally, compete against yourself

### Social
- 📤 **Share Score** — generate a shareable card with your stats
- 🐦 **Twitter/X Integration** — one-click share to Twitter
- 💬 **WhatsApp Integration** — share with friends directly

### Polish
- 🎨 **Dark horror theme** — black, bone white, blood red
- 🔊 **Atmospheric audio** — heartbeat, keystrokes, horror sounds
- 📱 **Mobile support** — virtual keyboard for touchscreen devices
- ✨ **Visual effects** — screen shake, red flash, timer pulse

## 🛠️ Tech Stack

- **Framework:** React 19
- **Build:** Vite 7
- **Styling:** Tailwind CSS 4
- **Audio:** Web Audio API (procedural sounds)
- **Storage:** localStorage

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Tusharx1143/one-way-out.git
cd one-way-out

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── StartScreen.jsx      # Main menu, difficulty select, stats
│   ├── GameScreen.jsx       # Active gameplay
│   ├── GameOverScreen.jsx   # Death screen with stats
│   ├── SentenceDisplay.jsx  # Sentence rendering with highlighting
│   ├── StatsBar.jsx         # Level, timer, lives, WPM display
│   ├── VirtualKeyboard.jsx  # Mobile touch keyboard
│   ├── ShareCard.jsx        # Social sharing modal
│   ├── AchievementPopup.jsx # Achievement unlock notification
│   └── Creature.jsx         # (Placeholder for future horror elements)
├── hooks/
│   ├── useGame.js           # Core game logic
│   ├── useSound.js          # Audio system
│   └── useStats.js          # Persistent stats & achievements
├── config/
│   ├── difficulty.js        # Difficulty mode settings
│   ├── achievements.js      # Achievement definitions
│   └── dailyChallenge.js    # Daily challenge seeding
└── data/
    └── sentences.json       # 115 horror sentences
```

## 🏆 Achievements

| Achievement | Requirement |
|-------------|-------------|
| 🌟 Survivor | Reach level 5 |
| ⚔️ Fighter | Reach level 10 |
| 🛡️ Warrior | Reach level 20 |
| 👑 Legend | Reach level 30 |
| 💀 Immortal | Reach level 50 |
| 🔥 Combo Starter | Get a 3x combo |
| 🔥 On Fire | Get a 5x combo |
| 💥 Unstoppable | Get a 10x combo |
| ⌨️ Quick Fingers | Reach 50 WPM |
| ⚡ Speed Demon | Reach 80 WPM |
| 🌩️ Lightning Hands | Reach 100 WPM |
| 😈 Nightmare Survivor | Level 10 on Nightmare |
| ✨ Perfect Run | 5 levels without mistakes |
| 🎯 Dedicated | Play 10 games |
| 🏅 Veteran | Play 50 games |

## 📜 License

MIT

## 🤝 Contributing

PRs welcome! Feel free to:
- Add more sentences
- Create new achievements
- Improve mobile experience
- Add new game modes

---

**Type fast. Stay alive. Find your way out.** ☠️
