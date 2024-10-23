<?php

    include "../databaseConnection.php"; 


    $conn = OpenConnection();

    $courseID = $_POST['courseID'];
    $newOwnerID = $_POST['newOwnerID'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        UPDATE courses
        SET creatorID='$newOwnerID'
        WHERE id='$courseID'
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
