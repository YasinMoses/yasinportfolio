import axios from 'axios';
import * as actions from '../api';
// import {apiUrl} from './../../config/config.json';

const apiUrl = process.env.REACT_APP_API_URL;

const api = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const { url, method, data, onStart, onSuccess, onError } = action.payload;

  if (onStart) dispatch({ type: onStart });
  next(action);

  try {
    const response = await axios.request({
      baseURL: apiUrl,
      url,
      method,
      data,
    });
    dispatch(actions.apiCallSuccess(response.data));

    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    dispatch(actions.apiCallFailed(error.message));

    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;