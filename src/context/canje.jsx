import { useReducer, createContext } from "react";
import { canjeReducer, canjeInitialState } from "../reducers/canje.jsx";

export const CanjeContext = createContext();

function useCanjeReducer() {
  const [state, dispatch] = useReducer(canjeReducer, canjeInitialState);

  const addToCanje = (product) =>
    dispatch({
      type: "ADD_TO_CANJE",
      payload: product,
    });

  const removeFromCanje = (product) =>
    dispatch({
      type: "REMOVE_FROM_CANJE",
      payload: product,
    });

  const decrementQuantityCanje = (product) =>
    dispatch({
      type: "DECREMENT_QUANTITY_CANJE",
      payload: product,
    });

  const clearCanje = () => dispatch({ type: "CLEAR_CANJE" });

  return {
    state,
    addToCanje,
    removeFromCanje,
    clearCanje,
    decrementQuantityCanje,
  };
}

// la dependencia de usar React Context
// es MÍNIMA
export function CanjeProvider({ children }) {
  const {
    state,
    addToCanje,
    removeFromCanje,
    clearCanje,
    decrementQuantityCanje,
  } = useCanjeReducer();

  return (
    <CanjeContext.Provider
      value={{
        canje: state,
        addToCanje,
        removeFromCanje,
        clearCanje,
        decrementQuantityCanje,
      }}
    >
      {children}
    </CanjeContext.Provider>
  );
}
