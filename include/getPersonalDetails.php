<?php

session_start();

include "databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Ensure the connection uses UTF-8 for proper handling of Turkish characters
mysqli_set_charset($conn, "utf8mb4");

$userID = $_POST['id']; // Hapa kijana hapa.

if ($userID) {
    $query = "
        SELECT users.id, email, role, users.timestamp, name, address, image, phone, institutionID, department  
        FROM `users`
        JOIN userDetails ON users.id = userDetails.id
        WHERE users.id = ?
    ";

    // Use prepared statements to prevent SQL injection
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 's', $userID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $details = mysqli_fetch_all($result, MYSQLI_ASSOC);

    // Ensure proper UTF-8 encoding for the output
    echo json_encode($details, JSON_UNESCAPED_UNICODE);

} else {
    echo "error";
}

mysqli_close($conn);