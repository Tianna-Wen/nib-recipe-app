"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { getRandomMeal, searchMeals } from "@/util/mealDb";
import { Meal } from "@/types/meal";
import RecipeGrip from "@/components/RecipeGrid";
import RecipeModal from "@/components/RecipeModal";
import { useShoppingList } from "@/hooks/useShoppingList";
import { ShoppingCartIcon, SparklesIcon } from "@heroicons/react/16/solid";
import ShoppingListModal from "@/components/ShoppingListModal";

export default function Home() {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);

  const {
    getSortedList,
    removeItem,
    clearShoppingList,
    addMealIngredients,
    itemCount,
  } = useShoppingList();

  useEffect(() => {
    if (selectedMeal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedMeal]); // Only depend on selectedMeal

  const handleRecipeClick = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchMeals(query);
      setMeals(result.meals || []);
    } catch (err) {
      setError("Failed to search recipes. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    setIsSurpriseLoading(true);
    setError(null);

    try {
      const result = await getRandomMeal();
      if (result.meals && result.meals[0]) {
        setIsShoppingListOpen(false);
        setSelectedMeal(result.meals[0]);
      } else {
        setError("Failed to get a random recipe. Please try again.");
      }
    } catch (err) {
      setError("Failed to get a random recipe. Please try again.");
      console.error("Surprise me error:", err);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  const handleAddToShoppingList = (meal: Meal) => {
    const addedCount = addMealIngredients(meal);
    alert(`Added ${addedCount} ingredients to your shopping list!`);
  };

  return (
    <main className="min-h-screen">
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Recipe Search
        </h1>
        <div className="fixed top-6 right-6 flex gap-3 z-60">
          {/* Surprise Me Button */}
          <button
            onClick={handleSurpriseMe}
            disabled={isSurpriseLoading}
            className="flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-400 transition-colors shadow-lg whitespace-nowrap"
          >
            <SparklesIcon className="w-5 h-5" />
            {isSurpriseLoading ? "Loading..." : "Surprise Me"}
          </button>

          {/* My Shopping List Button */}
          <button
            onClick={() => setIsShoppingListOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg whitespace-nowrap"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            My Shopping List
            {itemCount > 0 && (
              <span className="bg-white text-green-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                {itemCount}
              </span>
            )}
          </button>
        </div>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-2xl">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching recipes...</p>
          </div>
        )}

        {!isLoading && meals && (
          <div className="w-full max-w-2xl">
            {meals.length === 0 && (
              <p className="text-gray-600 ml-2 mb-2">
                No recipes found. Try searching for something else.
              </p>
            )}
            {meals.length > 0 && (
              <p className="text-gray-600 ml-2 mb-2">
                Found{" "}
                {meals.length === 1 ? "1 recipe" : `${meals.length} recipes`}
              </p>
            )}
            {meals.map((meal) => (
              <div key={meal.idMeal} onClick={() => handleRecipeClick(meal)}>
                <RecipeGrip meal={meal} />
              </div>
            ))}
          </div>
        )}
      </div>
      <RecipeModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onAddToShoppingList={handleAddToShoppingList}
      />
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        removeItem={removeItem}
        clearShoppingList={clearShoppingList}
        itemCount={itemCount}
        getSortedList={getSortedList}
      />
    </main>
  );
}
