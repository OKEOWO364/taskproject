# Task Manager Backend API

A robust RESTful API for the Task Manager application built with Node.js, Express, and PostgreSQL. This backend provides comprehensive task management, user authentication, and team collaboration features.

## 🎯 What This Backend Does

The backend API serves as the data layer and business logic for the Task Manager application. It handles:

- **User Authentication**: Secure registration, login, and session management
- **Task Management**: Full CRUD operations with advanced filtering
- **Category Organization**: Task categorization with custom colors
- **Team Collaboration**: Multi-user task assignment and management
- **Data Persistence**: PostgreSQL database with optimized queries
- **Security**: JWT authentication, input validation, and security middleware

## 🛠️ Technology Stack

- **Node.js** (v16+) - Runtime environment
- **Express.js** - Web framework with middleware
- **PostgreSQL** - Relational database with connection pooling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Joi** - Request validation and sanitization
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging

## 📋 Prerequisites

Before running this backend, ensure you have the following installed:

### 1. Node.js (v16 or higher)
**Download and Install Node.js:**
- Visit: https://nodejs.org/
- Download the LTS version (v16 or higher)
- Run the installer and follow the setup wizard
- Verify installation:
  ```bash
  node --version  # Should show v16.x.x or higher
  npm --version   # Should show version number
  ```

### 2. PostgreSQL (v12 or higher)
**Download and Install PostgreSQL:**

#### Windows:
- Visit: https://www.postgresql.org/download/windows/
- Download the installer
- Run the installer as administrator
- **Important**: Remember the password you set for the `postgres` user
- Choose default settings for other options

#### macOS:
- Visit: https://www.postgresql.org/download/macosx/
- Download and install Postgres.app
- Or use Homebrew: `brew install postgresql`

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Verify PostgreSQL Installation:**
```bash
psql --version  # Should show version 12 or higher
```

## 🔧 Installation & Setup

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd Task/server
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- express, bcryptjs, jsonwebtoken
- pg (PostgreSQL client)
- joi, helmet, cors, morgan
- And development dependencies

### Step 3: Set Up PostgreSQL Database

#### Create Database and User
Open PostgreSQL command line (psql) or use pgAdmin:

**Using psql (Command Line):**
```bash
# Login as postgres user (password is what you set during installation)
psql -U postgres

# Inside psql, create database and user:
CREATE DATABASE task_manager;
CREATE USER taskuser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE task_manager TO taskuser;
\q
```

**Using pgAdmin (GUI):**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `task_manager`
5. Right-click "Login/Group Roles" → Create → Login/Group Role
6. Name: `taskuser`
7. Set password and grant privileges

#### Alternative: Using Default Postgres User
If you prefer to use the default `postgres` user:
```sql
CREATE DATABASE task_manager;
```

### Step 4: Configure Environment Variables

#### Create Environment File
```bash
cp env.example .env
```

#### Edit .env File
Open `.env` in a text editor and configure:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=taskuser          # or 'postgres' if using default
DB_PASSWORD=your_password # password you set above

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:8000
```

**Security Note**: Never commit the `.env` file to version control. It's already in `.gitignore`.

### Step 5: Initialize Database Schema
```bash
npm run seed
```

This command will:
- Create all necessary tables (users, tasks, categories, task_tags)
- Set up indexes for performance
- Create database triggers for automatic timestamps
- Populate with sample data including test users

### Step 6: Start the Server

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

### Step 7: Verify Installation

#### Test Health Endpoint:
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","message":"Task Manager API is running"}
```

#### Test Database Connection:
The server logs will show:
```
✅ Database connection established successfully
✅ Database connected successfully
🚀 Server running on port 3001
```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/verify` | Verify JWT token | No |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| GET | `/api/users` | Get all users (for team assignment) | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks with filtering | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/:id` | Get specific task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | Yes |
| POST | `/api/categories` | Create new category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/` | API information | No |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Sample Authentication Flow:

1. **Register a new user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

2. **Login to get token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Use token in requests:**
```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
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
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);
```

## 🧪 Testing

### Manual API Testing

#### Create a Task:
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "progress": 25,
    "dueDate": "2024-12-31T23:59:59Z"
  }'
```

#### Get Tasks with Filtering:
```bash
curl "http://localhost:3001/api/tasks?completed=false&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create a Category:
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "description": "Work-related tasks",
    "color": "#3b82f6"
  }'
```

### Sample Data

After running `npm run seed`, you'll have:

**Users:**
- john@example.com / password123
- jane@example.com / password123
- demo@example.com / demo123

**Sample Tasks:**
- Various tasks with different priorities, categories, and assignments
- Progress tracking examples
- Due date examples (some overdue, some upcoming)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DB_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. Database Connection Failed
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Verify `.env` database credentials
- Ensure database exists: `createdb task_manager`

