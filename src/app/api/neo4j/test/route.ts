import { NextRequest, NextResponse } from "next/server";
import getDriver from "@/lib/neo4j";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check environment variables
    const envCheck = {
      NEO4J_URI: !!process.env.NEO4J_URI,
      NEO4J_USERNAME: !!process.env.NEO4J_USERNAME,
      NEO4J_PASSWORD: !!process.env.NEO4J_PASSWORD,
      NEO4J_DATABASE: process.env.NEO4J_DATABASE || "neo4j",
    };

    if (!envCheck.NEO4J_URI || !envCheck.NEO4J_USERNAME || !envCheck.NEO4J_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: "Neo4j environment variables not configured",
        envCheck,
      }, { status: 500 });
    }

    // Test connection
    const driver = getDriver();
    await driver.verifyConnectivity();

    // Test database query
    const session = driver.session({ 
      database: process.env.NEO4J_DATABASE || 'neo4j' 
    });

    try {
      // Simple test query
      const result = await session.run('RETURN 1 AS test');
      const testValue = result.records[0].get('test').toNumber();

      // Get database stats
      const statsResult = await session.run(`
        CALL apoc.meta.stats() YIELD nodeCount, relCount, labelCount, propertyKeyCount
        RETURN nodeCount, relCount, labelCount, propertyKeyCount
      `).catch(() => {
        // If APOC is not available, use basic query
        return session.run(`
          MATCH (n) RETURN count(n) as nodeCount
        `);
      });

      let stats;
      if (statsResult.records.length > 0) {
        const record = statsResult.records[0];
        stats = {
          nodes: record.get('nodeCount')?.toNumber() || 0,
          relationships: record.get('relCount')?.toNumber() || 0,
          labels: record.get('labelCount')?.toNumber() || 0,
          properties: record.get('propertyKeyCount')?.toNumber() || 0,
        };
      }

      // Get User and Project counts
      const userCountResult = await session.run('MATCH (u:User) RETURN count(u) as count');
      const projectCountResult = await session.run('MATCH (p:Project) RETURN count(p) as count');
      const skillCountResult = await session.run('MATCH (s:Skill) RETURN count(s) as count');

      const userCount = userCountResult.records[0]?.get('count').toNumber() || 0;
      const projectCount = projectCountResult.records[0]?.get('count').toNumber() || 0;
      const skillCount = skillCountResult.records[0]?.get('count').toNumber() || 0;

      return NextResponse.json({
        success: true,
        message: "Neo4j connection successful",
        envCheck,
        testQuery: testValue === 1 ? "PASSED" : "FAILED",
        database: process.env.NEO4J_DATABASE || 'neo4j',
        stats: stats || { nodes: 0, relationships: 0 },
        counts: {
          users: userCount,
          projects: projectCount,
          skills: skillCount,
        },
        timestamp: new Date().toISOString(),
      });

    } finally {
      await session.close();
    }

  } catch (error: unknown) {
    console.error("Neo4j connection test failed:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json({
      success: false,
      error: "Neo4j connection failed",
      details: errorMessage,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
