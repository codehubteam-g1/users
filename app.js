'use strict'

const Express = require('express');
const app = Express();
const PORT = 3000;
const database = require('./db/database')();
const passport = require('./auth/auth')(database);
const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes')(database);

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

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoutes);

//Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (err.error) res.json({ errorMessage: err.error.message });
  else {
    res.json({ errorMessage: 'Ocurrió un error en el servidor. Inténtalo de nuevo en un momento' });
    if (err.errors && err.errors[0]) console.log(err.errors[0].message)
    else console.log(err)
  }
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`)
});