import { create } from 'zustand';
import {
    removeSavedDesign as dbRemoveSavedDesign,
    getAllDesigns,
    getDesignById,
    getDesignsByCategory,
    getSavedDesigns,
    getUserByEmailAndPassword,
    registerUser,
    saveDesign
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
  addSavedDesign: (design: Design) => Promise<void>;
  removeSavedDesign: (id: number) => Promise<void>;
  isDesignSaved: (id: number) => boolean;
}

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
      const saved = await getSavedDesigns(email);
      set({ savedDesigns: saved });
      return true;
    }
    return false;
  },

  register: async (email: string, password: string) => {
    const success = await registerUser(email, password);
    return success;
  },

  logout: () => {
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

  addSavedDesign: async (design: Design) => {
    const { savedDesigns, user } = get();
    if (!user) return;
    const exists = savedDesigns.some((d) => d.id === design.id);
    if (!exists) {
      await saveDesign(user, design);
      set({ savedDesigns: [...savedDesigns, design] });
    }
  },

  removeSavedDesign: async (id: number) => {
    const { savedDesigns, user } = get();
    if (!user) return;
    await dbRemoveSavedDesign(user, id);
    set({ savedDesigns: savedDesigns.filter((d) => d.id !== id) });
  },

  isDesignSaved: (id: number) => {
    return get().savedDesigns.some((d) => d.id === id);
  },
}));
