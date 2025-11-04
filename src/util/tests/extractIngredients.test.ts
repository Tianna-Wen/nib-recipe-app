import { extractIngredients } from "../extractIngredients";
import { Meal } from "@/types/meal";

// Mock console.warn to track calls
const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

describe("extractIngredients", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleWarnMock.mockRestore();
  });

  it("should extract ingredients from meal with multiple ingredients", () => {
    const mockMeal: Meal = {
      idMeal: "1",
      strMeal: "Test Meal",
      strCategory: "Test Category",
      strArea: "Test Area",
      strInstructions: "Test instructions",
      strMealThumb: "https://example.com/image.jpg",
      strIngredient1: "Chicken",
      strMeasure1: "500g",
      strIngredient2: "Rice",
      strMeasure2: "1 cup",
      strIngredient3: "Salt",
      strMeasure3: "1 tsp",
      strIngredient4: "", // Empty ingredient should be skipped
      strMeasure4: "",
      strIngredient5: null, // Null ingredient should be skipped
      strMeasure5: null,
      strTags: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    };

    const result = extractIngredients(mockMeal);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      {
        id: "1-chicken",
        mealId: "1",
        mealName: "Test Meal",
        ingredient: "Chicken",
        measure: "500g",
      },
      {
        id: "1-rice",
        mealId: "1",
        mealName: "Test Meal",
        ingredient: "Rice",
        measure: "1 cup",
      },
      {
        id: "1-salt",
        mealId: "1",
        mealName: "Test Meal",
        ingredient: "Salt",
        measure: "1 tsp",
      },
    ]);
  });

  it("should handle ingredients with whitespace", () => {
    const mockMeal: Meal = {
      idMeal: "3",
      strMeal: "Test Meal",
      strCategory: "Test Category",
      strArea: "Test Area",
      strInstructions: "Test instructions",
      strMealThumb: "https://example.com/image.jpg",
      strIngredient1: "  Chicken  ",
      strMeasure1: "  500g  ",
      strIngredient2: "Rice\n",
      strMeasure2: "\t1 cup\t",
      strTags: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    };

    const result = extractIngredients(mockMeal);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "3-chicken",
      mealId: "3",
      mealName: "Test Meal",
      ingredient: "Chicken",
      measure: "500g",
    });
    expect(result[1]).toEqual({
      id: "3-rice",
      mealId: "3",
      mealName: "Test Meal",
      ingredient: "Rice",
      measure: "1 cup",
    });
  });

  it("should handle missing measures", () => {
    const mockMeal: Meal = {
      idMeal: "4",
      strMeal: "Test Meal",
      strCategory: "Test Category",
      strArea: "Test Area",
      strInstructions: "Test instructions",
      strMealThumb: "https://example.com/image.jpg",
      strIngredient1: "Chicken",
      strMeasure1: null,
      strIngredient2: "Rice",
      strMeasure2: "",
      strTags: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    };

    const result = extractIngredients(mockMeal);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "4-chicken",
      mealId: "4",
      mealName: "Test Meal",
      ingredient: "Chicken",
      measure: "",
    });
    expect(result[1]).toEqual({
      id: "4-rice",
      mealId: "4",
      mealName: "Test Meal",
      ingredient: "Rice",
      measure: "",
    });
  });

  it("should stop after 30 ingredients and show warning", () => {
    const mockMeal: Meal = {
      idMeal: "5",
      strMeal: "Large Meal",
      strCategory: "Test Category",
      strArea: "Test Area",
      strInstructions: "Test instructions",
      strMealThumb: "https://example.com/image.jpg",
      strTags: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    };

    // Add 35 ingredient fields
    for (let i = 1; i <= 35; i++) {
      mockMeal[`strIngredient${i}` as keyof Meal] = `Ingredient ${i}`;
      mockMeal[`strMeasure${i}` as keyof Meal] = `${i} unit`;
    }

    const result = extractIngredients(mockMeal);

    expect(result).toHaveLength(30); // Should stop at 30
    expect(console.warn).toHaveBeenCalledWith(
      "Unexpectedly high ingredient count"
    );
    expect(console.warn).toHaveBeenCalledTimes(1);

    // Verify the last ingredient is the 30th one
    expect(result[29]).toEqual({
      id: "5-ingredient 30",
      mealId: "5",
      mealName: "Large Meal",
      ingredient: "Ingredient 30",
      measure: "30 unit",
    });
  });

  it("should generate consistent IDs for same ingredients", () => {
    const mockMeal: Meal = {
      idMeal: "6",
      strMeal: "Test Meal",
      strCategory: "Test Category",
      strArea: "Test Area",
      strInstructions: "Test instructions",
      strMealThumb: "https://example.com/image.jpg",
      strIngredient1: "Chicken",
      strMeasure1: "500g",
      strIngredient2: "chicken", // Different case
      strMeasure2: "200g",
      strIngredient3: "  Chicken  ", // With whitespace
      strMeasure3: "100g",
      strTags: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    };

    const result = extractIngredients(mockMeal);

    expect(result).toHaveLength(3);
    // All should have different IDs despite similar ingredient names
    expect(result[0].id).toBe("6-chicken");
    expect(result[1].id).toBe("6-chicken"); // Lowercase normalized
    expect(result[2].id).toBe("6-chicken"); // Whitespace trimmed and lowercase
  });

  it("should handle special characters in ingredient names", () => {
    const mockMeal: Meal = {
      idMeal: "7",
      strMeal: "Test Meal",
      strCategory: "Test Category",
      strArea: "Test Area",
      strInstructions: "Test instructions",
      strMealThumb: "https://example.com/image.jpg",
      strIngredient1: "Chicken Breast",
      strMeasure1: "2 pieces",
      strIngredient2: "Olive Oil",
      strMeasure2: "2 tbsp",
      strIngredient3: "Salt & Pepper",
      strMeasure3: "to taste",
      strTags: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
    };

    const result = extractIngredients(mockMeal);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("7-chicken breast");
    expect(result[1].id).toBe("7-olive oil");
    expect(result[2].id).toBe("7-salt & pepper");
  });
});
