import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import ProgressBar from "../components/ProgressBar";
import toast from "react-hot-toast";

// Matches AdminDashboard colour palette so enrolled cards are consistent
const CARD_COLORS = [
  { border: "border-blue-500",   badge: "bg-blue-100 text-blue-700",   title: "text-blue-700",   btn: "bg-blue-500 hover:bg-blue-600",   enroll: "bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100" },
  { border: "border-emerald-500",badge: "bg-emerald-100 text-emerald-700", title: "text-emerald-700", btn: "bg-emerald-500 hover:bg-emerald-600", enroll: "bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100" },
  { border: "border-violet-500", badge: "bg-violet-100 text-violet-700",title: "text-violet-700", btn: "bg-violet-500 hover:bg-violet-600", enroll: "bg-violet-50 border-violet-300 text-violet-600 hover:bg-violet-100" },
  { border: "border-amber-500",  badge: "bg-amber-100 text-amber-700",  title: "text-amber-700",  btn: "bg-amber-500 hover:bg-amber-600",  enroll: "bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100" },
  { border: "border-rose-500",   badge: "bg-rose-100 text-rose-700",    title: "text-rose-700",   btn: "bg-rose-500 hover:bg-rose-600",    enroll: "bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100" },
  { border: "border-cyan-500",   badge: "bg-cyan-100 text-cyan-700",    title: "text-cyan-700",   btn: "bg-cyan-500 hover:bg-cyan-600",    enroll: "bg-cyan-50 border-cyan-300 text-cyan-600 hover:bg-cyan-100" },
];

