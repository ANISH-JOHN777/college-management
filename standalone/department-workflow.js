/**
 * standalone/department-workflow.js
 * =====================================================
 * STANDALONE NODE.JS CLI APPLICATION
 * -----------------------------------------------------
 * Demonstrates the College Department Management System
 * independently in the terminal using native Node.js modules.
 * 
 * Run using:
 * node standalone/department-workflow.js
 * =====================================================
 */

const readline = require('readline');

// =====================================================
// 1. CLASS HIERARCHY
// =====================================================

/**
 * Base Parent Class: Person
 */
class Person {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    getDetails() {
        return `ID: ${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone}`;
    }
}

/**
 * Student EXTENDS Person (Inheritance)
 */
class Student extends Person {
    constructor(id, name, email, phone, rollNumber, year, program, enrolledCourses = []) {
        super(id, name, email, phone);
        this.rollNumber = rollNumber;
        this.year = Number(year);
        this.program = program;
        this.enrolledCourses = enrolledCourses;
    }

    enrollCourse(courseId) {
        if (!this.enrolledCourses.includes(courseId)) {
            this.enrolledCourses.push(courseId);
            return true;
        }
        return false;
    }

    getDetails() {
        return `${super.getDetails()} | Roll No: ${this.rollNumber} | Year: ${this.year} | Program: ${this.program} | Enrolled: [${this.enrolledCourses.join(', ')}]`;
    }
}

/**
 * Faculty EXTENDS Person (Inheritance)
 */
class Faculty extends Person {
    constructor(id, name, email, phone, employeeId, designation, specialization, assignedCourses = []) {
        super(id, name, email, phone);
        this.employeeId = employeeId;
        this.designation = designation;
        this.specialization = specialization;
        this.assignedCourses = assignedCourses;
    }

    assignCourse(courseId) {
        if (!this.assignedCourses.includes(courseId)) {
            this.assignedCourses.push(courseId);
            return true;
        }
        return false;
    }

    getDetails() {
        return `${super.getDetails()} | Emp ID: ${this.employeeId} | Designation: ${this.designation} | Spec: ${this.specialization} | Assigned: [${this.assignedCourses.join(', ')}]`;
    }
}

/**
 * Course Class
 */
class Course {
    constructor(courseId, courseName, credits, faculty = null, students = []) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.credits = Number(credits);
        this.faculty = faculty;
        this.students = students;
    }

    enrollStudent(studentId) {
        for (let i = 0; i < this.students.length; i++) {
            if (this.students[i] === studentId) {
                return { success: false, message: `Student '${studentId}' is already enrolled.` };
            }
        }
        this.students.push(studentId);
        return { success: true, message: `Student '${studentId}' successfully enrolled.` };
    }

    getDetails() {
        return `Course ID: ${this.courseId} | Name: ${this.courseName} | Credits: ${this.credits} | Faculty: ${this.faculty || 'Unassigned'} | Enrolled: ${this.students.length}`;
    }
}

/**
 * Department Container Class
 */
class Department {
    constructor(departmentId, departmentName, hod) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.hod = hod;
        this.students = [];
        this.faculty = [];
        this.courses = [];
    }

    addStudent(student) {
        if (this.findStudent(student.id)) return false;
        this.students.push(student);
        return true;
    }

    addFaculty(fac) {
        if (this.findFaculty(fac.id)) return false;
        this.faculty.push(fac);
        return true;
    }

    addCourse(course) {
        if (this.findCourse(course.courseId)) return false;
        this.courses.push(course);
        return true;
    }

    findStudent(idOrName) {
        return linearSearch(this.students, idOrName, 'id') || linearSearch(this.students, idOrName, 'name');
    }

    findFaculty(idOrName) {
        return linearSearch(this.faculty, idOrName, 'id') || linearSearch(this.faculty, idOrName, 'name') || linearSearch(this.faculty, idOrName, 'employeeId');
    }

    findCourse(idOrName) {
        return linearSearch(this.courses, idOrName, 'courseId') || linearSearch(this.courses, idOrName, 'courseName');
    }
}

// =====================================================
// 2. MANUAL ALGORITHMS
// =====================================================

function linearSearch(array, target, key) {
    if (!Array.isArray(array)) return null;
    const searchVal = String(target).toLowerCase().trim();

    for (let i = 0; i < array.length; i++) {
        const val = String(array[i][key] || '').toLowerCase().trim();
        if (val === searchVal || val.includes(searchVal)) {
            return array[i];
        }
    }
    return null;
}

function insertionSortStudentsByName(students) {
    const n = students.length;
    for (let i = 1; i < n; i++) {
        const currentStudent = students[i];
        const currentName = currentStudent.name.toLowerCase();
        let j = i - 1;

        while (j >= 0 && students[j].name.toLowerCase().localeCompare(currentName) > 0) {
            students[j + 1] = students[j];
            j = j - 1;
        }
        students[j + 1] = currentStudent;
    }
    return students;
}

