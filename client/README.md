# Task Manager Frontend

A modern, responsive web application for task management built with vanilla JavaScript ES6+, CSS3, and HTML5. This frontend provides an intuitive interface for managing tasks, collaborating with teams, and staying organized.

## 🎯 What This Frontend Does

The frontend application serves as the user interface for the Task Manager system. It offers:

- **Task Management**: Create, edit, delete, and organize tasks with ease
- **Visual Organization**: Color-coded categories and priority indicators
- **Team Collaboration**: Assign tasks to team members and track progress
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant synchronization with the backend API
- **Modal-Based UI**: Clean interface with modal dialogs for task creation and editing

## 🛠️ Technology Stack

- **Vanilla JavaScript ES6+** - Modern JavaScript with direct DOM manipulation
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Flexbox, Grid, and responsive design
- **Local Storage** - Client-side data persistence for authentication
- **Fetch API** - Modern HTTP requests with promises
- **Direct DOM Manipulation** - Simple, maintainable code structure

## 📋 Prerequisites

Before running this frontend, ensure you have:

### 1. Modern Web Browser
- **Chrome** (recommended) - v90 or higher
- **Firefox** - v88 or higher
- **Safari** - v14 or higher
- **Edge** - v90 or higher

### 2. Backend API Running
The frontend requires the backend API to be running. Make sure you have:
- Node.js installed
- PostgreSQL database set up
- Backend server running on `http://localhost:3001`

## 🚀 Quick Start

### Step 1: Open in Browser (Simplest Method)

Since this is a static website, you can open it directly in your browser:

1. **Navigate to the client folder:**
   ```
   cd Task/client
   ```

2. **Open index.html in your browser:**
   - **Windows**: Double-click `index.html`
   - **macOS**: Right-click `index.html` → Open With → Your Browser
   - **Linux**: Open your file manager, navigate to `client/`, right-click `index.html` → Open with Browser

3. **Alternative**: Drag and drop `index.html` into your browser window

### Step 2: Configure API Connection

The app needs to connect to the backend API. If your backend is running on the default port:

- **Default Configuration**: The app is pre-configured to connect to `http://localhost:3001`
- **Custom Configuration**: Edit `js/config.js` if your backend is on a different URL

### Step 3: Start Using the App

1. **Register a new account** or **login** with existing credentials
2. **Create your first task** using the input field
3. **Organize with categories** - create color-coded categories
4. **Assign tasks** to team members (if you have team accounts)
5. **Track progress** with the progress bars and completion toggles

## 🔧 Development Setup (For Advanced Users)

### Method 1: Simple HTTP Server (Recommended)

#### Using Python (if installed):
```bash
cd client
python -m http.server 8000
```
Then open: `http://localhost:8000`

#### Using Node.js (if you have it):
```bash
cd client
npx http-server -p 8000
```
Then open: `http://localhost:8000`

#### Using PHP (if installed):
```bash
cd client
php -S localhost:8000
```
Then open: `http://localhost:8000`

### Method 2: VS Code Live Server Extension

1. **Install VS Code** (if not already installed)
2. **Install Live Server Extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install the extension by Ritwick Dey

3. **Open the client folder in VS Code:**
   ```
   code client/
   ```

4. **Start Live Server:**
   - Right-click `index.html`
   - Select "Open with Live Server"
   - Or click "Go Live" in the status bar

5. **The app will open automatically** at `http://127.0.0.1:5500` or similar

### Method 3: Browser Developer Tools

For development and debugging:

1. **Open Developer Tools:**
   - **Chrome/Edge**: Press F12 or Ctrl+Shift+I
   - **Firefox**: Press F12 or Ctrl+Shift+I
   - **Safari**: Develop menu → Show Web Inspector

2. **Console Tab**: Check for JavaScript errors
3. **Network Tab**: Monitor API requests
4. **Application Tab**: View local storage and service worker

## 📁 Project Structure

```
client/
├── index.html              # Main HTML file with all UI components
├── sw.js                   # Basic service worker implementation
├── README.md               # This documentation
├── css/
│   ├── main.css           # Main application styles
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Mobile and tablet responsive styles
└── js/
    ├── app.js             # Main application logic (direct DOM manipulation)
    └── config.js          # API configuration and settings
```

## 🎨 Features Overview

### Task Management
- **Create Tasks**: Click "Add New Task" button to open the task creation modal
- **Edit Tasks**: Click the edit icon (pencil) on any task to open the edit modal
- **Delete Tasks**: Click the delete icon (trash) on any task
- **Complete Tasks**: Click the checkbox to toggle completion
- **Progress Tracking**: Use the slider to track completion percentage (0-100%)
- **Priority Levels**: Set tasks as Low, Medium, or High priority
- **Due Dates**: Set deadlines with calendar picker (required for new tasks)
- **Categories**: Organize tasks with color-coded categories
- **Assignment**: Assign tasks to team members from dropdown

### Organization Features
- **Categories**: Create color-coded categories for organization (modal-based)
- **Filtering**: Filter tasks by completion status, priority, or category
- **Search**: Find tasks quickly with the search bar

### Team Collaboration
- **User Assignment**: Assign tasks to team members
- **Progress Sharing**: See team members' task progress
- **Shared Categories**: Use categories across your team

### User Experience
- **Modal-Based UI**: Clean interface with modal dialogs for better UX
- **Responsive Design**: Works on all screen sizes
- **Real-time Updates**: Instant synchronization with the backend API
- **Session Management**: Automatic logout on expired sessions
- **Intuitive UI**: Clean, modern interface

## 🔧 Configuration

