"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import type { Recipe } from "../data/recipes";

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  userIngredients?: string[];
}

export default function RecipeModal({ recipe, onClose, userIngredients = [] }: RecipeModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure portal only renders after component mounts (avoids Next.js hydration issues)
    setIsMounted(true);
  }, []);

  if (!recipe || !isMounted) return null;

  const getMissingIngredients = (): string[] => {
    return recipe.ingredients.filter(
      (ingredient) =>
        !userIngredients.some(
          (userIng) =>
            userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(userIng.toLowerCase()),
        ),
    );
  };

  const missingIngredients = getMissingIngredients();

  return createPortal(
    <div className="fixed inset-0 bg-black/30 backdrop-brightness-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-4">{recipe.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <span className="text-gray-600">{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍🍳</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`${i < recipe.difficulty ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Ingredients:</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ingredient, index) => {
                const isMissing = missingIngredients.includes(ingredient);
                return (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isMissing
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {ingredient}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-medium text-blue-600 flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
              <p className="text-gray-700">{recipe.tips}</p>
            </div>
          )}

          {/* Alternatives */}
          {Object.keys(recipe.alternatives).length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🔄 Alternatives</h3>
              <div className="space-y-1">
                {Object.entries(recipe.alternatives).map(([ingredient, alternative]) => (
                  <p key={ingredient} className="text-gray-700 text-sm">
                    <span className="font-medium text-orange-600">{ingredient}</span> →{" "}
                    <span className="font-medium text-green-600">{alternative}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
