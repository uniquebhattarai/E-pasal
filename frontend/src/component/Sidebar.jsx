import { useState } from "react";
import { 
  VscSettingsGear, 
  VscAccount, 
  VscDashboard, 
  VscVm, 
  VscAdd, 
  VscMortarBoard, 
  VscArchive, 
  VscSignOut
} from "react-icons/vsc";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { setToken } from "../slices/AuthSlice";
import { setUser } from "../slices/ProfileSlice";
import { resetCart } from "../slices/CartSlice";

// Account types
export const ACCOUNT_TYPE = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
};

// Sidebar links
const sidebarLinks = [
  { id: 1, name: "My Profile", path: "/dashboard/my-profile", icon: VscAccount },
  { id: 2, name: "Dashboard", path: "/dashboard/admin", type: ACCOUNT_TYPE.ADMIN, icon: VscDashboard },
  { id: 3, name: "Manage Users", path: "/dashboard/manage-users", type: ACCOUNT_TYPE.ADMIN, icon: VscVm },
  { id: 4, name: "Add Product", path: "/dashboard/add-product", type: ACCOUNT_TYPE.ADMIN, icon: VscAdd },
  { id: 5, name: "My Orders", path: "/dashboard/my-orders", type: ACCOUNT_TYPE.CUSTOMER, icon: VscMortarBoard },
  { id: 6, name: "Cart", path: "/dashboard/cart", type: ACCOUNT_TYPE.CUSTOMER, icon: VscArchive },
];

// Reusable icon button
function IconBtn({ onclick, text, disabled, outline = false, customClasses, type }) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type || "button"}
      className={`px-4 py-2 rounded-md font-semibold transition-colors ${
        outline
          ? "border border-gray-300 bg-transparent text-white hover:bg-gray-200 hover:text-black"
          : "bg-green-600 text-white hover:bg-green-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${customClasses}`}
    >
      {text}
    </button>
  );
}

// Confirmation modal
function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/50 backdrop-blur-sm">
      <div className="w-11/12 max-w-[380px] rounded-lg border border-green-500 bg-white p-6 shadow-xl">
        <p className="text-xl font-bold text-gray-900">{modalData?.text1}</p>
        <p className="mt-2 mb-5 text-gray-600">{modalData?.text2}</p>
        <div className="flex items-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-md bg-gray-200 py-2 px-5 font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={modalData?.btn2Handler}
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
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[240px] flex-col bg-gradient-to-b from-green-600 to-green-700 text-white py-8 shadow-lg">
        
        {/* Sidebar links */}
        <div className="flex flex-col px-4">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium flex items-center gap-x-2 transition-all ${
                    isActive
                      ? "bg-green-800 text-yellow-300 shadow-md"
                      : "text-gray-100 hover:bg-green-500 hover:text-white"
                  }`
                }
              >
                <link.icon className="text-lg" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto my-6 h-[1px] w-10/12 bg-green-500/50" />

        {/* Settings + Logout */}
        <div className="flex flex-col px-4">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium flex items-center gap-x-2 transition-all ${
                isActive
                  ? "bg-green-800 text-yellow-300 shadow-md"
                  : "text-gray-100 hover:bg-green-500 hover:text-white"
              }`
            }
          >
            <VscSettingsGear className="text-lg" />
            <span>Settings</span>
          </NavLink>

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
            className="mt-2 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-x-2 text-gray-100 hover:bg-red-600 transition-colors"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
