import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MealItem } from "@/types/mealItem";
import ShoppingListModal from "../ShoppingListModal";

const mockOnClose = jest.fn();
const mockRemoveItem = jest.fn();
const mockClearShoppingList = jest.fn();
const mockGetSortedList = jest.fn();

const mockItems: MealItem[] = [
  {
    id: "1",
    ingredient: "Chicken",
    measure: "500g",
    mealName: "Chicken Curry",
    mealId: "1",
  },
  {
    id: "2",
    ingredient: "Rice",
    measure: "1 cup",
    mealName: "Chicken Curry",
    mealId: "1",
  },
  {
    id: "3",
    ingredient: "Tomatoes",
    measure: null,
    mealName: "Salad",
    mealId: "2",
  },
];

describe("ShoppingListModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when not open", () => {
    render(
      <ShoppingListModal
        isOpen={false}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={3}
        getSortedList={mockGetSortedList}
      />
    );

    expect(screen.queryByText("My Shopping List")).not.toBeInTheDocument();
  });

  it("renders empty state when no items", () => {
    mockGetSortedList.mockReturnValue([]);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={0}
        getSortedList={mockGetSortedList}
      />
    );

    expect(screen.getByText("Your shopping list is empty")).toBeInTheDocument();
    expect(screen.queryByText("Clear All Items")).not.toBeInTheDocument();
  });

  it("renders shopping list items when available", () => {
    mockGetSortedList.mockReturnValue(mockItems);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={3}
        getSortedList={mockGetSortedList}
      />
    );

    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("500g")).toBeInTheDocument();
    expect(screen.getByText("Rice")).toBeInTheDocument();
    expect(screen.getByText("1 cup")).toBeInTheDocument();
    expect(screen.getByText("Tomatoes")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    mockGetSortedList.mockReturnValue([]);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={0}
        getSortedList={mockGetSortedList}
      />
    );

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside modal", async () => {
    const user = userEvent.setup();
    mockGetSortedList.mockReturnValue([]);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={0}
        getSortedList={mockGetSortedList}
      />
    );

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls removeItem when remove button is clicked", async () => {
    const user = userEvent.setup();
    mockGetSortedList.mockReturnValue([mockItems[0]]);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={1}
        getSortedList={mockGetSortedList}
      />
    );

    const removeButton = screen.getAllByTitle("Remove item")[0];
    await user.click(removeButton);

    expect(mockRemoveItem).toHaveBeenCalledWith("1");
  });

  it("calls clearShoppingList when clear all button is clicked", async () => {
    const user = userEvent.setup();
    mockGetSortedList.mockReturnValue(mockItems);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={3}
        getSortedList={mockGetSortedList}
      />
    );

    const clearButton = screen.getByText("Clear All Items");
    await user.click(clearButton);

    expect(mockClearShoppingList).toHaveBeenCalledTimes(1);
  });

  it("displays correct item count", () => {
    mockGetSortedList.mockReturnValue(mockItems);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={3}
        getSortedList={mockGetSortedList}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/items? in your list/)).toBeInTheDocument();
  });

  it("displays singular item count", () => {
    mockGetSortedList.mockReturnValue([mockItems[0]]);

    render(
      <ShoppingListModal
        isOpen={true}
        onClose={mockOnClose}
        removeItem={mockRemoveItem}
        clearShoppingList={mockClearShoppingList}
        itemCount={1}
        getSortedList={mockGetSortedList}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/item in your list/)).toBeInTheDocument();
  });
});
