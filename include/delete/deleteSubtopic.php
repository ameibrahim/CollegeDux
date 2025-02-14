<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$id = $_POST['id'];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
        DELETE FROM `subtopics`
        WHERE id = '$id'
    ";

$deleteQuery = mysqli_query($conn, $query);

echo "success";


