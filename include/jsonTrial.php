<?php

    include "databaseConnection.php"; 

    $conn = OpenConnection();
    $value = "error";

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Check if the jsonData parameter is set
    if (isset($_POST['jsonData'])) {
        // Get the JSON string from POST data
        $jsonData = $_POST['jsonData'];
    
        // Decode the JSON string into a PHP array
        $data = json_decode($jsonData, true);
    
        // Check if the JSON decoding was successful
        if (json_last_error() === JSON_ERROR_NONE) {
            // Send the response back as JSON
            $value = json_encode($data, JSON_UNESCAPED_UNICODE);
            
            $query = "
                INSERT INTO test(data) VALUES ('$value')
            ";

            mysqli_query($conn,$query);

            // $value = "success";
        } else {
            // JSON decoding failed
            $value = json_encode(array(
                "status" => "error",
                "message" => "Invalid JSON data"
            ));
        }
    } else {
        // Handle missing jsonData parameter
            $value = json_encode(array(
            "status" => "error",
            "message" => "No data received"
        ));
    }

    echo $value;
    