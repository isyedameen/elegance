import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit2, Trash2, Plus, Image as ImageIcon } from "lucide-react";

function ManageProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const getProducts = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?limit=1000`);
      let data = await res.json();
      setProducts(data.products || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    getProducts();
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Manage Products</h1>
          <p className="text-sm text-brand-text-secondary mt-1">View, edit, and delete products from your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-brand-border rounded-xl text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none w-64"
            />
          </div>
          <button 
            onClick={() => navigate("/admin/add-product")}
            className="bg-brand-primary hover:bg-[var(--brand-primary-hover)] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-premium flex items-center gap-2"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="bg-brand-surface rounded-[24px] shadow-premium overflow-hidden border-none p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-background text-xs uppercase tracking-wider text-brand-text-secondary font-bold font-display">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-background text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-text-secondary font-medium">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item._id} className="hover:bg-brand-background transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl border border-brand-border/50 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-premium">
                          {item.imageURL ? (
                            <img src={item.imageURL} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <ImageIcon size={20} className="text-brand-text-secondary" />
                          )}
                        </div>
                        <div className="font-bold text-brand-text-primary line-clamp-2 max-w-xs">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-background text-brand-text-secondary border border-brand-border/50 uppercase tracking-wide">
                        {item.category?.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.offerPrice ? (
                        <div className="flex flex-col">
                          <span className="font-black text-brand-primary">₹{item.offerPrice}</span>
                          <span className="text-xs text-brand-text-secondary line-through font-medium">₹{item.price}</span>
                        </div>
                      ) : (
                        <span className="font-black text-brand-primary">₹{item.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-success/10 text-brand-success border border-brand-success/20 uppercase tracking-wide">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/edit-product/${item._id}`)}
                          className="w-10 h-10 flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface rounded-xl transition shadow-premium border border-transparent hover:border-brand-border"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-10 h-10 flex items-center justify-center text-brand-text-secondary hover:text-brand-error hover:bg-brand-error/10 rounded-xl transition shadow-premium border border-transparent hover:border-red-100"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;