
import axios from 'axios'

const url = '/api';

export const loginUser = async (login) => {
    const {username, password, usertype} = login 
    try{
        const data = await axios.post(`${url}/login`, {
            username,
            password,
            userType:usertype
        });
        return data;
    }catch(error){
        return error.response
    }
}       

export const checkToken = async () => {
    const userToken = await sessionStorage.getItem("userToken");
    try{
        const data = await axios.post(`${url}/login/me/`+userToken, {
        });
        return data;
    }catch(error){
        return error.response
    }
}  

export const fetchUsers = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/users`, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
        });
        const {data} = res;
        return data;
    }catch(error){
        return []
        //return error.response
    }
}

export const fetchUser = async (id) => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/users/`+id, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
        });
        const {data} = res;
        return data;
    }catch(error){
        return []
        //return error.response
    }
}

export const createUser = async (user) => {
    const token = await sessionStorage.getItem("userToken")
    const {name, username, password, userType} = user
    try{
        const data = await axios.post(`${url}/users`, {
            name, username, password, userType
        }, {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        })
        return data;
    }catch(error){
        return error.response;
    }
}






