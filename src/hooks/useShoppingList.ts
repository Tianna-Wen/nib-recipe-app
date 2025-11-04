import { useState, useEffect } from "react";
import { Meal } from "@/types/meal";
import { extractIngredients } from "@/util/extractIngredients";
import { MealItem } from "@/types/mealItem";

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<MealItem[]>(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("nib-shopping-list");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing shopping list from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever shoppingList changes
  useEffect(() => {
    localStorage.setItem("nib-shopping-list", JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Add all ingredients from a meal to the shopping list
  const addMealIngredients = (meal: Meal) => {
    const ingredientsToAdd = extractIngredients(meal);

    setShoppingList((prevList) => {
      // Filter out duplicates (based on ingredient name)
      const newItems = ingredientsToAdd.filter(
        (newItem) => !prevList.find((item) => item.id === newItem.id)
      );
      return [...prevList, ...newItems];
    });

    // Calculate how many items would actually be added
    const newItemsCount = ingredientsToAdd.filter(
      (newItem) => !shoppingList.find((item) => item.id === newItem.id)
    ).length;

    return newItemsCount; // Return count of ACTUALLY added items
  };

  // Remove a specific item from shopping list
  const removeItem = (id: string) => {
    setShoppingList((prevList) => prevList.filter((item) => item.id !== id));
  };

  // Remove all items from a specific meal
  const removeMealItems = (mealId: string) => {
    setShoppingList((prevList) =>
      prevList.filter((item) => item.mealId !== mealId)
    );
  };

  // Clear entire shopping list
  const clearShoppingList = () => {
    setShoppingList([]);
  };

  // Get items sorted alphabetically by ingredient name
  const getSortedList = () => {
    return [...shoppingList].sort((a, b) =>
      a.ingredient.localeCompare(b.ingredient)
    );
  };

  return {
    addMealIngredients,
    removeItem,
    removeMealItems,
    clearShoppingList,
    getSortedList,
    itemCount: shoppingList.length,
  };
}
