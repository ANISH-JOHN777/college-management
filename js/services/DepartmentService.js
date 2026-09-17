/**
 * DepartmentService.js
 * -----------------------------------------------------
 * ACADEMIC SERVICE LAYER: Persistence & State Management
 * 
 * Responsibilities:
 * 1. Manages application state (active department, all departments, activity log).
 * 2. Handles LocalStorage serialization & RE-HYDRATION (Deserialization).
 *    - Reconstructs plain JSON objects back into Student, Faculty, Course, Department class instances
 *      so that prototype methods (e.g. getDetails(), enrollCourse()) survive browser refresh.
 * 3. Integrates manual algorithms (linearSearch, insertionSort).
 * 4. Logs activity history for the Dashboard view.
 * -----------------------------------------------------
 */

import { Student } from "../models/Student.js";
import { Faculty } from "../models/Faculty.js";
import { Course } from "../models/Course.js";
import { Department } from "../models/Department.js";
import { getSampleDepartments } from "../data/sampleData.js";
import { linearSearch, linearSearchAll } from "../algorithms/search.js";
import { insertionSort } from "../algorithms/sort.js";

const STORAGE_KEY = "COLLEGE_DEPT_MGMT_DATA_V1";
const ACTIVITY_LOG_KEY = "COLLEGE_DEPT_MGMT_ACTIVITIES_V1";

export class DepartmentService {
    constructor() {
        this.departments = [];
        this.activeDepartmentId = null;
        this.activities = [];
        this.loadFromStorage();
    }

    // =====================================================
    // LOCALSTORAGE PERSISTENCE & CLASS RE-HYDRATION
    // =====================================================

