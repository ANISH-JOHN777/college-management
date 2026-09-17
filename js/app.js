/**
 * app.js
 * -----------------------------------------------------
 * MAIN UI CONTROLLER & EVENT INITIALIZER
 * 
 * Manages DOM events, tab routing, Lucide icons initialization,
 * modal dialogs, process workflow pipelines, and visual algorithm traces.
 * -----------------------------------------------------
 */

import { DepartmentService } from "./services/DepartmentService.js";
import { getInsertionSortSteps } from "./algorithms/sort.js";

// Service instance
const service = new DepartmentService();

let currentStudentSearchQuery = "";
let currentFacultySearchQuery = "";
let currentCourseSearchQuery = "";
let editingEntityId = null;

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initGlobalDeptSelector();
    initDashboard();
    initDepartmentView();
    initStudentView();
    initFacultyView();
    initCourseView();
    initWorkflowView();
    initAlgorithmsView();
    initModals();

    // Reset Seed Data
    document.getElementById("resetDataBtn").addEventListener("click", () => {
        if (confirm("Reset all department records back to sample initial data?")) {
            service.resetToSampleData();
            showToast("System reset to sample data.", "info");
            refreshAllViews();
        }
    });

    refreshAllViews();
});

// Helper to trigger Lucide icon rendering after DOM updates
function updateLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

// =====================================================
// NAVIGATION & VIEW REFRESH
// =====================================================

function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const tabPanels = document.querySelectorAll(".tab-panel");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute("data-tab");

            navLinks.forEach(l => l.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));

            link.classList.add("active");
            const panel = document.getElementById(targetTab);
            if (panel) panel.classList.add("active");

            if (targetTab === "dashboard") renderDashboard();
            if (targetTab === "departments") renderDepartments();
            if (targetTab === "students") renderStudents();
            if (targetTab === "faculty") renderFaculty();
            if (targetTab === "courses") renderCourses();
            if (targetTab === "workflow") populateWorkflowDropdowns();
            if (targetTab === "algorithms") initAlgoLabVisualizers();

            updateLucideIcons();
        });
    });
}

function refreshAllViews() {
    renderGlobalDeptSelector();
    renderDashboard();
    renderDepartments();
    renderStudents();
    renderFaculty();
    renderCourses();
    populateWorkflowDropdowns();
    updateLucideIcons();
}

// =====================================================
// GLOBAL DEPARTMENT SELECTOR
// =====================================================

function initGlobalDeptSelector() {
    const select = document.getElementById("globalDeptSelect");
    select.addEventListener("change", (e) => {
        service.setActiveDepartment(e.target.value);
        showToast(`Active department switched to ${e.target.value}`, "info");
        refreshAllViews();
    });
}

