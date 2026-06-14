# Architecture Documentation

## Overview

The Developer Portal (Originiser) is a static web application designed to serve as a centralized hub for viewing and managing services, ArgoCD applications, and infrastructure dependencies across multiple environments.

## Design Principles

1. **Static First**: No backend required - all data comes from YAML configuration
2. **GitHub Pages Compatible**: Fully deployable to GitHub Pages
3. **Type Safe**: Comprehensive TypeScript coverage
4. **Component-Based**: Modular React components for maintainability
5. **Responsive**: Mobile-first design that works on all devices
6. **Performant**: Lazy loading and efficient rendering

## Architecture Layers

### 1. Data Layer

**Location**: `src/data/services.yaml`

The single source of truth for all service configurations. Structured as a YAML file for:
- Easy human editing
- Version control friendly
- No database overhead
- Simple validation

**Data Model**:
```typescript
Service {
  id: string
  name: string
  description: string
  group: string (team/domain)
  tags: string[]
  repos: Repository[]
  docs: Documentation[]
  environments: Map<string, Environment>
  dependsOn: string[] (service IDs)
}
```

### 2. Business Logic Layer

**Location**: `src/utils/`, `src/hooks/`

**Key Utilities**:
- `serviceUtils.ts`: Service data processing, search, grouping, dependency resolution
- `useTheme.ts`: Dark/light mode management with localStorage persistence

**Core Functions**:
- `loadServices()`: YAML parsing and validation
- `getServicesByGroup()`: Organize services by team/domain
- `searchServices()`: Full-text search across services
- `getDependencyTree()`: Recursive dependency resolution
- `getReverseDependencies()`: Find consumers of a service

### 3. Presentation Layer

**Location**: `src/components/`, `src/pages/`

#### Components

1. **Header** (`Header.tsx`)
   - Global search bar
   - Theme toggle
   - Portal branding

2. **Navigation** (`Navigation.tsx`)
   - Tab-based navigation between Dashboard and Architecture
   - Active state indication

3. **ServiceCard** (`ServiceCard.tsx`)
   - Service information display
   - Repository links
   - Documentation links
   - Expandable environment list
   - Health/sync status indicators
   - Dependency hints

4. **DependencyGraph** (`DependencyGraph.tsx`)
   - React Flow-based interactive graph
   - Node highlighting on selection
   - Animated edges for selected paths
   - Pan, zoom, and fit controls

#### Pages

1. **Dashboard** (`pages/Dashboard.tsx`)
   - Grid layout of service cards
   - Group-based filtering
   - Search integration
   - Statistics overview

2. **Architecture** (`pages/Architecture.tsx`)
   - Full-screen dependency graph
   - Service selection panel
   - Group and search filters
   - Dependency path visualization

### 4. Routing Layer

**Location**: `src/App.tsx`

Uses React Router for client-side navigation:
- `/` - Dashboard view
- `/architecture` - Dependency graph view

## Data Flow

```
YAML File → js-yaml Parser → TypeScript Types → React State → UI Components
                                                    ↓
                                            Search/Filter Logic
                                                    ↓
                                            Rendered Output
```

### Load Sequence

1. Application starts (`main.tsx`)
2. `App.tsx` mounts
3. `loadServices()` executes
   - Reads `services.yaml` as raw text
   - Parses with `js-yaml`
   - Validates against TypeScript types
4. Services object stored in component state
5. Passed as props to Dashboard/Architecture pages
6. Components render based on data

## Dependency Graph Algorithm

The dependency graph uses a force-directed layout with manual positioning as a fallback.

**Node Generation**:
```typescript
services → nodes (grid layout)
dependencies → edges (directional arrows)
```

**Highlighting Logic**:
- Selected node: Blue background
- Connected nodes: Light blue background
- Related edges: Animated

**Layout Strategy**:
- Grid-based positioning (N columns, row-major order)
- 250px spacing between nodes
- React Flow handles drag/zoom interactions

## Styling Architecture

**TailwindCSS Utility-First Approach**:
- Consistent spacing scale (4px base)
- Design tokens in `tailwind.config.js`
- Dark mode via class-based toggle
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)

**Component Patterns**:
- `.card`: Reusable card container with hover effects
- `.btn`: Standard button styles
- `.btn-primary`: Primary action button

## Theme Management

**Strategy**: System preference detection with user override

1. Check localStorage for saved preference
2. If none, detect system preference via `prefers-color-scheme`
3. Apply `dark` class to document root
4. Persist changes to localStorage

