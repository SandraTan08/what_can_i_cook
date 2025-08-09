"use client"

import type { Recipe } from "../data/recipes"

interface RecipeCardProps {
  recipe: Recipe & { matchScore?: number }
  onClick: () => void
  showMatchScore?: boolean
  size?: "small" | "medium" | "large"
  whiteText?: boolean
}

export default function RecipeCard({ recipe, onClick, showMatchScore = false, size = "medium", whiteText = false  }: RecipeCardProps) {
  const sizeClasses = {
    small: "w-20",
    medium: "w-48",
    large: "w-full",
  }

  const imageClasses = {
    small: "w-16 h-16 text-2xl",
    medium: "h-32 text-4xl",
    large: "h-48 text-6xl",
  }

  if (size === "small") {
    return (
      <div onClick={onClick} className="flex-shrink-0 cursor-pointer group text-center">
        <div
          className={`${imageClasses.small} rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative mb-2 mx-auto`}
        >
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-105 transition-transform duration-300">
            <span className={imageClasses.small.split(" ")[2]}>{recipe.image}</span>
          </div>
        </div>
        <div className="w-20">
          <p className={`text-xs font-medium ${whiteText ? "text-white" : "text-gray-800"} truncate`}>
            {recipe.name}
          </p>
          <p className={`${whiteText ? "text-white/80" : "text-gray-500"}`}>
            {recipe.cookTime}min
          </p>
          {showMatchScore && recipe.matchScore !== undefined && (
            <p className={`${whiteText ? "text-white/80" : "text-gray-500"}`}>
              {recipe.matchScore}/{recipe.ingredients.length}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} ${size === "large" ? "" : "flex-shrink-0"} bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
    >
      <div className={`relative ${imageClasses[size]} rounded-t-xl overflow-hidden`}>
        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-cyan-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <span className={imageClasses[size].split(" ")[2]}>{recipe.image}</span>
        </div>
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {recipe.cookTime}min
        </div>
        {showMatchScore && recipe.matchScore !== undefined && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {recipe.matchScore}/{recipe.ingredients.length}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>
        {recipe.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>}
        <div className="flex items-center justify-between">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < recipe.difficulty ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">{recipe.ingredients.length} ingredients</span>
        </div>
      </div>
    </div>
  )
}
