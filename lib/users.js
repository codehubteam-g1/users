module.exports = async function (database) {
    try {
        const db = await database;

        let updateName = async (req, next) => {
            try {
                await db.Users.updateName(req.body.id, req.body.name);
                return "Actualización exitosa";
            } catch (error) {
                next({ type: 'unknown', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" });
            }
        }

        let updatePhone = async (req, next) => {
            try {
                await db.Users.updatePhone(req.body.id, req.body.phone);
                return "Actualización exitosa";
            } catch (error) {
                next({ type: 'unknown', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" });
            }
        }

        let updateProfilePicture = async (req, next) => {
            try {
                await db.Users.updateName(req.body.id, req.body.profilePictureUrl);
                return "Actualización exitosa";
            } catch (error) {
                next({ type: 'unknown', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" });
            }
        }
        return await {
            updateName
        }
    }
    catch (error) {
        throw { type: 'db', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" };
    }
}