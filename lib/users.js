const usersService = require('../usersService');

module.exports = async function () {
    try {
        const uService = await usersService();
        const Users = uService.Users;

        let updateName = async (req, next) => {
            next({ type: 'unknown', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" });
            try {
                await Users.updateName(req.query.id, req.query.name);
                return "Actualización exitosa";
            } catch (error) {
                
            }
        }

        // let updatePhone = async (req, res, next) => {
        //     try {
        //         await Users.updateName(req.query.id, req.query.name);
        //         return "Actualización exitosa";
        //     } catch (error) {
        //         throw { type: 'unknown', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" };
        //     }
        // }

        // let updateProfilePicture = async (req, res, next) => {
        //     try {
        //         await Users.updateName(req.query.id, req.query.name);
        //         return "Actualización exitosa";
        //     } catch (error) {
        //         throw { type: 'unknown', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" };
        //     }
        // }
        return await {
            updateName
        }
    }
    catch (error) {
        throw { type: 'db', status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" };
    }
}