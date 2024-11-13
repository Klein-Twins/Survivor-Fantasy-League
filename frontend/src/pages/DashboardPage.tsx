import { Outlet } from "react-router-dom";

const DashboardPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <Outlet />
    </div>
  );
}

export default DashboardPage;
