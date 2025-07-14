# 📝 Notes & Bookmark Manager

A simple full-stack application to manage your **personal notes** and **bookmarks** using:

- 🌐 **Frontend**: Next.js + Tailwind CSS
- 🖥️ **Backend**: Node.js + Express
- 💾 **Database**: MongoDB (via Mongoose)

No authentication or login required.

---

## 🔧 Features

- ✅ Add, edit, delete **notes** with tags and favorite support
- 🔖 Add, edit, delete **bookmarks** with titles, descriptions, tags, and favorite support
- 🔍 Filter by search text or tags
- ⭐ Mark notes and bookmarks as favorites
- 🎨 Clean and responsive UI built with Tailwind CSS

---

## 📦 Project Setup

### 1. Clone the Repository

git clone https://github.com/your-username/notes-bookmark-manager.git
cd notes-bookmark-manager

### 2. Backend Setup

cd backend
npm install

Create a .env file in the backend folder:
PORT=5000
MONGO_URI=mongodb://localhost:27017/notes-bookmark-db

Start the server:
npm run dev

Server will run on http://localhost:5000

### 3. Frontend Setup

cd frontend
npm install

Start the frontend app:
npm run dev

App will run on http://localhost:3000

## 📋 API Reference

Notes API:
| Method | Route            | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/notes`     | Get all notes     |
| POST   | `/api/notes`     | Create a new note |
| PUT    | `/api/notes/:id` | Update a note     |
| DELETE | `/api/notes/:id` | Delete a note     |

Note Payload:
{
  "title": "Note Title",
  "content": "Note content here",
  "tags": ["tag1", "tag2"],
  "favorite": true
}

Bookmarks API:
| Method | Route                | Description           |
| ------ | -------------------- | --------------------- |
| GET    | `/api/bookmarks`     | Get all bookmarks     |
| POST   | `/api/bookmarks`     | Create a new bookmark |
| PUT    | `/api/bookmarks/:id` | Update a bookmark     |
| DELETE | `/api/bookmarks/:id` | Delete a bookmark     |

Bookmark Payload:
{
  "title": "Google",
  "url": "https://google.com",
  "description": "Search Engine",
  "tags": ["search", "tool"],
  "favorite": false
}

## 🗃️ Folder Structure
notes-bookmark-manager/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── app/
│   │   ├── notes/
│   │   ├── bookmarks/
│   │   └── page.jsx (optional landing)
│   └── tailwind.config.js

## 🧠 Skills Demonstrated

-REST API Design
-Express Routing & CRUD
-MongoDB + Mongoose Schema Modeling
-React (Next.js App Router)
-Tailwind CSS
-Clean code and structure






