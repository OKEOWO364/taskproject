/**
 * User Routes
 * Handles user profile management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { query, getClient } = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const { validateBody, validateParams, schemas } = require('../middleware/validation');

// Apply authentication middleware to all user routes
router.use(authenticate);

/**
 * GET /api/users
 * Get all users (for task assignment)
 */
router.get('/', async (req, res, next) => {
    try {
        const usersQuery = `
            SELECT 
                id,
                username,
                email,
                first_name,
                last_name,
                is_active,
                created_at
            FROM users 
            WHERE is_active = true
            ORDER BY username ASC
        `;
        
        const result = await query(usersQuery);
        
        const users = result.rows.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            createdAt: user.created_at
        }));
        
        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userQuery = `
            SELECT 
                id,
                username,
                email,
                first_name,
                last_name,
                is_active,
                created_at,
                updated_at
            FROM users 
            WHERE id = $1
        `;
        
        const result = await query(userQuery, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = result.rows[0];
        
        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                isActive: user.is_active,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/users/profile
 * Update current user profile
 */
router.put('/profile', validateBody(schemas.userUpdate), async (req, res, next) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const userId = req.user.id;
        const { username, email, firstName, lastName } = req.body;

        // Check if username or email already exists (excluding current user)
        if (username || email) {
            const checkQuery = `
                SELECT id FROM users 
                WHERE (username = $1 OR email = $2) AND id != $3
            `;
            const checkResult = await client.query(checkQuery, [username, email, userId]);
            
            if (checkResult.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    error: 'Username or email already exists'
                });
            }
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        let paramCount = 0;

        if (username !== undefined) {
            paramCount++;
            updateFields.push(`username = $${paramCount}`);
            updateValues.push(username);
        }

        if (email !== undefined) {
            paramCount++;
            updateFields.push(`email = $${paramCount}`);
            updateValues.push(email);
        }

        if (firstName !== undefined) {
            paramCount++;
            updateFields.push(`first_name = $${paramCount}`);
            updateValues.push(firstName);
        }

        if (lastName !== undefined) {
            paramCount++;
            updateFields.push(`last_name = $${paramCount}`);
            updateValues.push(lastName);
        }

        if (updateFields.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        // Add user ID to parameters
        updateValues.push(userId);

        const updateQuery = `
            UPDATE users 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount + 1}
            RETURNING id, username, email, first_name, last_name, is_active, created_at, updated_at
        `;

        const result = await client.query(updateQuery, updateValues);
        const user = result.rows[0];

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                isActive: user.is_active,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

/**
 * PUT /api/users/change-password
 * Change user password
 */
router.put('/change-password', validateBody(schemas.passwordChange), async (req, res, next) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const userQuery = 'SELECT password_hash FROM users WHERE id = $1';
        const userResult = await client.query(userQuery, [userId]);
        
        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = userResult.rows[0];

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        
        if (!isCurrentPasswordValid) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        const updatePasswordQuery = `
            UPDATE users 
            SET password_hash = $1
            WHERE id = $2
        `;
        
        await client.query(updatePasswordQuery, [newPasswordHash, userId]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

/**
 * DELETE /api/users/profile
 * Deactivate user account (soft delete)
 */
router.delete('/profile', async (req, res, next) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const userId = req.user.id;

        // Deactivate user account
        const deactivateQuery = 'UPDATE users SET is_active = false WHERE id = $1';
        const result = await client.query(deactivateQuery, [userId]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

/**
 * GET /api/users/stats
 * Get user statistics
 */
router.get('/stats', async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get task statistics
        const statsQuery = `
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(*) FILTER (WHERE completed = true) as completed_tasks,
                COUNT(*) FILTER (WHERE completed = false) as pending_tasks,
                COUNT(*) FILTER (WHERE due_date < NOW() AND completed = false) as overdue_tasks,
                COUNT(*) FILTER (WHERE priority = 'high') as high_priority_tasks,
                COUNT(*) FILTER (WHERE priority = 'medium') as medium_priority_tasks,
                COUNT(*) FILTER (WHERE priority = 'low') as low_priority_tasks,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as tasks_this_week,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as tasks_this_month
            FROM tasks 
            WHERE user_id = $1
        `;
        
        const statsResult = await query(statsQuery, [userId]);
        const stats = statsResult.rows[0];

        // Calculate completion rate
        const completionRate = stats.total_tasks > 0 
            ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) 
            : 0;

        res.json({
            success: true,
            data: {
                totalTasks: parseInt(stats.total_tasks),
                completedTasks: parseInt(stats.completed_tasks),
                pendingTasks: parseInt(stats.pending_tasks),
                overdueTasks: parseInt(stats.overdue_tasks),
                highPriorityTasks: parseInt(stats.high_priority_tasks),
                mediumPriorityTasks: parseInt(stats.medium_priority_tasks),
                lowPriorityTasks: parseInt(stats.low_priority_tasks),
                tasksThisWeek: parseInt(stats.tasks_this_week),
                tasksThisMonth: parseInt(stats.tasks_this_month),
                completionRate
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
