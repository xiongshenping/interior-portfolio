import { create } from 'zustand';
import {
    getAllDesigns,
    getDesignsByCategory,
    getDesignById,
    getUserByEmailAndPassword,
    registerUser,
} from '../utils/database';

interface Design {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
}

interface AppState {
    user: string | null;
    designs: Design[];
    selectedDesign: Design | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    fetchDesigns: () => Promise<void>;
    fetchDesignsByCategory: (category: string) => Promise<void>;
    fetchDesignById: (id: number) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    designs: [],
    selectedDesign: null,
    loading: false,

    login: async (email: string, password: string) => {
        const user = await getUserByEmailAndPassword(email, password);
        if (user) {
            set({ user: email });
            return true;
        }
        return false;
    },

    register: async (email: string, password: string) => {
        const success = await registerUser(email, password);
        if (success) {
            set({ user: email });
            return true;
        }
        return false;
    },

    logout: () => set({ user: null, designs: [], selectedDesign: null }),

    fetchDesigns: async () => {
        set({ loading: true });
        try {
            const designs = await getAllDesigns();
            set({ designs, loading: false });
        } catch (error) {
            console.error('Error fetching designs:', error);
            set({ loading: false });
        }
    },

    fetchDesignsByCategory: async (category: string) => {
        set({ loading: true });
        try {
            const designs = await getDesignsByCategory(category);
            set({ designs, loading: false });
        } catch (error) {
            console.error('Error fetching designs by category:', error);
            set({ loading: false });
        }
    },

    fetchDesignById: async (id: number) => {
        set({ loading: true });
        try {
            const design = await getDesignById(id);
            set({ selectedDesign: design, loading: false });
        } catch (error) {
            console.error('Error fetching design by id:', error);
            set({ loading: false });
        }
    },
}));
