import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from '@/store/auth.store';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { AppLayout } from './AppLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { Spin } from 'antd';

export const AppRouter: React.FC = () => {
  const { isLoading } = authStore();

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/app" replace />} />
    </Routes>
  );
};
