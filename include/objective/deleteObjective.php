<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $objectiveID = $_POST['objectiveID'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        DELETE FROM objectives 
        WHERE id='$objectiveID'
    ";

    $result = mysqli_query($conn,$query);
    echo "success";

