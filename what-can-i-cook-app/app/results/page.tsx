"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
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

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [userIngredients, setUserIngredients] = useState<string[]>([])
  const [maxCookTime, setMaxCookTime] = useState(300)
  const [maxIngredients, setMaxIngredients] = useState(20)
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const ingredients = searchParams.get("ingredients")
    const cookTime = searchParams.get("maxCookTime")
    const ingredientCount = searchParams.get("maxIngredients")

    if (ingredients) setUserIngredients(ingredients.split(",").filter(Boolean))
    if (cookTime) setMaxCookTime(Number(cookTime))
    if (ingredientCount) setMaxIngredients(Number(ingredientCount))
  }, [searchParams])

  const calculateMatchScore = (recipe: Recipe) => {
    return recipe.ingredients.filter((ingredient) =>
      userIngredients.some(
        (userIng) =>
          userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(userIng.toLowerCase()),
      ),
    ).length
  }

  const filteredRecipes = RECIPES_DATA.filter(
    (recipe) => recipe.cookTime <= maxCookTime && recipe.ingredients.length <= maxIngredients,
  )
    .map((recipe) => ({ ...recipe, matchScore: calculateMatchScore(recipe) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const topMatches = filteredRecipes.slice(0, 4)
  const similarRecipes = filteredRecipes.slice(4, 11)

  const filteredIngredients = ALL_INGREDIENTS.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(searchInput.toLowerCase()) && !userIngredients.includes(ingredient),
  ).slice(0, 5)

  const addIngredient = (ingredient: string) => {
    if (!userIngredients.includes(ingredient)) {
      const newIngredients = [...userIngredients, ingredient]
      setUserIngredients(newIngredients)
      setSearchInput("")
      setShowDropdown(false)
    }
  }

  const removeIngredient = (ingredient: string) => {
    const newIngredients = userIngredients.filter((item) => item !== ingredient)
    setUserIngredients(newIngredients)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6 max-w-6xl mx-auto">
        <Link href="/" className="text-lg sm:text-xl font-bold text-gray-800">
          COOK WITH WHAT 🍳
        </Link>
        <div className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          <Link href="/recipes" className="text-gray-600 hover:text-gray-800 font-medium">
            RECIPES
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium">
            LOGIN
          </Link>
        </div>
      </header>

      {/* EDITABLE Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          {/* Ingredients Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your ingredients:</label>
            <div className="relative">
              <div className="min-h-12 px-4 py-2 border border-gray-300 rounded-lg focus-within:border-blue-500 bg-white">
                {/* Selected Ingredients Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {userIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-800"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-1 text-blue-600 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Add more ingredients..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                    setShowDropdown(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowDropdown(searchInput.length > 0)}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              {/* Dropdown */}
              {showDropdown && filteredIngredients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filteredIngredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      onClick={() => addIngredient(ingredient)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                    >
                      {ingredient}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cook Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max cook time: {maxCookTime} min</label>
              <input
                type="range"
                min="0"
                max="300"
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Ingredients Count Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max ingredients: {maxIngredients}</label>
              <input
                type="range"
                min="0"
                max="20"
                value={maxIngredients}
                onChange={(e) => setMaxIngredients(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {/* Top Matches */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">TOP MATCHES</h2>
          {topMatches.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {topMatches.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  showMatchScore={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No recipes found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your filters or adding more ingredients.</p>
            </div>
          )}
        </section>

        {/* Similar Recipes */}
        {similarRecipes.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">MORE RECIPES</h2>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
              {similarRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  showMatchScore={true}
                  size="small"
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} userIngredients={userIngredients} />
    </div>
  )
}
