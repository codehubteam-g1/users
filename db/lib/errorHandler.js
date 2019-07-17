module.exports = (error, next) => {
    console.log('entró al handler')
    if (error.message === 'phone must be unique') next({ error: new Error('Error al registrarte: El teléfono ingresado ya está registrado'), status: 401 })
    else if (error.message === 'email must be unique') next({ error: new Error('Error al registrarte: El email ingresado ya está registrado'), status: 401 })
    else if (error.message === 'Validation notEmpty on name failed') next({ error: new Error('El nombre no puede estar vacío'), status: 401 })
    else if (error.message === 'Validation notEmpty on phone failed') next({ error: new Error('El teléfono no puede estar vacío'), status: 401 })
    else if (error.message === 'Validation isUrl on profilePictureUrl failed') next({ error: new Error('La url es inválida'), status: 401 })
    else if (error.message === 'Validation isEmail on email failed') next({ error: new Error('Debes ingresar un email válido'), status: 401 })
    else if (error.message === 'users.name cannot be null') next({ error: new Error('Tu nombre no puede estar vacío'), status: 401 })
    else if(error.message) next({ error: new Error(error.message), status: 500 })
    else next(error)
}