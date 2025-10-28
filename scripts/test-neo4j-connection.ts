import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

async function testNeo4jConnection() {
  console.log('🔍 Testing Neo4j Connection...\n');

  // Step 1: Check environment variables
  console.log('📋 Step 1: Checking environment variables...');
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_DATABASE || 'neo4j';

  console.log(`   NEO4J_URI: ${uri ? '✓ Set' : '✗ Missing'}`);
  console.log(`   NEO4J_USERNAME: ${username ? '✓ Set' : '✗ Missing'}`);
  console.log(`   NEO4J_PASSWORD: ${password ? '✓ Set' : '✗ Missing'}`);
  console.log(`   NEO4J_DATABASE: ${database}\n`);

  if (!uri || !username || !password) {
    console.error('❌ Missing required environment variables!');
    console.log('\nPlease ensure your .env file contains:');
    console.log('   NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io');
    console.log('   NEO4J_USERNAME=neo4j');
    console.log('   NEO4J_PASSWORD=your-password');
    console.log('   NEO4J_DATABASE=neo4j (optional)');
    process.exit(1);
  }

  let driver;
  
  try {
    // Step 2: Create driver
    console.log('📋 Step 2: Creating Neo4j driver...');
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    console.log('   ✓ Driver created\n');

    // Step 3: Verify connectivity
    console.log('📋 Step 3: Verifying connectivity...');
    await driver.verifyConnectivity();
    console.log('   ✓ Connection verified\n');

    // Step 4: Test database query
    console.log('📋 Step 4: Testing database query...');
    const session = driver.session({ database });
    
    try {
      // Simple test query
      const result = await session.run('RETURN 1 AS test, timestamp() AS time');
      const testValue = result.records[0].get('test').toNumber();
      const timestamp = result.records[0].get('time').toNumber();
      
      console.log(`   ✓ Test query successful (returned: ${testValue})`);
      console.log(`   ✓ Server timestamp: ${new Date(timestamp).toISOString()}\n`);

      // Step 5: Get database statistics
      console.log('📋 Step 5: Fetching database statistics...');
      
      // Count nodes by label
      const userCountResult = await session.run('MATCH (u:User) RETURN count(u) as count');
      const projectCountResult = await session.run('MATCH (p:Project) RETURN count(p) as count');
      const skillCountResult = await session.run('MATCH (s:Skill) RETURN count(s) as count');
      
      const userCount = userCountResult.records[0]?.get('count').toNumber() || 0;
      const projectCount = projectCountResult.records[0]?.get('count').toNumber() || 0;
      const skillCount = skillCountResult.records[0]?.get('count').toNumber() || 0;

      console.log(`   Users: ${userCount}`);
      console.log(`   Projects: ${projectCount}`);
      console.log(`   Skills: ${skillCount}`);

      // Count relationships
      const relCountResult = await session.run('MATCH ()-[r]->() RETURN count(r) as count');
      const relCount = relCountResult.records[0]?.get('count').toNumber() || 0;
      console.log(`   Relationships: ${relCount}\n`);

      // Step 6: Test a sample query (if data exists)
      if (userCount > 0) {
        console.log('📋 Step 6: Testing sample user query...');
        const sampleUserResult = await session.run(`
          MATCH (u:User)
          RETURN u.username as username, u.id as id
          LIMIT 3
        `);
        
        if (sampleUserResult.records.length > 0) {
          console.log('   Sample users:');
          sampleUserResult.records.forEach((record, index) => {
            console.log(`   ${index + 1}. ${record.get('username')} (ID: ${record.get('id')})`);
          });
        }
        console.log();
      }

      console.log('✅ All tests passed! Neo4j is properly connected and working.\n');
      
    } finally {
      await session.close();
    }

  } catch (error) {
    console.error('\n❌ Connection test failed!\n');
    
    if (error instanceof Error) {
      console.error('Error:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('authentication')) {
        console.log('\n💡 Tip: Check your NEO4J_USERNAME and NEO4J_PASSWORD');
      } else if (error.message.includes('Could not perform discovery')) {
        console.log('\n💡 Tip: Check your NEO4J_URI - ensure it\'s correct and accessible');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('\n💡 Tip: Cannot reach the Neo4j server - check your internet connection and URI');
      }
    } else {
      console.error('Unknown error:', error);
    }
    
    process.exit(1);
    
  } finally {
    if (driver) {
      await driver.close();
      console.log('🔌 Driver closed');
    }
  }
}

// Run the test
testNeo4jConnection().catch(console.error);
