const express = require('express');
const u = require('../controllers/userController');

const userRoutes = express.Router();

//users
userRoutes.route('/').get(u.getAllUsers).post(u.createUser);

userRoutes
  .route('/:id')
  .get(u.getUser)
  .patch(u.updateUser)
  .delete(u.deleteUser);

module.exports = userRoutes;
