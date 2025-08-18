import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';
import { authStore } from '@/store/auth.store';
import { AppRouter } from './AppRouter';
import './App.css';

const { compactAlgorithm } = theme;

export const App: React.FC = () => {
  const { setLoading, user, tryRefreshToken } = authStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Only attempt token refresh if there's a persisted user (indicating a previous session)
        if (user) {
          await tryRefreshToken();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Run only once on mount

  return (
    <ConfigProvider
      theme={{
        algorithm: compactAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Layout: {
            headerBg: '#fff',
            headerHeight: 56,
          },
        },
      }}
    >
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ApolloProvider>
    </ConfigProvider>
  );
};
