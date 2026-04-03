import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import toast from "react-hot-toast";

const emptyCourseForm = { name: "", code: "", semester: "", description: "" };
const emptyAssignmentForm = {
  title: "", description: "", deadline: "", link: "", submissionType: "individual",
};

// Soft colour palette for course cards — cycles through based on index
const CARD_COLORS = [
  { border: "border-blue-500",   badge: "bg-blue-100 text-blue-700",   title: "text-blue-700",   btn: "bg-blue-500 hover:bg-blue-600" },
  { border: "border-emerald-500",badge: "bg-emerald-100 text-emerald-700", title: "text-emerald-700", btn: "bg-emerald-500 hover:bg-emerald-600" },
  { border: "border-violet-500", badge: "bg-violet-100 text-violet-700",title: "text-violet-700", btn: "bg-violet-500 hover:bg-violet-600" },
  { border: "border-amber-500",  badge: "bg-amber-100 text-amber-700",  title: "text-amber-700",  btn: "bg-amber-500 hover:bg-amber-600" },
  { border: "border-rose-500",   badge: "bg-rose-100 text-rose-700",    title: "text-rose-700",   btn: "bg-rose-500 hover:bg-rose-600" },
  { border: "border-cyan-500",   badge: "bg-cyan-100 text-cyan-700",    title: "text-cyan-700",   btn: "bg-cyan-500 hover:bg-cyan-600" },
];

