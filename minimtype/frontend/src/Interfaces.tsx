
//Context Interfaceas
export interface AuthContextType {
    user: {
        userId: string;
        userEmail: string;
        userSince: Date;
    };
    register: (user_email: string, password: string) => Promise<boolean>;
    login: (user_email: string, password: string) => Promise<void>;
    logout: () => void;
}


export interface TestTimer {
    testTime: number;
    setTime: (newtime: number) => void;
};

export interface value {
    label: string;
    background: string;
    textColor: string;
    correct: string;
    wrong: string;
    lineColor: string;
    lineColor2: string;
    typeBoxText: string;
    graphbg: string;
};

export interface ThemeValues {
    label: string;
    value: value;
};

export interface Theme {
    theme: ThemeValues;
    setTheme: (theme: ThemeValues) => void;
};

export interface TestType {
    testTime: number;
    setTime: (newtime: number) => void;
};


//Interface for Tests prior to DB save
export interface TestUnsaved {
    user_email: string;
    wpm: number;
    raw_wpm: number;
    characters: {
        correct_chars: Number;
        incorrect_chars: Number;
        missed_chars: Number;
        extra_chars: Number;
    };
    graph_data: number[][];
    accuracy: number;
    user_id: string;
};

//interface for Test after saved to DB
export interface TestSaved {
    _id: string;
    user_email: string;
    wpm: number;
    raw_wpm: number;
    characters: {
        correct_chars: Number;
        incorrect_chars: Number;
        missed_chars: Number;
        extra_chars: Number;
    };
    graph_data: number[][];
    accuracy: number;
    user_id: string;
    date: Date;
};


//interface for stats displayed on stats compoenent
export interface statsistics {
    wpm: number;
    raw: number,
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    missedChars: number;
    extraChars: number;
    graphData: Number[][];
};

