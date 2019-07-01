const express = require('express');
const app = express();
const port = 3001;
const db = require('./db/db')();
const passport = require('./auth/auth')(db);
app.use(passport.initialize());
const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes')(db);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Request-Headers, Access-Control-Request-Method, Origin, X-Requested-With, Content-Type, Accept, DNT, Referer, User-Agent, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/me', passport.authenticate('jwt', { session: false }), secureRoutes);

//Handle errors
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ errorMessage: err.error.message });
});

app.listen(port, () => {
  console.log('Server started')
});