# 📚 Assignment & Review Dashboard

A clean and responsive **role-based dashboard** for managing student assignments, course enrolment, and group submissions. Built using React and Tailwind CSS, this project simulates a real-world academic assignment system with authentication, role-based access, course management, group logic, and per-user tracking — all persisted via localStorage.

---

## 🚀 Features

### 🔐 Authentication System

* Login with username, password, and role (Student / Professor)
* Inline form validation (username ≥ 3 chars, password ≥ 4 chars)
* Role-based redirect on login
* Persistent session using localStorage
* Loading spinner with simulated JWT-style auth flow
* Logout functionality

---

### 👨‍🏫 Professor

* **Create courses** with name, code, semester, and description
* Colour-coded course cards showing enrolled student count and submission stats
* **Delete courses** (removes all associated assignments automatically)
* Create, edit, and delete **assignments** per course
* Assignment fields: Title, Description, Deadline (date + time), OneDrive/Drive link, Submission Type (Individual / Group)
* View **which students acknowledged** each assignment with timestamp
* **Search** assignments by title or description
* **Filter** assignments by submission status (All / Has Submissions / No Submissions)
* Visual **progress bar** analytics per course

---

### 👨‍🎓 Student

* **Browse All Courses** tab — discover every course created by any professor
  * See course name, code, semester, professor name, enrolment count
  * Enroll in any course with one click
  * Already-enrolled courses shown greyed out with ✅ badge
* **My Courses** tab — view only enrolled courses
  * Colour-coded course cards with per-course progress bar
  * Open assignments from within a course
  * Unenroll from a course at any time
* Per-assignment display: title, description, deadline badge (closes red past deadline), submission type pill
* **Individual submission** — student acknowledges directly with timestamp stored
* **Group submission logic:**
  * If not in a group → prompted to create or join one
  * Create a named group → automatically becomes Group Leader (👑)
  * Join any existing group for that course
  * Only the **Group Leader** can acknowledge submission
  * When leader acknowledges → all group members are marked submitted
  * Non-leaders see "Waiting for leader to acknowledge" message
* Acknowledgment timestamp displayed on each submitted assignment
* Toast notifications for all actions

---

## 🔁 Workflow

### 🔹 Authentication Flow

1. User enters username, password, and selects role
2. Form validated client-side before proceeding
3. User object stored in localStorage
4. Redirected based on role:
   * Student → Course Browser / My Courses
   * Professor → Course Management Dashboard

---

### 🔹 Professor Flow

1. Professor creates a course (name, code, semester, description)
2. Course is immediately visible to all students in Browse All
3. Professor opens the course → adds assignments with full details
4. Monitors per-assignment acknowledgement list with timestamps
5. Can edit or delete assignments; delete a course removes all its assignments

---

### 🔹 Student Flow

1. Student browses available courses and enrolls
2. Opens an enrolled course to view its assignments
3. For **Individual** assignments: clicks Acknowledge → confirms via modal → timestamped
4. For **Group** assignments:
   * Creates or joins a group for that course
   * Group Leader acknowledges on behalf of all members
5. Progress bar updates in real time

---

### 🔹 Data Flow

* Centralized state in `App.jsx` — `courses`, `assignments`, `groups`
* Shared across components via props
* All state changes reflected immediately across roles
* Everything persisted to localStorage via `useEffect`

---

## 🧠 Concepts Used

### ⚛️ React Concepts

* `useState` → State management across views and forms
* `useEffect` → localStorage persistence on every state change
* Lifting State Up → shared `courses`, `assignments`, `groups` across roles
* Conditional Rendering → role-based and view-based UI switching
* Component-based architecture with reusable components

---

### 🎨 UI & Styling

* Tailwind CSS for fully responsive design
* Colour-coded course cards (6-colour cycling palette)
* Tab-based navigation (My Courses / Browse All)
* Dynamic ProgressBar — colour changes by completion (red / amber / green)
* Toast notifications via `react-hot-toast`
* Form validation with inline error messages
* Loading spinner on login

---

### 💾 Data Handling

