/**
 * Person.js
 * -----------------------------------------------------
 * ACADEMIC CONCEPT: Object-Oriented Programming (OOP) - Base Parent Class
 * 
 * Person serves as the base class in the inheritance hierarchy.
 * It encapsulates shared attributes common to all individuals in the college system
 * (both Students and Faculty).
 * 
 * Hierarchy:
 *         Person (Parent Class)
 *           |
 *      +----+----+
 *      |         |
 *   Student   Faculty
 * -----------------------------------------------------
 */

export class Person {
    /**
     * Constructs a new Person instance.
     * @param {string} id - Unique identifier
     * @param {string} name - Full name of the person
     * @param {string} email - Contact email address
     * @param {string} phone - Contact phone number
     */
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    /**
     * Returns a formatted summary string of the Person's details.
     * Can be overridden by subclasses (Polymorphism).
     * @returns {string} Details summary
     */
    getDetails() {
        return `ID: ${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone}`;
    }
}
