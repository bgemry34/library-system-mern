
import axios from 'axios'

const url = 'http://localhost:4000/api';
const token = sessionStorage.getItem("userToken")

export const fetchBooks = async () => {    
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

export const createBook = async (book) => {
    const {title, genre, author} = book
    try{
        const data = await axios.post(`${url}/books`, {
                title, genre, author
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

export const editBook = async (book) => {
    const {title, genre, author, id} = book
    try{
        const data = await axios.put(`${url}/books/`+id, {
                title, genre, author
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
