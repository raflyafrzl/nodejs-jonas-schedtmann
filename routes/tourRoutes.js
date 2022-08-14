const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const tourController = require('../controllers/tourController');

router.route('/').get(tourController.getAllTours).post(tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