function renderGlobalDeptSelector() {
    const select = document.getElementById("globalDeptSelect");
    select.innerHTML = "";

    const depts = service.getDepartments();
    const active = service.getActiveDepartment();

    depts.forEach(d => {
        const option = document.createElement("option");
        option.value = d.departmentId;
        option.textContent = `${d.departmentName} (${d.departmentId})`;
        if (active && active.departmentId === d.departmentId) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    document.querySelectorAll(".current-dept-name").forEach(el => {
        el.textContent = active ? active.departmentName : "None";
    });
}

// =====================================================
// DASHBOARD VIEW
// =====================================================

function initDashboard() {
    renderDashboard();
}

function renderDashboard() {
    const metrics = service.getGlobalMetrics();
    document.getElementById("dashTotalDepts").textContent = metrics.totalDepts;
    document.getElementById("dashTotalStudents").textContent = metrics.totalStudents;
    document.getElementById("dashTotalFaculty").textContent = metrics.totalFaculty;
    document.getElementById("dashTotalCourses").textContent = metrics.totalCourses;

    const activeDept = service.getActiveDepartment();
    if (activeDept) {
        document.getElementById("activeDeptBadge").textContent = activeDept.departmentId;
        document.getElementById("activeDeptTitle").textContent = activeDept.departmentName;
        document.getElementById("activeDeptHOD").textContent = activeDept.hod;
        document.getElementById("activeDeptStudents").textContent = `${activeDept.students.length} Students`;
        document.getElementById("activeDeptFaculty").textContent = `${activeDept.faculty.length} Faculty`;
        document.getElementById("activeDeptCourses").textContent = `${activeDept.courses.length} Courses`;
    }

    const activityList = document.getElementById("recentActivityList");
    activityList.innerHTML = "";
    const activities = service.getRecentActivities();

    activities.forEach(act => {
        const li = document.createElement("li");
        li.className = "activity-item";
        li.innerHTML = `
            <i data-lucide="check-circle-2"></i>
            <span>${act.text}</span>
            <span class="activity-time">${act.timestamp}</span>
        `;
        activityList.appendChild(li);
    });

    updateLucideIcons();
}

// =====================================================
// DEPARTMENTS VIEW
// =====================================================

function initDepartmentView() {
    document.getElementById("openAddDeptModalBtn").addEventListener("click", () => {
        openDeptModal("add");
    });

    document.getElementById("deptForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const mode = document.getElementById("deptFormMode").value;
        const code = document.getElementById("deptIdInput").value.trim();
        const name = document.getElementById("deptNameInput").value.trim();
        const hod = document.getElementById("deptHodInput").value.trim();

        if (mode === "add") {
            const result = service.addDepartment(code, name, hod);
            if (result.success) {
                showToast(result.message, "success");
                closeModal("deptModal");
                refreshAllViews();
            } else {
                showToast(result.message, "error");
            }
        } else {
            const success = service.updateDepartment(editingEntityId, name, hod);
            if (success) {
                showToast("Department updated.", "success");
                closeModal("deptModal");
                refreshAllViews();
            } else {
                showToast("Failed to update department.", "error");
            }
        }
    });
}

function renderDepartments() {
    const grid = document.getElementById("departmentsGrid");
    grid.innerHTML = "";

    const depts = service.getDepartments();
    const active = service.getActiveDepartment();

    depts.forEach(dept => {
        const isActive = active && active.departmentId === dept.departmentId;
        const card = document.createElement("div");
        card.className = `dept-card ${isActive ? 'active-dept' : ''}`;

        card.innerHTML = `
            <div>
                <div class="dept-card-top">
                    <span class="dept-card-code">${dept.departmentId}</span>
                    ${isActive ? '<span class="badge badge-primary">Active</span>' : ''}
                </div>
                <h3 class="dept-card-name">${dept.departmentName}</h3>
                <p class="dept-card-hod">HOD: ${dept.hod}</p>
                <div class="dept-counts">
                    <div class="count-box"><span class="num">${dept.students.length}</span><span class="lbl">Students</span></div>
                    <div class="count-box"><span class="num">${dept.faculty.length}</span><span class="lbl">Faculty</span></div>
                    <div class="count-box"><span class="num">${dept.courses.length}</span><span class="lbl">Courses</span></div>
                </div>
            </div>
            <div class="dept-card-actions">
                <button class="btn btn-sm btn-primary select-dept-btn" data-id="${dept.departmentId}">
                    <i data-lucide="check"></i> ${isActive ? 'Selected' : 'Select'}
                </button>
                <button class="btn btn-sm btn-secondary edit-dept-btn" data-id="${dept.departmentId}">
                    <i data-lucide="pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-dept-btn" data-id="${dept.departmentId}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    grid.querySelectorAll(".select-dept-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            service.setActiveDepartment(btn.getAttribute("data-id"));
            refreshAllViews();
        });
    });

    grid.querySelectorAll(".edit-dept-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            openDeptModal("edit", btn.getAttribute("data-id"));
        });
    });

    grid.querySelectorAll(".delete-dept-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm(`Delete department '${id}'? This action will remove all associated records.`)) {
                service.deleteDepartment(id);
                showToast(`Department ${id} deleted.`, "warning");
                refreshAllViews();
            }
        });
    });

    updateLucideIcons();
}

function openDeptModal(mode, id = null) {
    const modal = document.getElementById("deptModal");
    const title = document.getElementById("deptModalTitle");
    const modeInput = document.getElementById("deptFormMode");
    const idInput = document.getElementById("deptIdInput");
    const nameInput = document.getElementById("deptNameInput");
    const hodInput = document.getElementById("deptHodInput");

    modeInput.value = mode;
    editingEntityId = id;

    if (mode === "add") {
        title.textContent = "Add Department";
        idInput.value = "";
        idInput.disabled = false;
        nameInput.value = "";
        hodInput.value = "";
    } else {
        title.textContent = "Edit Department";
        const dept = service.getDepartments().find(d => d.departmentId === id);
        if (dept) {
            idInput.value = dept.departmentId;
            idInput.disabled = true;
            nameInput.value = dept.departmentName;
            hodInput.value = dept.hod;
        }
    }

    openModal("deptModal");
}

// =====================================================
// STUDENTS VIEW
// =====================================================

function initStudentView() {
    document.getElementById("openAddStudentModalBtn").addEventListener("click", () => {
        openStudentModal("add");
    });

    const searchInput = document.getElementById("studentSearchInput");
    searchInput.addEventListener("input", (e) => {
        currentStudentSearchQuery = e.target.value;
        renderStudents();
    });

    document.getElementById("sortStudentsBtn").addEventListener("click", () => {
        service.sortStudentsByName(true);
        showToast("Students sorted alphabetically by name using Insertion Sort.", "success");
        renderStudents();
    });

    document.getElementById("studentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const mode = document.getElementById("studentFormMode").value;
        
        const data = {
            id: document.getElementById("studentIdInput").value.trim(),
            rollNumber: document.getElementById("studentRollInput").value.trim(),
            name: document.getElementById("studentNameInput").value.trim(),
            email: document.getElementById("studentEmailInput").value.trim(),
            phone: document.getElementById("studentPhoneInput").value.trim(),
            year: document.getElementById("studentYearInput").value,
            program: document.getElementById("studentProgramInput").value.trim()
        };

        if (mode === "add") {
            const result = service.addStudent(data);
            if (result.success) {
                showToast(result.message, "success");
                closeModal("studentModal");
                refreshAllViews();
            } else {
                showToast(result.message, "error");
            }
        } else {
            const success = service.updateStudent(editingEntityId, data);
            if (success) {
                showToast("Student details updated.", "success");
                closeModal("studentModal");
                refreshAllViews();
            } else {
                showToast("Failed to update student.", "error");
            }
        }
    });
}

function renderStudents() {
    const tbody = document.getElementById("studentsTableBody");
    tbody.innerHTML = "";

    const students = service.searchStudents(currentStudentSearchQuery);

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted);">No student records found.</td></tr>`;
        return;
    }

    students.forEach(st => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><strong>${st.id}</strong></td>
            <td>${st.name}</td>
            <td><span class="badge badge-info">${st.rollNumber}</span></td>
            <td>Year ${st.year}</td>
            <td>${st.program}</td>
            <td>${st.email}</td>
            <td><span class="badge badge-primary">${(st.enrolledCourses || []).join(", ") || "None"}</span></td>
            <td class="actions-cell">
                <button class="action-btn edit-btn edit-student-btn" data-id="${st.id}" title="Edit Student"><i data-lucide="pencil"></i></button>
                <button class="action-btn delete-btn delete-student-btn" data-id="${st.id}" title="Delete Student"><i data-lucide="trash-2"></i></button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".edit-student-btn").forEach(btn => {
        btn.addEventListener("click", () => openStudentModal("edit", btn.getAttribute("data-id")));
    });

    tbody.querySelectorAll(".delete-student-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm(`Delete student record '${id}'?`)) {
                service.deleteStudent(id);
                showToast(`Student ${id} deleted.`, "warning");
                refreshAllViews();
            }
        });
    });

    updateLucideIcons();
}

