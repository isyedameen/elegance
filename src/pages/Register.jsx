import toast from "react-hot-toast";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const nav = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const register = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.text()

      if (res.ok) {
        toast.success("Registered Successfully")
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        nav("/login")
      } else {
        toast.error(data || "Registration failed")
      }
    } catch (error) {
      toast.error("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-surface font-sans">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F1117] items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1117] via-[#1A1D27] to-brand-primary z-0 opacity-80"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay"></div>
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-8 transform rotate-6 hover:rotate-0 transition-transform duration-500">
            <span className="text-3xl font-black text-brand-primary font-display">E<span className="text-brand-primary">.</span></span>
          </div>
          <h2 className="text-5xl font-black text-white mb-6 font-display tracking-tight leading-tight">
            Join <br/><span className="text-brand-primary">Elegance.</span>
          </h2>
          <p className="text-brand-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            Create an account to unlock exclusive offers, faster checkout, and a seamless shopping experience.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-brand-background">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-10">
            <Link to="/" className="inline-block lg:hidden mb-8">
              <span className="text-brand-text-primary text-3xl font-black tracking-tighter font-display">
                Elegance<span className="text-brand-primary">.</span>
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-brand-text-primary">Create Account</h2>
            <p className="mt-2 text-sm text-brand-text-secondary">Join us to start shopping seamlessly.</p>
          </div>

          <form className="space-y-6" onSubmit={register}>
            
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-base peer placeholder-transparent"
                placeholder="John Doe"
              />
              <label htmlFor="name" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                Full Name
              </label>
            </div>

            <div className="relative mt-6">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base peer placeholder-transparent"
                placeholder="john@example.com"
              />
              <label htmlFor="email" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                Email address
              </label>
            </div>

            <div className="relative mt-6">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-base peer placeholder-transparent"
                placeholder="••••••••"
              />
              <label htmlFor="password" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                Password
              </label>
            </div>

            <div className="relative mt-6">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-base peer placeholder-transparent"
                placeholder="••••••••"
              />
              <label htmlFor="confirmPassword" className="absolute left-4 -top-2.5 bg-brand-background px-1 text-sm text-brand-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-text-secondary peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-brand-primary font-bold">
                Confirm Password
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-70 text-lg py-4"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-text-secondary">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand-primary hover:text-brand-primary transition-colors">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Register