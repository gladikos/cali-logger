// ============================================
// 🔄 MIGRATION UTILITY
// ============================================
// Migrate from old single workout plan to new multiple workouts system

import { getAllWorkoutPlans, saveWorkoutPlan, setCurrentWorkout } from './workoutPlans';
import { WORKOUT_TEMPLATE } from '../data/workoutTemplate';

const OLD_STORAGE_KEY = 'cali_workout_plan';

/**
 * Create a default workout if none exists
 * @returns {boolean} True if default was created
 */
const createDefaultWorkout = () => {
  try {
    const newWorkout = {
      name: 'My Workout',
      exercises: JSON.parse(JSON.stringify(WORKOUT_TEMPLATE.exercises))
    };

    const saved = saveWorkoutPlan(newWorkout);
    
    if (saved) {
      setCurrentWorkout(saved.id);
      console.log('✅ Created default workout');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error creating default workout:', error);
    return false;
  }
};

/**
 * Migrate old workout plan to new system
 * @returns {boolean} True if migration was performed
 */
export const migrateOldWorkoutPlan = () => {
  try {
    // Check if we already have workouts in new system
    const existingWorkouts = getAllWorkoutPlans();
    if (existingWorkouts.length > 0) {
      // Already migrated or has new workouts
      return false;
    }

    // Check for old workout plan
    const oldPlan = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldPlan) {
      // Parse old plan
      const exercises = JSON.parse(oldPlan);
      
      // Create new workout from old plan
      const newWorkout = {
        name: 'My Workout',
        exercises: exercises
      };

      // Save as new workout
      const saved = saveWorkoutPlan(newWorkout);
      
      if (saved) {
        // Set as current
        setCurrentWorkout(saved.id);
        
        // Remove old plan (optional - could keep for backup)
        // localStorage.removeItem(OLD_STORAGE_KEY);
        
        console.log('✅ Migrated old workout plan to new system');
        return true;
      }
    } else {
      // No old plan, create a default workout
      return createDefaultWorkout();
    }

    return false;
  } catch (error) {
    console.error('Error migrating old workout plan:', error);
    // If migration fails, try to create default workout
    return createDefaultWorkout();
  }
};
