import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, ArrowRight, Clock, CheckCircle, Truck, XCircle, ChevronDown } from "lucide-react"
import Navbar from '../components/Navbar'
import BASE_URL from "../api"
import { toast } from "react-hot-toast"

const getStatusIcon = (status) => {
  switch(status.toLowerCase()) {
    case "pending": return <Clock size={18} className="text-brand-text-secondary" />
    case "processing": return <Package size={18} className="text-brand-primary" />
    case "shipped": return <Truck size={18} className="text-brand-primary" />
    case "delivered": return <CheckCircle size={18} className="text-brand-success" />
    case "cancelled": return <XCircle size={18} className="text-brand-error" />
    default: return <Clock size={18} className="text-brand-text-secondary" />
  }
}

const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case "pending": return "bg-gray-100 text-gray-700 border-gray-200"
    case "processing": return "bg-indigo-50 text-brand-primary border-indigo-200"
    case "shipped": return "bg-sky-50 text-sky-700 border-sky-200"
    case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "cancelled": return "bg-red-50 text-red-700 border-red-200"
    default: return "bg-brand-background text-gray-600 border-brand-border"
  }
}

function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-brand-surface rounded-[24px] shadow-premium border border-brand-border overflow-hidden mb-6 transition-all duration-300 hover:shadow-premium-hover group">
      {/* Header - Clickable */}
      <div 
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className="bg-brand-background px-4 sm:px-6 py-5 flex flex-wrap gap-4 items-center justify-between cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Order Date</p>
            <p className="font-semibold text-brand-text-primary text-xs sm:text-sm">
              {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Total Amount</p>
            <p className="font-black text-brand-primary text-sm sm:text-base">₹{order.totalPrice}</p>
          </div>
          <div className="hidden md:block">
            <p className="text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Order ID</p>
            <p className="font-semibold text-brand-text-primary text-sm font-mono">{order._id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-none shadow-premium text-xs sm:text-sm font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {order.status}
          </div>
          <div className={`text-brand-text-secondary transition-all duration-300 ease-in-out
            ${isExpanded 
              ? 'rotate-180 opacity-100 translate-x-0' 
              : 'rotate-0 opacity-100 md:opacity-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
            }
          `}>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden border-t border-brand-background">
          {/* Timeline */}
          <div className="px-6 py-10 border-b border-brand-background">
            {order.status.toLowerCase() !== "cancelled" ? (
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-brand-background -z-10 -translate-y-1/2 rounded-full"></div>
                <div className="flex items-center justify-between">
                  {["Placed", "Processing", "Shipped", "Delivered"].map((step, i) => {
                    const status = order.status.toLowerCase();
                    let isCompleted = false;
                    let isCurrent = false;

                    if (status === "pending") {
                      if (i === 0) isCompleted = true;
                      if (i === 1) isCurrent = true;
                    } else if (status === "processing") {
                      if (i <= 1) isCompleted = true;
                      if (i === 2) isCurrent = true;
                    } else if (status === "shipped") {
                      if (i <= 2) isCompleted = true;
                      if (i === 3) isCurrent = true;
                    } else if (status === "delivered") {
                      if (i <= 3) isCompleted = true;
                    }

                    return (
                      <div key={step} className="flex flex-col items-center px-2 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 z-10 transition-colors shadow-premium
                          ${isCompleted ? 'bg-brand-success text-white border-brand-success' : ''}
                          ${isCurrent && !isCompleted ? 'bg-brand-surface text-brand-primary border-brand-primary ring-4 ring-brand-primary/20' : ''}
                          ${!isCompleted && !isCurrent ? 'bg-brand-surface text-gray-400 border-brand-border' : ''}
                        `}>
                          {isCompleted ? <CheckCircle size={16} /> : i + 1}
                        </div>
                        <span className={`mt-3 text-xs font-bold uppercase tracking-wider
                          ${isCurrent || isCompleted ? 'text-brand-text-primary' : 'text-brand-text-secondary'}
                        `}>
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
            {order.status.toLowerCase() === "cancelled" && (
              <div className="text-center text-sm font-bold text-brand-error bg-brand-error/10 py-4 rounded-xl border border-red-100 flex flex-col items-center gap-2">
                <XCircle size={24} />
                This order has been cancelled.
              </div>
            )}
          </div>

          {/* Products */}
          <div className="p-6 bg-brand-surface">
            <div className="space-y-4">
              {order.products?.map((product, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-brand-background/50 p-4 rounded-2xl border border-brand-border/50">
                  <Link to={`/ProductPage/${product._id}`} className="bg-white p-2 rounded-xl w-20 h-20 flex-shrink-0 flex items-center justify-center border border-brand-border hover:border-brand-primary transition shadow-premium">
                    <img src={product.imageURL} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </Link>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-text-primary text-base mb-1 hover:text-brand-primary transition">
                      <Link to={`/ProductPage/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-sm text-brand-text-secondary mb-2 font-medium">Qty: {product.quantity}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {product.selectedRam && <span className="px-2.5 py-1 bg-white text-brand-text-secondary text-xs rounded-lg font-bold border border-brand-border/50 shadow-premium">RAM: {product.selectedRam}</span>}
                      {product.selectedStorage && <span className="px-2.5 py-1 bg-white text-brand-text-secondary text-xs rounded-lg font-bold border border-brand-border/50 shadow-premium">Storage: {product.selectedStorage}</span>}
                      {product.selectedSize && <span className="px-2.5 py-1 bg-white text-brand-text-secondary text-xs rounded-lg font-bold border border-brand-border/50 shadow-premium">Size: {product.selectedSize}</span>}
                    </div>
                  </div>

                  <div className="text-right sm:text-right mt-2 sm:mt-0 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <p className="font-black text-brand-text-primary text-lg">₹{(product.offerPrice || product.price) * product.quantity}</p>
                    <Link to={`/ProductPage/${product._id}`}>
                      <button className="mt-2 text-xs font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white transition px-4 py-2 rounded-lg">Buy again</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All Orders")

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const getOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      const userOrders = data.filter((item) => item.userEmail === user?.email)
      
      // Sort orders by most recent first
      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      setOrders(userOrders)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching orders:", err)
      toast.error("Failed to fetch orders. Please try again.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && user?.email) {
      getOrders()
    } else {
      setLoading(false)
    }
    window.scrollTo(0, 0)
  }, [])

  const FILTERS = ["All Orders", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

  const filteredOrders = orders.filter(order => {
    if (activeFilter === "All Orders") return true;
    if (activeFilter === "Processing") return order.status.toLowerCase() === "pending";
    return order.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="bg-brand-background min-h-screen pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        
        {!token ? (
          <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-brand-background rounded-full flex items-center justify-center mb-6">
              <Package size={40} className="text-brand-text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text-primary mb-2">Login to view orders</h1>
            <p className="text-brand-text-secondary mb-8 max-w-sm">Track your packages, view order history, and manage returns.</p>
            <div className="flex gap-4">
              <Link to="/login">
                <button className="bg-brand-primary text-[#FFFFFF] hover:brightness-110 transition px-8 py-3.5 rounded-xl font-bold shadow-premium">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-brand-text-primary tracking-tight">Order History</h1>
                <p className="text-brand-text-secondary font-medium mt-1">Check the status of your recent orders</p>
              </div>
              
              {/* Filters */}
              <div 
                role="tablist" 
                aria-label="Order Status Filters"
                className="flex overflow-x-auto pb-2 -mb-2 md:pb-0 md:mb-0 no-scrollbar gap-2 w-full md:w-auto snap-x"
              >
                {FILTERS.map(filter => (
                  <button
                    key={filter}
                    role="tab"
                    aria-selected={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-premium border snap-start ${
                      activeFilter === filter 
                        ? 'bg-brand-accent text-white border-brand-accent shadow-premium' 
                        : 'bg-brand-surface text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-brand-text-primary'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border p-16 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-brand-background rounded-full flex items-center justify-center mb-6">
                  <Package size={40} className="text-brand-text-secondary" />
                </div>
                <h1 className="text-2xl font-bold text-brand-text-primary mb-2">No orders found</h1>
                <p className="text-brand-text-secondary mb-8">
                  {activeFilter === "All Orders" 
                    ? "You haven't placed any orders yet. Start exploring!" 
                    : `You don't have any ${activeFilter.toLowerCase()} orders.`}
                </p>
                <Link to="/">
                  <button className="bg-brand-primary text-[#FFFFFF] px-8 py-3.5 rounded-xl hover:brightness-110 transition font-bold shadow-premium flex items-center gap-2">
                    Start Shopping <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Orders