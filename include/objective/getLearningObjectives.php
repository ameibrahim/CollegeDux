<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $courseID = $_POST['courseID'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        SELECT *
        FROM `objectives` 
        WHERE objectives.courseID = '$courseID'
        ORDER BY hierarchy
    ";

    $objectivesResult = mysqli_query($conn,$query);
    $objective = mysqli_fetch_all($objectivesResult,MYSQLI_ASSOC);

    echo json_encode($objective);

