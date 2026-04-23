// ============================================
// 💪 WORKOUT LOGGER COMPONENT (NEW FORMAT)
// ============================================
// Main screen for logging actual workout reps - loads from saved plan

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, XCircle, AlertTriangle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitWorkoutToGoogleSheet, validateWorkoutData } from '../utils/api';
import { saveWorkoutToHistory, saveLastSubmission } from '../utils/localStorage';
import { getCurrentWorkout } from '../utils/workoutPlans';
import { getTodayDate, formatDateLong, getWeekLabel } from '../utils/dateHelpers';

const WorkoutLogger = ({ onBack, onSuccess }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [actualValues, setActualValues] = useState({});
  const [workoutName, setWorkoutName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Set default workout name with date
    const today = getTodayDate();
    setWorkoutName(`Workout ${today}`);
    
    // Load current workout plan
    const currentWorkout = getCurrentWorkout();
    if (currentWorkout && currentWorkout.exercises) {
      const exercises = currentWorkout.exercises;
      setWorkoutPlan(exercises);
      
      // Initialize actual values structure
      const initial = {};
      exercises.forEach(exercise => {
        initial[exercise.id] = {};
        exercise.sets.forEach(set => {
          initial[exercise.id][set.setNumber] = null;
        });
      });
      setActualValues(initial);
    }
  }, []);

  const handleUpdateActual = (exerciseId, setNumber, value) => {
    setActualValues(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setNumber]: value === '' ? null : parseInt(value, 10)
      }
    }));
  };

  const calculateProgress = () => {
    if (!workoutPlan) return 0;
    
    let totalSets = 0;
    let completedSets = 0;
    
    workoutPlan.forEach(exercise => {
      totalSets += exercise.sets.length;
      exercise.sets.forEach(set => {
        const actual = actualValues[exercise.id]?.[set.setNumber];
        if (actual !== null && actual !== '') {
          completedSets++;
        }
      });
    });
    
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  };

  const handleSubmit = async () => {
    if (!workoutPlan) return;

    const today = getTodayDate();
    
    // Build data in new format - one row per set
    const workoutData = {
      date: today,
      weekSheet: getWeekLabel(today),
      workoutName: workoutName,
      notes: notes,
      sets: []
    };

    // Flatten to one row per set
    workoutPlan.forEach(exercise => {
      exercise.sets.forEach(set => {
        const actual = actualValues[exercise.id]?.[set.setNumber];
        workoutData.sets.push({
          exercise: exercise.name,
          setNumber: set.setNumber,
          expectedReps: set.expectedReps,
          actualReps: actual || '',
          type: exercise.type
        });
      });
    });

    // Validate - at least one set completed
    const hasData = workoutData.sets.some(s => s.actualReps !== '');
    if (!hasData) {
      setErrorMessage('Please enter at least one set result');
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
      // Save backup
      saveLastSubmission(workoutData);

      // Submit to Google Sheets
      await submitWorkoutToGoogleSheet(workoutData);

      // Save to history
      saveWorkoutToHistory(workoutData);

      // Show success
      setSubmitStatus('success');
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onBack();
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(error.message);
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!workoutPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-12 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Active Workout
          </h3>
          <p className="text-gray-400 mb-6">
            Please create a workout and set it as current in the Workouts page.
          </p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              {getWeekLabel(getTodayDate())}
            </div>
            <div className="text-sm text-gray-300">
              {formatDateLong(getTodayDate())}
            </div>
          </div>

          {/* Workout Name Input */}
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Workout name..."
            className="w-full text-2xl font-bold text-white bg-transparent border-none outline-none mb-2 placeholder:text-gray-600"
          />

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
        {workoutPlan.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="text-lg font-semibold text-white mb-4">{exercise.name}</h3>
            
            <div className="space-y-2">
              {exercise.sets.map((set) => (
                <div key={set.setNumber} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-16 text-sm text-gray-400 font-medium">
                    Set {set.setNumber}
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                      Target: {set.expectedReps}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={actualValues[exercise.id]?.[set.setNumber] ?? ''}
                      onChange={(e) => handleUpdateActual(exercise.id, set.setNumber, e.target.value)}
                      placeholder="Actual"
                      className="w-full pl-24 pr-12 py-3 bg-dark-600 border border-gray-700 rounded-xl text-white text-center text-lg font-semibold placeholder-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                      {exercise.type === 'time' ? 'sec' : 'reps'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel? Any observations?"
            rows={3}
            className="w-full px-4 py-3 bg-dark-600 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all resize-none"
          />
        </motion.div>
      </div>

      {/* Error Message */}
      <div className="px-6">
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

      {/* Submit Button - Floating FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSubmit}
        disabled={progress === 0 || isSubmitting}
        className={`
          fixed bottom-24 right-6 z-20
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-2xl shadow-primary-600/40
          transition-all duration-300
          ${isSubmitting ? 'bg-gray-700 cursor-wait' : 
            submitStatus === 'success' ? 'bg-green-600' : 
            submitStatus === 'error' ? 'bg-red-600' : 
            progress === 0 ? 'bg-gray-700 opacity-50 cursor-not-allowed' :
            'bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-primary-600/60 hover:scale-110'}
        `}
      >
        {isSubmitting ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : submitStatus === 'success' ? (
          <CheckCircle2 className="w-6 h-6 text-white" />
        ) : submitStatus === 'error' ? (
          <AlertCircle className="w-6 h-6 text-white" />
        ) : (
          <Save className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default WorkoutLogger;
