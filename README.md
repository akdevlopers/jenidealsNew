# Marketplace Mobile - Next.js

A mobile-first marketplace application built with Next.js 14, React, and Tailwind CSS.

## Features

- 🎨 Modern, mobile-optimized UI
- 🛍️ Product browsing and categories
- ⚡ Flash deals with countdown timer
- 🌍 Multi-country support with currency conversion
- 📱 Responsive design with bottom navigation
- 🎯 Category mega menu
- ⭐ Product ratings and reviews

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
# Create a production build
npm run build

# Start the production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
jenideals_next/
├── app/                    # Next.js app directory
│   ├── layout.jsx         # Root layout with CountryProvider
│   ├── page.jsx           # Home page
│   └── mobile/            # Mobile route
│       └── page.jsx
├── src/
│   ├── components/        # React components (JSX)
│   ├── context/           # React context providers
│   ├── data.js            # Mock data
│   └── index.css          # Global styles & Tailwind
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json

```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **JavaScript (JSX)** - No TypeScript

## Routes

- `/` - Home page
- `/mobile` - Mobile view (same as home)

## Notes

- This project uses Next.js App Router (not Pages Router)
- All interactive components use the `'use client'` directive
- Images are served from Unsplash and Flagcdn CDNs
- The app uses React Context for country/currency management
