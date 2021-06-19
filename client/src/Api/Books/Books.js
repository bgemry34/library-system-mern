
import axios from 'axios'

const url = 'http://localhost:4000/api';

export const fetchBooks = async () => {
    const token = sessionStorage.getItem("userToken")
    try{
        const {data} = await axios.get(`${url}/books`, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
        });
        return data;
    }catch(error){
        return error.response
    }
}

export const searchItems = async (name) => {
    try{
        const {data} = await axios.get(`${url}/app/api/items/search/`+name);
        return data;
    }catch(error){
        return error.response
    }
}


export const createItem = async (name, company, department, qty, price, depre_price, purchase_order_no, model) => {
    try{
        const data = await axios.post(`${url}/app/api/items/create`, {name, company, department, qty, price, depre_price, purchase_order_no, model });
        return data;
    }catch(error){
        return error.response;
    }
}

export const updateItem = async (form) => {
    try{
        const {id, name, company, department, qty, price, depre_price, purchase_order_no, model} = form;
        const data = await axios.put(`${url}/app/api/items/update/`+id, {name, company, department, qty, price, depre_price, purchase_order_no, model });
        return data;
    }catch(error){
        return error.response
    }
}

export const deleteItem = async (id) => {
    try{
        const data = await axios.delete(`${url}/app/api/items/delete/`+id);
        return data;
    }catch(error){
        return error.response
    }
}
