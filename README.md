# Reality Reigns

<!-- BADGES:START -->
[![ai](https://img.shields.io/badge/-ai-ff6f00?style=flat-square)](https://github.com/topics/ai) [![card-game](https://img.shields.io/badge/-card--game-blue?style=flat-square)](https://github.com/topics/card-game) [![game](https://img.shields.io/badge/-game-blue?style=flat-square)](https://github.com/topics/game) [![gemini-api](https://img.shields.io/badge/-gemini--api-blue?style=flat-square)](https://github.com/topics/gemini-api) [![pwa](https://img.shields.io/badge/-pwa-blue?style=flat-square)](https://github.com/topics/pwa) [![strategy-game](https://img.shields.io/badge/-strategy--game-blue?style=flat-square)](https://github.com/topics/strategy-game) [![survival](https://img.shields.io/badge/-survival-blue?style=flat-square)](https://github.com/topics/survival) [![typescript](https://img.shields.io/badge/-typescript-3178c6?style=flat-square)](https://github.com/topics/typescript) [![web-app](https://img.shields.io/badge/-web--app-blue?style=flat-square)](https://github.com/topics/web-app) [![swipe-mechanics](https://img.shields.io/badge/-swipe--mechanics-blue?style=flat-square)](https://github.com/topics/swipe-mechanics)
<!-- BADGES:END -->

A survival-strategy card game where you swipe to make decisions across different realities. Inspired by the Reigns game series, Reality Reigns challenges players to maintain balance across four critical stats while navigating through AI-generated scenarios.

## Features

- **Card-Based Gameplay**: Swipe left or right to make choices that affect your kingdom's stats
- **Four Core Stats**: Manage Power, Wealth, People, and Knowledge - don't let any reach 0 or 100!
- **Multiple Realities**: Play through different themed scenarios, each with unique narratives
- **AI-Powered Content**: Dynamic card generation using Google's Gemini API
- **Reality Editor**: Create and customize your own realities with a visual editing interface
- **Store System**: Browse and play community-created realities
- **Progressive Web App**: Install and play offline
- **Sound Effects**: Immersive audio feedback for game actions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd reality-reigns
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. **Choose a Reality**: Select from pre-made realities or create your own
2. **Make Decisions**: Swipe cards left or right to make choices
3. **Manage Stats**: Keep all four stats balanced - if any reach 0 or 100, you lose!
4. **Survive**: See how many turns you can last as a ruler

## Creating Custom Realities

Use the built-in Reality Editor to:
- Define your reality's theme and setting
- Create custom AI instructions for card generation
- Design the visual style (fonts, colors, images)
- Add sound effects and background music
- Test and refine your creation

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Google Gemini API** - AI content generation
- **React Flow** - Visual editor components
- **PWA** - Progressive Web App capabilities

## License

This project is created for educational and entertainment purposes.
