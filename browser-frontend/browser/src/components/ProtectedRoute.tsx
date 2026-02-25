import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLogin } = useUserStore();

  if (!isLogin) {
    // 未登录，跳转到登录页面
    return <Navigate to="/login" replace />;
  }

  // 已登录，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;
