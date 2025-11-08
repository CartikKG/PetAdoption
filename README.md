# Pet Adoption Management System

A full-stack MERN application for managing pet adoptions with role-based access control.

## Features

### Visitor
- Browse available pets
- Search pets by name or breed
- Filter pets by species, breed, and age
- View pet details
- Pagination on pet list

### User
- Register and login
- Apply to adopt available pets
- View own adoption applications and statuses

### Admin
- Add, edit, and delete pets
- View all adoption applications
- Approve or reject applications
- Update pet status

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, Axios, React Router
- **Database**: MongoDB

## Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running (or MongoDB Atlas connection string)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/petadoption
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. Seed the database with dummy data (optional):
```bash
npm run seed
```

This will create:
- Admin user: admin@example.com / admin123
- Test user: user@example.com / user123
- 16 sample pets

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

1. Start MongoDB (if using local MongoDB)
2. Start the backend server (port 5000)
3. Start the frontend server (port 3000)
4. Open browser and navigate to `http://localhost:3000`

### Seeding Database

Run the seed script to populate the database with dummy data:

```bash
cd backend
npm run seed
```

This creates:
- **Admin user**: admin@example.com / admin123
- **Test user**: user@example.com / user123
- **16 sample pets** with various species, breeds, and ages

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Pets
- `GET /api/pets` - Get all pets (with filters and pagination)
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create pet (admin only)
- `PUT /api/pets/:id` - Update pet (admin only)
- `DELETE /api/pets/:id` - Delete pet (admin only)

### Adoptions
- `POST /api/adoptions` - Apply for adoption (user only)
- `GET /api/adoptions/my-applications` - Get user's applications (user only)
- `GET /api/adoptions` - Get all applications (admin only)
- `PUT /api/adoptions/:id/approve` - Approve application (admin only)
- `PUT /api/adoptions/:id/reject` - Reject application (admin only)

## Project Structure

```
pet-adoption-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── Adoption.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── pets.js
│   │   └── adoptions.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── config/
│   │   └── App.js
│   └── package.json
└── README.md
```