function StudentDashboard({ assignments, setAssignments, courses, setCourses, groups, setGroups, user }) {
  // ── View state ───────────────────────────────────────────────────
  const [tab, setTab] = useState("enrolled"); // "enrolled" | "browse"
  const [selectedCourse, setSelectedCourse] = useState(null);

  // ── Assignment state ─────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  // Derived lists
  const enrolledCourses = courses.filter((c) => c.enrolledStudents.includes(user.username));
  const browseCourses   = courses.filter((c) => !c.enrolledStudents.includes(user.username));

  const courseAssignments = selectedCourse
    ? assignments.filter((a) => a.courseId === selectedCourse.id)
    : [];

  function getUserGroup(assignment) {
    return groups.find(
      (g) => g.courseId === assignment.courseId && g.members.includes(user.username)
    );
  }

  // ── Enroll / Unenroll ────────────────────────────────────────────
  const handleEnroll = (courseId) => {
    setCourses(courses.map((c) =>
      c.id === courseId && !c.enrolledStudents.includes(user.username)
        ? { ...c, enrolledStudents: [...c.enrolledStudents, user.username] }
        : c
    ));
    toast.success("Enrolled successfully!");
  };

  const handleUnenroll = (courseId) => {
    if (!window.confirm("Unenroll from this course?")) return;
    setCourses(courses.map((c) =>
      c.id === courseId
        ? { ...c, enrolledStudents: c.enrolledStudents.filter((s) => s !== user.username) }
        : c
    ));
    toast("Unenrolled from course");
  };

  // ── Acknowledge submission ───────────────────────────────────────
  const confirmSubmit = () => {
    setAssignments(assignments.map((a) =>
      a.id === selectedId
        ? { ...a, submittedBy: [...(a.submittedBy || []), { username: user.username, timestamp: new Date().toISOString() }] }
        : a
    ));
    setSelectedId(null);
    toast.success("✅ Submission acknowledged!");
  };

  // ── Group management ─────────────────────────────────────────────
  const handleCreateGroup = (courseId) => {
    if (!newGroupName.trim()) { toast.error("Enter a group name"); return; }
    if (groups.find((g) => g.courseId === courseId && g.members.includes(user.username))) {
      toast.error("You are already in a group for this course"); return;
    }
    setGroups([...groups, { id: Date.now(), courseId, name: newGroupName.trim(), leader: user.username, members: [user.username] }]);
    setNewGroupName("");
    setShowCreateGroup(null);
    toast.success("Group created! You are the leader.");
  };

  const handleJoinGroup = (groupId, courseId) => {
    if (groups.find((g) => g.courseId === courseId && g.members.includes(user.username))) {
      toast.error("Already in a group for this course"); return;
    }
    setGroups(groups.map((g) => g.id === groupId ? { ...g, members: [...g.members, user.username] } : g));
    toast.success("Joined the group!");
  };

  // ── Progress for enrolled course card ────────────────────────────
  const courseProgress = (course) => {
    const assns = assignments.filter((a) => a.courseId === course.id);
    const done = assns.filter((a) => {
      if (a.submissionType === "group") {
        const grp = groups.find((g) => g.courseId === course.id && g.members.includes(user.username));
        return grp ? a.submittedBy?.some((s) => s.username === grp.leader) : false;
      }
      return a.submittedBy?.some((s) => s.username === user.username);
    }).length;
    return { total: assns.length, done };
  };

  // ─────────────────────────────────────────────────────────────────
  // ASSIGNMENT VIEW
  // ─────────────────────────────────────────────────────────────────
  if (selectedCourse) {
    const submittedCount = courseAssignments.filter((a) => {
      if (a.submissionType === "group") {
        const grp = getUserGroup(a);
        return grp ? a.submittedBy?.some((s) => s.username === grp.leader) : false;
      }
      return a.submittedBy?.some((s) => s.username === user.username);
    }).length;

    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            ← My Courses
          </button>
          <div className="h-5 w-px bg-gray-300" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{selectedCourse.name}</h2>
            <p className="text-gray-400 text-xs">
              {selectedCourse.code} • {selectedCourse.semester} • 👨‍🏫 Prof. {selectedCourse.professorId}
            </p>
          </div>
          <button
            onClick={() => handleUnenroll(selectedCourse.id)}
            className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            Unenroll
          </button>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-5 flex items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-gray-700 text-sm">
              Progress — {submittedCount}/{courseAssignments.length} submitted
            </p>
            <ProgressBar progress={courseAssignments.length === 0 ? 0 : (submittedCount / courseAssignments.length) * 100} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {courseAssignments.length === 0 ? "—" : Math.round((submittedCount / courseAssignments.length) * 100) + "%"}
            </p>
            <p className="text-xs text-gray-400">Done</p>
          </div>
        </div>

        {courseAssignments.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No assignments posted yet.</p>
          </div>
        )}

        {courseAssignments.map((a) => {
          const isGroup = a.submissionType === "group";
          const userGroup = isGroup ? getUserGroup(a) : null;
          const isLeader = userGroup?.leader === user.username;
          const mySubmission = a.submittedBy?.find((s) => s.username === user.username);
          const leaderSubmission = isGroup && userGroup
            ? a.submittedBy?.find((s) => s.username === userGroup.leader)
            : null;
          const isAcknowledged = isGroup ? !!leaderSubmission : !!mySubmission;
          const ackTimestamp = isGroup ? leaderSubmission?.timestamp : mySubmission?.timestamp;
          const deadlineDate = new Date(a.deadline);
          const isPast = deadlineDate < new Date();
          const canAck = isGroup
            ? isLeader && !leaderSubmission && !isPast && !!userGroup
            : !mySubmission && !isPast;
          const joinableGroups = groups.filter((g) => g.courseId === a.courseId && !g.members.includes(user.username));

          return (
            <div key={a.id} className={`bg-white shadow-md rounded-xl p-5 mb-4 border-l-4 ${isAcknowledged ? "border-green-400" : isPast ? "border-red-300" : "border-blue-400"}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{a.title}</h3>
                    {isAcknowledged && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">✅ Acknowledged</span>}
                  </div>
                  {a.description && <p className="text-gray-500 text-sm mt-1">{a.description}</p>}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPast ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                      ⏰ {deadlineDate.toLocaleString()} {isPast ? "(Closed)" : ""}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                      {isGroup ? "👥 Group" : "👤 Individual"}
                    </span>
                  </div>

                  {ackTimestamp && (
                    <p className="text-xs text-gray-400 mt-2">
                      Acknowledged: {new Date(ackTimestamp).toLocaleString()}
                      {isGroup && !isLeader && ` (by leader ${userGroup.leader})`}
                    </p>
                  )}

                  <a href={a.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm underline mt-2">
                    📎 Open Submission Link
                  </a>

                  {/* Group section */}
                  {isGroup && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      {!userGroup ? (
                        <div>
                          <p className="text-sm font-medium text-amber-600 mb-2">
                            ⚠️ You are not part of any group. Form or join one to submit this assignment.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setShowCreateGroup(showCreateGroup === a.courseId ? null : a.courseId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                            >
                              + Create Group
                            </button>
                            {joinableGroups.map((g) => (
                              <button key={g.id} onClick={() => handleJoinGroup(g.id, a.courseId)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition">
                                Join "{g.name}"
                              </button>
                            ))}
                          </div>
                          {showCreateGroup === a.courseId && (
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                placeholder="Group name..."
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreateGroup(a.courseId)}
                                className="border border-gray-300 p-1.5 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                              <button onClick={() => handleCreateGroup(a.courseId)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
                                Create
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-700">👥 {userGroup.name}</span>
                            {isLeader && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">👑 Leader</span>}
                          </div>
                          <p className="text-xs text-gray-500">Members: {userGroup.members.join(", ")}</p>
                          {!isLeader && !leaderSubmission && <p className="text-xs text-gray-400 mt-1">Waiting for leader ({userGroup.leader}) to acknowledge.</p>}
                          {leaderSubmission && <p className="text-xs text-green-600 mt-1">✅ Leader acknowledged — all members marked submitted.</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {canAck && (
                  <button onClick={() => setSelectedId(a.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {selectedId && <ConfirmationModal onConfirm={confirmSubmit} onCancel={() => setSelectedId(null)} />}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // COURSE LIST VIEW (Enrolled / Browse tabs)
  // ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
        <p className="text-gray-500 text-sm mt-0.5">Enroll in courses to access assignments</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm mb-6 w-fit">
        <button
          onClick={() => setTab("enrolled")}
          className={`px-6 py-2.5 text-sm font-semibold transition-colors ${tab === "enrolled" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
        >
          📚 My Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setTab("browse")}
          className={`px-6 py-2.5 text-sm font-semibold transition-colors ${tab === "browse" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
        >
          🔍 Browse All ({browseCourses.length})
        </button>
      </div>

      {/* ── Enrolled courses ── */}
      {tab === "enrolled" && (
        <>
          {enrolledCourses.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg font-medium text-gray-500">No enrolled courses yet</p>
              <p className="text-sm mt-1">Switch to <strong>Browse All</strong> to find and enroll in courses</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledCourses.map((course, idx) => {
              const color = CARD_COLORS[idx % CARD_COLORS.length];
              const { total, done } = courseProgress(course);
              const progress = total === 0 ? 0 : (done / total) * 100;

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${color.border} flex flex-col gap-3`}
                >
                  {/* Course info */}
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
                    <span>🗓️ {course.semester}</span>
                    <span>👨‍🏫 Prof. {course.professorId}</span>
                    <span>👥 {course.enrolledStudents.length} students</span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Submissions</span>
                      <span>{done}/{total}</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-white text-sm py-2 rounded-lg font-medium transition-colors ${color.btn}`}
                  >
                    Open Assignments →
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Browse / discover courses ── */}
      {tab === "browse" && (
        <>
          {courses.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🎓</p>
              <p className="text-lg font-medium text-gray-500">No courses available yet</p>
              <p className="text-sm mt-1">Courses will appear here once professors create them</p>
            </div>
          )}

          {browseCourses.length === 0 && courses.length > 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-medium text-gray-500">You are enrolled in all available courses!</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {browseCourses.map((course, idx) => {
              // Use a global course index for consistent colours
              const globalIdx = courses.findIndex((c) => c.id === course.id);
              const color = CARD_COLORS[globalIdx % CARD_COLORS.length];
              const courseAssns = assignments.filter((a) => a.courseId === course.id);

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${color.border} border-dashed flex flex-col gap-3 opacity-90`}
                >
                  {/* Course info */}
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
                    <span>🗓️ {course.semester}</span>
                    <span>👨‍🏫 Prof. {course.professorId}</span>
                    <span>👥 {course.enrolledStudents.length} enrolled</span>
                    <span>📋 {courseAssns.length} assignments</span>
                  </div>

                  {/* Enroll button */}
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className={`w-full border text-sm py-2 rounded-lg font-semibold transition-colors ${color.enroll}`}
                  >
                    + Enroll in this Course
                  </button>
                </div>
              );
            })}
          </div>

          {/* Enrolled courses in browse tab (greyed out) */}
          {enrolledCourses.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Already Enrolled</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enrolledCourses.map((course, idx) => {
                  const color = CARD_COLORS[idx % CARD_COLORS.length];
                  return (
                    <div key={course.id} className={`bg-gray-50 rounded-2xl p-4 border-l-4 ${color.border} opacity-60 flex justify-between items-center`}>
                      <div>
                        <p className={`font-bold text-sm ${color.title}`}>{course.name}</p>
                        <p className="text-xs text-gray-400">👨‍🏫 Prof. {course.professorId}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">✅ Enrolled</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StudentDashboard;