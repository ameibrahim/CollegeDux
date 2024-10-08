<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $userID = $_POST["id"];

    if($userID){

        $query = "
        SELECT courses.id, courses.title, courses.courseCode
        FROM `subscriptions` 
        INNER JOIN courses ON courses.id = subscriptions.courseID
        WHERE subscriptions.userID = '$userID'
        ";

        $result = mysqli_query($conn,$query);
        $courses = mysqli_fetch_all($result,MYSQLI_ASSOC);

        $finalResult = array();

        foreach($courses as $course) {

            $courseID = $course['id'];
            
            $lectureQuery = "
            SELECT id
            FROM `lectures` WHERE courseID = '$courseID'
            ORDER BY lectures.hierarchy
            ";

            $lectureResult = mysqli_query($conn,$lectureQuery);
            $lectures = mysqli_fetch_all($lectureResult,MYSQLI_ASSOC);

            $lectureArray = array();

            foreach($lectures as $lecture){

                $lectureID = $lecture['id'];
                
                $subtopicQuery = "
                SELECT *
                FROM `subtopics` WHERE lectureID = '$lectureID'
                ORDER BY subtopics.hierarchy
                ";

                $subtopicResult = mysqli_query($conn,$subtopicQuery);
                $subtopics = mysqli_fetch_all($subtopicResult,MYSQLI_ASSOC);

                $subtopicArray = array();

                foreach($subtopics as $subtopic){

                    $subtopicID = $subtopic['id'];
                    
                    $resourceQuery = "
                    SELECT *
                    FROM `resources` WHERE subtopicID = '$subtopicID'
                    ";
    
                    $resourcesResult = mysqli_query($conn,$resourceQuery);
                    $resources = mysqli_fetch_all($resourcesResult,MYSQLI_ASSOC);

                    $subtopicArray[] = array(
                        "id" => $subtopicID,
                        "title" => $subtopic['title'],
                        "hierarchy" => $subtopic['hierarchy'],
                        "resources" => $resources
                    );
                    
                }


                $lectureArray[] = array(
                    "id" => $lectureID,
                    "title" => $lecture['title'],
                    "hierarchy" => $lecture['hierarchy'],
                    "subtopics" => $subtopicArray,
                );

            }

            $resultA = array(
                "id" => $course['id'],
                "title" => $course['title'],
                "courseCode" => $course['courseCode'],
                "lectures" => $lectureArray
            );

            $finalResult[] = $resultA;

        }

        echo json_encode($finalResult);

    }
    else{
        echo json_encode(array("status" => "error"));
    }