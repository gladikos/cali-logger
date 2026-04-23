# 🚀 Setup Instructions

## Step-by-Step Guide to Get Your CaliLogger Running

### Part 1: Local Development Setup

1. **Install Node.js** (if you haven't already)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Navigate to project folder**
   ```bash
   cd d:\personal-dev\cali-tracker
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   - Open the URL shown in terminal (usually `http://localhost:5173`)
   - The app will work, but won't sync to Google Sheets yet

### Part 2: Google Sheets Integration

#### A. Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "CaliLogger" (or whatever you like)
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
   ```

#### B. Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**

2. Delete any default code and paste the contents from `GOOGLE_APPS_SCRIPT.js`

3. **Update the SPREADSHEET_ID**:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   ```
   Replace with the ID you copied in step A.4

4. **Run the setup function** (one time only):
   - Select `setupWeeklySheets` from the function dropdown
   - Click the ▶️ Run button
   - Authorize the script when prompted
   - This creates Week 1-8 sheets automatically

5. **Deploy as Web App**:
   - Click **Deploy** → **New deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**
   - Settings:
     - Description: "CaliLogger Webhook"
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`)

#### C. Connect Your React App to Google Sheets

1. Open `src/config/constants.js`

2. Replace the placeholder URL:
   ```javascript
   export const GOOGLE_APPS_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```

3. Save the file

4. The app will now sync workouts to your Google Sheet! 🎉

### Part 3: Test the Integration

1. Make sure your dev server is still running (`npm run dev`)

2. In the app:
   - Click "Start Today's Workout"
   - Fill in some workout data
   - Click "Finish Workout"

3. Check your Google Sheet:
   - Open the "Week 1" tab
   - You should see your workout data!

### Part 4: Deploy for Phone Access

Once everything works locally, deploy your app:

#### Option A: Vercel (Recommended - Free & Easy)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   npm run build
   vercel --prod
   ```

3. Follow the prompts, and you'll get a URL like:
   ```
   https://your-app.vercel.app
   ```

#### Option B: Netlify (Also Free)

1. Build your app:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)

3. Drag and drop your `dist` folder

4. You'll get a URL like:
   ```
   https://your-app.netlify.app
   ```

### Part 5: Install on Your Phone

1. Open your deployed URL on your phone's browser

2. **iPhone**:
   - Tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"

3. **Android**:
   - Tap the three dots menu
   - Tap "Add to Home screen"
   - Tap "Add"

4. The app icon will appear on your home screen! 📱

## Troubleshooting

### "Google Apps Script URL not configured"
- Make sure you updated `src/config/constants.js` with your actual script URL
- Restart your dev server after updating

### Workout not appearing in Google Sheet
- Check that your script is deployed with "Anyone" access
- Check the Apps Script logs (View → Executions) for errors
- Make sure you updated the SPREADSHEET_ID in the script

### PWA not installing on phone
- Make sure you're accessing via HTTPS (deployment services provide this)
- PWAs don't work on `localhost` from phones

### Icons not showing
- Create two PNG files: `icon-192.png` and `icon-512.png`
- Place them in the `public` folder
- Rebuild: `npm run build`

## Need Help?

1. Check the browser console for errors (F12)
2. Check Google Apps Script logs (View → Executions)
3. Make sure all URLs are updated correctly

---

**You're all set! Time to track those gains! 💪**
