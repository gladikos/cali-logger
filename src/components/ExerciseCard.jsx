// ============================================
// 🎯 EXERCISE CARD COMPONENT
// ============================================
// Premium card component for displaying and inputting exercise data

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExerciseCard = ({ exercise, actualValues, onUpdateActual, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSetChange = (setIndex, value) => {
    // Allow only positive numbers
    const numValue = value === '' ? null : parseInt(value, 10);
    onUpdateActual(exercise.id, setIndex, numValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 cursor-pointer active:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">{exercise.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
            <p className="text-sm text-gray-400">
              {exercise.expectedSets} sets × {exercise.expectedReps}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      {/* Expandable Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 space-y-3">
          {/* Description */}
          <p className="text-xs text-gray-500 italic">{exercise.description}</p>

          {/* Set Inputs */}
          <div className="space-y-2">
            {Array.from({ length: exercise.expectedSets }).map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-16 text-sm text-gray-400 font-medium">
                  Set {setIndex + 1}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={actualValues[setIndex] ?? ''}
                    onChange={(e) => handleSetChange(setIndex, e.target.value)}
                    placeholder={exercise.expectedReps}
                    className="w-full px-4 py-3 bg-dark-600 border border-gray-700 rounded-xl text-white text-center text-lg font-semibold placeholder-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {exercise.type === 'time' ? 'sec' : 'reps'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Completed</span>
              <span className="text-primary-400 font-semibold">
                {actualValues.filter(val => val !== null && val !== '').length} / {exercise.expectedSets} sets
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExerciseCard;
