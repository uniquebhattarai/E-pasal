import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Calendar,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { getUserOrders } from "../services/orderService";
import { Button } from "../component/common";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Order } from "../types";
import { useAppSelector } from "../hooks/useRedux";

function getStatusBadge(status: string = "Processing") {
  const normalized = status.toLowerCase();
  if (normalized === "delivered") {
    return {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: CheckCircle2,
      label: "Delivered",
    };
  }
  if (normalized === "shipped") {
    return {
      bg: "bg-indigo-50 border-indigo-200 text-indigo-700",
      icon: Truck,
      label: "Shipped",
    };
  }
  if (normalized === "processing") {
    return {
      bg: "bg-blue-50 border-blue-200 text-blue-700",
      icon: Clock,
      label: "Processing",
    };
  }
  if (normalized === "cancelled") {
    return {
      bg: "bg-rose-50 border-rose-200 text-rose-700",
      icon: AlertCircle,
      label: "Cancelled",
    };
  }
  return {
    bg: "bg-amber-50 border-amber-200 text-amber-700",
    icon: Clock,
    label: status || "Pending",
  };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

export default function MyOrders() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getUserOrders();
      if (isMounted) {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-12">
      {/* Mobile Fixed/Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#171717] border-b border-gray-200/90 dark:border-[#2e2e2e] h-14 flex items-center justify-between px-4 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/dashboard/account")}
          className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
          aria-label="Back to Account"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 text-center flex-1 tracking-tight">
          My Orders
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      {/* Main Container */}
      <div className="px-3.5 sm:px-6 md:px-0 py-3 sm:py-5 md:py-0 space-y-4">
        {/* Desktop Header Title */}
        <div className="hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              My Orders
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">
              Review your purchase history and tracking details
            </p>
          </div>
          {orders.length > 0 && (
            <span className="text-xs font-semibold text-gray-600 dark:text-[#cbd5e1] bg-gray-100 dark:bg-[#202020] border border-transparent dark:border-[#2e2e2e] px-3 py-1 rounded-full">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-[#202020] rounded-2xl border border-gray-100 dark:border-[#2e2e2e] p-4 shadow-2xs space-y-3 animate-pulse"
              >
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-[#2e2e2e]">
                  <div className="h-4 bg-gray-200 dark:bg-[#282828] rounded w-32" />
                  <div className="h-5 bg-gray-200 dark:bg-[#282828] rounded-full w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-200 dark:bg-[#282828] rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-[#282828] rounded w-2/3" />
                    <div className="h-3 bg-gray-200 dark:bg-[#282828] rounded w-1/3" />
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-[#2e2e2e]">
                  <div className="h-4 bg-gray-200 dark:bg-[#282828] rounded w-20" />
                  <div className="h-4 bg-gray-200 dark:bg-[#282828] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 bg-white dark:bg-[#202020] rounded-2xl border border-gray-100 dark:border-[#2e2e2e] shadow-2xs">
            <div className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center -my-2 shrink-0">
              <DotLottieReact
                src="/no-data.lottie"
                loop
                autoplay
              />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              No orders found
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#94a3b8] mb-5 max-w-sm">
              You haven't placed any orders yet. Discover our quality products and enjoy seamless shopping!
            </p>
            <Link to="/">
              <Button variant="primary" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-3.5">
            {orders.map((order: any) => {
              const statusInfo = getStatusBadge(order.orderStatus || order.status);
              const StatusIcon = statusInfo.icon;
              const orderProducts = order.products || order.orderItems || [];

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-[#202020] rounded-2xl border border-gray-100 dark:border-[#2e2e2e] shadow-2xs hover:shadow-xs transition p-4 sm:p-5"
                >
                  {/* Order Top Bar: Order ID, Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-gray-100 dark:border-[#2e2e2e]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#282828] text-primary flex items-center justify-center font-bold">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-[#94a3b8] mt-0.5">
                          <Calendar size={12} className="text-gray-400 dark:text-[#64748b]" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg}`}
                    >
                      <StatusIcon size={12} strokeWidth={2.5} />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Order Products List */}
                  <div className="divide-y divide-gray-50 dark:divide-[#2e2e2e] py-2">
                    {orderProducts.map((item: any, idx: number) => {
                      const prod = item.product || {};
                      const categoryName = prod.category?.name || prod.category;

                      return (
                        <div
                          key={item._id || idx}
                          className="flex items-center justify-between py-3 gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name || "Product"}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#2e2e2e] p-1 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 dark:bg-[#282828] text-gray-500 flex items-center justify-center font-bold text-sm shrink-0">
                                <ShoppingBag size={18} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {prod.name || "Product Item"}
                              </h4>
                              {categoryName && (
                                <span className="inline-block text-[10px] font-medium text-gray-500 dark:text-[#94a3b8] bg-gray-100 dark:bg-[#282828] px-1.5 py-0.5 rounded mt-0.5">
                                  {categoryName}
                                </span>
                              )}
                              <p className="text-[11px] text-gray-500 dark:text-[#94a3b8] mt-0.5">
                                Qty: {item.quantity || 1}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              Rs {(prod.price || 0) * (item.quantity || 1)}
                            </span>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-gray-400 dark:text-[#94a3b8]">
                                Rs {prod.price} each
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer: Payment Method & Total */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-[#2e2e2e]">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#94a3b8]">
                      <CreditCard size={14} className="text-gray-400 dark:text-[#64748b]" />
                      <span>
                        Paid with{" "}
                        <strong className="text-gray-700 dark:text-gray-200 font-semibold">
                          {order.paymentMethod || order.paymentDetails?.paymentMethod || "eSewa"}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-[#94a3b8]">Total:</span>
                      <span className="text-sm sm:text-base font-bold text-primary dark:text-white">
                        Rs {order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
