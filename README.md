# Task Manager - Fullstack Task Management System

A comprehensive, modern task management application built with Node.js, Express, PostgreSQL, and vanilla JavaScript. This SIWES (Students Industrial Work Experience Scheme) project demonstrates fullstack development capabilities with advanced features for personal and team productivity.

## 🎯 What This Application Does

**Task Manager** is a complete task management solution that helps individuals and teams organize, prioritize, and track their work efficiently. It combines the simplicity of traditional todo apps with advanced features found in professional project management tools.

### Key Features

#### ✅ **Authentication & User Management**
- Secure user registration and login
- JWT-based authentication
- Session management with automatic logout
- Password security with bcrypt hashing

#### ✅ **Task Organization & Prioritization**
- Create, edit, and delete tasks
- Priority levels (Low, Medium, High) with visual indicators
- Task categories with custom colors for organization
- Tags for flexible task labeling
- Advanced filtering and sorting options

#### ✅ **Progress Tracking & Deadlines**
- Visual progress bars (0-100% completion)
- Due date management with calendar support
- Automatic overdue detection and alerts
- Task completion tracking and statistics

#### ✅ **Team Collaboration**
- Assign tasks to team members
- User management system
- Multi-user support for collaborative workflows
- Task ownership and assignment tracking

#### ✅ **Productivity & Efficiency**
- Clean, intuitive user interface
- Responsive design for desktop, tablet, and mobile
- Offline support with local storage fallback
- Real-time notifications and status updates
- Task statistics and productivity insights

## 🏗️ Architecture Overview

```
Task Manager/
├── client/                 # Frontend Application (Simplified Vanilla JS)
│   ├── index.html         # Main HTML file with all UI components
│   ├── css/               # Stylesheets (main.css, components.css, responsive.css)
│   └── js/                # JavaScript files
│       ├── config.js      # Application configuration
│       └── app.js         # Simplified main application (direct DOM manipulation)
├── server/                 # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── app.js         # Express application setup
│   │   ├── database/      # PostgreSQL connection and migrations
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── routes/        # API endpoints (auth, tasks, categories, users)
│   └── package.json       # Backend dependencies
└── README.md              # This file
```

### Frontend Simplification

The frontend has been dramatically simplified from a complex component-based architecture to direct DOM manipulation:

**Before (Complex):**
- Component classes (TaskItem, TaskList, AuthComponent, etc.)
- Service layers (ApiService, StorageService)
- Model classes (Task model)
- Complex state management and event handling
- Service workers for offline sync
- Multiple JavaScript modules and dependencies

**After (Simplified):**
- Single `app.js` file with all functionality
- Direct DOM manipulation with `document.getElementById()`
- Simple API request functions
- Inline event handlers
- Basic notification system
- No external dependencies or complex abstractions

This simplification maintains all features while being much easier to understand and maintain.

## 🛠️ Technology Stack

### Backend
- **Node.js** (v16+) - Runtime environment
- **Express.js** - Web framework with middleware
- **PostgreSQL** - Relational database with connection pooling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Joi** - Request validation and sanitization
- **Helmet/CORS** - Security middleware
- **Morgan** - HTTP request logging

### Frontend
- **HTML5** - Semantic markup with accessibility
- **CSS3** - Modern styling with CSS variables and Flexbox/Grid
- **Vanilla JavaScript (ES6+)** - Direct DOM manipulation, no frameworks
- **Simple API calls** - Direct fetch() requests to backend
- **Local Storage** - For authentication token storage
- **No build process** - Direct file serving

### Database Schema
```sql
Users: Authentication and user profiles
Tasks: Task management with advanced fields
Categories: Task organization and color coding
Task_Tags: Many-to-many tag relationships
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Modern web browser with ES6+ support

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   # Follow server/README.md for database setup
   npm run seed  # Populate with sample data
   npm start     # Start the server
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   # No installation needed - just serve the files
   # Use any static file server (see client/README.md)
   ```

4. **Access the application**
   - Open `http://localhost:8000` (frontend)
   - Backend runs on `http://localhost:3001`

### Sample Login Credentials
After running `npm run seed`:
- **john@example.com** / `password123`
- **jane@example.com** / `password123`
- **demo@example.com** / `demo123`

## 📱 User Experience

### For Individual Users
- **Simple Onboarding**: Register or login to get started
- **Quick Task Creation**: Add tasks with titles and descriptions
- **Organization**: Use categories and priorities to stay organized
- **Progress Tracking**: Update progress as you work
- **Deadline Management**: Set due dates and get overdue alerts

### For Teams
- **User Management**: Add team members to the system
- **Task Assignment**: Assign tasks to specific team members
- **Collaboration**: Track who is working on what
- **Shared Categories**: Organize work by projects or departments

## 🎨 Design Principles

### 1. **Progressive Enhancement**
- Works without JavaScript (basic functionality)
- Enhanced with JavaScript (full interactivity)
- Offline-first approach with service workers

### 2. **Accessibility First**
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

