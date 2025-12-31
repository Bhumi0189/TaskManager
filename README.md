# TaskManager - Scalable Web App with Authentication & Dashboard

A modern, secure web application built with Next.js 15, featuring JWT-based authentication, task management, and a responsive dashboard. This project demonstrates best practices in full-stack development with a focus on security, scalability, and user experience.

## 🚀 Features

### Authentication & Security
- **JWT-based Authentication** with HTTP-only cookies
- **Password Hashing** using bcryptjs
- **Protected Routes** with middleware authentication
- **Session Management** with automatic token validation
- **Secure Logout** with session cleanup

### Dashboard Functionality
- **User Profile Management** - View and edit profile information
- **Task Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Real-time Updates** - Auto-refresh task list every 5 seconds
- **Search & Filter** - Search tasks by title/description and filter by status
- **Deadline Tracking** - Visual indicators for overdue tasks
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### User Experience
- **Modern UI** with TailwindCSS and Radix UI components
- **Dark Mode Support** with theme persistence
- **Form Validation** - Client-side and server-side validation
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Hook Form** - Form state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with connection pooling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **pnpm** package manager
- **MongoDB** instance (local or MongoDB Atlas)

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd secure-board-web-application
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager

JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
```

**Important:** 
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong random string for `JWT_SECRET` (minimum 32 characters)
- Never commit `.env.local` to version control

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
secure-board-web-application/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── profile/        # Profile management
│   │   └── tasks/          # Task CRUD operations
│   ├── dashboard/          # Protected dashboard pages
│   ├── login/              # Login page
│   └── register/           # Registration page
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── login-form.tsx      # Login form component
│   ├── register-form.tsx   # Registration form
│   ├── task-list.tsx       # Task list with CRUD
│   └── protected-route.tsx # Route protection HOC
├── lib/                     # Utility functions
│   ├── auth.ts             # Client-side auth utilities
│   ├── auth-server.ts      # Server-side auth logic
│   ├── db.ts               # Database connection
│   ├── models.ts           # Database models
│   ├── session.ts          # Session management
│   ├── validation.ts       # Form validation
│   └── utils.ts            # General utilities
└── public/                  # Static assets
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Profile

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/profile` | Get user profile | Yes |
| PATCH | `/api/profile` | Update user profile | Yes |

### Tasks

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/tasks` | Get all user tasks | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/[id]` | Get specific task | Yes |
| PATCH | `/api/tasks/[id]` | Update task | Yes |
| DELETE | `/api/tasks/[id]` | Delete task | Yes |

