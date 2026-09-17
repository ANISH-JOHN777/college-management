# College Department Management System

A clean, modular web application and standalone Node.js program developed to demonstrate Object-Oriented Programming (OOP), manual searching and sorting algorithms, process workflows, and data persistence in JavaScript.

---

## 1. Project Objective

The system manages academic department records including Students, Faculty, Courses, and Department statistics:

1. **Classes & Objects**: Encapsulates data and logic in modular domain models.
2. **Inheritance**: `Person` base parent class extended by `Student` and `Faculty` subclasses.
3. **ES Modules**: Code organized into `models/`, `algorithms/`, `data/`, and `services/`.
4. **CRUD Operations**: Full Create, Read, Update, Delete functionality.
5. **Manual Linear Search**: Sequential record matching with $O(n)$ time complexity.
6. **Manual Insertion Sort**: In-place alphabetical student sorting without calling `Array.prototype.sort()`.
7. **Workflows**: Step-by-step pipeline execution for course enrollment and faculty assignments.
8. **Class Re-hydration**: LocalStorage deserialization that reconstructs prototype class instances so methods persist across page refreshes.

---

## 2. Project Structure

```
college-management-system/
│
├── index.html                  # Responsive light theme UI layout
├── style.css                   # Custom CSS design system (Light Academic Theme)
├── server.js                   # Lightweight static HTTP server
│
├── js/
│   ├── models/
│   │   ├── Person.js           # Base parent class (id, name, email, phone, getDetails)
│   │   ├── Student.js          # Subclass extending Person
│   │   ├── Faculty.js          # Subclass extending Person
│   │   ├── Course.js           # Course model with duplicate check
│   │   └── Department.js       # Container class for CRUD, search, sort, and stats
│   │
│   ├── algorithms/
│   │   ├── search.js           # Manual Linear Search & membership algorithms
│   │   └── sort.js             # Manual Insertion Sort algorithm
│   │
│   ├── data/
│   │   └── sampleData.js       # Pre-populated initial academic sample data
│   │
│   ├── services/
│   │   └── DepartmentService.js# State management & LocalStorage re-hydration
│   │
│   └── app.js                  # Main controller & UI event bindings
│
├── standalone/
│   └── department-workflow.js  # Standalone Node.js CLI program
│
└── README.md                   # Project documentation
```

---

## 3. Object-Oriented Design

```
                       +-------------------+
                       |      Person       |
                       |  (Parent Class)   |
                       +-------------------+
                       | - id              |
                       | - name            |
                       | - email           |
                       | - phone           |
                       +-------------------+
                       | + getDetails()    |
                       +---------+---------+
                                 |
              +------------------+------------------+
              |                                     |
              v                                     v
    +-------------------+                 +-------------------+
    |      Student      |                 |      Faculty      |
    |   (Child Class)   |                 |   (Child Class)   |
    +-------------------+                 +-------------------+
    | - rollNumber      |                 | - employeeId      |
    | - year            |                 | - designation     |
    | - program         |                 | - specialization  |
    | - enrolledCourses |                 | - assignedCourses |
    +-------------------+                 +-------------------+
    | + enrollCourse()  |                 | + assignCourse()  |
    | + removeCourse()  |                 | + removeCourse()  |
    | + getDetails()    |                 | + getDetails()    |
    +-------------------+                 +-------------------+

                       +-------------------+
                       |    Department     |
                       |  (Container Class)|
                       +-------------------+
                       | - departmentId    |
                       | - departmentName  |
                       | - hod             |
                       | - students[]      |
                       | - faculty[]       |
                       | - courses[]       |
                       +-------------------+
                       | + addStudent()    |
                       | + addFaculty()    |
                       | + addCourse()     |
                       | + findStudent()   |
                       | + sortStudents()  |
                       | + getStatistics() |
                       +-------------------+
```

---

## 4. Algorithms & Complexity Analysis

| Operation | Algorithm | Best Case Time | Average Case Time | Worst Case Time | Space Complexity |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Add Record** | Array Insertion | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ |
| **Search Record** | Linear Search | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ |
| **Sort Students** | Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Duplicate Check** | Linear Membership Check | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ |

---

## 5. How to Run

### Web Application
1. Start local server:
   ```bash
   node server.js
   ```
2. Open `http://localhost:3000/` in your browser.

### Standalone Node.js Terminal Program
Run command:
```bash
node standalone/department-workflow.js
```
