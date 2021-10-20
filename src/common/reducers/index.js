import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import FilterReducer from './FilterReducer'

export default combineReducers({
    Auth: AuthReducer, 
    Filter: FilterReducer
});