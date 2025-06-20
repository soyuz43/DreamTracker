# 🌙 DreamTracker

DreamTracker is a full-stack web application designed to help users capture, reflect on, and explore their dreams—privately or communally. By combining personal journaling features with light social integration, DreamTracker empowers users to find meaning in their subconscious experiences and connect with others through shared dream patterns.

---

## Why DreamTracker?

Most dream journaling apps focus solely on private reflection. DreamTracker goes further by:

- **Making dreams searchable** with tags, emotions, and categories
- **Allowing optional anonymous sharing** to foster connection without oversharing
- **Highlighting patterns** across a user’s dream history
- **Offering a calm, minimal interface** optimized for night-time or early-morning logging

> DreamTracker is built to support introspection and subtle community—without gamification or dopamine traps.

---

## 🔧 Tech Stack

### Frontend
- **React** (Vite)  
- **Tailwind CSS**  
- **React Router DOM**  
- **State managed with Hooks and basic prop drilling**

### Backend
- **ASP.NET Core Web API**  
- **Entity Framework Core**  
- **SQL Server**  
- **JWT-based authentication**  

### Tooling
- **Git & GitHub**  
- **Postman** for API testing  
- **Makefile**-based dev workflow  
- **VS Code** + Tailwind IntelliSense  

---

## 🚀 Features

### ✅ MVP
- User registration & login
- Create, read, update, delete (CRUD) dreams
- Tagging system for themes/emotions
- Personal profile view with dream stats
- Secure API with protected endpoints
- My Dreams vs All Dreams view
- Edit dreams via modal interface

### 🔜 Planned
- Dream pattern recognition
- Commenting on shared dreams (anonymous)
- Calendar view for dream frequency
- Light/dark dream mode toggle

---

## 🗂 Project Structure

```

DreamTracker/
├── DreamTrackerAPI/         # .NET Core Web API backend
│   ├── Controllers/         # Auth, Dream, Category, Tag
│   ├── Models/              # EF Core entities & DTOs
│   └── Migrations/          # EF Core schema history
│
└── DreamTracker-Client/     # React frontend
├── components/
│   ├── auth/            # Login/Register
│   ├── dream/           # AllDreams, DreamCard, MyDreams, etc.
│   └── profile/         # Profile.jsx
└── managers/            # Fetch wrappers (auth, dream, tag, etc.)

```

---

## 🧪 How to Run

### 1. Clone the repo
```bash
git clone https://github.com/soyuz43/DreamTracker.git
cd DreamTracker
```

### 2. Set up the backend

```bash
cd DreamTrackerAPI
dotnet ef database update
dotnet run
```

### 3. Set up the frontend

```bash
cd DreamTracker-Client
npm install
npm run dev
```

The frontend should now be running on `http://localhost:5173` and the API on `https://localhost:5001`.

---

## 👤 About the Developer

DreamTracker is a capstone project by William Stetar, built to explore the intersection of introspection, mental health, and digital design. It reflects a deep interest in how technology can serve—not distract—its users.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, fork, or contribute.

---

> *“A dream that is not understood remains a mere occurrence; a dream understood is a part of life.”*
> — Carl Jung



