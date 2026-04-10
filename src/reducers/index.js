import userDetailsReducer from "./UserDetails";
import showSpinReducer from "./ShowSpin";
import { combineReducers } from "redux";
const allReducers = combineReducers({
  userDetails: userDetailsReducer,
  showSpin: showSpinReducer,
});

export default allReducers;