**Toggle Flow**:
```
User clicks toggle → Update state → Update DOM class → Save to localStorage
```

## Build & Deployment

### Development
```bash
npm run dev  # Vite dev server on :5173
```

### Production Build
```bash
npm run build
```

**Build Output**:
- `dist/` directory with optimized assets
- Code splitting for lazy loading
- Minified JS/CSS
- Asset hashing for cache busting

### GitHub Pages Deployment

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
1. Trigger on push to `main`
2. Install Node.js and dependencies
3. Run production build
4. Upload build artifacts
5. Deploy to GitHub Pages

**Configuration**:
- Base path in `vite.config.ts` must match repository name
- GitHub Pages enabled in repository settings
- Workflow has `pages: write` permission

## Scalability Considerations

### Current Limits
- **Services**: Tested up to 100 services without performance issues
- **Dependencies**: Graph remains performant with ~500 edges
- **Search**: Client-side search efficient for <1000 services

### Optimization Strategies

1. **For 100-500 Services**:
   - Current architecture sufficient
   - Consider adding virtual scrolling for service list

2. **For 500-1000 Services**:
   - Implement search index (e.g., Fuse.js)
   - Add pagination to dashboard
   - Use React.memo for service cards

3. **For 1000+ Services**:
   - Consider server-side rendering or API backend
   - Implement data virtualization
   - Add multi-level grouping/filtering

## Security Considerations

1. **No Sensitive Data**: All data is public (GitHub Pages is public)
2. **YAML Validation**: Parse errors don't crash application
3. **XSS Protection**: React auto-escapes strings
4. **External Links**: All use `rel="noopener noreferrer"`

## Extension Points

### Adding API Integration

**For ArgoCD Live Status**:

```typescript
// src/utils/argoCdApi.ts
export async function fetchArgoCDStatus(appUrl: string) {
  const response = await fetch(`${ARGOCD_API}/applications/${app}`);
  return response.json();
}

// Update ServiceCard to fetch on mount
useEffect(() => {
  if (service.environments.prod.argocd) {
    fetchArgoCDStatus(service.environments.prod.argocd)
      .then(setLiveStatus);
  }
}, [service]);
```

**Challenges**:
- CORS (need ArgoCD CORS configuration or proxy)
- Authentication (API tokens)
- Rate limiting

**Recommendation**: Use a serverless function (AWS Lambda, Vercel, Cloudflare Workers) as a proxy.

### Adding GitHub API Integration

```typescript
// src/utils/githubApi.ts
export async function fetchRepoMetadata(repoUrl: string) {
  const [owner, repo] = parseGitHubUrl(repoUrl);
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`
  );
  return response.json();
}
```

**Rate Limits**: 60 requests/hour (unauthenticated), 5000/hour (authenticated)

**Solution**: Cache in localStorage or build-time generation.

## Testing Strategy

### Unit Tests (Future)
- Service utility functions
- Dependency graph algorithms
- Search/filter logic

### Integration Tests (Future)
- YAML parsing
- Component rendering
- Navigation flow

### E2E Tests (Future)
- Full user workflows
- Search and filter
- Graph interactions

## Monitoring & Observability

**Client-Side Tracking** (Future):
- Page views (Google Analytics, Plausible)
- Search queries (identify popular services)
- Error tracking (Sentry)
- Performance metrics (Web Vitals)

## Future Architecture Enhancements

1. **Multi-Tenancy**: Support multiple organizations/teams
2. **Backend API**: For dynamic data and authentication
3. **Real-Time Updates**: WebSocket for live ArgoCD status
4. **Advanced Search**: Fuzzy search, filters, saved queries
5. **Custom Views**: User-defined dashboards
6. **Notifications**: Alerts for deployment changes
7. **Analytics**: Service usage metrics and trends

## Technology Decisions

### Why React?
- Component reusability
- Large ecosystem
- TypeScript support
- GitHub Pages compatibility

### Why Vite?
- Fast dev server
- Optimized production builds
- Native ESM support
- Great DX

### Why TailwindCSS?
- Utility-first for rapid development
- Small bundle size (unused styles purged)
- Consistent design system
- Dark mode support

### Why React Flow?
- Mature graph visualization library
- Built-in controls and interactions
- Customizable styling
- TypeScript support

### Why YAML?
- Human-readable
- Version control friendly
- Comments support
- Widely adopted in DevOps

## Conclusion

This architecture prioritizes simplicity, maintainability, and developer experience while remaining flexible enough to scale and integrate with external systems as needs evolve.
