'use strict'

const Sequelize = require('sequelize');

module.exports = sequelize => {
    return sequelize.define('administrators_stores_bridges', {
        storeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
}