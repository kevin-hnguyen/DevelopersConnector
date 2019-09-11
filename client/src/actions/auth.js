// the action (registration) creator
import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "./type";
import { setAlert } from "./alert";

export const register = ({ name, email, password }) => async dispatch => {
  // we are to send data => prepare an object to hold info
  // remember the Headers tab in Postman?
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data // token sent back from back-end
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};
