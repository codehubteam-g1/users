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
        let scope = this;
        if (this.selected) {

            return this.getUser().then(user => {
                return user.getAddresses().then(addresses => {
                    for (let i = 0; i < addresses.length; i++) {
                        if (addresses[i].id != scope.id) {
                            console.log(addresses[i].id)
                            console.log(scope.id)
                            return addresses[i].update({ selected: true }).then(r => {
                                console.log('destoyed')
                                return scope.destroy()
                            })
                        }
                    }
                    if (addresses.length === 1) return scope.destroy()

                });
            })
        }
        else
            return this.destroy();
    }

    return addressModel
}