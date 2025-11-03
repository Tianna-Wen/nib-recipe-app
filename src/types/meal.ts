export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  strYoutube?: string;
  strSource?: string;
  [key: `strIngredient${number}`]: string | null; // Dynamic keys for ingredients
  [key: `strMeasure${number}`]: string | null; // Dynamic keys for measures
}

export interface MealsResponse {
  meals: Meal[] | null;
}
