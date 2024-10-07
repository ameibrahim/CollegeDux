<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $title = $_POST['title'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        UPDATE objectives SET title='$title' 
        WHERE id='$id'
    ";

    $result = mysqli_query($conn,$query);
    echo "success";

