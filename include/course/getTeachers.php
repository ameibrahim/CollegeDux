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

// Initialize an empty array to hold users
$users = [];

if ($coursesResult) {
    // Fetch all courses data and assign to $users array
    while ($row = mysqli_fetch_assoc($coursesResult)) {
        $users[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'image' => $row['image'],
            'email' => $row['email']
        ];
    }

    // Output the array as JSON
    header('Content-Type: application/json');
    echo json_encode($users, JSON_UNESCAPED_UNICODE);

} else {
    echo "Error executing query: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
