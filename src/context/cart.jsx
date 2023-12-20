import { useReducer, createContext } from "react";
import { cartReducer, cartInitialState } from "../reducers/cart.jsx";

export const CartContext = createContext();

function useCartReducer() {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const addToCart = (product) =>
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

  const removeFromCart = (product) =>
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: product,
    });

  const decrementQuantity = (product) =>
    dispatch({
      type: "DECREMENT_QUANTITY",
      payload: product,
    });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return { state, addToCart, removeFromCart, clearCart, decrementQuantity };
}

// la dependencia de usar React Context
// es MÍNIMA
export function CartProvider({ children }) {
  const { state, addToCart, removeFromCart, clearCart, decrementQuantity } =
    useCartReducer();

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        clearCart,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
