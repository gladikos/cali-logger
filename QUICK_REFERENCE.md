# ⚡ Quick Reference Guide

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install a new package
npm install package-name
```

## 🔧 Configuration Checklist

- [ ] Update `GOOGLE_APPS_SCRIPT_URL` in `src/config/constants.js`
- [ ] Update `SPREADSHEET_ID` in Google Apps Script
- [ ] Add `icon-192.png` to `public/` folder
- [ ] Add `icon-512.png` to `public/` folder
- [ ] Deploy Google Apps Script as Web App
- [ ] Run `setupWeeklySheets()` in Apps Script once

## 📝 Customization Guide

### Change App Name/Tagline

**File**: `src/config/constants.js`

```javascript
export const APP_CONFIG = {
  appName: 'Your App Name',
  appTagline: 'Your Tagline',
  startDate: '2026-04-23',
  weekDuration: 7,
};
```

### Change Exercise Template

**File**: `src/data/workoutTemplate.js`

```javascript
{
  id: 'unique-id',
  name: 'Exercise Name',
  expectedSets: 4,
  expectedReps: '10-15',
  type: 'reps', // or 'time'
  icon: '💪',
  description: 'Exercise description'
}
```

### Change Colors

**File**: `tailwind.config.js`

```javascript
colors: {
  primary: {
    600: '#0ba5ec', // Change this
    500: '#0086c9',
    400: '#36bffa',
  }
}
```

### Modify Week Start Date

**File**: `src/config/constants.js`

```javascript
startDate: '2026-04-23', // Week 1 starts on this date
```

## 🎨 Styling Tips

### Add Custom CSS Class

**File**: `src/index.css`

```css
.your-custom-class {
  /* Your styles */
}
```

### Use Glassmorphism

```jsx
<div className="glass rounded-2xl p-6">
  {/* Content */}
</div>
```

Available classes:
- `.glass` - Standard glass effect
- `.glass-light` - Lighter glass effect

### Add Animation

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Animated content */}
</motion.div>
```

## 🐛 Debugging Tips

### Check Browser Console
1. Press F12 (Windows) or Cmd+Option+I (Mac)
2. Go to Console tab
3. Look for errors in red

### Check Network Requests
1. Press F12
2. Go to Network tab
3. Submit a workout
4. Look for POST request to Google Apps Script
5. Check if it's successful (status 200)

### Check Google Apps Script Logs
1. Open your Apps Script project
2. Go to **View** → **Executions**
3. See all recent webhook calls and errors

### Clear localStorage (Reset App Data)
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

### Test Google Apps Script Directly
1. In Apps Script editor
2. Select `testWorkoutSubmission` function
3. Click Run (▶️)
4. Check your Google Sheet

## 📊 Data Format Reference

### Workout Payload Structure

```javascript
{
  date: "2026-04-23",
  weekSheet: "Week 1",
  workoutName: "Full Body Calisthenics",
  notes: "Optional notes",
  exercises: [
    {
      name: "Push-ups",
      expectedSets: 4,
      expectedReps: "10-15",
      actual: [12, 11, 10, 9]
    }
  ]
}
```

### localStorage Keys

```javascript
'cali_workout_history'   // Array of past workouts
'cali_last_submission'   // Backup of last submission attempt
```

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Test app locally (`npm run dev`)
- [ ] Update Google Apps Script URL
- [ ] Test Google Sheets integration
- [ ] Add app icons to `public/` folder
- [ ] Build production version (`npm run build`)
- [ ] Test production build (`npm run preview`)

### Vercel Deployment

```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify Deployment

1. Build: `npm run build`
2. Drag `dist` folder to netlify.com
3. Done!

### After Deploying

- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Install as PWA on phone
- [ ] Submit test workout
- [ ] Verify data in Google Sheet

## 🎯 Feature Ideas for Future

- [ ] **Analytics Screen**: Show workout trends and stats
- [ ] **Rest Timer**: Built-in countdown between sets
- [ ] **Exercise Videos**: Link to tutorial videos
- [ ] **Multiple Programs**: Switch between different workout plans
- [ ] **Dark/Light Mode**: Toggle theme preference
- [ ] **Social Sharing**: Share workout achievements
- [ ] **Export Data**: Download workout history as CSV
- [ ] **Voice Input**: "Hey app, log 12 reps"
- [ ] **Reminders**: Push notifications for workout time

## 📞 Support Resources

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite Guide](https://vitejs.dev/guide/)

### Troubleshooting
- Check `README.md` for common issues
- Check `SETUP.md` for step-by-step setup
- Check browser console for errors
- Check Google Apps Script execution logs

---

**Happy Coding! 💻**
