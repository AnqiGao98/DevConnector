const express = require('express');

const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//@rount    GET api/profile/me
//@desc     Get current user profile
//@access   Public
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'No profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@rount    POST api/profile/
//@desc     create or update user profile
//@access   Public
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    //Build project object
    const newProfile = {};
    newProfile.user = req.user.id;
    if (company) newProfile.company = company;
    if (location) newProfile.location = location;
    if (website) newProfile.website = website;
    if (bio) newProfile.bio = bio;
    if (status) newProfile.status = status;
    if (githubusername) newProfile.githubusername = githubusername;
    if (skills) {
      newProfile.skills = skills.split(',').map((skill) => skill.trim());
    }
    newProfile.social = {};
    if (youtube) newProfile.social.youtube = youtube;
    if (twitter) newProfile.social.twitter = twitter;
    if (instagram) newProfile.social.instagram = instagram;
    if (linkedin) newProfile.social.linkedin = linkedin;
    if (facebook) newProfile.social.facebook = facebook;
    //console.log(newProfile);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: newProfile },
          { new: true }
        );
        //console.log(profile);
        return res.json(profile);
      }
      //create new profile
      profile = new Profile(newProfile);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
