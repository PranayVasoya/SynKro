// scripts/migrate-to-neo4j.ts
// Run this script once to migrate existing data from MongoDB to Neo4j
// Usage: npx tsx scripts/migrate-to-neo4j.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { neo4jService } from '../src/services/neo4j.service.js';
import User from '../src/models/userModel.js';
import Project from '../src/models/projectModel.js';

dotenv.config();

async function migrateUsers() {
  console.log('Migrating users to Neo4j...');
  
  const users = await User.find({}).select('_id username skills');
  
  for (const user of users) {
    try {
      await neo4jService.syncUserFromMongoDB({
        _id: user._id.toString(),
        username: user.username,
        skills: user.skills || []
      });
      console.log(`✓ Migrated user: ${user.username}`);
    } catch (error) {
      console.error(`✗ Failed to migrate user ${user.username}:`, error);
    }
  }
  
  console.log(`Completed user migration: ${users.length} users`);
}

async function migrateProjects() {
  console.log('Migrating project connections to Neo4j...');
  
  const projects = await Project.find({}).populate('createdBy teamMembers');
  
  for (const project of projects) {
    try {
      const allMembers = [
        project.createdBy._id.toString(),
        ...project.teamMembers.map((m: any) => m._id.toString())
      ];
      
      await neo4jService.syncProjectConnections({
        teamMembers: [...new Set(allMembers)]
      });
      
      console.log(`✓ Migrated project: ${project.title}`);
    } catch (error) {
      console.error(`✗ Failed to migrate project ${project.title}:`, error);
    }
  }
  
  console.log(`Completed project migration: ${projects.length} projects`);
}

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
    
    // Migrate data
    await migrateUsers();
    await migrateProjects();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();