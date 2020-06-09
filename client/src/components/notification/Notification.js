import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import {
  readNotification,
  deleteNotification,
} from '../../actions/notification';
import Spinner from '../layout/Spinner';

const Notification = ({
  auth,
  notification: { notification, loading },
  readNotification,
  deleteNotification,
  match,
}) => {
  useEffect(() => {
    readNotification(match.params.id);
  }, [readNotification]);
  return loading || notification === null ? (
    <Spinner />
  ) : (
    <div>
      <Link to='/notifications' className='btn'>
        Back To News
      </Link>
      <div className='ntfc bg-white p-1 my-1'>
        <p>
          {' '}
          {notification.fromUserName !== null && (
            <span>{notification.fromUserName}</span>
          )}{' '}
          {notification.text}{' '}
          {notification.postText !== null && (
            <span>{notification.postText}</span>
          )}
        </p>
        <p className='post-date'>
          {' '}
          <Moment format='YYYY/MM/DD'>{notification.date}</Moment>
        </p>
        <Fragment>
          {notification.type === 'comment' && notification.post !== null && (
            <Link to={`/posts/${notification.post}`}>
              <div>Go to your post</div>
            </Link>
          )}
        </Fragment>
        <Fragment>
          {!auth.loading && notification.receiveUser === auth.user._id && (
            <button
              onClick={(e) => deleteNotification(notification._id)}
              type='button'
              className='btn btn-danger'
            >
              <i className='fas fa-times'></i>
            </button>
          )}
        </Fragment>
      </div>
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  readNotification: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  notification: state.notification,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  readNotification,
  deleteNotification,
})(Notification);
