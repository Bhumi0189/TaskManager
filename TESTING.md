# Testing Guide for TaskManager

This document provides a comprehensive testing checklist to ensure all features are working correctly before submission.

## Prerequisites
- Application running on `http://localhost:3000`
- MongoDB connection established
- Browser DevTools open (F12) for monitoring network requests

---

## 1. Authentication Flow Testing

### Registration
- [ ] Navigate to `/register`
- [ ] Test validation errors:
  - [ ] Empty form submission
  - [ ] Invalid email format (e.g., "notanemail")
  - [ ] Short name (less than 2 characters)
  - [ ] Short password (less than 6 characters)
  - [ ] Password mismatch
- [ ] Submit valid registration:
  - [ ] Full Name: "Test User"
  - [ ] Email: "test@example.com"
  - [ ] Password: "password123"
  - [ ] Confirm Password: "password123"
- [ ] Verify redirect to dashboard
- [ ] Check browser cookies for session cookie

### Login
- [ ] Logout from dashboard
- [ ] Navigate to `/login`
- [ ] Test validation errors:
  - [ ] Empty form submission
  - [ ] Invalid email format
  - [ ] Wrong password
- [ ] Login with correct credentials
- [ ] Verify redirect to dashboard
- [ ] Check session persistence (refresh page, should stay logged in)

### Protected Routes
- [ ] Logout
- [ ] Try to access `/dashboard` directly
- [ ] Verify redirect to `/login`
- [ ] Try to access `/dashboard/tasks` directly
- [ ] Try to access `/dashboard/profile` directly

---

## 2. Dashboard Features

### Navigation
- [ ] Click on all sidebar links
- [ ] Verify active state highlights
- [ ] Test responsive menu on mobile (< 768px width)
- [ ] Test dark mode toggle
- [ ] Verify dark mode persists on refresh

### Profile Page (`/dashboard/profile`)
- [ ] Verify profile data loads correctly
- [ ] Test profile edit:
  - [ ] Click Edit button
  - [ ] Modify Full Name
  - [ ] Modify Email
  - [ ] Click Save
  - [ ] Verify success message
  - [ ] Refresh page and verify changes persist
- [ ] Test validation:
  - [ ] Try saving with empty name
  - [ ] Try saving with invalid email
  - [ ] Verify error messages display

---

## 3. Task Management Testing

### Task List (`/dashboard/tasks`)
- [ ] Verify empty state if no tasks
- [ ] Verify task list loads

### Create Task
- [ ] Click "Create Task" button
- [ ] Test validation:
  - [ ] Submit empty form
  - [ ] Verify title required error
- [ ] Create task with only title:
  - [ ] Title: "Test Task 1"
  - [ ] Click Create
  - [ ] Verify task appears in list
- [ ] Create task with all fields:
  - [ ] Title: "Test Task 2"
  - [ ] Description: "This is a test task"
  - [ ] Deadline: Select future date
  - [ ] Click Create
  - [ ] Verify task appears with deadline badge
- [ ] Create overdue task:
  - [ ] Title: "Overdue Task"
  - [ ] Deadline: Select past date
  - [ ] Verify red overdue indicator

### Search & Filter
- [ ] Test search functionality:
  - [ ] Type in search box
  - [ ] Verify results filter in real-time
  - [ ] Search by title
  - [ ] Search by description
  - [ ] Clear search
- [ ] Test status filter:
  - [ ] Select "All" - verify all tasks shown
  - [ ] Select "Pending" - verify only pending tasks
  - [ ] Select "Completed" - verify only completed tasks

### Update Task
- [ ] Click edit button on a task
- [ ] Modify title
- [ ] Click save
- [ ] Verify changes persist
- [ ] Edit task and toggle status to "Completed"
- [ ] Verify checkmark icon appears
- [ ] Verify task styling updates

### Delete Task
- [ ] Click delete button on a task
- [ ] Verify task is removed from list
- [ ] Verify success message
- [ ] Refresh page and verify task is gone

### Real-time Updates
- [ ] Leave task page open
- [ ] Wait 5 seconds
- [ ] Verify sync indicator appears during refresh
- [ ] Open two browser tabs
- [ ] Create task in one tab
- [ ] Wait 5 seconds in other tab
- [ ] Verify task appears (auto-refresh)

---

## 4. API Testing (Postman/cURL)

### Import Postman Collection
1. Open Postman
2. Import `TaskManager-API.postman_collection.json`
3. Set environment variable: `baseUrl = http://localhost:3000`

### Test Endpoints

#### Auth Endpoints
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "API Test User",
    "email": "api@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "api@example.com",
    "password": "password123"
  }'

# Get Current User
curl http://localhost:3000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

#### Profile Endpoints
```bash
# Get Profile
curl http://localhost:3000/api/profile \
  -b cookies.txt

# Update Profile
curl -X PATCH http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "fullName": "Updated Name",
    "email": "updated@example.com"
  }'
```

#### Task Endpoints
```bash
# Create Task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "API Created Task",
    "description": "Testing API",
    "deadline": "2025-12-31T23:59:59.000Z"
  }'

# Get All Tasks
curl http://localhost:3000/api/tasks \
  -b cookies.txt

# Get Task by ID (replace {id} with actual task ID)
curl http://localhost:3000/api/tasks/{id} \
  -b cookies.txt

# Update Task
curl -X PATCH http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Updated Title",
    "status": "Completed"
  }'

# Delete Task
curl -X DELETE http://localhost:3000/api/tasks/{id} \
  -b cookies.txt
```

