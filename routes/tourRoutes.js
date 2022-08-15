const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

//this middleware kind of local mini app for certain route( which is tours for this example)
//it wouldn't be bothering any routes because it's only defined in Tour Routes
router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkPostData, tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
