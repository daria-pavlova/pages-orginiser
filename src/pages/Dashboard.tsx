import { useState, useMemo } from 'react';
import { ServiceCard } from '../components/ServiceCard';
import { getServicesByGroup, searchServices } from '../utils/serviceUtils';
import type { Service } from '../types';

interface DashboardProps {
  services: Record<string, Service>;
  searchQuery: string;
}

export const Dashboard = ({ services, searchQuery }: DashboardProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filteredServices = useMemo(() => {
    if (searchQuery) {
      return searchServices(services, searchQuery);
    }
    return Object.entries(services).map(([id, service]) => ({ ...service, id }));
  }, [services, searchQuery]);

  const groupedServices = useMemo(() => {
    return getServicesByGroup(
      filteredServices.reduce((acc, service) => {
        acc[service.id] = service;
        return acc;
      }, {} as Record<string, Service>)
    );
  }, [filteredServices]);

  const groups = useMemo(() => {
    return ['all', ...Object.keys(groupedServices).sort()];
  }, [groupedServices]);

  const displayServices = useMemo(() => {
    if (selectedGroup === 'all') {
      return filteredServices;
    }
    return groupedServices[selectedGroup] || [];
  }, [selectedGroup, filteredServices, groupedServices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Group Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedGroup === group
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
            }`}
          >
            {group === 'all' ? 'All Services' : group}
            {group !== 'all' && ` (${groupedServices[group]?.length || 0})`}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {displayServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No services found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Object.keys(services).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Services</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Object.keys(groupedServices).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Groups</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Object.values(services).reduce((sum, s) => sum + Object.keys(s.environments).length, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Environments</div>
        </div>
      </div>
    </div>
  );
};
