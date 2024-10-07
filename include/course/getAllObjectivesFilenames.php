
    <?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    $query = "
            SELECT *
            FROM `courses`
    ";

        $result = mysqli_query($conn,$query);
        $courses = mysqli_fetch_all($result,MYSQLI_ASSOC);

        $finalResult = array();

        foreach($courses as $course) {

            $courseID = $course['id'];
            
            $objectivesQuery = "
                SELECT objectives.id, objectives.courseID, courses.courseCode, courses.title, objectives.filename from objectives
                INNER JOIN courses ON courses.id = objectives.courseID
                WHERE courses.id = '$courseID'
                ";

            $objectivesResult = mysqli_query($conn,$objectivesQuery);
            $objectives = mysqli_fetch_all($objectivesResult,MYSQLI_ASSOC);

            $resultA = array(
                "id" => $course['id'],
                "title" => $course['title'],
                "courseCode" => $course['courseCode'],
                "objectives" => $objectives
            );

            $finalResult[] = $resultA;
        }
        
    echo json_encode($finalResult);

