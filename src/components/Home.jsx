// ============================================
// 🏠 HOME SCREEN COMPONENT
// ============================================
// Premium home screen with stats dashboard and quick actions

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Calendar, TrendingUp, Timer, Flame, Target, Activity, Settings } from 'lucide-react';
import { APP_CONFIG } from '../config/constants';
import { formatDateLong, getDayOfWeek, getTodayDate, getWeekLabel } from '../utils/dateHelpers';
import { getCurrentWorkout } from '../utils/workoutPlans';
import { getWorkoutHistory } from '../utils/localStorage';
import { getUserSettings } from '../utils/userSettings';

const Home = ({ onStartWorkout, onViewHistory, onPlanWorkout, onNavigate, onOpenProfile }) => {
  const [stats, setStats] = useState({
    currentPlanName: 'No Plan Set',
    lastWorkoutDate: null,
    totalWorkouts: 0,
    weekWorkouts: 0
  });
  const [timerRunning, setTimerRunning] = useState(false);
  const [userSettings, setUserSettings] = useState(null);

  const today = getTodayDate();
  const dayOfWeek = getDayOfWeek(today);
  const weekLabel = getWeekLabel(today);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    // Load user settings
    const settings = getUserSettings();
    setUserSettings(settings);
    
    // Load stats
    const currentWorkout = getCurrentWorkout();
    const history = getWorkoutHistory();
    
    // Get last workout
    const lastWorkout = history.length > 0 ? history[0] : null;
    
    // Count this week's workouts
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekWorkouts = history.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart;
    }).length;

    // Check timer status
    const timerState = localStorage.getItem('cali_timer_state');
    if (timerState) {
      const timer = JSON.parse(timerState);
      setTimerRunning(timer.isRunning || false);
    }

    setStats({
      currentPlanName: currentWorkout?.name || 'No Plan Set',
      lastWorkoutDate: lastWorkout?.date || null,
      totalWorkouts: history.length,
      weekWorkouts: weekWorkouts
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-6 pb-32 flex flex-col">
      {/* Header - Logo & Settings */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-4 pb-6 relative"
      >
        {/* Settings Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenProfile}
          className="absolute top-4 right-0 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </motion.button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block"
        >
          <img 
            src="/cali-logger-logo.png" 
            alt="CaliLogger Logo" 
            className="w-48 h-48 object-contain drop-shadow-2xl"
          />
        </motion.div>
        
        <p className="text-gray-400 text-base font-light tracking-wide -mt-4">
          {APP_CONFIG.appTagline}
        </p>
      </motion.div>

      {/* Welcome Greeting */}
      {userSettings?.profile?.name && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-1">
            {getGreeting()}, {userSettings.profile.name}!
          </h2>
          <p className="text-gray-400 text-sm">
            Ready to crush your workout today?
          </p>
        </motion.div>
      )}

      {/* Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {/* Current Plan */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Current Plan
            </span>
          </div>
          <p className="text-white font-bold text-sm truncate">
            {stats.currentPlanName}
          </p>
        </div>

        {/* This Week */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              This Week
            </span>
          </div>
          <p className="text-white font-bold text-2xl">
            {stats.weekWorkouts}
            <span className="text-sm text-gray-400 ml-1">workouts</span>
          </p>
        </div>

        {/* Last Workout */}
        <div className="glass rounded-2xl p-5 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Last Workout
            </span>
          </div>
          <p className="text-white font-semibold text-sm">
            {stats.lastWorkoutDate ? formatDateLong(stats.lastWorkoutDate) : 'No workouts yet'}
          </p>
        </div>
      </motion.div>

      {/* Today's Info Card - Large and Prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass rounded-3xl p-8 mb-8 border border-white/5"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary-400" />
          </div>
          <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
            Today
          </span>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-white">
            {dayOfWeek}
          </h2>
          <p className="text-gray-300 text-xl">
            {formatDateLong(today)}
          </p>
          <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-600/30 to-primary-500/20 rounded-xl mt-3 border border-primary-500/20">
            <span className="text-primary-300 font-semibold text-sm">
              {weekLabel}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold px-3">
            Quick Actions
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Start Workout - Main CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStartWorkout}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-2xl p-6 flex items-center justify-between shadow-2xl shadow-primary-600/30 transition-all duration-300"
        >
          <div className="text-left">
            <h3 className="text-xl font-bold text-white mb-1">
              Start Today's Workout
            </h3>
            <p className="text-primary-100 text-sm">
              Log your training session
            </p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          {/* Workout Plans */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPlanWorkout}
            className="glass-light rounded-xl p-5 transition-all duration-300 hover:bg-white/10 text-left"
          >
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Workout Plans
            </h3>
            <p className="text-gray-400 text-xs">
              Manage exercises
            </p>
          </motion.button>

          {/* Timer */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('timer')}
            className="glass-light rounded-xl p-5 transition-all duration-300 hover:bg-white/10 text-left relative overflow-hidden"
          >
            {timerRunning && (
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            )}
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-3">
              <Timer className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              {timerRunning ? 'Timer Running' : 'Rest Timer'}
            </h3>
            <p className="text-gray-400 text-xs">
              {timerRunning ? 'Tap to view' : 'Track rest periods'}
            </p>
          </motion.button>

          {/* History */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onViewHistory}
            className="glass-light rounded-xl p-5 transition-all duration-300 hover:bg-white/10 text-left col-span-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Workout History
                </h3>
                <p className="text-gray-400 text-xs">
                  {stats.totalWorkouts} total workouts logged
                </p>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-500 text-xs italic">
          "Progress is built one rep at a time"
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
