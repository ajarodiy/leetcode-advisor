import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { LastProblem } from '../types';

interface FooterProps {
  lastProblem: LastProblem;
}

const Footer: React.FC<FooterProps> = ({ lastProblem }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Wrong Answer':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Time Limit Exceeded':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'Runtime Error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="bg-black py-3 px-4 border-t border-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Last Problem</p>
          <p className="text-sm text-white font-medium">{lastProblem.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(lastProblem.status)}</span>
          <span className={`text-xs font-medium ${
            lastProblem.status === 'Accepted' ? 'text-green-500' : 
            lastProblem.status === 'Wrong Answer' ? 'text-red-500' :
            lastProblem.status === 'Time Limit Exceeded' ? 'text-orange-500' : 'text-red-500'
          }`}>
            {lastProblem.status}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Solved {lastProblem.timestamp}</p>
    </motion.div>
  );
};

export default Footer;