### 3. **Mobile-First Design**
- Responsive breakpoints for all screen sizes
- Touch-friendly interactions
- Optimized performance on mobile devices

### 4. **Separation of Concerns**
- Models handle data and validation
- Services manage external communication
- Components handle UI logic and rendering
- Utilities provide common helper functions

## 🔒 Security Features

- **Authentication**: JWT tokens with secure storage
- **Authorization**: Protected API endpoints
- **Input Validation**: Comprehensive client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: HTML escaping and content sanitization
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers and middleware

## 📊 API Overview

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Task Management
- `GET /api/tasks` - List tasks with filtering
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle completion

### Organization
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Team Management
- `GET /api/users` - List users for assignment
- `GET /api/users/profile` - Get user profile

## 🧪 Testing & Quality

### Automated Testing
- Backend API tests with Jest
- Database integration tests
- Authentication flow testing

### Manual Testing Checklist
- [x] User registration and login
- [x] Task creation, editing, deletion
- [x] Category management
- [x] Progress tracking
- [x] Due date management
- [x] Task assignment
- [x] Filtering and sorting
- [x] Responsive design on mobile
- [ ] Offline functionality (basic caching only)

## 🚀 Deployment

### Backend Deployment
- Environment variables for production
- Database connection pooling
- Security middleware configuration
- Static file serving for production builds

### Frontend Deployment
- Static file hosting (Netlify, Vercel, etc.)
- CDN for assets
- Service worker configuration
- Environment-specific API URLs

## 📈 Future Enhancements

### Planned Features
- **Real-time Collaboration**: WebSocket support for live updates
- **File Attachments**: Document upload and management
- **Task Comments**: Discussion threads on tasks
- **Time Tracking**: Actual vs estimated time
- **Recurring Tasks**: Automated task creation
- **Kanban Board**: Visual task management
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Productivity reports and insights

### Technical Improvements
- **GraphQL API**: More flexible data fetching
- **Redis Caching**: Performance optimization
- **Docker Containerization**: Easy deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Application performance tracking

## 🤝 Contributing

This is a SIWES project demonstrating fullstack development skills. For educational purposes, contributions are welcome for:

- Bug fixes and improvements
- Feature implementations
- Documentation enhancements
- Testing additions

## 📄 License

This project is developed as part of SIWES training and is available for educational use.

## 🙏 Acknowledgments

- **SIWES Program**: For providing the industrial training opportunity
- **Supervisor/Mentor**: For guidance and feedback
- **Open Source Community**: For the amazing tools and libraries used

---

**Built with ❤️ as part of SIWES Industrial Training**

## 🏗️ Architecture Overview

This project follows a **monorepo architecture** with clear separation between frontend and backend components. The frontend is built using modern JavaScript patterns with component-based architecture, while the backend provides a comprehensive REST API with PostgreSQL database.

## 📁 Project Structure

```
Task/
├── client/                    # Frontend application
│   ├── index.html             # Main HTML file
│   ├── css/                   # Stylesheets
│   │   ├── main.css          # Base styles and CSS variables
│   │   ├── components.css    # Component-specific styles
│   │   └── responsive.css    # Responsive design styles
│   ├── js/                   # JavaScript modules
│   │   ├── config.js         # Application configuration
│   │   ├── app.js            # Main application class
│   │   ├── models/           # Data models
│   │   │   └── task.js       # Task model with validation
│   │   ├── services/         # Service layer
│   │   │   ├── api.js        # Backend API communication
│   │   │   └── storage.js    # Local storage management
│   │   ├── components/       # UI components
│   │   │   ├── task-item.js  # Individual task component
│   │   │   ├── task-list.js  # Task list management
│   │   │   └── task-input.js # Task input form
│   │   └── utils/            # Utility functions
│   │       └── helpers.js     # Common helper functions
│   └── sw.js                 # Service worker for offline support
├── server/                    # Backend API
│   ├── src/
│   │   ├── app.js            # Main application entry point
│   │   ├── database/         # Database layer
│   │   ├── middleware/       # Express middleware
│   │   └── routes/           # API route handlers
│   ├── package.json          # Dependencies and scripts
│   └── README.md             # Backend documentation
└── README.md                  # This file
```

## 🚀 Features

### ✅ **Implemented Frontend Features**
- **Modern Component Architecture**: Modular, reusable components
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Support**: Service worker for offline functionality
- **Local Storage**: Tasks persist locally when backend is unavailable
- **Error Handling**: Comprehensive error handling and user feedback
- **Accessibility**: Keyboard navigation and screen reader support
- **Real-time Validation**: Input validation with user feedback
- **Loading States**: Visual feedback during operations
- **Task Statistics**: Track completed, pending, and total tasks
- **Progress Tracking**: Visual progress bars and percentage indicators
- **Category Organization**: Color-coded task categories and projects
- **Team Assignment**: Assign tasks to team members
- **Deadline Management**: Due date tracking with overdue indicators
- **Notification System**: In-page notifications for important events

