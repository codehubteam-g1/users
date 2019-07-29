'use strict'

const Sequelize = require('sequelize');

module.exports = sequelize => {
    return sequelize.define('administrators_stores', {
        storeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
}