import { Difficulty, Theme } from '@/types/game';

const wordLists = {
  easy: [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his'
  ],
  medium: [
    'computer', 'keyboard', 'monitor', 'software', 'internet', 'website', 'browser',
    'application', 'document', 'download', 'password', 'security', 'network', 'server'
  ],
  hard: [
    'algorithm', 'asynchronous', 'authentication', 'authorization', 'bandwidth',
    'cache', 'compilation', 'concurrency', 'cryptography', 'database', 'encryption',
    'framework', 'functionality', 'infrastructure', 'middleware', 'optimization'
  ]
};

const themeWords = {
  normal: [],
  programming: [
    'function', 'variable', 'array', 'object', 'string', 'boolean', 'integer',
    'class', 'method', 'property', 'interface', 'module', 'package', 'library'
  ],
  motivational: [
    'success', 'achievement', 'growth', 'progress', 'excellence', 'dedication',
    'perseverance', 'determination', 'focus', 'discipline', 'commitment', 'effort'
  ],
  fitness: [
    'strength', 'endurance', 'cardio', 'flexibility', 'balance', 'power', 'speed',
    'agility', 'coordination', 'recovery', 'nutrition', 'hydration', 'consistency'
  ]
};

export const generateText = (difficulty: Difficulty, theme: Theme, wordCount: number = 50): string => {
  const baseWords = wordLists[difficulty];
  const themeSpecificWords = themeWords[theme];

  const allWords = [...baseWords, ...themeSpecificWords];
  if (allWords.length === 0) return '';

  const selectedWords: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(allWords[Math.floor(Math.random() * allWords.length)]);
  }

  return selectedWords.join(' ');
};