# University Lost & Found Portal

A complete web application for university students to report lost items, publish found items, search for missing belongings, and submit claims to recover items.

## Features

### For Students
- User registration and secure login
- Report lost items with details and photos
- Report found items with details and photos
- Browse and search all reported items
- Filter by category, location, date, and status
- Submit claims for found items
- View status of submitted claims
- Manage own reports

### For Administrators
- Secure admin dashboard
- Review and approve/reject item reports
- Review and approve/reject claims
- View statistics and summaries
- Manage item categories
- Full access to all system data

### Additional Features
- Intelligent matching system for lost items
- Image upload support
- Role-based access control
- Session-based authentication
- Responsive design for mobile and desktop

## Technology Stack

### Backend
- **Python 3.14** with Flask
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **Flask-CORS** for cross-origin requests
- **Werkzeug** for password hashing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Fetch API** for backend communication

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8 or higher** (3.14 used in this project)
- **Node.js 18 or higher** (v24.22.1 used in this project)
- **npm** (comes with Node.js)
- **PostgreSQL** (postgresql-x64-18 used in this project)

### Check Installation

```bash
python --version
node --version
npm --version
psql --version
```

### PostgreSQL Setup

1. **Ensure PostgreSQL is running:**
   ```bash
   # Windows
   Get-Service | Where-Object {$_.Name -like "*postgres*"}
   ```

2. **Create the database:**
   ```bash
   # Using psql (replace with your PostgreSQL password)
   set PGPASSWORD=your_password
   psql -U postgres -c "CREATE DATABASE lost_and_found;"
   ```

3. **Run the schema script:**
   ```bash
   psql -U postgres -d lost_and_found -f schema.sql
   ```

   The schema script creates:
   - `users` table
   - `categories` table
   - `items` table
   - `claims` table
   - Required indexes
   - Default categories

4. **Verify the setup:**
   ```bash
   psql -U postgres -d lost_and_found -c "\dt"
   ```

**Note:** The database connection string is configured in `backend/.env`:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/lost_and_found
```

Update the password in the `.env` file to match your PostgreSQL password.

## Installation

### 1. Clone or Download the Project

Download or clone this project to your computer.

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create the default administrator account:

```bash
python create_default_admin.py
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@university.edu`

⚠ **IMPORTANT:** Change the admin password after first login!

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
```

## Running the Application

You need to run both the backend and frontend servers simultaneously.

### Terminal 1: Start Backend

Open a terminal/command prompt and navigate to the backend directory:

```bash
cd backend
python run.py
```

The backend will start at: **http://127.0.0.1:5000**

### Terminal 2: Start Frontend

Open a second terminal/command prompt and navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will start at: **http://localhost:5173**

### Access the Application

Open your web browser and go to: **http://localhost:5173**

## Project Structure

```
lost-and-found-portal/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   │   ├── user.py      # User model
│   │   │   ├── category.py  # Category model
│   │   │   ├── item.py      # Item model
│   │   │   └── claim.py     # Claim model
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py      # Authentication routes
│   │   │   ├── items.py     # Item routes
│   │   │   ├── claims.py    # Claim routes
│   │   │   ├── categories.py # Category routes
│   │   │   └── static.py    # Static file serving
│   │   └── services/        # Business logic
│   │       ├── auth_service.py
│   │       ├── item_service.py
│   │       ├── claim_service.py
│   │       └── category_service.py
│   ├── uploads/             # Uploaded images
│   ├── config.py            # Configuration
│   ├── run.py               # Backend entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables
│   ├── create_admin.py      # Interactive admin creation
│   └── create_default_admin.py # Default admin creation
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── ReportLostItem.jsx
│   │   │   ├── ReportFoundItem.jsx
│   │   │   ├── BrowseItems.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── SubmitClaim.jsx
│   │   │   ├── MyReports.jsx
│   │   │   ├── MyClaims.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ReportManagement.jsx
│   │   │   ├── ClaimManagement.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/        # API services
│   │   │   ├── api.js
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── README.md                # This file
```

## Database

The application uses SQLite database (`lost_and_found.db`) which is automatically created in the backend directory when you first run the application.

### Database Tables

1. **users** - User accounts (students and administrators)
2. **categories** - Item categories (Electronics, Clothing, etc.)
3. **items** - Lost and found item reports
4. **claims** - Claims submitted for found items

### Default Categories

