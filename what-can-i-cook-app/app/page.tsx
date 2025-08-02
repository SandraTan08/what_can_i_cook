"use client"

import Link from "next/link"
import { useState } from "react"

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

export default function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [cookingDuration, setCookingDuration] = useState(60)
  const [ingredientCount, setIngredientCount] = useState(10)

  const filteredIngredients = ALL_INGREDIENTS.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(searchInput.toLowerCase()) && !selectedIngredients.includes(ingredient),
  ).slice(0, 5)

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
    setSearchInput("")
    setShowDropdown(false)
  }

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6">
        <div className="text-lg sm:text-xl font-bold text-gray-800">COOK WITH WHAT 🍳</div>
        <div className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          <Link href="/recipes" className="text-gray-600 hover:text-gray-800 font-medium">
            RECIPES
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium">
            LOGIN
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">What Can You Cook Today?</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us what ingredients you have, and we will show you delicious recipes!
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8 relative">
          <div className="relative">
            <div className="w-full min-h-14 px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:border-blue-500 shadow-sm bg-white">
              {/* Selected Ingredients */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedIngredients.map((ingredient) => (
                  <span key={ingredient} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {ingredient}
                    <button onClick={() => removeIngredient(ingredient)} className="text-gray-500 hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="What ingredients do you have?"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  setShowDropdown(e.target.value.length > 0)
                }}
                className="w-full text-base sm:text-lg outline-none bg-transparent"
              />
            </div>

            {/* Filter Icon */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && filteredIngredients.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              {filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {ingredient}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Button */}
        <div className="text-center mb-8 sm:mb-12">
          <Link
            href={`/results?ingredients=${selectedIngredients.join(",")}&maxCookTime=${cookingDuration}&maxIngredients=${ingredientCount}`}
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              Find Recipes 🔍
            </button>
          </Link>
        </div>

        {/* Quick Ingredients */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">Quick add:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {QUICK_INGREDIENTS.map((item) => (
              <button
                key={item.name}
                onClick={() => addIngredient(item.name)}
                className="px-3 sm:px-4 py-2 bg-white rounded-full text-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
              >
                {item.emoji} {item.name}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-x-4 top-32 sm:right-8 sm:left-auto sm:w-80 bg-white rounded-xl shadow-xl border p-6 z-50">
          <h3 className="text-lg font-semibold mb-6">Filters</h3>

          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-3">Max cooking time: {cookingDuration} min</label>
              <input
                type="range"
                min="0"
                max="300"
                value={cookingDuration}
                onChange={(e) => setCookingDuration(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-3">Max ingredients: {ingredientCount}</label>
              <input
                type="range"
                min="0"
                max="20"
                value={ingredientCount}
                onChange={(e) => setIngredientCount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* How It Works */}
      <section className="bg-white/70 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { emoji: "🧺", title: "Add Ingredients", desc: "Tell us what you have" },
              { emoji: "🔍", title: "Find Recipes", desc: "Get personalized suggestions" },
              { emoji: "👨‍🍳", title: "Start Cooking", desc: "Follow simple instructions" },
            ].map((step, i) => (
              <div key={i} className="space-y-4">
                <div className="text-4xl mb-4">{step.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
