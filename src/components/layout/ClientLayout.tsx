// src/components/layout/ClientLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Add your client layout structure here */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;