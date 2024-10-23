<?php

include "../databaseConnection.php";

$conn = OpenConnection();

$id = "ef87w9r42rbw";

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Function to clean Turkish special characters
function clean_string($string) {
    // Replace Turkish characters with their ASCII equivalents
    $replace = [
        'Ç' => 'C', 'Ğ' => 'G', 'İ' => 'I', 'Ö' => 'O', 'Ş' => 'S', 'Ü' => 'U',
        'ç' => 'c', 'ğ' => 'g', 'ı' => 'i', 'ö' => 'o', 'ş' => 's', 'ü' => 'u'
    ];

    // Return the cleaned string
    return strtr($string, $replace);
}

$query = "
    SELECT users.id, userDetails.name, userDetails.image, users.email 
    FROM users
    INNER JOIN userDetails ON userDetails.id = users.id
    WHERE users.role = 'teacher'
";

$coursesResult = mysqli_query($conn, $query);

// Initialize an empty array to hold users
$users = [];

if ($coursesResult) {
    // Fetch all courses data and assign to $users array
    while ($row = mysqli_fetch_assoc($coursesResult)) {
        $users[] = [
            'id' => $row['id'],
            'name' => clean_string($row['name']),  // Clean the name
            'image' => $row['image'],
            'email' => clean_string($row['email']) // Clean the email if needed
        ];
    }

    // Output the array as JSON
    header('Content-Type: application/json');
    echo json_encode($users, JSON_UNESCAPED_UNICODE);

} else {
    echo "Error executing query: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
