
import axios from 'axios'

const url = '/api';

export const fetchPending = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/borrow/pending`, {
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
        const res = await axios.get(`${url}/borrow/approved`, {
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

export const fetchCancell = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/borrow/cancelled`, {
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

export const fetchReturned = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/borrow/returned`, {
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

export const borrowBook = async (borrower, bookId) =>{
    const token = await sessionStorage.getItem("userToken")
    try{
        const data = await axios.post(`${url}/borrow`, {
                bookId, borrowerId:borrower
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

export const approvedBorrowedRequest = async (borrow) => {
    const token = await sessionStorage.getItem("userToken");
    const {id} = borrow;
    try{
        const data = await axios.put(`${url}/borrow/approved/`+id, {
                
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

export const cancelBorrowedRequest = async (borrow) => {
    const token = await sessionStorage.getItem("userToken");
    const {id} = borrow;
    try{
        const data = await axios.put(`${url}/borrow/cancel/`+id, {
                
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

export const returnBorrowedRequest = async (borrow) => {
    const token = await sessionStorage.getItem("userToken");
    const {id} = borrow;
    try{
        const data = await axios.put(`${url}/borrow/return/`+id, {
                
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


