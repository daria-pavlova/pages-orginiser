# Developer Portal (Originiser)

An internal developer portal built with React, TypeScript, and TailwindCSS, designed to provide a unified view of your services, ArgoCD applications, and infrastructure dependencies.

## 🚀 Features

- **Service Dashboard**: Browse and search all services organized by teams/domains
- **Multi-Environment Support**: View deployments across dev, staging, and production
- **ArgoCD Integration**: Direct links to ArgoCD applications with health and sync status
- **Dependency Graph**: Interactive visualization of service dependencies
- **Architecture View**: System-wide dependency mapping with filtering capabilities
- **Dark Mode**: Automatic dark/light theme support
- **Mobile Responsive**: Works seamlessly on all device sizes
- **GitHub Pages Ready**: Fully static site deployable to GitHub Pages

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/originiser.git
cd originiser
```

2. Install dependencies:
```bash
npm install
```

3. Update configuration:
   - Edit `src/data/services.yaml` with your services
   - Update `vite.config.ts` base path to match your repository name

4. Run development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the portal.

## 📁 Project Structure

```
originiser/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Search and theme toggle
│   │   ├── Navigation.tsx      # Page navigation
│   │   ├── ServiceCard.tsx     # Service display card
│   │   └── DependencyGraph.tsx # React Flow graph
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main dashboard view
│   │   └── Architecture.tsx    # Dependency graph view
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   └── serviceUtils.ts     # Helper functions
│   ├── hooks/
│   │   └── useTheme.ts         # Theme management
│   ├── data/
│   │   └── services.yaml       # Service configuration
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # TailwindCSS config
└── package.json
```

## 📝 Configuration

### Adding a New Service

Edit `src/data/services.yaml`:

```yaml
services:
  my-service:
    name: My Service
    description: Description of the service
    group: Applications
    tags:
      - api
      - backend
    repos:
      - name: my-service
        url: https://github.com/company/my-service
    docs:
      - name: Documentation
        url: https://docs.company.com/my-service
    environments:
      dev:
        argocd: https://argocd.company.com/applications/my-service-dev
        cluster: dev-eks
        namespace: my-service
        health: healthy
        sync: synced
      prod:
        argocd: https://argocd.company.com/applications/my-service-prod
        cluster: prod-eks
        namespace: my-service
        health: healthy
        sync: synced
    dependsOn:
      - postgres
      - redis
```

### Service Schema

- `name`: Display name of the service
- `description`: Brief description
- `group`: Category (Applications, Infrastructure, Platform, etc.)
- `tags`: Array of searchable tags
- `repos`: Array of repository objects with `name` and `url`
- `docs`: Array of documentation links
- `environments`: Object with environment names as keys
  - `argocd`: ArgoCD application URL
  - `cluster`: Kubernetes cluster name
  - `namespace`: Kubernetes namespace
  - `health`: `healthy` | `degraded` | `progressing` | `unknown`
  - `sync`: `synced` | `out-of-sync` | `unknown`
- `dependsOn`: Array of service IDs this service depends on

## 🚢 Deployment

### GitHub Pages (Automated)

1. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. Push to main branch:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

The GitHub Action will automatically build and deploy.

### Manual Deployment

Build the project:
```bash
npm run build
```

The `dist/` folder contains the static site ready for deployment.

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
},
```

### Logo and Title

Update in `src/components/Header.tsx`:

```tsx
<Header
  title="Your Company Portal"
  subtitle="Custom subtitle"
/>
```

## 🔧 Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Flow** - Dependency graph visualization
- **React Router** - Client-side routing
- **js-yaml** - YAML parsing
- **Lucide React** - Icons

## 🗺️ Roadmap

### MVP (Current)
- ✅ Service dashboard with cards
- ✅ Search and filtering
- ✅ Multi-environment support
- ✅ Basic dependency graph
- ✅ Dark mode
- ✅ GitHub Pages deployment

### Future Enhancements
- [ ] ArgoCD API integration for live status
- [ ] GitHub API integration for repository metadata
- [ ] Service health history and trends
- [ ] Automated service discovery
- [ ] Team-based access control
- [ ] Custom dashboards per team
- [ ] Incident timeline integration
- [ ] Cost tracking per service
- [ ] SLA monitoring
- [ ] Advanced graph layouts (hierarchical, force-directed)

## 📖 Usage Tips

### Search
- Search by service name, description, or tags
- Use tags for quick filtering (e.g., "api", "database")

### Dashboard
- Click group buttons to filter services
- Expand "ArgoCD" section on cards to see all environments
- View health indicators (colored dots) for quick status

### Architecture View
- Click nodes to highlight dependencies
- Use group filters to focus on specific teams
- Pan and zoom the graph for better visibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your internal developer portal!

## 🙋 Support

For questions or issues, please create an issue in the GitHub repository.

---

Built with ❤️ for DevOps and Platform Engineering teams


```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# pages-orginiser
