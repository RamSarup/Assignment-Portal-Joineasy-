# Assignment-Portal-Joineasy-
Round task - 1 to create a website frontend for both Admin and student use.


# 📚 Assignment & Review Dashboard

A clean and responsive role-based dashboard for managing student assignments. Built using React and Tailwind CSS, this project simulates a real-world assignment submission system with admin and student workflows.

---

## 🚀 Features

### 👨‍🎓 Student

* View assigned tasks
* Access submission links (Google Drive)
* Submit assignments with double confirmation
* Track submission status (Submitted / Pending)

### 👨‍🏫 Admin

* Create assignments with title and Drive link
* View all assignments
* Track submission progress
* Visual progress bar for completion status

---

## 🔁 Workflow

### 🔹 Admin Flow

1. Admin creates a new assignment
2. Adds title and external Drive submission link
3. Assignment is stored in global state

### 🔹 Student Flow

1. Student views all assignments
2. Clicks “Open Submission Link” to submit externally
3. Returns and clicks “Submit”
4. Confirms submission via modal
5. Status updates instantly

### 🔹 Data Flow

* State is managed in the root (`App.jsx`)
* Shared across components via props
* Changes reflect instantly across roles

---

## 🧠 Concepts Used

### ⚛️ React Concepts

* `useState` → State management
* `useEffect` → Data persistence
* Lifting State Up → Shared data between Admin & Student
* Conditional Rendering → Role-based UI
* Component-based architecture

### 🎨 UI & Styling

* Tailwind CSS for responsive design
* Reusable components (Modal, Progress Bar)
* Clean card-based layout

### 💾 Data Handling

* localStorage for persistence
* JSON-based mock data (no backend)

---

## 📁 Folder Structure

src/

* components/

  * ConfirmationModal.jsx
  * ProgressBar.jsx
* pages/

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
* Works across desktop and mobile screens

---

## 🔔 Additional Features

* Toast notifications for submission feedback
* Smooth UI interactions
* Real-time updates across roles

---

## 🎯 Design Decisions

* Used centralized state for realistic data sharing
* Implemented confirmation modal to prevent accidental submission
* Used localStorage to simulate backend persistence

---

## 📦 Deployment

* Can be deployed using Vercel or Netlify

---

## 🧪 Future Improvements

* Multi-user support
* Authentication system
* Backend integration
* Assignment deadlines

---

## 🙌 Conclusion

This project demonstrates a scalable frontend architecture with real-world UI/UX patterns, focusing on clarity, responsiveness, and role-based functionality.
