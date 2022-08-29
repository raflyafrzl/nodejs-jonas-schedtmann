/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');

// const dataTours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//route handler
exports.getTour = async (req, res) => {
  // const tour = dataTours.find(el => el.id === Number(req.params.id));
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success ',
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      message: 'failed'
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.addTour = async (req, res) => {
  // const dataTour = new Tour({
  //   name: req.body.name,
  //   price: req.body.price,
  //   rating: req.body.rating
  // });
  // const result = await dataTour.save();

  try {
    const result = await Tour.create(req.body);

    res.status(201).json({
      data: result
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findOneAndDelete(req.params.id);

    //delete status code = 204
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      data: {
        tour: 'Failed to delete data'
      }
    });
  }
};
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: tours
      // results: dataTours.length,
      // data: {
      //   tours: dataTours
      // }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'err'
    });
  }
};