function openStudentModal(mode, id = null) {
    const modal = document.getElementById("studentModal");
    const title = document.getElementById("studentModalTitle");
    const modeInput = document.getElementById("studentFormMode");

    const idInput = document.getElementById("studentIdInput");
    const rollInput = document.getElementById("studentRollInput");
    const nameInput = document.getElementById("studentNameInput");
    const emailInput = document.getElementById("studentEmailInput");
    const phoneInput = document.getElementById("studentPhoneInput");
    const yearInput = document.getElementById("studentYearInput");
    const progInput = document.getElementById("studentProgramInput");

    modeInput.value = mode;
    editingEntityId = id;

    if (mode === "add") {
        title.textContent = "Add Student";
        idInput.value = "";
        idInput.disabled = false;
        rollInput.value = "";
        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        yearInput.value = "3";
        progInput.value = "B.Tech IT";
    } else {
        title.textContent = "Edit Student";
        const activeDept = service.getActiveDepartment();
        const st = activeDept ? activeDept.findStudent(id, 'id') : null;
        if (st) {
            idInput.value = st.id;
            idInput.disabled = true;
            rollInput.value = st.rollNumber;
            nameInput.value = st.name;
            emailInput.value = st.email;
            phoneInput.value = st.phone;
            yearInput.value = st.year;
            progInput.value = st.program;
        }
    }

    openModal("studentModal");
}

