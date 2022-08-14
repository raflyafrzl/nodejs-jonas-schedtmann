const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;
const morgan = require('morgan');
const toursRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

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

module.exports = app;