### Request/Response Examples

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "deadline": "2025-12-31T23:59:59.000Z"
}
```

## 🧪 Testing

See [TESTING.md](TESTING.md) for comprehensive testing instructions.

### Manual Testing Steps

1. **Registration Flow**
   - Navigate to `/register`
   - Fill form with valid data
   - Verify account creation and redirect

2. **Login Flow**
   - Navigate to `/login`
   - Enter credentials
   - Verify dashboard access

3. **Task Management**
   - Create new task
   - Edit task title/status
   - Delete task
   - Search and filter tasks

4. **Profile Management**
   - View profile information
   - Update name/email
   - Verify changes persist

### API Testing

Import the Postman collection from `TaskManager-API.postman_collection.json` and test all endpoints.

### Test Credentials
After registration, use your created credentials to test the application.

## 🔒 Security Features

### Implemented Security Measures

1. **Password Security**
   - Passwords hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Minimum length validation

2. **Authentication**
   - JWT tokens stored in HTTP-only cookies
   - Tokens cannot be accessed via JavaScript (XSS protection)
   - Automatic token verification on protected routes

3. **Authorization**
   - User-specific data isolation
   - Tasks owned by users cannot be accessed by others
   - Server-side permission checks

4. **Input Validation**
   - Client-side validation for immediate feedback
   - Server-side validation for security
   - Email format validation
   - SQL injection prevention through MongoDB

5. **Session Management**
   - Secure session creation and verification
   - Automatic session cleanup on logout
   - Token expiration handling

## 📈 Scalability & Production Deployment

See [SCALING.md](SCALING.md) for comprehensive production scaling strategies.

### Frontend Scaling Strategies

1. **Static Generation & ISR**
   - Use Next.js Static Site Generation (SSG) for public pages
   - Implement Incremental Static Regeneration (ISR) for dynamic content
   - Reduces server load and improves response times

2. **CDN Distribution**
   - Deploy static assets to CDN (Cloudflare, AWS CloudFront)
   - Geographic distribution for faster global access
   - Automatic edge caching

3. **Code Splitting**
   - Next.js automatic code splitting already implemented
   - Lazy load components for better initial load times
   - Dynamic imports for heavy components

4. **Image Optimization**
   - Use Next.js Image component for automatic optimization
   - WebP format with fallbacks
   - Responsive images with srcset

### Backend Scaling Strategies

1. **Horizontal Scaling**
   - Deploy multiple Next.js instances behind load balancer
   - Use PM2 or similar for process management
   - Session state stored in database, not in-memory

2. **Database Optimization**
   - **Indexing**: Add indexes on frequently queried fields
     ```javascript
     // users collection
     db.users.createIndex({ email: 1 }, { unique: true })
     
     // tasks collection
     db.tasks.createIndex({ userId: 1 })
     db.tasks.createIndex({ status: 1 })
     db.tasks.createIndex({ deadline: 1 })
     ```
   - **Connection Pooling**: Already implemented in `lib/db.ts`
   - **Replica Sets**: Use MongoDB replica sets for read scaling
   - **Sharding**: Implement sharding for massive datasets

3. **Caching Layer**
   - **Redis** for session storage and caching
   - Cache frequently accessed data (user profiles, common queries)
   - Implement cache invalidation strategies
   ```javascript
   // Example: Cache user profile
   const cacheKey = `user:${userId}`;
   let user = await redis.get(cacheKey);
   if (!user) {
     user = await db.users.findOne({ _id: userId });
     await redis.setex(cacheKey, 3600, JSON.stringify(user));
   }
   ```

4. **API Rate Limiting**
   - Implement rate limiting middleware
   - Prevent abuse and DDoS attacks
   - Use Redis for distributed rate limiting

5. **Background Jobs**
   - Move heavy operations to background queues (Bull, BullMQ)
   - Email notifications
   - Data aggregation and reports
   - Scheduled task reminders

### Infrastructure Recommendations

1. **Containerization**
   ```dockerfile
   # Example Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Orchestration**
   - Use Kubernetes for container orchestration
   - Auto-scaling based on CPU/memory metrics
   - Rolling updates for zero-downtime deployments

3. **Monitoring & Logging**
   - Implement logging (Winston, Pino)
   - Use APM tools (New Relic, Datadog)
   - Set up alerts for errors and performance issues
   - Centralized logging (ELK stack, CloudWatch)

4. **CI/CD Pipeline**
   - Automated testing on push
   - Build and deploy on merge to main
   - Environment-specific configurations
   - Rollback capabilities

### Deployment Platforms

- **Vercel** - Easiest for Next.js, automatic optimization
- **AWS** - Full control with ECS/EKS
- **Google Cloud Run** - Serverless containers
- **DigitalOcean** - Simple and cost-effective
- **Railway/Render** - Quick deployment with databases

### Performance Optimization

1. **Bundle Size Reduction**
   - Tree shaking enabled
   - Remove unused dependencies
   - Analyze bundle with `@next/bundle-analyzer`

2. **Database Query Optimization**
   - Use projection to limit returned fields
   - Implement pagination for large datasets
   - Avoid N+1 query problems

3. **Caching Headers**
   - Set appropriate Cache-Control headers
   - Use ETags for conditional requests
   - Implement stale-while-revalidate

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Set environment variables on server
3. Start with: `npm start`
4. Use a process manager like PM2
5. Set up reverse proxy (Nginx) if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## � Project Documentation

- **[README.md](README.md)** - Main documentation (this file)
- **[SCALING.md](SCALING.md)** - Production scaling strategies
- **[TESTING.md](TESTING.md)** - Comprehensive testing guide
- **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** - Assignment completion summary
- **[SUBMISSION-CHECKLIST.md](SUBMISSION-CHECKLIST.md)** - Pre-submission checklist
- **[.env.example](.env.example)** - Environment variables template
- **[TaskManager-API.postman_collection.json](TaskManager-API.postman_collection.json)** - API documentation

## �📝 License

This project is licensed under the MIT License.

## 👤 Author

Built as part of a web development assignment demonstrating full-stack capabilities with modern technologies.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- MongoDB for the database
- All open-source contributors