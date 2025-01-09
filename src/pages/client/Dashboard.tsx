// src/pages/client/Dashboard.tsx

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch recent providers viewed/contacted
  const { data: recentProviders } = useQuery({
    queryKey: ['recentProviders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  const services = [
    {
      title: 'Find Inspector',
      description: 'Search for qualified tractor inspectors in your area',
      onClick: () => navigate('/app/search?type=inspector')
    },
    {
      title: 'Find Haulier',
      description: 'Connect with reliable haulage services',
      onClick: () => navigate('/app/search?type=haulier')
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <h1 style={{ marginBottom: '20px' }}>Welcome to Service Finder</h1>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '40px' 
      }}>
        {services.map((service) => (
          <div
            key={service.title}
            onClick={service.onClick}
            style={{
              padding: '20px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{service.title}</h3>
            <p style={{ margin: 0, color: '#666' }}>{service.description}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ marginBottom: '15px' }}>Recently Viewed Providers</h2>
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {recentProviders?.length ? (
            recentProviders.map((provider, index) => (
              <div
                key={provider.id}
                style={{
                  padding: '15px',
                  borderBottom: index < recentProviders.length - 1 ? '1px solid #ddd' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, marginBottom: '5px' }}>{provider.name}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    {provider.type === 'inspector' ? 'Tractor Inspector' : 'Haulier'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/app/search?provider=${provider.id}`)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No recently viewed providers
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        marginTop: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, marginBottom: '5px' }}>Available Inspectors</h3>
          <p style={{ margin: 0, fontSize: '24px', color: '#007bff' }}>
            {recentProviders?.filter(p => p.type === 'inspector').length || 0}
          </p>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, marginBottom: '5px' }}>Available Hauliers</h3>
          <p style={{ margin: 0, fontSize: '24px', color: '#007bff' }}>
            {recentProviders?.filter(p => p.type === 'haulier').length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;