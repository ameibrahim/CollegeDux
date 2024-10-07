<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $courseID = $_POST['courseID'];
    $objectives = $_POST['objectives'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        INSERT INTO objectives (id, courseID, objectives)
        VALUES ('$id', '$courseID', '$objectives')
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
