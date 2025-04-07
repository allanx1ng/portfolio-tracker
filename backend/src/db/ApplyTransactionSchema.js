/**
 * Utility script to apply the transaction schema to the database
 * Run this manually if needed: node ApplyTransactionSchema.js
 */

const fs = require('fs');
const path = require('path');
const DatabaseInstance = require('./Database');

async function applyTransactionSchema() {
    try {
        console.log('Applying transaction schema...');
        const db = DatabaseInstance.getInstance();
        
        // First, ensure we have the plaid_connections table
        console.log('Checking for plaid_connections table...');
        const tableCheck = await db.queryDb(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'plaid_connections'
            );
        `);
        
        const tableExists = tableCheck[0].exists;
        
        if (!tableExists) {
            console.log('Creating plaid_connections table...');
            await db.queryDb(`
                CREATE TABLE plaid_connections (
                    item_id TEXT PRIMARY KEY,
                    uid INTEGER REFERENCES useraccount(uid) ON DELETE RESTRICT,
                    access_token TEXT NOT NULL,
                    institution_id TEXT NOT NULL,
                    institution_name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(uid, institution_id)
                );
            `);
            console.log('plaid_connections table created successfully');
        } else {
            console.log('plaid_connections table already exists');
        }
        
        // Now apply the transaction schema
        const schemaPath = path.join(__dirname, 'TransactionSchema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Applying transaction schema...');
        await db.queryDb(schemaSQL);
        
        console.log('Transaction schema applied successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error applying transaction schema:', error);
        process.exit(1);
    }
}

// Run the function if this file is executed directly
if (require.main === module) {
    applyTransactionSchema().catch(err => {
        console.error('Failed to apply transaction schema:', err);
        process.exit(1);
    });
}

module.exports = applyTransactionSchema;
