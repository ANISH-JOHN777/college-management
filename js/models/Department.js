/**
 * Department.js
 * -----------------------------------------------------
 * ACADEMIC CONCEPT: Aggregation & System Orchestration
 * 
 * Department acts as the container entity managing collections of:
 * - Student objects
 * - Faculty objects
 * - Course objects
 * 
 * Provides complete CRUD operations, record searching, relationship management,
 * and statistical aggregations.
 * -----------------------------------------------------
 */

import { linearSearch } from "../algorithms/search.js";

export class Department {
    /**
     * Constructs a Department instance.
     * @param {string} departmentId - Department code (e.g. IT, CSE, ECE)
     * @param {string} departmentName - Full department name (e.g. Information Technology)
     * @param {string} hod - Name of Head of Department (e.g. Dr. Kumar)
     * @param {Array<Student>} students - Collection of Student instances
     * @param {Array<Faculty>} faculty - Collection of Faculty instances
     * @param {Array<Course>} courses - Collection of Course instances
     */
    constructor(departmentId, departmentName, hod, students = [], faculty = [], courses = []) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.hod = hod;
        this.students = students;
        this.faculty = faculty;
        this.courses = courses;
    }

    // =====================================================
    // STUDENT CRUD & MANAGEMENT
    // =====================================================

    /**
     * Adds a new student to the department.
     * @param {Student} student - Student instance to add
     * @returns {{ success: boolean, message: string }}
     */
    addStudent(student) {
        // Prevent duplicate student IDs
        const existing = this.findStudent(student.id);
        if (existing) {
            return { success: false, message: `Student with ID '${student.id}' already exists in ${this.departmentName}.` };
        }
        this.students.push(student);
        return { success: true, message: `Student '${student.name}' added successfully to ${this.departmentName}.` };
    }

    /**
     * Removes a student by ID and updates enrolled courses.
     * @param {string} studentId - ID of student to remove
     * @returns {boolean} True if removed
     */
    removeStudent(studentId) {
        const index = this.students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            // Un-enroll student from all courses
            this.courses.forEach(course => course.removeStudent(studentId));
            this.students.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Updates details of an existing student.
     * @param {string} studentId - Student ID to update
     * @param {Object} updatedData - Object containing updated attributes
     * @returns {boolean} True if updated
     */
    updateStudent(studentId, updatedData) {
        const student = this.findStudent(studentId);
        if (student) {
            if (updatedData.name !== undefined) student.name = updatedData.name;
            if (updatedData.email !== undefined) student.email = updatedData.email;
            if (updatedData.phone !== undefined) student.phone = updatedData.phone;
            if (updatedData.rollNumber !== undefined) student.rollNumber = updatedData.rollNumber;
            if (updatedData.year !== undefined) student.year = Number(updatedData.year);
            if (updatedData.program !== undefined) student.program = updatedData.program;
            return true;
        }
        return false;
    }

    /**
     * Finds a student using manual Linear Search.
     * @param {string} target - ID or target value to search
     * @param {string} key - Attribute key ('id', 'name', 'rollNumber')
     * @returns {Student|null} Found student or null
     */
    findStudent(target, key = 'id') {
        return linearSearch(this.students, target, key);
    }

    // =====================================================
    // FACULTY CRUD & MANAGEMENT
    // =====================================================

    /**
     * Adds a new faculty member to the department.
     * @param {Faculty} facultyMember - Faculty instance
     * @returns {{ success: boolean, message: string }}
     */
    addFaculty(facultyMember) {
        const existing = this.findFaculty(facultyMember.id);
        if (existing) {
            return { success: false, message: `Faculty with ID '${facultyMember.id}' already exists.` };
        }
        this.faculty.push(facultyMember);
        return { success: true, message: `Faculty '${facultyMember.name}' added successfully.` };
    }

    /**
     * Removes a faculty member by ID and clears assigned courses.
     * @param {string} facultyId - Faculty ID to remove
     * @returns {boolean} True if removed
     */
    removeFaculty(facultyId) {
        const index = this.faculty.findIndex(f => f.id === facultyId);
        if (index !== -1) {
            // Clear faculty from assigned courses
            this.courses.forEach(course => {
                if (course.faculty === facultyId || course.faculty === this.faculty[index].name) {
                    course.faculty = null;
                }
            });
            this.faculty.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Updates details of an existing faculty member.
     * @param {string} facultyId - Faculty ID to update
     * @param {Object} updatedData - Object containing updated attributes
     * @returns {boolean} True if updated
     */
    updateFaculty(facultyId, updatedData) {
        const fac = this.findFaculty(facultyId);
        if (fac) {
            if (updatedData.name !== undefined) fac.name = updatedData.name;
            if (updatedData.email !== undefined) fac.email = updatedData.email;
            if (updatedData.phone !== undefined) fac.phone = updatedData.phone;
            if (updatedData.employeeId !== undefined) fac.employeeId = updatedData.employeeId;
            if (updatedData.designation !== undefined) fac.designation = updatedData.designation;
            if (updatedData.specialization !== undefined) fac.specialization = updatedData.specialization;
            return true;
        }
        return false;
    }

    /**
     * Finds a faculty member using manual Linear Search.
     * @param {string} target - ID or target value
     * @param {string} key - Attribute key ('id', 'name', 'employeeId')
     * @returns {Faculty|null} Found faculty or null
     */
    findFaculty(target, key = 'id') {
        return linearSearch(this.faculty, target, key);
    }

    // =====================================================
    // COURSE CRUD & MANAGEMENT
    // =====================================================

    /**
     * Adds a new course to the department.
     * @param {Course} course - Course instance to add
     * @returns {{ success: boolean, message: string }}
     */
    addCourse(course) {
        const existing = this.findCourse(course.courseId);
        if (existing) {
            return { success: false, message: `Course '${course.courseId}' already exists.` };
        }
        this.courses.push(course);
        return { success: true, message: `Course '${course.courseName}' added successfully.` };
    }

    /**
     * Removes a course by courseId and updates associated students & faculty.
     * @param {string} courseId - Course ID to remove
     * @returns {boolean} True if removed
     */
    removeCourse(courseId) {
        const index = this.courses.findIndex(c => c.courseId === courseId);
        if (index !== -1) {
            // Remove course from students' enrolled list
            this.students.forEach(s => s.removeCourse(courseId));
            // Remove course from faculty assigned list
            this.faculty.forEach(f => f.removeCourse(courseId));
            this.courses.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Updates details of an existing course.
     * @param {string} courseId - Course ID to update
     * @param {Object} updatedData - Object containing updated attributes
     * @returns {boolean} True if updated
     */
    updateCourse(courseId, updatedData) {
        const course = this.findCourse(courseId, 'courseId');
        if (course) {
            if (updatedData.courseName !== undefined) course.courseName = updatedData.courseName;
            if (updatedData.credits !== undefined) course.credits = Number(updatedData.credits);
            if (updatedData.faculty !== undefined) course.faculty = updatedData.faculty;
            return true;
        }
        return false;
    }

    /**
     * Finds a course using manual Linear Search.
     * @param {string} target - Course ID or Course Name
     * @param {string} key - Attribute key ('courseId', 'courseName')
     * @returns {Course|null} Found course or null
     */
    findCourse(target, key = 'courseId') {
        return linearSearch(this.courses, target, key);
    }

    // =====================================================
    // WORKFLOW & PROCESS LOGIC
    // =====================================================

    /**
     * Enrolls a student into a course with multi-step validation.
     * WORKFLOW:
     * 1. Find student
     * 2. Find course
     * 3. Check duplicate enrollment
     * 4. Update Course & Student state
     * @param {string} studentId - Student ID
     * @param {string} courseId - Course ID
     * @returns {{ success: boolean, message: string, steps: Array<string> }} Detailed workflow steps and outcome
     */
    enrollStudentInCourse(studentId, courseId) {
        const steps = [];

        steps.push(`Step 1: Searching for Student ID '${studentId}' via Linear Search...`);
        const student = this.findStudent(studentId, 'id');
        if (!student) {
            steps.push(`FAILED: Student '${studentId}' not found in department records.`);
            return { success: false, message: `Student '${studentId}' not found.`, steps };
        }
        steps.push(`✓ Step 1 Success: Student '${student.name}' (${student.id}) found.`);

        steps.push(`Step 2: Searching for Course ID '${courseId}' via Linear Search...`);
        const course = this.findCourse(courseId, 'courseId');
        if (!course) {
            steps.push(`FAILED: Course '${courseId}' not found in department records.`);
            return { success: false, message: `Course '${courseId}' not found.`, steps };
        }
        steps.push(`✓ Step 2 Success: Course '${course.courseName}' (${course.courseId}) found.`);

        steps.push(`Step 3: Performing linear membership duplicate enrollment check...`);
        const enrollmentResult = course.enrollStudent(student.id);

        if (!enrollmentResult.success) {
            steps.push(`FAILED: ${enrollmentResult.message}`);
            return { success: false, message: enrollmentResult.message, steps };
        }

        steps.push(`✓ Step 3 Success: Duplicate check passed. Student is not currently enrolled.`);

        steps.push(`Step 4: Updating Student's enrolled course registry...`);
        student.enrollCourse(course.courseId);
        steps.push(`✓ Step 4 Success: Course '${course.courseId}' added to Student '${student.id}'.`);

        steps.push(`Step 5: Operation complete. Saving state to persistence layer.`);

        return {
            success: true,
            message: `Successfully enrolled ${student.name} into ${course.courseName}.`,
            steps
        };
    }

    /**
     * Assigns a faculty member to teach a course.
     * @param {string} facultyId - Faculty ID
     * @param {string} courseId - Course ID
     * @returns {{ success: boolean, message: string, steps: Array<string> }}
     */
    assignFacultyToCourse(facultyId, courseId) {
        const steps = [];

        steps.push(`Step 1: Finding Faculty ID '${facultyId}' via Linear Search...`);
        const facultyMember = this.findFaculty(facultyId, 'id');
        if (!facultyMember) {
            steps.push(`FAILED: Faculty '${facultyId}' not found.`);
            return { success: false, message: `Faculty '${facultyId}' not found.`, steps };
        }
        steps.push(`✓ Step 1 Success: Faculty '${facultyMember.name}' found.`);

        steps.push(`Step 2: Finding Course ID '${courseId}' via Linear Search...`);
        const course = this.findCourse(courseId, 'courseId');
        if (!course) {
            steps.push(`FAILED: Course '${courseId}' not found.`);
            return { success: false, message: `Course '${courseId}' not found.`, steps };
        }
        steps.push(`✓ Step 2 Success: Course '${course.courseName}' found.`);

        steps.push(`Step 3: Assigning Faculty to Course and Course to Faculty...`);
        course.assignFaculty(facultyMember.id);
        facultyMember.assignCourse(course.courseId);
        steps.push(`✓ Step 3 Success: '${facultyMember.name}' assigned to teach '${course.courseName}'.`);

        return {
            success: true,
            message: `Faculty '${facultyMember.name}' assigned to '${course.courseName}'.`,
            steps
        };
    }

    // =====================================================
    // STATISTICS
    // =====================================================

    /**
     * Calculates summary metrics for the department.
     * @returns {Object} Metric counts and breakdown
     */
    getStatistics() {
        const totalStudents = this.students.length;
        const totalFaculty = this.faculty.length;
        const totalCourses = this.courses.length;
        
        let totalEnrollments = 0;
        this.courses.forEach(c => {
            totalEnrollments += c.students.length;
        });

        return {
            departmentId: this.departmentId,
            departmentName: this.departmentName,
            hod: this.hod,
            totalStudents,
            totalFaculty,
            totalCourses,
            totalEnrollments,
            avgEnrollmentPerCourse: totalCourses > 0 ? (totalEnrollments / totalCourses).toFixed(1) : 0
        };
    }
}
