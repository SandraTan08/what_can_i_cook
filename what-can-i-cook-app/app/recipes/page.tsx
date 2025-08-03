"use client"

import Link from "next/link"
import { useState } from "react"
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

  // Clean the raw recipe data
  const cleanedRecipes: Recipe[] = RECIPES_DATA.map((raw) => ({
    ...raw,
    alternatives: Object.fromEntries(
      Object.entries(raw.alternatives).filter(([_, v]) => v !== undefined)
    ),
  }))

export default function TopRecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

const getFeaturedRecipe = (): Recipe => {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )

  const rawRecipe = RECIPES_DATA[dayOfYear % RECIPES_DATA.length]

  const cleanedIngredients = rawRecipe.ingredients.filter(
    (item) => item !== undefined && item !== ""
  )

  const cleanedAlternatives = Object.fromEntries(
    Object.entries(rawRecipe.alternatives).filter(([_, value]) => value !== undefined)
  )

  return {
    ...rawRecipe,
    ingredients: cleanedIngredients,
    alternatives: cleanedAlternatives,
  }
}


  const featuredRecipe = getFeaturedRecipe()

  // Group recipes by category
  const recipesByCategory = cleanedRecipes.reduce(
    (acc, recipe) => {
      if (!acc[recipe.category]) acc[recipe.category] = []
      acc[recipe.category].push(recipe)
      return acc
    },
    {} as Record<string, Recipe[]>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6">
        <Link href="/" className="text-lg sm:text-xl font-bold text-gray-800">
          COOK WITH WHAT 🍳
        </Link>
        <div className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          <Link href="/recipes" className="text-blue-600 font-medium">
            RECIPES
          </Link>
        </div>
      </header>

      {/* Featured Recipe */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 sm:h-80 md:h-96">
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <span className="text-6xl sm:text-8xl">{featuredRecipe.image}</span>
              </div>
              <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ Featured Today
              </div>
            </div>

            {/* Info */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 sm:p-8 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-4xl font-bold mb-4">{featuredRecipe.name}</h1>
              <p className="text-blue-100 text-base sm:text-lg mb-6 leading-relaxed">{featuredRecipe.description}</p>

              <div className="flex items-center gap-4 sm:gap-6 mb-6 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⏱️</span>
                  <span className="text-blue-100">{featuredRecipe.cookTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">👨‍🍳</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`${i < featuredRecipe.difficulty ? "text-yellow-300" : "text-blue-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecipe(featuredRecipe)}
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors self-start"
              >
                View Recipe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        {Object.entries(recipesByCategory).map(([category, recipes]) => (
          <section key={category} className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {CATEGORY_NAMES[category] || category.toUpperCase()}
              </h2>
              <span className="text-gray-500 text-sm">{recipes.length}</span>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:gap-6 gap-4 sm:overflow-x-auto sm:pb-4">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  size={window.innerWidth < 640 ? "large" : "medium"}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  )
}
