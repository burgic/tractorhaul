// src/components/layout/AdminLayout.tsx

import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Truck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Inspectors', href: '/admin/inspectors', icon: Users },
    { name: 'Hauliers', href: '/admin/hauliers', icon: Truck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;