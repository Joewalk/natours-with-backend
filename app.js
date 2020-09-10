const path = require('path');
const express = require('express');
const morgan = require('morgan');
const reateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const gloabalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

// Seriving Static Files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middleware
// Security And Setting Headers
app.use(helmet());

// Development Loging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limiting Request
const limiter = reateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too manu requests from this IP, please try agaein in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into request
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against nosql query injection
app.use(mongoSanitize());

// Data Sanitizaiton against xss injection
app.use(xss());

// Preventing URL polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.all('*', (req, res, next) => {
  next(new AppError('This url can  not be found on the Server', 404));
});

app.use(gloabalErrorHandler);

module.exports = app;
