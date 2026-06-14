// Core data types for the developer portal
export interface Environment {
  argocd: string;
  cluster?: string;
  namespace?: string;
  health?: 'healthy' | 'degraded' | 'progressing' | 'unknown';
  sync?: 'synced' | 'out-of-sync' | 'unknown';
}

export interface Repository {
  name: string;
  url: string;
  branch?: string;
  lastCommit?: string;
  lastRelease?: string;
}

export interface Documentation {
  name: string;
  url: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  group: string;
  repos: Repository[];
  docs?: Documentation[];
  environments: Record<string, Environment>;
  dependsOn?: string[];
  icon?: string;
  tags?: string[];
}

export interface ServiceGroup {
  name: string;
  icon?: string;
  services: Service[];
}

export interface DashboardConfig {
  title: string;
  subtitle?: string;
  logo?: string;
  groups: ServiceGroup[];
  services: Record<string, Service>;
}
