<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $courseID = $_POST["id"];

    $query = "
        SELECT title FROM courses
        WHERE courses.id = '$courseID'
    ";

    $detailsResult = mysqli_query($conn,$query);
    $details = mysqli_fetch_all($detailsResult,MYSQLI_ASSOC);

    echo json_encode($details);
