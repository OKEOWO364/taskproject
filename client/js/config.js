/**
 * Application Configuration
 * Centralized configuration for the Task Manager application
 */
class AppConfig {
    constructor() {
        this.config = {
            // API Configuration
            api: {
                baseUrl: 'http://localhost:3001/api',
                timeout: 10000, // 10 seconds
                retryAttempts: 3,
                retryDelay: 1000, // 1 second
            },
            
            // Local Storage Configuration
            storage: {
                tasksKey: 'taskManager_tasks',
                counterKey: 'taskManager_taskIdCounter',
                settingsKey: 'taskManager_settings',
            },
            
            // UI Configuration
            ui: {
                animationDuration: 300,
                errorDisplayDuration: 3000,
                maxTaskTitleLength: 200,
                debounceDelay: 500,
            },
            
            // Task Configuration
            task: {
                defaultPriority: 'medium',
                priorities: ['low', 'medium', 'high'],
                maxTasksPerPage: 50,
            },
            
            // Environment
            environment: this.detectEnvironment(),
        };
    }
    
    /**
     * Detect the current environment
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('staging')) {
            return 'staging';
        } else {
            return 'production';
        }
    }
    
    /**
     * Get configuration value by key path
     * @param {string} keyPath - Dot notation path to config value
     * @returns {any} Configuration value
     */
    get(keyPath) {
        return keyPath.split('.').reduce((obj, key) => obj?.[key], this.config);
    }
    
    /**
     * Set configuration value by key path
     * @param {string} keyPath - Dot notation path to config value
     * @param {any} value - Value to set
     */
    set(keyPath, value) {
        const keys = keyPath.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, this.config);
        target[lastKey] = value;
    }
    
    /**
     * Get API base URL with environment-specific overrides
     */
    getApiBaseUrl() {
        const env = this.get('environment');
        const baseUrl = this.get('api.baseUrl');
        
        // Override for different environments
        switch (env) {
            case 'development':
                return baseUrl;
            case 'staging':
                return 'https://staging-api.taskmanager.com/api';
            case 'production':
                return 'https://api.taskmanager.com/api';
            default:
                return baseUrl;
        }
    }
    
    /**
     * Check if we're in development mode
     */
    isDevelopment() {
        return this.get('environment') === 'development';
    }
    
    /**
     * Get all configuration
     */
    getAll() {
        return { ...this.config };
    }
}

// Create global config instance
window.AppConfig = new AppConfig();
