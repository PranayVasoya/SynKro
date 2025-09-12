import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USERNAME;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
      throw new Error('Neo4j environment variables not set');
    }

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    
    // Optional: Verify connection on first creation
    driver.verifyConnectivity().then(() => {
        console.log("Neo4j Driver Connected");
    }).catch(error => {
        console.error("Neo4j Driver connection error:", error);
    });
  }
  return driver;
}

export default getDriver;