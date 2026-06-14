import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Architecture } from './pages/Architecture';
import { loadServices } from './utils/serviceUtils';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const services = useMemo(() => loadServices(), []);

  return (
    <BrowserRouter basename="/pages-orginiser">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          title="Developer Portal"
          subtitle="Your central hub for services, deployments, and architecture"
        />
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={<Dashboard services={services} searchQuery={searchQuery} />}
          />
          <Route
            path="/architecture"
            element={<Architecture services={services} searchQuery={searchQuery} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
