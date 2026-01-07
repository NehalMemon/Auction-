import mysql from 'mysql2/promise';

async function testConnection() {
    console.log("1. Attempting to connect...");

    try {
        const connection = await mysql.createConnection({
            host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',
            port: 4000,
            // ... inside the mysql.createConnection block ...
            user: '3376UGxG16S5pvR.node_test', // New user with prefix
            password: 'SimplePass123',         // The simple password
            // ... // 👈 Put your real password here
            database: 'test',
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log("✅ SUCCESS! Connected to TiDB Cloud!");
        await connection.end();

    } catch (error) {
        console.error("❌ CONNECTION FAILED:");
        console.error("Message:", error.message);
    }
}

testConnection();