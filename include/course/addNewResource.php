<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $value = $_POST['value'];
    $type = $_POST['type'];
    $lectureID = $_POST['lectureID'];
    $title = $_POST['title'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        INSERT INTO resources (id, type, value, lectureID, title)
        VALUES ('$id', '$type', '$value', '$lectureID', '$title')
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
