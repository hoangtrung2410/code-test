const db = require('../models');
const User = db.user;
const Yup = require('yup');
const JwtService = require("../services/jwtServices.js");



const login = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            username: Yup.string().required(),
            password: Yup.string().required(),
        });
        let {username, password} = req.body;
        if (!(await schema.isValid(req.body))) {
            const errors = await schema.validate(req.body, { abortEarly: false }).catch(err => err);
            return res.status(400).json({
                statusCode: 400,
                message: errors.errors,
            });
        }

        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        if (!user) {
            return res.status(400).json({
                statusCode: 400,
                message: "User does not exist",
            });
        }
        if(user.status !== 'active'){
            return res.status(403).json({
                statusCode: 403,
                message: "Account has been locked",
            });
        }
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: "Password is incorrect",
            });
        }
        const issuedAt = new Date().getTime()/1000;
        const  accessToken = JwtService.jwtSign({userId: user.id,issuedAt: issuedAt,token:1}, {expiresIn: "5h"});
        const  refreshToken = JwtService.jwtSign({userId: user.id,issuedAt:issuedAt,token:2}, {expiresIn: "7d"});
        const {password: hashedPassword, ...userData} = user.get();
        const resBody = {
            accessToken,
            userData,
            refreshToken
        };
        return res.status(200).json({
            statusCode: 200,
            message: "OK",
            data :resBody,
        });
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};

const register = async (req, res) => {

    try {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            username: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8, 'Password must be at least 8 characters long'),
            role: Yup.string().oneOf(['admin', 'user'], 'Role không hợp lệ'),
        });
        if (!(await schema.isValid(req.body))) {
            const errors = await schema.validate(req.body, { abortEarly: false }).catch(err => err);
            return res.status(400).json({
                statusCode: 400,
                message: errors.errors,
            });
        }
        let {name,username, email, password,role} = req.body;
        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        if (user) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email already exists",
            });
        }
        const newUser = await User.create({
            name,username, email, password,role
        });
        await newUser.save();
        const {password: hashedPassword, ...userData} = newUser.get();
        return res.status(200).json({
                statusCode: 200,
                message: "OK",
                data : userData,
        });
    }catch (e) {
        console.log(e)
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
}



module.exports = {
    login,
    register,
}
