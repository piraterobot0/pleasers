// Simple script to create test users with random picks
// Run with: node scripts/create-test-users.js

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

async function createTestUsersViaAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pleasers.vercel.app';
  
  try {
    console.log('Fetching games...');
    
    // Get games
    const gamesResponse = await fetch(`${baseUrl}/api/games?season=2025&weekType=preseason&week=1`);
    if (!gamesResponse.ok) {
      throw new Error('Failed to fetch games');
    }
    const games = await gamesResponse.json();
    
    console.log(`Found ${games.length} games`);

    // Create picks for each test user
    for (const username of testUsernames) {
      console.log(`Creating picks for: ${username}`);
      
      // Decide how many games this user will pick (between 10-16)
      const numPicks = Math.floor(Math.random() * 7) + 10; // 10-16 picks
      const selectedGames = games.sort(() => 0.5 - Math.random()).slice(0, numPicks);
      
      // Create random picks
      const picks = selectedGames.map(game => ({
        gameId: game.id,
        pickedTeam: Math.random() > 0.5 ? 'home' : 'away',
      }));
      
      console.log(`  Making ${picks.length} picks...`);
      
      // Submit picks via API
      const response = await fetch(`${baseUrl}/api/picks/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          picks,
        }),
      });
      
      if (response.ok) {
        console.log(`  ✅ Successfully created picks for ${username}`);
      } else {
        const error = await response.text();
        console.log(`  ❌ Failed to create picks for ${username}: ${error}`);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🎉 Finished creating test users!');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

// Run the script
createTestUsersViaAPI();