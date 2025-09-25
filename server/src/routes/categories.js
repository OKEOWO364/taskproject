/**
 * Category Routes
 * Handles all category-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const { validateBody, validateParams, schemas } = require('../middleware/validation');

// Apply authentication middleware to all category routes
router.use(authenticate);

/**
 * GET /api/categories
 * Get all categories for the authenticated user
 */
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await query(`
            SELECT id, name, description, color, created_at, updated_at
            FROM categories
            WHERE user_id = $1
            ORDER BY name ASC
        `, [userId]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/categories
 * Create a new category
 */
router.post('/', validateBody(schemas.category), async (req, res, next) => {
    try {
        const { name, description, color } = req.body;
        const userId = req.user.id;

        const result = await query(`
            INSERT INTO categories (name, description, color, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, description, color, created_at, updated_at
        `, [name, description || null, color || '#6366f1', userId]);

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({
                success: false,
                message: 'Category name already exists'
            });
        }
        next(error);
    }
});

/**
 * PUT /api/categories/:id
 * Update a category
 */
router.put('/:id', validateParams(schemas.idParam), validateBody(schemas.categoryUpdate), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, color } = req.body;
        const userId = req.user.id;

        const result = await query(`
            UPDATE categories
            SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 AND user_id = $5
            RETURNING id, name, description, color, created_at, updated_at
        `, [name, description || null, color || '#6366f1', id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({
                success: false,
                message: 'Category name already exists'
            });
        }
        next(error);
    }
});

/**
 * DELETE /api/categories/:id
 * Delete a category
 */
router.delete('/:id', validateParams(schemas.idParam), async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if category has tasks
        const taskCount = await query(`
            SELECT COUNT(*) as count FROM tasks WHERE category_id = $1 AND user_id = $2
        `, [id, userId]);

        if (parseInt(taskCount.rows[0].count) > 0) {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete category with existing tasks. Please reassign or delete tasks first.'
            });
        }

        const result = await query(`
            DELETE FROM categories
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;