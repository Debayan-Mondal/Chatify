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
    currentSharedKey: null,

    setActiveTab: (tab) => {
        set({activeTab: tab});
    },
    setSelectedUser: (user) => {
        set({selectedUser: user, currentSharedKey: null, messages: []});
    },
    getCurrentSharedKey: async () => {
        set({isMessagesLoading: true});
        try {
            const {selectedUser} = get();
            const res = await axiosInstance.get(`/messages/key/${selectedUser._id}`);
            const publicKey = res.data.publicKey;
            const privateKey = JSON.parse(localStorage.getItem("privateKey"));
            const importedPrivateKey = await window.crypto.subtle.importKey(
                'jwk',
                privateKey,
                {name: 'ECDH', namedCurve: 'P-256'},
                false,
                ["deriveKey"]
            )
            const importedPublicKey = await window.crypto.subtle.importKey(
                'jwk',
                publicKey,
                {name: 'ECDH', namedCurve: 'P-256'},
                false,
                []
            )
            const sharedKey = await window.crypto.subtle.deriveKey(
                {
                    name: 'ECDH',
                    public: importedPublicKey
                },
                importedPrivateKey,
                {
                    name: 'AES-GCM',
                    length: 256,
                },
                true,
                ['encrypt', 'decrypt']
            )
            set({currentSharedKey: sharedKey});
        } catch(err) {
            console.log(err);
        } finally {
            set({isMessagesLoading: false});
        }
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
    base64ToUint8Array: (base64) => {
        if (!base64 || typeof base64 !== 'string') return new Uint8Array();
        try {
            const cleanBase64 = base64.includes('base64,') 
                ? base64.split('base64,')[1] 
                : base64;
            const binaryString = atob(cleanBase64.trim());
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        } catch (e) {
            console.error("Failed to decode Base64 string:", base64.substring(0, 20) + "...");
            return new Uint8Array();
        }
    },
    decryptMessage: async (encryptedMessages) => {
        const {base64ToUint8Array, currentSharedKey} = get();
        set({isMessagesLoading: true});
        if(!currentSharedKey) return encryptedMessages;
        try {
            const decryptedMessages = await Promise.all(encryptedMessages.map(async(msg) => {
                let decryptedText = msg.text;
                let decryptedImage = msg.image;
                try {
                    const ivBuffer = base64ToUint8Array(msg.iv);
                    if (!currentSharedKey) {
                        console.error("Decryption aborted: No shared key available.");
                        return encryptedMessages;
                    }
                    if(msg.text) {
                        const textBuffer = base64ToUint8Array(msg.text);
                        const decryptedBuffer = await window.crypto.subtle.decrypt(
                            {name: "AES-GCM", iv: ivBuffer},
                            currentSharedKey,
                            textBuffer
                        );
                        decryptedText = new TextDecoder().decode(decryptedBuffer);
                    }
                    if(msg.image && msg.image.startsWith("http")) {
                        const response = await fetch(msg.image);
                        const encryptedBytes = await response.arrayBuffer();
                        const decryptedBuffer = await window.crypto.subtle.decrypt(
                            {name: "AES-GCM", iv: ivBuffer},
                            currentSharedKey,
                            encryptedBytes
                        );
                        decryptedImage = new TextDecoder().decode(decryptedBuffer);
                    }
                } catch(err) {
                    console.log("Decryption failed", err);
                }
                return {
                    ...msg,
                    text: decryptedText,
                    image: decryptedImage,
                    isEncypted: false
                }
            }));
            return decryptedMessages;
        } catch(err) {
            console.log("Decryption failed",err);
        } finally {
            set({isMessagesLoading: false});
        }
    },
    getMessages: async(userId) => {
        const {getCurrentSharedKey} = get();
        set({isMessagesLoading: true});
        const {decryptMessage} = get();
        try {
            await getCurrentSharedKey();
            const res = await axiosInstance.get(`/messages/${userId}`);
            const decryptedMessages = await decryptMessage(res.data);
            set({messages: decryptedMessages});
        } catch(error) {
            toast.error(error.response?.data?.message || "Something Went Wrong");
        } finally {
            set({isMessagesLoading: false})
        }
    },
    encryptMesages: async(text, image) => {
        const {currentSharedKey} = get();
        try {
            
            let encryptedTextBase64 = "";
            let encryptedImageBase64 = "";
            const iv = window.crypto.getRandomValues((new Uint8Array(12)));
            if(text) {
                const textInBytes = new TextEncoder().encode(text);
                const encryptedText = await window.crypto.subtle.encrypt(
                    {
                        name: 'AES-GCM',
                        iv
                    },
                    currentSharedKey,
                    textInBytes
                );
                encryptedTextBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedText)));
            }
            if (image) {
                 const imageInBytes = new TextEncoder().encode(image);
                 const encryptedImage = await window.crypto.subtle.encrypt(
                    {
                        name: 'AES-GCM',
                        iv
                    },
                    currentSharedKey,
                    imageInBytes
                );
                
                let binaryImage = "";
                const imageArray = new Uint8Array(encryptedImage);
                for(let i=0; i< imageArray.length;i++) {
                    binaryImage += String.fromCharCode(imageArray[i]);
                }
                encryptedImageBase64 = btoa(binaryImage)
            }
            const ivBase64 = btoa(String.fromCharCode(...iv))
            return {
                text: text ? encryptedTextBase64 : null,
                image: image ? encryptedImageBase64 : null,
                iv: ivBase64
            };
        } catch(err) {
            console.log(err);
        }
    },
    sendMessage: async (messageData, encryptedMessageData) => {
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
            isOptimistic: true,
            isEncypted: false
        }
        set({messages: [...messages, optimisticMessage]})
        const {decryptMessage} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, encryptedMessageData);
            const decryptedMessages = await decryptMessage([res.data]);
            const decryptedMessage = decryptedMessages[0];
            set({messages: messages.concat({...decryptedMessage})});
        } catch(error) {
            toast.error(error.response?.data?.message || "Something went Wrong");
            console.log(error);
            set({messages: messages});
        }
    },
    subscribeToMessage: () => {
        const {selectedUser, decryptMessage} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        const {authUser} = useAuthStore.getState();
        socket.on("newMessage",async (newMessage) => {
            const decryptedMessages = await decryptMessage([newMessage]);
            const decryptedMessage = decryptedMessages[0];
            const currentMessages = get().messages;
            set({ messages: [...currentMessages, decryptedMessage]});
        })
    },
    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));