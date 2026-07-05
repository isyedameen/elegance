import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function CategoryDetails() {
  const { id } = useParams()

  const [product, setProduct] = useState([])

  const getproducts = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/category/${id}`)
      let data = await res.json()
      setProduct(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getproducts()
  }, [id])

  return (
<>
<Navbar/>
    
    <div className="min-h-screen bg-brand-background px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-8 border-b border-brand-border pb-4">
          <Link to="/categories" className="text-brand-text-secondary hover:text-brand-primary transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">
            Products
          </h1>
        </div>

        {product.length === 0 ? (
          <p className="text-brand-text-secondary">Coming Soon</p>
        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

            {product.map((item) => (

              <div
                key={item._id}
                className="group flex flex-col bg-brand-surface rounded-[24px] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all relative border-none"
              >
                {/* Badge */}
                {item.offerPrice && (
                  <div className="absolute top-4 left-4 badge-success text-[10px] font-bold px-3 py-1.5 rounded-full uppercase z-10 tracking-wider">
                    Sale
                  </div>
                )}
                
                {/* Wishlist Hover Icon */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:ring-2 hover:ring-brand-secondary transition-all shadow-premium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>

                {/* IMAGE */}
                <Link to={`/ProductPage/${item._id}`} className="relative h-72 bg-white flex items-center justify-center p-8 overflow-hidden rounded-t-[24px]">
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* DETAILS */}
                <div className="p-6 flex flex-col flex-grow">

                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">{item.category?.category || "Category"}</span>
                  </div>

                  <h2 className="text-lg font-bold text-brand-text-primary line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors font-display">
                    <Link to={`/ProductPage/${item._id}`}>
                    {item.name}
                    </Link>
                  </h2>

                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-brand-primary text-sm">{"★".repeat(Math.round(item.averageRating || 5))}</span>
                    <span className="text-gray-200 text-sm">{"★".repeat(5 - Math.round(item.averageRating || 5))}</span>
                    <span className="text-xs text-brand-text-secondary font-medium ml-2">({item.numReviews || 0})</span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
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

                  {/* Buy Button */}
                  <Link to={`/ProductPage/${item._id}`} className="mt-5 w-full block">
                    <button className="w-full py-3.5 rounded-xl bg-transparent text-brand-primary border border-brand-border text-sm font-bold group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary active:scale-97 transition-all flex items-center justify-center gap-2 shadow-premium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart
                    </button>
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

</>
  )
}

export default CategoryDetails