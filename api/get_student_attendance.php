<?php
// ===============================================
// SQL DEMO: Get Student Attendance - GROUP BY + Aggregate Functions
// Demonstrates: GROUP BY, COUNT(), SUM(), ROUND(), CASE, LEFT JOIN
// ===============================================

require_once '../config.php';

header('Content-Type: application/json');

if (!isStudent()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $conn       = getDbConnection();
    $student_id = $_SESSION['user_id'];

    // =============================================
    // SQL DEMO: Complex SELECT with GROUP BY and aggregate functions
    // - LEFT JOIN: include subjects even if student has 0 attendance records
    // - COUNT(): total classes held per subject
    // - SUM() + CASE: count present classes conditionally
    // - ROUND(): format percentage to 2 decimal places
    // - 100.0 (not 100): force float division in SQLite
    // =============================================
    $stmt = $conn->prepare(
        "SELECT
             s.subject_id,
             s.subject_code,
             s.subject_name,
             s.credits,
             COUNT(a.attendance_id) AS total_classes,
             SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS classes_attended,
             SUM(CASE WHEN a.status = 'Absent'  THEN 1 ELSE 0 END) AS classes_missed,
             CASE
                 WHEN COUNT(a.attendance_id) = 0 THEN 0
                 ELSE ROUND(
                     (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 /
                      COUNT(a.attendance_id)),
                     2
                 )
             END AS attendance_percentage
         FROM subjects s
         LEFT JOIN attendance a
             ON s.subject_id = a.subject_id
             AND a.student_id = :student_id
         GROUP BY s.subject_id, s.subject_code, s.subject_name, s.credits
         ORDER BY s.subject_code"
    );
    $stmt->execute(['student_id' => $student_id]);
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // =============================================
    // SQL DEMO: Overall attendance summary across all subjects
    // =============================================
    $overallStmt = $conn->prepare(
        "SELECT
             COUNT(a.attendance_id)                                       AS total_classes,
             SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END)       AS total_present,
             CASE
                 WHEN COUNT(a.attendance_id) = 0 THEN 0
                 ELSE ROUND(
                     (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 /
                      COUNT(a.attendance_id)),
                     2
                 )
             END AS overall_percentage
         FROM attendance a
         WHERE a.student_id = :student_id"
    );
    $overallStmt->execute(['student_id' => $student_id]);
    $overall = $overallStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'subjects' => $subjects,
        'overall'  => $overall
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
