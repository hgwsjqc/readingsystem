// src/App.tsx
import { useEffect } from 'react';
import './App.css';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate, useLocation } from 'react-router-dom';
import BackToTop from '@/components/BackToTop';

// 需要登录才能访问的路径
export const needsLoginPath = ['/mine', '/chat','/reading']; // 假设“发现”和“首页”无需登录，“订单”已移除

function App() {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // 如果未登录，且当前路径在需要登录的列表中，则跳转到登录页
    if (!isLogin && needsLoginPath.some(path => pathname.startsWith(path))) {
      navigate('/login', { replace: true });
    }
  }, [isLogin, navigate, pathname]);

  return (
    <>
      <BackToTop />
    </>
  );
}

export default App;