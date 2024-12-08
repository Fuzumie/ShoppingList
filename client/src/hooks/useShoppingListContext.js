import { ShoppingListContext } from '../context/ShoppingListContext'
import { useContext } from 'react'

export const useShoppingListContext = () => {
  const context = useContext(ShoppingListContext)

  if (!context) {
    throw Error('useShoppingListContext must be used inside an ShoppingListContextProvider')
  }

  return context
}