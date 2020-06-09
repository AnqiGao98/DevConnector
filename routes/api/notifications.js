const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const { check, validationResult } = require('express-validator');

//@rount    GET api/notifications
//@desc     get notifications
//@access   private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiveUser: req.user.id,
    }).sort({
      date: -1,
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

//create new notifications
router.post(
  '/',
  [
    auth,
    [check('text', 'Text is requried').not().isEmpty()],
    [check('receiveUser', 'receiveUser is requried').not().isEmpty()],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newNo = new Notification({
        text: req.body.text,
        receiveUser: req.body.receiveUser,
        fromUser: req.user.id,
        fromUserName: user.name,
      });
      const notifications = await newNo.save();
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  }
);

//@rount    GET api/notifications/:notfID
//@desc     read notifications
//@access   private
router.get('/:id', auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (notification) {
      //update
      notification = await Notification.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isRead: 'true' } },
        { new: true }
      );
    }
    console.log(notification);
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

//@rount    DELETE api/notifications/:notfID
//@desc     delete one notification
//@access   private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndRemove(req.params.id);
    res.json({ msg: 'notification deleted' });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

module.exports = router;
