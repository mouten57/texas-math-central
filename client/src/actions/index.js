import axios from "axios";
import { FETCH_USER, FETCH_CART } from "./types";

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchCart = () => async (dispatch) => {
  const res = await axios.get("/api/cart");
  console.log("IN INDEX.js", res.data);
  dispatch({ type: FETCH_CART, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post("/api/stripe", token);

  dispatch({ type: FETCH_USER, payload: res.data });
};
