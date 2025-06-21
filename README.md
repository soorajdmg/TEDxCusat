# 🎤 TEDxCUSAT 2025 - Recruitment Task Submission  
**Full-Stack Web Application (Frontend + Backend)**  
This is my submission for the TEDxCUSAT 2025 Tech Team recruitment, showcasing a full-stack web application built from scratch - designed, developed, and deployed by me.

## 📌 Hosted Links

- 🔗 **Frontend (Landing Page)**: https://tedxcusat-sooraj.onrender.com/
- 🔗 **Backend API**: https://tedxcusat-backend.onrender.com

### Demo Admin Account

To explore the **admin-specific features**, you can log in using the following credentials:

> **Email:** `admin@tedxcusat.com`  
> **Password:** `Admin@123`


## 📖 Introduction

This full-stack website was developed as part of the **Tech Team Recruitment Task** for TEDxCUSAT 2025. I applied for both **Frontend** and **Backend Developer** roles and completed the required tasks individually.

This is an original, custom-built solution crafted entirely from scratch to match the recruitment task criteria.

## 🧰 Tech Stack

**Frontend:** React.js, CSS3  
**Backend:** Node.js, Express.js, MongoDB, JWT, bcrypt, Google OAuth  
**Deployment:** Render (Frontend & Backend)

## 🧠 What I Built

I built a **full-stack TEDx landing platform** that not only meets the recruitment task requirements, but goes beyond by offering:

- A **fully custom-designed React frontend** using handmade CSS, built mobile-first and added subtle and smooth animations.
- A backend API with **robust authentication** (email/password + Google OAuth), JWT-based auth flows, role-based access, and secure password storage.
- A **working admin system**, with a separate login account and protected API routes.
- Creative sections like a countdown timer and video background to enhance UX and reflect the TEDx brand vibe.
- Hosted and tested on live URLs — ready to scale or demo anytime.


## 🚀 Frontend Task – React Landing Page

### Requirements Met:
- ✔ Built with **React.js**
- ✔ **Hero Section** with event title & theme
- ✔ **Speaker Section** using animated card slider
- ✔ Followed official **TEDx brand color palette**
- ✔ Fully **responsive design** across all devices

### Bonus Features Added:
- Countdown Timer to the event  
- Registration Section  
- Dynamic background video  
- **Deployed on Render**

---

## 🔐 Backend Task – Auth API with Node.js

### Requirements Met:
- ✔ Built using **Node.js + Express**
- ✔ **User signup/login** with validation
- ✔ **Secure password hashing** using bcrypt
- ✔ **JWT-based** authentication system
- ✔ **Google Sign-In** using OAuth2

### Bonus Features Added:
- **Role-based access control** (`admin` / `user`)  
- Token **refresh logic**  
- **Hosted on Render**  


## 🛠️ Setup Instructions

### 🔧 Frontend (React)

```bash
git clone https://github.com/soorajdmg/TEDxCusat
cd tedxcusat/client
npm install
npm run dev
```

### 🔐 Backend (Express)

```bash
git clone https://github.com/soorajdmg/TEDxCusat
cd tedxcusat/server
npm install
npm run dev

```

Ensure to configure  `.env` with your environment variables:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📸 Preview

| Hero Section | Speaker Slider | Countdown Timer | ADMIN Login |
|--------------|----------------|-----------------|--------------|
| ![tedxcusat-hero](https://github.com/user-attachments/assets/7785738a-cee7-4bce-8e16-da796c05898f)| ![tedxcusat-speakers](https://github.com/user-attachments/assets/2db9ea79-7c1b-4d0e-8d6a-ddc1073437c0) | ![tedxcusat-countdown](https://github.com/user-attachments/assets/2a82769e-11f4-4dba-8715-db1edb4d5d72) | ![tedxcusat-admin](https://github.com/user-attachments/assets/7d459107-c1f3-4504-968d-6830e80b20ae) |



## 🎮 Usage

### Frontend Experience

- Hero Section: Experience the upcoming event
- Speaker Discovery: Browse through speaker profiles with smooth animations
- Event Countdown: Watch the live countdown to TEDxCUSAT 2025
- Responsive Design: Enjoy seamless experience across all devices

### Backend API Endpoints

- POST /api/auth/signup - User registration with email validation
- POST /api/auth/login - User login with JWT token generation
- POST /api/auth/google - Google OAuth authentication
- GET /api/auth/profile - Get user profile (protected route)
- POST /api/auth/refresh - Refresh JWT token
- GET /api/admin/users - Admin-only user management

## 🤝 Contributing

Here’s how to contribute efficiently:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request and help improve Clara!

## 📬 Contact

Developer: Applying for TEDxCUSAT Tech Team - Frontend & Backend Developer Positions

- **Email:** [soorajmurugaraj@gmail.com](mailto:soorajmurugaraj@gmail.com)
- **GitHub:** [soorajdmg](https://github.com/soorajdmg)

---

⭐️ ⭐️ If this project showcases the skills you're looking for in a full-stack developer, give it a star!
