import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/features/auth/mock/users";
import { roleMeta } from "@/config/roles";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; redirectTo: string }>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: async (_email: string, _password: string, role: UserRole) => {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));

                // For mock: use the role to get the corresponding mock user
                const user = mockUsers[role];
                if (!user) {
                    throw new Error("Invalid credentials");
                }

                set({ user, isAuthenticated: true });

                return {
                    success: true,
                    redirectTo: roleMeta[role].defaultRoute,
                };
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: "medhub-auth",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
