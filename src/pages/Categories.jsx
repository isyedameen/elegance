import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from '../components/Navbar'
import { Monitor, Shirt, Home as HomeIcon, Gamepad2, Package, ChevronRight } from "lucide-react"

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Frontend hierarchy definition
  const GROUPS = [
    {
      id: "tech",
      name: "Tech & Electronics",
      icon: <Monitor size={36} className="text-brand-primary group-hover:scale-110 transition-transform duration-300" />,
      description: "Smartphones, laptops, and the latest gadgets.",
      keywords: ["electronics", "mobile", "laptop", "computer", "tech", "gadget"]
    },
    {
      id: "fashion",
      name: "Fashion & Beauty",
      icon: <Shirt size={36} className="text-brand-primary group-hover:scale-110 transition-transform duration-300" />,
      description: "Apparel, accessories, and skincare essentials.",
      keywords: ["fashion", "beauty", "clothing", "apparel", "makeup", "shoe", "wear"]
    },
    {
      id: "home",
      name: "Home & Lifestyle",
      icon: <HomeIcon size={36} className="text-brand-primary group-hover:scale-110 transition-transform duration-300" />,
      description: "Furniture, decor, and daily groceries.",
      keywords: ["home", "kitchen", "grocery", "food", "lifestyle", "decor", "furniture"]
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Gamepad2 size={36} className="text-brand-primary group-hover:scale-110 transition-transform duration-300" />,
      description: "Books, toys, games, and outdoor gear.",
      keywords: ["book", "toy", "game", "sport", "music", "entertainment"]
    }
  ]

  // Map backend categories into frontend groups
  const groupedCategories = GROUPS.map(group => {
    const matched = categories.filter(cat => 
      group.keywords.some(keyword => cat.category?.toLowerCase().includes(keyword))
    )
    return { ...group, subcategories: matched }
  })

  // Find orphans (categories that didn't match any group)
  const matchedIds = new Set(groupedCategories.flatMap(g => g.subcategories.map(c => c._id)))
  const orphans = categories.filter(c => !matchedIds.has(c._id))

  if (orphans.length > 0) {
    groupedCategories.push({
      id: "other",
      name: "Other Categories",
      icon: <Package size={36} className="text-brand-primary group-hover:scale-110 transition-transform duration-300" />,
      description: "Explore more from our catalog.",
      subcategories: orphans
    })
  }

  // To simulate the requested flow: Clicking a parent expands the list, or we just display them elegantly.
  const [expandedGroup, setExpandedGroup] = useState(null)

  return (
    <div className="bg-brand-background min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-brand-text-primary tracking-tight mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-brand-text-secondary max-w-2xl">
            Explore our curated collections. From the latest electronics to everyday essentials, find exactly what you're looking for.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {groupedCategories.map((group) => {
              if (group.subcategories.length === 0) return null;

              const isExpanded = expandedGroup === group.id

              return (
                <div 
                  key={group.id} 
                  className={`bg-brand-surface rounded-[2rem] overflow-hidden group relative shadow-premium hover:shadow-premium-hover cursor-pointer border-none`}
                >
                  {/* Luxury Card Face */}
                  <div 
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                    className="relative h-[300px] md:h-[400px] w-full flex flex-col items-center justify-center p-8 overflow-hidden bg-brand-surface border border-brand-border/60 rounded-[2rem]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="z-20 transform group-hover:-translate-y-4 transition-transform duration-500 text-center flex flex-col items-center">
                      <div className="w-24 h-24 mb-6 rounded-full bg-brand-background shadow-premium flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-brand-primary border border-brand-border/60">
                        {group.icon}
                      </div>
                      <h2 className="text-3xl font-black text-brand-text-primary group-hover:text-white transition-colors duration-500 font-display">
                        {group.name}
                      </h2>
                      <p className="text-brand-text-secondary mt-2 opacity-0 group-hover:opacity-100 group-hover:text-gray-200 transition-all duration-500 max-w-sm">
                        {group.description}
                      </p>
                    </div>

                    <div className="absolute top-6 right-6 bg-brand-primary text-white px-4 py-1.5 rounded-full z-20 text-xs font-bold tracking-wider shadow-premium border border-transparent">
                      {group.subcategories.length} ITEMS
                    </div>
                  </div>

                  {/* Subcategories Container */}
                  <div 
                    className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white ${
                      isExpanded ? 'max-h-[800px] opacity-100 border-t border-brand-border' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.subcategories.map(sub => (
                        <Link 
                          key={sub._id}
                          to={`/CategoryDetails/${sub._id}`}
                          className="flex items-center justify-between p-5 bg-brand-background border-none rounded-2xl hover:bg-brand-primary hover:text-white transition-all group/sub shadow-premium"
                        >
                          <span className="font-bold text-brand-text-primary group-hover/sub:text-white transition-colors">
                            {sub.category}
                          </span>
                          <ChevronRight size={20} className="text-brand-text-secondary group-hover/sub:text-brand-primary transition-colors group-hover/sub:translate-x-1 transform" />
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
