<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $title = $_POST['title'];
    $courseID = $_POST['courseID'];
    $hierarchy = $_POST['hierarchy'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
    INSERT INTO objectives(id, courseID, hierarchy, title) 
    VALUES ('$id','$courseID','$hierarchy','$title')
    ";

    $result = mysqli_query($conn,$query);
    echo "success";

