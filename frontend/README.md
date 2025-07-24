# 🧑‍💼 JobBoard – Full-Stack Job Platform

![JobBoard Banner](./docs/banner.png) <!-- Add a banner image if available -->

A modern, full-stack job platform that connects employers and job seekers.  
Built with **React + TypeScript + Tailwind CSS + ShadCN UI** for the frontend, and **Express + PostgreSQL + Prisma** for the backend.  
This project demonstrates **real-world architecture**, including authentication (JWT & Google OAuth), job listings, bookmarks, and dashboards.

---

## 🚀 Live Demo
[**🌐 View JobBoard Online**](https://your-live-demo-link.com)

---

## ✨ Features

### **For Job Seekers**
- Browse job listings with advanced filters & search.
- View detailed job descriptions.
- Bookmark jobs for later.
- Apply to jobs with a single click.

### **For Employers**
- Post, edit, and manage job listings.
- Track applications through the employer dashboard.

### **Authentication**
- Secure login/registration with **JWT**.
- **Google OAuth** integration for social login.

### **Other Features**
- Responsive design (mobile-friendly).
- Optimized performance with **React Query**.
- Dark mode with **Tailwind + CSS Variables**.
- Fully tested with **Jest + Supertest**.

---

## 🛠️ Tech Stack

### **Frontend**
- [React](https://reactjs.org/) (TypeScript, Vite)
- [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- [React Query](https://react-query.tanstack.com/)
- [React Router](https://reactrouter.com/)

### **Backend**
- [Express.js](https://expressjs.com/) (TypeScript)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT](https://jwt.io/) + [Passport.js](http://www.passportjs.org/) for authentication
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)

### **Testing**
- Jest + Supertest

### **Deployment**
- Frontend: **Vercel/Netlify**
- Backend: **Heroku**
- Database: **Neon/PostgreSQL**

---

## 📂 Project Structure
JobBoard/
├── client/ # Frontend (React + Vite + TS)
│ ├── src/
│ │ ├── components/ # Shared UI components
│ │ ├── hooks/ # Custom hooks
│ │ ├── pages/ # Pages (Home, Jobs, Profile)
│ │ ├── services/ # API services
│ │ └── ...
│ └── ...
├── server/ # Backend (Express + TS)
│ ├── controllers/ # Route controllers
│ ├── routes/ # API endpoints
│ ├── services/ # Business logic
│ ├── prisma/ # Prisma schema and migrations
│ └── ...
└── docs/ # Documentation & assets
