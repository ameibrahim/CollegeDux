<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $courseCode = $_POST['courseCode'];
    $courseID = $_POST['courseID'];
    $title = $_POST['title'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        UPDATE courses
        SET courseCode='$courseCode', title='$title'
        WHERE id='$courseID'
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
