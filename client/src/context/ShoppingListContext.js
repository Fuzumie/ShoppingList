import { createContext, useReducer, useCallback } from "react";
import apiService from "../utility/apiService";

// Context
export const ShoppingListContext = createContext();

// Initial state
const initialState = {
  shoppingLists: [], // Only store the list of shopping lists
};

// Reducer
export const shoppingListReducer = (state, action) => {
  switch (action.type) {
    case "SET_LISTS":
      return { ...state, shoppingLists: action.payload };
    case "CREATE_LIST":
      return { shoppingLists: [action.payload, ...state.shoppingLists] };
    case "DELETE_LIST":
      return {
        shoppingLists: state.shoppingLists.filter(
          (list) => list._id !== action.payload
        ),
      };
    case "RENAME_LIST":
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.id
            ? { ...list, name: action.payload.newName }
            : list
        ),
      };
    case "ARCHIVE_LIST":
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.id
            ? { ...list, archived: !list.archived }
            : list
        ),
      };
      case "ADD_ITEM":
        return {
          shoppingLists: state.shoppingLists.map((list) =>
            list._id === action.payload.listId
              ? { ...list, items: [...(list.items || []), action.payload.item] }
              : list
          ),
        };
      
    case "REMOVE_ITEM":
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(
                  (item) => item._id !== action.payload.itemId
                ),
              }
            : list
        ),
      };
    case "RESOLVE_ITEM":
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item._id === action.payload.itemId
                    ? { ...item, resolved: !item.resolved }
                    : item
                ),
              }
            : list
        ),
      };
    default:
      return state;
  }
};

// Provider
export const ShoppingListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  const fetchShoppingLists = useCallback(async () => {
    try {
      const { data } = await apiService.getShoppingLists();
      dispatch({ type: "SET_LISTS", payload: data });
    } catch (error) {
      console.error("Failed to fetch shopping lists:", error);
    }
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{
        ...state,
        dispatch,
        fetchShoppingLists,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
