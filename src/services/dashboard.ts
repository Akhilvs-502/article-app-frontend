

import { API_ROUTES } from "@/constants/routes"
import axios from "../utils/axiosConfig"
import { toastError } from "@/utils/toast"


export const createArticleService = async (body: Object) => {
    try {

        const response = await axios.post(API_ROUTES.USER.CREATE_ARTICLE, body, { withCredentials: true })
        return response
    }
    catch (error) {
        throw error
    }
}

export const editArticleService = async (id: string | number, body: Object) => {
    try {
        const response = await axios.patch(`${API_ROUTES.USER.UPDATE_ARTICLE}/${id}`, body, { withCredentials: true })
        return response
    }
    catch (error) {
        console.error("Error updating article:", error);
        toastError("Error when updating article. Please try again later.");
        throw error;
    }
}

export const getUserArticleService = async () => {
    try {
        const response = await axios.get(API_ROUTES.USER.MY_ARTICLE, { withCredentials: true })
        return response
    }
    catch (error) {
        console.error("Error fetching user articles:", error);
        toastError("Error when fetching articles. Please try again later.");
        throw error;
    }
}
export const getUserFeedsService = async () => {
    try {
        const response = await axios.get(API_ROUTES.USER.MY_FEEDS, { withCredentials: true })
        return response
    }
    catch (error) {
        console.error("Error fetching user articles:", error);
        toastError("Error when fetching articles. Please try again later.");
        throw error;
    }
}

export const articleActionService = async (id: string | number, action: 'like' | 'dislike' | 'block') => {
    try {
        const response = await axios.post(`${API_ROUTES.USER.ARTICLE_ACTION}/${id}`, { action }, { withCredentials: true })
        return response
    }
    catch (error) {
        console.error(`Error performing ${action} action:`, error);
        toastError(`Error when ${action}ing article. Please try again later.`);
        throw error;
    }
}






