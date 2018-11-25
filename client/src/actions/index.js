import axios from 'axios';
import { FETCH_USER, FETCH_RESOURCES, FETCH_RESOURCE } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitResource = (values, history) => async dispatch => {
  history.push(`/units/${values.unit}`);
  const res = await axios.post('/api/resources/create', values);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchResources = () => async dispatch => {
  const res = await axios.get('/api/resources');

  dispatch({ type: FETCH_RESOURCES, payload: res.data });
};

export const fetchResource = id => async dispatch => {
  const res = await axios.get(`/api/resources/${id}`);
  dispatch({ type: FETCH_RESOURCE, payload: res.data });
};
