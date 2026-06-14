import { useState, useMemo } from 'react';
import { DependencyGraph } from '../components/DependencyGraph';
import type { Service } from '../types';
import { getServicesByGroup } from '../utils/serviceUtils';
import { X } from 'lucide-react';

interface ArchitectureProps {
  services: Record<string, Service>;
  searchQuery: string;
}

export const Architecture = ({ services, searchQuery }: ArchitectureProps) => {
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [filterGroup, setFilterGroup] = useState<string>('all');

  const groupedServices = useMemo(() => {
    return getServicesByGroup(services);
  }, [services]);

  const groups = useMemo(() => {
    return ['all', ...Object.keys(groupedServices).sort()];
  }, [groupedServices]);

  const filteredServices = useMemo(() => {
    let filtered = { ...services };

    // Filter by group
    if (filterGroup !== 'all') {
      filtered = Object.entries(filtered)
        .filter(([_, service]) => service.group === filterGroup)
        .reduce((acc, [id, service]) => {
          acc[id] = service;
          return acc;
        }, {} as Record<string, Service>);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = Object.entries(filtered)
        .filter(([id, service]) =>
          service.name.toLowerCase().includes(lowerQuery) ||
          id.toLowerCase().includes(lowerQuery) ||
          service.description.toLowerCase().includes(lowerQuery)
        )
        .reduce((acc, [id, service]) => {
          acc[id] = service;
          return acc;
        }, {} as Record<string, Service>);
    }

    return filtered;
  }, [services, filterGroup, searchQuery]);

  const selectedServiceData = selectedService ? services[selectedService] : undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Group:
            </span>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFilterGroup(group)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filterGroup === group
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {group === 'all' ? 'All' : group}
                </button>
              ))}
            </div>
          </div>

          {selectedServiceData && (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {selectedServiceData.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedServiceData.description}
                  </p>
                  {selectedServiceData.dependsOn && selectedServiceData.dependsOn.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Dependencies:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedServiceData.dependsOn.map((depId) => (
                          <span
                            key={depId}
                            className="px-2 py-1 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                          >
                            {services[depId]?.name || depId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedService(undefined)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        {Object.keys(filteredServices).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">
              No services found matching your criteria.
            </p>
          </div>
        ) : (
          <DependencyGraph
            services={filteredServices}
            selectedService={selectedService}
            onServiceClick={setSelectedService}
          />
        )}
      </div>
    </div>
  );
};
