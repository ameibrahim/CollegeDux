<?php

    include "../databaseConnection.php"; 


    $conn = OpenConnection();

    $id = $_POST['id'];
    $objectives = $_POST['objectives'];
    $result;

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

     // Decode the JSON string into a PHP array
    $data = json_decode($objectives, true);
    
     // Check if the JSON decoding was successful
    if (json_last_error() === JSON_ERROR_NONE) {
         // Send the response back as JSON
        $data = json_encode($data, JSON_UNESCAPED_UNICODE);

        $query = "
            UPDATE objectives
            SET objectives='$data'
            WHERE id='$id'
        ";

        $result = mysqli_query($conn,$query);
        $result = "success";
    } else {
        // JSON decoding failed
        $result = "error";
    }

    echo $result;
