module.exports = async database => {
    try {
        const db = await database;

        let findById = async (id) => {
            let user;
            try {
                user = await db.Users.findById(id);
            }
            catch (error) {
                console.log(error.message)
                // console.log(error.stack)
                throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
            if (!user) throw { error: new Error('No hay una cuenta asociada a este id.'), status: 401 };
            else return user;
        }

        let findByEmail = async email => {
            let user;
            try {
                user = await db.Users.findByEmail(email);
            }
            catch (error) {
                console.log(error.message)
                // console.log(error.stack)
                throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
            if (!user) throw { error: new Error('No hay una cuenta asociada a este correo.'), status: 401 };
            else return user;
        }

        let createUser = async (req, next) => {
            try {
                return await db.Users.createUser(req.body);
            } catch (error) {
                console.log(error.message);
                if (error.errors) {
                    if (error.errors[0].message === 'phone must be unique') throw { error: new Error('Error al registrarte: El teléfono ingresado ya está registrado'), status: 401 };
                    else if (error.errors[0].message === 'email must be unique') throw { error: new Error('Error al registrarte: El email ingresado ya está registrado'), status: 401 };
                    else throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
                }
                else throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
        }

        let authenticateUser = async (email, password) => {
            let validate;
            try {
                validate = await db.Users.authenticateUser(email, password);
                console.log('validate is: ' + validate)
            } catch (error) {
                console.log(error.message)
                // console.log(error.stack)
                throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
            if (!validate) throw { error: new Error('Contraseña incorrecta'), status: 401 };
            else return validate;
        }

        let updateName = async (id, name) => {
            let changes;
            try {
                changes = await db.Users.updateName(id, name);
            } catch (error) {
                throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
            if (changes != true) throw { error: new Error('No hay una cuenta asociada a este id'), status: 401 };
            else return changes;
        }

        let updatePhone = async (id, phone) => {
            let changes;
            try {
                changes = await db.Users.updatePhone(id, phone);
            } catch (error) {
                throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
            if (changes != true) throw { error: new Error('No hay una cuenta asociada a este id'), status: 401 };
            else return changes;
        }

        let updateProfilePicture = async (id, profilePictureUrl) => {
            let changes;
            try {
                changes = await db.Users.updateProfilePicture(id, profilePictureUrl);
            } catch (error) {
                throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
            }
            if (changes != true) throw { error: new Error('No hay una cuenta asociada a este id'), status: 401 };
            else return changes;
        }
        return await {
            findById,
            findByEmail,
            createUser,
            authenticateUser,
            updateName,
            updatePhone,
            updateProfilePicture
        }
    }
    catch (error) {
        throw { status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" };
    }
}