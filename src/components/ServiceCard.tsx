import { useState } from 'react';
import type { Service } from '../types';
import { FileText, ExternalLink, ChevronDown, ChevronUp, Server, Globe } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const envCount = Object.keys(service.environments).length;
  const primaryRepo = service.repos[0];

  const getHealthColor = (health?: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'progressing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getSyncColor = (sync?: string) => {
    switch (sync) {
      case 'synced':
        return 'bg-green-500';
      case 'out-of-sync':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {service.description}
          </p>
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="space-y-2">
          {/* Repository */}
          {primaryRepo && (
            <a
              href={primaryRepo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Repository</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          )}

          {/* Documentation */}
          {service.docs && service.docs.length > 0 && (
            <a
              href={service.docs[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Documentation</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          )}

          {/* ArgoCD - Expandable */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Server className="w-4 h-4" />
            <span>ArgoCD ({envCount} {envCount === 1 ? 'Environment' : 'Environments'})</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
        </div>

        {/* Expanded Environments */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {Object.entries(service.environments).map(([envName, env]) => (
              <div
                key={envName}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm capitalize">{envName}</span>
                  <div className="flex gap-2">
                    {env.health && (
                      <div
                        className={`w-2 h-2 rounded-full ${getHealthColor(env.health)}`}
                        title={`Health: ${env.health}`}
                      />
                    )}
                    {env.sync && (
                      <div
                        className={`w-2 h-2 rounded-full ${getSyncColor(env.sync)}`}
                        title={`Sync: ${env.sync}`}
                      />
                    )}
                  </div>
                </div>
                {env.cluster && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Cluster: {env.cluster}
                  </p>
                )}
                {env.namespace && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Namespace: {env.namespace}
                  </p>
                )}
                <a
                  href={env.argocd}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Open in ArgoCD
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Dependencies indicator */}
        {service.dependsOn && service.dependsOn.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Depends on: {service.dependsOn.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