#### 2. Port Already in Use
- Change PORT in `.env` file
- Kill process using port: `lsof -ti:3001 | xargs kill -9`

#### 3. Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check token expiration (default: 7 days)
- Ensure Authorization header format: `Bearer <token>`

#### 4. CORS Errors
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- For development, use: `http://localhost:8000`

### Logs and Debugging:
- Server logs show database connection status
- API errors are logged with detailed messages
- Use `npm run dev` for development with auto-restart

## 📝 Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
npm run seed         # Initialize database with sample data

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Database
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with sample data
```

## 🔒 Security Considerations

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Joi schemas for all endpoints
- **SQL Injection**: Parameterized queries only
- **Rate Limiting**: Ready for implementation
- **CORS**: Configured for allowed origins
- **Helmet**: Security headers enabled

## 📈 Performance

- **Connection Pooling**: PostgreSQL connection pool (max 20)
- **Database Indexes**: Optimized for common queries
- **Query Optimization**: Efficient SQL with proper joins
- **Caching**: Ready for Redis implementation
- **Compression**: Gzip response compression

---

**This backend provides a solid foundation for the Task Manager application with room for scaling and additional features.**

## 🚀 Features

- **RESTful API**: Complete CRUD operations for tasks, users, and categories
- **Authentication**: JWT-based secure authentication system
- **Database**: PostgreSQL with connection pooling and advanced schema
- **Security**: Helmet, CORS, rate limiting, input validation, and sanitization
- **Error Handling**: Comprehensive error handling and logging with Morgan
- **Validation**: Request validation using Joi with custom schemas
- **Documentation**: Well-documented endpoints and responses
- **Task Categories**: Organize tasks by categories with custom colors
- **Progress Tracking**: Track task completion percentage (0-100%)
- **Team Collaboration**: Assign tasks to team members
- **Deadline Management**: Due date tracking with overdue detection
- **Advanced Filtering**: Filter by category, priority, assignment, and completion status
- **Priority Levels**: High, medium, low priority tasks with validation
- **Task Tags**: Label and filter tasks with multiple tags
- **Real-time Sync**: Automatic synchronization between frontend and backend

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── database/
│   │   ├── connection.js      # Database connection and setup
│   │   └── seed.js           # Database seeding script
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Global error handler
│   │   ├── notFound.js       # 404 handler
│   │   └── validation.js     # Request validation
│   └── routes/
│       ├── auth.js           # Authentication routes
│       ├── categories.js     # Category management routes
│       ├── tasks.js          # Task management routes
│       └── users.js          # User profile routes
├── package.json              # Dependencies and scripts
├── env.example               # Environment variables template
└── README.md                 # This file
```

## 🛠️ Technology Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Joi**: Request validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE task_manager;
   CREATE USER postgres WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE task_manager TO postgres;
   ```

4. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task_manager
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key
   CORS_ORIGIN=http://localhost:8000
   ```

5. **Initialize database**
   ```bash
   npm run migrate
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/verify` | Verify JWT token | No |
| POST | `/api/auth/refresh` | Refresh JWT token | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| PUT | `/api/users/change-password` | Change password | Yes |
| DELETE | `/api/users/profile` | Deactivate account | Yes |
| GET | `/api/users/stats` | Get user statistics | Yes |
| GET | `/api/users` | Get all users (for team assignment) | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks with filtering | Yes |
| GET | `/api/tasks/:id` | Get specific task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion | Yes |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | Yes |
| GET | `/api/categories/:id` | Get specific category | Yes |
| POST | `/api/categories` | Create new category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/` | API information | No |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Create Task
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project proposal",
  "description": "Write and submit the project proposal",
  "priority": "high",
  "dueDate": "2024-01-15T10:00:00Z",
  "tags": ["work", "urgent"],
  "progress": 25,
  "categoryId": 1,
  "assignedTo": 2
}
```

### Get Tasks with Filters
```bash
GET /api/tasks?completed=false&priority=high&page=1&limit=10&sortBy=due_date&sortOrder=asc
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
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
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);
```

### Task Tags Table
```sql
CREATE TABLE task_tags (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, tag_name)
);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start with nodemon

# Production
npm start            # Start server

# Database
npm run migrate      # Create database tables
npm run seed         # Seed with sample data
npm run db:reset     # Reset database (migrate + seed)

# Testing
npm test             # Run tests
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **SQL Injection Protection**: Parameterized queries

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DB_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 Performance Considerations

- **Connection Pooling**: PostgreSQL connection pooling
- **Indexes**: Database indexes on frequently queried columns
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevents abuse and DoS attacks
- **Query Optimization**: Efficient SQL queries

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "requestId": "optional-request-id"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is part of a SIWES (Student Industrial Work Experience Scheme) program.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the error logs
3. Test with the provided sample data
4. Contact the development team

---

**Note**: This backend is designed to work with the Task Manager frontend. Make sure both are running on compatible ports and CORS is properly configured.
