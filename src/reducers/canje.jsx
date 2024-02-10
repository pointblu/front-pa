export const canjeInitialState =
  JSON.parse(window.localStorage.getItem("canje")) || [];

export const CANJE_ACTION_TYPES = {
  ADD_TO_CANJE: "ADD_TO_CANJE",
  REMOVE_FROM_CANJE: "REMOVE_FROM_CANJE",
  DECREMENT_QUANTITY: "DECREMENT_QUANTITY_CANJE",
  CLEAR_CANJE: "CLEAR_CANJE",
};

// update localStorage with state for canje
export const updateLocalStorage = (state) => {
  window.localStorage.setItem("canje", JSON.stringify(state));
};

const UPDATE_STATE_BY_ACTION = {
  [CANJE_ACTION_TYPES.ADD_TO_CANJE]: (state, action) => {
    const { id } = action.payload;
    const productInCanjeIndex = state.findIndex((item) => item.id === id);

    if (productInCanjeIndex >= 0) {
      // 👀 una forma sería usando structuredClone
      // const newState = structuredClone(state)
      // newState[productInCanjeIndex].quantity += 1

      // 👶 usando el map
      // const newState = state.map(item => {
      //   if (item.id === id) {
      //     return {
      //       ...item,
      //       quantity: item.quantity + 1
      //     }
      //   }

      //   return item
      // })

      // ⚡ usando el spread operator y slice
      const newState = [
        ...state.slice(0, productInCanjeIndex),
        {
          ...state[productInCanjeIndex],
          quantity: state[productInCanjeIndex].quantity + 1,
        },
        ...state.slice(productInCanjeIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    const newState = [
      ...state,
      {
        ...action.payload, // product
        quantity: 1,
      },
    ];

    updateLocalStorage(newState);
    return newState;
  },

  [CANJE_ACTION_TYPES.DECREMENT_QUANTITY]: (state, action) => {
    const { id } = action.payload;
    const productInCanjeIndex = state.findIndex((item) => item.id === id);

    if (productInCanjeIndex >= 0) {
      // Reducir la cantidad en 1, asegurándote de que no sea menor que 1
      const newQuantity = Math.max(1, state[productInCanjeIndex].quantity - 1);

      const newState = [
        ...state.slice(0, productInCanjeIndex),
        {
          ...state[productInCanjeIndex],
          quantity: newQuantity,
        },
        ...state.slice(productInCanjeIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    // Si el producto no está en el carrito, no hagas nada
    return state;
  },
  [CANJE_ACTION_TYPES.REMOVE_FROM_CANJE]: (state, action) => {
    const { id } = action.payload;
    const newState = state.filter((item) => item.id !== id);
    updateLocalStorage(newState);
    return newState;
  },
  [CANJE_ACTION_TYPES.CLEAR_CANJE]: () => {
    updateLocalStorage([]);
    return [];
  },
};

export const canjeReducer = (state, action) => {
  const { type: actionType } = action;
  const updateState = UPDATE_STATE_BY_ACTION[actionType];
  return updateState ? updateState(state, action) : state;
};
