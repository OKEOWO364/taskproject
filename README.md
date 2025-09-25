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
