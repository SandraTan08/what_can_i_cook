"use client"

import Link from "next/link"
import { useState } from "react"
import { RECIPES_DATA, type Recipe } from "../../data/recipes"

// Category display names
const CATEGORY_NAMES = {
  "stir-fries": "STIR FRIES",
  "noodle-dishes": "NOODLE DISHES",
  soups: "SOUPS",
  breakfast: "BREAKFAST",
  "rice-dishes": "RICE DISHES",
  sandwiches: "SANDWICHES",
  salads: "SALADS",
}

export default function TopRecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // Get featured recipe (changes daily based on date)
  const getFeaturedRecipe = (): Recipe => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const featuredIndex = dayOfYear % RECIPES_DATA.length
    return RECIPES_DATA[featuredIndex]
  }

  const featuredRecipe = getFeaturedRecipe()

  // Group recipes by category
  const recipesByCategory = RECIPES_DATA.reduce(
    (acc, recipe) => {
      if (!acc[recipe.category]) {
        acc[recipe.category] = []
      }
      acc[recipe.category].push(recipe)
      return acc
    },
    {} as Record<string, Recipe[]>,
  )

  // Get missing ingredients for a recipe (placeholder for now)
  const getMissingIngredients = (recipe: Recipe): string[] => {
    // For now, return empty array since we don't have user ingredients context
    return []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-gray-800">
          COOK WITH WHAT 🍳
        </Link>
        <div className="flex gap-8">
          <Link href="/recipes" className="text-blue-600 font-medium">
            TOP RECIPES
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium">
            LOGIN
          </Link>
        </div>
      </header>

      {/* Featured Recipe Section */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Featured Recipe Image */}
            <div className="relative h-80 md:h-96">
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <span className="text-8xl">{featuredRecipe.image}</span>
              </div>
              <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ Featured Today
              </div>
            </div>

            {/* Featured Recipe Info */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-4">{featuredRecipe.name}</h1>
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">{featuredRecipe.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-blue-100">{featuredRecipe.cookTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👨‍🍳</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < featuredRecipe.difficulty ? "text-yellow-300" : "text-blue-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecipe(featuredRecipe)}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors self-start"
              >
                View Recipe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Categories */}
      <main className="max-w-6xl mx-auto px-6 pb-12">
        {Object.entries(recipesByCategory).map(([category, recipes]) => (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{CATEGORY_NAMES[category] || category.toUpperCase()}</h2>
              <div className="text-gray-500 text-sm">{recipes.length} recipes</div>
            </div>

            {/* Recipe Cards */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="flex-shrink-0 w-48 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Recipe Image */}
                  <div className="relative h-32 rounded-t-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <span className="text-4xl">{recipe.image}</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {recipe.cookTime}min
                    </div>
                  </div>

                  {/* Recipe Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < recipe.difficulty ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{recipe.ingredients.length} ingredients</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.name}</h2>
              <button onClick={() => setSelectedRecipe(null)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recipe Info */}
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Time to cook:</span> {selectedRecipe.cookTime} min
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Difficulty level:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < selectedRecipe.difficulty ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Required Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Required ingredients:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Instructions</h3>
                <ol className="space-y-2">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-medium text-blue-600 flex-shrink-0">{index + 1}.</span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedRecipe.tips && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
                  <p className="text-gray-700">{selectedRecipe.tips}</p>
                </div>
              )}

              {/* Alternatives */}
              {Object.keys(selectedRecipe.alternatives).length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Ingredient Alternatives</h3>
                  <div className="space-y-1">
                    {Object.entries(selectedRecipe.alternatives).map(([ingredient, alternative]) => (
                      <p key={ingredient} className="text-gray-700 text-sm">
                        Don't have <span className="font-medium text-orange-600">{ingredient}</span>? Use{" "}
                        <span className="font-medium text-green-600">{alternative}</span> instead!
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
