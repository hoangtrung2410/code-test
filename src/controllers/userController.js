const db = require('../models');
const User = db.user;
const {Op} = require("sequelize");
const Yup = require("yup");



const getInformationById = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            });
        }
        const results={
            id: user.id || 0,
            email: user?.email || "",
            phone: user?.phone || "",
            role: user?.role || "",
            status: user?.status || "",
            createAt: user?.createdAt || ""
        }
        return res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: results,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
        });
    }
}









module.exports ={
    getInformationById,

}

