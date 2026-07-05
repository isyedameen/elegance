import toast from "react-hot-toast";
import { useState, useEffect } from "react"

function AddProduct() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")
  const [sizes, setSizes] = useState("")

  const getcategories = async () => {
    let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`)
    let data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    getcategories()
  }, [])

  const add = async (e) => {
    e.preventDefault()

  if (offerPrice && Number(offerPrice) > Number(price)) {
    alert ("Paisa korkada")
    return
  }

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price: Number(price), offerPrice: offerPrice ? Number(offerPrice):undefined  , imageURL, category,
          ram: ram ? ram.split(",") : [],
          storage: storage ? storage.split(",") : [],
          sizes: sizes ? sizes.split(",") : []
         }),
      })

      toast.success("Product Added")
      setName("")
      setPrice("")
      setImageURL("")
      setCategory("")
      setOfferPrice("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <form
        onSubmit={add}
        className="bg-brand-surface p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-brand-text-primary mb-6 text-center">
          Add Product
        </h2>

        <div className="relative mb-6 mt-4">
          <input
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Product Name"
            required
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="name" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Product Name</label>
        </div>

        <div className="relative mb-6">
          <input
            id="price"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="number"
            placeholder="Price"
            required
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="price" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Price</label>
        </div>

        <div className="relative mb-6">
          <input
            id="offerPrice"
            onChange={(e) => setOfferPrice(e.target.value)}
            value={offerPrice}
            type="number"
            placeholder="Offer Price (optional)"
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="offerPrice" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Offer Price (optional)</label>
        </div>

        <div className="relative mb-6">
          <input
            id="imageURL"
            onChange={(e) => setImageURL(e.target.value)}
            value={imageURL}
            type="text"
            placeholder="Image URL"
            required
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="imageURL" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Image URL</label>
        </div>

        <div className="relative mb-6">
          <input
            id="ram"
            onChange={(e) => setRam(e.target.value)}
            value={ram}
            type="text"
            placeholder="RAM (8GB,12GB)"
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="ram" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">RAM (Comma separated)</label>
        </div>

        <div className="relative mb-6">
          <input
            id="storage"
            onChange={(e) => setStorage(e.target.value)}
            value={storage}
            type="text"
            placeholder="Storage (128GB,256GB)"
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="storage" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Storage (Comma separated)</label>
        </div>

        <div className="relative mb-6">
          <input
            id="sizes"
            onChange={(e) => setSizes(e.target.value)}
            value={sizes}
            type="text"
            placeholder="Sizes (S,M,L or 28,30)"
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="sizes" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Sizes (Comma separated)</label>
        </div>

        {/* Category Dropdown */}
        <div className="mb-6">
          <div className="relative">
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
              className="w-full appearance-none px-4 py-3 border border-brand-border rounded-xl bg-brand-surface focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition font-medium"
            >
              <option value="" disabled hidden>Select Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-text-secondary">▼</div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full py-3.5 text-lg"
        >
          Add Product
        </button>
      </form>
    </div>
  )
}

export default AddProduct