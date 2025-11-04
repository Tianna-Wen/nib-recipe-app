export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  strTags: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;

  [key: `strIngredient${number}`]: string | null; // Dynamic keys for ingredients
  [key: `strMeasure${number}`]: string | null; // Dynamic keys for measures
  strYoutube?: string;
  strSource?: string;
}

export interface MealsResponse {
  meals: Meal[] | null;
}
