const express = require("express");

const router = express.Router();

//@rount    GET api/posts
//@desc     Test route
//@access   Public
router.get("/", (req, res) => res.send("posts route"));

module.exports = router;
