import { Meal } from "@/types/meal";
import Image from "next/image";

interface RecipeGridProps {
  meal: Meal;
}

export default function RecipeGrid({ meal }: RecipeGridProps) {
  return (
    <div className="w-full max-w-2xl mb-6 cursor-pointer">
      <div className="w-full px-6 py-4 border border-gray-300 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              width={112}
              height={112}
              className="w-28 h-28 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {meal.strMeal}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {meal.strCategory} • {meal.strArea}
            </p>
            <p
              className="text-gray-700 leading-relaxed overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {meal.strInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
