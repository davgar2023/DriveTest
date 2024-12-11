# 🛠️ DriveTest - Full-Stack Web Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v16.14.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-v18.2.0-blue.svg)
![Express](https://img.shields.io/badge/express-v4.18.2-grey.svg)
![MongoDB](https://img.shields.io/badge/mongodb-v6.0.3-green.svg)
![Vite](https://img.shields.io/badge/vite-v4.1.0-brightgreen.svg)

## 🚀 Table of Contents

- [📌 Project Overview](#-project-overview)
- [🛠️ Technologies Used](#️-technologies-used)
- [📋 Features](#-features)
- [🔧 Installation](#-installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🚀 Running the Application](#-running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend Application](#starting-the-frontend-application)
- [🗂️ Project Structure](#️-project-structure)
- [📄 API Documentation](#-api-documentation)
- [📸 Screenshots](#-screenshots)

## 📌 Project Overview

**DriveTestApp** is a robust full-stack web application designed to manage user authentication, file handling, and reporting functionalities. Built with modern technologies, it ensures a seamless and secure user experience with features like JWT-based authentication, token refreshing, and automatic logout on inactivity.

## 🛠️ Technologies Used

### Frontend

- **[React](https://reactjs.org/)** – A JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev/)** – Next Generation Frontend Tooling.
- **[React Router](https://reactrouter.com/)** – Declarative routing for React.
- **[Axios](https://axios-http.com/)** – Promise based HTTP client.
- **[React-Bootstrap](https://react-bootstrap.github.io/)** – Bootstrap components built with React.
- **[Bootswatch Darkly Theme](https://bootswatch.com/darkly/)** – A dark theme for Bootstrap.

### Backend

- **[Node.js](https://nodejs.org/)** – JavaScript runtime built on Chrome's V8 engine.
- **[Express](https://expressjs.com/)** – Fast, unopinionated, minimalist web framework for Node.js.
- **[MongoDB](https://www.mongodb.com/)** – NoSQL database for modern applications.
- **[Mongoose](https://mongoosejs.com/)** – Elegant MongoDB object modeling for Node.js.
- **[JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)** – JSON Web Tokens for secure authentication.
- **[Cors](https://github.com/expressjs/cors)** – Middleware for enabling CORS.

## 📋 Features

- **User Authentication:**
  - Secure registration and login with JWT.
  - Access and Refresh tokens for session management.
  - Automatic token refreshing upon expiration.
  - Inactivity-based automatic logout after 15 minutes.

- **File Management:**
  - Upload, view, and delete user-specific files.
  - Secure handling and storage of file data.

- **Reporting:**
  - Create, edit, and delete reports.
  - User role-based access control for reports.

- **Responsive Design:**
  - Fully responsive layout using React-Bootstrap and Bootswatch Darkly theme.
  - Optimized for desktop and mobile devices.

## 🔧 Installation

### Backend Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/davgar2023/drivetest.git
   cd myapp/backend

2. **Install Dependencies**

npm install

3. **Configure Environment Variables**
Create a .env file in the backend directory and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
GOOGLE_MAPS_API_KEY=api_google_key


*PORT: Port number for the backend server.
*MONGO_URI: MongoDB connection string.
*JWT_SECRET: Secret key for signing access tokens.
*JWT_REFRESH_SECRET: Secret key for signing refresh tokens.

4. **Start the Backend Server:**
npm run dev

    "init:permissions": "node scripts/createPermissions.js",
    "init:roles": "node scripts/createRoles.js",
    "init:admin": "node scripts/createAdminUser.js",
    "init": "npm run init:permissions && npm run init:roles && npm run init:admin"

initial project configuration 

npm run init 

The backend server should now be running on http://localhost:5000.

### Frontend Setup

1. **Navigate to Frontend Directory:**
cd ../frontend

2. **Install Dependencies:**
npm install

3. **Configure Environment Variables:**
 Create a .env file in the frontend directory and add the following:

VITE_API_BASE_URL=http://localhost:5000

*VITE_API_BASE_URL: Base URL for the backend API.

4. **Start the Frontend Application:**
npm run dev

🗂️ Project Structure

            DrivetestApp/
            ├── backend/
            │   ├── config/
            │   │   └── db.js
            │   ├── controllers/
            │   │   └── authController.js
            │   │   └── fileController.js
            │   │   └── reportController.js
            │   │   └── rtpController.js
            │   ├── models/
            │   │   ├── File.js
            │   │   └── RefreshToken.js
            │   │   └── logModel.js
            │   │   └── metadatModel.js
            │   │   └── metricsModel.js
            │   │   └── Permission.js
            │   │   └── Report.js
            │   │   └── Role.js
            │   │   └── routeModel.js
            │   │   └── routePoint.js
            │   │   └── trpModel.js
            │   │   └── User.js
            │   ├── scripts/
            │   │   └── createAdminUser.js
            │   │   └── createPermission.js
            │   │   └── createRoles.js
            │   ├── services/
            │   │   └── pptxService.js
            │   │   └── trpParser.js
            │   ├── routes/
            │   │   └── auth.js
            │   │   └── files.js
            │   │   └── reports.js
            │   │   └── roles.js
            │   │   └── rtp.js
            │   ├── middleware/
            │   │   └── auth.js
            │   │   └── errorHandler.js
            │   │   └── permission.js
            │   ├── utils/
            │   │   └── formatterSize.js
            │   │   └── upload.js
            │   ├── tests/
            │   │   └── auth.test.js
            │   ├── .env
            │   ├── package.json
            │   └── server.js
            ├── frontend/
            │   ├── src/
            │   │   ├── components/
            │   │   │   ├── Dashboard.jsx
            │   │   │   ├── FileListRtp.jsx
            │   │   │   ├── FileList.jsx
            │   │   │   ├── ReportList.jsx
            │   │   │   ├── Login.jsx
            │   │   │   ├── Register.jsx
            │   │   │   ├── Navbar.jsx
            │   │   │   └── PrivateRoute.jsx
            │   │   ├── context/
            │   │   │   └── AuthProvider.jsx
            │   │   ├── api/
            │   │   │   └── axios.js
            │   │   ├── App.jsx
            │   │   ├── main.jsx
            │   │   └── custom.css
            │   ├── .env
            │   ├── package.json
            │   └── vite.config.js
            ├── README.md
            └── LICENSE


📄 API Documentation

Authentication Routes
Register a New User

POST /api/auth/register

Request Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "roleName": "User"
}

Response:

{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}

Login User

POST /api/auth/login


Request Body:

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:

{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}

## Report Management Routes
(Assuming similar CRUD operations for reports)
