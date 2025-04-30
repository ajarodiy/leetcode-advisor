import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Trophy, TrendingUp, Clock } from 'lucide-react';
import { Question } from '../types';

interface QuestionsProps {
  questions: Question[];
}

// TODO: Display AI response

const Questions: React.FC<QuestionsProps> = ({ questions }) => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'arrow-right':
        return <ArrowRight className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'trophy':
        return <Trophy className="w-4 h-4" />;
      case 'trending-up':
        return <TrendingUp className="w-4 h-4" />;
      case 'clock':
        return <Clock className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-white text-sm font-medium mb-2">Ask AI</h2>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <motion.button
            key={question.id}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
              activeQuestion === question.id 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveQuestion(question.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) + 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm">{question.text}</span>
            <span className={`${
              activeQuestion === question.id ? 'text-black' : 'text-yellow-400'
            }`}>
              {getIcon(question.icon)}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Questions;