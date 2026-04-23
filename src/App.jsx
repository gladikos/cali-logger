// ============================================
// 🎯 MAIN APP COMPONENT
// ============================================
// Premium React PWA for Calisthenics Workout Tracking with Swipe Navigation

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import Home from './components/Home';
import WorkoutLibrary from './components/WorkoutLibrary';
import WorkoutEditor from './components/WorkoutEditor';
import WorkoutLogger from './components/WorkoutLoggerNew';
import TimerScreen from './components/TimerScreen';
import History from './components/History';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import { migrateOldWorkoutPlan } from './utils/migration';

// Screen order: planner -> workout -> home -> timer -> history
const SCREENS = ['planner', 'workout', 'home', 'timer', 'history'];

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [editingWorkoutId, setEditingWorkoutId] = useState(null); // null = not editing, 'new' = creating, workoutId = editing

  // Run migration on mount
  useEffect(() => {
    migrateOldWorkoutPlan();
  }, []);

  const handleNavigate = (screen) => {
    const currentIndex = SCREENS.indexOf(currentScreen);
    const newIndex = SCREENS.indexOf(screen);
    
    // Handle profile separately (always slide from right)
    if (screen === 'profile') {
      setDirection(1);
      setCurrentScreen(screen);
      return;
    }
    
    // If coming from profile, go back to previous screen
    if (currentScreen === 'profile') {
      setDirection(-1);
      setCurrentScreen(screen);
      return;
    }
    
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentScreen(screen);
  };

  const handleSwipe = (direction) => {
    // If in editor, swipe right goes back to library
    if (editingWorkoutId !== null) {
      if (direction === 'right') {
        setEditingWorkoutId(null);
      }
      return;
    }
    
    // If in profile, swipe right goes back to home
    if (currentScreen === 'profile' && direction === 'right') {
      handleNavigate('home');
      return;
    }
    
    // Don't allow swiping into profile
    if (currentScreen === 'profile') {
      return;
    }
    
    // Normal screen navigation
    const currentIndex = SCREENS.indexOf(currentScreen);
    
    if (direction === 'left' && currentIndex < SCREENS.length - 1) {
      // Swipe left = go to next screen (right in array)
      handleNavigate(SCREENS[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      // Swipe right = go to previous screen (left in array)
      handleNavigate(SCREENS[currentIndex - 1]);
    }
  };

  const screenVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="app-container relative">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentScreen}
          custom={direction}
          variants={screenVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            
            if (swipe < -10000) {
              handleSwipe('left');
            } else if (swipe > 10000) {
              handleSwipe('right');
            }
          }}
          className="absolute inset-0"
        >
          {currentScreen === 'planner' && (
            <>
              {editingWorkoutId === null ? (
                <WorkoutLibrary
                  onCreateNew={() => setEditingWorkoutId('new')}
                  onEditWorkout={(workoutId) => setEditingWorkoutId(workoutId)}
                />
              ) : (
                <WorkoutEditor
                  workoutId={editingWorkoutId === 'new' ? null : editingWorkoutId}
                  onBack={() => setEditingWorkoutId(null)}
                  onSave={() => setEditingWorkoutId(null)}
                />
              )}
            </>
          )}

          {currentScreen === 'workout' && (
            <WorkoutLogger
              onBack={() => handleNavigate('home')}
              onSuccess={() => {
                console.log('Workout submitted successfully!');
              }}
            />
          )}

          {currentScreen === 'home' && (
            <Home
              onStartWorkout={() => handleNavigate('workout')}
              onViewHistory={() => handleNavigate('history')}
              onPlanWorkout={() => handleNavigate('planner')}
              onNavigate={handleNavigate}
              onOpenProfile={() => handleNavigate('profile')}
            />
          )}

          {currentScreen === 'timer' && <TimerScreen />}

          {currentScreen === 'history' && (
            <History onBack={() => handleNavigate('home')} />
          )}

          {currentScreen === 'profile' && (
            <Profile onBack={() => handleNavigate('home')} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
