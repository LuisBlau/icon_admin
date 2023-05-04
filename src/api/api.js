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

/* For How */
export const getHowBlocks = async () => {
    let res = await fetch(`${API_URL}/ico/sections/how`);
    return res.json();
}

export const addHowBlock = async (payload) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    let res = await fetch(`${API_URL}/ico/sections/how`, requestOptions);
    return res.json();
};

export const updateHowBlock = async (payload) => {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    let res = await fetch(`${API_URL}/ico/sections/how/${payload._id}`, requestOptions);
    return res.json();
};

export const deleteHowBlock = async (id) => {
    const requestOptions = {
        method: 'DELETE'
    };
    let res = await fetch(`${API_URL}/ico/sections/how/${id}`, requestOptions);
    return res.json();
}

/* For Contact */
export const getContactBlocks = async () => {
    let res = await fetch(`${API_URL}/ico/sections/contact`);
    return res.json();
}

export const addContactBlock = async (payload) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    let res = await fetch(`${API_URL}/ico/sections/contact`, requestOptions);
    return res.json();
};

export const updateContactBlock = async (payload) => {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    let res = await fetch(`${API_URL}/ico/sections/contact/${payload._id}`, requestOptions);
    return res.json();
};

export const deleteContactBlock = async (id) => {
    const requestOptions = {
        method: 'DELETE'
    };
    let res = await fetch(`${API_URL}/ico/sections/contact/${id}`, requestOptions);
    return res.json();
}