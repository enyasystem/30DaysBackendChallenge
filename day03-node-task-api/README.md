# 📋 Task Manager API (Day 3 of #30DaysOfBackend)

A simple, modular Task Manager API built with Node.js and Express as part of my 30 Days Backend Challenge! 🚀

## ✨ Features
- Full CRUD operations for tasks (Create, Read, Update, Delete) 📝
- RESTful API endpoints ⚡
- In-memory data storage (fast prototyping) 💾
- Simple HTML frontend for easy testing 🖥️
- Modular code structure: routes, controllers, models 🗂️
- Edit, complete, and delete tasks with instant feedback 🔄

## 📦 Tech Stack
- Node.js
- Express.js
- Vanilla JavaScript (frontend)

## 📁 Project Structure
```
day03-node-task-api/
├── controllers/
│   └── taskController.js
├── models/
│   └── taskModel.js
├── public/
│   └── index.html
├── routes/
│   └── taskRoutes.js
├── index.js
└── ...
```

## 🚦 How to Run
```powershell
cd day03-node-task-api
npm install
node index.js
```
Visit [http://localhost:3000](http://localhost:3000) in your browser to use the frontend!

## 🔗 API Endpoints
- `GET    /api/tasks`         → List all tasks
- `POST   /api/tasks`         → Create a new task
- `GET    /api/tasks/:id`     → Get a single task
- `PUT    /api/tasks/:id`     → Update a task (title, description, status)
- `DELETE /api/tasks/:id`     → Delete a task

## 🖥️ Frontend Features
- Add, edit, complete, and delete tasks
- Confirmation before delete
- Notifications for all actions
- Loading spinner for better UX

## 🧠 Key Concepts
- REST API design principles
- Modular backend architecture
- Connecting frontend and backend
- Handling HTTP requests/responses
- In-memory storage for prototyping

## 🚀 Next Steps
- Add persistent storage (database)
- Implement authentication (JWT)
- Write automated tests
- Add pagination, filtering, and search

---

Made with ❤️ for #30DaysOfBackend challenge by Enya Elvis
