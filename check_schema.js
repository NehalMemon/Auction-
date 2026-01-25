import db from './models/index.js';

async function check() {
    try {
        const [results, metadata] = await db.sequelize.query('DESCRIBE owners');
        console.log('Columns in "owners" table:');
        results.forEach(col => {
            console.log(`- ${col.Field} (${col.Type})`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error describing table:', error);
        process.exit(1);
    }
}

check();
