import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apolloClient } from '@/lib/apollo';
import { User, RefreshTokenDocument } from '@/graphql/generated';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (accessToken: string, user: User) => void;
  logout: () => void;
  tryRefreshToken: () => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      accessToken: null,
      user: null,
      isLoading: true, // Start with true, will be set to false after auth initialization

      // Actions
      setAuth: (accessToken: string, user: User) => {
        set({ accessToken, user });
      },

      logout: () => {
        set({ accessToken: null, user: null });
        // Clear Apollo cache
        apolloClient.clearStore();
      },

      tryRefreshToken: async () => {
        try {
          const result = await apolloClient.mutate({
            mutation: RefreshTokenDocument,
            errorPolicy: 'none',
            context: {
              headers: {
                // Don't include Authorization header for refresh token call
              },
            },
          });

          if (result.data?.refreshToken) {
            const { accessToken, user } = result.data.refreshToken;
            get().setAuth(accessToken, user);
            return true;
          }
          return false;
        } catch (error) {
          console.log('Refresh token failed (this is normal for first visit):', error);
          get().logout();
          return false;
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        // Only persist user info, not the token (for security)
        user: state.user,
      }),
    }
  )
);
