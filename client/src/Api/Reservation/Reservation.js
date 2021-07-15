import axios from 'axios'

const url = '/api';

export const fetchPending = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/reserve/pending`, {
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

export const fetchApproved = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/reserve/reserved`, {
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

export const fetchCancelled = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/reserve/cancelled`, {
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

export const approvedReservationRequest = async (reserve) => {
    const token = await sessionStorage.getItem("userToken");
    const {id} = reserve;
    try{
            const data = await axios.put(`${url}/reserve/approve/`+id, {
                
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

export const cancelReservationRequest = async (reserve) => {
    const token = await sessionStorage.getItem("userToken");
    const {id} = reserve;
    try{
            const data = await axios.put(`${url}/reserve/cancel/`+id, {
                
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

export const reserveBook = async (reservationDate, bookId) =>{
    const token = await sessionStorage.getItem("userToken")
    try{
        const data = await axios.post(`${url}/reserve`, {
                bookId, reservationDate
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