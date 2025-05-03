import React from 'react';
import { motion } from 'framer-motion';
import { Brain, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <motion.div
      className="bg-black p-4 border-b border-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <Brain className="text-yellow-400 w-6 h-6" />
          </motion.div>
          <h1 className="text-white text-lg font-semibold">AI Insights</h1>
        </div>
        <motion.button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={onLogout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>
      <p className="text-gray-400 text-xs mt-1">
        Personalized recommendations based on your LeetCode activity
      </p>
    </motion.div>
  );
};

export default Header;