export const updateUser = (userDetails) => {
  return {
    type: "UPDATE_USER_DETAILS",
    payload: userDetails,
  };
};

export const updateShowSpin = (state) => {
  return {
    type: "SHOW_SPIN",
    payload: state,
  };
};
