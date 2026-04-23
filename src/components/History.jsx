// ============================================
// 📊 HISTORY COMPONENT
// ============================================
// View past workout sessions

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Trash2 } from 'lucide-react';
import { getWorkoutHistory, clearWorkoutHistory, deleteWorkout } from '../utils/localStorage';
import { formatDateShort, getRelativeTime } from '../utils/dateHelpers';
import ConfirmModal from './ConfirmModal';

const History = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const workouts = getWorkoutHistory();
    setHistory(workouts);
  };

  const handleDeleteWorkout = (workoutId) => {
    deleteWorkout(workoutId);
    loadHistory();
    setShowDeleteModal(false);
    setWorkoutToDelete(null);
  };

  const handleClearHistory = () => {
    clearWorkoutHistory();
    setHistory([]);
    setShowClearAllModal(false);
  };

  const openDeleteModal = (workout, e) => {
    e.stopPropagation(); // Prevent expanding the workout
    setWorkoutToDelete(workout);
    setShowDeleteModal(true);
  };

  const openClearAllModal = () => {
    setShowClearAllModal(true);
  };

  const toggleExpand = (workoutId) => {
    setExpandedId(expandedId === workoutId ? null : workoutId);
  };

  const calculateTotalReps = (workout) => {
    // Handle new format (sets array)
    if (workout.sets) {
      return workout.sets.filter(set => set.actualReps !== null && set.actualReps !== '').length;
    }
    // Handle old format (exercises array) for backwards compatibility
    if (workout.exercises) {
      return workout.exercises.reduce((total, exercise) => {
        const completedSets = exercise.actual.filter(val => val !== null && val !== '').length;
        return total + completedSets;
      }, 0);
    }
    return 0;
  };

  const getExerciseList = (workout) => {
    // Handle new format
    if (workout.sets) {
      const exerciseNames = [...new Set(workout.sets.map(set => set.exercise))];
      return exerciseNames;
    }
    // Handle old format
    if (workout.exercises) {
      return workout.exercises.map(ex => ex.name);
    }
    return [];
  };

  const groupSetsByExercise = (workout) => {
    if (!workout.sets) return [];
    
    const grouped = {};
    workout.sets.forEach(set => {
      if (!grouped[set.exercise]) {
        grouped[set.exercise] = [];
      }
      grouped[set.exercise].push(set);
    });
    
    return Object.entries(grouped).map(([exercise, sets]) => ({
      name: exercise,
      sets: sets.sort((a, b) => a.setNumber - b.setNumber)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Workout History
              </h1>
              <p className="text-gray-400 text-sm">
                {history.length} workout{history.length !== 1 ? 's' : ''} logged
              </p>
            </div>

            {history.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={openClearAllModal}
                className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-500 text-sm">
              Start logging your workouts to see them here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {history.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Workout Summary */}
                <div
                  onClick={() => toggleExpand(workout.id)}
                  className="p-5 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {workout.workoutName || 'Workout Session'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDateShort(workout.date)} • {getRelativeTime(workout.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => openDeleteModal(workout, e)}
                        className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                      <motion.div
                        animate={{ rotate: expandedId === workout.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{getExerciseList(workout).length} exercises</span>
                    <span>•</span>
                    <span>{calculateTotalReps(workout)} sets completed</span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === workout.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 overflow-hidden"
                    >
                      <div className="p-5 space-y-3">
                        {/* New format: sets grouped by exercise */}
                        {workout.sets ? (
                          groupSetsByExercise(workout).map((exerciseGroup) => (
                            <div key={exerciseGroup.name} className="bg-dark-700/50 rounded-xl p-4">
                              <h4 className="text-white font-semibold mb-3">
                                {exerciseGroup.name}
                              </h4>
                              <div className="space-y-2">
                                {exerciseGroup.sets.map((set) => (
                                  set.actualReps !== null && set.actualReps !== '' && (
                                    <div
                                      key={set.setNumber}
                                      className="flex items-center justify-between px-3 py-2 bg-dark-600/50 rounded-lg"
                                    >
                                      <span className="text-gray-400 text-sm">Set {set.setNumber}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">Expected: {set.expectedReps}</span>
                                        <span className="text-gray-600">→</span>
                                        <span className="text-primary-400 font-semibold">Actual: {set.actualReps}</span>
                                      </div>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          /* Old format: exercises with actual array */
                          workout.exercises?.map((exercise) => (
                            <div key={exercise.id} className="bg-dark-700/50 rounded-xl p-4">
                              <h4 className="text-white font-semibold mb-2">
                                {exercise.name}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {exercise.actual.map((value, idx) => (
                                  value !== null && value !== '' && (
                                    <div
                                      key={idx}
                                      className="px-3 py-1 bg-primary-600/20 rounded-lg text-primary-400 text-sm font-semibold"
                                    >
                                      Set {idx + 1}: {value}
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          ))
                        )}

                        {workout.notes && (
                          <div className="bg-dark-700/50 rounded-xl p-4">
                            <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">
                              Notes
                            </h4>
                            <p className="text-gray-300 text-sm italic">
                              {workout.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Single Workout Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setWorkoutToDelete(null);
        }}
        onConfirm={() => handleDeleteWorkout(workoutToDelete.id)}
        title="Delete Workout?"
        message={`Are you sure you want to delete this workout from ${workoutToDelete ? formatDateShort(workoutToDelete.date) : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Clear All Modal */}
      <ConfirmModal
        isOpen={showClearAllModal}
        onClose={() => setShowClearAllModal(false)}
        onConfirm={handleClearHistory}
        title="Clear All History?"
        message={`Are you sure you want to delete all ${history.length} workout${history.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Clear All"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default History;
