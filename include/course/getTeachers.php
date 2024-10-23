<?php
    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die(json_encode(["error" => "Connection failed: " . mysqli_connect_error()]));
    }

    $query = "
        SELECT users.id, userDetails.name, userDetails.image, users.email FROM `users`
        INNER JOIN `userDetails` ON userDetails.id = users.id
        WHERE users.role = 'teacher'
        ORDER BY userDetails.name
    ";

    $result = mysqli_query($conn, $query);

    if (!$result) {
        echo json_encode(["error" => "Query failed: " . mysqli_error($conn)]);
        exit;
    }

    $teachers = mysqli_fetch_all($result, MYSQLI_ASSOC);

    echo json_encode($teachers);

