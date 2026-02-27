import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isChecking: true,
    isSigning:false,
    isLogging:false,
    socket: null,
    onlineUser: [],

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
            get().connectSocket();
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
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
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
    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {withCredentials: true});
        socket.connect();
        set({socket: socket});
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUser: userIds});
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connect) get().socket.disconnect();
    }
}));