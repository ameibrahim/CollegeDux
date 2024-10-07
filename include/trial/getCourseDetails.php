<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $courseID = "ltcvladl";

    if($courseID){

        $query = "
        SELECT *
        FROM `courses` WHERE id = 'ltcvladl'
        ";

        $result = mysqli_query($conn,$query);
        $courses = mysqli_fetch_all($result,MYSQLI_ASSOC);

        $finalResult = array();

        foreach($courses as $course) {

            $courseID = $course['id'];
            
            $lectureQuery = "
            SELECT *
            FROM `lectures` WHERE courseID = 'ltcvladl'
            ";

            $lectureResult = mysqli_query($conn,$lectureQuery);
            $lectures = mysqli_fetch_all($lectureResult,MYSQLI_ASSOC);

            $lectureArray = array();

            foreach($lectures as $lecture){

                $lectureID = $lecture['id'];
                           
                $resourceQuery = "
                SELECT *
                FROM `resources` WHERE lectureID = '$lectureID'
                ";

                $resourcesResult = mysqli_query($conn,$resourceQuery);
                $resources = mysqli_fetch_all($resourcesResult,MYSQLI_ASSOC);


                $quizQuery = "
                SELECT *
                FROM `quiz` WHERE lectureID = '$lectureID'
                ";

                $quizResult = mysqli_query($conn,$quizQuery);
                $quizzes = mysqli_fetch_all($quizResult,MYSQLI_ASSOC);

                $lectureArray[] = array(
                    "id" => $lectureID,
                    "title" => $lecture['title'],
                    "hierarchy" => $lecture['hierarchy'],
                    "resources" => $resources,
                    "quizzes" => $quizzes
                );

                echo "lecture Array: \n";
                echo json_encode($lectureArray);

            }

            $resultA = array(
                "id" => $course['id'],
                "title" => $course['title'],
                "courseCode" => $course['courseCode'],
                "lectures" => $lectureArray
            );

            echo "resultA:  \n";
            echo json_encode($resultA);

            $finalResult[] = $resultA;

        }

        echo json_encode($finalResult);

    }