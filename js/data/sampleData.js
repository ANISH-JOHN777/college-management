/**
 * sampleData.js
 * -----------------------------------------------------
 * ACADEMIC DATA LAYER: Initial Sample Seed Data
 * 
 * Provides pre-populated realistic data for testing:
 * - Departments: IT, CSE, ECE
 * - Students, Faculty, Courses with established enrollments & assignments
 * -----------------------------------------------------
 */

import { Student } from "../models/Student.js";
import { Faculty } from "../models/Faculty.js";
import { Course } from "../models/Course.js";
import { Department } from "../models/Department.js";

export function getSampleDepartments() {
    // -----------------------------------------------------
    // 1. INFORMATION TECHNOLOGY (IT) DEPARTMENT
    // -----------------------------------------------------
    const itStudents = [
        new Student("S001", "Anish John", "anish.john@college.edu", "9876543210", "23IT001", 3, "B.Tech IT", ["CS301", "CS302"]),
        new Student("S002", "Rahul Kumar", "rahul.kumar@college.edu", "9876543211", "23IT002", 3, "B.Tech IT", ["CS301"]),
        new Student("S003", "Priya S", "priya.s@college.edu", "9876543212", "24IT003", 2, "B.Tech IT", ["CS302", "CS303"]),
        new Student("S004", "Karthik M", "karthik.m@college.edu", "9876543213", "24IT004", 2, "B.Tech IT", ["CS301", "CS303"])
    ];

    const itFaculty = [
        new Faculty("F001", "Dr. Kumar", "dr.kumar@college.edu", "9123456780", "EMP001", "Professor", "Data Structures", ["CS301"]),
        new Faculty("F002", "Ms. Divya", "divya@college.edu", "9123456781", "EMP002", "Assistant Professor", "Web Technology", ["CS302", "CS303"])
    ];

    const itCourses = [
        new Course("CS301", "Data Structures", 4, "F001", ["S001", "S002", "S004"]),
        new Course("CS302", "Web Technology", 3, "F002", ["S001", "S003"]),
        new Course("CS303", "Database Management", 4, "F002", ["S003", "S004"])
    ];

    const itDepartment = new Department(
        "IT",
        "Information Technology",
        "Dr. Kumar",
        itStudents,
        itFaculty,
        itCourses
    );

    // -----------------------------------------------------
    // 2. COMPUTER SCIENCE & ENGINEERING (CSE) DEPARTMENT
    // -----------------------------------------------------
    const cseStudents = [
        new Student("S101", "Arun V", "arun.v@college.edu", "9876543220", "22CSE01", 4, "B.Tech CSE", ["CSE401"]),
        new Student("S102", "Bhavna R", "bhavna.r@college.edu", "9876543221", "23CSE02", 3, "B.Tech CSE", ["CSE401", "CSE402"]),
        new Student("S103", "Deepak N", "deepak.n@college.edu", "9876543222", "24CSE03", 2, "B.Tech CSE", ["CSE402"])
    ];

    const cseFaculty = [
        new Faculty("F101", "Dr. Raman", "dr.raman@college.edu", "9123456790", "EMP101", "HOD & Professor", "Artificial Intelligence", ["CSE401"]),
        new Faculty("F102", "Mr. Suresh", "suresh@college.edu", "9123456791", "EMP102", "Associate Professor", "Computer Networks", ["CSE402"])
    ];

    const cseCourses = [
        new Course("CSE401", "Artificial Intelligence", 4, "F101", ["S101", "S102"]),
        new Course("CSE402", "Computer Networks", 3, "F102", ["S102", "S103"])
    ];

    const cseDepartment = new Department(
        "CSE",
        "Computer Science & Engineering",
        "Dr. Raman",
        cseStudents,
        cseFaculty,
        cseCourses
    );

    // -----------------------------------------------------
    // 3. ELECTRONICS & COMMUNICATION (ECE) DEPARTMENT
    // -----------------------------------------------------
    const eceStudents = [
        new Student("S201", "Gautam P", "gautam.p@college.edu", "9876543230", "23ECE01", 3, "B.Tech ECE", ["ECE301"]),
        new Student("S202", "Hema K", "hema.k@college.edu", "9876543231", "24ECE02", 2, "B.Tech ECE", ["ECE301"])
    ];

    const eceFaculty = [
        new Faculty("F201", "Dr. Swathi", "swathi@college.edu", "9123456795", "EMP201", "Professor", "Digital Signal Processing", ["ECE301"])
    ];

    const eceCourses = [
        new Course("ECE301", "Digital Signal Processing", 4, "F201", ["S201", "S202"])
    ];

    const eceDepartment = new Department(
        "ECE",
        "Electronics & Communication",
        "Dr. Swathi",
        eceStudents,
        eceFaculty,
        eceCourses
    );

    return [itDepartment, cseDepartment, eceDepartment];
}
