export const cartInitialState =
  JSON.parse(window.localStorage.getItem("cart")) || [];

export const CART_ACTION_TYPES = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  DECREMENT_QUANTITY: "DECREMENT_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
};

// update localStorage with state for cart
export const updateLocalStorage = (state) => {
  window.localStorage.setItem("cart", JSON.stringify(state));
};

const UPDATE_STATE_BY_ACTION = {
  [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
    const { id, stock } = action.payload;
    const productInCartIndex = state.findIndex((item) => item.id === id);

    if (productInCartIndex >= 0) {
      // Si el producto ya está en el carrito
      const currentQuantity = state[productInCartIndex].quantity;

      // Verificar si hay suficiente stock
      if (currentQuantity >= stock) {
        // Si no hay stock suficiente, retornar el estado actual sin cambios
        return state;
      }

      // Actualizar la cantidad del producto en el carrito
      const newState = [
        ...state.slice(0, productInCartIndex),
        {
          ...state[productInCartIndex],
          quantity: currentQuantity + 1,
        },
        ...state.slice(productInCartIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    // Si el producto no está en el carrito, verificar el stock antes de agregar
    if (stock > 0) {
      const newState = [
        ...state,
        {
          ...action.payload, // product
          quantity: 1,
        },
      ];

      updateLocalStorage(newState);
      return newState;
    }

    // Si no hay stock disponible, retornar el estado actual sin cambios
    return state;
  },

  [CART_ACTION_TYPES.DECREMENT_QUANTITY]: (state, action) => {
    const { id } = action.payload;
    const productInCartIndex = state.findIndex((item) => item.id === id);

    if (productInCartIndex >= 0) {
      // Reducir la cantidad en 1, asegurándote de que no sea menor que 1
      const newQuantity = Math.max(1, state[productInCartIndex].quantity - 1);

      const newState = [
        ...state.slice(0, productInCartIndex),
        {
          ...state[productInCartIndex],
          quantity: newQuantity,
        },
        ...state.slice(productInCartIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    // Si el producto no está en el carrito, no hagas nada
    return state;
  },
  [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {
    const { id } = action.payload;
    const newState = state.filter((item) => item.id !== id);
    updateLocalStorage(newState);
    return newState;
  },
  [CART_ACTION_TYPES.CLEAR_CART]: () => {
    updateLocalStorage([]);
    return [];
  },
};

export const cartReducer = (state, action) => {
  const { type: actionType } = action;
  const updateState = UPDATE_STATE_BY_ACTION[actionType];
  return updateState ? updateState(state, action) : state;
};
