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
> ⚠️ Requires [Ollama](https://ollama.com) to be installed and running locally with a non-embedding model pulled.

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



## How to Run DreamTracker

This project includes both a .NET backend and a Vite/React frontend. The fastest way to run both is with `make serve`, which handles everything for you.

---

### 🔧 Prerequisites

Before you begin, ensure the following are installed:

* **.NET 8.0 SDK**
  Verify with:

  ```bash
  dotnet --version
  ```

  The output should start with `8.` — if not, [download it here](https://dotnet.microsoft.com/en-us/download/dotnet/8.0).

* **PostgreSQL**
  Ensure `psql` is available from the command line.

* **EF Core CLI (`dotnet-ef`)**

  > ℹ️ You do **not** need to install this manually — the `Makefile` will install it automatically if it's missing.

* **User Secrets (Required)**
  The application expects a PostgreSQL connection string stored in user secrets under the key `DreamTrackerDbConnectionString`.
  Set it using:

  ```bash
  dotnet user-secrets init
  dotnet user-secrets set "DreamTrackerDbConnectionString" "Host=localhost;Port=5432;Username=postgres;Password=yourpassword;Database=DreamTracker"
  ```

* **[Ollama](https://ollama.com/)** (Optional)
  Required for the **"Rewrite with AI"** feature during dream creation. You must have Ollama installed and at least one non-embedding model pulled.

> 🚀 The application automatically uses the most recently pulled usable model.


### 1️⃣ Clone the Repo

```bash
git clone https://github.com/soyuz43/DreamTracker.git
cd DreamTracker
```

---

### 2️⃣ (Optional) Configure Admin & User Passwords

You can set local passwords for the seeded admin and user accounts using the .NET Secret Manager:

```bash
cd DreamTrackerAPI
dotnet user-secrets init
dotnet user-secrets set "AdminUser:Password" "<your_admin_password>"
dotnet user-secrets set "DefaultUser:Password" "<your_user_password>"
```

These credentials will be injected at runtime when the app seeds the database.

**Default users created on startup:**

| Role  | Email                                             | Password (if unset)    |
| ----- | ------------------------------------------------- | ---------------------- |
| Admin | [admina@strator.comx](mailto:admina@strator.comx) | `DefaultAdminPassword` |
| User  | [lucy@dream.com](mailto:lucy@dream.com)           | `DefaultUserPassword`  |

> `.NET user-secrets` comes with the SDK — no install required.

---

### 3️⃣ Easiest Way to Run: `make serve`

```bash
make serve
```

This command will:

* Check for and install backend dependencies (`dotnet ef`)
* Ensure `dotnet-ef` is installed globally
* Check for and install frontend dependencies (`npm install`)
* Launch the backend with HTTPS (`dotnet watch run`)
* Wait eight seconds
* Start the frontend dev server


Once it’s ready:

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [https://localhost:5001](https://localhost:5001)

> You can run the backend and frontend separately if you prefer — see below.

---

### 4️⃣ Manual Setup (Optional)

#### 🖥️ Backend

```bash
cd DreamTrackerAPI
dotnet ef database update
dotnet run --launch-profile https
```

> Launching with `--launch-profile https` ensures Swagger UI and HTTPS endpoints work correctly.

#### 🌐 Frontend

```bash
cd DreamTracker-Client
npm install
npm run dev
```

---

### 5️⃣ Resetting the Database (Destructive)

If you want to delete all migrations and recreate the database:

```bash
make migrations
```

This command will:

* Remove EF Core migration files
* Drop the PostgreSQL `DreamTracker` database
* Recreate the schema from scratch

Before doing this, make sure your connection string is configured via user-secrets:

```bash
dotnet user-secrets set "ConnectionStrings:DreamTrackerDb" "Host=localhost;Port=5432;Username=postgres;Password=your_password;Database=DreamTracker"
```

> ⚠️ Only use this if you're resetting your dev environment. It **deletes everything**.



---

## 👤 About the Developer

DreamTracker is a capstone project by William Stetar, built to explore the intersection of introspection, mental health, and digital design. It reflects a deep interest in how technology can serve—not distract—its users.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, fork, or contribute.

---

> *“A dream that is not understood remains a mere occurrence; a dream understood is a part of life.”*
> — Carl Jung



