// bring in the action type literals
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  DELETE_ACCOUNT,
} from "../actions/type";

const initialState = {
  // instead of session storage, we use local storge to store token.
  token: localStorage.getItem("token"),
  // to render certain functionalities for authenticated users
  isAuthenticated: null,
  // request to back-end may take some time
  // once request gets back => false
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED: {
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    }
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: {
      localStorage.setItem("token", payload.token);
      // insert the payload field
      // toggle the isAuthenticated and loading
      // we save the token into the local storage => token field in initialState is updated
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    }
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case DELETE_ACCOUNT: {
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}
