import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Insights from './Insights';
import Questions from './Questions';
import Footer from './Footer';
import { Insight, Question, LastProblem } from '../types';

interface PopupProps {
    onLogout: () => void;
}

const Popup: React.FC<PopupProps> = ({ onLogout }) => {
    // Mock data (this would come from the extension's state)
    const insights: Insight[] = [
        { id: '1', text: 'Dynamic Programming seems to be your weak spot. Try focusing on memoization techniques.' },
        { id: '2', text: 'You excel at Array problems. Consider tackling harder variations.' },
        { id: '3', text: 'Try "Merge Intervals" next - it aligns with your learning path.' }
    ];

    const questions: Question[] = [
        { id: '1', text: 'What should I solve next?', icon: 'arrow-right' },
        { id: '2', text: 'What are my weak areas?', icon: 'activity' },
        { id: '3', text: 'What are my strong areas?', icon: 'trophy' },
        { id: '4', text: 'How can I improve?', icon: 'trending-up' },
        { id: '5', text: 'What\'s the time complexity of my last solution?', icon: 'clock' }
    ];

    const [lastProblem, setLastProblem] = useState<LastProblem | null>(null);

    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get('lastProblem', (result) => {
                if (result.lastProblem) {
                    console.log("✅ Loaded from chrome.storage:", result.lastProblem);
                    setLastProblem(result.lastProblem);
                } else {
                    console.log("ℹ️ No lastProblem in storage");
                }
            });
        } else {
            console.warn("⚠️ chrome.storage.local is not available — are you running this outside a Chrome extension?");
        }
    }, []);

    return (
        <motion.div
            className="w-[300px] h-[500px] bg-gray-900 rounded-lg overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Header onLogout={onLogout} />
            <div className="flex-1 overflow-auto px-4 py-2">
                <Insights insights={insights} />
                <Questions questions={questions} />
            </div>
            {lastProblem && <Footer lastProblem={lastProblem} />}
        </motion.div>
    );
};

export default Popup;