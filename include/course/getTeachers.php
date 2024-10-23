<?php
include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die(json_encode(["error" => "Connection failed: " . mysqli_connect_error()]));
}

$query = "
       SELECT * FROM `users`
    ";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . mysqli_error($conn)]);
    exit;
}else{
    var_dump("heeeee",$result);
}

$teachers = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($teachers);

