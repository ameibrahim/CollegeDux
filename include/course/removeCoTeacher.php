<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$subscriptionID = $_POST['subscriptionID'];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
    DELETE FROM subscriptions
    WHERE id = '$subscriptionID';
";

$result = mysqli_query($conn, $query);

if ($result)
    echo "success";
