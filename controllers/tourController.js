/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');

// const dataTours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

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
    //1) Filtering
    const queryObj = { ...req.query };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach(el => delete queryObj[el]);

    //2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //return Query Object
    let query = Tour.find(JSON.parse(queryStr));

    //3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      //karena sort akan bernilai 'price' maka mongoose akan melakukan sorting berdasarkan price

      query = query.sort(sortBy);
      //sort('price ratingsAverage') <== untuk melakukan sorting dalam 2 kondisi
    } else {
      query = query.sort('-createdAt _id');
    }

    //4) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //5)Pagination

    const page = req.query.page * 1 || 1;
    // //jadi ketika tidak menspesifikasikan limit maka limit akan 100(100 data)

    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page is not exist');
    }

    query = query.skip(skip).limit(limit);

    //Another Way
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    const tours = await query;
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
      message: err.message
    });
  }
};
