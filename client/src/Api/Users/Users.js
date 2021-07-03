
import axios from 'axios'

const url = 'http://localhost:4000/api';

export const loginUser = async (login) => {
    const {username, password} = login 
    try{
        const data = await axios.post(`${url}/login`, {
            username,
            password
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




