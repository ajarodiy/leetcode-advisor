export interface Insight {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    text: string;
    icon: string;
}

export interface LastProblem {
    name: string;
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
    timestamp: string;
}

export interface CurrentProblem {
    name: string | null;
    difficulty: 'Easy' | 'Medium' | 'Hard' | null;
    userCode: string | null;
    language: 'cpp' | 'java' | 'python';
}

export interface Solution {
    code: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
}

export interface FloatingFeedbackProps {
    message: string;
    subtext: string;
    actionText?: string;
    onAction?: () => void;
    onDismiss: () => void;
}