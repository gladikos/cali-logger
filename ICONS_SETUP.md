# 🎨 Icon Setup Guide

## Required Icons for PWA

Your app needs at least two icon sizes to function as a Progressive Web App:

- **192x192 pixels**: Used for smaller displays
- **512x512 pixels**: Used for larger displays and splash screens

## Quick Setup Options

### Option 1: Use an Icon Generator (Easiest)

1. **Create an icon at [favicon.io](https://favicon.io/favicon-generator/)**
   - Text: "CT" or a dumbbell emoji
   - Background: #0ba5ec (primary blue)
   - Font: Bold, modern sans-serif
   
2. **Download and extract the generated files**

3. **Resize to required sizes**:
   - Rename `android-chrome-192x192.png` → `icon-192.png`
   - Rename `android-chrome-512x512.png` → `icon-512.png`

4. **Place in `public/` folder**:
   ```
   public/
   ├── icon-192.png
   └── icon-512.png
   ```

### Option 2: Use an Image Editor

1. Create a 512x512 canvas with your design
2. Export as `icon-512.png`
3. Resize to 192x192 and export as `icon-192.png`
4. Place both in the `public/` folder

### Option 3: Use a Placeholder (For Testing)

Create simple colored squares as placeholders:

1. Go to [placeholder.com](https://placeholder.com/)
2. Generate:
   - `https://via.placeholder.com/192/0ba5ec/ffffff?text=CaliTracker`
   - `https://via.placeholder.com/512/0ba5ec/ffffff?text=CaliTracker`
3. Download and save as `icon-192.png` and `icon-512.png`

## Design Recommendations

### Colors
- **Background**: #0ba5ec (primary brand blue)
- **Foreground**: #ffffff (white)
- **Alternative**: #0f0f0f (dark) with #0ba5ec accent

### Content Ideas
- Dumbbell icon (💪)
- "CT" monogram
- Minimalist barbell illustration
- Abstract geometric fitness symbol

### Style
- Keep it simple and recognizable
- High contrast for visibility
- Avoid fine details (they get lost at small sizes)
- Match the app's premium, minimal aesthetic

## iOS-Specific Icon (Optional)

For the best iOS experience, also create:

**public/apple-touch-icon.png** (180x180 pixels)
- No transparency (iOS removes it)
- Slightly rounded corners (iOS applies its own rounding)

## Testing Your Icons

1. **During Development**:
   - Icons won't show in dev mode
   - Build first: `npm run build`
   - Preview: `npm run preview`

2. **After Deployment**:
   - Open app on your phone
   - Tap "Add to Home Screen"
   - Check if icon appears correctly

3. **Troubleshooting**:
   - Clear browser cache
   - Check file names exactly match: `icon-192.png` and `icon-512.png`
   - Verify files are in `public/` folder
   - Rebuild: `npm run build`

## Example Directory After Setup

```
public/
├── icon-192.png          ✅ Required (192x192)
├── icon-512.png          ✅ Required (512x512)
└── apple-touch-icon.png  ⭐ Optional but recommended (180x180)
```

---

**Need help?** Use a simple emoji or text placeholder to start, and upgrade to a custom design later!
