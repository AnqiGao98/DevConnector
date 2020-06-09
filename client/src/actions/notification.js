import axios from 'axios';
import { setAlert } from './alert';
import {
  DELETE_NOTIFICATION,
  READ_NOTIFICATION,
  NOTIFICATION_ERROR,
  GET_NOTIFICATIONS,
  CREATE_NOTIFICATION,
} from './types';

//get all notification
export const getNotifications = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/notifications');
    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//read one notification
export const readNotification = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/notifications/${id}`);
    dispatch({
      type: READ_NOTIFICATION,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//delete one notification
export const deleteNotification = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/notifications/${id}`);
    dispatch({
      type: DELETE_NOTIFICATION,
      payload: id,
    });
    dispatch(setAlert('Notification Removed', 'success'));
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
//create a new notification
export const createNotification = (text) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let res = await axios.post('/api/notifications', { text }, config);
    dispatch({
      type: CREATE_NOTIFICATION,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
