/**
 * Database Seeder
 * Populates the database with sample data for development
 */

require('dotenv').config();
const { query, connectDB, closeDB } = require('./connection');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        await connectDB();
        
        // Check if data already exists
        const userCount = await query('SELECT COUNT(*) FROM users');
        if (parseInt(userCount.rows[0].count) > 0) {
            console.log('⚠️  Database already contains data. Skipping seed.');
            return;
        }
        
        // Create sample users
        const users = [
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                password: 'password123',
                firstName: 'Jane',
                lastName: 'Smith'
            },
            {
                username: 'demo_user',
                email: 'demo@example.com',
                password: 'demo123',
                firstName: 'Demo',
                lastName: 'User'
            }
        ];
        
        console.log('👥 Creating sample users...');
        const userIds = [];
        
        for (const user of users) {
            const passwordHash = await bcrypt.hash(user.password, 12);
            
            const result = await query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `, [user.username, user.email, passwordHash, user.firstName, user.lastName]);
            
            userIds.push(result.rows[0].id);
            console.log(`✅ Created user: ${user.username} (ID: ${result.rows[0].id})`);
        }
        
        // Create sample tasks
        console.log('📝 Creating sample tasks...');
        
        const tasks = [
            // Tasks for John Doe
            {
                userId: userIds[0],
                title: 'Complete project proposal',
                description: 'Write and submit the project proposal for the new client',
                priority: 'high',
                completed: false,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                tags: ['work', 'urgent']
            },
            {
                userId: userIds[0],
                title: 'Review team performance',
                description: 'Conduct monthly team performance review',
                priority: 'medium',
                completed: true,
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                tags: ['management', 'review']
            },
            {
                userId: userIds[0],
                title: 'Update documentation',
                description: 'Update API documentation for version 2.0',
                priority: 'low',
                completed: false,
                dueDate: null,
                tags: ['documentation']
            },
            
            // Tasks for Jane Smith
            {
                userId: userIds[1],
                title: 'Design new logo',
                description: 'Create a new logo design for the rebranding project',
                priority: 'high',
                completed: false,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                tags: ['design', 'branding']
            },
            {
                userId: userIds[1],
                title: 'Client meeting preparation',
                description: 'Prepare presentation materials for client meeting',
                priority: 'medium',
                completed: false,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                tags: ['meeting', 'presentation']
            },
            {
                userId: userIds[1],
                title: 'Research market trends',
                description: 'Research current market trends for Q4 planning',
                priority: 'low',
                completed: true,
                dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                tags: ['research', 'planning']
            },
            
            // Tasks for Demo User
            {
                userId: userIds[2],
                title: 'Learn React basics',
                description: 'Complete the React fundamentals course',
                priority: 'high',
                completed: false,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                tags: ['learning', 'react', 'frontend']
            },
            {
                userId: userIds[2],
                title: 'Setup development environment',
                description: 'Install and configure VS Code, Node.js, and Git',
                priority: 'medium',
                completed: true,
                dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                tags: ['setup', 'tools']
            },
            {
                userId: userIds[2],
                title: 'Read JavaScript documentation',
                description: 'Go through MDN JavaScript documentation',
                priority: 'low',
                completed: false,
                dueDate: null,
                tags: ['learning', 'javascript']
            }
        ];
        
        for (const task of tasks) {
            const result = await query(`
                INSERT INTO tasks (title, description, priority, completed, due_date, user_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `, [task.title, task.description, task.priority, task.completed, task.dueDate, task.userId]);
            
            const taskId = result.rows[0].id;
            
            // Add tags if provided
            if (task.tags && task.tags.length > 0) {
                for (const tag of task.tags) {
                    await query(`
                        INSERT INTO task_tags (task_id, tag_name)
                        VALUES ($1, $2)
                    `, [taskId, tag]);
                }
            }
            
            console.log(`✅ Created task: ${task.title} (ID: ${taskId})`);
        }
        
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users created: ${userIds.length}`);
        console.log(`   Tasks created: ${tasks.length}`);
        console.log('\n🔑 Sample login credentials:');
        console.log('   john@example.com / password123');
        console.log('   jane@example.com / password123');
        console.log('   demo@example.com / demo123');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await closeDB();
    }
}

// Run seeder if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('✅ Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = seedDatabase;
