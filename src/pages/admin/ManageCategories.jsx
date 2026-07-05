import { useState, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom";

function ManageCategories() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
    let data = await res.json();
    setCategories(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Nink delete aakanaada?")) return
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`, {
      method: "DELETE"
    })

    getCategories()
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>

      <div className="space-y-4">
        {categories.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-brand-surface p-5 rounded-[24px] shadow-premium border-none transition hover:bg-brand-background"
          >
            <p className="text-brand-text-primary font-bold text-lg">
              {item.category}
            </p>

            <div className="flex gap-3">
              {/* Edit */}
              <button
              onClick={() => navigate(`/admin/edit-category/${item._id}`)}
              className="px-5 py-2 text-sm rounded-xl bg-brand-background border border-brand-border/50 font-bold hover:bg-brand-surface transition">
                Edit
              </button>

              {/* Delete */}
              <button
              onClick={()=> handleDelete(item._id)}
              className="px-5 py-2 text-sm rounded-xl bg-brand-error/10 text-brand-error font-bold hover:bg-brand-error/20 transition border border-red-100">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCategories