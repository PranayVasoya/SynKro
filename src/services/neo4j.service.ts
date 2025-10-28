import getDriver from '@/lib/neo4j';
import { Session } from 'neo4j-driver';

export class Neo4jService {
  private async getSession(): Promise<Session> {
    const driver = getDriver();
    return driver.session({ database: process.env.NEO4J_DATABASE || 'neo4j' });
  }

  // Test Neo4j connection
  async testConnection(): Promise<{ success: boolean; message: string; stats?: any }> {
    const session = await this.getSession();
    try {
      // Test basic query
      const result = await session.run('RETURN 1 AS test');
      const testValue = result.records[0].get('test').toNumber();
      
      if (testValue !== 1) {
        return { success: false, message: 'Test query failed' };
      }

      // Get database stats
      const userCountResult = await session.run('MATCH (u:User) RETURN count(u) as count');
      const projectCountResult = await session.run('MATCH (p:Project) RETURN count(p) as count');
      const skillCountResult = await session.run('MATCH (s:Skill) RETURN count(s) as count');
      
      const stats = {
        users: userCountResult.records[0]?.get('count').toNumber() || 0,
        projects: projectCountResult.records[0]?.get('count').toNumber() || 0,
        skills: skillCountResult.records[0]?.get('count').toNumber() || 0,
      };

      return { 
        success: true, 
        message: 'Neo4j connection successful',
        stats 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      await session.close();
    }
  }

  // Create or update user node
  async upsertUser(userId: string, username: string, skills: string[]): Promise<void> {
    const session = await this.getSession();
    try {
      await session.run(
        `
        MERGE (u:User {id: $userId})
        SET u.username = $username, u.updatedAt = timestamp()
        WITH u
        UNWIND $skills AS skill
        MERGE (s:Skill {name: skill})
        MERGE (u)-[:HAS_SKILL]->(s)
        `,
        { userId, username, skills }
      );
    } finally {
      await session.close();
    }
  }

  // Create connection between users (e.g., project collaboration)
  async createConnection(userId1: string, userId2: string, connectionType: 'COLLABORATED' | 'TEAMMATE' = 'COLLABORATED'): Promise<void> {
    const session = await this.getSession();
    try {
      await session.run(
        `
        MATCH (u1:User {id: $userId1})
        MATCH (u2:User {id: $userId2})
        MERGE (u1)-[r:${connectionType}]->(u2)
        SET r.createdAt = timestamp()
        `,
        { userId1, userId2 }
      );
    } finally {
      await session.close();
    }
  }

  // Get user recommendations based on skills and mutual connections
  async getRecommendations(userId: string, limit: number = 10): Promise<any[]> {
    const session = await this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(recommended:User)
        WHERE u <> recommended
        WITH recommended, COUNT(DISTINCT s) AS sharedSkills
        
        OPTIONAL MATCH (u:User {id: $userId})-[:COLLABORATED|TEAMMATE]-(mutual)-[:COLLABORATED|TEAMMATE]-(recommended)
        WHERE u <> mutual AND mutual <> recommended
        WITH recommended, sharedSkills, COUNT(DISTINCT mutual) AS mutualConnections
        
        OPTIONAL MATCH (u:User {id: $userId})-[existing:COLLABORATED|TEAMMATE]-(recommended)
        WHERE existing IS NULL
        
        WITH recommended, sharedSkills, mutualConnections
        ORDER BY (sharedSkills * 2 + mutualConnections) DESC
        LIMIT $limit
        
        MATCH (recommended)-[:HAS_SKILL]->(skill:Skill)
        RETURN recommended.id AS userId, 
               recommended.username AS username, 
               sharedSkills, 
               mutualConnections,
               COLLECT(DISTINCT skill.name) AS skills
        `,
        { userId, limit }
      );

      return result.records.map(record => ({
        userId: record.get('userId'),
        username: record.get('username'),
        sharedSkills: record.get('sharedSkills').toNumber(),
        mutualConnections: record.get('mutualConnections').toNumber(),
        skills: record.get('skills'),
        score: record.get('sharedSkills').toNumber() * 2 + record.get('mutualConnections').toNumber()
      }));
    } finally {
      await session.close();
    }
  }

  // Get users with similar skills
  async getUsersBySimilarSkills(userId: string, limit: number = 10): Promise<any[]> {
    const session = await this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(similar:User)
        WHERE u <> similar
        WITH similar, COUNT(DISTINCT s) AS sharedSkillsCount
        ORDER BY sharedSkillsCount DESC
        LIMIT $limit
        
        MATCH (similar)-[:HAS_SKILL]->(skill:Skill)
        RETURN similar.id AS userId,
               similar.username AS username,
               sharedSkillsCount,
               COLLECT(DISTINCT skill.name) AS skills
        `,
        { userId, limit }
      );

      return result.records.map(record => ({
        userId: record.get('userId'),
        username: record.get('username'),
        sharedSkillsCount: record.get('sharedSkillsCount').toNumber(),
        skills: record.get('skills')
      }));
    } finally {
      await session.close();
    }
  }

  // Delete user and all relationships
  async deleteUser(userId: string): Promise<void> {
    const session = await this.getSession();
    try {
      await session.run(
        `
        MATCH (u:User {id: $userId})
        DETACH DELETE u
        `,
        { userId }
      );
    } finally {
      await session.close();
    }
  }

  // Sync user data from MongoDB to Neo4j
  async syncUserFromMongoDB(userData: { _id: string; username: string; skills: string[] }): Promise<void> {
    await this.upsertUser(userData._id, userData.username, userData.skills || []);
  }

  // Sync project team connections
  async syncProjectConnections(projectData: { teamMembers: string[] }): Promise<void> {
    const members = projectData.teamMembers;
    
    // Create connections between all team members
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        await this.createConnection(members[i], members[j], 'TEAMMATE');
      }
    }
  }
}

export const neo4jService = new Neo4jService();