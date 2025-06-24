
const db = require('../models');
const User = db.user;
const {Op, where} = require("sequelize");
const Yup = require("yup");



const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            });
        }
        await user.destroy();
        return res.status(200).json({
            statusCode: 200,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

const restoreUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.restore({ where: { id: userId } });
        return res.status(200).json({
            statusCode: 200,
            message: "User restored successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

module.exports = {
    deleteUser,
    restoreUser

}