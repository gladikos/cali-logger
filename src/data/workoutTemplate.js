// ============================================
// 📋 WORKOUT TEMPLATE DATA
// ============================================
// This file contains the prefilled workout template
// with all exercises, expected sets, and reps.

export const WORKOUT_TEMPLATE = {
  name: 'Full Body Calisthenics',
  exercises: [
    {
      id: 'pushups',
      name: 'Push-ups',
      sets: [
        { setNumber: 1, expectedReps: 10 },
        { setNumber: 2, expectedReps: 10 },
        { setNumber: 3, expectedReps: 10 },
        { setNumber: 4, expectedReps: 10 }
      ],
      type: 'reps',
      description: 'Standard push-ups with proper form'
    },
    {
      id: 'rows',
      name: 'Bodyweight Rows',
      sets: [
        { setNumber: 1, expectedReps: 10 },
        { setNumber: 2, expectedReps: 10 },
        { setNumber: 3, expectedReps: 10 },
        { setNumber: 4, expectedReps: 10 }
      ],
      type: 'reps',
      description: 'Inverted rows or table rows'
    },
    {
      id: 'squats',
      name: 'Squats',
      sets: [
        { setNumber: 1, expectedReps: 15 },
        { setNumber: 2, expectedReps: 15 },
        { setNumber: 3, expectedReps: 15 }
      ],
      type: 'reps',
      description: 'Bodyweight squats with full range'
    },
    {
      id: 'dips',
      name: 'Bench Dips',
      sets: [
        { setNumber: 1, expectedReps: 10 },
        { setNumber: 2, expectedReps: 10 },
        { setNumber: 3, expectedReps: 10 }
      ],
      type: 'reps',
      description: 'Tricep dips on a bench or chair'
    },
    {
      id: 'plank',
      name: 'Plank',
      sets: [
        { setNumber: 1, expectedReps: 30 },
        { setNumber: 2, expectedReps: 30 },
        { setNumber: 3, expectedReps: 30 }
      ],
      type: 'time',
      description: 'Static plank hold with proper alignment'
    },
    {
      id: 'climbers',
      name: 'Mountain Climbers',
      sets: [
        { setNumber: 1, expectedReps: 30 },
        { setNumber: 2, expectedReps: 30 },
        { setNumber: 3, expectedReps: 30 }
      ],
      type: 'time',
      description: 'Dynamic mountain climbers for cardio'
    }
  ]
};

/**
 * Initialize an empty workout session based on the template
 * @returns {Object} Empty workout session with all exercises
 */
export const initializeWorkoutSession = () => {
  return {
    date: new Date().toISOString().split('T')[0],
    workoutName: WORKOUT_TEMPLATE.name,
    notes: '',
    exercises: WORKOUT_TEMPLATE.exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      expectedSets: exercise.expectedSets,
      expectedReps: exercise.expectedReps,
      type: exercise.type,
      actual: Array(exercise.expectedSets).fill(null)
    }))
  };
};
