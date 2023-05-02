export const API_URL = "http://localhost:3010";

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

export const uploadFile = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    const requestOptions = {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
        body: formData
    };
    let res = await fetch(`${API_URL}/ico/upload`, requestOptions);
    return res.text();
};

export const getSetting = async () => {
    let res = await fetch(`${API_URL}/ico/setting`);
    return res.json();
}

export const saveSetting = async (payload) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    let res = await fetch(`${API_URL}/ico/setting`, requestOptions);
    return res.json();
};