### ✅ **Implemented Backend Features**
- **RESTful API**: Complete CRUD operations for tasks, users, and categories
- **User Authentication**: JWT-based secure authentication system
- **Data Persistence**: PostgreSQL database with connection pooling
- **Real-time Sync**: Automatic synchronization between frontend and backend
- **Task Categories**: Organize tasks by categories with custom colors
- **Due Dates**: Set and track task deadlines with overdue detection
- **Priority Levels**: High, medium, low priority tasks with visual indicators
- **Task Tags**: Label and filter tasks with multiple tags
- **Progress Tracking**: Track task completion percentage (0-100%)
- **Team Collaboration**: Assign tasks to team members
- **Advanced Filtering**: Filter by category, priority, assignment, and completion status
- **Comprehensive Validation**: Input validation and sanitization
- **Security Features**: Helmet, CORS, rate limiting, and secure authentication

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS variables and flexbox/grid
- **Vanilla JavaScript**: ES6+ classes and modules
- **Service Worker**: Offline functionality and caching
- **Local Storage**: Client-side data persistence

### Backend
- **Node.js**: Runtime environment (v16+)
- **Express.js**: Web framework with middleware
- **PostgreSQL**: Relational database with connection pooling
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing
- **Joi**: Input validation and sanitization
- **Helmet/CORS**: Security middleware
- **Morgan**: HTTP request logging

## 🎯 Design Principles

### 1. **Separation of Concerns**
- Models handle data and validation
- Services manage external communication
- Components handle UI logic
- Utils provide common functionality

### 2. **Progressive Enhancement**
- Works without JavaScript (basic functionality)
- Enhanced with JavaScript (full functionality)
- Offline-first approach

### 3. **Accessibility First**
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

### 4. **Mobile-First Design**
- Responsive breakpoints
- Touch-friendly interactions
- Optimized for small screens

## 🔧 Configuration

The application uses a centralized configuration system (`js/config.js`) that manages:

- **API Settings**: Backend URL, timeout, retry logic
- **Storage Keys**: LocalStorage key names
- **UI Settings**: Animation duration, validation rules
- **Environment Detection**: Development, staging, production

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: 769px and above
- **Tablet**: 481px to 768px
- **Mobile**: 320px to 480px
- **Small Mobile**: Below 320px

## 🔒 Security Features

- **XSS Prevention**: HTML escaping for user input
- **Input Sanitization**: Clean user input before processing
- **CSRF Protection**: Ready for backend implementation
- **Content Security Policy**: Ready for implementation

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Local web server (for development)

### Installation
1. Clone the repository
2. Serve the `public` folder using a local web server
3. Open `http://localhost:3000` (or your server URL)

### Development
```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx serve public

# Using PHP (if installed)
php -S localhost:8000 -t public
```

## 🔄 Backend Integration

The frontend is designed to work with a RESTful API. Expected endpoints:

```
GET    /api/tasks          # Get all tasks (with filtering)
POST   /api/tasks          # Create new task
GET    /api/tasks/:id      # Get specific task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
PATCH  /api/tasks/:id/toggle # Toggle completion
GET    /api/categories     # Get all categories
POST   /api/categories     # Create new category
PUT    /api/categories/:id # Update category
DELETE /api/categories/:id # Delete category
GET    /api/users          # Get all users (for team assignment)
GET    /api/health         # Health check
```

## 📊 Data Models

### Task Model
```javascript
{
  id: number,              // Unique identifier
  title: string,           // Task title (required)
  completed: boolean,       // Completion status
  priority: string,         // 'low', 'medium', 'high'
  createdAt: string,       // ISO date string
  updatedAt: string,        // ISO date string
  description: string,      // Optional description
  dueDate: string,         // Optional due date
  tags: string[],          // Optional tags array
  progress: number,        // Completion percentage (0-100)
  categoryId: number,      // Category ID (optional)
  assignedTo: number       // Assigned user ID (optional)
}
```

### Category Model
```javascript
{
  id: number,              // Unique identifier
  name: string,            // Category name (required)
  color: string,           // Hex color code (default: #007bff)
  description: string,     // Optional description
  createdAt: string,       // ISO date string
  updatedAt: string        // ISO date string
}
```

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Input Validation**: Real-time validation with user feedback
- **Network Error Handling**: Graceful degradation when offline
- **Data Validation**: Task model validation
- **Browser Compatibility**: Works in modern browsers

## 🔮 Future Enhancements

### Short Term
- [x] Backend API implementation
- [x] User authentication
- [x] Task categories and tags
- [x] Due date functionality

### Long Term
- [ ] Real-time collaboration
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced reporting and analytics
- [ ] Integration with external services

## 📝 License

This project is part of a SIWES (Student Industrial Work Experience Scheme) program.

## 🤝 Contributing

This is a learning project. Contributions and suggestions are welcome!

---

**Note**: This frontend is ready for backend integration. The next step is to implement the backend API that will handle data persistence, user authentication, and real-time synchronization.
