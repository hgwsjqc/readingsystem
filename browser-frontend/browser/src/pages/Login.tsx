import {
  useState,
  // useEffect
} from 'react';
import {
  useUserStore
} from '@/store/useUserStore';
import {
  Button
} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Credentail } from '@/types';
import {
  useNavigate
} from 'react-router-dom';
import Notification from '@/components/Notification';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [formData, setFormData] = useState<Credentail>({
    name: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  const handleChange  = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:value
    }));
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const name = formData.name.trim();
    const password = formData.password.trim();
    if (!name || !password) return ;
    if (isRegister && password !== confirmPassword) {
      setNotification({
        show: true,
        message: '两次密码输入不一致',
        type: 'error'
      });
      return;
    }
    setLoading(true);
    try{
      if (isRegister) {
        await register({name, password});
        setConfirmPassword('');
        setNotification({
          show: true,
          message: '注册成功，请登录',
          type: 'success'
        });
        setIsRegister(false);
      } else {
        await login({name, password});
        // 登录丛history中移除
        navigate("/", { replace: true })
      }
    } catch(err: any) {
      console.log(err, isRegister ? "注册失败" : "登录失败")
      setNotification({
        show: true,
        message: err.response?.data?.message || (isRegister ? "注册失败" : "登录失败"),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }

  }

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  }
  return (
    <div className="min-h-screen flex flex-col items-center 
    justify-center p-6 bg-white">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{isRegister ? '注册' : '登录'}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {/* 无障碍访问  for + id  for 关键字, react htmlFor */}
            <Label htmlFor="name">用户名</Label>
            <Input 
              id="name"
              placeholder='请输入用户名'
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            {/* 无障碍访问  for + id  for 关键字, react htmlFor */}
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              placeholder="请输入密码"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                placeholder="请再次输入密码"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <Button>
          {loading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>
          {isRegister ? '注册中...' : '登录中...'}
          </>)
          : isRegister ? '立即注册' : '立即登录'
          }
          </Button>
        </form>
        <div className="flex flex-col space-y-2">
          <Button variant="ghost" className="w-full" 
          onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
          </Button>
          <Button variant="ghost" className="w-full" 
          onClick={() => navigate("/")}>暂不登录，回首页</Button>
        </div>
      </div>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  )
}