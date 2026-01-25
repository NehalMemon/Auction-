import db from './models/index.js';
import { encodeId } from './utils/idHasher.js';

async function debug() {
    try {
        console.log('Testing database connection...');
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Fetching teams with owners...');
        try {
            const teams = await db.Team.findAll({
                include: [{ model: db.Owner, as: "owner" }],
            });
            console.log(`Found ${teams.length} team(s).`);

            if (teams.length > 0) {
                console.log('Testing secureTeams mapping...');
                const secureTeams = teams.map((team) => {
                    const t = team.get({ plain: true });
                    t.hashedId = encodeId(t.id);
                    return t;
                });
                console.log('Mapping successful.');
            }
        } catch (findAllError) {
            console.log('--- FIND ALL ERROR ---');
            console.log('Message:', findAllError.message);
            console.log('SQL:', findAllError.sql);
            if (findAllError.original) {
                console.log('Original Error:', findAllError.original);
            }
            throw findAllError;
        }

        process.exit(0);
    } catch (error) {
        // Fallback for any other error
        if (!error.sql) {
            console.error('GENERIC ERROR:', error);
        }
        process.exit(1);
    }
}

debug();
