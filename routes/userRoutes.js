const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin, protect  } = require('../middlewares/authMiddleware');
const { getUserProfile, editUserProfile, getAllPublicProfiles, getAllProfiles } = require('../controllers/userController');

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags:
 *       - User
 *     security:
*        - Bearer: [] 
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', getUserProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Edit the logged-in user's profile
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               photo:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               profilePublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated user profile
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', ensureAuthenticated, editUserProfile);

/**
 * @swagger
 * /user/profiles:
 *   get:
 *     summary: Get all public user profiles
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved public profiles
 *       401:
 *         description: Unauthorized
 */
router.get('/profiles', ensureAuthenticated, getAllPublicProfiles);

/**
 * @swagger
 * /user/all-profiles:
 *   get:
 *     summary: Get all user profiles (admin only)
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Successfully retrieved all profiles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/all-profiles', ensureAuthenticated, ensureAdmin, getAllProfiles);

module.exports = router;
