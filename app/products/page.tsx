"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { logEvent, getProducts } from "@/lib/firebase-utils"

interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
  discountPercentage?: number
  category: string
  image: string
  images?: string[]
  description: string
  buyUrl?: string
}

const categories = ["ALL", "DIGITAL PRODUCTS", "SHOES", "CLOTHING", "ACCESSORIES", "NEW ARRIVALS"]

export default function ProductsPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [])

  // Auto-rotate featured product every 15 seconds
  useEffect(() => {
    if (products.length === 0) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % products.length)
        setIsTransitioning(false)
      }, 500)
    }, 15000)

    return () => clearInterval(interval)
  }, [products.length])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string) => {
    logEvent('filter_products', {
      filter_type: 'category',
      filter_value: category
    })
    setSelectedCategory(category)
  }

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      product.name.toLowerCase().includes(selectedCategory.toLowerCase())
    
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  const featuredProduct = products[currentFeaturedIndex]

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="products" />

      {/* Featured Hero Section */}
      {featuredProduct && (
        <section className="px-8 py-16 bg-gray-50 dark:bg-black border-b-2 border-black dark:border-white">
          <div className="max-w-7xl mx-auto">
            <div
              className={`transition-all duration-700 mb-8 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium tracking-widest uppercase text-gray-500 dark:text-gray-400">
                  FEATURED PRODUCT
                </h2>
                <div className="flex gap-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsTransitioning(true)
                        setTimeout(() => {
                          setCurrentFeaturedIndex(index)
                          setIsTransitioning(false)
                        }, 500)
                      }}
                      className={`h-2 transition-all duration-300 cursor-pointer hover:bg-gray-500 dark:hover:bg-gray-400 ${
                        index === currentFeaturedIndex
                          ? "bg-black dark:bg-white w-8"
                          : "bg-gray-300 dark:bg-gray-600 w-2"
                      }`}
                      aria-label={`View product ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`grid lg:grid-cols-2 gap-12 transition-all duration-500 ${
                isTransitioning
                  ? "opacity-0 translate-y-4 scale-95"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
            >
              {/* Featured Product Image */}
              <div
                className="cursor-pointer group bg-white dark:bg-black border-2 border-black dark:border-white overflow-hidden"
                onClick={() => window.location.href = `/products/${featuredProduct.id}`}
              >
                <ImageWithLoading
                  src={featuredProduct.image || "/placeholder.svg"}
                  alt={featuredProduct.name}
                  className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Featured Product Info */}
              <div className="flex flex-col justify-center space-y-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                  {featuredProduct.category}
                </p>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
                  {featuredProduct.name}
                </h1>

                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {featuredProduct.description}
                </p>

                <div className="py-4">
                  {featuredProduct.originalPrice && featuredProduct.discountPercentage ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-black dark:text-white">
                          {featuredProduct.price}
                        </span>
                        <span className="text-2xl text-gray-400 line-through">
                          {featuredProduct.originalPrice}
                        </span>
                      </div>
                      <span className="inline-block bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-bold tracking-wider">
                        SAVE {featuredProduct.discountPercentage}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold">
                      {featuredProduct.price}
                    </span>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => window.location.href = `/products/${featuredProduct.id}`}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-6 transition-all duration-300 hover:scale-105 flex-1"
                  >
                    VIEW DETAILS
                  </Button>
                  {featuredProduct.buyUrl && (
                    <Button
                      onClick={() => {
                        logEvent('purchase_click', {
                          item_id: featuredProduct.id,
                          item_name: featuredProduct.name,
                          page: 'products'
                        })
                        window.open(featuredProduct.buyUrl, '_blank', 'noopener,noreferrer')
                      }}
                      variant="outline"
                      className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-sm font-medium tracking-widest uppercase px-8 py-6 transition-all duration-300 hover:scale-105"
                    >
                      BUY NOW
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div
            className={`mb-12 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h2 className="text-3xl font-medium tracking-widest uppercase mb-8">
              ALL PRODUCTS
            </h2>

            {/* Search Bar */}
            <div className="flex items-center bg-gray-50 dark:bg-black px-4 py-4 border-2 border-black dark:border-white mb-6">
              <Search className="w-5 h-5 text-gray-400 dark:text-white mr-3" />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none placeholder-gray-400 dark:placeholder-gray-400 w-full font-mono tracking-wider text-black dark:text-white"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className={`border-2 text-xs font-medium tracking-widest uppercase bg-transparent px-6 py-3 transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
              <p className="text-sm font-mono tracking-widest uppercase text-gray-500 dark:text-white">
                LOADING PRODUCTS...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group cursor-pointer transition-all duration-700 ${
                    isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                  onClick={() => window.location.href = `/products/${product.id}`}
                >
                  <div className="border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black">
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-50 dark:bg-black">
                      <ImageWithLoading
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.discountPercentage && (
                        <div className="absolute top-4 right-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-bold tracking-wider">
                          -{product.discountPercentage}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono mb-2">
                          {product.category}
                        </p>
                        <h3 className="text-xl font-bold tracking-wide mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          {product.originalPrice && product.discountPercentage ? (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-black dark:text-white">
                                {product.price}
                              </span>
                              <span className="text-lg text-gray-400 line-through">
                                {product.originalPrice}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold">
                              {product.price}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.location.href = `/products/${product.id}`
                            }}
                            className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-xs font-medium tracking-widest uppercase py-4 transition-all duration-300 hover:scale-105"
                          >
                            VIEW
                          </Button>
                          {product.buyUrl && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                logEvent('purchase_click', {
                                  item_id: product.id,
                                  item_name: product.name,
                                  page: 'products'
                                })
                                window.open(product.buyUrl, '_blank', 'noopener,noreferrer')
                              }}
                              variant="outline"
                              className="flex-1 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-xs font-medium tracking-widest uppercase py-4 transition-all duration-300 hover:scale-105"
                            >
                              BUY
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-white text-sm font-mono tracking-widest uppercase">
                NO PRODUCTS FOUND
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 px-8 py-16 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-widest uppercase">
            © 2025 LEGACY, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
