module.exports = (error, next) => {
    console.log('entró al handler')
    console.log(error)
    if (error.errors) {
        if (error.errors[0]) {
            if (error.errors[0].message === 'phone must be unique') next({ error: new Error('Error al registrarte: El teléfono ingresado ya está registrado'), status: 401 })
            else if (error.errors[0].message === 'email must be unique') next({ error: new Error('Error al registrarte: El email ingresado ya está registrado'), status: 401 })
            else if (error.errors[0].message === 'Validation notEmpty on name failed') next({ error: new Error('El nombre no puede estar vacío'), status: 401 })
            else if (error.errors[0].message === 'Validation notEmpty on phone failed') next({ error: new Error('El teléfono no puede estar vacío'), status: 401 })
            else if (error.errors[0].message === 'Validation isUrl on profilePictureUrl failed') next({ error: new Error('La url es inválida'), status: 401 })
            else if (error.errors[0].message === 'Validation isEmail on email failed') next({ error: new Error('Debes ingresar un email válido'), status: 401 })
            else if (error.errors[0].message === 'users.name cannot be null') next({ error: new Error('Tu nombre no puede estar vacío'), status: 401 })
            else next({ error: new Error(error.errors[0].message), status: 401 })
        }
        else {
            console.log('Primer else')
            next({ error: new Error(error.message), status: 500 })
        }
    }
    else if (error.error) {
        console.log('Segundo else')
        next({ error: new Error(error.error), status: 401 })
    }
    else{
        console.log('Tercer else')
        next({ error: new Error(error.message), status: 500 })
    }
}