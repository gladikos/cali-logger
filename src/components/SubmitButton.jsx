// ============================================
// 🚀 SUBMIT BUTTON COMPONENT
// ============================================
// Premium animated button for workout submission

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const SubmitButton = ({ onClick, isLoading, isSuccess, isError, disabled, children }) => {
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Submitting...</span>
        </>
      );
    }
    
    if (isSuccess) {
      return (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Submitted!</span>
        </>
      );
    }
    
    if (isError) {
      return (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>Try Again</span>
        </>
      );
    }
    
    return children;
  };

  const getButtonStyles = () => {
    if (isSuccess) {
      return 'bg-green-600 hover:bg-green-700';
    }
    
    if (isError) {
      return 'bg-red-600 hover:bg-red-700';
    }
    
    if (disabled) {
      return 'bg-gray-700 cursor-not-allowed opacity-50';
    }
    
    return 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400';
  };

  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-3 px-5 rounded-xl
        flex items-center justify-center gap-2
        text-white font-semibold text-base
        transition-all duration-300
        shadow-lg shadow-primary-600/30
        ${getButtonStyles()}
      `}
    >
      {getButtonContent()}
    </motion.button>
  );
};

export default SubmitButton;
