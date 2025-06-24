const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'banned'),
            defaultValue: 'active',
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
        },
        password: {
            type: DataTypes.STRING(255), set(value) {
                const saltRounds = 10;
                const hashedPassword = bcrypt.hashSync(value, saltRounds);
                this.setDataValue('password', hashedPassword);
            }

        },

        phone: {
            type: DataTypes.STRING(100), allowNull: true
        },

        timeChangePassWord : {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },

    }, {
        paranoid: true,
        timestamps: true,

    });
    User.prototype.checkPassword = async function (newPassword) {
        try {
            const check = await bcrypt.compare(newPassword, this.password);
            return check;
        } catch (error) {
            console.log(error);
        }
    }
    return User
}

