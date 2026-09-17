/**
 * Faculty.js
 * -----------------------------------------------------
 * ACADEMIC CONCEPT: Inheritance & Method Overriding (Polymorphism)
 * 
 * Faculty EXTENDS Person (Inheritance).
 * - Inherits properties: id, name, email, phone
 * - Inherits methods: getDetails()
 * - Adds specific properties: employeeId, designation, specialization, assignedCourses
 * - Adds specific methods: assignCourse(), removeCourse()
 * -----------------------------------------------------
 */

import { Person } from "./Person.js";

export class Faculty extends Person {
    /**
     * Constructs a Faculty instance, passing base person info to super().
     * @param {string} id - Unique identifier (e.g. F001)
     * @param {string} name - Faculty member name
     * @param {string} email - Email address
     * @param {string} phone - Phone number
     * @param {string} employeeId - Academic Employee ID (e.g. EMP001)
     * @param {string} designation - Position (e.g. Professor, Assistant Professor)
     * @param {string} specialization - Area of expertise (e.g. Data Structures, Web Technology)
     * @param {Array<string>} assignedCourses - List of course IDs taught
     */
    constructor(id, name, email, phone, employeeId, designation, specialization, assignedCourses = []) {
        // INHERITANCE: Call parent class Person constructor
        super(id, name, email, phone);

        // Faculty-specific attributes
        this.employeeId = employeeId;
        this.designation = designation;
        this.specialization = specialization;
        this.assignedCourses = Array.isArray(assignedCourses) ? assignedCourses : [];
    }

    /**
     * Assigns a course to this faculty member.
     * @param {string} courseId - Course ID to assign
     * @returns {boolean} True if assigned, false if already assigned
     */
    assignCourse(courseId) {
        if (!this.assignedCourses.includes(courseId)) {
            this.assignedCourses.push(courseId);
            return true;
        }
        return false;
    }

    /**
     * Unassigns a course from this faculty member.
     * @param {string} courseId - Course ID to unassign
     * @returns {boolean} True if unassigned, false if not found
     */
    removeCourse(courseId) {
        const index = this.assignedCourses.indexOf(courseId);
        if (index !== -1) {
            this.assignedCourses.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * POLYMORPHISM: Overriding getDetails() from parent Person class.
     * @returns {string} Detailed faculty info summary
     */
    getDetails() {
        const parentDetails = super.getDetails();
        return `${parentDetails} | Emp ID: ${this.employeeId} | Designation: ${this.designation} | Specialization: ${this.specialization} | Assigned Courses: [${this.assignedCourses.join(", ")}]`;
    }
}
