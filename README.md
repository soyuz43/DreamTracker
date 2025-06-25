# 🌙 DreamTracker

DreamTracker is a full-stack web application designed to help users capture, reflect on, and explore their dreams—privately or communally. By combining personal journaling features with light social integration, DreamTracker empowers users to find meaning in their subconscious experiences and connect with others through shared dream patterns.

---

## Why DreamTracker?

Most dream journaling apps focus solely on private reflection. DreamTracker goes further by:

- **Making dreams searchable** with tags, emotions, and categories
- **Allowing optional anonymous sharing** to foster connection without oversharing
- **Highlighting patterns** across a user’s dream history
- **Offering a calm, minimal interface** optimized for night-time or early-morning logging
- **Includes an AI-powered “Rewrite” tool** that helps structure dreams written as raw notes or fragmented memories

> DreamTracker is built to support introspection and subtle community—without gamification or dopamine traps.

---

## 🔧 Tech Stack

### Frontend
- **React** (Vite)  
- **Tailwind CSS**  
- **React Router DOM**  
- **TanStack Query** (formerly React Query) for data fetching, caching & synchronization — see [GitHub](https://github.com/TanStack/query)  
- **React Query DevTools** for debugging (enabled in development only)  

### Backend
- **ASP.NET Core Web API**  
- **Entity Framework Core**  
- **SQL Server**  
- **Cookie-based authentication using ASP.NET Identity**

### Tooling
- **Git & GitHub**  
- **Postman** for API testing  
- **Makefile**-based dev workflow  
- **VS Code** + Tailwind IntelliSense  

### AI Integration
- **Ollama** — Local LLM runtime used to structure unformatted dream notes into narrative form via frontend integration

---


## 🚀 Features

### MVP
- User registration & login
- Create, read, update, delete (CRUD) dreams
- Tagging system for themes/emotions
- Personal profile view with dream stats
- Secure API with protected endpoints
- My Dreams vs All Dreams view
- Edit dreams via modal interface
- Light/dark dream mode toggle
- Optional AI rewrite for unstructured dreams using local Ollama LLM
> ⚠️ Requires [Ollama](https://ollama.com) to be installed and running locally.

### 🔜 Planned
- Dream pattern recognition
- Emotional Timeline 
- Calendar view for dream frequency

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


## How to Run

### 🔧 Prerequisites

* **.NET 8.0 SDK**  
  Make sure you have the .NET 8 SDK installed. You can check by running:

  ```bash
  dotnet --version
  ```
> If the output doesn’t start with `8.`, download it from [dotnet.microsoft.com](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

* **Before running the backend for the first time, make sure you have the Entity Framework Core CLI tools installed globally**:

    ```bash
    dotnet tool install --global dotnet-ef
    ```
>📝 You only need to do this once. It enables commands like dotnet ef database update.


## 1. Clone the repo
```bash
git clone https://github.com/soyuz43/DreamTracker.git
cd DreamTracker
```

### 🔐 Configure Local Secrets (Admin credentials, etc.)

Before running the backend, add your required secrets using the .NET Secret Manager. From inside the `DreamTrackerAPI` directory:

```bash
dotnet user-secrets init
dotnet user-secrets set "AdminUser:Password" "your_secure_password"
dotnet user-secrets set "DefaultUser:Password" "your_user_password"
```

> 📝 These credentials will be used to seed admin and default user accounts on app startup. 
> 🛠️ The dotnet user-secrets tool comes preinstalled with the .NET SDK — no separate install needed.

## 2. Recommended: Use `make` to run both backend and frontend

The `Makefile` automates backend and frontend startup with proper sequencing.

```bash
make serve
```

This will:

* Launch the backend using the `https` launch profile (`dotnet watch run --launch-profile https`)
* Wait a few seconds to allow the backend to initialize
* Launch the frontend dev server (`npm run dev`)

The frontend should now be running on `http://localhost:5173` and the API on `https://localhost:5001`.

> 📝 You can also run backend and frontend separately if needed (see below).

---

## 3. Manual Setup (optional)

#### Backend

```bash
cd DreamTrackerAPI
dotnet ef database update
dotnet run --launch-profile https
```

> ⚠️ Note: Using `--launch-profile https` ensures Swagger UI and HTTPS endpoints are available. Without this flag, the app may only serve on `http://localhost:5000`.

#### Frontend

```bash
cd DreamTracker-Client
npm install
npm run dev
```

---

## 4. Optional: Reset Database and Recreate Migrations

```bash
make migrations
```

This command will:

* Delete existing EF Core migrations
* Drop the PostgreSQL `DreamTracker` database (requires `psql` CLI access)
* Recreate migrations and apply them via `dotnet ef database update`

> ⚠️ **Note:** You must reconfigure your database connection string using the .NET User Secrets system before rerunning migrations:

```bash
dotnet user-secrets set "ConnectionStrings:DreamTrackerDb" "Host=localhost;Port=5432;Username=postgres;Password=your_password;Database=DreamTracker"
```




---

## 👤 About the Developer

DreamTracker is a capstone project by William Stetar, built to explore the intersection of introspection, mental health, and digital design. It reflects a deep interest in how technology can serve—not distract—its users.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, fork, or contribute.

---

> *“A dream that is not understood remains a mere occurrence; a dream understood is a part of life.”*
> — Carl Jung



