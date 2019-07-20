require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const usersRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const postsRoutes = require('./routes/posts');
const passport = require('passport');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(`mongodb connected`))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`)
);
