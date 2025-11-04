"use client";

import { Meal } from "@/types/meal";
import { MealItem } from "@/types/shoppingListItem";

export const extractIngredients = (meal: Meal): MealItem[] => {
  const ingredients: MealItem[] = [];
  let i = 1;

  while (true) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];

    if (ingredient && ingredient.toString().trim() !== "") {
      const id = `${meal.idMeal}-${ingredient.toString().toLowerCase().trim()}`;

      ingredients.push({
        id,
        mealId: meal.idMeal,
        mealName: meal.strMeal,
        ingredient: ingredient.toString().trim(),
        measure: (measure?.toString() || "").trim(),
      });
    }

    i++;

    if (i > 30) {
      console.warn("Unexpectedly high ingredient count");
      break;
    }
  }

  return ingredients;
};
