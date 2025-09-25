/**
 * Simple Task Manager Frontend
 * Direct DOM manipulation with API calls - no complex architecture
 */

// Global state
let currentUser = null;
let tasks = [];
let categories = [];
let users = [];

// API Base URL
const API_BASE = window.AppConfig ? window.AppConfig.getApiBaseUrl() : 'http://localhost:3001/api';

// Simple API functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
}

// Authentication functions
async function login(email, password) {
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.success) {
            localStorage.setItem('authToken', response.data.token);
            currentUser = response.data.user;
            showMainApp();
            await loadInitialData();
        } else {
            throw new Error(response.error || 'Login failed');
        }
    } catch (error) {
        throw error;
    }
}

async function register(userData) {
    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.success) {
            localStorage.setItem('authToken', response.data.token);
            currentUser = response.data.user;
            showMainApp();
            await loadInitialData();
        } else {
            throw new Error(response.error || 'Registration failed');
        }
    } catch (error) {
        throw error;
    }
}

function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    tasks = [];
    categories = [];
    users = [];
    showAuthSection();
}

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
}

function showMainApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
}

// Data loading functions
async function loadInitialData() {
    try {
        showLoading(true);

        const [tasksResponse, categoriesResponse, usersResponse] = await Promise.all([
            apiRequest('/tasks'),
            apiRequest('/categories'),
            apiRequest('/users')
        ]);

        tasks = tasksResponse.data || tasksResponse;
        categories = categoriesResponse.data || categoriesResponse;
        users = usersResponse.data || usersResponse;

        renderTasks();
        renderCategories();
        populateFormOptions();

    } catch (error) {
        console.error('Error loading data:', error);
        if (error.message.includes('401')) {
            logout();
            throw error; // Re-throw to prevent showMainApp in DOMContentLoaded
        } else {
            showError('Failed to load data. Please refresh the page.');
        }
    } finally {
        showLoading(false);
    }
}

// Task management functions
async function addTask(taskData) {
    try {
        const response = await apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });

        const newTask = response.data || response;
        tasks.push(newTask);
        renderTasks();

        hideAddTaskModal();
        showSuccess('Task added successfully!');
    } catch (error) {
        showError('Failed to add task: ' + error.message);
    }
}

async function updateTask(taskId, updates) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });

        const updatedTask = response.data || response;
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
        }
        renderTasks();
        showSuccess('Task updated successfully!');
    } catch (error) {
        showError('Failed to update task: ' + error.message);
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        await apiRequest(`/tasks/${taskId}`, {
            method: 'DELETE'
        });

        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        showSuccess('Task deleted successfully!');
    } catch (error) {
        showError('Failed to delete task: ' + error.message);
    }
}

async function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await updateTask(taskId, { completed: !task.completed });
}

// Category management functions
async function addCategory(name, description, color) {
    try {
        const response = await apiRequest('/categories', {
            method: 'POST',
            body: JSON.stringify({ name, description, color })
        });

        const newCategory = response.data || response;
        categories.push(newCategory);
        renderCategories();
        populateFormOptions();
        showSuccess('Category added successfully!');
    } catch (error) {
        showError('Failed to add category: ' + error.message);
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        await apiRequest(`/categories/${categoryId}`, {
            method: 'DELETE'
        });

        categories = categories.filter(c => c.id !== categoryId);
        renderCategories();
        populateFormOptions();
        showSuccess('Category deleted successfully!');
    } catch (error) {
        showError('Failed to delete category: ' + error.message);
    }
}

// Rendering functions
function renderTasks() {
    const taskList = document.getElementById('task-list');
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty-state">
                <div class="empty-state__icon">📝</div>
                <div class="empty-state__text">No tasks found. Add one above!</div>
            </li>
        `;
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'task-item--completed' : ''}" data-task-id="${task.id}">
            <div class="task-item__content">
                <div class="task-item__header">
                    <label class="task-item__checkbox">
                        <input type="checkbox"
                               ${task.completed ? 'checked' : ''}
                               onchange="toggleTask(${task.id})">
                        <span class="checkmark"></span>
                    </label>
                    <h3 class="task-item__title ${task.completed ? 'task-item__title--completed' : ''}">
                        ${task.title}
                    </h3>
                    <div class="task-item__actions">
                        <button class="btn btn--small btn--secondary" onclick="editTask(${task.id})">
                            ✏️ Edit
                        </button>
                        <button class="btn btn--small btn--danger" onclick="deleteTask(${task.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>

                ${task.description ? `<p class="task-item__description">${task.description}</p>` : ''}

                <div class="task-item__meta">
                    <span class="task-item__priority task-item__priority--${task.priority}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>

                    ${task.categoryName ? `
                        <span class="task-item__category" style="background-color: ${task.categoryColor}">
                            ${task.categoryName}
                        </span>
                    ` : ''}

                    ${task.assignedUsername ? `
                        <span class="task-item__assigned">
                            👤 ${task.assignedUsername}
                        </span>
                    ` : ''}

                    ${task.dueDate ? `
                        <span class="task-item__due ${isOverdue(task.dueDate) ? 'task-item__due--overdue' : ''}">
                            📅 ${formatDate(task.dueDate)}
                        </span>
                    ` : ''}

                    <div class="task-item__progress">
                        <div class="progress-bar">
                            <div class="progress-bar__fill" style="width: ${task.progress}%"></div>
                        </div>
                        <span class="progress-text">${task.progress}%</span>
                    </div>
                </div>
            </div>
        </li>
    `).join('');

    updateStats();
}

