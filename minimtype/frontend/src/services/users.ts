import API from "./api"


export const deleteUser = async (userId: string) => {
    const response = await API.delete(`/user/${userId}`)
    return response;
}