'use strict'

const Sequelize = require('sequelize');

module.exports = sequelize => {
    let addressModel = sequelize.define('addresses', {
        address: {
            type: Sequelize.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        tag: {
            type: Sequelize.STRING(30),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        selected: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    })

    addressModel.findById = function (id) {
        return this.findOne({ where: { id } }).then(address => {
            if (!address) throw ({ error: new Error('No existe una dirección asociada a este id'), status: 401 })
            return address
        })
    }

    addressModel.prototype.deleteAddress = function () {
        if (this.selected) {
            this.getUser().then(user => {
                user.getAddresses().then(addresses => {
                    if (addresses.length > 0) addresses[addresses.length - 1].update({ selected: true })
                })
            })
        }

        return this.destroy()
    }

    return addressModel
}