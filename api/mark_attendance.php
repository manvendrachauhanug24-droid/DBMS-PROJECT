<?php
// ===============================================
// SQL DEMO: Mark Attendance - DELETE + INSERT using Transaction
// Demonstrates: BEGIN TRANSACTION, DELETE, INSERT, COMMIT/ROLLBACK
// ===============================================

require_once '../config.php';

header('Content-Type: application/json');

if (!isTeacher()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input      = json_decode(file_get_contents('php://input'), true);
$subject_id = intval($input['subject_id'] ?? 0);
$date       = $input['date'] ?? '';
$attendance = $input['attendance'] ?? [];

if (!$subject_id || !$date || empty($attendance)) {
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
    exit;
}

try {
    $conn       = getDbConnection();
    $teacher_id = $_SESSION['user_id'];

    // =============================================
    // SQL DEMO: TRANSACTION - wrapping DELETE + INSERT in a single atomic unit
    // Ensures data consistency: either all records are saved or none
    // =============================================
    $conn->beginTransaction();

    // =============================================
    // SQL DEMO: DELETE - Remove existing attendance for this subject & date
    // Allows idempotent "mark attendance" (works as update)
    // =============================================
    $deleteStmt = $conn->prepare(
        "DELETE FROM attendance
         WHERE subject_id = :subject_id AND date = :date"
    );
    $deleteStmt->execute([
        'subject_id' => $subject_id,
        'date'       => $date
    ]);

    // =============================================
    // SQL DEMO: INSERT - Bulk insert attendance records using prepared statements
    // PDO named parameters prevent SQL injection
    // =============================================
    $insertStmt = $conn->prepare(
        "INSERT INTO attendance (student_id, subject_id, teacher_id, date, status)
         VALUES (:student_id, :subject_id, :teacher_id, :date, :status)"
    );

    $records_inserted = 0;
    foreach ($attendance as $record) {
        $student_id = intval($record['student_id']);
        $status     = in_array($record['status'], ['Present', 'Absent']) ? $record['status'] : 'Absent';

        $insertStmt->execute([
            'student_id' => $student_id,
            'subject_id' => $subject_id,
            'teacher_id' => $teacher_id,
            'date'       => $date,
            'status'     => $status
        ]);
        $records_inserted++;
    }

    // =============================================
    // SQL DEMO: COMMIT - Finalise the transaction
    // =============================================
    $conn->commit();

    echo json_encode([
        'success'          => true,
        'records_inserted' => $records_inserted,
        'message'          => 'Attendance saved successfully'
    ]);

} catch (PDOException $e) {
    // =============================================
    // SQL DEMO: ROLLBACK - Undo all changes if any error occurs
    // =============================================
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
