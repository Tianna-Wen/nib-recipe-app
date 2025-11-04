import { renderHook, act } from "@testing-library/react";
import { Meal } from "@/types/meal";
import { extractIngredients } from "@/util/extractIngredients";
import { useShoppingList } from "../useShoppingList";

// Mock the extractIngredients function
jest.mock("@/util/extractIngredients", () => ({
  extractIngredients: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockMeal: Meal = {
  idMeal: "1",
  strMeal: "Test Meal",
  strCategory: "Test Category",
  strArea: "Test Area",
  strInstructions: "Test instructions",
  strMealThumb: "https://example.com/image.jpg",
  strYoutube: undefined,
  strSource: undefined,
  strTags: null,
  strImageSource: null,
  strCreativeCommonsConfirmed: null,
  dateModified: null,
};

const mockIngredients = [
  {
    id: "1-chicken",
    ingredient: "Chicken",
    measure: "500g",
    mealName: "Test Meal",
    mealId: "1",
  },
  {
    id: "1-rice",
    ingredient: "Rice",
    measure: "1 cup",
    mealName: "Test Meal",
    mealId: "1",
  },
  {
    id: "1-salt",
    ingredient: "Salt",
    measure: "1 tsp",
    mealName: "Test Meal",
    mealId: "1",
  },
];

describe("useShoppingList", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    (extractIngredients as jest.Mock).mockReturnValue([...mockIngredients]);
  });

  it("should initialize with empty shopping list", () => {
    const { result } = renderHook(() => useShoppingList());

    expect(result.current.itemCount).toBe(0);
    expect(result.current.getSortedList()).toEqual([]);
  });

  it("should load shopping list from localStorage on mount", () => {
    const storedList = [
      {
        id: "stored-item",
        ingredient: "Stored Ingredient",
        measure: "100g",
        mealName: "Stored Meal",
        mealId: "stored-1",
      },
    ];
    localStorageMock.setItem("nib-shopping-list", JSON.stringify(storedList));

    const { result } = renderHook(() => useShoppingList());

    expect(result.current.itemCount).toBe(1);
    expect(result.current.getSortedList()).toEqual(storedList);
  });

  it("should handle localStorage parsing errors gracefully", () => {
    localStorageMock.setItem("nib-shopping-list", "invalid-json");

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useShoppingList());

    expect(result.current.itemCount).toBe(0);
    expect(result.current.getSortedList()).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error parsing shopping list from localStorage:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should add meal ingredients to shopping list", () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      const addedCount = result.current.addMealIngredients(mockMeal);
      expect(addedCount).toBe(3);
    });

    expect(result.current.itemCount).toBe(3);
    expect(result.current.getSortedList()).toEqual(mockIngredients);
  });

  it("should not add duplicate ingredients", () => {
    const { result } = renderHook(() => useShoppingList());

    let addedCount: number;

    // Add ingredients first time
    act(() => {
      addedCount = result.current.addMealIngredients(mockMeal);
    });

    expect(addedCount!).toBe(3); // Should add 3 items first time
    expect(result.current.itemCount).toBe(3);

    // Try to add the same ingredients again
    act(() => {
      addedCount = result.current.addMealIngredients(mockMeal);
    });

    expect(addedCount!).toBe(0); // No new items should be added
    expect(result.current.itemCount).toBe(3); // Count should remain the same

    // Verify the list content
    const sortedList = result.current.getSortedList();
    expect(sortedList).toHaveLength(3);
    expect(sortedList).toEqual(expect.arrayContaining(mockIngredients));
  });

  it("should remove specific item from shopping list", () => {
    const { result } = renderHook(() => useShoppingList());

    // Add ingredients first
    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    expect(result.current.itemCount).toBe(3);

    // Remove one item
    act(() => {
      result.current.removeItem("1-chicken");
    });

    expect(result.current.itemCount).toBe(2);
    expect(result.current.getSortedList()).toEqual([
      mockIngredients[1], // Rice
      mockIngredients[2], // Salt
    ]);
  });

  it("should remove all items from a specific meal", () => {
    const { result } = renderHook(() => useShoppingList());

    // Add ingredients from first meal
    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    // Add ingredients from second meal
    const secondMeal = { ...mockMeal, idMeal: "2", strMeal: "Second Meal" };
    const secondMealIngredients = [
      {
        id: "2-beef",
        ingredient: "Beef",
        measure: "300g",
        mealName: "Second Meal",
        mealId: "2",
      },
    ];
    (extractIngredients as jest.Mock).mockReturnValueOnce(
      secondMealIngredients
    );

    act(() => {
      result.current.addMealIngredients(secondMeal);
    });

    expect(result.current.itemCount).toBe(4);

    // Remove all items from first meal
    act(() => {
      result.current.removeMealItems("1");
    });

    expect(result.current.itemCount).toBe(1);
    expect(result.current.getSortedList()).toEqual(secondMealIngredients);
  });

  it("should clear entire shopping list", () => {
    const { result } = renderHook(() => useShoppingList());

    // Add ingredients first
    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    expect(result.current.itemCount).toBe(3);

    // Clear all items
    act(() => {
      result.current.clearShoppingList();
    });

    expect(result.current.itemCount).toBe(0);
    expect(result.current.getSortedList()).toEqual([]);
  });

  it("should return sorted list alphabetically by ingredient name", () => {
    const { result } = renderHook(() => useShoppingList());

    const unsortedIngredients = [
      {
        id: "1-zucchini",
        ingredient: "Zucchini",
        measure: "2 pieces",
        mealName: "Test Meal",
        mealId: "1",
      },
      {
        id: "1-apple",
        ingredient: "Apple",
        measure: "1 piece",
        mealName: "Test Meal",
        mealId: "1",
      },
      {
        id: "1-banana",
        ingredient: "Banana",
        measure: "3 pieces",
        mealName: "Test Meal",
        mealId: "1",
      },
    ];

    (extractIngredients as jest.Mock).mockReturnValueOnce(unsortedIngredients);

    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    const sortedList = result.current.getSortedList();

    expect(sortedList[0].ingredient).toBe("Apple");
    expect(sortedList[1].ingredient).toBe("Banana");
    expect(sortedList[2].ingredient).toBe("Zucchini");
  });

  it("should save shopping list to localStorage when updated", () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "nib-shopping-list",
      JSON.stringify(mockIngredients)
    );

    act(() => {
      result.current.removeItem("1-chicken");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(3); // Initial + add + remove
  });

  it("should handle adding ingredients from multiple meals", () => {
    const { result } = renderHook(() => useShoppingList());

    // Add from first meal
    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    // Add from second meal with some overlapping ingredients
    const secondMeal = { ...mockMeal, idMeal: "2", strMeal: "Second Meal" };
    const secondMealIngredients = [
      {
        id: "2-chicken", // Same ingredient, different meal
        ingredient: "Chicken",
        measure: "200g",
        mealName: "Second Meal",
        mealId: "2",
      },
      {
        id: "2-potato",
        ingredient: "Potato",
        measure: "4 pieces",
        mealName: "Second Meal",
        mealId: "2",
      },
    ];
    (extractIngredients as jest.Mock).mockReturnValueOnce(
      secondMealIngredients
    );

    act(() => {
      const addedCount = result.current.addMealIngredients(secondMeal);
      expect(addedCount).toBe(2); // Both should be added since they have different IDs
    });

    expect(result.current.itemCount).toBe(5); // 3 from first meal + 2 from second meal
  });

  it("should return correct item count", () => {
    const { result } = renderHook(() => useShoppingList());

    expect(result.current.itemCount).toBe(0);

    act(() => {
      result.current.addMealIngredients(mockMeal);
    });

    expect(result.current.itemCount).toBe(3);

    act(() => {
      result.current.removeItem("1-chicken");
    });

    expect(result.current.itemCount).toBe(2);
  });
});
