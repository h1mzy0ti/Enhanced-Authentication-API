const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/roleMiddleware');
const { getUserProfile, updateUserProfile, listPublicProfiles, getAllProfiles } = require('../controllers/userController');

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/public').get(protect, listPublicProfiles);
router.route('/all').get(protect, admin, getAllProfiles);

module.exports = router;
