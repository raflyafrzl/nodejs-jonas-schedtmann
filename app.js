const express = require('express');
const morgan = require('morgan');
const toursRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
//1)   Middleware

//check so morgan dependencies always appear on development env only
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from server',
//   });

// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Users

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id/', getTour);

// app.post('/api/v1/tours', addTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('api/v1/tour/:id', deleteTour);

// more clever way

//Mounting routes(sub-application)
app.use('/api/v1/users', userRoutes);

app.use('/api/v1/tours', toursRoutes);

app.all('*', (req, res, next) => {
  res.status(404).send({
    status: 'failed',
    message: `cannot find ${req.originalUrl} URL`
  });
});

module.exports = app;
