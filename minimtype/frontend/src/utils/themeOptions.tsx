

const darkTheme = {
    label: 'Dark',
    background: 'bg-gray-600',
    correct: 'text-yellow-400',
    wrong: 'text-cyan-500',
    textColor: 'text-white',
    typeBoxText: 'grey'
};

const blueTheme = {
    label: 'Blue',
    background: 'bg-sky-600',
    correct: 'text-blue-500',
    wrong: 'text-red-500',
    textColor: 'text-white',
    typeBoxText: 'white'
};

const defaultTheme = {
    label: 'Blue',
    background: 'bg-black',
    correct: 'text-green-300',
    wrong: 'text-red-300',
    textColor: 'text-white',
    typeBoxText: 'white'
};

export interface value {
    label: string;
    background: string;
    textColor: string;
    correct: string;
    wrong: string;
    typeBoxText: string;
};


export interface ThemeValues {
    label: string;
    value: value;
};

export const themeOptions = [
    {label: 'Default', value: defaultTheme},
    {label: 'Dark', value: darkTheme},
    {label: 'Blue', value: blueTheme},
];