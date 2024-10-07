<?php

    include "databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
    SELECT * FROM test
    LIMIT 1
    ";

    $result = mysqli_query($conn,$query);
    $json = mysqli_fetch_all($result,MYSQLI_ASSOC);
    $data = $json['data'];

    $data = json_decode($data, true);
    
        // Check if the JSON decoding was successful
        if (json_last_error() === JSON_ERROR_NONE) {
            // Send the response back as JSON
            $result = json_encode($data, JSON_UNESCAPED_UNICODE);
        } else {
            // JSON decoding failed
            $result = json_encode(array(
                "status" => "error",
                "message" => "Invalid JSON data"
            ));
    }

    echo $data;
    