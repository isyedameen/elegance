import toast from "react-hot-toast";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Navbar from '../components/Navbar'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setWishlist(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to load wishlist.")
        setLoading(false)
      })
    } else {
      let data = JSON.parse(localStorage.getItem("wishlist")) || []
      setWishlist(data)
      setLoading(false)
    }
    window.scrollTo(0, 0)
  }, [])

  // REMOVE PRODUCT
  const removeWishlist = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: id })
        });
        if (res.ok) {
          let updatedWishlist = wishlist.filter((item) => item._id !== id)
          setWishlist(updatedWishlist)
          toast.success("Removed from Wishlist")
        }
      } catch(err) {
        console.error(err);
        toast.error("Failed to remove from wishlist.")
      }
    } else {
      let updatedWishlist = wishlist.filter((item) => item._id !== id)
      setWishlist(updatedWishlist)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
      toast.success("Removed from Wishlist")
    }
  }

  // ADD TO CART
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    let existingProduct = cart.find((item) => item._id === product._id)

    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    toast.success("Added to Cart")
  }

  return (
    <div className="bg-brand-background min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-brand-error/20 flex items-center justify-center">
            <Heart className="text-brand-error" fill="currentColor" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text-primary tracking-tight">My Wishlist</h1>
            <p className="text-brand-text-secondary font-medium">Your favorite saved items</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-brand-border border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border p-16 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-32 h-32 bg-brand-background rounded-full flex items-center justify-center mb-6">
              <Heart size={50} className="text-brand-text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text-primary mb-2">Your wishlist is empty</h1>
            <p className="text-brand-text-secondary mb-8 max-w-sm">Tap the heart icon on any product to save it for later.</p>
            <Link to="/">
              <button className="bg-brand-primary text-[#FFFFFF] px-8 py-3.5 rounded-xl hover:brightness-110 transition font-bold shadow-premium">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {wishlist.map((item) => (
              <div key={item._id} className="group flex flex-col bg-brand-surface rounded-[24px] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all relative border-none">
                
                {item.offerPrice && (
                  <div className="absolute top-4 left-4 badge-success text-[10px] font-bold px-3 py-1.5 rounded-full uppercase z-10 tracking-wider">
                    Sale
                  </div>
                )}

                <button
                  onClick={(e) => { e.preventDefault(); removeWishlist(item._id); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-text-secondary hover:text-brand-error shadow-premium z-10 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:ring-2 hover:ring-red-500"
                >
                  <Trash2 size={18} />
                </button>

                <Link to={`/ProductPage/${item._id}`} className="relative h-72 bg-white flex items-center justify-center p-8 overflow-hidden rounded-t-[24px]">
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">{item.category?.category || "Category"}</span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-text-primary leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors font-display">
                    <Link to={`/ProductPage/${item._id}`}>{item.name}</Link>
                  </h3>

                  <div className="mt-auto flex items-end justify-between mb-5">
                    <div>
                      {item.offerPrice ? (
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-brand-primary">₹{item.offerPrice}</span>
                          <span className="text-sm text-brand-text-secondary line-through">₹{item.price}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-black text-brand-primary">₹{item.price}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-3.5 rounded-xl bg-transparent text-brand-primary border border-brand-border text-sm font-bold group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary active:scale-97 transition-all flex items-center justify-center gap-2 shadow-premium"
                  >
                    <ShoppingCart size={18} /> Move to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Wishlist