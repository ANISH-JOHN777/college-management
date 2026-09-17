/**
 * Course.js
 * -----------------------------------------------------
 * ACADEMIC CONCEPT: Encapsulation & Domain Modeling
 * 
 * Represents an academic subject/course offered by a department.
 * Manages relationships between Faculty (instructors) and Students (enrollees).
 * Prevents duplicate student enrollment via linear verification.
 * -----------------------------------------------------
 */

export class Course {
    /**
     * Constructs a Course instance.
     * @param {string} courseId - Unique course code (e.g. CS301)
     * @param {string} courseName - Full course name (e.g. Data Structures)
     * @param {number|string} credits - Academic credits (e.g. 4)
     * @param {string} faculty - Faculty ID assigned to teach this course (or null)
     * @param {Array<string>} students - Array of enrolled student IDs
     */
    constructor(courseId, courseName, credits, faculty = null, students = []) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.credits = Number(credits);
        this.faculty = faculty;
        this.students = Array.isArray(students) ? students : [];
    }

    /**
     * Assigns a faculty member to teach this course.
     * @param {string} facultyId - Employee ID or Person ID of faculty
     */
    assignFaculty(facultyId) {
        this.faculty = facultyId;
    }

    /**
     * Enrolls a student in the course.
     * PREVENTS DUPLICATE ENROLLMENT (Academic Check: O(n) linear search check).
     * @param {string} studentId - Student ID to enroll
     * @returns {{ success: boolean, message: string }} Enrollment status result
     */
    enrollStudent(studentId) {
        // Linear membership check to prevent duplicate enrollment
        let isEnrolled = false;
        for (let i = 0; i < this.students.length; i++) {
            if (this.students[i] === studentId) {
                isEnrolled = true;
                break;
            }
        }

        if (isEnrolled) {
            return {
                success: false,
                message: `Student '${studentId}' is ALREADY enrolled in course '${this.courseId}'.`
            };
        }

        this.students.push(studentId);
        return {
            success: true,
            message: `Student '${studentId}' successfully enrolled in course '${this.courseId}'.`
        };
    }

    /**
     * Removes a student from this course.
     * @param {string} studentId - Student ID to remove
     * @returns {boolean} True if removed, false if student was not enrolled
     */
    removeStudent(studentId) {
        const index = this.students.indexOf(studentId);
        if (index !== -1) {
            this.students.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Returns course details summary.
     * @returns {string} Course summary string
     */
    getDetails() {
        return `Course ID: ${this.courseId} | Name: ${this.courseName} | Credits: ${this.credits} | Instructor: ${this.faculty || 'Unassigned'} | Enrolled Students Count: ${this.students.length}`;
    }
}
