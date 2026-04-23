// ============================================
// ⏱️ TIMER SCREEN
// ============================================
// Rest timer and exercise timer with preset durations
// Persistent background timer with notifications

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Bell, BellOff } from 'lucide-react';
import { getUserSettings } from '../utils/userSettings';

const PRESET_DURATIONS = [30, 45, 60]; // seconds
const TIMER_STORAGE_KEY = 'cali_timer_state';

const TimerScreen = () => {
  const settings = getUserSettings();
  const [timerType, setTimerType] = useState('rest'); // 'rest' or 'exercise'
  const [duration, setDuration] = useState(settings.preferences.defaultRestTime || 60);
  const [timeLeft, setTimeLeft] = useState(settings.preferences.defaultRestTime || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.preferences.notificationsEnabled);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const startTimeRef = useRef(null);
  const countdownBeepsPlayed = useRef(new Set());

  // Load timer state from localStorage
  const loadTimerState = () => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.isRunning && state.startTime) {
          // Calculate elapsed time
          const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
          const remaining = state.duration - elapsed;
          
          if (remaining > 0) {
            setDuration(state.duration);
            setTimeLeft(remaining);
            setTimerType(state.timerType);
            setIsRunning(true);
            startTimeRef.current = state.startTime;
          } else {
            // Timer completed while away
            clearTimerState();
          }
        }
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  };

  // Save timer state to localStorage
  const saveTimerState = (remaining, running) => {
    try {
      const state = {
        duration,
        timeLeft: remaining,
        timerType,
        isRunning: running,
        startTime: startTimeRef.current
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  // Clear timer state from localStorage
  const clearTimerState = () => {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  };

  // Sync timer state when returning to page
  const syncTimerState = () => {
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = duration - elapsed;
      
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        handleTimerComplete();
      }
    }
  };

  // Play countdown beep at 3, 2, 1 seconds
  const playCountdownBeep = () => {
    // Check if sounds are enabled
    const currentSettings = getUserSettings();
    if (!currentSettings.preferences.timerSoundsEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 600; // Lower pitch for countdown
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing countdown beep:', error);
    }
  };

  // Play completion beep (triple beep)
  const playCompletionBeep = () => {
    // Check if sounds are enabled
    const currentSettings = getUserSettings();
    if (!currentSettings.preferences.timerSoundsEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Play three beeps
      [0, 200, 400].forEach((delay, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = index === 2 ? 1000 : 800; // Higher pitch for final beep
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }, delay);
      });
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  };

  // Show notification when timer completes
  const showNotification = () => {
    const currentSettings = getUserSettings();
    if (currentSettings.preferences.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('Timer Complete! ⏰', {
        body: `Your ${timerType} timer has finished!`,
        icon: '/cali-logger-logo.png',
        badge: '/cali-logger-logo.png',
        requireInteraction: true,
        silent: false
      });
      
      // Close notification after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsFinished(true);
    setTimeLeft(0);
    startTimeRef.current = null;
    countdownBeepsPlayed.current.clear();
    
    // Play completion beep
    playCompletionBeep();
    
    // Show notification
    showNotification();
    
    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Clear storage
    clearTimerState();
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsFinished(false);
      setTimeLeft(duration);
    }, 3000);
  };

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
    
    // Load timer state from storage
    loadTimerState();
    
    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning) {
        // Recalculate time when returning to page
        syncTimerState();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Main timer loop with timestamp-based calculation
  useEffect(() => {
    if (isRunning && timeLeft > 0 && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = duration - elapsed;
        
        if (remaining <= 0) {
          handleTimerComplete();
        } else {
          setTimeLeft(remaining);
          saveTimerState(remaining, true);
          
          // Play countdown beeps at 3, 2, 1 seconds
          if (remaining <= 3 && remaining > 0 && !countdownBeepsPlayed.current.has(remaining)) {
            playCountdownBeep();
            countdownBeepsPlayed.current.add(remaining);
          }
        }
      }, 100); // Check every 100ms for accuracy
      
      return () => clearInterval(intervalRef.current);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isRunning, startTimeRef.current]);

  // Event handlers
  const handleStart = async () => {
    // Request notification permission if not already granted
    if (!notificationsEnabled && 'Notification' in window) {
      await requestNotificationPermission();
    }
    
    startTimeRef.current = Date.now();
    countdownBeepsPlayed.current.clear();
    setIsRunning(true);
    setIsFinished(false);
    saveTimerState(timeLeft, true);
  };

  const handlePause = () => {
    setIsRunning(false);
    startTimeRef.current = null;
    clearTimerState();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsFinished(false);
    startTimeRef.current = null;
    countdownBeepsPlayed.current.clear();
    clearTimerState();
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
    setIsFinished(false);
    startTimeRef.current = null;
    countdownBeepsPlayed.current.clear();
    clearTimerState();
  };

  const handleTypeChange = (type) => {
    setTimerType(type);
    setIsRunning(false);
    setTimeLeft(duration);
    setIsFinished(false);
    startTimeRef.current = null;
    countdownBeepsPlayed.current.clear();
    clearTimerState();
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24 pt-8 px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <TimerIcon className="w-6 h-6 text-primary-400" />
          <h1 className="text-2xl font-bold text-white">Workout Timer</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Stay focused, track your intervals
        </p>
        
        {/* Notification Status */}
        <div className="mt-3">
          {notificationsEnabled ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-lg">
              <Bell className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">Background alerts enabled</span>
            </div>
          ) : (
            <button
              onClick={requestNotificationPermission}
              className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg transition-colors"
            >
              <BellOff className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400">Enable background alerts</span>
            </button>
          )}
        </div>
      </div>

      {/* Timer Type Toggle */}
      <div className="glass rounded-2xl p-2 flex gap-2 mb-8">
        <button
          onClick={() => handleTypeChange('rest')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            timerType === 'rest'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Rest Timer
        </button>
        <button
          onClick={() => handleTypeChange('exercise')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            timerType === 'exercise'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Exercise Timer
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-3xl p-8 text-center"
        >
          {/* Circular Progress */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke={timerType === 'rest' ? '#3b82f6' : '#0ba5ec'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {isFinished ? (
                  <motion.div
                    key="finished"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-center"
                  >
                    <div className="text-6xl font-bold text-green-400 mb-2">✓</div>
                    <div className="text-lg font-semibold text-green-400">Complete!</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="text-7xl font-bold text-white mb-2">
                      {minutes}:{seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      {timerType === 'rest' ? 'Rest Period' : 'Exercise Time'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-gray-400" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isRunning ? handlePause : handleStart}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
                timerType === 'rest'
                  ? 'bg-blue-600 hover:bg-blue-500'
                  : 'bg-primary-600 hover:bg-primary-500'
              }`}
            >
              {isRunning ? (
                <Pause className="w-8 h-8 text-white" fill="white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              )}
            </motion.button>

            <div className="w-14" /> {/* Spacer for symmetry */}
          </div>
        </motion.div>
      </div>

      {/* Duration Presets */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">
          Quick Durations
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {PRESET_DURATIONS.map((preset) => (
            <motion.button
              key={preset}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDurationChange(preset)}
              className={`py-4 px-6 rounded-xl font-semibold transition-all ${
                duration === preset
                  ? timerType === 'rest'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-primary-600 text-white shadow-lg'
                  : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
              }`}
            >
              {preset}s
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerScreen;
