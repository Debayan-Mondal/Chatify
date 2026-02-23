import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isChecking: true,
    isSigning:false,


    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch(err) {
            set({authUser: null});
        } finally {
            set({isChecking: false});
        }
    },

    signup: async(data) => {
        try {
            set({isSigning: true});
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully!");
        } catch(err) {
            toast.error(err.response.data.message);
        } finally {
            set({isSigning: false});
        }
    }
}));