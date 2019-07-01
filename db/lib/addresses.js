module.exports = async database => {
    let db;
    try {
        db = await database;
    } catch (error) {
        throw { status: 500, message: "Ocurrió un error en el servidor. Inténtalo de nuevo en un momento" };
    }

    let findByAddressId = async addressId => {
        let address;
        try {
            address = await db.Addresses.findByAddressId(addressId);
        }
        catch (error) {
            console.log(error.message)
            throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
        }
        if (!address) throw { error: new Error('No hay una dirección asociada a este id.'), status: 401 };
        else return address;
    }

    let findByUserId = async userId => {
        try {
            return await db.Addresses.findByUserId(userId);
        }
        catch (error) {
            console.log(error.message)
            throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
        }
    }

    let createAddress = async body => {
        try {
            return await db.Addresses.createAddress(body);
        } catch (error) {
            console.log(error.message);
            if (error.errors) {
                throw { error: new Error(error.errors[0].message), status: 401 };
            }
            else throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
        }
    }

    let updateAddress = async (userId, addressId, address) => {
        let changes;
        try {
            changes = await db.Addresses.updateAddress(userId, addressId, address);
        } catch (error) {
            throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
        }
        if (changes != true) throw { error: new Error('No hay una dirección asociada a estos ids'), status: 401 };
        else return changes;
    }

    let updateTag = async (userId, addressId, tag) => {
        let changes;
        try {
            changes = await db.Addresses.updateTag(userId, addressId, tag);
        } catch (error) {
            throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
        }
        if (changes != true) throw { error: new Error('No hay una dirección asociada a estos ids'), status: 401 };
        else return changes;
    }

    let deleteAddress = async (userId, addressId) => {
        let changes;
        try {
            changes = await db.Addresses.deleteAddress(userId, addressId);
        } catch (error) {
            throw { error: new Error('Ocurrió un error en el servidor. Inténtalo de nuevo en un momento'), status: 500 };
        }
        if (changes != true) throw { error: new Error('No hay una dirección asociada a estos ids'), status: 401 };
        else return changes;
    }

    return {
        findByAddressId,
        findByUserId,
        createAddress,
        deleteAddress,
        updateAddress,
        updateTag
    }
}