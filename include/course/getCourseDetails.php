<?php

header('Content-Type: application/json; charset=utf-8');

include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$courseID = $_POST["id"] ?? '';  // Use the null coalescing operator to handle the absence of id.

if (!empty($courseID)) {

    $query = "SELECT * FROM `courses` WHERE id = ?";

    if ($stmt = mysqli_prepare($conn, $query)) {
        mysqli_stmt_bind_param($stmt, "s", $courseID);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $courses = mysqli_fetch_all($result, MYSQLI_ASSOC);

        $finalResult = array();

        foreach ($courses as $course) {
            $courseID = $course['id'];
            $lectureQuery = "SELECT * FROM `lectures` WHERE courseID = ? ORDER BY hierarchy";

            if ($lectureStmt = mysqli_prepare($conn, $lectureQuery)) {
                mysqli_stmt_bind_param($lectureStmt, "s", $courseID);
                mysqli_stmt_execute($lectureStmt);
                $lectureResult = mysqli_stmt_get_result($lectureStmt);

                $lectures = mysqli_fetch_all($lectureResult, MYSQLI_ASSOC);
                $lectureArray = array();

                foreach ($lectures as $lecture) {
                    $lectureID = $lecture['id'];
                    $timeQuery = "SELECT timeStart, timeFinish, hierarchy FROM schedules INNER JOIN lectures ON schedules.foreignID = lectures.id WHERE lectures.id = ?";

                    $lectureTimeResult = [];
                    if ($timeStmt = mysqli_prepare($conn, $timeQuery)) {
                        mysqli_stmt_bind_param($timeStmt, "s", $lectureID);
                        mysqli_stmt_execute($timeStmt);
                        $timeResult = mysqli_stmt_get_result($timeStmt);
                        $lectureTimeResult = mysqli_fetch_all($timeResult, MYSQLI_ASSOC);
                    }

                    // Fetch subtopics, resources, and quizzes in a similar way.

                    $lectureArray[] = array(
                        "id" => $lectureID,
                        "title" => $lecture['title'],
                        "time" => $lectureTimeResult[0] ?? [],
                        "hierarchy" => $lecture['hierarchy'],
                        "subtopics" => [],  // To be fetched similarly
                        "quizzes" => []     // To be fetched similarly
                    );
                }

                $finalResult[] = array(
                    "id" => $course['id'],
                    "title" => $course['title'],
                    "courseCode" => $course['courseCode'],
                    "image" => $course['image'],
                    "lectures" => $lectureArray
                );
            }
        }

        echo json_encode($finalResult, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(array("status" => "error", "message" => "Failed to prepare the course query"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid or missing course ID"));
}

?>