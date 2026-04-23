// ============================================
// 📋 WORKOUT PLANNER COMPONENT
// ============================================
// Screen for planning weekly workouts - set exercises, sets, and expected reps

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { WORKOUT_TEMPLATE } from '../data/workoutTemplate';

const STORAGE_KEY = 'cali_workout_plan';

const WorkoutPlanner = ({ onBack }) => {
  const [exercises, setExercises] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved plan or use default template
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setExercises(JSON.parse(saved));
    } else {
      setExercises(JSON.parse(JSON.stringify(WORKOUT_TEMPLATE.exercises)));
    }
  }, []);

  const handleSavePlan = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
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
    updated[exerciseIndex].sets[setIndex].expectedReps = reps === '' ? '' : parseInt(reps, 10);
    setExercises(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Plan Weekly Workout
              </h1>
              <p className="text-gray-400 text-sm">
                Set up your exercises, sets, and expected reps
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSavePlan}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold flex items-center gap-2 transition-colors shrink-0"
            >
              {isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved!' : 'Save'}
            </motion.button>
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
                <div className="mt-2">
                  <select
                    value={exercise.type}
                    onChange={(e) => handleUpdateExerciseType(exerciseIndex, e.target.value)}
                    className="px-3 py-1 bg-dark-600 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                  >
                    <option value="reps">Reps</option>
                    <option value="time">Time (seconds)</option>
                  </select>
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
                <div key={setIndex} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-16 text-sm text-gray-400 font-medium">
                    Set {set.setNumber}
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.expectedReps}
                    onChange={(e) => handleUpdateSetReps(exerciseIndex, setIndex, e.target.value)}
                    className="flex-1 px-4 py-2 bg-dark-600 border border-gray-700 rounded-xl text-white text-center font-semibold placeholder-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                    placeholder="Expected"
                  />
                  <div className="flex-shrink-0 text-xs text-gray-500 w-12">
                    {exercise.type === 'time' ? 'sec' : 'reps'}
                  </div>
                  {exercise.sets.length > 1 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                      className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/30 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </motion.button>
                  )}
                </div>
              ))}

              {/* Add Set Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddSet(exerciseIndex)}
                className="w-full py-2 px-4 border border-dashed border-gray-600 hover:border-primary-600 rounded-xl text-gray-400 hover:text-primary-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Set
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Add Exercise Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddExercise}
          className="w-full py-4 px-6 border-2 border-dashed border-gray-600 hover:border-primary-600 rounded-2xl text-gray-400 hover:text-primary-400 font-semibold transition-colors flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </motion.button>
      </div>
    </div>
  );
};

export default WorkoutPlanner;
