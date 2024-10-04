# Coursio - Course Selling App

Coursio is the backend for a course-selling application, providing the APIs and data management needed for users to buy and sell courses.

## Features
- User authentication and authorization.
- Add, edit, and delete Courses.
- Purchase and Enrollment API middlewares.
- Integration with external payment processor.

## Live Demo
[View the application here](https://todo-fullstack-jet.vercel.app)

## Tech Stack
- **Frontend:** React, tailwindCSS
- **Backend:** Node.js, Express.js, MongoDB
- **Deployment:** Not deployed yet

## Setup Instructions

### Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
	npm install
3. Create a `.env` file in the `backend` directory with the following:
	```bash
	MONGO_URI=your_mongo_connection_string
	PORT=5000
	JWT_SECRET=your_jwt_secret
4. Run the server:
	```bash
	npm start

### Frontend
1. Navigate to the `frontend` folder:
	```bash
	cd frontend
2. Install dependencies:
	```bash
	npm install
3. Start the React application:
	```bash
	npm run dev
### License
This project is licensed under the MIT License.

