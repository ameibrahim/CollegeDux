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
    // Get number of rows
    $num_rows = mysqli_num_rows($coursesResult);

    // Fetch all courses data
    $courses = mysqli_fetch_all($coursesResult, MYSQLI_ASSOC);

    // Print number of rows
    echo "Number of rows: " . $num_rows . "<br>";

    // Print all courses data
    foreach ($courses as $course) {
        echo "ID: " . $course['id'] . "<br>";
        echo "Name: " . $course['name'] . "<br>";
        echo "Image: " . $course['image'] . "<br>";
        echo "Email: " . $course['email'] . "<br><br>";
    }
} else {
    echo "Error executing query: " . mysqli_error($conn);
}

mysqli_close($conn);
?>