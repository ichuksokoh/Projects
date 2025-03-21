import API from "./api"

interface test {
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

export const createTest = async (data: test) => {
    const response = await API.post('/tests', data );

    return response.data;
}