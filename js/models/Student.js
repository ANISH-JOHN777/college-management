/**
 * Student.js
 * -----------------------------------------------------
 * ACADEMIC CONCEPT: Inheritance & Method Overriding (Polymorphism)
 * 
 * Student EXTENDS Person (Inheritance).
 * - Inherits properties: id, name, email, phone
 * - Inherits methods: getDetails()
 * - Adds specific properties: rollNumber, year, program, enrolledCourses
 * - Adds specific methods: enrollCourse(), removeCourse()
 * -----------------------------------------------------
 */

import { Person } from "./Person.js";

export class Student extends Person {
    /**
     * Constructs a Student instance, initializing inherited Person attributes via super().
     * @param {string} id - Unique identifier (e.g. S001)
     * @param {string} name - Full name
     * @param {string} email - Email address
     * @param {string} phone - Phone number
     * @param {string} rollNumber - Academic roll number (e.g. 23IT001)
     * @param {number|string} year - Academic year (e.g. 3)
     * @param {string} program - Academic program (e.g. B.Tech IT)
     * @param {Array<string>} enrolledCourses - List of enrolled course IDs
     */
    constructor(id, name, email, phone, rollNumber, year, program, enrolledCourses = []) {
        // INHERITANCE: Calling the parent class (Person) constructor
        super(id, name, email, phone);

        // Student-specific attributes
        this.rollNumber = rollNumber;
        this.year = Number(year);
        this.program = program;
        this.enrolledCourses = Array.isArray(enrolledCourses) ? enrolledCourses : [];
    }

    /**
     * Enrolls the student in a course if not already enrolled.
     * @param {string} courseId - Course ID to enroll in
     * @returns {boolean} True if enrolled, false if already present
     */
    enrollCourse(courseId) {
        if (!this.enrolledCourses.includes(courseId)) {
            this.enrolledCourses.push(courseId);
            return true;
        }
        return false;
    }

    /**
     * Removes a course from the student's enrolled list.
     * @param {string} courseId - Course ID to remove
     * @returns {boolean} True if removed, false if not found
     */
    removeCourse(courseId) {
        const index = this.enrolledCourses.indexOf(courseId);
        if (index !== -1) {
            this.enrolledCourses.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * POLYMORPHISM: Overriding getDetails() from parent Person class.
     * Uses super.getDetails() to include parent info and append Student info.
     * @returns {string} Comprehensive student details
     */
    getDetails() {
        const parentDetails = super.getDetails();
        return `${parentDetails} | Roll No: ${this.rollNumber} | Year: ${this.year} | Program: ${this.program} | Enrolled Courses: [${this.enrolledCourses.join(", ")}]`;
    }
}
