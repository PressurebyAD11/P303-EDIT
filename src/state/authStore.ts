import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

const MOCK_USER: User = { id: "user-amber", name: "Amber" };

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (provider: "google" | "apple") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (_provider) => set({ isLoggedIn: true, user: MOCK_USER }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    { name: "edit:auth" }
  )
);
