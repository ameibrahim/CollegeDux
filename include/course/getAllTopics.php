<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $courseID = $_POST["id"];

    if($courseID){

        $query = "
            SELECT * FROM `courses`
            INNER JOIN lectures ON lectures.courseID = courses.id
            WHERE courses.id = '$courseID'
        ";

        $result = mysqli_query($conn,$query);
        $lectures = mysqli_fetch_all($result,MYSQLI_ASSOC);

        echo json_encode($lectures);

    }
    else{
        echo json_encode(array("status" => "error"));
    }