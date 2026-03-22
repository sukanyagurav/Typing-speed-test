# Typing Speed Test

A modern, interactive typing speed test application built with React, Tailwind CSS, and Framer Motion.

- [Github](https://github.com/sukanyagurav/Typing-speed-test)
- [Netlify](https://www.netlify.com/)

![React](https://img.shields.io/badge/React-19-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-000000)

## Preview

![Typing Speed Test Preview](./preview.jpg)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Key Features Explained](#key-features-explained)
- [Architecture](#architecture)

## ✨ Features

### Test Modes
- **Timed Mode**: 60-second countdown test with real-time stats
- **Passage Mode**: Type complete passages at your own pace

### Difficulty Levels
- Easy, Medium, and Hard passages for varied challenge levels
- Randomly selected passages from a data pool

### Real-time Feedback
- Live WPM (Words Per Minute) calculation
- Accuracy percentage tracking
- Character count (correct/incorrect)
- Visual indicators:
  - ✅ Green text for correct characters
  - ❌ Red underlined text for errors
  - Cursor highlighting for current position

### Personal Best Tracking
- "Baseline Established!" on first test
- "High Score Smashed!" celebration with confetti animation
- Persistent storage via localStorage across sessions

### Responsive Design
- Mobile-first approach
- Optimized layouts for all screen sizes
- Smooth animations and transitions

## 🛠 Tech Stack

- **Frontend Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12
- **Build Tool**: Vite 8
- **State Management**: React Hooks (useState, useEffect, useMemo, useRef)

## 📁 Project Structure

```
src/
├── App.jsx              # Main application component
├── main.jsx             # React entry point
├── index.css            # Global styles
├── components/          # Reusable UI components
│   ├── TopStat.jsx     # Statistics display
│   ├── PillGroup.jsx   # Pill button group
│   ├── Dropdown.jsx    # Dropdown selector
│   └── ResultCard.jsx  # Results display card
└── utils/
    └── helpers.js      # Utility functions (refactored)

assets/
├── images/             # SVG icons and images
└── fonts/              # Local font files (Sora)

data.json              # Passage data organized by difficulty
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd typing-speed-test-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local URL (typically `http://localhost:5173`)

### Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 🎮 Usage

1. **Start Testing**: Click "Start Typing Test" or click the passage text to begin
2. **Select Difficulty**: Choose Easy, Medium, or Hard (mobile: dropdown, desktop: pill buttons)
3. **Choose Mode**: Select between Timed (60s) or Passage mode
4. **Type**: Start typing the passage - watch your WPM, accuracy, and character count update in real-time
5. **View Results**: See your performance metrics and how you compare to your personal best
6. **Try Again**: Click "Go Again" or "Beat This Score" to restart with a new passage

## 🔍 Key Features Explained

### Real-time Stats Calculation
```javascript
const stats = {
  wpm: 0,      // Words per minute
  accuracy: 100,    // Percentage
  correct: 0,  // Correct characters
  incorrect: 0 // Wrong characters
}
```

### Personal Best Storage
- Stored in browser localStorage with key `typing-speed-pb`
- Persists across browser sessions
- Automatically updates when beaten

### Passage Selection
- Random passages selected from `data.json`
- Organized by difficulty level (easy, medium, hard)
- Ensures variety by avoiding repeat passages

## 🏗 Architecture

### Component Hierarchy
```
App (Main Container)
├── Header (Logo + Personal Best)
├── Stats Section (WPM, Accuracy, Time)
├── Controls (Difficulty + Mode Selection)
├── Passage Display (Typing Area)
└── Results Screen (Performance Summary)
```

### State Management
- Uses React hooks for clean, functional components
- Separate useEffects for different concerns:
  - Timer management
  - Click-outside detection
  - Test completion logic
  - Passage auto-completion

### Utility Functions (Refactored)
Pure, reusable functions in `src/utils/helpers.js`:
- `calculateStats()` - Compute WPM, accuracy, character counts
- `determineTestResult()` - Evaluate test completion and messaging
- `getIncorrectCharIndices()` - Track character errors
- `calculateDisplayTime()` - Format time display
- `formatTimeLabel()` - Time formatting
- `formatCharsLabel()` - Character count formatting

**Have fun building!** 🚀
