import API from "./api"


export const resetPassword = async (userId: string, newPw: string) => {
    const response = await API.get(`/user/${userId}`);
    if (response.data.pw) {
        const pw = response.data.pw;
        if (newPw === pw) {
            return false;
        }
        const response2 = await API.put(`/user/${userId}`, {updatedEmail: "", updatedPw: newPw});
        if (response2.data) {
            return true;
        }
    }
    return false;

}