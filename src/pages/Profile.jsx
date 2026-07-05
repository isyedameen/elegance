import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import BASE_URL from "../api";
import { User, MapPin, Package, Heart, LogOut, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();

  // Profile Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    house: "", city: "", state: "", pincode: "", country: "", label: "Home"
  });

  const token = localStorage.getItem("token");

  const getProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setPhone(data.phone || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getProfile();
    }
    window.scrollTo(0, 0);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone })
      });
      if (res.ok) {
        toast.success("Profile updated successfully");
        getProfile();
        // update localstorage user
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({...localUser, name}));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/users/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      if (res.ok) {
        toast.success("Address saved successfully");
        setShowAddressForm(false);
        setAddressData({ house: "", city: "", state: "", pincode: "", country: "", label: "Home" });
        getProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/users/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Address deleted");
        getProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="bg-brand-background min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-4 border-brand-border border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-background min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR DASHBOARD */}
          <div className="lg:col-span-3">
            <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border overflow-hidden sticky top-24">
              
              <div className="p-6 border-b border-brand-border bg-gray-900 text-white text-center">
                <div className="w-20 h-20 bg-brand-surface/20 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-white/30">
                  <span className="text-3xl font-bold">{user.name ? user.name.charAt(0).toUpperCase() : <User size={30} />}</span>
                </div>
                <h2 className="text-lg font-bold truncate">{user.name || "Customer"}</h2>
                <p className="text-sm text-brand-text-secondary truncate mt-1">{user.email}</p>
              </div>

              <div className="p-3">
                <button 
                  onClick={() => setActiveTab("info")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === "info" ? "bg-brand-background text-brand-text-primary shadow-premium" : "text-brand-text-secondary hover:bg-brand-background"}`}
                >
                  <User size={18} /> Personal Info
                  {activeTab === "info" && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button 
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === "addresses" ? "bg-brand-background text-brand-text-primary shadow-premium" : "text-brand-text-secondary hover:bg-brand-background"}`}
                >
                  <MapPin size={18} /> Manage Addresses
                  {activeTab === "addresses" && <ChevronRight size={16} className="ml-auto" />}
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9">
            <div className="bg-brand-surface rounded-3xl shadow-premium border border-brand-border p-8 min-h-[500px]">
              
              {/* PROFILE INFO TAB */}
              {activeTab === "info" && (
                <div className="max-w-2xl animate-[fadeIn_0.3s_ease-out]">
                  <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Personal Information</h2>
                  <p className="text-brand-text-secondary mb-8">Manage your details and keep your profile up to date.</p>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={user.email} 
                        disabled 
                        className="w-full px-4 py-3 border border-brand-border rounded-xl bg-brand-background text-brand-text-secondary cursor-not-allowed" 
                      />
                      <p className="text-xs text-brand-text-secondary mt-2">Email address cannot be changed.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="relative">
                        <input 
                          type="text" 
                          id="fullName"
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="John Doe" 
                          className="input-base peer placeholder-transparent" 
                        />
                        <label htmlFor="fullName" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                          Full Name
                        </label>
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="text" 
                          id="phoneNumber"
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder="9876543210" 
                          className="input-base peer placeholder-transparent" 
                        />
                        <label htmlFor="phoneNumber" className="absolute left-4 -top-2.5 bg-brand-surface px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                          Phone Number
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="mt-4 bg-brand-primary text-[#FFFFFF] px-8 py-3.5 rounded-xl hover:brightness-110 transition font-bold shadow-premium active:scale-[0.98]">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* SAVED ADDRESSES TAB */}
              {activeTab === "addresses" && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-text-primary mb-1">Manage Addresses</h2>
                      <p className="text-brand-text-secondary">Add or remove your delivery addresses.</p>
                    </div>
                    {!showAddressForm && (
                      <button 
                        onClick={() => setShowAddressForm(true)} 
                        className="bg-brand-primary text-[#FFFFFF] px-6 py-2.5 rounded-xl font-bold hover:brightness-110 transition shadow-premium"
                      >
                        + Add New Address
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="bg-brand-background p-6 sm:p-8 rounded-2xl mb-8 border border-brand-border">
                      <h3 className="font-bold text-brand-text-primary mb-6">Add a new delivery address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="md:col-span-2 relative">
                          <input type="text" id="addHouse" required value={addressData.house} onChange={e => setAddressData({...addressData, house: e.target.value})} placeholder="House" className="input-base peer placeholder-transparent" />
                          <label htmlFor="addHouse" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">House / Flat / Block</label>
                        </div>
                        <div className="relative mt-2">
                          <input type="text" id="addCity" required value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} placeholder="City" className="input-base peer placeholder-transparent" />
                          <label htmlFor="addCity" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">City</label>
                        </div>
                        <div className="relative mt-2">
                          <input type="text" id="addState" required value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} placeholder="State" className="input-base peer placeholder-transparent" />
                          <label htmlFor="addState" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">State</label>
                        </div>
                        <div className="relative mt-2">
                          <input type="text" id="addPincode" required value={addressData.pincode} onChange={e => setAddressData({...addressData, pincode: e.target.value})} placeholder="Pincode" className="input-base peer placeholder-transparent" />
                          <label htmlFor="addPincode" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Pincode</label>
                        </div>
                        <div className="relative mt-2">
                          <input type="text" id="addCountry" required value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})} placeholder="Country" className="input-base peer placeholder-transparent" />
                          <label htmlFor="addCountry" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">Country</label>
                        </div>
                        <div className="md:col-span-2 mt-2">
                          <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-2">Address Type</label>
                          <div className="flex gap-3">
                            {["Home", "Work", "Other"].map(type => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setAddressData({...addressData, label: type})}
                                className={`px-5 py-2 rounded-lg font-medium text-sm transition border ${addressData.label === type ? "border-brand-secondary bg-brand-primary text-[#FFFFFF]" : "border-brand-border bg-brand-surface text-brand-text-secondary hover:border-gray-400"}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-8">
                        <button type="submit" className="bg-brand-primary text-[#FFFFFF] px-8 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-premium">Save Address</button>
                        <button type="button" onClick={() => setShowAddressForm(false)} className="bg-brand-surface border border-brand-border text-brand-text-secondary px-8 py-3 rounded-xl font-bold hover:bg-brand-background transition">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses?.length === 0 && !showAddressForm && (
                      <div className="col-span-full py-10 text-center text-brand-text-secondary bg-brand-background rounded-2xl border border-dashed border-brand-border">
                        No saved addresses found.
                      </div>
                    )}
                    {user.addresses?.map(addr => (
                      <div key={addr._id} className="border border-brand-border p-6 rounded-2xl relative hover:border-brand-primary transition">
                        <span className="bg-brand-surface text-brand-text-primary text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-4 inline-block">
                          {addr.label}
                        </span>
                        <div className="text-brand-text-primary leading-relaxed text-sm mb-4">
                          <p className="font-semibold text-base mb-1">{user.name}</p>
                          <p>{addr.house}</p>
                          <p>{addr.city}, {addr.state} {addr.pincode}</p>
                          <p>{addr.country}</p>
                          {user.phone && <p className="mt-2 text-brand-text-secondary">Phone: {user.phone}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteAddress(addr._id)} 
                          className="text-brand-error hover:text-red-700 text-sm font-bold uppercase tracking-wide"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
