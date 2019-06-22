const express = require('express');
const passport = require('passport');
const app = express();
const port = 3001;

require('./auth/auth');

app.use( express.urlencoded({ extended: false }) );

const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoutes );

//Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});

app.listen(port, () => {
  console.log('Server started')
});