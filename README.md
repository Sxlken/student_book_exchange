# Student Book Exchange

## Overview 
Electronic Library is a Flask-based web application designed to facilitate book sharing and exchanges among students. It provides a platform where students can list their books, search for books they need, review books, and directly communicate with other users to exchange books.

## Features

### User Management
- Registration and authentication
- Profile customization
- University affiliation

### Book Management
- Add, edit, and remove books
- Upload book covers and PDF files
- Categorize books by subject
- Set loan duration and book condition

### Social Features
- Real-time messaging between users
- Book reviews and ratings
- Favorite books collection
- Book transfer between users

### Search and Discovery
- Advanced search with multiple filters
- Browse by categories
- Sort by title, author, rating, or recency

## Technology Stack
- **Backend**: Flask (Python)
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Flask-Bcrypt
- **Form Handling**: Flask-WTF
- **File Uploads**: Werkzeug

## Installation and Setup

### Prerequisites
- Python 3.7+
- PostgreSQL
- pip (Python package manager)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/electronic-library.git
   cd electronic-library
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
5. Configure PostgreSQL:
   - Create a database named `student_library`
   - Update database connection details in `site/app.py`:
     ```python
     conn = psycopg2.connect(
         host="localhost",
         database="student_library",
         user="your_username",
         password="your_password"
     )
     ```

6. Create necessary directories:
   ```bash
   mkdir -p site/static/uploads
   ```

7. Run the application:
   ```bash
   cd site
   flask run
   ```

8. Access the application at http://localhost:5000
