import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductSkeleton from './ProductSkeleton'
import { ShoppingCart, ArrowRight, Heart } from "lucide-react"

function Banner({ products, banners, loading, sort, setSort, setPage }) {
  // Only show active banners
  const activeBanners = banners?.filter(b => b.isActive) || []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!activeBanners.length) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeBanners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeBanners.length])

  return (
    <div className="w-full pb-10 bg-brand-background">
      
      {/* HERO CAROUSEL */}
      {activeBanners.length > 0 && (
        <div className="w-full py-6 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="w-full relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-brand-surface shadow-premium min-h-[450px] md:h-[500px]">
              
              <div
                className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {activeBanners.map((banner, i) => (
                  <div
                    key={i}
                    className="min-w-full h-full flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-8 relative"
                  >
                    {/* Content */}
                    <div className="z-10 md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
                      <h2 className="text-3xl md:text-5xl font-extrabold text-brand-text-primary leading-tight tracking-tight">
                        {banner.title}
                      </h2>

                      {banner.subtitle && (
                        <p className="text-brand-text-secondary text-base md:text-lg max-w-md hidden md:block">
                          {banner.subtitle}
                        </p>
                      )}

                      {/* If the banner is linked to a specific product, show its price if populated */}
                      {banner.product && banner.product.price && (
                        <div className="flex items-center gap-3 mt-2">
                          {banner.product.offerPrice ? (
                            <>
                              <span className="text-2xl md:text-3xl font-black text-brand-text-primary">₹{banner.product.offerPrice}</span>
                              <span className="text-brand-text-secondary line-through text-base">₹{banner.product.price}</span>
                              <span className="badge-error text-xs font-bold px-2 py-1 rounded">SALE</span>
                            </>
                          ) : (
                            <span className="text-2xl md:text-3xl font-black text-brand-text-primary">₹{banner.product.price}</span>
                          )}
                        </div>
                      )}

                      <Link to={banner.link || (banner.product ? `/ProductPage/${banner.product._id}` : "/")}>
                        <button className="mt-4 px-6 py-3 md:px-8 md:py-3.5 bg-brand-primary text-[#FFFFFF] rounded-xl font-bold hover:brightness-110 transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-premium">
                          Shop Now <ArrowRight size={18} />
                        </button>
                      </Link>
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0 z-10 h-48 md:h-full relative">
                      <Link to={banner.link || (banner.product ? `/ProductPage/${banner.product._id}` : "/")}>
                        <img
                          src={banner.imageURL}
                          alt={banner.title}
                          className="h-full object-contain max-h-[220px] md:max-h-[350px] hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                {activeBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-brand-secondary" : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS SECTION */}
      <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 border-b border-brand-border pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-text-primary tracking-tight">Explore Products</h2>
            <p className="text-brand-text-secondary mt-1">Find what you love from our extensive collection.</p>
          </div>

          <div className="flex items-center gap-3 bg-brand-surface px-4 py-2 rounded-xl border border-brand-border shadow-premium">
            <label className="text-sm text-brand-text-secondary font-semibold whitespace-nowrap">Sort By:</label>
            <select 
              value={sort} 
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="text-sm font-medium text-brand-text-primary outline-none bg-transparent cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {loading ? (
            [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
          ) : products?.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-brand-text-secondary bg-brand-surface rounded-2xl border border-brand-border shadow-premium">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-brand-text-primary">No products found</h3>
              <p>Try adjusting your category or sort filters.</p>
            </div>
          ) : (
            products?.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col bg-brand-surface rounded-[24px] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all relative"
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
                    <Heart size={20} />
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

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow bg-brand-surface">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">{item.category?.category || "Category"}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-brand-text-primary leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors font-display">
                    <Link to={`/ProductPage/${item._id}`}>
                      {item.name}
                    </Link>
                  </h3>

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
                    <button className="w-full py-3.5 rounded-xl bg-transparent text-brand-text-primary border border-brand-border text-sm font-bold group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary active:scale-97 transition-all flex items-center justify-center gap-2 shadow-premium">
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Banner