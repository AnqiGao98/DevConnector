import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import notification from '../../reducers/notification';
import { connect } from 'react-redux';
import { deleteNotification } from '../../actions/notification';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
const NotificationItem = ({
  auth,
  notification: {
    _id,
    receiveUser,
    fromUser,
    fromUserName,
    text,
    type,
    post,
    postText,
    isRead,
    date,
  },
  deleteNotification,
}) => {
  return (
    <div className='ntfc bg-white p-1 my-1'>
      <div>
        {isRead ? (
          <Link to={`/notifications/${_id}`} className='notification read'>
            {type === 'comment' && (
              <p className='my-1'>
                {fromUserName} commented on your post{' '}
                <span className='italitc'>{postText}</span>
              </p>
            )}
            {type === 'register' && <p className='my-1'>{text}</p>}
          </Link>
        ) : (
          <Link to={`/notifications/${_id}`} className='notification'>
            {type === 'comment' && (
              <p className='my-1'>
                {fromUserName} commented on your post{' '}
                <span className='italitc'>{postText}</span>
              </p>
            )}
            {type === 'register' && <p className='my-1'>{text}</p>}
          </Link>
        )}
        <p className='post-date read'>
          {' '}
          <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>

        <Fragment>
          {!auth.loading && receiveUser === auth.user._id && (
            <button
              onClick={(e) => deleteNotification(_id)}
              type='button'
              className='btn btn-danger btn_right'
            >
              <i className='fas fa-times'></i>
            </button>
          )}
        </Fragment>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  deleteNotification: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { deleteNotification })(
  NotificationItem
);
