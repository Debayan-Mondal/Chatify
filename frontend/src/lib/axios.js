import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "developement" || "/axios",
    withCredentials: true
})