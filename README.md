# Ace Nation Fitness Planner

A dynamic workout and meal planning application with MongoDB backend.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Database Connection
```bash
node test-db.js
```

### 3. Start the Server
```bash
npm run server
```

### 4. Start the Frontend (in a new terminal)
```bash
npm run dev
```

## 🔧 Database Setup

The application now uses MongoDB instead of in-memory storage. Your MongoDB connection string is configured in `server.js`.

### MongoDB Connection Details:
- **Database**: `ACE-NATION` (from appName parameter)
- **Cluster**: `ace-nation.9xpfamo.mongodb.net`
- **Username**: `jainmanthan6106`

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management
- `GET /api/users` - Get all users (debug endpoint)
- `GET /api/users/:userId` - Get specific user
- `POST /api/users/:userId/workouts` - Add workout to user
- `POST /api/users/:userId/meals` - Add meal to user

### Health Check
- `GET /api/health` - Server status

## 🐛 Troubleshooting

### Data Not Showing in Database?

1. **Check MongoDB Connection**: Run `node test-db.js` to verify connection
2. **Start Server**: Make sure to run `npm run server` (not just `npm run dev`)
3. **Check Console**: Look for "MongoDB Connected" message in server console
4. **Verify Endpoints**: Test API endpoints with Postman or similar tool

### Common Issues:
- **Port Conflicts**: Server runs on port 3001, frontend on Vite's default port
- **MongoDB Atlas**: Ensure your IP is whitelisted in MongoDB Atlas
- **Environment Variables**: Create `.env` file if needed (optional for now)

## 📁 Project Structure

```
├── server.js          # Express server with MongoDB
├── test-db.js         # Database connection test
├── package.json       # Dependencies and scripts
├── index.html         # Frontend entry point
├── js/                # Frontend JavaScript
└── node_modules/      # Dependencies
```

## 🔒 Security Notes

- Passwords are currently stored in plain text (use bcrypt in production)
- MongoDB connection string is hardcoded (use environment variables in production)
- Debug endpoints expose user data (remove in production)
