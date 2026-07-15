import toast from "react-hot-toast";
import { useState } from "react"

function AddCategory() {
  const [category, setCategory] = useState("")

  const add = async (e) => {
    e.preventDefault()

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })

      toast.success("Category Added")
      setCategory("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <form
        onSubmit={add}
        className="bg-brand-surface p-8 rounded-2xl shadow-premium w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-brand-text-primary mb-6 text-center">
          Add Category
        </h2>

        <div className="relative mb-6 mt-4">
          <input
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            type="text"
            placeholder="Category Name"
            required
            className="input-base peer placeholder-transparent"
          />
          <label htmlFor="category" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Category Name</label>
        </div>
    
        <button
          type="submit"
          className="btn-primary w-full mt-5 text-lg"
        >
          Add Category cheyy
        </button>
      </form>
    </div>
  )
}

export default AddCategory