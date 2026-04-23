// ============================================
// 🔧 CONFIGURATION FILE
// ============================================
// This is where you configure your Google Apps Script webhook URL
// and other app-wide constants.

/**
 * Google Apps Script Web App URL
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Apps Script project
 * 2. Deploy it as a Web App
 * 3. Copy the deployment URL here
 * 4. Make sure the script is set to "Anyone" access
 * 
 * Example URL format:
 * https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyg0KYZv37M5T3Jaa3y1xBVY9i_LkHV9iZDVR92L7uBooKmcZ0JwIO7xF-BkhI05RrN/exec';

/**
 * App Configuration
 */
export const APP_CONFIG = {
  appName: 'CaliLogger',
  appTagline: 'Strength in Every Rep',
  startDate: '2026-04-23', // The date when Week 1 starts
  weekDuration: 7, // Number of days in a week
};

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
  workoutHistory: 'cali_workout_history',
  lastSubmission: 'cali_last_submission',
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};
