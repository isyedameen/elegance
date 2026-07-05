import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data.category));
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });

    toast.success("Category update aayi.. Poyi check!!");
    navigate("/admin/manage-categories");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background px-4">
      <div className="w-full max-w-md bg-brand-surface p-6 rounded-2xl shadow-premium border border-brand-border">
        <h1 className="text-2xl font-semibold text-brand-text-primary mb-6 text-center">
          Edit Category
        </h1>

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
          onClick={handleUpdate}
          className="btn-primary w-full text-lg mt-2"
        >
          Update Cheyy
        </button>
      </div>
    </div>
  );
}

export default EditCategory;