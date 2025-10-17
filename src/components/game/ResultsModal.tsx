'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  errors: number;
  focusMode: boolean;
  onRetry: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ wpm, accuracy, errors, focusMode, onRetry }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {focusMode ? 'Focus Mode Complete!' : 'Game Complete!'}
        </h2>

        <div className="space-y-4 mb-6">
          {!focusMode && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Words Per Minute:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{wpm}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
            <span className="font-bold text-green-600 dark:text-green-400">{accuracy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Errors:</span>
            <span className="font-bold text-red-600 dark:text-red-400">{errors}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onRetry} className="flex-1">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};