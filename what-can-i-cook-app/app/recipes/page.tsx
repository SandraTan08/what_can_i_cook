"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { RECIPES_DATA, type Recipe } from "../../data/recipes"
import RecipeModal from "../../components/recipe-modal"
import RecipeCard from "../../components/recipe-card"

const CATEGORY_NAMES: Record<string, string> = {
  "stir-fries": "STIR FRIES",
  "noodle-dishes": "NOODLE DISHES",
  soups: "SOUPS",
  breakfast: "BREAKFAST",
  "rice-dishes": "RICE DISHES",
  sandwiches: "SANDWICHES",
  salads: "SALADS",
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "stir-fries": "🥘",
  "noodle-dishes": "🍜",
  soups: "🍲",
  breakfast: "🥞",
  "rice-dishes": "🍚",
  sandwiches: "🥪",
  salads: "🥗",
}

const SPARKLE_EMOJIS = ["✨", "🌟", "💫", "⭐", "🎊", "🎉"]

// Keep your original getFeaturedRecipe function
function getFeaturedRecipe(): Recipe {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const rawRecipe = RECIPES_DATA[dayOfYear % RECIPES_DATA.length]
  const cleanedIngredients = rawRecipe.ingredients.filter((item) => item !== undefined && item !== "")
  const cleanedAlternatives = Object.fromEntries(
    Object.entries(rawRecipe.alternatives).filter(([_, value]) => value !== undefined),
  )
  return {
    ...rawRecipe,
    ingredients: cleanedIngredients,
    alternatives: cleanedAlternatives,
  }
}

