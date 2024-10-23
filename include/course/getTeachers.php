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
    // Fetch all courses data as an associative array
    $courses = mysqli_fetch_all($coursesResult, MYSQLI_ASSOC);

    // Encode the result as JSON and output it
    echo json_encode($courses);
} else {
    echo json_encode(array("error" => mysqli_error($conn)));
}

mysqli_close($conn);
?>
