/**
 * Task Routes
 * Handles all task-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { query, getClient } = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const { validateBody, validateQuery, validateParams, schemas } = require('../middleware/validation');

// Apply authentication middleware to all task routes
router.use(authenticate);

/**
 * GET /api/tasks
 * Get all tasks for the authenticated user
 */
router.get('/', validateQuery(schemas.taskQuery), async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            completed,
            priority,
            categoryId,
            assignedTo,
            search,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        const offset = (page - 1) * limit;
        const userId = req.user.id;

        // Build WHERE clause
        let whereClause = 'WHERE t.user_id = $1';
        const queryParams = [userId];
        let paramCount = 1;

        if (completed !== undefined) {
            paramCount++;
            whereClause += ` AND t.completed = $${paramCount}`;
            queryParams.push(completed === 'true');
        }

        if (priority) {
            paramCount++;
            whereClause += ` AND t.priority = $${paramCount}`;
            queryParams.push(priority);
        }

        if (categoryId) {
            paramCount++;
            whereClause += ` AND t.category_id = $${paramCount}`;
            queryParams.push(categoryId);
        }

        if (assignedTo) {
            paramCount++;
            whereClause += ` AND t.assigned_to = $${paramCount}`;
            queryParams.push(assignedTo);
        }

        if (search) {
            paramCount++;
            whereClause += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
        }

        // Validate sortBy and sortOrder
        const validSortColumns = ['created_at', 'updated_at', 'title', 'priority', 'due_date', 'progress'];
        const validSortOrders = ['asc', 'desc'];
        
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const sortDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM tasks t
            ${whereClause}
        `;
        const countResult = await query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].total);

        // Get tasks with pagination
        const tasksQuery = `
            SELECT 
                t.id,
                t.title,
                t.description,
                t.completed,
                t.priority,
                t.due_date,
                t.progress,
                t.category_id,
                t.assigned_to,
                t.created_at,
                t.updated_at,
                c.name as category_name,
                c.color as category_color,
                u_assigned.username as assigned_username,
                COALESCE(
                    json_agg(
                        json_build_object('name', tt.tag_name, 'created_at', tt.created_at)
                    ) FILTER (WHERE tt.tag_name IS NOT NULL),
                    '[]'
                ) as tags
            FROM tasks t
            LEFT JOIN task_tags tt ON t.id = tt.task_id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
            ${whereClause}
            GROUP BY t.id, t.title, t.description, t.completed, t.priority, t.due_date, t.progress, t.category_id, t.assigned_to, t.created_at, t.updated_at, c.name, c.color, u_assigned.username
            ORDER BY t.${sortColumn} ${sortDirection}
            LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
        `;
        
        queryParams.push(limit, offset);
        const tasksResult = await query(tasksQuery, queryParams);

        // Format response
        const tasks = tasksResult.rows.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            priority: task.priority,
            dueDate: task.due_date,
            progress: task.progress,
            categoryId: task.category_id,
            categoryName: task.category_name,
            categoryColor: task.category_color,
            assignedTo: task.assigned_to,
            assignedUsername: task.assigned_username,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            tags: task.tags
        }));

        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/tasks/:id
 * Get a specific task by ID
 */
router.get('/:id', validateParams(schemas.idParam), async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const taskQuery = `
            SELECT 
                t.id,
                t.title,
                t.description,
                t.completed,
                t.priority,
                t.due_date,
                t.progress,
                t.category_id,
                t.assigned_to,
                t.created_at,
                t.updated_at,
                c.name as category_name,
                c.color as category_color,
                u_assigned.username as assigned_username,
                COALESCE(
                    json_agg(
                        json_build_object('name', tt.tag_name, 'created_at', tt.created_at)
                    ) FILTER (WHERE tt.tag_name IS NOT NULL),
                    '[]'
                ) as tags
            FROM tasks t
            LEFT JOIN task_tags tt ON t.id = tt.task_id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
            WHERE t.id = $1 AND t.user_id = $2
            GROUP BY t.id, t.title, t.description, t.completed, t.priority, t.due_date, t.progress, t.category_id, t.assigned_to, t.created_at, t.updated_at, c.name, c.color, u_assigned.username
        `;

        const result = await query(taskQuery, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        const task = result.rows[0];
        res.json({
            success: true,
            data: {
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                priority: task.priority,
                dueDate: task.due_date,
                progress: task.progress,
                categoryId: task.category_id,
                categoryName: task.category_name,
                categoryColor: task.category_color,
                assignedTo: task.assigned_to,
                assignedUsername: task.assigned_username,
                createdAt: task.created_at,
                updatedAt: task.updated_at,
                tags: task.tags
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', validateBody(schemas.taskCreate), async (req, res, next) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const { title, description, priority = 'medium', dueDate, progress = 0, categoryId, assignedTo, tags = [] } = req.body;
        const userId = req.user.id;

        // Insert task
        const taskQuery = `
            INSERT INTO tasks (title, description, priority, due_date, progress, category_id, assigned_to, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, title, description, completed, priority, due_date, progress, category_id, assigned_to, created_at, updated_at
        `;
        
        const taskResult = await client.query(taskQuery, [title, description, priority, dueDate, progress, categoryId, assignedTo, userId]);
        const task = taskResult.rows[0];

        // Insert tags if provided
        if (tags.length > 0) {
            const tagQuery = `
                INSERT INTO task_tags (task_id, tag_name)
                VALUES ($1, $2)
            `;
            
            for (const tag of tags) {
                await client.query(tagQuery, [task.id, tag]);
            }
        }

        await client.query('COMMIT');

        // Get task with tags
        const fullTaskQuery = `
            SELECT 
                t.id,
                t.title,
                t.description,
                t.completed,
                t.priority,
                t.due_date,
                t.progress,
                t.category_id,
                t.assigned_to,
                t.created_at,
                t.updated_at,
                c.name as category_name,
                c.color as category_color,
                u_assigned.username as assigned_username,
                COALESCE(
                    json_agg(
                        json_build_object('name', tt.tag_name, 'created_at', tt.created_at)
                    ) FILTER (WHERE tt.tag_name IS NOT NULL),
                    '[]'
                ) as tags
            FROM tasks t
            LEFT JOIN task_tags tt ON t.id = tt.task_id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
            WHERE t.id = $1
            GROUP BY t.id, t.title, t.description, t.completed, t.priority, t.due_date, t.progress, t.category_id, t.assigned_to, t.created_at, t.updated_at, c.name, c.color, u_assigned.username
        `;

        const fullTaskResult = await client.query(fullTaskQuery, [task.id]);
        const fullTask = fullTaskResult.rows[0];

        res.status(201).json({
            success: true,
            data: {
                id: fullTask.id,
                title: fullTask.title,
                description: fullTask.description,
                completed: fullTask.completed,
                priority: fullTask.priority,
                dueDate: fullTask.due_date,
                progress: fullTask.progress,
                categoryId: fullTask.category_id,
                categoryName: fullTask.category_name,
                categoryColor: fullTask.category_color,
                assignedTo: fullTask.assigned_to,
                assignedUsername: fullTask.assigned_username,
                createdAt: fullTask.created_at,
                updatedAt: fullTask.updated_at,
                tags: fullTask.tags
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
 * PUT /api/tasks/:id
 * Update a specific task
 */
router.put('/:id', validateParams(schemas.idParam), validateBody(schemas.taskUpdate), async (req, res, next) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, completed, priority, dueDate, progress, categoryId, assignedTo, tags } = req.body;

        // Check if task exists and belongs to user
        const checkQuery = 'SELECT id FROM tasks WHERE id = $1 AND user_id = $2';
        const checkResult = await client.query(checkQuery, [id, userId]);
        
        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        let paramCount = 0;

        if (title !== undefined) {
            paramCount++;
            updateFields.push(`title = $${paramCount}`);
            updateValues.push(title);
        }

        if (description !== undefined) {
            paramCount++;
            updateFields.push(`description = $${paramCount}`);
            updateValues.push(description);
        }

        if (completed !== undefined) {
            paramCount++;
            updateFields.push(`completed = $${paramCount}`);
            updateValues.push(completed);
        }

        if (priority !== undefined) {
            paramCount++;
            updateFields.push(`priority = $${paramCount}`);
            updateValues.push(priority);
        }

        if (dueDate !== undefined) {
            paramCount++;
            updateFields.push(`due_date = $${paramCount}`);
            updateValues.push(dueDate);
        }

        if (progress !== undefined) {
            paramCount++;
            updateFields.push(`progress = $${paramCount}`);
            updateValues.push(progress);
        }

        if (categoryId !== undefined) {
            paramCount++;
            updateFields.push(`category_id = $${paramCount}`);
            updateValues.push(categoryId);
        }

        if (assignedTo !== undefined) {
            paramCount++;
            updateFields.push(`assigned_to = $${paramCount}`);
            updateValues.push(assignedTo);
        }

        if (updateFields.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        // Add task ID and user ID to parameters
        updateValues.push(id, userId);

        const updateQuery = `
            UPDATE tasks 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
            RETURNING id, title, description, completed, priority, due_date, progress, category_id, assigned_to, created_at, updated_at
        `;

        const updateResult = await client.query(updateQuery, updateValues);
        const task = updateResult.rows[0];

        // Update tags if provided
        if (tags !== undefined) {
            // Delete existing tags
            await client.query('DELETE FROM task_tags WHERE task_id = $1', [id]);
            
            // Insert new tags
            if (tags.length > 0) {
                const tagQuery = 'INSERT INTO task_tags (task_id, tag_name) VALUES ($1, $2)';
                for (const tag of tags) {
                    await client.query(tagQuery, [id, tag]);
                }
            }
        }

        await client.query('COMMIT');

        // Get updated task with tags
        const fullTaskQuery = `
            SELECT 
                t.id,
                t.title,
                t.description,
                t.completed,
                t.priority,
                t.due_date,
                t.progress,
                t.category_id,
                t.assigned_to,
                t.created_at,
                t.updated_at,
                c.name as category_name,
                c.color as category_color,
                u_assigned.username as assigned_username,
                COALESCE(
                    json_agg(
                        json_build_object('name', tt.tag_name, 'created_at', tt.created_at)
                    ) FILTER (WHERE tt.tag_name IS NOT NULL),
                    '[]'
                ) as tags
            FROM tasks t
            LEFT JOIN task_tags tt ON t.id = tt.task_id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
            WHERE t.id = $1
            GROUP BY t.id, t.title, t.description, t.completed, t.priority, t.due_date, t.progress, t.category_id, t.assigned_to, t.created_at, t.updated_at, c.name, c.color, u_assigned.username
        `;

        const fullTaskResult = await client.query(fullTaskQuery, [id]);
        const fullTask = fullTaskResult.rows[0];

        res.json({
            success: true,
            data: {
                id: fullTask.id,
                title: fullTask.title,
                description: fullTask.description,
                completed: fullTask.completed,
                priority: fullTask.priority,
                dueDate: fullTask.due_date,
                progress: fullTask.progress,
                categoryId: fullTask.category_id,
                categoryName: fullTask.category_name,
                categoryColor: fullTask.category_color,
                assignedTo: fullTask.assigned_to,
                assignedUsername: fullTask.assigned_username,
                createdAt: fullTask.created_at,
                updatedAt: fullTask.updated_at,
                tags: fullTask.tags
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
 * DELETE /api/tasks/:id
 * Delete a specific task
 */
router.delete('/:id', validateParams(schemas.idParam), async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleteQuery = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id';
        const result = await query(deleteQuery, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle task completion status
 */
router.patch('/:id/toggle', validateParams(schemas.idParam), async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const toggleQuery = `
            UPDATE tasks 
            SET completed = NOT completed
            WHERE id = $1 AND user_id = $2
            RETURNING id, title, completed, updated_at
        `;
        
        const result = await query(toggleQuery, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        const task = result.rows[0];
        res.json({
            success: true,
            data: {
                id: task.id,
                title: task.title,
                completed: task.completed,
                updatedAt: task.updated_at
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/tasks/bulk
 * Bulk update multiple tasks
 */
router.put('/bulk', validateBody(schemas.taskBulkUpdate), async (req, res, next) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const { tasks } = req.body;
        const userId = req.user.id;
        const results = [];
        
        for (const taskUpdate of tasks) {
            const { id, ...updateData } = taskUpdate;
            
            // Check if task exists and belongs to user
            const checkQuery = 'SELECT id FROM tasks WHERE id = $1 AND user_id = $2';
            const checkResult = await client.query(checkQuery, [id, userId]);
            
            if (checkResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    error: `Task with id ${id} not found`
                });
            }
            
            // Build update query dynamically
            const updateFields = [];
            const updateValues = [];
            let paramCount = 0;
            
            if (updateData.title !== undefined) {
                paramCount++;
                updateFields.push(`title = $${paramCount}`);
                updateValues.push(updateData.title);
            }
            
            if (updateData.description !== undefined) {
                paramCount++;
                updateFields.push(`description = $${paramCount}`);
                updateValues.push(updateData.description);
            }
            
            if (updateData.completed !== undefined) {
                paramCount++;
                updateFields.push(`completed = $${paramCount}`);
                updateValues.push(updateData.completed);
            }
            
            if (updateData.priority !== undefined) {
                paramCount++;
                updateFields.push(`priority = $${paramCount}`);
                updateValues.push(updateData.priority);
            }
            
            if (updateData.dueDate !== undefined) {
                paramCount++;
                updateFields.push(`due_date = $${paramCount}`);
                updateValues.push(updateData.dueDate);
            }
            
            if (updateData.progress !== undefined) {
                paramCount++;
                updateFields.push(`progress = $${paramCount}`);
                updateValues.push(updateData.progress);
            }
            
            if (updateData.categoryId !== undefined) {
                paramCount++;
                updateFields.push(`category_id = $${paramCount}`);
                updateValues.push(updateData.categoryId);
            }
            
            if (updateData.assignedTo !== undefined) {
                paramCount++;
                updateFields.push(`assigned_to = $${paramCount}`);
                updateValues.push(updateData.assignedTo);
            }
            
            if (updateFields.length === 0) {
                continue; // No fields to update for this task
            }
            
            // Add task ID and user ID to parameters
            updateValues.push(id, userId);
            
            const updateQuery = `
                UPDATE tasks 
                SET ${updateFields.join(', ')}
                WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
                RETURNING id, title, description, completed, priority, due_date, progress, category_id, assigned_to, created_at, updated_at
            `;
            
            const updateResult = await client.query(updateQuery, updateValues);
            results.push(updateResult.rows[0]);
        }
        
        await client.query('COMMIT');
        
        res.json({
            success: true,
            data: results,
            message: `Successfully updated ${results.length} tasks`
        });
        
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

module.exports = router;
