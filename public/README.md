# Public Folder

This folder contains static assets that will be served directly by Vite.

## Required Files for PWA

You need to add these icon files for the app to work as a Progressive Web App:

### ✅ Required:
- **icon-192.png** (192×192 pixels) - Used for smaller displays
- **icon-512.png** (512×512 pixels) - Used for larger displays and splash screens

### ⭐ Optional but Recommended:
- **apple-touch-icon.png** (180×180 pixels) - For better iOS experience

## Quick Icon Creation

### Option 1: Online Generator (Easiest)
1. Go to [favicon.io/favicon-generator](https://favicon.io/favicon-generator/)
2. Create an icon with "CT" or a dumbbell emoji
3. Background color: `#0ba5ec`
4. Download and extract
5. Rename files and place them here

### Option 2: Placeholder (For Testing)
Generate simple colored placeholders:
- https://via.placeholder.com/192/0ba5ec/ffffff?text=CT
- https://via.placeholder.com/512/0ba5ec/ffffff?text=CT

Download and save as `icon-192.png` and `icon-512.png`

## Design Tips

- Keep it simple and recognizable
- High contrast for visibility
- Match the app's premium, minimal aesthetic
- Primary brand color: `#0ba5ec` (blue)

## After Adding Icons

1. Rebuild the app: `npm run build`
2. Test PWA install functionality
3. Check icons appear correctly on home screen

For more details, see **ICONS_SETUP.md** in the root folder.
