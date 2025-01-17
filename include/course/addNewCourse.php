<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$id = $_POST['id'];
$title = $_POST['title'];
$courseCode = $_POST['courseCode'];
$creatorID = $_POST['creatorID'];
$image = $_POST['image'];
$language = $_POST['language'];
$isLanguage = $_POST['isLanguage'];


if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// First query to insert into the courses table
$query1 = "
    INSERT INTO courses (id, title, courseCode, creatorID, image, language, isLanguage)
    VALUES ('$id', '$title', '$courseCode', '$creatorID', '$image', '$language', '$isLanguage')
";

// Execute first query
$result1 = mysqli_query($conn, $query1);

if ($result1) {
    // Second query to insert into the subscriptions table
    $query2 = "
        INSERT INTO subscriptions (id, userID, courseID, status, powerRole)
        VALUES (UUID(), '$creatorID', '$id', TRUE, 1)
    ";

    $result2 = mysqli_query($conn, $query2);

    if ($result2) {
        $result = true; // Indicate overall success
        echo "success";
    } else {
        $result = false; // Indicate failure in second query
        echo "Error in subscriptions query: " . mysqli_error($conn);
    }
} else {
    $result = false; // Indicate failure in first query
    echo "Error in courses query: " . mysqli_error($conn);
}

