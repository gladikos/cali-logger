// ============================================
// 📱 BOTTOM NAVIGATION BAR
// ============================================
// 5-screen navigation: Plan | Start | Home | Timer | History

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Dumbbell, Home, Timer, History } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'planner', icon: Calendar, label: 'Workouts' },
  { id: 'workout', icon: Dumbbell, label: 'Start' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'timer', icon: Timer, label: 'Timer' },
  { id: 'history', icon: History, label: 'History' }
];

const BottomNav = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 glass-light border-t border-white/10 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary-400' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
