"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Instagram, Youtube } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { logEvent, getSocialMediaUrls, getProducts } from '@/lib/firebase-utils'

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

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

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [socialMedia, setSocialMedia] = useState({
    instagram: "https://instagram.com/legacy",
    tiktok: "https://tiktok.com/@legacy", 
    youtube: "https://youtube.com/@legacy"
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    
    loadSocialMedia()
    loadProducts()
    
    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate products every 15 seconds
  useEffect(() => {
    if (products.length === 0) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length)
        setIsTransitioning(false)
      }, 500)
    }, 15000)

    return () => clearInterval(interval)
  }, [products.length])

  const loadProducts = async () => {
    try {
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadSocialMedia = async () => {
    try {
      const urls = await getSocialMediaUrls()
      setSocialMedia(urls)
    } catch (error) {
      console.error('Error loading social media URLs:', error)
    }
  }

  const handleShopNowClick = () => {
    logEvent('cta_click', {
      cta_name: 'shop_now',
      page: 'home'
    })
    window.location.href = '/products'
  }

  const handleAboutClick = () => {
    logEvent('cta_click', {
      cta_name: 'about_us',
      page: 'home'
    })
    window.location.href = '/about'
  }

  const handleSocialClick = (platform: string, url: string) => {
    logEvent('social_click', {
      platform,
      page: 'home'
    })
    window.open(url, '_blank')
  }

  const handleProductClick = () => {
    const product = products[currentProductIndex]
    if (product) {
      logEvent('product_click', {
        item_id: product.id,
        item_name: product.name,
        page: 'home'
      })
      window.location.href = `/products/${product.id}`
    }
  }

  const currentProduct = products[currentProductIndex]

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="home" />

      {/* Main Landing Page Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-16">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Brand & Info */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <h1 className="text-7xl md:text-9xl font-bold tracking-widest uppercase mb-6 leading-none">
                LEGACY
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-mono tracking-wider mb-4 leading-relaxed">
                PREMIUM PRODUCTS.<br />
                EXCEPTIONAL QUALITY.<br />
                TIMELESS STYLE.
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                Discover our curated collection of premium products designed for those who appreciate quality and craftsmanship. Each item is carefully selected to meet our exceptional standards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-6 transition-all duration-300 hover:scale-105"
                  onClick={handleShopNowClick}
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-sm font-medium tracking-widest uppercase bg-transparent px-8 py-6 transition-all duration-300 hover:scale-105"
                  onClick={handleAboutClick}
                >
                  ABOUT US
                </Button>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500 dark:text-gray-400">
                  FOLLOW US
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleSocialClick('instagram', socialMedia.instagram)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialClick('tiktok', socialMedia.tiktok)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialClick('youtube', socialMedia.youtube)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Product Showcase */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="bg-gray-50 dark:bg-gray-900 p-8 border-2 border-black dark:border-white relative overflow-hidden">
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium tracking-widest uppercase">
                    FEATURED PRODUCT
                  </h2>
                  <div className="flex gap-2">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setCurrentProductIndex(index)
                            setIsTransitioning(false)
                          }, 500)
                        }}
                        className={`h-2 transition-all duration-300 cursor-pointer hover:bg-gray-500 ${
                          index === currentProductIndex
                            ? "bg-black dark:bg-white w-8"
                            : "bg-gray-300 dark:bg-gray-600 w-2"
                        }`}
                        aria-label={`View product ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {currentProduct ? (
                  <div
                    className={`transition-all duration-500 ${
                      isTransitioning
                        ? "opacity-0 translate-y-4 scale-95"
                        : "opacity-100 translate-y-0 scale-100"
                    }`}
                  >
                    <div
                      className="relative mb-6 overflow-hidden cursor-pointer group bg-white dark:bg-black"
                      onClick={handleProductClick}
                    >
                      <ImageWithLoading
                        src={currentProduct.image || "/placeholder.svg"}
                        alt={currentProduct.name}
                        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-lg font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 px-6 py-3">
                          VIEW DETAILS
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-medium tracking-wide mb-2">
                          {currentProduct.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                          {currentProduct.category}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {currentProduct.description}
                      </p>

                      <div className="flex items-end justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          {currentProduct.originalPrice && currentProduct.discountPercentage ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-red-600 dark:text-red-500">
                                  {currentProduct.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                  {currentProduct.originalPrice}
                                </span>
                              </div>
                              <span className="inline-block text-xs bg-red-600 text-white px-3 py-1 font-bold tracking-wider">
                                SAVE {currentProduct.discountPercentage}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-3xl font-bold">
                              {currentProduct.price}
                            </span>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => {
                            if (currentProduct.buyUrl) {
                              logEvent('purchase_click', {
                                item_id: currentProduct.id,
                                item_name: currentProduct.name,
                                price: currentProduct.price,
                                page: 'home'
                              })
                              window.open(currentProduct.buyUrl, '_blank', 'noopener,noreferrer')
                            } else {
                              handleProductClick()
                            }
                          }}
                          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:scale-105"
                        >
                          {currentProduct.buyUrl ? 'BUY NOW' : 'VIEW PRODUCT'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-mono tracking-widest uppercase">
                      NO PRODUCTS AVAILABLE
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Add products in the admin panel to display them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 px-8 py-8 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-widest uppercase">
            © 2025 LEGACY, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
