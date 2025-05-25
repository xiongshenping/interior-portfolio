import { create } from 'zustand';
import {
    addToFavorites,
    getAllDesigns,
    getDesignById,
    getDesignsByCategory,
    getFavoriteDesigns,
    getUserByEmailAndPassword,
    registerUser,
    removeFromFavorites,
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
  favorites: Design[];
  loading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  fetchDesigns: () => Promise<void>;
  fetchDesignsByCategory: (category: string) => Promise<void>;
  fetchDesignById: (id: number) => Promise<void>;

  fetchFavorites: () => Promise<void>;
  addToFavoritesById: (id: number) => Promise<void>;
  removeFromFavoritesById: (id: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  designs: [],
  selectedDesign: null,
  favorites: [],
  loading: false,

  login: async (email, password) => {
    const user = await getUserByEmailAndPassword(email, password);
    if (user) {
      set({ user: email });
      return true;
    }
    return false;
  },

  register: async (email, password) => {
    const success = await registerUser(email, password);
    return success;
  },

  logout: () => set({
    user: null,
    designs: [],
    selectedDesign: null,
    favorites: [],
  }),

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

  fetchFavorites: async () => {
    const data = await getFavoriteDesigns();
    set({ favorites: data });
  },

  addToFavoritesById: async (id: number) => {
    const success = await addToFavorites(id);
    if (success) {
      const updated = await getFavoriteDesigns();
      set({ favorites: updated });
    }
  },

  removeFromFavoritesById: async (id: number) => {
    await removeFromFavorites(id);
    const updated = await getFavoriteDesigns();
    set({ favorites: updated });
  },
}));
