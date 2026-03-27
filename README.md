# 📚 Assignment & Review Dashboard

A clean and responsive role-based dashboard for managing student assignments. Built using React and Tailwind CSS, this project simulates a real-world assignment submission system with authentication, role-based access, and per-user tracking.

---

## 🚀 Features

### 🔐 Authentication System

* Login with username, password, and role (Student/Admin)
* Role-based access control
* Persistent login using localStorage
* Logout functionality

---

### 👨‍🎓 Student

* View all assigned tasks
* Access submission links (Google Drive)
* Submit assignments with double confirmation modal
* Track **individual submission status**
* Submission stored per user using `submittedBy` array

---

### 👨‍🏫 Admin

* Create assignments with title and Drive link
* View all assignments
* Track **which students submitted each assignment**
* View submission list (`submittedBy`)
* Visual progress tracking using progress bars

---

## 🔁 Workflow

### 🔹 Authentication Flow

1. User logs in with username and role
2. User is stored in localStorage
3. Based on role:

   * Student → Student Dashboard
   * Admin → Admin Dashboard

---

### 🔹 Admin Flow

1. Admin creates assignment
2. Adds title and Drive link
3. Assignment is stored globally
4. Admin monitors submission status of students

---

### 🔹 Student Flow

1. Student views assignments
2. Opens submission link (Google Drive)
3. Clicks "Submit"
4. Confirms submission via modal
5. Username is added to `submittedBy`
6. Status updates instantly

---

### 🔹 Data Flow

* Centralized state management in `App.jsx`
* Shared across components via props
* Real-time updates between Admin & Student views
* Data persisted using localStorage

---

## 🧠 Concepts Used

### ⚛️ React Concepts

* `useState` → State management
* `useEffect` → Data persistence
* Lifting State Up → Shared data across roles
* Conditional Rendering → Role-based UI
* Component-based architecture

---

### 🎨 UI & Styling

* Tailwind CSS for responsive design
* Reusable components (Modal, Progress Bar)
* Clean and modern card-based UI

---

### 💾 Data Handling

* localStorage for persistence
* Simulated backend using JSON structure
* Per-user submission tracking using arrays

---

## 📁 Folder Structure

src/

* components/

  * ConfirmationModal.jsx
  * ProgressBar.jsx
* pages/

  * LoginPage.jsx
  * StudentDashboard.jsx
  * AdminDashboard.jsx
* App.jsx
* main.jsx

---

## ⚙️ Tech Stack

* React.js (Vite)
* Tailwind CSS
* JavaScript (ES6+)

---

## 🖥️ Setup Instructions

```bash
npm install
npm run dev
```

---

## 📱 Responsiveness

* Fully responsive design
* Optimized for both desktop and mobile devices

---

## 🔔 Additional Features

* Toast notifications for submission feedback
* Smooth UI transitions
* Real-time updates across roles
* Role-based conditional rendering

---

## 🎯 Design Decisions

* Centralized state for consistent data flow
* `submittedBy` array for tracking per-user submissions
* Confirmation modal to prevent accidental submission
* localStorage used to simulate backend persistence
* Role-based rendering for realistic workflow

---

## 📦 Deployment

* Deployed using Vercel
* Live demo link included in submission

---

## 🧪 Future Improvements

* Multi-user authentication system
* Backend integration (Node.js + MongoDB)
* Assignment deadlines & late submission tracking
* File upload instead of external links

---

## 🙌 Conclusion

This project demonstrates a scalable frontend architecture with real-world features like authentication, role-based access, and per-user tracking. It highlights strong fundamentals in React, state management, and UI/UX design while simulating real application workflows.
