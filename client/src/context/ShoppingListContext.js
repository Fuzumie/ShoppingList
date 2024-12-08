import { createContext, useReducer } from 'react';

export const ShoppingListContext = createContext();

export const shoppingListReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LISTS':
      return { shoppingLists: action.payload };

    case 'CREATE_LIST':
      return { shoppingLists: [action.payload, ...state.shoppingLists] };

    case 'DELETE_LIST':
      return {
        shoppingLists: state.shoppingLists.filter(
          (list) => list._id !== action.payload
        ),
      };

    case 'RENAME_LIST':
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.id
            ? { ...list, name: action.payload.newName }
            : list
        ),
      };

    case 'ARCHIVE_LIST':
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.id
            ? { ...list, archived: !list.archived }
            : list
        ),
      };

    case 'ADD_ITEM':
      return {
        shoppingLists: state.shoppingLists.map((list) =>
          list._id === action.payload.listId
            ? { ...list, items: [...list.items, action.payload.item] }
            : list
        ),
      };

    case 'REMOVE_ITEM':
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

    case 'RESOLVE_ITEM':
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

export const ShoppingListContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingListReducer, {
    shoppingLists: [],
  });

  return (
    <ShoppingListContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ShoppingListContext.Provider>
  );
};
