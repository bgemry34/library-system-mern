import axios from 'axios'

const url = '/api'

export const fetchDashBoardData = async () => {
  const token = await sessionStorage.getItem('userToken')
  try {
    const res = await axios.get(`${url}/dashboard`, {
      headers: {
        Authorization: 'Bearer ' + token, //the token is a variable which holds the token
      },
    })
    const { data } = res
    return data
  } catch (error) {
    return []
    //return error.response
  }
}
