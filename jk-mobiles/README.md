# 📱 JK Mobiles Training Institute — Full Stack Website

A complete full-stack website for JK Mobiles Training Institute with student enrollment, certificate portal, and admin dashboard.

---

## 🗂️ Project Structure

```
jk-mobiles/
├── backend/                    ← Node.js + Express API
│   ├── config/
│   │   └── db.js               ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js             ← JWT auth middleware
│   ├── models/
│   │   ├── Student.js          ← Student schema
│   │   └── Admin.js            ← Admin schema (bcrypt)
│   ├── routes/
│   │   ├── students.js         ← Student CRUD APIs
│   │   └── admin.js            ← Admin login & auth
│   ├── server.js               ← Express entry point
│   ├── package.json
│   ├── render.yaml             ← Render deployment config
│   └── .env.example            ← Environment variables template
│
└── frontend/                   ← Static HTML/CSS/JS
    ├── index.html              ← Home page
    ├── courses.html            ← Courses page
    ├── booking.html            ← Enrollment form
    ├── certificate.html        ← Certificate download
    ├── contact.html            ← Contact + Google Map
    ├── _redirects              ← Netlify routing
    ├── css/
    │   └── style.css           ← Global design system
    ├── js/
    │   ├── config.js           ← API base URL + helper
    │   └── layout.js           ← Shared navbar/footer
    └── admin/
        ├── login.html          ← Admin login (JWT)
        └── dashboard.html      ← Full admin panel
```

---

## 🚀 Deployment Guide

### Step 1 — MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Create a database user (username + password)
3. Add IP `0.0.0.0/0` to Network Access (allow all)
4. Get your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/jkmobiles?retryWrites=true&w=majority
   ```

---

### Step 2 — Backend on Render.com

1. Push the `/backend` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables in Render dashboard:

   | Key              | Value                        |
   |------------------|------------------------------|
   | `MONGODB_URI`    | your Atlas connection string  |
   | `JWT_SECRET`     | any long random string        |
   | `ADMIN_EMAIL`    | admin@jkmobiles.com           |
   | `ADMIN_PASSWORD` | Admin@123                     |
   | `PORT`           | 5000                          |

6. Deploy → copy your Render URL (e.g. `https://jk-mobiles-api.onrender.com`)

7. **Initialize Admin** — visit this URL once in browser:
   ```
   https://jk-mobiles-api.onrender.com/admin/setup
   ```

---

### Step 3 — Update Frontend API URL

In `frontend/js/config.js` and `frontend/admin/login.html` and `frontend/admin/dashboard.html`, find:
```javascript
const API_BASE = 'https://jk-mobiles-api.onrender.com';
```
Replace with your actual Render URL.

---

### Step 4 — Frontend on Netlify

1. Push the `/frontend` folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Set **Publish directory** to `/frontend` (or root if only frontend is in the repo)
4. Deploy → your site is live!

---

## 🔌 API Reference

### Public Endpoints (no auth)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/students/add` | `{name, phone, course, mode}` | Enroll a student |
| GET | `/students/certificate/:phone` | — | Get certificate data |
| POST | `/admin/login` | `{email, password}` | Admin login → returns JWT |
| POST | `/admin/setup` | — | Create admin (run once!) |

### Protected Endpoints (JWT required)

Add header: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/stats/overview` | Dashboard statistics |
| PUT | `/students/complete/:id` | Mark student as completed |
| GET | `/admin/me` | Verify token / get admin info |

---

## 🖥️ Pages Overview

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, features, course preview, CTA |
| Courses | `courses.html` | All 3 courses with comparison table |
| Book Now | `booking.html` | Enrollment form → POST /students/add |
| Certificate | `certificate.html` | Phone lookup + print-to-PDF certificate |
| Contact | `contact.html` | Phone numbers + Google Map |
| Admin Login | `admin/login.html` | JWT login |
| Admin Dashboard | `admin/dashboard.html` | Stats, student table, mark complete |

---

## 🔐 Admin Login

- **URL:** `https://your-site.netlify.app/admin/login.html`
- **Default Email:** `admin@jkmobiles.com`
- **Default Password:** `Admin@123`

> ⚠️ Change the password by updating `ADMIN_PASSWORD` in Render env vars and re-running `/admin/setup` (only works if no admin exists yet — delete the admin document in Atlas first to reset).

---

## 📞 Contact Numbers

- **Primary:** 7639730715
- **Secondary:** 6385595019
- **WhatsApp:** https://wa.me/917639730715

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JS |
| Fonts | Google Fonts (Rajdhani + Nunito) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Deployment | Render (backend) + Netlify (frontend) |

---

## ✅ Features Checklist

- [x] Responsive design (mobile + desktop)
- [x] Blue / White / Orange color theme
- [x] Home page with hero, features, course preview
- [x] Courses page with 3 courses + comparison table
- [x] Booking form with API integration
- [x] Certificate page (phone lookup + print PDF)
- [x] Contact page with Google Map
- [x] WhatsApp floating button
- [x] Shared navbar + footer via JS injection
- [x] Admin login with JWT
- [x] Admin dashboard — stats, student table
- [x] Mark student as completed
- [x] Certificate gated by completion status
- [x] Search & filter in student table
- [x] Course breakdown bar chart
- [x] Recent enrollments feed
- [x] Mobile-responsive admin panel
- [x] Toast notifications
- [x] Netlify + Render deployment configs

---

*Built for JK Mobiles Training Institute, Puducherry.*
