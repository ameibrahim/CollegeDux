<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$courseID = $_POST['courseID'];
$userID = $_POST['userID'];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
    SELECT subscriptions.id as subscriptionID, userID, courseID, status, name, image, users.email FROM `subscriptions`
    INNER JOIN userDetails ON userDetails.id = subscriptions.userID
    INNER JOIN users ON users.id = userDetails.id
    WHERE subscriptions.courseID = '$courseID' AND subscriptions.powerRole = '1' AND userID != '$userID';
";

$coTeacherResult = mysqli_query($conn, $query);
$teachers = mysqli_fetch_all($coTeacherResult, MYSQLI_ASSOC);

echo json_encode($teachers);

