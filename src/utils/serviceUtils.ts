import type { Service } from '../types';
import servicesYaml from '../data/services.yaml?raw';
import * as yaml from 'js-yaml';

export const loadServices = (): Record<string, Service> => {
  try {
    const data = yaml.load(servicesYaml) as { services: Record<string, Service> };
    return data.services || {};
  } catch (error) {
    console.error('Error loading services:', error);
    return {};
  }
};

export const getServicesByGroup = (services: Record<string, Service>) => {
  const grouped: Record<string, Service[]> = {};
  
  Object.entries(services).forEach(([id, service]) => {
    const group = service.group || 'Other';
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push({ ...service, id });
  });
  
  return grouped;
};

export const searchServices = (services: Record<string, Service>, query: string): Service[] => {
  const lowerQuery = query.toLowerCase();
  return Object.entries(services)
    .filter(([id, service]) => {
      return (
        service.name.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery) ||
        id.toLowerCase().includes(lowerQuery) ||
        service.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    })
    .map(([id, service]) => ({ ...service, id }));
};

export const getDependencyTree = (
  serviceId: string,
  services: Record<string, Service>,
  visited = new Set<string>()
): string[] => {
  if (visited.has(serviceId)) return [];
  visited.add(serviceId);
  
  const service = services[serviceId];
  if (!service || !service.dependsOn) return [serviceId];
  
  const deps = [serviceId];
  service.dependsOn.forEach(depId => {
    deps.push(...getDependencyTree(depId, services, visited));
  });
  
  return deps;
};

export const getReverseDependencies = (
  serviceId: string,
  services: Record<string, Service>
): string[] => {
  return Object.entries(services)
    .filter(([_, service]) => service.dependsOn?.includes(serviceId))
    .map(([id]) => id);
};
