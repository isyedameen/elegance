import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("")
  const [imageURL, setImageURL] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([])
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")
  const [sizes, setSizes] = useState("")

  // FETCH SINGLE PRODUCT
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)    
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setPrice(data.price);
        setOfferPrice(data.offerPrice || "")
        setImageURL(data.imageURL);
        setCategory(data.category?._id || data.category);
        setRam(data.ram?.join(",") || "")
        setStorage(data.storage?.join(",") || "")
        setSizes(data.sizes?.join(",") || "")
      });
  }, [id]);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`)
    .then(res => res.json())
    .then(data => setCategories(data));
}, []);

  // UPDATE PRODUCT
  const handleUpdate = async () => {

    if (offerPrice && Number(offerPrice) > Number(price)){
      toast.error("Paisa korkada")
      return
    }

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price:Number(price),
        offerPrice:offerPrice ? Number(offerPrice) : undefined,
        imageURL,
        category,

        ram: ram ? ram.split(",") : [],
        storage: storage ? storage.split(",") : [],
        sizes: sizes ? sizes.split(",") : []
      }),
    });

    toast.success("Product update aayi!");
    navigate("/admin/manage-products");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background px-4">

      <div className="w-full max-w-md bg-brand-surface p-6 rounded-2xl shadow-premium border">

        <h1 className="text-2xl font-semibold text-brand-text-primary mb-6 text-center">
          Edit Product
        </h1>

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="input-base mb-4"
        />

        {/* PRICE */}
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="input-base mb-4"
        />

        <input
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          placeholder="Offer Price"
          className="input-base mb-4"
        />

        {/* IMAGE */}
        <input
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder="Image URL"
          className="input-base mb-4"
        />

<input
  value={ram}
  onChange={(e) => setRam(e.target.value)}
  placeholder="RAM (8GB,12GB)"
  className="input-base mb-4"
/>

<input
  value={storage}
  onChange={(e) => setStorage(e.target.value)}
  placeholder="Storage (128GB,256GB)"
  className="input-base mb-4"
/>

<input
  value={sizes}
  onChange={(e) => setSizes(e.target.value)}
  placeholder="Sizes (S,M,L or 28,30)"
  className="input-base mb-4"
/>

        <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="input-base mb-5"
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.category}
    </option>
  ))}
</select>

        <button
          onClick={handleUpdate}
          className="btn-primary w-full text-lg mt-2"
        >
          Update Product
        </button>

      </div>
    </div>
  );
}

export default EditProduct; 