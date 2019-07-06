'use strict'

const Sequelize = require('sequelize')
const SetupUserModel = require('./models/user')
const SetupAddressModel = require('./models/address')
const SetupAdministratorStoreBridge = require('./models/administratorStoreBridge')

const config = {
    database: process.env.DB_NAME || 'users',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'users-docker_postgresql_1',
    dialect: 'postgres',
    setup: true,
    logging: false,
    define: {
        underscored: true,
        freezeTableName: true,
        paranoid: true
    }
}

module.exports = async function () {
    const sequelize = new Sequelize(config)

    await sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    const User = SetupUserModel(sequelize)
    const Address = SetupAddressModel(sequelize)
    const AdministratorStoreBridge = SetupAdministratorStoreBridge(sequelize)

    User.hasMany(Address, {onDelete: 'CASCADE'})
    Address.belongsTo(User)
    User.hasMany(AdministratorStoreBridge, {onDelete: 'CASCADE'})
    AdministratorStoreBridge.belongsTo(User)

    if (config.setup) sequelize.sync({ force: true })

    return {
        User,
        Address,
        AdministratorStoreBridge
    }
}