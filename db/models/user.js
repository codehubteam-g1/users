'use strict'

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = sequelize => {

    let userModel = sequelize.define('users', {
        email: {
            type: Sequelize.STRING(254),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        passwordHash: {
            type: Sequelize.STRING(60),
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        phone: {
            type: Sequelize.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        profilePictureUrl: {
            type: Sequelize.TEXT,
            validate: {
                isUrl: true
            }
        },
        isUser: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isDeliveryPerson: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isAdministrator: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })

    userModel.createUser = obj => {
        return bcrypt.hash(obj.password, saltRounds).then(hash => {
            obj.passwordHash = hash;
            return userModel.create(obj).then(response => response)
        })
    }

    userModel.findById = function (id) {
        return this.findOne({ where: { id } }).then(user => {
            if (!user) throw ({ error: new Error('No existe un usuario asociado a este id'), status: 401 })
            return user
        })
    }

    userModel.findByEmail = function (email) {
        return this.findOne({ where: { email } }).then(user => {
            if (!user) throw ({ error: new Error('No existe un usuario registrado con este correo'), status: 401 })
            return user
        })
    }

    userModel.prototype.authenticate = function (password) {
        return bcrypt.compare(password, this.passwordHash).then(res => {
            if (!res) throw ({ error: new Error('La contraseña ingresada es incorrecta'), status: 401 })
            return res
        })
    }

    userModel.prototype.addAddress = function (obj) {
        if (obj.selected === false) return this.createAddress(obj)

        let scope = this
        return this.createAddress(obj).then(function (response) {
            scope.getAddresses().then(function (addresses) {
                addresses.forEach(function (currAddress) {
                    if (currAddress.id != response.id) currAddress.update({ selected: false })
                })
                return response
            }).catch(error => error)
        })
    }

    userModel.prototype.unselectAddresses = function (id) {
        let scope = this
        return this.getAddresses().then(addresses => {
            addresses.forEach(function (currAddress) {
                currAddress.update({ selected: false })
                console.log('funcionó')
                return true;
            })
        }).catch(error => error)
    }

    return userModel
}