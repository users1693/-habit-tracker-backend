# Habit Tracker - Backend API

RESTful API for a gamified habit tracking application with XP, levels, and streaks.

## 🚀 Live Demo

- **API:** https://habit-tracker-api-hvls.onrender.com
- **Frontend:** https://users1693.github.io/habit-tracker/

## 🛠️ Tech Stack

- Node.js & Express
- PostgreSQL with Prisma ORM
- Timezone-aware cron jobs (node-cron + Luxon)
- JWT authentication
- Deployed on Render

## ✨ Key Features

- User authentication (simplified for demo)
- CRUD operations for habits
- XP calculation with exponential decay based on streaks
- Fibonacci-based leveling system
- Automated daily resets per user timezone
- Multi-completion habit support

## 📊 Database Schema

- Users (level, XP, timezone tracking)
- Habits (type, XP value, target count)
- HabitCompletions (daily aggregation, streak tracking)

## 🌐 API Endpoints

- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login user
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create habit
- `POST /api/completions/increment` - Mark habit complete
- `GET /api/user/:id/stats` - Get user stats
