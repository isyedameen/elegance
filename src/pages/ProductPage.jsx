import toast from "react-hot-toast";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Heart, Share2, Check, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react"
import Navbar from '../components/Navbar'

function ProductPage() {
  const { id } = useParams()

  const [details, setDetails] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const [selectedRam, setSelectedRam] = useState("")
  const [selectedStorage, setSelectedStorage] = useState("")
  const [selectedSize, setSelectedSize] = useState("")

  const [liked, setLiked] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: details.name,
          text: "Check this product",
          url,
        })
      } catch (err) {
        console.error("Share cancelled")
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied!")
    }
  }

  // GET PRODUCT
  const getDetails = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)
      let data = await res.json()
      setDetails(data)

      if (data.ram?.length) setSelectedRam(data.ram[0])
      if (data.storage?.length) setSelectedStorage(data.storage[0])
      if (data.sizes?.length) setSelectedSize(data.sizes[0])

      // Fetch reviews
      try {
        let revRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}/reviews`)
        if (revRes.ok) {
          let revData = await revRes.json()
          setReviews(revData)
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
      }

      // CHECK WISHLIST
      const token = localStorage.getItem("token");
      if (token) {
        let wishRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (wishRes.ok) {
          let wishlistData = await wishRes.json();
          let exists = wishlistData.find(item => item._id === data._id);
          setLiked(!!exists);
        }
      } else {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
        let exists = wishlist.find((item) => item._id === data._id)
        setLiked(!!exists)
      }

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getDetails()
    window.scrollTo(0, 0)
  }, [id])

  // ADD TO CART
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || []

    let existingProduct = cart.find(
      (item) => item._id === details._id && 
                item.selectedRam === selectedRam && 
                item.selectedStorage === selectedStorage && 
                item.selectedSize === selectedSize
    )

    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      cart.push({
        ...details,
        selectedRam,
        selectedStorage,
        selectedSize,
        quantity: 1
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    toast.success("Added to Cart")
  }

  // WISHLIST
  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: details._id })
        });
        if (res.ok) {
          setLiked(!liked);
          toast.success(liked ? "Removed from Wishlist" : "Added to Wishlist")
        } else {
          toast.error("Failed to update wishlist");
        }
      } catch(err) {
        console.error(err);
      }
    } else {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
      let exists = wishlist.find((item) => item._id === details._id)

      if (exists) {
        let updatedWishlist = wishlist.filter((item) => item._id !== details._id)
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
        setLiked(false)
        toast.success("Removed from Wishlist")
      } else {
        wishlist.push(details)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        setLiked(true)
        toast.success("Added to Wishlist")
      }
    }
  }

  // SUBMIT REVIEW
  const submitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to submit a review");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      if (res.ok) {
        toast.success("Review submitted successfully");
        setComment("");
        setRating(5);
        getDetails(); // refresh product and reviews
      } else {
        const error = await res.text();
        toast.error(error);
      }
    } catch(err) {
      console.error(err);
    }
  }

  if (!details) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-brand-surface flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-brand-border border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-brand-text-secondary font-medium">Loading premium experience...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="bg-brand-background min-h-screen pb-16">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="text-sm text-brand-text-secondary flex items-center gap-2 font-medium">
            <a href="/" className="hover:text-brand-text-primary transition">Home</a>
            <span>›</span>
            <span className="hover:text-brand-text-primary capitalize cursor-pointer transition">{details.category?.category || "Products"}</span>
            <span>›</span>
            <span className="text-brand-text-primary truncate w-48 md:w-auto">{details.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl p-12 flex items-center justify-center relative overflow-hidden group min-h-[300px] md:min-h-[400px] lg:min-h-[500px] shadow-premium">
                {/* Actions */}
                <div className="absolute top-6 right-6 flex flex-col gap-4 z-10">
                  <button
                    onClick={toggleWishlist}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300
                    ${liked ? "bg-brand-error/10 text-brand-error border-red-200 hover:bg-brand-error/20 hover:scale-105" : "bg-brand-background border-brand-border text-brand-text-secondary hover:text-brand-error hover:scale-105"}`}
                  >
                    <Heart size={22} fill={liked ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 rounded-full bg-brand-background border border-brand-border text-brand-text-secondary flex items-center justify-center transition-all duration-300 hover:text-brand-primary hover:scale-105"
                  >
                    <Share2 size={22} />
                  </button>
                </div>
                
                {details.offerPrice && (
                  <div className="absolute top-6 left-6 badge-error text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider z-10 shadow-premium">
                    Special Offer
                  </div>
                )}

                <img
                  src={details.imageURL}
                  alt={details.name}
                  className="max-h-[500px] w-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-8 bg-brand-surface p-8 rounded-3xl border border-brand-border shadow-premium">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-text-primary leading-tight tracking-tight mb-2">
                {details.name}
              </h1>
              
              <div className="flex items-center gap-4 text-sm mt-3 border-b border-brand-border pb-6">
                <div className="flex items-center text-brand-primary">
                  {"★".repeat(Math.round(details.averageRating || 5))}
                  <span className="text-gray-200">{"★".repeat(5 - Math.round(details.averageRating || 5))}</span>
                </div>
                <span className="text-brand-text-secondary font-medium hover:underline cursor-pointer">
                  {details.numReviews || 0} Ratings & Reviews
                </span>
              </div>
            </div>

            {/* PRICE */}
            <div>
              {details.offerPrice ? (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-brand-text-primary">₹{details.offerPrice}</span>
                  <span className="text-xl text-brand-text-secondary line-through mb-1">₹{details.price}</span>
                  <span className="text-brand-success font-bold mb-1.5 ml-2 bg-green-50 px-2 py-0.5 rounded text-sm border border-green-200">
                    {Math.round(((details.price - details.offerPrice) / details.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-black text-brand-text-primary">₹{details.price}</span>
              )}
              <p className="text-xs text-brand-text-secondary mt-2 font-medium">Inclusive of all taxes</p>
            </div>

            {/* VARIANTS */}
            <div className="space-y-6">
              {details.ram?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mb-3">RAM</h3>
                  <div className="flex gap-3 flex-wrap">
                    {details.ram.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSelectedRam(item)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all shadow-premium ${
                          selectedRam === item
                            ? "bg-brand-secondary text-brand-accent ring-2 ring-brand-accent font-bold"
                            : "border-brand-border text-brand-text-secondary hover:border-gray-400 bg-brand-surface"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {details.storage?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mb-3">Storage</h3>
                  <div className="flex gap-3 flex-wrap">
                    {details.storage.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSelectedStorage(item)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all shadow-premium ${
                          selectedStorage === item
                            ? "bg-brand-secondary text-brand-accent ring-2 ring-brand-accent font-bold"
                            : "border-brand-border text-brand-text-secondary hover:border-gray-400 bg-brand-surface"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {details.sizes?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mb-3">Size</h3>
                  <div className="flex gap-3 flex-wrap">
                    {details.sizes.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSelectedSize(item)}
                        className={`w-12 h-12 rounded-xl text-sm font-bold border-2 flex items-center justify-center transition-all shadow-premium ${
                          selectedSize === item
                            ? "bg-brand-secondary text-brand-accent ring-2 ring-brand-accent font-bold"
                            : "border-brand-border text-brand-text-secondary hover:border-gray-400 bg-brand-surface"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-8 space-y-4">
              <button
                onClick={addToCart}
                className="btn-primary w-full py-4 text-lg font-bold shadow-premium flex items-center justify-center gap-3"
              >
                Add to Cart
              </button>
              
              <div className="flex items-center justify-between py-4 border-y border-brand-border bg-brand-background px-4 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-text-primary">
                  <Truck size={18} className="text-brand-success" />
                  Free Delivery Available
                </div>
                <div className="text-xs text-brand-text-secondary">
                  Enter pincode to check
                </div>
              </div>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-brand-text-secondary font-medium bg-brand-surface border border-brand-border p-3 rounded-xl shadow-premium">
                <ShieldCheck size={20} className="text-brand-success" />
                1 Year Warranty
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-secondary font-medium bg-brand-surface border border-brand-border p-3 rounded-xl shadow-premium">
                <RotateCcw size={20} className="text-orange-500" />
                10 Days Replacement
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-secondary font-medium bg-brand-surface border border-brand-border p-3 rounded-xl shadow-premium col-span-2">
                <Check size={20} className="text-green-500" />
                100% Original & Quality Checked
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-6 border-t border-brand-border">
              <h3 className="text-lg font-bold text-brand-text-primary mb-3">Product Description</h3>
              <p className="text-brand-text-secondary leading-relaxed text-sm">
                The {details.name} is crafted to seamlessly blend into your lifestyle. Designed with uncompromising attention to detail, it delivers both exceptional quality and striking aesthetics for those who appreciate the finer things.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-brand-surface py-16 border-t border-brand-border mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews Summary */}
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-bold text-brand-text-primary mb-6">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-black text-brand-text-primary">{details.averageRating?.toFixed(1) || "5.0"}</div>
                <div className="flex flex-col">
                  <div className="flex text-brand-primary text-xl">
                    {"★".repeat(Math.round(details.averageRating || 5))}
                    <span className="text-gray-200">{"★".repeat(5 - Math.round(details.averageRating || 5))}</span>
                  </div>
                  <span className="text-sm text-brand-text-secondary font-medium">Based on {details.numReviews || 0} reviews</span>
                </div>
              </div>

              {/* Write Review Box */}
              <div className="bg-[#F9FAFB] p-6 rounded-2xl border border-brand-border mt-8">
                <h3 className="text-lg font-bold mb-2 text-brand-text-primary">Review this product</h3>
                <p className="text-sm text-brand-text-secondary mb-6">Share your experience with the Elegance community</p>
                {localStorage.getItem("token") ? (
                  <form onSubmit={submitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-brand-text-secondary mb-2">Overall Rating</label>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-3 border border-brand-border rounded-xl outline-none focus:border-brand-primary bg-brand-surface text-brand-text-primary"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-brand-text-secondary mb-2">Your Review</label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows="4"
                        className="w-full p-3 border border-brand-border rounded-xl outline-none focus:border-brand-primary bg-brand-surface text-brand-text-primary resize-none"
                        placeholder="What do you like or dislike?"
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-brand-primary text-[#FFFFFF] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition">
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-brand-surface rounded-xl border border-brand-border">
                    <p className="text-brand-text-secondary text-sm mb-3">Please log in to write a review.</p>
                    <a href="/login" className="inline-block bg-brand-primary text-[#FFFFFF] px-6 py-2 rounded-lg font-bold hover:brightness-110 transition">
                      Sign In
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-8">
              <h3 className="text-xl font-bold text-brand-text-primary mb-6">Recent Reviews</h3>
              {reviews.length === 0 ? (
                <div className="bg-[#F9FAFB] p-8 rounded-2xl border border-brand-border text-center">
                  <Star size={40} className="mx-auto text-brand-text-secondary mb-3" />
                  <p className="text-brand-text-primary font-medium text-lg">No reviews yet</p>
                  <p className="text-brand-text-secondary text-sm">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(rev => (
                    <div key={rev._id} className="bg-brand-surface p-6 rounded-2xl border border-brand-border shadow-premium">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-primary text-[#FFFFFF] rounded-full flex items-center justify-center font-bold">
                            {rev.userEmail.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-brand-text-primary block leading-none">{rev.userEmail.split('@')[0]}</span>
                            <span className="text-xs text-brand-text-secondary mt-1 block">Verified Purchase</span>
                          </div>
                        </div>
                        <span className="text-xs text-brand-text-secondary font-medium bg-brand-background px-2 py-1 rounded">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex text-brand-primary text-sm mb-3">
                        {"★".repeat(rev.rating)}
                        <span className="text-gray-200">{"★".repeat(5 - rev.rating)}</span>
                      </div>
                      <p className="text-brand-text-secondary text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage