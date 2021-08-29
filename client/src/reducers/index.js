import { combineReducers } from "redux";
import authReducer from "./authReducer";
import cartReducer from "./cartReducer";
import resourcesReducer from "./resourcesReducer";

export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
  resources: resourcesReducer,
});
