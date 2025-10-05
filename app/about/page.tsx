"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { getAboutContent, getCompanyRules } from "@/lib/firebase-utils"
import { Target, Users, Award, Globe, Heart, TrendingUp, Shield, Sparkles } from "lucide-react"

export default function AboutPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [companyRules, setCompanyRules] = useState<string[]>([])
  const [aboutContent, setAboutContent] = useState({
    heroTitle: "ABOUT LEGACY",
    heroDescription: "WE ARE PIONEERS IN THE FUSION OF FASHION AND TECHNOLOGY, CREATING UNPRECEDENTED SHOPPING EXPERIENCES THAT BRIDGE THE GAP BETWEEN DIGITAL AND PHYSICAL REALITY.",
    storyTitle: "OUR STORY",
    storyContent: [
      "Founded in 2010, LEGACY emerged from a simple yet revolutionary idea: what if technology could make fashion more personal, more accessible, and more exciting than ever before?",
      "We started as a small team of fashion enthusiasts and tech innovators, united by a shared vision of transforming how people discover, try on, and experience clothing in the digital age.",
      "Today, we're proud to be at the forefront of AI-powered fashion technology, serving millions of customers worldwide with our innovative try-on experiences and premium product offerings."
    ],
    missionTitle: "OUR MISSION",
    missionContent: "TO DEMOCRATIZE FASHION BY MAKING IT MORE ACCESSIBLE, PERSONAL, AND SUSTAINABLE THROUGH INNOVATIVE TECHNOLOGY, WHILE MAINTAINING THE HIGHEST STANDARDS OF QUALITY AND CUSTOMER EXPERIENCE.",
    values: [
      {
        title: "INNOVATION",
        description: "We push the boundaries of fashion technology with cutting-edge design and forward-thinking solutions."
      },
      {
        title: "COMMUNITY", 
        description: "Building a global community of fashion enthusiasts who share our passion for style and innovation."
      },
      {
        title: "QUALITY",
        description: "Every product is crafted with the highest standards of quality, durability, and attention to detail."
      },
      {
        title: "SUSTAINABILITY",
        description: "Committed to sustainable fashion practices and reducing our environmental impact."
      }
    ]
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadCompanyRules()
    loadAboutContent()
  }, [])

  const loadAboutContent = async () => {
    try {
      const content = await getAboutContent()
      if (content) {
        setAboutContent(content)
      }
    } catch (error) {
      console.error('Error loading about content:', error)
    }
  }

  const loadCompanyRules = async () => {
    try {
      const rules = await getCompanyRules()
      if (rules && rules.length > 0) {
        setCompanyRules(rules)
      } else {
        const defaultRules = [
          "All products must meet our premium quality standards before listing",
          "Customer data privacy and security is our top priority",
          "We maintain sustainable and ethical sourcing practices",
          "Innovation and customer experience drive all our decisions",
          "We provide honest and transparent product descriptions"
        ]
        setCompanyRules(defaultRules)
      }
    } catch (error) {
      console.error('Error loading company rules:', error)
      const defaultRules = [
        "All products must meet our premium quality standards before listing",
        "Customer data privacy and security is our top priority",
        "We maintain sustainable and ethical sourcing practices",
        "Innovation and customer experience drive all our decisions",
        "We provide honest and transparent product descriptions"
      ]
      setCompanyRules(defaultRules)
    }
  }

  const getValueIcon = (title: string) => {
    switch (title.toUpperCase()) {
      case 'INNOVATION':
        return <Sparkles className="w-10 h-10" />
      case 'COMMUNITY':
        return <Users className="w-10 h-10" />
      case 'QUALITY':
        return <Award className="w-10 h-10" />
      case 'SUSTAINABILITY':
        return <Globe className="w-10 h-10" />
      default:
        return <Heart className="w-10 h-10" />
    }
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="about" />

      {/* Hero Section */}
      <section className="px-8 py-20 border-b-2 border-black dark:border-white">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-widest uppercase mb-8">
              {aboutContent.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {aboutContent.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="border-2 border-black dark:border-white p-12 bg-gray-50 dark:bg-black">
              <h2 className="text-3xl font-bold tracking-widest uppercase mb-2">
                {aboutContent.storyTitle}
              </h2>
              <div className="w-16 h-1 bg-black dark:bg-white mb-8"></div>
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                {aboutContent.storyContent && aboutContent.storyContent.length > 0 ? (
                  aboutContent.storyContent.map((paragraph: string, index: number) => (
                    <p key={index} className="text-base">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>Loading story content...</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black dark:border-white p-8 text-center bg-white dark:bg-black">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-sm tracking-wider text-gray-600 dark:text-gray-400">YEARS</div>
              </div>
              <div className="border-2 border-black dark:border-white p-8 text-center bg-white dark:bg-black">
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-sm tracking-wider text-gray-600 dark:text-gray-400">CUSTOMERS</div>
              </div>
              <div className="border-2 border-black dark:border-white p-8 text-center bg-white dark:bg-black">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-sm tracking-wider text-gray-600 dark:text-gray-400">COUNTRIES</div>
              </div>
              <div className="border-2 border-black dark:border-white p-8 text-center bg-white dark:bg-black">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm tracking-wider text-gray-600 dark:text-gray-400">PRODUCTS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-8 py-20 bg-gray-50 dark:bg-black border-y-2 border-black dark:border-white">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="border-2 border-black dark:border-white p-12 bg-white dark:bg-black">
              <h2 className="text-3xl font-bold tracking-widest uppercase mb-6">
                {aboutContent.missionTitle}
              </h2>
              <div className="w-16 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
              <p className="text-lg text-gray-700 dark:text-white leading-relaxed">
                {aboutContent.missionContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <h2 className="text-4xl font-bold tracking-widest uppercase mb-4">
              OUR VALUES
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutContent.values && aboutContent.values.length > 0 ? aboutContent.values.map((value: any, index: number) => (
              <div
                key={value.title}
                className={`border-2 border-black dark:border-white p-8 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 group cursor-pointer ${
                  isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${1000 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-6 text-black dark:text-white group-hover:scale-110 transition-transform duration-300">
                  {getValueIcon(value.title)}
                </div>
                <h3 className="text-lg font-bold tracking-widest uppercase mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {value.description}
                </p>
              </div>
            )) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Loading values...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Company Rules Section */}
      {companyRules.length > 0 && (
        <section className="px-8 py-20 bg-gray-50 dark:bg-black border-t-2 border-black dark:border-white">
          <div className="max-w-5xl mx-auto">
            <div
              className={`mb-12 text-center transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "1400ms" }}
            >
              <h2 className="text-4xl font-bold tracking-widest uppercase mb-4">
                COMPANY RULES
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Our commitment to excellence and integrity
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {companyRules.map((rule, index) => (
                <div
                  key={index}
                  className={`border-2 border-black dark:border-white p-6 bg-white dark:bg-black transition-all duration-700 hover:shadow-lg ${
                    isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${1500 + index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-white leading-relaxed pt-1">
                      {rule}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className={`border-t-2 border-black dark:border-white px-8 py-16 transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1800ms" }}
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
