/**
 * Database Migration Script
 * Creates database tables and initializes the database
 */

require('dotenv').config();
const { connectDB, closeDB } = require('./connection');

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');
        
        // Connect to database (this will create tables if they don't exist)
        await connectDB();
        
        console.log('✅ Database migration completed successfully!');
        console.log('📊 Tables created:');
        console.log('   - users');
        console.log('   - tasks');
        console.log('   - task_tags');
        console.log('   - Indexes and triggers');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await closeDB();
    }
}

// Run migration if called directly
if (require.main === module) {
    migrate()
        .then(() => {
            console.log('✅ Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        });
}

module.exports = migrate;
