"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

// Sample ingredient database for the search
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

// Recipe data
const RECIPES_DATA = [
  {
    id: 1,
    name: "Stir Fried Chicken",
    cookTime: 35,
    difficulty: 2,
    image: "🍗",
    ingredients: ["chicken", "garlic", "soy sauce", "salt", "carrot", "broccoli", "pepper"],
    instructions: [
      "Cut the garlic into thin slices",
      "Heat the pan and pour a tablespoon of oil inside",
      "Add the garlic slices and stir fry until fragrant",
      "Wash the broccoli and cut into small portions",
      "Throw the garlic and broccoli into the pan and stir fry",
      "Add the chicken cubes",
      "Sprinkle some salt and pepper",
      "Add 2 spoonfuls of soy sauce",
    ],
    tips: "Don't have broccoli? Use spinach instead!",
    alternatives: {
      broccoli: "spinach",
      "soy sauce": "teriyaki sauce",
    },
  },
  {
    id: 2,
    name: "Tomato & Egg",
    cookTime: 15,
    difficulty: 1,
    image: "🍅",
    ingredients: ["tomato", "egg", "salt", "pepper", "garlic", "onion"],
    instructions: [
      "Beat the eggs in a bowl",
      "Heat oil in pan",
      "Scramble the eggs and set aside",
      "Dice the tomatoes",
      "Stir fry tomatoes until soft",
      "Add eggs back to pan",
      "Season with salt and pepper",
    ],
    tips: "Add a pinch of sugar to balance the acidity!",
    alternatives: {
      tomato: "bell pepper",
    },
  },
  {
    id: 3,
    name: "Egg Drop Soup",
    cookTime: 20,
    difficulty: 1,
    image: "🍲",
    ingredients: ["egg", "chicken broth", "cornstarch", "salt", "pepper", "green onion"],
    instructions: [
      "Heat chicken broth in a pot",
      "Mix cornstarch with water",
      "Add cornstarch mixture to thicken soup",
      "Beat eggs in a bowl",
      "Slowly pour eggs into soup while stirring",
      "Season with salt and pepper",
      "Garnish with green onions",
    ],
    tips: "Stir constantly when adding eggs for silky texture!",
    alternatives: {
      "chicken broth": "vegetable broth",
    },
  },
  {
    id: 4,
    name: "Simple Omelette",
    cookTime: 10,
    difficulty: 1,
    image: "🥚",
    ingredients: ["egg", "milk", "cheese", "salt", "pepper", "butter"],
    instructions: [
      "Beat eggs with milk",
      "Heat butter in non-stick pan",
      "Pour egg mixture into pan",
      "Let it set for 2 minutes",
      "Add cheese to one half",
      "Fold omelette in half",
      "Slide onto plate",
    ],
    tips: "Keep heat medium-low for fluffy texture!",
    alternatives: {
      cheese: "ham or vegetables",
    },
  },
  {
    id: 5,
    name: "Fried Rice",
    cookTime: 25,
    difficulty: 2,
    image: "🍚",
    ingredients: ["rice", "egg", "soy sauce", "garlic", "onion", "carrot", "peas"],
    instructions: [
      "Cook rice and let it cool",
      "Scramble eggs and set aside",
      "Stir fry garlic and onion",
      "Add rice and vegetables",
      "Add soy sauce and eggs",
      "Stir fry until heated through",
    ],
    tips: "Use day-old rice for best texture!",
    alternatives: {
      peas: "corn or green beans",
    },
  },
  {
    id: 6,
    name: "Chicken Soup",
    cookTime: 45,
    difficulty: 2,
    image: "🍲",
    ingredients: ["chicken", "carrot", "onion", "celery", "salt", "pepper", "parsley"],
    instructions: [
      "Boil chicken in water",
      "Remove chicken and shred",
      "Add vegetables to broth",
      "Simmer for 20 minutes",
      "Add chicken back",
      "Season with salt and pepper",
      "Garnish with parsley",
    ],
    tips: "Simmer slowly for rich flavor!",
    alternatives: {
      celery: "potato",
    },
  },
  {
    id: 7,
    name: "Pasta Salad",
    cookTime: 20,
    difficulty: 1,
    image: "🍝",
    ingredients: ["pasta", "tomato", "cheese", "olive oil", "basil", "salt", "pepper"],
    instructions: [
      "Cook pasta according to package",
      "Drain and cool pasta",
      "Dice tomatoes and cheese",
      "Mix pasta with vegetables",
      "Add olive oil and seasonings",
      "Toss with fresh basil",
      "Chill before serving",
    ],
    tips: "Great for meal prep!",
    alternatives: {
      basil: "oregano or parsley",
    },
  },
  {
    id: 8,
    name: "Quick Pancakes",
    cookTime: 15,
    difficulty: 1,
    image: "🥞",
    ingredients: ["flour", "egg", "milk", "butter", "salt", "sugar", "baking powder"],
    instructions: [
      "Mix dry ingredients",
      "Whisk wet ingredients separately",
      "Combine wet and dry ingredients",
      "Heat pan with butter",
      "Pour batter into pan",
      "Flip when bubbles form",
      "Serve hot with syrup",
    ],
    tips: "Don't overmix the batter!",
    alternatives: {
      milk: "buttermilk for tangier flavor",
    },
  },
  {
    id: 9,
    name: "Grilled Cheese",
    cookTime: 8,
    difficulty: 1,
    image: "🧀",
    ingredients: ["bread", "cheese", "butter"],
    instructions: [
      "Butter one side of each bread slice",
      "Place cheese between unbuttered sides",
      "Heat pan over medium heat",
      "Cook sandwich buttered side down",
      "Flip when golden brown",
      "Cook until other side is golden",
      "Cut and serve hot",
    ],
    tips: "Use medium heat for even melting!",
    alternatives: {
      butter: "mayonnaise for crispier crust",
    },
  },
  {
    id: 10,
    name: "Caesar Salad",
    cookTime: 15,
    difficulty: 2,
    image: "🥗",
    ingredients: ["lettuce", "parmesan", "croutons", "caesar dressing", "lemon", "garlic"],
    instructions: [
      "Wash and chop lettuce",
      "Make dressing with garlic and lemon",
      "Toss lettuce with dressing",
      "Add parmesan cheese",
      "Top with croutons",
      "Serve immediately",
    ],
    tips: "Chill the bowl for crispier salad!",
    alternatives: {
      croutons: "toasted nuts",
    },
  },
  {
    id: 11,
    name: "Beef Stir Fry",
    cookTime: 30,
    difficulty: 2,
    image: "🥩",
    ingredients: ["beef", "bell pepper", "onion", "soy sauce", "garlic", "ginger", "oil"],
    instructions: [
      "Slice beef thinly",
      "Heat oil in wok",
      "Stir fry beef until browned",
      "Add vegetables",
      "Add garlic and ginger",
      "Add soy sauce",
      "Stir fry until vegetables are tender",
    ],
    tips: "High heat is key for good stir fry!",
    alternatives: {
      beef: "chicken or tofu",
    },
  },
]

