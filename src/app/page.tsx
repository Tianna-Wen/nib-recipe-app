"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { searchMeals } from "@/util/mealDb";
import { Meal } from "@/types/meal";
import RecipeGrip from "@/components/RecipeGrid";
import RecipeModal from "@/components/RecipeModal";

export default function Home() {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

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

  return (
    <main className="min-h-screen">
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Recipe Search
        </h1>
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
      />
    </main>
  );
}