function renderCategories() {
    const categoriesList = document.getElementById('categories-list');

    if (categories.length === 0) {
        categoriesList.innerHTML = '<p class="empty-message">No categories yet. Add one above!</p>';
        return;
    }

    categoriesList.innerHTML = categories.map(category => `
        <div class="category-item" style="border-left-color: ${category.color}">
            <div class="category-item__content">
                <h4 class="category-item__name">${category.name}</h4>
                ${category.description ? `<p class="category-item__description">${category.description}</p>` : ''}
            </div>
            <button class="btn btn--small btn--danger" onclick="deleteCategory(${category.id})">
                🗑️
            </button>
        </div>
    `).join('');
}

function populateFormOptions() {
    // Populate category selects
    const categorySelects = ['task-category', 'edit-task-category'];
    categorySelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">No Category</option>' +
                categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
    });

    // Populate user selects
    const userSelects = ['task-assigned-to', 'edit-task-assigned-to'];
    userSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Not assigned</option>' +
                users.map(user => `<option value="${user.id}">${user.username}</option>`).join('');
        }
    });
}

// Filtering and sorting functions
function getFilteredTasks() {
    let filtered = [...tasks];

    // Status filter
    const statusFilter = document.getElementById('status-filter')?.value;
    if (statusFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    } else if (statusFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    }

    // Priority filter
    const priorityFilter = document.getElementById('priority-filter')?.value;
    if (priorityFilter && priorityFilter !== 'all') {
        filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Search filter
    const searchQuery = document.getElementById('task-search')?.value.toLowerCase();
    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(searchQuery) ||
            t.description?.toLowerCase().includes(searchQuery)
        );
    }

    // Sorting
    const sortOrder = document.getElementById('sort-order')?.value || 'default';
    filtered.sort((a, b) => {
        switch (sortOrder) {
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'date':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            default:
                // Default: incomplete first, then by creation date
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    return filtered;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const totalEl = document.getElementById('total-tasks');
    const completedEl = document.getElementById('completed-tasks');
    const pendingEl = document.getElementById('pending-tasks');

    if (totalEl) totalEl.textContent = `Total: ${total}`;
    if (completedEl) completedEl.textContent = `Completed: ${completed}`;
    if (pendingEl) pendingEl.textContent = `Pending: ${pending}`;
}

// Utility functions
function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function showLoading(show) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${icon}</span>
            <span style="flex: 1;">${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Auth tab switching
function switchAuthTab(tab) {
    // Update tab buttons
    document.getElementById('login-tab').classList.toggle('active', tab === 'login');
    document.getElementById('register-tab').classList.toggle('active', tab === 'register');

    // Update form visibility
    document.getElementById('login-form').classList.toggle('active', tab === 'login');
    document.getElementById('register-form').classList.toggle('active', tab === 'register');
}

// Event handlers
function setupEventListeners() {
    // Auth tabs
    document.getElementById('login-tab')?.addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('register-tab')?.addEventListener('click', () => switchAuthTab('register'));

    // Auth forms
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);
    document.getElementById('logout-btn')?.addEventListener('click', logout);

    // Task form
    document.getElementById('add-task-btn')?.addEventListener('click', showAddTaskModal);
    document.getElementById('task-modal-close-btn')?.addEventListener('click', hideAddTaskModal);
    document.getElementById('task-modal-cancel-btn')?.addEventListener('click', hideAddTaskModal);
    document.getElementById('task-modal-add-btn')?.addEventListener('click', handleAddTaskSubmit);

    // Category form
    document.getElementById('add-category-btn')?.addEventListener('click', showAddCategoryModal);
    document.getElementById('category-modal-close-btn')?.addEventListener('click', hideAddCategoryModal);
    document.getElementById('category-modal-cancel-btn')?.addEventListener('click', hideAddCategoryModal);
    document.getElementById('category-modal-add-btn')?.addEventListener('click', handleAddCategorySubmit);

    // Progress sliders
    document.getElementById('task-progress')?.addEventListener('input', () => updateProgressDisplay('task-progress', 'progress-value'));
    document.getElementById('edit-task-progress')?.addEventListener('input', () => updateProgressDisplay('edit-task-progress', 'edit-progress-value'));

    // Filters
    document.getElementById('status-filter')?.addEventListener('change', () => renderTasks());
    document.getElementById('priority-filter')?.addEventListener('change', () => renderTasks());
    document.getElementById('sort-order')?.addEventListener('change', () => renderTasks());

    // Search
    document.getElementById('task-search')?.addEventListener('input', () => renderTasks());
    document.getElementById('clear-search-btn')?.addEventListener('click', () => {
        document.getElementById('task-search').value = '';
        renderTasks();
    });

    // Modal
    document.getElementById('modal-close-btn')?.addEventListener('click', closeEditModal);
    document.getElementById('modal-cancel-btn')?.addEventListener('click', closeEditModal);
    document.getElementById('task-edit-form')?.addEventListener('submit', handleUpdateTask);
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await login(email, password);
    } catch (error) {
        showError(error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;

    try {
        await register({ username, email, password, firstName, lastName });
    } catch (error) {
        showError(error.message);
    }
}

async function handleAddTaskSubmit() {
    const title = document.getElementById('task-title').value.trim();
    if (!title) {
        showError('Task title is required');
        return;
    }

    const dueDate = document.getElementById('task-due-date').value;
    if (!dueDate) {
        showError('Due date is required');
        return;
    }

    const taskData = {
        title,
        description: document.getElementById('task-description').value.trim(),
        priority: document.getElementById('task-priority').value,
        dueDate: dueDate || null,
        progress: parseInt(document.getElementById('task-progress').value) || 0,
        categoryId: document.getElementById('task-category').value || null,
        assignedTo: document.getElementById('task-assigned-to').value || null
    };

    try {
        await addTask(taskData);
    } catch (error) {
        let errorMsg = 'Failed to add task. Please check your input.';
        if (error.message.includes('dueDate')) {
            errorMsg = 'Please select a valid due date.';
        } else if (error.message.includes('title')) {
            errorMsg = 'Task title is required and cannot be empty.';
        } else if (error.message.includes('description')) {
            errorMsg = 'Description cannot be empty.';
        }
        showError(errorMsg);
    }
}

function showAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'block';
}

function hideAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'none';
    // Clear form
    document.getElementById('category-name').value = '';
    document.getElementById('category-description').value = '';
    document.getElementById('category-color').value = '#6366f1';
}

async function handleAddCategorySubmit() {
    const name = document.getElementById('category-name').value.trim();
    if (!name) {
        showError('Category name is required');
        return;
    }

    const description = document.getElementById('category-description').value.trim();
    const color = document.getElementById('category-color').value;

    try {
        await addCategory(name, description, color);
        hideAddCategoryModal();
    } catch (error) {
        showError('Failed to add category: ' + error.message);
    }
}

function showAddTaskModal() {
    document.getElementById('add-task-modal').style.display = 'block';
}

function hideAddTaskModal() {
    document.getElementById('add-task-modal').style.display = 'none';
    // Clear form
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-priority').value = 'medium';
    document.getElementById('task-progress').value = '0';
    updateProgressDisplay('task-progress', 'progress-value');
    document.getElementById('task-category').value = '';
    document.getElementById('task-assigned-to').value = '';
}

function updateProgressDisplay(sliderId, valueId) {
    const value = document.getElementById(sliderId).value;
    document.getElementById(valueId).textContent = value + '%';
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Populate edit modal
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-description').value = task.description || '';
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-due-date').value = task.dueDate ? task.dueDate.split('T')[0] : '';
    document.getElementById('edit-task-progress').value = task.progress;
    updateProgressDisplay('edit-task-progress', 'edit-progress-value');
    document.getElementById('edit-task-category').value = task.categoryId || '';
    document.getElementById('edit-task-assigned-to').value = task.assignedTo || '';
    document.getElementById('edit-task-completed').checked = task.completed;

    // Store task ID for update
    document.getElementById('task-edit-form').dataset.taskId = taskId;

    // Show modal
    document.getElementById('task-edit-modal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('task-edit-modal').style.display = 'none';
}

async function handleUpdateTask(e) {
    e.preventDefault();
    const taskId = parseInt(e.target.dataset.taskId);

    const updates = {
        title: document.getElementById('edit-task-title').value.trim(),
        description: document.getElementById('edit-task-description').value.trim(),
        priority: document.getElementById('edit-task-priority').value,
        dueDate: document.getElementById('edit-task-due-date').value,
        progress: parseInt(document.getElementById('edit-task-progress').value) || 0,
        categoryId: document.getElementById('edit-task-category').value || null,
        assignedTo: document.getElementById('edit-task-assigned-to').value || null,
        completed: document.getElementById('edit-task-completed').checked
    };

    await updateTask(taskId, updates);
    closeEditModal();
}

// Auth tab switching
function switchAuthTab(tab) {
    // Update tab buttons
    document.getElementById('login-tab').classList.toggle('active', tab === 'login');
    document.getElementById('register-tab').classList.toggle('active', tab === 'register');

    // Update form visibility
    document.getElementById('login-form').classList.toggle('active', tab === 'login');
    document.getElementById('register-form').classList.toggle('active', tab === 'register');
}

// Initialize auth tabs on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Set up auth tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => switchAuthTab('login'));
        registerTab.addEventListener('click', () => switchAuthTab('register'));
    }

    // Continue with existing initialization
    setupEventListeners();

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            // Try to load data - if it fails, user needs to login again
            await loadInitialData();
            showMainApp();
        } catch (error) {
            console.error('Auto-login failed:', error);
            logout();
        }
    } else {
        showAuthSection();
    }
});
