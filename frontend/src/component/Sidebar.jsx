import { useState } from "react";
import { 
  Settings, 
  User, 
  LayoutDashboard, 
  Users, 
  Plus, 
  ShoppingBag, 
  ShoppingCart, 
  LogOut,
  CheckCircle,
  X
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setToken } from "../slices/AuthSlice";
import { setUser } from "../slices/ProfileSlice";
import { resetCart } from "../slices/CartSlice";
import { toast } from "react-hot-toast";


// Account types
export const ACCOUNT_TYPE = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
};

// Sidebar links
const sidebarLinks = [
  { id: 1, name: "My Profile", path: "/dashboard/my-profile", icon: User },
  { id: 2, name: "Dashboard", path: "/dashboard/admin", type: ACCOUNT_TYPE.ADMIN, icon: LayoutDashboard },
  { id: 3, name: "Manage Users", path: "/dashboard/manage-users", type: ACCOUNT_TYPE.ADMIN, icon: Users },
  { id: 4, name: "Add Product", path: "/dashboard/add-product", type: ACCOUNT_TYPE.ADMIN, icon: Plus },
  { id: 5, name: "My Orders", path: "/dashboard/my-orders", type: ACCOUNT_TYPE.CUSTOMER, icon: ShoppingBag },
  { id: 6, name: "Cart", path: "/dashboard/cart", type: ACCOUNT_TYPE.CUSTOMER, icon: ShoppingCart },
];


// Confirmation modal
function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-11/12 max-w-md rounded-2xl bg-white p-6 shadow-2xl transform animate-scaleIn">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{modalData?.text1}</h3>
            <p className="text-gray-600 text-sm">{modalData?.text2}</p>
          </div>

          <button
            onClick={modalData?.btn2Handler}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={modalData?.btn1Handler}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {modalData?.btn1Text}
          </button>
          <button
            onClick={modalData?.btn2Handler}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}


// Sidebar component
export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);

  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleLogout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
    setConfirmationModal(null);
  };

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] min-w-[280px] flex-col bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Dashboard</h2>
              <p className="text-green-100 text-xs">{user?.accountType} Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">

            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-green-700 shadow-lg"
                        : "text-white hover:bg-white/10 hover:translate-x-1"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-green-100"
                            : "bg-white/10 group-hover:bg-white/20"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-green-700" : "text-white"
                          }`}
                        />
                      </div>

                      <span className="font-semibold">{link.name}</span>

                      {isActive && (
                        <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Settings */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-green-700 shadow-lg"
                  : "text-white hover:bg-white/10 hover:translate-x-1"
              }`
            }
          >
            <div
              className={`p-2 rounded-lg transition-colors ${
                window.location.pathname === "/dashboard/settings"
                  ? "bg-green-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Settings</span>
          </NavLink>

          {/* Logout */}
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: handleLogout,
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-red-500/20 transition-all duration-200 hover:translate-x-1 mt-2"
          >
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-red-500/30 transition-colors">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
