/**
 * Database Connection Module
 * Handles PostgreSQL connection and configuration
 */

const { Pool } = require('pg');
console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD)
// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'task_manager',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error.message);
        return false;
    }
}

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
async function getClient() {
    return await pool.connect();
}

/**
 * Connect to database and run initial setup
 * @returns {Promise<void>}
 */
async function connectDB() {
    try {
        // Test connection
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }

        // Check if tables exist, create if not
        await createTablesIfNotExist();
        
        console.log('✅ Database connection established successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
}

/**
 * Create database tables if they don't exist
 * @returns {Promise<void>}
 */
async function createTablesIfNotExist() {
    try {
        // Drop tables if they exist (for development - removes old schema)
        await query('DROP TABLE IF EXISTS task_tags CASCADE');
        await query('DROP TABLE IF EXISTS tasks CASCADE');
        await query('DROP TABLE IF EXISTS categories CASCADE');
        await query('DROP TABLE IF EXISTS users CASCADE');

        // Create users table
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create categories table
        await query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                color VARCHAR(7) DEFAULT '#6366f1', -- Default indigo color
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, name)
            )
        `);

        // Create tasks table
        await query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT false,
                priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
                due_date TIMESTAMP WITH TIME ZONE,
                progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create task_tags table for many-to-many relationship
        await query(`
            CREATE TABLE IF NOT EXISTS task_tags (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                tag_name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(task_id, tag_name)
            )
        `);

        // Create indexes for better performance
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_progress ON tasks(progress)
        `);
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)
        `);

        // Create updated_at trigger function
        await query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Create triggers for updated_at
        await query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at 
                BEFORE UPDATE ON users 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);

        await query(`
            DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
            CREATE TRIGGER update_categories_updated_at 
                BEFORE UPDATE ON categories 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('✅ Database tables created/verified successfully');
        console.log('📊 Tables created:');
        console.log('   - users');
        console.log('   - categories');
        console.log('   - tasks');
        console.log('   - task_tags');
        console.log('   - Indexes and triggers');
    } catch (error) {
        console.error('❌ Error creating database tables:', error);
        throw error;
    }
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
async function closeDB() {
    try {
        await pool.end();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
}

module.exports = {
    query,
    getClient,
    connectDB,
    closeDB,
    testConnection,
    pool
};
