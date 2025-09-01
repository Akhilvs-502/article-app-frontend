



import { API_ROUTES } from "@/constants/routes"
import axios from "../utils/axiosConfig"


export const updateUserPreference = async (body: object) => {
    try {

        const response = await axios.post(API_ROUTES.USER.UPDATE_PREFENCE, body, { withCredentials: true })
        return response
    }
    catch (error) {
        throw error
    }
}
