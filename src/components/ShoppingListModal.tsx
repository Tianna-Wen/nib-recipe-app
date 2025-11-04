"use client";

import { MealItem } from "@/types/mealItem";
import {
  XMarkIcon,
  TrashIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  removeItem: (id: string) => void;
  clearShoppingList: () => void;
  itemCount: number;
  getSortedList: () => MealItem[];
}

export default function ShoppingListModal({
  isOpen,
  onClose,
  removeItem,
  clearShoppingList,
  itemCount,
  getSortedList,
}: ShoppingListModalProps) {
  const handleClickAway = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sortedList = getSortedList();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClickAway}
    >
      <div className="bg-white rounded-2xl max-w-2xl max-h-[80vh] w-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCartIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              My Shopping List
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {itemCount === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Your shopping list is empty
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  <span className="font-semibold">{itemCount}</span>{" "}
                  {itemCount === 1 ? "item" : "items"} in your list
                </p>
              </div>
              <div className="space-y-3">
                {sortedList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-gray-800">
                          {item.ingredient}
                        </span>
                        {item.measure && (
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {item.measure}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        From:{" "}
                        <span className="font-medium">{item.mealName}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-4"
                      title="Remove item"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {itemCount > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={clearShoppingList}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Clear All Items
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
