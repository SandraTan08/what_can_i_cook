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
  const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
      function handleResize() {
        setIsDesktop(window.innerWidth > 768);
      }
      handleResize(); // Set on mount
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

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
    // background colour 
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 z-0"
        style={{
          backgroundImage: "url('images/lemon_bg.jpg')", // Original image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      ></div>
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 w-full h-40 z-0 bg-gradient-to-b from-black to-transparent pointer-events-none" />

      {/* Celebration Lemon Juice Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(35)].map((_, i) => {
            const size = 6 + Math.random() * 14; // droplet size
            const angle = Math.random() * (2 * Math.PI); // direction in radians
            const distance = 50 + Math.random() * 150; // how far it travels

            return (
              <div
                key={`droplet-${i}`}
                className="absolute rounded-full bg-yellow-300 shadow-md animate-lemon-burst"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%)`,
                  // Send it in a direction using CSS vars
                  // @ts-expect-error: allow CSS vars in style object
                  "--dx": `${Math.cos(angle) * distance}px`,
                  "--dy": `${Math.sin(angle) * distance}px`,
                  animationDelay: `${i * 0.02}s`,
                  animationDuration: `${0.6 + Math.random() * 0.4}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Interactive Cursor - Only show on screens above 768px */}
      {isDesktop && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-150 ease-out"
          style={{
            left: mousePosition.x - 20,
            top: mousePosition.y - 20,
            width: 40,
            height: 40,
          }}
        >
          {/* Outer ring */}
          <div className="w-full h-full rounded-full border-2 border-lime-300 animate-ping"></div>
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-yellow-300 rounded-full shadow-md" />
        </div>
      )}


      {/* Header */}
      <header className="flex items-center justify-center gap-4 py-6 px-4 sm:gap-12 sm:py-8"> {/* Adjusted gap and added px for mobile */}
        <nav className="flex flex-wrap justify-center items-center gap-4 text-lg font-semibold text-white"> {/* Added flex-wrap and justify-center for mobile */}
          <Link
            href="/"
            className="relative px-2 py-1 rounded hover:bg-yellow-300 hover:text-black transition-colors" // Original color
          >
            COOK WITH WHAT 🍳
          </Link>
          <span className="text-white hidden sm:inline">·</span> {/* Hide dot on small screens */}
          <Link
            href="/recipes"
            className="relative px-2 py-1 rounded hover:bg-yellow-300 hover:text-black transition-colors" // Original color
          >
            RECIPES
          </Link>
          <span className="text-white hidden sm:inline">·</span> {/* Hide dot on small screens */}
          <Link
            href="/login"
            className="relative px-2 py-1 rounded hover:bg-yellow-300 hover:text-black transition-colors" // Original color
          >
            LOGIN
          </Link>
        </nav>
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
              <div className="min-h-14 px-6 py-4 border-4 border-yellow-700 rounded-2xl focus-within:border-yellow-400 bg-white shadow-lg">
                {/* Selected Ingredients Tags */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {userIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full text-sm font-bold transform hover:scale-110 transition-all duration-200"
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-yellow-700 rounded-2xl shadow-2xl z-20 overflow-hidden">
                  {filteredIngredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      onClick={() => addIngredient(ingredient)}
                      className="px-6 py-4 hover:bg-gradient-to-r hover:from-yellow-500 to-amber-600 cursor-pointer border-b border-yellow-100 last:border-b-0 font-semibold text-gray-800 hover:text-slate-50 transition-all duration-200 transform hover:scale-105"
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
                ⏰ MAX COOKING TIME: <span className="text-amber-600">{maxCookTime} MIN</span>
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(Number(e.target.value))}
                className="w-full h-4 bg-yellow-200 rounded-full appearance-none cursor-pointer slider-fun"
              />
            </div>

            {/* Ingredients Count Filter */}
            <div>
              <label className="block text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                🥕 MAX INGREDIENTS: <span className="text-yellow-600">{maxIngredients}</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={maxIngredients}
                onChange={(e) => setMaxIngredients(Number(e.target.value))}
                className="w-full h-4 bg-yellow-200 rounded-full appearance-none cursor-pointer slider-fun"
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
              <span className="text-yellow-200">TOP</span> MATCHES
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
                <span className="text-cyan-200">MORE</span> RECIPES
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
                    whiteText={true}
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
          background: linear-gradient(45deg, #d7a211ff, #feca57, #48dbfb, #2774d2ff);
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
          background: linear-gradient(45deg, #d7a211ff, #feca57, #48dbfb, #2774d2ff);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        @keyframes lemon-burst {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          80% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.5);
            opacity: 0;
          }
        }

        .animate-lemon-burst {
          animation: lemon-burst ease-out forwards;
        }


      `}</style>
    </div>
  )
}
