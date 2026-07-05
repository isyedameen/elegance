import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Minus, Plus, CreditCard } from "lucide-react"
import Navbar from '../components/Navbar'

function Cart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("cart")) || []
    setCart(data)
    window.scrollTo(0, 0)
  }, [])

  const increaseQty = (id, ram, storage, size) => {
    let updateCart = cart.map((item) => {
      if (item._id === id && item.selectedRam === ram && item.selectedStorage === storage && item.selectedSize === size) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })
    setCart(updateCart)
    localStorage.setItem("cart", JSON.stringify(updateCart))
  }

  const decreaseQty = (id, ram, storage, size) => {
    let updateCart = cart.map((item) => {
      if (item._id === id && item.selectedRam === ram && item.selectedStorage === storage && item.selectedSize === size) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 }
        }
      }
      return item
    })
    setCart(updateCart)
    localStorage.setItem("cart", JSON.stringify(updateCart))
  }

  const deleteProduct = (id, ram, storage, size) => {
    let updatedCart = cart.filter((item) => !(item._id === id && item.selectedRam === ram && item.selectedStorage === storage && item.selectedSize === size))
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  let totalPrice = 0
  cart.forEach((item) => {
    totalPrice += (item.offerPrice || item.price) * item.quantity
  })

  return (
    <div className="bg-brand-background min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-extrabold text-brand-text-primary mb-8 tracking-tight">
          Shopping Cart {cart.length > 0 && <span className="text-brand-text-secondary font-medium text-2xl">({cart.length} Items)</span>}
        </h1>

        {!localStorage.getItem("token") ? (
          <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-brand-background rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-brand-text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Missing Cart items?</h2>
            <p className="text-brand-text-secondary mb-8 max-w-sm">Login to view items you added on another device or start shopping now.</p>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:brightness-110 transition text-[#FFFFFF] rounded-xl font-bold shadow-premium">
                Sign In to View Cart
              </button>
            </Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-brand-background rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-brand-text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Your cart is empty</h2>
            <p className="text-brand-text-secondary mb-8">Looks like you haven't added anything yet.</p>
            <Link to="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:brightness-110 transition text-[#FFFFFF] rounded-xl font-bold shadow-premium flex items-center justify-center gap-2">
                Continue Shopping <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT: CART ITEMS */}
            <div className="flex-1 space-y-4">
              <div className="bg-brand-surface rounded-[24px] shadow-premium overflow-hidden border-none">
                {cart.map((item, index) => (
                  <div key={`${item._id}-${index}`} className="p-6 sm:p-8 border-b border-brand-background last:border-b-0 flex flex-col sm:flex-row gap-6 relative group hover:bg-brand-background transition-colors">
                    
                    <div className="bg-white rounded-2xl p-4 w-full sm:w-40 h-40 flex-shrink-0 flex items-center justify-center shadow-premium">
                      <Link to={`/ProductPage/${item._id}`}>
                        <img src={item.imageURL} alt={item.name} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform" />
                      </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-brand-text-primary leading-tight mb-2 hover:text-brand-primary transition-colors font-display">
                            <Link to={`/ProductPage/${item._id}`}>{item.name}</Link>
                          </h3>
                          <p className="text-sm text-brand-success font-bold tracking-wide">In Stock</p>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.selectedRam && <span className="px-3 py-1.5 bg-white shadow-premium text-brand-text-secondary text-xs rounded-lg font-bold tracking-wider">RAM: {item.selectedRam}</span>}
                            {item.selectedStorage && <span className="px-3 py-1.5 bg-white shadow-premium text-brand-text-secondary text-xs rounded-lg font-bold tracking-wider">Storage: {item.selectedStorage}</span>}
                            {item.selectedSize && <span className="px-3 py-1.5 bg-white shadow-premium text-brand-text-secondary text-xs rounded-lg font-bold tracking-wider">Size: {item.selectedSize}</span>}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-brand-primary">₹{item.offerPrice || item.price}</p>
                          {item.offerPrice && (
                            <p className="text-sm text-brand-text-secondary line-through font-medium">₹{item.price}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-white rounded-xl shadow-premium border border-brand-border/50">
                          <button onClick={() => decreaseQty(item._id, item.selectedRam, item.selectedStorage, item.selectedSize)} className="w-10 h-10 flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:bg-brand-background rounded-l-xl transition-colors">
                            <Minus size={18} />
                          </button>
                          <span className="w-12 text-center font-bold text-brand-text-primary">{item.quantity}</span>
                          <button onClick={() => increaseQty(item._id, item.selectedRam, item.selectedStorage, item.selectedSize)} className="w-10 h-10 flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:bg-brand-background rounded-r-xl transition-colors">
                            <Plus size={18} />
                          </button>
                        </div>

                        <button 
                          onClick={() => deleteProduct(item._id, item.selectedRam, item.selectedStorage, item.selectedSize)}
                          className="text-brand-text-secondary hover:text-brand-error font-bold text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-brand-error/10 transition-colors"
                        >
                          <Trash2 size={18} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-brand-surface rounded-2xl shadow-premium border border-brand-border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-brand-text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm text-brand-text-secondary mb-6">
                  <div className="flex justify-between">
                    <span>Items ({cart.length})</span>
                    <span className="font-medium text-brand-text-primary">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-brand-success font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="font-medium text-brand-text-primary">₹20</span>
                  </div>
                </div>

                <div className="border-t border-brand-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-brand-text-primary">Total Amount</span>
                    <span className="text-3xl font-black text-brand-text-primary">₹{totalPrice + 20}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <button className="w-full bg-brand-primary hover:brightness-110 transition text-[#FFFFFF] py-4 rounded-xl font-bold text-lg shadow-premium flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>
                </Link>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-brand-text-secondary">
                    <ShieldCheck size={16} className="text-brand-success" /> Safe and Secure Payments
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-brand-text-secondary">
                    <CreditCard size={16} className="text-brand-primary" /> EMI Available on Cards
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Cart