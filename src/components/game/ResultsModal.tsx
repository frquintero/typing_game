'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  errors: number;
  focusMode: boolean;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = React.memo(
  ({ wpm, accuracy, errors, focusMode, onClose }) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    // Handle key and mouse events to close modal
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Close on any key press
        onClose();
      };

      const handleClick = (event: MouseEvent) => {
        // Close on any mouse click
        onClose();
      };

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClick);

      // Cleanup
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClick);
      };
    }, [onClose]);

    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            id="results-modal-title"
          >
            {focusMode ? 'Focus Mode Complete!' : 'Game Complete!'}
          </motion.h2>

          <motion.div
            className="space-y-4 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            role="region"
            aria-labelledby="results-stats-heading"
          >
            <h3 id="results-stats-heading" className="sr-only">
              Game Statistics
            </h3>
            {!focusMode && (
              <motion.div
                className="flex justify-between"
                variants={itemVariants}
                role="status"
                aria-label={`Words per minute: ${wpm}`}
              >
                <span className="text-gray-600 dark:text-gray-400">Words Per Minute:</span>
                <motion.span
                  className="font-bold text-blue-600 dark:text-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 500 }}
                  aria-hidden="true"
                >
                  {wpm}
                </motion.span>
              </motion.div>
            )}
            <motion.div
              className="flex justify-between"
              variants={itemVariants}
              role="status"
              aria-label={`Typing accuracy: ${accuracy} percent`}
            >
              <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
              <motion.span
                className="font-bold text-green-600 dark:text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 500 }}
                aria-hidden="true"
              >
                {accuracy}%
              </motion.span>
            </motion.div>
            <motion.div
              className="flex justify-between"
              variants={itemVariants}
              role="status"
              aria-label={`Total errors: ${errors}`}
            >
              <span className="text-gray-600 dark:text-gray-400">Errors:</span>
              <motion.span
                className="font-bold text-red-600 dark:text-red-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 500 }}
                aria-hidden="true"
              >
                {errors}
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            Click anywhere or press any key to continue
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);