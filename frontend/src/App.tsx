import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ZonesPage from './pages/ZonesPage';
import ZoneDetailPage from './pages/ZoneDetailPage';
import AssignPage from './pages/AssignPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ZonesPage />} />
        <Route path="/zones/:id" element={<ZoneDetailPage />} />
        <Route path="/assign" element={<AssignPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