interface Recipe {
  id: number
  name: string
  cookTime: number
  difficulty: number
  image: string
  ingredients: string[]
  instructions: string[]
  tips: string
  alternatives: Record<string, string>
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [userIngredients, setUserIngredients] = useState<string[]>([])
  const [maxCookTime, setMaxCookTime] = useState<number>(300)
  const [maxIngredients, setMaxIngredients] = useState<number>(20)
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  // Get parameters from URL
  useEffect(() => {
    const ingredients = searchParams.get("ingredients")
    const cookTime = searchParams.get("maxCookTime")
    const ingredientCount = searchParams.get("maxIngredients")

    if (ingredients) {
      setUserIngredients(ingredients.split(",").filter((ing) => ing.trim() !== ""))
    }
    if (cookTime) {
      setMaxCookTime(Number.parseInt(cookTime))
    }
    if (ingredientCount) {
      setMaxIngredients(Number.parseInt(ingredientCount))
    }
  }, [searchParams])

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams()
    params.set("ingredients", userIngredients.join(","))
    params.set("maxCookTime", maxCookTime.toString())
    params.set("maxIngredients", maxIngredients.toString())
    router.push(`/results?${params.toString()}`)
  }

  // Add ingredient
  const addIngredient = (ingredient: string) => {
    if (!userIngredients.includes(ingredient)) {
      const newIngredients = [...userIngredients, ingredient]
      setUserIngredients(newIngredients)
      setSearchInput("")
      setShowDropdown(false)
      // Update URL after state change
      setTimeout(() => updateFilters(), 0)
    }
  }

  // Remove ingredient
  const removeIngredient = (ingredient: string) => {
    const newIngredients = userIngredients.filter((item) => item !== ingredient)
    setUserIngredients(newIngredients)
    setTimeout(() => updateFilters(), 0)
  }

  // Filter ingredients for dropdown
  const filteredIngredients = ALL_INGREDIENTS.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(searchInput.toLowerCase()) && !userIngredients.includes(ingredient),
  ).slice(0, 5)

  // Calculate recipe match score
  const calculateMatchScore = (recipe: Recipe): number => {
    const matchingIngredients = recipe.ingredients.filter((ingredient) =>
      userIngredients.some(
        (userIng) =>
          userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(userIng.toLowerCase()),
      ),
    )
    return matchingIngredients.length
  }

  // Filter and sort recipes
  const getFilteredRecipes = () => {
    return (RECIPES_DATA as Recipe[])
      .filter((recipe) => recipe.cookTime <= maxCookTime && recipe.ingredients.length <= maxIngredients)
      .map((recipe) => ({
        ...recipe,
        matchScore: calculateMatchScore(recipe),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const filteredRecipes = getFilteredRecipes()
  const topMatches = filteredRecipes.slice(0, 4)
  const similarRecipes = filteredRecipes.slice(4, 11)

  // Get missing ingredients for a recipe
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
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-gray-800">
          COOK WITH WHAT 🍳
        </Link>
        <div className="flex gap-8">
          <Link href="/recipes" className="text-gray-600 hover:text-gray-800 font-medium">
            TOP RECIPES
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium">
            LOGIN
          </Link>
        </div>
      </header>

      {/* EDITABLE Filter Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
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
                onChange={(e) => {
                  setMaxCookTime(Number(e.target.value))
                  setTimeout(() => updateFilters(), 500) // Debounce
                }}
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
                onChange={(e) => {
                  setMaxIngredients(Number(e.target.value))
                  setTimeout(() => updateFilters(), 500) // Debounce
                }}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            <strong>Found:</strong> {filteredRecipes.length} recipes matching your criteria
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Matches */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">TOP MATCHES</h2>
          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topMatches.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="aspect-square overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-105 transition-transform duration-300">
                      <span className="text-6xl">{recipe.image}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white p-3">
                    <h3 className="font-semibold text-center text-sm">{recipe.name}</h3>
                  </div>
                  {/* Match indicator */}
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {recipe.matchScore}/{recipe.ingredients.length}
                  </div>
                  {/* Cook time indicator */}
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {recipe.cookTime}min
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No recipes found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your filters or adding more ingredients.</p>
            </div>
          )}
        </section>

        {/* Similar Recipes - FIXED: Removed cut-off indicator, added match info to text */}
        {similarRecipes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">SIMILAR RECIPES</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {similarRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  {/* Recipe Image - NO MORE CUT-OFF INDICATOR */}
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative mb-2">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl">{recipe.image}</span>
                    </div>
                  </div>
                  {/* Recipe Info - FIXED: Shows match ratio in ingredients count */}
                  <div className="text-center w-20">
                    <p className="text-xs font-medium text-gray-800 truncate">{recipe.name}</p>
                    <p className="text-xs text-gray-500">{recipe.cookTime}min</p>
                    <p className="text-xs text-gray-500">
                      {recipe.matchScore}/{recipe.ingredients.length} ingredients
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Recipe Detail Modal - FIXED: Light transparent background */}
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
                  {selectedRecipe.ingredients.map((ingredient, index) => {
                    const isMissing = getMissingIngredients(selectedRecipe).includes(ingredient)
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
                    )
                  })}
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

              {/* Missing Ingredient Alternatives */}
              {getMissingIngredients(selectedRecipe).length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Missing Ingredients?</h3>
                  <div className="space-y-1">
                    {getMissingIngredients(selectedRecipe).map((ingredient) => {
                      const alternative = selectedRecipe.alternatives[ingredient]
                      return alternative ? (
                        <p key={ingredient} className="text-gray-700 text-sm">
                          Don't have <span className="font-medium text-red-600">{ingredient}</span>? Use{" "}
                          <span className="font-medium text-green-600">{alternative}</span> instead!
                        </p>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
