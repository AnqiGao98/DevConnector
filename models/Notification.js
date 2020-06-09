const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  receiveUser: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  fromUserName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'post',
  },
  postText: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Notification = mongoose.model(
  'notification',
  NotificationSchema
);
