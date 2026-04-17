<?php
// ===============================================
// SQL DEMO: Get Students with Attendance - LEFT JOIN
// Demonstrates: LEFT JOIN to include students even with no attendance record
// ===============================================

require_once '../config.php';

header('Content-Type: application/json');

if (!isTeacher()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$subject_id = intval($_GET['subject_id'] ?? 0);
$date       = $_GET['date'] ?? date('Y-m-d');

if (!$subject_id) {
    echo json_encode(['success' => false, 'message' => 'Subject ID required']);
    exit;
}

try {
    $conn = getDbConnection();

    // =============================================
    // SQL DEMO: LEFT JOIN - Fetch ALL students with their attendance status for a given subject & date
    // LEFT JOIN ensures students with no attendance record are still shown (status = NULL)
    // =============================================
    $stmt = $conn->prepare(
        "SELECT s.student_id, s.roll_number, s.name, s.email, a.status
         FROM students s
         LEFT JOIN attendance a
             ON s.student_id = a.student_id
             AND a.subject_id = :subject_id
             AND a.date = :date
         ORDER BY s.roll_number"
    );
    $stmt->execute([
        'subject_id' => $subject_id,
        'date'       => $date
    ]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'students' => $students
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