// =====================================================
// 3. SAMPLE DATA SEEDING
// =====================================================

function seedSampleDepartment() {
    const dept = new Department("IT", "Information Technology", "Dr. Kumar");

    const s1 = new Student("S001", "Anish John", "anish@college.edu", "9876543210", "23IT001", 3, "B.Tech IT", ["CS301"]);
    const s2 = new Student("S002", "Rahul Kumar", "rahul@college.edu", "9876543211", "23IT002", 3, "B.Tech IT", []);
    const s3 = new Student("S003", "Priya S", "priya@college.edu", "9876543212", "24IT003", 2, "B.Tech IT", ["CS302"]);

    const f1 = new Faculty("F001", "Dr. Kumar", "kumar@college.edu", "9123456780", "EMP001", "Professor", "Data Structures", ["CS301"]);
    const f2 = new Faculty("F002", "Ms. Divya", "divya@college.edu", "9123456781", "EMP002", "Assistant Professor", "Web Tech", ["CS302"]);

    const c1 = new Course("CS301", "Data Structures", 4, "F001", ["S001"]);
    const c2 = new Course("CS302", "Web Technology", 3, "F002", ["S003"]);

    dept.addStudent(s1);
    dept.addStudent(s2);
    dept.addStudent(s3);

    dept.addFaculty(f1);
    dept.addFaculty(f2);

    dept.addCourse(c1);
    dept.addCourse(c2);

    return dept;
}

// =====================================================
// 4. READLINE INTERACTIVE CLI
// =====================================================

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const dept = seedSampleDepartment();

function printHeader() {
    console.log("\n=============================================");
    console.log("COLLEGE DEPARTMENT MANAGEMENT SYSTEM");
    console.log(`Department: ${dept.departmentName} (${dept.departmentId}) | HOD: ${dept.hod}`);
    console.log("=============================================");
    console.log("1. Add Student");
    console.log("2. Add Faculty");
    console.log("3. Add Course");
    console.log("4. Search Student (Linear Search)");
    console.log("5. Search Faculty (Linear Search)");
    console.log("6. Search Course (Linear Search)");
    console.log("7. Enroll Student in Course (Workflow)");
    console.log("8. Assign Faculty to Course (Workflow)");
    console.log("9. Display Department Details");
    console.log("10. Sort Students by Name (Insertion Sort)");
    console.log("0. Exit");
    console.log("---------------------------------------------");
}

async function mainLoop() {
    let running = true;

    while (running) {
        printHeader();
        const choice = (await question("Enter choice: ")).trim();

        switch (choice) {
            case '1':
                await handleAddStudent();
                break;
            case '2':
                await handleAddFaculty();
                break;
            case '3':
                await handleAddCourse();
                break;
            case '4':
                await handleSearchStudent();
                break;
            case '5':
                await handleSearchFaculty();
                break;
            case '6':
                await handleSearchCourse();
                break;
            case '7':
                await handleEnrollStudent();
                break;
            case '8':
                await handleAssignFaculty();
                break;
            case '9':
                handleDisplayDepartment();
                break;
            case '10':
                handleSortStudents();
                break;
            case '0':
                console.log("\nExiting system. Goodbye!");
                running = false;
                rl.close();
                process.exit(0);
                break;
            default:
                console.log("\nInvalid choice. Please select 0 to 10.");
                break;
        }

        if (running) {
            await question("\nPress Enter to return to main menu...");
        }
    }
}

async function handleAddStudent() {
    console.log("\n--- Add Student ---");
    const id = await question("Student ID (e.g. S004): ");
    const name = await question("Full Name: ");
    const roll = await question("Roll Number (e.g. 23IT004): ");
    const year = await question("Year (1-4): ");
    const prog = await question("Program: ");
    const email = await question("Email: ");
    const phone = await question("Phone: ");

    const st = new Student(id, name, email, phone, roll, year, prog, []);
    const added = dept.addStudent(st);

    if (added) {
        console.log(`\n[OK] Student '${name}' added successfully.`);
    } else {
        console.log(`\n[ERR] Student ID '${id}' already exists.`);
    }
}

async function handleAddFaculty() {
    console.log("\n--- Add Faculty ---");
    const id = await question("Faculty ID (e.g. F003): ");
    const empId = await question("Employee ID (e.g. EMP003): ");
    const name = await question("Full Name: ");
    const desig = await question("Designation: ");
    const spec = await question("Specialization: ");
    const email = await question("Email: ");
    const phone = await question("Phone: ");

    const fac = new Faculty(id, name, email, phone, empId, desig, spec, []);
    const added = dept.addFaculty(fac);

    if (added) {
        console.log(`\n[OK] Faculty '${name}' added successfully.`);
    } else {
        console.log(`\n[ERR] Faculty ID '${id}' already exists.`);
    }
}

