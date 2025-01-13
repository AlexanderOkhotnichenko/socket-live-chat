const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userData = require('../controller/userData');
const logout = require('../controller/logout');
const updateUserData = require('../controller/updateUserData');
const searchUser = require('../controller/searchUser');

const router = express.Router();

//* Create user API
router.post('/register', registerUser);
//* Check user email
router.post('/email', checkEmail);
//* Check user password
router.post('/password', checkPassword);
//* Login user data
router.get('/user-data', userData);
//* Logout user
router.get('/logout', logout);
//* Update user data
router.post('/update-user', updateUserData);
//* Search users
router.post('/search-user', searchUser);

module.exports = router;