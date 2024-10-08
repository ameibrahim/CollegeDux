<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $courseID = $_POST['courseID'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        DELETE FROM objectives 
        WHERE courseID='$courseID'
    ";

    $result = mysqli_query($conn,$query);
    echo "success";

