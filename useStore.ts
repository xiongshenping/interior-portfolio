import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
    getAllDesigns,
    getDesignById,
    getDesignsByCategory,
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
  savedDesigns: Design[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchDesigns: () => Promise<void>;
  fetchDesignsByCategory: (category: string) => Promise<void>;
  fetchDesignById: (id: number) => Promise<void>;
  addSavedDesign: (design: Design) => void;
  removeSavedDesign: (id: number) => void;
  isDesignSaved: (id: number) => boolean;
}

const SAVED_KEY = 'savedDesigns';

export const useStore = create<AppState>((set, get) => ({
  user: null,
  designs: [],
  selectedDesign: null,
  savedDesigns: [],
  loading: false,

  login: async (email: string, password: string) => {
    const user = await getUserByEmailAndPassword(email, password);
    if (user) {
      set({ user: email });
      const savedRaw = await AsyncStorage.getItem(`${SAVED_KEY}_${email}`);
      if (savedRaw) {
        try {
          const parsed = JSON.parse(savedRaw);
          set({ savedDesigns: parsed });
        } catch {
          set({ savedDesigns: [] });
        }
      }
      return true;
    }
    return false;
  },

  register: async (email: string, password: string) => {
    const success = await registerUser(email, password);
    if (success) {
      return true;
    }
    return false;
  },

  logout: () => {
    const { user } = get();
    if (user) {
      AsyncStorage.setItem(`${SAVED_KEY}_${user}`, JSON.stringify(get().savedDesigns));
    }
    set({ user: null, designs: [], selectedDesign: null, savedDesigns: [] });
  },

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

  addSavedDesign: (design: Design) => {
    const { savedDesigns, user } = get();
    const exists = savedDesigns.some((d) => d.id === design.id);
    if (!exists) {
      const updated = [...savedDesigns, design];
      set({ savedDesigns: updated });
      if (user) {
        AsyncStorage.setItem(`${SAVED_KEY}_${user}`, JSON.stringify(updated));
      }
    }
  },

  removeSavedDesign: (id: number) => {
    const { savedDesigns, user } = get();
    const updated = savedDesigns.filter((d) => d.id !== id);
    set({ savedDesigns: updated });
    if (user) {
      AsyncStorage.setItem(`${SAVED_KEY}_${user}`, JSON.stringify(updated));
    }
  },

  isDesignSaved: (id: number) => {
    return get().savedDesigns.some((d) => d.id === id);
  },
}));
