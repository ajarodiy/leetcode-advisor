import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import FloatingFeedback, { FloatingFeedbackProps } from './components/FloatingFeedback';

const FeedbackRenderer: React.FC = () => {
    const [feedback, setFeedback] = useState<Omit<FloatingFeedbackProps, 'onDismiss'> | null>(null);

    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === 'SHOW_FEEDBACK' && message.payload) {
                setFeedback(message.payload);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    if (!feedback) return null;

    return (
        <FloatingFeedback
            message={feedback.message}
            subtext={feedback.subtext}
            actionText={feedback.actionText}
            onAction={feedback.onAction}
            onDismiss={() => setFeedback(null)}
        />
    );
};

const container = document.getElementById('leetcode-react-feedback-root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<FeedbackRenderer />);
}
