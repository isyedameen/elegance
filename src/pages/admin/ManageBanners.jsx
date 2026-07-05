import toast from "react-hot-toast";
import { useEffect, useState } from "react"
import { Edit2, Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react"

function ManageBanners() {
  const [banners, setBanners] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageURL: "",
    link: "",
    product: "",
    isActive: true
  })

  const fetchBanners = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/banners`)
      let data = await res.json()
      setBanners(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load banners")
    }
  }

  const fetchProducts = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`)
      let data = await res.json()
      setProducts(data.products || data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    Promise.all([fetchBanners(), fetchProducts()]).then(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.imageURL) {
      toast.error("Title and Image URL are required")
      return
    }

    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/banners`
      let method = "POST"

      if (isEditing) {
        url = `${import.meta.env.VITE_API_BASE_URL}/banners/${editId}`
        method = "PUT"
      }

      const payload = { ...formData }
      if (!payload.product) delete payload.product

      let res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(isEditing ? "Banner updated successfully" : "Banner created successfully")
        resetForm()
        fetchBanners()
      } else {
        toast.error("Operation failed")
      }
    } catch (error) {
      console.error(error)
      toast.error("Server error")
    }
  }

  const handleEdit = (banner) => {
    setIsEditing(true)
    setEditId(banner._id)
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      imageURL: banner.imageURL || "",
      link: banner.link || "",
      product: banner.product?._id || "",
      isActive: banner.isActive
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/banners/${id}`, { method: "DELETE" })
      toast.success("Banner deleted")
      fetchBanners()
    } catch (error) {
      toast.error("Failed to delete banner")
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      toast.success(`Banner ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchBanners()
    } catch (error) {
      toast.error("Status update failed")
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditId(null)
    setFormData({
      title: "",
      subtitle: "",
      imageURL: "",
      link: "",
      product: "",
      isActive: true
    })
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text-primary">Manage Banners</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Create and manage promotional banners for your homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Banner Form */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface rounded-2xl shadow-premium border border-brand-border p-6 sticky top-24">
            <h2 className="text-lg font-bold text-brand-text-primary mb-6 flex items-center gap-2">
              <Plus size={18} className="text-brand-primary" />
              {isEditing ? "Edit Banner" : "Create New Banner"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Summer Sale 50% Off"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. Upgrade your lifestyle today"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Image URL *</label>
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm"
                  required
                />
                {formData.imageURL && (
                  <div className="mt-3 relative h-24 bg-brand-background rounded-lg overflow-hidden border border-brand-border">
                    <img src={formData.imageURL} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Link (Optional)</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="e.g. /category/electronics"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Link to Product (Optional)</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm bg-brand-surface"
                >
                  <option value="">-- No specific product --</option>
                  {Array.isArray(products) && products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-surface after:border-brand-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-secondary"></div>
                  <span className="ml-3 text-sm font-medium text-brand-text-secondary">Set Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-brand-border">
                <button type="submit" className="flex-1 bg-brand-primary text-white py-2.5 rounded-xl font-bold hover:bg-[var(--brand-primary-hover)] transition shadow-premium text-sm">
                  {isEditing ? "Update Banner" : "Save Banner"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="flex-1 bg-brand-surface border border-brand-border text-brand-text-secondary py-2.5 rounded-xl font-bold hover:bg-brand-background transition text-sm">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Banners List */}
        <div className="lg:col-span-2">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin"></div>
             </div>
          ) : banners.length === 0 ? (
            <div className="bg-brand-surface rounded-2xl shadow-premium border border-brand-border p-12 text-center">
              <ImageIcon size={48} className="text-brand-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-text-primary mb-1">No Banners Found</h3>
              <p className="text-brand-text-secondary text-sm">Create your first promotional banner using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner._id} className={`bg-brand-surface rounded-2xl shadow-premium border ${banner.isActive ? 'border-brand-border' : 'border-brand-border opacity-70 grayscale'} overflow-hidden transition-all hover:shadow-premium-hover`}>
                  
                  <div className="h-40 relative group overflow-hidden bg-brand-surface">
                    <img src={banner.imageURL} alt={banner.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <button 
                        onClick={() => toggleActive(banner._id, banner.isActive)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-premium flex items-center gap-1 ${banner.isActive ? 'badge-success' : 'bg-gray-600 text-white'}`}
                      >
                        {banner.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {banner.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-brand-text-primary text-lg leading-tight mb-1">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm text-brand-text-secondary line-clamp-2">{banner.subtitle}</p>}
                    
                    {banner.product && (
                      <p className="text-xs text-brand-primary font-medium mt-3 flex items-center gap-1 bg-brand-primary/10 w-fit px-2 py-1 rounded">
                        Linked: {banner.product.name}
                      </p>
                    )}
                    
                    <div className="flex gap-2 mt-5 pt-4 border-t border-brand-border">
                      <button 
                        onClick={() => handleEdit(banner)}
                        className="flex-1 flex justify-center items-center gap-2 bg-green-50 text-brand-primary py-2 rounded-lg font-medium hover:bg-green-100 transition text-sm"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(banner._id)}
                        className="flex-1 flex justify-center items-center gap-2 bg-brand-error/10 text-brand-error py-2 rounded-lg font-medium hover:bg-brand-error/20 transition text-sm"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ManageBanners