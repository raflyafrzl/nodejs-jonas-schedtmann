/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
// const dataTours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 }
        }
      },
      {
        $group: {
          _id: '$difficulty',
          numOfTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: stats
      // results: dataTours.length,
      // data: {
      //   tours: dataTours
      // }
    });
  } catch (err) {
    console.log('error');
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
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
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //kenapa melakukan features.query, karena jika features saja dia tidak mengembalikan query Object
    //setelah itu features.query akan dilakukan await agar mengembalikan dokumen

    const tours = await features.query;
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

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        //digunakan untuk memecahkan jika terdapat array pada suatu schema yang kemudian
        //memecahnya menjadi masing masing document.
        $unwind: '$startDates'
      },
      {
        //urutan dari new Date(Year-month-day)
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numOfTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        //menghilangkan field _id (yang berdasarkan aggregation)
        $project: {
          _id: 0
        }
      },
      {
        //ingat, jika minus 1 berarti dari descending
        $sort: { numOfTourStarts: -1 }
      }
    ]);
    res.status(200).json({
      status: 'success',

      data: plan
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
