import { create } from 'zustand';
import { IUser } from './types/auth';
import { fetchClient } from '../utils/fetchClient';

interface IAuth {
    user: IUser | null;
    loading: boolean;
    token: string | null;
    setUser: (user: IUser | null) => void;
    setLoading: (loading: boolean) => void;
    setToken: (token: string | null) => void;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const useAuthStore = create<IAuth>((set) => ({
    user: null,
    token: null,
    loading: false,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setLoading: (loading) => set({ loading }),
    signIn: async (email, password) => {
        set({ loading: true });
        try {
            const data = await fetchClient('/signIn', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                authRequired: false,
            });
            set({ 
                user: data.user, 
                token: data.token 
            });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    signOut: () => {
        set({ user: null, token: null });
    },
}));

export default useAuthStore;