import toast from "react-hot-toast";
import Navbar from '../components/Navbar'
import { useState, useEffect } from "react"
import { Check, ShieldCheck, CreditCard, Truck } from "lucide-react"

function Checkout() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    country: ""
  })

  const [cart, setCart] = useState([])
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("cart")) || []
    setCart(data)
    window.scrollTo(0, 0)

    const token = localStorage.getItem("token")
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if(data.addresses) setAddresses(data.addresses)
        if(data.name && !formData.customerName) setFormData(f => ({...f, customerName: data.name}))
        if(data.phone && !formData.phone) setFormData(f => ({...f, phone: data.phone}))
        if(data.email && !formData.email) setFormData(f => ({...f, email: data.email}))
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load user profile details.");
      })
    }
  }, [])

  let totalPrice = 0
  cart.forEach((item) => {
    totalPrice += (item.offerPrice || item.price) * item.quantity
  })

  const placeOrder = async () => {
    if (
      !formData.customerName || !formData.phone || !formData.email ||
      !formData.house || !formData.city || !formData.state ||
      !formData.pincode || !formData.country
    ) {
      toast.error("Please fill all details")
      return
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number")
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Enter a valid email")
      return
    }
      
    const user = JSON.parse(localStorage.getItem("user"))

    const orderData = {
      userEmail: user.email,
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      address: {
        house: formData.house,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country
      },
      products: cart,
      totalPrice: totalPrice + 20
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice: totalPrice + 20,
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone
        })
      })

      const data = await res.json()
      orderData.paymentStatus = "paid"
      orderData.cashfreeOrderId = data.orderId

      const cashfree = new window.Cashfree({ mode: "sandbox" })
      localStorage.setItem("pendingOrder", JSON.stringify(orderData))

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        returnUrl: "http://localhost:5173/success?order_id={order_id}"
      })
    } catch (err) {
      console.error(err)
      toast.error("Payment initialization failed.")
    }
  }

  return (
    <div className="bg-brand-background min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-10 max-w-2xl mx-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full badge-success flex items-center justify-center font-bold shadow-premium">
              <Check size={16} />
            </div>
            <span className="ml-2 font-semibold text-brand-text-primary text-sm">Cart</span>
          </div>
          <div className="w-16 md:w-32 h-1 bg-brand-success mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-[#FFFFFF] flex items-center justify-center font-bold shadow-premium">2</div>
            <span className="ml-2 font-bold text-brand-text-primary text-sm">Checkout</span>
          </div>
          <div className="w-16 md:w-32 h-1 bg-gray-200 mx-2"></div>
          <div className="flex items-center opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-brand-text-secondary flex items-center justify-center font-bold">3</div>
            <span className="ml-2 font-medium text-brand-text-secondary text-sm">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-brand-surface rounded-2xl shadow-premium border border-brand-border p-8">
              <h2 className="text-xl font-bold text-brand-text-primary mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-primary text-[#FFFFFF] text-xs flex items-center justify-center">1</span>
                Contact Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="relative">
                  <input
                    type="text"
                    id="customerName"
                    aria-label="Full Name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="John Doe"
                  />
                  <label htmlFor="customerName" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    Full Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="phone"
                    aria-label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="9876543210"
                  />
                  <label htmlFor="phone" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    Phone Number
                  </label>
                </div>
                <div className="md:col-span-2 relative mt-2">
                  <input
                    type="email"
                    id="email"
                    aria-label="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="john@example.com"
                  />
                  <label htmlFor="email" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    Email Address
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface rounded-2xl shadow-premium border border-brand-border p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-brand-text-primary flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-[#FFFFFF] text-xs flex items-center justify-center">2</span>
                  Shipping Address
                </h2>
                
                {addresses.length > 0 && (
                  <select 
                    className="border border-brand-border rounded-lg px-3 py-1.5 outline-none text-sm font-medium bg-brand-background focus:border-brand-primary"
                    onChange={(e) => {
                      if(e.target.value) {
                        const addr = addresses.find(a => a._id === e.target.value)
                        setFormData({
                          ...formData,
                          house: addr.house,
                          city: addr.city,
                          state: addr.state,
                          pincode: addr.pincode,
                          country: addr.country
                        })
                      }
                    }}
                  >
                    <option value="">Use saved address...</option>
                    {addresses.map(a => <option key={a._id} value={a._id}>{a.label} - {a.city}</option>)}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2 relative">
                  <input
                    type="text"
                    id="house"
                    aria-label="House, Flat, or Area"
                    value={formData.house}
                    onChange={(e) => setFormData({...formData, house: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="House/Flat/Area"
                  />
                  <label htmlFor="house" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    House / Flat / Area
                  </label>
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    id="city"
                    aria-label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="City"
                  />
                  <label htmlFor="city" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    City
                  </label>
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    id="state"
                    aria-label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="State"
                  />
                  <label htmlFor="state" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    State
                  </label>
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    id="pincode"
                    aria-label="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="Pincode"
                  />
                  <label htmlFor="pincode" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    Pincode
                  </label>
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    id="country"
                    aria-label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="input-base peer placeholder-transparent"
                    placeholder="Country"
                  />
                  <label htmlFor="country" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                    Country
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-brand-surface rounded-2xl shadow-premium border border-brand-border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-brand-text-primary mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 no-scrollbar border-b border-brand-border pb-4">
                {cart.map((item, index) => (
                  <div key={`${item._id}-${index}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-brand-background rounded-lg p-2 flex-shrink-0 flex items-center justify-center">
                      <img src={item.imageURL} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-brand-text-primary line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-brand-text-secondary mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-brand-text-primary mt-1">₹{(item.offerPrice || item.price) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-brand-text-secondary mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-text-primary">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-brand-success font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-medium text-brand-text-primary">₹20</span>
                </div>
              </div>

              <div className="border-t border-brand-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-brand-text-primary">Total</span>
                  <span className="text-3xl font-black text-brand-text-primary">₹{totalPrice + 20}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                className="w-full bg-brand-primary hover:brightness-110 text-[#FFFFFF] py-4 rounded-xl font-bold text-lg transition shadow-premium flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <ShieldCheck size={20} /> Proceed to Pay
              </button>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-xs text-brand-text-secondary font-medium bg-brand-background py-2 rounded-lg">
                  <CreditCard size={14} className="text-brand-text-secondary" /> Secure Payment via Cashfree
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-brand-text-secondary font-medium bg-brand-background py-2 rounded-lg">
                  <Truck size={14} className="text-brand-text-secondary" /> Reliable & Fast Shipping
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout