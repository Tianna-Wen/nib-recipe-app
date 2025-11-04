import { searchMeals, getRandomMeal } from "../mealDb";
import { MealsResponse } from "@/types/meal";

// Mock fetch
global.fetch = jest.fn();

describe("mealDb API functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchMeals", () => {
    it("should fetch meals successfully", async () => {
      const mockResponse: MealsResponse = {
        meals: [
          {
            idMeal: "1",
            strMeal: "Chicken Curry",
            strCategory: "Chicken",
            strArea: "Indian",
            strInstructions: "Test instructions",
            strMealThumb: "https://example.com/image.jpg",
            strTags: "Curry,Spicy",
            strYoutube: "https://youtube.com/watch?v=test",
            strSource: "https://example.com/source",
            strImageSource: null,
            strCreativeCommonsConfirmed: null,
            dateModified: null,
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchMeals("chicken");

      expect(fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty search results", async () => {
      const mockResponse: MealsResponse = {
        meals: null,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchMeals("nonexistent");

      expect(result).toEqual({ meals: null });
    });

    it("should throw error when fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchMeals("chicken")).rejects.toThrow(
        "Failed to fetch meals"
      );
    });

    it("should handle network errors", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(searchMeals("chicken")).rejects.toThrow("Network error");
    });

    it("should URL encode search query", async () => {
      const mockResponse: MealsResponse = { meals: [] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchMeals("chicken & rice");

      expect(fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken & rice"
      );
    });
  });

  describe("getRandomMeal", () => {
    it("should fetch random meal successfully", async () => {
      const mockResponse: MealsResponse = {
        meals: [
          {
            idMeal: "12345",
            strMeal: "Random Meal",
            strCategory: "Beef",
            strArea: "American",
            strInstructions: "Random instructions",
            strMealThumb: "https://example.com/random.jpg",
            strTags: "Random,Tasty",
            strYoutube: "https://youtube.com/watch?v=random",
            strSource: "https://example.com/random-source",
            strImageSource: null,
            strCreativeCommonsConfirmed: null,
            dateModified: null,
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getRandomMeal();

      expect(fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when random meal fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getRandomMeal()).rejects.toThrow(
        "Failed to fetch random meal"
      );
    });

    it("should handle network errors for random meal", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(getRandomMeal()).rejects.toThrow("Network error");
    });

    it("should handle empty random meal response", async () => {
      const mockResponse: MealsResponse = {
        meals: null,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getRandomMeal();

      expect(result).toEqual({ meals: null });
    });
  });

  describe("API integration", () => {
    it("should use correct API base URL", async () => {
      const mockResponse: MealsResponse = { meals: [] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchMeals("test");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://www.themealdb.com/api/json/v1/1")
      );
    });

    it("should handle different response structures", async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: "1",
            strMeal: "Test Meal",
            // Missing some optional fields
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchMeals("test");

      expect(result.meals?.[0].idMeal).toBe("1");
      expect(result.meals?.[0].strMeal).toBe("Test Meal");
    });
  });
});