* localStorage for full persistence across sessions
* Structured JSON state for courses, assignments, groups
* Per-user submission tracking with username + ISO timestamp
* Group-based submission tracking via leader acknowledgement

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── ConfirmationModal.jsx
│   └── ProgressBar.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── StudentDashboard.jsx
│   └── AdminDashboard.jsx
├── App.jsx
└── main.jsx
```

---

## ⚙️ Tech Stack

* React.js (Vite)
* Tailwind CSS
* JavaScript (ES6+)
* react-hot-toast

---

## 🖥️ Setup Instructions

### ✅ Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v18+ | `node -v` |
| npm | v9+ | `npm -v` |
| Git | any | `git --version` |

> Download Node.js from [https://nodejs.org](https://nodejs.org) if not installed. npm comes bundled with it.

---

### 📥 Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 📦 Step 2 — Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including:

- `react` + `react-dom`
- `react-hot-toast`
- `tailwindcss` + `autoprefixer` + `postcss`
- `vite` + `@vitejs/plugin-react`

---

### 🏗️ Step 3 — Verify Project Structure

Your `src/` folder should look like this:

```
src/
├── components/
│   ├── ConfirmationModal.jsx
│   └── ProgressBar.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── StudentDashboard.jsx
│   └── AdminDashboard.jsx
├── App.jsx
├── main.jsx
└── index.css
```

Also confirm these config files exist at the root:

```
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

### ▶️ Step 4 — Start the Development Server

```bash
npm run dev
```

Vite will start a local dev server. Open your browser and visit:

```
http://localhost:5173
```

The app supports **Hot Module Replacement (HMR)** — changes reflect instantly without a full reload.

---

### 🧪 Step 5 — Test the App

Use the following demo credentials to explore both roles:

**Professor account**
```
Username : proftest      (any name ≥ 3 chars)
Password : pass123       (any password ≥ 4 chars)
Role     : Professor
```

**Student account**
```
Username : student1      (any name ≥ 3 chars)
Password : pass123       (any password ≥ 4 chars)
Role     : Student
```

> No real authentication is needed — any valid username/password combination works for demo purposes.

**Recommended test flow:**
1. Log in as **Professor** → create a course → add assignments
2. Log out → log in as **Student** → browse and enroll in the course
3. Open assignments → acknowledge submissions
4. Log out → log back in as **Professor** → verify student appears in the submission list

---

### 🏭 Step 6 — Build for Production

```bash
npm run build
```

This outputs an optimized static build to the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

---

### 🚀 Step 7 — Deploy to Vercel (Optional)

**Option A — Vercel CLI**

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite and configures everything.

**Option B — Vercel Dashboard**

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Set the following build settings if not auto-detected:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

5. Click **Deploy** — done!

---

### 🔄 Resetting App Data

All data (courses, assignments, groups, users) is stored in your browser's localStorage. To reset everything:

**Option A — Browser DevTools**
```
F12 → Application → Local Storage → select your localhost → Clear All
```

**Option B — Browser Console**
```javascript
localStorage.clear();
location.reload();
```

---

### 🛠️ Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `npm install` fails | Node version too old | Upgrade to Node v18+ |
| Port 5173 already in use | Another Vite app running | Run `npm run dev -- --port 3000` |
| Styles not applying | Tailwind not picking up files | Check `tailwind.config.js` content paths |
| Blank screen after login | localStorage corrupted | Clear localStorage and reload |
| `react-hot-toast` missing | Dependency not installed | Run `npm install react-hot-toast` |

---

## 📱 Responsiveness

* Fully responsive design
* 2-column course card grid on desktop, single column on mobile
* Optimized for both desktop and mobile devices

---

## 🔔 Additional Features

* Toast notifications for all user actions (enrol, submit, create, delete)
* Smooth UI transitions and hover states
* Real-time updates across roles via shared state
* Role-based conditional rendering throughout

---

## 🎯 Design Decisions

* **Course-first architecture** — assignments live inside courses, mirroring real academic structure
* **Global course visibility** — any professor's course is discoverable by all students
* **Opt-in enrolment** — students choose which courses to join; professors don't manage rosters
* **Group leader model** — single acknowledgement point prevents duplicate submissions for group work
* `submittedBy` stores `{ username, timestamp }` objects for rich audit trail
* Colour palette cycles consistently so the same course always renders in the same colour
* Confirmation modal prevents accidental acknowledgement
* localStorage simulates a backend with zero setup

---

## 📦 Deployment

* Deployable via Vercel or Netlify
* No environment variables or backend required — fully client-side

---

## 🧪 Future Improvements

* Real backend integration (Node.js + MongoDB / Supabase)
* JWT-based multi-user authentication
* File upload instead of external submission links
* Late submission tracking and penalty flags
* Professor ability to manage group formation
* Email/notification system for deadline reminders
* Student analytics dashboard across all enrolled courses

---

## 🙌 Conclusion

This project demonstrates a scalable frontend architecture with real-world academic workflows — course creation, student enrolment, individual and group-based assignment submission, and role-specific dashboards. It highlights strong fundamentals in React, component design, state management, and UX thinking while simulating a complete end-to-end application without a backend.
