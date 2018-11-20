import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import resourcesReducer from './resourcesReducer';
import resourceReducer from './resourceReducer';

export default combineReducers({
  auth: authReducer,
  form: reduxForm,
  resources: resourcesReducer,
  resource: resourceReducer
});
