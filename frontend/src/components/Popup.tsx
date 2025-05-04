import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Insights from './Insights';
import Questions from './Questions';
import Footer from './Footer';
import CurrentProblem from './CurrentProblem';
import { CurrentProblem as CurrentProblemType } from '../types';
import { Insight, Question, LastProblem } from '../types';
import API_BASE_URL from '../config';
import { getAuth } from "firebase/auth";

interface PopupProps {
    userId: string;
    onLogout: () => void;
}

const Popup: React.FC<PopupProps> = ({ userId, onLogout }) => {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [currentProblem, setCurrentProblem] = useState<CurrentProblemType>({
        name: null,
        difficulty: null,
        userCode: null,
        language: 'python'
    });

    const [lastProblem, setLastProblem] = useState<LastProblem | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        if (!window.chrome?.tabs || !window.chrome?.scripting) {
            console.warn("Chrome extension APIs not available. Skipping script execution.");
            return;
        }

        // Fetch last problem from local storage
        if (chrome?.storage?.local) {
            chrome.storage.local.get('lastProblem', (result) => {
                if (result.lastProblem) {
                    setLastProblem(result.lastProblem);
                }
            });
        }

        // Get current problem info and user code from LeetCode tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) return;

            chrome.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const titleEl = document.querySelector('div.text-title-large a[href^="/problems/"]');
                    const difficultyEl = document.querySelector('div[class*="text-difficulty-"]');
                    const model = (window as any).monaco?.editor?.getModels?.()[0];
                    const code = model?.getValue();

                    const title = (titleEl as HTMLElement | null)?.innerText?.trim() ?? null;
                    const difficulty = (difficultyEl as HTMLElement | null)?.innerText?.trim() as 'Easy' | 'Medium' | 'Hard' ?? null;

                    return {
                        name: title,
                        difficulty,
                        userCode: code ?? null,
                        language: 'python' as const
                    };
                }
            }).then((results) => {
                const data = results?.[0]?.result;
                if (data) setCurrentProblem(data);
            }).catch(console.error);
        });

        // Fetch insights
        const fetchInsights = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    console.error("No authenticated user found.");
                    return;
                }

                const token = await user.getIdToken();

                const res = await fetch(`${API_BASE_URL}/user-insights/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                const parsed: Insight[] = data.insights
                    .split('\n')
                    .filter(Boolean)
                    .map((line: string, idx: number) => ({
                        id: `insight-${idx}`,
                        text: line.trim(),
                    }));
                setInsights(parsed);
            } catch (e) {
                console.error("Failed to fetch insights", e);
            }
        };

        fetchInsights();
    }, [userId]);

    const questions: Question[] = [
        { id: '1', text: 'What should I solve next?', icon: 'arrow-right' },
        { id: '2', text: 'What are my weak areas?', icon: 'activity' },
        { id: '3', text: 'What are my strong areas?', icon: 'trophy' },
        { id: '4', text: 'How can I improve?', icon: 'trending-up' },
        { id: '5', text: 'What\'s the time complexity of my last solution?', icon: 'clock' }
    ];

    return (
        <motion.div
            className="bg-gray-900 rounded-lg overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: 1,
                y: 0,
                width: showSolution ? 600 : 300,
                height: showSolution ? 700 : 500,
            }}
            transition={{
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 25,
            }}
        >
            <Header onLogout={onLogout} />
            <div className="flex-1 overflow-auto px-4 py-2">
                <CurrentProblem
                    problem={currentProblem}
                    showSolution={showSolution}
                    onToggleSolution={setShowSolution}
                />
                <Insights insights={insights} />
                <Questions questions={questions} />
            </div>
            {lastProblem && <Footer lastProblem={lastProblem} />}
        </motion.div>
    );
};

export default Popup;