// =====================================================
// FACULTY VIEW
// =====================================================

function initFacultyView() {
    document.getElementById("openAddFacultyModalBtn").addEventListener("click", () => {
        openFacultyModal("add");
    });

    document.getElementById("facultySearchInput").addEventListener("input", (e) => {
        currentFacultySearchQuery = e.target.value;
        renderFaculty();
    });

    document.getElementById("facultyForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const mode = document.getElementById("facultyFormMode").value;

        const data = {
            id: document.getElementById("facultyIdInput").value.trim(),
            employeeId: document.getElementById("facultyEmpIdInput").value.trim(),
            name: document.getElementById("facultyNameInput").value.trim(),
            email: document.getElementById("facultyEmailInput").value.trim(),
            phone: document.getElementById("facultyPhoneInput").value.trim(),
            designation: document.getElementById("facultyDesigInput").value,
            specialization: document.getElementById("facultySpecInput").value.trim()
        };

        if (mode === "add") {
            const result = service.addFaculty(data);
            if (result.success) {
                showToast(result.message, "success");
                closeModal("facultyModal");
                refreshAllViews();
            } else {
                showToast(result.message, "error");
            }
        } else {
            const success = service.updateFaculty(editingEntityId, data);
            if (success) {
                showToast("Faculty details updated.", "success");
                closeModal("facultyModal");
                refreshAllViews();
            } else {
                showToast("Failed to update faculty.", "error");
            }
        }
    });
}

