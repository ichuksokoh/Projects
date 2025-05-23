import API from "./api"


export const deleteUser = async (userId: string) => {
    const response = await API.delete(`/user/${userId}`);
    return response;
}

export const getUserPw = async (userId: string) => {
    const response = await API.get(`/user/${userId}`);
    console.log(response);
    return response.data
}