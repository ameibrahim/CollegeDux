<?php

include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$courseID = $_POST["courseID"];

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
                    "resources" => $resources
                );

            }

            $lectureArray[] = array(
                "id" => $lectureID,
                "subtopics" => $subtopicArray,
            );

        }

        $resultA = array(
            "id" => $course['id'],
            "lectures" => $lectureArray
        );

        $finalResult[] = $resultA;

    }

    echo json_encode($finalResult);

} else {
    echo json_encode(array("status" => "error"));
}