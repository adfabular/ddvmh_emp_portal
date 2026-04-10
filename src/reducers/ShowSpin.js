const showSpinReducer = (state = false, action) => {
  switch (action.type) {
    case "SHOW_SPIN":
      return action.payload;

    default:
      return state;
  }
};

export default showSpinReducer;
