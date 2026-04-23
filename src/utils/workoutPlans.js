// ============================================
// 💾 WORKOUT PLANS STORAGE UTILITIES
// ============================================
// Manage multiple workout plans with current workout selection

const STORAGE_KEY = 'cali_workout_plans';
const CURRENT_WORKOUT_KEY = 'cali_current_workout_id';

/**
 * Get all saved workout plans
 * @returns {Array} Array of workout plan objects
 */
export const getAllWorkoutPlans = () => {
  try {
    const plans = localStorage.getItem(STORAGE_KEY);
    return plans ? JSON.parse(plans) : [];
  } catch (error) {
    console.error('Error reading workout plans:', error);
    return [];
  }
};

/**
 * Get the current active workout ID
 * @returns {string|null} Current workout ID or null
 */
export const getCurrentWorkoutId = () => {
  try {
    return localStorage.getItem(CURRENT_WORKOUT_KEY);
  } catch (error) {
    console.error('Error reading current workout ID:', error);
    return null;
  }
};

/**
 * Get the current active workout
 * @returns {Object|null} Current workout object or null
 */
export const getCurrentWorkout = () => {
  const currentId = getCurrentWorkoutId();
  if (!currentId) return null;
  
  const plans = getAllWorkoutPlans();
  return plans.find(plan => plan.id === currentId) || null;
};

/**
 * Save a new workout plan
 * @param {Object} workout - The workout plan object
 * @returns {Object} The saved workout with ID
 */
export const saveWorkoutPlan = (workout) => {
  try {
    const plans = getAllWorkoutPlans();
    const newWorkout = {
      ...workout,
      id: workout.id || `workout_${Date.now()}`,
      createdAt: workout.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    plans.push(newWorkout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    
    // If this is the first workout, set it as current
    if (plans.length === 1) {
      setCurrentWorkout(newWorkout.id);
    }
    
    return newWorkout;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    return null;
  }
};

/**
 * Update an existing workout plan
 * @param {string} workoutId - The workout ID
 * @param {Object} updates - The updates to apply
 * @returns {boolean} Success status
 */
export const updateWorkoutPlan = (workoutId, updates) => {
  try {
    const plans = getAllWorkoutPlans();
    const index = plans.findIndex(plan => plan.id === workoutId);
    
    if (index === -1) return false;
    
    plans[index] = {
      ...plans[index],
      ...updates,
      id: workoutId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    return true;
  } catch (error) {
    console.error('Error updating workout plan:', error);
    return false;
  }
};

/**
 * Delete a workout plan
 * @param {string} workoutId - The workout ID to delete
 * @returns {boolean} Success status
 */
export const deleteWorkoutPlan = (workoutId) => {
  try {
    const plans = getAllWorkoutPlans();
    const updatedPlans = plans.filter(plan => plan.id !== workoutId);
    
    // If deleting the current workout, set another as current
    const currentId = getCurrentWorkoutId();
    if (currentId === workoutId && updatedPlans.length > 0) {
      setCurrentWorkout(updatedPlans[0].id);
    } else if (updatedPlans.length === 0) {
      localStorage.removeItem(CURRENT_WORKOUT_KEY);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    return false;
  }
};

/**
 * Set a workout as the current active workout
 * @param {string} workoutId - The workout ID to set as current
 * @returns {boolean} Success status
 */
export const setCurrentWorkout = (workoutId) => {
  try {
    const plans = getAllWorkoutPlans();
    const workout = plans.find(plan => plan.id === workoutId);
    
    if (!workout) return false;
    
    localStorage.setItem(CURRENT_WORKOUT_KEY, workoutId);
    return true;
  } catch (error) {
    console.error('Error setting current workout:', error);
    return false;
  }
};

/**
 * Get a specific workout by ID
 * @param {string} workoutId - The workout ID
 * @returns {Object|null} The workout object or null
 */
export const getWorkoutById = (workoutId) => {
  const plans = getAllWorkoutPlans();
  return plans.find(plan => plan.id === workoutId) || null;
};

/**
 * Duplicate a workout plan
 * @param {string} workoutId - The workout ID to duplicate
 * @returns {Object|null} The new duplicated workout
 */
export const duplicateWorkoutPlan = (workoutId) => {
  const original = getWorkoutById(workoutId);
  if (!original) return null;
  
  const duplicate = {
    ...original,
    id: `workout_${Date.now()}`,
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return saveWorkoutPlan(duplicate);
};
