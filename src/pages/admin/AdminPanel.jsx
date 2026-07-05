import React from "react"
import { FolderPlus, PlusCircle, Layers, Package, LogOut, Home, Users, BarChart3, Settings } from "lucide-react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

export default function AdminPanel() {
  const location = useLocation()
  const navigate = useNavigate()

  const linkStyle = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
     ${
       location.pathname.includes(path)
         ? "bg-brand-secondary text-brand-accent border-r-4 border-brand-accent font-bold"
         : "text-brand-text-secondary hover:bg-brand-surface transition hover:text-brand-text-primary"
     }`

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className="h-screen flex bg-brand-background overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 bg-brand-background text-brand-text-primary flex flex-col border-r border-brand-border shadow-xl z-20">
        
        <div className="px-6 py-8 border-b border-brand-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center font-bold">A</div>
            <h1 className="text-xl font-bold tracking-wide">
              Admin Portal
            </h1>
          </div>
          <p className="text-xs text-brand-text-secondary font-medium tracking-wider uppercase ml-10">Control Center</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-3 px-4">Menu</p>
          <nav className="space-y-1.5 mb-8">
            <Link to="add-category" className={linkStyle("add-category")}>
              <FolderPlus size={18} />
              <span>Add Category</span>
            </Link>

            <Link to="add-product" className={linkStyle("add-product")}>
              <PlusCircle size={18} />
              <span>Add Product</span>
            </Link>

            <Link to="manage-categories" className={linkStyle("manage-categories")}>
              <Layers size={18} />
              <span>Manage Categories</span>
            </Link>

            <Link to="manage-products" className={linkStyle("manage-products")}>
              <Package size={18} />
              <span>Manage Products</span>
            </Link>

            <Link to="manage-banners" className={linkStyle("manage-banners")}>
              <Layers size={18} />
              <span>Manage Banners</span>
            </Link>

            <Link to="manage-orders" className={linkStyle("manage-orders")}>
              <Package size={18} />
              <span>Manage Orders</span>
            </Link>
          </nav>

          <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-3 px-4">System</p>
          <nav className="space-y-1.5">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-brand-text-secondary hover:bg-brand-surface transition hover:text-brand-text-primary">
              <Home size={18} />
              <span>Back to Store</span>
            </Link>
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="p-4 border-t border-brand-border bg-brand-background">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-brand-surface text-red-600 py-3 rounded-xl font-medium hover:bg-brand-error/10 hover:text-red-700 transition border border-brand-border"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-background/50">
        {/* Top Header */}
        <header className="h-16 bg-brand-surface border-b border-brand-border flex items-center justify-between px-8 shadow-premium shrink-0">
          <h2 className="text-lg font-bold text-brand-text-primary tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-brand-surface rounded-full flex items-center justify-center border border-brand-border">
              <span className="font-bold text-brand-text-secondary text-sm">A</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  )
}