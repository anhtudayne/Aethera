import connectDB from './src/config/configdb.js';
import db from './src/models/index.js';

async function addBioColumn() {
  await connectDB();
  try {
    await db.sequelize.query('ALTER TABLE Users ADD COLUMN bio TEXT NULL;');
    console.log('Column bio added successfully.');
  } catch (err) {
    if (err.message.includes('Duplicate column name')) {
      console.log('Column bio already exists.');
    } else {
      console.error('Error adding column:', err.message);
    }
  }
  process.exit(0);
}

addBioColumn();
