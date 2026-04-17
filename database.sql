-- ===============================================
-- NSUT ICE Branch Attendance Portal Database
-- SQL Demo Project - SQLite Version
-- ===============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS subject_teacher_mapping;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;

-- ===============================================
-- SQL DEMO 1: CREATE TABLE with constraints
-- Creating Students table with primary key and unique constraints
-- SQLite uses AUTOINCREMENT instead of AUTO_INCREMENT
-- ===============================================
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    branch TEXT DEFAULT 'ICE',
    semester INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- SQL DEMO 2: CREATE TABLE with foreign key relationships
-- Creating Teachers table
-- ===============================================
CREATE TABLE teachers (
    teacher_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    department TEXT DEFAULT 'ICE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- SQL DEMO 3: CREATE TABLE for Subjects
-- ===============================================
CREATE TABLE subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_code TEXT UNIQUE NOT NULL,
    subject_name TEXT NOT NULL,
    semester INTEGER NOT NULL,
    credits INTEGER DEFAULT 3,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- SQL DEMO 4: CREATE TABLE with composite relationships
-- Mapping teachers to subjects (one-to-many)
-- SQLite enforces foreign keys when enabled
-- ===============================================
CREATE TABLE subject_teacher_mapping (
    mapping_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    academic_year TEXT DEFAULT '2024-25',
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    UNIQUE (subject_id, teacher_id, academic_year)
);

-- ===============================================
-- SQL DEMO 5: CREATE TABLE for attendance records
-- Complex table with multiple foreign keys
-- SQLite uses CHECK constraint instead of ENUM
-- ===============================================
CREATE TABLE attendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Present', 'Absent')),
    marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    UNIQUE (student_id, subject_id, date)
);

-- ===============================================
-- SQL DEMO 6: INSERT statements for mock data
-- Inserting 20 mock students
-- ===============================================
INSERT INTO students (roll_number, name, email, password, semester) VALUES
('2024UIC001', 'Aarav Sharma', 'aarav.sharma@nsut.ac.in', 'pass001', 5),
('2024UIC002', 'Vivaan Gupta', 'vivaan.gupta@nsut.ac.in', 'pass002', 5),
('2024UIC003', 'Aditya Kumar', 'aditya.kumar@nsut.ac.in', 'pass003', 5),
('2024UIC004', 'Vihaan Singh', 'vihaan.singh@nsut.ac.in', 'pass004', 5),
('2024UIC005', 'Arjun Verma', 'arjun.verma@nsut.ac.in', 'pass005', 5),
('2024UIC006', 'Sai Reddy', 'sai.reddy@nsut.ac.in', 'pass006', 5),
('2024UIC007', 'Arnav Patel', 'arnav.patel@nsut.ac.in', 'pass007', 5),
('2024UIC008', 'Dhruv Yadav', 'dhruv.yadav@nsut.ac.in', 'pass008', 5),
('2024UIC009', 'Krishna Mehta', 'krishna.mehta@nsut.ac.in', 'pass009', 5),
('2024UIC010', 'Ayaan Joshi', 'ayaan.joshi@nsut.ac.in', 'pass010', 5),
('2024UIC011', 'Reyansh Agarwal', 'reyansh.agarwal@nsut.ac.in', 'pass011', 5),
('2024UIC012', 'Ishaan Pandey', 'ishaan.pandey@nsut.ac.in', 'pass012', 5),
('2024UIC013', 'Shaurya Saxena', 'shaurya.saxena@nsut.ac.in', 'pass013', 5),
('2024UIC014', 'Atharv Mishra', 'atharv.mishra@nsut.ac.in', 'pass014', 5),
('2024UIC015', 'Advait Kapoor', 'advait.kapoor@nsut.ac.in', 'pass015', 5),
('2024UIC016', 'Priya Singh', 'priya.singh@nsut.ac.in', 'pass016', 5),
('2024UIC017', 'Ananya Chopra', 'ananya.chopra@nsut.ac.in', 'pass017', 5),
('2024UIC018', 'Diya Malhotra', 'diya.malhotra@nsut.ac.in', 'pass018', 5),
('2024UIC019', 'Sara Khan', 'sara.khan@nsut.ac.in', 'pass019', 5),
('2024UIC020', 'Isha Bhatia', 'isha.bhatia@nsut.ac.in', 'pass020', 5);

-- ===============================================
-- SQL DEMO 7: INSERT statements for teachers
-- Inserting 5 mock teachers
-- ===============================================
INSERT INTO teachers (name, email, password, department) VALUES
('Dr. Rajesh Kumar', 'rajesh.kumar@nsut.ac.in', 'teacher001', 'ICE'),
('Dr. Priya Sharma', 'priya.sharma@nsut.ac.in', 'teacher002', 'ICE'),
('Dr. Amit Verma', 'amit.verma@nsut.ac.in', 'teacher003', 'ICE'),
('Dr. Sunita Rao', 'sunita.rao@nsut.ac.in', 'teacher004', 'ICE'),
('Dr. Vikram Singh', 'vikram.singh@nsut.ac.in', 'teacher005', 'ICE');

