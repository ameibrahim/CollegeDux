<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$userID = $_POST['userID'];
$courseID = $_POST['courseID'];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
    INSERT INTO subscriptions (id, userID, courseID, status, powerRole)
    VALUES (UUID(), '$userID', '$courseID', true, 1)
";

$result = mysqli_query($conn, $query);

if ($result)
    echo "success";
