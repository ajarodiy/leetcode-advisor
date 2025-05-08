import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface FloatingFeedbackProps {
  message: string;
  subtext: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

const FloatingFeedback: React.FC<FloatingFeedbackProps> = ({
  message,
  subtext,
  actionText,
  onAction,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm"
      >
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pr-6">
          <h3 className="text-white font-medium mb-1">{message}</h3>
          <p className="text-gray-400 text-sm mb-2">{subtext}</p>
          
          {actionText && (
            <button
              onClick={onAction}
              className="text-yellow-400 text-sm font-medium hover:text-yellow-500 transition-colors"
            >
              {actionText}
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingFeedback;