module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define("Playlist", {
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
            onDelete: "CASCADE",
        },
        playlistName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [2, 50],
            }},
    }, {
        tableName: "playlists",
        timestamps: true,
    });

    Playlist.associate = (models) => {
        Playlist.belongsTo(models.User, {
            foreignKey: "userId",
            as: "User"
        });
    };

    return Playlist;
};