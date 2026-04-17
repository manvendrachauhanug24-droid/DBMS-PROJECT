// ================================================================
// NSUT IT Attendance Portal — Client-Side JavaScript Database
// Simulates SQL operations (SELECT, INSERT, DELETE, JOIN, GROUP BY)
// using localStorage as persistent storage (mirrors SQLite backend)
// ================================================================

const DB = {

  // ─────────────────────────────────────────────────────────────
  // MOCK DATA  (mirrors database.sql)
  // ─────────────────────────────────────────────────────────────
  MOCK_STUDENTS: [
    { student_id:  1, roll_number: '2021IT001', name: 'Aarav Sharma',    email: 'aarav.sharma@nsut.ac.in',    password: 'pass001' },
    { student_id:  2, roll_number: '2021IT002', name: 'Vivaan Gupta',    email: 'vivaan.gupta@nsut.ac.in',    password: 'pass002' },
    { student_id:  3, roll_number: '2021IT003', name: 'Aditya Kumar',    email: 'aditya.kumar@nsut.ac.in',    password: 'pass003' },
    { student_id:  4, roll_number: '2021IT004', name: 'Arjun Shah',      email: 'arjun.shah@nsut.ac.in',      password: 'pass004' },
    { student_id:  5, roll_number: '2021IT005', name: 'Sai Patel',       email: 'sai.patel@nsut.ac.in',       password: 'pass005' },
    { student_id:  6, roll_number: '2021IT006', name: 'Reyansh Mehta',   email: 'reyansh.mehta@nsut.ac.in',   password: 'pass006' },
    { student_id:  7, roll_number: '2021IT007', name: 'Ayaan Khan',      email: 'ayaan.khan@nsut.ac.in',      password: 'pass007' },
    { student_id:  8, roll_number: '2021IT008', name: 'Krishna Nair',    email: 'krishna.nair@nsut.ac.in',    password: 'pass008' },
    { student_id:  9, roll_number: '2021IT009', name: 'Ishaan Joshi',    email: 'ishaan.joshi@nsut.ac.in',    password: 'pass009' },
    { student_id: 10, roll_number: '2021IT010', name: 'Shaurya Verma',   email: 'shaurya.verma@nsut.ac.in',   password: 'pass010' },
    { student_id: 11, roll_number: '2021IT011', name: 'Ananya Singh',    email: 'ananya.singh@nsut.ac.in',    password: 'pass011' },
    { student_id: 12, roll_number: '2021IT012', name: 'Diya Tiwari',     email: 'diya.tiwari@nsut.ac.in',     password: 'pass012' },
    { student_id: 13, roll_number: '2021IT013', name: 'Saanvi Reddy',    email: 'saanvi.reddy@nsut.ac.in',    password: 'pass013' },
    { student_id: 14, roll_number: '2021IT014', name: 'Priya Iyer',      email: 'priya.iyer@nsut.ac.in',      password: 'pass014' },
    { student_id: 15, roll_number: '2021IT015', name: 'Riya Jain',       email: 'riya.jain@nsut.ac.in',       password: 'pass015' },
    { student_id: 16, roll_number: '2021IT016', name: 'Kavya Pillai',    email: 'kavya.pillai@nsut.ac.in',    password: 'pass016' },
    { student_id: 17, roll_number: '2021IT017', name: 'Pooja Desai',     email: 'pooja.desai@nsut.ac.in',     password: 'pass017' },
    { student_id: 18, roll_number: '2021IT018', name: 'Anushka Pandey',  email: 'anushka.pandey@nsut.ac.in',  password: 'pass018' },
    { student_id: 19, roll_number: '2021IT019', name: 'Aisha Beg',       email: 'aisha.beg@nsut.ac.in',       password: 'pass019' },
    { student_id: 20, roll_number: '2021IT020', name: 'Isha Bhatia',     email: 'isha.bhatia@nsut.ac.in',     password: 'pass020' },
  ],

  MOCK_TEACHERS: [
    { teacher_id: 1, name: 'Dr. Rajesh Kumar',  email: 'rajesh.kumar@nsut.ac.in',  password: 'teacher001' },
    { teacher_id: 2, name: 'Dr. Priya Sharma',  email: 'priya.sharma@nsut.ac.in',  password: 'teacher002' },
    { teacher_id: 3, name: 'Dr. Amit Verma',    email: 'amit.verma@nsut.ac.in',    password: 'teacher003' },
    { teacher_id: 4, name: 'Dr. Sunita Rao',    email: 'sunita.rao@nsut.ac.in',    password: 'teacher004' },
    { teacher_id: 5, name: 'Dr. Vikram Singh',  email: 'vikram.singh@nsut.ac.in',  password: 'teacher005' },
  ],

  MOCK_SUBJECTS: [
    { subject_id: 1, subject_code: 'IT301', subject_name: 'Database Management Systems', semester: 5, credits: 4 },
    { subject_id: 2, subject_code: 'IT302', subject_name: 'Operating Systems',            semester: 5, credits: 4 },
    { subject_id: 3, subject_code: 'IT303', subject_name: 'Computer Networks',            semester: 5, credits: 3 },
    { subject_id: 4, subject_code: 'IT304', subject_name: 'Software Engineering',         semester: 5, credits: 3 },
    { subject_id: 5, subject_code: 'IT305', subject_name: 'Web Technologies',             semester: 5, credits: 3 },
  ],

  MOCK_MAPPING: [
    { teacher_id: 1, subject_id: 1 },
    { teacher_id: 2, subject_id: 2 },
    { teacher_id: 3, subject_id: 3 },
    { teacher_id: 4, subject_id: 4 },
    { teacher_id: 5, subject_id: 5 },
  ],

  // ─────────────────────────────────────────────────────────────
  // STORAGE HELPERS
  // ─────────────────────────────────────────────────────────────
  _get(table) {
    return JSON.parse(localStorage.getItem('nsut_' + table) || '[]');
  },
  _save(table, data) {
    localStorage.setItem('nsut_' + table, JSON.stringify(data));
  },

  // Generate last N weekdays (used for seed data)
  _lastWeekdays(n) {
    const dates = [];
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    while (dates.length < n) {
      d.setDate(d.getDate() - 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates.reverse();
  },

  // ─────────────────────────────────────────────────────────────
  // INITIALISE DATABASE (seed mock data)
  // ─────────────────────────────────────────────────────────────
  init() {
    if (localStorage.getItem('nsut_db_initialized')) return;

    this._save('students', this.MOCK_STUDENTS);
    this._save('teachers', this.MOCK_TEACHERS);
    this._save('subjects', this.MOCK_SUBJECTS);
    this._save('mapping', this.MOCK_MAPPING);

    // Generate seed attendance — simulates past classes
    const weekdays = this._lastWeekdays(12);
    const attendance = [];
    let aid = 1;

    // Attendance rates per student group (realistic distribution)
    const rates = [
      0.95, 0.90, 0.90, 0.85, 0.85,   // students 1-5  (excellent)
      0.80, 0.80, 0.75, 0.75, 0.75,   // students 6-10 (good)
      0.70, 0.70, 0.65, 0.65, 0.68,   // students 11-15 (borderline)
      0.60, 0.60, 0.58, 0.55, 0.62,   // students 16-20 (at risk)
    ];

    this.MOCK_SUBJECTS.forEach(subject => {
      const classDays = weekdays.slice(0, 8); // 8 classes per subject
      classDays.forEach(date => {
        this.MOCK_STUDENTS.forEach((student, idx) => {
          const present = Math.random() < rates[idx];
          attendance.push({
            attendance_id: aid++,
            student_id: student.student_id,
            subject_id: subject.subject_id,
            teacher_id: idx < 4 ? 1 : (idx < 8 ? 2 : (idx < 12 ? 3 : (idx < 16 ? 4 : 5))),
            date,
            status: present ? 'Present' : 'Absent',
          });
        });
      });
    });

    this._save('attendance', attendance);
    localStorage.setItem('nsut_db_initialized', '1');
    console.log(`[DB] Initialized with ${attendance.length} attendance records`);
  },

  reset() {
    localStorage.removeItem('nsut_db_initialized');
    ['students','teachers','subjects','mapping','attendance'].forEach(t => localStorage.removeItem('nsut_' + t));
    this.init();
  },

  // ─────────────────────────────────────────────────────────────
  // SQL DEMO: SELECT WHERE — Authentication
  // ─────────────────────────────────────────────────────────────
  loginStudent(email, password) {
    /* SQL: SELECT student_id,name,email,roll_number
             FROM students
             WHERE email = :email AND password = :password */
    const students = this._get('students');
    return students.find(s => s.email === email && s.password === password) || null;
  },

  loginTeacher(email, password) {
    /* SQL: SELECT teacher_id,name,email
             FROM teachers
             WHERE email = :email AND password = :password */
    const teachers = this._get('teachers');
    return teachers.find(t => t.email === email && t.password === password) || null;
  },

  // ─────────────────────────────────────────────────────────────
  // SQL DEMO: INNER JOIN — Teacher's subjects
  // ─────────────────────────────────────────────────────────────
  getTeacherSubjects(teacherId) {
    /* SQL: SELECT s.subject_id, s.subject_code, s.subject_name, s.semester, s.credits
             FROM subjects s
             INNER JOIN subject_teacher_mapping stm ON s.subject_id = stm.subject_id
             WHERE stm.teacher_id = :teacher_id
             ORDER BY s.subject_code */
    const subjects = this._get('subjects');
    const mapping  = this._get('mapping');
    const ids = mapping.filter(m => m.teacher_id === teacherId).map(m => m.subject_id);
    return subjects.filter(s => ids.includes(s.subject_id)).sort((a, b) => a.subject_code.localeCompare(b.subject_code));
  },

  // ─────────────────────────────────────────────────────────────
  // SQL DEMO: LEFT JOIN — Students with attendance for a date
  // ─────────────────────────────────────────────────────────────
  getStudentsWithAttendance(subjectId, date) {
    /* SQL: SELECT s.student_id, s.roll_number, s.name, s.email, a.status
             FROM students s
             LEFT JOIN attendance a
               ON s.student_id = a.student_id
               AND a.subject_id = :subject_id
               AND a.date = :date
             ORDER BY s.roll_number */
    const students   = this._get('students');
    const attendance = this._get('attendance');
    return students.map(s => {
      const rec = attendance.find(a =>
        a.student_id === s.student_id &&
        a.subject_id === subjectId &&
        a.date === date
      );
      return { ...s, status: rec ? rec.status : null };
    }).sort((a, b) => a.roll_number.localeCompare(b.roll_number));
  },

  // ─────────────────────────────────────────────────────────────
  // SQL DEMO: Transaction — DELETE + INSERT for attendance
  // ─────────────────────────────────────────────────────────────
  markAttendance(subjectId, date, teacherId, records) {
    /* SQL: BEGIN TRANSACTION;
              DELETE FROM attendance WHERE subject_id=:sid AND date=:date;
              INSERT INTO attendance (student_id,subject_id,teacher_id,date,status)
                VALUES (:sid,:subjectId,:teacherId,:date,:status);
            COMMIT; */
    let attendance = this._get('attendance');

    // DELETE existing records for this subject+date
    attendance = attendance.filter(a => !(a.subject_id === subjectId && a.date === date));

    // INSERT new records
    const nextId = attendance.length ? Math.max(...attendance.map(a => a.attendance_id)) + 1 : 1;
    records.forEach((rec, i) => {
      attendance.push({
        attendance_id: nextId + i,
        student_id:   rec.student_id,
        subject_id:   subjectId,
        teacher_id:   teacherId,
        date,
        status: ['Present','Absent'].includes(rec.status) ? rec.status : 'Absent',
      });
    });

    this._save('attendance', attendance);
    return records.length;
  },

  // ─────────────────────────────────────────────────────────────
  // SQL DEMO: GROUP BY + COUNT() + SUM() + CASE + ROUND()
  // ─────────────────────────────────────────────────────────────
  getStudentAttendance(studentId) {
    /* SQL: SELECT s.subject_id, s.subject_code, s.subject_name, s.credits,
                   COUNT(a.attendance_id)                                      AS total_classes,
                   SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)        AS classes_attended,
                   SUM(CASE WHEN a.status='Absent'  THEN 1 ELSE 0 END)        AS classes_missed,
                   ROUND(SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
                         * 100.0 / NULLIF(COUNT(a.attendance_id),0), 2)       AS attendance_percentage
             FROM subjects s
             LEFT JOIN attendance a ON s.subject_id = a.subject_id AND a.student_id = :student_id
             GROUP BY s.subject_id, s.subject_code, s.subject_name, s.credits
             ORDER BY s.subject_code */
    const subjects   = this._get('subjects');
    const attendance = this._get('attendance').filter(a => a.student_id === studentId);

    const subjectStats = subjects.map(s => {
      const recs           = attendance.filter(a => a.subject_id === s.subject_id);
      const total_classes  = recs.length;
      const classes_attended = recs.filter(a => a.status === 'Present').length;
      const classes_missed   = recs.filter(a => a.status === 'Absent').length;
      const attendance_percentage = total_classes === 0 ? 0 :
        Math.round(classes_attended * 10000 / total_classes) / 100;
      return { ...s, total_classes, classes_attended, classes_missed, attendance_percentage };
    });

    const total_classes = attendance.length;
    const total_present = attendance.filter(a => a.status === 'Present').length;
    const overall_percentage = total_classes === 0 ? 0 :
      Math.round(total_present * 10000 / total_classes) / 100;

    return { subjects: subjectStats, overall: { total_classes, total_present, overall_percentage } };
  },

  // ─────────────────────────────────────────────────────────────
  // SESSION helpers (sessionStorage so it clears on tab close)
  // ─────────────────────────────────────────────────────────────
  setSession(user) { sessionStorage.setItem('nsut_session', JSON.stringify(user)); },
  getSession()     { return JSON.parse(sessionStorage.getItem('nsut_session') || 'null'); },
  clearSession()   { sessionStorage.removeItem('nsut_session'); },
};

// Auto-initialise on script load
DB.init();
