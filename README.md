# Portfolio V2

A modern, interactive portfolio website built with Next.js, featuring smooth animations, 3D graphics, and real-time integrations with GitHub, LeetCode, and Spotify.

## Features

- **3D Sakura Scene**: Interactive Three.js scene with cherry blossom petals and atmospheric effects
- **Smooth Scrolling**: GSAP-powered smooth scroll experience with scroll-triggered animations
- **Real-time Stats**: Live integration with GitHub, LeetCode, and Spotify APIs
- **Interactive Components**: 
  - Digicam-style photo viewer
  - Mixtape music player with Spotify integration
  - Animated text reveals
  - GitHub contribution calendar
  - Dynamic artwork display
- **Responsive Design**: Fully responsive layout with Tailwind CSS
- **Performance Optimized**: Loading states, lazy loading, and optimized animations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP (ScrollSmoother, ScrollTrigger)
- **3D Graphics**: Three.js with React Three Fiber
- **Charts**: Chart.js
- **UI Components**: Custom components with Lucide icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfoliov2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API credentials:
```env
GITHUB_TOKEN=your_github_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
portfoliov2/
├── app/
│   ├── api/              # API routes
│   │   ├── github-stats/ # GitHub statistics endpoint
│   │   └── spotify/      # Spotify integration endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── ArtworkDisplay.tsx
│   ├── AsciiClouds.tsx
│   ├── CompactLeetCodeStats.tsx
│   ├── DigicamViewer.tsx
│   ├── GitHubStats.tsx
│   ├── MixtapePlayer.tsx
│   ├── ProjectsSection.tsx
│   ├── SakuraScene.tsx
│   └── ...
├── public/
│   ├── assets/          # Images and icons
│   ├── models/          # 3D models
│   └── textures/        # Texture files
└── lib/
    └── utils.ts         # Utility functions
```

## API Integrations

### GitHub Stats
Fetches real-time GitHub statistics including:
- Total contributions
- Current streak
- Top languages
- Activity radar (commits, PRs, issues, reviews, repos, stars)

### LeetCode Stats
Displays coding challenge statistics from LeetCode profile

### Spotify Integration
Shows recently played tracks with album artwork and playback information

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Fonts
Custom fonts are located in `/public`:
- EditorialNew-UltralightItalic.otf
- PPPlayground-Thin.otf
- Thunder-BlackLC.ttf

### Colors
Main color scheme:
- Primary: `#470024` (Deep burgundy)
- Accent: `#F7B538` (Golden yellow)
- Text: `#FFFECB` (Cream)

### Animations
GSAP animations can be customized in `app/page.tsx`:
- Scroll smoothness: `smooth: 1.5`
- Letter reveal timing
- Grid cell slide directions

## Performance

- Lazy loading for 3D components
- Optimized image loading
- Smooth scroll with hardware acceleration
- Loading states for API calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private project - All rights reserved

## Contact

- Instagram: [@_.keebee._](https://www.instagram.com/_.keebee._/)
- GitHub: [KeEbEe123](https://github.com/KeEbEe123)
