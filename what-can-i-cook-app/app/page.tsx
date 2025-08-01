"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

// Sample ingredient database
const ALL_INGREDIENTS = [
  "Egg",
  "Eggplant",
  "Eggnog",
  "Carrot",
  "Cheese",
  "Chicken",
  "Rice",
  "Pasta",
  "Tomato",
  "Onion",
  "Garlic",
  "Bell Pepper",
  "Mushroom",
  "Spinach",
  "Potato",
  "Beef",
  "Pork",
  "Fish",
  "Shrimp",
  "Milk",
  "Butter",
  "Flour",
  "Salt",
  "Pepper",
  "Olive Oil",
  "Lemon",
  "Lime",
  "Basil",
  "Oregano",
  "Thyme",
  "Parsley",
]

// Emoji mapping for ingredients
const getIngredientEmoji = (ingredient: string): string => {
  const emojiMap: { [key: string]: string } = {
    Egg: "🥚",
    Eggplant: "🍆",
    Eggnog: "🥛",
    Carrot: "🥕",
    Cheese: "🧀",
    Chicken: "🐔",
    Rice: "🍚",
    Pasta: "🍝",
    Tomato: "🍅",
    Onion: "🧅",
    Garlic: "🧄",
    "Bell Pepper": "🫑",
    Mushroom: "🍄",
    Spinach: "🥬",
    Potato: "🥔",
    Beef: "🥩",
    Pork: "🥓",
    Fish: "🐟",
    Shrimp: "🦐",
    Milk: "🥛",
    Butter: "🧈",
    Flour: "🌾",
    Salt: "🧂",
    Pepper: "🌶️",
    "Olive Oil": "🫒",
    Lemon: "🍋",
    Lime: "🟢",
    Basil: "🌿",
    Oregano: "🌿",
    Thyme: "🌿",
    Parsley: "🌿",
  }
  return emojiMap[ingredient] || "🥕"
}

export default function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [cookingDuration, setCookingDuration] = useState(60)
  const [ingredientCount, setIngredientCount] = useState(10)

  // Filter ingredients based on search input
  const filteredIngredients = ALL_INGREDIENTS.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(searchInput.toLowerCase()) && !selectedIngredients.includes(ingredient),
  ).slice(0, 5) // Show max 5 suggestions

  // Add ingredient to selected list
  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
    setSearchInput("")
    setShowDropdown(false)
  }

  // Remove ingredient from selected list
  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setShowDropdown(e.target.value.length > 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-xl font-bold text-gray-800">COOK WITH WHAT 🍳</div>
        <div className="flex gap-8">
          <Link href="/recipes" className="text-gray-600 hover:text-gray-800 font-medium">
            TOP RECIPES
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium">
            LOGIN
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20">
        {/* Hero Title */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">What Can You Cook Today?</h1>
          <p className="text-xl text-gray-600">
            Tell us what ingredients you have, and we'll show you delicious recipes you can make right now!
          </p>
        </div>

        {/* Search Box with Ingredients */}
        <div className="w-full max-w-md mb-8 relative">
          <div className="relative">
            <div className="w-full min-h-14 px-4 py-2 border-2 border-gray-200 rounded-xl focus-within:border-blue-500 shadow-sm bg-white">
              {/* Selected Ingredients Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedIngredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {getIngredientEmoji(ingredient)} {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
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
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(searchInput.length > 0)}
                className="w-full text-lg outline-none bg-transparent"
              />
            </div>

            {/* Icons */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
              {/* Filter Icon */}
              <svg
                onClick={() => setShowFilters(!showFilters)}
                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              {/* Search Icon */}
              <svg
                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Dropdown Suggestions */}
          {showDropdown && filteredIngredients.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              {filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                >
                  {ingredient}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Button */}
        <Link
          href={`/results?ingredients=${selectedIngredients.join(",")}&maxCookTime=${cookingDuration}&maxIngredients=${ingredientCount}`}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            I Have These
          </button>
        </Link>

        {/* Quick Ingredient Tags */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Try these popular ingredients:</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-lg">
            {[
              "🥚 Eggs",
              "🧀 Cheese",
              "🍚 Rice",
              "🐔 Chicken",
              "🥕 Carrots",
              "🧄 Garlic",
              "🍅 Tomatoes",
              "🧅 Onions",
            ].map((ingredient) => (
              <span
                key={ingredient}
                onClick={() => {
                  const ingredientName = ingredient.split(" ")[1]
                  // Convert plural to singular for consistency with emoji mapping
                  const singularName =
                    ingredientName === "Eggs"
                      ? "Egg"
                      : ingredientName === "Tomatoes"
                        ? "Tomato"
                        : ingredientName === "Carrots"
                          ? "Carrot"
                          : ingredientName === "Onions"
                            ? "Onion"
                            : ingredientName
                  addIngredient(singularName)
                }}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors shadow-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed top-32 right-8 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-6 z-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Filters</h3>

          {/* Cooking Duration */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Cooking Duration</label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="300"
                value={cookingDuration}
                onChange={(e) => setCookingDuration(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 min</span>
                <span className="font-medium text-gray-700">{cookingDuration} min</span>
                <span>300 min</span>
              </div>
            </div>
          </div>

          {/* Number of Ingredients */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">No. Ingredients</label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="20"
                value={ingredientCount}
                onChange={(e) => setIngredientCount(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="font-medium text-gray-700">{ingredientCount}</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => setShowFilters(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Floating Food Images */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Right - Bell Pepper */}
        <div className="absolute top-32 right-16 w-16 h-16 bg-red-500 rounded-full opacity-80 shadow-lg"></div>
        <div className="absolute top-36 right-20 text-2xl">🫑</div>

        {/* Right Side - Tomatoes */}
        <div className="absolute top-48 right-8 w-12 h-12 bg-red-400 rounded-full opacity-70 shadow-lg"></div>
        <div className="absolute top-52 right-12 text-xl">🍅</div>

        {/* Bottom Right - Lime */}
        <div className="absolute bottom-32 right-20 w-14 h-14 bg-green-400 rounded-full opacity-75 shadow-lg"></div>
        <div className="absolute bottom-36 right-24 text-2xl">🟢</div>

        {/* Left Side - Herbs */}
        <div className="absolute top-40 left-16 w-10 h-10 bg-green-500 rounded-full opacity-60 shadow-lg"></div>
        <div className="absolute top-44 left-20 text-lg">🌿</div>

        {/* Bottom Left - Garlic */}
        <div className="absolute bottom-48 left-12 w-12 h-12 bg-yellow-100 rounded-full opacity-70 shadow-lg"></div>
        <div className="absolute bottom-52 left-16 text-xl">🧄</div>

        {/* Decorative dots */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-50"></div>
        <div className="absolute top-60 right-1/3 w-3 h-3 bg-orange-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-green-300 rounded-full opacity-60"></div>
      </div>

      {/* Simple Features Section */}
      <section className="bg-white/70 py-16 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-4xl mb-4">🧺</div>
              <h3 className="text-xl font-semibold text-gray-800">1. Add Ingredients</h3>
              <p className="text-gray-600">Tell us what you have in your kitchen</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800">2. Find Recipes</h3>
              <p className="text-gray-600">Get personalized recipe suggestions</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold text-gray-800">3. Start Cooking</h3>
              <p className="text-gray-600">Follow simple step-by-step instructions</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
