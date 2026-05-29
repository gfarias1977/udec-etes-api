const PgBoss = require('pg-boss');

let boss;

const getBoss = async () => {
    if (!boss) {
        boss = new PgBoss({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        });
        boss.on('error', (err) => console.error('pg-boss error:', err));
        await boss.start();
    }
    return boss;
};

const stopBoss = async () => {
    if (boss) {
        await boss.stop();
        boss = null;
    }
};

module.exports = { getBoss, stopBoss };
