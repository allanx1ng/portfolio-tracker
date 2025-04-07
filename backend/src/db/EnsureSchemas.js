/**
 * Utility script to ensure all database schemas are properly created
 * This can be run at application startup to guarantee required tables exist
 */

const fs = require('fs');
const path = require('path');
const DatabaseInstance = require("./Database");

class SchemaManager {
    /**
     * Initialize the schema manager
     */
    static async initializeSchemas() {
        try {
            console.log("Initializing database schemas...");
            const db = DatabaseInstance.getInstance();
            
            // First check if plaid_connections table exists
            const tableCheck = await db.queryDb(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'plaid_connections'
                );
            `);
            
            const tableExists = tableCheck[0].exists;
            
            if (!tableExists) {
                console.log("Creating plaid_connections table...");
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
            } else {
                console.log("plaid_connections table already exists");
            }
            
            // Apply transaction schema
            const transactionSchemaPath = path.join(__dirname, 'TransactionSchema.sql');
            const transactionSchema = fs.readFileSync(transactionSchemaPath, 'utf8');
            
            console.log("Applying transaction schema...");
            await db.queryDb(transactionSchema);
            
            console.log("Database schema initialization complete");
            return true;
            
        } catch (error) {
            console.error("Error initializing database schemas:", error);
            return false;
        }
    }
}

module.exports = SchemaManager;
