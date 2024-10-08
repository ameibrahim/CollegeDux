<?php

    include "../databaseConnection.php"; 


    $conn = OpenConnection();

    $id = $_POST['id'];
    $title = $_POST['title'];
    $hierarchy = $_POST['hierarchy'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        UPDATE subtopics
        SET title='$title', hierarchy='$hierarchy'
        WHERE id='$id'
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
