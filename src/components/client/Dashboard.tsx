// src/pages/client/Dashboard.tsx
import React, { useState } from 'react';
import { ServiceSearch } from '@/components/client/ServiceSearch';
import { ServiceType } from '@/types/database';
import { Truck, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ClientDashboard = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const services = [
    {
      type: 'inspector' as ServiceType,
      title: 'Find Tractor Inspector',
      description: 'Locate qualified inspectors for your machinery',
      icon: Wrench
    },
    {
      type: 'haulier' as ServiceType,
      title: 'Find Haulier',
      description: 'Connect with reliable transportation services',
      icon: Truck
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {!selectedService ? (
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Welcome to Service Finder</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.type}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedService(service.type)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">{service.title}</h2>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {selectedService === 'inspector' ? 'Find Tractor Inspector' : 'Find Haulier'}
            </h1>
            <Button
              variant="outline"
              onClick={() => setSelectedService(null)}
            >
              Back to Services
            </Button>
          </div>

          <ServiceSearch type={selectedService} />
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;