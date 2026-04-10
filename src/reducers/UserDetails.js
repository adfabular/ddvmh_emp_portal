const userDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_USER_DETAILS":
      return action.payload;

    default:
      return state;
  }
};

export default userDetailsReducer;
