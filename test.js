const usersService = require('./usersService');


usersService().then(response => response.Users.findById(4).then(response2 => console.log(response2)));