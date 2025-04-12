const GENRES = require("../constants/genres");

module.exports = (sequelize, DataTypes) => {
    const Music = sequelize.define("Music", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
        },
        musicName: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            validate: {
                len: [2, 50],
            }},
        path: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        artistName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [2, 50],}
        },
        genre: {
            type: DataTypes.ENUM(...GENRES),
            allowNull: false,
        }
    }, {
        tableName: "musics",
        timestamps: true,
    });

    Music.associate = (models) => {
        Music.belongsTo(models.User, {
            foreignKey: "userId",
            as: "User"
        });
    };

    return Music;
};