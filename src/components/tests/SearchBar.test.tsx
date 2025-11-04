import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

const mockOnSearch = jest.fn();

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input and button", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText(/Enter the name of a meal/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("calls onSearch with query when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Enter the name of a meal/);
    const button = screen.getByRole("button", { name: "Search" });

    await user.type(input, "chicken");
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith("chicken");
  });

  it("calls onSearch when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Enter the name of a meal/);

    await user.type(input, "pasta{enter}");

    expect(mockOnSearch).toHaveBeenCalledWith("pasta");
  });

  it("does not call onSearch with empty query", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: "Search" });

    await user.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("disables input and button when loading", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText(/Enter the name of a meal/);
    const button = screen.getByRole("button", { name: "Searching..." });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Enter the name of a meal/);

    await user.type(input, "beef stew");

    expect(input).toHaveValue("beef stew");
  });

  it("trims whitespace from query", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Enter the name of a meal/);

    await user.type(input, "  chicken  {enter}");

    expect(mockOnSearch).toHaveBeenCalledWith("chicken");
  });
});
