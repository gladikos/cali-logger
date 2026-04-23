// ============================================
// ✏️ WORKOUT EDITOR COMPONENT
// ============================================
// Create or edit a workout plan

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { WORKOUT_TEMPLATE } from '../data/workoutTemplate';
import { saveWorkoutPlan, updateWorkoutPlan, getWorkoutById } from '../utils/workoutPlans';

const WorkoutEditor = ({ workoutId, onBack, onSave }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const isEditMode = !!workoutId;

  useEffect(() => {
    if (workoutId) {
      // Edit existing workout
      const workout = getWorkoutById(workoutId);
      if (workout) {
        setWorkoutName(workout.name);
        setExercises(workout.exercises || []);
      }
    } else {
      // Create new workout with default name and template
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setWorkoutName(`Workout ${today}`);
      setExercises(JSON.parse(JSON.stringify(WORKOUT_TEMPLATE.exercises)));
    }
  }, [workoutId]);

  const handleSavePlan = () => {
    const workoutData = {
      name: workoutName,
      exercises: exercises
    };

    if (isEditMode) {
      // Update existing
      if (updateWorkoutPlan(workoutId, workoutData)) {
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          if (onSave) onSave();
        }, 1500);
      }
    } else {
      // Create new
      const saved = saveWorkoutPlan(workoutData);
      if (saved) {
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          if (onSave) onSave();
        }, 1500);
      }
    }
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `exercise_${Date.now()}`,
        name: 'New Exercise',
        sets: [{ setNumber: 1, expectedReps: 10 }],
        type: 'reps',
        description: ''
      }
    ]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleUpdateExerciseName = (index, name) => {
    const updated = [...exercises];
    updated[index].name = name;
    setExercises(updated);
  };

  const handleUpdateExerciseType = (index, type) => {
    const updated = [...exercises];
    updated[index].type = type;
    setExercises(updated);
  };

  const handleAddSet = (exerciseIndex) => {
    const updated = [...exercises];
    const newSetNumber = updated[exerciseIndex].sets.length + 1;
    updated[exerciseIndex].sets.push({
      setNumber: newSetNumber,
      expectedReps: 10
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    // Renumber sets
    updated[exerciseIndex].sets.forEach((set, i) => {
      set.setNumber = i + 1;
    });
    setExercises(updated);
  };

  const handleUpdateSetReps = (exerciseIndex, setIndex, reps) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex].expectedReps = parseInt(reps, 10) || 0;
    setExercises(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>

            <div className="flex-1">
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Workout name..."
                className="w-full text-2xl font-bold text-white bg-transparent border-none outline-none placeholder:text-gray-600"
              />
              <p className="text-gray-400 text-sm mt-1">
                {isEditMode ? 'Edit your workout plan' : 'Create a new workout plan'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="p-6 space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: exerciseIndex * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            {/* Exercise Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handleUpdateExerciseName(exerciseIndex, e.target.value)}
                  className="w-full px-4 py-2 bg-dark-600 border border-gray-700 rounded-xl text-white font-semibold placeholder-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                  placeholder="Exercise name"
                />
                
                {/* Exercise Type */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleUpdateExerciseType(exerciseIndex, 'reps')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      exercise.type === 'reps'
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
                    }`}
                  >
                    Reps
                  </button>
                  <button
                    onClick={() => handleUpdateExerciseType(exerciseIndex, 'time')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      exercise.type === 'time'
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
                    }`}
                  >
                    Time
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRemoveExercise(exerciseIndex)}
                className="w-10 h-10 rounded-xl bg-red-600/20 hover:bg-red-600/30 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </motion.button>
            </div>

            {/* Sets */}
            <div className="space-y-2">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-semibold w-14 shrink-0">
                    Set {set.setNumber}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={set.expectedReps}
                      onChange={(e) => handleUpdateSetReps(exerciseIndex, setIndex, e.target.value)}
                      min="1"
                      className="w-full px-4 pr-12 py-2 bg-dark-600 border border-gray-700 rounded-xl text-white text-center focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                      {exercise.type === 'time' ? 'sec' : 'reps'}
                    </span>
                  </div>
                  {exercise.sets.length > 1 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </motion.button>
                  )}
                </div>
              ))}

              {/* Add Set Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAddSet(exerciseIndex)}
                className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Set</span>
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Add Exercise Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddExercise}
          className="w-full py-4 px-5 glass hover:bg-white/10 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Exercise</span>
        </motion.button>
      </div>

      {/* Save Button - Floating FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSavePlan}
        disabled={!workoutName.trim() || exercises.length === 0}
        className={`
          fixed bottom-24 right-6 z-20
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-2xl shadow-primary-600/40
          transition-all duration-300
          ${isSaved ? 'bg-green-600' :
            !workoutName.trim() || exercises.length === 0 ? 'bg-gray-700 opacity-50 cursor-not-allowed' :
            'bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-primary-600/60 hover:scale-110'}
        `}
      >
        {isSaved ? (
          <CheckCircle className="w-6 h-6 text-white" />
        ) : (
          <Save className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default WorkoutEditor;
