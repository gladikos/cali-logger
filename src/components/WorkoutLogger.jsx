// ============================================
// 💪 WORKOUT LOGGER COMPONENT
// ============================================
// Main screen for logging workout sets and reps

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, CheckCircle, XCircle } from 'lucide-react';
import { WORKOUT_TEMPLATE, initializeWorkoutSession } from '../data/workoutTemplate';
import { submitWorkoutToGoogleSheet, validateWorkoutData } from '../utils/api';
import { saveWorkoutToHistory, saveLastSubmission } from '../utils/localStorage';
import { getTodayDate, formatDateLong, getWeekLabel } from '../utils/dateHelpers';
import ExerciseCard from './ExerciseCard';
import SubmitButton from './SubmitButton';

const WorkoutLogger = ({ onBack, onSuccess }) => {
  const [workoutSession, setWorkoutSession] = useState(initializeWorkoutSession());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateActual = (exerciseId, setIndex, value) => {
    setWorkoutSession(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              actual: ex.actual.map((val, idx) => idx === setIndex ? value : val)
            }
          : ex
      )
    }));
  };

  const handleNotesChange = (e) => {
    setWorkoutSession(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleSubmit = async () => {
    // Validate data
    const validation = validateWorkoutData(workoutSession);
    if (!validation.isValid) {
      setErrorMessage(validation.errors.join(', '));
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Save to localStorage as backup first
      saveLastSubmission(workoutSession);

      // Submit to Google Apps Script
      await submitWorkoutToGoogleSheet(workoutSession);

      // Save to history
      saveWorkoutToHistory(workoutSession);

      // Show success
      setSubmitStatus('success');
      
      // Navigate back after delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onBack();
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(error.message);
      setSubmitStatus('error');
      
      // Reset error after delay
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = () => {
    const totalSets = workoutSession.exercises.reduce((sum, ex) => sum + ex.expectedSets, 0);
    const completedSets = workoutSession.exercises.reduce(
      (sum, ex) => sum + ex.actual.filter(val => val !== null && val !== '').length,
      0
    );
    return Math.round((completedSets / totalSets) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                {getWeekLabel(getTodayDate())}
              </div>
              <div className="text-sm text-gray-300">
                {formatDateLong(getTodayDate())}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {workoutSession.workoutName}
          </h1>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Progress
              </span>
              <span className="text-sm text-primary-400 font-semibold">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="p-6 space-y-4">
        {WORKOUT_TEMPLATE.exercises.map((exercise, index) => {
          const sessionExercise = workoutSession.exercises.find(ex => ex.id === exercise.id);
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              actualValues={sessionExercise.actual}
              onUpdateActual={handleUpdateActual}
              index={index}
            />
          );
        })}

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <label className="block text-sm text-gray-400 uppercase tracking-wider font-semibold mb-3">
            Notes (Optional)
          </label>
          <textarea
            value={workoutSession.notes}
            onChange={handleNotesChange}
            placeholder="How did you feel? Any observations?"
            rows={3}
            className="w-full px-4 py-3 bg-dark-600 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all resize-none"
          />
        </motion.div>
      </div>

      {/* Submit Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 glass-light border-t border-white/10 backdrop-blur-xl">
        <SubmitButton
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isSuccess={submitStatus === 'success'}
          isError={submitStatus === 'error'}
          disabled={progress === 0}
        >
          <Save className="w-5 h-5" />
          <span>Finish Workout</span>
        </SubmitButton>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-red-600/20 border border-red-600/30 rounded-xl flex items-center gap-2"
            >
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-200">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-green-600/20 border border-green-600/30 rounded-xl flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-200">Workout saved successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkoutLogger;
