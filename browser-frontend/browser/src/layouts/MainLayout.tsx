import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
export default function MainLayout(){
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Outlet />
            <BottomNav />
        </div>
    )
}