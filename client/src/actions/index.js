import axios from 'axios';
import { FETCH_USER, FETCH_RESOURCES } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitResource = (values, history) => async dispatch => {
  const res = await axios.post('/api/resources', values);
  history.push('/resources');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchResources = () => async dispatch => {
  const res = await axios.get('/api/resources');

  dispatch({ type: FETCH_RESOURCES, payload: res.data });
};