---

## 5. Security Testing

### Authentication
- [ ] Try accessing API endpoints without authentication
- [ ] Verify 401 Unauthorized responses
- [ ] Check that cookies are HTTP-only (inspect in DevTools)
- [ ] Verify cookies have Secure flag in production

### Authorization
- [ ] Create tasks with User A
- [ ] Try to access User A's tasks with User B's session
- [ ] Verify 403 Forbidden response

### Input Validation
- [ ] Test SQL injection attempts (should be safe with MongoDB)
- [ ] Test XSS attempts in task titles/descriptions
- [ ] Verify HTML is escaped in rendered content
- [ ] Test extremely long inputs (10,000+ characters)

### Password Security
- [ ] Check MongoDB users collection
- [ ] Verify passwords are hashed (not plain text)
- [ ] Verify password hashes are different for same password
- [ ] Try to register with same email twice
- [ ] Verify duplicate email error

---

## 6. Responsive Design Testing

### Desktop (1920x1080)
- [ ] Verify layout looks good
- [ ] Check sidebar is always visible
- [ ] Test all features

### Tablet (768x1024)
- [ ] Verify responsive layout
- [ ] Check sidebar behavior
- [ ] Test touch interactions

### Mobile (375x667)
- [ ] Verify mobile layout
- [ ] Check sidebar collapses
- [ ] Test hamburger menu
- [ ] Verify forms are usable
- [ ] Check task cards stack properly

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Check for console errors in each browser

---

## 7. Performance Testing

### Page Load Times
- [ ] Measure initial page load (< 3 seconds)
- [ ] Check Lighthouse score (> 80)
- [ ] Verify no unnecessary re-renders
- [ ] Check bundle size in DevTools Network tab

### API Response Times
- [ ] Check response times in Network tab
- [ ] Login: < 200ms (with local DB)
- [ ] Get tasks: < 100ms
- [ ] Create task: < 150ms
- [ ] Update task: < 150ms

### Database Queries
- [ ] Monitor MongoDB logs
- [ ] Verify queries use indexes (when implemented)
- [ ] Check for N+1 query problems

---

## 8. Error Handling

### Network Errors
- [ ] Disconnect network
- [ ] Try to create a task
- [ ] Verify error message displays
- [ ] Reconnect network
- [ ] Verify functionality resumes

### Server Errors
- [ ] Stop MongoDB
- [ ] Try to login
- [ ] Verify graceful error handling
- [ ] Start MongoDB
- [ ] Verify app recovers

### Invalid Data
- [ ] Try to update task with invalid ID
- [ ] Verify 404 error handling
- [ ] Try to access deleted task
- [ ] Verify appropriate error messages

---

## 9. User Experience

### Loading States
- [ ] Verify loading spinners show during operations
- [ ] Check skeleton loaders (if implemented)
- [ ] Verify buttons disable during submission

### Success Feedback
- [ ] Verify success messages for:
  - [ ] Task created
  - [ ] Task updated
  - [ ] Task deleted
  - [ ] Profile updated
- [ ] Check messages auto-dismiss (if implemented)

### Error Messages
- [ ] Verify user-friendly error messages
- [ ] Check error messages are specific (not generic "error occurred")
- [ ] Verify validation errors highlight fields

---

## 10. Edge Cases

### Empty States
- [ ] New user with no tasks
- [ ] Verify empty state message
- [ ] Search with no results
- [ ] Filter with no matching tasks

### Concurrent Operations
- [ ] Open two tabs
- [ ] Delete task in Tab 1
- [ ] Try to edit same task in Tab 2
- [ ] Verify appropriate error handling

### Long Content
- [ ] Create task with very long title (200+ chars)
- [ ] Create task with very long description (5000+ chars)
- [ ] Verify content truncates or scrolls appropriately

### Special Characters
- [ ] Create task with emojis: "🚀 Launch project 🎉"
- [ ] Create task with special chars: "<script>alert('test')</script>"
- [ ] Verify content renders safely (XSS protection)

---

## Test Results Summary

### Checklist
- [ ] All authentication flows working
- [ ] All CRUD operations working
- [ ] All validations working (client + server)
- [ ] Protected routes working
- [ ] Search and filter working
- [ ] API endpoints tested
- [ ] Security measures verified
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] Error handling graceful
- [ ] No console errors

### Known Issues
Document any issues found:
1. 
2. 
3. 

### Browser Tested
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Notes
Add any additional observations or recommendations:

---

## Pre-Submission Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables documented
- [ ] README.md complete
- [ ] API documentation (Postman) ready
- [ ] Scaling documentation complete
- [ ] Code committed to GitHub
- [ ] .env.local NOT committed (in .gitignore)
- [ ] Clear commit messages
- [ ] Repository is public or accessible to evaluators

---

## Quick Test Script

Run this quick test after making changes:

```bash
# 1. Check environment
echo "Checking .env.local..."
test -f .env.local && echo "✅ .env.local exists" || echo "❌ .env.local missing"

# 2. Install and build
npm install
npm run build

# 3. Run linter
npm run lint

# 4. Start server
npm run dev

# 5. Manual testing checklist (open browser):
# - Register new user
# - Create task
# - Edit task
# - Delete task
# - Update profile
# - Logout
# - Login

# All working? ✅ Ready to submit!
```

---

**Last Updated:** December 31, 2025
**Version:** 1.0
