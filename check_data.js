import db from './models/index.js';

async function check() {
    try {
        const ownerCount = await db.Owner.count();
        const teamCount = await db.Team.count();
        const playerCount = await db.Player.count();

        console.log(`Current counts:`);
        console.log(`Owners: ${ownerCount}`);
        console.log(`Teams: ${teamCount}`);
        console.log(`Players: ${playerCount}`);

        if (ownerCount > 0) {
            const owners = await db.Owner.findAll({ limit: 5 });
            console.log('Sample owners:');
            owners.forEach(o => console.log(`- ${o.email}`));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
