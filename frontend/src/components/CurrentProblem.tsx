import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightbulbIcon, Code2, X } from 'lucide-react';
import { CurrentProblem as CurrentProblemType, Solution } from '../types';
import CodeWindow from './CodeWindow';

interface CurrentProblemProps {
  problem: CurrentProblemType;
  showSolution: boolean;
  onToggleSolution: (show: boolean) => void;
}

const CurrentProblem: React.FC<CurrentProblemProps> = ({
  problem,
  showSolution,
  onToggleSolution,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'java' | 'python'>('python');

  // Mock solution data (replace with actual data in production)
  const solution: Solution = {
    code: `def twoSum(self, nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    explanation:
      'This solution uses a hash map to store previously seen numbers and their indices. For each number, we calculate its complement (target - current number) and check if we\'ve seen it before. If we have, we\'ve found our pair and return their indices.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-white text-sm font-medium mb-2">Current Problem</h2>
        {problem.name ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-medium">{problem.name}</p>
                <span
                  className={`text-xs font-medium ${
                    problem.difficulty === 'Easy'
                      ? 'text-green-400'
                      : problem.difficulty === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1"
                  onClick={() => {}}
                >
                  <LightbulbIcon className="w-4 h-4" />
                  <span>Hint</span>
                </button>
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm flex items-center space-x-1"
                  onClick={() => onToggleSolution(!showSolution)}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Solution</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Not solving any problem</p>
        )}
      </div>

      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  {(['python', 'cpp', 'java'] as const).map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedLanguage === lang
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => onToggleSolution(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <CodeWindow code={problem.userCode || '// No code found'} language={selectedLanguage} />

              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="text-white text-sm font-medium mb-1">Explanation</h3>
                  <p className="text-gray-400 text-sm">{solution.explanation}</p>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <h3 className="text-white text-sm font-medium mb-1">Time Complexity</h3>
                    <p className="text-gray-400 text-sm">{solution.timeComplexity}</p>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium mb-1">Space Complexity</h3>
                    <p className="text-gray-400 text-sm">{solution.spaceComplexity}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CurrentProblem;