    /**
     * Saves the current department state and activity logs to LocalStorage.
     */
    saveToStorage() {
        try {
            // Convert current department state to JSON string
            const jsonString = JSON.stringify(this.departments);
            localStorage.setItem(STORAGE_KEY, jsonString);

            // Store activity log
            localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(this.activities));
        } catch (error) {
            console.error("Error saving data to LocalStorage:", error);
        }
    }

    /**
     * Loads state from LocalStorage and RE-HYDRATES plain objects into full class instances.
     */
    loadFromStorage() {
        try {
            const rawData = localStorage.getItem(STORAGE_KEY);
            const rawActivities = localStorage.getItem(ACTIVITY_LOG_KEY);

            if (rawActivities) {
                this.activities = JSON.parse(rawActivities);
            } else {
                this.activities = [
                    { text: "System initialized with sample academic datasets.", timestamp: new Date().toLocaleTimeString() }
                ];
            }

            if (!rawData) {
                // Initialize with realistic sample data
                this.departments = getSampleDepartments();
                this.activeDepartmentId = this.departments[0].departmentId;
                this.saveToStorage();
                return;
            }

            const parsedDepartments = JSON.parse(rawData);

            // CLASS RE-HYDRATION: Reconstruct instances of Department, Student, Faculty, Course
            this.departments = parsedDepartments.map(deptObj => {
                // 1. Rehydrate Student instances
                const rehydratedStudents = (deptObj.students || []).map(s => new Student(
                    s.id,
                    s.name,
                    s.email,
                    s.phone,
                    s.rollNumber,
                    s.year,
                    s.program,
                    s.enrolledCourses || []
                ));

                // 2. Rehydrate Faculty instances
                const rehydratedFaculty = (deptObj.faculty || []).map(f => new Faculty(
                    f.id,
                    f.name,
                    f.email,
                    f.phone,
                    f.employeeId,
                    f.designation,
                    f.specialization,
                    f.assignedCourses || []
                ));

                // 3. Rehydrate Course instances
                const rehydratedCourses = (deptObj.courses || []).map(c => new Course(
                    c.courseId,
                    c.courseName,
                    c.credits,
                    c.faculty,
                    c.students || []
                ));

                // 4. Return complete Department instance
                return new Department(
                    deptObj.departmentId,
                    deptObj.departmentName,
                    deptObj.hod,
                    rehydratedStudents,
                    rehydratedFaculty,
                    rehydratedCourses
                );
            });

            if (this.departments.length > 0) {
                this.activeDepartmentId = this.departments[0].departmentId;
            }

        } catch (error) {
            console.error("Error loading or rehydrating LocalStorage data. Resetting to sample data.", error);
            this.departments = getSampleDepartments();
            this.activeDepartmentId = this.departments[0].departmentId;
            this.saveToStorage();
        }
    }

    /**
     * Resets data back to original sample data.
     */
    resetToSampleData() {
        this.departments = getSampleDepartments();
        this.activeDepartmentId = this.departments[0].departmentId;
        this.activities = [
            { text: "Reset system to initial sample dataset.", timestamp: new Date().toLocaleTimeString() }
        ];
        this.saveToStorage();
    }

    // =====================================================
    // DEPARTMENT MANAGEMENT
    // =====================================================

    getDepartments() {
        return this.departments;
    }

    getActiveDepartment() {
        if (!this.activeDepartmentId && this.departments.length > 0) {
            this.activeDepartmentId = this.departments[0].departmentId;
        }
        return this.departments.find(d => d.departmentId === this.activeDepartmentId) || this.departments[0] || null;
    }

    setActiveDepartment(departmentId) {
        const found = this.departments.find(d => d.departmentId === departmentId);
        if (found) {
            this.activeDepartmentId = departmentId;
            this.logActivity(`Selected active department: ${found.departmentName} (${found.departmentId})`);
            return true;
        }
        return false;
    }

    addDepartment(departmentId, departmentName, hod) {
        const existing = this.departments.find(d => d.departmentId.toLowerCase() === departmentId.toLowerCase());
        if (existing) {
            return { success: false, message: `Department code '${departmentId}' already exists.` };
        }

        const newDept = new Department(departmentId.toUpperCase(), departmentName, hod, [], [], []);
        this.departments.push(newDept);
        this.activeDepartmentId = newDept.departmentId;
        this.logActivity(`Department created: ${newDept.departmentName} (${newDept.departmentId})`);
        this.saveToStorage();
        return { success: true, message: `Department '${newDept.departmentName}' created successfully.` };
    }

    updateDepartment(departmentId, departmentName, hod) {
        const dept = this.departments.find(d => d.departmentId === departmentId);
        if (dept) {
            dept.departmentName = departmentName;
            dept.hod = hod;
            this.logActivity(`Updated department: ${dept.departmentName}`);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    deleteDepartment(departmentId) {
        const index = this.departments.findIndex(d => d.departmentId === departmentId);
        if (index !== -1) {
            const name = this.departments[index].departmentName;
            this.departments.splice(index, 1);
            if (this.activeDepartmentId === departmentId) {
                this.activeDepartmentId = this.departments.length > 0 ? this.departments[0].departmentId : null;
            }
            this.logActivity(`Deleted department: ${name} (${departmentId})`);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // =====================================================
    // STUDENT OPERATIONS (USING MANUAL ALGORITHMS)
    // =====================================================

    addStudent(studentData) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return { success: false, message: "No active department selected." };

        const newStudent = new Student(
            studentData.id,
            studentData.name,
            studentData.email,
            studentData.phone,
            studentData.rollNumber,
            studentData.year,
            studentData.program,
            []
        );

        const result = activeDept.addStudent(newStudent);
        if (result.success) {
            this.logActivity(`Added student: ${newStudent.name} (${newStudent.id}) to ${activeDept.departmentName}`);
            this.saveToStorage();
        }
        return result;
    }

    updateStudent(studentId, updatedData) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return false;

        const success = activeDept.updateStudent(studentId, updatedData);
        if (success) {
            this.logActivity(`Updated student details for ID: ${studentId}`);
            this.saveToStorage();
        }
        return success;
    }

    deleteStudent(studentId) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return false;

        const student = activeDept.findStudent(studentId, 'id');
        const studentName = student ? student.name : studentId;

        const success = activeDept.removeStudent(studentId);
        if (success) {
            this.logActivity(`Deleted student: ${studentName} (${studentId})`);
            this.saveToStorage();
        }
        return success;
    }

    /**
     * Executes Linear Search to filter students by search query.
     */
    searchStudents(query) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return [];
        return linearSearchAll(activeDept.students, query, ['id', 'name', 'rollNumber', 'program']);
    }

    /**
     * Executes manual Insertion Sort on Students by Name.
     */
    sortStudentsByName(ascending = true) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return [];

        // Call manual Insertion Sort algorithm
        insertionSort(activeDept.students, 'name', ascending);
        this.logActivity(`Sorted students in ${activeDept.departmentName} alphabetically using Insertion Sort`);
        this.saveToStorage();
        return activeDept.students;
    }

    // =====================================================
    // FACULTY OPERATIONS
    // =====================================================

    addFaculty(facultyData) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return { success: false, message: "No active department selected." };

        const newFaculty = new Faculty(
            facultyData.id,
            facultyData.name,
            facultyData.email,
            facultyData.phone,
            facultyData.employeeId,
            facultyData.designation,
            facultyData.specialization,
            []
        );

        const result = activeDept.addFaculty(newFaculty);
        if (result.success) {
            this.logActivity(`Added faculty member: ${newFaculty.name} (${newFaculty.id})`);
            this.saveToStorage();
        }
        return result;
    }

    updateFaculty(facultyId, updatedData) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return false;

        const success = activeDept.updateFaculty(facultyId, updatedData);
        if (success) {
            this.logActivity(`Updated faculty details for ID: ${facultyId}`);
            this.saveToStorage();
        }
        return success;
    }

    deleteFaculty(facultyId) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return false;

        const fac = activeDept.findFaculty(facultyId, 'id');
        const facName = fac ? fac.name : facultyId;

        const success = activeDept.removeFaculty(facultyId);
        if (success) {
            this.logActivity(`Deleted faculty: ${facName} (${facultyId})`);
            this.saveToStorage();
        }
        return success;
    }

    searchFaculty(query) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return [];
        return linearSearchAll(activeDept.faculty, query, ['id', 'name', 'employeeId', 'designation', 'specialization']);
    }

    // =====================================================
    // COURSE OPERATIONS
    // =====================================================

    addCourse(courseData) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return { success: false, message: "No active department selected." };

        const newCourse = new Course(
            courseData.courseId,
            courseData.courseName,
            courseData.credits,
            courseData.faculty || null,
            []
        );

        const result = activeDept.addCourse(newCourse);
        if (result.success) {
            this.logActivity(`Created course: ${newCourse.courseName} (${newCourse.courseId})`);
            this.saveToStorage();
        }
        return result;
    }

    updateCourse(courseId, updatedData) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return false;

        const success = activeDept.updateCourse(courseId, updatedData);
        if (success) {
            this.logActivity(`Updated course details for: ${courseId}`);
            this.saveToStorage();
        }
        return success;
    }

    deleteCourse(courseId) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return false;

        const course = activeDept.findCourse(courseId, 'courseId');
        const name = course ? course.courseName : courseId;

        const success = activeDept.removeCourse(courseId);
        if (success) {
            this.logActivity(`Deleted course: ${name} (${courseId})`);
            this.saveToStorage();
        }
        return success;
    }

    searchCourses(query) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return [];
        return linearSearchAll(activeDept.courses, query, ['courseId', 'courseName', 'faculty']);
    }

    // =====================================================
    // WORKFLOW SERVICES
    // =====================================================

    enrollStudentInCourse(studentId, courseId) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return { success: false, message: "No active department selected.", steps: [] };

        const result = activeDept.enrollStudentInCourse(studentId, courseId);
        if (result.success) {
            this.logActivity(`Enrolled student '${studentId}' in course '${courseId}'`);
            this.saveToStorage();
        }
        return result;
    }

    assignFacultyToCourse(facultyId, courseId) {
        const activeDept = this.getActiveDepartment();
        if (!activeDept) return { success: false, message: "No active department selected.", steps: [] };

        const result = activeDept.assignFacultyToCourse(facultyId, courseId);
        if (result.success) {
            this.logActivity(`Assigned faculty '${facultyId}' to course '${courseId}'`);
            this.saveToStorage();
        }
        return result;
    }

    // =====================================================
    // GLOBAL METRICS & ACTIVITIES
    // =====================================================

    getGlobalMetrics() {
        let totalDepts = this.departments.length;
        let totalStudents = 0;
        let totalFaculty = 0;
        let totalCourses = 0;

        this.departments.forEach(dept => {
            totalStudents += dept.students.length;
            totalFaculty += dept.faculty.length;
            totalCourses += dept.courses.length;
        });

        return {
            totalDepts,
            totalStudents,
            totalFaculty,
            totalCourses
        };
    }

    logActivity(text) {
        this.activities.unshift({
            text,
            timestamp: new Date().toLocaleTimeString()
        });

        if (this.activities.length > 20) {
            this.activities.pop();
        }
    }

    getRecentActivities() {
        return this.activities;
    }
}
