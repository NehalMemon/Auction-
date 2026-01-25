import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
    const ownerEmails = ['owner1@example.com', 'owner2@example.com', 'owner3@example.com', 'owner4@example.com'];

    // 0. Cleanup existing demo data
    await queryInterface.bulkDelete('players', { email: { [Sequelize.Op.like]: 'player%@example.com' } });
    await queryInterface.bulkDelete('teams', { name: ['Titans', 'Knights', 'Warriors', 'Kings'] });
    await queryInterface.bulkDelete('owners', { email: ownerEmails });

    // 1. Seed Owners
    const ownerPassword = await bcrypt.hash('password', 10);
    const owners = ownerEmails.map((email, index) => ({
        name: `Owner ${index + 1}`,
        email: email,
        password: ownerPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isOwner: true
    }));

    await queryInterface.bulkInsert('owners', owners);

    const [ownerRows] = await queryInterface.sequelize.query(
        `SELECT id FROM owners WHERE email IN (${ownerEmails.map(e => `'${e}'`).join(',')}) ORDER BY id ASC`
    );
    const ownerIds = ownerRows.map(row => row.id);

    // 2. Seed Teams
    const teams = [
        { name: 'Titans', email: 'titans@example.com', ownerId: ownerIds[0], totalBudget: 10000000, remainingBudget: 10000000, createdAt: new Date(), updatedAt: new Date(), playerCount: 0 },
        { name: 'Knights', email: 'knights@example.com', ownerId: ownerIds[1], totalBudget: 10000000, remainingBudget: 10000000, createdAt: new Date(), updatedAt: new Date(), playerCount: 0 },
        { name: 'Warriors', email: 'warriors@example.com', ownerId: ownerIds[2], totalBudget: 10000000, remainingBudget: 10000000, createdAt: new Date(), updatedAt: new Date(), playerCount: 0 },
        { name: 'Kings', email: 'kings@example.com', ownerId: ownerIds[3], totalBudget: 10000000, remainingBudget: 10000000, createdAt: new Date(), updatedAt: new Date(), playerCount: 0 }
    ];

    await queryInterface.bulkInsert('teams', teams);

    // 3. Seed 50 Players
    const categories = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper-batsman'];
    const playingStyles = ['right-handed', 'left-handed'];
    const battingOrders = ['Top-order', 'Middle-order', 'Lower-order'];
    const bowlingTypes = ['Fast', 'Medium', 'Spin'];
    const auctionCategories = ['Platinum', 'Diamond', 'Gold', 'Silver'];
    const campuses = ['Bahadurabad', 'Clifton', 'Idara-e-noor', 'Phosphorus'];

    const players = [];
    for (let i = 1; i <= 50; i++) {
        players.push({
            name: `Player ${i}`,
            email: `player${i}@example.com`,
            phoneNumber: `0300${Math.floor(1000000 + Math.random() * 9000000)}`,
            playingStyle: playingStyles[Math.floor(Math.random() * playingStyles.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            battingOrder: battingOrders[Math.floor(Math.random() * battingOrders.length)],
            bowlingType: bowlingTypes[Math.floor(Math.random() * bowlingTypes.length)],
            status: 'available',
            isSold: false,
            soldPrice: 0,
            basePrice: 100000 + Math.floor(Math.random() * 900000),
            auctionCategory: auctionCategories[Math.floor(Math.random() * auctionCategories.length)],
            campus: campuses[Math.floor(Math.random() * campuses.length)],
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    await queryInterface.bulkInsert('players', players);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('players', { email: { [Sequelize.Op.like]: 'player%@example.com' } });
    await queryInterface.bulkDelete('teams', { name: ['Titans', 'Knights', 'Warriors', 'Kings'] });
    await queryInterface.bulkDelete('owners', { email: ['owner1@example.com', 'owner2@example.com', 'owner3@example.com', 'owner4@example.com'] });
}
