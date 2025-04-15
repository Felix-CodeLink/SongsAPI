module.exports = (sequelize, DataTypes) => {
    const PlaylistMusic = sequelize.define("PlaylistMusic", {
        playlistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "playlists",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        musicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "musics",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    }, {
        tableName: "playlistMusics",
        timestamps: true,
        id: false
    });

    PlaylistMusic.associate = (models) => {
        PlaylistMusic.belongsTo(models.Playlist, {
            foreignKey: "playlistId",
            as: "Playlist"
        });
        PlaylistMusic.belongsTo(models.Music, {
            foreignKey: "musicId",
            as: "Music"
        });
    };

    return PlaylistMusic;
}