import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Meal } from "@/types/meal";
import RecipeGrid from "../RecipeGrid";

// Mock next/image with proper TypeScript types
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

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

    const image = screen.getByAltText("Test Meal");
    expect(image).toBeInTheDocument();
  });
});
