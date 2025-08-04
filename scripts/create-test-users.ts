import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testUsernames = [
  'packersfanboi',
  'lions4lyfe',
  'steelerfan88',
  'cowboysrule',
  'chiefsking',
  'billsmafia23',
  'ravensraven',
  'patriotspride',
  'broncosbro',
  'seahawksoar',
  'ramsfan2024',
  'chargersbolt',
  'raidersnation',
  'cardinalred',
  'ninerfaithful',
  'bengalstripes',
  'brownstown',
  'titanup99',
  'jaguarjungle',
  'texanstough'
];

async function createTestUsers() {
  try {
    console.log('Fetching games...');
    
    // Get all games for 2025 preseason week 1
    const games = await prisma.game.findMany({
      where: {
        season: 2025,
        weekType: 'preseason',
        week: 1,
      },
      orderBy: {
        gameTime: 'asc',
      },
    });

    if (games.length === 0) {
      console.error('No games found! Make sure games are seeded first.');
      return;
    }

    console.log(`Found ${games.length} games`);

    // Create users and their picks
    for (const username of testUsernames) {
      console.log(`Creating user: ${username}`);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email: `${username}@example.com`,
          name: username,
        },
      });

      // Decide how many games this user will pick (between 8-16)
      const numPicks = Math.floor(Math.random() * 9) + 8; // 8-16 picks
      const selectedGames = games.sort(() => 0.5 - Math.random()).slice(0, numPicks);

      console.log(`  Making ${numPicks} picks...`);

      // Create random picks for selected games
      const picks = selectedGames.map(game => ({
        userId: user.id,
        gameId: game.id,
        pickedTeam: Math.random() > 0.5 ? 'home' : 'away' as 'home' | 'away',
      }));

      await prisma.pick.createMany({
        data: picks,
      });

      console.log(`  ✅ Created ${picks.length} picks for ${username}`);
    }

    console.log('\n🎉 Successfully created all test users and picks!');
    console.log(`Created ${testUsernames.length} users with random picks`);
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createTestUsers();
}

export { createTestUsers };