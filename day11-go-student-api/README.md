# 🎓 Student Records API

A RESTful API built with Go and MongoDB for managing student records. This project provides a complete CRUD (Create, Read, Update, Delete) interface for student data management.

## 📋 Features

- **Create** new student records
- **Read** student information (individual or all records)
- **Update** existing student data
- **Delete** student records
- MongoDB integration for data persistence
- RESTful API design
- JSON request/response format

## 🛠️ Technologies Used

- **Language:** Go (Golang)
- **Database:** MongoDB
- **Architecture:** RESTful API

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- Go 1.19 or higher
- MongoDB 4.4 or higher
- Git

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd student-records-api
```

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection details:
```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=student_db
PORT=8080
```

4. Start MongoDB service:
```bash
# On Linux/Mac
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. Run the application:
```bash
go run main.go
```

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| POST | `/students` | Create new student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

## 📝 Request/Response Examples

### Create Student
**POST** `/students`
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "course": "Computer Science"
}
```

**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "course": "Computer Science",
  "created_at": "2025-10-06T10:30:00Z"
}
```

### Get All Students
**GET** `/students`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 20,
      "course": "Computer Science"
    }
  ],
  "count": 1
}
```

### Get Student by ID
**GET** `/students/:id`

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "course": "Computer Science"
}
```

### Update Student
**PUT** `/students/:id`
```json
{
  "name": "John Smith",
  "age": 21
}
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "email": "john.doe@example.com",
  "age": 21,
  "course": "Computer Science",
  "updated_at": "2025-10-06T11:00:00Z"
}
```

### Delete Student
**DELETE** `/students/:id`

**Response:** `200 OK`
```json
{
  "message": "Student deleted successfully"
}
```

## 🏗️ Project Structure

```
student-records-api/
├── main.go
├── go.mod
├── go.sum
├── .env
├── .env.example
├── controllers/
│   └── student_controller.go
├── models/
│   └── student.go
├── routes/
│   └── routes.go
├── database/
│   └── connection.go
├── middleware/
│   └── logger.go
└── README.md
```

## 🧪 Testing

Run tests with:
```bash
go test ./...
```

Run tests with coverage:
```bash
go test -cover ./...
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `student_db` |
| `PORT` | Server port | `8080` |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Your Name
- GitHub: [@enyasystem](https://github.com/enyasystem)
- Email: enyaelvis@gmail.com

## 🙏 Acknowledgments

- Thanks to the Go community
- MongoDB documentation
- All contributors

## 📞 Support

If you have any questions or need help, please open an issue or contact the maintainer.

---

⭐ Please Star this repository if you find it helpful