export default function TopRecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [featured, setFeatured] = useState<Recipe | null>(null)
  const [screenWidth, setScreenWidth] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSparkles, setShowSparkles] = useState(false)

  // Mouse tracking - memoized to prevent re-renders
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  // Keep your original screen width logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth)
      const handleResize = () => setScreenWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Keep your original featured recipe loading logic
  useEffect(() => {
    const recipe = getFeaturedRecipe()
    setFeatured(recipe)
    // Show sparkles when featured recipe loads
    setShowSparkles(true)
    setTimeout(() => setShowSparkles(false), 3000)
  }, [])

  // Keep your original cleanedRecipes logic
  const cleanedRecipes: Recipe[] = RECIPES_DATA.map((raw) => ({
    ...raw,
    alternatives: Object.fromEntries(Object.entries(raw.alternatives).filter(([_, v]) => v !== undefined)),
  }))

  // Keep your original grouping logic
  const recipesByCategory = cleanedRecipes.reduce(
    (acc, recipe) => {
      if (!acc[recipe.category]) acc[recipe.category] = []
      acc[recipe.category].push(recipe)
      return acc
    },
    {} as Record<string, Recipe[]>,
  )

  // Keep your original loading check
  if (!featured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl font-black animate-pulse">🍳 Loading magical recipes... ✨</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Sparkle Animation */}
      {showSparkles && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {SPARKLE_EMOJIS.map((emoji, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-4xl animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Cursor Follower */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-40 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      >
        <div className="w-full h-full bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute text-4xl opacity-15 top-16 left-12 animate-pulse">🍳</div>
        <div className="absolute text-4xl opacity-15 top-32 right-16 animate-pulse" style={{ animationDelay: "0.5s" }}>
          👨‍🍳
        </div>
        <div className="absolute text-4xl opacity-15 top-64 left-1/4 animate-pulse" style={{ animationDelay: "1s" }}>
          🥘
        </div>
        <div className="absolute text-4xl opacity-15 top-80 right-1/3 animate-pulse" style={{ animationDelay: "1.5s" }}>
          🍜
        </div>
        <div className="absolute text-4xl opacity-15 bottom-48 left-16 animate-pulse" style={{ animationDelay: "2s" }}>
          🥞
        </div>
        <div
          className="absolute text-4xl opacity-15 bottom-64 right-12 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        >
          🥗
        </div>
        <div className="absolute text-4xl opacity-15 bottom-32 left-1/2 animate-pulse" style={{ animationDelay: "3s" }}>
          🍲
        </div>
        <div className="absolute text-4xl opacity-15 top-48 right-1/2 animate-pulse" style={{ animationDelay: "3.5s" }}>
          🥪
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-black text-white transform hover:scale-110 transition-all duration-300 hover:rotate-3"
        >
          COOK WITH WHAT 🍳
        </Link>
        <div className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          <Link
            href="/recipes"
            className="text-yellow-300 font-black transform hover:scale-110 transition-all duration-200 hover:rotate-3"
          >
            RECIPES
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 text-center py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-7xl font-black text-white mb-6 leading-tight">
            <span className="inline-block transform hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer">
              TODAY'S
            </span>
            <br />
            <span className="inline-block transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer text-yellow-300">
              FEATURED
            </span>{" "}
            <span className="inline-block transform hover:scale-110 hover:rotate-1 transition-all duration-300 cursor-pointer">
              RECIPE!
            </span>
          </h1>
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg sm:text-xl transform hover:scale-105 transition-all duration-300">
            🌟 CHEF'S SPECIAL OF THE DAY! 🌟
          </div>
        </div>
      </div>

      {/* Featured Recipe */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-white transform hover:scale-105 transition-all duration-300">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 sm:h-80 md:h-96">
              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
                <span className="text-6xl sm:text-8xl transform hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer">
                  {featured.image}
                </span>
              </div>
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-black shadow-lg animate-pulse">
                ⭐ FEATURED TODAY ⭐
              </div>
            </div>

            {/* Info */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 sm:p-8 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-4xl font-black mb-4 transform hover:scale-105 transition-all duration-300">
                {featured.name}
              </h1>
              <p className="text-purple-100 text-base sm:text-lg mb-6 leading-relaxed font-semibold">
                {featured.description}
              </p>

              <div className="flex items-center gap-4 sm:gap-6 mb-6 text-sm sm:text-base">
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-full">
                  <span className="text-xl sm:text-2xl">⏱️</span>
                  <span className="text-purple-100 font-bold">{featured.cookTime} min</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-full">
                  <span className="text-xl sm:text-2xl">👨‍🍳</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < featured.difficulty ? "text-yellow-300" : "text-purple-300"} transform hover:scale-125 transition-all duration-200`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecipe(featured)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 sm:px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-2 self-start"
              >
                🚀 VIEW RECIPE! ✨
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            <span className="inline-block transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
              🍽️
            </span>{" "}
            <span className="text-yellow-300">RECIPE</span> CATEGORIES
          </h2>
          <p className="text-white text-lg font-semibold opacity-90">
            Explore our amazing collection of delicious recipes! 🌟
          </p>
        </div>

        {Object.entries(recipesByCategory).map(([category, recipes], categoryIndex) => (
          <section key={category} className="mb-12 sm:mb-16">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-3">
                  <span className="text-3xl transform hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer">
                    {CATEGORY_EMOJIS[category] || "🍽️"}
                  </span>
                  <span className="transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    {CATEGORY_NAMES[category] || category.toUpperCase()}
                  </span>
                </h3>
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full font-black text-sm">
                  {recipes.length} RECIPES
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:gap-6 gap-4 sm:overflow-x-auto sm:pb-4 scrollbar-hide">
                {recipes.map((recipe, recipeIndex) => (
                  <div
                    key={recipe.id}
                    className="transform hover:scale-110 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${categoryIndex * 0.1 + recipeIndex * 0.05}s` }}
                  >
                    <RecipeCard
                      recipe={recipe}
                      onClick={() => setSelectedRecipe(recipe)}
                      size={screenWidth && screenWidth < 640 ? "large" : "medium"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      <style jsx>{`
        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
