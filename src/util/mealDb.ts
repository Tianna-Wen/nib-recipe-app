import { MealsResponse } from "@/types/meal";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query: string): Promise<MealsResponse> {
  const res = await fetch(`${API_BASE_URL}/search.php?s=${query}`);
  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }
  return res.json();
}

export async function getRandomMeal(): Promise<MealsResponse> {
  const res = await fetch(`${API_BASE_URL}/random.php`);
  if (!res.ok) {
    throw new Error("Failed to fetch random meal");
  }
  return res.json();
}
