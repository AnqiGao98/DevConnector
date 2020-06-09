import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getNotifications,
  readNotification,
  deleteNotification,
} from '../../actions/notification';
import NotificationItem from './NotificationItem';
import Spinner from '../layout/Spinner';

const Notifications = ({
  notification: { notifications, loading },
  getNotifications,
}) => {
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className='notifications'>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </div>
    </Fragment>
  );
};

Notifications.propTypes = {
  notification: PropTypes.object.isRequired,
  getNotifications: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  notification: state.notification,
});

export default connect(mapStateToProps, { getNotifications })(Notifications);
