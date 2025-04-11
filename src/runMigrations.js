const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('./database');
const path = require('path');

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: 'src/migrations/*.js',
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  try {
    const pending = await umzug.pending();
    console.log(`Migrations pendentes: ${pending.map(m => m.name).join(', ') || 'Nenhuma'}`);

    await umzug.up();
    console.log('Migrations executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao rodar migrations:', error);
  }
};

module.exports = runMigrations;