"use client";

import { Meal } from "@/types/meal";
import {
  PlayIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { extractIngredients } from "@/util/extractIngredients";

interface RecipeModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToShoppingList: (meal: Meal) => void;
}

export default function RecipeModal({
  meal,
  isOpen,
  onClose,
  onAddToShoppingList,
}: RecipeModalProps) {
  if (!isOpen || !meal) return null;

  const ingredients = extractIngredients(meal);

  const handleClickAway = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToShoppingList = () => {
    onAddToShoppingList(meal);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClickAway}
    >
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden w-full flex flex-col">
        {/* Header with Image */}
        <div className="relative flex-shrink-0">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {meal.strMeal}
          </h1>
          <p className="text-sm text-gray-600">
            {meal.strCategory} • {meal.strArea}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {ingredients.map((item, index) => (
                <div key={index} className="flex items-center p-3">
                  <span className="text-gray-600">{item.ingredient}</span>
                  <span className="font-medium text-gray-700">
                    {item.measure ? `: ${item.measure}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Instructions</h3>
            <div className="prose max-w-none">
              {meal.strInstructions.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-4 flex-wrap">
              {meal.strYoutube && (
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                  Watch on YouTube
                </a>
              )}
              {meal.strSource && (
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  View Original Source
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleAddToShoppingList}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add to My Shopping List
          </button>
        </div>
      </div>
    </div>
  );
}
