<?php
// ===============================================
// SQL DEMO: Get Teacher Subjects - JOIN query
// Demonstrates: INNER JOIN between subjects and subject_teacher_mapping
// ===============================================

require_once '../config.php';

header('Content-Type: application/json');

if (!isTeacher()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $conn = getDbConnection();

    // =============================================
    // SQL DEMO: INNER JOIN to fetch subjects assigned to the teacher
    // Joins subjects table with subject_teacher_mapping using foreign key
    // =============================================
    $stmt = $conn->prepare(
        "SELECT s.subject_id, s.subject_code, s.subject_name, s.semester, s.credits
         FROM subjects s
         INNER JOIN subject_teacher_mapping stm ON s.subject_id = stm.subject_id
         WHERE stm.teacher_id = :teacher_id
         ORDER BY s.subject_code"
    );
    $stmt->execute(['teacher_id' => $_SESSION['user_id']]);
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'subjects' => $subjects
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
