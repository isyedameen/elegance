import { useState, useEffect, useRef } from "react"
import { Menu, X, Home, ShoppingCart, Info, Phone, User, Search, Package, Heart, LogOut, Settings, ChevronDown } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const islogin = localStorage.getItem("token")
  const userStr = localStorage.getItem("user")
  const userObj = userStr ? JSON.parse(userStr) : null

  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Update counts continuously or on mount/changes
  useEffect(() => {
    const updateCounts = () => {
      const cart = islogin ? JSON.parse(localStorage.getItem("cart")) || [] : []
      setCartCount(cart.length)

      if (!islogin) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
        setWishlistCount(wishlist.length)
      } else {
        // We'll just rely on the initial fetch or state, since backend wishlist sync is trickier without a context.
        // For now, if we have a way to count it, great. Let's fallback to localstorage for guest, and an API call for logged in if needed.
        // For UI purposes, we'll try to read from localstorage as well, or just show the icon.
      }
    }
    
    updateCounts()
    // A simple interval to keep cart badge updated across tabs or without context API
    const interval = setInterval(updateCounts, 1000)
    return () => clearInterval(interval)
  }, [islogin])


  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.reload()
  }

  const [search, setSearch] = useState("")
  const [result, setResult] = useState([])

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setResult([])
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/search?name=${value}`)
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-white/80 text-brand-text-primary sticky top-0 z-50 border-b border-brand-border shadow-premium backdrop-blur-xl">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-brand-primary text-2xl font-black tracking-tighter font-display">
              Elegance<span className="text-brand-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Left Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-8 ml-10">
          <Link to="/" className="text-sm font-semibold text-brand-text-secondary hover:text-brand-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-brand-secondary after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
            Home
          </Link>
          <div className="relative group cursor-pointer">
            <Link to="/categories" className="text-sm font-semibold text-brand-text-secondary hover:text-brand-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-brand-secondary after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
              Categories
            </Link>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 mx-8 max-w-2xl relative">
          <div className="flex w-full rounded-xl overflow-hidden border border-brand-border bg-brand-background focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                handleSearch(e.target.value)
              }}
              type="text"
              placeholder="Search products..."
              className="w-full px-5 py-2.5 bg-transparent text-sm text-brand-text-primary outline-none"
            />
            <button
              onClick={() => handleSearch(search)}
              className="px-5 flex items-center justify-center text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            >
              <Search size={18} />
            </button>
          </div>

          {result.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-brand-surface text-brand-text-primary shadow-premium rounded-xl mt-2 z-50 max-h-80 overflow-y-auto border border-brand-border">
              {result.map((item) => (
                <Link
                  key={item._id}
                  to={`/ProductPage/${item._id}`}
                  onClick={() => {
                    setSearch("")
                    setResult([])
                  }}
                  className="flex items-center gap-4 p-3 border-b border-brand-background hover:bg-brand-background transition"
                >
                  <img src={item.imageURL} alt={item.name} className="w-10 h-10 object-contain rounded" />
                  <span className="text-sm font-medium text-brand-text-primary">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          
          <Link to="/wishlist" className="relative text-brand-text-primary hover:text-brand-error transition-colors">
            <Heart size={22} />
          </Link>

          <Link to="/cart" className="relative text-brand-text-primary hover:opacity-80 transition-colors flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-[#FFFFFF] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-surface">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold hidden lg:block">Cart</span>
          </Link>

          {islogin ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-brand-background p-2 rounded-full transition"
              >
                <div className="w-8 h-8 bg-brand-primary text-[#FFFFFF] rounded-full flex items-center justify-center font-bold text-sm">
                  {userObj?.name ? userObj.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <ChevronDown size={16} className={`text-brand-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-brand-surface rounded-2xl shadow-xl border border-brand-border py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-brand-border mb-2">
                    <p className="text-sm font-medium text-brand-text-primary truncate">{userObj?.name || "User"}</p>
                    <p className="text-xs text-brand-text-secondary truncate">{userObj?.email}</p>
                  </div>
                  
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)] transition">
                    <User size={16} /> My Account
                  </Link>
                  <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)] transition">
                    <Package size={16} /> Orders
                  </Link>
                  
                  {userObj?.role === "admin" && (
                    <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-primary font-medium hover:bg-brand-background transition">
                      <Settings size={16} /> Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-brand-border mt-2 pt-2">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-error hover:bg-brand-error/10 transition font-medium">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-brand-primary text-[#FFFFFF] px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-premium">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Button & Cart */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative text-brand-text-primary">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-primary text-[#FFFFFF] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(true)} className="text-brand-text-primary">
            <Menu size={28} />
          </button>
        </div>

      </div>

      {/* Mobile Search - Visible only on mobile below navbar if not open */}
      <div className="md:hidden px-4 pb-3 border-b border-brand-border">
        <div className="flex w-full rounded-lg overflow-hidden border border-brand-border bg-brand-background focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-100 transition-all">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleSearch(e.target.value)
            }}
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 text-sm bg-transparent text-brand-text-primary outline-none"
          />
          <button onClick={() => handleSearch(search)} className="bg-brand-primary px-4 flex items-center justify-center">
            <Search size={16} className="text-brand-text-primary" />
          </button>
        </div>
        {result.length > 0 && (
            <div className="absolute w-[calc(100%-2rem)] mx-4 bg-brand-surface text-brand-text-primary shadow-xl rounded-xl mt-1 z-50 max-h-60 overflow-y-auto border border-brand-border">
              {result.map((item) => (
                <Link
                  key={item._id}
                  to={`/ProductPage/${item._id}`}
                  onClick={() => {
                    setSearch("")
                    setResult([])
                  }}
                  className="flex items-center gap-3 p-3 border-b border-gray-50"
                >
                  <img src={item.imageURL} alt={item.name} className="w-8 h-8 object-contain rounded" />
                  <span className="text-xs font-medium text-brand-text-primary">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-brand-primary/50 z-50 transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 left-0 w-[80%] max-w-sm h-full bg-brand-surface z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto shadow-2xl`}>
        
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-surface/20 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            {islogin ? (
              <div>
                <p className="text-sm font-bold">Hello, {userObj?.name || "User"}</p>
                <p className="text-xs text-brand-text-secondary">Welcome back</p>
              </div>
            ) : (
              <p className="text-lg font-bold">Hello, Sign in</p>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="text-brand-text-secondary hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="py-4">
          <ul className="flex flex-col text-sm font-medium text-brand-text-primary">
            <li className="px-5 py-3 text-lg font-bold border-b border-brand-border">Trending</li>
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <Home size={18} className="text-brand-text-secondary" /> Home
            </Link>
            <Link to="/categories" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <Package size={18} className="text-brand-text-secondary" /> Categories
            </Link>
            
            <li className="px-5 py-3 mt-2 text-lg font-bold border-b border-brand-border">Your Account</li>
            
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <ShoppingCart size={18} className="text-brand-text-secondary" /> Cart
            </Link>
            <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <Package size={18} className="text-brand-text-secondary" /> Your Orders
            </Link>
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <Heart size={18} className="text-brand-text-secondary" /> Your Wishlist
            </Link>
            {islogin && (
               <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
               <User size={18} className="text-brand-text-secondary" /> My Account
             </Link>
            )}

            {islogin && userObj?.role === "admin" && (
               <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background text-brand-text-primary">
               <Settings size={18} /> Admin Dashboard
             </Link>
            )}

            <li className="px-5 py-3 mt-2 text-lg font-bold border-b border-brand-border">Help & Settings</li>
            <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <Info size={18} className="text-brand-text-secondary" /> About
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-brand-background">
              <Phone size={18} className="text-brand-text-secondary" /> Contact
            </Link>

            <div className="px-6 py-5 mt-4">
              {islogin ? (
                <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-brand-surface text-brand-error px-5 py-3 rounded-xl font-bold hover:bg-brand-error/10 transition">
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 bg-brand-primary text-[#FFFFFF] px-5 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-premium">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </ul>
        </div>
      </div>

    </nav>
  )
}

export default Navbar