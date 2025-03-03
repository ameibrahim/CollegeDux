<?php

header('Content-Type: application/json; charset=utf-8');

include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$courseID = $_POST["id"];

if ($courseID) {

    $query = "
        SELECT *
        FROM `courses` WHERE id = '$courseID'
        ";

    $result = mysqli_query($conn, $query);
    $courses = mysqli_fetch_all($result, MYSQLI_ASSOC);

    $finalResult = array();

    foreach ($courses as $course) {

        $courseID = $course['id'];

        $lectureQuery = "
            SELECT *
            FROM `lectures` WHERE courseID = '$courseID'
            ORDER BY lectures.hierarchy
            ";

        $lectureResult = mysqli_query($conn, $lectureQuery);
        $lectures = mysqli_fetch_all($lectureResult, MYSQLI_ASSOC);

        $lectureArray = array();

        foreach ($lectures as $lecture) {

            $lectureID = $lecture['id'];

            $timeQuery = "
                    SELECT timeStart, timeFinish, hierarchy
                    FROM schedules 
                    INNER JOIN lectures ON schedules.foreignID = lectures.id
                    WHERE lectures.id = '$lectureID'
                ";

            $lectureTimeResult = mysqli_query($conn, $timeQuery);
            $lectureTime = mysqli_fetch_all($lectureTimeResult, MYSQLI_ASSOC);

            $subtopicQuery = "
                SELECT *
                FROM `subtopics` WHERE lectureID = '$lectureID'
                ORDER BY subtopics.hierarchy
                ";

            $subtopicResult = mysqli_query($conn, $subtopicQuery);
            $subtopics = mysqli_fetch_all($subtopicResult, MYSQLI_ASSOC);

            $subtopicArray = array();

            foreach ($subtopics as $subtopic) {

                $subtopicID = $subtopic['id'];

                $resourceQuery = "
                    SELECT *
                    FROM `resources` WHERE subtopicID = '$subtopicID'
                    ";

                $resourcesResult = mysqli_query($conn, $resourceQuery);
                $resources = mysqli_fetch_all($resourcesResult, MYSQLI_ASSOC);

                $subtopicArray[] = array(
                    "id" => $subtopicID,
                    "title" => $subtopic['title'],
                    "hierarchy" => $subtopic['hierarchy'],
                    "resources" => $resources
                );

            }

            $quizQuery = "
                SELECT *
                FROM `quiz` WHERE lectureID = '$lectureID'
                ";

            $quizResult = mysqli_query($conn, $quizQuery);
            $quizzes = mysqli_fetch_all($quizResult, MYSQLI_ASSOC);

            $lectureArray[] = array(
                "id" => $lectureID,
                "title" => $lecture['title'],
                "time" => $lectureTime[0],
                "hierarchy" => $lecture['hierarchy'],
                "subtopics" => $subtopicArray,
                "quizzes" => $quizzes
            );

        }

        $resultA = array(
            "id" => $course['id'],
            "title" => $course['title'],
            "courseCode" => $course['courseCode'],
            // "image" => $course['image'],
            "lectures" => $lectureArray
        );

        $finalResult[] = $resultA;

    }

    echo json_encode($finalResult, JSON_UNESCAPED_UNICODE);

} else {
    echo json_encode(array("status" => "error"));
}