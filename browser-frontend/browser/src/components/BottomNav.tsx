import { Home, Book, MessageCircle, User } from 'lucide-react'; // 引入需要的图标
import {
  useNavigate,
  useLocation
} from 'react-router-dom';
import { cn } from '@/lib/utils'; // 组合类名工具函数
import { useUserStore } from '@/store/useUserStore'; // 用户状态管理
import { needsLoginPath } from '@/App'; // 需要登录的路径列表

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLogin } = useUserStore((state) => state);

  const tabs = [
    {
      label: "首页",
      path: "/",
      icon: Home
    },
    {
      label: "阅读",
      path: "/reading",
      icon: Book
    },
    {
      label: "对话",
      path: "/chat",
      icon: MessageCircle
    },
    {
      label: "我的",
      path: "/mine",
      icon: User
    }
  ];

  const handleNav = (path: string) => {
    if (path === pathname) return; // 如果当前路径与点击路径相同，则不做任何操作

    if (needsLoginPath.includes(path) && !isLogin) {
      navigate("/login"); // 如果需要登录且未登录则跳转到登录页
      return;
    }
    navigate(path); // 导航到目标路径
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-white flex items-center justify-around z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.path;

        return (
          <button 
            key={tab.path}
            onClick={() => handleNav(tab.path)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1"
          >
            <Icon 
              size={20} 
              className={cn("transition-colors", isActive ? "text-blue-500" : "text-gray-500")}
            />
            <span className={cn("text-xs transition-colors", isActive ? "text-blue-500 font-medium" : "text-gray-500")}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}