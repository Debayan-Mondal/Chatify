import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import { useChatStore } from "./useChatStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isChecking: true,
    isSigning:false,
    isLogging:false,
    socket: null,
    onlineUser: [],
    currentPrivateKey: null,

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
    recoverPrivateKey: async(password) => {
        const {authUser} = get();
        const {salt, iv, wrappedKey} = authUser.vault;
        const {deriveKey, base64ToUint8Array} = useChatStore.getState();
        const saltBuffer = base64ToUint8Array(salt);
        const ivBuffer = base64ToUint8Array(iv);
        const wrappedKeyBuffer = base64ToUint8Array(wrappedKey);

        const wrappingKey = await deriveKey(password, saltBuffer);
        const privateKey = await window.crypto.subtle.unwrapKey(
            "jwk",
            wrappedKeyBuffer,
            wrappingKey,
            {name: "AES-GCM", iv: ivBuffer},
            {name: "ECDH", namedCurve: "P-256"},
            true,
            ["deriveKey", "deriveBits"]
        );
        const jwk = await window.crypto.subtle.exportKey("jwk", privateKey);
        localStorage.setItem(`${authUser.fullName}_privateKey`, JSON.stringify(jwk));
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
        const {recoverPrivateKey} = get();
        
        try {
            set({isLogging: true});
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            await recoverPrivateKey(data.password);
            toast.success("Logged in successfully!")
            get().connectSocket();
        } catch(error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isLogging: false});
        }
    },
    logout: async() => {
        const {authUser} = get();
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem(`${authUser.fullName}_privateKey`);
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