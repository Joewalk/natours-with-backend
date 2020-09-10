const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('connection successful'))
  .catch(err => console.log(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening to port: ${port}.....`)
);

process.on('unhandledRejection', err => {
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
