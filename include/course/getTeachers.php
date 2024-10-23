<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = "ef87w9r42rbw";

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        SELECT *
        FROM `courses` WHERE creatorID = '$id'
        ORDER BY courses.title
    ";

    $coursesResult = mysqli_query($conn,$query);
    $courses = mysqli_fetch_all($coursesResult,MYSQLI_ASSOC);

    echo json_encode($courses);

