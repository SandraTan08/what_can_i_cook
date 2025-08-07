'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { EMOJI_MAP } from "../data/emojis";

const userIngredients = [""];
const QUICK_INGREDIENTS = [
  "Egg",
  "Cheese",
  "Rice",
  "Chicken",
  "Carrot",
  "Garlic",
  "Tomato",
  "Onion",
].map((name) => ({
  name,
  emoji: EMOJI_MAP[name] || "❓", // fallback if not found
}));

// Reverted to original floating emojis
const FLOATING_EMOJIS = ["🍳", "🥘", "🍜", "🥗", "🍲", "🥙", "🌮", "🍱"]

export default function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [cookingDuration, setCookingDuration] = useState(60)
  const [ingredientCount, setIngredientCount] = useState(10)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHungry, setIsHungry] = useState(false)

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const filteredIngredients = Object.keys(EMOJI_MAP)
    .filter(
      (ingredient) =>
        ingredient.toLowerCase().includes(searchInput.toLowerCase()) &&
        !userIngredients.includes(ingredient),
    )
    .slice(0, 5);

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient])
      // Fun feedback
      setIsHungry(true)
      setTimeout(() => setIsHungry(false), 500)
    }
    setSearchInput("")
    setShowDropdown(false)
  }

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
  }

  return (
    // background colour 
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 z-0"
        style={{
          backgroundImage: "url('images/blueberry_bg.jpg')", // Original image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      ></div>
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 w-full h-40 z-0 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-70 animate-float-around drop-shadow-md"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + i}s`,
            }}
          >
            🍋
          </div>
        ))}
      </div>


      {/* Interactive Cursor Follower */}
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
      
      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-20">
        {/* Hero Section with Quirky Typography */}
        <div className="text-center mb-8 sm:mb-12 relative">
          {/* Large Background Text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-7xl sm:text-9xl font-black text-white transform -rotate-12">HUNGRY?</span> {/* Adjusted font size for mobile */}
          </div>
          <div className="relative">
            <h1 className="text-4xl sm:text-7xl font-black text-white mb-6 leading-tight">
              <span className="inline-block transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
                WHAT
              </span>{" "}
              <span className="inline-block transform hover:scale-110 hover:-rotate-3 transition-all duration-300 cursor-pointer text-yellow-300"> {/* Original color */}
                CAN
              </span>{" "}
              <span className="inline-block transform hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer">
                YOU
              </span>
              <br />
              <span className="inline-block transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer text-yellow-300"> {/* Original color */}
                COOK
              </span>{" "}
              <span className="inline-block transform hover:scale-110 hover:rotate-1 transition-all duration-300 cursor-pointer">
                TODAY?
              </span>
            </h1>
            {/* Quirky Subtitle */}
            <div className="relative inline-block">
              <p className="text-base sm:text-2xl text-white font-extrabold max-w-2xl mx-auto bg-black/50 backdrop-blur-md px-6 py-3 rounded-full shadow-lg ring-2 ring-white/20 hover:scale-105 transition-all duration-300"> {/* Adjusted padding and font size for mobile */}
                Tell us what you have, we will blow your mind! 🤯
              </p>
              {/* Speech bubble pointer */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-black border-opacity-30"></div>
            </div>
          </div>
        </div>
        {/* Interactive Search Box */}
        <div className="max-w-lg mx-auto mb-8 sm:mb-12 relative">
          <div className="relative group">
            <div
              className={`w-full min-h-16 px-4 py-3 border-4 border-white rounded-3xl shadow-2xl bg-white transform transition-all duration-300 ${ // Adjusted padding for mobile
                selectedIngredients.length > 0 ? "scale-105 rotate-1" : ""
              } group-hover:scale-105 group-hover:shadow-3xl`}
            >
              {/* Selected Ingredients with Fun Animations */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedIngredients.map((ingredient, index) => (
                  <span
                    key={ingredient}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-full text-sm font-bold transform hover:scale-110 transition-all duration-200 animate-bounce-in" // Original colors
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {QUICK_INGREDIENTS.find((item) => item.name === ingredient)?.emoji || EMOJI_MAP[ingredient]} {ingredient}
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
                placeholder={selectedIngredients.length === 0 ? "What's in your fridge? 🤔" : "Add more goodies..."}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  setShowDropdown(e.target.value.length > 0)
                }}
                className="w-full text-lg sm:text-xl outline-none bg-transparent font-semibold placeholder-gray-400"
              />
            </div>
            {/* Animated Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 hover:bg-blue-100 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12" // Original color
            >
              <svg className="w-6 h-6 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Original color */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </button>
          </div>
          {/* Enhanced Dropdown */}
          {showDropdown && filteredIngredients.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-blue-300 rounded-2xl shadow-2xl z-20 overflow-hidden animate-slide-down"> {/* Original color */}
              {filteredIngredients.map((ingredient, index) => (
                <div
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 cursor-pointer border-b border-cyan-100 last:border-b-0 font-semibold text-gray-800 hover:text-blue-600 transition-all duration-200 transform hover:scale-105" // Original colors
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {QUICK_INGREDIENTS.find((item) => item.name === ingredient)?.emoji || EMOJI_MAP[ingredient]} {ingredient}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Mega Fun Button */}
        <div className="text-center mb-12 sm:mb-16">
          <Link
            href={`/results?ingredients=${selectedIngredients.join(",")}&maxCookTime=${cookingDuration}&maxIngredients=${ingredientCount}`}
          >
            <button className="group relative bg-gradient-to-r from-yellow-300 via-amber-400 to-cyan-500 hover:from-yellow-300 via-amber-400 to-cyan-500 text-white px-8 py-4 text-xl sm:text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-rotate-2 w-full sm:w-auto"> {/* Original colors, adjusted padding for mobile */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="animate-bounce">🚀</span>
                FIND MY RECIPES!
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                  ✨
                </span>
              </span>
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-400 to-cyan-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div> {/* Original colors */}
            </button>
          </Link>
        </div>
        {/* Interactive Quick Ingredients */}
        <div className="text-center">
          <p className="text-white text-lg font-bold mb-6 animate-pulse">Quick add these goodies:</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {QUICK_INGREDIENTS.map((item, index) => (
              <button
                key={item.name}
                onClick={() => addIngredient(item.name)}
                className="group px-4 sm:px-6 py-3 bg-white hover:bg-yellow-100 rounded-full text-sm sm:text-base border-3 border-white hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 hover:rotate-3 font-bold text-gray-800 hover:text-blue-600" // Original colors
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-2xl group-hover:animate-bounce inline-block">{item.emoji}</span>
                <span className="ml-2">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
      {/* Enhanced Filter Panel */}
      {showFilters && (
        <div className="fixed inset-x-4 top-24 sm:right-8 sm:left-auto sm:w-96 bg-white rounded-3xl shadow-2xl border-4 border-cyan-300 p-6 sm:p-8 z-50 animate-slide-in"> {/* Adjusted top, padding for mobile */}
          <div className="flex items-center justify-between mb-6 sm:mb-8"> {/* Adjusted margin for mobile */}
            <h3 className="text-xl sm:text-2xl font-black text-sky-600">🎛️ FILTERS</h3> {/* Adjusted font size */}
            <button
              onClick={() => setShowFilters(false)}
              className="text-blue-400 hover:text-red-500 text-2xl font-bold hover:scale-125 transition-all duration-200" // Original color
            >
              ×
            </button>
          </div>
          <div className="space-y-6 sm:space-y-8"> {/* Adjusted spacing for mobile */}
            <div>
              <label className="block font-bold text-gray-800 mb-3 text-base sm:text-lg"> {/* Adjusted font size and margin for mobile */}
                ⏰ Max cooking time: <span className="text-sky-600">{cookingDuration} min</span> {/* Original color */}
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={cookingDuration}
                onChange={(e) => setCookingDuration(Number(e.target.value))}
                className="w-full h-3 bg-cyan-200 rounded-full appearance-none cursor-pointer slider-sky" // Original color, corrected class name
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-3 text-base sm:text-lg"> {/* Adjusted font size and margin for mobile */}
                🥕 Max ingredients: <span className="text-sky-600">{ingredientCount}</span> {/* Original color */}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={ingredientCount}
                onChange={(e) => setIngredientCount(Number(e.target.value))}
                className="w-full h-3 bg-cyan-200 rounded-full appearance-none cursor-pointer slider-sky" // Original color, corrected class name
              />
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-3 sm:py-4 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" // Original colors, adjusted padding and font size for mobile
            >
              APPLY FILTERS! ✨
            </button>
          </div>
        </div>
      )}
      {/* Fun How It Works Section */}
      <section className="relative z-10 bg-white bg-opacity-90 py-12 sm:py-20 mt-12 sm:mt-16"> {/* Adjusted padding and margin for mobile */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-5xl font-black text-gray-800 mb-8 sm:mb-16"> {/* Adjusted font size and margin for mobile */}
            <span className="text-sky-600">HOW</span> IT <span className="text-yellow-500">WORKS</span> {/* Original colors */}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12"> {/* Ensured single column on mobile */}
            {[
              {
                emoji: "🧺",
                title: "Add Ingredients",
                desc: "Tell us what you have",
                color: "from-sky-400 to-yellow-500", // Original colors
              },
              {
                emoji: "🔍",
                title: "Find Recipes",
                desc: "Get personalized suggestions",
                color: "from-sky-700 to-cyan-400", // Original colors
              },
              {
                emoji: "👨‍🍳",
                title: "Start Cooking",
                desc: "Follow simple instructions",
                color: "from-amber-400 to-sky-500", // Original colors
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group transform hover:scale-110 transition-all duration-300 hover:-rotate-3 cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${step.color} rounded-3xl p-6 sm:p-8 shadow-xl group-hover:shadow-2xl transition-all duration-300`} // Adjusted padding for mobile
                >
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 group-hover:animate-bounce">{step.emoji}</div> {/* Adjusted font size and margin for mobile */}
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4"> {/* Adjusted font size and margin for mobile */}
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-white font-semibold opacity-90 text-sm sm:text-base">{step.desc}</p> {/* Adjusted font size for mobile */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(90deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes slide-down {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
      }

      .animate-float {
        animation-name: float;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }

      @keyframes float-around {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        25% {
          transform: translate(-10px, -10px) rotate(5deg);
        }
        50% {
          transform: translate(10px, -20px) rotate(-5deg);
        }
        75% {
          transform: translate(-5px, -10px) rotate(3deg);
        }
        100% {
          transform: translate(0, 0) rotate(0deg);
        }
      }

      .animate-float-around {
        animation: float-around 8s ease-in-out infinite;
      }

        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
        
        .slider-sky::-webkit-slider-thumb { /* Corrected class name from slider-blue to slider-sky */
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff9215ff, #ece448ff); /* Original colors */
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        
        .slider-sky::-webkit-slider-thumb:hover { /* Corrected class name */
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        
        .slider-sky::-moz-range-thumb { /* Corrected class name */
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff9215ff, #ece448ff); /* Original colors */
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
