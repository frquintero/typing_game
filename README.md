# Typing Speed Game

A modern, accessible typing speed test game built with Next.js 14, TypeScript, and Tailwind CSS. Test your typing speed and accuracy with various themes and difficulty levels.

![Typing Game Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Typing+Speed+Game)

## Features

- **Real-time Typing Test**: Measure your words per minute (WPM) and accuracy
- **Multiple Difficulty Levels**: Easy, Medium, and Hard
- **Themed Content**: Programming, Motivational, Fitness, and Normal themes
- **Focus Mode**: Practice without time pressure
- **Power-ups**: Slow motion mode for challenging sections
- **Leaderboard**: Track your best scores
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Full screen reader support and keyboard navigation
- **Animations**: Smooth Framer Motion animations
- **Dark Mode**: Automatic dark/light mode support

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd typing-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How to Play

1. **Select Settings**: Choose your time limit (15s, 30s, 60s), difficulty level, and theme
2. **Start Game**: Click "Start Game" or enable Focus Mode for untimed practice
3. **Type the Text**: Type the displayed text as quickly and accurately as possible
4. **View Results**: See your WPM, accuracy, and error count
5. **Check Leaderboard**: View your high scores and compete with yourself

### Game Modes

- **Timed Mode**: Race against the clock (15, 30, or 60 seconds)
- **Focus Mode**: Practice without time pressure, focusing on accuracy
- **Power-ups**: Unlock slow motion mode after 3 perfect consecutive words

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with error boundary
│   ├── page.tsx           # Main page with view management
│   └── globals.css        # Global styles
├── components/
│   ├── game/              # Game-related components
│   │   ├── Game.tsx       # Main game component
│   │   ├── TextDisplay.tsx # Typing interface
│   │   ├── MetricsBar.tsx # WPM, accuracy, errors display
│   │   └── ResultsModal.tsx # Game completion results
│   ├── leaderboard/       # Leaderboard component
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx     # Custom button component
│   │   ├── SelectionPanel.tsx # Game settings panel
│   │   └── ErrorBoundary.tsx # Error boundary component
│   └── contexts/          # React contexts
├── hooks/                 # Custom React hooks
│   ├── useGame.ts         # Game state management
│   └── useLeaderboard.ts  # Leaderboard management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── calculations.ts    # WPM and accuracy calculations
│   ├── textThemes.ts      # Text generation by theme
│   └── localStorage.ts    # Local storage utilities
└── tests/                 # Test files
```

## Configuration

### Game Settings

- **Time Limits**: 15, 30, or 60 seconds
- **Difficulty Levels**:
  - Easy: Common words and short sentences
  - Medium: Mixed vocabulary with some complexity
  - Hard: Advanced vocabulary and longer sentences
- **Themes**:
  - Normal: General English text
  - Programming: Code-related terms and concepts
  - Motivational: Inspirational quotes and phrases
  - Fitness: Health and exercise terminology

### Customization

The game can be customized by modifying the following files:

- `src/utils/textThemes.ts`: Add new themes or modify existing ones
- `src/utils/calculations.ts`: Adjust scoring algorithms
- `tailwind.config.js`: Modify color schemes and styling
- `src/types/game.ts`: Extend game types and configurations

## Accessibility

This application is fully accessible and includes:

- **Screen Reader Support**: All interactive elements have proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Good color contrast ratios
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Keyboard Shortcuts

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and selections
- **Backspace**: Delete typed characters during gameplay
- **Escape**: Close modals (when applicable)

## Performance

The application is optimized for performance:

- **Code Splitting**: Components are lazy-loaded
- **Memoization**: React.memo prevents unnecessary re-renders
- **Efficient Updates**: useCallback and useMemo optimize hook performance
- **Bundle Analysis**: Minimal bundle size with tree shaking

## Testing

Run the test suite:

```bash
npm test
```

### Test Coverage

- Unit tests for hooks and utilities
- Component tests for UI elements
- Integration tests for game flow
- Accessibility testing included

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**Game doesn't start**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Text not displaying correctly**
- Check your browser's font settings
- Ensure internet connection for theme loading
- Try a different theme

**Leaderboard not saving**
- Check browser localStorage permissions
- Clear browser data if corrupted
- Scores are stored locally in your browser

**Performance issues**
- Close other browser tabs
- Update to latest browser version
- Check computer resources

### Development Issues

**Build fails**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Tests failing**
```bash
npm run test -- --watchAll=false
```

**TypeScript errors**
```bash
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Use semantic commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Tested with [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/)

---

**Enjoy typing and improving your skills!** ⌨️