The following categories are automatically created:
- Electronics
- Clothing
- Books & Stationery
- ID Cards & Documents
- Keys
- Accessories
- Bags & Wallets
- Others

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check authentication status

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `GET /api/items/my` - Get current user's items
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/approve` - Approve item (admin)
- `POST /api/items/:id/reject` - Reject item (admin)
- `GET /api/items/:id/matches` - Find matching items

### Claims
- `POST /api/claims` - Create new claim
- `GET /api/claims/my` - Get current user's claims
- `GET /api/claims` - Get all claims (admin)
- `GET /api/claims/pending` - Get pending claims (admin)
- `POST /api/claims/:id/approve` - Approve claim (admin)
- `POST /api/claims/:id/reject` - Reject claim (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

## How React, Flask, and SQLite Communicate

1. **Frontend (React)**: The user interacts with the web interface built with React. When a user performs an action (like submitting a form), React sends an HTTP request to the backend.

2. **Backend (Flask)**: Flask receives the HTTP request, processes it, validates the data, and interacts with the database if needed. Flask uses SQLAlchemy to communicate with SQLite.

3. **Database (SQLite)**: SQLite stores all the data (users, items, claims, categories). SQLAlchemy translates Python code into SQL queries that SQLite understands.

4. **Response**: Flask sends the response back to React, which updates the user interface accordingly.

**Example Flow:**
- User fills registration form → React sends POST request to `/api/auth/register`
- Flask validates data → Hashes password → Stores user in SQLite
- Flask sends success response → React shows "Registration successful" message

## Testing

### Test Scenarios

1. **User Registration**
   - Navigate to Register page
   - Fill in all required fields
   - Submit form
   - Verify success message and redirect to login

2. **User Login**
   - Navigate to Login page
   - Enter credentials
   - Verify redirect to dashboard

3. **Report Lost Item**
   - Login as student
   - Navigate to "Report Lost Item"
   - Fill in details and optional image
   - Submit
   - Verify item appears in "My Reports"

4. **Report Found Item**
   - Login as student
   - Navigate to "Report Found Item"
   - Fill in details and optional image
   - Submit
   - Verify item appears in "My Reports"

5. **Browse Items**
   - Navigate to Browse page
   - Try different filters (type, category, search, location)
   - Click on an item to view details

6. **Submit Claim**
   - Login as student
   - Browse found items
   - Click on an unclaimed found item
   - Submit claim with explanation
   - Verify claim appears in "My Claims"

7. **Admin Approve Item**
   - Login as admin
   - Navigate to Admin Dashboard
   - Go to Report Management
   - Approve a pending item
   - Verify status changes

8. **Admin Approve Claim**
   - Login as admin
   - Navigate to Admin Dashboard
   - Go to Claim Management
   - Approve a pending claim
   - Verify status changes

9. **Intelligent Matching**
   - Report a lost item
   - View item details
   - Click "Show Potential Matches"
   - Verify matching found items are displayed

## Stopping the Application

To stop the application:

1. In the terminal running the backend, press `Ctrl + C`
2. In the terminal running the frontend, press `Ctrl + C`

## Troubleshooting

### Backend Issues

**Error: Module not found**
- Ensure you're in the backend directory
- Run `pip install -r requirements.txt`

**Error: Database locked**
- Close all terminals and restart
- Delete `lost_and_found.db` and restart the backend

### Frontend Issues

**Error: Module not found**
- Ensure you're in the frontend directory
- Run `npm install`

**Error: Cannot connect to backend**
- Ensure backend is running at http://127.0.0.1:5000
- Check that both terminals are running

### Port Already in Use

If you see "Port already in use" error:

**Backend (port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Or use a different port in the configuration files.

## Security Notes

1. **Passwords**: Never stored as plain text. Always hashed using Werkzeug's secure password hashing.
2. **Session Management**: Uses Flask session with secure configuration.
3. **Input Validation**: All inputs are validated on both frontend and backend.
4. **SQL Injection**: Protected by SQLAlchemy ORM.
5. **File Uploads**: Validates file types and generates secure filenames.
6. **Role-Based Access**: Admin routes are protected on the backend, not just hidden in the frontend.

## Known Limitations

1. No email notifications for claims
2. No password reset functionality
3. No real-time updates (requires page refresh)
4. No advanced search features
5. No multi-language support
6. Image size limit is 16MB
7. Matching algorithm is rule-based, not machine learning

## College Demonstration

### Implemented Features

1. ✅ User Registration and Login
2. ✅ Role-based Access Control (Student/Admin)
3. ✅ Report Lost Items with Images
4. ✅ Report Found Items with Images
5. ✅ Browse and Search Items
6. ✅ Filter by Category, Location, Date, Status
7. ✅ Submit Claims for Found Items
8. ✅ Admin Dashboard with Statistics
9. ✅ Admin Report Management (Approve/Reject)
10. ✅ Admin Claim Management (Approve/Reject)
11. ✅ Intelligent Matching System
12. ✅ Image Upload Support
13. ✅ Responsive Design

### Test Case Results

| Test Case | Expected Result | Actual Result | Status |
|-----------|----------------|----------------|--------|
| User Registration | Account created successfully | ✓ Pass | Pass |
| User Login | Login successful, redirect to dashboard | ✓ Pass | Pass |
| Report Lost Item | Item created, appears in My Reports | ✓ Pass | Pass |
| Report Found Item | Item created, appears in My Reports | ✓ Pass | Pass |
| Browse Items | Items displayed with filters working | ✓ Pass | Pass |
| Search Items | Search by title/description works | ✓ Pass | Pass |
| Submit Claim | Claim created, appears in My Claims | ✓ Pass | Pass |
| Admin Approve Item | Item status changes to approved | ✓ Pass | Pass |
| Admin Reject Item | Item status changes to rejected | ✓ Pass | Pass |
| Admin Approve Claim | Claim status changes to approved | ✓ Pass | Pass |
| Intelligent Matching | Matching items displayed with reasons | ✓ Pass | Pass |

### Suggested Screenshots for Project Report

1. Home Page
2. Registration Page
3. Login Page
4. Student Dashboard
5. Report Lost Item Form
6. Report Found Item Form
7. Browse Items Page with Filters
8. Item Details Page
9. Submit Claim Page
10. My Reports Page
11. My Claims Page
12. Admin Dashboard
13. Admin Report Management
14. Admin Claim Management
15. Intelligent Matching Results

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User (Browser)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vite)                       │
│              http://localhost:5173                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │ Components   │  │  Services    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ API Calls (Fetch)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Flask Backend (Python)                     │
│              http://127.0.0.1:5000                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes     │  │  Services    │  │   Models     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ SQLAlchemy ORM
                     ↓
┌─────────────────────────────────────────────────────────┐
│              SQLite Database                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Users   │  │  Items   │  │  Claims  │  │Categories│ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Important Viva Questions and Answers

**Q1: Why did you choose Flask for the backend?**
A: Flask is a lightweight and flexible Python web framework that's perfect for small to medium-sized projects. It's easy to learn, has excellent documentation, and integrates well with SQLAlchemy for database operations. It's also widely used in industry and suitable for academic projects.

**Q2: How does the authentication system work?**
A: We use session-based authentication. When a user logs in, Flask creates a session with the user's ID and role. This session is stored server-side and a session cookie is sent to the client. For protected routes, we check if the user is authenticated and has the required role before allowing access.

**Q3: How do you ensure password security?**
A: We use Werkzeug's `generate_password_hash` function which uses the PBKDF2 algorithm with SHA-256. Passwords are never stored in plain text. When a user logs in, we hash the input password and compare it with the stored hash.

**Q4: What is SQLAlchemy and why did you use it?**
A: SQLAlchemy is an ORM (Object-Relational Mapping) library for Python. It allows us to work with databases using Python objects instead of writing raw SQL queries. This makes the code more readable, maintainable, and protects against SQL injection attacks.

**Q5: How does the intelligent matching system work?**
A: It's a rule-based matching algorithm that compares lost items with found items based on:
- Same category
- Similar location names
- Date proximity (within 7 days)
- Similar titles
- Common keywords in descriptions
Each match gets a score, and we show the top 5 matches with reasons.

**Q6: How do you handle file uploads securely?**
A: We validate file types (only PNG, JPG, JPEG, GIF), limit file size to 16MB, generate secure filenames using timestamps, and store files in a dedicated uploads directory. We also use Werkzeug's `secure_filename` to prevent directory traversal attacks.

**Q7: What is CORS and why is it needed?**
A: CORS (Cross-Origin Resource Sharing) is a security feature that browsers implement. Since our frontend runs on port 5173 and backend on port 5000, they're considered different origins. We use Flask-CORS to allow the frontend to make requests to the backend.

**Q8: How does React Router work?**
A: React Router is a library that enables client-side routing. It allows us to navigate between different pages without reloading the entire page. We define routes in App.jsx and use components like Link for navigation.

**Q9: What is the difference between lost and found items?**
A: Lost items are reported by users who have lost something. Found items are reported by users who have found something. Students can only claim found items, not lost items. The system tries to match lost items with found items to help reunite owners with their belongings.

**Q10: How do you ensure only administrators can access admin routes?**
A: We implement role-based access control on the backend using decorators. Each admin route has an `@admin_required` decorator that checks if the logged-in user has the 'admin' role. This is enforced on the server side, not just hidden in the frontend.

## Future Enhancements

1. Email notifications for claim updates
2. Password reset functionality
3. Real-time updates using WebSockets
4. Advanced search with full-text search
5. Multi-language support
6. Mobile app using React Native
7. Integration with university email system
8. Analytics dashboard for administrators
9. Machine learning for better matching
10. SMS notifications for urgent items

## License

This project is created for educational purposes as a BCA final-semester project.

## Contact

For questions or support, please contact the project developer.

---

**Note:** This is a student project designed for demonstration purposes. For production use, additional security measures and optimizations would be required.
