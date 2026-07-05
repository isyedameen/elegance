import { Navigate, useNavigate } from "react-router-dom"
import Navbar from '../components/Navbar'
import { useState,useEffect } from "react"
import Banner from '../components/Banner'
import { Link } from "react-router-dom"
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react"

function Home() {
  const nav = useNavigate()
  const islogin = localStorage.getItem("token")

  const [products, setProducts] = useState([])
  const [banners, setBanners] = useState([])

  // Filtering, Sorting, Pagination States
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState("newest")

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/banners`)
      .then(res => res.json())
      .then(data => setBanners(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    let url = `${import.meta.env.VITE_API_BASE_URL}/products?page=${page}&limit=8&sort=${sort}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || data)
        setTotalPages(data.totalPages || 1)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, sort])

  return (
    <div className="bg-brand-background min-h-screen flex flex-col">
      <Navbar />



      <main className="flex-grow">
        <Banner 
          products={products} 
          banners={banners} 
          loading={loading}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
        />

        {/* PAGINATION CONTROLS */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-12">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-6 py-2.5 bg-brand-surface border border-brand-border rounded-xl font-medium text-brand-text-secondary hover:bg-brand-background disabled:opacity-50 disabled:cursor-not-allowed transition shadow-premium"
            >
              Previous
            </button>
            <span className="font-semibold text-brand-text-primary bg-brand-surface px-4 py-2 rounded-lg shadow-premium border border-brand-border">
              Page {page} of {totalPages}
            </span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-2.5 bg-brand-primary text-[#FFFFFF] rounded-xl font-medium hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-premium"
            >
              Next
            </button>
          </div>
        )}

        {/* Value Proposition Section */}
        <section className="bg-brand-surface py-20 border-t border-brand-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center p-8 bg-brand-background rounded-3xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mb-6 text-brand-accent">
                  <Truck size={28} />
                </div>
                <h3 className="font-bold text-lg text-brand-text-primary mb-2">Free Delivery</h3>
                <p className="text-sm text-brand-text-secondary">On orders above ₹499</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-brand-background rounded-3xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-brand-success-bg rounded-full flex items-center justify-center mb-6 text-brand-success">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-bold text-lg text-brand-text-primary mb-2">Secure Payments</h3>
                <p className="text-sm text-brand-text-secondary">100% protected transactions</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-brand-background rounded-3xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-brand-warning-bg rounded-full flex items-center justify-center mb-6 text-brand-warning">
                  <RotateCcw size={28} />
                </div>
                <h3 className="font-bold text-lg text-brand-text-primary mb-2">Easy Returns</h3>
                <p className="text-sm text-brand-text-secondary">10 days return policy</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-brand-background rounded-3xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mb-6 text-brand-accent">
                  <CreditCard size={28} />
                </div>
                <h3 className="font-bold text-lg text-brand-text-primary mb-2">EMI Available</h3>
                <p className="text-sm text-brand-text-secondary">On major credit cards</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Professional Footer */}
      {/* Premium Footer */}
      <footer className="bg-[#0F1117] border-t-0 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-end mb-6 text-white font-display">
                Elegance<span className="text-brand-primary">.</span>
              </h1>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                The ultimate destination for premium quality products. Shop with confidence, speed, and uncompromising elegance.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-brand-text-secondary">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Account</h3>
              <ul className="space-y-3 text-sm text-brand-text-secondary">
                <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link to="/cart" className="hover:text-white transition">View Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-white transition">My Wishlist</Link></li>
                <li><Link to="/orders" className="hover:text-white transition">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Newsletter</h3>
              <p className="text-sm text-brand-text-secondary mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <div className="flex w-full">
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-2.5 rounded-l-xl bg-[#1A1D27] border border-[#2A2E3D] text-white outline-none focus:border-brand-primary placeholder-gray-500" />
                <button className="bg-brand-primary text-white px-5 font-bold rounded-r-xl hover:brightness-110 transition border border-[#2A2E3D] border-l-0">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#2A2E3D] pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-brand-text-secondary">
            <p>© {new Date().getFullYear()} Elegance. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 font-medium">
              <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home 