# 🏋️ CaliLogger - Premium Calisthenics Workout Logger

A luxurious, mobile-first Progressive Web App (PWA) for logging calisthenics workouts. Built with React, Vite, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Premium Mobile-First Design**: Glassmorphism, smooth animations, and elegant UI
- **PWA Support**: Installable on your phone's home screen
- **Workout Logging**: Easy-to-use forms for tracking sets and reps
- **Google Sheets Integration**: Automatically sync data to your Google Sheet
- **Workout History**: View and review past workout sessions
- **Offline Support**: Works offline with service worker caching
- **Touch Optimized**: Large, touch-friendly inputs perfect for gym use

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- A Google account (for Google Sheets integration)

### Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Google Apps Script URL**

   Open `src/config/constants.js` and replace the placeholder with your Google Apps Script URL:

   ```javascript
   export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

   See the "Google Apps Script Setup" section below for instructions.

3. **Run Development Server**

```bash
npm run dev
```

4. **Build for Production**

```bash
npm run build
```

5. **Preview Production Build**

```bash
npm run preview
```

## 📱 Installing as a PWA

Once deployed:

1. Open the app in your mobile browser
2. Tap the share button (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. The app will appear as a native app icon

## 🔧 Configuration

### App Configuration

Edit `src/config/constants.js`:

```javascript
export const APP_CONFIG = {
  appName: 'CaliLogger',
  appTagline: 'Strength in Every Rep',
  startDate: '2026-04-23', // Week 1 start date
  weekDuration: 7,
};
```

### Workout Template

Edit `src/data/workoutTemplate.js` to customize exercises, sets, and reps.

## 📊 Google Apps Script Setup

### Step 1: Create a Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy the code from `GOOGLE_APPS_SCRIPT_EXAMPLE.js` (see below)
4. Update the `SPREADSHEET_ID` with your Google Sheet ID

### Step 2: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Select type: **Web app**
3. Set "Execute as": **Me**
4. Set "Who has access": **Anyone**
5. Click **Deploy**
6. Copy the deployment URL
7. Paste it into `src/config/constants.js`

### Step 3: Prepare Your Google Sheet

1. Create a Google Sheet
2. Create sheets named: `Week 1`, `Week 2`, `Week 3`, etc.
3. The script will write workout data to the appropriate weekly sheet

## 📁 Project Structure

```
cali-tracker/
├── public/
│   ├── icon-192.png          # PWA icon (192x192)
│   └── icon-512.png          # PWA icon (512x512)
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Home screen
│   │   ├── WorkoutLogger.jsx # Workout logging screen
│   │   ├── History.jsx       # History screen
│   │   ├── ExerciseCard.jsx  # Reusable exercise card
│   │   └── SubmitButton.jsx  # Premium submit button
│   ├── config/
│   │   └── constants.js      # ⚙️ Configuration (UPDATE THIS!)
│   ├── data/
│   │   └── workoutTemplate.js # Workout template
│   ├── utils/
│   │   ├── api.js            # API helpers
│   │   ├── dateHelpers.js    # Date utilities
│   │   └── localStorage.js   # Local storage helpers
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Design Philosophy

- **Luxurious & Minimal**: High-end boutique fitness aesthetic
- **Dark Mode First**: Elegant dark theme with refined accents
- **Glassmorphism**: Frosted glass effect throughout
- **Smooth Animations**: Subtle micro-interactions with Framer Motion
- **Touch-Optimized**: Large, accessible inputs for easy gym use

## 🔌 Data Flow

1. User opens app and starts workout
2. User logs actual reps/time for each exercise
3. On submit, data is:
   - Validated
   - Saved to localStorage (backup)
   - Sent to Google Apps Script webhook
4. Google Apps Script writes to appropriate weekly sheet
5. User sees success confirmation
6. Workout appears in history

## 📦 Deployment

Deploy to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **Firebase Hosting**: `firebase deploy`

## 🛠️ Tech Stack

- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **Vite PWA Plugin**: Progressive Web App support

## 📝 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Add New Exercises

Edit `src/data/workoutTemplate.js` and add to the `exercises` array.

### Modify Week Calculation

Edit `src/utils/dateHelpers.js` → `calculateWeekNumber()` function.

## 🐛 Troubleshooting

**Issue**: "Google Apps Script URL not configured"
- **Fix**: Update `src/config/constants.js` with your deployed script URL

**Issue**: Workouts not syncing to Google Sheets
- **Fix**: Check that your Google Apps Script is deployed with "Anyone" access

**Issue**: PWA not installing
- **Fix**: Ensure you're serving over HTTPS (required for PWA)

**Issue**: Icons not showing
- **Fix**: Add `icon-192.png` and `icon-512.png` to the `public` folder

## 📄 License

MIT License - feel free to use this project however you like!

## 🙌 Credits

Built with ❤️ for calisthenics enthusiasts who value both strength and aesthetics.

---

**Happy Training! 💪**
