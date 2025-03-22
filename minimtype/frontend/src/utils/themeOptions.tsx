

const darkTheme = {
    label: 'Dark',
    background: 'bg-gray-700',
    correct: 'text-yellow-400',
    wrong: 'text-cyan-500',
    textColor: 'text-white',
    lineColor: 'rgb(255,255,255)',
    lineColor2: 'rgb(162,167,155)',
    typeBoxText: 'gray',
    graphbg: "rgb(166,166,166)"
};

const magicTheme = {
    label: 'Magic',
    background: 'bg-fuchsia-200',
    correct: 'text-teal-600',
    wrong: 'text-orange-700',
    textColor: 'text-indigo-500',
    lineColor: 'rgb(99,102,241)',
    lineColor2: 'rgb(193,141,211)',
    typeBoxText: 'gray',
    graphbg: "rgb(156,113,255)"
};



const blueTheme = {
    label: 'Blue',
    background: 'bg-sky-600',
    correct: 'text-green-500',
    wrong: 'text-red-500',
    textColor: 'text-white',
    lineColor: 'rgb(255,255,255)',
    lineColor2: 'rgb(33,230,244)',
    typeBoxText: 'white',
    graphbg: "rgb(143,201,240)"
};

const defaultTheme = {
    label: 'Blue',
    background: 'bg-black',
    correct: 'text-green-300',
    wrong: 'text-red-300',
    textColor: 'text-white',
    lineColor: 'rgb(255,255,255)',
    lineColor2: 'rgb(249,247,99)',
    typeBoxText: 'white',
    graphbg: "rgb(156,163,175)"
};



export const themeOptions = [
    {label: 'Default', value: defaultTheme},
    {label: 'Magic', value: magicTheme},
    {label: 'Dark', value: darkTheme},
    {label: 'Blue', value: blueTheme},
];