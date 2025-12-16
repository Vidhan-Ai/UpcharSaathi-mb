
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    console.log('--- User Count ---');
    const userCount = await prisma.users.count();
    console.log(userCount);

    console.log('\n--- Latest 5 Health Records ---');
    const records = await prisma.healthRecord.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(records, null, 2));
}

checkData()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
