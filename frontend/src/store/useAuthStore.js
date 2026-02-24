import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isChecking: true,
    isSigning:false,
    isLogging:false,

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
    },
    login: async(data) => {
        try {
            set({isLogging: true});
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data})
            toast.success("Logged in successfully!")
        } catch(error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLogging: false});
        }
    },
    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully!");
            set({authUser: null})
        } catch(error) {
            toast.error("Error Loggin Out");
        }
    },
    updateProfile: async(data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data})
            toast.success("Profile Updated Sucessfully");
        } catch(error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message);
        }
    },
}));