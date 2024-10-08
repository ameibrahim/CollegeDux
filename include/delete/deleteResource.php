<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $filepath = $_POST['filepath'];
    $filepath = "../../uploads/".$filepath;

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        DELETE FROM `resources`
        WHERE id = '$id'
    ";

    $deleteQuery = mysqli_query($conn,$query);

    if (unlink($filepath)) {
        echo "success";
    }