async function handleAddCourse() {
    console.log("\n--- Add Course ---");
    const id = await question("Course ID (e.g. CS303): ");
    const name = await question("Course Name: ");
    const credits = await question("Credits: ");

    const crs = new Course(id, name, credits, null, []);
    const added = dept.addCourse(crs);

    if (added) {
        console.log(`\n[OK] Course '${name}' added successfully.`);
    } else {
        console.log(`\n[ERR] Course ID '${id}' already exists.`);
    }
}

async function handleSearchStudent() {
    console.log("\n--- Search Student (Linear Search) ---");
    const query = await question("Enter Student ID or Name: ");
    console.log("Searching record via Linear Search...");
    const found = dept.findStudent(query);

    if (found) {
        console.log("\n[OK] Record Found:");
        console.log(found.getDetails());
    } else {
        console.log("\n[ERR] Student record not found.");
    }
}

async function handleSearchFaculty() {
    console.log("\n--- Search Faculty (Linear Search) ---");
    const query = await question("Enter Faculty ID, Employee ID or Name: ");
    console.log("Searching record via Linear Search...");
    const found = dept.findFaculty(query);

    if (found) {
        console.log("\n[OK] Record Found:");
        console.log(found.getDetails());
    } else {
        console.log("\n[ERR] Faculty record not found.");
    }
}

async function handleSearchCourse() {
    console.log("\n--- Search Course (Linear Search) ---");
    const query = await question("Enter Course ID or Course Name: ");
    console.log("Searching record via Linear Search...");
    const found = dept.findCourse(query);

    if (found) {
        console.log("\n[OK] Record Found:");
        console.log(found.getDetails());
    } else {
        console.log("\n[ERR] Course record not found.");
    }
}

async function handleEnrollStudent() {
    console.log("\n--- Enroll Student Workflow ---");
    const studentId = await question("Student ID: ");
    const courseId = await question("Course ID: ");

    console.log("\nStep 1: Finding student via Linear Search...");
    const student = dept.findStudent(studentId);
    if (!student) {
        console.log("[ERR] Student not found.");
        return;
    }
    console.log(`[OK] Student found: ${student.name}`);

    console.log("Step 2: Finding course via Linear Search...");
    const course = dept.findCourse(courseId);
    if (!course) {
        console.log("[ERR] Course not found.");
        return;
    }
    console.log(`[OK] Course found: ${course.courseName}`);

    console.log("Step 3: Checking duplicate enrollment...");
    const res = course.enrollStudent(student.id);

    if (!res.success) {
        console.log(`[ERR] ${res.message}`);
        return;
    }

    student.enrollCourse(course.courseId);
    console.log(`[OK] Enrollment successful: ${student.name} enrolled in ${course.courseName}.`);
}

async function handleAssignFaculty() {
    console.log("\n--- Assign Faculty Workflow ---");
    const facId = await question("Faculty ID: ");
    const courseId = await question("Course ID: ");

    console.log("\nStep 1: Finding faculty via Linear Search...");
    const faculty = dept.findFaculty(facId);
    if (!faculty) {
        console.log("[ERR] Faculty member not found.");
        return;
    }
    console.log(`[OK] Faculty found: ${faculty.name}`);

    console.log("Step 2: Finding course via Linear Search...");
    const course = dept.findCourse(courseId);
    if (!course) {
        console.log("[ERR] Course not found.");
        return;
    }
    console.log(`[OK] Course found: ${course.courseName}`);

    course.faculty = faculty.id;
    faculty.assignCourse(course.courseId);
    console.log(`[OK] Assignment successful: '${faculty.name}' assigned to teach '${course.courseName}'.`);
}

function handleDisplayDepartment() {
    console.log("\n=============================================");
    console.log(`DEPARTMENT SUMMARY: ${dept.departmentName} (${dept.departmentId})`);
    console.log(`HOD: ${dept.hod}`);
    console.log("=============================================");

    console.log(`\n--- STUDENTS (${dept.students.length}) ---`);
    dept.students.forEach((s, i) => console.log(`${i + 1}. ${s.getDetails()}`));

    console.log(`\n--- FACULTY (${dept.faculty.length}) ---`);
    dept.faculty.forEach((f, i) => console.log(`${i + 1}. ${f.getDetails()}`));

    console.log(`\n--- COURSES (${dept.courses.length}) ---`);
    dept.courses.forEach((c, i) => console.log(`${i + 1}. ${c.getDetails()}`));
}

function handleSortStudents() {
    console.log("\n--- Sort Students by Name (Manual Insertion Sort) ---");
    console.log("Sorting students array...");

    insertionSortStudentsByName(dept.students);

    console.log("[OK] Sorted student list:");
    dept.students.forEach((s, idx) => console.log(`${idx + 1}. ${s.name} (${s.id})`));
}

mainLoop();
