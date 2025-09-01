import axios from "../utils/axiosConfig"
import { API_ROUTES } from "../constants/routes"



export const getUserProfile=async()=>{
    try{
        console.log("get profile");
        
    
        const response= await axios.get(API_ROUTES.USER.PROFILE,{withCredentials:true}) 
        return response
    }
    catch(error){
        throw error
    }
}



export const userResetPassword = async (body: object) => {
    try {
        const response = await axios.patch(API_ROUTES.USER.PROFILE_RESET_PASSWORD, body, { withCredentials: true })
        return response
    } catch (error) {
        throw error
    }
}





export const userProfileDataUpdate=async(update:object)=>{
    try{
    
        const response= await axios.patch(API_ROUTES.USER.PROFILE,update,{withCredentials:true}) 
        return response 
    }
    catch(error){
        throw error
    }
}