import { API_ROUTES } from "@/constants/routes"
import axios from "../utils/axiosConfig"



export const verifyOtpService=async(body:Object)=>{
    try{
        const url="/api/user/verifyOtp"
        const response= await axios.post(API_ROUTES.USER.VERIFY_OTP,body,{withCredentials:true}) 
        return response
    }
    catch(error){
        throw error
    }
}