-- ===============================================
-- SQL DEMO 8: INSERT statements for subjects
-- Inserting 5 mock subjects
-- ===============================================
INSERT INTO subjects (subject_code, subject_name, semester, credits) VALUES
('UIC301', 'Instrumentation & Measurement', 5, 4),
('UIC302', 'Control Systems', 5, 4),
('UIC303', 'Digital Signal Processing', 5, 4),
('UIC304', 'Microcontrollers & Embedded Systems', 5, 3),
('UIC305', 'Communication Systems', 5, 3);

-- ===============================================
-- SQL DEMO 9: INSERT with subqueries
-- Mapping teachers to subjects
-- ===============================================
INSERT INTO subject_teacher_mapping (subject_id, teacher_id) VALUES
((SELECT subject_id FROM subjects WHERE subject_code = 'UIC301'), (SELECT teacher_id FROM teachers WHERE email = 'rajesh.kumar@nsut.ac.in')),
((SELECT subject_id FROM subjects WHERE subject_code = 'UIC302'), (SELECT teacher_id FROM teachers WHERE email = 'priya.sharma@nsut.ac.in')),
((SELECT subject_id FROM subjects WHERE subject_code = 'UIC303'), (SELECT teacher_id FROM teachers WHERE email = 'amit.verma@nsut.ac.in')),
((SELECT subject_id FROM subjects WHERE subject_code = 'UIC304'), (SELECT teacher_id FROM teachers WHERE email = 'sunita.rao@nsut.ac.in')),
((SELECT subject_id FROM subjects WHERE subject_code = 'UIC305'), (SELECT teacher_id FROM teachers WHERE email = 'vikram.singh@nsut.ac.in'));

-- ===============================================
-- SQL DEMO 10: INSERT sample attendance records
-- Creating some sample attendance data for demo
-- ===============================================
INSERT INTO attendance (student_id, subject_id, teacher_id, date, status) VALUES
-- Instrumentation Attendance (Subject UIC301)
(1, 1, 1, '2024-11-01', 'Present'),
(2, 1, 1, '2024-11-01', 'Present'),
(3, 1, 1, '2024-11-01', 'Absent'),
(4, 1, 1, '2024-11-01', 'Present'),
(5, 1, 1, '2024-11-01', 'Present'),
(1, 1, 1, '2024-11-04', 'Present'),
(2, 1, 1, '2024-11-04', 'Absent'),
(3, 1, 1, '2024-11-04', 'Present'),

-- Control Systems Attendance (Subject UIC302)
(1, 2, 2, '2024-11-02', 'Present'),
(2, 2, 2, '2024-11-02', 'Present'),
(3, 2, 2, '2024-11-02', 'Present'),
(1, 2, 2, '2024-11-05', 'Absent'),

-- DSP Attendance (Subject UIC303)
(1, 3, 3, '2024-11-03', 'Present'),
(2, 3, 3, '2024-11-03', 'Present'),
(1, 3, 3, '2024-11-06', 'Present');

-- ===============================================
-- SQL DEMO 11: CREATE VIEW for attendance summary
-- View to show attendance percentage per student per subject
-- ===============================================
CREATE VIEW student_attendance_summary AS
SELECT
    s.student_id,
    s.roll_number,
    s.name AS student_name,
    subj.subject_id,
    subj.subject_code,
    subj.subject_name,
    COUNT(a.attendance_id) AS total_classes,
    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS classes_attended,
    ROUND((SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attendance_id)), 2) AS attendance_percentage
FROM students s
CROSS JOIN subjects subj
LEFT JOIN attendance a ON s.student_id = a.student_id AND subj.subject_id = a.subject_id
GROUP BY s.student_id, subj.subject_id;

-- ===============================================
-- SQL DEMO 12: Sample SELECT queries for testing
-- ===============================================

-- Query to get all students with their attendance for a specific subject
-- SELECT s.roll_number, s.name, a.date, a.status
-- FROM students s
-- LEFT JOIN attendance a ON s.student_id = a.student_id
-- WHERE a.subject_id = 1
-- ORDER BY s.roll_number;

-- Query to get attendance percentage for each student
-- SELECT * FROM student_attendance_summary WHERE student_id = 1;

-- Query to get teacher's subjects
-- SELECT t.name, s.subject_code, s.subject_name
-- FROM teachers t
-- JOIN subject_teacher_mapping stm ON t.teacher_id = stm.teacher_id
-- JOIN subjects s ON stm.subject_id = s.subject_id;
