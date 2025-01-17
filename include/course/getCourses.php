<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$id = $_POST['id'];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// $query = "
// SELECT *
// FROM `courses` WHERE creatorID = '$id'
// ORDER BY courses.title
// ";

$query = "
    SELECT courses.id, courseCode, language, isLanguage, title, semester, creatorID, image, userID, status, powerRole
    FROM `courses` 
    INNER JOIN subscriptions ON subscriptions.courseID = courses.id
    WHERE subscriptions.userID = '$id' AND powerRole = 1
    ";

$coursesResult = mysqli_query($conn, $query);
$courses = mysqli_fetch_all($coursesResult, MYSQLI_ASSOC);

echo json_encode($courses);

