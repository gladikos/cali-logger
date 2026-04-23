// ============================================
// 🌐 API UTILITIES
// ============================================
// Functions for communicating with Google Apps Script webhook

import { GOOGLE_APPS_SCRIPT_URL, API_CONFIG } from '../config/constants';
import { getWeekLabel } from './dateHelpers';

/**
 * Submit workout data to Google Apps Script
 * @param {Object} workoutData - The workout session data
 * @returns {Promise<Object>} Response object with success status
 */
export const submitWorkoutToGoogleSheet = async (workoutData) => {
  // Validate webhook URL is configured
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    throw new Error('Google Apps Script URL not configured. Please update src/config/constants.js');
  }

  // Build the payload - new format with sets array (one row per set)
  const payload = {
    date: workoutData.date,
    weekSheet: workoutData.weekSheet || getWeekLabel(workoutData.date),
    notes: workoutData.notes || '',
    sets: workoutData.sets.map(set => ({
      exercise: set.exercise,
      setNumber: set.setNumber,
      expectedReps: set.expectedReps,
      actualReps: set.actualReps || '',
      type: set.type || 'reps'
    }))
  };

  // Make the request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Note: With no-cors mode, we can't read the response
    // but if the fetch completes without error, we assume success
    return {
      success: true,
      message: 'Workout submitted successfully',
      payload
    };

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    
    throw new Error(`Failed to submit workout: ${error.message}`);
  }
};

/**
 * Validate workout data before submission
 * @param {Object} workoutData - The workout session data
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateWorkoutData = (workoutData) => {
  const errors = [];

  if (!workoutData.date) {
    errors.push('Date is required');
  }

  if (!workoutData.sets || workoutData.sets.length === 0) {
    errors.push('At least one set is required');
  }

  // Check if at least one set has actual data
  const hasAnyData = workoutData.sets.some(set =>
    set.actualReps !== null && set.actualReps !== ''
  );

  if (!hasAnyData) {
    errors.push('Please enter at least one set result');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Retry logic wrapper for API calls
 * @param {Function} apiCall - The API function to call
 * @param {number} attempts - Number of retry attempts
 * @returns {Promise} The API call result
 */
export const retryApiCall = async (apiCall, attempts = API_CONFIG.retryAttempts) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === attempts - 1) throw error;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (i + 1)));
    }
  }
};
