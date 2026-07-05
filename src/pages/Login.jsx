import toast from "react-hot-toast";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const nav = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      let data = null
      if (res.ok) {
        data = await res.json()
      }

      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        nav("/")
      } else {
        const error = await res.text()
        toast.error(error || "Login failed")
      }
    } catch (error) {
      toast.error("Server error. Please try again.")
    } finally {
      setLoading(false)
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-surface font-sans">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F1117] items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1117] via-[#1A1D27] to-brand-primary z-0 opacity-80"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay"></div>
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-8 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <span className="text-3xl font-black text-brand-primary font-display">E<span className="text-brand-primary">.</span></span>
          </div>
          <h2 className="text-5xl font-black text-white mb-6 font-display tracking-tight leading-tight">
            Welcome back to <br/><span className="text-brand-primary">Elegance.</span>
          </h2>
          <p className="text-brand-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            Discover a curated collection of premium products designed to elevate your lifestyle.
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
            <h2 className="text-3xl font-bold text-brand-text-primary">Sign in</h2>
            <p className="mt-2 text-sm text-brand-text-secondary">Please enter your details to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={login}>
            
            <div className="relative">
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-70 text-lg py-4"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-text-secondary">
              New to Elegance?{" "}
              <Link to="/register" className="font-bold text-brand-primary hover:text-brand-primary transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login