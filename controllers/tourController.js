/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('./../utils/app-error');
// const dataTours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

//route handler
exports.getTour = catchAsync(async (req, res, next) => {
  //jika terjadi error maka Mongoose akan langsung mengangkat errornya dan akan mengira Internal server error
  //oleh karena itu kita harus membuat errornya agar error tersebut menjadi error Operational
  //urutannya yaitu masuk ke catch(pada async catch)
  //kemudian memanggil error middleware yg diisikan oleh error findById
  //dan seterusnya.
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No Tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success ',
    data: tour
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError('No Tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const result = await Tour.create(req.body);

  res.status(201).json({
    data: result
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findOneAndDelete({ _id: req.params.id });
  //delete status code = 204
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
      $addFields: { month: '$_id' } // $_id disini merujuk ke _id yang di $group
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
});
