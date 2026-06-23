import db from '../models';

async function addColumn() {
    try {
        console.log('Connecting to database...');
        const queryInterface = db.sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('Orders');
        
        if (tableInfo.momoTransId) {
            console.log('Column momoTransId already exists in Orders table.');
        } else {
            console.log('Adding column momoTransId to Orders table...');
            await queryInterface.addColumn('Orders', 'momoTransId', {
                type: db.Sequelize.STRING,
                allowNull: true,
            });
            console.log('Column momoTransId added successfully.');
        }
    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await db.sequelize.close();
        console.log('Database connection closed.');
    }
}

addColumn();
