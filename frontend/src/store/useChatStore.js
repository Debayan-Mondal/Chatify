import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get)=>({
    allUser:[],
    chats:[],
    messages:[],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnable: localStorage.getItem("isSoundEnabled") === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnable);
        set({isSoundEnable: !get().isSoundEnable});
    },

    setActiveTab: (tab) => {
        set({activeTab: tab});
    },
    setSelectedUser: (user) => {
        set({selectedUser: user});
    },

    getAllUser: async() => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/contact");
            set({allUser: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUserLoading: false});
        }

    },
    getAllChats: async() => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({chats: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUserLoading: false});
        }
    },

}));