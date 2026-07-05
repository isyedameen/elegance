import { useEffect, useState } from "react"

function ManageOrders() {

  const [orders, setOrders] = useState([])

  const getOrders = async () => {

    const token = localStorage.getItem("token")
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()

    setOrders(data)

  }

  const changeStatus = async (id, status) => {

    try {

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${id}`, {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },

        body: JSON.stringify({ status })

      })

      getOrders()

    } catch (err) {

      console.error(err)

    }

  }

  useEffect(() => {
    getOrders()
  }, [])

  const pendingOrders = orders.filter(
    (item) => item.status === "pending"
  ).length

  const shippedOrders = orders.filter(
    (item) => item.status === "shipped"
  ).length

  const deliveredOrders = orders.filter(
    (item) => item.status === "delivered"
  ).length

  const cancelledOrders = orders.filter(
    (item) => item.status === "cancelled"
  ).length

  return (
    <div className="p-6">

      {/* TOP */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            Manage Orders
          </h1>

          <p className="text-brand-text-secondary mt-1">
            View and manage customer orders
          </p>
        </div>

        {/* STATUS BOXES */}
        <div className="flex flex-wrap gap-4">

          <div className="bg-brand-surface px-5 py-4 rounded-2xl shadow min-w-[120px]">
            <h1 className="text-sm text-brand-text-secondary">
              Total
            </h1>

            <p className="text-2xl font-bold text-brand-primary">
              {orders.length}
            </p>
          </div>

          <div className="bg-brand-surface px-5 py-4 rounded-2xl shadow min-w-[120px]">
            <h1 className="text-sm text-brand-text-secondary">
              Pending
            </h1>

            <p className="text-2xl font-bold text-brand-text-secondary">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-brand-surface px-5 py-4 rounded-2xl shadow min-w-[120px]">
            <h1 className="text-sm text-brand-text-secondary">
              Shipped
            </h1>

            <p className="text-2xl font-bold text-brand-primary">
              {shippedOrders}
            </p>
          </div>

          <div className="bg-brand-surface px-5 py-4 rounded-2xl shadow min-w-[120px]">
            <h1 className="text-sm text-brand-text-secondary">
              Delivered
            </h1>

            <p className="text-2xl font-bold text-brand-success">
              {deliveredOrders}
            </p>
          </div>

          <div className="bg-brand-surface px-5 py-4 rounded-2xl shadow min-w-[120px]">
            <h1 className="text-sm text-brand-text-secondary">
              Cancelled
            </h1>

            <p className="text-2xl font-bold text-brand-error">
              {cancelledOrders}
            </p>
          </div>

        </div>

      </div>

      {/* ORDERS */}
      <div className="space-y-5">

        {
          orders.map((item) => (

            <div
              key={item._id}
              className="bg-brand-surface rounded-[24px] shadow-premium border-none p-8"
            >

              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT */}
                <div>

                  <div className="flex items-center gap-4 flex-wrap mb-2">

                    <h1 className="text-2xl font-black text-brand-text-primary font-display tracking-tight">
                      {item.customerName}
                    </h1>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                      ${
                        item.status === "pending"
                          ? "bg-gray-100 text-gray-700 border border-gray-200"
                          : item.status === "shipped"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : item.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {item.status}
                    </span>

                  </div>

                  <div className="mt-3 space-y-1 text-sm text-brand-text-secondary">

                    <p>📧 {item.email}</p>

                    <p>📞 {item.phone}</p>

                    <p>💳 Payment: {item.paymentStatus}</p>
<p>🆔 {item.cashfreeOrderId}</p>

                    <p>
                      📍 {item.address?.city}, {item.address?.state}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-start lg:items-end gap-3">

                  <h1 className="text-3xl font-bold text-brand-success">
                    ₹{item.totalPrice}
                  </h1>

                  <select
                    value={item.status}
                    onChange={(e) =>
                      changeStatus(item._id, e.target.value)
                    }
                    className="border border-brand-border px-4 py-2 rounded-xl outline-none focus:border-brand-primary"
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

              {/* PRODUCTS */}
              <div className="mt-5 border-t pt-5">

                <h1 className="font-semibold text-brand-text-primary mb-4">
                  Ordered Products ({item.products?.length})
                </h1>

                <div className="space-y-3">

                  {
                    item.products?.map((product, index) => (

                      <div
                        key={index}
                        className="flex items-center justify-between bg-brand-background rounded-2xl p-3"
                      >

                        <div className="flex items-center gap-3">

                          <img
                            src={product.imageURL}
                            alt={product.name}
                            className="w-14 h-14 object-contain bg-brand-surface rounded-xl p-2"
                          />

                          <div>

                            <h1 className="font-medium text-brand-text-primary">
                              {product.name}
                            </h1>

                            <p className="text-sm text-brand-text-secondary">
                              Qty: {product.quantity}
                            </p>

                          </div>

                        </div>

                        <h1 className="font-bold text-brand-success">
                          ₹{(product.offerPrice || product.price) * product.quantity}
                        </h1>

                      </div>

                    ))
                  }

                </div>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  )
}

export default ManageOrders