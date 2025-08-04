"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { RECIPES_DATA, type Recipe } from "../../data/recipes"
import RecipeModal from "../../components/recipe-modal"
import RecipeCard from "../../components/recipe-card"

const ALL_INGREDIENTS = [
  "Egg",
  "Chicken",
  "Rice",
  "Garlic",
  "Onion",
  "Pepper",
  "Salt",
  "Tomato",
  "Cheese",
  "Carrot",
  "Broccoli",
  "Pasta",
  "Mushroom",
  "Spinach",
  "Potato",
  "Beef",
  "Pork",
  "Fish",
  "Milk",
  "Butter",
]

const QUICK_INGREDIENTS = [
  { name: "Egg", emoji: "🥚" },
  { name: "Cheese", emoji: "🧀" },
  { name: "Rice", emoji: "🍚" },
  { name: "Chicken", emoji: "🐔" },
  { name: "Carrot", emoji: "🥕" },
  { name: "Garlic", emoji: "🧄" },
  { name: "Tomato", emoji: "🍅" },
  { name: "Onion", emoji: "🧅" },
]

const CELEBRATION_EMOJIS = ["🎉", "✨", "🌟", "💫", "🎊", "🔥", "⭐", "💥"]

// Keep your original cleanedRecipes logic
const cleanedRecipes: Recipe[] = RECIPES_DATA.map((raw) => ({
  ...raw,
  alternatives: Object.fromEntries(Object.entries(raw.alternatives).filter(([_, v]) => v !== undefined)),
}))

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [userIngredients, setUserIngredients] = useState<string[]>([])
  const [maxCookTime, setMaxCookTime] = useState(300)
  const [maxIngredients, setMaxIngredients] = useState(20)
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hasInitialized, setHasInitialized] = useState(false)

  // Mouse tracking - memoized to prevent re-renders
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  // Keep your original useEffect logic but add celebration
  useEffect(() => {
    if (hasInitialized) return

    const ingredients = searchParams.get("ingredients")
    const cookTime = searchParams.get("maxCookTime")
    const ingredientCount = searchParams.get("maxIngredients")

    if (ingredients) {
      const newIngredients = ingredients.split(",").filter(Boolean)
      setUserIngredients(newIngredients)

      // Show celebration only on initial load with ingredients
      if (newIngredients.length > 0) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
    }
    if (cookTime) setMaxCookTime(Number(cookTime))
    if (ingredientCount) setMaxIngredients(Number(ingredientCount))

    setHasInitialized(true)
  }, [searchParams, hasInitialized])

  // Keep your original calculation logic
  const calculateMatchScore = (recipe: Recipe) => {
    return recipe.ingredients.filter((ingredient) =>
      userIngredients.some(
        (userIng) =>
          userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(userIng.toLowerCase()),
      ),
    ).length
  }

  // Keep your original filtering logic with cleanedRecipes
  const filteredRecipes = cleanedRecipes
    .filter((recipe) => recipe.cookTime <= maxCookTime && recipe.ingredients.length <= maxIngredients)
    .map((recipe) => ({ ...recipe, matchScore: calculateMatchScore(recipe) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const topMatches = filteredRecipes.slice(0, 4)
  const similarRecipes = filteredRecipes.slice(4, 11)

  const filteredIngredients = ALL_INGREDIENTS.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(searchInput.toLowerCase()) && !userIngredients.includes(ingredient),
  ).slice(0, 5)

  // Keep your original add/remove logic but add celebration
  const addIngredient = (ingredient: string) => {
    if (!userIngredients.includes(ingredient)) {
      const newIngredients = [...userIngredients, ingredient]
      setUserIngredients(newIngredients)
      setSearchInput("")
      setShowDropdown(false)
      // Quick celebration
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 800)
    }
  }

  const removeIngredient = (ingredient: string) => {
    const newIngredients = userIngredients.filter((item) => item !== ingredient)
    setUserIngredients(newIngredients)
  }

  // Keep your original getMissingIngredients function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getMissingIngredients = (recipe: Recipe): string[] => {
    return recipe.ingredients.filter(
      (ingredient) =>
        !userIngredients.some(
          (userIng) =>
            userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(userIng.toLowerCase()),
        ),
    )
  }

  const getMatchPercentage = () => {
    if (topMatches.length === 0) return 0
    const bestMatch = topMatches[0]
    return Math.round((bestMatch.matchScore / bestMatch.ingredients.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Celebration Confetti - ONLY when showCelebration is true */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {CELEBRATION_EMOJIS.map((emoji, i) => (
            <div
              key={`celebration-${i}`}
              className="absolute text-4xl animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Cursor Follower */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-40 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      >
        <div className="w-full h-full bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
      </div>

      {/* Static Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute text-3xl opacity-10 top-20 left-10">🍽️</div>
        <div className="absolute text-3xl opacity-10 top-32 right-20">🥄</div>
        <div className="absolute text-3xl opacity-10 top-60 left-1/4">🍴</div>
        <div className="absolute text-3xl opacity-10 top-80 right-1/3">🥢</div>
        <div className="absolute text-3xl opacity-10 bottom-40 left-20">🔪</div>
        <div className="absolute text-3xl opacity-10 bottom-60 right-10">🍳</div>
        <div className="absolute text-3xl opacity-10 bottom-20 left-1/2">🥘</div>
        <div className="absolute text-3xl opacity-10 top-40 right-1/2">🍲</div>
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
            className="text-white hover:text-yellow-300 font-bold transform hover:scale-110 transition-all duration-200 hover:rotate-3"
          >
            RECIPES
          </Link>
          <Link
            href="/login"
            className="text-white hover:text-yellow-300 font-bold transform hover:scale-110 transition-all duration-200 hover:-rotate-3"
          >
            LOGIN
          </Link>
        </div>
      </header>

      {/* Results Hero Section */}
      <div className="relative z-10 text-center py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
            <span className="inline-block transform hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer">
              BOOM!
            </span>{" "}
            <span className="inline-block transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer text-yellow-300">
              {filteredRecipes.length}
            </span>{" "}
            <span className="inline-block transform hover:scale-110 hover:rotate-1 transition-all duration-300 cursor-pointer">
              RECIPES
            </span>
          </h1>
          {topMatches.length > 0 && (
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg sm:text-xl transform hover:scale-105 transition-all duration-300">
              🎯 {getMatchPercentage()}% PERFECT MATCH!
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-white">
          {/* Ingredients Section */}
          <div className="mb-6">
            <label className="block text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              🧺 YOUR MAGICAL INGREDIENTS:
            </label>
            <div className="relative">
              <div className="min-h-14 px-6 py-4 border-4 border-purple-300 rounded-2xl focus-within:border-yellow-400 bg-white shadow-lg">
                {/* Selected Ingredients Tags */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {userIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full text-sm font-bold transform hover:scale-110 transition-all duration-200"
                    >
                      {QUICK_INGREDIENTS.find((item) => item.name === ingredient)?.emoji || "🥕"} {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="text-white hover:text-red-300 font-bold text-lg hover:scale-125 transition-all duration-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Add more magical ingredients... ✨"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                    setShowDropdown(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowDropdown(searchInput.length > 0)}
                  className="w-full text-lg outline-none bg-transparent font-semibold placeholder-gray-400"
                />
              </div>
              {/* Enhanced Dropdown */}
              {showDropdown && filteredIngredients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-purple-300 rounded-2xl shadow-2xl z-20 overflow-hidden">
                  {filteredIngredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      onClick={() => addIngredient(ingredient)}
                      className="px-6 py-4 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 cursor-pointer border-b border-purple-100 last:border-b-0 font-semibold text-gray-800 hover:text-purple-600 transition-all duration-200 transform hover:scale-105"
                    >
                      {QUICK_INGREDIENTS.find((item) => item.name === ingredient)?.emoji || "🥕"} {ingredient}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cook Time Filter */}
            <div>
              <label className="block text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                ⏰ MAX COOKING TIME: <span className="text-purple-600">{maxCookTime} MIN</span>
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(Number(e.target.value))}
                className="w-full h-4 bg-purple-200 rounded-full appearance-none cursor-pointer slider-fun"
              />
            </div>

            {/* Ingredients Count Filter */}
            <div>
              <label className="block text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                🥕 MAX INGREDIENTS: <span className="text-purple-600">{maxIngredients}</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={maxIngredients}
                onChange={(e) => setMaxIngredients(Number(e.target.value))}
                className="w-full h-4 bg-purple-200 rounded-full appearance-none cursor-pointer slider-fun"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        {/* Top Matches */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              <span className="inline-block transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
                🏆
              </span>{" "}
              <span className="text-yellow-300">TOP</span> MATCHES
            </h2>
            <p className="text-white text-lg font-semibold opacity-90">
              These recipes are PERFECT for what you have! 🎯
            </p>
          </div>

          {topMatches.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {topMatches.map((recipe) => (
                <div key={recipe.id} className="transform hover:scale-105 transition-all duration-300">
                  <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} showMatchScore={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white bg-opacity-90 rounded-3xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">😢</div>
                <p className="text-2xl font-black text-gray-800 mb-2">OOPS!</p>
                <p className="text-gray-600 font-semibold">
                  No recipes found matching your criteria. Try adjusting your filters or adding more ingredients!
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Similar Recipes */}
        {similarRecipes.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                <span className="inline-block transform hover:scale-110 hover:-rotate-3 transition-all duration-300 cursor-pointer">
                  ✨
                </span>{" "}
                <span className="text-pink-300">MORE</span> RECIPES
              </h2>
              <p className="text-white text-lg font-semibold opacity-90">
                These might need a few extra ingredients, but they are worth it! 🌟
              </p>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {similarRecipes.map((recipe) => (
                <div key={recipe.id} className="transform hover:scale-110 transition-all duration-300">
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    showMatchScore={true}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} userIngredients={userIngredients} />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .slider-fun::-webkit-slider-thumb {
          appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        
        .slider-fun::-webkit-slider-thumb:hover {
          transform: scale(1.3) rotate(90deg);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        
        .slider-fun::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