### API Configuration
Edit `js/config.js` to change the backend API URL:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3001/api',
    // Change this if your backend is on a different port/host
};
```

### Local Storage Keys
The app uses these local storage keys:
- `auth_token`: Your JWT authentication token
- `user_profile`: Your user information
- `tasks_cache`: Cached tasks for offline use
- `categories_cache`: Cached categories

## 🔐 Authentication

### Registration
1. Click "Sign Up" or "Register"
2. Fill in your details:
   - Username (unique)
   - Email address
   - Password (minimum 6 characters)
   - First and Last name
3. Click "Register"

### Login
1. Click "Sign In" or "Login"
2. Enter your email and password
3. Click "Login"

### Password Requirements
- Minimum 6 characters
- Can contain letters, numbers, and special characters
- Case-sensitive

## 📱 Mobile Usage

The app is fully responsive and works great on mobile devices:

### Touch Gestures
- **Tap**: Select tasks or buttons
- **Swipe**: Quick actions (coming soon)
- **Long Press**: Context menu (coming soon)

### Mobile Features
- **Optimized Layout**: Touch-friendly buttons and spacing
- **Responsive Forms**: Easy input on small screens
- **Mobile Navigation**: Simplified navigation for mobile

## 🌐 Basic Offline Support

The application includes a basic service worker that caches static assets for faster loading. However, full offline functionality is limited:

### What Works Offline
- **Static Assets**: CSS, JavaScript, and HTML files are cached
- **Faster Loading**: Cached files load instantly on repeat visits

### What Requires Internet
- **All Data Operations**: Creating, editing, or viewing tasks requires internet
- **User Authentication**: Login/register requires connection
- **Team Features**: All collaborative features require internet

### Service Worker
- Basic caching of static files only
- No offline data storage or synchronization
- Improves performance but doesn't enable offline work

## 🐛 Troubleshooting

### Common Issues

#### 1. "API Connection Failed"
- **Cause**: Backend server not running
- **Solution**: Start the backend server (see server README)
- **Check**: Visit `http://localhost:3001/health` in your browser

#### 2. "Login Failed"
- **Cause**: Wrong email/password or server issues
- **Solution**: Check credentials, ensure backend is running
- **Reset**: Clear browser data if issues persist

#### 3. "Page Not Loading"
- **Cause**: JavaScript disabled or browser compatibility
- **Solution**: Enable JavaScript, try a modern browser
- **Check**: Open Developer Tools → Console for errors

#### 4. "Styles Not Loading"
- **Cause**: CSS files not found or blocked
- **Solution**: Ensure all files are in the correct folders
- **Check**: Browser Network tab for failed CSS requests

#### 5. "Offline Not Working"
- **Cause**: Service worker not registered
- **Solution**: Hard refresh (Ctrl+F5) to register service worker
- **Check**: Application tab in Developer Tools

### Browser-Specific Issues

#### Chrome
- **Incognito Mode**: May not persist data between sessions
- **Extensions**: Some extensions can block local file access

#### Firefox
- **File Protocol**: May need special permissions for local files
- **CORS**: May be stricter with local development

#### Safari
- **Service Worker**: May have limitations in some versions
- **Local Files**: May require special setup

### Clearing Data
To reset the app completely:

1. **Clear Local Storage:**
   - Open Developer Tools → Application tab
   - Select "Local Storage" → your site
   - Click "Clear storage"

2. **Clear Service Worker:**
   - Developer Tools → Application tab
   - Service Workers → Unregister

3. **Hard Refresh:**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## 🚀 Deployment

### Static Hosting Options

#### GitHub Pages
1. Upload the `client/` folder to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/` folder
5. Your site will be available at `https://username.github.io/repository/`

#### Netlify
1. Drag and drop the `client/` folder to https://app.netlify.com/drop
2. Site deploys automatically
3. Get a custom domain if desired

#### Vercel
1. Import your GitHub repository
2. Vercel detects it as a static site
3. Deploys automatically with CDN

### Production Configuration
For production deployment, update `js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-api-domain.com/api',
    // Use HTTPS in production
};
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Components loaded as needed
- **Lazy Loading**: Images and non-critical resources
- **Caching**: Service worker caches static assets
- **Minification**: CSS and JS are optimized
- **Compression**: Gzip compression for faster loading

### Performance Tips
- **Keep browser updated** for best performance
- **Use modern browsers** (Chrome, Firefox, Safari, Edge)
- **Close unused tabs** to free up memory
- **Clear cache periodically** if app feels slow

## 🔧 Development

### Code Style
- **ES6+ Features**: Modern JavaScript syntax
- **Modular Architecture**: Separate concerns in different files
- **Consistent Naming**: camelCase for variables, PascalCase for classes
- **Comments**: Well-documented code with JSDoc comments

### Adding New Features
1. **Plan the feature** and its user interface
2. **Create/update components** in `js/components/`
3. **Add business logic** in `js/services/` or `js/models/`
4. **Update styles** in `css/components.css`
5. **Test thoroughly** across different browsers

### File Naming Convention
- **Components**: `component-name.js`
- **Services**: `service-name.js`
- **Models**: `model-name.js`
- **Utilities**: `utility-name.js`

## 📝 Contributing

### For Developers
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make your changes**
4. **Test across browsers**
5. **Commit with clear messages**
6. **Push and create pull request**

### Code Standards
- Use modern JavaScript (ES6+)
- Follow component architecture patterns
- Write self-documenting code
- Test on multiple browsers
- Keep accessibility in mind

## 📄 License

This project is part of the Task Manager application. See root README for license information.

---

**This frontend provides a beautiful, fast, and intuitive interface for managing tasks and collaborating with your team. Enjoy staying organized!**
