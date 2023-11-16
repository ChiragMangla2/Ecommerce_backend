const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    try {
        const hashed_Password = await bcrypt.hash(password,10);
        return hashed_Password;
    } catch (error) {
        console.log(error);
    }
}

const comparePassword = async (password,hashedPassword) => {
    try {
        return await bcrypt.compare(password,hashedPassword);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    hashPassword,
    comparePassword
}