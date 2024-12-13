// src/pages/admin/Dashboard.tsx

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabaseClient';
// import { Provider } from '../../types';
import { Users, Truck, Star, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalInspectors: number;
  totalHauliers: number;
  averageRating: number;
  pendingReviews: number;
}

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const [inspectors, hauliers, reviews] = await Promise.all([
        supabase
          .from('providers')
          .select('id')
          .eq('type', 'inspector')
          .eq('active', true),
        supabase
          .from('providers')
          .select('id')
          .eq('type', 'haulier')
          .eq('active', true),
        supabase
          .from('reviews')
          .select('rating')
      ]);

      const avgRating = reviews.data?.reduce((acc, curr) => acc + curr.rating, 0) || 0;

      return {
        totalInspectors: inspectors.data?.length || 0,
        totalHauliers: hauliers.data?.length || 0,
        averageRating: avgRating / (reviews.data?.length || 1),
        pendingReviews: 0 // Implement pending reviews logic as needed
      };
    }
  });

  const statCards = [
    {
      name: 'Total Inspectors',
      value: stats?.totalInspectors || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Hauliers',
      value: stats?.totalHauliers || 0,
      icon: Truck,
      color: 'bg-green-500'
    },
    {
      name: 'Average Rating',
      value: stats?.averageRating.toFixed(1) || '0.0',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      name: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden bg-white rounded-lg shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`w-8 h-8 ${stat.color} p-1.5 rounded-full text-white`} />
                  </div>
                  <div className="flex-1 ml-4">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
};

export default AdminDashboard;