// ============================================
// 📅 DATE HELPER UTILITIES
// ============================================
// Functions for calculating weeks, formatting dates, etc.

import { APP_CONFIG } from '../config/constants';

/**
 * Calculate which week the given date falls into
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {number} Week number (1-based)
 */
export const calculateWeekNumber = (date) => {
  const startDate = new Date(APP_CONFIG.startDate);
  const currentDate = new Date(date);
  
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const weekNumber = Math.floor(diffDays / APP_CONFIG.weekDuration) + 1;
  
  return weekNumber;
};

/**
 * Get the week label for a given date
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {string} Week label like "Week 1", "Week 2", etc.
 */
export const getWeekLabel = (date) => {
  const weekNumber = calculateWeekNumber(date);
  return `Week ${weekNumber}`;
};

/**
 * Format date for display
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date like "April 23, 2026"
 */
export const formatDateLong = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date for display (short version)
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date like "Apr 23"
 */
export const formatDateShort = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get day of week
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {string} Day name like "Monday", "Tuesday", etc.
 */
export const getDayOfWeek = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long'
  });
};

/**
 * Calculate time since a date
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time like "2 hours ago", "3 days ago"
 */
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else {
    return formatDateShort(past.toISOString().split('T')[0]);
  }
};
