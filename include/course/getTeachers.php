<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$id = "ef87w9r42rbw";

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
    SELECT users.id, userDetails.name, userDetails.image, users.email 
    FROM users
    INNER JOIN userDetails ON userDetails.id = users.id
    WHERE users.role = 'teacher'
";

$coursesResult = mysqli_query($conn, $query);

// Check if query executed successfully
if ($coursesResult) {
    // Fetch all courses data
    $courses = mysqli_fetch_all($coursesResult, MYSQLI_ASSOC);

    // Output as JSON
    echo json_encode($courses, JSON_UNESCAPED_UNICODE);
} else {
    echo "Error executing query: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
