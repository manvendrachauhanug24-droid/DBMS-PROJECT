<?php
// ===============================================
// SQL DEMO: Login API - Authentication using SELECT query
// Demonstrates: PDO prepared statements, session management
// ===============================================

require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email    = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');
$userType = trim($input['userType'] ?? '');

if (!$email || !$password || !in_array($userType, ['student', 'teacher'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    $conn = getDbConnection();

    if ($userType === 'student') {
        // =============================================
        // SQL DEMO: SELECT with WHERE clause (student login)
        // Uses PDO named parameters to prevent SQL injection
        // =============================================
        $stmt = $conn->prepare(
            "SELECT student_id, name, email, roll_number, password
             FROM students
             WHERE email = :email"
        );
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && $user['password'] === $password) {
            $_SESSION['user_id']     = $user['student_id'];
            $_SESSION['user_name']   = $user['name'];
            $_SESSION['user_email']  = $user['email'];
            $_SESSION['roll_number'] = $user['roll_number'];
            $_SESSION['user_type']   = 'student';

            echo json_encode([
                'success'  => true,
                'redirect' => 'student_dashboard.php',
                'message'  => 'Login successful'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }

    } else {
        // =============================================
        // SQL DEMO: SELECT with WHERE clause (teacher login)
        // =============================================
        $stmt = $conn->prepare(
            "SELECT teacher_id, name, email, password
             FROM teachers
             WHERE email = :email"
        );
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && $user['password'] === $password) {
            $_SESSION['user_id']    = $user['teacher_id'];
            $_SESSION['user_name']  = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_type']  = 'teacher';

            echo json_encode([
                'success'  => true,
                'redirect' => 'teacher_dashboard.php',
                'message'  => 'Login successful'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
