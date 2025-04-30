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