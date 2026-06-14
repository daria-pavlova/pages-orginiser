# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 3: Customize Your Services

Edit `src/data/services.yaml` to add your services:

```yaml
services:
  my-api:
    name: My API Service
    description: My awesome microservice
    group: Applications
    tags:
      - api
      - backend
    repos:
      - name: my-api
        url: https://github.com/myorg/my-api
    environments:
      dev:
        argocd: https://argocd.example.com/applications/my-api-dev
        cluster: dev-eks
        namespace: my-api
        health: healthy
        sync: synced
      prod:
        argocd: https://argocd.example.com/applications/my-api-prod
        cluster: prod-eks
        namespace: my-api
        health: healthy
        sync: synced
    dependsOn:
      - postgres
```

### Step 4: Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📦 Deployment to GitHub Pages

### Option 1: Automatic (Recommended)

1. **Update `vite.config.ts`**:
   ```js
   base: '/your-repo-name/',  // Change to your repository name
   ```

2. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on every push to `main`

### Option 2: Manual

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to any static hosting service

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    600: "#your-color",
    // ... other shades
  },
}
```

### Change Portal Title

Edit `src/components/Header.tsx` or `src/App.tsx`:

```tsx
<Header
  title="My Developer Portal"
  subtitle="Your custom subtitle"
/>
```

### Add Custom Groups

Services are automatically grouped by the `group` field in YAML. Common groups:
- Applications
- Infrastructure  
- Platform
- Monitoring
- Security
- Documentation

## 🔧 Common Tasks

### Add a New Service

1. Open `src/data/services.yaml`
2. Add a new service under `services:`
3. Save and refresh the browser

### Add a New Environment

Add to the `environments` section:

```yaml
environments:
  staging:
    argocd: https://argocd.example.com/app
    cluster: staging-eks
    namespace: my-service
    health: healthy
    sync: synced
```

### Define Service Dependencies

Use the `dependsOn` array:

```yaml
dependsOn:
  - postgres
  - redis
  - kafka
```

These will be visualized in the Architecture view.

## 📊 Features Overview

### Dashboard View (`/`)
- Grid of service cards
- Search bar (searches name, description, tags)
- Filter by group
- Expandable environment details
- Statistics summary

### Architecture View (`/architecture`)
- Interactive dependency graph
- Click nodes to highlight dependencies
- Filter by group
- Search services
- Pan and zoom

## 🐛 Troubleshooting

### Build Errors

If you get TypeScript or build errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### YAML Parsing Errors

Check that your `services.yaml` has:
- Correct indentation (2 spaces)
- All required fields
- Valid YAML syntax

Use a YAML validator: https://www.yamllint.com/

### Dependency Graph Not Showing

Ensure:
- Services referenced in `dependsOn` exist in the YAML
- Service IDs match exactly (case-sensitive)
- At least one dependency exists

## 📝 YAML Schema Reference

### Required Fields
```yaml
services:
  service-id:               # Unique ID (kebab-case recommended)
    name: string           # Display name
    description: string    # Short description
    group: string          # Team/domain name
    repos:                 # Array of repositories
      - name: string
        url: string
    environments:          # Object with env names as keys
      env-name:
        argocd: string     # ArgoCD URL
```

### Optional Fields
```yaml
    tags: [string]                    # Search tags
    docs:                              # Documentation links
      - name: string
        url: string
    dependsOn: [service-id]           # Dependencies
    environments:
      env-name:
        cluster: string                # Kubernetes cluster
        namespace: string              # Kubernetes namespace
        health: healthy|degraded|progressing|unknown
        sync: synced|out-of-sync|unknown
```

## 🎯 Best Practices

1. **Service IDs**: Use kebab-case (e.g., `customer-api`, not `Customer API`)
2. **Groups**: Keep group names consistent (capitalize first letter)
3. **Tags**: Use lowercase tags for better search
4. **Descriptions**: Keep under 100 characters for better display
5. **Dependencies**: Only list direct dependencies, not transitive ones

## 🔄 Updates

To update the portal:

```bash
git pull origin main
npm install
npm run build
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Flow](https://reactflow.dev/)
- [Vite](https://vite.dev/)

## 🆘 Getting Help

If you encounter issues:

1. Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
2. Review the example services in `src/data/services.yaml`
3. Check browser console for errors
4. Verify YAML syntax

---

Happy portal building! 🎉
