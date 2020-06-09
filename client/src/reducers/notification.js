import {
  READ_NOTIFICATION,
  GET_NOTIFICATIONS,
  DELETE_NOTIFICATION,
  NOTIFICATION_ERROR,
} from '../actions/types';

const initialState = {
  notifications: [],
  notification: null,
  loading: true,
  error: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        loading: false,
      };
    case READ_NOTIFICATION:
      return {
        ...state,
        notification: payload,
        loading: false,
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notifi) => notifi._id !== payload
        ),
        loading: false,
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
}
