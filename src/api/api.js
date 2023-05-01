const API_URL = "http://localhost:3010";

export const authVerify = async (data) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    };
    const response = await fetch(`${API_URL}/auth/verify`, requestOptions);
    console.log("x res:: ",response)
    const jsonData = await response.json();
    return jsonData;
}
export const authChallenge = async (wallet) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(`${API_URL}/auth/challenge/${wallet}`, requestOptions);
    const jsonData = await response.json();
    return jsonData;
}