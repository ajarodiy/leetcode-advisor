import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Insight } from '../types';

interface InsightsProps {
  insights: Insight[];
}

const Insights: React.FC<InsightsProps> = ({ insights }) => {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center mb-2">
        <Sparkles className="text-yellow-400 w-4 h-4 mr-2" />
        <h2 className="text-white text-sm font-medium">Smart Suggestions</h2>
      </div>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className="bg-gray-800 p-3 rounded-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            whileHover={{ 
              backgroundColor: "rgba(38, 38, 38, 1)",
              transition: { duration: 0.2 }
            }}
          >
            <p className="text-gray-300 text-sm">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Insights;