function renderFaculty() {
    const tbody = document.getElementById("facultyTableBody");
    tbody.innerHTML = "";

    const faculty = service.searchFaculty(currentFacultySearchQuery);

    if (faculty.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No faculty records found.</td></tr>`;
        return;
    }

    faculty.forEach(f => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><span class="badge badge-info">${f.employeeId}</span></td>
            <td><strong>${f.name}</strong></td>
            <td>${f.designation}</td>
            <td>${f.specialization}</td>
            <td>${f.email}</td>
            <td><span class="badge badge-success">${(f.assignedCourses || []).join(", ") || "None"}</span></td>
            <td class="actions-cell">
                <button class="action-btn edit-btn edit-faculty-btn" data-id="${f.id}" title="Edit Faculty"><i data-lucide="pencil"></i></button>
                <button class="action-btn delete-btn delete-faculty-btn" data-id="${f.id}" title="Delete Faculty"><i data-lucide="trash-2"></i></button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".edit-faculty-btn").forEach(btn => {
        btn.addEventListener("click", () => openFacultyModal("edit", btn.getAttribute("data-id")));
    });

    tbody.querySelectorAll(".delete-faculty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm(`Delete faculty member '${id}'?`)) {
                service.deleteFaculty(id);
                showToast(`Faculty ${id} deleted.`, "warning");
                refreshAllViews();
            }
        });
    });

    updateLucideIcons();
}

function openFacultyModal(mode, id = null) {
    const modal = document.getElementById("facultyModal");
    const title = document.getElementById("facultyModalTitle");
    const modeInput = document.getElementById("facultyFormMode");

    const idInput = document.getElementById("facultyIdInput");
    const empInput = document.getElementById("facultyEmpIdInput");
    const nameInput = document.getElementById("facultyNameInput");
    const emailInput = document.getElementById("facultyEmailInput");
    const phoneInput = document.getElementById("facultyPhoneInput");
    const desigInput = document.getElementById("facultyDesigInput");
    const specInput = document.getElementById("facultySpecInput");

    modeInput.value = mode;
    editingEntityId = id;

    if (mode === "add") {
        title.textContent = "Add Faculty";
        idInput.value = "";
        idInput.disabled = false;
        empInput.value = "";
        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        desigInput.value = "Assistant Professor";
        specInput.value = "";
    } else {
        title.textContent = "Edit Faculty";
        const activeDept = service.getActiveDepartment();
        const f = activeDept ? activeDept.findFaculty(id, 'id') : null;
        if (f) {
            idInput.value = f.id;
            idInput.disabled = true;
            empInput.value = f.employeeId;
            nameInput.value = f.name;
            emailInput.value = f.email;
            phoneInput.value = f.phone;
            desigInput.value = f.designation;
            specInput.value = f.specialization;
        }
    }

    openModal("facultyModal");
}

// =====================================================
// COURSES VIEW
// =====================================================

function initCourseView() {
    document.getElementById("openAddCourseModalBtn").addEventListener("click", () => {
        openCourseModal("add");
    });

    document.getElementById("courseSearchInput").addEventListener("input", (e) => {
        currentCourseSearchQuery = e.target.value;
        renderCourses();
    });

    document.getElementById("courseForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const mode = document.getElementById("courseFormMode").value;

        const data = {
            courseId: document.getElementById("courseIdInput").value.trim().toUpperCase(),
            courseName: document.getElementById("courseNameInput").value.trim(),
            credits: document.getElementById("courseCreditsInput").value,
            faculty: document.getElementById("courseFacultySelect").value || null
        };

        if (mode === "add") {
            const result = service.addCourse(data);
            if (result.success) {
                showToast(result.message, "success");
                closeModal("courseModal");
                refreshAllViews();
            } else {
                showToast(result.message, "error");
            }
        } else {
            const success = service.updateCourse(editingEntityId, data);
            if (success) {
                showToast("Course updated.", "success");
                closeModal("courseModal");
                refreshAllViews();
            } else {
                showToast("Failed to update course.", "error");
            }
        }
    });
}

function renderCourses() {
    const tbody = document.getElementById("coursesTableBody");
    tbody.innerHTML = "";

    const courses = service.searchCourses(currentCourseSearchQuery);
    const activeDept = service.getActiveDepartment();

    if (courses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No course records found.</td></tr>`;
        return;
    }

    courses.forEach(c => {
        const tr = document.createElement("tr");

        let facultyName = "Unassigned";
        if (c.faculty && activeDept) {
            const fac = activeDept.findFaculty(c.faculty, 'id');
            facultyName = fac ? fac.name : c.faculty;
        }

        tr.innerHTML = `
            <td><strong>${c.courseId}</strong></td>
            <td>${c.courseName}</td>
            <td><span class="badge badge-warning">${c.credits} Credits</span></td>
            <td><span class="badge badge-info">${facultyName}</span></td>
            <td><span class="badge badge-success">${(c.students || []).length} Students</span></td>
            <td class="actions-cell">
                <button class="action-btn edit-btn view-enrolled-btn" data-id="${c.courseId}" title="View Enrolled Students"><i data-lucide="users"></i></button>
                <button class="action-btn edit-btn edit-course-btn" data-id="${c.courseId}" title="Edit Course"><i data-lucide="pencil"></i></button>
                <button class="action-btn delete-btn delete-course-btn" data-id="${c.courseId}" title="Delete Course"><i data-lucide="trash-2"></i></button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".view-enrolled-btn").forEach(btn => {
        btn.addEventListener("click", () => openViewStudentsModal(btn.getAttribute("data-id")));
    });

    tbody.querySelectorAll(".edit-course-btn").forEach(btn => {
        btn.addEventListener("click", () => openCourseModal("edit", btn.getAttribute("data-id")));
    });

    tbody.querySelectorAll(".delete-course-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm(`Delete course '${id}'?`)) {
                service.deleteCourse(id);
                showToast(`Course ${id} deleted.`, "warning");
                refreshAllViews();
            }
        });
    });

    updateLucideIcons();
}

function openCourseModal(mode, id = null) {
    const modal = document.getElementById("courseModal");
    const title = document.getElementById("courseModalTitle");
    const modeInput = document.getElementById("courseFormMode");

    const idInput = document.getElementById("courseIdInput");
    const nameInput = document.getElementById("courseNameInput");
    const creditsInput = document.getElementById("courseCreditsInput");
    const facultySelect = document.getElementById("courseFacultySelect");

    facultySelect.innerHTML = `<option value="">-- None (Unassigned) --</option>`;
    const activeDept = service.getActiveDepartment();
    if (activeDept) {
        activeDept.faculty.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f.id;
            opt.textContent = `${f.name} (${f.designation})`;
            facultySelect.appendChild(opt);
        });
    }

    modeInput.value = mode;
    editingEntityId = id;

    if (mode === "add") {
        title.textContent = "Add Course";
        idInput.value = "";
        idInput.disabled = false;
        nameInput.value = "";
        creditsInput.value = "4";
        facultySelect.value = "";
    } else {
        title.textContent = "Edit Course";
        const c = activeDept ? activeDept.findCourse(id, 'courseId') : null;
        if (c) {
            idInput.value = c.courseId;
            idInput.disabled = true;
            nameInput.value = c.courseName;
            creditsInput.value = c.credits;
            facultySelect.value = c.faculty || "";
        }
    }

    openModal("courseModal");
}

function openViewStudentsModal(courseId) {
    const activeDept = service.getActiveDepartment();
    const course = activeDept ? activeDept.findCourse(courseId, 'courseId') : null;
    const modalBody = document.getElementById("viewStudentsModalBody");

    if (!course) return;

    document.getElementById("viewStudentsModalTitle").textContent = `Enrolled Students - ${course.courseName} (${course.courseId})`;

    if (course.students.length === 0) {
        modalBody.innerHTML = `<p style="color: var(--text-muted); text-align:center;">No students currently enrolled in this course.</p>`;
    } else {
        let html = `<ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem;">`;
        course.students.forEach(stId => {
            const studentObj = activeDept.findStudent(stId, 'id');
            const name = studentObj ? studentObj.name : stId;
            const roll = studentObj ? studentObj.rollNumber : '';
            html += `<li style="padding:0.6rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <span><strong>${name}</strong> (${stId})</span>
                <span class="badge badge-info">${roll}</span>
            </li>`;
        });
        html += `</ul>`;
        modalBody.innerHTML = html;
    }

    openModal("viewStudentsModal");
}

// =====================================================
// WORKFLOW PIPELINE ANIMATIONS
// =====================================================

function initWorkflowView() {
    populateWorkflowDropdowns();

    document.getElementById("enrollWorkflowForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const studentId = document.getElementById("wfStudentSelect").value;
        const courseId = document.getElementById("wfCourseSelect").value;

        if (!studentId || !courseId) {
            showToast("Please select both a student and a course.", "error");
            return;
        }

        runEnrollmentAnimation(studentId, courseId);
    });

    document.getElementById("assignWorkflowForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const facultyId = document.getElementById("wfFacultySelect").value;
        const courseId = document.getElementById("wfAssignCourseSelect").value;

        if (!facultyId || !courseId) {
            showToast("Please select both a faculty member and a course.", "error");
            return;
        }

        runAssignmentAnimation(facultyId, courseId);
    });
}

