import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Meal } from "@/types/meal";
import RecipeGrid from "../RecipeGrid";

const mockMeal: Meal = {
  idMeal: "1",
  strMeal: "Test Meal",
  strCategory: "Test Category",
  strArea: "Test Area",
  strInstructions:
    "This is a test instruction that should be truncated when displayed in the grid component.",
  strMealThumb: "https://example.com/image.jpg",
  strYoutube: undefined,
  strSource: undefined,
  strTags: null,
  strImageSource: null,
  strCreativeCommonsConfirmed: null,
  dateModified: null,
};

describe("RecipeGrid", () => {
  it("renders meal information correctly", () => {
    render(<RecipeGrid meal={mockMeal} />);

    expect(screen.getByText("Test Meal")).toBeInTheDocument();
    expect(screen.getByText("Test Category • Test Area")).toBeInTheDocument();
    expect(screen.getByAltText("Test Meal")).toHaveAttribute(
      "src",
      mockMeal.strMealThumb
    );
  });
});
