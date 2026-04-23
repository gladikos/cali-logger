// ============================================
// 🏋️ WORKOUT LIBRARY COMPONENT
// ============================================
// View and manage multiple workout plans

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, Edit2, Trash2, Dumbbell, CheckCircle } from 'lucide-react';
import { getAllWorkoutPlans, getCurrentWorkoutId, setCurrentWorkout, deleteWorkoutPlan } from '../utils/workoutPlans';
import ConfirmModal from './ConfirmModal';

const WorkoutLibrary = ({ onCreateNew, onEditWorkout }) => {
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    const plans = getAllWorkoutPlans();
    const currentId = getCurrentWorkoutId();
    setWorkouts(plans);
    setCurrentWorkoutId(currentId);
  };

  const handleSetCurrent = (workoutId) => {
    if (setCurrentWorkout(workoutId)) {
      setCurrentWorkoutId(workoutId);
      // Show success feedback
      const element = document.getElementById(`workout-${workoutId}`);
      if (element) {
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 500);
      }
    }
  };

  const handleDelete = (workoutId) => {
    if (deleteWorkoutPlan(workoutId)) {
      loadWorkouts();
      setShowDeleteModal(false);
      setWorkoutToDelete(null);
    }
  };

  const openDeleteModal = (workout, e) => {
    e.stopPropagation();
    setWorkoutToDelete(workout);
    setShowDeleteModal(true);
  };

  const calculateWorkoutStats = (workout) => {
    const exerciseCount = workout.exercises?.length || 0;
    const totalSets = workout.exercises?.reduce((total, ex) => total + (ex.sets?.length || 0), 0) || 0;
    return { exerciseCount, totalSets };
  };

  const currentWorkout = workouts.find(w => w.id === currentWorkoutId);
  const savedWorkouts = workouts.filter(w => w.id !== currentWorkoutId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Workout Plans
              </h1>
              <p className="text-gray-400 text-sm">
                {workouts.length} workout plan{workouts.length !== 1 ? 's' : ''} • Manage your training plans
              </p>
            </div>
          </div>

          {/* Create New Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCreateNew}
            className="w-full py-4 px-5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl text-white font-semibold flex items-center justify-center gap-3 shadow-lg shadow-primary-600/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Workout Plan</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {workouts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Workout Plans Yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Create your first workout plan to get started
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onCreateNew}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-colors"
            >
              Create Workout Plan
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Current Workout */}
            {currentWorkout && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-green-400" fill="currentColor" />
                  <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Current Workout
                  </h2>
                </div>
                <motion.div
                  id={`workout-${currentWorkout.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-5 border-2 border-green-600/30 bg-green-600/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {currentWorkout.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{calculateWorkoutStats(currentWorkout).exerciseCount} exercises</span>
                        <span>•</span>
                        <span>{calculateWorkoutStats(currentWorkout).totalSets} sets</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" fill="currentColor" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEditWorkout(currentWorkout.id)}
                      className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                    {workouts.length > 1 && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => openDeleteModal(currentWorkout, e)}
                        className="py-3 px-4 bg-red-600/10 hover:bg-red-600/20 rounded-xl text-red-400 font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Saved Workouts */}
            {savedWorkouts.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Saved Workout Plans
                </h2>
                <div className="space-y-3">
                  {savedWorkouts.map((workout, index) => {
                    const stats = calculateWorkoutStats(workout);
                    return (
                      <motion.div
                        key={workout.id}
                        id={`workout-${workout.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => onEditWorkout(workout.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">
                              {workout.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{stats.exerciseCount} exercises</span>
                              <span>•</span>
                              <span>{stats.totalSets} sets</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetCurrent(workout.id);
                            }}
                            className="flex-1 py-3 px-4 bg-green-600/20 hover:bg-green-600/30 rounded-xl text-green-400 font-semibold flex items-center justify-center gap-2 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            <span>Set as Current</span>
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => openDeleteModal(workout, e)}
                            className="py-3 px-4 bg-red-600/10 hover:bg-red-600/20 rounded-xl text-red-400 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setWorkoutToDelete(null);
        }}
        onConfirm={() => handleDelete(workoutToDelete.id)}
        title="Delete Workout?"
        message={`Are you sure you want to delete "${workoutToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default WorkoutLibrary;
