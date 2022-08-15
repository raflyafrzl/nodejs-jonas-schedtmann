const fs = require('fs');

const dataTours = JSON.parse(
  fs.readFileSync(__dirname + '/../dev-data/data/tours-simple.json')
);

exports.checkPostData = (req, res, next) => {
  if (!req.body?.price || !req.body?.name) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Invalid Name or Price',
    });
  }
  next();
};

exports.checkId = (req, res, next, val) => {
  console.log('Tour id is ' + val);
  if (Number(val) > dataTours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

//route handler
exports.getTour = (req, res) => {
  const tour = dataTours.find((el) => el.id === Number(req.params.id));
  res.status(200).json({
    status: 'success ',
    data: {
      tour,
    },
  });
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Data has been updated',
    },
  });
};

exports.addTour = (req, res) => {
  console.log(req.body);
  const newId = dataTours[dataTours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  dataTours.push(newTour);
  fs.writeFile(
    __dirname + '/../dev-data/data/tours-simple.json',
    JSON.stringify(dataTours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'NULL',
    },
  });
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: dataTours.length,
    data: {
      tours: dataTours,
    },
  });
};
