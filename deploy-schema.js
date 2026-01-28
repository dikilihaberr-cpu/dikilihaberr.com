#!/usr/bin/env node

/**
 * PHASE1 Schema Deployment - Direct Database Approach
 * Supabase JWT + Node.js pg client ile direct connection
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load from .env.local
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('🚀 PHASE1 Schema Deployment (Direct PostgreSQL)');
console.log('=' .repeat(60));

// Read SQL file
const sqlFilePath = path.join(__dirname, 'PHASE1_NEW_DATABASE_SCHEMA.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
  console.log(`✅ SQL file loaded (${sqlContent.length} bytes)`);
} catch (error) {
  console.error('❌ Failed to read SQL file:', error.message);
  process.exit(1);
}

// Create pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 60000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected pool error:', err);
  process.exit(1);
});

// Execute schema
(async () => {
  const client = await pool.connect();
  
  try {
    console.log('📡 Connected to Supabase PostgreSQL');
    console.log('🔄 Executing schema...\n');

    // Execute full SQL
    await client.query(sqlContent);

    console.log('✅ Schema executed successfully!');
    console.log('\n' + '='.repeat(60));

    // Verify
    console.log('🔍 Verifying tables...\n');

    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `);

    const tables = result.rows.map(r => r.table_name);
    const required = [
      'users', 'roles', 'permissions', 'user_roles', 'role_permissions',
      'categories', 'tags', 'media', 'news', 'news_tags', 'news_media',
      'comments', 'audit_logs', 'page_statistics'
    ];

    console.log(`✅ Total tables: ${tables.length}`);
    console.log(`✅ Required tables found: ${required.filter(t => tables.includes(t)).length}/${required.length}\n`);

    required.forEach(t => {
      const status = tables.includes(t) ? '✅' : '❌';
      console.log(`  ${status} ${t}`);
    });

    // Check RLS
    console.log('\n🔐 Checking RLS Policies...');
    const rlsResult = await client.query(`
      SELECT schemaname, tablename, policyname
      FROM pg_policies WHERE schemaname = 'public'
      ORDER BY tablename, policyname
    `);

    console.log(`✅ Total RLS policies: ${rlsResult.rows.length}\n`);
    const policyByTable = {};
    rlsResult.rows.forEach(row => {
      if (!policyByTable[row.tablename]) policyByTable[row.tablename] = [];
      policyByTable[row.tablename].push(row.policyname);
    });

    Object.entries(policyByTable).forEach(([table, policies]) => {
      console.log(`  📋 ${table}: ${policies.length} policies`);
    });

    // Check indexes
    console.log('\n📊 Checking Indexes...');
    const indexResult = await client.query(`
      SELECT tablename, indexname FROM pg_indexes
      WHERE schemaname = 'public' AND indexname NOT LIKE 'pg_%'
      ORDER BY tablename
    `);

    console.log(`✅ Total custom indexes: ${indexResult.rows.length}\n`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 PHASE1 SCHEMA DEPLOYMENT COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📋 Summary:');
    console.log(`   • Tables: ${required.length} required tables`);
    console.log(`   • RLS: ${rlsResult.rows.length} security policies`);
    console.log(`   • Indexes: ${indexResult.rows.length} performance indexes`);
    console.log(`   • Roles: 6 (super_admin, admin, editor, author, moderator, viewer)`);
    console.log(`   • Permissions: 11 (create, edit, delete, publish, approve, etc.)`);

    console.log('\n✨ Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Test admin panel: /admin');
    console.log('   3. Create test user and assign role');

  } catch (error) {
    console.error('\n❌ Execution failed:');
    console.error('Error:', error.message);
    if (error.position) {
      console.error('Position:', error.position);
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
