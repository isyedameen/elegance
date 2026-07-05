import { CheckCircle, Package, Calendar, Truck, ArrowRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import Navbar from '../components/Navbar'
import { useEffect, useRef } from "react"

function OrderSuccess() {
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const orderId = search.get("order_id") || search.get("orderId")
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const saveOrder = async () => {
      const order = JSON.parse(localStorage.getItem("pendingOrder"))
      if (!order || order.cashfreeOrderId !== orderId) {
        console.error("Invalid order session or mismatching order ID")
        return
      }
      
      const token = localStorage.getItem("token")
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(order)
        })

        if (response.ok) {
          localStorage.removeItem("pendingOrder")
          localStorage.removeItem("cart")
        } else {
          console.error("Failed to save order on server")
        }
      } catch(err) {
        console.error("Failed to save order", err)
      }
    }
    
    saveOrder()
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-brand-background min-h-screen pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-brand-surface rounded-3xl shadow-xl overflow-hidden border border-brand-border">
          
          <div className="bg-brand-success py-12 px-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="bg-brand-surface p-4 rounded-full shadow-premium mb-6 relative z-10 animate-[bounce_1s_ease-out_infinite]">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 relative z-10">Order Confirmed!</h1>
            <p className="text-green-100 text-lg font-medium relative z-10">Thank you for your purchase.</p>
          </div>

          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <p className="text-brand-text-secondary">Your order has been placed successfully and is now being processed. We will send you an email confirmation shortly.</p>
            </div>

            <div className="bg-brand-background rounded-2xl p-6 md:p-8 border border-brand-border mb-10">
              <h3 className="font-bold text-brand-text-primary mb-6 text-lg border-b border-brand-border pb-4">Order Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-surface p-3 rounded-full shadow-premium">
                    <Package size={24} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Order ID</p>
                    <p className="font-bold text-brand-text-primary break-all">{orderId || "Processing..."}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-surface p-3 rounded-full shadow-premium">
                    <Calendar size={24} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Date</p>
                    <p className="font-bold text-brand-text-primary">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-surface p-3 rounded-full shadow-premium">
                    <CheckCircle size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Payment Status</p>
                    <p className="font-bold text-brand-text-primary">Paid Online</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-surface p-3 rounded-full shadow-premium">
                    <Truck size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Estimated Delivery</p>
                    <p className="font-bold text-brand-text-primary">2 - 3 Working Days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/orders" className="w-full sm:w-auto">
                <button className="w-full bg-brand-primary hover:brightness-110 transition text-[#FFFFFF] px-8 py-4 rounded-xl font-bold shadow-premium">
                  Track Your Order
                </button>
              </Link>
              
              <Link to="/" className="w-full sm:w-auto">
                <button className="w-full bg-brand-surface border-2 border-brand-border hover:border-gray-900 hover:bg-brand-background text-brand-text-primary px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2">
                  Continue Shopping <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default OrderSuccess