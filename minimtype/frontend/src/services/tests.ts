import { TestUnsaved } from "../Interfaces";
import API from "./api"


export const createTest = async (data: TestUnsaved) => {
    const response = await API.post('/tests', data );

    return response.data;
}