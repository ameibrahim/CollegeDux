<?php

    include "../databaseConnection.php"; 


    $conn = OpenConnection();

    $courseID = $_POST['courseID'];
    $image = $_POST['image'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        UPDATE courses
        SET image='$image'
        WHERE id='$courseID'
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
