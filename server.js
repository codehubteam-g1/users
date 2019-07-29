'use strict'

const Express = require('express');
const app = Express();
const PORT = 3001;
const database = require('./db/database')();
const passport = require('./auth/auth')(database);
const authRoutes = require('./routes/auth-routes');
const secureRoutes = require('./routes/secure-routes')(database);

const http = require('http')

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

function proxyToService(client_req, client_res, targetHost, targetPort) {
  let options = {
    hostname: targetHost,
    port: targetPort,
    path: client_req.url,
    method: client_req.method,
    headers: Object.assign(client_req.headers, client_req.user)
  }

  let proxy = http.request(options, res => {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, {
      end: true
    })
  })

  client_req.pipe(proxy, {
    end: true
  })
}

app.use(passport.initialize());

app.use('/stores', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  try { proxyToService(req, res, 'stores', 4001) }
  catch (error) {
    next(error)
  }
})

app.use('/orders', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  try { proxyToService(req, res, 'orders', 5001) }
  catch (error) {
    next(error)
  }
})

app.use('/shoppingCarts', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  proxyToService(req, res, 'shopping-carts', 6001)
})

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.use('/', authRoutes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/users', passport.authenticate('jwt', { session: false }), secureRoutes);

//Handle errors
app.use(function (err, req, res, next) {
  console.log('entró a users')
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