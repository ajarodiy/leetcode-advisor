import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
  signInError?: string;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onSwitchToSignUp, signInError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    setError(""); 
    onSignIn(email, password);
  };

  return (
    <motion.div 
      className="w-[300px] h-[500px] bg-gray-900 rounded-lg overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black p-4 border-b border-gray-800">
        <h1 className="text-white text-lg font-semibold">🧠 LeetCode Advisor</h1>
        <p className="text-gray-400 text-xs mt-1">Sign in to access your insights</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 p-4 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-yellow-400"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-yellow-400"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </div>

        {(error || signInError) && (
          <p className="text-red-500 text-sm text-center mt-2">{error || signInError}</p>
        )}

        <div className="space-y-4">
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-500 transition-colors"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default SignIn;