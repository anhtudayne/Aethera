import db from './src/models/index.js';
import migration from './src/migrations/20260622150000-create-support-tickets.js';

const run = async () => {
    try {
        const queryInterface = db.sequelize.getQueryInterface();
        await migration.up(queryInterface, db.Sequelize);
        console.log("Migration successful");
    } catch(e) {
        console.error("Migration failed:", e);
    }
    process.exit(0);
};
run();