function AdminDashboard({ assignments, setAssignments, courses, setCourses, user }) {
  // ── View state ──────────────────────────────────────────────────
  const [view, setView] = useState("courses"); // "courses" | "assignments"
  const [selectedCourse, setSelectedCourse] = useState(null);

  // ── Course form ──────────────────────────────────────────────────
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseFormErrors, setCourseFormErrors] = useState({});

  // ── Assignment form ──────────────────────────────────────────────
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignForm, setAssignForm] = useState(emptyAssignmentForm);
  const [assignFormErrors, setAssignFormErrors] = useState({});
  const [editingAssignId, setEditingAssignId] = useState(null);

  // ── Search / filter ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Courses created by this professor
  const profCourses = courses.filter((c) => c.professorId === user.username);

  // Assignments for the selected course
  const courseAssignments = selectedCourse
    ? assignments.filter((a) => a.courseId === selectedCourse.id)
    : [];

  const filteredAssignments = courseAssignments.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "submitted") return matchSearch && a.submittedBy?.length > 0;
    if (filterStatus === "pending")   return matchSearch && (!a.submittedBy || a.submittedBy.length === 0);
    return matchSearch;
  });

  // ── Course CRUD ──────────────────────────────────────────────────
  const validateCourseForm = () => {
    const errs = {};
    if (!courseForm.name.trim())     errs.name     = "Course name is required";
    if (!courseForm.code.trim())     errs.code     = "Course code is required";
    if (!courseForm.semester.trim()) errs.semester = "Semester is required";
    return errs;
  };

  const handleCreateCourse = () => {
    const errs = validateCourseForm();
    if (Object.keys(errs).length) { setCourseFormErrors(errs); return; }

    const newCourse = {
      id: Date.now(),
      name: courseForm.name.trim(),
      code: courseForm.code.trim().toUpperCase(),
      semester: courseForm.semester.trim(),
      description: courseForm.description.trim(),
      professorId: user.username,
      enrolledStudents: [],
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    setCourseForm(emptyCourseForm);
    setCourseFormErrors({});
    setShowCourseForm(false);
    toast.success(`Course "${newCourse.name}" created!`);
  };

  const handleDeleteCourse = (courseId) => {
    if (!window.confirm("Delete this course and all its assignments?")) return;
    setCourses(courses.filter((c) => c.id !== courseId));
    setAssignments(assignments.filter((a) => a.courseId !== courseId));
    toast.success("Course deleted");
  };

  // ── Assignment CRUD ──────────────────────────────────────────────
  const validateAssignForm = () => {
    const errs = {};
    if (!assignForm.title.trim())    errs.title    = "Title is required";
    if (!assignForm.link.trim())     errs.link     = "Submission link is required";
    if (!assignForm.deadline)        errs.deadline = "Deadline is required";
    return errs;
  };

  const handleSaveAssignment = () => {
    const errs = validateAssignForm();
    if (Object.keys(errs).length) { setAssignFormErrors(errs); return; }

    if (editingAssignId) {
      setAssignments(assignments.map((a) =>
        a.id === editingAssignId ? { ...a, ...assignForm } : a
      ));
      toast.success("Assignment updated!");
      setEditingAssignId(null);
    } else {
      setAssignments([...assignments, {
        id: Date.now(),
        courseId: selectedCourse.id,
        submittedBy: [],
        ...assignForm,
      }]);
      toast.success("Assignment added!");
    }
    setAssignForm(emptyAssignmentForm);
    setAssignFormErrors({});
    setShowAssignForm(false);
  };

  const handleEditAssignment = (a) => {
    setEditingAssignId(a.id);
    setAssignForm({
      title: a.title, description: a.description || "",
      deadline: a.deadline || "", link: a.link,
      submissionType: a.submissionType || "individual",
    });
    setAssignFormErrors({});
    setShowAssignForm(true);
  };

  const handleDeleteAssignment = (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    setAssignments(assignments.filter((a) => a.id !== id));
    toast.success("Assignment deleted!");
  };

  const cancelAssignForm = () => {
    setAssignForm(emptyAssignmentForm);
    setAssignFormErrors({});
    setEditingAssignId(null);
    setShowAssignForm(false);
  };

  const updateAssignField = (k, v) => {
    setAssignForm((p) => ({ ...p, [k]: v }));
    setAssignFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  // ── COURSE LIST VIEW ─────────────────────────────────────────────
  if (view === "courses") {
    return (
      <div>
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
            <p className="text-gray-500 text-sm mt-0.5">Create and manage courses you teach</p>
          </div>
          <button
            onClick={() => { setShowCourseForm((v) => !v); setCourseFormErrors({}); }}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            {showCourseForm ? "✕ Cancel" : "+ Create Course"}
          </button>
        </div>

        {/* ── Course creation form ── */}
        {showCourseForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-t-4 border-green-400">
            <h3 className="font-semibold text-gray-700 mb-4 text-base">📖 New Course Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Course Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Course Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Database Management Systems"
                  value={courseForm.name}
                  onChange={(e) => { setCourseForm({ ...courseForm, name: e.target.value }); setCourseFormErrors({}); }}
                  className={`w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${courseFormErrors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-400"}`}
                />
                {courseFormErrors.name && <p className="text-red-500 text-xs mt-1">⚠️ {courseFormErrors.name}</p>}
              </div>

              {/* Code */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Course Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS301"
                  value={courseForm.code}
                  onChange={(e) => { setCourseForm({ ...courseForm, code: e.target.value }); setCourseFormErrors({}); }}
                  className={`w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${courseFormErrors.code ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-400"}`}
                />
                {courseFormErrors.code && <p className="text-red-500 text-xs mt-1">⚠️ {courseFormErrors.code}</p>}
              </div>

              {/* Semester */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Semester <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Even 2026"
                  value={courseForm.semester}
                  onChange={(e) => { setCourseForm({ ...courseForm, semester: e.target.value }); setCourseFormErrors({}); }}
                  className={`w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${courseFormErrors.semester ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-400"}`}
                />
                {courseFormErrors.semester && <p className="text-red-500 text-xs mt-1">⚠️ {courseFormErrors.semester}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Description (optional)</label>
                <textarea
                  placeholder="Brief description of this course..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Submit */}
              <div className="sm:col-span-2">
                <button
                  onClick={handleCreateCourse}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Course cards ── */}
        {profCourses.length === 0 && !showCourseForm && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🎓</p>
            <p className="text-lg font-medium text-gray-500">No courses yet</p>
            <p className="text-sm mt-1">Click <strong>+ Create Course</strong> to get started</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profCourses.map((course, idx) => {
            const color = CARD_COLORS[idx % CARD_COLORS.length];
            const courseAssns = assignments.filter((a) => a.courseId === course.id);
            const totalSubs = courseAssns.reduce((s, a) => s + (a.submittedBy?.length || 0), 0);

            return (
              <div
                key={course.id}
                className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${color.border} flex flex-col gap-3`}
              >
                {/* Top row */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base leading-snug ${color.title}`}>{course.name}</h3>
                    {course.description && (
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{course.description}</p>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${color.badge}`}>
                    {course.code}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">🗓️ {course.semester}</span>
                  <span className="flex items-center gap-1">👨‍🏫 Prof. {course.professorId}</span>
                  <span className="flex items-center gap-1">👥 {course.enrolledStudents.length} enrolled</span>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <span>📋 {courseAssns.length} assignments</span>
                  <span>📝 {totalSubs} submissions</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedCourse(course); setView("assignments"); }}
                    className={`flex-1 text-white text-sm py-2 rounded-lg font-medium transition-colors ${color.btn}`}
                  >
                    Manage Assignments →
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-red-100 hover:bg-red-500 hover:text-white text-red-500 px-3 py-2 rounded-lg text-sm transition-colors"
                    title="Delete course"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── ASSIGNMENT MANAGEMENT VIEW ────────────────────────────────────
  const totalSubs = courseAssignments.reduce((s, a) => s + (a.submittedBy?.length || 0), 0);
  const withSubs  = courseAssignments.filter((a) => a.submittedBy?.length > 0).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { setView("courses"); setSelectedCourse(null); cancelAssignForm(); }}
          className="text-green-600 hover:text-green-800 font-medium text-sm"
        >
          ← My Courses
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">{selectedCourse.name}</h2>
          <p className="text-gray-400 text-xs">{selectedCourse.code} • {selectedCourse.semester}</p>
        </div>
        {!showAssignForm && (
          <button
            onClick={() => setShowAssignForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Assignment
          </button>
        )}
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-xl shadow p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-gray-700 text-sm">Submission Analytics</p>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>📋 {courseAssignments.length} assignments</span>
            <span>✅ {withSubs} with submissions</span>
            <span>📝 {totalSubs} total</span>
          </div>
        </div>
        <ProgressBar
          progress={courseAssignments.length === 0 ? 0 : (withSubs / courseAssignments.length) * 100}
        />
      </div>

      {/* Assignment form */}
      {showAssignForm && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border-t-4 border-green-400">
          <h3 className="font-semibold text-gray-700 mb-4 text-base">
            {editingAssignId ? "✏️ Edit Assignment" : "➕ New Assignment"}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Title", key: "title", type: "text", placeholder: "Assignment title", required: true },
            ].map(({ label, key, type, placeholder, required }) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={assignForm[key]}
                  onChange={(e) => updateAssignField(key, e.target.value)}
                  className={`w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${assignFormErrors[key] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-400"}`}
                />
                {assignFormErrors[key] && <p className="text-red-500 text-xs mt-1">⚠️ {assignFormErrors[key]}</p>}
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
              <textarea
                placeholder="Instructions and details..."
                value={assignForm.description}
                onChange={(e) => updateAssignField("description", e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={assignForm.deadline}
                onChange={(e) => updateAssignField("deadline", e.target.value)}
                className={`w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${assignFormErrors.deadline ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-400"}`}
              />
              {assignFormErrors.deadline && <p className="text-red-500 text-xs mt-1">⚠️ {assignFormErrors.deadline}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                OneDrive / Submission Link <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={assignForm.link}
                onChange={(e) => updateAssignField("link", e.target.value)}
                className={`w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${assignFormErrors.link ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-400"}`}
              />
              {assignFormErrors.link && <p className="text-red-500 text-xs mt-1">⚠️ {assignFormErrors.link}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Submission Type</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {["individual", "group"].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateAssignField("submissionType", t)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      assignForm.submissionType === t
                        ? t === "individual" ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {t === "individual" ? "👤 Individual" : "👥 Group"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSaveAssignment}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                {editingAssignId ? "Update" : "Add Assignment"}
              </button>
              <button onClick={cancelAssignForm} className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & filter */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">All</option>
          <option value="submitted">Has Submissions</option>
          <option value="pending">No Submissions</option>
        </select>
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>{searchTerm || filterStatus !== "all" ? "No assignments match." : "No assignments yet. Add one above!"}</p>
        </div>
      )}

      {filteredAssignments.map((a) => {
        const deadlineDate = new Date(a.deadline);
        const isPast = a.deadline && deadlineDate < new Date();
        return (
          <div key={a.id} className="bg-white shadow-md rounded-xl p-5 mb-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800">{a.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.submissionType === "group" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {a.submissionType === "group" ? "👥 Group" : "👤 Individual"}
                  </span>
                </div>
                {a.description && <p className="text-gray-500 text-sm mt-1">{a.description}</p>}
                {a.deadline && (
                  <p className={`text-xs mt-2 font-medium ${isPast ? "text-red-500" : "text-amber-600"}`}>
                    ⏰ {deadlineDate.toLocaleString()} {isPast ? "— Closed" : ""}
                  </p>
                )}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600">Submitted by ({a.submittedBy?.length || 0}):</p>
                  {a.submittedBy?.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {a.submittedBy.map((s, i) => (
                        <li key={i} className="text-sm text-blue-600">
                          • {s.username}
                          {s.timestamp && <span className="text-gray-400 text-xs ml-1">({new Date(s.timestamp).toLocaleString()})</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-red-400 mt-1">No submissions yet</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => handleEditAssignment(a)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">✏️ Edit</button>
                <button onClick={() => handleDeleteAssignment(a.id)} className="bg-red-100 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">🗑️ Delete</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminDashboard;