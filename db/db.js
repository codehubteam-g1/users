const index = require('../../users/index');
const users = require('./lib/users');
const addresses = require('./lib/addresses');

const config = {
    database: process.env.DB_NAME || 'rappiclone_users',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '123456789',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    setup: false,
    logging: false
}   

module.exports = async function() {
    let db = await index(config);
    let Users = await users(db);
    const Addresses = await addresses(db);
    return {
        Users,
        Addresses
    }
}