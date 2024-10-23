<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$id = "ef87w9r42rbw";

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
        SELECT users.id, userDetails.name, userDetails.image, users.email FROM users
        INNER JOIN userDetails ON userDetails.id = users.id
        WHERE users.role = 'teacher'
        
    ";

$coursesResult = mysqli_query($conn, $query);
$courses = mysqli_fetch_all($coursesResult, MYSQLI_ASSOC);
$all = array($courses);

foreach ($all as $x) {
    // var_dump("ideeeeeeeeeeeeeee",$x);

    echo json_encode($x);
}



