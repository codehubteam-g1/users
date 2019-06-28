const usersIndex = require('../../users/index');

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
    return await usersIndex(config)
}