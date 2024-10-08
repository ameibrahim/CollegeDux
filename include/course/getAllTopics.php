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

        $lectureArray = [];

        foreach($lectures as $lecture) {

            $lectureID = $lecture['id'];
            
            $subtopicQuery = "
                SELECT title
                FROM `subtopics` WHERE lectureID = '$lectureID'
                ORDER BY subtopics.hierarchy
            ";

            $subtopicQuery = mysqli_query($conn,$subtopicQuery);
            $subtopics = mysqli_fetch_all($subtopicQuery,MYSQLI_ASSOC);

            $lectureArray[] = array(
                "subtopics" => $subtopics,
            );
        }

        echo json_encode($lectureArray);

    }
    else{
        echo json_encode(array("status" => "error"));
    }