module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    // colubas created at e updated at
    timestamps: true,

    // criar nomencaltura com _
    underscored: true,
    underscoredAll: true,
  },
};
