
import axios from "../utils/axiosConfig"
import { API_ROUTES } from "../constants/routes"



export const userLogin = async (body: object) => {
  try {
    const response = await axios.post(API_ROUTES.USER.LOGIN, body, { withCredentials: true });
    console.log(response, "updated login");
    return response;
  } catch (error) {

    throw error;
  }
};


export const userRegister = async (body: object) => {
  try {
    const response = await axios.post(API_ROUTES.USER.REGISTER, body, { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};



