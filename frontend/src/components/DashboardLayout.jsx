import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ padding: 'var(--space-8)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
