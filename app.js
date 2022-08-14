const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;
const morgan = require('morgan');

//1)   Middleware

app.use(morgan('dev'));

app.use(express.json());
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from server',
//   });

// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2) Route Handler
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: dataTours.length,
    data: {
      tours: dataTours,
    },
  });
};
const dataTours = JSON.parse(
  fs.readFileSync(__dirname + '/dev-data/data/tours-simple.json')
);

const getTour = (req, res) => {
  const tour = dataTours.find((el) => el.id === Number(req.params.id));

  console.log(tour);
  //check condition if there's no data that client wanted
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success ',
    data: {
      tour,
    },
  });
};
const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Data has been updated',
    },
  });
};

const addTour = (req, res) => {
  console.log(req.body);
  const newId = dataTours[dataTours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  dataTours.push(newTour);
  fs.writeFile(
    __dirname + '/dev-data/data/tours-simple.json',
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

const deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'NULL',
    },
  });
};

//Users
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yed defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yed defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yed defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yed defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yed defined',
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id/', getTour);

// app.post('/api/v1/tours', addTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('api/v1/tour/:id', deleteTour);

// more clever way

// 3) Routes

const tourRouter = express.Router();
const userRoutes = express.Router();
app.use('/api/v1/tours', tourRouter);
app.use('api/v1/users', userRoutes);
tourRouter.route('/').get(getAllTours).post(getTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

//users
userRoutes.route('/api/v1/users').get(getAllUsers).post(createUser);

userRoutes
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.listen(PORT, () => {
  console.log('Running on port ' + PORT);
});
