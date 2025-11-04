import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Meal } from "@/types/meal";
import RecipeModal from "../RecipeModal";

jest.mock("@/util/extractIngredients", () => ({
  extractIngredients: jest.fn(() => [
    { ingredient: "Test Ingredient 1", measure: "1 cup" },
    { ingredient: "Test Ingredient 2", measure: "2 tbsp" },
  ]),
}));

const mockMeal: Meal = {
  idMeal: "1",
  strMeal: "Test Meal",
  strCategory: "Test Category",
  strArea: "Test Area",
  strInstructions: "Step 1: Do this\nStep 2: Do that\nStep 3: Finish",
  strMealThumb: "https://example.com/image.jpg",
  strYoutube: "https://youtube.com/test",
  strSource: "https://example.com/source",
};

const mockOnClose = jest.fn();
const mockOnAddToShoppingList = jest.fn();

describe("RecipeModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when not open or no meal", () => {
    render(
      <RecipeModal
        meal={null}
        isOpen={false}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    expect(screen.queryByText("Test Meal")).not.toBeInTheDocument();
  });

  it("renders meal details when open", () => {
    render(
      <RecipeModal
        meal={mockMeal}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    expect(screen.getByText("Test Meal")).toBeInTheDocument();
    expect(screen.getByText("Test Category • Test Area")).toBeInTheDocument();
    expect(screen.getByAltText("Test Meal")).toHaveAttribute(
      "src",
      mockMeal.strMealThumb
    );
  });

  it("renders instructions split by new lines", () => {
    render(
      <RecipeModal
        meal={mockMeal}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    expect(screen.getByText("Step 1: Do this")).toBeInTheDocument();
    expect(screen.getByText("Step 2: Do that")).toBeInTheDocument();
    expect(screen.getByText("Step 3: Finish")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RecipeModal
        meal={mockMeal}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside modal", async () => {
    const user = userEvent.setup();
    render(
      <RecipeModal
        meal={mockMeal}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onAddToShoppingList when add button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RecipeModal
        meal={mockMeal}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    const addButton = screen.getByText("Add to My Shopping List");
    await user.click(addButton);

    expect(mockOnAddToShoppingList).toHaveBeenCalledWith(mockMeal);
  });

  it("renders YouTube and Source links when available", () => {
    render(
      <RecipeModal
        meal={mockMeal}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    expect(screen.getByText("Watch on YouTube")).toHaveAttribute(
      "href",
      mockMeal.strYoutube
    );
    expect(screen.getByText("View Original Source")).toHaveAttribute(
      "href",
      mockMeal.strSource
    );
  });

  it("does not render YouTube and Source links when not available", () => {
    const mealWithoutLinks = {
      ...mockMeal,
      strYoutube: undefined,
      strSource: undefined,
    };

    render(
      <RecipeModal
        meal={mealWithoutLinks}
        isOpen={true}
        onClose={mockOnClose}
        onAddToShoppingList={mockOnAddToShoppingList}
      />
    );

    expect(screen.queryByText("Watch on YouTube")).not.toBeInTheDocument();
    expect(screen.queryByText("View Original Source")).not.toBeInTheDocument();
  });
});
