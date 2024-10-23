<?php

include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Function to clean Turkish special characters
function clean_string($text, $is_email = false) {
    // This regex pattern includes Turkish characters (ç, ğ, ı, ö, ş, ü, Ç, Ğ, İ, Ö, Ş, Ü)
    // Remove non-alphanumeric characters except spaces, Unicode letters/numbers, and Turkish characters
    $text = preg_replace('/[^\p{L}\p{N}\sçğıöşüÇĞİÖŞÜ]/u', '', $text); 

    // If it's an email, preserve dots and the @ symbol
    if ($is_email) {
        $text = preg_replace('/[^.@\p{L}\p{N}]/u', '', $text); // Allow . and @ in emails
    }
    
    $text = strtolower($text); // Convert to lowercase
    return $text;
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

function escape_email($email) {
    // Use htmlspecialchars to escape special HTML characters
    return htmlspecialchars($email, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

if ($coursesResult) {
    // Fetch all courses data and assign to $users array
    while ($row = mysqli_fetch_assoc($coursesResult)) {
        $users[] = [
            'id' => $row['id'],
            'name' => $row['name'],  // Clean the name
            'image' => $row['image'],
            'email' => escape_email($row['email']) // Clean the email, preserving . and @
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
