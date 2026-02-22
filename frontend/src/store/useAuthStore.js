import {create} from "zustand";

export const useAuthStore = create((set) => ({
    name: "Jack",
    isLoading: false,

    load: () => {
        set({isLoading: true})
    }
}))