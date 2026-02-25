import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

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
    getMessages: async(userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch(error) {
            toast.error(error.response?.data?.message || "Something Went Wrong");
        } finally {
            set({isMessagesLoading: false})
        }
    },
    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        const {authUser} = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        }
        set({messages: [...messages, optimisticMessage]})
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: messages.concat(res.data)});
        } catch(error) {
            toast.error(error.response?.data?.message || "Something went Wrong");
            set({messages: messages});
        }
    }

}));