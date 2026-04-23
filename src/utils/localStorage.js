// ============================================
// 💾 LOCAL STORAGE UTILITIES
// ============================================
// Helpers for saving and retrieving workout data from localStorage

import { STORAGE_KEYS } from '../config/constants';

/**
 * Save a completed workout to history
 * @param {Object} workoutData - The workout data to save
 */
export const saveWorkoutToHistory = (workoutData) => {
  try {
    const history = getWorkoutHistory();
    const workoutWithTimestamp = {
      ...workoutData,
      timestamp: new Date().toISOString(),
      id: `workout_${Date.now()}`
    };
    
    history.unshift(workoutWithTimestamp); // Add to beginning
    
    // Keep only last 50 workouts
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEYS.workoutHistory, JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error('Error saving workout to history:', error);
    return false;
  }
};

/**
 * Get all workout history
 * @returns {Array} Array of workout objects
 */
export const getWorkoutHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.workoutHistory);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading workout history:', error);
    return [];
  }
};

/**
 * Clear all workout history
 */
export const clearWorkoutHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.workoutHistory);
    return true;
  } catch (error) {
    console.error('Error clearing workout history:', error);
    return false;
  }
};

/**
 * Delete a specific workout from history
 * @param {string} workoutId - The workout ID to delete
 * @returns {boolean} Success status
 */
export const deleteWorkout = (workoutId) => {
  try {
    const history = getWorkoutHistory();
    const updatedHistory = history.filter(workout => workout.id !== workoutId);
    localStorage.setItem(STORAGE_KEYS.workoutHistory, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};

/**
 * Get a specific workout by ID
 * @param {string} workoutId - The workout ID
 * @returns {Object|null} The workout object or null
 */
export const getWorkoutById = (workoutId) => {
  const history = getWorkoutHistory();
  return history.find(workout => workout.id === workoutId) || null;
};

/**
 * Save the last submission attempt (for recovery)
 * @param {Object} submissionData - The submission data
 */
export const saveLastSubmission = (submissionData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.lastSubmission, JSON.stringify({
      ...submissionData,
      savedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error('Error saving last submission:', error);
    return false;
  }
};

/**
 * Get the last submission attempt
 * @returns {Object|null} The last submission or null
 */
export const getLastSubmission = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.lastSubmission);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading last submission:', error);
    return null;
  }
};

/**
 * Clear the last submission
 */
export const clearLastSubmission = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.lastSubmission);
    return true;
  } catch (error) {
    console.error('Error clearing last submission:', error);
    return false;
  }
};