function populateWorkflowDropdowns() {
    const activeDept = service.getActiveDepartment();
    if (!activeDept) return;

    const studentSelect = document.getElementById("wfStudentSelect");
    const courseSelect = document.getElementById("wfCourseSelect");
    const facultySelect = document.getElementById("wfFacultySelect");
    const assignCourseSelect = document.getElementById("wfAssignCourseSelect");

    studentSelect.innerHTML = `<option value="">-- Select Student --</option>`;
    activeDept.students.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.id} - ${s.rollNumber})`;
        studentSelect.appendChild(opt);
    });

    courseSelect.innerHTML = `<option value="">-- Select Course --</option>`;
    assignCourseSelect.innerHTML = `<option value="">-- Select Course --</option>`;
    activeDept.courses.forEach(c => {
        const opt1 = document.createElement("option");
        opt1.value = c.courseId;
        opt1.textContent = `${c.courseName} (${c.courseId})`;

        const opt2 = document.createElement("option");
        opt2.value = c.courseId;
        opt2.textContent = `${c.courseName} (${c.courseId})`;
        courseSelect.appendChild(opt1);
        assignCourseSelect.appendChild(opt2);
    });

    facultySelect.innerHTML = `<option value="">-- Select Faculty --</option>`;
    activeDept.faculty.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.id;
        opt.textContent = `${f.name} (${f.designation})`;
        facultySelect.appendChild(opt);
    });
}

function runEnrollmentAnimation(studentId, courseId) {
    const pipelineSteps = document.querySelectorAll("#enrollmentPipeline .p-step");
    const logBox = document.getElementById("enrollmentLogBox");

    pipelineSteps.forEach(s => s.className = "p-step");
    logBox.textContent = "Executing enrollment workflow...\n";

    const steps = [
        { elemId: "pstep1", msg: `Selected Student ID: ${studentId}` },
        { elemId: "pstep2", msg: `Selected Course ID: ${courseId}` },
        { elemId: "pstep3", msg: `Linear Search: Student '${studentId}' found.` },
        { elemId: "pstep4", msg: `Linear Search: Course '${courseId}' found.` },
        { elemId: "pstep5", msg: `Membership check: Verifying duplicate enrollment... OK` },
        { elemId: "pstep6", msg: `Updating state & saving to localStorage... Done!` }
    ];

    let delay = 0;
    steps.forEach((st, idx) => {
        setTimeout(() => {
            const elem = document.getElementById(st.elemId);
            if (elem) elem.className = "p-step success";
            logBox.textContent += `${st.msg}\n`;

            if (idx === steps.length - 1) {
                const res = service.enrollStudentInCourse(studentId, courseId);
                if (res.success) {
                    showToast(res.message, "success");
                    refreshAllViews();
                } else {
                    showToast(res.message, "error");
                    logBox.textContent += `Error: ${res.message}\n`;
                }
            }
        }, delay);
        delay += 350;
    });
}

function runAssignmentAnimation(facultyId, courseId) {
    const pipelineSteps = document.querySelectorAll("#assignmentPipeline .p-step");
    const logBox = document.getElementById("assignmentLogBox");

    pipelineSteps.forEach(s => s.className = "p-step");
    logBox.textContent = "Executing assignment workflow...\n";

    const steps = [
        { elemId: "fstep1", msg: `Selected Faculty ID: ${facultyId}` },
        { elemId: "fstep2", msg: `Selected Course ID: ${courseId}` },
        { elemId: "fstep3", msg: `Linear Search: Faculty '${facultyId}' found.` },
        { elemId: "fstep4", msg: `Linear Search: Course '${courseId}' found.` },
        { elemId: "fstep5", msg: `Assigning faculty to course & saving... Done!` }
    ];

    let delay = 0;
    steps.forEach((st, idx) => {
        setTimeout(() => {
            const elem = document.getElementById(st.elemId);
            if (elem) elem.className = "p-step success";
            logBox.textContent += `${st.msg}\n`;

            if (idx === steps.length - 1) {
                const res = service.assignFacultyToCourse(facultyId, courseId);
                if (res.success) {
                    showToast(res.message, "success");
                    refreshAllViews();
                } else {
                    showToast(res.message, "error");
                }
            }
        }, delay);
        delay += 350;
    });
}

// =====================================================
// ALGORITHMS LAB & VISUALIZER
// =====================================================

function initAlgorithmsView() {
    initAlgoLabVisualizers();

    document.getElementById("runSearchDemoBtn").addEventListener("click", () => {
        const target = document.getElementById("algoSearchTarget").value.trim() || "S003";
        runLinearSearchTraceVisualizer(target);
    });

    document.getElementById("runSortDemoBtn").addEventListener("click", () => {
        runInsertionSortTraceVisualizer();
    });
}

function initAlgoLabVisualizers() {
    renderSearchVisualizerInitial();
    renderSortVisualizerInitial();
}

function renderSearchVisualizerInitial() {
    const activeDept = service.getActiveDepartment();
    const students = activeDept ? activeDept.students : [];
    const container = document.getElementById("searchArrayVis");
    container.innerHTML = "";

    students.forEach(s => {
        const node = document.createElement("div");
        node.className = "array-node";
        node.id = `node-search-${s.id}`;
        node.textContent = `${s.id}: ${s.name}`;
        container.appendChild(node);
    });
}

function runLinearSearchTraceVisualizer(targetId) {
    const activeDept = service.getActiveDepartment();
    const students = activeDept ? activeDept.students : [];
    const msg = document.getElementById("searchAlgoMsg");

    renderSearchVisualizerInitial();
    msg.textContent = `Running Linear Search for target ID: '${targetId}'...`;

    let found = false;
    let delay = 0;

    for (let i = 0; i < students.length; i++) {
        const s = students[i];
        setTimeout(() => {
            document.querySelectorAll("#searchArrayVis .array-node").forEach(n => n.classList.remove("highlighted"));

            const node = document.getElementById(`node-search-${s.id}`);
            if (node) node.classList.add("highlighted");

            msg.textContent = `Comparing index ${i}: '${s.id}' with target '${targetId}'...`;

            if (s.id.toLowerCase() === targetId.toLowerCase() || s.name.toLowerCase().includes(targetId.toLowerCase())) {
                found = true;
                node.classList.remove("highlighted");
                node.classList.add("matched");
                msg.textContent = `Match found at index ${i}! '${s.name}' found in O(${i + 1}) comparisons.`;
            }
        }, delay);

        delay += 550;
        if (s.id.toLowerCase() === targetId.toLowerCase()) break;
    }

    setTimeout(() => {
        if (!found) {
            msg.textContent = `Target '${targetId}' not found after checking all ${students.length} items. Worst case O(n).`;
        }
    }, delay);
}

function renderSortVisualizerInitial() {
    const activeDept = service.getActiveDepartment();
    const names = activeDept ? activeDept.students.map(s => s.name) : ["Rahul", "Anish", "Priya", "Karthik"];
    const container = document.getElementById("sortArrayVis");
    container.innerHTML = "";

    names.forEach((name, idx) => {
        const node = document.createElement("div");
        node.className = "array-node";
        node.id = `node-sort-${idx}`;
        node.textContent = name;
        container.appendChild(node);
    });
}

function runInsertionSortTraceVisualizer() {
    const activeDept = service.getActiveDepartment();
    const names = activeDept ? activeDept.students.map(s => s.name) : ["Rahul", "Anish", "Priya", "Karthik"];
    const msg = document.getElementById("sortAlgoMsg");
    const container = document.getElementById("sortArrayVis");

    const steps = getInsertionSortSteps(names);

    let delay = 0;
    steps.forEach((stepObj, idx) => {
        setTimeout(() => {
            container.innerHTML = "";
            stepObj.arrayState.forEach((name, i) => {
                const node = document.createElement("div");
                node.className = "array-node";
                if (stepObj.highlightedIndices.includes(i)) {
                    node.className = idx === steps.length - 1 ? "array-node matched" : "array-node highlighted";
                }
                node.textContent = name;
                container.appendChild(node);
            });

            msg.textContent = `Step ${stepObj.step}: ${stepObj.description}`;
        }, delay);
        delay += 600;
    });
}

// =====================================================
// MODALS & TOAST UTILITIES
// =====================================================

function initModals() {
    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("active");
        }
    });
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
}

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconName = "info";
    if (type === "success") iconName = "check-circle-2";
    if (type === "error") iconName = "alert-circle";
    if (type === "warning") iconName = "alert-triangle";

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    updateLucideIcons();

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
