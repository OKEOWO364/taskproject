/**
 * Validation Middleware
 * Handles request validation using Joi
 */

const Joi = require('joi');

/**
 * Validate request body against Joi schema
 * @param {Object} schema - Joi schema
 * @returns {Function} Middleware function
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                error: errorMessage
            });
        }
        
        next();
    };
};

/**
 * Validate request query parameters against Joi schema
 * @param {Object} schema - Joi schema
 * @returns {Function} Middleware function
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                error: errorMessage
            });
        }
        
        next();
    };
};

/**
 * Validate request parameters against Joi schema
 * @param {Object} schema - Joi schema
 * @returns {Function} Middleware function
 */
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                error: errorMessage
            });
        }
        
        next();
    };
};

// Common validation schemas
const schemas = {
    // User schemas
    userRegistration: Joi.object({
        username: Joi.string().alphanum().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50)
    }),

    userLogin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    userUpdate: Joi.object({
        username: Joi.string().alphanum().min(3).max(50),
        email: Joi.string().email(),
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50)
    }),

    passwordChange: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required()
    }),

    // Task schemas
    taskCreate: Joi.object({
        title: Joi.string().min(1).max(200).required(),
        description: Joi.string().max(1000).allow(''),
        priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
        dueDate: Joi.date().iso().required(),
        progress: Joi.number().integer().min(0).max(100).default(0),
        categoryId: Joi.number().integer().positive().allow(null),
        assignedTo: Joi.number().integer().positive().allow(null),
        tags: Joi.array().items(Joi.string().max(50)).max(10)
    }),

    taskUpdate: Joi.object({
        title: Joi.string().min(1).max(200),
        description: Joi.string().max(1000).allow(''),
        completed: Joi.boolean(),
        priority: Joi.string().valid('low', 'medium', 'high'),
        dueDate: Joi.date().iso().allow(null),
        progress: Joi.number().integer().min(0).max(100),
        categoryId: Joi.number().integer().positive().allow(null),
        assignedTo: Joi.number().integer().positive().allow(null),
        tags: Joi.array().items(Joi.string().max(50)).max(10)
    }),

    taskBulkUpdate: Joi.object({
        tasks: Joi.array().items(
            Joi.object({
                id: Joi.number().integer().positive().required(),
                title: Joi.string().min(1).max(200),
                description: Joi.string().max(1000),
                completed: Joi.boolean(),
                priority: Joi.string().valid('low', 'medium', 'high'),
                dueDate: Joi.date().iso().allow(null),
                progress: Joi.number().integer().min(0).max(100),
                categoryId: Joi.number().integer().positive().allow(null),
                assignedTo: Joi.number().integer().positive().allow(null),
                tags: Joi.array().items(Joi.string().max(50)).max(10)
            })
        ).min(1).max(50).required()
    }),

    // Query parameter schemas
    taskQuery: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        completed: Joi.boolean(),
        priority: Joi.string().valid('low', 'medium', 'high'),
        categoryId: Joi.number().integer().positive(),
        assignedTo: Joi.number().integer().positive(),
        search: Joi.string().max(100),
        sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'priority', 'due_date', 'progress').default('created_at'),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc')
    }),

    // Parameter schemas
    idParam: Joi.object({
        id: Joi.number().integer().positive().required()
    }),

    // Category schemas
    category: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().max(500),
        color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#6366f1')
    }),

    categoryUpdate: Joi.object({
        name: Joi.string().min(1).max(100),
        description: Joi.string().max(500),
        color: Joi.string().pattern(/^#[0-9A-F]{6}$/i)
    })
};

module.exports = {
    validateBody,
    validateQuery,
    validateParams,
    schemas
};
