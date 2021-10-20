import { AuthTypes } from "../config/types";

const INITIAL_STATE = {
  loading: false,
  isLoggedIn: '',
  hasCheckedAuthState: true,
  user: {},
  driverList:{}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthTypes.loading:
      return { ...state, loading: action.payload };
    case AuthTypes.isLoggedIn:
      return {
        ...state,
       
        isLoggedIn: action.payload[0],
        user: action.payload[1],
        hasCheckedAuthState: true,
        loading: false
      };
    case AuthTypes.sessionLogin:
      return {
        ...state,
        isLoggedIn: action.payload[0],
        hasCheckedAuthState: true,
       user:action.payload[1]
      };
    default:
      return state;
  }
};
