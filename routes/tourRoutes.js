const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/monthly-plan/:year')
  .get(tourController.aliasTopTours, tourController.getMonthlyPlan);

//this middleware kind of local mini app for certain route( which is tours for this example)
//it wouldn't be bothering any routes because it's only defined in Tour Routes
// router.param('id', tourController.checkId); // menerima 4 parameter

//kenapa di route ini hanya "/" itu karena route("/") hanya mereferensikan kepaling akhir daripada suatu endpoint
//karena selebihnya berada pada app.js
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
