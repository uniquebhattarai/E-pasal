import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../component/Sidebar";

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const authLoading = useSelector((state) => state.auth.loading);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      navigate("/dashboard/account", { replace: true });
    }
  }, [location.pathname, navigate]);

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:min-h-[calc(100vh-3.5rem)] bg-[#F8F9FA] pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 md:py-6 lg:py-8">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          <Sidebar />

          <main className="flex-1 min-w-0 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
